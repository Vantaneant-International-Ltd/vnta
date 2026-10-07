<script lang="ts">
	// Everything a page tells the outside world about itself, in one place:
	// the title and description Google shows, the card Facebook, WhatsApp,
	// LinkedIn and X draw when someone shares the link, the one true address
	// of the page, and any structured data for search engines and AI.
	import { page } from '$app/stores';
	import { siteUrl } from '$lib/content/site';

	let {
		title,
		description,
		shareTitle = title,
		image = '/og.png',
		imageAlt = 'VNTA. Websites that bring in the work. For Irish garages, dealers, shops and trades.',
		ld = []
	}: {
		title: string;
		description: string;
		shareTitle?: string;
		image?: string;
		imageAlt?: string;
		ld?: object[];
	} = $props();

	const path = $derived($page.url.pathname.replace(/\/+$/, '') || '/');
	const url = $derived(siteUrl + path);
	const imageUrl = $derived(image.startsWith('http') ? image : siteUrl + image);
	// "<" is escaped so no piece of copy can ever close the script tag early.
	const blocks = $derived(ld.map((b) => JSON.stringify(b).replace(/</g, '\\u003c')));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="VNTA" />
	<meta property="og:locale" content="en_IE" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={shareTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={imageAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={shareTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />

	{#each blocks as block}
		{@html `<script type="application/ld+json">${block}<\/script>`}
	{/each}
</svelte:head>
