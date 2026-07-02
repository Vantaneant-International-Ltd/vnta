<script lang="ts">
	import type { PortalClient } from '../content/types';

	let { client }: { client: PortalClient } = $props();
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
</header>
