<script lang="ts">
	const pillars = [
		{
			n: '01',
			title: 'Leadership',
			body: 'VNTA does not advise from the sidelines. We set direction, make decisions, and lead the work forward, accountable to the outcome, not the deck.'
		},
		{
			n: '02',
			title: 'Operating',
			body: 'Cadence, clarity, and accountability. Weekly alignment and monthly deliverables that compound into a business that runs without us.'
		},
		{
			n: '03',
			title: 'Taste & Systems',
			body: 'High standards, a strong narrative, and a brand operating system the team can run long after the engagement closes.'
		}
	];
</script>

<svelte:head>
	<title>The Studio · VNTA</title>
	<meta
		name="description"
		content="VNTA is a brand leadership studio operating in residence with founders for twelve months."
	/>
	<meta property="og:title" content="The Studio · VNTA" />
	<meta
		property="og:description"
		content="VNTA is a brand leadership studio operating in residence with founders for twelve months."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<!-- HERO -->
	<header class="hero">
		<div class="hero__meta">
			<span class="eyebrow">The Company</span>
			<span class="eyebrow">Vantanéant International Ltd</span>
		</div>

		<h1 class="hero__title">The Studio</h1>

		<p class="hero__lede">
			VNTA is a brand leadership studio that operates in residence with founders. We set
			direction, coordinate teams, and ship to clear monthly deliverables across a twelve-month
			engagement. The business comes out of it scaled, with structure in place.
		</p>

		<p class="hero__note">Selected work and references available on request.</p>
	</header>

	<hr class="rule" />

	<!-- DISCIPLINES -->
	<section class="disciplines" aria-label="How VNTA operates">
		<div class="disciplines__head">
			<span class="eyebrow">How we operate</span>
			<span class="eyebrow">Three disciplines</span>
		</div>

		<div class="cols">
			{#each pillars as p}
				<article class="col">
					<span class="col__n">{p.n}</span>
					<h2 class="col__title">{p.title}</h2>
					<p class="col__body">{p.body}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- STATEMENT -->
	<section class="statement" aria-label="Statement">
		<span class="eyebrow statement__label">In residence · 12 months</span>
		<p class="statement__body">
			One engagement at a time. We take a single house from intent to operating system,
			<span class="muted">then we hand it the keys.</span>
		</p>
	</section>

	<!-- CONTACT -->
	<section class="contact" aria-label="Contact">
		<div class="contact__row">
			<div>
				<span class="eyebrow">Contact</span>
				<p class="contact__line">If you are building something serious, start a conversation.</p>
			</div>
			<a class="btn-primary" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>
		</div>
	</section>
</main>

<style>
	/* HERO */
	.hero {
		max-width: 920px;
	}

	.hero__meta {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(28px, 4vw, 44px);
	}

	.hero__title {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: var(--t-h1);
		letter-spacing: var(--track-tight);
		line-height: 1.02;
		margin: 0 0 clamp(24px, 3vw, 36px);
		color: var(--ink);
	}

	.hero__lede {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink);
		max-width: 60ch;
	}

	.hero__note {
		margin: clamp(20px, 3vw, 28px) 0 clamp(40px, 6vw, 72px);
		font-size: 0.95rem;
		color: var(--ink-50);
	}

	/* DISCIPLINES — open columns, hairline-indexed, no cards */
	.disciplines {
		padding-top: clamp(40px, 5vw, 64px);
	}

	.disciplines__head {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(36px, 5vw, 56px);
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(24px, 4vw, 56px);
	}

	.col {
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}

	.col__n {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		color: var(--ink-50);
	}

	.col__title {
		margin: 16px 0 14px;
		font-size: var(--t-h4);
		color: var(--ink);
	}

	.col__body {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--ink-70);
	}

	/* STATEMENT */
	.statement {
		display: grid;
		grid-template-columns: minmax(140px, 0.5fr) 1.5fr;
		gap: clamp(24px, 5vw, 64px);
		align-items: start;
		padding: var(--section-y) 0;
		margin-top: var(--section-y);
		border-top: 1px solid var(--line);
	}

	.statement__label {
		padding-top: 0.5em;
	}

	.statement__body {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.3;
		color: var(--ink);
		max-width: 26ch;
	}

	.statement__body .muted {
		color: var(--ink-35);
	}

	/* CONTACT */
	.contact {
		padding-top: clamp(40px, 5vw, 64px);
		border-top: 1px solid var(--line-soft);
	}

	.contact__row {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}

	.contact__line {
		margin: 12px 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink);
		max-width: 34ch;
	}

	@media (max-width: 768px) {
		.cols {
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.statement {
			grid-template-columns: 1fr;
			gap: 14px;
		}

		.contact__row {
			align-items: stretch;
		}
	}
</style>
