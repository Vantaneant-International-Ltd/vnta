// Made-up notes for the publisher's tests. None of this is published
// anywhere; it exists so the tests do not depend on what the real notes say.
const note = (slug: string, date: string, extra: object = {}) => ({
	slug,
	date,
	title: `Test note ${slug}`,
	kind: 'Explain',
	summary: `A test note called ${slug}.`,
	body: ['First paragraph.', 'Second paragraph.'],
	short: `The short version of ${slug}, for the two networks.`,
	tags: ['testing', 'robotics'],
	...extra
});

const picture = { image: { file: 'post-01-the-one-question.png', alt: 'A description of the picture, long enough to be useful.' } };

export const notes = [
	note('alpha', '2026-10-13', { ...picture, bluesky: 'Alpha, in one line for Bluesky.' }),
	note('bravo', '2026-10-15', picture),
	note('charlie', '2026-10-20', picture),
	note('delta', '2026-10-22'), // no picture
	note('held', '2026-10-27', { ...picture, hold: 'Held.' }),
	note('echo', '2026-10-29', picture),
	note('template', '2026-11-01', { body: ['[NOT WRITTEN YET]'], hold: 'Held.' }),
	note('unfinished', '2026-11-02', { summary: 'This one has a [BRACKET] left in it.' }), // not held, but not fit to publish
	note('foxtrot', '2026-11-03', picture)
];
