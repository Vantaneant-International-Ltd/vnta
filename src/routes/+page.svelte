<script lang="ts">
	import { base } from '$app/paths';
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
		<picture class="logo">
			<source srcset="{base}/main-dark.png" media="(prefers-color-scheme: dark)" />
			<img src="{base}/main-dark.png" alt="VNTA" width="120" height="120" />
		</picture>

		<div class="nav-wrap">
			<nav class="nav" aria-label="Primary">
				<a class="nav-link" href="{base}/about">About</a>
				<a class="nav-link" href="{base}/explore">Explore</a>
				<a class="nav-link" href="{base}/pricing">Packages</a>
			</nav>
			<span class="coming-soon" aria-label="Status: Coming soon">Coming Soon</span>
		</div>
	</header>

	<section class="hero content-width">
		<p class="eyebrow">Vantanéant International Ltd</p>
		<h1>Brand Leadership in Residence</h1>
		<p class="lede">
			We're the visionaries & operators. Founders focus on their passion; we lead, guide, and
			execute the strategy, team, and brand for 12 months. At the end, they have a scaled
			business with clear monthly deliverables and a high-functioning team (small or big).
		</p>

		<a href="{base}/explore" class="btn-primary">Explore</a>
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

	<div class="footer-section content-width">
		<a href="{base}/" class="secondary-logo-link">
			<picture class="secondary-logo">
				<source srcset="{base}/secondary-dark.png" media="(prefers-color-scheme: dark)" />
				<img src="{base}/secondary-dark.png" alt="VNTA" width="200" height="60" />
			</picture>
		</a>
		<a href="mailto:studio@vnta.xyz" class="email-link">{contactEmail}</a>
	</div>
</main>

<style>
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 44px;
		position: relative;
		z-index: 1;
	}

	/* NEW: nav links + status badge */
	.nav-wrap {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	/* Text-only links */
	.nav-link {
		font-size: 0.78rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 600;
		text-decoration: none;
		padding: 6px 0;
		position: relative;
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: rgba(255, 255, 255, 0.92);
	}

	/* subtle underline on hover (premium, not noisy) */
	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0px;
		width: 100%;
		height: 1px;
		background: rgba(255, 255, 255, 0.35);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.2s ease;
	}

	.nav-link:hover::after {
		transform: scaleX(1);
	}

	/* Status badge only */
	.coming-soon {
		font-size: 0.78rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 600;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(10px);
		white-space: nowrap;
	}

	.hero {
		position: relative;
		z-index: 1;
		line-height: 1.6;
		margin-bottom: 44px; /* reduced to keep page short */
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
		margin: 0 0 22px; /* tighter */
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	/* Keypoint kept, but slightly tighter to reduce scroll */
	.keypoint {
		margin-top: 28px;
		position: relative;
		z-index: 1;
		margin-bottom: 0;
	}

	.keypoint__body {
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 22px 26px; /* tighter */
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

	/* Make header wrap nicely on mobile */
	@media (max-width: 720px) {
		.top {
			gap: 16px;
			align-items: flex-start;
		}

		.nav-wrap {
			flex-wrap: wrap;
			justify-content: flex-end;
			row-gap: 10px;
		}

		.nav {
			gap: 14px;
		}
	}
</style>
