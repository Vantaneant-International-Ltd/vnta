<script lang="ts">
	// Actions: every suggested step, filtered by where it stands.
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import PageHead from '$lib/app/PageHead.svelte';
	import FindingCard from '$lib/app/FindingCard.svelte';
	import { session } from '$lib/app/session.svelte';
	import { STATUS_LABEL, isOpen } from '$lib/app/format';
	import type { Status } from '$lib/app/api';

	const tabs: { key: string; label: string; test: (s: Status) => boolean }[] = [
		{ key: 'open', label: 'All open', test: (s) => s !== 'completed' && s !== 'dismissed' },
		{ key: 'needs_review', label: STATUS_LABEL.needs_review, test: (s) => s === 'needs_review' },
		{ key: 'ready_for_approval', label: STATUS_LABEL.ready_for_approval, test: (s) => s === 'ready_for_approval' },
		{ key: 'in_progress', label: STATUS_LABEL.in_progress, test: (s) => s === 'in_progress' },
		{ key: 'completed', label: STATUS_LABEL.completed, test: (s) => s === 'completed' },
		{ key: 'unable_to_verify', label: STATUS_LABEL.unable_to_verify, test: (s) => s === 'unable_to_verify' },
		{ key: 'dismissed', label: STATUS_LABEL.dismissed, test: (s) => s === 'dismissed' }
	];
	const show = $derived($page.url.searchParams.get('show') ?? 'open');
	const tab = $derived(tabs.find((t) => t.key === show) ?? tabs[0]);
	const rows = $derived(session.findings.filter((f) => tab.test(f.status)));
	const count = (t: (typeof tabs)[number]) => session.findings.filter((f) => t.test(f.status)).length;
</script>

<PageHead title="Actions" sub="Suggested next steps. Nothing happens until you say so." />

<nav class="tabs" aria-label="Filter by status">
	{#each tabs as t}
		<a href="{base}/app/actions?show={t.key}" aria-current={tab.key === t.key ? 'page' : undefined}>{t.label} <small>{count(t)}</small></a>
	{/each}
</nav>

<div class="list">
	{#if !session.loaded}
		<p class="muted" role="status">Loading…</p>
	{:else}
		{#each rows as f (f.id)}<FindingCard finding={f} />{:else}
			<p class="muted">
				{#if !session.findings.length}No suggestions yet. <a href="{base}/app/inbox">Add a document</a>.{:else}Nothing here.{/if}
			</p>
		{/each}
	{/if}
</div>

<style>
	.tabs {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding-bottom: 6px;
		margin-bottom: 18px;
	}
	.tabs a {
		white-space: nowrap;
		padding: 7px 12px;
		border: 1px solid var(--line);
		border-radius: var(--r-chip);
		background: var(--paper);
		color: var(--ink-80);
		text-decoration: none;
		font-size: 0.85rem;
	}
	.tabs a small {
		color: var(--ink-60);
		margin-left: 4px;
	}
	.tabs a[aria-current='page'] {
		background: var(--navy);
		border-color: var(--navy);
		color: #fff;
	}
	.tabs a[aria-current='page'] small {
		color: #cfcdd6;
	}
	.tabs a:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.list {
		display: grid;
		gap: 12px;
	}
	.muted {
		color: var(--ink-60);
		margin: 0;
	}
	.muted a {
		color: var(--blue);
	}
</style>
