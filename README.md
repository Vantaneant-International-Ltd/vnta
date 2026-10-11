# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

VNTA is a technology company. It builds infrastructure for autonomous systems.
Its first system is **VNTA Robotics**: a vendor-neutral control layer for
robots and autonomous machines (identity, permissions, connectivity,
orchestration, telemetry, audit). VNTA Robotics is in development.

VNTA also runs a studio that designs brands and builds websites for Irish
businesses. Until October 2026 the studio *was* this site. It now lives at
[vnta.xyz/studio](https://vnta.xyz/studio), whole and unchanged, and the
technology company has the front door.

## Two doors

The two speak to different readers, so they do not share a page:

| | Address | Reader | Look | Words |
| --- | --- | --- | --- | --- |
| **VNTA** | `/`, `/robotics`, `/contact` | Operators, manufacturers, investors | White, grey, navy, Inter (`styles/system.css`, under `.shell`) | `content/site.ts` |
| **VNTA Studio** | `/studio`, `/studio/websites-for-…` | An Irish business owner | Soft greys, Optima, each client's colours (`styles/studio.css`, under `.studio`) | `content/studio.ts` |

- They meet in exactly two places: a "Studio" link in the company's foot with
  one sentence in its Company section, and "VNTA, the company" in the studio's
  foot. Do not put studio prices on a company page, or robotics on a studio
  page.
- Every rule in `system.css` starts with `.shell` and every rule in
  `studio.css` starts with `.studio`, so the two looks cannot leak into each
  other. `src/routes/+layout.svelte` picks the frame from the address.
- The studio's four landing pages used to sit at the top level. Their old
  addresses forward to the new ones (`static/_redirects`), so search results
  and the "Site by VNTA" links on client sites still land in the right place.
- The studio's own notes (the turning card, the wall of logos, the sit-down
  price, adding a piece of work) are at the foot of this file.

The rest of the site: the small print, and the private client portal.

---

## Change the words

Everything the company pages say lives in one file (the studio's is
`src/lib/content/studio.ts`):

```
src/lib/content/site.ts
```

The pitch, the statement, the three kinds of system and where each stands, the
principles, the company facts, and everything about VNTA Robotics (its six
layer parts and its ten capabilities). Change a line once and the pages, the
search data and `/llms.txt` all follow.

## Share cards

Every main page has its own picture for when its link is sent on WhatsApp,
iMessage or LinkedIn: `static/share/home.png`, `robotics.png`, `contact.png`,
`studio.png` and one per studio landing page. They are drawn from the content
files by `node scripts/share-cards.mjs` (it needs Playwright; the script says
how). Run it again after changing a headline, a landing page title or a price,
and copy `share/home.png` over `static/og.png`, the default for the small-print
pages. A page names its card in its `<Seo image="...">` line. Chat apps keep a
link's old card for days; a link shared before a change may go on showing the
old picture.

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
├── studio/             # VNTA Studio: its home page and four landing pages
├── contact/            # The contact form
├── llms.txt/           # Plain summary for AI assistants, built from site.ts
├── legal/ privacy/ terms/
├── portal/             # Client portal. Its own chrome and tokens, unlinked
└── +error.svelte       # 404 / error
src/lib/
├── content/site.ts     # The company's words
├── content/structured.ts # The same facts for search engines
├── content/studio.ts   # The studio's words, work and prices
├── content/studioStructured.ts
├── studio/             # The studio's own components: Flip, Logos, ProjectCard, Devices
├── components/
│   ├── Architecture.svelte # Machines, the control layer, enterprise systems
│   ├── Concept.svelte    # The labelled interface concept
│   ├── Stage.svelte      # "In development" / "Research"
│   ├── EnquiryForm.svelte
│   ├── CookieBanner.svelte
│   └── ui/               # Icon.svelte, Wordmark.svelte, Symbol.svelte
└── styles/
    ├── system.css      # The company's tokens and components, under .shell
    ├── studio.css      # The studio's components, under .studio
    └── tokens.css      # The older tokens: the studio and the client portal read them
functions/
├── api/inquiry.js      # Saves a message to D1 and emails us
└── portal/             # Live data for the client portal
static/
├── _redirects          # Old addresses, forwarded to where the page lives now
├── work/ logos/        # The studio's screenshots and client logos
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
- **The studio and the client portal are untouched.** They sit outside
  `.shell` and keep the earlier look and tokens.

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
