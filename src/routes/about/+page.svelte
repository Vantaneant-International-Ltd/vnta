<script lang="ts">
	import { base } from '$app/paths';

	let showFelixto = false;
</script>

<svelte:head>
	<title>About — VNTA</title>
	<meta
		name="description"
		content="VNTA provides 12-month brand leadership in residence. We lead strategy, teams, and execution so founders can scale with clarity."
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
		<p class="eyebrow">About VNTA</p>
		<h1>We lead from the inside.</h1>
		<p class="lede">
			VNTA (Vantanéant International Ltd) operates as brand leadership in residence.
			We don’t advise from the sidelines — we embed, lead, and guide businesses
			through a focused 12-month engagement.
		</p>
	</section>

	<section class="content-block content-width">
		<h2>What we do</h2>
		<p>
			VNTA exists for founders who know their craft but don’t want to manage brand,
			teams, and execution alone.
		</p>

		<ul class="list">
			<li>Define and protect the long-term vision</li>
			<li>Lead brand strategy, positioning, and narrative</li>
			<li>Assemble, coordinate, and motivate creative and operational teams</li>
			<li>Oversee monthly deliverables and execution across all disciplines</li>
			<li>Replace fragmentation with structure, rhythm, and momentum</li>
		</ul>

		<p>
			Founders stay focused on their passion. We handle the detail, the people,
			and the process.
		</p>
	</section>

	<section class="content-block content-width">
		<h2>How we work</h2>
		<p>
			Each engagement runs for 12 months. During this time, VNTA operates as an
			external brand director and leadership layer.
		</p>

		<p>
			By the end of the engagement, clients leave with:
		</p>

		<ul class="list">
			<li>A clearly positioned brand with defined direction</li>
			<li>Structured monthly execution and repeatable systems</li>
			<li>A trusted creative and operational team (small or large)</li>
			<li>Clarity, momentum, and room to scale</li>
		</ul>
	</section>

	<section class="content-block content-width">
		<h2>Our studio network</h2>
		<p>
			VNTA collaborates with a tightly curated network of specialists. These are not
			vendors — they are long-term partners we trust and lead.
		</p>

		<p>
			<strong class="interactive" on:click={() => (showFelixto = true)}>
				Felixto Brandworks
			</strong>
			is our in-house brand design studio, based in Dublin, Ireland. Felixto handles
			brand identity systems, visual language, and design execution across VNTA
			engagements.
		</p>
	</section>

	<section class="cta content-width">
		<a href="{base}/pricing" class="btn-primary">View Engagement Packages</a>
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

{#if showFelixto}
	<div class="overlay" on:click={() => (showFelixto = false)}>
		<div class="modal" on:click|stopPropagation>
			<h3>Felixto Brandworks</h3>

			<p>
				Felixto Brandworks is VNTA’s in-house brand design studio, operating from
				Dublin, Ireland.
			</p>

			<ul class="list compact">
				<li>Brand identity & visual systems</li>
				<li>Design direction & guidelines</li>
				<li>Digital and physical brand execution</li>
			</ul>

			<a
				href="https://felixtobrandworks.com"
				target="_blank"
				rel="noopener"
				class="external-link"
			>
				Visit Studio ↗
			</a>

			<button class="close" on:click={() => (showFelixto = false)}>
				Close
			</button>
		</div>
	</div>
{/if}

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
	}

	.lede {
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	.content-block {
		margin-bottom: 64px;
		max-width: 820px;
	}

	.content-block h2 {
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		margin-bottom: 16px;
	}

	.content-block p {
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.7;
		margin-bottom: 16px;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 24px 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.list li::before {
		content: '→ ';
		color: rgba(255, 255, 255, 0.4);
	}

	.list.compact {
		gap: 8px;
	}

	.interactive {
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.3);
	}

	.cta {
		margin: 80px 0;
	}

	/* Modal */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.modal {
		background: #0e0e0e;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 18px;
		padding: 32px;
		max-width: 520px;
		width: 90%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.modal h3 {
		font-family: 'Playfair Display', serif;
		margin-top: 0;
	}

	.external-link {
		display: inline-block;
		margin-top: 16px;
	}

	.close {
		margin-top: 24px;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
	}
</style>
