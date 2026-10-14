<script lang="ts">
	// VNTA Robotics: the current business area. The page is built in the order
	// a buyer needs it: the problem, what Validation checks, an example result,
	// who it is for, what it connects to, where it stands today, what it costs,
	// and only then where it goes next.
	//
	// Validation is the one thing that can be engaged today. Runtime, Access and
	// Identity are shown once, at the foot, marked for what they are. The status
	// of the product is said once, in its own block, not under every section.
	// The results shown are from a real run against a virtual vehicle, and are
	// labelled as that.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import CapabilityPanel from '$lib/components/CapabilityPanel.svelte';
	import SampleReport from '$lib/components/SampleReport.svelte';
	import RouteMap from '$lib/components/RouteMap.svelte';
	import Snow from '$lib/season/Snow.svelte';
	import { isWinter } from '$lib/season/season';
	import { onMount } from 'svelte';
	import { robotics, capabilities, modules, interfaces, buyers, alsoFor } from '$lib/content/site';
	import { tiers } from '$lib/content/pricing';
	import { roboticsProduct, breadcrumb } from '$lib/content/structured';
	import { notePath, notesPath, longDate } from '$lib/content/notePaths';

	// The latest notes (see +page.server.ts). The section is not drawn until one has been published.
	let { data } = $props();
	const latest = $derived(data.latest);

	const pricing = `${base}/robotics/pricing`;

	// One claim, one test, one result. A real one: the capability-discovery
	// failure from the virtual-vehicle run, which is already public.
	const example = [
		{ k: 'Declared', v: 'The vehicle describes its own functions when asked.', tone: '' },
		{ k: 'Integration test', v: 'Asked for its factsheet, it answered, but named no functions.', tone: '' },
		{ k: 'VNTA evidence', v: 'Failed. The raw reply, its timestamp and the reason are kept with the result.', tone: 'no' }
	];

	// Winter (14 October to 6 January): snow over the route map, and robots
	// leaving tracks in it. Decided in the visitor's browser.
	let winter = $state(false);
	onMount(() => (winter = isWinter(new Date(), location.search)));
</script>

<Seo
	title="VNTA Robotics | Independent validation of robot integrations"
	shareTitle="VNTA Robotics | {robotics.positioning}"
	image="/share/robotics.png"
	imageAlt="VNTA Robotics. {robotics.positioning} Early access."
	description="{robotics.core} Capability discovery, declared and verified capabilities, failure and reconnect testing, and readiness reports. Early access."
	ld={[roboticsProduct(), breadcrumb('Robotics', '/robotics')]}
/>

<main>
	<!-- 1. The promise, and the result it produces. -->
	<section class="band lead" aria-labelledby="robotics-title">
		{#key winter}<RouteMap {winter} />{/key}
		{#if winter}<Snow fixed={false} count={70} />{/if}
		<div class="wrap lead__grid">
			<div>
				<div class="lead__top">
					<p class="eyebrow">{robotics.name} · Validation</p>
					<Stage stage={robotics.stage} />
				</div>
				<h1 class="lead__title" id="robotics-title">{robotics.headline}</h1>
				<p class="lead__lede">{robotics.what}</p>
				<div class="lead__cta">
					<a class="btn btn--solid" href="{pricing}#request">
						Validate an integration
						<Icon name="arrow" size={18} />
					</a>
					<a class="btn btn--ghost" href="#report">See an example result</a>
				</div>
			</div>
			<CapabilityPanel compact />
		</div>

		<!-- The mental model, in three steps. -->
		<ol class="wrap lead__three" aria-label="How it works">
			{#each robotics.model as c, i}
				<li class="pillar card">
					<span class="well"><Icon name={c.icon} size={20} /></span>
					<span>
						<span class="pillar__n">0{i + 1}</span>
						<span class="pillar__name">{c.name}</span>
						<span class="pillar__body">{c.body}</span>
					</span>
				</li>
			{/each}
		</ol>
	</section>

	<!-- 2. The problem, with one real example. -->
	<section class="band band--paper" aria-labelledby="problem-title">
		<div class="wrap ask">
			<div>
				<p class="eyebrow">The problem</p>
				<h2 class="ask__title" id="problem-title">Documentation tells you what should work. Deployment reveals what actually works.</h2>
				<p class="ask__text">
					{robotics.question} A capability written in a manual is a claim. A capability that has been tested is evidence. VNTA keeps the
					two apart, for every function of every machine.
				</p>
			</div>
			<figure class="claim card">
				<ol class="claim__list">
					{#each example as e}
						<li class="claim__row" class:claim__row--no={e.tone === 'no'}>
							<span class="claim__k">{e.k}</span>
							<span class="claim__v">
								{#if e.tone === 'no'}<Icon name="ban" size={14} />{/if}{e.v}
							</span>
						</li>
					{/each}
				</ol>
				<figcaption class="claim__cap">From a real run against a virtual VDA 5050 vehicle.</figcaption>
			</figure>
		</div>
	</section>

	<!-- 3. What VNTA validates, and what it is not. -->
	<section class="band" id="validation" aria-labelledby="validates-title">
		<div class="wrap">
			<div class="indep">
				<div>
					<p class="eyebrow">Independent validation</p>
					<h2 class="head__title" id="validates-title">An independent pre-deployment check for robot integrations.</h2>
					<p class="head__text">{robotics.independent}</p>
					<p class="indep__analogy">{robotics.analogy}</p>
				</div>
				<div class="isnot card">
					<p class="isnot__head">Software and integration validation. It is not:</p>
					<ul>
						{#each robotics.isNot as x}<li><Icon name="ban" size={15} />{x}</li>{/each}
					</ul>
				</div>
			</div>

			<h3 class="sub">What a validation run checks</h3>
			<ul class="caps">
				{#each capabilities as c}
					<li class="cap card">
						<span class="well"><Icon name={c.icon} size={20} /></span>
						<div>
							<h4 class="cap__name">{c.name}</h4>
							<p class="cap__body">{c.body}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 4. What the buyer receives. -->
	<section class="band band--paper" id="report" aria-labelledby="report-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Example result</p>
				<h2 class="head__title" id="report-title">See what the validation produces.</h2>
				<p class="head__text">
					A readiness verdict, the checks behind it, every failure with its evidence, and what to change. Then the capability matrix:
					declared, and verified or not.
				</p>
			</div>
			<SampleReport />
			<div class="matrix">
				<CapabilityPanel />
				<p class="disclaimer">{robotics.notSafety}</p>
			</div>
		</div>
	</section>

	<!-- 5. Who benefits. -->
	<section class="band" aria-labelledby="buyers-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Who it is for</p>
				<h2 class="head__title" id="buyers-title">For the people who have to sign off an integration.</h2>
			</div>
			<ul class="buyers">
				{#each buyers as b}
					<li class="buyer card">
						<span class="well"><Icon name={b.icon} size={20} /></span>
						<p class="buyer__who">{b.who}</p>
						<h3 class="buyer__title">{b.title}</h3>
						<p class="buyer__body">{b.body}</p>
					</li>
				{/each}
			</ul>
			<p class="also">{alsoFor}</p>
		</div>
	</section>

	<!-- 6. What it connects to. -->
	<section class="band band--paper" id="integrations" aria-labelledby="ifaces-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Supported integrations</p>
				<h2 class="head__title" id="ifaces-title">{robotics.sits}</h2>
				<p class="head__text">{robotics.body}</p>
			</div>
			<ul class="ifaces">
				{#each interfaces as i}
					<li class="iface card" class:iface--live={i.support === 'Supported today'}>
						<span class="iface__name">{i.name}</span>
						<Stage stage={i.support} />
						<span class="iface__note">{i.note}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 7. Where it stands. Said once, here. -->
	<section class="band" id="status" aria-labelledby="status-title">
		<div class="wrap">
			<div class="status card">
				<div class="status__top">
					<Stage stage={robotics.stage} />
					<h2 class="status__title" id="status-title">Where Validation stands today</h2>
				</div>
				<p class="status__text">{robotics.honest}</p>
				<p class="status__more">
					Part of every first project is writing the adapter for that system, so places are limited and scoped carefully.
					<a href="{pricing}#status">Technical status in full</a>
				</p>
			</div>
		</div>
	</section>

	<!-- 8. What it costs. The detail is on the pricing page. -->
	<section class="band band--paper" aria-labelledby="offers-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Pricing</p>
				<h2 class="head__title" id="offers-title">Start with one integration.</h2>
				<p class="head__text">Priced per integration, not per robot. Every price is a starting point, ex VAT, for a scope agreed before work begins.</p>
			</div>
			<ul class="offers">
				{#each tiers as t}
					<li class="offer card" class:offer--primary={t.primary}>
						<p class="offer__label">{t.label}</p>
						<p class="offer__price">{t.price}</p>
						<p class="offer__body">{t.body}</p>
						<a class="offer__go" href="{pricing}#request">{t.cta} <Icon name="arrow" size={15} /></a>
					</li>
				{/each}
			</ul>
			<p class="offers__all"><a href={pricing}>Full pricing and what each includes <Icon name="arrow" size={16} /></a></p>
		</div>
	</section>

	<!-- 9. Where it goes next. Last, and short. -->
	<section class="band" id="next-layers" aria-labelledby="modules-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Where VNTA goes next</p>
				<h2 class="head__title" id="modules-title">One product today. A wider layer later.</h2>
				<p class="head__text">Validation is the first layer of VNTA's infrastructure for interoperable autonomous systems. The rest is built on it, in order.</p>
			</div>
			<ul class="modules">
				{#each modules as m}
					<li class="module" class:module--now={m.state === 'Early access'}>
						<Stage stage={m.state} />
						<span class="module__name">{m.name}</span>
						<span class="module__body">{m.role}. {m.body}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	{#if latest.length}
		<section class="band band--paper" aria-labelledby="notes-title">
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
				<h2 class="head__title" id="next-title">Validate one integration before standardising the rest.</h2>
				<p class="next__text">Bring one robot or fleet system. We agree what will be tested, run the suite, and go through the result and the evidence with you.</p>
				<p class="next__note">{robotics.note}</p>
			</div>
			<div class="next__act">
				<a class="btn btn--solid" href="{pricing}#request">
					Validate an integration
					<Icon name="arrow" size={18} />
				</a>
				<a class="next__link" href="{pricing}#request">Become a design partner</a>
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
		margin: 16px 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	/* The three steps under the headline: numbered, in reading order. */
	.lead__three {
		list-style: none;
		margin: 0 auto;
	}
	.pillar__n {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--ink-40);
	}

	/* One claim, one test, one result. */
	.claim {
		margin: 0;
		padding: clamp(16px, 2vw, 22px);
		box-shadow: var(--lift);
	}
	.claim__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
	}
	.claim__row {
		display: grid;
		grid-template-columns: 8.6rem minmax(0, 1fr);
		gap: 14px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.claim__row:first-child {
		padding-top: 0;
	}
	/* On a phone each label sits above its line, so the words get the width. */
	@media (max-width: 560px) {
		.claim__row {
			grid-template-columns: 1fr;
			gap: 4px;
		}
		.cap {
			padding: 12px 14px;
		}
		.cap .well {
			display: none;
		}
	}
	.claim__k {
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		padding-top: 3px;
	}
	.claim__v {
		color: var(--ink);
		line-height: 1.45;
	}
	.claim__row--no .claim__v {
		color: var(--red);
		font-weight: 500;
	}
	.claim__row--no .claim__v :global(svg) {
		display: inline-block;
		vertical-align: -2px;
		margin-right: 6px;
	}
	.claim__cap {
		margin-top: 12px;
		font-size: 0.8rem;
		color: var(--ink-60);
	}

	/* Independent validation, and what it is not. */
	.indep {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(20px, 3vw, 48px);
		align-items: start;
	}
	.indep .head__text {
		margin-top: 14px;
	}
	.indep__analogy {
		margin: 14px 0 0;
		padding-left: 14px;
		border-left: 2px solid var(--line);
		max-width: 40rem;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.isnot {
		padding: 18px;
		background: var(--ground);
	}
	.isnot__head {
		margin: 0;
		font-weight: 600;
		color: var(--ink);
	}
	.isnot ul {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		font-size: 0.94rem;
		color: var(--ink-80);
	}
	.isnot li {
		display: grid;
		grid-template-columns: 15px minmax(0, 1fr);
		gap: 9px;
		align-items: start;
	}
	.isnot :global(svg) {
		margin-top: 2px;
		color: var(--ink-40);
	}
	.sub {
		margin: clamp(32px, 4vw, 52px) 0 14px;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.matrix {
		margin-top: clamp(24px, 3vw, 36px);
	}

	/* Two buyers, side by side. */
	.buyers {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.buyer {
		padding: clamp(18px, 2vw, 26px);
	}
	.buyer__who {
		margin: 16px 0 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.buyer__title {
		margin: 6px 0 0;
		font-size: clamp(1.2rem, 1.8vw, 1.45rem);
		letter-spacing: -0.02em;
		text-wrap: balance;
	}
	.buyer__body {
		margin: 10px 0 0;
		line-height: 1.55;
		color: var(--ink-60);
		max-width: 32rem;
		text-wrap: pretty;
	}
	.also {
		margin: 16px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	/* Supported integrations: one row each, with its status. */
	.ifaces {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.iface {
		display: grid;
		gap: 8px;
		justify-items: start;
		align-content: start;
		padding: 16px;
		background: transparent;
		border-style: dashed;
		border-color: var(--ink-20);
	}
	.iface--live {
		background: #fff;
		border-style: solid;
		border-color: var(--green);
		box-shadow: 0 0 0 1px var(--green);
	}
	.iface__name {
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--ink);
	}
	.iface__note {
		font-size: 0.88rem;
		line-height: 1.4;
		color: var(--ink-60);
	}

	/* The one status block. */
	.status {
		padding: clamp(18px, 2.4vw, 30px);
		border-left: 3px solid var(--green);
	}
	.status__top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 14px;
	}
	.status__title {
		margin: 0;
		font-size: var(--t-h3, 1.4rem);
		letter-spacing: -0.02em;
	}
	.status__text {
		margin: 12px 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-80);
		max-width: 46rem;
		text-wrap: pretty;
	}
	.status__more {
		margin: 10px 0 0;
		font-size: var(--t-small);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 46rem;
	}
	.status__more a {
		font-weight: 600;
		color: var(--blue);
		white-space: nowrap;
	}

	/* Three offers, in brief. */
	.offers {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.offer {
		display: flex;
		flex-direction: column;
		padding: 18px;
	}
	.offer--primary {
		border-color: var(--navy);
		box-shadow: 0 0 0 1px var(--navy);
	}
	.offer__label {
		margin: 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.offer__price {
		margin: 6px 0 0;
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.offer__body {
		margin: 8px 0 0;
		font-size: 0.93rem;
		line-height: 1.5;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.offer__go {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: auto;
		padding-top: 14px;
		font-weight: 600;
		color: var(--blue);
	}
	.offers__all {
		margin: 18px 0 0;
	}
	.offers__all a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: var(--blue);
	}

	/* Where it goes next: a quiet list, one line each. */
	.modules {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.module {
		display: grid;
		grid-template-columns: 1fr;
		gap: 6px;
		justify-items: start;
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
	}
	.module__name {
		font-weight: 600;
		color: var(--ink-60);
	}
	.module--now .module__name {
		color: var(--ink);
	}
	.module__body {
		font-size: 0.92rem;
		line-height: 1.45;
		color: var(--ink-60);
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
		.buyers,
		.ifaces {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.module {
			grid-template-columns: 8.5rem 8rem minmax(0, 1fr);
			align-items: baseline;
			gap: 16px;
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
		.indep {
			grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
		}
		.offers {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 1100px) {
		.caps,
		.ifaces {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
