<script lang="ts">
	// The home page, and most of the site. One scroll, in the order a business
	// owner asks the questions: what do you do, show me, how much, how does it
	// work, how do I start. Kept short on purpose: the reader is on a phone
	// between jobs. All of the words and numbers live in $lib/content/site.ts.
	//
	// The look is soft on purpose: grey and white sections in turn, rounded
	// cards, and the client sites shown on phones, because a phone is where
	// their customers will see them.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import Devices from '$lib/components/Devices.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import Symbol from '$lib/components/ui/Symbol.svelte';
	import {
		work,
		plans,
		priceNotes,
		steps,
		questions,
		houses,
		worldStyle,
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
	<!-- HERO: what we do, and three real sites on three phones -->
	<section class="band hero" data-theme="tint" aria-labelledby="hero-title">
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

				<div class="phones">
					{#each [work[0], work[1], work[2]] as job, i}
						<div class="phone phone--{i}">
							<img
								src="{base}/work/{job.image}-phone.jpg"
								srcset="{base}/work/{job.image}-phone-390.jpg 390w, {base}/work/{job.image}-phone.jpg 780w"
								sizes="(min-width: 900px) 180px, 30vw"
								width="780"
								height="1688"
								alt="The {job.name} site on a phone."
							/>
						</div>
					{/each}
				</div>
			</div>

			<dl class="facts">
				<div class="fact card">
					<dt>A new website</dt>
					<dd>from {euro(fromBuild)}</dd>
				</div>
				<div class="fact card">
					<dt>Hosted and looked after</dt>
					<dd>from {euro(fromMonthly)} a month</dd>
				</div>
				<div class="fact card">
					<dt>Your price, in writing</dt>
					<dd>within {replyWithin}</dd>
				</div>
			</dl>
		</div>
	</section>

	<!-- WORK -->
	<section class="band" id="work" aria-labelledby="work-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="work-title">The work</h2>
				<p class="head__text">Three Irish businesses. Each site built from scratch.</p>
			</div>

			<div class="jobs">
				{#each work as job}
					<article class="job card world" style={worldStyle(job.world)}>
						<Devices image={job.image} alt={job.alt} />
						<div class="job__text">
							<div>
								<p class="job__meta">
									{job.trade}, {job.place}
									<span class="tag" class:tag--quiet={job.status !== 'Live'}>{job.status}</span>
								</p>
								<h3 class="job__name">{job.name}</h3>
								{#if job.href}
									<p class="job__foot">
										<a class="link" href={job.href} rel="noopener">Visit {job.domain}</a>
									</p>
								{/if}
							</div>
							<div>
								<p class="job__summary">{job.summary}</p>
								<ul class="list">
									{#each job.built as line}
										<li>{line}</li>
									{/each}
								</ul>
							</div>
						</div>
					</article>
				{/each}
			</div>

			<div class="head head--second" id="houses">
				<h2 class="head__title" id="houses-title">Our own houses</h2>
				<p class="head__text">
					We build and run our own companies too, the same way we build yours.
				</p>
			</div>

			<div class="houses">
				{#each houses as house}
					<a class="house card world" style={worldStyle(house.world)} href={house.href} rel="noopener">
						<div class="house__stage">
							{#if house.image}
								<div class="phone">
									<img
										src="{base}/work/{house.image}-phone.jpg"
										srcset="{base}/work/{house.image}-phone-390.jpg 390w, {base}/work/{house.image}-phone.jpg 780w"
										sizes="(min-width: 900px) 130px, 22vw"
										width="780"
										height="1688"
										loading="lazy"
										decoding="async"
										alt="The {house.name} site on a phone."
									/>
								</div>
							{:else}
								<p class="house__plate" aria-hidden="true">{house.name}</p>
							{/if}
						</div>
						<div class="house__text">
							<h3 class="house__name">{house.name}</h3>
							<p class="house__line">{house.line}</p>
							<p class="house__foot">
								{#if house.status}<span class="tag tag--quiet">{house.status}</span>{/if}
								<span class="house__domain">{house.domain}</span>
							</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- PRICES -->
	<section class="band" id="prices" data-theme="tint" aria-labelledby="prices-title">
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
					<article class="plan card">
						<h3 class="plan__name">{plan.name}</h3>
						<p class="plan__for">{plan.for}</p>
						<p class="plan__price">
							<span class="plan__from">from</span>
							<span class="plan__build">{euro(plan.build)}</span>
						</p>
						<p class="plan__monthly">then {euro(plan.monthly)} a month</p>
						<ul class="list plan__list">
							{#each plan.includes as line}
								<li>{line}</li>
							{/each}
						</ul>
						<p class="plan__time">{plan.time}</p>
					</article>
				{/each}
			</div>

			<dl class="group notes">
				{#each priceNotes as note}
					<div class="group__row">
						<dt class="group__term">{note.name}</dt>
						<dd class="group__desc">{note.body}</dd>
					</div>
				{/each}
			</dl>

			<p class="prices__cta">
				<a class="btn btn--solid" href="#quote">Get a price</a>
				<span>Not sure which one? Tell us what you do and we will say.</span>
			</p>
		</div>
	</section>

	<!-- HOW IT WORKS -->
	<section class="band" id="how" aria-labelledby="how-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="how-title">How it works</h2>
				<p class="head__text">
					People design and build your site, with AI helping along the way. We are proud
					of that.
				</p>
			</div>

			<ol class="steps">
				{#each steps as step, i}
					<li class="step card">
						<span class="step__n" aria-hidden="true">{i + 1}</span>
						<h3 class="step__name">{step.name}</h3>
						<p class="step__body">{step.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- QUESTIONS -->
	<section class="band" id="questions" data-theme="tint" aria-labelledby="questions-title">
		<div class="wrap">
			<div class="head">
				<h2 class="head__title" id="questions-title">Questions</h2>
			</div>

			<div class="group qa">
				{#each questions as item}
					<details class="qa__item">
						<summary>{item.q}</summary>
						<p>{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- QUOTE: the one dark thing on the page, and it is a card, not a wall -->
	<section class="band" id="quote" aria-labelledby="quote-title">
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
					<EnquiryForm source="/" />
				</div>
			</div>
		</div>
	</section>

	<!-- US -->
	<section class="band us-band" id="us" data-theme="tint" aria-labelledby="us-title">
		<div class="wrap">
			<div class="us">
				<h2 class="us__lockup" id="us-title">
					<Symbol size={0} />
					<Wordmark height={0} label="VNTA" />
				</h2>
				<div class="us__text">
					<p>
						A small studio in Dublin. We build websites for other people's businesses,
						and for <a class="link" href="#houses">our own</a>.
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
		padding-top: clamp(40px, 6vw, 88px);
		padding-bottom: clamp(40px, 5vw, 72px);
	}
	.hero__top {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(36px, 5vw, 64px);
		align-items: center;
	}
	.hero__title {
		margin: 0;
		font-size: var(--t-h1);
		line-height: 1.05;
		max-width: 15ch;
		text-wrap: balance;
		color: var(--ink);
	}
	.hero__lede {
		margin: clamp(16px, 2vw, 24px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-60);
		max-width: 32ch;
		text-wrap: pretty;
	}
	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(22px, 2.6vw, 32px);
	}

	/* Three phones, three real sites. The frame is drawn in CSS: a graphite
	   body with rounded corners, the screenshot rounded inside it. */
	.phones {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(8px, 2vw, 18px);
		align-items: center;
		max-width: 560px;
	}
	.phone {
		background: var(--device, var(--black));
		padding: 3%;
		border-radius: 15% / 6.9%;
		line-height: 0;
	}
	.phone img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 12.5% / 5.8%;
	}
	/* The middle one stands a little proud of the other two. */
	.phone--0,
	.phone--2 {
		transform: translateY(6%);
	}

	.facts {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		margin: clamp(36px, 5vw, 64px) 0 0;
	}
	.fact {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 14px 20px;
		border-radius: 16px;
	}
	.fact dt {
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.fact dd {
		margin: 0;
		font-size: var(--t-body);
		font-weight: 600;
		color: var(--ink);
	}

	/* --- Work ------------------------------------------------------------- */
	.jobs {
		display: grid;
		gap: clamp(16px, 2vw, 24px);
	}
	/* Each job: the site on three screens, then the words under it. */
	.job {
		display: grid;
		gap: clamp(24px, 3.4vw, 44px);
		padding: clamp(20px, 4vw, 48px) clamp(16px, 4vw, 48px) clamp(22px, 3.4vw, 40px);
	}
	.job__text {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px clamp(24px, 4vw, 56px);
		align-items: start;
	}
	.job__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 10px;
		margin: 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.tag {
		display: inline-block;
		padding: 3px 10px;
		border-radius: var(--r-pill);
		background: var(--ink);
		color: var(--paper);
		font-size: 0.72rem;
		font-weight: 600;
		line-height: 1.4;
	}
	.tag--quiet {
		background: var(--ink-20);
		color: var(--ink-80);
	}
	.job__name {
		margin: 8px 0 0;
		font-size: var(--t-h3);
		line-height: 1.1;
		color: var(--ink);
	}
	.job__summary {
		margin: 0;
		font-size: var(--t-body);
		line-height: 1.45;
		color: var(--ink-80);
		max-width: 40ch;
		text-wrap: pretty;
	}
	.job .list {
		margin-top: 16px;
	}
	.job__foot {
		margin: 12px 0 0;
		font-size: var(--t-body);
	}

	/* A plain list of what you get, with a small round mark. */
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
		left: 2px;
		top: 0.55em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--w-accent, var(--ink-40));
	}

	/* --- Our own houses: four small worlds in a row. ---------------------- */
	.head--second {
		margin-top: clamp(56px, 7vw, 96px);
		scroll-margin-top: 72px;
	}
	.houses {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(10px, 1.6vw, 20px);
	}
	.house {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	/* The stage: a phone standing on the card's floor, or, until there is a
	   real screenshot, the house's name on its own. */
	.house__stage {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		aspect-ratio: 1 / 1.05;
		padding: 12% 12% 0;
		overflow: hidden;
	}
	.house__stage .phone {
		width: 62%;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		padding-bottom: 0;
		transform: translateY(18%);
	}
	.house__stage .phone img {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	.house__plate {
		align-self: center;
		margin: 0 0 6%;
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.4vw, 2.4rem);
		line-height: 1.05;
		text-align: center;
		color: var(--ink);
		opacity: 0.9;
	}
	.house__text {
		padding: clamp(14px, 1.8vw, 22px);
		border-top: 1px solid var(--line-soft);
	}
	.house__name {
		margin: 0;
		font-size: var(--t-h4);
		line-height: 1.2;
		color: var(--ink);
	}
	.house__line {
		margin: 6px 0 0;
		font-size: var(--t-small);
		line-height: 1.4;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.house__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 10px;
		margin: 12px 0 0;
		font-size: 0.82rem;
		color: var(--ink-60);
	}
	.house:hover .house__domain {
		text-decoration: underline;
		text-decoration-color: var(--w-accent);
		text-underline-offset: 4px;
	}

	/* --- Prices ----------------------------------------------------------- */
	.plans {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(12px, 1.6vw, 20px);
	}
	.plan {
		display: flex;
		flex-direction: column;
		padding: clamp(22px, 2.6vw, 32px);
	}
	.plan__name {
		margin: 0;
		font-size: var(--t-h3);
		line-height: 1.15;
		color: var(--ink);
	}
	.plan__for {
		margin: 6px 0 0;
		font-size: var(--t-small);
		line-height: 1.4;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.plan__price {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin: 22px 0 0;
	}
	.plan__from {
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.plan__build {
		font-family: var(--font-display);
		font-size: var(--t-h2);
		line-height: 1;
		color: var(--ink);
	}
	.plan__monthly {
		margin: 8px 0 0;
		font-size: var(--t-body);
		font-weight: 600;
		color: var(--ink);
	}
	.plan__list {
		margin-top: 22px;
		padding-top: 20px;
		border-top: 1px solid var(--line-soft);
	}
	.plan__time {
		margin: 20px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	.notes {
		margin-top: clamp(12px, 1.6vw, 20px);
	}
	.prices__cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		margin: clamp(24px, 3vw, 36px) 0 0;
		font-size: var(--t-body);
		color: var(--ink-60);
	}

	/* --- Steps: a real sequence, so it is numbered. ----------------------- */
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(12px, 1.6vw, 20px);
	}
	.step {
		padding: clamp(22px, 2.6vw, 32px);
	}
	.step__n {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--paper);
		font-size: 0.95rem;
		font-weight: 600;
	}
	.step__name {
		margin: 18px 0 0;
		font-size: var(--t-h3);
		line-height: 1.15;
		color: var(--ink);
	}
	.step__body {
		margin: 8px 0 0;
		font-size: var(--t-body);
		line-height: 1.45;
		color: var(--ink-60);
		text-wrap: pretty;
	}

	/* --- Questions: one rounded list --------------------------------------- */
	.qa__item {
		border-top: 1px solid var(--line-soft);
	}
	.qa__item:first-child {
		border-top: 0;
	}
	.qa__item summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		padding: 18px clamp(18px, 2.4vw, 28px);
		font-family: var(--font-display);
		font-size: var(--t-h4);
		font-weight: 400;
		line-height: 1.3;
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
		font-size: 1.4rem;
		font-weight: 400;
		line-height: 1;
		color: var(--ink-40);
		transition: transform var(--dur) var(--ease);
	}
	.qa__item[open] summary::after {
		transform: rotate(45deg);
	}
	.qa__item p {
		margin: 0;
		padding: 0 clamp(18px, 2.4vw, 28px) 20px;
		font-size: var(--t-body);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 62ch;
		text-wrap: pretty;
	}

	/* --- Quote: a graphite card ------------------------------------------- */
	.quote {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(24px, 4vw, 56px);
		align-items: start;
		background: var(--paper);
		color: var(--ink);
		padding: clamp(24px, 4.4vw, 56px);
		border-radius: clamp(24px, 3vw, 32px);
	}
	.quote .head__title {
		font-size: var(--t-h2);
	}
	.quote .head__text {
		margin-top: 12px;
	}

	/* --- Us --------------------------------------------------------------- */
	.us-band > .wrap {
		padding-top: clamp(40px, 6vw, 72px);
		padding-bottom: clamp(40px, 6vw, 72px);
	}
	.us {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 4vw, 56px);
		align-items: center;
	}
	/* The lockup keeps its own arrangement, symbol centred over wordmark. */
	.us__lockup {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		width: clamp(140px, 16vw, 190px);
		margin: 0;
		color: var(--ink);
	}
	.us__lockup :global(.symbol) {
		width: 36%;
		height: auto;
	}
	.us__lockup :global(.wordmark) {
		width: 100%;
		height: auto !important;
	}
	.us__text p {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.45;
		color: var(--ink-80);
		max-width: 38ch;
		text-wrap: pretty;
	}
	.us__text .us__mail {
		margin-top: 14px;
		font-size: var(--t-body);
	}

	/* --- Wide ------------------------------------------------------------- */
	@media (min-width: 700px) {
		.facts {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: clamp(12px, 1.6vw, 20px);
		}
		.fact {
			gap: 6px;
			padding: 22px 24px;
			border-radius: var(--r-card);
		}
		.fact dd {
			font-family: var(--font-display);
			font-size: var(--t-h4);
			font-weight: 400;
		}
		.steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.hero__top {
			grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		}
		.phones {
			justify-self: end;
		}
		.job__text {
			grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		}
		.plans {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.houses {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		.plan__for {
			min-height: 2.8em;
		}
		.plan__list {
			flex: 1;
		}
		.quote {
			grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
		}
		.us {
			grid-template-columns: auto minmax(0, 1fr);
		}
	}
</style>
