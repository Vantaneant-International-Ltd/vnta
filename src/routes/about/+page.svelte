<script lang="ts">
	const pillars = [
		{
			title: 'Leadership',
			body: 'VNTA does not advise from the sidelines. We set direction, make decisions, and lead the work forward.'
		},
		{
			title: 'Operating',
			body: 'Cadence, clarity, and accountability. Weekly alignment and monthly deliverables that compound over time.'
		},
		{
			title: 'Taste + Systems',
			body: 'High standards, strong narrative, and a brand operating system the team can run without us.'
		}
	];
</script>

<svelte:head>
	<title>The Studio — VNTA</title>
	<meta
		name="description"
		content="VNTA is a brand leadership studio operating in residence with founders for 12 months."
	/>
</svelte:head>

<main class="page-container">
	<section class="hero content-width">
		<h1 class="title">The Studio</h1>
		<p class="subtitle">Vantanéant International Ltd</p>

		<p class="lede">
			VNTA is a brand leadership studio operating in residence with founders. We lead direction,
			coordinate teams, and execute against clear monthly deliverables over a 12-month engagement —
			so businesses scale with clarity, not chaos.
		</p>

		<p class="note">Selected work and references available on request.</p>
	</section>

	<section class="section content-width">
		<div class="grid">
			{#each pillars as item}
				<div class="card">
					<h3>{item.title}</h3>
					<p>{item.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="cta content-width">
		<div class="cta-inner">
			<div class="cta-text">
				<h2>Contact</h2>
				<p>If you’re building something serious, start a conversation.</p>
			</div>
			<a class="btn-primary" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>
		</div>
	</section>
</main>

<style>
	.hero {
		margin-bottom: 64px;
	}

	.title {
		font-family: 'Playfair Display', serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1.125rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.65);
		margin: 0 0 2.25rem;
	}

	.lede {
		margin: 0 0 14px;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 860px;
	}

	.note {
		margin: 0;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.95rem;
	}

	.section {
		margin: 0 0 72px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.card {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 24px 22px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent);
		transition: all 0.25s ease;
	}

	.card:hover {
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(255, 255, 255, 0.06);
	}

	.card h3 {
		margin: 0 0 10px;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.card p {
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.65;
	}

	.cta {
		margin: 0 0 72px;
	}

	.cta-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 22px 24px;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
	}

	.cta-text h2 {
		margin: 0 0 8px;
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		font-weight: 600;
	}

	.cta-text p {
		margin: 0;
		color: rgba(255, 255, 255, 0.65);
		line-height: 1.6;
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.cta-inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
