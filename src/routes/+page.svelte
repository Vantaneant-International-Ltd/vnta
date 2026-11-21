<script lang="ts">
	// Home: the public face of VNTA Personal. Words come from content/site.ts.
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import HeroPreview from '$lib/components/home/HeroPreview.svelte';
	import DemoPanel from '$lib/components/home/DemoPanel.svelte';
	import BetaForm from '$lib/components/home/BetaForm.svelte';
	import { pitch, handles, steps, privacy, faq } from '$lib/content/site';
	import { organisation, website, faqPage } from '$lib/content/structured';
</script>

<Seo
	title="VNTA | Life, handled."
	description={pitch.short}
	ld={[organisation(), website(), faqPage()]}
/>

<main>
	<!-- 1. Hero -->
	<section class="band hero">
		<div class="wrap hero__stack">
			<p class="eyebrow">{pitch.descriptor}</p>
			<h1>VNTA<span class="stop">.</span></h1>
			<p class="tag">Life, <span class="hl">handled</span>.</p>
			<p class="lede">{pitch.lede}</p>
			<div class="cta">
				<a class="btn btn--solid" href="#beta">Join the private beta</a>
				<a class="btn btn--ghost" href="#how">See how it works <Icon name="arrow" size={16} /></a>
			</div>
			<p class="status">{pitch.status}</p>
			<div class="hero__art"><HeroPreview /></div>
		</div>
	</section>

	<!-- 2. What VNTA handles -->
	<section class="band band--paper" id="handles">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">01 · What it handles</p>
				<h2 class="head__title">The paperwork that quietly runs your life.</h2>
				<p class="head__text">VNTA is designed around five things people forget until it is late.</p>
			</div>
			<ul class="grid">
				{#each handles as h}
					<li>
						<span class="ico"><Icon name={h.icon} size={20} /></span>
						<h3>{h.name}</h3>
						<p>{h.body}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 3. How it works -->
	<section class="band" id="how">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">02 · How it works</p>
				<h2 class="head__title">Collect. Understand. Prepare. Track.</h2>
				<p class="head__text">Four steps, and you stay in charge of each one.</p>
			</div>
			<ol class="steps">
				{#each steps as s, i}
					<li>
						<span class="n">0{i + 1}</span>
						<h3>{s.name}</h3>
						<p>{s.body}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<!-- 4. Demonstration -->
	<section class="band band--paper" id="demo">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">03 · Try it</p>
				<h2 class="head__title">See what VNTA would find in a letter.</h2>
				<p class="head__text">
					This runs here, in your browser, on a made-up letter. Select a highlighted sentence to see where a
					suggestion came from. Approve or dismiss it. Draft a reply. Nothing is sent, paid or saved.
				</p>
			</div>
			<DemoPanel />
		</div>
	</section>

	<!-- 5. Privacy and control -->
	<section class="band" id="privacy">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">04 · Privacy and control</p>
				<h2 class="head__title">You decide. VNTA shows its working.</h2>
				<p class="head__text">
					These are the rules the private beta is being built to. They are commitments we hold ourselves to, not
					certifications.
				</p>
			</div>
			<ul class="grid grid--four">
				{#each privacy as p}
					<li>
						<h3>{p.name}</h3>
						<p>{p.body}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- 6. FAQ and beta -->
	<section class="band band--paper" id="faq">
		<div class="wrap">
			<div class="head">
				<p class="eyebrow">05 · Questions</p>
				<h2 class="head__title">Plain answers.</h2>
			</div>
			<div class="faq">
				{#each faq as f}
					<details>
						<summary>{f.q}</summary>
						<p>{f.a}</p>
					</details>
				{/each}
			</div>
		</div>
	</section>

	<section class="band beta" id="beta" data-theme="ink">
		<div class="wrap beta__grid">
			<div>
				<p class="eyebrow">Private beta</p>
				<h2 class="head__title">Be among the first to try VNTA.</h2>
				<p class="head__text">
					We are letting people in slowly. Leave your email and we will write when there is room.
				</p>
			</div>
			<BetaForm />
		</div>
	</section>
</main>

<style>
	.hero__stack {
		display: grid;
		justify-items: center;
		text-align: center;
		padding-block: clamp(24px, 5vw, 64px) 0;
	}
	h1 {
		margin: 18px 0 0;
		font-size: clamp(4.5rem, 16vw, 10rem);
		font-weight: 600;
		letter-spacing: -0.065em;
		line-height: 0.9;
		color: var(--ink);
	}
	.stop {
		color: var(--blue);
	}
	.tag {
		margin: 18px 0 0;
		font-size: clamp(1.9rem, 5vw, 3.4rem);
		font-weight: 600;
		letter-spacing: -0.04em;
		color: var(--ink);
	}
	/* The mark VNTA uses everywhere for "this is where it came from". */
	.hl {
		background: var(--blue-soft);
		border-bottom: 0.09em solid var(--blue);
		padding: 0 0.08em;
	}
	.lede {
		margin: 18px 0 28px;
		max-width: 32rem;
		font-size: var(--t-lede);
		color: var(--ink-60);
		text-wrap: balance;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
	}
	.status {
		margin: 20px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.hero__art {
		width: min(100%, 46rem);
		margin-top: clamp(40px, 6vw, 80px);
		text-align: left;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0;
		border-top: 1px solid var(--line);
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
	}
	.grid li {
		padding: 28px 28px 32px 0;
		border-bottom: 1px solid var(--line);
	}
	.ico {
		display: inline-grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--ground-2);
		color: var(--ink);
		margin-bottom: 14px;
	}
	h3 {
		margin: 0 0 6px;
		font-size: 1.1rem;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.grid p,
	.steps p {
		margin: 0;
		color: var(--ink-60);
		font-size: 0.95rem;
		text-wrap: pretty;
	}

	.steps {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		border-top: 1px solid var(--line);
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
	}
	.steps li {
		padding: 24px 24px 28px 0;
		border-bottom: 1px solid var(--line);
	}
	.n {
		display: block;
		margin-bottom: 18px;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--blue);
	}

	.faq {
		max-width: 46rem;
		border-top: 1px solid var(--line);
	}
	details {
		border-bottom: 1px solid var(--line);
	}
	summary {
		cursor: pointer;
		list-style: none;
		padding: 18px 32px 18px 0;
		position: relative;
		font-weight: 600;
		color: var(--ink);
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: '+';
		position: absolute;
		right: 4px;
		top: 16px;
		font-weight: 400;
		font-size: 1.3rem;
		color: var(--ink-60);
	}
	details[open] summary::after {
		content: '–';
	}
	summary:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	details p {
		margin: 0 0 18px;
		color: var(--ink-60);
		max-width: 40rem;
		text-wrap: pretty;
	}

	.beta {
		background: var(--ground);
		color: var(--ink-80);
	}
	.beta__grid {
		display: grid;
		gap: clamp(28px, 5vw, 72px);
		align-items: start;
	}
	@media (min-width: 900px) {
		.beta__grid {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
	}
	.beta .head__title {
		margin-top: 10px;
	}
	.beta .head__text {
		margin-top: 14px;
	}
</style>
