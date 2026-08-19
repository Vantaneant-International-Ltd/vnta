<script lang="ts">
	// The site is a single white page. The layout carries global type and colour
	// and nothing else — no nav, no masthead footer, no decorative background.
	// The landing composes its own header and foot; the remaining routes (legal,
	// privacy, terms, error) get the slim chrome below. /portal keeps its own.
	import '$lib/styles/tokens.css';
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
	// The landing is self-contained; the portal is a self-contained module with
	// its own lean chrome. Everything else borrows the slim chrome.
	const chrome = $derived(path !== '/' && !path.startsWith('/portal'));

	const foundedYear = 2025;
	const year = new Date().getFullYear();
	const yearLabel = year > foundedYear ? `${foundedYear}–${year}` : `${foundedYear}`;
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/symbol.svg" />
	<meta name="theme-color" content="#ffffff" />

	<!-- Canonical + social defaults (per-page og:title/description override these). -->
	<link rel="canonical" href={`https://vnta.xyz${$page.url.pathname}`} />
	<meta property="og:site_name" content="VNTA" />
	<meta property="og:image" content="https://vnta.xyz/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://vnta.xyz/og.png" />
</svelte:head>

<div class="shell" data-sveltekit-preload-data="hover">
	{#if chrome}
		<header class="chrome-head">
			<a class="chrome-brand" href="{base}/" aria-label="VNTA home">
				<Wordmark height={20} />
			</a>
		</header>
	{/if}

	<div class="shell__main">
		{@render children()}
	</div>

	{#if chrome}
		<footer class="chrome-foot">
			<span class="eyebrow">© {yearLabel} Vantanéant International Ltd</span>
			<a class="chrome-foot__mail" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>
		</footer>
	{/if}
</div>

<CookieBanner />

<style>
	/* --- Global base --- */
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
	:global(a){ color:inherit; text-decoration:none; }
	:global(h1,h2,h3,h4,h5,h6){ font-family:var(--font-display); font-weight:400; letter-spacing:var(--track-tight); line-height:1.08; }
	:global(.eyebrow){ font-family:var(--font-sc); font-size:var(--t-label); letter-spacing:var(--track-label); text-transform:uppercase; color:var(--ink-50); margin:0; }
	:global(.rule){ height:1px; background:var(--line); border:0; margin:0; }
	:global(*:focus-visible){ outline:2px solid var(--ink); outline-offset:3px; border-radius:var(--radius); }
	:global(.page-container){ max-width:800px; margin:0 auto; padding: clamp(40px,6vw,72px) clamp(24px,6vw,40px) clamp(56px,7vw,88px); }
	:global(.content-width){ max-width: 680px; }

	/* Buttons — square, flat, no lift/shadow/pill */
	:global(.btn-primary){ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:var(--radius); background:var(--ink); color:var(--paper); border:1px solid var(--ink); font-family:var(--font-body); font-weight:600; font-size:0.9rem; letter-spacing:0.01em; cursor:pointer; transition: background var(--dur) var(--ease); }
	:global(.btn-primary:hover){ background:var(--ink-85); }
	:global(.btn-ghost){ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:var(--radius); background:transparent; color:var(--ink); border:1px solid var(--line); font-family:var(--font-body); font-weight:600; font-size:0.9rem; letter-spacing:0.01em; cursor:pointer; transition: border-color var(--dur) var(--ease); }
	:global(.btn-ghost:hover){ border-color:var(--ink); }

	/* --- Slim chrome (legal / privacy / terms / error only) --- */
	.shell { min-height: 100vh; display: flex; flex-direction: column; }
	.shell__main { flex: 1 0 auto; }

	.chrome-head {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
		padding: clamp(28px, 5vw, 44px) clamp(24px, 6vw, 40px) 0;
		box-sizing: border-box;
	}
	.chrome-brand { display: inline-flex; color: var(--ink); }

	.chrome-foot {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 0 clamp(24px, 6vw, 40px) clamp(40px, 6vw, 56px);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--s-4);
		flex-wrap: wrap;
	}
	.chrome-foot__mail {
		font-size: 0.92rem;
		color: var(--ink-70);
		transition: color var(--dur) var(--ease);
	}
	.chrome-foot__mail:hover { color: var(--ink); }
</style>
