<script lang="ts">
	// Pricing for VNTA Robotics. Three offers, all of them things VNTA can
	// deliver now. Runtime is one line of text, not an offer. The product's
	// status is said once, in the status section. There is no checkout: every
	// button leads to the request form at the foot of the page.
	//
	// All the words and numbers are in $lib/content/pricing.ts.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import PilotForm from '$lib/components/PilotForm.svelte';
	import { robotics, support } from '$lib/content/site';
	import { pricing, tiers, units, workflow, faq, form, interests } from '$lib/content/pricing';
	import { breadcrumb, faqPage } from '$lib/content/structured';

	// Which offer the form is about. A card's button sets it on the way down.
	let interest = $state(interests[0]);
</script>

<Seo
	title="Pricing | VNTA Robotics"
	shareTitle="VNTA Robotics pricing | {pricing.headline}"
	image="/share/robotics-pricing.png"
	imageAlt="VNTA Robotics pricing. {pricing.headline}"
	description="Independent validation of robot and fleet integrations, from €6,500 ex VAT. Design partner places from €2,500. Priced per integration, not per robot. Early access."
	ld={[breadcrumb('Robotics', '/robotics'), faqPage(faq)]}
/>

<main>
	<section class="band top" aria-labelledby="pricing-title">
		<div class="wrap">
			<div class="top__eyebrow">
				<p class="eyebrow">{robotics.name} · {pricing.eyebrow}</p>
				<Stage stage={robotics.stage} />
			</div>
			<h1 class="top__title" id="pricing-title">{pricing.headline}</h1>
			<p class="top__lede">{pricing.lede}</p>
			<div class="top__cta">
				<a class="btn btn--solid" href="#request" onclick={() => (interest = 'Validation')}>
					{pricing.primaryCta}
					<Icon name="arrow" size={18} />
				</a>
				<a class="btn btn--ghost" href="#request" onclick={() => (interest = 'Design partner')}>{pricing.secondaryCta}</a>
			</div>

			<ul class="tiers">
				{#each tiers as t}
					<li class="tier card" class:tier--primary={t.primary}>
						{#if t.primary}<p class="tier__flag">Recommended</p>{/if}
						<div class="tier__top">
							<Stage stage={t.availability} />
						</div>
						<h2 class="tier__title">{t.label}</h2>
						<p class="tier__price">{t.price}</p>
						<p class="tier__vat">{t.price === 'Scoped' ? 'Priced by agreement' : pricing.vat}</p>
						<p class="tier__body">{t.body}</p>
						<a class="btn {t.primary ? 'btn--solid' : 'btn--ghost'} tier__cta" href="#request" onclick={() => (interest = t.interest)}>
							{t.cta}
						</a>
						<p class="tier__list-head">Includes</p>
						<ul class="tier__list">
							{#each t.includes as i}
								<li><Icon name="check" size={16} />{i}</li>
							{/each}
						</ul>
						<p class="tier__note">{t.note}</p>
					</li>
				{/each}
			</ul>

			<p class="runtime"><Icon name="clock" size={16} />{pricing.runtime}</p>

			<p class="small-print">
				Every price is a starting point, shown ex VAT. There is no online payment: scope is agreed before work begins.
				{robotics.notSafety}
			</p>
		</div>
	</section>

	<section class="band band--paper" aria-labelledby="units-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">How we price</p>
				<h2 class="head__title" id="units-title">{units.headline}</h2>
				<p class="head__text">{units.body}</p>
			</div>
			<ul class="units">
				{#each units.list as u}
					<li class="unit">
						<h3>{u.name}</h3>
						<p>{u.body}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="band" aria-labelledby="flow-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">How an engagement runs</p>
				<h2 class="head__title" id="flow-title">Start with one real integration.</h2>
				<p class="head__text">
					Connect one robot or fleet system, agree what will be tested, run the suite, and go through the result together. Nothing is
					bought with a button.
				</p>
			</div>
			<ol class="flow">
				{#each workflow as w, i}
					<li class="flow__step card">
						<span class="flow__n">{String(i + 1).padStart(2, '0')}</span>
						<h3>{w.name}</h3>
						<p>{w.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="band band--paper" id="status" aria-labelledby="status-title">
		<div class="wrap">
			<div class="head">
				<div class="status__top">
					<p class="eyebrow">Technical status</p>
					<Stage stage={robotics.stage} />
				</div>
				<h2 class="head__title" id="status-title">What runs today, and what does not yet.</h2>
				<p class="head__text">{robotics.honest} No dates are given, because none are committed.</p>
			</div>
			<div class="cols">
				<div class="col card">
					<Stage stage="Supported now" />
					<ul>
						{#each support.now as i}<li>{i}</li>{/each}
					</ul>
				</div>
				<div class="col card">
					<Stage stage="Experimental" />
					<ul>
						{#each support.experimental as i}<li>{i}</li>{/each}
					</ul>
				</div>
				<div class="col card">
					<Stage stage="Planned" />
					<ul>
						{#each support.planned as i}<li>{i}</li>{/each}
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="band" aria-labelledby="faq-title">
		<div class="wrap faq">
			<div class="head">
				<p class="eyebrow">Questions</p>
				<h2 class="head__title" id="faq-title">Before you ask.</h2>
			</div>
			<div class="faq__list">
				{#each faq as f}
					<details class="faq__item">
						<summary>{f.q}<Icon name="arrow" size={16} /></summary>
						<p>{f.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="band band--paper" id="request" aria-labelledby="request-title">
		<div class="wrap">
			<div class="quote">
				<div>
					<p class="eyebrow">Request</p>
					<h2 class="quote__title" id="request-title">{form.title}</h2>
					<p class="quote__text">{form.lede}</p>
					<ul class="promise">
						<li><Icon name="check" size={16} />No payment, no card, no automatic sign-up.</li>
						<li><Icon name="check" size={16} />Scope is agreed before work begins.</li>
						<li><Icon name="check" size={16} />Early places are limited, so not every request can be taken on.</li>
					</ul>
				</div>
				<div class="quote__form card">
					<PilotForm bind:interest />
				</div>
			</div>
		</div>
	</section>

	<!-- The close: dark, and it runs into the foot. -->
	<section class="band close" data-theme="ink" aria-labelledby="next-title">
		<div class="wrap next">
			<div>
				<h2 class="head__title" id="next-title">Validate one integration before standardising the rest.</h2>
				<p class="next__text">{robotics.note}</p>
			</div>
			<div class="next__act">
				<a class="btn btn--solid" href="#request" onclick={() => (interest = 'Validation')}>
					Validate an integration
					<Icon name="arrow" size={18} />
				</a>
				<a class="next__link" href="{base}/robotics#report">View sample validation report</a>
			</div>
		</div>
	</section>
</main>

<style>
	/* --- Top ---------------------------------------------------------------- */
	.top {
		background:
			radial-gradient(60% 60% at 80% 0%, #ffffff 0%, rgba(255, 255, 255, 0) 70%),
			var(--ground);
	}
	.top > .wrap {
		padding-top: clamp(40px, 5.5vw, 76px);
	}
	.top__title {
		margin: 14px 0 0;
		font-size: var(--t-hero);
		line-height: 1.04;
		letter-spacing: -0.04em;
		max-width: 17ch;
		text-wrap: balance;
	}
	.top__lede {
		margin: clamp(14px, 1.6vw, 20px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.5;
		color: var(--ink-60);
		max-width: 38rem;
		text-wrap: pretty;
	}
	.top__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: clamp(20px, 2.4vw, 28px);
	}

	/* --- The four offers ---------------------------------------------------- */
	.tiers {
		list-style: none;
		margin: clamp(36px, 4.6vw, 60px) 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		align-items: stretch;
	}
	.tier {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 22px 20px 20px;
		min-width: 0;
	}
	.tier--primary {
		border-color: var(--navy);
		box-shadow:
			0 0 0 1px var(--navy),
			var(--lift);
	}
	.tier__flag {
		position: absolute;
		top: -11px;
		left: 18px;
		margin: 0;
		padding: 3px 9px;
		border-radius: var(--r-chip);
		background: var(--navy);
		color: #fff;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.tier__top {
		display: grid;
		justify-items: start;
		gap: 14px;
	}
	.tier__title {
		margin: 14px 0 0;
		font-size: 1.06rem;
		letter-spacing: -0.01em;
	}
	.tier__price {
		margin: 6px 0 0;
		font-size: clamp(1.7rem, 2.3vw, 2rem);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.035em;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.tier__vat {
		margin: 4px 0 0;
		font-size: 0.8rem;
		color: var(--ink-60);
	}
	.tier__body {
		margin: 14px 0 0;
		font-size: 0.94rem;
		line-height: 1.5;
		text-wrap: pretty;
	}
	.tier__cta {
		margin-top: 18px;
		width: 100%;
	}
	.tier__list-head {
		margin: 20px 0 0;
		padding-top: 16px;
		border-top: 1px solid var(--line-soft);
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.tier__list,
	.promise {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		font-size: 0.92rem;
		line-height: 1.4;
		text-wrap: pretty;
	}
	.tier__list li,
	.promise li {
		display: grid;
		grid-template-columns: 16px minmax(0, 1fr);
		gap: 9px;
		align-items: start;
	}
	.tier__list :global(svg),
	.promise :global(svg) {
		margin-top: 2px;
		color: var(--green);
	}
	.tier__note {
		margin: auto 0 0;
		padding-top: 18px;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--ink-60);
	}

	.runtime {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		margin: 18px 0 0;
		font-size: var(--t-small);
		line-height: 1.5;
		color: var(--ink-60);
	}
	.runtime :global(svg) {
		flex: none;
		margin-top: 2px;
		color: var(--ink-40);
	}
	.top__eyebrow,
	.status__top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 12px;
	}
	.small-print {
		margin: 20px 0 0;
		max-width: 64rem;
		font-size: 0.84rem;
		line-height: 1.55;
		color: var(--ink-60);
	}

	/* --- How we price ------------------------------------------------------- */
	.units {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border-top: 1px solid var(--line);
	}
	.unit {
		padding: 18px 0;
		border-bottom: 1px solid var(--line);
	}
	.unit h3 {
		margin: 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.unit p {
		margin: 8px 0 0;
		font-size: 1.05rem;
		line-height: 1.45;
		color: var(--ink);
		max-width: 22rem;
	}
	/* --- The six steps ------------------------------------------------------ */
	.flow {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
	.flow__step {
		padding: 16px;
	}
	.flow__n {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--ink-40);
	}
	.flow__step h3 {
		margin: 8px 0 0;
		font-size: 1rem;
	}
	.flow__step p {
		margin: 4px 0 0;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-60);
	}

	/* --- Now, next, later; supported, experimental, planned ---------------- */
	.cols {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}
	.col {
		padding: 18px;
		background: var(--ground);
	}
	.col ul {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: grid;
		gap: 9px;
		font-size: 0.94rem;
		line-height: 1.4;
	}
	.col li {
		padding-left: 14px;
		position: relative;
	}
	.col li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 5px;
		height: 1.5px;
		background: var(--ink-40);
	}

	/* --- Questions ---------------------------------------------------------- */
	.faq__list {
		border-top: 1px solid var(--line);
		max-width: 52rem;
	}
	.faq__item {
		border-bottom: 1px solid var(--line);
	}
	.faq__item summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 0;
		font-weight: 600;
		color: var(--ink);
		cursor: pointer;
		list-style: none;
	}
	.faq__item summary::-webkit-details-marker {
		display: none;
	}
	.faq__item summary :global(svg) {
		flex: none;
		color: var(--ink-40);
		transform: rotate(90deg);
		transition: transform var(--dur) var(--ease);
	}
	.faq__item[open] summary :global(svg) {
		transform: rotate(-90deg);
	}
	.faq__item p {
		margin: 0;
		padding: 0 0 18px;
		max-width: 44rem;
		line-height: 1.6;
		text-wrap: pretty;
	}

	/* --- The request -------------------------------------------------------- */
	.promise {
		margin-top: 22px;
		max-width: 30rem;
		color: var(--ink-80);
	}
	#request .quote__text {
		max-width: 30rem;
	}
	#request .quote__title {
		margin-top: 14px;
		font-size: var(--t-h2);
	}

	/* --- The close ---------------------------------------------------------- */
	.close {
		background: var(--paper);
	}
	.next {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		align-items: center;
	}
	.next__text {
		margin: 14px 0 0;
		line-height: 1.55;
		color: var(--ink-60);
		max-width: 40rem;
		text-wrap: pretty;
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
		.flow {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.units {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0 32px;
			border-top: 0;
		}
		.unit {
			border-top: 1px solid var(--line);
		}
	}
	@media (min-width: 900px) {
		.cols {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.next {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.tiers {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 1140px) {
		/* Equal description height, so the three buttons sit on one line. */
		.tier__body {
			min-height: 4.5em;
		}
		.flow {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}
</style>
