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
	<!-- A small card in the corner, so it never covers the page it sits on. -->
	<aside class="cb" data-theme="ink" role="region" aria-label="Cookies">
		<p class="cb__copy">
			We use cookies to run the site and, if you accept, to count visits. No
			advertising. <a class="cb__link" href="{base}/privacy">Privacy</a>
		</p>
		<div class="cb__actions">
			<button class="btn btn--ghost btn--small cb__btn" onclick={decline}>Decline</button>
			<button class="btn btn--solid btn--small cb__btn" onclick={accept}>Accept</button>
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
		border-radius: 20px;
		background: var(--ink-bg);
		color: var(--ink-fg);
		border: 1px solid var(--line-soft);
	}
	.cb__copy {
		margin: 0;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-80);
		text-wrap: pretty;
	}
	.cb__link {
		color: var(--ink);
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
	}
</style>
