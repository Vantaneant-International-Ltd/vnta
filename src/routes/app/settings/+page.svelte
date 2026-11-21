<script lang="ts">
	// Settings: the account, and the person's control over their data.
	// Only things that really work are shown as controls. The rest says plainly that it is not there yet.
	import { goto } from '$app/navigation';
	import PageHead from '$lib/app/PageHead.svelte';
	import Section from '$lib/app/Section.svelte';
	import { onMount } from 'svelte';
	import { api, ApiFailure, type Security } from '$lib/app/api';
	import { addPasskey, passkeysSupported } from '$lib/app/passkey';
	import { session } from '$lib/app/session.svelte';

	let saved = $state('');
	let error = $state('');
	let confirming = $state(false);
	let phrase = $state('');
	let busy = $state(false);

	let sec = $state<Security | null>(null);
	let secBusy = $state(false);
	let secMsg = $state('');
	const supported = passkeysSupported();

	async function loadSecurity() {
		try {
			sec = await api.security();
		} catch {
			sec = null;
		}
	}
	onMount(loadSecurity);

	async function secDo(fn: () => Promise<unknown>, done: string) {
		secBusy = true;
		error = secMsg = '';
		try {
			await fn();
			secMsg = done;
			await loadSecurity();
		} catch (err) {
			error = err instanceof ApiFailure ? err.message : 'That did not work.';
		} finally {
			secBusy = false;
		}
	}
	const when = (t: number) => new Date(t * 1000).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	const eventText: Record<string, string> = {
		signin_code: 'Signed in with an emailed code',
		signin_passkey: 'Signed in with a passkey',
		passkey_added: 'Passkey added',
		passkey_removed: 'Passkey removed',
		session_revoked: 'A device was signed out',
		sessions_revoked: 'Signed out of all other devices'
	};

	const periods = [
		{ v: 30, l: '30 days' },
		{ v: 90, l: '90 days' },
		{ v: 180, l: '180 days' },
		{ v: 365, l: '1 year' },
		{ v: 0, l: 'Until I delete them' }
	];

	async function retention(e: Event) {
		error = saved = '';
		const v = Number((e.currentTarget as HTMLSelectElement).value);
		try {
			session.retentionDays = (await api.setRetention(v)).retentionDays;
			saved = 'Saved.';
			await session.refresh();
		} catch (err) {
			error = err instanceof ApiFailure ? err.message : 'Could not save that.';
		}
	}
	async function destroy() {
		busy = true;
		error = '';
		try {
			await api.deleteAccount();
			session.documents = [];
			session.findings = [];
			session.state = 'out';
			await goto('/app');
		} catch (err) {
			error = err instanceof ApiFailure ? err.message : 'Could not delete the account.';
		} finally {
			busy = false;
		}
	}
</script>

<PageHead title="Settings" sub="Your account and your data." />

<Section title="Account">
	<div class="box row">
		<div><b>{session.email}</b><small>Sign in with a passkey or an emailed code.</small></div>
		<button class="btn btn--ghost" onclick={() => session.signOut()}>Sign out</button>
	</div>
</Section>

<Section title="Security">
	<div class="box">
		<b>Passkeys</b>
		<small>
			A passkey lets you sign in with your fingerprint, face or device PIN. It cannot be guessed, reused on a fake site or
			intercepted in an email. VNTA keeps only the public half; the private half never leaves your device.
		</small>
		{#if sec && sec.passkeys.length}
			<ul class="list">
				{#each sec.passkeys as p (p.id)}
					<li>
						<span><b>{p.name}</b><small>Added {when(p.createdAt)}{p.lastUsedAt ? ` · last used ${when(p.lastUsedAt)}` : ' · not used yet'}</small></span>
						<button class="btn btn--ghost" disabled={secBusy} onclick={() => secDo(() => api.removePasskey(p.id), 'Passkey removed.')}>Remove</button>
					</li>
				{/each}
			</ul>
		{:else if sec}
			<small>You have no passkeys yet. Right now only an emailed code protects your account.</small>
		{/if}
		{#if supported}
			<button class="btn btn--solid" disabled={secBusy} onclick={() => secDo(() => addPasskey('This device'), 'Passkey added.')}>Add a passkey</button>
		{:else}
			<small>This browser cannot make passkeys. Try an up-to-date Safari, Chrome, Edge or Firefox.</small>
		{/if}
		{#if secMsg}<small class="ok" role="status">{secMsg}</small>{/if}
	</div>
	<div class="box">
		<b>Where you are signed in</b>
		{#if sec}
			<ul class="list">
				{#each sec.sessions as s (s.id)}
					<li>
						<span><b>{s.device}{s.current ? ' (this device)' : ''}</b><small>{s.method === 'passkey' ? 'Passkey' : 'Emailed code'} · {when(s.createdAt)}</small></span>
						{#if !s.current}<button class="btn btn--ghost" disabled={secBusy} onclick={() => secDo(() => api.signOutDevice(s.id), 'Device signed out.')}>Sign out</button>{/if}
					</li>
				{/each}
			</ul>
			{#if sec.sessions.length > 1}
				<button class="btn btn--ghost" disabled={secBusy} onclick={() => secDo(api.signOutOthers, 'Signed out everywhere else.')}>Sign out everywhere else</button>
			{/if}
		{/if}
		<small>Don’t recognise a device? Sign it out, then add a passkey.</small>
	</div>
	{#if sec?.events.length}
		<div class="box">
			<b>Recent activity</b>
			<ul class="list plain">
				{#each sec.events as e}
					<li><span>{eventText[e.kind] ?? e.kind}{e.device ? ` · ${e.device}` : ''}</span><small>{when(e.at)}</small></li>
				{/each}
			</ul>
			<small>We keep the last 20 events and never record IP addresses.</small>
		</div>
	{/if}
</Section>

<Section title="Privacy and data">
	<div class="box">
		<label for="ret"><b>Keep my documents for</b></label>
		<select id="ret" value={session.retentionDays} onchange={retention}>
			{#each periods as p}<option value={p.v}>{p.l}</option>{/each}
		</select>
		<small>Older documents, with their text and suggestions, are deleted automatically.{#if saved} <span class="ok" role="status">{saved}</span>{/if}</small>
	</div>
	<div class="box">
		<b>What VNTA holds</b>
		<small>{session.documents.length} {session.documents.length === 1 ? 'document' : 'documents'} and {session.findings.length} {session.findings.length === 1 ? 'suggestion' : 'suggestions'}, in your account only.</small>
	</div>
	<div class="box">
		<b>Data permissions</b>
		<small>
			VNTA reads only the documents you add. It does not send them to any AI service, and it does not read your email or calendar.
			If that ever changes, VNTA will ask you first and show which provider.
		</small>
	</div>
</Section>

<Section title="Export and deletion">
	<div class="box row">
		<div><b>Download everything</b><small>One file with your documents’ text, suggestions and drafts.</small></div>
		<a class="btn btn--ghost" href="/api/app/export" download="vnta-export.json">Download</a>
	</div>
	<div class="box">
		<b>Delete my account</b>
		<small>This permanently deletes your account, every document, every suggestion and every draft. It cannot be undone.</small>
		{#if confirming}
			<label class="confirm">
				<span>Type <code>delete my account</code> to confirm</span>
				<input bind:value={phrase} autocomplete="off" />
			</label>
			<div class="acts">
				<button class="btn btn--solid" disabled={busy || phrase.trim() !== 'delete my account'} onclick={destroy}>{busy ? 'Deleting…' : 'Delete everything'}</button>
				<button class="btn btn--ghost" onclick={() => { confirming = false; phrase = ''; }}>Cancel</button>
			</div>
		{:else}
			<button class="btn btn--ghost danger" onclick={() => (confirming = true)}>Delete my account…</button>
		{/if}
	</div>
</Section>

<Section title="Connections and notifications">
	<div class="box">
		<b>Connections</b>
		<small>None. Email and calendar connections do not exist yet. VNTA will not connect to anything without asking you.</small>
	</div>
	<div class="box">
		<b>Notifications</b>
		<small>VNTA does not send reminders or notifications yet.</small>
	</div>
</Section>

{#if error}<p class="err" role="alert">{error}</p>{/if}

<style>
	.box {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 16px 20px;
		display: grid;
		gap: 6px;
		justify-items: start;
	}
	.list {
		list-style: none;
		margin: 4px 0;
		padding: 0;
		display: grid;
		gap: 10px;
		width: 100%;
	}
	.list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.list li span {
		display: grid;
		gap: 2px;
	}
	.plain li {
		font-size: 0.9rem;
		color: var(--ink-80);
	}
	.row {
		grid-template-columns: 1fr auto;
		align-items: center;
		justify-items: stretch;
	}
	.row > div {
		display: grid;
		gap: 4px;
	}
	b {
		color: var(--ink);
		font-weight: 600;
	}
	small {
		color: var(--ink-60);
		font-size: 0.88rem;
	}
	.ok {
		color: var(--green);
	}
	select,
	input {
		min-height: 44px;
		padding: 0 12px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-ctl);
		background: var(--field);
		color: var(--ink);
		font: inherit;
	}
	.confirm {
		display: grid;
		gap: 6px;
		font-size: 0.88rem;
		color: var(--ink-80);
		margin-top: 8px;
	}
	code {
		background: var(--ground-2);
		padding: 1px 6px;
		border-radius: 6px;
	}
	.acts {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
	.danger {
		color: var(--red);
		border-color: var(--red);
	}
	.err {
		margin-top: 20px;
		border-left: 2px solid var(--red);
		padding-left: 12px;
		color: var(--ink);
	}
	select:focus-visible,
	input:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
</style>
