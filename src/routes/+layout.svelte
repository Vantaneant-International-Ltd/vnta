<script lang="ts">
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';
	import '@fontsource/playfair-display/600.css';
	import '@fontsource/playfair-display/700.css';

	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	// Svelte 5 runes (SvelteKit 2)
	let mobileOpen = $state(false);

	// Minimal header tabs (soft launch): keep core only
	const nav = [
		{ label: 'The Studio', href: `${base}/about` },
		{ label: 'Explore', href: `${base}/explore` },
		{ label: 'Packages', href: `${base}/pricing` }
	];

	const socials = [
		{ name: 'Instagram', href: 'https://www.instagram.com/vntaofficial/' },
		{ name: 'LinkedIn', href: 'https://www.linkedin.com/company/vnta' }
	];

	// Footer routes (internal)
	const footerNav = {
		houses: { label: 'Houses', href: `${base}/houses` },
		company: [
			{ label: 'Approach', href: `${base}/approach` },
			{ label: 'Horizon', href: `${base}/horizon` },
			{ label: 'Careers', href: `${base}/careers` },
			{ label: 'Legal', href: `${base}/legal` },
			{ label: 'Privacy', href: `${base}/privacy` },
			{ label: 'Terms', href: `${base}/terms` }
		]
	};

	// Founded 2025 → show range automatically
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

	// Only animate like "pages" for top-level tabs (and footer pages)
	const tabRoutes = new Set([
		'/about',
		'/explore',
		'/pricing',
		'/approach',
		'/horizon',
		'/careers',
		'/',
		'/houses',
		'/legal',
		'/privacy',
		'/terms'
	]);

	function shouldAnimate(pathname: string) {
		const clean = pathname.replace(/\/$/, '') || '/';
		return tabRoutes.has(clean);
	}
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="{base}/main-dark.png" media="(prefers-color-scheme: light)" />
	<link rel="icon" type="image/png" href="{base}/main-dark.png" media="(prefers-color-scheme: dark)" />
	<link rel="icon" type="image/png" href="{base}/main-dark.png" />
	<meta name="theme-color" content="#000000" />
</svelte:head>

<div class="app-shell" data-sveltekit-preload-data="hover">
	{#key $page.url.pathname}
		<div
			class="page"
			in:fly={{
				y: shouldAnimate($page.url.pathname) ? 10 : 0,
				opacity: 0,
				duration: shouldAnimate($page.url.pathname) ? 180 : 0
			}}
		>
			<!-- GLOBAL HEADER -->
			<header class="site-header" aria-label="VNTA header">
				<div class="site-header__inner">
					<a class="brand" href="{base}/" aria-label="VNTA home" on:click={closeMobile}>
						<picture class="logo">
							<source srcset="{base}/main-dark.png" media="(prefers-color-scheme: dark)" />
							<img src="{base}/main-dark.png" alt="VNTA" width="120" height="120" />
						</picture>
					</a>

					<!-- DESKTOP NAV -->
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

						<span class="status" aria-label="Status: Coming soon">Coming Soon</span>
					</nav>

					<!-- MOBILE CONTROLS -->
					<div class="mobile-controls">
						<span class="status status--mobile" aria-label="Status: Coming soon">Coming Soon</span>

						<button
							type="button"
							class="menu-btn"
							aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
							aria-expanded={mobileOpen}
							on:click={() => (mobileOpen = !mobileOpen)}
						>
							{#if mobileOpen}
								<span class="menu-x" aria-hidden="true">×</span>
							{:else}
								<span class="menu-bars" aria-hidden="true">≡</span>
							{/if}
						</button>
					</div>
				</div>

				<!-- MOBILE DROPDOWN -->
				{#if mobileOpen}
					<div class="mobile" role="dialog" aria-label="Menu">
						<div class="mobile__panel">
							<nav class="mobile__nav" aria-label="Mobile navigation">
								{#each nav as item}
									<a
										class="mobile__link"
										class:is-active={isActive(item.href)}
										href={item.href}
										on:click={closeMobile}
									>
										{item.label}
									</a>
								{/each}
							</nav>
						</div>

						<button type="button" class="mobile__backdrop" aria-label="Close menu" on:click={closeMobile} />
					</div>
				{/if}
			</header>

			<!-- PAGE CONTENT -->
			<main class="site-main">
				{@render children()}
			</main>

			<!-- GLOBAL FOOTER (LVMH-ish: minimal columns, internal pages) -->
			<footer class="site-footer" aria-label="VNTA footer">
				<div class="site-footer__inner">
					<!-- Slogan / mark -->
					<p class="footer-slogan">Áilleacht na Díomhaointe.</p>

					<div class="footer-grid">
						<!-- Houses -->
						<div class="footer-col" aria-label="Houses">
							<p class="footer-title">Lineage</p>

							<a class="footer-link" href={footerNav.houses.href}>
								<span>Houses</span>
							</a>
						</div>

						<!-- The Company -->
						<div class="footer-col" aria-label="The Company">
							<p class="footer-title">The Company</p>

							<div class="footer-links">
								{#each footerNav.company as l}
									<a class="footer-link footer-link--plain" href={l.href}>{l.label}</a>
								{/each}
							</div>
						</div>

						<!-- Contact + socials -->
						<div class="footer-col" aria-label="Contact">
							<p class="footer-title">Contact</p>

							<!-- Link is the CTA; email stays hidden -->
							<a class="footer-link footer-link--plain" href="mailto:studio@vnta.xyz" aria-label="Email VNTA">
								Email Us
							</a>

							<p class="footer-muted">Selected client work available on request.</p>

							<div class="footer-socials" aria-label="Social links">
								{#each socials as s}
									<a class="social" href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}>
										{#if s.name === 'Instagram'}
											<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
												<path
													fill="currentColor"
													d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4Zm-4.5 4a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.75 6.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
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

					<p class="footer-copy">© {yearLabel} Vantanéant International Ltd.</p>
				</div>
			</footer>
		</div>
	{/key}
</div>

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		background: #000000;
		color: #ffffff;
		font-family: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(*:focus-visible) {
		outline: 2px solid rgba(255, 255, 255, 0.5);
		outline-offset: 3px;
		border-radius: 4px;
	}

	:global(.page-container) {
		max-width: 1120px;
		margin: 0 auto;
		padding: 64px 48px 96px;
	}

	:global(.content-width) {
		max-width: 880px;
	}

	:global(.logo) {
		display: block;
		transition: transform 0.3s ease;
	}

	:global(.logo:hover) {
		transform: scale(1.02);
	}

	:global(.logo img) {
		display: block;
		width: 104px;
		height: 104px;
		object-fit: contain;
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

	/* HEADER (reduced height) */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: rgba(0, 0, 0, 0.78);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.site-header__inner {
		max-width: 1120px;
		margin: 0 auto;
		padding: 12px 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
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

	.mobile__backdrop {
		position: fixed;
		inset: 0;
		background: transparent;
		border: 0;
		z-index: 55;
		cursor: default;
	}

	/* FOOTER (editorial columns) */
	.site-footer {
		margin-top: 56px;
		padding-top: 22px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.site-footer__inner {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px 44px;
	}

	.footer-slogan {
		margin: 0 0 18px;
		font-family: 'Playfair Display', serif;
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

	.footer-arrow {
		color: rgba(255, 255, 255, 0.45);
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

	.footer-copy {
		margin: 18px 0 0;
		color: rgba(255, 255, 255, 0.34);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
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

		:global(.logo img) {
			width: 72px;
			height: 72px;
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
