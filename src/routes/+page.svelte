<script lang="ts">
	// VNTA Studio, the front page. Rebuilt in the brand book's own terms
	// (Felixto Brandworks, v1.0): black and white, Optima, hairlines, nothing
	// decorative, nothing centred. Restraint, silence, precision, timelessness.
	//
	// The studio's clients keep their own loud colours in their own pictures.
	// The page around them says almost nothing, so the work does the talking.
	// VNTA Personal is built and parked at /personal until it is ready.
	// All words and numbers live in $lib/content/studio.ts.
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import Symbol from '$lib/components/ui/Symbol.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { organisation, website } from '$lib/content/structured';
	import {
		pitch,
		offer,
		sitDown,
		work,
		houses,
		plans,
		priceNotes,
		steps,
		questions,
		landings,
		shot,
		studioEmail,
		replyWithin,
		euro
	} from '$lib/content/studio';
	import { faq, portfolio } from '$lib/content/studioStructured';

	const fromBuild = Math.min(...plans.map((p) => p.build));
	const description = `VNTA Studio is a brand studio in Dublin. We look at your business, tell you plainly what to change, then design the brand and build the website. A sit-down is ${euro(sitDown.price)}.`;

	const more: Record<string, string> = {
		Website: 'websites-for-garages',
		'Website with stock': 'websites-for-car-dealers',
		'Online shop': 'online-shops'
	};
	const moreFor = (plan: string) => landings.find((l) => l.slug === more[plan]);
	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<Seo
	title="VNTA Studio | Brand design and websites, Dublin"
	shareTitle="VNTA Studio | {pitch.headline}"
	image="/share/studio.png"
	imageAlt="VNTA Studio. We look at your business and see what to change. A brand studio in Dublin."
	{description}
	ld={[organisation(), website(), faq(questions), portfolio()]}
/>

<main class="vx" id="top">
	<!-- OPENING -->
	<section class="open" aria-labelledby="open-title">
		<div class="open__sun" aria-hidden="true"><Symbol size={0} /></div>
		<div class="vx-wrap">
			<p class="meta open__meta"><span>VNTA Studio</span><span>Dublin</span></p>
			<h1 id="open-title">{pitch.headline}</h1>
			<p class="open__lede">{pitch.lede}</p>
			<p class="open__go">
				<a class="line" href="#quote">Talk to us <span aria-hidden="true">→</span></a>
				<a class="line line--quiet" href="#work">See the work</a>
			</p>
		</div>
		<div class="vx-wrap">
			<dl class="facts">
				<div><dt>It starts with a sit-down</dt><dd>{euro(sitDown.price)}</dd></div>
				<div><dt>We reply</dt><dd>within {replyWithin}</dd></div>
				<div><dt>A new website</dt><dd>from {euro(fromBuild)}</dd></div>
			</dl>
		</div>
	</section>

	<!-- WORK -->
	<section class="sec" id="work" aria-labelledby="work-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>01</span><span>Work</span></p>
				<h2 id="work-title">Three Irish businesses.</h2>
			</header>

			{#each work as job}
				<article class="job">
					<div class="job__say">
						<h3>{job.name}</h3>
						<p class="meta meta--stack">
							<span>{job.did}</span>
							<span>{job.trade}, {job.place}</span>
							<span>{job.status === 'Live' ? 'Live' : 'In build'}</span>
						</p>
						<p class="job__sum">{job.summary}</p>
						{#if job.href}
							<a class="line" href={job.href} rel="noopener">{job.domain} <span aria-hidden="true">↗</span></a>
						{/if}
					</div>
					<figure class="job__shot">
						<img
							src={shot(job.image)}
							srcset="{shot(job.image, '-720')} 580w, {shot(job.image)} 1090w"
							sizes="(min-width: 900px) 62vw, 100vw"
							alt={job.alt}
							width="1090"
							height="680"
							loading="lazy"
							decoding="async"
						/>
					</figure>
				</article>
			{/each}
		</div>
	</section>

	<!-- WHAT WE DO -->
	<section class="sec" id="what" aria-labelledby="what-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>02</span><span>What we do</span></p>
				<h2 id="what-title">Not only websites. We start with the business.</h2>
			</header>
			<div class="rows">
				{#each offer as o}
					<div class="row">
						<h3>{o.name}</h3>
						<p>{o.body}</p>
						<p class="meta">{o.price}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- HOW -->
	<section class="sec" id="how" aria-labelledby="how-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>03</span><span>How it works</span></p>
				<h2 id="how-title">Four steps, in this order.</h2>
			</header>
			<ol class="rows steps">
				{#each steps as s, i}
					<li class="row">
						<span class="num">{pad(i + 1)}</span>
						<h3>{s.name}</h3>
						<p>{s.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- PRICES -->
	<section class="sec" id="prices" aria-labelledby="prices-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>04</span><span>Prices</span></p>
				<h2 id="prices-title">Start with the sit-down.</h2>
				<p class="sec__note">Brand work is priced after it, once we know what you need. Websites start at the prices here.</p>
			</header>

			<div class="table" role="table" aria-label="Prices">
				<div class="tr tr--head" role="row">
					<span role="columnheader">What</span><span role="columnheader">For</span><span role="columnheader">Price</span><span role="columnheader">Then</span><span role="columnheader">Ready</span>
				</div>
				<div class="tr" role="row">
					<b role="cell">The sit-down</b>
					<span role="cell">Any business. {sitDown.credit}</span>
					<span role="cell" class="price">{euro(sitDown.price)}</span>
					<span role="cell">once</span>
					<span role="cell">{sitDown.length}</span>
				</div>
				{#each plans as p}
					<div class="tr" role="row">
						<b role="cell">
							{p.name}
							{#if moreFor(p.name)}<a class="line line--small" href="/studio/{moreFor(p.name)?.slug}">{moreFor(p.name)?.label}</a>{/if}
						</b>
						<span role="cell">{p.for}</span>
						<span role="cell" class="price"><small>from</small> {euro(p.build)}</span>
						<span role="cell">{euro(p.monthly)} a month</span>
						<span role="cell">{p.time.replace('Live in ', '')}</span>
					</div>
				{/each}
			</div>

			<dl class="notes">
				{#each priceNotes as n}
					<div><dt>{n.name}</dt><dd>{n.body}</dd></div>
				{/each}
			</dl>
		</div>
	</section>

	<!-- OUR OWN HOUSES -->
	<section class="sec" id="houses" aria-labelledby="houses-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>05</span><span>Our own houses</span></p>
				<h2 id="houses-title">We build and run our own companies too.</h2>
			</header>
			<div class="houses">
				{#each houses as h}
					<div class="house">
						<h3>{h.name}</h3>
						<p>{h.line}</p>
						<p class="meta meta--stack">
							{#if h.kind}<span>{h.kind}</span>{/if}
							{#if h.status}<span>{h.status}</span>{/if}
						</p>
						<a class="line" href={h.href} rel="noopener">{h.domain} <span aria-hidden="true">↗</span></a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- QUESTIONS -->
	<section class="sec" id="questions" aria-labelledby="q-title">
		<div class="vx-wrap">
			<header class="sec__head">
				<p class="meta"><span>06</span><span>Questions</span></p>
				<h2 id="q-title">Asked before we start.</h2>
			</header>
			<div class="qa">
				{#each questions as item}
					<details>
						<summary>{item.q}</summary>
						<p>{item.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<!-- CONTACT -->
	<section class="close" id="quote" data-theme="ink" aria-labelledby="quote-title">
		<div class="vx-wrap">
			<p class="meta"><span>07</span><span>Contact</span></p>
			<div class="close__grid">
				<div>
					<h2 id="quote-title">Tell us about your business.</h2>
					<p class="close__text">We reply within {replyWithin}. It costs nothing to ask.</p>
					<p class="close__text"><a class="line" href="mailto:{studioEmail}">{studioEmail}</a></p>
				</div>
				<div class="close__form">
					<EnquiryForm source="/studio" studio />
				</div>
			</div>
		</div>
	</section>
</main>

<style>
	/* The page's own palette: the brand book's black and white, and its greys. */
	.vx {
		--k: #000;
		--w: #fff;
		--g80: #333;
		--g60: #666;
		--g40: #999;
		--g20: #ccc;
		--hair: rgba(0, 0, 0, 0.18);
		--hair-w: rgba(255, 255, 255, 0.22);
		--max: 1320px;
		--pad: clamp(20px, 4vw, 56px);
		--serif: var(--font-display);
		--sans: var(--font-ui);
		background: var(--w);
		color: var(--k);
		font-family: var(--sans);
	}
	.vx-wrap {
		width: 100%;
		max-width: var(--max);
		margin: 0 auto;
		padding-inline: var(--pad);
		box-sizing: border-box;
	}

	/* Small labels, in the manner of the guideline's page furniture: "Topic — 1.0". */
	.meta {
		margin: 0;
		display: flex;
		gap: 1.4em;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--g60);
	}
	.meta--stack {
		flex-direction: column;
		gap: 0.35em;
	}

	/* The one kind of link: text with a hairline under it. */
	.line {
		display: inline-block;
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid currentColor;
		padding-bottom: 2px;
		font-size: 0.98rem;
		transition: opacity 0.2s;
	}
	.line:hover {
		opacity: 0.6;
	}
	.line--quiet {
		border-bottom-color: transparent;
		opacity: 0.7;
	}
	.line--small {
		display: block;
		width: max-content;
		margin-top: 8px;
		font-size: 0.8rem;
		font-weight: 400;
		color: var(--g60);
	}
	.line:focus-visible,
	summary:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}

	/* --- Opening: black, as the brand book opens ----------------------------- */
	.open {
		position: relative;
		overflow: hidden;
		background: var(--k);
		color: var(--w);
		min-height: min(92vh, 960px);
		display: grid;
		grid-template-rows: 1fr auto;
		isolation: isolate;
	}
	.open .meta {
		color: rgba(255, 255, 255, 0.6);
	}
	.open__sun {
		position: absolute;
		right: clamp(-340px, -14vw, -120px);
		top: 50%;
		translate: 0 -50%;
		width: clamp(520px, 78vw, 1080px);
		aspect-ratio: 1;
		color: rgba(255, 255, 255, 0.16);
		z-index: -1;
	}
	.open__sun :global(svg) {
		width: 100%;
		height: 100%;
	}
	.open > .vx-wrap:nth-of-type(2) {
		align-self: center;
		padding-block: clamp(96px, 16vh, 168px) clamp(48px, 8vh, 96px);
	}
	.open__meta {
		margin-bottom: clamp(28px, 6vh, 64px);
	}
	h1 {
		margin: 0;
		max-width: 14ch;
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(2.6rem, 6.6vw, 5.8rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}
	.open__lede {
		margin: clamp(24px, 4vh, 44px) 0 0;
		max-width: 34rem;
		font-size: 1.08rem;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.72);
	}
	.open__go {
		margin: clamp(28px, 5vh, 52px) 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 12px 32px;
	}
	.facts {
		margin: 0;
		border-top: 1px solid var(--hair-w);
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
	.facts div {
		padding: 22px 0 28px;
	}
	.facts div + div {
		padding-left: clamp(16px, 3vw, 40px);
	}
	.facts dt {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}
	.facts dd {
		margin: 8px 0 0;
		font-family: var(--serif);
		font-size: clamp(1.15rem, 2.2vw, 1.7rem);
	}

	/* --- Sections ------------------------------------------------------------- */
	.sec {
		border-top: 1px solid var(--hair);
	}
	.sec:first-of-type {
		border-top: 0;
	}
	.sec > .vx-wrap {
		padding-block: clamp(64px, 11vw, 140px);
	}
	.sec__head {
		display: grid;
		gap: 22px;
		margin-bottom: clamp(36px, 6vw, 72px);
		max-width: 52rem;
	}
	h2 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(1.9rem, 4.4vw, 3.4rem);
		line-height: 1.08;
		letter-spacing: -0.015em;
		text-wrap: balance;
	}
	h3 {
		margin: 0;
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(1.35rem, 2.2vw, 1.9rem);
		line-height: 1.15;
	}
	.sec__note {
		margin: 0;
		color: var(--g60);
		line-height: 1.65;
		max-width: 38rem;
	}

	/* Work: the picture leads, the words stand beside it. */
	.job {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		gap: clamp(24px, 5vw, 80px);
		padding-block: clamp(28px, 4vw, 56px);
		border-top: 1px solid var(--hair);
	}
	.job__say {
		display: grid;
		gap: 20px;
		align-content: start;
	}
	.job__sum {
		margin: 0;
		color: var(--g80);
		line-height: 1.65;
		max-width: 26rem;
	}
	.job__shot {
		margin: 0;
		border: 1px solid var(--hair);
		background: var(--k);
	}
	.job__shot img {
		display: block;
		width: 100%;
		height: auto;
		/* Quiet until you look at it. A touch screen has no hover, so it sees colour. */
	}
	@media (hover: hover) {
		.job__shot img {
			filter: grayscale(1);
			transition: filter 0.5s ease;
		}
		.job:hover .job__shot img {
			filter: none;
		}
	}

	/* Rows: a hairline, a heading, a few words. */
	.rows {
		margin: 0;
		padding: 0;
		list-style: none;
		border-bottom: 1px solid var(--hair);
	}
	.row {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 6fr) minmax(0, 3fr);
		gap: clamp(16px, 3vw, 48px);
		padding-block: 28px;
		border-top: 1px solid var(--hair);
		align-items: baseline;
	}
	.row p {
		margin: 0;
		color: var(--g80);
		line-height: 1.65;
	}
	.steps .row {
		grid-template-columns: 4rem minmax(0, 4fr) minmax(0, 8fr);
	}
	.num {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--g60);
	}

	/* Prices: a table, not a shop window. */
	.table {
		border-bottom: 1px solid var(--hair);
	}
	.tr {
		display: grid;
		grid-template-columns: minmax(0, 3.2fr) minmax(0, 4fr) minmax(0, 2fr) minmax(0, 2.2fr) minmax(0, 1.6fr);
		gap: clamp(12px, 2vw, 32px);
		padding-block: 24px;
		border-top: 1px solid var(--hair);
		align-items: baseline;
		line-height: 1.5;
		color: var(--g80);
	}
	.tr b {
		font-family: var(--serif);
		font-weight: 400;
		font-size: 1.3rem;
		color: var(--k);
	}
	.tr--head {
		padding-block: 14px;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--g60);
	}
	.price {
		font-family: var(--serif);
		font-size: 1.5rem;
		color: var(--k);
	}
	.price small {
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--g60);
		margin-right: 4px;
	}
	.notes {
		margin: 36px 0 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(16px, 3vw, 48px);
	}
	.notes dt {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--g60);
	}
	.notes dd {
		margin: 8px 0 0;
		color: var(--g80);
		line-height: 1.6;
	}

	/* Our houses */
	.houses {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid var(--hair);
	}
	.house {
		display: grid;
		gap: 16px;
		align-content: start;
		padding: 32px clamp(16px, 3vw, 40px) 36px 0;
	}
	.house + .house {
		padding-left: clamp(16px, 3vw, 40px);
		border-left: 1px solid var(--hair);
	}
	.house p:not(.meta) {
		margin: 0;
		color: var(--g80);
		line-height: 1.6;
	}

	/* Questions */
	.qa {
		border-bottom: 1px solid var(--hair);
		max-width: 54rem;
	}
	details {
		border-top: 1px solid var(--hair);
	}
	summary {
		list-style: none;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		gap: 24px;
		padding-block: 24px;
		font-family: var(--serif);
		font-size: 1.3rem;
		line-height: 1.3;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '+';
		font-family: var(--sans);
		color: var(--g60);
	}
	details[open] summary::after {
		content: '–';
	}
	details p {
		margin: 0 0 28px;
		max-width: 40rem;
		color: var(--g80);
		line-height: 1.7;
	}

	/* Contact: black, and it runs into the foot. */
	.close {
		background: var(--k);
		color: var(--w);
	}
	.close > .vx-wrap {
		padding-block: clamp(64px, 11vw, 140px);
	}
	.close .meta {
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: clamp(28px, 5vw, 56px);
	}
	.close__grid {
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		gap: clamp(32px, 6vw, 96px);
	}
	.close__text {
		margin: 22px 0 0;
		color: rgba(255, 255, 255, 0.72);
		line-height: 1.65;
	}

	@media (max-width: 899px) {
		.job,
		.close__grid {
			grid-template-columns: 1fr;
		}
		.row,
		.steps .row {
			grid-template-columns: 1fr;
			gap: 8px;
			padding-block: 22px;
		}
		.steps .row {
			grid-template-columns: 1fr;
		}
		.tr {
			grid-template-columns: 1fr 1fr;
			row-gap: 6px;
		}
		.tr--head {
			display: none;
		}
		.tr b,
		.tr > span:nth-child(2) {
			grid-column: 1 / -1;
		}
		.notes,
		.houses {
			grid-template-columns: 1fr;
		}
		.house,
		.house + .house {
			padding: 24px 0;
			border-left: 0;
			border-top: 1px solid var(--hair);
		}
		.house:first-child {
			border-top: 0;
		}
		.facts {
			grid-template-columns: 1fr;
		}
		.facts div + div {
			padding-left: 0;
			border-top: 1px solid var(--hair-w);
		}
		.facts div {
			padding: 16px 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.job__shot img {
			transition: none;
		}
	}
</style>
