<script lang="ts">
	// Nothing lives here. The old marketing routes resolve to this page, so it
	// says so in one line and points back to the only page there is.
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} · VNTA</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="err">
	<p class="err__code">{$page.status}</p>
	<p class="err__line">
		{#if $page.status === 404}
			Nothing here. There is one page, and <a href="{base}/">it is this way</a>.
		{:else}
			Something went wrong. <a href="{base}/">Back to the page</a>.
		{/if}
	</p>
</main>

<style>
	.err {
		max-width: 34rem;
		margin: 0 auto;
		padding: clamp(64px, 14vh, 140px) clamp(24px, 6vw, 40px);
	}

	/* The status is the only large thing on the page, and it is set in the
	   display face at its single weight. */
	.err__code {
		font-family: var(--font-display);
		font-size: clamp(3rem, 8vw, 4.5rem);
		line-height: 1;
		letter-spacing: var(--track-tight);
		color: var(--ink);
		margin: 0 0 0.35em;
	}

	.err__line {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--ink-85);
	}

	.err__line a {
		color: var(--ink);
		border-bottom: 1px solid var(--ink-35);
		transition: border-color var(--dur) var(--ease);
	}
	.err__line a:hover { border-bottom-color: var(--ink); }
</style>
