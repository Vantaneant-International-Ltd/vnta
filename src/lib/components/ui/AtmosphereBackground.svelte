<script lang="ts">
	// Decorative, aria-hidden premium background. CSS only: no images, no canvas.
	// Stacks bloom + sheen + grain + vignette, each tuned via the --atmo-* tokens
	// in src/lib/styles/tokens.css. pointer-events:none, so it never intercepts
	// interactive elements. Mount it once behind a page's content.
</script>

<div class="atmo" aria-hidden="true">
	<div class="atmo__bloom"></div>
	<div class="atmo__sheen"></div>
	<div class="atmo__grain"></div>
	<div class="atmo__vignette"></div>
</div>

<style>
	.atmo {
		position: fixed;
		inset: 0;
		/* Behind all in-flow content; the opaque header/footer bands cover it, so
		   it reads only through the transparent hero and body sections. */
		z-index: -1;
		pointer-events: none;
		overflow: hidden;
	}

	/* BLOOM — large, heavily feathered cool near-white light, off-centre. */
	.atmo__bloom {
		position: absolute;
		inset: -25%;
		background: radial-gradient(
			42% 42% at var(--atmo-bloom-x) var(--atmo-bloom-y),
			rgba(var(--atmo-bloom-color), var(--atmo-bloom-opacity)) 0%,
			rgba(var(--atmo-bloom-color), calc(var(--atmo-bloom-opacity) * 0.4)) 34%,
			rgba(var(--atmo-bloom-color), 0) 70%
		);
		will-change: transform;
		animation: atmo-drift 32s var(--ease) infinite;
	}

	/* SHEEN — one faint directional axis, second light source. */
	.atmo__sheen {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			122deg,
			rgba(var(--atmo-bloom-color), 0) 38%,
			rgba(var(--atmo-bloom-color), var(--atmo-sheen-opacity)) 62%,
			rgba(var(--atmo-bloom-color), 0) 82%
		);
	}

	/* GRAIN — inline SVG fractalNoise, blended. No external asset. */
	.atmo__grain {
		position: absolute;
		inset: 0;
		opacity: var(--atmo-grain-opacity);
		mix-blend-mode: soft-light;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 160px 160px;
	}

	/* VIGNETTE — darken toward the edges for depth. */
	.atmo__vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			120% 120% at 50% 42%,
			transparent 52%,
			rgba(0, 0, 0, var(--atmo-vignette-strength)) 100%
		);
	}

	@keyframes atmo-drift {
		0%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(1.8%, -1.4%, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.atmo__bloom {
			animation: none;
		}
	}
</style>
