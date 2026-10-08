<script lang="ts">
	// The home page, and most of the site. One scroll, in the order a business
	// owner asks the questions: what do you do, show me, how much, how does it
	// work, how do I start. Kept short on purpose: the reader is on a phone
	// between jobs. All of the words and numbers live in $lib/content/site.ts.
	//
	// The look: one very large line, then a card that shows a real site and
	// turns over to show the next. Each job after that sits in the client's
	// own colours. The page opens light and closes dark.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import Flip from '$lib/components/Flip.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import {
		work,
		plans,
		priceNotes,
		steps,
		questions,
		houses,
		landings,
		worldStyle,
		studioEmail,
		replyWithin,
		euro
	} from '$lib/content/site';
	import { organisation, website, faq, portfolio } from '$lib/content/structured';

	// The first house leads; the others follow in a row beneath it.
	const [leadHouse, ...otherHouses] = houses;

	const fromBuild = Math.min(...plans.map((p) => p.build));
	const fromMonthly = Math.min(...plans.map((p) => p.monthly));

	const description = `VNTA builds websites for Irish garages, dealers, shops and trades, and looks after them every month. From ${euro(fromBuild)}, then ${euro(fromMonthly)} a month.`;

	// Each plan links to the page that says more about it.
	const more: Record<string, string> = {
		Website: 'websites-for-garages',
		'Website with stock': 'websites-for-car-dealers',
		'Online shop': 'online-shops'
	};
	const moreFor = (plan: string) => landings.find((l) => l.slug === more[plan]);

	// The card at the top turns through every client job, then our own lead
	// house: one real site at a time.
	const reel = [
		...work.map((j) => ({
			world: j.world,
			image: j.image,
			name: j.name,
			meta: `${j.trade}, ${j.place}`,
			status: j.status,
			live: j.status === 'Live'
		})),
		{
			world: leadHouse.world,
			image: leadHouse.image,
			name: leadHouse.name,
			meta: `Our own ${(leadHouse.kind ?? 'company').toLowerCase()}`,
			status: leadHouse.status,
			live: false
		}
	];
</script>

<Seo
	title="Websites for Irish businesses, from {euro(fromBuild)} | VNTA"
	shareTitle="VNTA | Websites that bring in the work"
	{description}
	ld={[organisation(description), website(), faq(questions), portfolio()]}
/>

<main>
	<!-- HERO: what we do, in one large line, and a real site that turns over -->
	<section class="band hero" data-theme="tint" aria-labelledby="hero-title">
		<div class="wrap">
			<h1 class="hero__title" id="hero-title">Websites that bring in the work.</h1>

			<div class="hero__row">
				<p class="hero__lede">
					We build websites for Irish garages, dealers, shops and trades, and look
					after them every month.
				</p>
				<div class="hero__cta">
					<a class="btn btn--solid" href="#quote">Get a price</a>
					<a class="btn btn--ghost" href="#work">See the work</a>
				</div>
			</div>

			<Flip slides={reel} />

			<dl class="facts">
				<div class="fact">
					<dt>A new website</dt>
					<dd>from {euro(fromBuild)}</dd>
				</div>
				<div class="fact">
					<dt>Hosted and looked after</dt>
					<dd>from {euro(fromMonthly)} a month</dd>
				</div>
				<div class="fact">
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

			<div class="jobs jobs--stack">
				{#each work as job, i}
					<div class="jobs__slot" style="--i:{i}">
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
					</div>
				{/each}
			</div>

			<div class="head head--second" id="houses">
				<h2 class="head__title" id="houses-title">Our own houses</h2>
				<p class="head__text">
					We build and run our own companies too, the same way we build yours.
				</p>
			</div>

			<ProjectCard
				world={leadHouse.world}
				image={leadHouse.image}
				alt={leadHouse.alt}
				meta={leadHouse.kind ?? ''}
				status={leadHouse.status}
				name={leadHouse.name}
				href={leadHouse.href}
				domain={leadHouse.domain}
				summary={leadHouse.line}
				built={leadHouse.built}
			/>

			<div class="houses">
				{#each otherHouses as house}
					<a class="house world" style={worldStyle(house.world)} href={house.href} rel="noopener">
						<div class="house__shot">
							<img
								src="{base}/work/{house.image}.jpg"
								srcset="{base}/work/{house.image}-720.jpg 720w, {base}/work/{house.image}.jpg 1440w"
								sizes="(min-width: 700px) 46vw, 92vw"
								width="1440"
								height="900"
								loading="lazy"
								decoding="async"
								alt={house.alt}
							/>
						</div>
						<div class="house__text">
							<div>
								<h3 class="house__name">{house.name}</h3>
								<p class="house__line">{house.line}</p>
							</div>
							<p class="house__foot">
								<span class="tag tag--quiet">{house.status}</span>
								<span class="house__domain">{house.domain}</span>
							</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- HOW IT WORKS: three steps, set large, on the dark -->
	<section class="band" id="how" data-theme="ink" aria-labelledby="how-title">
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
					<li class="step">
						<span class="step__n" aria-hidden="true">{i + 1}</span>
						<h3 class="step__name">{step.name}</h3>
						<p class="step__body">{step.body}</p>
					</li>
				{/each}
			</ol>
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
						{#if moreFor(plan.name)}
							<p class="plan__more">
								<a class="link" href="{base}/{moreFor(plan.name)?.slug}">{moreFor(plan.name)?.label}</a>
							</p>
						{/if}
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

	<!-- QUESTIONS -->
	<section class="band" id="questions" aria-labelledby="questions-title">
		<div class="wrap asks">
			<div class="asks__head">
				<h2 class="head__title" id="questions-title">Questions</h2>
				<p class="head__text">
					Something else? Email
					<a class="link" href="mailto:{studioEmail}">{studioEmail}</a>
				</p>
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

	<!-- QUOTE: the dark close. It runs straight into the foot. -->
	<section class="band band--close" id="quote" data-theme="ink" aria-labelledby="quote-title">
		<div class="wrap">
			<div class="quote">
				<div class="quote__say">
					<h2 class="quote__title" id="quote-title">Get a price</h2>
					<p class="quote__text">
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
</main>

<style>
	/* --- Hero ------------------------------------------------------------- */
	.hero {
		/* The turning card swings a little past its own edges. */
		overflow-x: clip;
	}
	.hero > .wrap {
		padding-top: clamp(28px, 5vw, 72px);
		padding-bottom: clamp(40px, 5vw, 72px);
	}
	/* The one very large thing on the page. */
	.hero__title {
		margin: 0;
		font-size: var(--t-giant);
		line-height: 0.94;
		letter-spacing: -0.022em;
		color: var(--ink);
		text-wrap: balance;
	}
	.hero__row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px clamp(24px, 4vw, 56px);
		margin-top: clamp(22px, 3vw, 44px);
	}
	.hero__lede {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-80);
		max-width: 34ch;
		text-wrap: pretty;
	}
	.hero__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	/* Three plain facts, ruled off, read across. */
	.facts {
		display: grid;
		grid-template-columns: 1fr;
		margin: clamp(28px, 4vw, 56px) 0 0;
	}
	.fact {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 14px 0;
		border-top: 1px solid var(--line);
	}
	.fact dt {
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.fact dd {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.15;
		color: var(--ink);
	}

	/* --- Work: on a tall wide screen each job holds its place while the next
	   one slides up over it, like cards dealt onto a table. ---------------- */
	.jobs__slot {
		min-width: 0;
	}
	@media (min-width: 1000px) and (min-height: 760px) {
		.jobs--stack {
			gap: clamp(24px, 3vw, 40px);
		}
		.jobs__slot {
			position: sticky;
			top: calc(80px + var(--i) * 18px);
		}
	}

	/* --- Our own houses: one lead, the same as a job, then two beside each
	   other. Every one shows its real, live site. --------------------------- */
	.head--second {
		margin-top: clamp(72px, 9vw, 144px);
		scroll-margin-top: 88px;
	}
	.houses {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(16px, 2vw, 24px);
		margin-top: clamp(16px, 2vw, 24px);
	}
	.house {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: clamp(22px, 2.6vw, 36px);
		border: 1px solid var(--w-line);
	}
	.house__shot {
		line-height: 0;
		border-bottom: 1px solid var(--w-line);
	}
	.house__shot img {
		display: block;
		width: 100%;
		height: auto;
	}
	.house__text {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 20px;
		padding: clamp(18px, 2.4vw, 32px);
	}
	.house__name {
		margin: 0;
		font-size: var(--t-h3);
		line-height: 1.1;
		color: var(--ink);
	}
	.house__line {
		margin: 8px 0 0;
		font-size: var(--t-body);
		line-height: 1.4;
		color: var(--ink-60);
		text-wrap: pretty;
	}
	.house__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin: 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.house:hover .house__domain {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--w-accent);
		text-underline-offset: 4px;
	}

	/* --- Steps: a real sequence, so it is numbered. Each one is a ruled row
	   with its name set large. ---------------------------------------------- */
	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		border-bottom: 1px solid var(--line);
	}
	.step {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 6px clamp(14px, 3vw, 48px);
		align-items: baseline;
		padding: clamp(20px, 3vw, 40px) 0;
		border-top: 1px solid var(--line);
	}
	.step__n,
	.step__name {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 4.2vw, 3.5rem);
		line-height: 1.02;
		letter-spacing: var(--track-display);
	}
	.step__n {
		min-width: 1.1em;
		color: var(--ink-40);
	}
	.step__name {
		margin: 0;
		color: var(--ink);
		text-wrap: balance;
	}
	.step__body {
		grid-column: 2;
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.4;
		color: var(--ink-60);
		max-width: 30ch;
		text-wrap: pretty;
	}

	/* --- Questions: the title holds on the left while the list runs. ------ */
	.asks {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 4vw, 56px);
	}
	.asks__head {
		display: grid;
		gap: 14px;
		align-content: start;
	}

	/* --- Wide ------------------------------------------------------------- */
	@media (min-width: 700px) {
		.facts {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 clamp(20px, 3vw, 48px);
		}
		.fact {
			gap: 6px;
			padding: 18px 0 0;
		}
		.houses {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.hero__row {
			grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
			align-items: end;
		}
		.hero__cta {
			justify-content: flex-end;
		}
		.step {
			grid-template-columns: auto minmax(0, 7fr) minmax(0, 4fr);
		}
		.step__body {
			grid-column: auto;
		}
		.asks {
			grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
		}
		.asks__head {
			position: sticky;
			top: 96px;
		}
	}
</style>
