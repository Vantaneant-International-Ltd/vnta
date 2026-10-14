<script lang="ts">
	// Where something stands. Green is for the one thing that is current;
	// blue for what is being built or comes next; hollow grey for what is a
	// direction or a plan, not a product.
	let { stage }: { stage: string } = $props();
	const now = ['Current', 'Early access', 'Works today', 'Supported today', 'Now', 'Supported now'];
	const build = ['In development', 'Next', 'Experimental', 'Limited', 'Limited availability', 'Open'];
</script>

<span class="stage" class:stage--now={now.includes(stage)} class:stage--build={build.includes(stage)} class:stage--research={!now.includes(stage) && !build.includes(stage)}>
	{stage}
</span>
