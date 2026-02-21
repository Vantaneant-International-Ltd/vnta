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

	// Static hosting: no POST endpoints. Use mailto + clipboard fallback.
	const FALLBACK_EMAIL = 'studio@vnta.xyz';

	const roles: Role[] = [
		{
			id: 'sales-executive-trial',
			title: 'Sales Executive (Trial)',
			meta: '14-day trial · Independent contractor · High commission contract',
			status: 'Open',
			applySubject: 'VNTA Sales Executive (Trial) — Application',
			applyLead:
				'Outcome-defined. Pre-launch. Your mandate is to secure first placements and build commercial traction.',
			form: { requiresCv: true, requiresPortfolio: false, ackPay: true },
			sections: [
				{
					heading: 'Overview',
					body:
						'Vendr is pre-launch. There are no live locations yet. This 14-day trial phase evaluates traction fast. Clear alignment converts into a 6 to 12 month high-commission performance contract.'
				},
				{
					heading: 'Structure',
					bullets: [
						'14-day full immersion trial',
						'Company resources provided',
						'Free daily lunch',
						'End-of-trial performance review',
						'6 to 12 month contract offered to top performers'
					]
				},
				{
					heading: 'What you will do',
					bullets: [
						'Secure meetings',
						'Pitch Vendr Stations across B2B and B2I',
						'Acquire clients',
						'Lock commercial locations',
						'Build and manage pipeline',
						'Track conversions and territory signal'
					]
				},
				{
					heading: 'Trial requirement',
					body:
						'Maintain a detailed activity log for the full 14-day period and submit it at completion. We measure traction, not effort.',
					bullets: [
						'Meetings held',
						'Prospects contacted',
						'Sales closed',
						'Locations secured',
						'Partnerships explored',
						'Revenue generated or forecasted',
						'Strategy adjustments'
					]
				},
				{
					heading: 'Compensation (post-trial contract)',
					bullets: [
						'10 to 12.5 percent commission on all sales',
						'1,000 EUR annual performance bonus',
						'Additional percentage on campaigns you contribute to',
						'Performance incentives and company benefits',
						'No fixed retainer at this stage (retainer may be introduced once revenue positive)'
					]
				},
				{
					heading: 'Who this fits',
					bullets: [
						'Self-directed operators',
						'Commercially sharp closers',
						'People who want an early footprint and can execute without hand-holding'
					]
				}
			]
		},
		{
			id: 'vendr-cinematic-artist',
			title: 'Cinematic Artist (Vendr)',
			meta: 'Contract engagement · Hybrid (on-site + remote) · Per-unit + performance incentives · Revenue share',
			status: 'Open',
			applySubject: 'Vendr Cinematic Artist — Application',
			applyLead:
				'Pre-launch teaser mandate. Taste over volume. Cinematic restraint. Build tone before deployment.',
			form: { requiresCv: true, requiresPortfolio: true, ackPay: false },
			sections: [
				{
					heading: 'Overview',
					body:
						'Vendr is pre-launch. There are no live stations yet. Your first mandate is a teaser campaign that defines tone before deployment. This is not a volume posting role.'
				},
				{
					heading: 'What you will do',
					bullets: [
						'Create cinematic video content and high-signal stills',
						'Direct teaser and campaign visuals',
						'Shape spatial mood and installation tone',
						'Establish brand atmosphere across platforms',
						'Operate solo or with a small setup as required'
					]
				},
				{
					heading: 'How this works',
					bullets: [
						'Hybrid: on-site for filming and key moments; remote for editing and ideation',
						'Per-unit compensation plus performance incentives and campaign revenue share',
						'You will build and lead creative direction as we scale'
					]
				},
				{
					heading: 'Compensation',
					bullets: [
						'150 to 200 EUR per cinematic video',
						'30 EUR per still image',
						'250 EUR per on-site filming session including 8 to 10 edited select images',
						'3 to 5 percent revenue share on assigned campaigns',
						'500 EUR bonus for exceptional work shown',
						'5 EUR per 1,000 views capped at 500 EUR per cinematic release'
					]
				},
				{
					heading: 'Signals / tools',
					bullets: [
						'Cinematography and lighting instincts',
						'DaVinci Resolve, Flim.ai, Adobe suite (or equivalents)',
						'Strong portfolio required'
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

	// Apply UX state (static-safe)
	let submitState: 'idle' | 'opening' | 'success' | 'error' = 'idle';
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
	}

	function openApply(role: Role) {
		activeRole = role;
		applyOpen = true;
		shareToast = '';
		resetFormState();

		// lock scroll
		document.documentElement.style.overflow = 'hidden';
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
		const title = `${role.title} — VNTA`;
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
			`—`,
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

		submitState = 'loading';
		submitError = '';

		try {
			let cvBase64 = '';
			let cvFilename = '';
			if (f_cv_files && f_cv_files.length > 0) {
				const file = f_cv_files[0];
				cvBase64 = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve((reader.result as string).split(',')[1]);
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
				cvFilename = file.name;
			}

			const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
				? 'http://localhost:3000/api/contact'
				: 'https://vnta.vercel.app/api/contact';

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: f_name,
					email: f_email,
					role: activeRole.title,
					cvBase64,
					cvFilename
				})
			});

			if (response.ok) {
				submitState = 'success';
				submitError = '';
				setTimeout(() => {
					closeApply();
				}, 1500);
			} else {
				submitState = 'error';
				submitError = 'Failed to submit. Please try the email option below.';
			}
		} catch (err) {
			submitState = 'error';
			submitError = 'Could not submit. Please try the email option below.';
		}
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

				<form class="form" on:submit|preventDefault={submitApplication}>
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
							placeholder="2–8 sentences. Be specific."
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
							Share 1–3 examples you’re proud of (links) *
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
							<input type="checkbox" name="ack_contractor" required />
							I understand this is an independent contractor engagement (not employment).
						</label>

						{#if activeRole.form.ackPay}
							<label class="check">
								<input type="checkbox" name="ack_pay" required />
								I understand this role is commission-based and there is no salary or hourly pay.
							</label>
						{/if}
					</div>

					<div class="uploads-note">
						<p class="muted small">
						Fill out the form and submit. Then reply to the confirmation email with your CV{activeRole.form.requiresPortfolio ? ' and portfolio' : ''} attached.

					<div class="form-actions">
						<button class="btn" type="button" on:click={closeApply}>Cancel</button>
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

					<button class="btn" type="button" on:click={() => copyFallback(activeRole)}>
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

	.uploads-note {
		margin-top: 2px;
		padding: 10px 12px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.16);
	}

	@media (min-width: 840px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
