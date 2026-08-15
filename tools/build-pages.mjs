/* Assemble the seven pages from tools/chrome.mjs + tools/content/<page>.html.
 *
 * Each file in tools/content/ holds ONLY the inner content of <main>. This
 * script wraps it in the shared head, concept banner, nav, footer and icon
 * sprite, and writes the result to the repo root.
 *
 * WHY A BUILD STEP ON A STATIC SITE. The concept disclaimer has to be identical
 * and correct on all seven pages — Blue Leaf Ice Company is a real business, so
 * a page that quietly lost its banner would read as their official site. Seven
 * hand-maintained copies of that paragraph is a drift waiting to happen. This
 * makes it structurally impossible.
 *
 * The generated pages ARE committed: Vercel serves this repo as plain static
 * files with no build, and tools/ is in .vercelignore.
 *
 * ⚠️ Never hand-edit the generated *.html at the repo root — edit the matching
 * file in tools/content/ and re-run. Marker comments in the output say so too.
 *
 * Usage:  node tools/build-pages.mjs           # write all pages
 *         node tools/build-pages.mjs --check   # fail if any page is stale
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BANNER, FOOTER, ICONS, PAGES, head, nav } from './chrome.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const page = (p, main) => `<!doctype html>
<html lang="en-ZA">
<head>
${head(p)}
</head>
<body>
<!-- ============================================================
     GENERATED FILE — do not edit here.
     Source: tools/content/${p.file} + tools/chrome.mjs
     Rebuild: node tools/build-pages.mjs
     ============================================================ -->
<a class="skip" href="#main">Skip to content</a>

<!-- icons:start -->
${ICONS}
<!-- icons:end -->

<!-- banner:start -->
${BANNER}
<!-- banner:end -->

<!-- nav:start -->
${nav(p.file)}
<!-- nav:end -->

<main id="main">
${main.trim()}
</main>

<!-- footer:start -->
${FOOTER}
<!-- footer:end -->

<script src="site.js"></script>
</body>
</html>
`;

let stale = 0;

for (const p of PAGES) {
  const main = await readFile(join(ROOT, 'tools', 'content', p.file), 'utf8');
  const html = page(p, main);
  const dest = join(ROOT, p.file);

  if (CHECK) {
    const current = await readFile(dest, 'utf8').catch(() => '');
    if (current !== html) {
      stale++;
      console.error(`STALE ${p.file} — run node tools/build-pages.mjs`);
    }
    continue;
  }

  await writeFile(dest, html);
  console.log(`wrote ${p.file.padEnd(15)} ${String(Math.round(html.length / 1024)).padStart(3)} KB`);
}

if (CHECK) {
  console.log(stale ? `\n${stale} page(s) stale.` : '\nAll pages up to date.');
  process.exit(stale ? 1 : 0);
}
