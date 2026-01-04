## VNTA — Coming Soon (SvelteKit)

A restrained, premium “coming soon” landing page for **VNTA (Vantanéant International)**, built with **SvelteKit + Vite**.
The site reflects VNTA’s role as a quiet, disciplined holding company — prioritising structure, clarity, and long-term intent over noise.

Design language and typography follow the **VNTA Brand Guidelines (Felixto Brandworks, v1.0)**.

---

## Typography & Design System

* **Primary typeface:** Optima
  Chosen for its timeless, corporate clarity and restrained elegance.
* **Weights used:** Regular, Medium, Demi-Bold, Bold
* **Type scaling:**

  * 64px — Primary heading
  * 48px — Section heading
  * 36px — Subheading
  * 24px — Body / supporting text
* **Styling:** Bespoke CSS (no Tailwind, no UI kits)
* **Tone:** Calm, confident, minimal, intentional

> Note: Web-safe Optima fallbacks should be defined (e.g. `Optima, Segoe, Helvetica Neue, Arial, sans-serif`) until licensed web embedding is finalised.

---

## Requirements

* **Node.js:**
  SvelteKit tooling expects **Node ^20.19 or ^22.12 (LTS recommended)**
  Current environment: Node 21.x
  Installs work with `--ignore-engines`, but upgrading to **Node 22 LTS** is advised.

---

## Install

```sh
npm install --ignore-engines
```

---

## Run

```sh
npm run dev
# or open automatically
npm run dev -- --open
```

---

## Check / Build

```sh
npm run check
npm run build
npm run preview
```

---

## Project Structure Notes

* **Favicon:** `static/favicon.svg`
* **Contact:** `mailto:hello@vnta.studio`
* **Page styles:** `src/routes/+page.svelte`
* **Global layout / fonts:** `src/routes/+layout.svelte`
* **No utility frameworks** — all layout and spacing are deliberate and minimal

---

## Roadmap / Checklist

### Brand & Content

* [x] VNTA positioning aligned with holding-company ethos
* [x] Tone of voice: calm, confident, restrained
* [x] Latin motto integrated conceptually (*ex nihilo, nihil fit*)
* [ ] Finalise hero statement (1–2 lines, non-descriptive)
* [ ] Lock microcopy for CTA(s) and notices
* [ ] Add legal entity reference where required (footer / meta)

### Design

* [x] Black / white palette only
* [x] No decorative colour usage
* [x] Typography aligned with brand guidelines
* [ ] Confirm licensed Optima web font or approved substitute
* [ ] Finalise vertical rhythm (section spacing system)
* [ ] Define button states (hover, focus, disabled)

### Technical

* [x] SvelteKit + Vite configured
* [x] Lightweight build, no Tailwind
* [ ] Accessibility pass (contrast ratios, focus states, keyboard nav)
* [ ] SEO baseline (title, description, canonical)
* [ ] OpenGraph / social preview placeholders
* [ ] Production build validation

### Launch

* [ ] Connect production domain
* [ ] Enable HTTPS
* [ ] Set environment variables for production
* [ ] Replace “Coming Soon” with soft-launch content
* [ ] Archive v1 snapshot

---

## Philosophy

> VNTA exists at the intersection of **structure and creation**.
> We build the invisible systems that allow brands to endure.

---

## Brand Assets & Guidelines

The official VNTA Brand Guidelines (Felixto Brandworks) are **not included** in this repository.

* Proprietary design assets remain private
* This repository references guidelines conceptually only
* Public-facing rules are enforced through implementation, not distribution

## Notes 
- Favicon lives in static/favicon.svg.
- Contact link uses mailto:hello@vnta.studio
- update if needed.
- All styles live in src/routes/+page.svelte; globals in src/routes/+layout.svelte.
