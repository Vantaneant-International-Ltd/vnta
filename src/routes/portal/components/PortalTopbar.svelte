<script lang="ts">
	import { base } from '$app/paths';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import type { PortalClient } from '../content/types';

	// client is absent during loading / denied states.
	let { client }: { client?: PortalClient } = $props();

	// Cloudflare Access sign-out. No-op locally; ends the Access session in prod.
	const signOutHref = '/cdn-cgi/access/logout';
</script>

<header class="p-top">
	<a class="p-top__word" href="{base}/" aria-label="VNTA home">
		<Wordmark height={20} />
	</a>

	<div class="p-top__right">
		{#if client}
			<div class="p-top__id">
				<div class="p-top__period">Client Portal / {client.periodLabel}</div>
				<div class="p-top__n">{client.name}</div>
				<span class="p-top__plan">{client.plan}</span>
			</div>
		{/if}
		<a class="p-top__out" href={signOutHref} data-sveltekit-reload>Sign out</a>
	</div>
</header>
