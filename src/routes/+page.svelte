<script lang="ts">
	// The home page of the parent company. It says what VNTA is building, shows
	// the one business area in development (VNTA Robotics), and is honest about
	// what is still research. Kept short. All of the words live in
	// $lib/content/site.ts.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import Architecture from '$lib/components/Architecture.svelte';
	import {
		pitch,
		statement,
		systems,
		principles,
		company,
		robotics,
		layer,
		roboticsUrl
	} from '$lib/content/site';
	import { organisation, website } from '$lib/content/structured';

	const roboticsHref = roboticsUrl.startsWith('http') ? roboticsUrl : `${base}${roboticsUrl}`;
</script>

<Seo
	title="VNTA | Infrastructure for autonomous systems"
	shareTitle="VNTA | {pitch.headline}"
	image="/share/home.png"
	description="{pitch.short} Its current work, VNTA Robotics, is developer infrastructure for autonomous machines: it connects to a robot or fleet system, tests what it can actually do, and keeps the evidence. In development."
	ld={[organisation(), website()]}
/>

<main>
	<!-- HERO: what VNTA builds, and a panel that reads like the product: the
	     systems and where each one stands. Nothing in it is a metric. -->
	<section class="band hero" aria-labelledby="hero-title">
		<div class="wrap hero__grid">
			<div class="hero__say">
				<p class="eyebrow">{pitch.eyebrow}</p>
				<h1 class="hero__title" id="hero-title">{pitch.headline}</h1>
				<p class="hero__lede">{pitch.lede}</p>
				<div class="hero__cta">
					<a class="btn btn--solid" href={roboticsHref}>
						Explore VNTA Robotics
						<Icon name="arrow" size={18} />
					</a>
					<a class="btn btn--ghost" href="#company">About VNTA</a>
				</div>
			</div>

			<div class="panel card" aria-label="VNTA systems and where each one stands">
				<div class="panel__head">
					<span class="well"><Icon name="layers" size={20} /></span>
					<div>
						<p class="panel__title">VNTA infrastructure</p>
						<p class="panel__sub">One layer. Three kinds of system.</p>
					</div>
				</div>

				<table class="panel__table">
					<thead>
						<tr>
							<th scope="col">System</th>
							<th scope="col" class="panel__wide">Layer</th>
							<th scope="col">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each systems as s}
							<tr>
								<th scope="row"><Icon name={s.icon} size={18} />{s.name}</th>
								<td class="panel__wide">{s.layer}</td>
								<td><Stage stage={s.stage} /></td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="panel__foot">
					<p class="eyebrow">VNTA Robotics today</p>
					<ul class="chips">
						{#each layer as l}
							<li><Icon name={l.icon} size={15} />{l.name}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<!-- STATEMENT -->
	<section class="band band--paper" aria-labelledby="why-title">
		<div class="wrap split">
			<h2 class="head__title" id="why-title">{statement.headline}</h2>
			<p class="split__text">{statement.body}</p>
		</div>
	</section>

	<!-- 01 / VNTA ROBOTICS: the one system being worked on -->
	<section class="band" id="robotics" aria-labelledby="robotics-title">
		<div class="wrap">
			<div class="lead">
				<div class="lead__say">
					<p class="eyebrow">01 / {robotics.name}</p>
					<h2 class="head__title" id="robotics-title">{robotics.headline}</h2>
					<p class="head__text">{robotics.what} {robotics.body}</p>
					<a class="go" href={roboticsHref}>Explore Robotics <Icon name="arrow" size={16} /></a>
				</div>
			</div>
			<Architecture />
		</div>
	</section>

	<!-- TECHNOLOGY: one layer, three kinds of system. Only one is being worked on. -->
	<section class="band band--paper" id="technology" aria-labelledby="technology-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Technology</p>
				<h2 class="head__title" id="technology-title">
					One infrastructure layer. Many autonomous systems.
				</h2>
			</div>

			<div class="systems">
				{#each systems as s}
					<article class="system card" class:system--later={s.stage !== 'In development'}>
						<div class="system__top">
							<span class="well"><Icon name={s.icon} size={20} /></span>
							<Stage stage={s.stage} />
						</div>
						<h3 class="system__name">{s.name}</h3>
						<p class="system__body">{s.body}</p>
						{#if s.stage === 'In development'}
							<a class="go" href={roboticsHref}>{robotics.name} <Icon name="arrow" size={16} /></a>
						{/if}
					</article>
				{/each}
			</div>

			<!-- PRINCIPLES -->
			<div class="head head--second">
				<p class="eyebrow">Approach</p>
				<h2 class="head__title">Built from the infrastructure layer up.</h2>
			</div>

			<div class="principles">
				{#each principles as p}
					<div class="principle">
						<span class="well"><Icon name={p.icon} size={20} /></span>
						<h3 class="principle__name">{p.name}</h3>
						<p class="principle__body">{p.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- COMPANY -->
	<section class="band" id="company" aria-labelledby="company-title">
		<div class="wrap split split--company">
			<div>
				<p class="eyebrow">Company</p>
				<h2 class="company__title" id="company-title">VNTA</h2>
				<p class="split__text">{company.body}</p>
				<p class="company__also">
					{company.studio}
					<a class="link" href="{base}/studio">VNTA Studio</a>
				</p>
			</div>
			<dl class="facts card">
				<div class="facts__row">
					<dt><Icon name="calendar" size={18} />Founded</dt>
					<dd>{company.founded}</dd>
				</div>
				<div class="facts__row">
					<dt><Icon name="pin" size={18} />Based</dt>
					<dd>{company.place}</dd>
				</div>
				<div class="facts__row">
					<dt><Icon name="layers" size={18} />First system</dt>
					<dd><a class="link" href={roboticsHref}>{robotics.name}</a></dd>
				</div>
			</dl>
		</div>
	</section>
</main>

<style>
	/* --- Hero ------------------------------------------------------------- */
	.hero {
		background:
			radial-gradient(60% 80% at 85% 10%, #ffffff 0%, rgba(255, 255, 255, 0) 70%),
			var(--ground);
	}
	.band > .hero__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(32px, 5vw, 64px);
		align-items: center;
		padding-top: clamp(40px, 6vw, 88px);
		padding-bottom: clamp(48px, 6vw, 88px);
	}
	.hero__title {
		margin: 16px 0 0;
		font-size: var(--t-hero);
		line-height: 1.03;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}
	.hero__lede {
		margin: clamp(16px, 1.8vw, 22px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 34rem;
		text-wrap: pretty;
	}
	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 32px);
	}

	/* The panel: a small control screen. Systems down the side, where each
	   one stands on the right. */
	.panel {
		padding: clamp(16px, 1.8vw, 22px);
		box-shadow: var(--lift);
		min-width: 0;
	}
	.panel__head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.panel__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.panel__sub {
		margin: 1px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.panel__table {
		width: 100%;
		margin-top: 16px;
		border-collapse: collapse;
		font-size: 0.92rem;
	}
	.panel__table thead th {
		padding: 9px 10px;
		background: var(--ground);
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: left;
		color: var(--ink-60);
	}
	.panel__table thead th:first-child {
		border-radius: 8px 0 0 8px;
	}
	.panel__table thead th:last-child {
		border-radius: 0 8px 8px 0;
	}
	.panel__table tbody th,
	.panel__table tbody td {
		padding: 13px 10px;
		border-bottom: 1px solid var(--line-soft);
		text-align: left;
		vertical-align: middle;
		color: var(--ink-60);
	}
	.panel__table tbody th {
		display: flex;
		align-items: center;
		gap: 9px;
		font-weight: 600;
		color: var(--ink);
	}
	.panel__wide {
		display: none;
	}
	.panel__foot {
		margin-top: 16px;
	}
	.chips {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chips li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 10px 5px 8px;
		border: 1px solid var(--line);
		border-radius: var(--r-chip);
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ink-80);
	}

	/* --- A heading on one side, its paragraph on the other. --------------- */
	.split {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(16px, 3vw, 56px);
		align-items: start;
	}
	.split__text {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink-60);
		max-width: 38rem;
		text-wrap: pretty;
	}

	/* --- Robotics: the words, then the diagram. --------------------------- */
	.lead {
		margin-bottom: clamp(28px, 3.6vw, 48px);
	}
	.lead__say {
		display: grid;
		gap: 14px;
		max-width: 42rem;
		justify-items: start;
	}

	/* --- The three kinds of system. The one being worked on is solid; the two
	   in research are drawn with a broken edge and stand back. ------------- */
	.systems {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}
	.system {
		display: flex;
		flex-direction: column;
		padding: clamp(18px, 2vw, 24px);
	}
	.system--later {
		background: transparent;
		border-style: dashed;
		border-color: var(--ink-20);
	}
	.system__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.system__name {
		margin: 18px 0 0;
		font-size: 1.25rem;
		line-height: 1.2;
	}
	.system__body {
		margin: 8px 0 0;
		color: var(--ink-60);
		text-wrap: pretty;
		flex: 1;
	}
	.system .go {
		margin-top: 10px;
	}

	/* --- Principles ------------------------------------------------------- */
	.head--second {
		margin-top: clamp(56px, 7vw, 96px);
	}
	.principles {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px clamp(20px, 3vw, 40px);
	}
	.principle__name {
		margin: 14px 0 0;
		font-size: var(--t-h3);
	}
	.principle__body {
		margin: 6px 0 0;
		font-size: 0.97rem;
		color: var(--ink-60);
		text-wrap: pretty;
	}

	/* --- Company ---------------------------------------------------------- */
	.company__title {
		margin: 12px 0 14px;
		font-size: var(--t-h1);
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.company__also {
		margin: 16px 0 0;
		font-size: var(--t-small);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 34rem;
	}
	.facts {
		margin: 0;
		padding: 6px clamp(16px, 2vw, 22px);
	}
	.facts__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 0;
		border-top: 1px solid var(--line-soft);
	}
	.facts__row:first-child {
		border-top: 0;
	}
	.facts dt {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.facts dd {
		margin: 0;
		font-weight: 600;
		color: var(--ink);
		text-align: right;
	}

	/* --- Wide ------------------------------------------------------------- */
	@media (min-width: 560px) {
		.panel__wide {
			display: table-cell;
		}
		.principles {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.band > .hero__grid {
			grid-template-columns: minmax(0, 11fr) minmax(0, 10fr);
		}
		.split {
			grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		}
		.split--company {
			align-items: center;
		}
		.systems {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.principles {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
