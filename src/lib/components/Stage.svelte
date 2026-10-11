<script lang="ts">
	// Where a system stands. "In development" is the only one that means
	// something is being built; "Research" is a direction, not a product.
	import type { Stage } from '$lib/content/site';
	let { stage }: { stage: Stage } = $props();
</script>

<span class="stage" class:stage--build={stage === 'In development'} class:stage--research={stage === 'Research'}>
	{stage}
</span>
