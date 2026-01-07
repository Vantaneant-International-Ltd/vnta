<svelte:head>
	<title>Approach — VNTA</title>
	<meta
		name="description"
		content="VNTA’s approach to brand leadership, advisory work, and long-horizon positioning."
	/>
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<h1 class="title">Approach</h1>

		<p class="lede">
			VNTA operates at the intersection of strategy, narrative, and stewardship.
			The work is shaped by sustained involvement at moments where clarity,
			direction, and long-term thinking are required.
		</p>

		<p class="lede secondary">
			This page outlines how VNTA approaches brand leadership — not as a service
			layer, but as an embedded strategic role.
		</p>

		<!-- NATURE OF ENGAGEMENTS -->
		<section class="section">
			<h2 class="section-title">Nature of Engagements</h2>

			<p class="body-text">
				Most engagements begin without a predefined brief. VNTA typically enters
				at points of ambiguity — where direction is unclear, alignment is incomplete,
				or the next phase requires definition before execution.
			</p>

			<!-- CLARIFYING ROLE (EXECUTIVE ORIENTATION) -->
			<p class="body-text">
				In practice, VNTA often operates in a role comparable to an external head of
				product or brand — aligning vision, narrative, and decision-making at the
				leadership level while internal teams and partners carry out execution.
			</p>

			<ul class="list">
				<li>Strategic and creative advisory</li>
				<li>Brand positioning and architectural definition</li>
				<li>Founder-level alignment and decision support</li>
				<li>Early-stage or transitional brand leadership</li>
				<li>Oversight preceding or guiding execution partners</li>
			</ul>

			<p class="body-text muted">
				Engagements vary in duration and scope, but consistently prioritise depth,
				continuity, and long-term coherence over short-term campaigns.
			</p>
		</section>

		<!-- PHILOSOPHY -->
		<section class="section">
			<h2 class="section-title">Philosophy</h2>

			<p class="body-text">
				VNTA treats brand as a system — cultural, operational, and narrative —
				rather than a surface expression. Visibility follows structure, not the
				other way around.
			</p>

			<p class="body-text">
				The work resists trends, accelerations, and performative gestures in favour
				of clarity, restraint, and durability.
			</p>
		</section>

		<!-- PROCESS -->
		<section class="section">
			<h2 class="section-title">Process</h2>

			<div class="process">
				<div class="process-step">
					<h3>Observation</h3>
					<p>
						Immersion in context — market, internal dynamics, and intent —
						before any directional commitments are made.
					</p>
				</div>

				<div class="process-step">
					<h3>Definition</h3>
					<p>
						Clarifying position, principles, and internal alignment to establish
						a coherent foundation.
					</p>
				</div>

				<div class="process-step">
					<h3>Direction</h3>
					<p>
						Setting a strategic and creative trajectory capable of guiding
						decisions over time.
					</p>
				</div>

				<div class="process-step">
					<h3>Stewardship</h3>
					<p>
						Ongoing oversight to protect coherence, quality, and intent as
						the brand evolves.
					</p>
				</div>
			</div>
		</section>

		<!-- EXPERIENCE CONTEXT -->
		<section class="section note">
			<p class="note-text">
				The approach outlined above is informed by experience across early-stage
				ventures, founder-led brands, and positioning work conducted both before
				and after VNTA’s formal incorporation in 2025.
			</p>
		</section>
	</div>
</main>

<style>
	.title {
		font-family: 'Playfair Display', serif;
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
		font-family: 'Playfair Display', serif;
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
		content: '—';
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
		border-radius: 18px;
		padding: 20px 22px;
		background: rgba(255, 255, 255, 0.02);
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
