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
//   Pixelfed   Pictures first: every post needs one. A short caption, and
//              hashtags, which are how a picture is found there.
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
	network: 'mastodon' | 'bluesky' | 'pixelfed';
	/** Exactly what is posted. Mastodon and Pixelfed allow 500 characters, Bluesky 300. */
	text: string;
	/** A PNG or JPEG in src/lib/content/post-images, under 1,000,000 bytes, with its size in pixels. */
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
	},
	{
		id: 'hello-pixelfed',
		date: '2026-10-12',
		network: 'pixelfed',
		text: 'We’re here. Hello, Pixelfed 👀\n\n#introduction',
		image: wordmark
	},

	// VNTA Studio on Bluesky: one project a week, on Mondays, so it never
	// lands on a Robotics day (Tuesday and Thursday). Every fact is from the
	// studio page (src/lib/content/studio.ts), and every screenshot is the one
	// that page already shows, drawn in each project's own colours.
	{
		id: 'studio-ezgo-auto-works',
		date: '2026-10-19',
		network: 'bluesky',
		text: 'EZGO Auto Works, Finglas. We designed the brand and built the site: mechanics, bodywork and detailing under one roof, prices shown, a ring or a WhatsApp one tap away.\n\nhttps://ezgoautoworks.ie',
		image: { file: 'studio-ezgo-auto-works.jpg', alt: 'The EZGO Auto Works website on a laptop and a phone: Fixed. Sprayed. Detailed. beside a photo of a mechanic under a car. Labelled VNTA Studio, brand and website.', width: 1080, height: 1350 }
	},
	{
		id: 'studio-buildt',
		date: '2026-10-26',
		network: 'bluesky',
		text: 'BUILDT, Dublin. We designed the brand and built the site. Customers build their own PC on it, watch the price change, and order.\n\nhttps://buildt.ie',
		image: { file: 'studio-buildt.jpg', alt: 'The BUILDT website on a laptop and a phone: BUILDT by hand. Proven on the bench. Labelled VNTA Studio, brand and website.', width: 1080, height: 1350 }
	},
	{
		id: 'studio-lm-motors',
		date: '2026-11-02',
		network: 'bluesky',
		text: 'L.M. Motors, Sallins. A website for a used car dealer, in build: search the stock, shortlist cars, then ring or message about the one you want.\n\nhttps://vnta.xyz/studio',
		image: { file: 'studio-lm-motors.jpg', alt: 'The L.M. Motors website on a laptop and a phone: Used cars, exactly as described, with a search by make, model and budget. Labelled VNTA Studio, website, in build.', width: 1080, height: 1350 }
	}
];
