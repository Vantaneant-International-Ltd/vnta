<script lang="ts">
	// Packages/pricing was consolidated into the single Engagement page.
	// Redirect any old links/bookmarks there.
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	onMount(() => goto(`${base}/explore`, { replaceState: true }));
</script>

<svelte:head>
	<title>Engagement · VNTA</title>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content={`0; url=${base}/explore`} />
</svelte:head>

<main class="page-container">
	<p class="redirect">
		Moved to <a href="{base}/explore">Engagement</a>.
	</p>
</main>

<style>
	.redirect {
		font-size: 1.05rem;
		color: var(--ink-70);
	}
	.redirect a {
		color: var(--ink);
		border-bottom: 1px solid var(--line);
	}
</style>
