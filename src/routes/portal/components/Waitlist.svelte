<script lang="ts">
	import type { PortalWaitlist } from '../content/types';

	let { waitlist }: { waitlist: PortalWaitlist } = $props();

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	// created_at is "2026-06-30 19:56:40" (UTC). Rendered verbatim-safe, no parsing risk.
	function fmt(s: string): string {
		const [d = '', t = ''] = s.split(' ');
		const [y, m, day] = d.split('-');
		if (!y || !m || !day) return s;
		return `${Number(day)} ${MONTHS[Number(m) - 1] ?? m} ${y}, ${t.slice(0, 5)}`;
	}
</script>

<section class="p-section" aria-labelledby="p-wait-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-wait-h">Waitlist</h2>
		<span class="p-shead__meta">{waitlist.total} {waitlist.total === 1 ? 'signup' : 'signups'}</span>
	</div>

	{#if waitlist.signups.length}
		<ul class="p-wait">
			{#each waitlist.signups as s}
				<li class="p-wait__row">
					<a class="p-wait__email" href={`mailto:${s.email}`}>{s.email}</a>
					<span class="p-wait__phone">{s.phone ?? ''}</span>
					<span class="p-wait__src">{s.source ?? ''}</span>
					<span class="p-wait__date">{fmt(s.created_at)}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="p-note">No signups yet.</p>
	{/if}
</section>
