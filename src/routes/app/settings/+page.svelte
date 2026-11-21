<script lang="ts">
	// Settings: the account, and the person's control over their data.
	// Only things that really work are shown as controls. The rest says plainly that it is not there yet.
	import { goto } from '$app/navigation';
	import PageHead from '$lib/app/PageHead.svelte';
	import Section from '$lib/app/Section.svelte';
	import { api, ApiFailure } from '$lib/app/api';
	import { session } from '$lib/app/session.svelte';

	let saved = $state('');
	let error = $state('');
	let confirming = $state(false);
	let phrase = $state('');
	let busy = $state(false);

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
		<div><b>{session.email}</b><small>You sign in with an emailed code.</small></div>
		<button class="btn btn--ghost" onclick={() => session.signOut()}>Sign out</button>
	</div>
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
