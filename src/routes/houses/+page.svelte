<script lang="ts">
	const houses = [
		{
			name: 'Maison Seul',
			status: 'Coming 2027',
			description:
				'A future-facing house focused on restraint, form, and cultural permanence. Maison Seul is intentionally slow — built for longevity, not velocity.'
		},
		{
			name: 'Eirvox',
			status: 'Launching Summer 2026',
			description:
				'A communications and signal platform emerging from VNTA. Eirvox explores voice, narrative, and modern transmission — designed to scale quietly.'
		},
		{
			name: 'Vendr',
			status: 'In Progress · March 2026',
			description:
				'Vendr is currently under active development. A commerce-led venture built with operational clarity, modern distribution, and brand-first thinking.'
		}
	];
</script>

<svelte:head>
	<title>Houses — VNTA</title>
	<meta
		name="description"
		content="The houses under VNTA: Maison Seul, Eirvox, and Vendr. Independent ventures developed with long-term intent."
	/>
	<meta property="og:title" content="Houses — VNTA" />
	<meta
		property="og:description"
		content="Independent ventures developed under VNTA with long-term intent."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<!-- HERO -->
		<section class="hero">
			<h1 class="title">Houses</h1>
			<p class="lede">
				VNTA develops and stewards a small number of independent houses — each with its own
				rhythm, market, and horizon.
			</p>
		</section>

		<!-- STATEMENT -->
		<section class="statement">
			<p>
				Not a portfolio.<br />
				A lineage.
			</p>
		</section>

		<!-- HOUSES LIST -->
		<section class="section">
			<div class="houses">
				{#each houses as h}
					<article class="house">
						<div class="house-head">
							<h2>{h.name}</h2>
							<span class="house-status">{h.status}</span>
						</div>

						<p class="house-description">{h.description}</p>
					</article>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	/* Hero */
	.hero {
		margin-bottom: 56px;
	}

	.title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.6rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 0.75rem;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.78);
		max-width: 780px;
	}

	/* Statement */
	.statement {
		margin: 0 0 72px;
		padding: 28px 32px;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05),
			rgba(255, 255, 255, 0.02)
		);
		backdrop-filter: blur(10px);
	}

	.statement p {
		margin: 0;
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.92);
		letter-spacing: -0.01em;
	}

	/* Houses */
	.section {
		margin-bottom: 72px;
	}

	.houses {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.house {
		padding-top: 28px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.house:first-child {
		border-top: none;
		padding-top: 0;
	}

	.house-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: 10px;
	}

	.house-head h2 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.house-status {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		white-space: nowrap;
	}

	.house-description {
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.65;
		max-width: 900px;
	}

	@media (max-width: 768px) {
		.statement {
			padding: 22px 20px;
		}

		.statement p {
			font-size: 1.5rem;
		}

		.house-head {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
		}
	}
</style>
