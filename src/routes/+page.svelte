<script lang="ts">
	const contactEmail = 'studio@vnta.xyz';
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
	<header class="top"> 
	<!-- <header class="top content-width">  -->
		<picture class="logo">
			<source srcset="/MAIN LIGHT.png" media="(prefers-color-scheme: dark)" />
			<img src="/MAIN DARK.png" alt="VNTA" width="120" height="120" />
		</picture>
		<span class="coming-soon">Coming Soon</span>
	</header>

	<section class="hero content-width">
		<p class="eyebrow">Vantáneant International Ltd</p>
		<h1>Brand Leadership in Residence</h1>
		<p class="lede">
			We're the visionaries & operators. Founders focus on their passion; we lead, guide, and
			execute the strategy, team, and brand for 12 months. At the end, they have a scaled
			business with clear monthly deliverables and a high-functioning team (small or big).
		</p>
	</section>

	<section class="keypoint content-width">
		<div class="keypoint__body">
			<h4>Key point</h4>
			<p>
				We don't "help" — we lead and operate. Founders stay in their zone of genius while we
				handle execution, team management, and strategy.
			</p>
		</div>
	</section>

	<a href="/pricing" class="btn-primary">View Packages</a>

	<div class="footer-section content-width">
		<a href="/" class="secondary-logo-link">
			<picture class="secondary-logo">
				<source srcset="/SECONDARY LIGHT.png" media="(prefers-color-scheme: dark)" />
				<img src="/SECONDARY DARK.png" alt="VNTA" width="200" height="60" />
			</picture>
		</a>
		<a href="mailto:studio@vnta.xyz" class="email-link">studio@vnta.xyz</a>
	</div>
</main>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 48px;
		position: relative;
		z-index: 1;
	}

	.coming-soon {
		font-size: 0.8125rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 600;
		padding: 8px 16px;
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(10px);
		align-self: center;
	}

	.hero {
		position: relative;
		z-index: 1;
		line-height: 1.6;
		margin-bottom: 64px;
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
		margin: 0 0 20px;
		font-size: clamp(2.4rem, 4vw, 3.4rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0 0 32px;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	.keypoint {
		margin-top: 56px;
		position: relative;
		z-index: 1;
		margin-bottom: 48px;
	}

	.keypoint__body {
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 28px 32px;
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

	.btn-primary {
		margin-bottom: 32px;
	}
</style>
