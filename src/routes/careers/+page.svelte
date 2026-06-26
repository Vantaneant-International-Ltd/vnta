<svelte:head>
	<title>Careers · VNTA</title>
	<meta
		name="description"
		content="Careers at VNTA. Hiring is quiet and occasional."
	/>
	<meta property="og:title" content="Careers · VNTA" />
	<meta
		property="og:description"
		content="Careers at VNTA. Hiring is quiet and occasional."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { supabase } from '$lib/supabase';
	import { renderTurnstile, resetTurnstile, submitVnta, turnstileConfigured } from '$lib/turnstile';

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

	// Static hosting: no POST endpoints. Use mailto + clipboard fallback.
	const FALLBACK_EMAIL = 'studio@vnta.xyz';

	// Offline fallback. The live list is loaded from Supabase on mount.
	const FALLBACK_ROLES: Role[] = [];

	let roles: Role[] = FALLBACK_ROLES;

	onMount(async () => {
		const { data, error } = await supabase
			.from('vnta_job_postings')
			.select('*')
			.eq('is_published', true)
			.order('sort_order')
			.order('created_at');
		if (!error && data && data.length) {
			roles = data.map((r) => ({
				id: r.slug,
				title: r.title,
				meta: r.meta ?? '',
				status: r.status as Role['status'],
				applySubject: r.apply_subject ?? `${r.title} · Application`,
				applyLead: r.apply_lead ?? '',
				form: {
					requiresCv: r.requires_cv,
					requiresPortfolio: r.requires_portfolio,
					ackPay: r.ack_pay
				},
				sections: Array.isArray(r.sections) ? r.sections : []
			}));
		}
	});

	let activeRole: Role | null = null;
	let applyOpen = false;
	// Cloudflare Turnstile: token verified server-side by vnta-submit before insert.
	let tsToken = '';
	let tsId: string | null = null;
	let tsEl: HTMLElement;
	let shareToast = '';

	// Apply UX state (static-safe)
	let submitState: 'idle' | 'opening' | 'loading' | 'success' | 'error' = 'idle';
	let submitError = '';
	let fallbackCopied = false;

	// Form fields (bind so we can generate a real draft)
	let f_name = '';
	let f_email = '';
	let f_location = '';
	let f_links = '';
	let f_pitch = '';
	let f_lane = '';

	let f_vendr_lane = '';
	let f_vendr_examples = '';
	let f_cv_files: FileList;
	let f_ack_contractor = false;
	let f_ack_pay = false;

	function resetFormState() {
		submitState = 'idle';
		submitError = '';
		fallbackCopied = false;

		f_name = '';
		f_email = '';
		f_location = '';
		f_links = '';
		f_pitch = '';
		f_lane = '';

		f_vendr_lane = '';
		f_vendr_examples = '';
		f_ack_contractor = false;
		f_ack_pay = false;
	}

	async function openApply(role: Role) {
		activeRole = role;
		applyOpen = true;
		shareToast = '';
		resetFormState();
		tsToken = '';

		// lock scroll
		document.documentElement.style.overflow = 'hidden';

		await tick();
		if (turnstileConfigured() && tsEl) {
			tsId = await renderTurnstile(
				tsEl,
				(t) => (tsToken = t),
				() => (tsToken = '')
			);
		}
	}

	function closeApply() {
		applyOpen = false;
		shareToast = '';
		resetFormState();

		// unlock scroll
		document.documentElement.style.overflow = '';

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
		const title = `${role.title} · VNTA`;
		const text = `Open position: ${role.title}`;

		try {
			// @ts-ignore
			if (navigator.share) {
				// @ts-ignore
				await navigator.share({ title, text, url });
				return;
			}
			await navigator.clipboard.writeText(url);
			shareToast = 'Link copied.';
			setTimeout(() => (shareToast = ''), 1800);
		} catch {
			shareToast = 'Could not share.';
			setTimeout(() => (shareToast = ''), 1800);
		}
	}

	function composeMailDraft(role: Role) {
		const subject = encodeURIComponent(role.applySubject);

		const lines: string[] = [
			`Hi VNTA,`,
			``,
			`I'm applying for: ${role.title}`,
			``,
			`Name: ${f_name || ''}`,
			`Email: ${f_email || ''}`,
			`Location/Timezone: ${f_location || ''}`,
			`Links: ${f_links || '-'}`,
			`Lane: ${f_lane || '-'}`,
			``,
			`Why this role + why this structure?`,
			f_pitch || '',
			``
		];

		if (role.id === 'vendr-cinematic-artist') {
			lines.push(
				`Vendr lane: ${f_vendr_lane || '-'}`,
				`Examples (links):`,
				f_vendr_examples || '-',
				``
			);
		}

		lines.push(
			``,
			`Attach your CV (PDF) ${role.form.requiresPortfolio ? 'and portfolio (optional)' : ''} to this email.`
		);

		const body = encodeURIComponent(lines.join('\n'));
		return `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
	}

	function openMailDraft() {
		if (!activeRole) return;

		// honeypot: if filled, treat as blocked
		const hp = document.querySelector<HTMLInputElement>('input[name="company_website"]');
		if (hp?.value?.trim()) {
			submitState = 'error';
			submitError = 'Submission blocked.';
			return;
		}

		// minimal validation (HTML required also handles this)
		if (!f_name || !f_email || !f_location || !f_pitch) {
			submitState = 'error';
			submitError = 'Please complete the required fields.';
			return;
		}
		if (activeRole.id === 'vendr-cinematic-artist' && (!f_vendr_lane || !f_vendr_examples)) {
			submitState = 'error';
			submitError = 'Please complete the Vendr questions.';
			return;
		}

		submitState = 'opening';
		submitError = '';

		try {
			const href = composeMailDraft(activeRole);
			window.location.href = href;
			submitState = 'success';
		} catch {
			submitState = 'error';
			submitError = 'Could not open your email client. Please email us manually using the fallback below.';
		}
	}

	async function submitApplication() {
		if (!activeRole) return;

		const hp = document.querySelector<HTMLInputElement>('input[name="company_website"]');
		if (hp?.value?.trim()) {
			submitState = 'error';
			submitError = 'Submission blocked.';
			return;
		}

		if (!f_name || !f_email || !f_location || !f_pitch) {
			submitState = 'error';
			submitError = 'Please complete the required fields.';
			return;
		}

		if (activeRole.id === 'vendr-cinematic-artist' && (!f_vendr_lane || !f_vendr_examples)) {
			submitState = 'error';
			submitError = 'Please complete the Vendr questions.';
			return;
		}

		if (turnstileConfigured() && !tsToken) {
			submitState = 'error';
			submitError = 'Please complete the verification.';
			return;
		}

		submitState = 'loading';
		submitError = '';

		try {
			// 1) Upload the CV to private Supabase Storage (PDF, ≤5MB enforced by the bucket).
			let cvPath = '';
			let cvFilename = '';
			if (f_cv_files && f_cv_files.length > 0) {
				const file = f_cv_files[0];
				cvFilename = file.name;
				const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
				const path = `${activeRole.id}/${Date.now()}-${safe}`;
				const { error: upErr } = await supabase.storage
					.from('vnta-cvs')
					.upload(path, file, { contentType: 'application/pdf', upsert: false });
				if (upErr) throw upErr;
				cvPath = path;
			}

			// 2) Record the application via the verified edge function. Turnstile is
			// checked server-side there; anon INSERT on vnta_applications is revoked.
			const res = await submitVnta(
				'application',
				{
					posting_slug: activeRole.id,
					role_title: activeRole.title,
					name: f_name,
					email: f_email,
					location: f_location,
					links: f_links,
					lane: f_lane,
					vendr_lane: f_vendr_lane,
					vendr_examples: f_vendr_examples,
					pitch: f_pitch,
					cv_path: cvPath,
					cv_filename: cvFilename,
					ack_contractor: f_ack_contractor,
					ack_pay: f_ack_pay
				},
				tsToken
			);
			if (!res.ok) throw new Error(res.error || 'Could not submit.');

			submitState = 'success';
			submitError = '';
			setTimeout(() => closeApply(), 1500);
		} catch (err) {
			submitState = 'error';
			submitError =
				err instanceof Error ? err.message : 'Could not submit. Please try the email option below.';
			resetTurnstile(tsId);
			tsToken = '';
		}
	}

	async function copyFallback(role: Role | null) {
		if (!role) return;
		try {
			await navigator.clipboard.writeText(`${FALLBACK_EMAIL} · ${role.applySubject}`);
			fallbackCopied = true;
			setTimeout(() => (fallbackCopied = false), 1600);
		} catch {
			// ignore
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
			<p class="lede">VNTA works with a small number of operators and specialists when the work requires it.</p>
		</div>

		<section class="section">
			<h2 class="section-title">Open positions</h2>

			{#if shareToast}
				<div class="toast" role="status" aria-live="polite">{shareToast}</div>
			{/if}

			{#if roles.length === 0}
				<div class="empty">
					<p class="empty-line">No open roles at present.</p>
					<p class="empty-note">
						Hiring here is quiet and occasional. If your work is a genuine fit, write to
						<a class="empty-link" href="mailto:studio@vnta.xyz?subject=Speculative%20introduction">studio@vnta.xyz</a>.
						Tell us what you do. Point us to the work.
					</p>
				</div>
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
								<button class="btn" type="button" onclick={() => shareRole(role)}>Share</button>
								<button class="btn primary" type="button" onclick={() => openApply(role)}>Apply</button>
							</div>
						</div>
					</details>
				{/each}
			</div>

			<p class="muted footnote">
				Geography. Typically Ireland and EU. Engagements are structured as independent contractor relationships
				and are not employment.
			</p>
		</section>
	</div>

	{#if applyOpen && activeRole}
		<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
		<div
			class="modal-backdrop"
			role="presentation"
			onclick={(e) => {
				if (e.target === e.currentTarget) closeApply();
			}}
		>
			<div
				class="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="apply-title"
				tabindex="-1"
				onkeydown={(e) => e.key === 'Escape' && closeApply()}
			>
				<div class="modal-header">
					<div>
						<p class="muted small">Apply</p>
						<h3 id="apply-title" class="modal-title">{activeRole.title}</h3>
						<p class="muted meta">{activeRole.meta}</p>
					</div>
					<button class="icon-btn" type="button" aria-label="Close" onclick={closeApply}>✕</button>
				</div>

				<form
				class="form"
				onsubmit={(e) => {
					e.preventDefault();
					submitApplication();
				}}
			>
					<!-- role payload (for future backend; harmless on static) -->
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

					{#if submitState === 'error'}
						<div class="notice error" role="alert">
							<strong>Couldn’t open your email client.</strong>
							<span>{submitError}</span>
						</div>
					{/if}

					<div class="grid">
						<label>
							Full name *
							<input name="name" required bind:value={f_name} />
						</label>

						<label>
							Email *
							<input type="email" name="email" required bind:value={f_email} />
						</label>

						<label>
							Location / Timezone *
							<input
								name="location"
								required
								placeholder="Dublin (Europe/Dublin)"
								bind:value={f_location}
							/>
						</label>

						<label>
							Links (portfolio / GitHub / LinkedIn)
							<input name="links" placeholder="https://…" bind:value={f_links} />
						</label>
					</div>

					<label>
						Why this role + why this structure? *
						<textarea
							name="pitch"
							required
							rows="5"
							placeholder="2 to 8 sentences. Be specific."
							bind:value={f_pitch}
						></textarea>
					</label>

					<label>
						Where would you contribute most?
						<select name="lane" bind:value={f_lane}>
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

					<label>
						Upload CV (PDF) *
						<input type="file" name="cv" accept=".pdf" required bind:files={f_cv_files} />
					</label>

					{#if activeRole.id === 'vendr-cinematic-artist'}
						<label>
							What’s your strongest lane for Vendr? *
							<select name="vendr_lane" required bind:value={f_vendr_lane}>
								<option value="" selected>Choose…</option>
								<option>Filming / Cinematic shorts</option>
								<option>Photography / Stills</option>
								<option>Editing / Post</option>
								<option>Hybrid (capture + edit)</option>
							</select>
						</label>

						<label>
							Share 1 to 3 examples you’re proud of (links) *
							<textarea
								name="vendr_examples"
								required
								rows="3"
								placeholder="Paste links, one per line"
								bind:value={f_vendr_examples}
							></textarea>
						</label>
					{/if}

					<div class="acks">
						<label class="check">
							<input type="checkbox" name="ack_contractor" required bind:checked={f_ack_contractor} />
							I understand this is an independent contractor engagement (not employment).
						</label>

						{#if activeRole.form.ackPay}
							<label class="check">
								<input type="checkbox" name="ack_pay" required bind:checked={f_ack_pay} />
								I understand this role is commission-based and there is no salary or hourly pay.
							</label>
						{/if}
					</div>

					<div class="uploads-note">
						<p class="muted small">
							Fill out the form and submit. Then reply to the confirmation email with your CV{activeRole.form.requiresPortfolio ? ' and portfolio' : ''} attached.
						</p>
					</div>

					<div class="ts" bind:this={tsEl}></div>

					<div class="form-actions">
						<button class="btn" type="button" onclick={closeApply}>Cancel</button>
					<button class="btn primary" type="submit" disabled={submitState === 'loading'}>
						{submitState === 'loading' ? 'Sending…' : submitState === 'success' ? 'Sent!' : 'Send Enquiry'}
					</button>
				</div>
					<p class="muted small" style="margin-top: 8px;">
						If your email client doesn’t open, email
						<a
							href={`mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(activeRole.applySubject)}`}
							>{FALLBACK_EMAIL}</a
						>
						with subject: <span class="mono">{activeRole.applySubject}</span>.
					</p>

					<button class="btn" type="button" onclick={() => copyFallback(activeRole)}>
						{fallbackCopied ? 'Copied' : 'Copy email + subject'}
					</button>

					<p class="muted small">We respond selectively and only when there is clear alignment.</p>
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
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--ink);
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--ink);
		max-width: 72ch;
	}

	.section {
		margin-bottom: 36px;
	}

	.section-title {
		margin: 0 0 12px;
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	p {
		color: var(--ink);
		line-height: 1.7;
		max-width: 78ch;
	}

	ul {
		margin: 0;
		padding-left: 18px;
	}

	li {
		margin-bottom: 6px;
		color: var(--ink-85);
		line-height: 1.6;
	}

	a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.muted {
		color: var(--ink-70);
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
		color: var(--ink-85);
	}

	.footnote {
		margin: 14px 0 0;
	}

	/* Empty state — quiet "no open roles". */
	.empty {
		border: 1px solid var(--line-soft);
		border-radius: var(--radius);
		background: var(--surface);
		padding: clamp(26px, 4vw, 40px);
		max-width: 60ch;
	}

	.empty-line {
		margin: 0 0 12px;
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--fg);
	}

	.empty-note {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--ink-65);
	}

	.empty-link {
		color: var(--fg);
		border-bottom: 1px solid var(--line);
		transition: border-color 0.2s ease;
	}

	.empty-link:hover {
		border-bottom-color: var(--ink-35);
	}

	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
	}

	/* Toast */
	.toast {
		position: fixed;
		right: 18px;
		bottom: 18px;
		z-index: 50;
		padding: 10px 12px;
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: rgba(0, 0, 0, 0.55);
		color: var(--ink);
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
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--surface);
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
		color: var(--ink);
	}

	h4 {
		margin: 18px 0 8px;
		font-size: 0.9rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-50);
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
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--line-soft);
		color: var(--ink);
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
		background: var(--ink-85);
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
		border-top: 1px solid var(--line-soft);
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
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--line-soft);
		color: var(--ink);
		font-weight: 600;
		cursor: pointer;
		text-decoration: none;
	}
	.btn:hover {
		background: var(--line-soft);
	}
	.btn.primary {
		background: var(--line-soft);
		border-color: var(--line);
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
		display: grid;
		place-items: center;
		padding: 18px;
	}

	.modal {
		width: min(860px, 100%);
		max-height: min(84vh, 820px);
		overflow: auto;
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--paper);
	}

	.modal-header {
		padding: 18px 18px 12px;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
		border-bottom: 1px solid var(--line-soft);
	}

	.modal-title {
		margin: 2px 0 0;
		font-size: 1.15rem;
	}

	.icon-btn {
		border: 1px solid var(--line-soft);
		background: var(--line-soft);
		color: var(--ink);
		border-radius: var(--radius);
		padding: 8px 10px;
		cursor: pointer;
	}
	.icon-btn:hover {
		background: var(--line-soft);
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
		color: var(--ink);
		font-size: 0.95rem;
	}

	input,
	textarea,
	select {
		padding: 12px 14px;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		background: var(--paper-2);
		color: var(--ink);
		font-family: var(--font-body);
		font-size: 1rem;
		outline: none;
		transition: border-color var(--dur, 180ms) ease;
	}

	input:focus,
	textarea:focus,
	select:focus {
		border-color: var(--ink);
	}

	input::placeholder,
	textarea::placeholder {
		color: var(--ink-35);
	}

	textarea {
		resize: vertical;
		min-height: 120px;
		line-height: 1.6;
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

	.ts {

		display: flex;

		justify-content: center;

		margin: 4px 0 2px;

		min-height: 65px;

	}


	.form-actions {
		display: flex;
		gap: 10px;
		margin-top: 6px;
	}

	.notice {
		padding: 12px 12px;
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--paper-2);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.uploads-note {
		margin-top: 2px;
		padding: 10px 12px;
		border-radius: var(--radius);
		border: 1px solid var(--line-soft);
		background: var(--paper-2);
	}

	@media (min-width: 840px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
