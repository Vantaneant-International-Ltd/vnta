<svelte:head>
	<title>Approach · VNTA</title>
	<meta
		name="description"
		content="How VNTA approaches brand leadership, advisory work, and long-horizon positioning."
	/>
	<meta property="og:title" content="Approach · VNTA" />
	<meta
		property="og:description"
		content="How VNTA approaches brand leadership, advisory work, and long-horizon positioning."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main class="page-container">
	<!-- HERO -->
	<header class="hero">
		<div class="hero__meta">
			<span class="eyebrow">The Company</span>
			<span class="eyebrow">Approach</span>
		</div>

		<h1 class="hero__title">Approach</h1>

		<p class="hero__lede">
			VNTA works across strategy, narrative, and stewardship. The involvement is sustained,
			not occasional. It begins where direction is still unsettled.
		</p>
		<p class="hero__sub">
			Brand leadership here is not a service layer. It is an embedded role inside the work.
		</p>
	</header>

	<hr class="rule" />

	<!-- NATURE OF ENGAGEMENTS -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">01</span>
			<h2 class="block__title">Nature of engagements</h2>
		</div>
		<div class="block__body">
			<p class="prose">
				Most engagements begin without a brief. VNTA enters at the point of ambiguity:
				direction is unclear, alignment is incomplete, and the next phase needs definition
				before execution.
			</p>
			<p class="prose">
				In practice the role is close to an external head of brand. VNTA aligns vision,
				narrative, and decisions at the leadership level; internal teams and partners carry
				out the work.
			</p>

			<ul class="list">
				<li>Strategic and creative advisory</li>
				<li>Brand positioning and architecture</li>
				<li>Founder-level alignment and decision support</li>
				<li>Early-stage or transitional brand leadership</li>
				<li>Oversight ahead of execution partners</li>
			</ul>

			<p class="prose muted">
				Scope and duration vary. Depth, continuity, and coherence come first; short-term
				campaigns do not.
			</p>
		</div>
	</section>

	<!-- PHILOSOPHY -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">02</span>
			<h2 class="block__title">Philosophy</h2>
		</div>
		<div class="block__body">
			<p class="prose">
				VNTA treats brand as a system. Cultural, operational, and narrative. Not a surface.
				Visibility follows structure, never the reverse.
			</p>
			<p class="prose">
				The work resists trends and performative gestures. Clarity, restraint, and durability
				instead.
			</p>
		</div>
	</section>

	<!-- PROCESS -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">03</span>
			<h2 class="block__title">Process</h2>
		</div>
		<div class="block__body">
			<ol class="process">
				<li class="step">
					<span class="step__n">i</span>
					<h3 class="step__name">Observation</h3>
					<p class="step__body">Immersion in context first. Market, internal dynamics, intent. No directional commitments before that.</p>
				</li>
				<li class="step">
					<span class="step__n">ii</span>
					<h3 class="step__name">Definition</h3>
					<p class="step__body">Clarify position, principles, and internal alignment. A coherent foundation to build on.</p>
				</li>
				<li class="step">
					<span class="step__n">iii</span>
					<h3 class="step__name">Direction</h3>
					<p class="step__body">Set a strategic and creative trajectory, one that guides decisions over time.</p>
				</li>
				<li class="step">
					<span class="step__n">iv</span>
					<h3 class="step__name">Stewardship</h3>
					<p class="step__body">Ongoing oversight. Protect coherence, quality, and intent as the brand evolves.</p>
				</li>
			</ol>
		</div>
	</section>

	<!-- NOTE -->
	<section class="note">
		<p class="note__text">
			The approach is informed by work across early-stage ventures and founder-led brands.
			Positioning conducted both before and after VNTA's incorporation in 2025.
		</p>
	</section>
</main>

<style>
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
		margin: 0 0 1.1rem;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink);
		max-width: 58ch;
	}
	.hero__sub {
		margin: 0 0 clamp(40px, 6vw, 72px);
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--ink-70);
		max-width: 58ch;
	}

	/* Two-column block: indexed label rail + prose, divided by hairlines */
	.block {
		display: grid;
		grid-template-columns: minmax(160px, 0.42fr) 1.58fr;
		gap: clamp(24px, 5vw, 72px);
		padding: var(--section-y) 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.block__head {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.block__title {
		margin: 0;
		font-size: var(--t-h3);
		line-height: 1.1;
		color: var(--ink);
	}
	.block__body {
		max-width: 64ch;
	}
	.prose {
		margin: 0 0 1.3rem;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--ink-85);
	}
	.prose.muted {
		color: var(--ink-50);
	}
	.list {
		list-style: none;
		padding: 0;
		margin: 1.6rem 0;
		display: grid;
		gap: 0;
	}
	.list li {
		padding: 13px 0;
		border-top: 1px solid var(--line-soft);
		font-size: 1rem;
		color: var(--ink-85);
	}
	.list li:last-child {
		border-bottom: 1px solid var(--line-soft);
	}

	.process {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
	}
	.step {
		padding: 24px 0;
		border-top: 1px solid var(--line);
		padding-right: 24px;
	}
	.step__n {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
	.step__name {
		margin: 14px 0 10px;
		font-size: var(--t-h4);
		color: var(--ink);
	}
	.step__body {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--ink-70);
	}

	.note {
		padding-top: clamp(36px, 5vw, 56px);
	}
	.note__text {
		max-width: 64ch;
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.7;
		color: var(--ink-50);
	}

	@media (max-width: 768px) {
		.block {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.process {
			grid-template-columns: 1fr;
		}
		.step {
			padding-right: 0;
		}
	}
</style>
