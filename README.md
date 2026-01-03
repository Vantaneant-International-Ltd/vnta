# VNTA — Coming Soon (SvelteKit)

Premium, lightweight "coming soon" landing page for VNTA built with SvelteKit and Vite. Custom typography uses Manrope + Playfair Display via `@fontsource` packages; styling is bespoke (no Tailwind).

## Requirements
- Node.js: SvelteKit tooling expects Node ^20.19 or ^22.12 (or >=24). Current environment is Node 21.x; installs work with `--ignore-engines` but upgrading to 22 LTS is recommended.

## Install
```sh
npm install --ignore-engines
```

## Run
```sh
npm run dev
# or open automatically
npm run dev -- --open
```

## Check / Build
```sh
npm run check
npm run build
npm run preview
```

## Notes
- Favicon lives in static/favicon.svg.
- Contact link uses mailto:hello@vnta.studio — update if needed.
- All styles live in `src/routes/+page.svelte`; globals in `src/routes/+layout.svelte`.
