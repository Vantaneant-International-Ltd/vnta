// The notes the site is allowed to show: only those the daily job has
// published, which is to say only those listed in notes-published.json.
// A note that is merely written in notes.ts is not public.
//
// This file is in $lib/server on purpose. Pages get notes through a server
// load (+page.server.ts), which runs at build time and hands the page only
// what is returned here. Nothing in the browser can import this, so the words
// of a held note are never shipped.
import { notes, type Note } from './notes';
import ledger from './notes-published.json';

/** Where a published note also went. Filled in by the job. */
export type Posted = { slug: string; at: string; mastodon?: { url: string }; bluesky?: { url: string } };

const entries = (ledger as { published: Posted[] }).published;

/** A note as a page may see it: no `hold`, and with when and where it went out. */
export type PublicNote = Omit<Note, 'hold' | 'short' | 'tags' | 'date'> & {
	publishedAt: string;
	posted: { mastodon?: { url: string }; bluesky?: { url: string } };
};

/** Published notes, newest first. */
export const publishedNotes = (): PublicNote[] => {
	const out: PublicNote[] = [];
	for (const e of entries) {
		const note = notes.find((n) => n.slug === e.slug);
		if (!note) continue;
		const { hold, short, tags, date, ...rest } = note;
		const posted: PublicNote['posted'] = {};
		if (e.mastodon) posted.mastodon = { url: e.mastodon.url };
		if (e.bluesky) posted.bluesky = { url: e.bluesky.url };
		out.push({ ...rest, publishedAt: e.at, posted });
	}
	return out.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
};
