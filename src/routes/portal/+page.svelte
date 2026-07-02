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
	import FilesList from './components/FilesList.svelte';
	import NextUp from './components/NextUp.svelte';

	type State =
		| { phase: 'loading' }
		| { phase: 'denied' }
		| { phase: 'ready'; data: PortalData };

	let state = $state<State>({ phase: 'loading' });

	onMount(async () => {
		// Access is enforced at the edge; here we only pick the one file this
		// authenticated session may see.
		const email = await getAuthenticatedEmail();
		const clientId = resolveClientId(email);
		if (!clientId) {
			state = { phase: 'denied' };
			return;
		}
		const data = await loadClientData(clientId);
		state = data ? { phase: 'ready', data } : { phase: 'denied' };
	});
</script>

<svelte:head>
	<title>Client Portal · VNTA</title>
	<meta name="robots" content="noindex" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="portal-shell">
	<div class="portal-col">
		<PortalTopbar client={state.phase === 'ready' ? state.data.client : undefined} />

		<main class="portal-body">
			{#if state.phase === 'loading'}
				<div class="p-state" aria-live="polite">
					<p class="eyebrow">Client Portal</p>
					<p class="p-state__note">Loading your record.</p>
				</div>
			{:else if state.phase === 'denied'}
				<div class="p-state">
					<p class="eyebrow">Client Portal</p>
					<h1 class="p-state__title">No portal for this account.</h1>
					<p class="p-state__note">
						This sign in is not attached to a managed client record. If you believe this is a
						mistake, contact <a href="mailto:studio@vnta.xyz" style="border-bottom:1px solid var(--line)">studio@vnta.xyz</a>.
					</p>
				</div>
			{:else}
				<PortalMasthead client={state.data.client} summary={state.data.summary} />
				<SummaryBlock summary={state.data.summary} />
				<DeliveryLog delivery={state.data.delivery} />
				<SecurityAudits security={state.data.security} audits={state.data.audits} />
				<Performance performance={state.data.performance} />
				<FilesList files={state.data.files} />
				<NextUp nextUp={state.data.nextUp} />
			{/if}
		</main>

		<PortalFooter />
	</div>
</div>
