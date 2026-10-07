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
├── +layout.svelte      # Fonts, global type and colour, black masthead and foot
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
│   └── ui/              # Wordmark.svelte and Symbol.svelte, the two halves of the logo
└── styles/
    ├── tokens.css      # Single source of truth: colour, type, space, shape
    └── site.css        # Bands, masthead, buttons, section heads, rows, foot
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

The site is built to the VNTA Brand Guidelines v1.0 (Felixto Brandworks). The
values are in `src/lib/styles/tokens.css`, each with the section of the
guideline it comes from.

- **Colour (3.1, 3.2):** white `#ffffff`, black `#000000`, and four shades of
  each. Nothing else. Most bands are black, as most of the guideline is. The
  only colour on the site is the client work.
- **Typeface (4.1):** Optima. Apple devices carry it; every other device gets
  Marcellus, the closest open face. Titles are in capitals, statements in
  sentence case, all at the regular weight.
- **Type scaling (4.3):** 64 / 48 / 36 / 24.
- **Common mistakes (4.4):** nothing centred, nothing squeezed, no shadows.
- **Logo (2.1 to 2.6):** the wordmark in the masthead, the symbol on the hero,
  and the full lockup once, at the foot of the home page.
- **Layout:** each section opens the way a page of the guideline does, with a
  full rule, the title on the left and a short paragraph on the right. Lists
  are set as ruled rows, like the guideline's Brand Values page.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
