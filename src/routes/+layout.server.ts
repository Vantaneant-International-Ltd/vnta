// What every page's foot needs that only the build can know.
import { existsSync, readFileSync } from 'node:fs';
import { publishedNotes } from '$lib/server/notesPublic';
import { bluesky } from '$lib/content/social';

/**
 * The Bluesky profile's address. Once the profile job has written the
 * account's id (static/.well-known/atproto-did), the address uses that id: it
 * keeps working when the account's name changes to the domain.
 */
function blueskyUrl() {
	const file = 'static/.well-known/atproto-did';
	const did = existsSync(file) ? readFileSync(file, 'utf8').trim() : '';
	return `https://bsky.app/profile/${did || bluesky.firstHandle}`;
}

export const load = () => ({
	// Whether there is anything under Notes yet. The foot links to it only then.
	hasNotes: publishedNotes().length > 0,
	blueskyUrl: blueskyUrl()
});
