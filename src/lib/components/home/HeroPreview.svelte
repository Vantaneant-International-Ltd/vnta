<script lang="ts">
	// A picture of the app's Home view. It is a drawing, not a live screen, and
	// it says so. The three rows match the sample letter in the demonstration.
	import Icon from '$lib/components/ui/Icon.svelte';
	const rows = [
		{ icon: 'repeat', title: 'Home insurance renewal', sub: 'Renews 14 Feb 2027', state: 'Needs review' },
		{ icon: 'mail', title: 'Confirm your details', sub: 'Reply by 31 Jan 2027', state: 'Draft ready' },
		{ icon: 'calendar', title: 'Appointment', sub: '22 Jan 2027, 10:00', state: 'Needs review' }
	];
</script>

<figure class="preview" aria-label="Preview of the VNTA Home view, drawn with demonstration data">
	<div class="bar"><span>Home</span><span class="tag">Demonstration data</span></div>
	<div class="body">
		<p class="hello">Good morning.</p>
		<p class="sub">3 things need your attention.</p>
		<ul>
			{#each rows as r}
				<li>
					<span class="ico"><Icon name={r.icon} size={18} /></span>
					<span class="txt"><b>{r.title}</b><small>{r.sub}</small></span>
					<span class="state">{r.state}</span>
				</li>
			{/each}
		</ul>
	</div>
	<figcaption>Illustration. Not a real account.</figcaption>
</figure>

<style>
	.preview {
		margin: 0;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 28px;
		box-shadow: var(--lift);
		overflow: hidden;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 18px;
		border-bottom: 1px solid var(--line);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink);
	}
	.tag {
		font-weight: 500;
		font-size: 0.72rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--blue);
		border: 1px solid var(--blue);
		border-radius: var(--r-chip);
		padding: 2px 8px;
	}
	.body {
		padding: clamp(18px, 3vw, 28px);
	}
	.hello {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.sub {
		margin: 4px 0 20px;
		color: var(--ink-60);
		font-size: var(--t-small);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line-soft);
	}
	li {
		display: grid;
		grid-template-columns: 36px 1fr auto;
		gap: 12px;
		align-items: center;
		padding: 14px 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.ico {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 12px;
		background: var(--ground-2);
		color: var(--ink-80);
	}
	.txt {
		display: grid;
		min-width: 0;
	}
	.txt b {
		font-weight: 600;
		color: var(--ink);
		font-size: 0.95rem;
	}
	.txt small {
		color: var(--ink-60);
		font-size: 0.82rem;
	}
	.state {
		font-size: 0.78rem;
		color: var(--ink-80);
		border: 1px solid var(--ink-20);
		border-radius: var(--r-chip);
		padding: 3px 9px;
		white-space: nowrap;
	}
	figcaption {
		padding: 10px 18px 14px;
		font-size: 0.78rem;
		color: var(--ink-40);
	}
</style>
