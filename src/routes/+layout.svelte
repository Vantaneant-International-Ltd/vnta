<script lang="ts">
	// Warm-editorial direction (Anthropic/Kering/BlackRock). Marcellus (Optima
	// substitute, 400 only) carries display; Manrope carries body.
	import '$lib/styles/tokens.css';
	import '@fontsource/marcellus/400.css';
	import '@fontsource/marcellus-sc/400.css';
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';

	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { trackPageView } from '$lib/analytics';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import AtmosphereBackground from '$lib/components/ui/AtmosphereBackground.svelte';

	let { children } = $props();

	// GA page_view on every client navigation (also fires on first mount).
	afterNavigate(({ to }) => {
		if (to?.url) trackPageView(to.url);
	});

	// --- Maintenance lock ------------------------------------------------------
	// Flip to false to take the public site live again. /admin stays reachable
	// so operators can keep triaging applications + inquiries during the lock.
	const MAINTENANCE = false;
	const maintenance = $derived(
		MAINTENANCE && !$page.url.pathname.startsWith(`${base}/admin`)
	);
	// ---------------------------------------------------------------------------

	// --- Atmosphere background ------------------------------------------------
	// Decorative premium background, wired once here so every PUBLIC marketing page
	// inherits it. Excluded from /portal (its own institutional register) and
	// /admin (a functional app). Landing gets the fuller 'hero' bloom; content-heavy
	// pages get the reduced 'dense' preset.
	const atmoPath = $derived($page.url.pathname.replace(base, '') || '/');
	const showAtmo = $derived(
		!atmoPath.startsWith('/portal') && !atmoPath.startsWith('/admin')
	);
	const atmoIntensity = $derived<'hero' | 'dense'>(atmoPath === '/' ? 'hero' : 'dense');
	// ---------------------------------------------------------------------------

	// Svelte 5 runes (SvelteKit 2)
	let mobileOpen = $state(false);

	// Minimal header tabs (soft launch): keep core only
	const nav = [
		{ label: 'The Studio', href: `${base}/about` },
		{ label: 'Engagement', href: `${base}/explore` },
		{ label: 'Houses', href: `${base}/houses` }
	];

	const socials = [
		{ name: 'Instagram', href: 'https://www.instagram.com/vntaofficial/' },
		{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/vnta' }
	];

	// Footer routes (internal)
	const footerNav = {
		navigate: [
			{ label: 'The Studio', href: `${base}/about` },
			{ label: 'Engagement', href: `${base}/explore` },
			{ label: 'Houses', href: `${base}/houses` },
			{ label: 'Approach', href: `${base}/approach` },
			{ label: 'Horizon', href: `${base}/horizon` },
			{ label: 'Careers', href: `${base}/careers` }
		],
		legal: [
			{ label: 'Legal', href: `${base}/legal` },
			{ label: 'Privacy', href: `${base}/privacy` },
			{ label: 'Terms', href: `${base}/terms` }
		]
	};

	// The maisons, stewarded under VNTA. Windows per Horizon.
	const footerMaisons = [
		{ name: 'Vendr', status: 'March 2026', href: `${base}/houses` },
		{ name: 'Eirvox', status: 'Summer 2026', href: `${base}/houses` },
		{ name: 'Maison Seul', status: '2027', href: `${base}/houses` }
	];

	const foundedYear = 2025;
	const year = new Date().getFullYear();
	const yearLabel = year > foundedYear ? `${foundedYear}-${year}` : `${foundedYear}`;

	function isActive(href: string) {
		const path = $page.url.pathname.replace(/\/$/, '');
		const target = href.replace(base, '').replace(/\/$/, '') || '/';
		const current = path || '/';
		return current === target;
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<svelte:head>
	{#if maintenance}
		<meta name="robots" content="noindex" />
	{/if}
	<link rel="icon" type="image/svg+xml" href="{base}/symbol.svg" />
	<link rel="apple-touch-icon" href="{base}/symbol.svg" />
	<meta name="theme-color" content="#050505" />

	<!-- Canonical + social defaults (per-page og:title/description override these). -->
	<link rel="canonical" href={`https://vnta.xyz${$page.url.pathname}`} />
	<meta property="og:site_name" content="VNTA" />
	<meta property="og:image" content="https://vnta.xyz/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://vnta.xyz/og.png" />
</svelte:head>

{#if maintenance}
	<main class="maint" in:fade={{ duration: 240 }}>
		<header class="maint__bar">
			<span class="brand maint__lockup">
				<Wordmark height={22} />
			</span>
			<span class="eyebrow">Est. 2025 · Dublin</span>
		</header>

		<section class="maint__core">
			<p class="eyebrow maint__eyebrow">Maintenance</p>
			<h1 class="maint__title">A quiet moment.</h1>
			<p class="maint__lede">
				The site is briefly closed for refinement. The maisons continue, quietly stewarded
				under one system. The studio returns shortly.
			</p>
			<p class="maint__gaelic" lang="ga">Ar ais go luath.</p>

			<hr class="rule maint__rule" />

			<a class="maint__contact" href="mailto:studio@vnta.xyz">
				<span class="eyebrow">Inquiries</span>
				<span class="maint__email">studio@vnta.xyz</span>
			</a>
		</section>

		<footer class="maint__bar maint__bar--bottom">
			<span class="eyebrow">Vantanéant International Ltd</span>
			<span class="eyebrow">Dublin / Worldwide</span>
		</footer>
	</main>
{:else}
<div class="app-shell" data-sveltekit-preload-data="hover">
	{#if showAtmo}
		<AtmosphereBackground intensity={atmoIntensity} />
	{/if}
	{#key $page.url.pathname}
		<div class="page" in:fade={{ duration: 140 }}>
			<header class="site-header" aria-label="VNTA header">
				<div class="site-header__inner">
					<a class="brand" href="{base}/" aria-label="VNTA home" onclick={closeMobile}>
						<Wordmark height={26} />
					</a>

					<nav class="nav" aria-label="Primary navigation">
						{#each nav as item}
							<a
								class="nav-link"
								class:is-active={isActive(item.href)}
								href={item.href}
								aria-current={isActive(item.href) ? 'page' : undefined}
							>
								{item.label}
							</a>
						{/each}
					</nav>

					<div class="mobile-controls">
						<button
							type="button"
							class="menu-btn"
							aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={mobileOpen}
							onclick={() => (mobileOpen = !mobileOpen)}
						>
							{#if mobileOpen}
								<span class="menu-x" aria-hidden="true">×</span>
							{:else}
								<span class="menu-bars" aria-hidden="true">≡</span>
							{/if}
						</button>
					</div>
				</div>

				{#if mobileOpen}
					<div class="mobile" role="dialog" aria-label="Menu" tabindex="-1">
						<div class="mobile__panel">
							<nav class="mobile__nav" aria-label="Mobile navigation">
								{#each nav as item}
									<a
										class="mobile__link"
										class:is-active={isActive(item.href)}
										href={item.href}
										onclick={closeMobile}
									>
										{item.label}
									</a>
								{/each}
							</nav>
						</div>

						<button type="button" class="mobile__backdrop" aria-label="Close menu" onclick={closeMobile}></button>
					</div>
				{/if}
			</header>

			<main class="site-main">
				{@render children()}
			</main>

			<footer class="site-footer" aria-label="VNTA footer">
				<div class="site-footer__inner">
					<!-- Masthead -->
					<div class="footer-top">
						<div class="footer-brand">
							<a class="footer-mark" href="{base}/" aria-label="VNTA home" onclick={closeMobile}>
								<Wordmark height={30} />
							</a>
							<p class="footer-motto" lang="ga">Áilleacht na Díomhaointe.</p>
						</div>

						<a class="footer-inquire" href="mailto:studio@vnta.xyz">
							<span class="eyebrow">Inquiries</span>
							<span class="footer-inquire__email">studio@vnta.xyz</span>
						</a>
					</div>

					<hr class="footer-rule" />

					<!-- Columns -->
					<div class="footer-grid">
						<div class="footer-col" aria-label="Navigate">
							<p class="footer-title">Navigate</p>
							<div class="footer-links">
								{#each footerNav.navigate as l}
									<a class="footer-link" href={l.href}>{l.label}</a>
								{/each}
							</div>
						</div>

						<div class="footer-col" aria-label="Houses">
							<p class="footer-title">Houses</p>
							<div class="footer-links">
								{#each footerMaisons as m}
									<a class="footer-house" href={m.href}>
										<span class="footer-house__name">{m.name}</span>
										<span class="footer-house__status">{m.status}</span>
									</a>
								{/each}
							</div>
						</div>

						<div class="footer-col" aria-label="Contact">
							<p class="footer-title">Contact</p>
							<div class="footer-links">
								<a class="footer-link" href="mailto:studio@vnta.xyz" aria-label="Email VNTA">studio@vnta.xyz</a>
								<span class="footer-meta">Dublin / Worldwide</span>
							</div>

							<div class="footer-socials" aria-label="Social links">
								{#each socials as s}
									<a class="social" href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}>
										{#if s.name === 'Instagram'}
											<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
												<path
													fill="currentColor"
													d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4Zm-4.5 4a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.75 6.1a1 1.0 0 0 1 0 2 1 1 0 0 1 0-2Z"
												/>
											</svg>
										{:else}
											<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
												<path
													fill="currentColor"
													d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.66-1.85 3.42-1.85 3.65 0 4.32 2.4 4.32 5.52v6.22ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"
												/>
											</svg>
										{/if}
									</a>
								{/each}
							</div>
						</div>
					</div>

					<div class="footer-bottom">
						<p class="footer-copy">© {yearLabel} Vantanéant International Ltd. Registered in Ireland.</p>

						<nav class="footer-legal" aria-label="Legal links">
							{#each footerNav.legal as l, i}
								<a class="footer-legal-link" href={l.href}>{l.label}</a>
								{#if i < footerNav.legal.length - 1}
									<span class="footer-legal-dot" aria-hidden="true">·</span>
								{/if}
							{/each}
						</nav>
					</div>
				</div>
			</footer>
		</div>
	{/key}
</div>
{/if}

<CookieBanner />

<style>
	/* --- Maintenance holding page — warm editorial --- */
	.maint {
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--paper);
		color: var(--ink);
		display: flex;
		flex-direction: column;
		gap: clamp(36px, 8vh, 72px);
		padding: clamp(22px, 4vw, 44px) clamp(24px, 7vw, 96px);
	}
	.maint__bar { display:flex; align-items:center; justify-content:space-between; gap:18px; flex-wrap:wrap; }
	.maint__bar--bottom { color: var(--ink-50); }
	.maint__core { flex:1; display:flex; flex-direction:column; justify-content:center; max-width:34ch; }
	.maint__eyebrow { margin-bottom: clamp(20px,4vh,30px); color: var(--ink-50); }
	.maint__title { margin:0; font-family:var(--font-display); font-weight:400; font-size:clamp(2.4rem,6.2vw,4rem); line-height:1.04; letter-spacing:var(--track-tight); color:var(--ink); }
	.maint__lede { margin: clamp(18px,3vh,26px) 0 0; max-width:44ch; font-size:1.04rem; line-height:1.65; color:var(--ink-70); }
	.maint__gaelic { margin:14px 0 0; font-family:var(--font-display); font-size:1.1rem; color:var(--ink-35); }
	.maint__rule { margin: clamp(30px,5vh,44px) 0 22px; max-width:320px; }
	.maint__contact { display:inline-flex; align-items:baseline; gap:12px; }
	.maint__email { font-size:0.96rem; color:var(--ink-85); border-bottom:1px solid var(--line); padding-bottom:2px; transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease); }
	.maint__contact:hover .maint__email { color:var(--ink); border-bottom-color: var(--ink); }
	@media (max-width:600px){ .maint{padding:26px 22px 30px; gap:36px;} }

	/* --- Global base --- */
	:global(body) {
		margin:0; min-height:100vh;
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
	:global(.page-container){ max-width:var(--maxw); margin:0 auto; padding: clamp(48px,7vw,96px) clamp(24px,5vw,48px) clamp(72px,9vw,128px); }
	:global(.content-width){ max-width: 880px; }

	/* Buttons — square, flat, no lift/shadow/pill */
	:global(.btn-primary){ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:var(--radius); background:var(--ink); color:var(--paper); border:1px solid var(--ink); font-family:var(--font-body); font-weight:600; font-size:0.9rem; letter-spacing:0.01em; cursor:pointer; transition: background var(--dur) var(--ease); }
	:global(.btn-primary:hover){ background:var(--ink-85); }
	:global(.btn-ghost){ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 24px; border-radius:var(--radius); background:transparent; color:var(--ink); border:1px solid var(--line); font-family:var(--font-body); font-weight:600; font-size:0.9rem; letter-spacing:0.01em; cursor:pointer; transition: border-color var(--dur) var(--ease); }
	:global(.btn-ghost:hover){ border-color:var(--ink); }
	:global(.logo){ display:block; }
	:global(.logo img){ display:block; height:30px; width:auto; }

	.app-shell{ min-height:100vh; }
	.page{ min-height:100vh; display:flex; flex-direction:column; }
	.site-main{ flex:1 0 auto; }

	/* --- Header — flat paper, hairline base, no glass --- */
	.site-header{ position:sticky; top:0; z-index:50; background:var(--paper); border-bottom:1px solid var(--line); }
	.site-header__inner{ max-width:var(--maxw); margin:0 auto; padding:14px clamp(24px,5vw,48px); display:flex; align-items:center; justify-content:space-between; gap:18px; }
	.brand{ display:inline-flex; align-items:center; }
	.nav{ display:flex; align-items:center; gap:28px; }
	.nav-link{ font-size:0.74rem; letter-spacing:0.14em; text-transform:uppercase; font-weight:600; color:var(--ink-50); padding:6px 0; position:relative; transition:color var(--dur) var(--ease); }
	.nav-link:hover{ color:var(--ink); }
	.nav-link::after{ content:''; position:absolute; left:0; bottom:0; width:100%; height:1px; background:var(--ink); transform:scaleX(0); transform-origin:left; transition:transform var(--dur) var(--ease); }
	.nav-link:hover::after, .nav-link.is-active::after{ transform:scaleX(1); }
	.nav-link.is-active{ color:var(--ink); }

	.mobile-controls{ display:none; align-items:center; gap:10px; }
	.menu-btn{ border:1px solid var(--line); background:transparent; color:var(--ink); border-radius:var(--radius); width:42px; height:42px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color var(--dur) var(--ease); }
	.menu-btn:hover{ border-color:var(--ink); }
	.menu-bars,.menu-x{ font-size:22px; line-height:1; }

	.mobile{ position:relative; }
	.mobile__panel{ position:absolute; right:clamp(16px,4vw,24px); top:8px; width:min(340px, calc(100vw - 32px)); border-radius:var(--radius); border:1px solid var(--line); background:var(--paper); z-index:60; overflow:hidden; }
	.mobile__nav{ display:flex; flex-direction:column; padding:8px; }
	.mobile__link{ padding:13px 14px; border-radius:var(--radius); font-weight:600; letter-spacing:0.08em; text-transform:uppercase; font-size:0.8rem; color:var(--ink-70); transition:background var(--dur) var(--ease), color var(--dur) var(--ease); }
	.mobile__link:hover, .mobile__link.is-active{ background:var(--paper-2); color:var(--ink); }
	.mobile__backdrop{ position:fixed; inset:0; background:transparent; border:0; z-index:55; cursor:default; }

	/* --- Footer — deliberate inverted ink band, institutional masthead --- */
	.site-footer{ margin-top:var(--section-y); background:var(--ink-bg); color:var(--ink-fg); }
	.site-footer__inner{ max-width:var(--maxw); margin:0 auto; padding: clamp(56px,7vw,96px) clamp(24px,5vw,48px) clamp(32px,4vw,44px); }

	/* Masthead */
	.footer-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:clamp(24px,5vw,64px); flex-wrap:wrap; }
	.footer-brand{ display:flex; flex-direction:column; gap:18px; }
	.footer-mark{ color:var(--ink-fg); display:inline-flex; }
	.footer-motto{ margin:0; font-family:var(--font-display); font-size:var(--t-h4); letter-spacing:var(--track-tight); color: rgba(255,255,255,0.78); }
	.footer-inquire{ display:flex; flex-direction:column; gap:8px; align-items:flex-start; }
	.footer-inquire .eyebrow{ color: rgba(255,255,255,0.5); }
	.footer-inquire__email{ font-family:var(--font-display); font-size:clamp(1.5rem,3vw,2rem); letter-spacing:var(--track-tight); color:var(--ink-fg); border-bottom:1px solid rgba(255,255,255,0.22); padding-bottom:3px; transition:border-color var(--dur) var(--ease); }
	.footer-inquire:hover .footer-inquire__email{ border-bottom-color:var(--ink-fg); }

	.footer-rule{ height:1px; border:0; margin:clamp(40px,5vw,64px) 0 clamp(36px,4vw,48px); background: rgba(255,255,255,0.16); }

	/* Columns */
	.footer-grid{ display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:clamp(28px,4vw,56px); align-items:start; }
	.footer-col{ min-width:0; }
	.footer-title{ margin:0 0 18px; font-family:var(--font-sc); font-size:var(--t-label); letter-spacing:var(--track-label); text-transform:uppercase; color: rgba(255,255,255,0.45); }
	.footer-links{ display:flex; flex-direction:column; gap:12px; }
	.footer-link{ color: rgba(255,255,255,0.82); transition:color var(--dur) var(--ease); width:fit-content; }
	.footer-link:hover{ color:var(--ink-fg); }
	.footer-meta{ color: rgba(255,255,255,0.45); font-size:0.92rem; }

	/* Houses list with status */
	.footer-house{ display:flex; align-items:baseline; justify-content:space-between; gap:16px; max-width:240px; color: rgba(255,255,255,0.82); transition:color var(--dur) var(--ease); }
	.footer-house:hover{ color:var(--ink-fg); }
	.footer-house__name{ font-family:var(--font-display); font-size:1.05rem; }
	.footer-house__status{ font-family:var(--font-sc); font-size:0.66rem; letter-spacing:0.12em; text-transform:uppercase; color: rgba(255,255,255,0.4); white-space:nowrap; }

	.footer-socials{ margin-top:20px; display:flex; gap:10px; }
	.social{ width:38px; height:38px; border-radius:var(--radius); border:1px solid rgba(255,255,255,0.18); display:inline-flex; align-items:center; justify-content:center; color: rgba(255,255,255,0.8); transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease); }
	.social:hover{ border-color:var(--ink-fg); color:var(--ink-fg); }

	.footer-bottom{ margin-top: clamp(48px,6vw,72px); padding-top:20px; border-top:1px solid rgba(255,255,255,0.14); display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
	.footer-copy{ margin:0; color: rgba(255,255,255,0.5); font-size:0.78rem; letter-spacing:0.02em; }
	.footer-legal{ display:flex; align-items:center; gap:10px; }
	.footer-legal-link{ font-size:0.78rem; color: rgba(255,255,255,0.55); letter-spacing:0.02em; transition:color var(--dur) var(--ease); }
	.footer-legal-link:hover{ color:var(--ink-fg); }
	.footer-legal-dot{ color: rgba(255,255,255,0.25); }

	@media (max-width:760px){
		.footer-grid{ grid-template-columns:1fr 1fr; gap:32px 24px; }
		.footer-top{ flex-direction:column; gap:32px; }
	}
	@media (max-width:460px){ .footer-grid{ grid-template-columns:1fr; } }
	@media (max-width:768px){
		.nav{ display:none; }
		.mobile-controls{ display:inline-flex; }
	}
</style>
