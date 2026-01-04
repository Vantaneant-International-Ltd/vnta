<script lang="ts">
	import { base } from '$app/paths';

	const pillars = [
		{
			title: 'Cadence',
			body: 'Weekly alignment, monthly deliverables, quarterly recalibration. A rhythm that makes progress predictable.'
		},
		{
			title: 'Leadership',
			body: 'Not advisory. We make decisions, set direction, and move work forward with your team (or ours).'
		},
		{
			title: 'Outcome',
			body: 'A brand operating system + a high-functioning team. By month 12, the work runs without VNTA.'
		}
	];

	const phases = [
		{
			title: 'Month 1–2',
			body: 'Diagnosis → positioning → narrative. We define what you are, who it’s for, and how it’s expressed.'
		},
		{
			title: 'Month 3–6',
			body: 'Execution system. We ship deliverables, coordinate specialists, and install a monthly momentum loop.'
		},
		{
			title: 'Month 7–9',
			body: 'Scale initiatives. Campaigns, distribution, partnerships, and flagship moves that widen the moat.'
		},
		{
			title: 'Month 10–12',
			body: 'Institutionalize. Documentation, team autonomy, handover, and a clear post-VNTA path.'
		}
	];

	const included = [
		'Brand strategy + positioning + narrative',
		'Creative direction + identity oversight',
		'Team coordination (internal + external specialists)',
		'Monthly deliverables with clear scope & ownership',
		'Decision-making support + priority problem-solving',
		'Documentation: systems, playbooks, and handover assets'
	];

	const notIncluded = [
		'Unlimited design requests / production studio work',
		'Paid media buying (we can guide strategy & coordination)',
		'Building complex dev products (we can lead brand direction)',
		'“Advice-only” arrangements without execution ownership'
	];

	const faqs = [
		{
			q: 'Who is this for?',
			a: 'Founders with strong craft who need leadership, structure, and execution momentum — and want a brand that scales without chaos.'
		},
		{
			q: 'Do you replace an internal team?',
			a: 'No. We lead and coordinate. Sometimes that means building the team; sometimes it means guiding the one you already have.'
		},
		{
			q: 'What do monthly deliverables look like?',
			a: 'Defined outcomes with owners and dates: brand assets, narrative systems, launch/campaign work, partnerships, or operational brand infrastructure — depending on phase.'
		},
		{
			q: 'What happens after 12 months?',
			a: 'You keep the system and the team. Optional retainers exist for continuity, oversight, or stewardship (invite-only for the highest tier).'
		}
	];
</script>

<svelte:head>
	<title>Engagement Model — VNTA</title>
	<meta
		name="description"
		content="A structured 12-month brand leadership framework: cadence, phases, deliverables, and outcomes."
	/>
	<meta property="og:title" content="Engagement Model — VNTA" />
	<meta
		property="og:description"
		content="A structured 12-month brand leadership framework: cadence, phases, deliverables, and outcomes."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="page-container">
	<header class="header">
		<a href="{base}/" class="logo-link" aria-label="Back to home">
			<picture class="logo">
				<source srcset="{base}/main-dark.png" media="(prefers-color-scheme: dark)" />
				<img src="{base}/main-dark.png" alt="VNTA" width="120" height="120" />
			</picture>
		</a>
	</header>

	<main class="content content-width">
		<section class="hero">
			<h1 class="title">Engagement Model</h1>
			<p class="subtitle">A–Z Brand Leadership in Residence</p>

			<p class="lede">
				A structured 12-month operating model designed to turn vision into a functioning brand system —
				with clear cadence, decision-making, and execution momentum.
			</p>
		</section>

		<section class="statement">
			<p>
				This is not advisory.
				<br />
				This is leadership.
			</p>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>How we operate</h2>
				<p>Three pillars that define the engagement.</p>
			</div>

			<div class="grid">
				{#each pillars as item}
					<div class="card">
						<h3>{item.title}</h3>
						<p>{item.body}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>12-month structure</h2>
				<p>Phased work that compounds. Each phase has different priorities and outputs.</p>
			</div>

			<div class="timeline">
				{#each phases as phase}
					<div class="timeline-card">
						<div class="phase-top">
							<span class="phase-pill">{phase.title}</span>
						</div>
						<p>{phase.body}</p>
					</div>
				{/each}
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>What’s included</h2>
				<p>What you’re actually getting — and what you’re not.</p>
			</div>

			<div class="split">
				<div class="panel">
					<h3>Included</h3>
					<ul class="list">
						{#each included as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>

				<div class="panel panel--muted">
					<h3>Not included</h3>
					<ul class="list">
						{#each notIncluded as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>FAQ</h2>
				<p>Common questions before starting.</p>
			</div>

			<div class="faq">
				{#each faqs as f}
					<details class="faq-item">
						<summary>{f.q}</summary>
						<p>{f.a}</p>
					</details>
				{/each}
			</div>
		</section>

		<section class="cta">
			<div class="cta-inner">
				<div class="cta-text">
					<h2>Ready to see packages?</h2>
					<p>Choose the level of leadership you need for the next 12 months.</p>
				</div>
				<a href="{base}/pricing" class="btn-primary">View Packages</a>
			</div>
		</section>

		<div class="footer-section">
			<a href="{base}/" class="secondary-logo-link">
				<picture class="secondary-logo">
					<source srcset="{base}/secondary-dark.png" media="(prefers-color-scheme: dark)" />
					<img src="{base}/secondary-dark.png" alt="VNTA" width="200" height="60" />
				</picture>
			</a>
			<a href="mailto:studio@vnta.xyz" class="email-link">studio@vnta.xyz</a>
		</div>
	</main>
</div>

<style>
	/* Header */
	.header {
		padding: 0 0 40px;
	}

	.logo-link {
		display: inline-block;
		transition: opacity 0.2s ease;
	}

	.logo-link:hover {
		opacity: 0.8;
	}

	/* Hero */
	.hero {
		margin-bottom: 56px;
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
		margin: 0 0 2.5rem;
	}

	.lede {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 820px;
	}

	/* Statement card (matches your keypoint aesthetic) */
	.statement {
		margin: 0 0 64px;
		padding: 28px 32px;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
	}

	.statement p {
		margin: 0;
		font-family: 'Playfair Display', serif;
		font-size: 1.75rem;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.92);
		letter-spacing: -0.01em;
	}

	/* Sections */
	.section {
		margin: 0 0 72px;
	}

	.section-head {
		margin-bottom: 24px;
	}

	.section-head h2 {
		margin: 0 0 10px;
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.section-head p {
		margin: 0;
		color: rgba(255, 255, 255, 0.65);
		max-width: 900px;
		line-height: 1.6;
	}

	/* Cards grid */
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

	/* Timeline */
	.timeline {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.timeline-card {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 22px 22px;
		background: rgba(255, 255, 255, 0.02);
		transition: all 0.25s ease;
	}

	.timeline-card:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.03);
		transform: translateY(-2px);
	}

	.phase-top {
		margin-bottom: 12px;
	}

	.phase-pill {
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.02);
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.85rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.timeline-card p {
		margin: 0;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.65;
	}

	/* Included / Not included split */
	.split {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.panel {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 22px 22px;
		background: rgba(255, 255, 255, 0.02);
	}

	.panel--muted {
		background: rgba(255, 255, 255, 0.015);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.panel h3 {
		margin: 0 0 14px;
		font-size: 1.1rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.list li {
		position: relative;
		padding-left: 1.5rem;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.6;
	}

	.list li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: rgba(255, 255, 255, 0.4);
	}

	/* FAQ */
	.faq {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.faq-item {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.02);
	}

	.faq-item summary {
		cursor: pointer;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		list-style: none;
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item p {
		margin: 12px 0 0;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.65;
		max-width: 900px;
	}

	/* CTA */
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

	/* Responsive */
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.timeline {
			grid-template-columns: 1fr;
		}

		.split {
			grid-template-columns: 1fr;
		}

		.cta-inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	@media (max-width: 768px) {
		.statement {
			padding: 22px 20px;
		}

		.statement p {
			font-size: 1.5rem;
		}
	}
</style>
