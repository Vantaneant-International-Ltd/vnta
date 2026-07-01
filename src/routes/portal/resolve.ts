// =============================================================================
// VNTA Client Portal — identity + data resolution
// -----------------------------------------------------------------------------
// Access is enforced at the edge by Cloudflare Access (email one-time code).
// This module never authenticates; it only turns the already-authenticated
// identity into the one client data file that session is allowed to see.
// =============================================================================

import { CLIENT_BY_EMAIL, DEFAULT_CLIENT_ID } from './content/clients';
import type { PortalData } from './content/types';

/** Header Cloudflare Access injects on every request it lets through. */
export const CF_ACCESS_EMAIL_HEADER = 'cf-access-authenticated-user-email';

/**
 * Server / edge contexts (the future standalone app) read the email straight
 * from the request header. Kept pure and framework free for that lift.
 */
export function emailFromHeaders(headers: Headers): string | null {
	return headers.get(CF_ACCESS_EMAIL_HEADER);
}

/**
 * Static client build: this site is served without an app server, so we read
 * the same Access identity the header carries from Cloudflare's browser-facing
 * identity endpoint. No Access in front (local dev) resolves to null.
 */
export async function getAuthenticatedEmail(): Promise<string | null> {
	try {
		const res = await fetch('/cdn-cgi/access/get-identity', { credentials: 'include' });
		if (!res.ok) return null;
		const identity = await res.json();
		return typeof identity?.email === 'string' ? identity.email : null;
	} catch {
		return null;
	}
}

/**
 * Resolve an authenticated email to a client id.
 *   null email        -> default client (local dev, no Access in front)
 *   mapped email       -> that client
 *   unmapped email     -> null (authenticated, but not a portal client: deny)
 */
export function resolveClientId(email: string | null): string | null {
	if (email == null) return DEFAULT_CLIENT_ID;
	return CLIENT_BY_EMAIL[email.trim().toLowerCase()] ?? null;
}

// Each client's JSON is a separate lazy chunk. Only the resolved client's file
// is ever fetched by the browser, so no other client's data ships this session.
const loaders = import.meta.glob<{ default: PortalData }>('./content/*.json');

export async function loadClientData(clientId: string): Promise<PortalData | null> {
	const load = loaders[`./content/${clientId}.json`];
	if (!load) return null;
	const mod = await load();
	return mod.default;
}
