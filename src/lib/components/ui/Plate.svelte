<script lang="ts">
	// An editorial plate. With a `src` it shows the photograph; without one it
	// shows the reserved plate itself, which is a deliberate state rather than a
	// missing image: same proportion, same caption, same place in the grid, so
	// the page does not move when the photograph arrives.
	//
	// The image is desaturated in CSS. The palette (§3.1) is white and black
	// with percentage shades, so a colour photograph dropped in here still
	// obeys the system without anyone having to remember to convert it.
	let {
		src = '',
		alt = '',
		plate = '',
		caption = '',
		ratio = '4 / 5'
	}: {
		src?: string;
		alt?: string;
		plate?: string;
		caption?: string;
		ratio?: string;
	} = $props();
</script>

<figure class="plate" style="--plate-ratio: {ratio}">
	{#if src}
		<img class="plate__img" {src} alt={alt || caption} loading="lazy" decoding="async" />
	{:else}
		<div class="plate__reserved" aria-hidden="true"></div>
	{/if}

	<figcaption class="plate__cap">
		{#if plate}<span class="plate__n">{plate}</span>{/if}
		<span class="plate__text">{caption}</span>
		{#if !src}<span class="plate__state">To follow</span>{/if}
	</figcaption>
</figure>

<style>
	.plate {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* The photograph and the reserved plate hold identical space, so nothing
	   reflows when one replaces the other. */
	.plate__img,
	.plate__reserved {
		width: 100%;
		aspect-ratio: var(--plate-ratio);
		display: block;
	}

	.plate__img {
		object-fit: cover;
		filter: grayscale(1) contrast(1.03);
	}

	/* Paper lifted above the page, held by a hairline. The same two tones and
	   the same rule weight as everything else on the site. */
	.plate__reserved {
		background: var(--paper-2);
		border: 1px solid var(--line);
	}

	.plate__cap {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.2em 0.9em;
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
	.plate__n { color: var(--ink-50); }
	.plate__text { color: var(--ink-50); }
	.plate__state { margin-left: auto; color: var(--ink-50); }
</style>
