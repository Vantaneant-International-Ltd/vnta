<script lang="ts">
	// Falling snow, drawn by magic-snowflakes (MIT, github.com/hcodes/snowflakes,
	// pinned in package.json): real six-pointed flakes, turning as they fall.
	// Never in the way: it cannot be clicked and screen readers skip it. For
	// anyone who asks for less motion it is not shown at all.
	import { onMount } from 'svelte';
	import { lessMotion } from './season';

	let {
		colour = '#a8b8d0',
		count = 60,
		fixed = true,
		warm = false
	}: { colour?: string; count?: number; fixed?: boolean; warm?: boolean } = $props();

	let box = $state<HTMLDivElement>();

	onMount(() => {
		if (lessMotion()) return;
		let snow: { destroy(): void } | undefined;
		let gone = false;
		import('magic-snowflakes').then(({ default: Snowflakes }) => {
			if (gone) return;
			snow = new Snowflakes({
				container: fixed ? document.body : box!,
				color: colour,
				count: Math.round(window.innerWidth < 700 ? count * 0.5 : count),
				minSize: warm ? 9 : 8,
				maxSize: warm ? 18 : 20,
				minOpacity: 0.45,
				maxOpacity: 0.95,
				speed: 0.8,
				wind: true,
				rotation: !warm,
				zIndex: fixed ? 30 : 2
			});
		});
		return () => {
			gone = true;
			snow?.destroy();
		};
	});
</script>

{#if !fixed}<div class="snowbox" bind:this={box} aria-hidden="true"></div>{/if}

<style>
	.snowbox {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 2;
	}
	:global(.snowflakes) {
		pointer-events: none;
	}
</style>
