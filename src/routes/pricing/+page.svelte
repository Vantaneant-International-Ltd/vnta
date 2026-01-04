<script lang="ts">
	const packages = [
		{
			name: 'FOUNDATION',
			price: '€667',
			period: '/month ',
			oneTime: 'or €7,299 one-time',
			features: [
				'Brand strategy, positioning, identity',
				'Team coordination & creative direction',
				'Monthly deliverables & oversight',
				'Complimentary 3-month post-service for new clients'
			]
		},
		{
			name: 'GROWTH',
			price: '€1,083',
			period: '/month ',
			oneTime: 'or €11,999 one-time',
			features: [
				'Everything in FOUNDATION + advanced positioning',
				'Narrative, campaigns, content & marketing alignment',
				'Team motivation & performance oversight',
				'Monthly rhythm & momentum building'
			],
			featured: true
		},
		{
			name: 'SIGNATURE',
			price: '€1,500',
			period: '/month ',
			oneTime: 'or €15,999 one-time',
			features: [
				'Everything in GROWTH + long-term brand/business architecture',
				'Market expansion & flagship initiatives',
				'Full leadership advisory',
				'VNTA as external Brand Director / Vision Steward'
			]
		}
	];

	const retainers = [
		{
			name: 'Continuity',
			price: '€750/m',
			description: 'Monthly strategic call, oversight'
		},
		{
			name: 'Oversight',
			price: '€1,250/m',
			description: 'Bi-monthly calls, team guidance, priority access'
		},
		{
			name: 'Stewardship',
			price: '€1,750–€2,000/m',
			description: 'Full vision leadership & brand direction',
			inviteOnly: true
		}
	];
</script>

<svelte:head>
	<title>Packages — VNTA</title>
	<meta
		name="description"
		content="Baseline engagement structures for brand leadership in residence. Most engagements are tailored."
	/>
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<h1 class="title">Packages</h1>

		<p class="subtitle">
			12 months of brand leadership in residence.
			<span class="subtitle-note">
				Most engagements are tailored. The packages below represent baseline structures used to anchor
				scope, cadence, and pricing.
			</span>
		</p>

		<!-- BASELINE TIERS -->
		<div class="packages">
			{#each packages as pkg}
				<div class="package" class:featured={pkg.featured}>
					<div class="package-header">
						<h2>{pkg.name}</h2>
						<div class="pricing-options">
							<div class="price">
								{pkg.price}<span>{pkg.period}</span>
							</div>
							<div class="price-alt">{pkg.oneTime}</div>
						</div>
					</div>

					<ul class="features">
						{#each pkg.features as feature}
							<li>{feature}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- OPTIONAL RETAINERS -->
		<section class="retainers">
			<h2 class="section-title">Optional Post-Engagement Retainers</h2>
			<p class="section-note">After 12 months, new clients only</p>

			<div class="retainer-grid">
				{#each retainers as retainer}
					<div class="retainer">
						<h3>{retainer.name}</h3>
						<div class="retainer-price">{retainer.price}</div>
						{#if retainer.inviteOnly}
							<p class="invite">Invite-only</p>
						{/if}
						<p>{retainer.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- TAILORED ENGAGEMENTS -->
		<section class="tailored">
			<h2 class="section-title">Tailored Engagements</h2>

			<p class="tailored-lede">
				Not every business requires full brand leadership in residence. Some engagements focus on a
				specific phase — refinement, repositioning, or go-to-market execution.
			</p>

			<div class="tailored-steps">
				<div class="tailored-step">
					<h3>Audit & Diagnosis</h3>
					<p>Focused review of brand, narrative, market context, and operating realities.</p>
				</div>

				<div class="tailored-step">
					<h3>Scoped Plan</h3>
					<p>Clear deliverables, timeline, ownership, and specialist partners if required.</p>
				</div>

				<div class="tailored-step">
					<h3>Execution</h3>
					<p>Led by VNTA, often in collaboration with trusted execution partners.</p>
				</div>
			</div>

			<div class="tailored-cta">
				<p>To discuss a tailored engagement:</p>
				<a href="mailto:studio@vnta.xyz" class="tailored-link">studio@vnta.xyz</a>
			</div>
		</section>
	</div>
</main>

<style>
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
		margin: 0 0 4rem;
	}

	.subtitle-note {
		display: block;
		margin-top: 0.75rem;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.55);
		max-width: 720px;
	}

	/* PACKAGES */
	.packages {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-bottom: 6rem;
	}

	.package {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 28px 24px;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), transparent);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.package.featured {
		border-color: rgba(255, 255, 255, 0.25);
		box-shadow: 0 8px 32px rgba(255, 255, 255, 0.08);
	}

	.package:hover {
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 12px 40px rgba(255, 255, 255, 0.1);
	}

	.package-header {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.package h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
	}

	.pricing-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.price {
		font-size: 2rem;
		font-weight: 700;
	}

	.price span {
		font-size: 1rem;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.6);
	}

	.price-alt {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.features li {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.85);
		padding-left: 1.5rem;
		position: relative;
		line-height: 1.6;
	}

	.features li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: rgba(255, 255, 255, 0.4);
	}

	/* RETAINERS */
	.retainers {
		margin-top: 6rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.section-title {
		font-family: 'Playfair Display', serif;
		font-size: 2rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.section-note {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0 0 3rem;
	}

	.retainer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 2rem;
	}

	.retainer {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 14px;
		padding: 20px 24px;
		background: rgba(255, 255, 255, 0.02);
		transition: all 0.25s ease;
	}

	.retainer:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.04);
		transform: translateY(-2px);
	}

	.retainer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 10px;
	}

	.retainer-price {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.retainer p {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		line-height: 1.6;
	}

	.invite {
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		margin-top: 10px;
	}

	/* TAILORED */
	.tailored {
		margin-top: 6rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tailored-lede {
		max-width: 720px;
		font-size: 1.0625rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0 0 3rem;
		line-height: 1.7;
	}

	.tailored-steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.75rem;
		margin-bottom: 3rem;
	}

	.tailored-step {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 18px;
		padding: 22px 24px;
		background: rgba(255, 255, 255, 0.02);
	}

	.tailored-step h3 {
		font-size: 1.15rem;
		font-weight: 600;
		margin: 0 0 10px;
	}

	.tailored-step p {
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		line-height: 1.65;
	}

	.tailored-cta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.tailored-cta p {
		margin: 0;
		color: rgba(255, 255, 255, 0.65);
	}

	.tailored-link {
		font-size: 0.95rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
		position: relative;
		text-decoration: none;
	}

	.tailored-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		width: 100%;
		height: 1px;
		background: rgba(255, 255, 255, 0.35);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.2s ease;
	}

	.tailored-link:hover::after {
		transform: scaleX(1);
	}

	@media (max-width: 768px) {
		.packages {
			grid-template-columns: 1fr;
		}
	}
</style>
