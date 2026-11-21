<script lang="ts">
	let { title, sub = '', children }: { title: string; sub?: string; children?: import('svelte').Snippet } = $props();
</script>

<svelte:head><title>{title} | VNTA</title></svelte:head>
<header>
	<div>
		<h1>{title}</h1>
		{#if sub}<p>{sub}</p>{/if}
	</div>
	{@render children?.()}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}
	h1 {
		margin: 0;
		font-size: clamp(1.8rem, 4vw, 2.4rem);
		font-weight: 600;
		letter-spacing: -0.04em;
		color: var(--ink);
	}
	p {
		margin: 6px 0 0;
		color: var(--ink-60);
	}
</style>
