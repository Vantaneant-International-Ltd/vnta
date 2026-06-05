// ============================================================
// VNTA — Google Analytics pageview tracker (SvelteKit-aware)
// ============================================================
// The gtag snippet in app.html loads with `send_page_view: false`
// because SvelteKit navigates client-side — GA's auto-pageview would
// only fire on the initial hard load. +layout.svelte calls trackPageView()
// from afterNavigate (which also runs on first mount), so GA records the
// real route on every navigation.
//
// Consent is enforced by gtag itself (Consent Mode v2, default-denied in
// app.html). While analytics_storage is denied these page_view events are
// dropped to cookie-less pings; on Accept they start being recorded. So we
// fire freely — gtag respects consent.
// ============================================================

const GA_ID = 'G-81P6Q4C2QR';

declare global {
	interface Window {
		gtag?: (...args: unknown[]) => void;
	}
}

/** Emit a GA page_view for the given URL. Safe to call before gtag has
 *  loaded (no-op) and on every navigation. */
export function trackPageView(url: URL): void {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
	window.gtag('event', 'page_view', {
		page_location: url.href,
		page_path: url.pathname + url.search,
		page_title: document.title,
		send_to: GA_ID
	});
}
