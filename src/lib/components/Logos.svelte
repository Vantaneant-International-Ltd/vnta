<script lang="ts">
	// The wall: a row of six dark tiles, each showing one name we have worked
	// for or one tool we build on. The row stands still. Every couple of
	// seconds one tile, and only one, turns over to show the next name. Each
	// tile is a small card with two faces, the same way the large card at the
	// top of the page works.
	//
	// It turns only while it is on screen, the tab is in front and the visitor
	// has not pressed pause. For anyone who has asked their device for less
	// motion it never turns, and every name is listed underneath instead. With
	// no JavaScript it is the first six, standing still.
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { toolMarks } from '$lib/components/ui/toolMarks';
	import type { Mark } from '$lib/content/site';

	let { marks, title, every = 2 }: { marks: Mark[]; title: string; every?: number } = $props();

	const SHOW = 6;
	// Not left to right: the next tile to turn is never beside the last one.
	const ORDER = [0, 3, 1, 4, 2, 5];

	type Tile = { faces: [number, number]; turn: number };
	// The list is fixed for the life of the page, so its first value is the one we want.
	// svelte-ignore state_referenced_locally
	let tiles = $state<Tile[]>(
		Array.from({ length: Math.min(SHOW, marks.length) }, (_, i) => ({ faces: [i, i], turn: 0 }))
	);
	// svelte-ignore state_referenced_locally
	const waiting = marks.map((_, i) => i).slice(SHOW); // the names not on show, in turn
	let step = 0;

	let ready = $state(false);
	let paused = $state(false);
	let away = $state(false);
	let still = $state(false);
	const running = $derived(ready && !still && !paused && !away && waiting.length > 0);

	function turnOne() {
		const tile = tiles[ORDER[step++ % ORDER.length] % tiles.length];
		const front = ((tile.turn % 2) + 2) % 2;
		const next = waiting.shift()!;
		waiting.push(tile.faces[front]);
		tile.faces[front ^ 1] = next;
		// One frame, so the hidden face has its new name before it comes round.
		requestAnimationFrame(() => (tile.turn += 1));
	}

	$effect(() => {
		if (!running) return;
		const id = setInterval(turnOne, every * 1000);
		return () => clearInterval(id);
	});

	let root: HTMLElement;

	onMount(() => {
		const less = window.matchMedia('(prefers-reduced-motion: reduce)');
		const setStill = () => (still = less.matches);
		setStill();
		less.addEventListener('change', setStill);

		let seen = true;
		const setAway = () => (away = !seen || document.hidden);
		const io = new IntersectionObserver(
			([e]) => {
				seen = e.isIntersecting;
				setAway();
			},
			{ threshold: 0.5 }
		);
		io.observe(root);
		document.addEventListener('visibilitychange', setAway);

		ready = true;
		return () => {
			io.disconnect();
			less.removeEventListener('change', setStill);
			document.removeEventListener('visibilitychange', setAway);
		};
	});
</script>

{#snippet face(m: Mark)}
	{#if m.image}
		<img
			class="wall__img"
			class:is-named={m.named}
			src="{base}/logos/{m.image}"
			alt=""
			loading="eager"
			decoding="async"
		/>
	{:else if toolMarks[m.name]}
		<svg class="wall__mark" viewBox="0 0 24 24" aria-hidden="true"><path d={toolMarks[m.name]} /></svg>
	{/if}
	{#if !m.named}
		<span class="wall__name" class:is-type={!m.image && !toolMarks[m.name]}>{m.name}</span>
	{/if}
{/snippet}

<section class="wall" class:is-ready={ready} aria-label={title} bind:this={root}>
	<div class="wall__head">
		<h2 class="label wall__title">{title}</h2>
		{#if !still}
			<button
				type="button"
				class="wall__key"
				aria-label={paused ? 'Start the tiles turning' : 'Stop the tiles turning'}
				aria-pressed={paused}
				onclick={() => (paused = !paused)}
			>
				{#if paused}
					<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5v11l9-5.5z" /></svg>
				{:else}
					<svg viewBox="0 0 16 16" aria-hidden="true"
						><path d="M4 2.5h2.8v11H4zM9.2 2.5H12v11H9.2z" /></svg
					>
				{/if}
			</button>
		{/if}
	</div>

	<!-- What the eye sees: six tiles. Hidden from screen readers, which get
	     the whole list just below, where nothing moves. -->
	<div class="wall__row" aria-hidden="true" data-theme="ink">
		{#each tiles as tile}
			<div class="wall__cell">
				<div class="wall__tile" style="transform: rotateX({tile.turn * 180}deg)">
					{#each [0, 1] as f}
						<div class="wall__face wall__face--{f}">
							{@render face(marks[tile.faces[f]])}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<ul class="wall__all" class:is-shown={ready && still}>
		{#each marks as m}
			<li>{m.name}</li>
		{/each}
	</ul>
</section>

<style>
	.wall__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		min-height: 36px;
		margin-bottom: 14px;
	}
	.wall__title {
		margin: 0;
		line-height: 1.4;
	}

	.wall__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
	/* Each cell gives its own tile the depth to turn in. */
	.wall__cell {
		perspective: 900px;
	}
	.wall__tile {
		position: relative;
		height: clamp(76px, 9vw, 104px);
		transform-style: preserve-3d;
		transition: transform 700ms cubic-bezier(0.66, 0, 0.2, 1);
	}
	.wall__face {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 0 14px;
		border-radius: 14px;
		background: var(--paper);
		color: var(--ink);
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transform: rotateX(0deg);
	}
	.wall__face--1 {
		transform: rotateX(180deg);
	}

	/* A tool's mark, in the tile's one colour. */
	.wall__mark {
		flex: none;
		width: 24px;
		height: 24px;
		fill: currentColor;
	}
	/* A company's own logo. Shown without its colour, so the row stays ours. */
	.wall__img {
		flex: none;
		height: 38px;
		width: auto;
		filter: grayscale(1);
	}
	.wall__img.is-named {
		height: auto;
		max-height: 58%;
		max-width: 62%;
	}
	.wall__name {
		font-size: 0.98rem;
		font-weight: 600;
		line-height: 1.15;
		min-width: 0;
	}
	/* A company whose logo we do not hold yet: its name, set in our own face. */
	.wall__name.is-type {
		font-family: var(--font-label);
		font-size: 1.12rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-align: center;
	}

	.wall__key {
		display: grid;
		place-items: center;
		flex: none;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--ink-20);
		color: var(--ink);
		cursor: pointer;
		/* Held back until the page can answer a press. */
		visibility: hidden;
	}
	.is-ready .wall__key {
		visibility: visible;
	}
	.wall__key:hover {
		box-shadow: inset 0 0 0 1px var(--ink);
	}
	.wall__key svg {
		width: 13px;
		height: 13px;
		fill: currentColor;
	}

	/* Every name, for screen readers. Shown to everyone when nothing turns. */
	.wall__all {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		list-style: none;
	}
	.wall__all.is-shown {
		position: static;
		width: auto;
		height: auto;
		margin: 14px 0 0;
		overflow: visible;
		clip-path: none;
		white-space: normal;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 18px;
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	@media (min-width: 560px) {
		.wall__row {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 1000px) {
		.wall__row {
			grid-template-columns: repeat(6, minmax(0, 1fr));
			gap: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wall__tile {
			transition: none;
		}
	}
</style>
