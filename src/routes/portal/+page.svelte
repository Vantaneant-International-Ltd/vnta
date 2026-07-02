<script lang="ts">
	import { onMount } from 'svelte';
	import './portal.css';

	import { getAuthenticatedEmail, resolveClientId, loadClientData } from './resolve';
	import type { PortalData } from './content/types';

	import PortalTopbar from './components/PortalTopbar.svelte';
	import PortalFooter from './components/PortalFooter.svelte';
	import Kpis from './components/Kpis.svelte';
	import SummaryBlock from './components/SummaryBlock.svelte';
	import DeliveryLog from './components/DeliveryLog.svelte';
	import SecurityAudits from './components/SecurityAudits.svelte';
	import Performance from './components/Performance.svelte';
	import Monitoring from './components/Monitoring.svelte';
	import Incidents from './components/Incidents.svelte';
	import Waitlist from './components/Waitlist.svelte';
	import FilesList from './components/FilesList.svelte';
	import NextUp from './components/NextUp.svelte';

	type State =
		| { phase: 'loading' }
		| { phase: 'denied' }
		| { phase: 'ready'; data: PortalData };

	let view: State = $state({ phase: 'loading' });
	let syncing = $state(false);
	let syncedAt: string | null = $state(null);

	onMount(async () => {
		// Access is enforced at the edge; here we only pick the one file this
		// authenticated session may see.
		const email = await getAuthenticatedEmail();
		const clientId = resolveClientId(email);
		if (!clientId) {
			view = { phase: 'denied' };
			return;
		}
		const data = await loadClientData(clientId);
		if (!data) {
			view = { phase: 'denied' };
			return;
		}
		view = { phase: 'ready', data };
		syncLive();
	});

	// Overlay the committed snapshot with live data from the edge Function.
	async function syncLive() {
		if (view.phase !== 'ready' || syncing) return;
		syncing = true;
		try {
			const [mon, wl] = await Promise.all([
				fetch('/portal/monitoring', { cache: 'no-store' })
					.then((r) => (r.ok ? r.json() : null))
					.catch(() => null),
				fetch('/portal/waitlist', { cache: 'no-store' })
					.then((r) => (r.ok ? r.json() : null))
					.catch(() => null)
			]);
			if (view.phase !== 'ready') return;
			const data = view.data;
			if (mon) {
				if (mon.siteHealth) data.summary.siteHealth = mon.siteHealth;
				if (mon.monitors?.length) data.monitoring = { monitors: mon.monitors };
				if (mon.performance) data.performance = mon.performance;
			}
			if (wl?.signups) data.waitlist = { total: wl.total, signups: wl.signups };
			view = { phase: 'ready', data: { ...data } };
			syncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		} catch (e) {
			// keep the committed snapshot on any failure
		} finally {
			syncing = false;
		}
	}
</script>

<svelte:head>
	<title>Client Portal · VNTA</title>
	<meta name="robots" content="noindex" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="portal-shell">
	<div class="portal-col">
		<PortalTopbar client={view.phase === 'ready' ? view.data.client : undefined} />

		<main class="portal-body">
			{#if view.phase === 'loading'}
				<div class="p-state" aria-live="polite">
					<p class="eyebrow">Client Portal</p>
					<p class="p-state__note">Loading your record.</p>
				</div>
			{:else if view.phase === 'denied'}
				<div class="p-state">
					<p class="eyebrow">Client Portal</p>
					<h1 class="p-state__title">No portal for this account.</h1>
					<p class="p-state__note">
						This sign in is not attached to a managed client record. If you believe this is a
						mistake, contact <a href="mailto:studio@vnta.xyz" style="border-bottom:1px solid var(--line)">studio@vnta.xyz</a>.
					</p>
				</div>
			{:else}
				<SummaryBlock summary={view.data.summary} />
				<Kpis
					health={view.data.summary.siteHealth}
					monitoring={view.data.monitoring}
					waitlist={view.data.waitlist}
					billing={view.data.billing}
				/>
				{#if view.data.monitoring}
					<Monitoring
						monitoring={view.data.monitoring}
						onsync={syncLive}
						{syncing}
						{syncedAt}
					/>
				{/if}
				{#if view.data.incidents?.length}
					<Incidents incidents={view.data.incidents} />
				{/if}
				{#if view.data.waitlist}
					<Waitlist waitlist={view.data.waitlist} />
				{/if}
				<DeliveryLog delivery={view.data.delivery} />
				<SecurityAudits security={view.data.security} audits={view.data.audits} />
				{#if view.data.performance}
					<Performance performance={view.data.performance} />
				{/if}
				<FilesList files={view.data.files} />
				<NextUp nextUp={view.data.nextUp} />
			{/if}
		</main>

		<PortalFooter />
	</div>
</div>
