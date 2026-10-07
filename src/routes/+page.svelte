<script lang="ts">
	// The home page, and most of the site. One scroll, in the order a business
	// owner asks the questions: what do you do, show me, how much, how does it
	// work, how do I start. Kept short on purpose: the reader is on a phone
	// between jobs. All of the words and numbers live in $lib/content/site.ts.
	//
	// The look is the brand guideline's: black and white bands, a full rule
	// and a title in capitals opening each one, and lists set as ruled rows.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import Symbol from '$lib/components/ui/Symbol.svelte';
	import {
		work,
		plans,
		priceNotes,
		steps,
		questions,
		houses,
		studioEmail,
		replyWithin,
		euro
	} from '$lib/content/site';

	const fromBuild = Math.min(...plans.map((p) => p.build));
	const fromMonthly = Math.min(...plans.map((p) => p.monthly));

	const description = `VNTA builds websites for Irish garages, dealers, shops and trades, and looks after them every month. From ${euro(fromBuild)}, then ${euro(fromMonthly)} a month.`;

	// Structured data: who we are and what a site costs, in the form Google reads.
	const ld = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: 'VNTA',
		legalName: 'Vantanéant International Ltd',
		url: 'https://vnta.xyz/',
		email: studioEmail,
		image: 'https://vnta.xyz/og.png',
		description,
		areaServed: { '@type': 'Country', name: 'Ireland' },
		address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
		makesOffer: plans.map((p) => ({
			'@type': 'Offer',
			name: `${p.name} website`,
			description: p.for,
			price: p.build,
			priceCurrency: 'EUR'
		}))
	});

	// The questions, in the same form, so search engines and AI assistants can
	// quote the answer and not guess at it.
	const faqLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: questions.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: { '@type': 'Answer', text: item.a }
		}))
	});
</script>

<svelte:head>
	<title>VNTA | Websites for Irish businesses, from {euro(fromBuild)}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="VNTA | Websites that bring in the work" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	{@html `<script type="application/ld+json">${ld}<\/script>`}
	{@html `<script type="application/ld+json">${faqLd}<\/script>`}
</svelte:head>

<main>
	<!-- HERO: black, the statement, and the three facts as ruled rows -->
	<section class="band hero" data-theme="ink" aria-labelledby="hero-title">
		<div class="wrap">
			<div class="hero__top">
				<div class="hero__say">
					<h1 class="hero__title" id="hero-title">Websites that bring in the work.</h1>
					<p class="hero__lede">
						We build websites for Irish garages, dealers, shops and trades, and look
						after them every month.
					</p>
					<div class="hero__cta">
						<a class="btn btn--solid" href="#quote">Get a price</a>
						<a class="btn btn--ghost" href="#work">See the work</a>
					</div>
				</div>
				<div class="hero__symbol"><Symbol size={0} /></div>
			</div>

			<dl class="rows hero__facts">
				<div class="row">
					<dt class="row__term">A new website</dt>
					<dd class="row__desc">from {euro(fromBuild)}</dd>
				</div>
				<div class="row">
					<dt class="row__term">Hosted and looked after</dt>
					<dd class="row__desc">from {euro(fromMonthly)} a month</dd>
				</div>
				<div class="row">
					<dt class="row__term">Your price, in writing</dt>
					<dd class="row__desc">within {replyWithin}</dd>
				</div>
			</dl>
		</div>
	</section>

	<!-- WORK: white, so the client sites carry the only colour on the page -->
	<section class="band" id="work" aria-labelledby="work-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="work-title">The work</h2>
				<p class="head__text">Three Irish businesses. Each site built from scratch.</p>
			</div>

			<div class="jobs">
				{#each work as job}
					<article class="job">
						<div class="job__shot">
							<img
								src="{base}/work/{job.image}.jpg"
								srcset="{base}/work/{job.image}-720.jpg 720w, {base}/work/{job.image}.jpg 1440w"
								sizes="(min-width: 900px) 50vw, 100vw"
								width="1440"
								height="900"
								loading="lazy"
								decoding="async"
								alt={job.alt}
							/>
						</div>
						<div class="job__text">
							<h3 class="job__name">{job.name}</h3>
							<p class="job__meta">
								{job.trade}, {job.place}
								<span class="tag" class:tag--quiet={job.status !== 'Live'}>{job.status}</span>
							</p>
							<p class="job__summary">{job.summary}</p>
							<ul class="list">
								{#each job.built as line}
									<li>{line}</li>
								{/each}
							</ul>
							{#if job.href}
								<p class="job__foot">
									<a class="link" href={job.href} rel="noopener">Visit {job.domain}</a>
								</p>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- PRICES: black, set as a price list -->
	<section class="band" id="prices" data-theme="ink" aria-labelledby="prices-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="prices-title">Prices</h2>
				<p class="head__text">
					One price to build it. One a month to run it. You get the exact figure before
					we start.
				</p>
			</div>

			<div class="plans">
				{#each plans as plan}
					<article class="plan">
						<div class="plan__what">
							<h3 class="plan__name">{plan.name}</h3>
							<p class="plan__for">{plan.for}</p>
						</div>
						<ul class="list plan__list">
							{#each plan.includes as line}
								<li>{line}</li>
							{/each}
						</ul>
						<div class="plan__cost">
							<p class="plan__price">
								<span class="plan__from">from</span>
								<span class="plan__build">{euro(plan.build)}</span>
							</p>
							<p class="plan__monthly">then {euro(plan.monthly)} a month</p>
							<p class="plan__time">{plan.time}</p>
						</div>
					</article>
				{/each}
			</div>

			<dl class="rows notes">
				{#each priceNotes as note}
					<div class="row">
						<dt class="row__term">{note.name}</dt>
						<dd class="row__desc">{note.body}</dd>
					</div>
				{/each}
			</dl>

			<p class="prices__cta">
				<a class="btn btn--solid" href="#quote">Get a price</a>
				<span>Not sure which one? Tell us what you do and we will say.</span>
			</p>
		</div>
	</section>

	<!-- HOW IT WORKS: white -->
	<section class="band" id="how" aria-labelledby="how-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="how-title">How it works</h2>
				<p class="head__text">
					People design and build your site, with AI helping along the way. We are proud
					of that.
				</p>
			</div>

			<ol class="rows steps">
				{#each steps as step, i}
					<li class="row step">
						<h3 class="row__term">
							<span class="step__n" aria-hidden="true">{i + 1}</span>{step.name}
						</h3>
						<p class="row__desc">{step.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- QUESTIONS: white, joined to the band above -->
	<section class="band band--joined" id="questions" aria-labelledby="questions-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="questions-title">Questions</h2>
			</div>

			<div class="qa">
				{#each questions as item}
					<details class="qa__item">
						<summary>{item.q}</summary>
						<p>{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- QUOTE: black -->
	<section class="band" id="quote" data-theme="ink" aria-labelledby="quote-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="quote-title">Get a price</h2>
				<p class="head__text">
					Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
					nothing to ask.
				</p>
			</div>
			<div class="quote__form">
				<EnquiryForm source="/" />
			</div>
		</div>
	</section>

	<!-- US: black, joined. The lockup, and two lines. -->
	<section class="band band--joined" id="us" data-theme="ink" aria-labelledby="us-title">
		<div class="wrap">
			<div class="us">
				<h2 class="us__lockup" id="us-title">
					<Symbol size={0} />
					<Wordmark height={0} label="VNTA" />
				</h2>
				<div class="us__text">
					<p>
						A small studio in Dublin. We also build and run our own companies,
						{#each houses as house, i}<a class="link" href={house.href} rel="noopener">{house.name}</a>{i < houses.length - 2 ? ', ' : i === houses.length - 2 ? ' and ' : ''}{/each},
						the same way we build yours.
					</p>
					<p class="us__mail">
						<a class="link" href="mailto:{studioEmail}">{studioEmail}</a>
					</p>
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	/* --- Hero ------------------------------------------------------------- */
	.hero > .wrap {
		padding-top: clamp(48px, 7vw, 112px);
		padding-bottom: clamp(40px, 5vw, 80px);
	}
	.hero__top {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(32px, 5vw, 80px);
		align-items: center;
	}
	/* Heading 1 on the guideline's scale: 64px, at its natural spacing. */
	.hero__title {
		margin: 0;
		font-size: var(--t-h1);
		line-height: 1.08;
		max-width: 14ch;
		text-wrap: balance;
		color: var(--ink);
	}
	.hero__lede {
		margin: clamp(20px, 2.4vw, 32px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-80);
		max-width: 34ch;
		text-wrap: pretty;
	}
	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(24px, 2.8vw, 40px);
	}
	/* The symbol stands where the guideline puts its photographs: to the
	   right, on black, with room around it. Hidden on a phone, where the
	   words need the space. */
	.hero__symbol {
		display: none;
		color: var(--ink);
	}
	.hero__symbol :global(svg) {
		width: 100%;
		height: auto;
	}
	.hero__facts {
		margin-top: clamp(40px, 6vw, 96px);
	}
	.hero__facts .row__desc {
		font-family: var(--font-display);
		font-size: var(--t-h4);
		color: var(--ink);
	}

	/* --- Work ------------------------------------------------------------- */
	.jobs {
		display: grid;
		gap: clamp(48px, 6vw, 96px);
	}
	.job {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(20px, 3vw, 48px);
		align-items: start;
	}
	/* Framed with a thin line, as the guideline frames its logos. */
	.job__shot {
		border: 1px solid var(--ink);
		line-height: 0;
	}
	.job__shot img {
		display: block;
		width: 100%;
		height: auto;
	}
	.job__name {
		margin: 0;
		font-size: var(--t-h3);
		color: var(--ink);
	}
	.job__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin: 10px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.tag {
		display: inline-block;
		padding: 3px 8px;
		border: 1px solid var(--ink);
		font-family: var(--font-body);
		font-size: 0.7rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--ink);
	}
	.tag--quiet {
		border-color: var(--ink-60);
		color: var(--ink-60);
	}
	.job__summary {
		margin: 18px 0 0;
		font-size: var(--t-body);
		line-height: 1.45;
		color: var(--ink);
		max-width: 40ch;
		text-wrap: pretty;
	}
	.job .list {
		margin-top: 18px;
	}
	.job__foot {
		margin: 22px 0 0;
		font-size: var(--t-body);
	}

	/* A plain list of what you get. The mark is a small square: not a tick,
	   because nothing is being celebrated, and not a rule, because a rule
	   before a line of text reads as a dash. */
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		align-content: start;
		gap: 8px;
		font-size: var(--t-small);
		line-height: 1.4;
		color: var(--ink-80);
	}
	.list li {
		position: relative;
		padding-left: 18px;
	}
	.list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.52em;
		width: 5px;
		height: 5px;
		background: var(--ink);
	}

	/* --- Prices: a price list. What it is, what is in it, what it costs. --- */
	.plan {
		display: grid;
		grid-template-columns: 1fr;
		gap: 18px clamp(24px, 3vw, 48px);
		align-items: start;
		padding: clamp(24px, 2.8vw, 40px) 0;
		border-bottom: 1px solid var(--line);
	}
	.plan:first-child {
		border-top: 1px solid var(--line);
	}
	.plan__name {
		margin: 0;
		font-size: var(--t-h3);
		color: var(--ink);
	}
	.plan__for {
		margin: 10px 0 0;
		font-size: var(--t-body);
		line-height: 1.4;
		color: var(--ink-80);
		max-width: 28ch;
		text-wrap: pretty;
	}
	.plan__list {
		padding-top: 6px;
	}
	.plan__price {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin: 0;
	}
	.plan__from {
		font-size: var(--t-body);
		color: var(--ink-80);
	}
	.plan__build {
		font-family: var(--font-display);
		font-size: var(--t-h2);
		line-height: 1;
		color: var(--ink);
	}
	.plan__monthly {
		margin: 10px 0 0;
		font-family: var(--font-display);
		font-size: var(--t-h4);
		line-height: 1.2;
		color: var(--ink);
	}
	.plan__time {
		margin: 10px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	.notes {
		margin-top: clamp(40px, 5vw, 80px);
	}
	.prices__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 24px;
		margin: clamp(32px, 4vw, 56px) 0 0;
		font-size: var(--t-body);
		color: var(--ink-80);
	}

	/* --- Steps: a real sequence, so it is numbered. ----------------------- */
	.step__n {
		display: inline-block;
		width: 1.6em;
		color: var(--ink-60);
	}

	/* --- Questions -------------------------------------------------------- */
	.qa {
		border-top: 1px solid var(--line);
	}
	.qa__item {
		border-bottom: 1px solid var(--line);
	}
	.qa__item summary {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 24px;
		padding: clamp(18px, 2vw, 28px) 0;
		font-family: var(--font-display);
		font-size: var(--t-h4);
		line-height: 1.25;
		color: var(--ink);
		cursor: pointer;
		list-style: none;
	}
	.qa__item summary::-webkit-details-marker {
		display: none;
	}
	.qa__item summary::after {
		content: '+';
		flex: none;
		font-family: var(--font-body);
		font-size: 1.3rem;
		font-weight: 400;
		color: var(--ink-60);
		transition: transform var(--dur) var(--ease);
	}
	.qa__item[open] summary::after {
		transform: rotate(45deg);
	}
	.qa__item p {
		margin: 0;
		padding: 0 0 clamp(20px, 2.2vw, 30px);
		font-size: var(--t-body);
		line-height: 1.5;
		color: var(--ink-80);
		max-width: 56ch;
		text-wrap: pretty;
	}

	/* --- Us: the lockup (guideline 2.3), symbol over wordmark, and two
	   lines beside it. --------------------------------------------------- */
	.us {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(32px, 4vw, 64px);
		align-items: end;
		border-top: 1px solid var(--line);
		padding-top: clamp(48px, 6vw, 96px);
	}
	/* The lockup keeps its own arrangement, symbol centred over wordmark,
	   and the block as a whole sits on the left of the grid. */
	.us__lockup {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(18px, 2.2vw, 30px);
		width: clamp(200px, 26vw, 360px);
		margin: 0;
		color: var(--ink);
	}
	.us__lockup :global(.symbol) {
		width: 38%;
		height: auto;
	}
	.us__lockup :global(.wordmark) {
		width: 100%;
		height: auto !important;
	}
	.us__text p {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-80);
		max-width: 34ch;
		text-wrap: pretty;
	}
	.us__text .us__mail {
		margin-top: 18px;
		font-size: var(--t-body);
	}

	/* --- Wide ------------------------------------------------------------- */
	@media (min-width: 900px) {
		.hero__top {
			grid-template-columns: minmax(0, 7fr) minmax(0, 3fr);
		}
		.hero__symbol {
			display: block;
			max-width: 340px;
			justify-self: end;
			width: 100%;
		}
		.job {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
		.plan {
			grid-template-columns: minmax(0, 4fr) minmax(0, 4fr) minmax(0, 4fr);
		}
		.plan__cost {
			justify-self: end;
			text-align: left;
			min-width: 15ch;
		}
		.quote__form {
			margin-left: calc(50% + clamp(12px, 1.5vw, 24px));
		}
		.us {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
	}
</style>
