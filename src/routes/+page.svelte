<script lang="ts">
	import { base } from '$app/paths';

	// §1.4 Brand Values — verbatim from VNTA Brand Guidelines v1.0.
	const values = [
		{ n: '01', name: 'Restraint', body: 'Strong brands are built through reduction, clarity, and careful decision-making — rather than excess.' },
		{ n: '02', name: 'Silence', body: 'Confidence without noise. Form, consistency, and presence in place of explanation.' },
		{ n: '03', name: 'Precision', body: 'Every decision is intentional, structured, and aligned with long-term strategic goals.' },
		{ n: '04', name: 'Timelessness', body: 'We avoid trends and focus on systems designed to remain relevant across years, not seasons.' }
	];

	// Maisons — stewarded under one system. Window dates per Horizon.
	const maisons = [
		{ n: '01', name: 'Vendr', body: 'A commerce-led venture. Operational clarity, modern distribution, brand-first thinking.', when: 'March 2026' },
		{ n: '02', name: 'Eirvox', body: 'Communications and signal. Voice, narrative, modern transmission — built to scale quietly.', when: 'Summer 2026' },
		{ n: '03', name: 'Maison Seul', body: 'Restraint, form, cultural permanence. Designed for longevity, not velocity.', when: '2027' }
	];
</script>

<svelte:head>
	<title>VNTA — A Modern Holding Company</title>
	<meta
		name="description"
		content="Vantanéant International — a modern holding company building and guiding premium maisons through strategy, design systems, and clear long-term direction."
	/>
	<meta property="og:title" content="VNTA — A Modern Holding Company" />
	<meta
		property="og:description"
		content="Building and guiding premium maisons through strategy, design systems, and clear long-term direction. Inspired by the restraint of groups such as LVMH and Alphabet."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="home">
	<!-- HERO -->
	<section class="hero">
		<div class="wrap">
			<div class="hero__meta">
				<span class="eyebrow">Vantanéant International Ltd</span>
				<span class="eyebrow">Est. MMXXV · Dublin</span>
			</div>

			<h1 class="vis-hidden">VNTA — a modern holding company building and guiding premium maisons.</h1>
			<img class="hero__wordmark" src="{base}/wordmark.svg" alt="" aria-hidden="true" />

			<hr class="rule" />

			<div class="hero__grid">
				<p class="lede">
					A modern holding company building and guiding premium maisons through strategy,
					design systems, and clear long-term direction.
				</p>

				<div class="hero__facts">
					<div class="fact">
						<span class="eyebrow">Engagement</span>
						<p>Twelve months · in residence</p>
					</div>
					<div class="fact">
						<span class="eyebrow">Availability</span>
						<p>One seat — Q3 2026</p>
					</div>
				</div>
			</div>

			<p class="gaelic" lang="ga">Áilleacht na díomhaointe.</p>
		</div>
	</section>

	<!-- AIM & VISION — §1.3 -->
	<section class="band">
		<div class="wrap statement">
			<span class="eyebrow statement__label">Aim &amp; Vision — 1.3</span>
			<p class="statement__body">
				A refined corporate platform where design, fashion, and strategy coexist under one
				disciplined and unified system.
				<span class="muted">
					Inspired by the authority and restraint of groups such as LVMH and Alphabet.
				</span>
			</p>
		</div>
	</section>

	<!-- BRAND VALUES — §1.4 -->
	<section class="band">
		<div class="wrap">
			<div class="band__head">
				<span class="eyebrow">Brand Values</span>
				<span class="eyebrow">01 — 04</span>
			</div>

			<hr class="rule" />

			<div class="values">
				{#each values as v}
					<article class="value">
						<span class="value__n">{v.n}</span>
						<h3 class="value__name">{v.name}</h3>
						<p class="value__body">{v.body}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- MAISONS — INDEX -->
	<section class="band">
		<div class="wrap">
			<div class="maisons__head">
				<span class="eyebrow">Maisons — Index</span>
				<h2 class="maisons__title">Quietly stewarded under one disciplined system.</h2>
			</div>

			<hr class="rule" />

			<ul class="register">
				{#each maisons as m}
					<li>
						<a class="row" href="{base}/houses">
							<span class="row__n">{m.n}</span>
							<span class="row__name">{m.name}</span>
							<span class="row__body">{m.body}</span>
							<span class="row__when eyebrow">{m.when}</span>
							<span class="row__arrow" aria-hidden="true">&rarr;</span>
						</a>
					</li>
				{/each}
			</ul>

			<div class="maisons__cta">
				<a href="{base}/horizon" class="btn-ghost">View the Horizon</a>
			</div>
		</div>
	</section>
</main>

<style>
	.vis-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.wrap {
		max-width: var(--maxw);
		margin: 0 auto;
		padding-left: 48px;
		padding-right: 48px;
	}

	/* --- Hero ------------------------------------------------------------- */
	.hero {
		padding: clamp(40px, 7vw, 84px) 0 clamp(48px, 6vw, 72px);
	}

	.hero__meta {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(28px, 5vw, 56px);
	}

	.hero__wordmark {
		display: block;
		width: clamp(260px, 72vw, 760px);
		height: auto;
		margin-bottom: clamp(26px, 4vw, 44px);
	}

	.rule {
		height: 1px;
		background: var(--line);
		border: 0;
		margin: 0;
	}

	.hero__grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: clamp(28px, 5vw, 72px);
		align-items: start;
		padding-top: clamp(26px, 4vw, 40px);
	}

	.lede {
		margin: 0;
		font-size: clamp(1.15rem, 1.7vw, 1.4rem);
		line-height: 1.5;
		color: var(--ink-92);
		max-width: 30ch;
		font-weight: 300;
	}

	.hero__facts {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
	}

	.fact p {
		margin: 10px 0 0;
		font-size: 1.02rem;
		color: var(--ink-80);
	}

	.gaelic {
		margin: clamp(32px, 5vw, 56px) 0 0;
		font-family: var(--font-display);
		font-size: 1.1rem;
		letter-spacing: 0.01em;
		color: var(--ink-55);
	}

	/* --- Bands ------------------------------------------------------------ */
	.band {
		padding: clamp(48px, 7vw, 96px) 0;
		border-top: 1px solid var(--line-soft);
	}

	/* Aim & Vision statement */
	.statement {
		display: grid;
		grid-template-columns: minmax(120px, 0.5fr) 1.5fr;
		gap: clamp(24px, 5vw, 64px);
		align-items: start;
	}

	.statement__label {
		padding-top: 0.6em;
	}

	.statement__body {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.32;
		color: var(--fg);
		max-width: 24ch;
	}

	.statement__body .muted {
		color: var(--ink-45);
	}

	/* Brand values */
	.band__head {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: 22px;
	}

	.values {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: clamp(20px, 3vw, 40px);
		padding-top: clamp(28px, 4vw, 48px);
	}

	.value__n {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		color: var(--ink-45);
	}

	.value__name {
		margin: 18px 0 12px;
		font-size: var(--t-h4);
		color: var(--fg);
	}

	.value__body {
		margin: 0;
		font-size: 0.96rem;
		line-height: 1.6;
		color: var(--ink-65);
	}

	/* Maisons register */
	.maisons__head {
		display: grid;
		grid-template-columns: minmax(120px, 0.5fr) 1.5fr;
		gap: clamp(24px, 5vw, 64px);
		align-items: baseline;
		margin-bottom: 22px;
	}

	.maisons__title {
		margin: 0;
		font-size: var(--t-h3);
		line-height: 1.18;
		color: var(--fg);
		max-width: 18ch;
	}

	.register {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.row {
		display: grid;
		grid-template-columns: 48px minmax(120px, 0.8fr) 2fr auto 28px;
		gap: clamp(18px, 3vw, 40px);
		align-items: center;
		padding: clamp(22px, 3vw, 30px) 0;
		border-bottom: 1px solid var(--line-soft);
		transition: padding-left 0.25s ease;
	}

	.row:hover {
		padding-left: 8px;
	}

	.row__n {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		color: var(--ink-45);
	}

	.row__name {
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--fg);
	}

	.row__body {
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink-65);
		max-width: 46ch;
	}

	.row__when {
		white-space: nowrap;
	}

	.row__arrow {
		justify-self: end;
		color: var(--ink-45);
		transition: color 0.25s ease, transform 0.25s ease;
	}

	.row:hover .row__arrow {
		color: var(--fg);
		transform: translateX(4px);
	}

	.maisons__cta {
		margin-top: clamp(32px, 4vw, 48px);
	}

	/* --- Responsive: keep mobile cosy ------------------------------------ */
	@media (max-width: 900px) {
		.values {
			grid-template-columns: 1fr 1fr;
			gap: 28px;
		}
	}

	@media (max-width: 768px) {
		.wrap {
			padding-left: 24px;
			padding-right: 24px;
		}

		.hero__meta {
			flex-direction: column;
			gap: 6px;
		}

		.hero__grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.lede {
			max-width: none;
		}

		.statement,
		.maisons__head {
			grid-template-columns: 1fr;
			gap: 18px;
		}

		.values {
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.row {
			grid-template-columns: 36px 1fr;
			grid-template-areas:
				'n name'
				'. body'
				'. when';
			gap: 6px 16px;
			align-items: baseline;
		}

		.row__n {
			grid-area: n;
		}
		.row__name {
			grid-area: name;
		}
		.row__body {
			grid-area: body;
			margin-top: 6px;
		}
		.row__when {
			grid-area: when;
			margin-top: 10px;
		}
		.row__arrow {
			display: none;
		}

		.row:hover {
			padding-left: 0;
		}
	}
</style>
