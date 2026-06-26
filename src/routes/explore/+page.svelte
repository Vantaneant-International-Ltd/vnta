<script lang="ts">
	import { tick } from 'svelte';
	import { renderTurnstile, resetTurnstile, submitVnta, turnstileConfigured } from '$lib/turnstile';

	const pillars = [
		{ n: '01', title: 'Cadence', body: 'Weekly alignment, monthly deliverables, quarterly recalibration. A rhythm that makes progress predictable.' },
		{ n: '02', title: 'Leadership', body: 'Not advisory. We make decisions, set direction, and move the work forward with your team or ours.' },
		{ n: '03', title: 'Outcome', body: 'A brand operating system and a high-functioning team. By month twelve, the work runs without VNTA.' }
	];

	const phases = [
		{ n: 'I', title: 'Months 1 to 2', label: 'Diagnosis', body: 'Positioning and narrative. We define what you are, who it is for, and how it shows up.' },
		{ n: 'II', title: 'Months 3 to 6', label: 'Execution system', body: 'We ship deliverables, coordinate specialists, and hold a monthly rhythm.' },
		{ n: 'III', title: 'Months 7 to 9', label: 'Scale', body: 'Campaigns, distribution, partnerships, and flagship moves.' },
		{ n: 'IV', title: 'Months 10 to 12', label: 'Handover', body: 'Documentation, team autonomy, and a clear path after VNTA.' }
	];

	const included = [
		'Brand strategy, positioning, and narrative',
		'Creative direction and identity oversight',
		'Team coordination across internal and external specialists',
		'Monthly deliverables with clear scope and ownership',
		'Decision-making support and priority problem-solving',
		'Documentation: systems, playbooks, and handover assets'
	];

	const notIncluded = [
		'Unlimited design requests or production-studio work',
		'Paid media buying. We can guide strategy and coordination',
		'Building complex dev products. We can lead brand direction',
		'Advice-only arrangements without execution ownership'
	];

	const faqs = [
		{ q: 'Why begin with a Diagnosis?', a: 'It is the lowest-risk way for both sides to find out if a residency is right. You leave with a clear read and a scoped plan whether or not we go further.' },
		{ q: 'Do you replace an internal team?', a: 'No. We lead and coordinate. Sometimes we help build the team; sometimes we guide the team you already have.' },
		{ q: 'How is the residency priced?', a: 'By scope, after the Diagnosis. The Diagnosis is the only fixed price we publish; the residency is defined to your situation, not sold from a menu.' },
		{ q: 'What happens after twelve months?', a: 'You keep the system and the team. Continuity retainers exist for existing clients, invite-only.' }
	];

	/* ========= Inquiry modal ========= */
	let inquiryOpen = false;
	let tsToken = '';
	let tsId: string | null = null;
	let tsEl: HTMLElement;

	let inquiry = {
		name: '',
		email: '',
		company: '',
		engagement: 'Diagnosis',
		timeline: '1 to 2 months',
		budget: 'Not sure',
		notes: ''
	};

	const engagementOptions = ['Diagnosis', 'Tailored sprint', '12-month residency', 'Not sure yet'];
	const timelineOptions = ['ASAP', '1 to 2 months', '3 to 6 months', '6 to 12 months', 'Not sure'];
	const budgetOptions = ['< €5k', '€5k to €10k', '€10k to €20k', '€20k+', 'Not sure'];

	function portal(node: HTMLElement, target = 'body') {
		if (typeof document === 'undefined') return;
		const targetEl = document.querySelector(target);
		if (!targetEl) return;
		const parent = node.parentNode;
		targetEl.appendChild(node);
		return {
			destroy() {
				if (parent) parent.appendChild(node);
			}
		};
	}

	let prevBodyOverflow = '';
	let prevBodyPaddingRight = '';

	function lockScroll() {
		if (typeof document === 'undefined') return;
		const body = document.body;
		prevBodyOverflow = body.style.overflow;
		prevBodyPaddingRight = body.style.paddingRight;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
	}

	function unlockScroll() {
		if (typeof document === 'undefined') return;
		const body = document.body;
		body.style.overflow = prevBodyOverflow;
		body.style.paddingRight = prevBodyPaddingRight;
	}

	let inquiryState: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
	let inquiryError = '';

	async function openInquiry(preset?: string) {
		if (preset) inquiry.engagement = preset;
		inquiryOpen = true;
		inquiryState = 'idle';
		inquiryError = '';
		tsToken = '';
		lockScroll();
		await tick();
		if (turnstileConfigured() && tsEl) {
			tsId = await renderTurnstile(
				tsEl,
				(t) => (tsToken = t),
				() => (tsToken = '')
			);
		}
	}

	async function submitInquiry() {
		if (!inquiry.name && !inquiry.email && !inquiry.notes) {
			inquiryState = 'error';
			inquiryError = 'Add your name, email, or a note first.';
			return;
		}
		if (turnstileConfigured() && !tsToken) {
			inquiryState = 'error';
			inquiryError = 'Please complete the verification.';
			return;
		}
		inquiryState = 'sending';
		inquiryError = '';
		const res = await submitVnta(
			'inquiry',
			{
				kind: 'engagement',
				name: inquiry.name,
				email: inquiry.email,
				company: inquiry.company,
				engagement: inquiry.engagement,
				timeline: inquiry.timeline,
				budget: inquiry.budget,
				notes: inquiry.notes,
				source: '/engagement'
			},
			tsToken
		);
		if (!res.ok) {
			inquiryState = 'error';
			inquiryError = res.error || 'Could not submit.';
			resetTurnstile(tsId);
			tsToken = '';
			return;
		}
		inquiryState = 'sent';
		setTimeout(() => closeInquiry(), 1400);
	}

	function closeInquiry() {
		inquiryOpen = false;
		unlockScroll();
	}

	function openInquiryEmail() {
		const to = 'studio@vnta.xyz';
		const subject = encodeURIComponent('Engagement inquiry · VNTA');
		const bodyLines = [
			`Name: ${inquiry.name || '-'}`,
			`Email: ${inquiry.email || '-'}`,
			`Company: ${inquiry.company || '-'}`,
			`Engagement: ${inquiry.engagement}`,
			`Timeline: ${inquiry.timeline}`,
			`Budget range: ${inquiry.budget}`,
			'',
			'Context:',
			inquiry.notes || '-'
		];
		const body = encodeURIComponent(bodyLines.join('\n'));
		window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
	}

	function onKeydown(e: KeyboardEvent) {
		if (!inquiryOpen) return;
		if (e.key === 'Escape') closeInquiry();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>Engagement · VNTA</title>
	<meta
		name="description"
		content="Brand leadership in residence. Begin with a fixed-fee Diagnosis; the twelve-month residency is scoped to you."
	/>
	<meta property="og:title" content="Engagement · VNTA" />
	<meta
		property="og:description"
		content="Brand leadership in residence. Begin with a fixed-fee Diagnosis; the twelve-month residency is scoped to you."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<!-- HERO -->
	<header class="hero">
		<div class="hero__meta">
			<span class="eyebrow">Engagement</span>
			<span class="eyebrow">In residence · 12 months</span>
		</div>
		<h1 class="hero__title">Engagement</h1>
		<p class="hero__lede">
			Brand leadership in residence. A structured twelve-month model that turns vision into a
			working brand system, with clear cadence, clear decisions, and steady execution. One
			engagement at a time.
		</p>
	</header>

	<!-- POSITION -->
	<section class="statement">
		<span class="eyebrow statement__label">Position</span>
		<p class="statement__body">This is not advisory. <span class="muted">This is leadership.</span></p>
	</section>

	<!-- THE MODEL: pillars -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">How we operate</span>
			<span class="eyebrow">Three pillars</span>
		</div>
		<div class="cols">
			{#each pillars as p}
				<article class="col">
					<span class="col__n">{p.n}</span>
					<h2 class="col__title">{p.title}</h2>
					<p class="col__body">{p.body}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- THE MODEL: phases -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">The residency</span>
			<span class="eyebrow">Twelve months · four phases</span>
		</div>
		<ol class="phases">
			{#each phases as p}
				<li class="phase">
					<span class="phase__n">{p.n}</span>
					<div class="phase__main">
						<div class="phase__top">
							<h3 class="phase__title">{p.label}</h3>
							<span class="eyebrow">{p.title}</span>
						</div>
						<p class="phase__body">{p.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<!-- THE DIAGNOSIS — single paid front door -->
	<section class="diagnosis" aria-label="Begin with a Diagnosis">
		<div class="diagnosis__head">
			<div>
				<span class="eyebrow">Where to start</span>
				<h2 class="diagnosis__title">Begin with a Diagnosis</h2>
			</div>
			<div class="diagnosis__price">
				<span class="diagnosis__amount">€750</span>
				<span class="diagnosis__unit">fixed · two weeks</span>
			</div>
		</div>

		<p class="diagnosis__lede">
			A focused two-week audit of your brand, narrative, market position, and operating reality.
			You leave with a clear read and a scoped plan, whether or not we go further. It is the only
			fixed price we publish.
		</p>

		<ul class="ledger">
			<li>A diagnosis of brand, narrative, and market position</li>
			<li>A scoped plan with deliverables, timeline, and ownership</li>
			<li>A clear recommendation: residency, a tailored sprint, or nothing</li>
		</ul>

		<div class="diagnosis__cta">
			<button class="btn-primary" type="button" onclick={() => openInquiry('Diagnosis')}>Request a Diagnosis</button>
			<p class="diagnosis__note">
				The twelve-month residency is by application; its scope and fee are defined after the
				Diagnosis.
			</p>
		</div>
	</section>

	<!-- SCOPE -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">Scope</span>
			<span class="eyebrow">What the residency is</span>
		</div>
		<div class="scope">
			<div class="scope__col">
				<p class="scope__label">Included</p>
				<ul class="ledger">
					{#each included as item}<li>{item}</li>{/each}
				</ul>
			</div>
			<div class="scope__col">
				<p class="scope__label scope__label--muted">Not included</p>
				<ul class="ledger ledger--muted">
					{#each notIncluded as item}<li>{item}</li>{/each}
				</ul>
			</div>
		</div>
		<p class="retainer-line">
			After an engagement, continuity retainers are available to existing clients, invite-only.
		</p>
	</section>

	<!-- FAQ -->
	<section class="block">
		<div class="block__head">
			<span class="eyebrow">FAQ</span>
			<span class="eyebrow">Before starting</span>
		</div>
		<div class="faq">
			{#each faqs as f}
				<details class="faq-item">
					<summary class="faq-summary">
						<span class="faq-q">{f.q}</span>
						<span class="faq-plus" aria-hidden="true">+</span>
					</summary>
					<p class="faq-a">{f.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- CTA -->
	<section class="cta">
		<div class="cta__text">
			<h2 class="cta__title">Start with a Diagnosis.</h2>
			<p class="cta__sub">Two weeks, a fixed fee, and a clear read on what comes next.</p>
		</div>
		<button class="btn-primary" type="button" onclick={() => openInquiry('Diagnosis')}>Request a Diagnosis</button>
	</section>
</main>

<!-- INQUIRY MODAL (light, legible) -->
{#if inquiryOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div use:portal class="vm-backdrop" onclick={closeInquiry}>
		<div
			class="vm"
			role="dialog"
			aria-modal="true"
			aria-label="Engagement inquiry"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="vm__header">
				<div>
					<span class="eyebrow">Engagement inquiry</span>
					<h3 class="vm__title">Tell us what you’re building</h3>
				</div>
				<button class="vm__close" type="button" onclick={closeInquiry} aria-label="Close">×</button>
			</div>

			<div class="vm__body">
				<div class="vm__grid">
					<label class="field">
						<span class="field__label">Name</span>
						<input bind:value={inquiry.name} placeholder="Your name" autocomplete="name" />
					</label>

					<label class="field">
						<span class="field__label">Email</span>
						<input bind:value={inquiry.email} placeholder="you@company.com" autocomplete="email" inputmode="email" />
					</label>

					<label class="field span-2">
						<span class="field__label">Company / project <em>(optional)</em></span>
						<input bind:value={inquiry.company} placeholder="Company or project name" />
					</label>

					<label class="field">
						<span class="field__label">Engagement</span>
						<select bind:value={inquiry.engagement}>
							{#each engagementOptions as opt}<option value={opt}>{opt}</option>{/each}
						</select>
					</label>

					<label class="field">
						<span class="field__label">Timeline</span>
						<select bind:value={inquiry.timeline}>
							{#each timelineOptions as opt}<option value={opt}>{opt}</option>{/each}
						</select>
					</label>

					<label class="field span-2">
						<span class="field__label">Budget range <em>(optional)</em></span>
						<select bind:value={inquiry.budget}>
							{#each budgetOptions as opt}<option value={opt}>{opt}</option>{/each}
						</select>
					</label>

					<label class="field span-2">
						<span class="field__label">Context</span>
						<textarea
							bind:value={inquiry.notes}
							rows="5"
							placeholder="Where you are now, what you’re trying to change, your constraints, and what success looks like."
						></textarea>
					</label>
				</div>

				<div class="vm__ts" bind:this={tsEl}></div>

				<div class="vm__actions">
					<button
						class="btn-primary"
						type="button"
						onclick={submitInquiry}
						disabled={inquiryState === 'sending' || inquiryState === 'sent'}
					>
						{inquiryState === 'sending' ? 'Sending…' : inquiryState === 'sent' ? 'Sent ✓' : 'Send inquiry'}
					</button>
					<button class="btn-ghost" type="button" onclick={openInquiryEmail}>Email instead</button>
					<button class="vm__link" type="button" onclick={closeInquiry}>Cancel</button>

					{#if inquiryState === 'error'}
						<p class="vm__hint vm__hint--error">{inquiryError}</p>
					{:else}
						<p class="vm__hint">Sent securely to VNTA, or email instead, everything prefilled.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.hero {
		max-width: 920px;
		margin-bottom: var(--section-y);
	}
	.hero__meta {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(28px, 4vw, 44px);
	}
	.hero__title {
		font-family: var(--font-display);
		font-weight: 400;
		font-size: var(--t-h1);
		letter-spacing: var(--track-tight);
		line-height: 1.02;
		margin: 0 0 clamp(24px, 3vw, 36px);
		color: var(--ink);
	}
	.hero__lede {
		margin: 0;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink);
		max-width: 62ch;
	}

	.statement {
		display: grid;
		grid-template-columns: minmax(140px, 0.5fr) 1.5fr;
		gap: clamp(24px, 5vw, 64px);
		align-items: start;
		padding: var(--section-y) 0;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}
	.statement__label {
		padding-top: 0.5em;
	}
	.statement__body {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.3;
		color: var(--ink);
		max-width: 22ch;
	}
	.statement__body .muted {
		color: var(--ink-35);
	}

	.block {
		padding: var(--section-y) 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.block__head {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		margin-bottom: clamp(32px, 4vw, 52px);
	}

	.cols {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(24px, 4vw, 56px);
	}
	.col {
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}
	.col__n {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		color: var(--ink-50);
	}
	.col__title {
		margin: 16px 0 14px;
		font-size: var(--t-h4);
		color: var(--ink);
	}
	.col__body {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--ink-70);
	}

	.phases {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.phase {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: clamp(16px, 3vw, 36px);
		padding: clamp(22px, 3vw, 30px) 0;
		border-top: 1px solid var(--line);
	}
	.phase:last-child {
		border-bottom: 1px solid var(--line);
	}
	.phase__n {
		font-family: var(--font-display);
		font-size: 1.4rem;
		color: var(--ink-35);
	}
	.phase__top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
	}
	.phase__title {
		margin: 0;
		font-size: var(--t-h4);
		color: var(--ink);
	}
	.phase__body {
		margin: 12px 0 0;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--ink-70);
		max-width: 64ch;
	}

	/* DIAGNOSIS — the one priced thing, framed as a statement not a card */
	.diagnosis {
		padding: var(--section-y) 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.diagnosis__head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		padding-bottom: clamp(24px, 3vw, 36px);
		border-bottom: 1px solid var(--line);
	}
	.diagnosis__title {
		margin: 12px 0 0;
		font-size: var(--t-h2);
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}
	.diagnosis__price {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.diagnosis__amount {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 5vw, 3.4rem);
		line-height: 1;
		color: var(--ink);
	}
	.diagnosis__unit {
		margin-top: 8px;
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
	.diagnosis__lede {
		margin: clamp(28px, 4vw, 40px) 0 0;
		font-size: var(--t-lede);
		line-height: 1.55;
		color: var(--ink);
		max-width: 64ch;
	}
	.diagnosis__cta {
		display: flex;
		align-items: center;
		gap: clamp(20px, 4vw, 40px);
		flex-wrap: wrap;
		margin-top: clamp(28px, 4vw, 40px);
	}
	.diagnosis__note {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--ink-50);
		max-width: 40ch;
	}

	/* Ledgers */
	.ledger {
		list-style: none;
		margin: clamp(24px, 3vw, 32px) 0 0;
		padding: 0;
	}
	.ledger li {
		padding: 14px 0;
		border-top: 1px solid var(--line-soft);
		font-size: 1rem;
		line-height: 1.5;
		color: var(--ink-85);
	}
	.ledger--muted li {
		color: var(--ink-50);
	}

	.scope {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(24px, 5vw, 64px);
	}
	.scope__label {
		margin: 0;
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink);
	}
	.scope__label--muted {
		color: var(--ink-50);
	}
	.scope .ledger {
		margin-top: 8px;
	}
	.retainer-line {
		margin: clamp(32px, 4vw, 48px) 0 0;
		font-size: 0.95rem;
		color: var(--ink-50);
	}

	/* FAQ */
	.faq {
		border-top: 1px solid var(--line);
	}
	.faq-item {
		border-bottom: 1px solid var(--line-soft);
	}
	.faq-summary {
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 20px 0;
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--ink);
	}
	.faq-summary::-webkit-details-marker {
		display: none;
	}
	.faq-plus {
		font-family: var(--font-body);
		font-size: 1.2rem;
		color: var(--ink-50);
		transition: transform var(--dur) var(--ease);
		flex: 0 0 auto;
	}
	.faq-item[open] .faq-plus {
		transform: rotate(45deg);
	}
	.faq-a {
		margin: 0;
		padding: 0 0 22px;
		color: var(--ink-70);
		line-height: 1.7;
		max-width: 70ch;
	}

	/* CTA */
	.cta {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
		padding-top: var(--section-y);
	}
	.cta__title {
		margin: 0 0 8px;
		font-size: var(--t-h3);
		color: var(--ink);
	}
	.cta__sub {
		margin: 0;
		color: var(--ink-70);
		line-height: 1.6;
		max-width: 44ch;
	}

	/* ========= MODAL ========= */
	.vm-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
		z-index: 9999;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	.vm {
		width: min(760px, 100%);
		max-height: calc(100dvh - 32px);
		margin-top: clamp(16px, 6vh, 64px);
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.vm__header {
		position: sticky;
		top: 0;
		z-index: 4;
		background: var(--paper);
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: clamp(22px, 3vw, 32px) clamp(22px, 3vw, 32px) 20px;
		border-bottom: 1px solid var(--line);
	}
	.vm__title {
		margin: 12px 0 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: var(--t-h3);
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}
	.vm__close {
		flex: 0 0 auto;
		width: 40px;
		height: 40px;
		border: 1px solid var(--line);
		background: transparent;
		color: var(--ink);
		border-radius: var(--radius);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		transition: border-color var(--dur) var(--ease);
	}
	.vm__close:hover {
		border-color: var(--ink);
	}
	.vm__body {
		padding: clamp(22px, 3vw, 32px);
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	.vm__grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 18px 20px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.field__label {
		font-family: var(--font-sc);
		font-size: 0.72rem;
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
	.field__label em {
		font-style: normal;
		text-transform: none;
		letter-spacing: 0;
	}
	.field input,
	.field select,
	.field textarea {
		font-family: var(--font-body);
		border: 1px solid var(--line);
		background: var(--paper-2);
		color: var(--ink);
		border-radius: var(--radius);
		padding: 12px 14px;
		font-size: 1rem;
		outline: none;
		transition: border-color var(--dur) var(--ease);
	}
	.field input::placeholder,
	.field textarea::placeholder {
		color: var(--ink-35);
	}
	.field input:focus,
	.field select:focus,
	.field textarea:focus {
		border-color: var(--ink);
	}
	.field textarea {
		resize: vertical;
		min-height: 130px;
		line-height: 1.6;
	}
	.span-2 {
		grid-column: span 2;
	}

	.vm__ts {
		display: flex;
		justify-content: flex-start;
		margin: 20px 0 4px;
		min-height: 65px;
	}
	.vm__actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 20px;
		padding-top: 22px;
		border-top: 1px solid var(--line);
	}
	.vm__link {
		border: 0;
		background: transparent;
		color: var(--ink-50);
		font-family: var(--font-body);
		font-size: 0.9rem;
		cursor: pointer;
		padding: 8px 4px;
		transition: color var(--dur) var(--ease);
	}
	.vm__link:hover {
		color: var(--ink);
	}
	.vm__hint {
		margin: 0;
		flex: 1 1 220px;
		text-align: right;
		color: var(--ink-50);
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.vm__hint--error {
		color: var(--accent);
	}

	@media (max-width: 900px) {
		.cols,
		.scope {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.statement {
			grid-template-columns: 1fr;
			gap: 14px;
		}
	}
	@media (max-width: 768px) {
		.phase {
			grid-template-columns: 40px 1fr;
		}
		.vm__grid {
			grid-template-columns: 1fr;
		}
		.span-2 {
			grid-column: auto;
		}
		.vm__hint {
			text-align: left;
		}
	}
</style>
