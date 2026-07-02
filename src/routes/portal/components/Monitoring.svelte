<script lang="ts">
	import type { PortalMonitoring, UptimeMonitor } from '../content/types';

	let {
		monitoring,
		health,
		onsync,
		syncing = false,
		syncedAt = null
	}: {
		monitoring: PortalMonitoring;
		health: string;
		onsync?: () => void;
		syncing?: boolean;
		syncedAt?: string | null;
	} = $props();

	const DAYS = 90;
	// Fixed 90-day strip. Real per-day history when present; otherwise all-operational
	// if we have an uptime figure (no incidents recorded), else pre-launch "no data".
	function strip(m: UptimeMonitor): number[] {
		if (m.days?.length) {
			const out = m.days.slice(-DAYS);
			while (out.length < DAYS) out.unshift(0);
			return out;
		}
		return Array(DAYS).fill(m.uptime ? 1 : 0);
	}
</script>

<section class="p-section" aria-labelledby="p-uptime-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-uptime-h">Uptime</h2>
		<span class="p-shead__meta">
			<span>{syncedAt ? `Synced ${syncedAt}` : 'Last 90 days'}</span>
			{#if onsync}
				<button type="button" class="p-sync" onclick={onsync} disabled={syncing}>
					{syncing ? 'Syncing' : 'Sync'}
				</button>
			{/if}
		</span>
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
					{#each strip(m) as d}
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
