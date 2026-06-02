<script lang="ts">
	// Balanced direction: Marcellus (flared Optima-alike) carries the display
	// voice from the Felixto guide; Manrope returns for body so text reads warm.
	import '@fontsource/marcellus/400.css';
	import '@fontsource/marcellus-sc/400.css';
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';

	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	// --- Maintenance lock ------------------------------------------------------
	// Flip to false to take the public site live again. /admin stays reachable
	// so operators can keep triaging applications + inquiries during the lock.
	const MAINTENANCE = true;
	const maintenance = $derived(
		MAINTENANCE && !$page.url.pathname.startsWith(`${base}/admin`)
	);
	// ---------------------------------------------------------------------------

	// Svelte 5 runes (SvelteKit 2)
	let mobileOpen = $state(false);

	// --- Language (EN / GA) ----------------------------------------------------
	// Honest note: modern standard spelling is **Gaeilge** (no fada). "Gaéilge" is an older/less common variant.
	type Lang = 'en' | 'ga';
	let lang = $state<Lang>('en');
	let langOpen = $state(false);

	const i18n = {
		en: {
			comingSoon: 'Coming Soon',
			theStudio: 'The Studio',
			explore: 'Explore',
			packages: 'Packages',
			lineage: 'Lineage',
			houses: 'Houses',
			theCompany: 'The Company',
			approach: 'Approach',
			horizon: 'Horizon',
			contact: 'Contact',
			emailUs: 'Email Us',
			selectedWork: 'Selected client work available on request.',
			careers: 'Careers',
			legal: 'Legal',
			privacy: 'Privacy',
			terms: 'Terms',
			langEnglish: 'English',
			langIrish: 'Gaeilge'
		},
		ga: {
			comingSoon: 'Go luath',
			theStudio: 'An Stiúideo',
			explore: 'Taiscéal',
			packages: 'Pacáistí',
			lineage: 'Oidhreacht',
			houses: 'Tithe',
			theCompany: 'An Chuideachta',
			approach: 'Cur Chuige',
			horizon: 'Léaslíne',
			contact: 'Teagmháil',
			emailUs: 'Seol Ríomhphost',
			selectedWork: 'Obair roghnaithe do chliaint ar fáil ar iarratas.',
			careers: 'Gairmeacha',
			legal: 'Dlí',
			privacy: 'Príobháideachas',
			terms: 'Téarmaí',
			langEnglish: 'Béarla',
			langIrish: 'Gaeilge'
		}
	} as const;

	const t = (k: keyof (typeof i18n)['en']) => i18n[lang][k];

	function setLang(next: Lang) {
		lang = next;
		langOpen = false;
	}

	function toggleLangMenu() {
		langOpen = !langOpen;
	}

	function closeLangMenu() {
		langOpen = false;
	}

	// Persist + set document lang (client-only)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const stored = window.localStorage.getItem('vnta_lang');
		if (stored === 'en' || stored === 'ga') lang = stored;

		document.documentElement.lang = lang;
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem('vnta_lang', lang);
		document.documentElement.lang = lang;
	});
	// ---------------------------------------------------------------------------

	// Minimal header tabs (soft launch): keep core only
	const nav = [
		{ key: 'theStudio' as const, href: `${base}/about` },
		{ key: 'explore' as const, href: `${base}/explore` },
		{ key: 'packages' as const, href: `${base}/pricing` }
	];

	const socials = [
		{ name: 'Instagram', href: 'https://www.instagram.com/vntaofficial/' },
		{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/vnta' }
	];

	// Footer routes (internal)
	const footerNav = {
		houses: { key: 'houses' as const, href: `${base}/houses` },
		companyPrimary: [
			{ key: 'approach' as const, href: `${base}/approach` },
			{ key: 'horizon' as const, href: `${base}/horizon` }
		],
		legalInline: [
			{ key: 'careers' as const, href: `${base}/careers` },
			{ key: 'legal' as const, href: `${base}/legal` },
			{ key: 'privacy' as const, href: `${base}/privacy` },
			{ key: 'terms' as const, href: `${base}/terms` }
		]
	};

	const foundedYear = 2025;
	const year = new Date().getFullYear();
	const yearLabel = year > foundedYear ? `${foundedYear}–${year}` : `${foundedYear}`;

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
	<meta name="theme-color" content="#000000" />

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
				<img class="brand__mark" src="{base}/symbol.svg" alt="" width="20" height="20" aria-hidden="true" />
				<img class="brand__word" src="{base}/wordmark.svg" alt="VNTA" width="96" height="22" />
			</span>
			<span class="eyebrow">Est. MMXXV · Dublin</span>
		</header>

		<section class="maint__core">
			<p class="eyebrow maint__eyebrow">Maintenance</p>
			<h1 class="maint__title">A quiet moment.</h1>
			<p class="maint__lede">
				The site is briefly closed for refinement. The maisons continue, quietly stewarded
				under one system — the studio returns shortly.
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
	{#key $page.url.pathname}
		<div class="page" in:fade={{ duration: 140 }}>
			<header class="site-header" aria-label="VNTA header">
				<div class="site-header__inner">
					<a class="brand" href="{base}/" aria-label="VNTA home" onclick={closeMobile}>
						<img class="brand__mark" src="{base}/symbol.svg" alt="" width="22" height="22" aria-hidden="true" />
						<img class="brand__word" src="{base}/wordmark.svg" alt="VNTA" width="106" height="25" />
					</a>

					<nav class="nav" aria-label="Primary navigation">
						{#each nav as item}
							<a
								class="nav-link"
								class:is-active={isActive(item.href)}
								href={item.href}
								aria-current={isActive(item.href) ? 'page' : undefined}
							>
								{t(item.key)}
							</a>
						{/each}

						<span class="status" aria-label="Status: Coming soon">{t('comingSoon')}</span>

						<!-- Language dropdown (Amazon-style) -->
						<div class="lang-wrap">
							<button
								type="button"
								class="lang-trigger"
								onclick={toggleLangMenu}
								aria-label="Change language"
								aria-expanded={langOpen}
							>
								<!-- Globe icon -->
								<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
									<path
										fill="currentColor"
										d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm7.93 9h-3.11a15.8 15.8 0 0 0-1.3-5.02A8.02 8.02 0 0 1 19.93 11ZM12 4c.9 0 2.32 2.03 3.1 7H8.9C9.68 6.03 11.1 4 12 4ZM4.07 13h3.11c.18 1.8.64 3.54 1.3 5.02A8.02 8.02 0 0 1 4.07 13Zm3.11-2H4.07a8.02 8.02 0 0 1 4.41-5.02A15.8 15.8 0 0 0 7.18 11ZM12 20c-.9 0-2.32-2.03-3.1-7h6.2c-.78 4.97-2.2 7-3.1 7Zm3.52-1.98c.66-1.48 1.12-3.22 1.3-5.02h3.11a8.02 8.02 0 0 1-4.41 5.02Z"
									/>
								</svg>

								<span class="lang-code">{lang === 'en' ? 'EN' : 'GA'}</span>
							</button>

							{#if langOpen}
								<div class="lang-menu" role="menu" aria-label="Language menu">
									<button
										type="button"
										class="lang-item"
										role="menuitemradio"
										aria-checked={lang === 'en'}
										onclick={() => setLang('en')}
									>
										<span class="lang-item__label">{t('langEnglish')}</span>
										<span class="lang-item__meta">EN</span>
									</button>

									<button
										type="button"
										class="lang-item"
										role="menuitemradio"
										aria-checked={lang === 'ga'}
										onclick={() => setLang('ga')}
									>
										<span class="lang-item__label">{t('langIrish')}</span>
										<span class="lang-item__meta">GA</span>
									</button>
								</div>

								<button
									type="button"
									class="lang-backdrop"
									aria-label="Close language menu"
									onclick={closeLangMenu}
								></button>
							{/if}
						</div>
					</nav>

					<div class="mobile-controls">
						<span class="status status--mobile" aria-label="Status: Coming soon">{t('comingSoon')}</span>

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
										{t(item.key)}
									</a>
								{/each}
							</nav>

							<div class="mobile__meta" aria-label="Language">
								<div class="mobile__lang">
									<button
										type="button"
										class="mobile__lang-item"
										aria-pressed={lang === 'en'}
										onclick={() => setLang('en')}
									>
										English <span class="mobile__lang-code">EN</span>
									</button>
									<button
										type="button"
										class="mobile__lang-item"
										aria-pressed={lang === 'ga'}
										onclick={() => setLang('ga')}
									>
										Gaeilge <span class="mobile__lang-code">GA</span>
									</button>
								</div>
							</div>
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
					<p class="footer-slogan">Áilleacht na Díomhaointe.</p>

					<div class="footer-grid">
						<div class="footer-col" aria-label="Lineage">
							<p class="footer-title">{t('lineage')}</p>

							<a class="footer-link" href={footerNav.houses.href}>
								<span>{t(footerNav.houses.key)}</span>
							</a>
						</div>

						<div class="footer-col" aria-label="The Company">
							<p class="footer-title">{t('theCompany')}</p>

							<div class="footer-links">
								{#each footerNav.companyPrimary as l}
									<a class="footer-link footer-link--plain" href={l.href}>{t(l.key)}</a>
								{/each}
							</div>
						</div>

						<div class="footer-col" aria-label="Contact">
							<p class="footer-title">{t('contact')}</p>

							<a class="footer-link footer-link--plain" href="mailto:studio@vnta.xyz" aria-label="Email VNTA">
								{t('emailUs')}
							</a>

							<p class="footer-muted">{t('selectedWork')}</p>

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
						<p class="footer-copy">© {yearLabel} Vantanéant International Ltd.</p>

						<nav class="footer-legal" aria-label="Legal links">
							{#each footerNav.legalInline as l, i}
								<a class="footer-legal-link" href={l.href}>{t(l.key)}</a>
								{#if i < footerNav.legalInline.length - 1}
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

<style>
	/* --- Maintenance lock — VNTA's own restrained, editorial holding page --- */
	.maint {
		min-height: 100vh;
		min-height: 100dvh;
		background: var(--bg);
		color: var(--fg);
		display: flex;
		flex-direction: column;
		gap: clamp(36px, 8vh, 72px);
		padding: clamp(22px, 4vw, 44px) clamp(24px, 7vw, 96px);
	}

	.maint__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		flex-wrap: wrap;
	}

	.maint__bar--bottom {
		opacity: 0.85;
	}

	.maint__lockup {
		gap: 10px;
	}

	.maint__lockup .brand__mark {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
	}

	.maint__lockup .brand__word {
		height: 20px;
		width: auto;
	}

	.maint__core {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 34ch;
	}

	.maint__eyebrow {
		margin-bottom: clamp(20px, 4vh, 30px);
		color: var(--ink-55);
	}

	.maint__title {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(2.4rem, 6.2vw, 4rem);
		line-height: 1.04;
		letter-spacing: -0.015em;
		color: var(--fg);
	}

	.maint__lede {
		margin: clamp(18px, 3vh, 26px) 0 0;
		max-width: 44ch;
		font-size: 1.04rem;
		line-height: 1.65;
		color: var(--ink-65);
	}

	.maint__gaelic {
		margin: 14px 0 0;
		font-family: var(--font-display);
		font-size: 1.1rem;
		color: var(--ink-45);
	}

	.maint__rule {
		margin: clamp(30px, 5vh, 44px) 0 22px;
		max-width: 320px;
	}

	.maint__contact {
		display: inline-flex;
		align-items: baseline;
		gap: 12px;
		transition: color 0.2s ease;
	}

	.maint__email {
		font-size: 0.96rem;
		color: var(--ink-80);
		border-bottom: 1px solid var(--line);
		padding-bottom: 2px;
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	.maint__contact:hover .maint__email {
		color: var(--fg);
		border-bottom-color: rgba(255, 255, 255, 0.4);
	}

	@media (max-width: 600px) {
		.maint {
			padding: 26px 22px 30px;
			gap: 36px;
		}

		.maint__bar .eyebrow {
			font-size: 0.62rem;
		}
	}

	/* --- Design tokens (single source) ------------------------------------- */
	:root {
		/* Palette — monochrome, but with soft greys/surfaces kept for warmth. */
		--bg: #000000;
		--fg: #ffffff;
		--ink-92: rgba(255, 255, 255, 0.92);
		--ink-80: rgba(255, 255, 255, 0.8);
		--ink-65: rgba(255, 255, 255, 0.65);
		--ink-55: rgba(255, 255, 255, 0.55);
		--ink-45: rgba(255, 255, 255, 0.45);
		--line: rgba(255, 255, 255, 0.12);
		--line-soft: rgba(255, 255, 255, 0.08);
		/* Soft surface fills — the old softness, kept deliberately. */
		--surface: rgba(255, 255, 255, 0.035);
		--surface-2: rgba(255, 255, 255, 0.05);
		/* Gentle depth (used sparingly — the middle ground, not heavy glass). */
		--shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.22);
		--shadow-card: 0 14px 40px rgba(0, 0, 0, 0.2);
		/* Corners — softened back to a warm middle (not square, not the old 18px). */
		--radius: 12px;
		--radius-sm: 10px;
		--radius-pill: 999px;
		--maxw: 1180px;

		/* Typeface — Marcellus display (the flared brand voice) + Manrope body. */
		--font-display: 'Marcellus', 'Optima', 'Times New Roman', serif;
		--font-sc: 'Marcellus SC', 'Marcellus', serif;
		--font-body: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

		/* Display scale (64 / 48 / 36 / 24), fluid for cosy mobile. */
		--t-h1: clamp(2.6rem, 6vw, 3.6rem);
		--t-h2: clamp(2.1rem, 4.6vw, 2.85rem);
		--t-h3: clamp(1.55rem, 3.2vw, 2.1rem);
		--t-h4: clamp(1.2rem, 2.2vw, 1.45rem);
		/* Labels — tracked-out small caps. */
		--t-label: 0.72rem;
		--track-label: 0.18em;
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: var(--bg);
		color: var(--fg);
		font-family: var(--font-body);
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		/* Marcellus ships a single weight; never let the browser fake a bold.
		   Mulish keeps its real 300–700 for body/UI. */
		font-synthesis: none;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	/* Headings — Marcellus throughout, restrained weight, the §4.3 scale. */
	:global(h1, h2, h3, h4, h5, h6) {
		font-family: var(--font-display);
		font-weight: 400;
		letter-spacing: -0.01em;
		line-height: 1.08;
	}

	/* Tracked-out small-caps label — the connective tissue of the system. */
	:global(.eyebrow) {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-45);
		margin: 0;
	}

	/* Hairline rule — §1.4 restraint, structure over decoration. */
	:global(.rule) {
		height: 1px;
		background: var(--line);
		border: 0;
		margin: 0;
	}

	:global(*:focus-visible) {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 3px;
		border-radius: 4px;
	}

	:global(.page-container) {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 64px 48px 96px;
	}

	:global(.content-width) {
		max-width: 880px;
	}

	/* Primary call-to-action — solid, premium, restrained. */
	:global(.btn-primary) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 13px 26px;
		border-radius: var(--radius-pill);
		background: var(--fg);
		color: #0a0a0a;
		border: 1px solid var(--fg);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
	}

	:global(.btn-primary:hover) {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.92);
		box-shadow: var(--shadow-soft);
	}

	:global(.btn-primary:active) {
		transform: translateY(0);
	}

	/* Ghost variant — hairline pill, warms on hover. */
	:global(.btn-ghost) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 13px 26px;
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--fg);
		border: 1px solid var(--line);
		font-family: var(--font-body);
		font-weight: 600;
		font-size: 0.9rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
	}

	:global(.btn-ghost:hover) {
		transform: translateY(-1px);
		background: var(--surface-2);
		border-color: rgba(255, 255, 255, 0.28);
	}

	:global(.logo) {
		display: block;
	}

	:global(.logo img) {
		display: block;
		height: 30px;
		width: auto;
	}

	.app-shell {
		min-height: 100vh;
	}

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.site-main {
		flex: 1 0 auto;
	}

	/* Force pointer events on header (your requested debug fix) */
	.site-header {
		pointer-events: auto;
	}

	.site-header * {
		pointer-events: auto;
	}

	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.78);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.site-header__inner {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 12px 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 11px;
	}

	.brand__mark {
		display: block;
		width: 22px;
		height: 22px;
		/* symbol.svg is OS-scheme adaptive; the header is always black, so
		   force the mark white regardless of the visitor's OS appearance. */
		filter: brightness(0) invert(1);
	}

	.brand__word {
		display: block;
		height: 22px;
		width: auto;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 26px;
	}

	.nav-link {
		font-size: 0.78rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.55);
		padding: 8px 0;
		position: relative;
		transition: color 0.2s ease;
	}

	.nav-link:hover {
		color: rgba(255, 255, 255, 0.92);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 4px;
		width: 100%;
		height: 1px;
		background: rgba(255, 255, 255, 0.35);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.2s ease;
	}

	.nav-link:hover::after {
		transform: scaleX(1);
	}

	.nav-link.is-active {
		color: rgba(255, 255, 255, 0.95);
	}

	.nav-link.is-active::after {
		transform: scaleX(1);
		background: rgba(255, 255, 255, 0.55);
	}

	.status {
		font-size: 0.78rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 600;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.03);
		white-space: nowrap;
	}

	/* Language dropdown */
	.lang-wrap {
		position: relative;
		display: inline-flex;
		align-items: center;
		z-index: 70;
	}

	.lang-trigger {
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.55);
		cursor: pointer;
		padding: 10px 8px;
		border-radius: 12px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 0.74rem;
		line-height: 1;
		transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
	}

	.lang-trigger:hover {
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.04);
		transform: translateY(-1px);
	}

	.lang-code {
		color: rgba(255, 255, 255, 0.75);
	}

	.lang-menu {
		position: absolute;
		right: 0;
		top: calc(100% + 10px);
		min-width: 210px;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.92);
		backdrop-filter: blur(10px);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
		overflow: hidden;
		z-index: 80;
	}

	.lang-item {
		width: 100%;
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.82);
		padding: 14px 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.lang-item:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.95);
	}

	.lang-item[aria-checked='true'] {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.98);
	}

	.lang-item__label {
		font-weight: 650;
		letter-spacing: 0.02em;
	}

	.lang-item__meta {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
	}

	.lang-backdrop {
		position: fixed;
		inset: 0;
		background: transparent;
		border: 0;
		z-index: 75;
		cursor: default;
	}

	.mobile-controls {
		display: none;
		align-items: center;
		gap: 10px;
	}

	.status--mobile {
		padding: 7px 12px;
		font-size: 0.74rem;
		letter-spacing: 0.14em;
	}

	.menu-btn {
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.9);
		border-radius: 14px;
		width: 44px;
		height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.menu-btn:hover {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.05);
		transform: translateY(-1px);
	}

	.menu-bars,
	.menu-x {
		font-size: 22px;
		line-height: 1;
	}

	.mobile {
		position: relative;
	}

	.mobile__panel {
		position: absolute;
		right: 18px;
		top: 8px;
		width: min(340px, calc(100vw - 36px));
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.92);
		backdrop-filter: blur(10px);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
		z-index: 60;
		overflow: hidden;
	}

	.mobile__nav {
		display: flex;
		flex-direction: column;
		padding: 10px;
	}

	.mobile__link {
		padding: 14px 14px;
		border-radius: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		font-size: 0.82rem;
		color: rgba(255, 255, 255, 0.78);
		transition: background 0.15s ease, color 0.15s ease;
	}

	.mobile__link:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.95);
	}

	.mobile__link.is-active {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.98);
	}

	.mobile__meta {
		padding: 10px 12px 12px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.mobile__lang {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.mobile__lang-item {
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: rgba(255, 255, 255, 0.82);
		border-radius: 14px;
		padding: 12px 12px;
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 650;
	}

	.mobile__lang-item[aria-pressed='true'] {
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.96);
	}

	.mobile__lang-code {
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		font-size: 0.78rem;
	}

	.mobile__backdrop {
		position: fixed;
		inset: 0;
		background: transparent;
		border: 0;
		z-index: 55;
		cursor: default;
	}

	.site-footer {
		margin-top: 56px;
		padding-top: 22px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.site-footer__inner {
		max-width: var(--maxw);
		margin: 0 auto;
		padding: 0 48px 44px;
	}

	.footer-slogan {
		margin: 0 0 18px;
		font-family: var(--font-display);
		font-size: 1.05rem;
		letter-spacing: -0.01em;
		color: rgba(255, 255, 255, 0.9);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 1.2fr 0.9fr;
		gap: 24px;
		align-items: start;
	}

	.footer-col {
		min-width: 0;
	}

	.footer-title {
		margin: 0 0 12px;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		font-weight: 700;
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.footer-link {
		display: inline-flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		color: rgba(255, 255, 255, 0.82);
		transition: color 0.2s ease, transform 0.2s ease;
	}

	.footer-link:hover {
		color: rgba(255, 255, 255, 0.98);
		transform: translateY(-1px);
	}

	.footer-link--plain {
		justify-content: flex-start;
	}

	.footer-muted {
		margin: 10px 0 0;
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.9rem;
		line-height: 1.6;
		max-width: 42ch;
	}

	.footer-socials {
		margin-top: 14px;
		display: flex;
		gap: 12px;
	}

	.social {
		width: 40px;
		height: 40px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.03);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.8);
		transition: all 0.2s ease;
	}

	.social:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.28);
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.95);
	}

	.footer-bottom {
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		flex-wrap: wrap;
	}

	.footer-copy {
		margin: 0;
		color: rgba(255, 255, 255, 0.5);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}

	.footer-legal {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.footer-legal-link {
		font-size: 0.78rem;
		color: rgba(255, 255, 255, 0.55);
		letter-spacing: 0.02em;
		transition: color 0.2s ease;
	}

	.footer-legal-link:hover {
		color: rgba(255, 255, 255, 0.7);
	}

	.footer-legal-dot {
		color: rgba(255, 255, 255, 0.22);
	}

	@media (max-width: 900px) {
		.footer-grid {
			grid-template-columns: 1fr;
			gap: 18px;
		}
	}

	@media (max-width: 768px) {
		:global(.page-container) {
			padding: 48px 24px 80px;
		}

		.brand__mark {
			width: 19px;
			height: 19px;
		}

		.brand__word {
			height: 19px;
		}

		.site-header__inner {
			padding: 10px 24px;
		}

		.nav {
			display: none;
		}

		.mobile-controls {
			display: inline-flex;
		}

		.site-footer__inner {
			padding: 0 24px 34px;
		}
	}
</style>
