<script lang="ts">
	import { base } from '$app/paths';

	const partners = [
		{ name: 'MIKRON', src: `${base}/partners/mikron.svg` },
		{ name: 'Pomegranate', src: `${base}/partners/pomegranate.svg` },
		{ name: 'Garboosh', src: `${base}/partners/garboosh.svg` },
		{ name: 'Velo City', src: `${base}/partners/velocity.svg` }
	];

	// Duplicate once so the marquee can loop cleanly
	const track = [...partners, ...partners];
</script>

<svelte:head>
	<title>VNTA — Brand Leadership in Residence</title>
	<meta
		name="description"
		content="Visionaries & operators. We lead, guide, and execute strategy, team, and brand for 12 months."
	/>
	<meta property="og:title" content="VNTA — Brand Leadership in Residence" />
	<meta
		property="og:description"
		content="We lead, guide, and execute the strategy, team, and brand for 12 months so founders scale with clarity."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<section class="hero content-width">
		<p class="eyebrow">Vantanéant International Ltd</p>
		<h1>Brand Leadership in Residence</h1>
		<p class="lede">
			We're the visionaries & operators. Founders focus on their passion; we lead, guide, and execute the
			strategy, team, and brand for 12 months. At the end, they have a scaled business with clear monthly
			deliverables and a high-functioning team (small or big).
		</p>

		<a href="{base}/explore" class="btn-primary">Explore</a>
	</section>

	<section class="keypoint content-width">
		<div class="keypoint__body">
			<h4>Key point</h4>
			<p>
				We don't "help" — we lead and operate. Founders stay in their zone of genius while we handle
				execution, team management, and strategy.
			</p>
		</div>
	</section>

	<!-- PARTNERS CAROUSEL -->
	<section class="partners" aria-label="Our partners">
		<div class="partners__inner">
			<h2 class="partners__title">Our Partners</h2>

			<div class="partners__rail" tabindex="0" aria-label="Partner logos">
				<div class="partners__track">
					{#each track as p, i (p.name + i)}
						<div class="partner-card">
							<img class="partner-logo" src={p.src} alt={p.name} loading="lazy" />
						</div>
					{/each}
				</div>
			</div>

			<p class="partners__hint">Scroll →</p>
		</div>
	</section>
</main>

<style>
	/* Page content only — header/nav is now in +layout.svelte */

	.hero {
		position: relative;
		z-index: 1;
		line-height: 1.6;
		margin-bottom: 44px;
	}

	.eyebrow {
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		margin: 0 0 16px;
		font-weight: 600;
	}

	h1 {
		margin: 0 0 18px;
		font-size: clamp(2.4rem, 4vw, 3.4rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0 0 22px;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	.keypoint {
		margin-top: 28px;
		position: relative;
		z-index: 1;
		margin-bottom: 0;
	}

	.keypoint__body {
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 22px 26px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
	}

	.keypoint h4 {
		margin: 0 0 10px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.85rem;
		font-weight: 600;
	}

	.keypoint p {
		margin: 0;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.65;
		font-size: 1rem;
	}

	/* --- PARTNERS --- */
	.partners {
		margin-top: 56px;
		padding-top: 34px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.partners__inner {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px;
	}

	.partners__title {
		margin: 0 0 18px;
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: rgba(255, 255, 255, 0.92);
	}

	/* rail = the visible window */
	.partners__rail {
		position: relative;
		overflow: hidden;
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(10px);
	}

	/* track = moving row */
	.partners__track {
		display: flex;
		gap: 18px;
		padding: 18px;
		width: max-content;
		animation: marquee 26s linear infinite;
		will-change: transform;
	}

	/* pause on hover/focus (feels premium + usable) */
	.partners__rail:hover .partners__track,
	.partners__rail:focus-within .partners__track {
		animation-play-state: paused;
	}

	/* each logo tile */
	.partner-card {
		width: 220px;
		height: 88px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(0, 0, 0, 0.2);
	}

	.partner-logo {
		max-width: 72%;
		max-height: 52%;
		opacity: 0.78;
		filter: grayscale(100%);
		transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease;
	}

	.partner-card:hover .partner-logo {
		opacity: 0.95;
		filter: grayscale(0%);
		transform: translateY(-1px);
	}

	.partners__hint {
		margin: 10px 0 0;
		font-size: 0.78rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}

	/* Respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.partners__track {
			animation: none;
		}
		.partners__rail {
			overflow-x: auto;
		}
		.partners__track {
			width: max-content;
		}
	}

	@media (max-width: 768px) {
		.partners__inner {
			padding: 0 24px;
		}

		.partner-card {
			width: 180px;
			height: 84px;
		}
	}
</style>
