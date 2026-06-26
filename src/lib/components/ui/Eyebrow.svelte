<script lang="ts">
	// Tracked small-caps label — the connective tissue of the system.
	let { children } = $props();
</script>

<span class="eyebrow">{@render children()}</span>

<style>
	.eyebrow {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
</style>
