<script lang="ts">
	// Pricing for VNTA Robotics. The page has two jobs: say plainly what an
	// early engagement costs, and say just as plainly that the product is in
	// development. There is no checkout. Every button leads to the request
	// form at the foot of the page, and the form promises nothing.
	//
	// All the words and numbers are in $lib/content/pricing.ts.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import PilotForm from '$lib/components/PilotForm.svelte';
	import { robotics, support } from '$lib/content/site';
	import { pricing, tiers, enterprise, units, workflow, status, faq, form, interests } from '$lib/content/pricing';
	import { breadcrumb, faqPage } from '$lib/content/structured';

	// Which offer the form is about. A card's button sets it on the way down.
	let interest = $state(interests[0]);
	const pick: Record<string, string> = {
		'design-partner': 'Design partner',
		'validation-pilot': 'Validation pilot',
		'advanced-commissioning': 'Advanced commissioning',
		runtime: 'Runtime waitlist'
	};
</script>

<Seo
	title="Pricing | VNTA Robotics"
	shareTitle="VNTA Robotics pricing | {pricing.headline}"
	image="/share/robotics-pricing.png"
	imageAlt="VNTA Robotics pricing. {pricing.headline} In development."
	description="Validation pilots for robot and fleet integrations, from €6,500 ex VAT. Priced per integration, not per robot. VNTA Robotics is in development and taking a limited number of early projects."
	ld={[breadcrumb('Robotics', '/robotics'), faqPage(faq)]}
/>

<main>
	<!-- Said first, quietly: this is being built. -->
	<aside class="banner" aria-label="Development status">
		<div class="wrap banner__in">
			<Stage stage={pricing.banner.label} />
			<p>{pricing.banner.text}</p>
			<a class="banner__go" href="#status">Development status</a>
		</div>
	</aside>

	<section class="band top" aria-labelledby="pricing-title">
		<div class="wrap">
			<p class="eyebrow">{robotics.name} · {pricing.eyebrow}</p>
			<h1 class="top__title" id="pricing-title">{pricing.headline}</h1>
			<p class="top__lede">{pricing.lede}</p>
			<div class="top__cta">
				<a class="btn btn--solid" href="#request" onclick={() => (interest = 'Validation pilot')}>
					{pricing.primaryCta}
					<Icon name="arrow" size={18} />
				</a>
				<a class="btn btn--ghost" href="#request" onclick={() => (interest = 'Not sure yet')}>{pricing.secondaryCta}</a>
			</div>

			<ul class="tiers">
				{#each tiers as t}
					<li class="tier card" class:tier--primary={t.primary} class:tier--planned={t.planned}>
						{#if t.primary}<p class="tier__flag">Recommended</p>{/if}
						<div class="tier__top">
							<Stage stage={t.availability} />
							<p class="eyebrow">{t.label}</p>
						</div>
						<h2 class="tier__title">{t.title}</h2>
						<p class="tier__price">
							{t.price}{#if t.per}<span class="tier__per">&nbsp;{t.per}</span>{/if}
						</p>
						<p class="tier__vat">{pricing.vat}{t.planned ? ' · planned' : ''}</p>
						<p class="tier__body">{t.body}</p>
						<a class="btn {t.primary ? 'btn--solid' : 'btn--ghost'} tier__cta" href="#request" onclick={() => (interest = pick[t.id])}>
							{t.cta}
						</a>
						<p class="tier__list-head">{t.planned ? 'Intended to include' : 'Includes'}</p>
						<ul class="tier__list">
							{#each t.includes as i}
								<li><Icon name={t.planned ? 'clock' : 'check'} size={16} />{i}</li>
							{/each}
						</ul>
						<p class="tier__note">{t.note}</p>
					</li>
				{/each}
			</ul>

			<div class="ent card">
				<div class="ent__say">
					<p class="eyebrow">{enterprise.label}</p>
					<h2 class="ent__title">{enterprise.title}</h2>
					<p class="ent__body">{enterprise.body}</p>
				</div>
				<ul class="ent__list">
					{#each enterprise.includes as i}
						<li><Icon name="check" size={16} />{i}</li>
					{/each}
				</ul>
				<div class="ent__act">
					<p class="ent__price">{enterprise.price}</p>
					<a class="btn btn--ghost" href="#request" onclick={() => (interest = 'Enterprise')}>{enterprise.cta}</a>
					<p class="tier__note">{enterprise.note}</p>
				</div>
			</div>

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
			<ul class="lines">
				{#each units.lines as l}<li>{l}</li>{/each}
			</ul>
		</div>
	</section>

	<section class="band" aria-labelledby="flow-title">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">How an engagement runs</p>
				<h2 class="head__title" id="flow-title">Start with one real integration.</h2>
				<p class="head__text">
					Connect one robot or fleet system, agree what will be tested, run the suite, and go through the report together. Nothing is
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
				<p class="eyebrow">Development status</p>
				<h2 class="head__title" id="status-title">What exists, and what does not yet.</h2>
				<p class="head__text">{robotics.honest} No dates are given, because none are committed.</p>
			</div>
			<div class="cols">
				{#each status as s}
					<div class="col card">
						<Stage stage={s.when} />
						<ul>
							{#each s.items as i}<li>{i}</li>{/each}
						</ul>
					</div>
				{/each}
			</div>

			<div class="head head--second">
				<p class="eyebrow">Integrations</p>
				<h2 class="head__title">Supported, experimental, planned.</h2>
				<p class="head__text">Support varies by protocol and implementation. Only the first column runs today.</p>
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
					<p class="eyebrow">Pilot request</p>
					<h2 class="quote__title" id="request-title">{form.title}</h2>
					<p class="quote__text">{form.lede}</p>
					<ul class="promise">
						<li><Icon name="check" size={16} />No payment, no card, no automatic sign-up.</li>
						<li><Icon name="check" size={16} />Pilot scope is agreed before work begins.</li>
						<li><Icon name="check" size={16} />Not every request can be taken on while the product is in development.</li>
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
				<h2 class="head__title" id="next-title">Validate one deployment before standardising the rest.</h2>
				<p class="next__text">{robotics.note}</p>
			</div>
			<div class="next__act">
				<a class="btn btn--solid" href="#request" onclick={() => (interest = 'Validation pilot')}>
					Request a pilot
					<Icon name="arrow" size={18} />
				</a>
				<a class="next__link" href="{base}/robotics">What VNTA Robotics is</a>
			</div>
		</div>
	</section>
</main>

<style>
	/* --- The development banner: pale blue, never a warning. ---------------- */
	.banner {
		background: var(--blue-soft);
		border-bottom: 1px solid color-mix(in srgb, var(--blue) 14%, transparent);
		color: var(--ink-80);
		font-size: var(--t-small);
	}
	.banner__in {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 14px;
		padding-top: 10px;
		padding-bottom: 10px;
	}
	.banner :global(.stage) {
		background: var(--paper);
	}
	.banner p {
		margin: 0;
		flex: 1 1 28rem;
		line-height: 1.45;
	}
	.banner__go {
		font-weight: 600;
		color: var(--blue);
		white-space: nowrap;
	}
	.banner__go:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

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
	.tier--planned {
		background: transparent;
		border-style: dashed;
		border-color: var(--ink-20);
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
	.tier--planned .tier__price,
	.tier--planned .tier__title {
		color: var(--ink-60);
	}
	.tier__per {
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0;
		color: var(--ink-60);
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
	.ent__list,
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
	.ent__list li,
	.promise li {
		display: grid;
		grid-template-columns: 16px minmax(0, 1fr);
		gap: 9px;
		align-items: start;
	}
	.tier__list :global(svg),
	.ent__list :global(svg),
	.promise :global(svg) {
		margin-top: 2px;
		color: var(--green);
	}
	.tier--planned .tier__list {
		color: var(--ink-60);
	}
	.tier--planned .tier__list :global(svg) {
		color: var(--ink-40);
	}
	.tier__note {
		margin: auto 0 0;
		padding-top: 18px;
		font-size: 0.82rem;
		line-height: 1.45;
		color: var(--ink-60);
	}

	/* --- Enterprise: one wide panel under the four. ------------------------- */
	.ent {
		display: grid;
		grid-template-columns: 1fr;
		gap: 20px;
		margin-top: 12px;
		padding: 22px 20px;
	}
	.ent__title {
		margin: 12px 0 0;
		font-size: 1.2rem;
	}
	.ent__body {
		margin: 8px 0 0;
		font-size: 0.94rem;
		line-height: 1.5;
		max-width: 34rem;
	}
	.ent__list {
		margin: 0;
		align-content: start;
	}
	.ent__act {
		display: grid;
		gap: 10px;
		align-content: start;
		justify-items: start;
	}
	.ent__price {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.ent__act .tier__note {
		margin: 0;
		padding: 0;
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
	.lines {
		list-style: none;
		margin: 24px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
		font-size: var(--t-small);
		color: var(--ink-60);
		max-width: 46rem;
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
	.head--second {
		margin-top: clamp(40px, 5vw, 64px);
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
		.tiers {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.flow {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.units {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 32px;
			border-top: 0;
		}
		.unit {
			border-top: 1px solid var(--line);
		}
		.ent {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
		.ent__act {
			grid-column: 1 / -1;
		}
	}
	@media (min-width: 900px) {
		.cols {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.next {
			grid-template-columns: minmax(0, 1fr) auto;
		}
		.ent {
			grid-template-columns: minmax(0, 5fr) minmax(0, 5fr) minmax(0, 3fr);
			align-items: start;
			padding: 26px 24px;
		}
		.ent__act {
			grid-column: auto;
		}
	}
	@media (min-width: 1140px) {
		.tiers {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
		/* Four lines of description, so the four buttons sit on one line. */
		.tier__body {
			min-height: 6em;
		}
		.flow {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}
</style>
