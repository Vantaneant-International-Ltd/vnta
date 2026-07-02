<script lang="ts">
	import type { PortalBilling, PortalMonitoring, PortalWaitlist } from '../content/types';

	let {
		health,
		monitoring,
		waitlist,
		billing
	}: {
		health: string;
		monitoring?: PortalMonitoring;
		waitlist?: PortalWaitlist;
		billing?: PortalBilling;
	} = $props();

	const uptime = $derived(monitoring?.monitors?.[0]?.uptime);
	const ok = $derived(/oper/i.test(health ?? ''));
</script>

<div class="p-kpis">
	<div class="p-kpi">
		<div class="p-kpi__k">Uptime</div>
		<div class="p-kpi__v" class:ok>{health}</div>
		<div class="p-kpi__sub">buildt.ie{uptime ? ` · ${uptime}, 90 days` : ''}</div>
	</div>

	<div class="p-kpi">
		<div class="p-kpi__k">Launch list</div>
		<div class="p-kpi__v">{waitlist?.total ?? '—'}</div>
		<div class="p-kpi__sub">signups captured pre-launch</div>
	</div>

	{#if billing}
		<div class="p-kpi">
			<div class="p-kpi__k">Managed billing</div>
			<div class="p-kpi__v">{billing.date}</div>
			<div class="p-kpi__sub">{billing.note}</div>
		</div>
	{/if}
</div>
