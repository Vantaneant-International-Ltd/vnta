<script lang="ts">
	// VNTA Robotics: the first system, and the only one being built. This page
	// lives on the parent site for now. When robotics.vnta.xyz exists it moves
	// there: change roboticsUrl in content/site.ts and add the redirect in
	// static/_redirects.
	//
	// The product is in development. Every claim on this page is about what it
	// is being designed to do, and the one picture of an interface is labelled
	// as a concept with example data.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import Architecture from '$lib/components/Architecture.svelte';
	import Concept from '$lib/components/Concept.svelte';
	import { robotics, capabilities } from '$lib/content/site';

	// The three that sit under the headline: who a machine is, what it may do,
	// and how its work is coordinated.
	const first = ['Machine identity', 'Permissions and policy', 'Task orchestration'].map(
		(n) => capabilities.find((c) => c.name === n)!
	);
	import { roboticsProduct, breadcrumb } from '$lib/content/structured';
</script>

<Seo
	title="VNTA Robotics | Infrastructure for trusted autonomous machines"
	shareTitle="VNTA Robotics | {robotics.positioning}"
	image="/share/robotics.png"
	imageAlt="VNTA Robotics. {robotics.positioning} In development."
	description="{robotics.what} Identity, permissions, connectivity, orchestration, telemetry and audit. In development."
	ld={[roboticsProduct(), breadcrumb('Robotics', '/robotics')]}
/>

<main>
	<section class="band lead" aria-labelledby="robotics-title">
		<div class="wrap lead__grid">
			<div>
				<div class="lead__top">
					<p class="eyebrow">{robotics.name}</p>
					<Stage stage={robotics.stage} />
				</div>
				<h1 class="lead__title" id="robotics-title">{robotics.positioning}</h1>
				<p class="lead__lede">{robotics.what}</p>
				<div class="lead__cta">
					<a class="btn btn--solid" href="{base}/contact">
						Talk to us about Robotics
						<Icon name="arrow" size={18} />
					</a>
					<a class="btn btn--ghost" href="#capabilities">What it is designed to do</a>
				</div>
			</div>
			<Concept compact />
		</div>

		<!-- The three things the layer starts from. -->
		<div class="wrap lead__three">
			{#each first as c}
				<a class="pillar card" href="#capabilities">
					<span class="well"><Icon name={c.icon} size={20} /></span>
					<span>
						<span class="pillar__name">{c.name}</span>
						<span class="pillar__body">{c.body}</span>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="band band--paper" aria-labelledby="layer-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Architecture</p>
				<h2 class="head__title" id="layer-title">{robotics.headline}</h2>
				<p class="head__text">{robotics.body}</p>
			</div>
			<Architecture />
		</div>
	</section>

	<section class="band" id="capabilities" aria-labelledby="capabilities-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Designed to provide</p>
				<h2 class="head__title" id="capabilities-title">One layer under every machine.</h2>
				<p class="head__text">
					What the control layer is being built to do. None of this is available to buy yet.
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

	<section class="band band--paper" aria-labelledby="concept-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">Interface concept</p>
				<h2 class="head__title" id="concept-title">Every machine, with a record.</h2>
				<p class="head__text">
					What it is, what it may do, and what it did. A design, shown with example data.
				</p>
			</div>
			<Concept />
		</div>
	</section>

	<!-- The close: dark, and it runs into the foot. -->
	<section class="band close" data-theme="ink" aria-labelledby="next-title">
		<div class="wrap next">
			<div>
				<h2 class="head__title" id="next-title">One control layer for every autonomous machine.</h2>
				<p class="next__text">
					{robotics.honest} If you run autonomous machines, or make them, we would like to
					hear how you work.
				</p>
			</div>
			<a class="btn btn--solid" href="{base}/contact">
				Contact VNTA
				<Icon name="arrow" size={18} />
			</a>
		</div>
	</section>
</main>

<style>
	.lead {
		background:
			radial-gradient(60% 90% at 80% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 70%),
			var(--ground);
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
		transition: border-color var(--dur) var(--ease);
	}
	.pillar:hover {
		border-color: var(--ink-20);
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
		max-width: 16ch;
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

	/* The capabilities: a dense grid of small panels, icon then words. */
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

	@media (min-width: 640px) {
		.caps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
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
	}
	@media (min-width: 1100px) {
		.caps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
