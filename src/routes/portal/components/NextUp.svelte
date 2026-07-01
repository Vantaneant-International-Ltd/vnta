<script lang="ts">
	import type { NextUpEntry } from '../content/types';

	let { nextUp }: { nextUp: NextUpEntry[] } = $props();
</script>

<section class="p-section" aria-labelledby="p-next-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-next-h">Next up</h2>
		<span class="p-shead__meta">Queued</span>
	</div>

	<ol class="p-next">
		{#each nextUp as item}
			<li class="p-next__row">
				<span class="p-next__title">{item.title}</span>
				<span class="p-next__eta">{item.eta}</span>
			</li>
		{/each}
	</ol>
</section>
