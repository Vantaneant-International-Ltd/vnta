<script lang="ts">
	import { base } from '$app/paths';
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

		<!-- Aesthetic Gaeilge (single line) -->
		<p class="gaelic" lang="ga">Ceannaireacht branda, i gcroílár an ghnó — ar feadh 12 mhí.</p>

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
</main>

<style>
	/* Home only: tighten space before footer divider */
	:global(.page-container) {
		padding-bottom: 56px;
	}

	/* Page content only — header/nav is in +layout.svelte */
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
		margin: 0 0 14px;
		font-size: clamp(2.4rem, 4vw, 3.4rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.015em;
	}

	/* Aesthetic Gaeilge line (quiet, premium) */
	.gaelic {
		margin: 0 0 18px;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-size: 1.02rem;
		letter-spacing: -0.01em;
		color: rgba(255, 255, 255, 0.62);
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
</style>
