<script lang="ts">
	// A landing page: one short page for one thing people search for. It says
	// what you get, what it costs, shows a real site we built for that kind of
	// business, answers three questions and asks for the enquiry. All of the
	// words live in $lib/content/site.ts under `landings`.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { work, houses, plans, landings, replyWithin, euro } from '$lib/content/site';
	import { service, breadcrumb, faq } from '$lib/content/structured';

	let { data } = $props();
	const l = $derived(data.landing);

	const offered = $derived(plans.filter((p) => l.plans.includes(p.name)));
	const jobs = $derived(work.filter((w) => l.examples.includes(w.name)));
	const ours = $derived(houses.filter((h) => l.examples.includes(h.name)));
	const others = $derived(landings.filter((o) => o.slug !== l.slug));
</script>

<Seo
	title={l.metaTitle}
	shareTitle="{l.title} | VNTA"
	description={l.description}
	ld={[service(l), breadcrumb(l), faq(l.questions)]}
/>

<main>
	<section class="band" data-theme="tint" aria-labelledby="landing-title">
		<div class="wrap lead">
			<h1 class="lead__title" id="landing-title">{l.title}</h1>
			<p class="lead__lede">{l.lede}</p>
			<div class="lead__cta">
				<a class="btn btn--solid" href="#quote">Get a price</a>
				<a class="btn btn--ghost" href="#example">See one we built</a>
			</div>
		</div>
	</section>

	<section class="band" aria-labelledby="gets-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="gets-title">What you get</h2>
			</div>
			<div class="offer">
				<div class="card offer__gets">
					<ul class="list offer__list">
						{#each l.gets as line}
							<li>{line}</li>
						{/each}
					</ul>
				</div>
				<div class="plans plans--1">
					{#each offered as plan}
						<article class="plan card">
							<h3 class="plan__name">{plan.name}</h3>
							<p class="plan__for">{plan.for}</p>
							<p class="plan__price">
								<span class="plan__from">from</span>
								<span class="plan__build">{euro(plan.build)}</span>
							</p>
							<p class="plan__monthly">then {euro(plan.monthly)} a month</p>
							<p class="plan__time">{plan.time}</p>
						</article>
					{/each}
				</div>
			</div>
			<p class="offer__note">
				No contract. You get the exact price in writing before we start.
				<a class="link" href="{base}/#prices">See all prices</a>
			</p>
		</div>
	</section>

	<section class="band" id="example" data-theme="tint" aria-labelledby="example-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="example-title">
					{jobs.length + ours.length > 1 ? 'Sites we built' : 'A site we built'}
				</h2>
			</div>
			<div class="jobs">
				{#each jobs as job}
					<ProjectCard
						world={job.world}
						image={job.image}
						alt={job.alt}
						meta="{job.trade}, {job.place}"
						status={job.status}
						live={job.status === 'Live'}
						name={job.name}
						href={job.href}
						domain={job.domain}
						summary={job.summary}
						built={job.built}
					/>
				{/each}
				{#each ours as house}
					<ProjectCard
						world={house.world}
						image={house.image}
						alt={house.alt}
						meta="Our own {(house.kind ?? 'company').toLowerCase()}"
						status={house.status}
						name={house.name}
						href={house.href}
						domain={house.domain}
						summary={house.line}
						built={house.built}
					/>
				{/each}
			</div>
		</div>
	</section>

	<section class="band" aria-labelledby="questions-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="questions-title">Questions</h2>
			</div>
			<div class="group qa">
				{#each l.questions as item}
					<details class="qa__item" open>
						<summary>{item.q}</summary>
						<p>{item.a}</p>
					</details>
				{/each}
			</div>
			<p class="offer__note">
				<a class="link" href="{base}/#questions">More questions and answers</a>
			</p>
		</div>
	</section>

	<section class="band" id="quote" data-theme="tint" aria-labelledby="quote-title">
		<div class="wrap">
			<div class="quote card" data-theme="ink">
				<div class="quote__say">
					<h2 class="head__title" id="quote-title">Get a price</h2>
					<p class="head__text">
						Tell us what you do. We reply within {replyWithin} with a fixed price. It
						costs nothing to ask.
					</p>
				</div>
				<div class="quote__form">
					<EnquiryForm source="/{l.slug}" />
				</div>
			</div>

			<nav class="also" aria-label="More from VNTA">
				<span>Also from VNTA</span>
				{#each others as o}
					<a class="link" href="{base}/{o.slug}">{o.label}</a>
				{/each}
			</nav>
		</div>
	</section>
</main>

<style>
	.lead {
		padding-top: clamp(40px, 6vw, 88px);
		padding-bottom: clamp(40px, 6vw, 80px);
	}
	.lead__title {
		margin: 0;
		font-size: var(--t-h1);
		line-height: 1.05;
		max-width: 16ch;
		text-wrap: balance;
		color: var(--ink);
	}
	.lead__lede {
		margin: clamp(16px, 2vw, 24px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-60);
		max-width: 40ch;
		text-wrap: pretty;
	}
	.lead__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 32px);
	}

	/* What you get, with the price beside it. */
	.offer {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(12px, 1.6vw, 20px);
		align-items: start;
	}
	.offer__gets {
		padding: clamp(22px, 2.6vw, 32px);
	}
	.offer__list {
		font-size: var(--t-body);
		gap: 12px;
	}
	.offer__list li::before {
		top: 0.6em;
	}
	.offer__note {
		margin: clamp(16px, 2vw, 24px) 0 0;
		font-size: var(--t-body);
		color: var(--ink-60);
	}

	.also {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin-top: clamp(24px, 3vw, 40px);
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	@media (min-width: 900px) {
		.offer {
			grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		}
	}
</style>
