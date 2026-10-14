<script lang="ts">
	// Chrome for every public page: the masthead and the foot. There are three
	// kinds of page, and each gets its own frame:
	//
	//   company   VNTA, the technology company. Everything except the two below.
	//             Wrapped in .shell and drawn by styles/system.css.
	//   studio    /studio and the pages under it: VNTA's design studio, with
	//             its own masthead, foot and older look. Wrapped in .studio and
	//             drawn by styles/studio.css on the tokens in tokens.css.
	//   portal    /portal keeps its own lean chrome and opts out of both.
	//
	// The two looks never meet on one page: every rule in system.css begins
	// with .shell and every rule in studio.css begins with .studio.
	import '$lib/styles/tokens.css';
	import '$lib/styles/system.css';
	import '$lib/styles/studio.css';
	import '@fontsource-variable/inter';
	// The faces of the studio pages and the portal.
	import '@fontsource/marcellus/400.css';
	import '@fontsource/marcellus-sc/400.css';
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';

	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { trackPageView } from '$lib/analytics';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import Symbol from '$lib/components/ui/Symbol.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { roboticsUrl, mastodonUrl, social, follow, pitch, siteUrl } from '$lib/content/site';
	import { notesPath } from '$lib/content/notePaths';
	import { pitch as studioPitch, landings, studioEmail } from '$lib/content/studio';

	let { children, data } = $props();

	// Moving between pages: one short cross-fade, where the browser can do it
	// and the visitor has not asked for less motion. Not within a page.
	onNavigate((nav) => {
		if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (nav.from?.url.pathname === nav.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await nav.complete;
			});
		});
	});

	// GA page_view on every client navigation (also fires on first mount).
	afterNavigate(({ to }) => {
		if (to?.url) trackPageView(to.url);
	});

	const path = $derived($page.url.pathname.replace(base, '') || '/');
	const frame = $derived(
		path.startsWith('/portal') ? 'portal' : path === '/studio' || path.startsWith('/studio/') ? 'studio' : 'company'
	);

	// Robotics is a page of its own today and a site of its own later, so its
	// address comes from one place (roboticsUrl in content/site.ts).
	const robotics = roboticsUrl.startsWith('http') ? roboticsUrl : `${base}${roboticsUrl}`;

	// Four places, and no more. Technology and Company are parts of the home
	// page; Pricing is VNTA Robotics' pricing.
	const pricing = `${base}/robotics/pricing`;
	const nav = [
		{ label: 'Technology', href: `${base}/#technology` },
		{ label: 'Robotics', href: robotics },
		{ label: 'Pricing', href: pricing },
		{ label: 'Company', href: `${base}/#company` }
	];
	const host = siteUrl.replace(/^https?:\/\//, '');

	// Notes are linked only once one has been published (see +layout.server.ts).
	const hasNotes = $derived(data.hasNotes);

	// The studio's own places: all parts of its one long page.
	const studio = `${base}/studio`;
	const studioNav = [
		{ label: 'What we do', href: `${studio}#what` },
		{ label: 'Work', href: `${studio}#work` },
		{ label: 'How it works', href: `${studio}#how` },
		{ label: 'Prices', href: `${studio}#prices` },
		{ label: 'Questions', href: `${studio}#questions` }
	];
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.ico" sizes="48x48" />
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
	<meta name="theme-color" content="#ffffff" />
	<!-- "This profile is ours." Mastodon reads this on every page and shows a
	     green tick beside a link to the site on the profile. -->
	<link rel="me" href={mastodonUrl} />
</svelte:head>

{#if frame === 'company'}
	<div class="shell" data-sveltekit-preload-data="hover">
		<!-- VNTA Studio is reached from the foot and the Company section, not from
		     a bar over the front door. -->
		<header class="masthead">
			<div class="wrap">
				<a class="masthead__mark" href="{base}/" aria-label="VNTA home">
					<Wordmark height={17} />
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each nav as item}
						<a href={item.href} aria-current={(path === '/robotics' && item.label === 'Robotics') || (path === '/robotics/pricing' && item.label === 'Pricing') ? 'page' : undefined}>
							{item.label}
						</a>
					{/each}
				</nav>
				{#if path.startsWith('/robotics')}
					<a class="btn btn--solid btn--small masthead__cta" href="{pricing}#request">
						Validate an integration
						<Icon name="arrow" size={16} />
					</a>
				{:else}
					<a class="btn btn--solid btn--small masthead__cta" href={robotics}>
						Explore Robotics
						<Icon name="arrow" size={16} />
					</a>
				{/if}
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
					<div class="foot__navs">
						<nav aria-label="Site">
							<ul class="foot__nav">
								<li><a href="{base}/">VNTA</a></li>
								<li><a href={robotics}>Robotics</a></li>
								<li><a href={pricing}>Pricing</a></li>
								{#if hasNotes}<li><a href="{base}{notesPath}">Notes</a></li>{/if}
								<li><a href="{base}/#company">Company</a></li>
								<!-- Studio stays findable from the company pages, but a robotics
								     buyer does not need it in their way. -->
								{#if !path.startsWith('/robotics')}<li><a href={studio}>Studio</a></li>{/if}
								<li><a href="{base}/contact">Contact</a></li>
							</ul>
						</nav>
						<!-- VNTA's own profiles, apart from the site's pages. -->
						<nav class="foot__follow" aria-labelledby="foot-follow">
							<h2 id="foot-follow">Follow</h2>
							<ul class="foot__nav">
								{#each social.filter((s) => s.name === 'GitHub').concat(follow) as s}
									<li><a href={s.href} rel="me noopener">{s.name}</a></li>
								{/each}
							</ul>
						</nav>
					</div>
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
{:else if frame === 'studio'}
	<div class="studio" data-sveltekit-preload-data="hover">
		<!-- The way back: on the studio's home page only, a quiet line saying
		     whose studio this is. -->
		{#if path === '/studio'}
			<a class="parentbar" href="{base}/">
				<span class="parentbar__ask">Part of VNTA</span>
				<span class="parentbar__go">The technology company <Icon name="arrow" size={13} /></span>
			</a>
		{/if}
		<header class="masthead">
			<div class="wrap">
				<a class="masthead__mark" href={studio} aria-label="VNTA Studio home">
					<Wordmark height={17} />
					<span class="masthead__sub">Studio</span>
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each studioNav as item}
						<a href={item.href}>{item.label}</a>
					{/each}
					<a class="btn btn--solid btn--small" href="{studio}#quote">Talk to us</a>
				</nav>
			</div>
		</header>

		{@render children()}

		<footer class="foot" data-theme="ink">
			<!-- The symbol, rising behind the foot: large and barely there. -->
			<div class="foot__sun" aria-hidden="true"><Symbol size={0} /></div>
			<div class="wrap">
				<div class="foot__top">
					<div class="foot__us">
						<p>{studioPitch.short}</p>
					</div>

					<nav class="foot__col" aria-labelledby="foot-build">
						<h2 id="foot-build">What we build</h2>
						<ul>
							<li><a href="{studio}#what">Brands</a></li>
							{#each landings as l}
								<li><a href="{studio}/{l.slug}">{l.label}</a></li>
							{/each}
						</ul>
					</nav>

					<nav class="foot__col" aria-labelledby="foot-studio">
						<h2 id="foot-studio">The studio</h2>
						<ul>
							<li><a href="mailto:{studioEmail}">{studioEmail}</a></li>
							<li><a href="{studio}#quote">Contact</a></li>
							{#each follow as s}
								<li><a href={s.href} rel="me noopener">{s.name}</a></li>
							{/each}
							<li><a href="{base}/">VNTA, the company</a></li>
							<li><a href="{base}/legal">Legal</a></li>
							<li><a href="{base}/privacy">Privacy</a></li>
							<li><a href="{base}/terms">Terms</a></li>
						</ul>
					</nav>
				</div>

				<div class="foot__name" aria-hidden="true">
					<Symbol size={0} />
					<Wordmark height={0} label="" tight />
				</div>

				<p class="foot__legal">
					<span>Vantanéant International Ltd. Est. 2025</span>
					<span>Dublin and worldwide</span>
				</p>
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

	/* The studio's frame: the older, softer look, on the tokens in tokens.css. */
	.studio {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-ui);
		font-synthesis: none; /* the display face has one weight: never faux-bold */
	}
	.studio :global(main) {
		flex: 1 0 auto;
	}
	.studio .masthead__mark {
		align-items: baseline;
		gap: 10px;
	}
	.masthead__sub {
		font-family: var(--font-label);
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		color: var(--ink-60);
	}
</style>
