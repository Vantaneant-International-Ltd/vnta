# VNTA

**Vantanéant International** — corporate website built with SvelteKit.

A restrained, premium web presence for a quiet, disciplined holding company. Structure, clarity, and long-term intent over noise.

---

## Stack

- **Framework:** SvelteKit 2 + Svelte 5
- **Bundler:** Vite
- **Output:** Static (via `@sveltejs/adapter-static`)
- **Language:** TypeScript
- **Styling:** Bespoke CSS — no Tailwind, no UI kits
- **Fonts:** Playfair Display, Manrope (via `@fontsource`)

---

## Getting Started

**Requirements:** Node 22 LTS (Node 20+ acceptable with `--ignore-engines`)

```sh
npm install --ignore-engines
npm run dev
Scripts
Command	Description
npm run dev	Start local dev server
npm run build	Production build
npm run preview	Preview production build locally
npm run check	Svelte type-check
Project Structure
src/routes/
├── +layout.svelte      # Global layout and fonts
├── +page.svelte        # Homepage
├── about/
├── approach/
├── careers/
├── explore/
├── horizon/
├── houses/
├── legal/
├── pricing/
├── privacy/
└── terms/
static/
├── favicon.svg
├── robots.txt
└── ...                 # Brand assets (logos, SVGs)
Design Principles
Black and white palette only
Typography-led layout — no decorative elements
Every spacing decision is deliberate
No utility frameworks — CSS is written, not generated
VNTA exists at the intersection of structure and creation.
We build the invisible systems that allow brands to endure.

Brand
Design language follows the VNTA Brand Guidelines (Felixto Brandworks, v1.0).
Proprietary assets are not included in this repository.

Contact: hello@vnta.studio

