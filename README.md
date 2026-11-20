# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

**VNTA Personal Intelligence. Life, handled.** A personal assistant for everyday
paperwork: it reads documents you give it, finds what needs doing, shows where
each thing came from, and helps you deal with it. You approve every step. It does
not pay, send or submit anything.

It is in private development. **[docs/STATUS.md](docs/STATUS.md) says exactly what
works today.** The robotics project this repository used to describe is archived:
see [docs/ARCHIVE.md](docs/ARCHIVE.md).

## Principles

- **Evidence.** Every suggestion quotes the words it came from.
- **Uncertainty is shown.** An ambiguous date stays ambiguous. A guess is never a fact.
- **A suggestion is not an action, and a draft is not a sent message.**
- **The person approves.** No payments, bank actions, submissions or outgoing email in v1.
- **Nothing is claimed that is not true today.** No invented testimonials, numbers,
  certifications or accuracy claims.
- **Small and boring.** No new dependency or rewrite without a reason.

## Layout

```
src/lib/extract/     The extractor, its tests, and the made-up sample letter
src/lib/content/     site.ts holds the public words; studio.ts the studio's
src/lib/components/  home/ (hero preview, demo, beta form), Seo, ui/
src/lib/styles/      system.css (the site, under .shell), studio.css, tokens.css
src/routes/          / (home), /contact, legal pages, /studio, /portal
functions/           Cloudflare Pages Functions: contact form, client portal data
docs/                STATUS.md, ARCHIVE.md
```

Two other things live here and are not part of VNTA Personal: **VNTA Studio**
(`/studio`, a design studio for Irish businesses) and the **client portal**
(`/portal`, gated by Cloudflare Access). Leave them alone unless asked.

## Change the words

Everything the home page says is in `src/lib/content/site.ts`. Pages, search data,
the sitemap and `/llms.txt` all read from it.

## Look

Off-white surfaces, graphite text, one muted violet (`--blue` in `system.css`).
Inter, hairline borders, generous space. No gradients for mood, no glow, no robot
graphics. Every rule in `system.css` sits under `.shell`, so the studio and the
portal keep their own looks.

## Getting started

Node 22 or newer.

```sh
npm install --ignore-engines
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build into `build/` |
| `npm run check` | Svelte type-check |
| `npm test` | Extractor and social-profile tests |
| `npm run test:extract` | Extractor tests only |

The beta form posts to `/api/inquiry`, which only exists on Cloudflare. In local
dev it shows its error message; that is expected.

## Deploying

Every push to `main` deploys to Cloudflare Pages (`.github/workflows/deploy.yml`).
**Do not merge to `main` without approval.**

---

## The studio (`/studio`)

- **The sit-down** has one price, one length and one thing you leave with:
  `sitDown` in `content/studio.ts`. Change it there and every mention follows.
- **A piece of work:** an entry in `work`, four screenshots in `static/work/`
  (`<name>.jpg` 1440 by 900, `<name>-720.jpg`, `<name>-phone.jpg` 780 by 1688,
  `<name>-phone-390.jpg`), and its `world` (the client's own ground, text and
  one accent). When any screenshot is retaken, change `shotsVersion` so
  visitors get it at once. Only say "Brand and website" (`did`) where the
  brand is ours.
- **The turning card** at the top (`studio/Flip.svelte`) shows one site, holds
  five seconds and turns to the next; the symbol beside it is its clock.
- **The wall of logos** (`studio/Logos.svelte`, the `wall` list) turns one
  tile at a time. Client logos go in `static/logos/`; tool marks in
  `studio/ui/toolMarks.ts`. Only tools we really use.
- Both stop on hover, off screen and on pause, and never turn by themselves
  for anyone who asks for less motion.
- **Copy:** plain words for someone on a phone between jobs. No claim that is
  not true today.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
