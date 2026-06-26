<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase, isAdmin, logActivity, type JobPosting } from '$lib/supabase';

	type Phase = 'loading' | 'signin' | 'sent' | 'denied' | 'ready';
	type Tab = 'applications' | 'postings' | 'inquiries' | 'settings';

	const APP_STATUSES = ['new', 'reviewing', 'shortlist', 'passed', 'hired'] as const;
	const INQ_STATUSES = ['new', 'reviewing', 'replied', 'closed'] as const;

	let phase = $state<Phase>('loading');
	let tab = $state<Tab>('applications');

	let email = $state('');
	let password = $state('');
	let newPassword = $state('');
	let userEmail = $state('');
	let busy = $state(false);
	let toast = $state('');

	let applications = $state<any[]>([]);
	let postings = $state<any[]>([]);
	let inquiries = $state<any[]>([]);
	let admins = $state<any[]>([]);
	let activity = $state<any[]>([]);

	let appFilter = $state<string>('all');
	let newAdmin = $state('');

	// Posting editor
	let editing = $state<any | null>(null);
	let sectionsText = $state('[]');
	let sectionsError = $state('');

	function flash(m: string) {
		toast = m;
		setTimeout(() => (toast = ''), 2600);
	}

	onMount(() => {
		supabase.auth.onAuthStateChange((_e, session) => {
			if (session) resolve();
		});
		resolve();
	});

	async function resolve() {
		const { data } = await supabase.auth.getSession();
		if (!data.session) {
			phase = 'signin';
			return;
		}
		userEmail = data.session.user.email ?? '';
		const ok = await isAdmin();
		if (!ok) {
			phase = 'denied';
			return;
		}
		await loadAll();
		phase = 'ready';
	}

	async function sendLink(e: Event) {
		e.preventDefault();
		if (!email) return;
		busy = true;
		const { error } = await supabase.auth.signInWithOtp({
			email: email.trim(),
			options: { emailRedirectTo: `${location.origin}/admin` }
		});
		busy = false;
		phase = error ? 'signin' : 'sent';
		if (error) flash(error.message);
	}

	async function signInPassword(e: Event) {
		e.preventDefault();
		if (!email || !password) return;
		busy = true;
		const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
		busy = false;
		password = '';
		if (error) return flash(error.message);
		await resolve();
	}

	async function setAccountPassword() {
		if (newPassword.length < 8) return flash('Use at least 8 characters');
		busy = true;
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		busy = false;
		if (error) return flash(error.message);
		newPassword = '';
		await logActivity('set account password');
		flash('Password set. You can now sign in with email and password');
	}

	async function signOut() {
		await supabase.auth.signOut();
		phase = 'signin';
	}

	async function loadAll() {
		const [ap, po, inq, ad, act] = await Promise.all([
			supabase.from('vnta_applications').select('*').order('created_at', { ascending: false }),
			supabase.from('vnta_job_postings').select('*').order('sort_order').order('created_at'),
			supabase.from('vnta_inquiries').select('*').order('created_at', { ascending: false }),
			supabase.from('vnta_admins').select('*').order('email'),
			supabase
				.from('vnta_activity_log')
				.select('*')
				.order('created_at', { ascending: false })
				.limit(30)
		]);
		applications = ap.data ?? [];
		postings = po.data ?? [];
		inquiries = inq.data ?? [];
		admins = ad.data ?? [];
		activity = act.data ?? [];
	}

	// ---- Applications --------------------------------------------------------
	const visibleApps = $derived(
		appFilter === 'all' ? applications : applications.filter((a) => a.status === appFilter)
	);

	async function setAppStatus(a: any, status: string) {
		const { error } = await supabase
			.from('vnta_applications')
			.update({ status })
			.eq('id', a.id);
		if (error) return flash(error.message);
		a.status = status;
		applications = [...applications];
		await logActivity('application status', `${a.email} → ${status}`);
	}

	async function saveNotes(a: any) {
		const { error } = await supabase
			.from('vnta_applications')
			.update({ notes: a.notes })
			.eq('id', a.id);
		flash(error ? error.message : 'Notes saved');
	}

	async function downloadCv(a: any) {
		if (!a.cv_path) return flash('No CV on file');
		const { data, error } = await supabase.storage
			.from('vnta-cvs')
			.createSignedUrl(a.cv_path, 120);
		if (error || !data) return flash(error?.message ?? 'Could not sign URL');
		window.open(data.signedUrl, '_blank', 'noopener');
	}

	async function deleteApplication(a: any) {
		if (!confirm(`Delete application from ${a.name}? This cannot be undone.`)) return;
		const { error } = await supabase.from('vnta_applications').delete().eq('id', a.id);
		if (error) return flash(error.message);
		if (a.cv_path) await supabase.storage.from('vnta-cvs').remove([a.cv_path]);
		applications = applications.filter((x) => x.id !== a.id);
		await logActivity('deleted application', a.email);
	}

	// ---- Postings ------------------------------------------------------------
	function blankPosting() {
		return {
			id: null,
			slug: '',
			title: '',
			meta: '',
			status: 'Open',
			apply_subject: '',
			apply_lead: '',
			sections: [],
			requires_cv: true,
			requires_portfolio: false,
			ack_pay: false,
			is_published: true,
			sort_order: postings.length
		};
	}

	function startNew() {
		editing = blankPosting();
		sectionsText = '[]';
		sectionsError = '';
	}

	function startEdit(p: any) {
		editing = { ...p };
		sectionsText = JSON.stringify(p.sections ?? [], null, 2);
		sectionsError = '';
	}

	function cancelEdit() {
		editing = null;
		sectionsError = '';
	}

	async function savePosting() {
		if (!editing) return;
		if (!editing.title || !editing.slug) return flash('Title and slug are required');
		let parsedSections: unknown;
		try {
			parsedSections = JSON.parse(sectionsText || '[]');
			if (!Array.isArray(parsedSections)) throw new Error('Sections must be an array');
			sectionsError = '';
		} catch (err) {
			sectionsError = err instanceof Error ? err.message : 'Invalid JSON';
			return;
		}
		busy = true;
		const row = {
			slug: editing.slug.trim(),
			title: editing.title.trim(),
			meta: editing.meta,
			status: editing.status,
			apply_subject: editing.apply_subject,
			apply_lead: editing.apply_lead,
			sections: parsedSections,
			requires_cv: editing.requires_cv,
			requires_portfolio: editing.requires_portfolio,
			ack_pay: editing.ack_pay,
			is_published: editing.is_published,
			sort_order: Number(editing.sort_order) || 0
		};
		const res = editing.id
			? await supabase.from('vnta_job_postings').update(row).eq('id', editing.id)
			: await supabase.from('vnta_job_postings').insert(row);
		busy = false;
		if (res.error) return flash(res.error.message);
		await logActivity(editing.id ? 'updated posting' : 'created posting', row.slug);
		editing = null;
		await loadAll();
		flash('Posting saved');
	}

	async function deletePosting(p: any) {
		if (!confirm(`Delete posting "${p.title}"?`)) return;
		const { error } = await supabase.from('vnta_job_postings').delete().eq('id', p.id);
		if (error) return flash(error.message);
		await logActivity('deleted posting', p.slug);
		postings = postings.filter((x) => x.id !== p.id);
	}

	async function quickToggle(p: any, field: 'is_published' | 'status') {
		const patch =
			field === 'status' ? { status: p.status === 'Open' ? 'Closed' : 'Open' } : { is_published: !p.is_published };
		const { error } = await supabase.from('vnta_job_postings').update(patch).eq('id', p.id);
		if (error) return flash(error.message);
		Object.assign(p, patch);
		postings = [...postings];
	}

	// ---- Inquiries -----------------------------------------------------------
	async function setInquiryStatus(i: any, status: string) {
		const { error } = await supabase.from('vnta_inquiries').update({ status }).eq('id', i.id);
		if (error) return flash(error.message);
		i.status = status;
		inquiries = [...inquiries];
	}

	async function deleteInquiry(i: any) {
		if (!confirm('Delete this inquiry?')) return;
		const { error } = await supabase.from('vnta_inquiries').delete().eq('id', i.id);
		if (error) return flash(error.message);
		inquiries = inquiries.filter((x) => x.id !== i.id);
	}

	// ---- Admins --------------------------------------------------------------
	async function addAdmin() {
		const e = newAdmin.trim().toLowerCase();
		if (!e) return;
		const { error } = await supabase.from('vnta_admins').insert({ email: e });
		if (error) return flash(error.message);
		newAdmin = '';
		await logActivity('added admin', e);
		await loadAll();
	}

	async function removeAdmin(a: any) {
		if (a.email === userEmail) return flash('You cannot remove yourself');
		if (!confirm(`Remove admin ${a.email}?`)) return;
		const { error } = await supabase.from('vnta_admins').delete().eq('email', a.email);
		if (error) return flash(error.message);
		await logActivity('removed admin', a.email);
		admins = admins.filter((x) => x.email !== a.email);
	}

	function fmt(ts: string) {
		try {
			return new Date(ts).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' });
		} catch {
			return ts;
		}
	}
</script>

<svelte:head>
	<title>Admin · VNTA</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if toast}
	<div class="toast" role="status" aria-live="polite">{toast}</div>
{/if}

<main class="wrap">
	{#if phase === 'loading'}
		<p class="centered muted">Loading…</p>
	{:else if phase === 'signin' || phase === 'sent'}
		<div class="auth">
			<p class="eyebrow">VNTA</p>
			<h1 class="auth-title">Operator access</h1>
			{#if phase === 'sent'}
				<p class="muted">Check your inbox for a sign-in link.</p>
				<button class="ghost" type="button" onclick={() => (phase = 'signin')}>Back</button>
			{:else}
				<form class="auth-form" onsubmit={signInPassword}>
					<label>
						<span>Email</span>
						<input type="email" bind:value={email} autocomplete="email" placeholder="you@vnta.xyz" />
					</label>
					<label>
						<span>Password</span>
						<input type="password" bind:value={password} autocomplete="current-password" />
					</label>
					<button class="primary" type="submit" disabled={busy}>Sign in</button>
				</form>
				<button class="ghost" type="button" onclick={sendLink} disabled={busy}>
					Email me a magic link instead
				</button>
			{/if}
		</div>
	{:else if phase === 'denied'}
		<div class="auth">
			<h1 class="auth-title">Not authorised</h1>
			<p class="muted">{userEmail} is signed in but is not a VNTA admin.</p>
			<button class="ghost" type="button" onclick={signOut}>Sign out</button>
		</div>
	{:else}
		<header class="bar">
			<div>
				<p class="eyebrow">VNTA</p>
				<h1 class="bar-title">Operator console</h1>
			</div>
			<div class="bar-right">
				<span class="muted small">{userEmail}</span>
				<button class="ghost" type="button" onclick={signOut}>Sign out</button>
			</div>
		</header>

		<nav class="tabs" aria-label="Admin sections">
			<button class="tab" class:on={tab === 'applications'} onclick={() => (tab = 'applications')}>
				Applications <span class="count">{applications.length}</span>
			</button>
			<button class="tab" class:on={tab === 'postings'} onclick={() => (tab = 'postings')}>
				Postings <span class="count">{postings.length}</span>
			</button>
			<button class="tab" class:on={tab === 'inquiries'} onclick={() => (tab = 'inquiries')}>
				Inquiries <span class="count">{inquiries.length}</span>
			</button>
			<button class="tab" class:on={tab === 'settings'} onclick={() => (tab = 'settings')}>
				Settings
			</button>
		</nav>

		{#if tab === 'applications'}
			<div class="filters">
				<button class="pill" class:on={appFilter === 'all'} onclick={() => (appFilter = 'all')}>
					All
				</button>
				{#each APP_STATUSES as s}
					<button class="pill" class:on={appFilter === s} onclick={() => (appFilter = s)}>{s}</button>
				{/each}
			</div>

			{#if visibleApps.length === 0}
				<p class="muted empty">No applications{appFilter === 'all' ? ' yet' : ` in “${appFilter}”`}.</p>
			{/if}

			<div class="cards">
				{#each visibleApps as a (a.id)}
					<article class="card">
						<div class="card-top">
							<div>
								<h3>{a.name} <span class="muted small">· {a.role_title ?? a.posting_slug}</span></h3>
								<p class="muted small">{a.email}{a.location ? ` · ${a.location}` : ''} · {fmt(a.created_at)}</p>
							</div>
							<select class="status-select" value={a.status} onchange={(e) => setAppStatus(a, (e.currentTarget as HTMLSelectElement).value)}>
								{#each APP_STATUSES as s}
									<option value={s}>{s}</option>
								{/each}
							</select>
						</div>

						{#if a.links}<p class="kv"><b>Links:</b> {a.links}</p>{/if}
						{#if a.lane}<p class="kv"><b>Lane:</b> {a.lane}</p>{/if}
						{#if a.vendr_lane}<p class="kv"><b>Vendr lane:</b> {a.vendr_lane}</p>{/if}
						{#if a.vendr_examples}<p class="kv"><b>Examples:</b> {a.vendr_examples}</p>{/if}
						{#if a.pitch}<p class="kv pitch">{a.pitch}</p>{/if}

						<div class="card-actions">
							<button class="ghost" type="button" onclick={() => downloadCv(a)} disabled={!a.cv_path}>
								{a.cv_path ? `CV: ${a.cv_filename ?? 'download'}` : 'No CV'}
							</button>
							<a class="ghost" href={`mailto:${a.email}`}>Reply</a>
							<button class="ghost danger" type="button" onclick={() => deleteApplication(a)}>Delete</button>
						</div>

						<label class="notes">
							<span>Notes</span>
							<textarea rows="2" bind:value={a.notes} onblur={() => saveNotes(a)}></textarea>
						</label>
					</article>
				{/each}
			</div>
		{:else if tab === 'postings'}
			{#if editing}
				<div class="editor">
					<h2>{editing.id ? 'Edit posting' : 'New posting'}</h2>
					<div class="grid2">
						<label><span>Title</span><input bind:value={editing.title} /></label>
						<label><span>Slug</span><input bind:value={editing.slug} placeholder="role-id" /></label>
						<label class="span2"><span>Meta line</span><input bind:value={editing.meta} /></label>
						<label class="span2"><span>Apply subject</span><input bind:value={editing.apply_subject} /></label>
						<label class="span2"><span>Apply lead</span><input bind:value={editing.apply_lead} /></label>
						<label><span>Status</span>
							<select bind:value={editing.status}><option>Open</option><option>Closed</option></select>
						</label>
						<label><span>Sort order</span><input type="number" bind:value={editing.sort_order} /></label>
					</div>
					<div class="flags">
						<label class="chk"><input type="checkbox" bind:checked={editing.is_published} /> Published</label>
						<label class="chk"><input type="checkbox" bind:checked={editing.requires_cv} /> Requires CV</label>
						<label class="chk"><input type="checkbox" bind:checked={editing.requires_portfolio} /> Requires portfolio</label>
						<label class="chk"><input type="checkbox" bind:checked={editing.ack_pay} /> Commission-only ack</label>
					</div>
					<label class="span2">
						<span>Sections (JSON: array of {'{ heading, body?, bullets? }'})</span>
						<textarea class="code" rows="14" bind:value={sectionsText}></textarea>
					</label>
					{#if sectionsError}<p class="err">{sectionsError}</p>{/if}
					<div class="editor-actions">
						<button class="primary" type="button" onclick={savePosting} disabled={busy}>Save posting</button>
						<button class="ghost" type="button" onclick={cancelEdit}>Cancel</button>
					</div>
				</div>
			{:else}
				<div class="filters">
					<button class="primary small" type="button" onclick={startNew}>+ New posting</button>
				</div>
				<div class="cards">
					{#each postings as p (p.id)}
						<article class="card">
							<div class="card-top">
								<div>
									<h3>{p.title} <span class="muted small">· {p.slug}</span></h3>
									<p class="muted small">{p.meta}</p>
								</div>
								<div class="badges">
									<span class="badge" class:warn={p.status !== 'Open'}>{p.status}</span>
									<span class="badge" class:muted-badge={!p.is_published}>{p.is_published ? 'Live' : 'Hidden'}</span>
								</div>
							</div>
							<div class="card-actions">
								<button class="ghost" type="button" onclick={() => startEdit(p)}>Edit</button>
								<button class="ghost" type="button" onclick={() => quickToggle(p, 'status')}>
									Mark {p.status === 'Open' ? 'Closed' : 'Open'}
								</button>
								<button class="ghost" type="button" onclick={() => quickToggle(p, 'is_published')}>
									{p.is_published ? 'Unpublish' : 'Publish'}
								</button>
								<button class="ghost danger" type="button" onclick={() => deletePosting(p)}>Delete</button>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		{:else if tab === 'inquiries'}
			{#if inquiries.length === 0}
				<p class="muted empty">No inquiries yet.</p>
			{/if}
			<div class="cards">
				{#each inquiries as i (i.id)}
					<article class="card">
						<div class="card-top">
							<div>
								<h3>{i.name || 'Anonymous'} <span class="muted small">· {i.kind}</span></h3>
								<p class="muted small">
									{i.email || 'no email'}{i.company ? ` · ${i.company}` : ''} · {fmt(i.created_at)}
								</p>
							</div>
							<select class="status-select" value={i.status} onchange={(e) => setInquiryStatus(i, (e.currentTarget as HTMLSelectElement).value)}>
								{#each INQ_STATUSES as s}
									<option value={s}>{s}</option>
								{/each}
							</select>
						</div>
						{#if i.engagement}<p class="kv"><b>Engagement:</b> {i.engagement}</p>{/if}
						{#if i.timeline}<p class="kv"><b>Timeline:</b> {i.timeline}</p>{/if}
						{#if i.budget}<p class="kv"><b>Budget:</b> {i.budget}</p>{/if}
						{#if i.notes}<p class="kv pitch">{i.notes}</p>{/if}
						<div class="card-actions">
							{#if i.email}<a class="ghost" href={`mailto:${i.email}`}>Reply</a>{/if}
							<button class="ghost danger" type="button" onclick={() => deleteInquiry(i)}>Delete</button>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="settings">
				<section class="panel">
					<h2>Admins</h2>
					<div class="admin-add">
						<input bind:value={newAdmin} placeholder="email@vnta.xyz" />
						<button class="primary small" type="button" onclick={addAdmin}>Add</button>
					</div>
					<ul class="admin-list">
						{#each admins as a (a.email)}
							<li>
								<span>{a.email}{a.email === userEmail ? ' (you)' : ''}</span>
								<button class="ghost danger small" type="button" onclick={() => removeAdmin(a)} disabled={a.email === userEmail}>
									Remove
								</button>
							</li>
						{/each}
					</ul>
				</section>

				<section class="panel">
					<h2>Account password</h2>
					<p class="muted small">Set a password so you can sign in without a magic link.</p>
					<div class="admin-add">
						<input type="password" bind:value={newPassword} placeholder="New password (8+ chars)" />
						<button class="primary small" type="button" onclick={setAccountPassword} disabled={busy}>Set</button>
					</div>
				</section>

				<section class="panel">
					<h2>Recent activity</h2>
					<ul class="activity">
						{#each activity as ev}
							<li><span class="muted small">{fmt(ev.created_at)}</span> · {ev.action}{ev.detail ? `: ${ev.detail}` : ''}</li>
						{/each}
						{#if activity.length === 0}<li class="muted">No activity yet.</li>{/if}
					</ul>
				</section>
			</div>
		{/if}
	{/if}
</main>

<style>
	.wrap {
		max-width: 1000px;
		margin: 0 auto;
		padding: 48px 24px 96px;
	}

	.centered {
		text-align: center;
		padding: 80px 0;
	}

	.eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-45);
		margin: 0 0 6px;
		font-weight: 700;
	}

	.muted {
		color: var(--ink-55);
	}
	.small {
		font-size: 0.86rem;
	}

	/* Auth */
	.auth {
		max-width: 380px;
		margin: 64px auto 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.auth-title {
		font-family: var(--font-display);
		font-size: 2rem;
		margin: 0 0 4px;
		letter-spacing: -0.02em;
	}
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.9rem;
		color: var(--ink-80);
	}
	label > span {
		color: var(--ink-55);
		font-size: 0.82rem;
	}

	input,
	select,
	textarea {
		border: 1px solid var(--line);
		background: var(--line-soft);
		color: var(--ink-92);
		border-radius: var(--radius);
		padding: 10px 12px;
		font: inherit;
		outline: none;
	}
	input:focus,
	select:focus,
	textarea:focus {
		border-color: var(--ink-35);
	}
	textarea {
		resize: vertical;
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.82rem;
	}

	/* Buttons */
	.primary {
		background: var(--fg);
		color: var(--paper);
		border: 1px solid var(--fg);
		border-radius: var(--radius);
		padding: 11px 18px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s ease, background 0.2s ease;
	}
	.primary:hover {
		transform: translateY(-1px);
		background: var(--ink);
	}
	.primary.small {
		padding: 8px 14px;
		font-size: 0.88rem;
	}
	.ghost {
		background: var(--line-soft);
		color: var(--ink-92);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 8px 14px;
		font-weight: 600;
		font-size: 0.88rem;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		transition: background 0.2s ease, border-color 0.2s ease;
	}
	.ghost:hover {
		background: var(--line-soft);
		border-color: var(--line);
	}
	.ghost:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.danger {
		color: rgba(255, 150, 150, 0.9);
	}

	/* Bar + tabs */
	.bar {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}
	.bar-title {
		font-family: var(--font-display);
		font-size: 1.9rem;
		margin: 0;
		letter-spacing: -0.02em;
	}
	.bar-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.tabs {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		border-bottom: 1px solid var(--line-soft);
		padding-bottom: 14px;
		margin-bottom: 22px;
	}
	.tab {
		background: transparent;
		border: 1px solid transparent;
		color: var(--ink-55);
		border-radius: var(--radius);
		padding: 8px 14px;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.tab:hover {
		color: var(--ink-92);
	}
	.tab.on {
		color: var(--paper);
		background: var(--fg);
	}
	.count {
		font-size: 0.74rem;
		padding: 1px 7px;
		border-radius: var(--radius);
		background: var(--line-soft);
		color: inherit;
	}
	.tab.on .count {
		background: rgba(0, 0, 0, 0.12);
	}

	.filters {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 18px;
	}
	.pill {
		background: var(--line-soft);
		border: 1px solid var(--line);
		color: var(--ink-55);
		border-radius: var(--radius);
		padding: 6px 12px;
		font-size: 0.82rem;
		cursor: pointer;
		text-transform: capitalize;
	}
	.pill.on {
		color: var(--paper);
		background: var(--fg);
		border-color: var(--fg);
	}

	.empty {
		padding: 40px 0;
		text-align: center;
	}

	/* Cards */
	.cards {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		padding: 18px 20px;
	}
	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 14px;
	}
	.card h3 {
		margin: 0 0 4px;
		font-size: 1.05rem;
		font-weight: 650;
	}
	.kv {
		margin: 8px 0 0;
		color: var(--ink-80);
		line-height: 1.55;
		font-size: 0.92rem;
	}
	.kv b {
		color: var(--ink-55);
		font-weight: 600;
	}
	.pitch {
		white-space: pre-wrap;
		border-left: 2px solid var(--line);
		padding-left: 12px;
	}
	.card-actions {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 14px;
	}
	.notes {
		margin-top: 12px;
	}
	.status-select {
		text-transform: capitalize;
		flex: 0 0 auto;
	}

	.badges {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.badge {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 4px 9px;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		color: var(--ink-80);
	}
	.badge.warn {
		color: rgba(255, 200, 150, 0.9);
	}
	.badge.muted-badge {
		color: var(--ink-45);
	}

	/* Editor */
	.editor {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		padding: 22px;
	}
	.editor h2,
	.panel h2 {
		font-family: var(--font-display);
		font-size: 1.3rem;
		margin: 0 0 16px;
	}
	.grid2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}
	.span2 {
		grid-column: span 2;
	}
	.flags {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
		margin: 16px 0;
	}
	.chk {
		flex-direction: row;
		align-items: center;
		gap: 8px;
		color: var(--ink-80);
	}
	.chk input {
		width: 16px;
		height: 16px;
	}
	.editor-actions {
		display: flex;
		gap: 10px;
		margin-top: 16px;
	}
	.err {
		color: rgba(255, 150, 150, 0.95);
		font-size: 0.86rem;
		margin: 8px 0 0;
	}

	/* Settings */
	.settings {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.panel {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--surface);
		padding: 20px 22px;
	}
	.admin-add {
		display: flex;
		gap: 10px;
		margin: 10px 0;
	}
	.admin-add input {
		flex: 1;
	}
	.admin-list,
	.activity {
		list-style: none;
		padding: 0;
		margin: 8px 0 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.admin-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		color: var(--ink-80);
	}
	.activity li {
		color: var(--ink-80);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.toast {
		position: fixed;
		right: 18px;
		bottom: 18px;
		z-index: 100;
		padding: 12px 16px;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		background: rgba(0, 0, 0, 0.85);
		color: var(--ink-92);
		font-size: 0.92rem;
	}

	@media (max-width: 640px) {
		.grid2 {
			grid-template-columns: 1fr;
		}
		.span2 {
			grid-column: auto;
		}
		.card-top {
			flex-direction: column;
		}
	}
</style>
