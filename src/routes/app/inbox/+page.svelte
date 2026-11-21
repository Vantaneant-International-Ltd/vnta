<script lang="ts">
	// Inbox: what the person has deliberately added, where each item came from,
	// and what VNTA read from it. Open one to see its text with the sources marked.
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import PageHead from '$lib/app/PageHead.svelte';
	import FindingCard from '$lib/app/FindingCard.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { api, ApiFailure, type Doc, type Finding } from '$lib/app/api';
	import { session } from '$lib/app/session.svelte';
	import { fmtStamp } from '$lib/app/format';

	let busy = $state(false);
	let over = $state(false);
	let notes = $state<{ kind: 'ok' | 'warn' | 'err'; text: string; docId?: string }[]>([]);
	let input = $state<HTMLInputElement>();

	const docId = $derived($page.url.searchParams.get('doc'));

	async function add(files: FileList | File[]) {
		busy = true;
		notes = [];
		for (const file of files) {
			try {
				const r = await api.upload(file);
				if (r.duplicate) {
					notes.push({ kind: 'warn', text: `${file.name} is already in your Inbox as ${r.document.name}. Nothing was added.`, docId: r.document.id });
				} else if (r.document.textState === 'no_text') {
					notes.push({ kind: 'warn', text: `${file.name} was added, but VNTA could not read any text in it. It may be a scan or a photo. VNTA cannot read images yet, so nothing was found.`, docId: r.document.id });
				} else if (r.document.textState === 'nothing_found') {
					notes.push({ kind: 'warn', text: `${file.name} was added. VNTA found no deadline, payment, renewal or request in it. That does not mean there is nothing to do. Read it yourself.`, docId: r.document.id });
				} else {
					const n = r.findingCount;
					notes.push({ kind: 'ok', text: `${file.name} was added. VNTA found ${n} possible ${n === 1 ? 'step' : 'steps'}, all waiting for your review.`, docId: r.document.id });
				}
			} catch (e) {
				notes.push({ kind: 'err', text: `${file.name}: ${e instanceof ApiFailure ? e.message : 'could not be added.'}` });
			}
		}
		await session.refresh();
		busy = false;
		if (input) input.value = '';
	}

	const status = (d: Doc) => {
		const n = session.findings.filter((f) => f.documentId === d.id).length;
		return d.textState === 'no_text' ? 'No readable text' : d.textState === 'nothing_found' ? 'Read: nothing found' : `Read: ${n} ${n === 1 ? 'suggestion' : 'suggestions'}`;
	};
	const size = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(1)} MB`);

	// --- One document ---
	let open = $state<{ document: Doc; text: string; findings: Finding[] } | null>(null);
	let loadError = $state('');
	let confirmDelete = $state(false);
	let active = $state<string | null>(null);

	$effect(() => {
		const id = docId;
		open = null;
		loadError = '';
		confirmDelete = false;
		if (!id) return;
		api.document(id).then(
			(d) => (open = d),
			(e) => (loadError = e instanceof ApiFailure ? e.message : 'Could not open that document.')
		);
	});
	// Keep the open document's suggestions in step with changes made in the cards.
	const live = $derived(open ? session.findings.filter((f) => f.documentId === open!.document.id).sort((a, b) => a.evidence.start - b.evidence.start) : []);
	const segments = $derived.by(() => {
		if (!open) return [];
		const out: { t: string; f?: Finding }[] = [];
		let at = 0;
		for (const f of live) {
			if (f.evidence.start < at) continue;
			if (f.evidence.start > at) out.push({ t: open.text.slice(at, f.evidence.start) });
			out.push({ t: open.text.slice(f.evidence.start, f.evidence.end), f });
			at = f.evidence.end;
		}
		if (at < open.text.length) out.push({ t: open.text.slice(at) });
		return out;
	});

	async function remove() {
		if (!open) return;
		try {
			await api.removeDocument(open.document.id);
			await session.refresh();
			await goto(`${base}/app/inbox`);
		} catch (e) {
			loadError = e instanceof ApiFailure ? e.message : 'Could not delete it.';
		}
	}
</script>

{#if docId}
	<a class="back" href="{base}/app/inbox">← Inbox</a>
	{#if loadError}
		<p class="note note--err" role="alert">{loadError}</p>
	{:else if !open}
		<p class="muted" role="status">Loading…</p>
	{:else}
		<PageHead title={open.document.name} sub="Added {fmtStamp(open.document.createdAt)} · uploaded {open.document.kind === 'pdf' ? 'PDF' : 'text file'} · {size(open.document.size)} · {status(open.document)}" />
		{#if open.document.textState === 'no_text'}
			<p class="note note--warn">VNTA could not read any text in this file. It may be a scan or a photo. VNTA cannot read images yet.</p>
		{:else}
			<div class="doc" aria-label="The document text, with the sentences VNTA used marked">
				{#each segments as s}{#if s.f}<mark class:on={active === s.f.id} id="f-{s.f.id}">{s.t}</mark>{:else}<span>{s.t}</span>{/if}{/each}
			</div>
		{/if}
		<h2>Suggestions from this document</h2>
		<div class="list">
			{#each live as f (f.id)}
				<div onmouseenter={() => (active = f.id)} onfocusin={() => (active = f.id)} role="presentation"><FindingCard finding={f} showDocument={false} /></div>
			{:else}
				<p class="muted">No suggestions. {open.document.textState === 'nothing_found' ? 'Read the document yourself to be sure.' : ''}</p>
			{/each}
		</div>
		<div class="danger">
			{#if confirmDelete}
				<span>Delete this document, its text and its suggestions for good?</span>
				<button class="btn btn--solid" onclick={remove}>Yes, delete it</button>
				<button class="btn btn--ghost" onclick={() => (confirmDelete = false)}>Keep it</button>
			{:else}
				<button class="btn btn--ghost" onclick={() => (confirmDelete = true)}>Delete this document</button>
			{/if}
		</div>
	{/if}
{:else}
	<PageHead title="Inbox" sub="Documents you add. VNTA only ever reads what you put here." />

	<div
		class="drop"
		class:over
		role="group"
		aria-label="Add a document"
		ondragover={(e) => { e.preventDefault(); over = true; }}
		ondragleave={() => (over = false)}
		ondrop={(e) => { e.preventDefault(); over = false; if (e.dataTransfer?.files.length) add(e.dataTransfer.files); }}
	>
		<Icon name="upload" size={22} />
		<p><b>Add a document</b><br /><span>PDF or text file, up to 5 MB. Scans and photos cannot be read yet.</span></p>
		<input bind:this={input} id="file" type="file" accept=".pdf,.txt,application/pdf,text/plain" multiple hidden onchange={(e) => e.currentTarget.files && add(e.currentTarget.files)} />
		<button class="btn btn--solid" disabled={busy} onclick={() => input?.click()}>{busy ? 'Reading…' : 'Choose a file'}</button>
	</div>
	<p class="fine">Your document is stored in your account only. VNTA does not send it to any AI service.</p>

	<div aria-live="polite">
		{#each notes as n}
			<p class="note note--{n.kind}">{n.text}{#if n.docId} <a href="{base}/app/inbox?doc={n.docId}">Open it</a>{/if}</p>
		{/each}
	</div>

	{#if !session.loaded}
		<p class="muted" role="status">Loading…</p>
	{:else if !session.documents.length}
		<p class="muted">Your Inbox is empty.</p>
	{:else}
		<ul class="docs">
			{#each session.documents as d (d.id)}
				<li>
					<a href="{base}/app/inbox?doc={d.id}">
						<span class="ico"><Icon name="doc" size={18} /></span>
						<span class="meta"><b>{d.name}</b><small>Uploaded by you · {fmtStamp(d.createdAt)} · {size(d.size)}</small></span>
						<span class="proc">{status(d)}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	.back {
		display: inline-block;
		margin-bottom: 12px;
		color: var(--blue);
		text-underline-offset: 3px;
	}
	.drop {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		padding: 20px;
		background: var(--paper);
		border: 1px dashed var(--ink-20);
		border-radius: var(--r-card);
		color: var(--ink);
	}
	.drop.over {
		border-color: var(--blue);
		background: var(--blue-soft);
	}
	.drop p {
		margin: 0;
		flex: 1;
		min-width: 14rem;
	}
	.drop span {
		color: var(--ink-60);
		font-size: 0.88rem;
	}
	.fine {
		margin: 10px 0 20px;
		font-size: 0.82rem;
		color: var(--ink-60);
	}
	.note {
		margin: 0 0 10px;
		padding-left: 12px;
		border-left: 2px solid var(--ink-20);
		color: var(--ink-80);
		font-size: 0.92rem;
	}
	.note--ok {
		border-color: var(--green);
	}
	.note--warn {
		border-color: var(--amber);
	}
	.note--err {
		border-color: var(--red);
	}
	.note a {
		color: var(--blue);
	}
	.muted {
		color: var(--ink-60);
		margin: 0;
	}
	.docs {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
	}
	.docs li + li {
		border-top: 1px solid var(--line-soft);
	}
	.docs a {
		display: grid;
		grid-template-columns: 36px 1fr auto;
		gap: 12px;
		align-items: center;
		padding: 14px 16px;
		text-decoration: none;
	}
	.docs a:hover {
		background: var(--ground);
	}
	.ico {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--ground-2);
		color: var(--ink-80);
	}
	.meta {
		display: grid;
		min-width: 0;
	}
	.meta b {
		color: var(--ink);
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.meta small {
		color: var(--ink-60);
	}
	.proc {
		font-size: 0.78rem;
		color: var(--ink-80);
		border: 1px solid var(--ink-20);
		border-radius: var(--r-chip);
		padding: 3px 9px;
		white-space: nowrap;
	}
	.doc {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: 18px 20px;
		line-height: 1.7;
		color: var(--ink-80);
		max-height: 26rem;
		overflow: auto;
	}
	mark {
		background: var(--blue-soft);
		border-bottom: 2px solid var(--blue);
		color: var(--ink);
	}
	mark.on {
		background: #e4e0fa;
	}
	h2 {
		margin: 32px 0 12px;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		font-weight: 600;
	}
	.list {
		display: grid;
		gap: 12px;
	}
	.danger {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
		margin-top: 36px;
		color: var(--ink-80);
		font-size: 0.9rem;
	}
</style>
