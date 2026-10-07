<script lang="ts">
	// One project in its own world: the site on three screens, then the words.
	// Used for client work and for our own houses, on the home page and on the
	// landing pages. The look lives in site.css (.job, .tag, .list).
	import Devices from '$lib/components/Devices.svelte';
	import { worldStyle, type World } from '$lib/content/site';

	let {
		world,
		image,
		alt,
		meta,
		status,
		live = false,
		name,
		href,
		domain,
		summary,
		built = [],
		level = 3
	}: {
		world: World;
		image: string;
		alt: string;
		meta: string;
		status: string;
		live?: boolean;
		name: string;
		href?: string;
		domain?: string;
		summary: string;
		built?: string[];
		level?: 2 | 3;
	} = $props();
</script>

<article class="job card world" style={worldStyle(world)}>
	<Devices {image} {alt} />
	<div class="job__text">
		<div>
			<p class="job__meta">
				{meta}
				<span class="tag" class:tag--quiet={!live}>{status}</span>
			</p>
			<svelte:element this={`h${level}`} class="job__name">{name}</svelte:element>
			{#if href}
				<p class="job__foot">
					<a class="link" {href} rel="noopener">Visit {domain}</a>
				</p>
			{/if}
		</div>
		<div>
			<p class="job__summary">{summary}</p>
			{#if built.length}
				<ul class="list">
					{#each built as line}
						<li>{line}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</article>
