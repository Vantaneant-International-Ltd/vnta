// =============================================================================
// VNTA: posts that go to one network only
// -----------------------------------------------------------------------------
// The two networks are not fed the same thing. A Robotics note
// (src/lib/server/notes.ts) reaches both, each in its own words and on its
// own day. This file is for everything else: a line that belongs on one
// network and has no page on the site.
//
//   Mastodon   Slower. Whole sentences, a described picture, hashtags (they
//              are how a post is found there). A first post carries
//              #introduction.
//   Bluesky    Quicker. One line, the picture, no hashtags.
//
// A post goes out at the next run on or after its date (Dublin time), once.
// The job is .github/workflows/posts.yml; it runs when this file changes and
// once a day. What was sent is recorded in posts-sent.json. A post more than
// three days late is not sent: change its date if it should still go.
//
// To pause one, give it a `hold`. THIS REPOSITORY IS PUBLIC: anything in this
// file can be read by anyone before it is posted.
//
// The house rules in notes.ts apply here too. This file imports nothing, on
// purpose: the publishing script reads it with plain Node.
// =============================================================================

export type Post = {
	/** Its name in the record. Never change it once sent. */
	id: string;
	/** The day it may go out, YYYY-MM-DD, Dublin time. */
	date: string;
	network: 'mastodon' | 'bluesky';
	/** Exactly what is posted. Mastodon allows 500 characters, Bluesky 300. */
	text: string;
	/** A PNG in src/lib/content/post-images, under 1,000,000 bytes, with its size in pixels. */
	image?: { file: string; alt: string; width: number; height: number };
	/** While this is set the post is not sent. Keep the reason neutral. */
	hold?: string;
};

const wordmark = { file: 'vnta-wordmark.png', alt: 'The VNTA wordmark, white on black.', width: 2001, height: 2001 };

export const posts: Post[] = [
	{
		id: 'hello-mastodon',
		date: '2026-10-12',
		network: 'mastodon',
		text: 'We’re here. Hello, fediverse 👀\n\n#introduction',
		image: wordmark
	},
	{
		id: 'hello-bluesky',
		date: '2026-10-12',
		network: 'bluesky',
		text: 'We’re here. Hello, decentralised network 👀',
		image: wordmark
	}
];
