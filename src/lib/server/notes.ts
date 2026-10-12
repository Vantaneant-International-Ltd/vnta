// =============================================================================
// VNTA Robotics: notes
// -----------------------------------------------------------------------------
// Short posts about what is being built, what it found and what is not done.
// Each one lives on this site first, at /robotics/notes/<slug>, and a short
// version with a link back goes to Mastodon and Bluesky.
//
// The two networks are not given the same thing:
//   Mastodon   `short`, the link and the hashtags, the morning it is published.
//   Bluesky    `bluesky`, its own shorter line, and the link, the morning after.
//   Pixelfed   `pixelfed`, a caption for the picture, two mornings after.
//
// NOTHING HERE IS PUBLIC JUST BECAUSE IT IS IN THIS FILE. A note is published
// by the daily job (.github/workflows/notes.yml, scripts/publish-notes.mjs),
// which writes it into notes-published.json. The site shows only what is in
// that file. The job publishes a note when:
//   - its date has come (Europe/Dublin),
//   - it has no `hold`,
//   - and no other note went out that day (one a day, oldest first).
//
// To write a new note: add it here with a date. To pause one: give it a
// `hold`. To release it: delete the `hold` line and push. It goes out at the
// next morning run.
//
// THIS REPOSITORY IS PUBLIC. Anyone can read this file, held notes and all.
// A draft that should not be seen yet does not belong here: keep it in the
// private vnta-robotics repository (docs/notes/HELD.md) and move it into this
// file on the day it may go out. Keep a `hold` reason here to one neutral
// word or two; the real reason goes in the private file.
//
// House rules, the same as the rest of the site:
// - Only what is true today. Say "in development". Say what a result was run
//   against: a simulator, or a virtual vehicle. No real machine has been
//   connected, and a note must not read as if one had.
// - No customer names, logos, testimonials or numbers that are not real.
// - A validation report is not a safety certification.
// - Do not name the author of the open-source test subject, in a note or in a
//   reply. They are not a partner.
// - Names: VNTA, VNTA Robotics, Runtime, Validation, Access, Identity.
//
// This file imports nothing, on purpose: the publishing script reads it with
// plain Node. It lives in $lib/server so that no page can ship it to a
// browser: pages get published notes through a server load.
// =============================================================================

export type NoteKind = 'Explain' | 'Show' | 'Ask' | 'Status';

export type Note = {
	/** The last part of the address. Never change it once published. */
	slug: string;
	/** The day it may go out, YYYY-MM-DD, Dublin time. */
	date: string;
	title: string;
	kind: NoteKind;
	/** One sentence: the list, the feed and search results show it. */
	summary: string;
	/** Paragraphs. A line break inside one is kept, for short lists. */
	body: string[];
	/**
	 * The short version for Mastodon and Bluesky, without the link (the job
	 * adds it). With the link it must fit Bluesky's 300 characters; the check
	 * in scripts/publish-notes.mjs fails the build if it does not.
	 */
	short: string;
	/**
	 * Bluesky's own version, without the link: one or two lines, no hashtags.
	 * Bluesky gets it the morning after the note is published. Left out, it
	 * gets `short`. It must not say more than `short` does.
	 */
	bluesky?: string;
	/**
	 * Pixelfed's own caption, for a note with a picture. The picture leads
	 * there, so the caption says what is in it. The job adds the link and the
	 * hashtags, which are how a picture is found on Pixelfed. Pixelfed gets it
	 * two mornings after the note is published. Left out, the note does not go
	 * to Pixelfed.
	 */
	pixelfed?: { caption: string; tags: string[] };
	/**
	 * In src/lib/content/note-images, 1080 by 1350. It is copied into the site
	 * only once the note is published. The alt text goes to both networks.
	 */
	image?: { file: string; alt: string };
	/** Hashtags for Mastodon, where they are how a post is found. No "#". */
	tags?: string[];
	/** While this is set the note is not published. This file is public: keep the reason neutral. */
	hold?: string;
};

export const notes: Note[] = [
	{
		slug: 'the-one-question',
		date: '2026-10-12',
		title: 'The one question',
		kind: 'Explain',
		summary: 'What can this robot actually do, and do we have evidence that it works? VNTA Robotics is being built to answer that.',
		body: [
			'What can this robot actually do, and do we have evidence that it works?',
			'That question is harder to answer than it should be.',
			'A robot’s interface says it supports pause. The fleet manager says it speaks the standard. Then you get on site, and pause does something slightly different from what the manual said.',
			'We are building software that answers the question properly. It connects to a robot or fleet system, runs the same set of checks against it, and keeps the evidence: every call, every answer, every raw message.',
			'It is called VNTA Robotics. It is in development. So far it has run against simulated robots and one virtual vehicle that we did not write. It has not met a real machine yet.',
			'Over the next few weeks we will post what we have built, what it found, and what is not done.',
			'If you commission mobile robots for a living, we would like to hear how you do this today.'
		],
		short: 'What can this robot actually do, and do we have evidence that it works?\n\nWe’re building VNTA Robotics to answer that: connect to a robot, run the same checks, keep every raw message. In development.',
		bluesky: 'What can this robot actually do, and do we have evidence that it works?\n\nWe’re building VNTA Robotics to answer that. In development.',
		pixelfed: {
			caption: 'One question, and one real test run behind it.\n\nWhat can this robot actually do, and do we have evidence that it works? VNTA Robotics is being built to answer that. It is in development, and this run was on a virtual vehicle, not a real machine.',
			tags: ['robotics', 'automation', 'engineering']
		},
		image: {
			file: 'post-01-the-one-question.png',
			alt: 'The question in large type, above the result of one validation run on a virtual vehicle: 32 of 37 checks passed, 13 of 14 capabilities verified.'
		},
		tags: ['robotics', 'commissioning']
	},
	{
		slug: 'declared-is-not-verified',
		date: '2026-10-15',
		title: 'Declared is not verified',
		kind: 'Explain',
		summary: 'A capability in a manual is a claim. A capability that has been tested is evidence. VNTA Robotics keeps the two apart.',
		body: [
			'A capability in a manual is a claim. A capability that has been tested is evidence.',
			'It is easy to show the first and call it the second.',
			'VNTA Robotics keeps three things apart, for every function of every machine:',
			'Declared: what the interface is documented to offer.\nDiscovered: what the system says when you ask it.\nVerified: what a test run actually saw work, and when.',
			'The picture is a real result from our console. One virtual vehicle, 14 capabilities, all of them declared. 13 verified. One failed: asked to describe its own functions, it answered, but named none.',
			'It is a virtual vehicle, not a real one. The point is the shape of the answer.'
		],
		short: 'A capability in a manual is a claim. A capability that has been tested is evidence.\n\nOne virtual vehicle: 14 capabilities declared, 13 verified, 1 failed. A real result, on a vehicle that is not real.',
		bluesky: 'A capability in a manual is a claim. A capability that has been tested is evidence.',
		pixelfed: {
			caption: 'Declared is not verified.\n\nSix capabilities from one test run: all six declared, five verified, one failed. On a virtual vehicle, not a real one.',
			tags: ['robotics', 'testing', 'engineering']
		},
		image: {
			file: 'post-02-declared-is-not-verified.png',
			alt: 'A table of six capabilities, all declared. Five are verified and one, capability discovery, failed.'
		},
		tags: ['robotics', 'testing']
	},
	{
		slug: 'what-we-tested-against',
		date: '2026-10-20',
		title: 'What we tested against, exactly',
		kind: 'Show',
		summary: 'Four systems, and none of them is a real robot: three simulators we wrote, and one open-source virtual vehicle we did not.',
		body: [
			'We have tested our robot validation software against four systems. None of them is a real robot. Here is exactly what they are.',
			'Three are simulators we wrote ourselves. Each speaks a different invented interface, and each has faults we planted on purpose. One has no pause. One acts on the same order twice. One goes quiet after a restart.',
			'The suite finds every planted fault and no others. That proves the tester works. It proves nothing about robots.',
			'The fourth is the one that matters: an open-source VDA 5050 virtual vehicle that somebody else wrote. We ran it unmodified, in its own process, and judged its messages against the official schemas.',
			'32 of 37 checks passed. Every behavioural check passed: orders, pause, resume, cancel, duplicates, charging, recovery after a restart.',
			'The next step is a real system. That needs a partner who has one.'
		],
		short: 'We’ve tested our robot validation software against four systems. None is a real robot.\n\nThree simulators we wrote, with planted faults. One open-source VDA 5050 virtual vehicle we didn’t: 32 of 37 checks passed.',
		bluesky: 'We’ve tested our robot validation software against four systems. None is a real robot.',
		pixelfed: {
			caption: 'Everything we have tested against so far: three simulators we wrote, and one virtual vehicle we did not. None of them is a real robot.',
			tags: ['robotics', 'VDA5050', 'simulation']
		},
		image: {
			file: 'post-03-what-we-tested-against.png',
			alt: 'Four systems and their verdicts: three simulated robots and one external virtual vehicle.'
		},
		tags: ['robotics', 'VDA5050']
	},
	{
		slug: 'twenty-minutes',
		date: '2026-10-22',
		title: 'Twenty minutes with people who commission robots',
		kind: 'Ask',
		summary: 'If you commission AMRs or AGVs, we would like 20 minutes. Five questions, and nothing to sell.',
		body: [
			'We are looking for 20 minutes with people who commission AMRs or AGVs.',
			'We will not try to sell you anything on the call.',
			'VNTA Robotics tests what a robot or fleet system can actually do through its interface. Before we point it at a real system, we want to know whether the checks are the right ones.',
			'Five questions:',
			'1. How did you find out what the robot could and could not do through its interface?\n2. How long did interface testing take, and who did it?\n3. What went wrong after go-live that a test would have caught?\n4. Did vendor certification cover it? What did it miss?\n5. What would it have been worth to have a report like this on day one?',
			'In return we will show you the report from our first external test, and you can tell us which lines are useful and which are noise.',
			'Write to us at vnta.xyz/contact, or reply wherever you are reading this.'
		],
		short: 'Do you commission AMRs or AGVs? VNTA Robotics would like 20 minutes of your time.\n\nNothing to sell. Five questions, and you get to pull apart our first test report.',
		bluesky: 'Do you commission AMRs or AGVs? We’d like 20 minutes of your time. Nothing to sell.',
		tags: ['robotics', 'AMR', 'AGV']
	},
	{
		slug: 'our-own-rig-lied-first',
		date: '2026-10-29',
		title: 'Our own rig lied first',
		kind: 'Show',
		summary: 'The first bug our robot test rig found was in our robot test rig.',
		body: [
			'The first bug our robot test rig found was in our robot test rig.',
			'We built a fault that cuts a vehicle’s network link. The vehicle then took 30 seconds to come back. That looked like a finding.',
			'It was not. Our fault left the connection open and silent, so the vehicle sat out its own connect timeout. A host that is really unreachable hangs up. When we made the rig hang up properly, the vehicle reconnected in about a second.',
			'A test rig can manufacture failures by accident. A fault injected badly looks exactly like a fault in the system.',
			'So every finding now gets one extra question before we believe it: did we cause this?',
			'If you write test tooling for hardware, you probably have your own version of this story.'
		],
		short: 'The first bug our robot test rig found was in our robot test rig.\n\nA badly injected fault looks exactly like a fault in the system. Now every finding gets one more question: did we cause this?',
		bluesky: 'The first bug our robot test rig found was in our robot test rig.',
		pixelfed: {
			caption: '30 seconds to come back with the faulty test rig. About 1 second once the rig was fixed.\n\nThe fault was in our own test rig, not in the system it was testing.',
			tags: ['robotics', 'testing', 'debugging']
		},
		image: {
			file: 'post-06-our-own-rig-lied-first.png',
			alt: 'Two bars: 30 seconds to come back with the faulty test rig, about 1 second once the rig was fixed.'
		},
		tags: ['robotics', 'testing']
	},
	{
		slug: 'above-not-instead',
		date: '2026-11-03',
		title: 'Above, not instead',
		kind: 'Explain',
		summary: 'VNTA Robotics sits above ROS 2, VDA 5050, Open-RMF and vendor APIs. It replaces none of them.',
		body: [
			'VNTA Robotics does not replace ROS 2. Or VDA 5050. Or Open-RMF. Or your fleet manager.',
			'It sits above them and reaches each one through an adapter.',
			'What we do not build: messaging, discovery, drivers, navigation, motion planning, simulators, traffic management, safety functions. Those exist, and they are better than anything a small team would write.',
			'What we do build: one model of what a machine can do, tests for it, and the evidence.',
			'Where that stands today: one adapter works, for VDA 5050 2.1.0. ROS 2, Open-RMF and vendor APIs are planned. “Designed to sit above” is not the same as “supported”, and we do not say supported until an adapter has run.',
			'Which interface would you want tested first?'
		],
		short: 'VNTA Robotics doesn’t replace ROS 2, VDA 5050, Open-RMF or your fleet manager. It sits above them, through adapters.\n\nOne adapter works today (VDA 5050 2.1.0). The rest are planned.',
		bluesky: 'VNTA Robotics doesn’t replace ROS 2, VDA 5050, Open-RMF or your fleet manager. It sits above them.\n\nOne adapter works today (VDA 5050 2.1.0). The rest are planned.',
		pixelfed: {
			caption: 'Where VNTA Robotics sits: above the interfaces you already run, not instead of them. VDA 5050 works today. ROS 2, Open-RMF and vendor APIs are planned.',
			tags: ['robotics', 'ROS2', 'VDA5050']
		},
		image: {
			file: 'post-07-above-not-instead.png',
			alt: 'VNTA Robotics drawn above four interfaces. VDA 5050 works today; ROS 2, Open-RMF and vendor APIs are planned.'
		},
		tags: ['robotics', 'ROS2', 'VDA5050']
	},
	{
		slug: 'a-timeout-is-not-a-pass',
		date: '2026-11-05',
		title: 'A timeout is not a pass',
		kind: 'Explain',
		summary: 'A test can end five ways. “We could not tell” is one of them, and it is not hidden.',
		body: [
			'A timeout is not a pass. It is also not a fail.',
			'When our validation suite gets no answer in time, it reports UNKNOWN. Whether the request landed is not known, so that is what we say.',
			'Same for a missing function. If a robot has no pause, that is UNSUPPORTED, not a failure. It simply does not offer it.',
			'Five outcomes sound fussy until you are reading a report on site at 6pm. Then the difference between “it refused”, “it does not have that” and “we do not know” is the whole job.',
			'We also do not retry quietly. Recently one check came back unknown once in about twenty runs, and we could not reproduce it. It is written down as an open issue, not smoothed over.'
		],
		short: 'A timeout is not a pass. It is not a fail either.\n\nOur validation reports five outcomes: pass, warning, fail, unsupported, unknown. “We don’t know” is an answer.',
		bluesky: 'A timeout is not a pass. It is not a fail either.\n\n“We don’t know” is an answer.',
		pixelfed: {
			caption: 'Five ways a test can end. “Unknown” is one of them, and it is not a pass.',
			tags: ['robotics', 'testing', 'engineering']
		},
		image: {
			file: 'post-08-a-timeout-is-not-a-pass.png',
			alt: 'The five ways a test can end: pass, warning, fail, unsupported, unknown.'
		},
		tags: ['robotics', 'testing']
	},
	{
		slug: 'what-it-cannot-do-yet',
		date: '2026-11-17',
		title: 'What it cannot do yet',
		kind: 'Status',
		summary: 'A plain list of what VNTA Robotics has not done and cannot do today.',
		body: [
			'What VNTA Robotics cannot do yet. A list.',
			'It has never been connected to a real robot.\nIt has one working protocol adapter: VDA 5050 2.1.0.\nNo ROS 2 adapter. No Open-RMF adapter. No vendor fleet-manager connectors.\nNo SDK. There is an early API that reads capabilities and starts a validation.\nIt cannot send work to a robot outside a test run. That is on purpose, for now.\nNo customer accounts. No hosted version.\nNobody has paid for it.',
			'What it can do: connect, run a suite of checks including a dropped link and a restart, keep every raw message, and produce a readiness report.',
			'We would rather you heard the first list from us.'
		],
		short: 'What VNTA Robotics can’t do yet: it has never met a real robot, has one protocol adapter, no SDK, and nobody has paid for it.\n\nWe’d rather you heard that from us.',
		bluesky: 'What VNTA Robotics can’t do yet: it has never met a real robot, has one protocol adapter, no SDK, and nobody has paid for it.',
		tags: ['robotics']
	}
];
