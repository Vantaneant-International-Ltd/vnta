# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

VNTA is a technology company. It builds infrastructure for autonomous systems.
Its first system is **VNTA Robotics**: a vendor-neutral control layer for
robots and autonomous machines (identity, permissions, connectivity,
orchestration, telemetry, audit). VNTA Robotics is in development.

VNTA is not an agency, a consultancy or a studio. Until October 2026 this site
sold brand design and websites; that is gone, and the old sales pages redirect
home (`static/_redirects`).

The site is small on purpose: a home page for the parent company, a page for
VNTA Robotics, a contact page, the small print, and the private client portal.

---

## Change the words

Everything the pages say lives in one file:

```
src/lib/content/site.ts
```

The pitch, the statement, the three kinds of system and where each stands, the
principles, the company facts, and everything about VNTA Robotics (its six
layer parts and its ten capabilities). Change a line once and the pages, the
search data and `/llms.txt` all follow. The headline is also drawn on the share
card, `static/og.png`: if it changes, redraw the card.

House rules for copy, also at the top of that file:

- Short, technical, quiet, precise. No hype and no startup cliches.
- **Nothing is claimed that is not true today.** VNTA Robotics is in
  development: say "developing", "building", "designed to". No customer names,
  no metrics, no testimonials, no manufacturer logos until they are real.
- The parent is wider than robotics. Agents and compute are research
  directions, not products: they are always marked "Research" and never
  presented as available.

## Where things will live

| Address | What | Today |
| --- | --- | --- |
| `vnta.xyz` | The parent company | This site |
| `robotics.vnta.xyz` | VNTA Robotics | Not created. The page is `/robotics` here |
| `app.vnta.xyz` | The application | Not created |
| `api.vnta.xyz` | The API | Not created |
| `docs.vnta.xyz` | Developer documentation | Not created |

Nothing on the site links to an address that does not exist. When
`robotics.vnta.xyz` goes up, change `roboticsUrl` in `content/site.ts` (every
"Explore Robotics" link follows) and switch on the redirect that is waiting,
commented out, in `static/_redirects`.

## Showing the product honestly

There are two pictures of the product, and neither is a screenshot:

- **The architecture** (`Architecture.svelte`): machines, the control layer,
  enterprise systems. Its caption says it is the architecture of a design and
  that the product is not yet available.
- **The interface concept** (`Concept.svelte`): one machine's record. It
  carries a strip that reads "Interface concept / Example data" at all times.
  Its site, its manufacturer and its robot are invented for the picture and
  named so nobody could take them for real ("Example site", "Example
  Robotics"). Never put a real company's name in it.

## Being found: search engines, AI assistants and share cards

- **Every page's title, description, share card and address** come from one
  component, `src/lib/components/Seo.svelte`. Use it on every public page.
- **Structured data** is in `src/lib/content/structured.ts` and reads from
  `site.ts`. VNTA Robotics is described as software in development, with no
  price and no rating, because neither exists.
- **`/robots.txt`** welcomes search engines and AI crawlers by name.
  **`/sitemap.xml`** and **`/llms.txt`** are built from the content file. The
  list of public pages is `publicPaths` in `structured.ts`.
- **IndexNow.** `npm run deploy` ends by telling Bing and friends the site
  changed (`scripts/indexnow.mjs`). The key file in `static/` proves it is us.
- **Cloudflare can still block AI crawlers at the door**, whatever robots.txt
  says. In the Cloudflare dashboard for vnta.xyz, under Security, the setting
  that blocks AI bots must be off, or GPTBot and ClaudeBot get a 403.

---

## Stack

- **Framework:** SvelteKit 2 + Svelte 5
- **Output:** Static (`@sveltejs/adapter-static`), plus Cloudflare Pages
  Functions in `functions/`
- **Language:** TypeScript
- **Styling:** Bespoke CSS on tokens. No Tailwind, no UI kits
- **Fonts:** Inter (the public site), via `@fontsource-variable`. Marcellus and
  Manrope remain for the client portal
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
├── +layout.svelte      # Fonts, masthead and foot. The portal opts out
├── +page.svelte        # Home: the parent company
├── robotics/           # VNTA Robotics. Moves to robotics.vnta.xyz one day
├── contact/            # The contact form
├── llms.txt/           # Plain summary for AI assistants, built from site.ts
├── legal/ privacy/ terms/
├── portal/             # Client portal. Its own chrome and tokens, unlinked
└── +error.svelte       # 404 / error
src/lib/
├── content/site.ts     # The words
├── content/structured.ts # The same facts for search engines
├── components/
│   ├── Architecture.svelte # Machines, the control layer, enterprise systems
│   ├── Concept.svelte    # The labelled interface concept
│   ├── Stage.svelte      # "In development" / "Research"
│   ├── EnquiryForm.svelte
│   ├── CookieBanner.svelte
│   └── ui/               # Icon.svelte, Wordmark.svelte, Symbol.svelte
└── styles/
    ├── system.css      # The public site's tokens and components, under .shell
    └── tokens.css      # The older tokens. Only the client portal reads them now
functions/
├── api/inquiry.js      # Saves a message to D1 and emails us
└── portal/             # Live data for the client portal
static/
├── _redirects          # Old addresses that now point home
├── symbol.svg          # Favicon
└── robots.txt
```

## Design principles

White, cool grey and navy, with one blue. The language is that of the product
itself. The values are in `src/lib/styles/system.css`.

- **One family with the product.** The site is drawn the way the VNTA Robotics
  application is designed: panels with a hairline edge, small status marks,
  tables that read like a control screen, dense but calm.
- **Colour:** a cool off-white page (`#f5f7fa`), white panels, navy ink
  (`#0c1626`) and a navy solid (`#0f1b2d`) for the main button, the core of
  the diagram and the foot. One blue (`#1f55d6`) for links and for the one
  live status. Green, amber and red appear only inside the interface concept,
  where they mean what they mean in the product.
- **Status is a shape, not only a colour:** a filled dot for what is being
  built, a hollow ring for research; and the two research systems are drawn
  with a broken edge and stand back.
- **Type:** Inter, one family, set tight and semi-bold for headings. Small
  labels above headings are capitals, set open. Monospace only for addresses
  and times.
- **Shape:** panels 14px, buttons and fields 10px, chips 7px. One soft shadow,
  kept for the one panel that floats beside a headline.
- **No stock imagery, no gradients for mood, no glowing anything.** The only
  pictures are the architecture and the interface concept.
- **The logo is unchanged:** VNTA's own wordmark and symbol, from the brand
  guideline.
- **The client portal is untouched.** It sits outside `.shell` and keeps the
  earlier look and tokens.

Proprietary assets (the guideline itself and its photography) are not included
in this repository.

Contact: studio@vnta.xyz
