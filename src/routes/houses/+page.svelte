<script lang="ts">
	const houses = [
		{
			name: 'Maison Seul',
			status: 'Coming 2027',
			domain: 'maisonseul.ie',
			href: '',
			live: false,
			description:
				'A house built around restraint, form, and cultural permanence. Maison Seul moves slowly. Designed for longevity, not velocity.'
		},
		{
			name: 'Eirvox',
			status: 'Launching Summer 2026',
			domain: 'eirvox.ie',
			href: 'https://eirvox.ie',
			live: true,
			description:
				'Communications and signal, emerging from VNTA. Eirvox works in voice, narrative, and modern transmission. Built to scale quietly.'
		},
		{
			name: 'Vendr',
			status: 'In Progress · March 2026',
			domain: 'vendr.ie',
			href: 'https://vendr.ie',
			live: true,
			description:
				'Vendr is under active development. A commerce-led venture built with operational clarity, modern distribution, and brand-first thinking.'
		}
	];
</script>

<svelte:head>
	<title>Houses · VNTA</title>
	<meta
		name="description"
		content="The houses under VNTA. Maison Seul, Eirvox, and Vendr. Independent ventures developed with long-term intent."
	/>
	<meta property="og:title" content="Houses · VNTA" />
	<meta property="og:description" content="Independent ventures developed under VNTA with long-term intent." />
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<!-- HERO (editorial) -->
		<section class="hero">
			<h1 class="title">Houses</h1>
			<p class="lede">
				VNTA develops and stewards a small number of independent houses. Each with its own rhythm,
				market, and horizon.
			</p>
		</section>

		<!-- STATEMENT (big soft panel) -->
		<section class="statement" aria-label="Statement">
			<p>
				Not a portfolio.<br />
				A lineage.
			</p>
		</section>

		<!-- LIST (editorial rows, not cards) -->
		<section class="section" aria-label="VNTA Houses">
			<div class="rows">
				{#each houses as h (h.name)}
					<article class="row">
						<div class="row-top">
							<div class="row-left">
								<h2 class="row-name">{h.name}</h2>
								<span class="row-status">{h.status}</span>
							</div>

							{#if h.live}
								<a class="row-domain" href={h.href} target="_blank" rel="noreferrer" aria-label={`Open ${h.domain}`}>
									<span class="row-domain__text">{h.domain}</span>
									<span class="row-domain__arrow" aria-hidden="true">↗</span>
								</a>
							{:else}
								<span class="row-domain row-domain--soon">
									<span class="row-domain__text">{h.domain}</span>
								</span>
							{/if}
						</div>

						<p class="row-desc">{h.description}</p>
					</article>
				{/each}
			</div>

			<p class="footnote">
				Release windows are indicative and may shift. Marks reflect current filing status. Maison Seul® · Eirvox™ · Vendr™.
			</p>
		</section>
	</div>
</main>

<style>
	/* HERO */
	.hero {
		margin-bottom: 56px;
	}

	.title {
		font-family: var(--font-display);
		font-size: var(--t-h1);
		font-weight: 400;
		margin: 0 0 clamp(20px, 3vw, 32px);
		letter-spacing: var(--track-tight);
		line-height: 1.02;
	}

	.lede {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink);
		max-width: 56ch;
	}

	/* STATEMENT — open, hairline-framed, no panel */
	.statement {
		margin: var(--section-y) 0;
		padding: clamp(36px, 5vw, 56px) 0;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}

	.statement p {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h2);
		line-height: 1.12;
		color: var(--ink);
		letter-spacing: var(--track-tight);
	}

	/* SECTION */
	.section {
		margin-bottom: 72px;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-top: 1px solid var(--line-soft);
	}

	/* Each row is editorial (no card box) */
	.row {
		padding: 26px 0;
		border-bottom: 1px solid var(--line-soft);
	}

	.row-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 18px;
	}

	.row-left {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}

	.row-name {
		margin: 0;
		font-size: 1.22rem;
		font-weight: 650;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.row-status {
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-50);
		white-space: nowrap;
	}

	/* Right-side domain — plain editorial link, underline on hover */
	.row-domain {
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		text-decoration: none;
	}

	.row-domain__text {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: lowercase;
		color: var(--ink-50);
		border-bottom: 1px solid transparent;
		padding-bottom: 2px;
		transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}

	.row-domain__arrow {
		font-size: 0.8rem;
		color: var(--ink-35);
	}

	/* Pre-launch house: domain shown, not linked (no live site yet). */
	.row-domain--soon {
		opacity: 0.55;
		cursor: default;
	}

	.row-domain:hover .row-domain__text {
		color: var(--ink);
		border-bottom-color: var(--line);
	}

	.row-desc {
		margin: 12px 0 0;
		color: var(--ink-85);
		line-height: 1.7;
		max-width: 960px;
		font-size: 0.98rem;
	}

	.footnote {
		margin: 18px 0 0;
		color: var(--ink-35);
		font-size: 0.82rem;
		line-height: 1.55;
		max-width: 80ch;
	}

	@media (max-width: 768px) {
		.statement {
			padding: 28px 22px;
			border-radius: var(--radius);
		}

		.row-top {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}

		.row-domain {
			padding: 7px 9px;
		}
	}
</style>
