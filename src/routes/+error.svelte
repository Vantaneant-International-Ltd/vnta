<script lang="ts">
	// Nothing lives here. Say so in one line and point back to the home page.
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
			Nothing here. <a href="{base}/">Back to the home page</a>.
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
	/* The status is the only large thing on the page. */
	.err__code {
		font-size: clamp(3rem, 8vw, 4.5rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.04em;
		color: var(--ink);
		margin: 0 0 0.35em;
	}
	.err__line {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--ink-60);
	}
	.err__line a {
		color: var(--blue);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
