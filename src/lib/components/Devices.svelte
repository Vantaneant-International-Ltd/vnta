<script lang="ts">
	// One client site on three screens: a laptop, a tablet and a phone, drawn in
	// CSS as plain device shapes. Every size is a share of the scene's width, so
	// the group scales as one picture.
	//
	// `image` is the stem of the screenshots under /work:
	//   <image>.jpg          laptop, 1440 by 900   (-720 beside it)
	//   <image>-tablet.jpg   tablet, 820 by 1180   (-tablet-410 beside it)
	//   <image>-phone.jpg    phone,  780 by 1688   (-phone-390 beside it)
	import { base } from '$app/paths';

	let { image, alt, eager = false }: { image: string; alt: string; eager?: boolean } = $props();
	const loading = $derived(eager ? 'eager' : 'lazy');
</script>

<div class="scene">
	<div class="laptop">
		<div class="laptop__lid">
			<img
				src="{base}/work/{image}.jpg"
				srcset="{base}/work/{image}-720.jpg 720w, {base}/work/{image}.jpg 1440w"
				sizes="(min-width: 1100px) 740px, 68vw"
				width="1440"
				height="900"
				{loading}
				decoding="async"
				{alt}
			/>
		</div>
		<div class="laptop__base"></div>
	</div>

	<div class="tablet">
		<img
			src="{base}/work/{image}-tablet.jpg"
			srcset="{base}/work/{image}-tablet-410.jpg 410w, {base}/work/{image}-tablet.jpg 820w"
			sizes="(min-width: 1100px) 240px, 22vw"
			width="820"
			height="1180"
			{loading}
			decoding="async"
			alt=""
		/>
	</div>

	<div class="phone">
		<img
			src="{base}/work/{image}-phone.jpg"
			srcset="{base}/work/{image}-phone-390.jpg 390w, {base}/work/{image}-phone.jpg 780w"
			sizes="(min-width: 1100px) 125px, 12vw"
			width="780"
			height="1688"
			{loading}
			decoding="async"
			alt=""
		/>
	</div>
</div>

<style>
	/* The laptop sits at the back, top and centre. The tablet and the phone
	   stand in front of it, on the same floor line. */
	.scene {
		position: relative;
		aspect-ratio: 100 / 53;
		--body: #1d1d1f; /* device bodies are graphite on every surface */
		--metal: #c7c7cc;
		--metal-dark: #a1a1a6;
	}
	.scene img {
		display: block;
		width: 100%;
		height: auto;
	}

	.laptop {
		position: absolute;
		top: 0;
		left: 15.5%;
		width: 72%;
	}
	.laptop__lid {
		background: var(--body);
		padding: 2% 2% 2.4%;
		border-radius: 2.6% 2.6% 0 0 / 4% 4% 0 0;
		line-height: 0;
	}
	.laptop__lid img {
		border-radius: 0.6% / 1%;
	}
	/* The base: a wider metal bar with a thumb notch in the middle. */
	.laptop__base {
		position: relative;
		width: 118%;
		margin-left: -9%;
		aspect-ratio: 100 / 2.3;
		background: var(--metal);
		border-radius: 0 0 1.6% 1.6% / 0 0 70% 70%;
	}
	.laptop__base::before {
		content: '';
		position: absolute;
		top: 0;
		left: 43%;
		width: 14%;
		height: 38%;
		background: var(--metal-dark);
		border-radius: 0 0 6% 6% / 0 0 100% 100%;
	}

	/* A ring in the card's own colour keeps each front device apart from the
	   screen behind it. It is a cut-out, not a shadow. */
	.tablet,
	.phone {
		position: absolute;
		bottom: 0;
		background: var(--body);
		line-height: 0;
		box-shadow: 0 0 0 clamp(2px, 0.5vw, 5px) var(--card);
	}
	.tablet {
		left: 0;
		width: 23%;
		padding: 0.85%;
		border-radius: 7% / 4.9%;
	}
	.tablet img {
		border-radius: 4.4% / 3.1%;
	}
	.phone {
		right: 0;
		width: 12%;
		padding: 0.42%;
		border-radius: 15% / 6.9%;
	}
	.phone img {
		border-radius: 12.5% / 5.8%;
	}
</style>
