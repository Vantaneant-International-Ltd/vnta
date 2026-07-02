<script lang="ts">
	import type { PerformanceReport } from '../content/types';

	let { performance }: { performance: PerformanceReport } = $props();

	const cells = $derived([
		{ k: 'Performance', v: performance.performance },
		{ k: 'Accessibility', v: performance.accessibility },
		{ k: 'Best practices', v: performance.bestPractices },
		{ k: 'SEO', v: performance.seo }
	]);

	// Lighthouse convention: 90+ good, under 60 poor.
	function tone(v: number | null): string {
		if (v == null) return '';
		if (v >= 90) return 'ok';
		if (v < 60) return 'warn';
		return '';
	}
</script>

<section class="p-section" aria-labelledby="p-perf-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-perf-h">Performance</h2>
		<span class="p-shead__meta">Lighthouse, {performance.profile}</span>
	</div>

	<div class="p-perf">
		{#each cells as c}
			<div class="p-perf__cell">
				<div class="p-perf__k">{c.k}</div>
				<div class="p-perf__v {tone(c.v)}">{c.v ?? '—'}<span class="p-perf__u">/100</span></div>
			</div>
		{/each}
	</div>

	<p class="p-note">
		Google Lighthouse scores, 0 to 100 (higher is better). Measured live via PageSpeed Insights on {performance.date}.
	</p>
</section>
