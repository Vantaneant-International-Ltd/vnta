<script lang="ts">
	import type { IncidentEntry } from '../content/types';

	let { incidents }: { incidents: IncidentEntry[] } = $props();
</script>

<section class="p-section" aria-labelledby="p-inc-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-inc-h">Incidents</h2>
		<span class="p-shead__meta">History</span>
	</div>

	{#if incidents.length}
		<ul class="p-inc">
			{#each incidents as i}
				<li class="p-inc__row">
					<div class="p-inc__top">
						<span class="p-inc__title">{i.title}</span>
						<span class="p-inc__status">{i.status}</span>
					</div>
					<div class="p-inc__meta">
						{#if i.start && i.resolved}
							Open {i.start} to {i.resolved}{#if i.duration} · down {i.duration}{/if}
						{:else}
							{i.date}
						{/if}
					</div>
					<p class="p-inc__detail">{i.impact} {i.detail}</p>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="p-note">No incidents recorded.</p>
	{/if}
</section>
