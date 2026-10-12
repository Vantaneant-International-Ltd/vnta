// Made-up one-network posts for the publisher's tests. None of this is sent anywhere.
const mark = { file: 'vnta-wordmark.png', alt: 'The wordmark.', width: 2001, height: 2001 };

export const posts = [
	{ id: 'hello-mastodon', date: '2026-10-12', network: 'mastodon', text: 'Hello, fediverse 👀\n\n#introduction', image: mark },
	// The emoji comes first on purpose: Bluesky counts in bytes, not letters.
	{ id: 'hello-bluesky', date: '2026-10-12', network: 'bluesky', text: 'Hello 👀 #robots are at https://vnta.xyz/robotics.', image: mark },
	{ id: 'later', date: '2026-10-20', network: 'bluesky', text: 'A later line, with no picture.' },
	{ id: 'held', date: '2026-10-12', network: 'bluesky', text: 'This one is held.', hold: 'Held.' }
];
