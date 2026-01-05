<script lang="ts">
	import { base } from '$app/paths';

	// No logos yet: keep this minimal + safe.
	// Use `href: null` to render a non-clickable cell.
	const partners: Array<{ name: string; href: string | null }> = [
		{ name: 'Felixto Brandworks', href: 'https://felixtobrandworks.com/' },
		{ name: '', href: null },
		{ name: '', href: null },
		{ name: '', href: null }
	];
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

	<!-- PARTNERS (STATIC GRID, NO LOGOS YET) -->
	<section class="partners" aria-label="Our partners">
		<div class="partners__frame">
			<div class="partners__grid" role="list">
				<div class="partners__label" role="listitem" aria-label="Our Partners label">
					<h2>Our<br />Partners</h2>
				</div>

				{#each partners as p}
					{#if p.href}
						<a
							role="listitem"
							class="partner-cell partner-cell--link"
							href={p.href}
							target="_blank"
							rel="noreferrer"
							aria-label={p.name}
						>
							<span class="partner-mark">{p.name}</span>
							<span class="partner-arrow" aria-hidden="true">↗</span>
						</a>
					{:else}
						<div role="listitem" class="partner-cell partner-cell--empty" aria-hidden="true">
							<span class="empty-mark">—</span>
						</div>
					{/if}
				{/each}
			</div>
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

	/* --- PARTNERS (STATIC) --- */
	.partners {
		margin-top: 56px;
		padding-top: 28px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.partners__frame {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px;
	}

	.partners__grid {
		display: grid;
		grid-template-columns: 1.1fr repeat(4, 1fr);
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.02);
		backdrop-filter: blur(10px);
		border-radius: 22px;
		overflow: hidden;
	}

	.partners__label {
		padding: 28px 26px;
		border-right: 1px solid rgba(255, 255, 255, 0.10);
		display: flex;
		align-items: center;
		min-height: 140px;
	}

	.partners__label h2 {
		margin: 0;
		font-size: 2rem;
		line-height: 1.05;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.92);
	}

	.partner-cell {
		min-height: 140px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid rgba(255, 255, 255, 0.10);
		background: rgba(0, 0, 0, 0.10);
		position: relative;
	}

	/* last column border off */
	.partner-cell:last-child {
		border-right: 0;
	}

	.partner-cell--link {
		transition: background 0.2s ease, transform 0.2s ease;
		gap: 10px;
	}

	.partner-cell--link:hover {
		background: rgba(255, 255, 255, 0.03);
		transform: translateY(-1px);
	}

	.partner-mark {
		font-size: 0.78rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.partner-arrow {
		color: rgba(255, 255, 255, 0.35);
		font-size: 0.9rem;
		transform: translateY(-1px);
	}

	.partner-cell--empty {
		cursor: default;
	}

	.empty-mark {
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.10);
	}

	@media (max-width: 980px) {
		.partners__grid {
			grid-template-columns: 1fr 1fr;
		}

		.partners__label {
			min-height: 120px;
			border-right: 1px solid rgba(255, 255, 255, 0.10);
			border-bottom: 1px solid rgba(255, 255, 255, 0.10);
		}

		.partners__label h2 {
			font-size: 1.6rem;
		}

		.partner-cell {
			min-height: 120px;
			border-right: 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.10);
		}
	}

	@media (max-width: 768px) {
		.partners__frame {
			padding: 0 24px;
		}

		.partners__grid {
			border-radius: 20px;
		}
	}

	@media (max-width: 520px) {
		.partners__grid {
			grid-template-columns: 1fr;
		}

		.partners__label {
			border-right: 0;
		}
	}
</style>
