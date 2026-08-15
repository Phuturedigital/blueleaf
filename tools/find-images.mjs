/* Blue Leaf Ice concept — stock image sourcing.
 *
 * Queries Pexels for each image slot the design needs and writes small preview
 * JPEGs to tools/previews/ so every candidate can be looked at before anything
 * is committed. Nothing here runs at build or deploy time; the site is static
 * and ships only the converted webp files under assets/.
 *
 * WHY REAL PHOTOGRAPHY MATTERS ON THIS PARTICULAR SITE
 * The live blueleafice.co.za illustrates itself with ChatGPT renders. On an ice
 * business that is actively self-defeating: the entire product claim is "clean,
 * food-grade, real" and a synthetic image of ice quietly undercuts it. Every
 * frame chosen here has to look like something that actually happened — a real
 * braai, a real bar, a real bag of ice — because the photography is carrying
 * the hygiene argument as much as the copy is.
 *
 * Pexels licence: free for commercial use, no attribution required. Credits are
 * recorded in CONTENT-NOTES.md anyway — this is a client-facing concept, and
 * "where did this image come from" always gets asked.
 *
 * Usage:  node tools/find-images.mjs <slot>       # search + download previews
 *         node tools/find-images.mjs --all        # every slot
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREVIEW_DIR = join(ROOT, 'tools', 'previews');

/* Pexels' web client key. Public — it ships in their own front-end bundle. */
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  Accept: 'application/json',
  'Secret-Key': 'H2jk9uKnhRmL6WPwh89zBezWvr',
};

/* Blue Leaf sells to six named segments: braais and parties, events and
   functions, taverns and pubs, restaurants, fuel stations and convenience, and
   catering. The slots below cover all six plus the product itself, because the
   pricing page needs to show what a 2kg bag actually looks like and the live
   site never does.

   Queries lean South African where the search engine will honour it ("braai"
   is the strongest signal available; "bakkie" is not indexed, so delivery
   frames are found by vehicle type instead). */
const SLOTS = {
  /* --- the product itself ------------------------------------------------ */
  hero:        'ice cubes macro close up clear cold',
  'hero-b':    'crushed ice texture background cold blue',
  'hero-c':    'ice cubes falling water splash',
  bag:         'bag of ice cubes packaged',
  cubes:       'clear ice cubes glass drink',
  block:       'block of ice large frozen',

  /* --- the six customer segments ----------------------------------------- */
  braai:       'braai barbecue grill outdoors friends south africa',
  'braai-b':   'barbecue outdoor party friends drinks summer',
  tavern:      'bar counter drinks pub interior night',
  'tavern-b':  'bartender pouring drink over ice bar',
  restaurant:  'restaurant bar service drinks glasses',
  event:       'outdoor event party guests drinks celebration',
  'event-b':   'wedding reception outdoor tables guests',
  catering:    'catering buffet event food service staff',
  fuel:        'petrol station convenience store forecourt',
  cooler:      'cooler box ice drinks outdoor',

  /* --- operations, hygiene, delivery -------------------------------------- */
  delivery:    'delivery van driver parcel loading',
  'delivery-b':'truck driver delivery loading bay',
  water:       'clean water pouring glass filtered',
  hygiene:     'food safety gloves clean production facility',
  cold:        'cold storage freezer warehouse industrial',
  pour:        'pouring drink over ice glass close up',
};

async function search(query, perPage = 6) {
  const url =
    `https://www.pexels.com/en-us/api/v3/search/photos` +
    `?query=${encodeURIComponent(query)}&per_page=${perPage}&page=1&orientation=all`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  const { data = [] } = await res.json();
  return data.map((d) => ({
    id: d.id,
    photographer: d.attributes?.user?.first_name
      ? `${d.attributes.user.first_name} ${d.attributes.user.last_name ?? ''}`.trim()
      : 'unknown',
    alt: (d.attributes?.image?.alt ?? '').replace(/\s+/g, ' ').trim(),
    width: d.attributes?.width,
    height: d.attributes?.height,
    /* Strip Pexels' download-disposition params and re-size on their CDN. */
    base: String(d.attributes?.image?.download_link ?? '').split('?')[0],
  })).filter((c) => c.base);
}

const sized = (base, w) => `${base}?auto=compress&cs=tinysrgb&w=${w}`;

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': HEADERS['User-Agent'] } });
  if (!res.ok) throw new Error(`download ${res.status} ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const wanted = process.argv[2] === '--all' ? Object.keys(SLOTS) : [process.argv[2]];
await mkdir(PREVIEW_DIR, { recursive: true });

for (const slot of wanted) {
  const query = SLOTS[slot];
  if (!query) { console.error(`unknown slot: ${slot}`); continue; }
  try {
    const results = await search(query);
    console.log(`\n=== ${slot} :: "${query}" ===`);
    for (const [i, c] of results.entries()) {
      const file = join(PREVIEW_DIR, `${slot}-${i}-${c.id}.jpg`);
      await download(sized(c.base, 400), file);
      console.log(`[${i}] id=${c.id} ${c.width}x${c.height} by ${c.photographer} :: ${c.alt}`);
    }
  } catch (err) {
    console.error(`FAIL ${slot}: ${err.message}`);
  }
}
