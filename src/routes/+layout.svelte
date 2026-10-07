<script lang="ts">
	// Chrome for every public page: the black masthead and the black foot.
	// Pages supply their own bands between them. /portal keeps its own lean
	// chrome and opts out.
	import '$lib/styles/tokens.css';
	import '$lib/styles/site.css';
	import '@fontsource/marcellus/400.css';
	import '@fontsource/marcellus-sc/400.css';
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';

	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { trackPageView } from '$lib/analytics';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	let { children } = $props();

	// GA page_view on every client navigation (also fires on first mount).
	afterNavigate(({ to }) => {
		if (to?.url) trackPageView(to.url);
	});

	const path = $derived($page.url.pathname.replace(base, '') || '/');
	const chrome = $derived(!path.startsWith('/portal'));

	// The home page is one long scroll, so the masthead links are anchors into
	// it. The last one is the action the whole page is asking for.
	const nav = [
		{ label: 'Work', href: `${base}/#work` },
		{ label: 'Prices', href: `${base}/#prices` },
		{ label: 'Questions', href: `${base}/#questions` }
	];
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/symbol.svg" />
	<meta name="theme-color" content="#000000" />

	<link rel="canonical" href={`https://vnta.xyz${$page.url.pathname}`} />
	<meta property="og:site_name" content="VNTA" />
	<meta property="og:image" content="https://vnta.xyz/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://vnta.xyz/og.png" />
</svelte:head>

{#if chrome}
	<div class="shell" data-sveltekit-preload-data="hover">
		<header class="masthead" data-theme="ink">
			<div class="wrap">
				<a class="masthead__mark" href="{base}/" aria-label="VNTA home">
					<Wordmark height={18} />
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each nav as item}
						<a href={item.href}>{item.label}</a>
					{/each}
					<a class="btn btn--solid btn--small" href="{base}/#quote">Get a price</a>
				</nav>
			</div>
		</header>

		{@render children()}

		<footer class="foot" data-theme="ink">
			<div class="wrap">
				<span>Dublin &middot; Worldwide</span>
				<nav class="foot__links" aria-label="Secondary">
					<a href="{base}/contact">Contact</a>
					<a href="{base}/legal">Legal</a>
					<a href="{base}/privacy">Privacy</a>
					<a href="{base}/terms">Terms</a>
				</nav>
				<span class="foot__copy">Est. MMXXV &middot; Vantanéant International Ltd</span>
			</div>
		</footer>
	</div>
{:else}
	{@render children()}
{/if}

<CookieBanner />

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-body);
		font-size: var(--t-body);
		line-height: 1.6;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-synthesis: none; /* the substitute face has one weight: never faux-bold */
	}
	:global(a) { color: inherit; text-decoration: none; }
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: var(--font-display);
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.1;
	}
	:global(.eyebrow) {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-60);
		margin: 0;
	}
	:global(.rule) { height: 1px; background: var(--line); border: 0; margin: 0; }
	:global(*:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 3px;
	}
	/* Legal pages still use these two. */
	:global(.page-container) { max-width: 800px; margin: 0 auto; padding: clamp(40px, 6vw, 72px) 0; }
	:global(.content-width) { max-width: 680px; }

	/* The public pages are written in the brand typeface. The portal keeps the
	   sans it was built with. */
	.shell {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		font-family: var(--font-text);
	}
	.shell :global(main) { flex: 1 0 auto; }
</style>
