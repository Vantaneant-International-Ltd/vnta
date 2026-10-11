<script lang="ts">
	// Chrome for every public page: the masthead and the foot. Pages supply
	// their own bands between them. /portal keeps its own lean chrome, its own
	// older tokens and opts out of all of this.
	import '$lib/styles/tokens.css';
	import '$lib/styles/system.css';
	import '@fontsource-variable/inter';
	// The portal's faces. The public pages no longer use them.
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
	import Icon from '$lib/components/ui/Icon.svelte';
	import { roboticsUrl, githubUrl, pitch, siteUrl } from '$lib/content/site';

	let { children } = $props();

	// GA page_view on every client navigation (also fires on first mount).
	afterNavigate(({ to }) => {
		if (to?.url) trackPageView(to.url);
	});

	const path = $derived($page.url.pathname.replace(base, '') || '/');
	const chrome = $derived(!path.startsWith('/portal'));

	// Robotics is a page of its own today and a site of its own later, so its
	// address comes from one place (roboticsUrl in content/site.ts).
	const robotics = roboticsUrl.startsWith('http') ? roboticsUrl : `${base}${roboticsUrl}`;

	// Three places, and no more. Technology and Company are parts of the home
	// page.
	const nav = [
		{ label: 'Technology', href: `${base}/#technology` },
		{ label: 'Robotics', href: robotics },
		{ label: 'Company', href: `${base}/#company` }
	];
	const host = siteUrl.replace(/^https?:\/\//, '');
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.ico" sizes="48x48" />
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
	<meta name="theme-color" content="#ffffff" />
</svelte:head>

{#if chrome}
	<div class="shell" data-sveltekit-preload-data="hover">
		<header class="masthead">
			<div class="wrap">
				<a class="masthead__mark" href="{base}/" aria-label="VNTA home">
					<Wordmark height={17} />
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each nav as item}
						<a href={item.href} aria-current={path === '/robotics' && item.label === 'Robotics' ? 'page' : undefined}>
							{item.label}
						</a>
					{/each}
				</nav>
				<a class="btn btn--solid btn--small masthead__cta" href={robotics}>
					Explore Robotics
					<Icon name="arrow" size={16} />
				</a>
			</div>
		</header>

		{@render children()}

		<footer class="foot" data-theme="ink">
			<div class="wrap">
				<div class="foot__top">
					<div>
						<a class="foot__mark" href="{base}/" aria-label="VNTA home">
							<Wordmark height={20} />
						</a>
						<p class="foot__line">{pitch.headline}</p>
					</div>
					<nav aria-label="Site">
						<ul class="foot__nav">
							<li><a href="{base}/">VNTA</a></li>
							<li><a href={robotics}>Robotics</a></li>
							<li><a href="{base}/#company">Company</a></li>
							<li><a href={githubUrl} rel="me noopener">GitHub</a></li>
							<li><a href="{base}/contact">Contact</a></li>
						</ul>
					</nav>
				</div>

				<div class="foot__base">
					<span>&copy; VNTA <span class="foot__host">&nbsp;{host}</span></span>
					<nav aria-label="Small print">
						<a href="{base}/legal">Legal</a>
						<a href="{base}/privacy">Privacy</a>
						<a href="{base}/terms">Terms</a>
					</nav>
				</div>
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
		background: #ffffff;
		color: #0c1626;
		font-family: var(--font-body);
		font-size: var(--t-body);
		line-height: 1.6;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	:global(a) {
		color: inherit;
		text-decoration: none;
	}
	/* The portal's base type. The public pages override all of this inside
	   .shell (styles/system.css). */
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
	:global(*:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 3px;
	}
	:global(.rule) {
		height: 1px;
		background: var(--line);
		border: 0;
		margin: 0;
	}
</style>
