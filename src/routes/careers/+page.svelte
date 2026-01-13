<svelte:head>
	<title>Careers — VNTA</title>
	<meta
		name="description"
		content="Open positions at VNTA. Operator-led, outcome-defined engagements."
	/>
</svelte:head>

<script lang="ts">
	type Role = {
		id: string;
		title: string;
		meta: string;
		status?: 'Open' | 'Closed';
		applySubject: string;
		applyLead: string;
		sections: Array<{ heading: string; body?: string; bullets?: string[] }>;
		form: {
			requiresCv?: boolean;
			requiresPortfolio?: boolean;
			ackPay?: boolean; // show pay structure ack checkbox
		};
	};

	const APPLY_ENDPOINT = '/careers/apply';
	const FALLBACK_EMAIL = 'studio@vnta.xyz';

	const roles: Role[] = [
		{
			id: 'operator-in-residence',
			title: 'Operator-in-Residence (Trial)',
			meta: '3-month trial engagement · Independent contractor · Commission-based',
			status: 'Open',
			applySubject: 'VNTA Operator-in-Residence (Trial) — Application',
			applyLead: 'Short note + signal. If you can operate without structure, this will make sense.',
			form: { requiresCv: true, requiresPortfolio: false, ackPay: true },
			sections: [
				{
					heading: 'Overview',
					body:
						'This is a short-term, trial-based engagement for someone who wants real exposure to founder-adjacent work inside VNTA. It is not a job, and it is not a guaranteed path to long-term involvement.'
				},
				{
					heading: 'How this works',
					bullets: [
						'No salary, no hourly pay',
						'Commission- and outcome-aligned incentives',
						'Flexible hours, high autonomy',
						'Structured as an independent contractor engagement'
					]
				},
				{
					heading: 'What this involves',
					bullets: [
						'Supporting VNTA core operations and active houses',
						'Managing email, admin, and operational follow-through',
						'Outreach to potential clients and coordination of sales calls',
						'Running and maintaining content across social channels',
						'Actively contributing in self-selected areas (ops, marketing, product, tech, etc.)'
					]
				},
				{
					heading: 'Who this tends to fit',
					bullets: [
						'People comfortable operating without titles or ladders',
						'Mixed-skill operators (product, tech, marketing, sales, ops)',
						'Those seeking accelerated learning through real responsibility',
						'People who can work inside ambiguity without constant direction'
					]
				}
			]
		},
		{
			id: 'vendr-content',
			title: 'Content Creator-in-Residence (Vendr)',
			meta:
				'6-month contract · Hybrid (on-site + remote) · Per-unit + performance incentives · Optional extension',
			status: 'Open',
			applySubject: 'Vendr Content Creator-in-Residence — Application',
			applyLead:
				'High-signal, brand-setting content. Taste over volume. Capture on-site when it matters; edit/ideate remotely.',
			form: { requiresCv: true, requiresPortfolio: true, ackPay: false },
			sections: [
				{
					heading: 'Overview',
					body:
						'Vendr is launching. We need early, high-signal content to establish brand, tone, and audience quality from day one. This is not a volume posting role.'
				},
				{
					heading: 'What you’ll do',
					bullets: [
						'Owning content creation for @byvendr (main), @vendrselect (B2B), @vendrpass (consumer subscription)',
						'Soft launch: clean 9-grid foundation + early cadence (~one post every ~60 hours), then shift to “post as needed” to preserve exclusivity',
						'Cinematic short-form teasers, micro-films, stills, and brand-setting moments',
						'Meme format allowed sparingly when aligned with tone',
						'Operate solo (or small setup for lighting/editing as needed) with weekly 1:1s'
					]
				},
				{
					heading: 'How this works',
					bullets: [
						'Hybrid: on-site for filming/photography/ops moments; remote for editing/ideation',
						'Compensation: per-unit content rate + performance incentives (views/interactions) + revenue share per project',
						'6-month contract, with up to 12-month extension if aligned'
					]
				},
				{
					heading: 'Signals / tools',
					bullets: [
						'DaVinci Resolve, Flim.ai, Adobe suite (or equivalents)',
						'Cinematography/lighting instincts (short-film/teaser sensibility)',
						'Portfolio strongly preferred'
					]
				},
				{
					heading: 'Who should not apply',
					bullets: [
						'Quantity-over-quality content spammers',
						'People who treat every platform the same',
						'Those who need heavy structure, constant feedback, or day-to-day management'
					]
				}
			]
		}
	];

	let activeRole: Role | null = null;
	let applyOpen = false;
	let shareToast = '';

	// Apply UX state (prevents silent failures + gives fallback)
	let submitState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
	let submitError = '';
	let fallbackCopied = false;

	function openApply(role: Role) {
		activeRole = role;
		applyOpen = true;
		shareToast = '';
		submitState = 'idle';
		submitError = '';
		fallbackCopied = false;

		// lock scroll
		document.documentElement.style.overflow = 'hidden';
	}

	function closeApply() {
		applyOpen = false;
		shareToast = '';
		submitState = 'idle';
		submitError = '';
		fallbackCopied = false;

		// unlock scroll
		document.documentElement.style.overflow = '';

		// small delay so DOM updates before clearing
		setTimeout(() => {
			activeRole = null;
		}, 50);
	}

	function roleUrl(id: string) {
		if (typeof window === 'undefined') return `#${id}`;
		const u = new URL(window.location.href);
		u.hash = id;
		return u.toString();
	}

	async function shareRole(role: Role) {
		const url = roleUrl(role.id);
		const title = `${role.title} — VNTA`;
		const text = `Open position: ${role.title}`;

		try {
			// Native share (mobile, some desktop)
			// @ts-ignore
			if (navigator.share) {
				// @ts-ignore
				await navigator.share({ title, text, url });
				return;
			}

			// Clipboard fallback
			await navigator.clipboard.writeText(url);
			shareToast = 'Link copied.';
			setTimeout(() => (shareToast = ''), 1800);
		} catch {
			shareToast = 'Could not share.';
			setTimeout(() => (shareToast = ''), 1800);
		}
	}

	function mailtoForRole(role: Role) {
		const subject = encodeURIComponent(role.applySubject);
		const body = encodeURIComponent(
			`Hi VNTA,\n\nI'm applying for: ${role.title}\n\nName:\nEmail:\nLocation/Timezone:\nLinks:\n\nWhy this role + why this structure?\n\n(Attach CV/portfolio if relevant.)\n`
		);
		return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
	}

	async function copyFallback(role: Role) {
		try {
			await navigator.clipboard.writeText(`${FALLBACK_EMAIL} — ${role.applySubject}`);
			fallbackCopied = true;
			setTimeout(() => (fallbackCopied = false), 1600);
		} catch {
			// ignore
		}
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!activeRole) return;
		if (submitState === 'submitting') return;

		submitState = 'submitting';
		submitError = '';
		fallbackCopied = false;

		const form = e.currentTarget as HTMLFormElement;
		const data = new FormData(form);

		// Basic honeypot check (should be empty)
		if ((data.get('company_website') as string | null)?.trim()) {
			submitState = 'error';
			submitError = 'Submission blocked.';
			return;
		}

		try {
			const res = await fetch(APPLY_ENDPOINT, {
				method: 'POST',
				body: data
			});

			if (!res.ok) {
				// 405 is common if POST handler is missing/misrouted; show useful fallback
				const hint =
					res.status === 405
						? 'This form endpoint is currently not accepting submissions.'
						: `Submission failed (HTTP ${res.status}).`;
				submitState = 'error';
				submitError = hint;
				return;
			}

			// Accept either JSON or plain response
			submitState = 'success';

			// Reset form for cleanliness
			form.reset();

			// Optional: keep modal open so they see confirmation
			// If you prefer auto-close, uncomment below:
			// setTimeout(() => closeApply(), 900);
		} catch (err) {
			submitState = 'error';
			submitError = 'Network error. Please use the email fallback below.';
		}
	}

	// Open accordion when visiting with #hash (minimized by default otherwise)
	function handleHashOpen() {
		if (typeof window === 'undefined') return;
		const id = window.location.hash?.replace('#', '');
		if (!id) return;
		const role = roles.find((r) => r.id === id);
		if (!role) return;

		const el = document.getElementById(`role-${id}`) as HTMLDetailsElement | null;
		if (el) el.open = true;
	}

	if (typeof window !== 'undefined') {
		queueMicrotask(() => handleHashOpen());
		window.addEventListener('hashchange', handleHashOpen);
	}
</script>

<main class="page-container">
	<div class="content content-width">
		<div class="top">
			<h1 class="title">Careers</h1>
			<p class="lede">
				VNTA works with a small number of operators and specialists when the work requires it.
			</p>
		</div>

		<section class="section">
			<h2 class="section-title">Open positions</h2>

			{#if shareToast}
				<div class="toast" role="status" aria-live="polite">{shareToast}</div>
			{/if}

			<div class="accordion">
				{#each roles as role (role.id)}
					<details class="item" id={`role-${role.id}`}>
						<summary class="summary">
							<div class="summary-left">
								<div class="summary-title">
									<h3>{role.title}</h3>
									<p class="muted meta">{role.meta}</p>
								</div>
							</div>

							<div class="summary-right">
								{#if role.status}
									<span class="pill">{role.status}</span>
								{/if}
								<span class="icon" aria-hidden="true"></span>
							</div>
						</summary>

						<div class="panel">
							<p class="lead">{role.applyLead}</p>

							{#each role.sections as s}
								<h4>{s.heading}</h4>
								{#if s.body}
									<p>{s.body}</p>
								{/if}
								{#if s.bullets}
									<ul>
										{#each s.bullets as b}
											<li>{b}</li>
										{/each}
									</ul>
								{/if}
							{/each}

							<div class="actions">
								<button class="btn" type="button" on:click={() => shareRole(role)}>Share</button>
								<button class="btn primary" type="button" on:click={() => openApply(role)}>Apply</button>
							</div>
						</div>
					</details>
				{/each}
			</div>

			<p class="muted footnote">
				Geography: typically Ireland + EU. Engagements are structured as independent contractor relationships
				and are not employment.
			</p>
		</section>
	</div>

	{#if applyOpen && activeRole}
		<div class="modal-backdrop" role="presentation" on:click|self={closeApply}>
			<div
				class="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="apply-title"
				on:keydown={(e) => e.key === 'Escape' && closeApply()}
			>
				<div class="modal-header">
					<div>
						<p class="muted small">Apply</p>
						<h3 id="apply-title" class="modal-title">{activeRole.title}</h3>
						<p class="muted meta">{activeRole.meta}</p>
					</div>
					<button class="icon-btn" type="button" aria-label="Close" on:click={closeApply}>✕</button>
				</div>

				<form class="form" method="POST" action={APPLY_ENDPOINT} enctype="multipart/form-data" on:submit={onSubmit}>
					<!-- role payload -->
					<input type="hidden" name="role_id" value={activeRole.id} />
					<input type="hidden" name="role_title" value={activeRole.title} />
					<input type="hidden" name="subject" value={activeRole.applySubject} />

					<!-- honeypot -->
					<input
						type="text"
						name="company_website"
						autocomplete="off"
						tabindex="-1"
						style="position:absolute; left:-9999px; opacity:0; height:0; width:0;"
					/>

					{#if submitState === 'success'}
						<div class="notice success" role="status" aria-live="polite">
							<strong>Submitted.</strong>
							<span>We’ll review and respond selectively.</span>
						</div>
					{:else if submitState === 'error'}
						<div class="notice error" role="alert">
							<strong>Submission failed.</strong>
							<span>{submitError}</span>
							<span class="muted small">
								Use the fallback below to apply via email.
							</span>
						</div>
					{/if}

					<div class="grid">
						<label>
							Full name *
							<input name="name" required />
						</label>

						<label>
							Email *
							<input type="email" name="email" required />
						</label>

						<label>
							Location / Timezone *
							<input name="location" required placeholder="Dublin (Europe/Dublin)" />
						</label>

						<label>
							Links (portfolio / GitHub / LinkedIn)
							<input name="links" placeholder="https://…" />
						</label>
					</div>

					<label>
						Why this role + why this structure? *
						<textarea name="pitch" required rows="5" placeholder="2–8 sentences. Be specific."></textarea>
					</label>

					<label>
						Where would you contribute most?
						<select name="lane">
							<option value="" selected>Choose…</option>
							<option>Operations / Execution</option>
							<option>Marketing / Content</option>
							<option>Sales / Outreach</option>
							<option>Product</option>
							<option>Engineering / Web Dev</option>
							<option>Design / Creative</option>
							<option>Other</option>
						</select>
					</label>

					{#if activeRole.id === 'vendr-content'}
						<label>
							What’s your strongest lane for Vendr? *
							<select name="vendr_lane" required>
								<option value="" selected>Choose…</option>
								<option>Filming / Cinematic shorts</option>
								<option>Photography / Stills</option>
								<option>Editing / Post</option>
								<option>Hybrid (capture + edit)</option>
							</select>
						</label>

						<label>
							Share 1–3 examples you’re proud of (links) *
							<textarea
								name="vendr_examples"
								required
								rows="3"
								placeholder="Paste links, one per line"
							></textarea>
						</label>
					{/if}

					<div class="acks">
						<label class="check">
							<input type="checkbox" name="ack_contractor" required />
							I understand this is an independent contractor engagement (not employment).
						</label>

						{#if activeRole.form.ackPay}
							<label class="check">
								<input type="checkbox" name="ack_pay" required />
								I understand there is no salary or hourly pay for this role.
							</label>
						{/if}
					</div>

					<div class="uploads">
						{#if activeRole.form.requiresCv}
							<label>
								Upload CV (PDF) *
								<input type="file" name="cv" accept="application/pdf" required />
							</label>
						{/if}

						{#if activeRole.form.requiresPortfolio}
							<label>
								Optional portfolio (PDF)
								<input type="file" name="portfolio" accept="application/pdf" />
							</label>
						{/if}
					</div>

					<div class="form-actions">
						<button class="btn" type="button" on:click={closeApply}>Cancel</button>
						<button class="btn primary" type="submit" disabled={submitState === 'submitting'}>
							{submitState === 'submitting' ? 'Submitting…' : 'Submit application'}
						</button>
					</div>

					<!-- Always-visible fallback (prevents lost applicants if endpoint breaks again) -->
					<div class="fallback">
						<p class="muted small">
							If submission fails, email
							<a href={`mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(activeRole.applySubject)}`}
								>{FALLBACK_EMAIL}</a
							>
							with subject: <span class="mono">{activeRole.applySubject}</span>.
						</p>
						<div class="fallback-actions">
							<a class="btn" href={mailtoForRole(activeRole)}>Open email draft</a>
							<button class="btn" type="button" on:click={() => copyFallback(activeRole)}>
								{fallbackCopied ? 'Copied' : 'Copy email + subject'}
							</button>
						</div>
					</div>

					<p class="muted small">
						We respond selectively and only when there is clear alignment.
					</p>
				</form>
			</div>
		</div>
	{/if}
</main>

<style>
	/* Top */
	.top {
		margin-bottom: 22px;
	}

	.title {
		margin: 0 0 12px;
		font-size: clamp(2.2rem, 3.6vw, 3rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.85);
		max-width: 72ch;
	}

	.section {
		margin-bottom: 36px;
	}

	.section-title {
		margin: 0 0 12px;
		font-size: 1.05rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	p {
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.7;
		max-width: 78ch;
	}

	ul {
		margin: 0;
		padding-left: 18px;
	}

	li {
		margin-bottom: 6px;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.6;
	}

	a {
		color: rgba(255, 255, 255, 0.92);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.muted {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.95rem;
	}

	.meta {
		margin: 6px 0 0;
	}

	.small {
		font-size: 0.9rem;
	}

	.lead {
		margin: 0 0 12px;
		color: rgba(255, 255, 255, 0.82);
	}

	.footnote {
		margin: 14px 0 0;
	}

	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
	}

	/* Toast */
	.toast {
		position: fixed;
		right: 18px;
		bottom: 18px;
		z-index: 50;
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(12px);
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
	}

	/* Accordion */
	.accordion {
		margin-top: 14px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.item {
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		padding: 18px 20px;
		cursor: pointer;
		user-select: none;
	}

	.summary::-webkit-details-marker {
		display: none;
	}

	.summary-left {
		min-width: 0;
	}

	h3 {
		margin: 0;
		font-size: 1.06rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.95);
	}

	h4 {
		margin: 18px 0 8px;
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.summary-right {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	/* + / - icon */
	.icon {
		width: 14px;
		height: 14px;
		position: relative;
		display: inline-block;
		opacity: 0.9;
	}
	.icon::before,
	.icon::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 14px;
		height: 2px;
		background: rgba(255, 255, 255, 0.75);
		transform: translate(-50%, -50%);
		border-radius: 2px;
	}
	.icon::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}
	details[open] .icon::after {
		opacity: 0;
	}

	.panel {
		padding: 0 20px 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.actions {
		margin-top: 18px;
		display: flex;
		gap: 10px;
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 10px 14px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.92);
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
	}
	.btn:hover {
		background: rgba(255, 255, 255, 0.09);
	}
	.btn.primary {
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.18);
	}
	.btn[disabled] {
		opacity: 0.65;
		cursor: not-allowed;
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: rgba(0, 0, 0, 0.55);
		backdrop-filter: blur(8px);
		display: grid;
		place-items: center;
		padding: 18px;
	}

	.modal {
		width: min(860px, 100%);
		max-height: min(84vh, 820px);
		overflow: auto;
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(20, 20, 20, 0.92), rgba(10, 10, 10, 0.88));
		box-shadow: 0 14px 60px rgba(0, 0, 0, 0.6);
	}

	.modal-header {
		padding: 18px 18px 12px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.modal-title {
		margin: 2px 0 0;
		font-size: 1.15rem;
	}

	.icon-btn {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.92);
		border-radius: 12px;
		padding: 8px 10px;
		cursor: pointer;
	}
	.icon-btn:hover {
		background: rgba(255, 255, 255, 0.09);
	}

	.form {
		padding: 16px 18px 18px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.95rem;
	}

	input,
	textarea,
	select {
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.92);
		outline: none;
	}

	textarea {
		resize: vertical;
		min-height: 110px;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	.acks {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 2px;
	}

	.check {
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.check input {
		width: 16px;
		height: 16px;
	}

	.uploads {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	}

	.form-actions {
		display: flex;
		gap: 10px;
		margin-top: 6px;
	}

	.notice {
		padding: 12px 12px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.22);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.notice.success {
		border-color: rgba(255, 255, 255, 0.18);
	}
	.notice.error {
		border-color: rgba(255, 255, 255, 0.18);
	}

	.fallback {
		margin-top: 8px;
		padding: 12px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.18);
	}

	.fallback-actions {
		margin-top: 8px;
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	@media (min-width: 840px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.uploads {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
