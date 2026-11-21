<script lang="ts">
	// One suggested step. It shows what VNTA found, how sure it is, and the exact
	// words behind it. Only the person moves it on.
	import { base } from '$app/paths';
	import { api, ApiFailure, type Finding, type Draft, type Status } from './api';
	import { session } from './session.svelte';
	import { STATUS_LABEL, CONFIDENCE_LABEL, whenText } from './format';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { finding, showDocument = true }: { finding: Finding; showDocument?: boolean } = $props();

	let busy = $state(false);
	let error = $state('');
	let drafts = $state<Draft[] | null>(null);
	let draftOpen = $state(false);
	let copied = $state(false);
	let dateOpen = $state(false);
	let dateValue = $state('');

	// Once the person has checked the date, the warnings about reading it are out of date.
	const mine = $derived(finding.dateSource === 'you');
	const notes = $derived(mine ? finding.notes.filter((n) => !/date|two-digit year|calendar/i.test(n)) : finding.notes);
	const closed = $derived(finding.status === 'completed' || finding.status === 'dismissed');

	async function run<T>(fn: () => Promise<T>) {
		busy = true;
		error = '';
		try {
			return await fn();
		} catch (e) {
			error = e instanceof ApiFailure ? e.message : 'Something went wrong.';
		} finally {
			busy = false;
		}
	}
	const setStatus = (status: Status) => run(async () => session.patch((await api.update(finding.id, { status })).finding));
	const saveDate = () =>
		run(async () => {
			session.patch((await api.update(finding.id, { dateIso: dateValue || null })).finding);
			dateOpen = false;
		});

	async function toggleDraft() {
		draftOpen = !draftOpen;
		if (draftOpen && drafts === null) await run(async () => (drafts = (await api.drafts(finding.id)).drafts));
	}
	const makeDraft = () =>
		run(async () => {
			const r = await api.makeDraft(finding.id);
			session.patch(r.finding);
			drafts = [r.draft, ...(drafts ?? [])];
			draftOpen = true;
		});
	async function copy(body: string) {
		try {
			await navigator.clipboard.writeText(body);
			copied = true;
			setTimeout(() => (copied = false), 1800);
		} catch {
			error = 'Copying was blocked. Select the text and copy it yourself.';
		}
	}
</script>

<article class="card" class:closed>
	<header>
		<h3>{finding.title}</h3>
		<span class="state state--{finding.status}">{STATUS_LABEL[finding.status]}</span>
	</header>
	<p class="when">{whenText(finding)}{#if finding.amount && !whenText(finding).includes(finding.amount.raw)}<span> · {finding.amount.raw}</span>{/if}</p>

	<p class="src">
		<span class="conf conf--{mine ? 'high' : finding.confidence}">{mine ? 'You checked the date' : CONFIDENCE_LABEL[finding.confidence]}</span>
		{#if showDocument}<a href="{base}/app/inbox?doc={finding.documentId}">{finding.documentName}</a>, line {finding.evidence.line}:{:else}Line {finding.evidence.line}:{/if}
		“{finding.evidence.quote}”
	</p>
	{#each notes as n}<p class="warn">{n}</p>{/each}

	{#if dateOpen}
		<form class="date" onsubmit={(e) => { e.preventDefault(); saveDate(); }}>
			<label>
				<span>The date you have checked</span>
				<input type="date" bind:value={dateValue} />
			</label>
			<button class="chip chip--on" disabled={busy}>Save date</button>
			<button type="button" class="chip" onclick={() => (dateOpen = false)}>Cancel</button>
		</form>
	{/if}

	<div class="acts">
		{#if closed}
			<button class="chip" disabled={busy} onclick={() => setStatus('needs_review')}>Reopen</button>
		{:else}
			{#if finding.status !== 'in_progress'}<button class="chip chip--on" disabled={busy} onclick={() => setStatus('in_progress')}>Approve</button>{/if}
			<button class="chip" disabled={busy} onclick={() => setStatus('completed')}>Mark done</button>
			<button class="chip" disabled={busy} onclick={() => setStatus('dismissed')}>Dismiss</button>
			{#if finding.status !== 'unable_to_verify'}<button class="chip" disabled={busy} onclick={() => setStatus('unable_to_verify')}>Can’t verify</button>{/if}
			<button class="chip" disabled={busy} onclick={() => { dateValue = finding.dateIso ?? ''; dateOpen = !dateOpen; }}>
				{finding.dateIso ? 'Change date' : 'Set the date'}
			</button>
		{/if}
		<button class="chip chip--quiet" aria-expanded={draftOpen} onclick={toggleDraft}><Icon name="mail" size={14} /> Draft a reply</button>
	</div>

	{#if draftOpen}
		<div class="drafts">
			{#if !drafts?.length}
				<p class="muted">No draft yet.</p>
			{/if}
			{#each drafts ?? [] as d (d.id)}
				<div class="draft">
					<div class="dhead"><span class="cap">Draft. Not sent.</span><button class="link" onclick={() => copy(d.body)}>{copied ? 'Copied' : 'Copy'}</button></div>
					<pre>{d.body}</pre>
				</div>
			{/each}
			<button class="chip" disabled={busy} onclick={makeDraft}>{drafts?.length ? 'Make another draft' : 'Make a draft'}</button>
			<small>VNTA never sends this. Read it, fill in the [brackets], and send it yourself.</small>
		</div>
	{/if}

	{#if error}<p class="err" role="alert">{error}</p>{/if}
</article>

<style>
	.card {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 18px 20px;
		display: grid;
		gap: 8px;
	}
	.card.closed {
		opacity: 0.7;
	}
	header {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: baseline;
	}
	h3 {
		margin: 0;
		font-size: 1rem;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.state {
		font-size: 0.75rem;
		color: var(--ink-80);
		border: 1px solid var(--ink-20);
		border-radius: var(--r-chip);
		padding: 2px 9px;
		white-space: nowrap;
	}
	.state--in_progress,
	.state--ready_for_approval {
		color: var(--blue);
		border-color: var(--blue);
	}
	.state--completed {
		color: var(--green);
		border-color: var(--green);
	}
	.state--unable_to_verify {
		color: var(--amber);
		border-color: var(--amber);
	}
	.when {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--ink);
	}
	.src {
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-60);
		overflow-wrap: anywhere;
	}
	.src a {
		color: var(--blue);
		text-underline-offset: 3px;
	}
	.conf {
		font-weight: 600;
		margin-right: 6px;
		color: var(--ink-80);
	}
	.conf--low {
		color: var(--amber);
	}
	.warn {
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-80);
		border-left: 2px solid var(--amber);
		padding-left: 10px;
	}
	.acts,
	.date {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: end;
		margin-top: 4px;
	}
	.date label {
		display: grid;
		gap: 4px;
		font-size: 0.8rem;
		color: var(--ink-60);
	}
	.date input {
		min-height: 36px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-ctl);
		padding: 0 10px;
		background: var(--field);
		color: var(--ink);
		font: inherit;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 36px;
		padding: 0 12px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-pill);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--ink-40);
	}
	.chip:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.chip--on {
		background: var(--navy);
		border-color: var(--navy);
		color: #fff;
	}
	.chip--quiet {
		color: var(--blue);
		border-color: transparent;
	}
	.chip:focus-visible,
	.link:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.drafts {
		display: grid;
		gap: 10px;
		border-top: 1px solid var(--line-soft);
		padding-top: 12px;
		justify-items: start;
	}
	.draft {
		width: 100%;
		display: grid;
		gap: 6px;
	}
	.dhead {
		display: flex;
		justify-content: space-between;
	}
	.cap {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		font-weight: 600;
	}
	.link {
		background: none;
		border: 0;
		font: inherit;
		font-size: 0.85rem;
		color: var(--blue);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	pre {
		margin: 0;
		white-space: pre-wrap;
		font: inherit;
		font-size: 0.9rem;
		background: var(--ground);
		border: 1px dashed var(--ink-20);
		border-radius: var(--r-ctl);
		padding: 12px;
		color: var(--ink-80);
	}
	small,
	.muted {
		color: var(--ink-60);
		font-size: 0.82rem;
		margin: 0;
	}
	.err {
		margin: 0;
		border-left: 2px solid var(--red);
		padding-left: 10px;
		font-size: 0.85rem;
		color: var(--ink);
	}
</style>
