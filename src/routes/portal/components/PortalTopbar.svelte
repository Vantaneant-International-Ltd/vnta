<script lang="ts">
	import { base } from '$app/paths';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	// Cloudflare Access sign-out. No-op locally; ends the Access session in prod.
	const signOutHref = '/cdn-cgi/access/logout';
</script>

<header class="p-top">
	<a class="p-top__word" href="{base}/" aria-label="VNTA home">
		<Wordmark height={20} />
	</a>
	<a class="p-top__out" href={signOutHref} data-sveltekit-reload>Sign out</a>
</header>
