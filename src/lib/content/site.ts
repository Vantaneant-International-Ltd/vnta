// =============================================================================
// VNTA site content
// -----------------------------------------------------------------------------
// Everything the public pages say that is likely to change. Change it here,
// once: the pages, the search data and /llms.txt all read from this file.
//
// VNTA is a technology company. It builds infrastructure for autonomous
// systems. Its current business area is VNTA Robotics: developer
// infrastructure for autonomous machines. VNTA is not an agency, a consultancy
// or a studio, and nothing on the site should read as one.
//
// Names. Use these and no others:
//   VNTA            the company
//   VNTA Robotics   the robotics business area
//   Runtime         the platform inside it (in development)
//   Validation      the first module (the current one)
//   Access          a future module: mission governance
//   Identity        a future module: machine identity and trust
// Not "VNTA for Robots", not "VNTA Validation", not "VNTA Access".
//
// House rules for copy:
// - Short, technical, quiet, precise. No hype, no "revolutionary", no
//   "AI-powered", no startup cliches.
// - Nothing is claimed that is not true today (October 2026). VNTA Robotics
//   is in development. Validation runs against three simulated robots VNTA
//   wrote and one external virtual vehicle VNTA did not write. No real
//   machine has been connected, no pilot has been run, and nobody has paid.
//   Only VDA 5050 2.1.0 is supported; ROS 2, Open-RMF and vendor APIs are
//   planned. When that changes, change `robotics.honest` and `support` below
//   and the whole site follows.
// - A validation report is not a safety certification. Never imply it is.
// - Roadmap is never shown as capability. Access and Identity are never shown
//   as current; Runtime's API and SDK are never shown as finished.
// - No customer names, no metrics, no testimonials, no logos until they are
//   real. No named third parties as partners.
// - The parent, VNTA, is wider than robotics. Agents and compute are research
//   directions, not products: never present them as available.
// =============================================================================

export const siteUrl = 'https://vnta.xyz';
export const contactEmail = 'studio@vnta.xyz';
export const githubUrl = 'https://github.com/Vantaneant-International-Ltd';

/**
 * Where "Explore Robotics" goes. Today it is a page on this site. When
 * robotics.vnta.xyz exists, change this one value to
 * 'https://robotics.vnta.xyz' and redirect /robotics there in
 * static/_redirects. The app, the API and the docs are planned at
 * app.vnta.xyz, api.vnta.xyz and docs.vnta.xyz; none of them exists yet, so
 * nothing on the site links to them.
 */
export const roboticsUrl = '/robotics';

/**
 * VNTA's own public profiles. Each one listed here is shown in the foot and is
 * handed to search engines as "this profile is the same VNTA". Only add a
 * profile that is real and ours, with its full address.
 */
export const mastodonUrl = 'https://mastodon.social/@vntagroup';
export const social: { name: string; href: string }[] = [
	{ name: 'GitHub', href: githubUrl },
	{ name: 'Mastodon', href: mastodonUrl }
];

// --- The parent: VNTA --------------------------------------------------------

export const pitch = {
	eyebrow: 'Autonomous infrastructure',
	headline: 'Infrastructure for autonomous systems.',
	lede: 'VNTA is designing the software infrastructure that will allow autonomous machines and intelligent systems to operate securely in the real world.',
	/** One line for search results and share cards. */
	short: 'VNTA is an independent technology company developing infrastructure for autonomous systems.'
};

export const statement = {
	headline: 'The autonomous world needs infrastructure.',
	body: 'Robots, intelligent agents, vehicles and machines are becoming increasingly autonomous. VNTA is building the infrastructure to connect them, verify what they can actually do, and later govern and trust them across organisations and environments.'
};

/** A system's standing. "In development" is the one being built. */
export type Stage = 'In development' | 'Research';

/** The three kinds of autonomous system the infrastructure is meant to reach. */
export const systems: { name: string; layer: string; body: string; stage: Stage; icon: string }[] = [
	{
		name: 'Robots',
		layer: 'Developer infrastructure',
		body: 'Physical machines operating across warehouses, factories and field environments.',
		stage: 'In development',
		icon: 'robot'
	},
	{
		name: 'Agents',
		layer: 'Autonomous software',
		body: 'Autonomous software systems acting on behalf of people and organisations.',
		stage: 'Research',
		icon: 'agent'
	},
	{
		name: 'Compute',
		layer: 'Resource coordination',
		body: 'Infrastructure for coordinating the resources autonomous systems depend on.',
		stage: 'Research',
		icon: 'compute'
	}
];

/** The principles the infrastructure is designed on. */
export const principles = [
	{ name: 'Open', body: 'Designed around interoperable standards and APIs.', icon: 'open' },
	{ name: 'Evidence first', body: 'What a machine can do is tested, not assumed, and the evidence is kept.', icon: 'shield' },
	{ name: 'Vendor-neutral', body: 'Designed to sit above the standards and vendor systems already in use.', icon: 'neutral' },
	{
		name: 'Extensible',
		body: 'Infrastructure that can expand from robots into broader autonomous systems.',
		icon: 'extend'
	}
];

export const company = {
	body: 'VNTA is an independent technology company developing infrastructure for autonomous systems.',
	/** VNTA also runs a studio, at /studio. One plain sentence, and no more: the parent is not an agency. */
	studio: 'VNTA also runs a studio that designs brands and builds websites for Irish businesses.',
	founded: '2025',
	place: 'Dublin, Ireland',
	legalName: 'Vantanéant International Ltd'
};

// --- The current business area: VNTA Robotics --------------------------------

export const robotics = {
	name: 'VNTA Robotics',
	stage: 'In development' as Stage,
	positioning: 'Developer infrastructure for autonomous machines.',
	/** The question the first module answers. */
	question: 'What can this machine actually do, and do we have evidence that it works?',
	what: 'VNTA Robotics connects to a robot or fleet system, tests what it can actually do, and keeps the evidence. In development.',
	/** Above the architecture picture. */
	headline: 'Above the systems you already run.',
	body: 'VNTA Robotics is designed to sit above VDA 5050, ROS 2, Open-RMF and vendor APIs, reaching each one through an adapter. It replaces none of them.',
	/** Said wherever the product is shown, so nobody mistakes work in progress for a finished product. */
	honest: 'VNTA Robotics is in development. Today it runs against simulated robots and one external virtual vehicle. It has not been tested with a real machine.',
	/** Said wherever a report or a result is shown. */
	notSafety: 'VNTA validation evaluates software integration behaviour against a chosen set of checks. It is not a functional-safety certification and does not replace manufacturer commissioning procedures.',
	/** The small note at the foot of the robotics pages. */
	note: 'VNTA Robotics is currently in development. Product scope, supported integrations and pricing may change as the platform is validated with early partners.'
};

/** The order things are built in. Each step stands on the one before. */
export type When = 'Now' | 'Next' | 'Later';
export const progression: { name: string; body: string; when: When }[] = [
	{ name: 'Connect', body: 'Reach a robot or fleet system through an adapter.', when: 'Now' },
	{ name: 'Validate', body: 'Test what it does and keep the evidence.', when: 'Now' },
	{ name: 'Normalise', body: 'Offer tested capabilities through one API.', when: 'Next' },
	{ name: 'Operate', body: 'Send work through that one interface.', when: 'Later' },
	{ name: 'Govern', body: 'Decide which missions are allowed.', when: 'Later' },
	{ name: 'Trust', body: 'Give each machine an identity that can be checked.', when: 'Later' }
];

/** The four parts of VNTA Robotics, and where each one stands. Only one is current. */
export type ModuleState = 'Current' | 'In development' | 'Future';
export const modules: { name: string; role: string; body: string; state: ModuleState; detail: string; icon: string }[] = [
	{
		name: 'Validation',
		role: 'The first module',
		body: 'Connects to an integration, finds out what it can do, tests it, and reports with evidence.',
		state: 'Current',
		detail: 'Open to a limited number of pilots.',
		icon: 'shield'
	},
	{
		name: 'Runtime',
		role: 'The platform',
		body: 'Adapters, one capability model, and an API and SDK over capabilities that have been tested.',
		state: 'In development',
		detail: 'An early API reads capabilities and starts validation. No SDK yet.',
		icon: 'layers'
	},
	{
		name: 'Access',
		role: 'Mission governance',
		body: 'Who may ask a machine to do what: policy, approvals, and a record before dispatch.',
		state: 'Future',
		detail: 'Not available.',
		icon: 'lock'
	},
	{
		name: 'Identity',
		role: 'Machine trust',
		body: 'A verifiable identity for each machine: credentials, ownership, revocation.',
		state: 'Future',
		detail: 'Not available.',
		icon: 'identity'
	}
];

/** The parts of the Runtime as drawn in the architecture, and listed on the home page. */
export const layer = [
	{ name: 'Adapters', icon: 'plug' },
	{ name: 'Capabilities', icon: 'layers' },
	{ name: 'Validation', icon: 'shield' },
	{ name: 'Evidence', icon: 'audit' },
	{ name: 'Reports', icon: 'check' },
	{ name: 'API', icon: 'open' }
];

/**
 * What Validation does today. Every line here runs in the repository, against
 * simulated robots and one external virtual vehicle. Not a list of plans.
 */
export const capabilities = [
	{ name: 'Capability discovery', body: 'Asks the system what it can do, where its interface allows.', icon: 'nodes' },
	{
		name: 'Declared and verified',
		body: 'Keeps what an interface claims apart from what a test saw work.',
		icon: 'check'
	},
	{
		name: 'Mission lifecycle testing',
		body: 'Send, pause, resume, cancel, and what happens when the same order arrives twice.',
		icon: 'flow'
	},
	{
		name: 'Failure and reconnect testing',
		body: 'Cuts the link and restarts the system, then watches what comes back.',
		icon: 'pulse'
	},
	{
		name: 'Protocol checks',
		body: 'For VDA 5050 2.1.0: every message judged against the official schemas, and behaviour over time.',
		icon: 'open'
	},
	{ name: 'Evidence', body: 'Every call, answer, latency and raw message, kept with the result.', icon: 'audit' },
	{
		name: 'Readiness report',
		body: 'One verdict with its reasons: ready, conditionally ready, not ready or incomplete.',
		icon: 'grid'
	},
	{ name: 'Unknown is not a pass', body: 'A timeout is reported as unknown. Never as a pass, never as a fail.', icon: 'clock' }
];

/** What VNTA Robotics reaches, and how far each has got. Only the first works. */
export type Support = 'Works today' | 'Planned';
export const interfaces: { name: string; note: string; support: Support }[] = [
	{ name: 'VDA 5050', note: 'Version 2.1.0', support: 'Works today' },
	{ name: 'ROS 2', note: 'No adapter yet', support: 'Planned' },
	{ name: 'Open-RMF', note: 'No adapter yet', support: 'Planned' },
	{ name: 'Vendor APIs', note: 'Case by case', support: 'Planned' }
];

/** Who it is for, on the other side of the picture. */
export const audiences = ['Integrators', 'Operators', 'Robot makers', 'Developers'];

/**
 * Supported, experimental, planned. "Supported" means it runs in the
 * repository today. "Experimental" means it exists and is expected to change.
 * "Planned" means not built: an intention, not a compatibility claim.
 */
export const support = {
	now: [
		'VDA 5050 2.1.0 over MQTT, tested against one external virtual vehicle',
		'VNTA simulated adapters, for trying the suite without a robot',
		'Capability records: declared, discovered, verified',
		'Validation suite, evidence and readiness reports'
	],
	experimental: [
		'Runtime API v0: reads capabilities and starts validation. It will change.',
		'Sending missions through an adapter: inside validation runs only.'
	],
	planned: [
		'A first real robot or fleet-manager integration',
		'Runtime SDK',
		'ROS 2 adapter',
		'Open-RMF adapter',
		'Vendor fleet-manager connectors',
		'VDA 5050 3.0.0',
		'Access: mission governance',
		'Identity: machine trust'
	]
};
