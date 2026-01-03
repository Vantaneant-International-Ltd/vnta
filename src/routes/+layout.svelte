<script lang="ts">
	import '@fontsource/manrope/400.css';
	import '@fontsource/manrope/500.css';
	import '@fontsource/manrope/600.css';
	import '@fontsource/manrope/700.css';
	import '@fontsource/playfair-display/600.css';
	import '@fontsource/playfair-display/700.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/MAIN DARK.png" media="(prefers-color-scheme: light)" />
	<link rel="icon" type="image/png" href="/MAIN LIGHT.png" media="(prefers-color-scheme: dark)" />
	<link rel="icon" type="image/png" href="/MAIN DARK.png" />
	<meta name="theme-color" content="#000000" />
</svelte:head>

<div class="app-shell">{@render children()}</div>

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

	/* Shared container styles */
	:global(.page-container) {
		max-width: 1120px;
		margin: 0 auto;
		padding: 64px 48px 96px;
		min-height: 100vh;
	}

	:global(.content-width) {
		max-width: 880px;
	}

	/* Shared logo styles */
	:global(.logo) {
		display: block;
		transition: transform 0.3s ease;
	}

	:global(.logo:hover) {
		transform: scale(1.02);
	}

	:global(.logo img) {
		display: block;
		width: 120px;
		height: 120px;
		object-fit: contain;
	}

	/* Shared link styles */
	:global(.email-link) {
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		font-size: 0.95rem;
		transition: all 0.2s ease;
		display: inline-block;
	}

	:global(.email-link:hover) {
		color: rgba(255, 255, 255, 1);
		letter-spacing: 0.01em;
	}

	/* Shared button styles */
	:global(.btn-primary) {
		display: inline-block;
		padding: 16px 32px;
		border-radius: 16px;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: #ffffff;
		text-decoration: none;
		font-weight: 600;
		font-size: 1rem;
		letter-spacing: 0.01em;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
	}

	:global(.btn-primary:hover) {
		border-color: rgba(255, 255, 255, 0.5);
		background: rgba(255, 255, 255, 0.08);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
	}

	:global(.btn-primary:active) {
		transform: translateY(0);
		box-shadow: 0 2px 6px rgba(255, 255, 255, 0.08);
	}

	/* Shared footer styles */
	:global(.footer-section) {
		margin-top: 6rem;
		padding-top: 3rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	:global(.secondary-logo-link) {
		display: block;
		transition: opacity 0.2s ease;
	}

	:global(.secondary-logo-link:hover .secondary-logo) {
		opacity: 1;
	}

	:global(.secondary-logo) {
		display: block;
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	:global(.secondary-logo img) {
		width: 200px;
		height: 60px;
		object-fit: contain;
	}

	/* Responsive */
	@media (max-width: 768px) {
		:global(.page-container) {
			padding: 48px 24px 80px;
		}

		:global(.logo img) {
			width: 80px;
			height: 80px;
		}

		:global(.footer-section) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.app-shell {
		min-height: 100vh;
	}
</style>
