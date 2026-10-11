// =============================================================================
// VNTA Robotics: notes
// -----------------------------------------------------------------------------
// Short posts about what is being built, what it found and what is not done.
// Each one lives on this site first, at /robotics/notes/<slug>, and a short
// version with a link back goes to Mastodon and Bluesky.
//
// NOTHING HERE IS PUBLIC JUST BECAUSE IT IS IN THIS FILE. A note is published
// by the daily job (.github/workflows/notes.yml, scripts/publish-notes.mjs),
// which writes it into notes-published.json. The site shows only what is in
// that file. The job publishes a note when:
//   - its date has come (Europe/Dublin),
//   - it has no `hold`,
//   - and no other note went out that day (one a day, oldest first).
//
// To write a new note: add it here with a date. To stop one going out: give it
// a `hold` saying why. To release a held note: delete its `hold` line and push.
// It goes out at the next morning run.
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
	 * In src/lib/content/note-images, 1080 by 1350. It is copied into the site
	 * only once the note is published. The alt text goes to both networks.
	 */
	image?: { file: string; alt: string };
	/** Hashtags for Mastodon, where they are how a post is found. No "#". */
	tags?: string[];
	/** While this is set the note is not published. Say what must be true first. */
	hold?: string;
};

export const notes: Note[] = [
	{
		slug: 'the-one-question',
		date: '2026-10-13',
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
		tags: ['robotics', 'AMR', 'AGV']
	},
	{
		slug: 'every-message-was-valid',
		date: '2026-10-27',
		title: 'Every message was valid',
		kind: 'Show',
		summary: 'Each message passed the schema. The system was still wrong, and only doing something to it showed that.',
		body: [
			'Every message was valid. The system was still wrong.',
			'We ran our validation suite against an open-source VDA 5050 virtual vehicle. Each message it sent passed the official schema.',
			'Then we cut its network link and brought it back.',
			'The vehicle reconnected in about a second and carried on reporting its state. But it never announced that it was online again. A fresh subscriber, arriving the way a master control that starts late would, was still told the connection was broken. While the vehicle was connected and working.',
			'You cannot see that by checking messages one at a time. You only see it by doing something to the system and watching what happens next.',
			'Two caveats. This is one version of one library’s virtual vehicle in one configuration, not a real machine. And most of what it does simply works: 32 of 37 checks passed.',
			'That kind of finding is what VNTA Robotics is being built to catch.'
		],
		short: 'Every message was valid. The system was still wrong.\n\nWe cut a virtual vehicle’s link and brought it back. It reconnected in a second, and never said it was online again.',
		image: {
			file: 'post-05-every-message-was-valid.png',
			alt: 'A timeline: the link is cut, the vehicle reconnects after a second, and six seconds later it has still not said it is online.'
		},
		tags: ['robotics', 'VDA5050', 'testing'],
		hold: 'Tell the maintainers of the open-source library first (open an issue) and give them a few days. Their issue tracker could not be read when this was written, so it may already be known.'
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
		image: {
			file: 'post-08-a-timeout-is-not-a-pass.png',
			alt: 'The five ways a test can end: pass, warning, fail, unsupported, unknown.'
		},
		tags: ['robotics', 'testing']
	},
	{
		slug: 'why-the-prices-are-public',
		date: '2026-11-10',
		title: 'Why the prices are public',
		kind: 'Status',
		summary: 'VNTA Robotics is priced per integration, not per robot, and the prices are on the site.',
		body: [
			'We have put our prices on the website. Here is the thinking.',
			'VNTA Robotics is priced per integration, not per robot.',
			'The value today is in integrating and validating, not in running a fleet day to day. Charging per robot per month would be charging for something we do not do.',
			'A validation pilot starts from €6,500 ex VAT: one robot or fleet integration, tested, with a readiness report and the evidence behind it.',
			'Three things the page says plainly:',
			'1. The product is in development and has not been used on a real robot yet.\n2. Every price is a starting point. Scope is agreed before work begins.\n3. A report is not a safety certification.',
			'There is no checkout. There is a form, and we read every request. It is at vnta.xyz/robotics/pricing.'
		],
		short: 'Our prices are public. A validation pilot starts from €6,500 ex VAT, per integration, not per robot.\n\nIn development, no checkout, and not yet used on a real robot.',
		image: {
			file: 'post-09-why-the-prices-are-public.png',
			alt: 'Four offers and their starting prices, with the annual platform marked as planned.'
		},
		tags: ['robotics'],
		hold: 'These prices have not been quoted to anyone yet. Release this once you are comfortable defending them out loud.'
	},
	{
		slug: 'one-design-partner',
		date: '2026-11-12',
		title: 'One design partner',
		kind: 'Ask',
		summary: 'We are looking for one integrator or operator with a real VDA 5050 system to be our first real integration.',
		body: [
			'We are looking for one design partner.',
			'You: an integrator or operator with a real robot or fleet system that speaks VDA 5050, and a commissioning project coming up.',
			'Us: we connect VNTA Robotics to it, run the validation suite, and give you a readiness report with the evidence behind it. You get it at a reduced price. We get to learn on a real system.',
			'What you should know first:',
			'1. It would be our first real integration. Part of the work is us learning.\n2. We test software behaviour through the interface. It is not a safety certification.\n3. Link-cut and restart tests only run if you and the manufacturer agree to them.',
			'If that is you, or someone you know, write to us at vnta.xyz/robotics/pricing.'
		],
		short: 'Looking for one design partner: an integrator or operator with a real VDA 5050 system and a commissioning project coming up.\n\nIt would be our first real integration, and we say so.',
		tags: ['robotics', 'VDA5050'],
		hold: 'Release this only when you could deliver: a robotics engineer lined up, insurance checked, and a contract that says the report is not a safety certification.'
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
		tags: ['robotics']
	},
	{
		slug: 'what-the-conversations-taught-us',
		date: '2026-11-19',
		title: 'What the conversations taught us',
		kind: 'Status',
		summary: '[ONE SENTENCE ON WHAT CHANGED.]',
		body: [
			'A few weeks ago we asked people who commission robots for 20 minutes. [NUMBER] of you said yes. Thank you.',
			'Here is what we had wrong.',
			'[THE THING WE ASSUMED, AND WHAT PEOPLE ACTUALLY TOLD US.]',
			'Here is what we had right.',
			'[THE CHECK OR IDEA THAT PEOPLE SAID THEY WOULD USE.]',
			'The line in our report people cared about most: [WHICH ONE].\nThe line nobody cared about: [WHICH ONE].',
			'What changes because of it: [ONE CONCRETE CHANGE TO THE PRODUCT OR THE PLAN].',
			'If you do this work and we have not spoken yet, the offer stands.'
		],
		short: '[SHORT VERSION, WRITTEN FROM WHAT PEOPLE ACTUALLY SAID.]',
		tags: ['robotics'],
		hold: 'This is a template. Fill every bracket from what people actually said, with no names or companies without permission. If there were no conversations, delete this note.'
	}
];
