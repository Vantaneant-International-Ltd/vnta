<script lang="ts">
	// VNTA cookie consent — drives Google Consent Mode v2 (gtag is loaded in
	// app.html with analytics_storage default-denied). Accept flips it to
	// granted; Decline leaves it denied (cookie-less pings only).
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	const STORAGE_KEY = 'vnta-cookie-consent';
	let visible = $state(false);

	function gtagConsent(analyticsGranted: boolean) {
		if (typeof window.gtag !== 'function') return;
		window.gtag('consent', 'update', {
			analytics_storage: analyticsGranted ? 'granted' : 'denied',
			ad_storage: 'denied',
			ad_user_data: 'denied',
			ad_personalization: 'denied'
		});
	}

	onMount(() => {
		try {
			visible = !localStorage.getItem(STORAGE_KEY);
		} catch {
			// localStorage blocked (private mode etc.) — show the banner once.
			visible = true;
		}
	});

	function accept() {
		try {
			localStorage.setItem(STORAGE_KEY, 'all');
		} catch {
			/* ignore */
		}
		gtagConsent(true);
		visible = false;
	}

	function decline() {
		try {
			localStorage.setItem(STORAGE_KEY, 'essential');
		} catch {
			/* ignore */
		}
		gtagConsent(false);
		visible = false;
	}
</script>

{#if visible}
	<!-- A small card in the corner, so it never covers the page it sits on. It
	     is outside the public shell, so it carries its own colours. -->
	<aside class="cb" role="region" aria-label="Cookies">
		<p class="cb__copy">
			We use cookies to run the site and, if you accept, to count visits. No
			advertising. <a class="cb__link" href="{base}/privacy">Privacy</a>
		</p>
		<div class="cb__actions">
			<button class="cb__btn" onclick={decline}>Decline</button>
			<button class="cb__btn cb__btn--solid" onclick={accept}>Accept</button>
		</div>
	</aside>
{/if}

<style>
	.cb {
		position: fixed;
		left: 16px;
		right: 16px;
		bottom: calc(16px + env(safe-area-inset-bottom, 0px));
		z-index: 200;
		display: grid;
		gap: 14px;
		max-width: 400px;
		padding: 18px 20px;
		border-radius: 14px;
		background: #0f1b2d;
		border: 1px solid #26364d;
		color: #d6dde8;
		font-family: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}
	.cb__copy {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
		text-wrap: pretty;
	}
	.cb__link {
		color: #ffffff;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.cb__actions {
		display: flex;
		gap: 8px;
	}
	.cb__btn {
		flex: 1;
		min-height: 44px;
		border-radius: 10px;
		border: 1px solid #33435b;
		background: transparent;
		color: #ffffff;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 600;
		cursor: pointer;
	}
	.cb__btn:hover {
		border-color: #6f7d92;
	}
	.cb__btn--solid {
		background: #ffffff;
		border-color: #ffffff;
		color: #0f1b2d;
	}
	.cb__btn--solid:hover {
		background: #e6ebf2;
	}
	.cb__btn:focus-visible {
		outline: 2px solid #8fb4ff;
		outline-offset: 3px;
	}
</style>
