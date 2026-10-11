// One page per published note. A note that has not been published has no
// page: it is not in `entries`, so nothing is built for it.
import { error } from '@sveltejs/kit';
import { publishedNotes } from '$lib/server/notesPublic';

export const prerender = true;

export const entries = () => publishedNotes().map((n) => ({ slug: n.slug }));

export function load({ params }) {
	const all = publishedNotes();
	const i = all.findIndex((n) => n.slug === params.slug);
	if (i === -1) error(404, 'Not found');
	const brief = (n: (typeof all)[number] | undefined) => (n ? { slug: n.slug, title: n.title } : null);
	// Newest first, so the one before it in time is the next in the list.
	return { note: all[i], older: brief(all[i + 1]), newer: brief(all[i - 1]) };
}
