/* Blue Leaf Ice concept — fetch the CHOSEN stock images into assets/.
 *
 * Candidates were reviewed by eye from tools/sheets/ and the winners are pinned
 * by Pexels photo id below. Re-running this script is deterministic: it always
 * fetches these exact photos at these exact widths.
 *
 * Pexels' CDN does the resize AND the webp encode for us (`fm=webp`), so there
 * is no local image toolchain to install and no sharp/ImageMagick dependency.
 * Widths are ~1.5x the largest CSS display size — crisp on a 2x screen without
 * shipping a 6000px original.
 *
 * Usage:  node tools/fetch-assets.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';

/* id     = Pexels photo id (pinned)
   out    = path under assets/
   w      = delivered width in px
   credit = photographer, recorded in CONTENT-NOTES.md
   note   = why this frame was chosen */
const ASSETS = [
  /* --- hero ---------------------------------------------------------------
     REPLACED a shattered-ice frame (19218300) that looked best of all at
     thumbnail size and was the worst possible choice at full size: portrait,
     and 1.09 MB at w=1500 against 44 KB here — 25x — because shattered ice is
     maximum-entropy texture and webp has nothing to throw away. shoot.mjs notes
     that 360px Android is this audience's most common screen; a megabyte of
     decoration is not a rounding error on a metered connection.

     What replaces it is softer, paler and landscape, with a diffuse left half
     the headline can sit on without a scrim fighting the image. */
  { id: 579216,   out: 'assets/hero.webp',      w: 1600, credit: 'Pixabay',
    note: 'Home hero. Pale blue ice, diffuse and landscape — type sits on the left third unaided.' },
  { id: 11173523, out: 'assets/icebin.webp',    w: 1400, credit: 'Los Muertos Crew',
    note: 'Cubes lit blue in a dark bin. The one genuinely dramatic frame — carries the dark band.' },

  /* --- the food-grade story ----------------------------------------------
     The single most important group on the site. Blue Leaf's central claim is
     "clean, food-grade ice made with filtered water in a hygienic facility" and
     the live site illustrates that claim with nothing at all. These are real
     photographs of a real ice production facility — hairnets, blue nitrile
     gloves, white cold room — which is the difference between asserting
     hygiene and showing it. */
  { id: 5953801, out: 'assets/facility.webp',   w: 1600, credit: 'Anna Shvets',
    note: 'Production floor. Worker in hairnet and gloves working a bed of ice in a cold room.' },
  { id: 5953687, out: 'assets/gloves.webp',     w: 1200, credit: 'Anna Shvets',
    note: 'Close-up: blue-gloved hands over trays of cubes. The hygiene claim in one frame.' },
  /* 5953796, not the 5953790 first picked from the same shoot: identical
     subject, but landscape rather than portrait. Cropping a portrait frame into
     a wide band throws away the half of it that shows the room. */
  { id: 5953796, out: 'assets/machine.webp',    w: 1400, credit: 'Anna Shvets',
    note: 'Gloved hands working the trays, landscape. Process rather than product.' },
  { id: 5953804, out: 'assets/purity.webp',     w: 1400, credit: 'Anna Shvets',
    note: 'Worker in whites over a clean bed of ice. The "filtered water, hygienic facility" claim, evidenced.' },

  /* --- the six customer segments -----------------------------------------
     Blue Leaf names exactly six: braais and parties, events and functions,
     taverns and pubs, restaurants, fuel stations and convenience, catering.
     One frame each, so the segment grid is photographic rather than iconographic. */
  { id: 4078164,  out: 'assets/braai.webp',     w: 1200, credit: 'Anna Guerrero',
    note: 'Boerewors coil on the grid. The single most unmistakably South African frame in the set.' },
  { id: 27175849, out: 'assets/party.webp',     w: 1400, credit: 'Helena Lopes',
    note: 'Friends toasting at an outdoor table, braai fireplace behind. The domestic customer, and a diverse group.' },
  { id: 9130342,  out: 'assets/tavern.webp',    w: 1200, credit: 'Egor Komarov',
    note: 'Warm wooden back-bar. Taverns and pubs — no readable third-party branding.' },
  { id: 6276,     out: 'assets/restaurant.webp',w: 1200, credit: 'Karolina Grabowska',
    note: 'Row of upturned glasses along a bar. Restaurant service, no faces, no logos.' },
  { id: 12253092, out: 'assets/catering.webp',  w: 1200, credit: 'Steward Masweneng',
    note: 'Caterer in hairnet serving from a chafing dish. Shot in South Africa, by an SA photographer.' },
  { id: 4112711,  out: 'assets/fuel.webp',      w: 1200, credit: 'Furkan Films',
    note: 'Forecourt convenience shop at dusk. Fuel stations are one of Blue Leaf’s named segments and the hardest to illustrate.' },

  /* --- events ------------------------------------------------------------- */
  { id: 18853331, out: 'assets/event.webp',     w: 1600, credit: 'Jonathan Borba',
    note: 'Outdoor bar under festoon lights. Event planners get a discounted rate, so they get a real frame.' },
  /* Replaced 8522675 on review at full size — it was portrait, cast warm
     yellow-green against a cold blue palette, and carried a legible
     third-party "BBQ" sauce label. This one is landscape, neutral and
     unbranded. */
  { id: 30206423, out: 'assets/cooler.webp',    w: 1400, credit: 'ROMAN ODINTSOV',
    note: 'Bottles standing in an ice bucket. The most literal answer to "what am I buying this for".' },

  /* --- product / texture --------------------------------------------------- */
  { id: 12987481, out: 'assets/cubes.webp',     w: 1200, credit: 'Kaboompics.com',
    note: 'Cubes in a glass on white. Landscape, clean, reads as product rather than as a cocktail.' },
  { id: 13759884, out: 'assets/pour.webp',      w: 1000, credit: 'Philip Justin Mamelic',
    note: 'Ice in a glass, close and warm. Softens an otherwise very cold palette.' },
  { id: 1267327,  out: 'assets/coldstore.webp', w: 1400, credit: 'ELEVATE',
    note: 'Cold-store corridor. Carries the cold-chain argument on the delivery page.' },
  { id: 7099643,  out: 'assets/texture.webp',   w: 1600, credit: 'Julia Volk',
    note: 'Blue ice slab texture. Abstract band behind the closing CTA — no subject to misread.' },
];

/* Resolve a photo id to its CDN base path. For MOST photos the canonical file
   URL embeds the id twice and can simply be constructed — but not for all of
   them, and the exceptions are not rare enough to ignore:

     6276      -> /photos/6276/restaurant-glass-wine-glasses.jpg   (human slug)
     12540659  -> /photos/12540659/pexels-photo-12540659.png       (png, not jpeg)

   Older uploads kept a descriptive filename and some originals are PNG, so the
   guess 404s. Rather than hand-pinning those URLs — which rots the moment a
   pick changes — the guess is treated as a fast path and a miss falls back to
   asking the API for the real download_link. Determinism is preserved because
   the pinned input is still the photo id. */
const RESIZE = (w) => `?auto=compress&cs=tinysrgb&fm=webp&w=${w}`;
const guess = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

const API_HEADERS = {
  'User-Agent': UA,
  Accept: 'application/json',
  /* Pexels' web client key. Public — it ships in their own front-end bundle. */
  'Secret-Key': 'H2jk9uKnhRmL6WPwh89zBezWvr',
};

async function resolveBase(id) {
  const res = await fetch(`https://www.pexels.com/en-us/api/v3/photos/${id}`, { headers: API_HEADERS });
  if (!res.ok) throw new Error(`lookup HTTP ${res.status}`);
  const body = await res.json();
  const base = String((body.data ?? body).attributes?.image?.download_link ?? '').split('?')[0];
  if (!base) throw new Error('lookup returned no download_link');
  return base;
}

async function fetchPhoto(id, w) {
  let res = await fetch(guess(id) + RESIZE(w), { headers: { 'User-Agent': UA } });
  if (res.ok) return res;
  const base = await resolveBase(id);
  res = await fetch(base + RESIZE(w), { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} (after slug lookup)`);
  console.log(`     ↳ ${id} needed a slug lookup: ${base.split('/').pop()}`);
  return res;
}

await mkdir(join(ROOT, 'assets'), { recursive: true });

let failures = 0;
let total = 0;
for (const a of ASSETS) {
  try {
    const res = await fetchPhoto(a.id, a.w);
    const buf = Buffer.from(await res.arrayBuffer());

    /* Verify we actually got WebP and not a JPEG fallback: RIFF....WEBP. A
       silent fallback would still render, so this has to be checked rather
       than assumed. */
    const isWebp =
      buf.length > 12 &&
      buf.toString('ascii', 0, 4) === 'RIFF' &&
      buf.toString('ascii', 8, 12) === 'WEBP';
    if (!isWebp) throw new Error('not a webp — CDN ignored fm=webp');

    await writeFile(join(ROOT, a.out), buf);
    const kb = Math.round(buf.length / 1024);
    total += kb;
    /* Loud rather than fatal. A heavy asset is a judgement call — a full-bleed
       hero legitimately costs more than a card thumbnail — but it should never
       pass unnoticed, which is how a 1.9 MB hero got shipped once already. */
    const warn = kb > 400 ? '  ⚠ HEAVY — reduce w or repick' : '';
    console.log(`ok   ${a.out.padEnd(26)} ${String(kb).padStart(4)} KB  © ${a.credit}${warn}`);
  } catch (err) {
    failures++;
    console.error(`FAIL ${a.out.padEnd(26)} ${err.message}`);
  }
}
console.log(`\nTotal ${total} KB across ${ASSETS.length} assets.`);
console.log(failures ? `${failures} asset(s) failed.` : 'All assets fetched.');
process.exit(failures ? 1 : 0);
