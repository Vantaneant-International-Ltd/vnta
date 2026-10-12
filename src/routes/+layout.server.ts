// What every page's foot needs that only the build can know.
import { publishedNotes } from '$lib/server/notesPublic';

export const load = () => ({
	// Whether there is anything under Notes yet. The foot links to it only then.
	hasNotes: publishedNotes().length > 0
});
