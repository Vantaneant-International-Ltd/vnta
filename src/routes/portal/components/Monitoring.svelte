<script lang="ts">
	import type { PortalMonitoring } from '../content/types';

	let { monitoring, health }: { monitoring: PortalMonitoring; health: string } = $props();

	const DAYS = 90;
	// Pad/trim to a fixed 90-day strip; empty = pre-launch (all "no data").
	function strip(days?: number[]): number[] {
		const src = days ?? [];
		const out = src.slice(-DAYS);
		while (out.length < DAYS) out.unshift(0);
		return out;
	}
</script>

<section class="p-section" aria-labelledby="p-uptime-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-uptime-h">Uptime</h2>
		<span class="p-shead__meta">Last 90 days</span>
	</div>

	<div class="p-status">
		<span class="p-status__dot" aria-hidden="true"></span>
		<span class="p-status__label">{health}</span>
		{#if monitoring.label}<span class="p-status__note">{monitoring.label}</span>{/if}
	</div>

	<ul class="p-monitors">
		{#each monitoring.monitors as m}
			<li class="p-monitor">
				<div class="p-monitor__head">
					<span class="p-monitor__name">{m.name}</span>
					<span class="p-monitor__pct">{m.uptime ?? 'Awaiting first cycle'}</span>
				</div>
				<div class="p-strip" role="img" aria-label={`Ninety day uptime for ${m.name}`}>
					{#each strip(m.days) as d}
						<span class="p-bar" data-s={d}></span>
					{/each}
				</div>
				<div class="p-strip__ends">
					<span>90 days ago</span>
					<span>Today</span>
				</div>
			</li>
		{/each}
	</ul>
</section>
