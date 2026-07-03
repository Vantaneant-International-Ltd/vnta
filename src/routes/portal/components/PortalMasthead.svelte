<script lang="ts">
	import type { PortalClient } from '../content/types';

	let { client }: { client: PortalClient } = $props();
</script>

<header class="p-mast">
	<div class="p-mast__eyebrows">
		<span class="eyebrow">Client Portal</span>
		<span class="eyebrow">{client.periodLabel}</span>
	</div>
	<div class="p-mast__namerow">
		<h1 class="p-mast__title">{client.name}</h1>
		<span class="p-mast__chip">{client.plan}</span>
	</div>
	<p class="p-mast__id">Client since {client.since}</p>
	<p class="p-mast__lede">
		The record of what VNTA ships, audits, and monitors on your site, updated as work lands.
	</p>
</header>
