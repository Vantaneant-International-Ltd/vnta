// The list of published notes.
import { publishedNotes } from '$lib/server/notesPublic';

export const load = () => ({
	list: publishedNotes().map(({ slug, title, summary, kind, publishedAt }) => ({ slug, title, summary, kind, publishedAt }))
});
