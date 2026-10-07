# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

The site has one job: get an Irish business owner to ask for a price. It is one
long page (what we do, the work, prices, how it works, questions, the enquiry
form) plus a contact page, the small print, and the private client portal.

---

## Change the words or the prices

Everything the pages say that is likely to change lives in one file:

```
src/lib/content/site.ts
```

The work, the three prices, the monthly fee, the steps and the questions are all
there. Change a number once and the page, the search data and `/llms.txt` all
follow.

House rules for copy, also at the top of that file:

- The reader runs a garage, a shop or a trade, and is on a phone. Short words,
  short lines.
- Plain punctuation. No em or en dashes.
- No claim that is not true today.

## Add a piece of work

1. Add an entry to `work` in `src/lib/content/site.ts`.
2. Put two screenshots in `static/work/`: `<name>.jpg` at 1440 by 900 and
   `<name>-720.jpg` at 720 by 450.

Leave `href` out for a site that is not live yet and set `status` to
`'In build'`.

---

## Stack

- **Framework:** SvelteKit 2 + Svelte 5
- **Output:** Static (`@sveltejs/adapter-static`), plus Cloudflare Pages
  Functions in `functions/`
- **Language:** TypeScript
- **Styling:** Bespoke CSS on tokens. No Tailwind, no UI kits
- **Fonts:** Marcellus (display), Manrope (body), via `@fontsource`
- **Hosting:** Cloudflare Pages. Every push to `main` deploys
  (`.github/workflows/deploy.yml`)

## Getting started

**Requirements:** Node 22 LTS (Node 20+ acceptable with `--ignore-engines`)

```sh
npm install --ignore-engines
npm run dev
```

| Command | Description |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | Svelte type-check |

The enquiry form posts to `/api/inquiry`, which only exists on Cloudflare. In
local dev the form shows its "that did not send" message; that is expected.

## Project structure

```
src/routes/
├── +layout.svelte      # Fonts, global type and colour, masthead and foot
├── +page.svelte        # The home page: the whole pitch, in one scroll
├── contact/            # The enquiry form on its own address
├── llms.txt/           # Plain summary for AI assistants, built from site.ts
├── legal/ privacy/ terms/
├── portal/             # Client portal. Its own chrome, unlinked from the site
└── +error.svelte       # 404 / error
src/lib/
├── content/site.ts     # The words and the numbers
├── components/
│   ├── EnquiryForm.svelte
│   ├── CookieBanner.svelte
│   └── ui/Wordmark.svelte
└── styles/
    ├── tokens.css      # Single source of truth: colour, type, space, shape
    └── site.css        # Masthead, buttons, sections, foot
functions/
├── api/inquiry.js      # Saves an enquiry to D1 and emails the studio
└── portal/             # Live data for the client portal
static/
├── work/               # Screenshots of client sites
├── _redirects          # Old addresses that now point home
├── symbol.svg          # Favicon
├── sitemap.xml
└── robots.txt
```

## Design principles

- Two tones only: soft white paper and black. The only colour on the site is
  the client work.
- One inverted band per page, and it holds the one thing the page is asking for.
- Typography-led. No decoration, no shadows, no glass, no gradients.
- Square corners. Hairlines and space do the dividing.
- Every spacing decision sits on the 4px grid, on a token.

Design language follows the VNTA Brand Guidelines (Felixto Brandworks, v1.0);
the reasoning is in `docs/REDESIGN-DIRECTION.md`. Proprietary assets are not
included in this repository.

Contact: studio@vnta.xyz
