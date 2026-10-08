<script lang="ts">
	// One client site on two screens: the wide view in a plain window, and the
	// phone standing in front of its corner. Every size is a share of the
	// scene's width, so the pair scales as one picture.
	//
	// `image` is the stem of the screenshots under /work:
	//   <image>.jpg         laptop, 1440 by 900   (-720 beside it)
	//   <image>-phone.jpg   phone,  780 by 1688   (-phone-390 beside it)
	import { base } from '$app/paths';

	let { image, alt, eager = false }: { image: string; alt: string; eager?: boolean } = $props();
	const loading = $derived(eager ? 'eager' : 'lazy');
</script>

<div class="scene">
	<div class="window">
		<img
			src="{base}/work/{image}.jpg"
			srcset="{base}/work/{image}-720.jpg 720w, {base}/work/{image}.jpg 1440w"
			sizes="(min-width: 1320px) 640px, (min-width: 900px) 50vw, 86vw"
			width="1440"
			height="900"
			{loading}
			decoding="async"
			{alt}
		/>
	</div>

	<div class="phone">
		<img
			src="{base}/work/{image}-phone.jpg"
			srcset="{base}/work/{image}-phone-390.jpg 390w, {base}/work/{image}-phone.jpg 780w"
			sizes="(min-width: 1320px) 150px, (min-width: 900px) 12vw, 22vw"
			width="780"
			height="1688"
			{loading}
			decoding="async"
			alt=""
		/>
	</div>
</div>

<style>
	/* The window sits top left. The phone stands in front of its right-hand
	   corner and hangs a little below it. */
	.scene {
		position: relative;
		padding: 0 7% 7% 0;
	}
	.scene img {
		display: block;
		width: 100%;
		height: auto;
	}
	.window {
		border-radius: clamp(8px, 1.2vw, 16px);
		overflow: hidden;
		line-height: 0;
		/* An edge in the card's own line colour: a dark site on a dark card
		   would otherwise have none. */
		box-shadow: 0 0 0 1px var(--w-line, var(--line-soft));
	}
	.phone {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 22%;
		padding: 0.9%;
		background: var(--device, #1f1f1f);
		border-radius: 15% / 6.9%;
		line-height: 0;
		/* A ring in the card's own colour sets the phone apart from the
		   window behind it. It is a cut-out, not a shadow. */
		box-shadow: 0 0 0 clamp(3px, 0.5vw, 6px) var(--card);
	}
	.phone img {
		border-radius: 12.5% / 5.8%;
	}
</style>
