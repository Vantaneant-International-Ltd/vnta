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
	<aside class="cb" data-theme="ink" role="region" aria-label="Cookie consent">
		<p class="cb__copy">
			<span class="eyebrow cb__label">Cookies</span>
			VNTA uses essential cookies to run the site, plus anonymous analytics to
			refine it. No advertising, ever.
			<a class="cb__link" href="{base}/privacy">Privacy</a>
		</p>
		<div class="cb__actions">
			<button class="btn-ghost cb__btn" onclick={decline}>Decline</button>
			<button class="btn-primary cb__btn" onclick={accept}>Accept</button>
		</div>
	</aside>
{/if}

<style>
	.cb {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: clamp(16px, 4vw, 48px);
		flex-wrap: wrap;
		background: var(--ink-bg);
		color: var(--ink-fg);
		border-top: 1px solid var(--line);
		padding: clamp(16px, 2.4vw, 22px) clamp(20px, 6vw, 80px);
		padding-bottom: calc(clamp(16px, 2.4vw, 22px) + env(safe-area-inset-bottom, 0px));
	}

	.cb__copy {
		margin: 0;
		max-width: 70ch;
		font-size: 0.9rem;
		line-height: 1.7;
		color: var(--ink-65);
	}

	.cb__label {
		margin-right: 10px;
		color: var(--ink-45);
	}

	.cb__link {
		margin-left: 4px;
		color: var(--ink-80);
		border-bottom: 1px solid var(--line);
		padding-bottom: 1px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.cb__link:hover {
		color: var(--fg);
		border-bottom-color: var(--ink-35);
	}

	.cb__actions {
		display: flex;
		gap: 10px;
		flex-shrink: 0;
	}

	.cb__btn {
		padding: 11px 22px;
		font-size: 0.82rem;
	}

	@media (max-width: 600px) {
		.cb {
			flex-direction: column;
			align-items: stretch;
			gap: 14px;
			padding: 18px 22px;
			padding-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
		}

		.cb__actions {
			justify-content: stretch;
		}

		.cb__btn {
			flex: 1;
		}
	}
</style>
