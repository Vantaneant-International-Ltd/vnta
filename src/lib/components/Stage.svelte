<script lang="ts">
	// Where a system stands. "In design" is the one being worked on (nothing is
	// built yet); "Research" is a direction, not a product.
	import type { Stage } from '$lib/content/site';
	let { stage }: { stage: Stage } = $props();
</script>

<span class="stage" class:stage--build={stage === 'In design'} class:stage--research={stage === 'Research'}>
	{stage}
</span>
