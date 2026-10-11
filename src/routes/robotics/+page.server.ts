// The three latest published notes, for the foot of the robotics page.
import { publishedNotes } from '$lib/server/notesPublic';

export const load = () => ({
	latest: publishedNotes()
		.slice(0, 3)
		.map(({ slug, title, summary, publishedAt }) => ({ slug, title, summary, publishedAt }))
});
