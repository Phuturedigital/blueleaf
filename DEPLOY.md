# Deploy — Blue Leaf Ice concept

## Where it lives

| | |
|---|---|
| GitHub | `Phuturedigital/blueleaf`, branch **`main`** |
| Vercel project | `blueleaf` (`prj_sEKGUyfHfC427SsfgLI6Stz8dhej`) |
| Vercel scope | `tlotlisos-projects-5b82e36b`, account `hello-4505` |
| Public URL | **https://blueleaf-concept.phuturedigital.co.za** |
| Framework preset | Other. No build step, no install step. Root `.`, output `.` |

Pushes to `main` auto-deploy — the GitHub integration is connected.

## ⚠️ One manual step: the DNS record

`phuturedigital.co.za` runs on **third-party nameservers** (`ns*.tld-ns.*`), so
Vercel cannot create the record itself. It must be added by hand at the
registrar:

```
Type:   CNAME
Name:   blueleaf-concept
Value:  ea341519341ef3cb.vercel-dns-016.com.
```

Prefer the CNAME over the `A 76.76.21.21` alternative — every sibling concept
uses one (`khanya-concept` → `3c17e37ad118f96d.vercel-dns-016.com.`,
`insurespr-concept` → `01022da46be64b87…`, `thatha-concept` → `6de00cb6a8a5dc8a…`).

The domain is already **attached and ownership-verified** on the Vercel project.
Only the DNS record is outstanding. Check it with:

```bash
nslookup blueleaf-concept.phuturedigital.co.za 8.8.8.8
vercel domains verify blueleaf-concept.phuturedigital.co.za --scope tlotlisos-projects-5b82e36b
```

## ⛔ Never share the `*.vercel.app` URL

Deployment Protection is on, so `blueleaf-<hash>-tlotlisos-projects-…vercel.app`
returns a **302 to a Vercel login wall** for anyone who is not signed in to the
account. Sharing it looks like a broken site. Only the custom domain is public.

## Deploying by hand

```bash
vercel deploy --prod --yes          # from the repo root
vercel ls blueleaf                  # confirm Ready + Production
```

## Before every deploy

```bash
node tools/build-pages.mjs --check  # pages must not be stale
node tools/shoot.mjs                # 7 viewports x 7 pages, must be clean
node tools/check-motion.mjs         # must exit 0
```

## The concept network

This site is the **seventh** in the cross-linked concept network. The generator
lives in the *insurespr* repo, not this one:

```bash
cd C:/Users/Acer/insurespr
node tools/stamp-network.mjs            # dry run — always do this first
node tools/stamp-network.mjs --write    # stamps all SEVEN repos
```

`blueleaf` has a row in both `CONCEPTS` and `SITES` in that file. Its
`pd-network` CSS palette was **hand-mapped** and appended to the end of this
repo's `styles.css` — the generator only auto-appends CSS for insurespr, and it
will print `⚠️ NO CSS BLOCK and no palette defined` for any site that lacks one.

Two things to know:

- **`tools/build-pages.mjs` preserves the stamped block.** Two generators write
  these files; the build lifts any existing `pd-network` fence out of its own
  previous output and puts it back. Either script can be re-run in either order.
- **Other sessions push to khanya / hamba / umsuka.** `git fetch` and rebase in
  each repo, re-run the stamp, then commit. Never force-push. The stamp is
  idempotent, which is what makes re-applying onto rebased upstream code safe.

Re-generating this site's own card thumbnail for the other six repos:

```bash
node tools/shoot-thumb.mjs "https://blueleaf-concept.phuturedigital.co.za/" pd-concepts/blueleaf.webp
# then copy pd-concepts/blueleaf.webp into the other six repos' pd-concepts/
```

(It accepts a `file://` URL too, which is how the first one was captured while
DNS was still pending.)

## Still to do

- [ ] Add the CNAME at the registrar, then confirm the domain serves 200.
- [ ] Re-capture `pd-concepts/blueleaf.webp` from the live URL once DNS resolves,
      and redistribute it to the other six repos. The current one was captured
      from a local file — visually identical, but capturing from production is
      the convention.
- [ ] Optional: add the concept to `www.phuturedigital.co.za/portfolio`
      (`client_name` must stay EMPTY — Blue Leaf never commissioned this).
