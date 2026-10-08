<script lang="ts">
	// The card at the top of the home page. One real site sits still on it,
	// then the card turns over and the next site is on the back. It is a card
	// with two faces: before each turn the hidden face is given the next site,
	// then the whole card rotates half a turn.
	//
	// Its clock is the VNTA symbol. The rays light one at a time, clockwise
	// from the top; when the last one is lit the card turns and they start
	// again.
	//
	// It only turns by itself while it is on screen, the tab is in front, the
	// pointer is not resting on it, the keyboard is not on its keys and the
	// visitor has not pressed pause. For
	// anyone who has asked their device for less motion it never turns by
	// itself, and a press swaps the picture without the spin. With no
	// JavaScript it is simply the first site, standing still.
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { worldStyle, shot, type World } from '$lib/content/site';
	import { rays, rayBox } from '$lib/components/ui/rays';

	type Slide = {
		world: World;
		image: string; // stem under /work
		name: string;
		meta: string;
		status: string;
		live: boolean;
	};

	let { slides, seconds = 5 }: { slides: Slide[]; seconds?: number } = $props();

	const PHONE = '(max-width: 699px)';
	const TURN_MS = 900;

	// The list of sites is fixed for the life of the page, so its first value is the one we want.
	// svelte-ignore state_referenced_locally
	let faces = $state([0, slides.length > 1 ? 1 : 0]); // which site is on each face
	let turn = $state(0); // half turns so far
	const front = $derived(((turn % 2) + 2) % 2);
	const current = $derived(faces[front]);

	let ready = $state(false);
	let paused = $state(false); // the visitor pressed pause
	let held = $state(false); // pointer or keyboard is on the card
	let away = $state(false); // off screen, or the tab is behind
	let still = $state(false); // the device asks for less motion
	let turning = $state(false);

	const auto = $derived(ready && !still && !paused);
	const running = $derived(auto && !held && !away && !turning);

	function go(to: number, dir: 1 | -1 = 1) {
		const n = slides.length;
		to = ((to % n) + n) % n;
		if (to === current || turning) return;
		faces[front ^ 1] = to;
		turning = true;
		// One frame, so the hidden face has its new picture before it comes round.
		requestAnimationFrame(() => {
			turn += dir;
			setTimeout(() => (turning = false), still ? 0 : TURN_MS + 50);
		});
	}
	const next = () => go(current + 1, 1);
	const prev = () => go(current - 1, -1);

	const laptop = (s: Slide) => `${base}${shot(s.image, '-720')} 720w, ${base}${shot(s.image)} 1440w`;
	const phone = (s: Slide) =>
		`${base}${shot(s.image, '-phone-390')} 390w, ${base}${shot(s.image, '-phone')} 780w`;
	const SIZES = '(min-width: 1200px) 1090px, 92vw';

	let root: HTMLElement;

	onMount(() => {
		const less = window.matchMedia('(prefers-reduced-motion: reduce)');
		const setStill = () => (still = less.matches);
		setStill();
		less.addEventListener('change', setStill);

		// Fetch the other pictures now, so a turn never lands on a blank face.
		const narrow = window.matchMedia(PHONE).matches;
		for (const s of slides.slice(1)) {
			const img = new Image();
			img.sizes = SIZES;
			img.srcset = narrow ? phone(s) : laptop(s);
		}

		let seen = true;
		const setAway = () => (away = !seen || document.hidden);
		const io = new IntersectionObserver(
			([e]) => {
				seen = e.isIntersecting;
				setAway();
			},
			{ threshold: 0.35 }
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

<section
	class="flip"
	class:is-ready={ready}
	aria-roledescription="carousel"
	aria-label="Sites we built"
	bind:this={root}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flip__stage"
		onpointerenter={(e) => e.pointerType === 'mouse' && (held = true)}
		onpointerleave={() => (held = false)}
	>
		<div class="flip__card" style="transform: rotateX({turn * 180}deg)">
			{#each [0, 1] as f}
				{@const s = slides[faces[f]]}
				<figure
					class="flip__face flip__face--{f} world"
					style={worldStyle(s.world)}
					aria-hidden={f !== front}
					inert={f !== front}
				>
					<div class="flip__shot">
						<picture>
							<source media={PHONE} srcset={phone(s)} sizes="92vw" />
							<img
								src="{base}{shot(s.image)}"
								srcset={laptop(s)}
								sizes={SIZES}
								width="1440"
								height="900"
								alt="The {s.name} website."
								loading="eager"
								fetchpriority={f === 0 ? 'high' : 'auto'}
								decoding={f === 0 ? 'sync' : 'async'}
							/>
						</picture>
					</div>
					<figcaption class="flip__cap">
						<span class="flip__name">{s.name}</span>
						<span class="flip__meta">{s.meta}</span>
						<span class="tag" class:tag--live={s.live} class:tag--quiet={!s.live}>{s.status}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>

	{#if slides.length > 1}
		<div
			class="flip__bar"
			onfocusin={(e) => (held = (e.target as HTMLElement).matches(':focus-visible'))}
			onfocusout={() => (held = false)}
			role="group"
			aria-label="Choose a site"
		>
			<!-- The clock: the symbol, lighting ray by ray until the card turns. -->
			{#key turn}
				<svg
					class="flip__clock"
					class:is-auto={auto}
					viewBox={rayBox}
					aria-hidden="true"
					style="--secs: {seconds}s; --state: {running ? 'running' : 'paused'}"
				>
					{#each rays as d, i}
						<path
							{d}
							style="--at: {i / rays.length}"
							onanimationend={i === rays.length - 1 ? next : undefined}
						/>
					{/each}
				</svg>
			{/key}

			<ol class="flip__ticks">
				{#each slides as s, i}
					<li>
						<button
							type="button"
							class="flip__tick"
							aria-label="Show {s.name}"
							aria-current={i === current ? 'true' : undefined}
							onclick={() => go(i, i > current ? 1 : -1)}
						>
							<span class="flip__track"></span>
						</button>
					</li>
				{/each}
			</ol>

			<div class="flip__keys">
				{#if !still}
					<button
						type="button"
						class="flip__key"
						aria-label={paused ? 'Start turning the card' : 'Stop turning the card'}
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
				<button type="button" class="flip__key" aria-label="Previous site" onclick={prev}>
					<svg viewBox="0 0 16 16" aria-hidden="true" class="line"><path d="M10 3 5 8l5 5" /></svg>
				</button>
				<button type="button" class="flip__key" aria-label="Next site" onclick={next}>
					<svg viewBox="0 0 16 16" aria-hidden="true" class="line"><path d="m6 3 5 5-5 5" /></svg>
				</button>
			</div>
		</div>
	{/if}
</section>

<style>
	.flip {
		margin-top: clamp(28px, 4vw, 52px);
	}

	/* The stage gives the turn its depth. */
	.flip__stage {
		perspective: 3000px;
	}
	.flip__card {
		position: relative;
		transform-style: preserve-3d;
		transition: transform 900ms cubic-bezier(0.66, 0, 0.2, 1);
	}
	.flip__face {
		display: flex;
		flex-direction: column;
		margin: 0;
		border: 1px solid var(--w-line);
		border-radius: clamp(16px, 2vw, 24px);
		overflow: hidden;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transform: rotateX(0deg);
	}
	/* The back of the card: laid over the front, already turned away. */
	.flip__face--1 {
		position: absolute;
		inset: 0;
		transform: rotateX(180deg);
	}

	/* The site itself, edge to edge. Wide screens show the laptop view; a
	   phone shows the phone view, from the top, the way it would open. */
	.flip__shot {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		line-height: 0;
		background: var(--w-bg);
	}
	.flip__shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top center;
	}

	.flip__cap {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 6px 16px;
		padding: 14px clamp(16px, 2vw, 28px);
		border-top: 1px solid var(--w-line);
		min-width: 0;
	}
	.flip__name {
		font-family: var(--font-display);
		font-size: var(--t-h4);
		line-height: 1.2;
		color: var(--ink);
		white-space: nowrap;
	}
	.flip__meta {
		flex: 1;
		min-width: 0;
		font-family: var(--font-label);
		font-size: var(--t-small);
		letter-spacing: 0.06em;
		color: var(--ink-60);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.flip__cap .tag {
		flex: none;
	}

	/* --- The row under the card: where you are, and the three keys. ------- */
	.flip__bar {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 14px;
		/* Held back until the page can answer a press. */
		visibility: hidden;
	}
	.is-ready .flip__bar {
		visibility: visible;
	}
	/* The symbol as a clock. Each ray waits its turn, then lights and stays
	   lit. With the card stopped, or for anyone who asks for less motion, the
	   whole symbol is simply lit. */
	.flip__clock {
		flex: none;
		width: 40px;
		height: 40px;
		fill: var(--ink);
	}
	.flip__clock.is-auto path {
		animation: ray 0.25s linear both;
		animation-delay: calc(var(--secs) * var(--at));
		animation-play-state: var(--state);
	}
	@keyframes ray {
		from {
			opacity: 0.16;
		}
		to {
			opacity: 1;
		}
	}

	.flip__ticks {
		list-style: none;
		margin: 0 auto 0 0;
		padding: 0;
		display: flex;
		gap: 6px;
		flex: 1;
		max-width: 240px;
	}
	.flip__ticks li {
		flex: 1;
	}
	/* A tall target around a thin line. */
	.flip__tick {
		display: block;
		width: 100%;
		padding: 21px 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
	/* One short line per site; the one on show is the dark one. */
	.flip__track {
		display: block;
		height: 2px;
		background: var(--ink-20);
	}
	.flip__tick:hover .flip__track {
		background: var(--ink-60);
	}
	.flip__tick[aria-current] .flip__track {
		background: var(--ink);
	}

	.flip__keys {
		display: flex;
		gap: 8px;
	}
	.flip__key {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--ink-20);
		color: var(--ink);
		cursor: pointer;
		transition: box-shadow var(--dur) var(--ease);
	}
	.flip__key:hover {
		box-shadow: inset 0 0 0 1px var(--ink);
	}
	.flip__key svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}
	.flip__key svg.line {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	@media (max-width: 699px) {
		.flip__shot {
			aspect-ratio: 4 / 5;
		}
		.flip__meta {
			display: none;
		}
		.flip__cap {
			justify-content: space-between;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.flip__card {
			transition: none;
		}
		.flip__clock path {
			animation: none !important;
		}
	}
</style>
