<script lang="ts">
	// Chrome for every public page: the masthead and the foot. There are three
	// kinds of page, and each gets its own frame:
	//
	//   company   VNTA Personal: the public site. Everything except the two below.
	//             Wrapped in .shell and drawn by styles/system.css.
	//   app       /app and the pages under it: the signed-in product, which draws
	//             its own shell and carries no public header, footer or cookie banner.
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
	import '$lib/styles/vnta.css';
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
	import { mastodonUrl, social, follow, pitch, siteUrl } from '$lib/content/site';
	import { pitch as studioPitch, landings, studioEmail } from '$lib/content/studio';

	let { children } = $props();

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
		path.startsWith('/portal')
			? 'portal'
			: path === '/app' || path.startsWith('/app/')
				? 'app'
				: path === '/personal'
					? 'company'
					: 'studio'
	);

	// The sections of the home page. The one call to action is the beta list.
	const nav = [
		{ label: 'What it handles', href: `${base}/personal#handles` },
		{ label: 'How it works', href: `${base}/personal#how` },
		{ label: 'Privacy', href: `${base}/personal#privacy` },
		{ label: 'FAQ', href: `${base}/personal#faq` }
	];
	const beta = `${base}/personal#beta`;
	const host = siteUrl.replace(/^https?:\/\//, '');

	// The studio's own places: all parts of its one long page.
	// The studio is the front page. Its pages for each kind of job live under /studio.
	const studio = `${base}/studio`;
	const home = `${base}/`;
	const studioNav = [
		{ label: 'What we do', href: `${home}#what` },
		{ label: 'Work', href: `${home}#work` },
		{ label: 'How it works', href: `${home}#how` },
		{ label: 'Prices', href: `${home}#prices` },
		{ label: 'Questions', href: `${home}#questions` }
	];
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.ico" sizes="48x48" />
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/apple-touch-icon.png" />
	<meta name="theme-color" content="#f6f4ef" />
	<!-- "This profile is ours." Mastodon reads this on every page and shows a
	     green tick beside a link to the site on the profile. -->
	<link rel="me" href={mastodonUrl} />
</svelte:head>

{#if frame === 'company'}
	<div class="shell" data-sveltekit-preload-data="hover">
		<a class="skip" href="#main">Skip to content</a>
		<header class="masthead">
			<!-- Pinned with the header on every main-site page: the way into the studio. -->
			<a class="studiobar" href={home}>
				<span class="studiobar__ask">Need a website or brand built?</span>
				<span class="studiobar__go">VNTA Studio <Icon name="arrow" size={14} /></span>
			</a>
			<div class="wrap">
				<a class="masthead__mark" href="{base}/" aria-label="VNTA home">
					<Wordmark height={17} /><span class="dot" aria-hidden="true">.</span>
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each nav as item}
						<a href={item.href}>{item.label}</a>
					{/each}
				</nav>
				<a class="btn btn--solid btn--small masthead__cta" href={beta}>
					Join the private beta
					<Icon name="arrow" size={16} />
				</a>
			</div>
		</header>

		<div id="main" class="main-target" tabindex="-1">
			{@render children()}
		</div>

		<footer class="foot" data-theme="ink">
			<div class="wrap">
				<div class="foot__top">
					<div>
						<a class="foot__mark" href="{base}/" aria-label="VNTA home">
							<Wordmark height={20} />
						</a>
						<p class="foot__line">{pitch.descriptor}. {pitch.headline}</p>
					</div>
					<div class="foot__navs">
						<nav aria-label="Site">
							<ul class="foot__nav">
								<li><a href="{base}/personal#handles">What it handles</a></li>
								<li><a href="{base}/personal#how">How it works</a></li>
								<li><a href="{base}/personal#privacy">Privacy</a></li>
								<li><a href="{base}/personal#faq">FAQ</a></li>
								<li><a href={home}>VNTA Studio</a></li>
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
{:else if frame === 'app'}
	<!-- The app draws its own shell (routes/app/+layout.svelte). Nothing public wraps it. -->
	<div class="shell shell--app">{@render children()}</div>
{:else if frame === 'studio'}
	<div class="studio" data-sveltekit-preload-data="hover">
		<header class="masthead">
			<div class="wrap">
				<a class="masthead__mark" href={home} aria-label="VNTA Studio home">
					<Wordmark height={17} />
					<span class="masthead__sub">Studio</span>
				</a>
				<nav class="masthead__nav" aria-label="Primary">
					{#each studioNav as item}
						<a href={item.href}>{item.label}</a>
					{/each}
					<a class="btn btn--solid btn--small" href="{home}#quote">Talk to us</a>
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
							<li><a href="{home}#what">Brands</a></li>
							{#each landings as l}
								<li><a href="{studio}/{l.slug}">{l.label}</a></li>
							{/each}
						</ul>
					</nav>

					<nav class="foot__col" aria-labelledby="foot-studio">
						<h2 id="foot-studio">The studio</h2>
						<ul>
							<li><a href="mailto:{studioEmail}">{studioEmail}</a></li>
							<li><a href="{home}#quote">Contact</a></li>
							{#each follow as s}
								<li><a href={s.href} rel="me noopener">{s.name}</a></li>
							{/each}
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

{#if frame !== 'app'}<CookieBanner />{/if}

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: #ffffff;
		color: #0b0a10;
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
	.shell .masthead__mark .dot {
		color: var(--blue);
		font-weight: 700;
		font-size: 1.5rem;
		line-height: 1;
		margin-left: 1px;
		align-self: flex-end;
	}
	.main-target {
		display: contents;
	}
	.skip {
		position: absolute;
		left: -9999px;
		top: 8px;
		background: var(--paper);
		color: var(--ink);
		padding: 8px 12px;
		border-radius: 8px;
		z-index: 10;
	}
	.skip:focus {
		left: 12px;
	}
	.masthead__sub {
		font-family: var(--font-label);
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		color: var(--ink-60);
	}
</style>
