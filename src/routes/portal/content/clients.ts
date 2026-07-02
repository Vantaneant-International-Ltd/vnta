// =============================================================================
// VNTA Client Portal — client registry
// -----------------------------------------------------------------------------
// Maps a Cloudflare Access authenticated email to a client id. The client id is
// the JSON filename stem in this folder (andrew -> ./andrew.json).
//
// The email is used for ONE thing: selecting a data file. It is never rendered
// and never used for authorisation (Cloudflare Access does that at the edge).
//
// To add a client:
//   1. Add content/<id>.json (copy an existing file, follow types.ts).
//   2. Add one line below: '<their access email>': '<id>'.
//   3. Invite that email in the Cloudflare Access policy for /portal.
// =============================================================================

/** Lowercased authenticated email -> client id. */
export const CLIENT_BY_EMAIL: Record<string, string> = {
	// Andrew (BUILDT). Must match the email invited in the Cloudflare Access policy.
	'buildt.ireland@gmail.com': 'andrew',
	// Renato + Kevin (VNTA operators), mapped to Andrew's record to view the portal.
	'renato@vnta.xyz': 'andrew',
	'singpurwalakevin@gmail.com': 'andrew'
};

/**
 * Fallback client for local dev only, when no Access identity is present.
 * Never used for an authenticated-but-unmapped email (that is denied).
 */
export const DEFAULT_CLIENT_ID = 'andrew';
