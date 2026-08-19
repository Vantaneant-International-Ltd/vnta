# VNTA

**Vantanéant International** — the corporate site, built with SvelteKit.

One page. A signed letter on white, the three houses and the small print on
black, and a single offer. Everything that survived removal is on it.

---

## Stack

- **Framework:** SvelteKit 2 + Svelte 5
- **Bundler:** Vite
- **Output:** Static (via `@sveltejs/adapter-static`)
- **Language:** TypeScript
- **Styling:** Bespoke CSS on tokens — no Tailwind, no UI kits
- **Fonts:** Marcellus (display), Manrope (body), Mrs Saint Delafield (the
  signature, and nothing else) — all via `@fontsource`

---

## Getting Started

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

## Project Structure

```
src/routes/
├── +layout.svelte      # Fonts, global type/colour, slim chrome for sub-pages
├── +page.svelte        # The site
├── legal/ privacy/ terms/
├── portal/             # Client portal — its own chrome, unlinked from the page
└── +error.svelte       # 404 / error
src/lib/
├── styles/tokens.css   # Single source of truth: colour, type, space, shape
└── components/ui/Wordmark.svelte
static/
├── symbol.svg          # Favicon
├── wordmark.svg
├── sitemap.xml
└── robots.txt
```

## Design Principles

- Two tones only: white paper, black band. No third colour.
- If an element survives removal, remove it.
- Typography-led. No decoration, no shadows, no glass, no gradients.
- Copy carries plain punctuation — no em or en dashes.
- Every spacing decision sits on the 4px grid, on a token.

Design language follows the VNTA Brand Guidelines (Felixto Brandworks, v1.0).
Proprietary assets are not included in this repository.

Contact: studio@vnta.xyz
