<script lang="ts">
	import type { PortalSummary } from '../content/types';

	let { summary }: { summary: PortalSummary } = $props();
</script>

<section class="p-section" aria-labelledby="p-summary-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-summary-h">This period</h2>
		<span class="p-shead__meta">Summary</span>
	</div>
	<div class="p-summary">
		<p class="p-summary__headline">{summary.headline}</p>
		<p class="p-note">{summary.note}</p>
	</div>
</section>
