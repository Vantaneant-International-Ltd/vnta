<script lang="ts">
	// Timeline: dated items in order. It is not a calendar and does not replace one.
	import { base } from '$app/paths';
	import PageHead from '$lib/app/PageHead.svelte';
	import { session } from '$lib/app/session.svelte';
	import { STATUS_LABEL, fmtDate, fmtMonth, isOpen, todayIso } from '$lib/app/format';
	import type { Finding } from '$lib/app/api';

	const open = $derived(session.findings.filter(isOpen));
	const dated = $derived(open.filter((f) => f.dateIso).sort((a, b) => a.dateIso!.localeCompare(b.dateIso!)));
	const overdue = $derived(dated.filter((f) => f.dateIso! < todayIso()));
	const ahead = $derived(dated.filter((f) => f.dateIso! >= todayIso()));
	const unclear = $derived(open.filter((f) => !f.dateIso));

	const months = $derived.by(() => {
		const out: { label: string; items: Finding[] }[] = [];
		for (const f of ahead) {
			const label = fmtMonth(f.dateIso!);
			const last = out.at(-1);
			if (last?.label === label) last.items.push(f);
			else out.push({ label, items: [f] });
		}
		return out;
	});
</script>

{#snippet row(f: Finding)}
	<li>
		<time>{fmtDate(f.dateIso!)}{#if f.time}<small>{f.time}</small>{/if}</time>
		<div>
			<b>{f.title}</b>
			<span class="state">{STATUS_LABEL[f.status]}</span>
			<a href="{base}/app/inbox?doc={f.documentId}">{f.documentName}</a>
			{#if f.dateSource !== 'you' && f.confidence === 'low'}<em>Check the date: it is not certain.</em>{/if}
		</div>
	</li>
{/snippet}

<PageHead title="Timeline" sub="Deadlines, renewals and appointments, in order." />

{#if !session.loaded}
	<p class="muted" role="status">Loading…</p>
{:else if !session.findings.length}
	<p class="muted">Nothing yet. <a href="{base}/app/inbox">Add a document</a> and its dates will appear here.</p>
{:else}
	{#if overdue.length}
		<h2 class="late">Past their date</h2>
		<ul class="list">{#each overdue as f (f.id)}{@render row(f)}{/each}</ul>
	{/if}
	{#each months as m}
		<h2>{m.label}</h2>
		<ul class="list">{#each m.items as f (f.id)}{@render row(f)}{/each}</ul>
	{:else}
		{#if !overdue.length}<p class="muted">No dated items are open.</p>{/if}
	{/each}
	{#if unclear.length}
		<h2>No certain date</h2>
		<p class="muted">VNTA could not read a date for these. <a href="{base}/app/actions">Set one in Actions</a> once you have checked.</p>
		<ul class="list">
			{#each unclear as f (f.id)}
				<li><time>?</time><div><b>{f.title}</b> <span class="state">{STATUS_LABEL[f.status]}</span> <a href="{base}/app/inbox?doc={f.documentId}">{f.documentName}</a></div></li>
			{/each}
		</ul>
	{/if}
{/if}

<style>
	h2 {
		margin: 32px 0 10px;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		font-weight: 600;
	}
	h2.late {
		color: var(--amber);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
	}
	li {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		gap: 12px;
		padding: 14px 16px;
		border-top: 1px solid var(--line-soft);
	}
	li:first-child {
		border-top: 0;
	}
	time {
		color: var(--ink);
		font-weight: 500;
	}
	time small {
		display: block;
		color: var(--ink-60);
		font-weight: 400;
	}
	li div {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 10px;
		align-items: baseline;
	}
	b {
		color: var(--ink);
		font-weight: 600;
	}
	.state {
		font-size: 0.75rem;
		color: var(--ink-60);
		border: 1px solid var(--ink-20);
		border-radius: var(--r-chip);
		padding: 1px 8px;
	}
	li a {
		font-size: 0.82rem;
		color: var(--ink-60);
		overflow-wrap: anywhere;
	}
	em {
		flex-basis: 100%;
		font-style: normal;
		font-size: 0.82rem;
		color: var(--amber);
	}
	.muted {
		color: var(--ink-60);
		margin: 0 0 12px;
	}
	.muted a {
		color: var(--blue);
	}
</style>
