/* Shared chrome for the Blue Leaf concept — the single definition of the parts
 * that must be identical on all seven pages.
 *
 * Imported by tools/build-pages.mjs (which writes the inner pages) and by
 * tools/stamp-chrome.mjs (which re-templates them in place afterwards). Keeping
 * banner/nav/footer here rather than in seven copies is what stops the concept
 * disclaimer from drifting between pages — and the disclaimer is the one thing
 * on this site that must never drift, because Blue Leaf Ice Company is a real
 * business and this is not their site.
 */

export const SITE = {
  brand: 'Blue Leaf Ice Company',
  tagline: 'Pure. Clean. Reliable.',
  phone: '063 515 5132',
  phoneE164: '+27635155132',
  whatsapp: 'https://wa.me/27635155132',
  email: 'support@blueleafice.co.za',
  town: 'Edenvale, Johannesburg',
};

/* Every page: filename -> nav label + <title> + meta description. */
export const PAGES = [
  { file: 'index.html',    nav: 'Home',      title: 'Blue Leaf Ice Company — concept redesign by Phuture Digital',
    desc: 'A website design concept for Blue Leaf Ice Company, an ice supplier in Edenvale, Gauteng. Independent concept by Phuture Digital — not the company’s official site.' },
  { file: 'products.html', nav: 'Ice & prices', title: 'Ice and prices — Blue Leaf Ice concept by Phuture Digital',
    desc: '2 kg and 3 kg food-grade ice bags with bulk tiers from R10 a bag. Concept redesign by Phuture Digital, not Blue Leaf Ice Company’s official site.' },
  { file: 'delivery.html', nav: 'Delivery',   title: 'Delivery areas and fees — Blue Leaf Ice concept by Phuture Digital',
    desc: 'Free delivery in Edenvale, R50 to Zone 1 and R100 to Zone 2 across Gauteng. Concept redesign by Phuture Digital, not the company’s official site.' },
  { file: 'business.html', nav: 'For business', title: 'Taverns, restaurants and events — Blue Leaf Ice concept by Phuture Digital',
    desc: 'Standing ice orders for taverns, restaurants, fuel stations, caterers and event planners in Gauteng. Concept redesign by Phuture Digital.' },
  { file: 'order.html',    nav: 'Order',      title: 'Request a quote — Blue Leaf Ice concept by Phuture Digital',
    desc: 'Request an ice quote by bag size, quantity and delivery suburb. Concept redesign by Phuture Digital — this form does not send anywhere.' },
  { file: 'about.html',    nav: 'About',      title: 'About and FAQ — Blue Leaf Ice concept by Phuture Digital',
    desc: 'How Blue Leaf makes food-grade ice in Edenvale, and answers to common delivery questions. Concept redesign by Phuture Digital.' },
  { file: 'contact.html',  nav: 'Contact',    title: 'Contact — Blue Leaf Ice concept by Phuture Digital',
    desc: 'WhatsApp 063 515 5132 or email support@blueleafice.co.za. Concept redesign by Phuture Digital, not the company’s official site.' },
];

/* ---------------------------------------------------------------------------
   The concept banner.

   Blue Leaf Ice Company is a REAL business with a real live site. Every clause
   here is load-bearing and none may be softened:
     - "Concept redesign" (not "concept demo") — the invented-brand wording used
       by Khanya, Hamba, Umsuka and THATHA would be a lie here.
     - names Phuture Digital as the author, so it cannot read as Blue Leaf's own
     - "not affiliated with, endorsed by, or operated by" — the exact framing
       the Africrest concept had to be corrected to.
     - links their REAL site, so anyone who wanted the actual business leaves.
   ------------------------------------------------------------------------ */
export const BANNER = `<div class="concept-banner">
  <div class="inner">
    <span class="dot" aria-hidden="true"></span>
    <p><strong>Concept redesign — not Blue Leaf Ice Company&rsquo;s website.</strong>
    <a href="https://www.phuturedigital.co.za" rel="noopener">Phuture Digital</a> built this independently to show how their own products, prices and delivery areas could be presented. It is not affiliated with, endorsed by, or operated by the company. No order placed here reaches anyone &mdash; the real business is at
    <a href="https://www.blueleafice.co.za" rel="noopener nofollow">blueleafice.co.za</a>.</p>
  </div>
</div>`;

export const nav = (current) => `<header class="nav">
  <div class="nav-inner">
    <a class="brand" href="index.html">
      <img class="brand-mark" src="assets/mark.svg" alt="" width="30" height="41">
      <span class="brand-type">
        <span class="brand-name">Blue Leaf</span>
        <span class="brand-sub">Ice Company</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <nav class="nav-links" id="nav-links" aria-label="Main">
      ${PAGES.map((p) => `<a href="${p.file}"${p.file === current ? ' aria-current="page"' : ''}>${p.nav}</a>`).join('\n      ')}
      <a class="nav-call" href="tel:${SITE.phoneE164}">
        <svg aria-hidden="true"><use href="#i-phone"></use></svg>${SITE.phone}
      </a>
    </nav>
  </div>
</header>`;

export const FOOTER = `<footer class="foot">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand">
        <span class="brand-name">Blue Leaf</span>
        <span class="brand-sub">Ice Company</span>
        <p>Food-grade ice for homes, braais, events, taverns, restaurants, fuel stations and caterers across Gauteng. Based in Edenvale.</p>
      </div>
      <div>
        <h4>Pages</h4>
        <ul>
          ${PAGES.filter((p) => p.file !== 'index.html').map((p) => `<li><a href="${p.file}">${p.nav}</a></li>`).join('\n          ')}
        </ul>
      </div>
      <div>
        <h4>Get in touch</h4>
        <ul>
          <li><a href="tel:${SITE.phoneE164}">${SITE.phone}</a></li>
          <li><a href="${SITE.whatsapp}" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${SITE.town}</li>
        </ul>
      </div>
    </div>

    <div class="concept-note">
      <strong>This is a concept redesign, not a live client site.</strong>
      Blue Leaf Ice Company is a real business and this is not their website. Phuture Digital built it independently, without commission, to show how the company&rsquo;s own published products, prices and delivery areas could be presented. It is not affiliated with, endorsed by, or operated by Blue Leaf Ice Company. Prices, zones and contact details were taken from their public site in August 2026 and may be out of date &mdash; treat nothing here as an offer. No form on this site sends anywhere and no order placed here reaches anyone. Photography is licensed stock; the people shown are not Blue Leaf staff and the premises shown are not Blue Leaf premises.
    </div>

    <div class="foot-bottom">
      <span>&copy; 2026 Phuture Digital. Company name, prices and contact details belong to Blue Leaf Ice Company.</span>
      <span><a href="https://www.phuturedigital.co.za" rel="noopener">phuturedigital.co.za</a></span>
    </div>
  </div>
</footer>`;

/* Inline icon sprite. One <symbol> per glyph, injected into every page between
   the icons markers so a <use href="#i-x"> reference resolves without a network
   request and without shipping an icon font. */
export const ICONS = `<svg class="vh" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 20.5l1.5-4.6A8.4 8.4 0 0 1 3.6 11 8.4 8.4 0 0 1 12 2.6h.5A8.4 8.4 0 0 1 21 11Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-truck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17V5a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2"/><path d="M14 8h4l3 3v5a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="17.5" r="2.2"/><circle cx="17" cy="17.5" r="2.2"/></symbol>
  <symbol id="i-snow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.2 6.5l15.6 9M19.8 6.5l-15.6 9M12 6l3-2.5M12 6 9 3.5M12 18l3 2.5M12 18l-3 2.5M4.9 9.6 1.5 8.9M7.2 14.2l-3.3 1.4M19.1 9.6l3.4-.7M16.8 14.2l3.3 1.4"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5.5L12 2 4 5.5V12c0 6.4 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.4"/></symbol>
  <symbol id="i-card" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
</svg>`;

/* The <head>. Fonts: Bodoni Moda answers the high-contrast Didone in the
   supplied logo; Instrument Sans is what Blue Leaf's own live site already
   uses, kept deliberately so body copy reads as continuous with their brand. */
export const head = (page) => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${page.desc}">
<meta name="robots" content="noindex, nofollow">
<meta name="author" content="Phuture Digital">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Blue Leaf Ice Company (concept redesign)">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${page.desc}">
<meta property="og:image" content="assets/hero.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#071A2E">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&family=Instrument+Sans:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="styles.css">
<!-- Stamp \`.js\` BEFORE first paint. A deferred script cannot do this without a
     flash of content: the stylesheet blocks rendering and the script does not. -->
<script>document.documentElement.className += ' js';</script>`;
