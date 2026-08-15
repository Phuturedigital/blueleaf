/* Blue Leaf Ice Company — concept redesign by Phuture Digital.
 *
 * Plain ES5-flavoured browser JS, no build step, no dependencies. Loaded at the
 * end of <body>. Everything here is progressive enhancement: with JavaScript
 * off the site is fully readable and every price, zone and phone number is
 * still on the page as text.
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. Navigation
     ====================================================================== */

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    /* Close on navigation-by-anchor, otherwise the panel stays over the target. */
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Sticky-nav shadow via a 1px sentinel rather than a scroll listener: the
     observer fires twice per page (crossing in, crossing out) where a scroll
     handler runs on every frame of every scroll. */
  var nav = document.querySelector('.nav');
  if (nav && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ==========================================================================
     2. Scroll reveal
     ====================================================================== */

  /* Reduced motion is handled entirely in CSS, which forces the targets back to
     opacity 1. Bailing out here as well would be wrong: without the observer
     the elements keep whatever the stylesheet gave them, so any future change
     to that rule would silently blank the page for those users. */
  var targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < targets.length; i++) targets[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);   /* one-shot: never re-hide on scroll up */
      });
      /* threshold 0, not a fraction. `threshold` is a proportion of the ELEMENT's
         own area, not of the viewport, so a percentage punishes tall elements —
         a 1200px band would need ~100px on screen before firing and could sit at
         opacity 0 while plainly visible. Any pixel entering triggers instead,
         and a fixed-pixel rootMargin keeps it independent of viewport height. */
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

    /* The -60px bottom margin is right for SCROLLING — it stops an element
       animating while its first pixel is at the very edge, where the motion is
       missed — but it is wrong at FIRST PAINT. An element that loads sitting
       5px into the viewport is on screen, is not going to be scrolled into by
       anything, and would otherwise sit at opacity 0 showing a blank sliver
       until the visitor happens to scroll. So: one pass at load against the
       REAL viewport, revealing anything already intersecting it.

       Caught by tools/check-motion.mjs, which measures against the unshrunk
       viewport and disagreed with the observer by exactly those 60px. */
    Array.prototype.forEach.call(targets, function (el) {
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        el.classList.add('in');
        io.unobserve(el);
      }
    });
  }

  /* ==========================================================================
     3. Delivery zone finder
     --------------------------------------------------------------------------
     Blue Leaf's zones, fees and suburb lists currently exist only as pixels
     inside a generated PNG. This rebuilds them as real markup and puts a lookup
     over the top.

     THE DATA IS READ OUT OF THE DOM, deliberately. The obvious shape would be a
     ZONES array right here and a rendered table generated from it — but the
     crawlable table is the entire point of the exercise, so it has to exist in
     the HTML regardless. Holding the same facts in two places guarantees they
     drift the first time a fee changes, which is the same class of failure that
     put this information in an image to begin with. So: the markup is the
     source of truth and this reads it.
     ====================================================================== */

  /* Fold case, strip punctuation, collapse whitespace. "Kempton Park West" and
     "kempton-park  west" have to compare equal. */
  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* Read every .zone card on the page into a comparable shape. */
  function readZones() {
    return Array.prototype.map.call(document.querySelectorAll('.zone'), function (el) {
      return {
        id: el.getAttribute('data-zone') || '',
        label: (el.querySelector('.zone-name') || {}).textContent || '',
        fee: el.getAttribute('data-fee') || '',
        free: el.hasAttribute('data-free'),
        note: el.getAttribute('data-note') || '',
        /* Sort order for tie-breaks: cheapest zone wins an ambiguous match. */
        rank: parseInt(el.getAttribute('data-rank') || '99', 10),
        /* Keep BOTH forms. Matching needs the normalised string; the answer has
           to echo the suburb back the way it is written on the page. Re-casing
           the normalised form instead turns "Johannesburg CBD" into
           "Johannesburg Cbd". */
        suburbs: Array.prototype.map.call(
          el.querySelectorAll('.zone-list li'),
          function (li) {
            var label = li.textContent.trim();
            return { norm: norm(label), label: label };
          }
        )
      };
    });
  }

  /* --------------------------------------------------------------------------
     resolveZone(query, zones) -> { zone, match, exact } | null
     --------------------------------------------------------------------------
     MATCHING POLICY — this is a business decision, not just a string problem,
     and it is worth stating plainly because the two failure directions cost
     Blue Leaf differently:

       - Too STRICT and a real customer in "Kempton Park" is told nothing is
         known about them, when the list plainly carries "Kempton Park West".
         That is a lost order.
       - Too LOOSE and someone in a suburb Blue Leaf does not actually reach is
         quoted "R100, Zone 2". That is a promise the business then has to break
         at the door, on a perishable product.

     The policy implemented here, in order:
       1. Exact match on a listed suburb.
       2. Prefix match either way, so "kempton park" finds "Kempton Park West"
          and "edenvale central" finds "Edenvale Central".
       3. Whole-word containment, so "west kempton park" still lands.
       4. Nothing else. An unrecognised suburb returns null and the UI says so
          rather than guessing a fee — see the note in the caller.

     On an ambiguous match the CHEAPEST zone wins (lowest data-rank). That is
     deliberately the direction that does not over-promise on speed: zone 0 is
     the closest and most certain, so resolving toward it is the safer error.
     -------------------------------------------------------------------------- */
  function resolveZone(query, zones) {
    var q = norm(query);
    if (q.length < 2) return null;

    var hits = [];

    zones.forEach(function (zone) {
      zone.suburbs.forEach(function (suburb) {
        var s = suburb.norm;
        var exact = s === q;
        var prefix = !exact && (s.indexOf(q) === 0 || q.indexOf(s) === 0);

        /* Whole-word containment, padded both sides so "park" cannot match
           inside "Parktown" — word boundaries without building a RegExp out of
           user input.

           GATED AT 5 CHARACTERS, and that gate is doing real work. Without it
           "park" matches "Marais Steyn Park" and a visitor anywhere in Gauteng
           is told they are in the FREE zone. A generic word fragment is not
           evidence of an address, so short queries have to earn a match by
           being a prefix of a real suburb ("kempton park" still resolves to
           Kempton Park West) rather than by appearing somewhere inside one. */
        var contained = !exact && !prefix && q.length >= 5 &&
          ((' ' + s + ' ').indexOf(' ' + q + ' ') !== -1 ||
           (' ' + q + ' ').indexOf(' ' + s + ' ') !== -1);

        if (exact || prefix || contained) {
          hits.push({
            zone: zone,
            match: suburb.label,
            exact: exact,
            score: exact ? 0 : (prefix ? 1 : 2)
          });
        }
      });
    });

    if (!hits.length) return null;

    hits.sort(function (a, b) {
      return (a.score - b.score) || (a.zone.rank - b.zone.rank);
    });
    return hits[0];
  }

  var finder = document.querySelector('[data-finder]');
  if (finder) {
    var input = finder.querySelector('input');
    var out = finder.querySelector('[data-finder-out]');
    var zones = readZones();

    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var hit = resolveZone(input.value, zones);
      out.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'finder-card';

      var badge = document.createElement('span');
      badge.className = 'badge';

      var body = document.createElement('div');
      var t = document.createElement('p');
      t.className = 't';
      var d = document.createElement('p');
      d.className = 'd';

      if (!hit) {
        /* No guessing. An unlisted suburb gets an honest "we will confirm"
           rather than a fabricated fee — quoting a delivery price the business
           cannot honour is worse than asking one extra question. */
        card.className += ' is-unknown';
        badge.textContent = '?';
        t.textContent = 'Not on the published list';
        d.textContent = input.value.trim()
          ? 'We could not match “' + input.value.trim() + '” to a published zone. Areas beyond 20 km of Edenvale are quoted individually from R150, and bulk orders are preferred. Send the address and we will confirm the fee before you commit.'
          : 'Type a suburb to check the delivery fee.';
      } else {
        var z = hit.zone;
        if (z.free) card.className += ' is-free';
        badge.textContent = z.id;
        t.textContent = hit.match + ' — ' + (z.free ? 'free delivery' : z.fee + ' delivery');
        d.textContent = z.note;
      }

      body.appendChild(t);
      body.appendChild(d);
      card.appendChild(badge);
      card.appendChild(body);
      out.appendChild(card);

      /* Announce to assistive tech. The container carries aria-live="polite",
         so replacing its contents is enough. */
    });
  }

  /* ==========================================================================
     4. Inert forms
     --------------------------------------------------------------------------
     Nothing on this site sends anywhere. Saying so out loud is not optional:
     a form that silently swallows a submission is a dark pattern anywhere, and
     on a concept built over a REAL company's brand it could cost Blue Leaf an
     order that the visitor believes they placed.
     ====================================================================== */

  Array.prototype.forEach.call(document.querySelectorAll('[data-inert-form]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var existing = form.querySelector('.form-sent');
      if (existing) existing.remove();

      var msg = document.createElement('div');
      msg.className = 'form-sent';
      msg.setAttribute('role', 'status');
      msg.innerHTML =
        '<strong>Nothing was sent — this is a concept site.</strong>' +
        'This form is not connected to Blue Leaf Ice Company and no one received this. ' +
        'To place a real order, WhatsApp <a href="https://wa.me/27635155132">063 515 5132</a> ' +
        'or email <a href="mailto:support@blueleafice.co.za">support@blueleafice.co.za</a>.';

      form.appendChild(msg);
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* ==========================================================================
     5. Bulk price calculator
     --------------------------------------------------------------------------
     Reads its tiers out of the rendered <table>, for the same single-source
     reason as the zone finder above.
     ====================================================================== */

  var calc = document.querySelector('[data-calc]');
  if (calc) {
    var qty = calc.querySelector('[data-calc-qty]');
    var size = calc.querySelector('[data-calc-size]');
    var result = calc.querySelector('[data-calc-out]');

    /* tiers: { '2kg': [{min, max, price}, ...], '3kg': [...] } */
    var tiers = {};
    Array.prototype.forEach.call(document.querySelectorAll('[data-tiers]'), function (table) {
      var key = table.getAttribute('data-tiers');
      tiers[key] = Array.prototype.map.call(table.querySelectorAll('tbody tr'), function (tr) {
        return {
          min: parseInt(tr.getAttribute('data-min'), 10),
          max: parseInt(tr.getAttribute('data-max') || '999999', 10),
          price: parseFloat(tr.getAttribute('data-price'))
        };
      });
    });

    function rateFor(key, n) {
      var rows = tiers[key] || [];
      for (var i = 0; i < rows.length; i++) {
        if (n >= rows[i].min && n <= rows[i].max) return rows[i];
      }
      return rows[0] || null;
    }

    function render() {
      var n = Math.max(1, Math.min(5000, parseInt(qty.value, 10) || 0));
      /* Whitelist rather than trust the control's value. Only self-XSS is
         reachable on a static page with no session, but building output out of
         whatever a form control reports is a habit worth not having. */
      var key = Object.prototype.hasOwnProperty.call(tiers, size.value) ? size.value : '2kg';
      var row = rateFor(key, n);
      if (!row) return;

      var top = (tiers[key][0] || {}).price || row.price;
      var total = n * row.price;
      var saved = n * (top - row.price);

      var head = document.createElement('p');
      head.className = 't';
      head.textContent = n + ' × ' + key + ' bags — ';
      var strong = document.createElement('strong');
      strong.textContent = 'R' + total.toFixed(2);
      head.appendChild(strong);

      var detail = document.createElement('p');
      detail.className = 'd';
      detail.textContent =
        'R' + row.price.toFixed(2) + ' per bag at the ' +
        row.min + (row.max > 9000 ? '+' : '–' + row.max) + ' bag tier.' +
        (saved > 0 ? ' You save R' + saved.toFixed(2) + ' against the single-bag rate.' : '') +
        ' Delivery is charged separately by zone.';

      result.textContent = '';
      result.appendChild(head);
      result.appendChild(detail);
    }

    if (qty && size && result) {
      qty.addEventListener('input', render);
      size.addEventListener('change', render);
      render();
    }
  }
})();
