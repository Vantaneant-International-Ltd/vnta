<script lang="ts">
	// Square, hairline-precise CTA. No pill, no shadow, no lift — the underline
	// and a flat tone-shift carry the interaction. Renders <a> when href is set.
	let {
		href = undefined,
		variant = 'solid', // 'solid' | 'ghost'
		type = 'button',
		children,
		...rest
	} = $props();
</script>

{#if href}
	<a class="btn btn--{variant}" {href} {...rest}>{@render children()}</a>
{:else}
	<button class="btn btn--{variant}" {type} {...rest}>{@render children()}</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--s-2);
		padding: 13px 24px;
		border-radius: var(--radius);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: background var(--dur) var(--ease), color var(--dur) var(--ease),
			border-color var(--dur) var(--ease);
	}

	.btn--solid {
		background: var(--ink);
		color: var(--paper);
		border: 1px solid var(--ink);
	}
	.btn--solid:hover {
		background: var(--ink-85);
	}

	.btn--ghost {
		background: transparent;
		color: var(--ink);
		border: 1px solid var(--line);
	}
	.btn--ghost:hover {
		border-color: var(--ink);
	}
</style>
