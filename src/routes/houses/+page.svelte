<script lang="ts">
	const houses = [
		{
			name: 'Maison Seul®',
			url: 'https://maisonseul.ie',
			tagline: 'A house of product, taste, and restraint.',
			status: 'Live'
		},
		{
			name: 'Eirvox™',
			url: 'https://eirvox.ie',
			tagline: 'Voice, systems, and signal — in progress.',
			status: 'In progress'
		},
		{
			name: 'Vendr™',
			url: 'https://vendr.ie',
			tagline: 'Commerce infrastructure with edge — in progress.',
			status: 'In progress'
		}
	];
</script>

<svelte:head>
	<title>Houses — VNTA</title>
	<meta
		name="description"
		content="Vantanéant International Ltd houses Maison Seul®, Eirvox™, and Vendr™."
	/>
	<meta property="og:title" content="Houses — VNTA" />
	<meta
		property="og:description"
		content="Vantanéant International Ltd houses Maison Seul®, Eirvox™, and Vendr™."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<section class="hero content-width">
		<p class="eyebrow">Vantanéant International Ltd</p>
		<h1>Houses</h1>
		<p class="lede">
			VNTA is built alongside a small set of independent houses — each with its own voice, discipline, and
			pace.
		</p>
	</section>

	<section class="list" aria-label="Houses list">
		<div class="list__inner">
			{#each houses as h}
				<a class="row" href={h.url} target="_blank" rel="noreferrer" aria-label={`Open ${h.name}`}>
					<div class="row__left">
						<div class="row__top">
							<span class="row__name">{h.name}</span>
							<span class="row__status">{h.status}</span>
						</div>
						<p class="row__tagline">{h.tagline}</p>
					</div>

					<div class="row__right" aria-hidden="true">
						<span class="row__url">{h.url.replace('https://', '')}</span>
						<span class="row__arrow">↗</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="note content-width" aria-label="Note">
		<p>
			Some houses are still being filed and refined. Marks reflect current status:
			Maison Seul® · Eirvox™ · Vendr™.
		</p>
	</section>
</main>

<style>
	.hero {
		position: relative;
		z-index: 1;
		line-height: 1.6;
		margin-bottom: 34px;
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
		font-size: clamp(2.2rem, 4vw, 3.2rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.78);
		max-width: 820px;
	}

	.list {
		margin-top: 34px;
		padding-top: 26px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.list__inner {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		padding: 18px 18px;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.02);
		transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
	}

	.row:hover {
		border-color: rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.03);
		transform: translateY(-1px);
	}

	.row__left {
		min-width: 0;
	}

	.row__top {
		display: flex;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
	}

	.row__name {
		font-weight: 700;
		letter-spacing: -0.01em;
		color: rgba(255, 255, 255, 0.92);
	}

	.row__status {
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		border: 1px solid rgba(255, 255, 255, 0.12);
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.18);
	}

	.row__tagline {
		margin: 10px 0 0;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.6;
		max-width: 64ch;
	}

	.row__right {
		display: inline-flex;
		align-items: baseline;
		gap: 10px;
		white-space: nowrap;
		color: rgba(255, 255, 255, 0.5);
	}

	.row__url {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		font-size: 0.78rem;
		letter-spacing: 0.18em;
		text-transform: lowercase;
		opacity: 0.75;
	}

	.row__arrow {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.note {
		margin-top: 28px;
		padding-top: 18px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
	}

	.note p {
		margin: 0;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.7;
		font-size: 0.95rem;
		max-width: 72ch;
	}

	@media (max-width: 768px) {
		.list__inner {
			padding: 0 24px;
		}

		.row {
			flex-direction: column;
			align-items: flex-start;
		}

		.row__right {
			gap: 8px;
		}
	}
</style>
