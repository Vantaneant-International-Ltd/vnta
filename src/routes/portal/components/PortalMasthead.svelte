<script lang="ts">
	import type { PortalClient, PortalSummary } from '../content/types';

	let { client, summary }: { client: PortalClient; summary: PortalSummary } = $props();
</script>

<header class="p-mast">
	<div class="p-mast__eyebrows">
		<span class="eyebrow">Client Portal</span>
		<span class="eyebrow">{client.periodLabel}</span>
	</div>
	<h1 class="p-mast__title">{client.name}</h1>
	<p class="p-mast__id">{client.plan} · Client since {client.since}</p>
	<p class="p-mast__lede">
		The record of what VNTA ships, audits, and monitors on your site, updated as work lands.
	</p>
	<p class="p-health">
		<span class="p-health__dot" aria-hidden="true"></span>
		<span>{summary.siteHealth}</span>
	</p>
</header>
