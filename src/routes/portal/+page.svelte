<script lang="ts">
	import { onMount } from 'svelte';
	import './portal.css';

	import { getAuthenticatedEmail, resolveClientId, loadClientData } from './resolve';
	import type { PortalData } from './content/types';

	import PortalTopbar from './components/PortalTopbar.svelte';
	import PortalFooter from './components/PortalFooter.svelte';
	import PortalMasthead from './components/PortalMasthead.svelte';
	import SummaryBlock from './components/SummaryBlock.svelte';
	import DeliveryLog from './components/DeliveryLog.svelte';
	import SecurityAudits from './components/SecurityAudits.svelte';
	import Performance from './components/Performance.svelte';
	import Monitoring from './components/Monitoring.svelte';
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
			const r = await fetch('/portal/monitoring', { cache: 'no-store' });
			if (r.ok) {
				const live = await r.json();
				if (view.phase !== 'ready') return;
				const data = view.data;
				if (live.siteHealth) data.summary.siteHealth = live.siteHealth;
				if (live.monitors?.length) data.monitoring = { monitors: live.monitors };
				if (live.performance?.length) data.performance = live.performance;
				view = { phase: 'ready', data: { ...data } };
				syncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			}
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
				<PortalMasthead client={view.data.client} />
				{#if view.data.monitoring}
					<Monitoring
						monitoring={view.data.monitoring}
						health={view.data.summary.siteHealth}
						onsync={syncLive}
						{syncing}
						{syncedAt}
					/>
				{/if}
				<SummaryBlock summary={view.data.summary} />
				<DeliveryLog delivery={view.data.delivery} />
				<SecurityAudits security={view.data.security} audits={view.data.audits} />
				<Performance performance={view.data.performance} />
				<FilesList files={view.data.files} />
				<NextUp nextUp={view.data.nextUp} />
			{/if}
		</main>

		<PortalFooter />
	</div>
</div>
