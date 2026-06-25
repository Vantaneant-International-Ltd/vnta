<script lang="ts">
	import { tick } from 'svelte';
	import { renderTurnstile, resetTurnstile, submitVnta, turnstileConfigured } from '$lib/turnstile';

	const packages = [
		{
			name: 'FOUNDATION',
			price: '€667',
			period: '/month ',
			oneTime: 'or €7,299 one-time',
			features: [
				'Brand strategy, positioning, identity',
				'Team coordination & creative direction',
				'Monthly deliverables & oversight',
				'Complimentary 3-month post-service for new clients'
			]
		},
		{
			name: 'GROWTH',
			price: '€1,083',
			period: '/month ',
			oneTime: 'or €11,999 one-time',
			features: [
				'Everything in FOUNDATION + advanced positioning',
				'Narrative, campaigns, content & marketing alignment',
				'Team motivation & performance oversight',
				'Monthly rhythm & momentum building'
			],
			featured: true
		},
		{
			name: 'SIGNATURE',
			price: '€1,500',
			period: '/month ',
			oneTime: 'or €15,999 one-time',
			features: [
				'Everything in GROWTH + long-term brand/business architecture',
				'Market expansion & flagship initiatives',
				'Full leadership advisory',
				'VNTA as external Brand Director / Vision Steward'
			]
		}
	];

	const retainers = [
		{
			name: 'Continuity',
			price: '€750/m',
			description: 'Monthly strategic call, oversight'
		},
		{
			name: 'Oversight',
			price: '€1,250/m',
			description: 'Bi-monthly calls, team guidance, priority access'
		},
		{
			name: 'Stewardship',
			price: '€1,750 to €2,000/m',
			description: 'Full vision leadership & brand direction',
			inviteOnly: true
		}
	];

	/* ========= Inquiry modal ========= */

	let tailoredModalOpen = false;
	// Cloudflare Turnstile: token verified server-side by vnta-submit before insert.
	let tsToken = '';
	let tsId: string | null = null;
	let tsEl: HTMLElement;

	let tailored = {
		name: '',
		email: '',
		company: '',
		engagement: 'Audit & Diagnosis',
		timeline: '1 to 2 months',
		budget: 'Not sure',
		notes: ''
	};

	const engagementOptions = [
		'Audit & Diagnosis',
		'Repositioning / Refinement',
		'Go-to-market / Launch',
		'Brand Leadership Advisory',
		'Other'
	];

	const timelineOptions = ['ASAP', '1 to 2 months', '3 to 6 months', '6 to 12 months', 'Not sure'];
	const budgetOptions = ['< €5k', '€5k to €10k', '€10k to €20k', '€20k+', 'Not sure'];

	// Portal action: mounts node into document.body (compatible with older Svelte)
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

		// prevent layout shift when scrollbar disappears (desktop)
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

	async function openTailoredModal() {
		tailoredModalOpen = true;
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
		if (!tailored.name && !tailored.email && !tailored.notes) {
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
				kind: 'tailored',
				name: tailored.name,
				email: tailored.email,
				company: tailored.company,
				engagement: tailored.engagement,
				timeline: tailored.timeline,
				budget: tailored.budget,
				notes: tailored.notes,
				source: '/pricing'
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
		setTimeout(() => closeTailoredModal(), 1400);
	}

	function closeTailoredModal() {
		tailoredModalOpen = false;
		unlockScroll();
	}

	function openTailoredEmail() {
		const to = 'studio@vnta.xyz';
		const subject = encodeURIComponent('Tailored engagement inquiry · VNTA');

		const bodyLines = [
			`Name: ${tailored.name || '-'}`,
			`Email: ${tailored.email || '-'}`,
			`Company: ${tailored.company || '-'}`,
			`Engagement type: ${tailored.engagement}`,
			`Timeline: ${tailored.timeline}`,
			`Budget range: ${tailored.budget}`,
			'',
			'Context:',
			tailored.notes || '-'
		];

		const body = encodeURIComponent(bodyLines.join('\n'));
		window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
	}

	function onKeydown(e: KeyboardEvent) {
		if (!tailoredModalOpen) return;
		if (e.key === 'Escape') closeTailoredModal();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<title>Packages · VNTA</title>
	<meta
		name="description"
		content="Baseline engagement structures for brand leadership in residence. Most engagements are tailored."
	/>
	<meta property="og:title" content="Packages · VNTA" />
	<meta
		property="og:description"
		content="Baseline engagement structures for brand leadership in residence. Most engagements are tailored."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<h1 class="title">Packages</h1>

		<p class="subtitle">
			12 months of brand leadership in residence.
			<span class="subtitle-note">
				Most engagements are tailored. The packages below represent baseline structures used to anchor
				scope, cadence, and pricing.
			</span>
		</p>

		<!-- BASELINE TIERS -->
		<div class="packages">
			{#each packages as pkg}
				<div class="package" class:featured={pkg.featured}>
					<div class="package-header">
						<h2>{pkg.name}</h2>

						<div class="pricing-options">
							<div class="price">
								{pkg.price}<span>{pkg.period}</span>
							</div>
							<div class="price-alt">{pkg.oneTime}</div>
						</div>
					</div>

					<ul class="features">
						{#each pkg.features as feature}
							<li>{feature}</li>
						{/each}
					</ul>

					<!-- No package-specific modal -->
				</div>
			{/each}
		</div>

		<!-- Tailored CTA card (single modal only) -->
		<div class="tailored-card" role="region" aria-label="Tailored engagements CTA">
			<div class="tailored-card-left">
				<h2 class="tailored-card-title">Tailored / Custom</h2>
				<p class="tailored-card-copy">
					For audits, repositioning, launches, or advisory work that doesn’t fit a fixed tier.
				</p>
			</div>

			<div class="tailored-card-right">
				<button class="tailored-card-btn" type="button" onclick={openTailoredModal}>
					Request tailored scope
				</button>
				<p class="tailored-card-hint">High-signal only. Short application.</p>
			</div>
		</div>

		<!-- OPTIONAL RETAINERS -->
		<section class="retainers">
			<h2 class="section-title">Optional Post-Engagement Retainers</h2>
			<p class="section-note">After 12 months, new clients only</p>

			<div class="retainer-grid">
				{#each retainers as retainer}
					<div class="retainer">
						<h3>{retainer.name}</h3>
						<div class="retainer-price">{retainer.price}</div>
						{#if retainer.inviteOnly}
							<p class="invite">Invite-only</p>
						{/if}
						<p>{retainer.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- TAILORED ENGAGEMENTS -->
		<section class="tailored">
			<h2 class="section-title">Tailored Engagements</h2>

			<p class="tailored-lede">
				Not every business requires full brand leadership in residence. Some engagements focus on a
				specific phase. Refinement, repositioning, or go-to-market execution.
			</p>

			<div class="tailored-steps">
				<div class="tailored-step">
					<h3>Audit & Diagnosis</h3>
					<p>Focused review of brand, narrative, market context, and operating realities.</p>
				</div>

				<div class="tailored-step">
					<h3>Scoped Plan</h3>
					<p>Clear deliverables, timeline, ownership, and specialist partners if required.</p>
				</div>

				<div class="tailored-step">
					<h3>Execution</h3>
					<p>Led by VNTA, often in collaboration with trusted execution partners.</p>
				</div>
			</div>

			<div class="tailored-cta">
				<p>To discuss a tailored engagement:</p>
				<button class="tailored-btn" type="button" onclick={openTailoredModal}>
					Request tailored scope
				</button>
			</div>
		</section>
	</div>
</main>

<!-- MODAL (ported to body, does not affect page layout) -->
{#if tailoredModalOpen}
	<!-- Backdrop click closes. Modal stops propagation so buttons work reliably. -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div use:portal class="vnta-modal-backdrop" onclick={closeTailoredModal}>
		<div
			class="vnta-modal"
			role="dialog"
			aria-modal="true"
			aria-label="Tailored engagement inquiry"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="vnta-modal-header">
				<div class="vnta-modal-title-wrap">
					<h3 class="vnta-modal-title">Tailored Inquiry</h3>
					<p class="vnta-modal-subtitle">Short application. High-signal only.</p>
				</div>

				<button
					class="vnta-modal-close"
					type="button"
					onclick={closeTailoredModal}
					aria-label="Close"
				>
					×
				</button>
			</div>

			<div class="vnta-modal-body">
				<div class="vnta-form-grid">
					<label>
						<span>Name</span>
						<input bind:value={tailored.name} placeholder="Your name" autocomplete="name" />
					</label>

					<label>
						<span>Email</span>
						<input
							bind:value={tailored.email}
							placeholder="you@company.com"
							autocomplete="email"
							inputmode="email"
						/>
					</label>

					<label class="span-2">
						<span>Company / project (optional)</span>
						<input bind:value={tailored.company} placeholder="Company / project" />
					</label>

					<label>
						<span>Engagement</span>
						<select bind:value={tailored.engagement}>
							{#each engagementOptions as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</label>

					<label>
						<span>Timeline</span>
						<select bind:value={tailored.timeline}>
							{#each timelineOptions as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</label>

					<label class="span-2">
						<span>Budget range (optional)</span>
						<select bind:value={tailored.budget}>
							{#each budgetOptions as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</label>

					<label class="span-2">
						<span>Context</span>
						<textarea
							bind:value={tailored.notes}
							rows="6"
							placeholder="Where you are now, what you’re trying to change, constraints, and what success looks like."
						></textarea>
					</label>
				</div>

				<div class="vnta-ts" bind:this={tsEl}></div>

				<div class="vnta-modal-actions">
					<button
						class="vnta-modal-primary"
						type="button"
						onclick={submitInquiry}
						disabled={inquiryState === 'sending' || inquiryState === 'sent'}
					>
						{inquiryState === 'sending'
							? 'Sending…'
							: inquiryState === 'sent'
								? 'Sent ✓'
								: 'Send inquiry'}
					</button>

					<button class="vnta-modal-secondary" type="button" onclick={openTailoredEmail}>
						Email instead
					</button>

					<button class="vnta-modal-secondary" type="button" onclick={closeTailoredModal}>
						Cancel
					</button>

					{#if inquiryState === 'error'}
						<p class="vnta-modal-hint error-hint">{inquiryError}</p>
					{:else}
						<p class="vnta-modal-hint">Sent securely to VNTA. Or email instead, everything prefilled.</p>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.title {
		font-family: var(--font-display);
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1.125rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.65);
		margin: 0 0 4rem;
	}

	.subtitle-note {
		display: block;
		margin-top: 0.75rem;
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.55);
		max-width: 720px;
	}

	/* PACKAGES */
	.packages {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.package {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 28px 24px;
		background: var(--surface);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		flex-direction: column;
	}

	.package.featured {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.package:hover {
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.package-header {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.package h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 1.5rem;
	}

	.pricing-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.price {
		font-size: 2rem;
		font-weight: 700;
	}

	.price span {
		font-size: 1rem;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.6);
	}

	.price-alt {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.features li {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.85);
		padding-left: 1.5rem;
		position: relative;
		line-height: 1.6;
	}

	.features li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: rgba(255, 255, 255, 0.4);
	}

	/* Tailored CTA card */
	.tailored-card {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 22px 24px;
		background: var(--surface);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 6rem;
	}

	.tailored-card-title {
		font-family: var(--font-display);
		font-size: 1.65rem;
		font-weight: 700;
		margin: 0 0 0.35rem;
		letter-spacing: -0.02em;
	}

	.tailored-card-copy {
		margin: 0;
		color: rgba(255, 255, 255, 0.68);
		line-height: 1.6;
		max-width: 680px;
	}

	.tailored-card-right {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		align-items: flex-start;
	}

	.tailored-card-btn {
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.9);
		border-radius: 999px;
		padding: 0.85rem 1.1rem;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tailored-card-btn:hover {
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.06);
		transform: translateY(-1px);
	}

	.tailored-card-hint {
		margin: 0;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	/* RETAINERS */
	.retainers {
		margin-top: 6rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.section-note {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.6);
		margin: 0 0 3rem;
	}

	.retainer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 2rem;
	}

	.retainer {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 20px 24px;
		background: var(--surface);
		transition: all 0.25s ease;
	}

	.retainer:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.04);
		transform: translateY(-2px);
	}

	.retainer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 10px;
	}

	.retainer-price {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.retainer p {
		font-size: 0.9375rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		line-height: 1.6;
	}

	.invite {
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		margin-top: 10px;
	}

	/* TAILORED */
	.tailored {
		margin-top: 6rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tailored-lede {
		max-width: 720px;
		font-size: 1.0625rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0 0 3rem;
		line-height: 1.7;
	}

	.tailored-steps {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.75rem;
		margin-bottom: 3rem;
	}

	.tailored-step {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 22px 24px;
		background: var(--surface);
	}

	.tailored-step h3 {
		font-size: 1.15rem;
		font-weight: 600;
		margin: 0 0 10px;
	}

	.tailored-step p {
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		line-height: 1.65;
	}

	.tailored-cta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.tailored-cta p {
		margin: 0;
		color: rgba(255, 255, 255, 0.65);
	}

	.tailored-btn {
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.9);
		border-radius: 999px;
		padding: 0.85rem 1.1rem;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tailored-btn:hover {
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.06);
		transform: translateY(-1px);
	}

	/* ========= MODAL (mobile-safe) ========= */

	.vnta-modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.72);

		display: flex;
		align-items: flex-start;
		justify-content: center;

		padding: max(12px, env(safe-area-inset-top)) 12px max(12px, env(safe-area-inset-bottom));
		z-index: 9999;

		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.vnta-modal {
		width: min(860px, 100%);
		max-height: calc(100dvh - 24px);

		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 22px;
		background: rgba(10, 10, 10, 0.86);

		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.vnta-modal-header {
		position: sticky;
		top: 0;
		z-index: 4;
		background: rgba(10, 10, 10, 0.92);

		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding: 20px 22px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.vnta-modal-title {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 700;
		letter-spacing: -0.02em;
	}

	.vnta-modal-subtitle {
		margin: 0.35rem 0 0;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	/* Ensure close button is always clickable */
	.vnta-modal-close {
		position: relative;
		z-index: 5;
		pointer-events: auto;

		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.85);
		border-radius: var(--radius);
		width: 44px;
		height: 44px;
		font-size: 1.6rem;
		line-height: 1;
		cursor: pointer;
		transition: all 0.2s ease;
		flex: 0 0 auto;
	}

	.vnta-modal-close:hover {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.07);
		transform: translateY(-1px);
	}

	.vnta-modal-body {
		padding: 22px 22px 24px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.vnta-form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem 1.25rem;
	}

	.vnta-form-grid label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.vnta-form-grid label span {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
	}

	.vnta-form-grid input,
	.vnta-form-grid select,
	.vnta-form-grid textarea {
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.25);
		color: rgba(255, 255, 255, 0.92);
		border-radius: var(--radius);
		padding: 0.75rem 0.85rem;
		font-size: 0.95rem;
		outline: none;
		transition: border-color 0.2s ease, background 0.2s ease;
		appearance: none;
	}

	.vnta-form-grid input:focus,
	.vnta-form-grid select:focus,
	.vnta-form-grid textarea:focus {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(0, 0, 0, 0.35);
	}

	.vnta-form-grid textarea {
		resize: vertical;
		min-height: 140px;
	}

	.span-2 {
		grid-column: span 2;
	}

	.vnta-ts {
		display: flex;
		justify-content: center;
		margin: 4px 0 2px;
		min-height: 65px;
	}
	.vnta-modal-actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.85rem 0.85rem;
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.vnta-modal-primary {
		border: 1px solid rgba(255, 255, 255, 0.22);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.92);
		border-radius: var(--radius);
		padding: 0.85rem 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.vnta-modal-primary:hover {
		border-color: rgba(255, 255, 255, 0.35);
		transform: translateY(-1px);
	}

	.vnta-modal-secondary {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.75);
		border-radius: var(--radius);
		padding: 0.85rem 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.vnta-modal-secondary:hover {
		border-color: rgba(255, 255, 255, 0.24);
		background: rgba(255, 255, 255, 0.05);
		transform: translateY(-1px);
	}

	.vnta-modal-hint {
		margin: 0;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.error-hint {
		color: rgba(255, 150, 150, 0.9);
	}

	@media (max-width: 768px) {
		.packages {
			grid-template-columns: 1fr;
		}

		.tailored-card {
			align-items: flex-start;
		}

		.vnta-form-grid {
			grid-template-columns: 1fr;
		}

		.span-2 {
			grid-column: auto;
		}

		.vnta-modal-body {
			padding: 18px 18px 20px;
		}

		.vnta-modal-header {
			padding: 18px 18px;
		}
	}
</style>
