<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} — VNTA</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="page-container error">
	<p class="eyebrow">VNTA</p>
	<h1>{$page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p class="lede">
		{$page.error?.message ?? 'The page you’re looking for isn’t here.'}
	</p>
	<a class="btn-primary" href="{base}/">Return home</a>
</main>

<style>
	.error {
		min-height: 52vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-45);
		margin: 0 0 12px;
		font-weight: 700;
	}

	h1 {
		font-family: var(--font-display);
		font-size: clamp(2.2rem, 4vw, 3.2rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 14px;
	}

	.lede {
		margin: 0 0 28px;
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--ink-65);
		max-width: 56ch;
	}
</style>
