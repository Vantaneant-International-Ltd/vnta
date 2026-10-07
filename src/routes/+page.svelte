<script lang="ts">
	// The home page, and most of the site. One scroll, in the order a business
	// owner asks the questions: what do you do, show me, how much, how does it
	// work, how do I start. Kept short on purpose: the reader is on a phone
	// between jobs. All of the words and numbers live in $lib/content/site.ts.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
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
	<!-- HERO -->
	<section class="sec hero" aria-labelledby="hero-title">
		<h1 class="hero__title" id="hero-title">Websites that bring in the work.</h1>

		<div class="hero__row">
			<div class="hero__lede">
				<p>
					We build websites for Irish garages, dealers, shops and trades, and look after
					them every month.
				</p>
				<div class="hero__cta">
					<a class="btn btn--solid" href="#quote">Get a price</a>
					<a class="btn btn--ghost" href="#work">See the work</a>
				</div>
			</div>

			<dl class="facts">
				<div class="facts__row">
					<dt>A new website</dt>
					<dd>from {euro(fromBuild)}</dd>
				</div>
				<div class="facts__row">
					<dt>Hosted and looked after</dt>
					<dd>from {euro(fromMonthly)} a month</dd>
				</div>
				<div class="facts__row">
					<dt>Your price, in writing</dt>
					<dd>within {replyWithin}</dd>
				</div>
			</dl>
		</div>
	</section>

	<!-- WORK -->
	<section class="sec" id="work" aria-labelledby="work-title">
		<div class="sec__head">
			<h2 class="sec__title" id="work-title">The work</h2>
			<p class="sec__intro">Three Irish businesses. Each site built from scratch.</p>
		</div>

		<div class="jobs">
			{#each work as job}
				<article class="job">
					<div class="job__shot">
						<img
							src="{base}/work/{job.image}.jpg"
							srcset="{base}/work/{job.image}-720.jpg 720w, {base}/work/{job.image}.jpg 1440w"
							sizes="(min-width: 900px) 58vw, 100vw"
							width="1440"
							height="900"
							loading="lazy"
							decoding="async"
							alt={job.alt}
						/>
					</div>
					<div class="job__text">
						<p class="job__meta">
							{job.trade}, {job.place}
							<span class="tag" class:tag--quiet={job.status !== 'Live'}>{job.status}</span>
						</p>
						<h3 class="job__name">{job.name}</h3>
						<p class="job__summary">{job.summary}</p>
						<ul class="ticks">
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
	</section>

	<!-- PRICES -->
	<section class="sec" id="prices" aria-labelledby="prices-title">
		<div class="sec__head">
			<h2 class="sec__title" id="prices-title">Prices</h2>
			<p class="sec__intro">
				One price to build it. One a month to run it. You get the exact figure before we
				start.
			</p>
		</div>

		<div class="plans">
			{#each plans as plan}
				<article class="plan">
					<h3 class="plan__name">{plan.name}</h3>
					<p class="plan__for">{plan.for}</p>
					<p class="plan__price">
						<span class="plan__from">from</span>
						<span class="plan__build">{euro(plan.build)}</span>
					</p>
					<p class="plan__monthly">then {euro(plan.monthly)} a month</p>
					<ul class="ticks">
						{#each plan.includes as line}
							<li>{line}</li>
						{/each}
					</ul>
					<p class="plan__time">{plan.time}</p>
				</article>
			{/each}
		</div>

		<dl class="notes">
			{#each priceNotes as note}
				<div class="notes__item">
					<dt>{note.name}</dt>
					<dd>{note.body}</dd>
				</div>
			{/each}
		</dl>

		<p class="prices__cta">
			<a class="btn btn--solid" href="#quote">Get a price</a>
			<span>Not sure which one? Tell us what you do and we will say.</span>
		</p>
	</section>

	<!-- HOW IT WORKS -->
	<section class="sec" id="how" aria-labelledby="how-title">
		<div class="sec__head">
			<h2 class="sec__title" id="how-title">How it works</h2>
			<p class="sec__intro">
				People design and build your site, with AI helping along the way. We are proud
				of that.
			</p>
		</div>

		<ol class="steps">
			{#each steps as step, i}
				<li class="step">
					<span class="step__n" aria-hidden="true">{i + 1}</span>
					<h3 class="step__name">{step.name}</h3>
					<p class="step__body">{step.body}</p>
				</li>
			{/each}
		</ol>
	</section>

	<!-- QUESTIONS -->
	<section class="sec qa" id="questions" aria-labelledby="questions-title">
		<h2 class="sec__title" id="questions-title">Questions</h2>
		<div class="qa__list">
			{#each questions as item}
				<details class="qa__item">
					<summary>{item.q}</summary>
					<p>{item.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- QUOTE: the one inverted band on the page -->
	<section class="sec quote" id="quote" data-theme="ink" aria-labelledby="quote-title">
		<div class="quote__side">
			<h2 class="sec__title" id="quote-title">Get a price</h2>
			<p class="quote__lede">
				Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
				nothing to ask.
			</p>
		</div>
		<div class="quote__form">
			<EnquiryForm source="/" />
		</div>
	</section>

	<!-- US -->
	<section class="sec us" id="us" aria-labelledby="us-title">
		<h2 class="us__mark" id="us-title"><Wordmark height={0} label="VNTA" /></h2>
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
	</section>
</main>

<style>
	/* --- Hero: the sentence is the hero. Everything else waits beneath it. -- */
	.hero {
		padding-top: clamp(40px, 6vw, 96px);
	}
	.hero__title {
		margin: 0;
		font-size: clamp(2.7rem, 8.2vw, 7.25rem);
		line-height: 0.98;
		letter-spacing: -0.025em;
		max-width: 13ch;
		text-wrap: balance;
		color: var(--ink);
	}
	.hero__row {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(32px, 4vw, 56px);
		align-items: end;
		margin-top: clamp(32px, 5vw, 80px);
	}
	.hero__lede p {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-85);
		max-width: 44ch;
		text-wrap: pretty;
	}
	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: clamp(22px, 2.4vw, 32px);
	}

	/* The three things an owner wants to know before reading further. A list
	   of terms and answers, ruled like a price board. */
	.facts {
		margin: 0;
		border-top: 1px solid var(--line);
	}
	.facts__row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		padding: 13px 0;
		border-bottom: 1px solid var(--line);
	}
	.facts dt {
		font-size: 0.9rem;
		color: var(--ink-70);
	}
	/* Figures are set in the body face: Marcellus draws its zero as a small
	   round o, which is handsome at display size and a misread at this one. */
	.facts dd {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink);
		text-align: right;
	}

	/* --- Work: the only colour on the page is the work itself. ------------- */
	.jobs {
		display: grid;
		gap: clamp(40px, 5.6vw, 88px);
	}
	.job {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(18px, 3vw, 48px);
		align-items: start;
	}
	.job__shot {
		border: 1px solid var(--line);
		background: var(--paper-2);
		line-height: 0;
	}
	.job__shot img {
		display: block;
		width: 100%;
		height: auto;
	}
	.job__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin: 0;
		font-size: 0.86rem;
		color: var(--ink-70);
	}
	.tag {
		display: inline-block;
		padding: 3px 8px;
		border: 1px solid var(--ink);
		border-radius: var(--radius);
		font-size: 0.7rem;
		font-weight: 600;
		line-height: 1.2;
		color: var(--ink);
	}
	.tag--quiet {
		border-color: var(--ink-35);
		color: var(--ink-70);
	}
	.job__name {
		margin: 10px 0 0;
		font-size: var(--t-h3);
		color: var(--ink);
	}
	.job__summary {
		margin: 14px 0 0;
		font-size: 1.0625rem;
		line-height: 1.55;
		color: var(--ink-85);
		max-width: 46ch;
		text-wrap: pretty;
	}
	.job .ticks {
		margin-top: 18px;
	}
	.job__foot {
		margin: 22px 0 0;
		font-size: 0.94rem;
	}

	/* A plain list of what you get. The mark is a small square: not a tick,
	   because nothing is being celebrated, and not a rule, because a rule
	   before a line of text reads as a dash. */
	.ticks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		align-content: start;
		gap: 9px;
		font-size: 0.94rem;
		line-height: 1.45;
		color: var(--ink-85);
	}
	.ticks li {
		position: relative;
		padding-left: 18px;
	}
	.ticks li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.56em;
		width: 5px;
		height: 5px;
		background: var(--ink);
	}

	/* --- Prices ----------------------------------------------------------- */
	.plans {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(32px, 3vw, 48px);
	}
	.plan {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--ink);
		padding-top: 18px;
	}
	.plan__name {
		margin: 0;
		font-size: var(--t-h4);
		color: var(--ink);
	}
	.plan__for {
		margin: 8px 0 0;
		font-size: 0.94rem;
		line-height: 1.5;
		color: var(--ink-70);
		max-width: 34ch;
	}
	.plan__price {
		display: flex;
		align-items: baseline;
		gap: 10px;
		margin: 22px 0 0;
	}
	.plan__from {
		font-size: 0.9rem;
		color: var(--ink-70);
	}
	.plan__build {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 4.4vw, 3.75rem);
		line-height: 1;
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}
	.plan__monthly {
		margin: 8px 0 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink);
	}
	.plan .ticks {
		margin-top: 24px;
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}
	.plan__time {
		margin: 22px 0 0;
		padding-top: 0;
		font-size: 0.9rem;
		color: var(--ink-85);
	}
	/* The three things people ask straight after the price. */
	.notes {
		display: grid;
		grid-template-columns: 1fr;
		gap: 18px clamp(24px, 3vw, 48px);
		margin: clamp(36px, 4.4vw, 64px) 0 0;
		padding-top: clamp(22px, 2.4vw, 32px);
		border-top: 1px solid var(--line);
	}
	.notes dt {
		font-size: 0.94rem;
		font-weight: 600;
		color: var(--ink);
	}
	.notes dd {
		margin: 4px 0 0;
		font-size: 0.94rem;
		line-height: 1.5;
		color: var(--ink-70);
		max-width: 34ch;
	}
	.prices__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 24px;
		margin: clamp(32px, 4vw, 56px) 0 0;
		font-size: 0.94rem;
		color: var(--ink-70);
	}

	/* --- Steps: a real sequence, so it is numbered. ----------------------- */
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 3vw, 48px);
	}
	.step {
		border-top: 1px solid var(--line);
		padding-top: 16px;
	}
	.step__n {
		display: block;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1;
		color: var(--ink-35);
	}
	.step__name {
		margin: 16px 0 0;
		font-size: var(--t-h4);
		color: var(--ink);
	}
	.step__body {
		margin: 10px 0 0;
		font-size: 0.94rem;
		line-height: 1.55;
		color: var(--ink-85);
		max-width: 36ch;
		text-wrap: pretty;
	}

	/* --- Questions -------------------------------------------------------- */
	.qa {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(24px, 3vw, 48px);
		align-items: start;
	}
	.qa__list {
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
		padding: 18px 0;
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
		font-size: 1.2rem;
		font-weight: 400;
		color: var(--ink-50);
		transition: transform var(--dur) var(--ease);
	}
	.qa__item[open] summary::after {
		transform: rotate(45deg);
	}
	.qa__item p {
		margin: 0;
		padding: 0 0 22px;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--ink-85);
		max-width: 60ch;
		text-wrap: pretty;
	}

	/* --- Quote: black, edge to edge. The band paints past the page gutters
	   with a spread shadow, clipped so it never scrolls sideways. ---------- */
	.quote {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 4vw, 64px);
		align-items: start;
		background: var(--paper);
		color: var(--ink);
		box-shadow: 0 0 0 100vmax var(--paper);
		clip-path: inset(0 -100vmax);
		border-bottom: 0;
	}
	.quote__lede {
		margin: 18px 0 0;
		font-size: 1.0625rem;
		line-height: 1.55;
		color: var(--ink-85);
		max-width: 40ch;
		text-wrap: pretty;
	}

	/* --- Us: the mark at scale, and two lines. ---------------------------- */
	.us {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(24px, 4vw, 64px);
		align-items: end;
	}
	/* Drawn, not typed: it scales to its column so it stays the real mark. */
	.us__mark {
		margin: 0;
		line-height: 0;
		color: var(--ink);
		max-width: 720px;
	}
	.us__mark :global(svg) {
		width: 100%;
		height: auto !important;
	}
	.us__text p {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-85);
		max-width: 36ch;
		text-wrap: pretty;
	}
	.us__text .us__mail {
		margin-top: 16px;
		font-size: 1rem;
	}

	/* --- Wide ------------------------------------------------------------- */
	@media (min-width: 700px) {
		.notes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.hero__row {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		}
		.job {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		}
		.plans {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		/* Two lines reserved, so the three prices sit on one line. */
		.plan__for {
			min-height: 3em;
		}
		.plan .ticks {
			flex: 1;
		}
		.steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.qa,
		.quote {
			grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		}
		.us {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		}
	}
</style>
