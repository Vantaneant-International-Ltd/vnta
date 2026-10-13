<script lang="ts">
	// VNTA Robotics: the current business area, and the only one being built.
	// This page lives on the parent site for now. When robotics.vnta.xyz
	// exists it moves there: change roboticsUrl in content/site.ts and add the
	// redirect in static/_redirects.
	//
	// The product is in development. Everything on this page is either
	// something that runs today (and says against what), or is marked as next,
	// later, planned or future. The one panel of results is the output of a
	// real run against a virtual vehicle, and is labelled as that.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import Architecture from '$lib/components/Architecture.svelte';
	import CapabilityPanel from '$lib/components/CapabilityPanel.svelte';
	import RouteMap from '$lib/components/RouteMap.svelte';
	import { robotics, capabilities, modules, progression } from '$lib/content/site';
	import { roboticsProduct, breadcrumb } from '$lib/content/structured';
	import { notePath, notesPath, longDate } from '$lib/content/notePaths';

	// The latest notes (see +page.server.ts). The section is not drawn until one has been published.
	let { data } = $props();
	const latest = $derived(data.latest);

	const pricing = `${base}/robotics/pricing`;

	// The three things that are built, under the headline.
	const first = [
		{ name: 'Connect', body: 'Reach a robot or fleet system through an adapter for the interface it already has.', icon: 'plug' },
		{ name: 'Validate', body: 'Run the same checks against it, including a dropped link and a restart.', icon: 'shield' },
		{ name: 'Report', body: 'One readiness verdict, with every call and raw message behind it.', icon: 'audit' }
	];

	// Three facts kept apart about every capability. This is the idea the product stands on.
	const facts = [
		{ name: 'Declared', body: 'What the interface is documented to offer.' },
		{ name: 'Discovered', body: 'What the system itself says when asked.' },
		{ name: 'Verified', body: 'What a validation run actually saw work, and when.' }
	];
</script>

<Seo
	title="VNTA Robotics | Developer infrastructure for autonomous machines"
	shareTitle="VNTA Robotics | {robotics.positioning}"
	image="/share/robotics.png"
	imageAlt="VNTA Robotics. {robotics.positioning} In development."
	description="{robotics.what} Capability discovery, declared and verified capabilities, failure testing and readiness reports. Tested so far with simulated robots and one external virtual vehicle."
	ld={[roboticsProduct(), breadcrumb('Robotics', '/robotics')]}
/>

<main>
	<section class="band lead" aria-labelledby="robotics-title">
		<RouteMap />
		<div class="wrap lead__grid">
			<div>
				<div class="lead__top">
					<p class="eyebrow">{robotics.name}</p>
					<Stage stage={robotics.stage} />
				</div>
				<h1 class="lead__title" id="robotics-title">{robotics.positioning}</h1>
				<p class="lead__lede">{robotics.what}</p>
				<div class="lead__cta">
					<a class="btn btn--solid" href="{pricing}#request">
						Request a validation pilot
						<Icon name="arrow" size={18} />
					</a>
					<a class="btn btn--ghost" href={pricing}>Pricing</a>
				</div>
			</div>
			<CapabilityPanel compact />
		</div>

		<!-- The three things that are built. -->
		<div class="wrap lead__three">
			{#each first as c}
				<div class="pillar card">
					<span class="well"><Icon name={c.icon} size={20} /></span>
					<span>
						<span class="pillar__name">{c.name}</span>
						<span class="pillar__body">{c.body}</span>
					</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- The question, and the idea it rests on. -->
	<section class="band band--paper" aria-labelledby="question-title">
		<div class="wrap ask">
			<div>
				<p class="eyebrow">The question</p>
				<h2 class="ask__title" id="question-title">{robotics.question}</h2>
			</div>
			<div>
				<p class="ask__text">
					A capability that is written in a manual is a claim. A capability that has been tested is evidence. VNTA Robotics keeps the two
					apart, for every function of every machine.
				</p>
				<dl class="facts">
					{#each facts as f}
						<div>
							<dt>{f.name}</dt>
							<dd>{f.body}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>
	</section>

	<!-- The four parts, and which one is current. -->
	<section class="band" id="modules" aria-labelledby="modules-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">What it is made of</p>
				<h2 class="head__title" id="modules-title">One platform. One module today.</h2>
				<p class="head__text">
					Runtime is the platform. Validation is the first module and the only current one. Access and Identity are future modules.
				</p>
			</div>
			<ul class="modules">
				{#each modules as m}
					<li class="module card" class:module--later={m.state === 'Future'}>
						<div class="module__top">
							<span class="well"><Icon name={m.icon} size={20} /></span>
							<Stage stage={m.state} />
						</div>
						<h3 class="module__name">{m.name}</h3>
						<p class="module__role">{m.role}</p>
						<p class="module__body">{m.body}</p>
						<p class="module__detail">{m.detail}</p>
					</li>
				{/each}
			</ul>

			<ol class="steps" aria-label="The order things are built in">
				{#each progression as p, i}
					<li class="step" class:step--now={p.when === 'Now'}>
						<span class="step__when">{p.when}</span>
						<span class="step__name">{p.name}</span>
						<span class="step__body">{p.body}</span>
						{#if i < progression.length - 1}<span class="step__arrow" aria-hidden="true"><Icon name="arrow" size={14} /></span>{/if}
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="band band--paper" aria-labelledby="layer-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Where it sits</p>
				<h2 class="head__title" id="layer-title">{robotics.headline}</h2>
				<p class="head__text">{robotics.body}</p>
			</div>
			<Architecture />
		</div>
	</section>

	<section class="band" id="validation" aria-labelledby="capabilities-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Validation, today</p>
				<h2 class="head__title" id="capabilities-title">What the first module does.</h2>
				<p class="head__text">
					Each of these runs today, against simulated robots and one external virtual vehicle. None has been run against a real machine yet.
				</p>
			</div>

			<ul class="caps">
				{#each capabilities as c}
					<li class="cap card">
						<span class="well"><Icon name={c.icon} size={20} /></span>
						<div>
							<h3 class="cap__name">{c.name}</h3>
							<p class="cap__body">{c.body}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="band band--paper" aria-labelledby="record-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">A result</p>
				<h2 class="head__title" id="record-title">Declared, and verified or not.</h2>
				<p class="head__text">
					One machine after one validation run. Behind each line are the tests that produced it and the raw messages they saw.
				</p>
			</div>
			<CapabilityPanel />
			<p class="disclaimer">{robotics.notSafety}</p>
		</div>
	</section>

	{#if latest.length}
		<section class="band" aria-labelledby="notes-title">
			<div class="wrap">
				<div class="head">
					<p class="eyebrow">Notes</p>
					<h2 class="head__title" id="notes-title">What we built, and what it found.</h2>
				</div>
				<ul class="notes">
					{#each latest as n}
						<li>
							<a class="note card" href="{base}{notePath(n.slug)}">
								<span class="note__date">{longDate(n.publishedAt)}</span>
								<span class="note__title">{n.title}</span>
								<span class="note__sum">{n.summary}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="notes__all"><a href="{base}{notesPath}">All notes <Icon name="arrow" size={16} /></a></p>
			</div>
		</section>
	{/if}

	<!-- The close: dark, and it runs into the foot. -->
	<section class="band close" data-theme="ink" aria-labelledby="next-title">
		<div class="wrap next">
			<div>
				<h2 class="head__title" id="next-title">Start with one real integration.</h2>
				<p class="next__text">
					{robotics.honest} We are taking a limited number of early validation projects with integrators and operators who have a real
					robot or fleet system to test.
				</p>
				<p class="next__note">{robotics.note}</p>
			</div>
			<div class="next__act">
				<a class="btn btn--solid" href="{pricing}#request">
					Request a validation pilot
					<Icon name="arrow" size={18} />
				</a>
				<a class="next__link" href={pricing}>See pricing</a>
			</div>
		</div>
	</section>
</main>

<style>
	.lead {
		position: relative;
		isolation: isolate;
		overflow: hidden;
		background:
			radial-gradient(60% 90% at 80% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 70%),
			var(--ground);
	}
	.lead > .wrap {
		position: relative;
		z-index: 1;
	}
	/* The route map shows through the panels at the top, softly, so the
	   robots drive under them. Enough white stays for the words to read. */
	.lead :global(.rec__frame),
	.lead .pillar {
		background: rgba(255, 255, 255, 0.8);
		-webkit-backdrop-filter: blur(1.5px);
		backdrop-filter: blur(1.5px);
	}
	.lead > .lead__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(32px, 5vw, 64px);
		align-items: center;
		padding-top: clamp(40px, 6vw, 80px);
		padding-bottom: clamp(28px, 3vw, 40px);
	}
	.lead > .lead__three {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		padding-top: 0;
		padding-bottom: clamp(40px, 5vw, 72px);
	}
	.pillar {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 16px;
	}
	.pillar__name {
		display: block;
		margin-top: 1px;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.pillar__body {
		display: block;
		margin-top: 2px;
		font-size: 0.93rem;
		line-height: 1.45;
		color: var(--ink-60);
	}
	/* The close is the foot's own colour, so the two read as one dark end. */
	.close {
		background: var(--paper);
	}
	.lead__top {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.lead__title {
		margin: 16px 0 0;
		font-size: var(--t-hero);
		line-height: 1.03;
		letter-spacing: -0.04em;
		max-width: 15ch;
		text-wrap: balance;
	}
	.lead__lede {
		margin: clamp(16px, 1.8vw, 22px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 36rem;
		text-wrap: pretty;
	}
	.lead__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 32px);
	}

	/* The question: set large on the left, the idea behind it on the right. */
	.ask {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(24px, 4vw, 64px);
		align-items: start;
	}
	.ask__title {
		margin: 14px 0 0;
		font-size: var(--t-h2);
		line-height: 1.12;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}
	.ask__text {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.facts {
		margin: 24px 0 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--line);
	}
	.facts div {
		display: grid;
		grid-template-columns: 7.5rem minmax(0, 1fr);
		gap: 16px;
		padding: 13px 0;
		border-bottom: 1px solid var(--line);
	}
	.facts dt {
		font-weight: 600;
		color: var(--ink);
	}
	.facts dd {
		margin: 0;
	}

	/* The four parts. The current one is the only one in green. */
	.modules {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.module {
		display: flex;
		flex-direction: column;
		padding: 18px;
	}
	.module--later {
		background: transparent;
		border-style: dashed;
		border-color: var(--ink-20);
	}
	.module__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}
	.module__name {
		margin: 16px 0 0;
		font-size: 1.2rem;
	}
	.module__role {
		margin: 2px 0 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.module__body {
		margin: 12px 0 0;
		font-size: 0.94rem;
		line-height: 1.5;
		text-wrap: pretty;
	}
	.module__detail {
		margin: auto 0 0;
		padding-top: 14px;
		font-size: 0.84rem;
		line-height: 1.45;
		color: var(--ink-60);
	}
	.module--later .module__name,
	.module--later .module__body {
		color: var(--ink-60);
	}

	/* The order things are built in: six small steps on one line. */
	.steps {
		list-style: none;
		margin: clamp(24px, 3vw, 36px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px 14px;
	}
	.step {
		position: relative;
		display: grid;
		gap: 2px;
		align-content: start;
		padding-top: 12px;
		border-top: 2px solid var(--ink-20);
	}
	.step--now {
		border-top-color: var(--green);
	}
	.step__when {
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.step--now .step__when {
		color: var(--green);
	}
	.step__name {
		font-weight: 600;
		color: var(--ink);
	}
	.step__body {
		font-size: 0.86rem;
		line-height: 1.4;
		color: var(--ink-60);
	}
	.step__arrow {
		display: none;
	}

	/* What the first module does: a dense grid of small panels. */
	.caps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.cap {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		padding: 16px;
	}
	.cap__name {
		margin: 2px 0 0;
		font-size: var(--t-h4);
	}
	.cap__body {
		margin: 3px 0 0;
		font-size: 0.93rem;
		line-height: 1.45;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.disclaimer {
		margin: 18px 0 0;
		max-width: 52rem;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--ink-60);
	}

	.notes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.note {
		display: grid;
		gap: 6px;
		height: 100%;
		align-content: start;
		padding: 18px;
		transition: border-color var(--dur) var(--ease);
	}
	.note:hover {
		border-color: var(--ink-40);
	}
	.note__date {
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.note__title {
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.note__sum {
		font-size: 0.93rem;
		line-height: 1.5;
		color: var(--ink-60);
	}
	.notes__all {
		margin: 18px 0 0;
	}
	.notes__all a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: var(--blue);
	}
	@media (min-width: 900px) {
		.notes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.next {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		align-items: center;
		justify-items: start;
	}
	.next__text {
		margin: 14px 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 40rem;
		text-wrap: pretty;
	}
	.next__note {
		margin: 16px 0 0;
		font-size: 0.84rem;
		line-height: 1.5;
		color: var(--ink-40);
		max-width: 40rem;
	}
	.next__act {
		display: grid;
		gap: 12px;
		justify-items: start;
	}
	.next__link {
		font-size: var(--t-small);
		font-weight: 500;
		color: var(--ink-80);
		text-decoration: underline;
		text-decoration-color: var(--ink-40);
		text-underline-offset: 4px;
	}

	@media (min-width: 640px) {
		.caps,
		.modules {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.next {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.lead > .lead__grid {
			grid-template-columns: minmax(0, 10fr) minmax(0, 11fr);
		}
		.lead > .lead__three {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.ask {
			grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		}
	}
	@media (min-width: 1100px) {
		.caps,
		.modules {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.steps {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			gap: 14px;
		}
	}
</style>
