<script lang="ts">
	import type { PerformanceEntry } from '../content/types';

	let { performance }: { performance: PerformanceEntry[] } = $props();
</script>

<section class="p-section" aria-labelledby="p-perf-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-perf-h">Performance</h2>
		<span class="p-shead__meta">Latest checks</span>
	</div>

	<ol class="p-rows">
		{#each performance as entry}
			<li class="p-row">
				<span class="p-row__date">{entry.date}</span>
				<span class="p-row__type">{entry.metric ?? ''}</span>
				<span class="p-row__result">
					<strong style="font-weight:600;color:var(--ink)">{entry.title}.</strong>
					{entry.detail}
				</span>
				<span class="p-row__link" aria-hidden="true"></span>
			</li>
		{/each}
	</ol>
</section>
