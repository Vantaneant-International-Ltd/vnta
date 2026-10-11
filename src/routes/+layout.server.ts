// Whether there is anything under Notes yet. The foot links to it only then.
import { publishedNotes } from '$lib/server/notesPublic';

export const load = () => ({ hasNotes: publishedNotes().length > 0 });
