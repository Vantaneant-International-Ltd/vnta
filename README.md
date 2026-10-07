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

## Add a house

Add an entry to `houses` in `src/lib/content/site.ts`. Give it an `image` only
when there is a real phone screenshot in `static/work/` (`<name>-phone.jpg` at
780 by 1688 and `<name>-phone-390.jpg`); without one the card shows the name on
its own.

## Add a piece of work

1. Add an entry to `work` in `src/lib/content/site.ts`.
2. Put four screenshots in `static/work/`: `<name>.jpg` at 1440 by 900,
   `<name>-720.jpg` at 720 by 450, and the phone view as `<name>-phone.jpg`
   at 780 by 1688 and `<name>-phone-390.jpg` at 390 by 844. The first three
   entries in `work` are the three phones on the hero.

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
│   └── ui/              # Wordmark.svelte and Symbol.svelte, the two halves of the logo
└── styles/
    ├── tokens.css      # Single source of truth: colour, type, space, shape
    └── site.css        # Bands, masthead, buttons, section heads, cards, groups, foot
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

Soft and plain, the way a well-made phone screen is. The values are in
`src/lib/styles/tokens.css`.

- **Colour:** greys only, and the brand guideline's own. Its 80 percent black
  (`#333333`) is the ink and the one dark surface; 60, 40 and 20 percent do
  the rest; the page tint (`#f5f5f5`) is the one value not on its list. Pure
  black against pure white glared on a screen, so neither is used full-bleed.
- **Worlds:** each project's card borrows that project's own ground, text
  colour and one accent, so every client and every house gets its own
  spotlight. That is the only colour on the site, and it lives in
  `content/site.ts` beside the project it belongs to.
- **Type:** Optima for every title (Apple devices carry it; others get
  Marcellus). Small reading text, buttons and fields are in the device's own
  face on Apple and Manrope elsewhere.
- **Shape:** rounded. Cards 24px, fields 12px, buttons fully round.
- **Layout:** white and grey sections in turn, content in cards, lists set as
  one rounded group with hairlines, like a phone's settings.
- **One dark thing per page:** the enquiry card.
- **Still true from the guideline:** left-aligned, nothing squeezed, no
  shadows, the wordmark and symbol untouched.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
