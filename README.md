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

## Being found: search engines, AI assistants and share cards

- **Every page's title, description, share card and address** come from one
  component, `src/lib/components/Seo.svelte`. Use it on every public page.
- **Structured data** (who VNTA is, prices, the work, the houses it owns) is in
  `src/lib/content/structured.ts` and reads from `site.ts`.
- **Landing pages** for what people search ("websites for garages", "web design
  Dublin") are entries in `landings` in `site.ts`. Add an entry and the page,
  the foot link, the sitemap line and the llms.txt line all appear.
- **Profiles.** Put VNTA's real Instagram, Facebook, LinkedIn and X addresses
  in `social` in `site.ts`. They show in the foot and tell Google and AI
  assistants that those profiles are the same VNTA.
- **`/robots.txt`** welcomes search engines and AI crawlers by name.
  **`/sitemap.xml`** and **`/llms.txt`** are built from the content file.
- **IndexNow.** `npm run deploy` ends by telling Bing and friends the site
  changed (`scripts/indexnow.mjs`). The key file in `static/` proves it is us.
- **Cloudflare can still block AI crawlers at the door**, whatever robots.txt
  says. In the Cloudflare dashboard for vnta.xyz, under Security, the setting
  that blocks AI bots must be off, or GPTBot and ClaudeBot get a 403.

## Add a house

Add an entry to `houses` in `src/lib/content/site.ts`. The first house in the
list is the lead: it gets the big card, and it is the last site on the turning
card at the top of the home page. The rest sit in a row under it. Every house
needs the same four screenshots as a piece of work (see below), and they must
show the house's real site, not a mock-up. An archived house comes off the
list.

## Add a piece of work

1. Add an entry to `work` in `src/lib/content/site.ts`.
2. Put four screenshots in `static/work/`: the laptop view as `<name>.jpg` at
   1440 by 900 and `<name>-720.jpg` at 720 by 450, and the phone view as
   `<name>-phone.jpg` at 780 by 1688 and `<name>-phone-390.jpg` at 390 by 844.
   Grab them from the live site when there is one. Every entry in `work` is
   also a face of the turning card at the top of the home page, in the same
   order.
3. Set the entry's `world` to the site's own colours: its ground, its text and
   one accent. When a client's site changes its look, retake the screenshots
   and change the `world` to match (EZGO went from white to charcoal in
   October 2026).

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
│   ├── Flip.svelte       # The card on the home page that turns from site to site
│   ├── ProjectCard.svelte # One job in its own colours
│   ├── Devices.svelte    # A site on two screens: a window and a phone
│   ├── EnquiryForm.svelte
│   ├── CookieBanner.svelte
│   └── ui/              # Wordmark.svelte and Symbol.svelte, the two halves of the logo
└── styles/
    ├── tokens.css      # Single source of truth: colour, type, space, shape
    └── site.css        # Bands, masthead, buttons, section heads, cards, prices, questions, foot
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

Large type, real pictures, plenty of room. The values are in
`src/lib/styles/tokens.css`.

- **The arc:** the page opens light, shows each client's site in that client's
  own colours, and closes dark. Every page ends the same way: the enquiry on
  the dark, then the foot, then the name written the full width of the page.
- **One very large line:** the home page headline, and the title of each
  landing page, is set in the display face at up to 148 pixels. Nothing else
  on a page competes with it.
- **The turning card:** under the headline, one real site sits still on a
  card, then the card turns over and the next site is on the back
  (`Flip.svelte`). It waits five seconds on each. It stops while the pointer
  rests on it, while it is off screen, and when the visitor presses pause.
  For anyone who has asked their device for less motion it never turns by
  itself. This is the only thing on the site that moves without being asked.
- **Colour:** greys only, of our own. A soft black (`#1f1f1f`) is the ink and
  the dark sections; white and an off-white (`#f4f4f4`) are the light ones;
  the guideline's 80, 60, 40 and 20 percent blacks do the rest. Pure black
  against pure white glared on a screen, so neither is used full-bleed.
- **Worlds:** each project's card borrows that project's own ground, text
  colour and one accent, so every client and every house gets its own
  spotlight. That is the only colour on the site, and it lives in
  `content/site.ts` beside the project it belongs to.
- **Type:** Optima for every title (Apple devices carry it; others get
  Marcellus). Small reading text, buttons and fields are in the device's own
  face on Apple and Manrope elsewhere.
- **Shape:** rounded. Cards 28px and up, fields 12px, buttons fully round.
- **Lines, not boxes:** lists (the steps, the questions, the small print under
  the prices, the three facts) are ruled rows, not cards. Cards are kept for
  the work and the three prices.
- **The work stacks:** on a tall, wide screen each job holds its place while
  the next one slides up over it.
- **Still true from the guideline:** left-aligned, nothing squeezed, no
  shadows, the wordmark and symbol untouched.

Wiro (wiro.agency) was the reference for confidence and scale in the October
2026 redesign: a very large headline, large pictures of real work, the name
large in the foot. Nothing of their look was taken: they are dark throughout
with a heavy sans; this site is light, in VNTA's own display face.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
