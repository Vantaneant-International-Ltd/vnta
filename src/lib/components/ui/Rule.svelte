<script lang="ts">
	// Hairline rule — structure, never decoration. Soft variant for sub-divisions.
	let { soft = false } = $props();
</script>

<hr class="rule" class:soft />

<style>
	.rule {
		height: 1px;
		border: 0;
		margin: 0;
		background: var(--line);
	}
	.soft {
		background: var(--line-soft);
	}
</style>
