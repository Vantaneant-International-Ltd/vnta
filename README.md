# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

VNTA is a brand studio. It looks at a business, works out what it needs to
change, and then designs it: the brand first, and a website where one is
needed. The site has one job: get a business owner to start that conversation.
It is one long page (the pitch, what we do, the work, how it works, the website
prices, questions, the enquiry form) plus a contact page, four pages for people
searching for a website, the small print, and the private client portal.

Nothing on the public site is addressed to investors. It should simply read as
a real, working studio to anyone who looks.

---

## Change the words or the prices

Everything the pages say that is likely to change lives in one file:

```
src/lib/content/site.ts
```

The sit-down has one price, one length and one thing you leave with: `sitDown`.
Change it there and the top of the page, what we do, the steps, the prices and
the questions all follow.

The pitch (`pitch`), what we do (`offer`), the work, the three website prices,
the monthly fee, the steps and the questions are all there. Change a line once
and the page, the search data and `/llms.txt` all follow. The headline is also
drawn on the share card, `static/og.png`: if it changes, redraw the card.

House rules for copy, also at the top of that file:

- The reader owns or runs a business, of any kind and size, and is often on a
  phone. Short words, short lines.
- Plain punctuation. No em or en dashes.
- No claim that is not true today. Each entry in `work` says what we made for
  that client (`did`): only say "Brand and website" where the brand is ours.

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

## The wall of logos

Under the top of the home page is a row of six dark tiles: who we have worked
for, and what we build on. The row stands still, and every two seconds one
tile turns over to the next name (`Logos.svelte`). The list is `wall` in
`src/lib/content/site.ts`.

- **A client or a house:** put its logo in `static/logos/`, drawn in white for
  a dark tile, and name the file in its `wall` entry. Set `named` if the
  picture already spells the name. Until we hold a logo, the name is set in
  type.
- **A tool:** add its mark to `src/lib/components/ui/toolMarks.ts` (shapes from
  Simple Icons, one colour) and a line to `wall`. Only tools we really use.

A tile with an `href` is a link to that company's or tool's own site, opened
in a new tab. The large card above it links the same way to the site it is
showing. L.M. Motors has no link until the site we are building is live.

Logos are shown without their colour so the row stays in VNTA's greys. For
anyone who has asked their device for less motion the tiles never turn, and
every name is listed under the row instead.

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
│   ├── Logos.svelte      # The row of tiles that turn, one at a time, from logo to logo
│   ├── Flip.svelte       # The card on the home page that turns from site to site
│   ├── ui/rays.ts        # The symbol taken apart, one path per ray, for the card's clock
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

Clear type, real pictures, plenty of room, nothing shouting. The values are in
`src/lib/styles/tokens.css`.

**What makes it VNTA.** The guideline gives us two things nobody else has: the
symbol (a burst of 32 rays) and a wordmark of four flared capitals. The site is
built out of those two, quietly:

- **The symbol is the clock.** Under the headline, one real site sits still on
  a card, then the card turns over and the next site is on the back
  (`Flip.svelte`). Beside it the symbol lights ray by ray; when the last ray
  is lit, the card turns. The rays are the guideline's own shapes, taken apart
  in `ui/rays.ts`.
- **Every bullet is one ray.** List marks are a single tapered ray, in the
  client's own accent inside a job card.
- **Small capitals for the small words.** A trade, a status, a column heading
  in the foot: set in small capitals of the display face, a little open, so
  they read as kin to the wordmark (`--font-label`). A few words, never a
  sentence. Figures in these labels come from the sans, because the
  small-capital 1 reads as the letter I.
- **The symbol rises behind the foot**, large and barely there, and the lockup
  (symbol over wordmark) signs the page off.

**The rest.**

- **The arc:** light all the way down, each client's site in that client's own
  colours, and one dark section at the close: the enquiry and the foot.
- **One large line** at the top of a page, in the display face. Large enough
  to be sure of itself. An earlier pass set it at twice the size, with a dark
  section mid-page and the wordmark the full width of the foot; it shouted,
  and was turned down.
- **The turning card** waits five seconds on each site. It stops while the
  pointer rests on it, while it is off screen, and when the visitor presses
  pause. For anyone who has asked their device for less motion it never turns
  by itself.
- **The wall of logos** under it turns one tile at a time, every two seconds,
  and follows the same rules. These two are the only things on the site that
  move without being asked, and each has its own pause.
- **Colour:** greys only, of our own. A soft black (`#2b2b2b`) is the ink and
  the dark section; white and an off-white (`#f4f4f4`) are the light ones;
  the guideline's 80, 60, 40 and 20 percent blacks do the rest. Pure black
  against pure white glared on a screen, so neither is used full-bleed.
- **Worlds:** each project's card borrows that project's own ground, text
  colour and one accent. That is the only colour on the site, and it lives in
  `content/site.ts` beside the project it belongs to.
- **Type:** Optima for every title (Apple devices carry it; others get
  Marcellus). Reading text, buttons and fields are in the device's own face
  on Apple and Manrope elsewhere.
- **Shape:** rounded. Cards 20 to 28px, fields 12px, buttons fully round.
- **Lines, not boxes:** what we do, the steps, the questions, the facts and
  the small print are ruled rows. Cards are kept for the work and the prices.
- **The work stacks:** on a tall, wide screen each job holds its place while
  the next one slides up over it.
- **Still true from the guideline:** left-aligned, nothing squeezed, no
  shadows, the wordmark and symbol untouched.

Wiro (wiro.agency) was looked at for confidence, not for its look: they are
dark throughout with a heavy sans. Nothing of theirs is here.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
