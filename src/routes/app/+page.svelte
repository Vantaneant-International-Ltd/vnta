<script lang="ts">
	// Home: what needs attention, what is coming up, what was recently done.
	import { base } from '$app/paths';
	import PageHead from '$lib/app/PageHead.svelte';
	import Section from '$lib/app/Section.svelte';
	import FindingCard from '$lib/app/FindingCard.svelte';
	import { session } from '$lib/app/session.svelte';
	import { needsAttention, isOpen, fmtDate, todayIso } from '$lib/app/format';

	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';

	const attention = $derived(session.findings.filter(needsAttention));
	const horizon = $derived(new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10));
	const upcoming = $derived(
		session.findings
			.filter((f) => isOpen(f) && f.dateIso && f.dateIso >= todayIso() && f.dateIso <= horizon)
			.sort((a, b) => a.dateIso!.localeCompare(b.dateIso!))
	);
	const done = $derived(session.findings.filter((f) => f.status === 'completed').sort((a, b) => b.updatedAt - a.updatedAt));
	const sub = $derived(
		!session.loaded
			? ''
			: attention.length
				? `${attention.length} ${attention.length === 1 ? 'thing needs' : 'things need'} your attention.`
				: session.documents.length
					? 'Nothing is waiting for you.'
					: "Add a document and VNTA will look for what needs doing."
	);
</script>

<PageHead title={greeting} {sub}>
	<a class="btn btn--solid" href="{base}/app/inbox">Add a document</a>
</PageHead>

{#if !session.loaded}
	<p class="muted" role="status">Loading…</p>
{:else}
	<div class="tiles">
		<a href="{base}/app/actions"><b>{attention.length}</b><span>Needs attention</span></a>
		<a href="{base}/app/timeline"><b>{upcoming.length}</b><span>Coming up</span></a>
		<a href="{base}/app/actions?show=completed"><b>{done.length}</b><span>Handled</span></a>
	</div>

	{#if !session.documents.length}
		<div class="empty">
			<h2>Nothing here yet.</h2>
			<p>
				Add a letter, bill or policy as a PDF or text file. VNTA reads it, marks what may need doing, and shows
				the exact words behind each suggestion. You decide what to do with it.
			</p>
			<a class="btn btn--solid" href="{base}/app/inbox">Add your first document</a>
		</div>
	{:else}
		<Section title="Needs your attention">
			{#each attention.slice(0, 5) as f (f.id)}<FindingCard finding={f} />{:else}<p class="muted">Nothing is waiting for you.</p>{/each}
			{#if attention.length > 5}<a class="more" href="{base}/app/actions">See all {attention.length}</a>{/if}
		</Section>

		<Section title="Coming up" note="next 60 days">
			{#if upcoming.length}
				<ul class="rows">
					{#each upcoming.slice(0, 6) as f (f.id)}
						<li><time>{fmtDate(f.dateIso!)}</time><span>{f.title}</span><a href="{base}/app/inbox?doc={f.documentId}">{f.documentName}</a></li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No dated items in the next 60 days.</p>
			{/if}
		</Section>

		{#if done.length}
			<Section title="Recently completed">
				<ul class="rows">
					{#each done.slice(0, 4) as f (f.id)}
						<li><time>{f.dateIso ? fmtDate(f.dateIso) : ''}</time><span>{f.title}</span><a href="{base}/app/inbox?doc={f.documentId}">{f.documentName}</a></li>
					{/each}
				</ul>
			</Section>
		{/if}
	{/if}
{/if}

<style>
	.tiles {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.tiles a {
		display: grid;
		gap: 2px;
		padding: 16px 18px;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		text-decoration: none;
	}
	.tiles a:hover {
		border-color: var(--ink-40);
	}
	.tiles b {
		font-size: 2rem;
		letter-spacing: -0.04em;
		color: var(--ink);
		font-weight: 600;
		line-height: 1.1;
	}
	.tiles span {
		font-size: 0.85rem;
		color: var(--ink-60);
	}
	.muted {
		color: var(--ink-60);
		margin: 0;
	}
	.empty {
		margin-top: 28px;
		padding: clamp(24px, 5vw, 40px);
		background: var(--paper);
		border: 1px dashed var(--ink-20);
		border-radius: var(--r-card);
		display: grid;
		gap: 12px;
		justify-items: start;
	}
	.empty h2 {
		margin: 0;
		font-size: 1.4rem;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.empty p {
		margin: 0;
		max-width: 34rem;
		color: var(--ink-60);
	}
	.rows {
		list-style: none;
		margin: 0;
		padding: 0;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
	}
	.rows li {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		gap: 2px 12px;
		padding: 12px 16px;
		border-top: 1px solid var(--line-soft);
	}
	.rows li:first-child {
		border-top: 0;
	}
	.rows time {
		color: var(--ink);
		font-weight: 500;
	}
	.rows span {
		color: var(--ink-80);
	}
	.rows a {
		grid-column: 2;
		font-size: 0.82rem;
		color: var(--ink-60);
		overflow-wrap: anywhere;
	}
	.more {
		justify-self: start;
		color: var(--blue);
		text-underline-offset: 3px;
	}
</style>
