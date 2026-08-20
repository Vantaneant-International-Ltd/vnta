<script lang="ts">
	// Chrome for every public page: the masthead and the foot. Pages supply only
	// their bands. /portal keeps its own lean chrome and opts out.
	import '$lib/styles/tokens.css';
	import '$lib/styles/site.css';
	import '@fontsource/marcellus/400.css';
	import '@fontsource/marcellus-sc/400.css';
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';
	import '@fontsource/mrs-saint-delafield/400.css'; // the signature only

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

	// Five is the ceiling. Companies and Diagnosis are anchors into the pages
	// that carry them; Contact is a mail draft.
	const nav = [
		{ label: 'About', href: `${base}/about` },
		{ label: 'Companies', href: `${base}/#companies` },
		{ label: 'Diagnosis', href: `${base}/about#diagnosis` },
		{ label: 'Contact', href: `${base}/contact` }
	];

	function current(href: string) {
		if (href.startsWith('mailto:') || href.includes('#')) return undefined;
		return href.replace(base, '') === path ? 'page' : undefined;
	}
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/symbol.svg" />
	<meta name="theme-color" content="#f6f6f6" />

	<link rel="canonical" href={`https://vnta.xyz${$page.url.pathname}`} />
	<meta property="og:site_name" content="VNTA" />
	<meta property="og:image" content="https://vnta.xyz/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://vnta.xyz/og.png" />
</svelte:head>

{#if chrome}
	<div class="shell" data-sveltekit-preload-data="hover">
		<div class="wrap">
			<header class="masthead">
				<a class="masthead__mark" href="{base}/" aria-label="VNTA home">
					<Wordmark height={20} />
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each nav as item}
						<a href={item.href} aria-current={current(item.href)}>{item.label}</a>
					{/each}
				</nav>
			</header>

			{@render children()}

			<footer class="foot">
				<span class="foot__mark"><Wordmark height={13} /></span>
				<span>Dublin &middot; Worldwide</span>
				<nav class="foot__links" aria-label="Legal">
					<a href="{base}/legal">Legal</a>
					<a href="{base}/privacy">Privacy</a>
					<a href="{base}/terms">Terms</a>
				</nav>
				<span class="foot__copy">Est. MMXXV &middot; Vantanéant International Ltd</span>
			</footer>
		</div>
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
		font-synthesis: none; /* Marcellus ships 400 only — never faux-bold */
	}
	:global(a) { color: inherit; text-decoration: none; }
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: var(--font-display);
		font-weight: 400;
		letter-spacing: var(--track-tight);
		line-height: 1.08;
	}
	:global(.eyebrow) {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
		margin: 0;
	}
	:global(.rule) { height: 1px; background: var(--line); border: 0; margin: 0; }
	:global(*:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 3px;
		border-radius: var(--radius);
	}
	/* Legal pages still use these two. */
	:global(.page-container) { max-width: 800px; margin: 0 auto; padding: clamp(32px, 5vw, 56px) 0; }
	:global(.content-width) { max-width: 680px; }
	:global(.btn-primary) {
		display: inline-flex; align-items: center; justify-content: center; gap: 8px;
		padding: 13px 24px; border-radius: var(--radius);
		background: var(--ink); color: var(--paper); border: 1px solid var(--ink);
		font-family: var(--font-body); font-weight: 600; font-size: 0.9rem;
		cursor: pointer; transition: background var(--dur) var(--ease);
	}
	:global(.btn-primary:hover) { background: var(--ink-85); }

	.shell { min-height: 100svh; display: flex; flex-direction: column; }
	.shell > .wrap { flex: 1; display: flex; flex-direction: column; }
	.shell :global(main) { flex: 1 0 auto; }
</style>
