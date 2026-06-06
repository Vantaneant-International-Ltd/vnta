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
	<div class="content content-width">
		<h1 class="title">Approach</h1>

		<p class="lede">
			VNTA works across strategy, narrative, and stewardship. The involvement is sustained,
			not occasional. It begins where direction is still unsettled.
		</p>

		<p class="lede secondary">
			Brand leadership here is not a service layer. It is an embedded role inside the work.
		</p>

		<!-- NATURE OF ENGAGEMENTS -->
		<section class="section">
			<h2 class="section-title">Nature of Engagements</h2>

			<p class="body-text">
				Most engagements begin without a brief. VNTA enters at the point of ambiguity.
				Direction is unclear. Alignment is incomplete. The next phase needs definition
				before execution.
			</p>

			<!-- CLARIFYING ROLE (EXECUTIVE ORIENTATION) -->
			<p class="body-text">
				In practice the role is close to an external head of brand. VNTA aligns vision,
				narrative, and decisions at the leadership level. Internal teams and partners carry
				out the work.
			</p>

			<ul class="list">
				<li>Strategic and creative advisory</li>
				<li>Brand positioning and architecture</li>
				<li>Founder-level alignment and decision support</li>
				<li>Early-stage or transitional brand leadership</li>
				<li>Oversight ahead of execution partners</li>
			</ul>

			<p class="body-text muted">
				Scope and duration vary. Depth, continuity, and coherence come first. Short-term
				campaigns do not.
			</p>
		</section>

		<!-- PHILOSOPHY -->
		<section class="section">
			<h2 class="section-title">Philosophy</h2>

			<p class="body-text">
				VNTA treats brand as a system. Cultural, operational, and narrative. Not a surface.
				Visibility follows structure, never the reverse.
			</p>

			<p class="body-text">
				The work resists trends and performative gestures. Clarity, restraint, and durability
				instead.
			</p>
		</section>

		<!-- PROCESS -->
		<section class="section">
			<h2 class="section-title">Process</h2>

			<div class="process">
				<div class="process-step">
					<h3>Observation</h3>
					<p>
						Immersion in context first. Market, internal dynamics, and intent. No
						directional commitments before that.
					</p>
				</div>

				<div class="process-step">
					<h3>Definition</h3>
					<p>
						Clarify position, principles, and internal alignment. A coherent foundation to
						build on.
					</p>
				</div>

				<div class="process-step">
					<h3>Direction</h3>
					<p>
						Set a strategic and creative trajectory. One that guides decisions over time.
					</p>
				</div>

				<div class="process-step">
					<h3>Stewardship</h3>
					<p>
						Ongoing oversight. Protect coherence, quality, and intent as the brand evolves.
					</p>
				</div>
			</div>
		</section>

		<!-- EXPERIENCE CONTEXT -->
		<section class="section note">
			<p class="note-text">
				The approach is informed by work across early-stage ventures and founder-led brands.
				Positioning conducted both before and after VNTA's incorporation in 2025.
			</p>
		</section>
	</div>
</main>

<style>
	.title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 1.5rem;
		letter-spacing: -0.02em;
	}

	.lede {
		max-width: 720px;
		font-size: 1.15rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.75);
		margin-bottom: 1.5rem;
	}

	.lede.secondary {
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 4rem;
	}

	.section {
		margin-bottom: 5rem;
	}

	.section.note {
		margin-top: 6rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 2rem;
	}

	.body-text {
		max-width: 720px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.75);
		margin-bottom: 1.5rem;
	}

	.body-text.muted {
		color: rgba(255, 255, 255, 0.6);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.list li {
		position: relative;
		padding-left: 1.5rem;
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.75);
	}

	.list li::before {
		content: '·';
		position: absolute;
		left: 0;
		color: rgba(255, 255, 255, 0.4);
	}

	.process {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.75rem;
	}

	.process-step {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 20px 22px;
		background: var(--surface);
	}

	.process-step h3 {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.process-step p {
		margin: 0;
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.6;
	}

	.note-text {
		max-width: 720px;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.55);
	}
</style>
