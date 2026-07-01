<script lang="ts">
	import type { DeliveryEntry } from '../content/types';

	let { delivery }: { delivery: DeliveryEntry[] } = $props();
</script>

<section class="p-section" aria-labelledby="p-delivery-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-delivery-h">Delivery log</h2>
		<span class="p-shead__meta">Implementations / Features / Optimisations</span>
	</div>

	<ol class="p-timeline">
		{#each delivery as entry}
			<li class="p-entry">
				<span class="p-entry__date">{entry.date}</span>
				<span class="p-entry__cat">{entry.category}</span>
				<div class="p-entry__body">
					<p class="p-entry__title">{entry.title}</p>
					<p class="p-entry__detail">{entry.detail}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>
