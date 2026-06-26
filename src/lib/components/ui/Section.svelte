<script lang="ts">
	// Editorial band. Optional eyebrow + index header (e.g. "Brand Values  01/04")
	// sit above a hairline; content follows. `tone="ink"` flips to the inverted
	// surface for a deliberate full-ink moment. `divided` draws a top hairline.
	import Eyebrow from './Eyebrow.svelte';
	import Rule from './Rule.svelte';

	let {
		label = undefined,
		index = undefined,
		tone = 'paper', // 'paper' | 'ink'
		divided = false,
		children
	} = $props();
</script>

<section class="band" class:divided data-theme={tone === 'ink' ? 'ink' : undefined}>
	<div class="wrap">
		{#if label || index}
			<header class="band__head">
				{#if label}<Eyebrow>{label}</Eyebrow>{/if}
				{#if index}<Eyebrow>{index}</Eyebrow>{/if}
			</header>
			<Rule />
		{/if}
		<div class="band__body">
			{@render children()}
		</div>
	</div>
</section>

<style>
	.band {
		background: var(--paper);
		color: var(--ink);
		padding: var(--section-y) 0;
	}
	.divided {
		border-top: 1px solid var(--line-soft);
	}
	.wrap {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 clamp(24px, 5vw, 48px);
	}
	.band__head {
		display: flex;
		justify-content: space-between;
		gap: var(--s-4);
		margin-bottom: var(--s-4);
	}
	.band__body {
		margin-top: var(--s-12);
	}
</style>
