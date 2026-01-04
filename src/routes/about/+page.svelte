<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Engagement Model — VNTA</title>
	<meta
		name="description"
		content="A–Z brand leadership in residence. VNTA leads strategy, teams, and execution for 12 months."
	/>
</svelte:head>

<main class="page-container">
	<header class="header content-width">
		<a href="{base}/" class="logo-link">
			<picture class="logo">
				<source srcset="{base}/main-dark.png" media="(prefers-color-scheme: dark)" />
				<img src="{base}/main-dark.png" alt="VNTA" width="120" height="120" />
			</picture>
		</a>
	</header>

	<section class="hero content-width">
		<p class="eyebrow">Engagement Model</p>
		<h1>A–Z Brand Leadership</h1>

		<p class="lede">
			VNTA operates as brand leadership in residence.
			We provide A–Z handling so founders can focus on their craft
			while we lead strategy, execution, and the people behind it.
		</p>
	</section>

	<section class="statement content-width">
		<p>
			This is not advisory.
			<br />
			This is leadership.
		</p>
	</section>

	<section class="body content-width">
		<p>
			Each engagement runs for 12 months.
			During this time, VNTA leads brand direction, coordinates specialist teams,
			and maintains clarity across every decision and deliverable.
		</p>

		<p>
			By the end, clients leave with a scaled business,
			clear monthly execution rhythms,
			and a team that continues to function without VNTA.
		</p>
	</section>

	<section class="cta content-width">
		<a href="{base}/pricing" class="btn-primary">View Packages</a>
	</section>

	<div class="footer-section content-width">
		<a href="{base}/" class="secondary-logo-link">
			<picture class="secondary-logo">
				<source srcset="{base}/secondary-dark.png" media="(prefers-color-scheme: dark)" />
				<img src="{base}/secondary-dark.png" alt="VNTA" width="200" height="60" />
			</picture>
		</a>
		<a href="mailto:studio@vnta.xyz" class="email-link">studio@vnta.xyz</a>
	</div>
</main>

<style>
	.header {
		margin-bottom: 48px;
	}

	.hero {
		margin-bottom: 64px;
	}

	.eyebrow {
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 16px;
	}

	h1 {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.4rem, 4vw, 3.4rem);
		margin: 0 0 24px;
		letter-spacing: -0.015em;
	}

	.lede {
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	.statement {
		margin: 72px 0;
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		line-height: 1.4;
		color: rgba(255, 255, 255, 0.9);
	}

	.body {
		max-width: 820px;
		margin-bottom: 80px;
	}

	.body p {
		font-size: 1rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 24px;
	}

	.cta {
		margin-bottom: 80px;
	}
</style>
