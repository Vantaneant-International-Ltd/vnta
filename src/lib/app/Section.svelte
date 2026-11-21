<script lang="ts">
	let { title, children, note = '' }: { title: string; note?: string; children: import('svelte').Snippet } = $props();
</script>

<section>
	<h2>{title}{#if note}<small>{note}</small>{/if}</h2>
	<div class="body">{@render children()}</div>
</section>

<style>
	section {
		margin-top: 36px;
	}
	h2 {
		margin: 0 0 12px;
		font-size: 0.78rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		font-weight: 600;
		display: flex;
		gap: 10px;
		align-items: baseline;
	}
	small {
		text-transform: none;
		letter-spacing: 0;
		font-weight: 400;
		font-size: 0.82rem;
	}
	.body {
		display: grid;
		gap: 12px;
	}
</style>
