# Content notes — Blue Leaf Ice concept

Internal. Kept in git, excluded from the deployed site by `.vercelignore`.

## The most important rule in this repo

**Blue Leaf Ice Company is a real, trading business.** It has a real site at
`blueleafice.co.za`, a real WhatsApp number and real customers. Everything in
this repo is an *unsolicited concept redesign* by Phuture Digital.

That means:

- The concept framing on every page is **load-bearing** and may not be softened.
  It uses the "concept redesign / not affiliated" register (Africrest, InsureSPR),
  **not** the "invented brand" register (Khanya, Hamba, Umsuka, THATHA). Saying
  "Blue Leaf Ice Company is an invented brand" would be a lie.
- The footer copyright is **Phuture Digital's**, never Blue Leaf's. A page
  asserting "© Blue Leaf Ice Company" would read as their official site.
- Nothing about the business may be invented. See "Where every fact came from".
- The site must never be indexed. See "Three layers of noindex".

## Where every fact came from

Every price, suburb, fee, claim and contact detail was taken from Blue Leaf's
own public material on **15 August 2026**:

| Fact | Source |
|---|---|
| Products, 2 kg R18 / 3 kg R22 | `blueleafice.webflow.io` pricing section |
| Bulk tiers (18/15/12/10 and 22/18/15/12) | same, "Blue Leaf Bulk" and "Blue Leaf Max" cards |
| Delivery zones, suburbs and fees | **extracted from a PNG** — see below |
| WhatsApp 063 515 5132 | **extracted from a PNG** — see below |
| support@blueleafice.co.za | `mailto:` link in their page source |
| "Edenvale, Johannesburg" | the quote-section graphic |
| Same-day Edenvale / 24 h elsewhere | their FAQ |
| EFT, credit card, cash on delivery | their FAQ |
| Food-grade, filtered water, hygienic facility | their FAQ |
| Six customer segments | their product cards |
| Event-planner discount | their pricing footnote |

### Facts that existed ONLY inside images

This is the finding the whole redesign is built on. Two `ChatGPT Image *.png`
files on their live site carry information that appears nowhere in their HTML:

- **`...Jun 9...png`** contains the WhatsApp number **063 515 5132** and the
  Edenvale address. On their live site the number is therefore not tappable,
  not selectable, not readable by a screen reader and not indexable.
- **`...Jun 7...png`** contains the entire delivery-zone system: Zone 0 free
  (min 5 bags) — Edenvale Central, Dunvegan, Marais Steyn Park, Dowerglen;
  Zone 1 R50 — Greenstone, Bedfordview, Modderfontein, Kempton Park West,
  Primrose; Zone 2 R100 — Sandton, Midrand, Boksburg, Benoni, Johannesburg CBD;
  Extended beyond 20 km — from R150, bulk preferred.

Both are reproduced on this concept as real HTML.

### What was deliberately NOT invented

- **No trading hours.** They publish none, so `contact.html` says so explicitly
  rather than guessing a plausible "Mon–Fri 08:00–17:00" that a customer could
  act on.
- **No street address.** Only "Edenvale, Johannesburg", which is all they give.
- **No founding date, staff count, years in business, fleet size, or volumes.**
- **No testimonials, reviews, ratings or customer names.** They publish none.
- **No certification body named.** They say "food-grade certified"; this site
  repeats exactly that and does not name a standard or an auditor.
- **No delivery-cutoff time.** "Same-day in Edenvale" is quoted as published,
  with no invented "order before 15:00".

## Photography

All from **Pexels** (free for commercial use, no attribution required). Credits
recorded here anyway. Pinned by photo id in `tools/fetch-assets.mjs`, so the
set is reproducible.

| File | Pexels ID | Photographer | Why |
|---|---|---|---|
| `hero.webp` | 579216 | Pixabay | Pale blue ice, diffuse and landscape |
| `icebin.webp` | 11173523 | Los Muertos Crew | Cubes lit blue in a dark bin |
| `facility.webp` | 5953801 | Anna Shvets | Ice production floor, hairnet and gloves |
| `gloves.webp` | 5953687 | Anna Shvets | Gloved hands over cube trays |
| `machine.webp` | 5953796 | Anna Shvets | Trays on the line, landscape |
| `purity.webp` | 5953804 | Anna Shvets | Worker in whites over clean ice |
| `braai.webp` | 4078164 | Anna Guerrero | Boerewors coil on the grid |
| `party.webp` | 27175849 | Helena Lopes | Friends at an outdoor braai table |
| `tavern.webp` | 9130342 | Egor Komarov | Warm wooden back-bar |
| `restaurant.webp` | 6276 | Karolina Grabowska | Upturned glasses along a bar |
| `catering.webp` | 12253092 | Steward Masweneng | Caterer at a chafing dish (shot in SA) |
| `fuel.webp` | 4112711 | Furkan Films | Forecourt convenience shop |
| `event.webp` | 18853331 | Jonathan Borba | Outdoor bar under festoon lights |
| `cooler.webp` | 30206423 | ROMAN ODINTSOV | Bottles in an ice bucket |
| `cubes.webp` | 12987481 | Kaboompics.com | Cubes in a glass, white ground |
| `pour.webp` | 13759884 | Philip Justin Mamelic | Ice in a glass, warm |
| `coldstore.webp` | 1267327 | ELEVATE | Cold-store corridor |
| `texture.webp` | 7099643 | Julia Volk | Blue ice slab, abstract band |

**The people shown are models, not Blue Leaf staff. The premises shown are not
Blue Leaf premises.** The footer says so on every page.

### Two picks were rejected after review at full size

Both looked fine as 400px thumbnails, which is exactly why the review step
exists:

- **8522675** (first `cooler.webp`) — portrait, cast warm yellow-green against a
  cold blue palette, and carried a legible third-party "BBQ" sauce label.
- **19218300** (first `hero.webp`) — portrait, and **1.09 MB** at w=1500 against
  44 KB for the frame that replaced it. Shattered ice is maximum-entropy
  texture, so webp has nothing to discard. On an audience the tooling itself
  notes is mostly on 360px Android, a megabyte of decoration is not free.

## The logo

`tools/logo-source.jpeg` is Blue Leaf's own logo as published — and it is a
**1240px JPEG of a rendered mockup**: an ice-carved oak leaf on a photographed
wet surface, with the wordmark baked in and a drop shadow. There is no
transparent version and no vector. Their site uses this same file as its
**favicon**, which is why the tab icon is illegible.

So the mark was **redrawn as vector paths** (`assets/mark.svg`), and the
wordmark is set as live HTML text. Same call Khanya and THATHA made with their
supplied artwork.

> **Production note:** the redraw is faithful for concept purposes but is not a
> substitute for the real thing. Blue Leaf should have their designer supply an
> SVG with the type outlined.

A first draft of the redraw read as a **Christmas tree** — pointed lobes,
evenly stepped, tapering to a spear. The corrections are documented in the SVG:
rounded lobes leaving each notch on an outward bulge, widest point ~55% down,
and a short stem rather than a point.

### Palette

Two sources, different authority:

- **Declared** in Blue Leaf's own stylesheet: `#5AC1FF` (14 uses) and `#00001F`
  (13 uses). Designer intent — these win for the accent and the darkest ink.
- **Sampled** from the logo raster by `tools/sample-colours.mjs`: `#114B95`
  (wordmark navy), `#2D71B2` (leaf mid-tone), `#C6F2FF` (highlight).

`#00001F` is used as a reference rather than literally — at hue 240 it reads
black-violet, so the ink is rotated to the logo's own 210 hue.

### Typography

Their logo sets BLUE LEAF in a high-contrast Didone. Their live site sets
everything in Instrument Sans. **Those two things disagree.** The concept
resolves it in the logo's favour for display type (**Bodoni Moda**) while
**keeping Instrument Sans for body copy** — the point is to fix a mismatch, not
to discard a reasonable decision they already made.

## Three layers of noindex

All three are deliberate and all three must stay:

1. `robots.txt` — what most crawlers check first.
2. `X-Robots-Tag: noindex, nofollow` in `vercel.json` — covers non-HTML responses.
3. `<meta name="robots">` on every page — survives if the header config is lost.

An indexed concept would compete with the real company in the exact searches
that matter most to them ("ice delivery Edenvale", "bulk ice Gauteng"), and
every price on it will eventually go stale.
