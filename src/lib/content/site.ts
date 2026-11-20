// =============================================================================
// VNTA site content
// -----------------------------------------------------------------------------
// Everything the public pages say that is likely to change. Change it here,
// once: the pages, the search data and /llms.txt all read from this file.
//
// House rules for copy:
// - Calm, plain, precise. No hype, no "AI-powered", no "revolutionary".
// - Nothing is claimed that is not true today. VNTA Personal is in private
//   development. The only working part is the demonstration on the home page,
//   which runs in the visitor's browser on a made-up letter. Features that do
//   not exist yet are written as what they are designed to do.
// - No testimonials, customer numbers, awards, certifications or accuracy
//   figures until they are real.
// - A suggestion is never called a result, and a draft is never called sent.
// - The robotics work is archived (see docs/ARCHIVE.md). Do not mention it here.
// =============================================================================

export const siteUrl = 'https://vnta.xyz';
export const contactEmail = 'studio@vnta.xyz';
export const githubUrl = 'https://github.com/Vantaneant-International-Ltd';

/** VNTA's own public profiles. Only add a profile that is real and ours. */
export const mastodonUrl = 'https://mastodon.social/@vntagroup';
export const blueskyUrl = 'https://bsky.app/profile/vnta.xyz';
export const pixelfedUrl = 'https://pixelfed.social/vnta';
export const social: { name: string; href: string }[] = [
	{ name: 'GitHub', href: githubUrl },
	{ name: 'Mastodon', href: mastodonUrl },
	{ name: 'Bluesky', href: blueskyUrl },
	{ name: 'Pixelfed', href: pixelfedUrl }
];
export const follow = social.filter((s) => s.name === 'Bluesky');

export const pitch = {
	name: 'VNTA',
	descriptor: 'Personal Intelligence',
	headline: 'Life, handled.',
	lede: 'The important things in life, organised in one place.',
	/** One line for search results and share cards. */
	short: 'VNTA is a personal assistant for everyday paperwork. It reads what you give it, finds what needs doing, and helps you deal with it.',
	status: 'In private development. Join the list to be invited to the private beta.'
};

export const company = {
	founded: '2025',
	place: 'Dublin, Ireland',
	legalName: 'Vantanéant International Ltd'
};

/** What VNTA is designed to handle. */
export const handles: { name: string; body: string; icon: string }[] = [
	{ name: 'Documents', body: 'Letters, bills, policies and contracts, kept with the words that matter marked.', icon: 'doc' },
	{ name: 'Deadlines', body: 'Dates you must act by, with the exact sentence they came from.', icon: 'clock' },
	{ name: 'Renewals', body: 'Insurance, subscriptions, licences and anything else that quietly runs out.', icon: 'repeat' },
	{ name: 'Messages', body: 'A reply drafted for you to read, change and send yourself.', icon: 'mail' },
	{ name: 'Appointments', body: 'Times and places pulled from confirmations, shown beside everything else.', icon: 'calendar' }
];

export const steps: { name: string; body: string }[] = [
	{ name: 'Collect', body: 'You choose what to add. A PDF or a text file, one at a time.' },
	{ name: 'Understand', body: 'VNTA reads the text and marks possible deadlines, payments, renewals and requests.' },
	{ name: 'Prepare', body: 'Each one becomes a suggested step, with a draft reply where one helps.' },
	{ name: 'Track', body: 'You review, correct, approve or dismiss. VNTA keeps what is due in view.' }
];

/** Design rules for the beta. They are intentions we hold ourselves to, not certifications. */
export const privacy: { name: string; body: string }[] = [
	{ name: 'You approve every step', body: 'VNTA suggests. It does not pay, send or submit anything for you.' },
	{ name: 'You see where it came from', body: 'Every suggestion points back to the document and the exact words behind it.' },
	{ name: 'Only what you add', body: 'VNTA works from what you deliberately upload. It does not read your inbox.' },
	{ name: 'Yours to export or delete', body: 'You will be able to download everything, and delete it, from Settings.' }
];

export const faq: { q: string; a: string }[] = [
	{
		q: 'Is VNTA available now?',
		a: 'Not yet. It is in private development. The demonstration on this page works, but it uses a made-up letter. Join the list and we will invite people to the private beta in small groups.'
	},
	{
		q: 'Will VNTA pay a bill or send an email for me?',
		a: 'No. VNTA can suggest a step and draft a reply. You read it, change it and send it yourself. Nothing is paid, sent or submitted for you.'
	},
	{
		q: 'Does it use AI?',
		a: 'The first version finds dates, amounts and requests with fixed rules. If we later add an AI model, we will say so, tell you which provider, and ask for your consent before any of your documents are sent to it.'
	},
	{
		q: 'What if VNTA gets something wrong?',
		a: 'It can. Every suggestion shows its source and how sure VNTA is. When a date could be read two ways, for example 03/04/2027, VNTA does not pick one. It shows you both.'
	},
	{
		q: 'What happens to my documents?',
		a: 'Only documents you choose to add are used. The beta is being built so that you can download or delete your data at any time. We will publish the full privacy details before anyone is invited.'
	},
	{
		q: 'Is it free?',
		a: 'Pricing is not decided. Joining the list does not commit you to anything.'
	}
];

/** Pages that exist. Used for the sitemap and llms.txt. */
export const publicPaths = ['/', '/contact', '/legal', '/privacy', '/terms'];
