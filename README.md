# VNTA

**Vantanéant International**, trading as VNTA. The public site at
[vnta.xyz](https://vnta.xyz), built with SvelteKit.

VNTA is a technology company. It builds infrastructure for autonomous systems.
Its current business area is **VNTA Robotics**: developer infrastructure for
autonomous machines. It connects to a robot or fleet system, tests what it can
actually do, and keeps the evidence. VNTA Robotics is in development: it runs
against simulated robots and one external virtual vehicle (the code is in the
private `vnta-robotics` repository, whose `STATUS.md` says what is true), and
the site says so.

Names, used the same way everywhere: **VNTA** (the company), **VNTA Robotics**
(the business area), and inside it **Runtime** (the platform), **Validation**
(the first module, the current one), **Access** and **Identity** (future
modules). Not "VNTA for Robots", not "VNTA Validation".

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
  development. Validation runs against simulated robots and one external
  virtual vehicle; no real machine has been connected, no pilot has been run.
  Only VDA 5050 2.1.0 is supported; ROS 2, Open-RMF and vendor APIs are
  planned. Anything not built is marked next, later, planned or future. When
  that changes, change `robotics.honest` and `support` in `site.ts` and the
  site follows. No customer names, no metrics, no testimonials, no
  manufacturer logos until they are real.
- **A validation report is not a safety certification.** Never imply it is.
- **Prices** (`content/pricing.ts`) are starting points, ex VAT, for a scope
  agreed in advance. No checkout, no per-robot pricing, no enterprise price,
  no savings claims. Runtime as an annual platform is planned and must not
  look purchasable. The internal cost and margin rules are in the
  `vnta-robotics` repository, not here.
- The parent is wider than robotics. Agents and compute are research
  directions, not products: they are always marked "Research" and never
  presented as available.

## Notes, and how they are published

VNTA Robotics posts short notes: what is being built, what it found, what is
not done. They live on this site first, at `/robotics/notes`, with an RSS feed
at `/robotics/notes/rss.xml`. A short version with a link back goes to Mastodon
and Bluesky. There is no LinkedIn, X or Meta in this: the site is the home, and
the two open networks are signs pointing at it.

- **The words** are in `src/lib/server/notes.ts`. Being in that file does not
  make a note public, and because it is under `server/` the build refuses to
  send it to a visitor's browser: a held note stays unseen.
- **What is public** is whatever is listed in
  `src/lib/server/notes-published.json`. The site shows only those. Do not
  edit that file by hand: the job writes it.
- **The job** is `.github/workflows/notes.yml`, every morning at 07:17 UTC. If
  a note's date has come and it has no `hold`, it records the note, deploys the
  site, waits for the page to be live, and posts to the two networks. One note
  a day at most.
- **The two networks are not given the same thing.** Mastodon gets the fuller
  `short` text with hashtags, the morning the note is published. Bluesky gets
  its own shorter `bluesky` line, with no hashtags, the morning after. The
  days are set by `AFTER` in `scripts/publish-notes.mjs`.
- **The pictures** are in `src/lib/content/note-images`, outside the served
  folder. A picture is copied into the site only when its note is published,
  so a held note's picture cannot be found by guessing its address.
- **This repository is public.** A draft that should not be read yet does not
  belong in it, held or not. Such drafts are kept in the private
  `vnta-robotics` repository (`docs/notes/HELD.md`), with the reason each is
  waiting, and are moved here on the day they may go out.
- **To pause a note that is here**, give it a `hold` line with a neutral word.
  **To release it**, delete that line and push. It goes out the next morning.
- **To see what is out and what is next:** `npm run notes`.
- **To try the job without publishing:** Actions > Publish notes > Run
  workflow > tick "Dry run".

The two networks need keys, kept as repository secrets (Settings > Secrets and
variables > Actions). Until a network's keys exist, the job skips it and
nothing breaks.

| Secret | What it is |
| --- | --- |
| `MASTODON_URL` | The server the account is on, for example `https://mastodon.social` |
| `MASTODON_TOKEN` | An access token: on that server, Preferences > Development > New application, with `write:statuses` and `write:media` ticked |
| `BLUESKY_HANDLE` | The handle, for example `vnta.bsky.social` |
| `BLUESKY_APP_PASSWORD` | An app password: Settings > Privacy and security > App passwords. Never the account password |

A key lets the job post and nothing else. To stop the job posting, delete the
key on the network, or delete the secret here.

A note published before a network's keys were added is not posted there
afterwards: only notes from the last three days are, so adding a key never
floods the feed.

### Posts for one network only

A line that belongs on Mastodon or on Bluesky, and has no page on the site,
goes in `src/lib/server/posts.ts`: an id, a date, the network, the exact text,
and a picture if it has one (`src/lib/content/post-images`). The job is
`.github/workflows/posts.yml`: it runs when that file changes and once a day,
sends what is due, once, and records it in `src/lib/server/posts-sent.json`.
A post more than three days late is not sent. Like everything in this
repository, a post in that file can be read by anyone before it goes out.

### Seeing a post after it has gone out

Actions > Screenshots > Run workflow, with the post's address. It photographs
the page as a visitor who is not signed in sees it. The picture is attached
to the run and put on a branch called `shots`, which can be deleted.

## The profiles on Mastodon and Bluesky

One VNTA account on each, for the whole company. `src/lib/content/social.ts`
says what each profile should carry, and `.github/workflows/social-profile.yml`
applies it when that file changes: the links under the Mastodon profile, and a
description on either network only where there is none. It never overwrites a
description a person typed, and never touches the name, picture, followers or
posts.

Two proofs that the accounts are VNTA's live on this site:

- Every page links back to the Mastodon profile with `rel="me"` (in
  `src/routes/+layout.svelte`). That is what puts the green tick beside
  vnta.xyz on the profile.
- `static/.well-known/atproto-did` holds the Bluesky account's public id. That
  is what lets the account be named `@vnta.xyz`. It is not a secret.

The Mastodon key is wider than posting needs, by the owner's choice, so that
this job can read and update the profile.

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

- **The architecture** (`Architecture.svelte`): the interfaces robots already
  speak, VNTA Robotics above them, and who it is for. Each interface tile
  says "Works today" or "Planned", because four tiles without that would read
  as four that work. Only VDA 5050 2.1.0 works today.
- **The validation result** (`CapabilityPanel.svelte`): one machine after one
  run, declared against verified. It is not a mock-up: the rows are what the
  Runtime produced for the one external test subject, an open-source VDA 5050
  virtual vehicle. It carries a strip that reads "Validation result / Virtual
  vehicle" at all times. If the suite or the subject changes, run it again and
  update the rows; never edit them to look better. Do not name the software's
  author on the site: it is not a partner and nothing should suggest it is.

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
├── robotics/           # VNTA Robotics, and its pricing page (robotics/pricing). Moves to robotics.vnta.xyz one day
├── studio/             # VNTA Studio: its home page and four landing pages
├── contact/            # The contact form
├── llms.txt/           # Plain summary for AI assistants, built from site.ts
├── legal/ privacy/ terms/
├── portal/             # Client portal. Its own chrome and tokens, unlinked
└── +error.svelte       # 404 / error
src/lib/
├── content/site.ts     # The company's words
├── content/pricing.ts  # VNTA Robotics pricing: offers, questions, the request form
├── server/notes.ts     # VNTA Robotics notes: the words, the dates, the holds. Never sent to a browser
├── server/notes-published.json # What the daily job has published. The site shows only this
├── content/structured.ts # The same facts for search engines
├── content/studio.ts   # The studio's words, work and prices
├── content/studioStructured.ts
├── studio/             # The studio's own components: Flip, Logos, ProjectCard, Devices
├── components/
│   ├── Architecture.svelte # Interfaces below, VNTA Robotics above, who it is for
│   ├── CapabilityPanel.svelte # A real validation result: declared against verified
│   ├── Stage.svelte      # Status marks: current, in development, planned
│   ├── EnquiryForm.svelte
│   ├── PilotForm.svelte  # The pilot request on the pricing page. Not a checkout
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
