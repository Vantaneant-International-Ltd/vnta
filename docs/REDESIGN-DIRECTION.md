# VNTA — Redesign Direction (cold monochrome)

_June 2026. A full rebuild of the site onto a tokenised, brand-faithful system.
`src/lib/styles/tokens.css` and `src/lib/components/ui/*` are the implementation._

## 1. The decision

The old build had drifted into generic "premium dark SaaS": rounded/pill corners,
glass blur, drop shadows, hover lifts, and per-page hardcoded colours. We rebuilt
the structure as editorial — and, after briefly trialling a warm-ivory palette,
**reverted the palette to the canonical cold monochrome** the `vnta-brand` skill
(Felixto guidelines) mandates.

Why cold, not warm: VNTA is the **parent**. The guideline is explicit — _"VNTA is
NOT warm, cinematic, or tungsten-lit. That register belongs to Vendr. VNTA is cold,
neutral, and structural."_ A warm ivory VNTA collided with the houses (warm ink
`#16130f` ≈ Vendr `#16140f`; ivory ≈ Vendr/Eirvox paper) and collapsed the
parent-above-houses hierarchy. Cold monochrome keeps the parent distinct, matches
the **BlackRock** reference, and obeys the lock. (Kering/Anthropic informed the
*structure* — editorial restraint — not the colour temperature.)

## 2. Principles

- **Restraint** — if an element survives removal, remove it.
- **Silence** — form and spacing carry meaning; no decorative filler.
- **Precision** — everything on the 4px grid, on a token.
- **Timelessness** — no trend signifiers (glass, pills, gradients, lifts).

## 3. Palette — monochrome only (guideline §Palette)

No colour. Pure-neutral greys, no warm/cool tint. Tokens in `tokens.css`.

- Canvas `--paper #ffffff`, recessed `--paper-2 #f4f4f4`
- Text `--ink #0a0a0a`, neutral ramp `--ink-85 … --ink-20` (`#1a1a1a → #c7c7c7`)
- Hairlines `--line` / `--line-soft` (black, low alpha)
- `--accent` = ink (the system is monochrome; "accent" is just ink)
- Inverted moments via `[data-theme="ink"]` — full-black bands (footer, cookie bar)

## 4. Type

- **Display:** Marcellus (Optima substitute), **single 400 weight** — never request 500/600/700 on display.
- **Body:** Manrope 400–700 (sanctioned in the reconciled brand skill).
- **Scale:** 64 / 48 / 36 / 24 base, fluid (`--t-h1 … --t-h4`, `--t-lede`).
- Display tracking tight; small-caps labels open. Text column capped at `--measure`.

## 5. Shape, depth, motion

- **Shape:** square / `--radius: 2px`. No pills.
- **Depth:** hairlines + whitespace only. No shadows, no glass/blur.
- **Motion:** opacity/position, ≤180ms, on nav/links only. No hover lifts.

## 6. Component foundation (`src/lib/components/ui/`)

`Section` (editorial band w/ eyebrow+index header, `tone="ink"` invert) · `Button`
(square solid/ghost) · `Eyebrow` · `Rule` · `Wordmark` (inline SVG, `currentColor`
— ink on white, white on ink). Pages are assembled from tokens + these, not bespoke
per-page CSS.

## 7. State of the rebuild

- **Rebuilt to the system:** chrome (header/footer/buttons/type), home, about, approach, explore, houses, horizon, pricing (+ light legible inquiry modal), careers (+ light apply form).
- **Clean prose on the system:** legal, privacy, terms, 404/error.
- **Chrome fixes:** inlined ink-aware wordmark; removed the broken EN/GA language toggle and all i18n (site is English); `Est. MMXXV`→`Est. 2025`; fixed the dark-on-dark cookie bar and form fields.
- **Not yet rebuilt:** `/admin` (internal, unlinked — functional but still on the old styling).

## 8. To go live

1. Revert the local maintenance override — `MAINTENANCE` back to `true` in `+layout.svelte` until launch, or flip to `false` deliberately when ready (Renato's call).
2. Optional: drop the backward-compat token aliases in `tokens.css` once `/admin` is ported and no page references the old `--fg/--surface/...` names.
3. Hygiene: remove the unused Svelte-orange `src/lib/assets/favicon.svg`; drop `vercel.json`; gitignore `supabase/.temp/`.

## 9. Note on the brand skill

Cold monochrome is **already compliant** with `vnta-brand` — no skill amendment
needed (that was only required for the abandoned warm direction).
