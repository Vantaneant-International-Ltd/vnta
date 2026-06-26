<script lang="ts">
	import { base } from '$app/paths';

	// Active windows across the 2026 to 2027 horizon. Each window spans grid
	// quarter-columns (1 = 2026 Q1 ... 8 = 2027 Q4) on desktop.
	const windows = [
		{ name: 'VNTA Studio', domain: 'vnta.xyz', status: 'Active residency. Continuous.', col: '1 / -1', tone: 'live' },
		{ name: 'Vendr', domain: 'vendr.ie', status: 'In progress. March 2026.', col: '1 / 2', tone: 'now' },
		{ name: 'Eirvox', domain: 'eirvox.ie', status: 'Launching Summer 2026.', col: '3 / 4', tone: 'next' },
		{ name: 'Maison Seul', domain: 'maisonseul.ie', status: 'Coming 2027.', col: '5 / 7', tone: 'soon' }
	];

	// Register of maisons. State only. No invented metrics.
	const register = [
		{
			n: '00', kind: 'Studio', name: 'VNTA Studio', domain: 'vnta.xyz', state: 'Operating',
			body: 'The studio at the centre of the lineage. Brand leadership in residence for one founder at a time. Twelve-month cycles. Structured handover at the end of the engagement.'
		},
		{
			n: '01', kind: 'Commerce', name: 'Vendr', domain: 'vendr.ie', state: 'In progress',
			body: 'A commerce-led venture in active development. Operational clarity. Modern distribution. Brand-first thinking, built for category leadership without the start-up velocity.'
		},
		{
			n: '02', kind: 'Communications', name: 'Eirvox', domain: 'eirvox.ie', state: 'Launching',
			body: 'Communications and signal. Voice, narrative, and modern transmission. Built to scale quietly.'
		},
		{
			n: '03', kind: 'Maison', name: 'Maison Seul', domain: 'maisonseul.ie', state: 'Coming',
			body: 'Restraint, form, and cultural permanence. Designed for longevity, not velocity.'
		}
	];
</script>

<svelte:head>
	<title>Horizon · VNTA</title>
	<meta name="description" content="Not a roadmap. A directional horizon for VNTA across 2026 and 2027. Maisons advance by readiness, not timelines." />
	<meta property="og:title" content="Directional Horizon · VNTA" />
	<meta property="og:description" content="A statement of focus across two years. The active window for each maison." />
</svelte:head>

<main class="horizon">
	<!-- Header -->
	<section class="head">
		<div class="wrap">
			<div class="head__meta">
				<span class="eyebrow">Section · Horizon</span>
				<span class="eyebrow">2026 / 2027</span>
			</div>

			<h1 class="head__title">Directional Horizon</h1>

			<div class="head__grid">
				<p class="lede">
					Not a roadmap. A statement of focus across two years. Maisons advance by
					readiness, not timelines. Visibility follows stability, never the reverse.
				</p>
				<p class="note">
					The timeline below records the active window for each maison. Windows are
					indicative. They shift with readiness.
				</p>
			</div>
		</div>
	</section>

	<!-- Timeline -->
	<section class="band">
		<div class="wrap">
			<div class="band__head">
				<span class="eyebrow">Timeline · Active windows</span>
				<span class="eyebrow">As of May 2026</span>
			</div>

			<div class="timeline" role="img" aria-label="Active windows across 2026 and 2027. VNTA Studio continuous. Vendr in progress March 2026. Eirvox launching Summer 2026. Maison Seul coming 2027.">
				<div class="scale" aria-hidden="true">
					<span class="scale__year" style="grid-column: 1 / 5;">2026</span>
					<span class="scale__year" style="grid-column: 5 / 9;">2027</span>
					<span class="scale__q" style="grid-column: 1;">Q1</span>
					<span class="scale__q" style="grid-column: 2;">Q2</span>
					<span class="scale__q" style="grid-column: 3;">Q3</span>
					<span class="scale__q" style="grid-column: 4;">Q4</span>
					<span class="scale__q" style="grid-column: 5;">Q1</span>
					<span class="scale__q" style="grid-column: 6;">Q2</span>
					<span class="scale__q" style="grid-column: 7;">Q3</span>
					<span class="scale__q" style="grid-column: 8;">Q4</span>
				</div>

				<div class="now" aria-hidden="true"><span>Now</span></div>

				{#each windows as w}
					<div class="track">
						<span class="track__label" aria-hidden="true">{w.domain}</span>
						<div class="track__lane">
							<span class="window window--{w.tone}" style="grid-column: {w.col};">
								<span class="window__name">{w.name}</span>
								<span class="window__status">{w.status}</span>
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Register -->
	<section class="band">
		<div class="wrap">
			<div class="band__head">
				<span class="eyebrow">Register of maisons</span>
				<span class="eyebrow">Four entries</span>
			</div>

			<hr class="rule" />

			<div class="register">
				{#each register as m}
					<article class="entry">
						<div class="entry__side">
							<span class="eyebrow">{m.n} · {m.kind}</span>
						</div>

						<div class="entry__main">
							<div class="entry__top">
								<h2 class="entry__name">{m.name}</h2>
								<span class="eyebrow entry__state">{m.domain} · {m.state}</span>
							</div>

							<p class="entry__body">{m.body}</p>
						</div>
					</article>
				{/each}
			</div>

			<div class="register__cta">
				<a href="{base}/houses" class="btn-ghost">The lineage</a>
			</div>
		</div>
	</section>
</main>

<style>
	.wrap {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 48px;
	}

	/* --- Header ----------------------------------------------------------- */
	.head {
		padding: clamp(44px, 7vw, 88px) 0 clamp(32px, 4vw, 48px);
	}

	.head__meta {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(24px, 4vw, 40px);
	}

	.head__title {
		margin: 0 0 clamp(24px, 4vw, 40px);
		font-size: var(--t-h1);
		line-height: 1.02;
		color: var(--fg);
	}

	.head__grid {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: clamp(28px, 5vw, 72px);
		align-items: start;
	}

	.lede {
		margin: 0;
		font-size: clamp(1.05rem, 1.5vw, 1.25rem);
		line-height: 1.55;
		color: var(--ink-92);
		font-weight: 400;
		max-width: 40ch;
	}

	.note {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ink-55);
		max-width: 42ch;
	}

	/* --- Bands ------------------------------------------------------------ */
	.band {
		padding: clamp(40px, 6vw, 80px) 0;
		border-top: 1px solid var(--line-soft);
	}

	.band__head {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(28px, 4vw, 44px);
	}

	.rule {
		height: 1px;
		background: var(--line);
		border: 0;
		margin: 0;
	}

	/* --- Timeline --------------------------------------------------------- */
	.timeline {
		position: relative;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		padding: 18px 0 6px;
	}

	.scale {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		row-gap: 6px;
		margin-bottom: 18px;
	}

	.scale__year {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		color: var(--ink-65);
	}

	.scale__q {
		font-family: var(--font-sc);
		font-size: 0.62rem;
		letter-spacing: 0.16em;
		color: var(--ink-45);
	}

	/* NOW marker. May 2026 is roughly mid-Q2 of 8 quarters (about 19%). */
	.now {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 18.75%;
		width: 1px;
		background: var(--fg);
		opacity: 0.55;
	}

	.now span {
		position: absolute;
		top: -2px;
		left: 8px;
		font-family: var(--font-sc);
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--fg);
	}

	.track {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 18px;
		align-items: center;
		padding: 9px 0;
	}

	.track__label {
		font-family: var(--font-sc);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-45);
		white-space: nowrap;
	}

	.track__lane {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		align-items: center;
	}

	.window {
		display: flex;
		align-items: baseline;
		gap: 12px;
		min-width: 0;
		padding: 9px 14px;
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--surface);
		white-space: nowrap;
		overflow: hidden;
	}

	.window--live {
		border-style: dashed;
	}

	.window--now {
		border-color: var(--fg);
		background: var(--fg);
	}

	.window--now .window__name,
	.window--now .window__status {
		color: var(--paper);
	}

	.window__name {
		font-family: var(--font-display);
		font-size: 0.98rem;
		color: var(--fg);
	}

	.window__status {
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		color: var(--ink-55);
		text-overflow: ellipsis;
		overflow: hidden;
	}

	/* --- Register --------------------------------------------------------- */
	.register {
		display: flex;
		flex-direction: column;
	}

	.entry {
		display: grid;
		grid-template-columns: minmax(120px, 0.4fr) 1.6fr;
		gap: clamp(20px, 4vw, 56px);
		padding: clamp(32px, 4vw, 48px) 0;
		border-bottom: 1px solid var(--line-soft);
	}

	.entry__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 18px;
		flex-wrap: wrap;
	}

	.entry__name {
		margin: 0;
		font-size: var(--t-h4);
		color: var(--fg);
	}

	.entry__body {
		margin: 16px 0 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--ink-65);
		max-width: 60ch;
	}

	.register__cta {
		margin-top: clamp(28px, 4vw, 44px);
	}

	/* --- Responsive: cosy mobile ----------------------------------------- */
	@media (max-width: 820px) {
		.head__grid {
			grid-template-columns: 1fr;
			gap: 22px;
		}

		.lede,
		.note {
			max-width: none;
		}

		/* Collapse the positioned timeline into a stacked window list. */
		.scale,
		.now {
			display: none;
		}

		.timeline {
			padding: 4px 0;
		}

		.track {
			grid-template-columns: 1fr;
			gap: 8px;
			padding: 14px 0;
			border-top: 1px solid var(--line-soft);
		}

		.track:first-of-type {
			border-top: 0;
		}

		.track__lane {
			display: block;
		}

		.window {
			grid-column: auto !important;
			white-space: normal;
			justify-content: space-between;
		}

		.entry {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}

	@media (max-width: 768px) {
		.wrap {
			padding: 0 24px;
		}
	}
</style>
