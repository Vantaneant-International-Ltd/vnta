// =============================================================================
// VNTA on the open networks
// -----------------------------------------------------------------------------
// One VNTA account on each, for the whole company: Studio and Robotics share
// it. scripts/social-profile.mjs reads this file and keeps the two profiles
// matching it: the short description, and on Mastodon the links under it.
//
// What the job will and will not do:
// - It adds the links below to the Mastodon profile. A link to this site gets
//   a green tick there, because every page of this site links back to the
//   profile (rel="me", in src/routes/+layout.svelte).
// - It writes a description only where there is none. It never overwrites one
//   that a person has typed.
// - It never touches the name, the picture, followers or posts.
//
// This file imports nothing, on purpose: the script reads it with plain Node.
// =============================================================================

export const mastodon = {
	/** The public address of the profile. Also in the foot of every page. */
	url: 'https://mastodon.social/@vntagroup',
	server: 'https://mastodon.social',
	bio: 'A VNTA picture.',
	/** Mastodon shows up to four. A link here is checked against this site. */
	fields: [
		{ name: 'Website', value: 'https://vnta.xyz' },
		{ name: 'Robotics', value: 'https://vnta.xyz/robotics' },
		{ name: 'Studio', value: 'https://vnta.xyz/studio' },
		{ name: 'Based', value: 'Dublin, Ireland' }
	]
};

export const bluesky = {
	/** The name the account was made with. It becomes vnta.xyz once the domain is verified. */
	firstHandle: 'vntagroup.bsky.social',
	domain: 'vnta.xyz',
	bio: 'Infrastructure for autonomous systems. Dublin.\nA VNTA picture.'
};
