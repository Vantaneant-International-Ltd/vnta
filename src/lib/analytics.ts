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

/** The signed-in app. No analytics here, ever: its addresses carry document ids. */
export const isAppPath = (pathname: string) => pathname === '/app' || pathname.startsWith('/app/');

/** Emit a GA page_view for the given URL. Safe to call before gtag has
 *  loaded (no-op) and on every navigation. Never reports anything inside the app. */
export function trackPageView(url: URL): void {
	if (typeof window === 'undefined') return;
	// Google's own switch: while it is true, nothing is sent, even if gtag was
	// loaded earlier on a public page and the person then moved into the app.
	(window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = isAppPath(url.pathname);
	if (isAppPath(url.pathname) || typeof window.gtag !== 'function') return;
	window.gtag('event', 'page_view', {
		page_location: url.href,
		page_path: url.pathname + url.search,
		page_title: document.title,
		send_to: GA_ID
	});
}
