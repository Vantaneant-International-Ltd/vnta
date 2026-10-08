<script lang="ts">
	// One project in its own world: the words on one side, the site on two
	// screens on the other. Used for client work and for our own houses, on the
	// home page and on the landing pages. The look lives in site.css (.job,
	// .tag, .list).
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

<article class="job world" style={worldStyle(world)}>
	<div class="job__text">
		<div>
			<p class="job__meta">
				<span class="tag" class:tag--live={live} class:tag--quiet={!live}>{status}</span>
				{meta}
			</p>
			<svelte:element this={`h${level}`} class="job__name">{name}</svelte:element>
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
			{#if href}
				<p class="job__foot">
					<a class="job__visit" {href} rel="noopener">Visit {domain}</a>
				</p>
			{/if}
		</div>
	</div>
	<div class="job__screens">
		<Devices {image} {alt} />
	</div>
</article>
