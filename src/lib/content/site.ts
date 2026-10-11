// =============================================================================
// VNTA site content
// -----------------------------------------------------------------------------
// Everything the public pages say that is likely to change. Change it here,
// once: the pages, the search data and /llms.txt all read from this file.
//
// VNTA is a technology company. It builds infrastructure for autonomous
// systems. Its first system is VNTA Robotics, a vendor-neutral control layer
// for robots and autonomous machines. VNTA is not an agency, a consultancy or
// a studio, and nothing on the site should read as one.
//
// House rules for copy:
// - Short, technical, quiet, precise. No hype, no "revolutionary", no
//   "AI-powered", no startup cliches.
// - Nothing is claimed that is not true today. VNTA Robotics is in
//   development (October 2026): a first proof of concept exists and runs
//   against simulated robots only. No real machine has been connected and
//   nothing is available to use. Say "designed to" and "will" about the
//   product; never the present tense for what it does, and never anything
//   that reads as a product someone can have. When a real machine is
//   connected, change `robotics.honest` below and the whole site follows. No customer
//   names, no metrics, no testimonials until they are real.
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
export const social: { name: string; href: string }[] = [{ name: 'GitHub', href: githubUrl }];

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
	body: 'Robots, intelligent agents, vehicles and machines are becoming increasingly autonomous. VNTA is designing the control, identity and trust infrastructure that will allow these systems to operate safely across organisations and environments.'
};

/** A system's standing. "In development" is the one being built (a proof of concept so far). */
export type Stage = 'In development' | 'Research';

/** The three kinds of autonomous system the infrastructure is meant to reach. */
export const systems: { name: string; layer: string; body: string; stage: Stage; icon: string }[] = [
	{
		name: 'Robots',
		layer: 'Machine control layer',
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
	{ name: 'Secure', body: 'Identity, permissions and auditability from the foundation.', icon: 'shield' },
	{ name: 'Vendor-neutral', body: 'Designed to work across hardware and software ecosystems.', icon: 'neutral' },
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

// --- The flagship: VNTA Robotics ---------------------------------------------

export const robotics = {
	name: 'VNTA Robotics',
	stage: 'In development' as Stage,
	positioning: 'Infrastructure for trusted autonomous machines.',
	headline: 'A control layer for the physical world.',
	body: 'VNTA Robotics is designed to connect autonomous machines to a shared infrastructure layer for identity, permissions, orchestration, telemetry and audit.',
	what: 'VNTA Robotics is a vendor-neutral machine control plane for robots and autonomous machines, now in development.',
	/** Said wherever the product is shown, so nobody mistakes a proof of concept for a product. */
	honest: 'VNTA Robotics is in development. A first proof of concept runs against simulated robots only. It is not available, and it has not been tested with a real machine.',
	/** How far the proof of concept goes. Said beside the list of what the layer is designed to do. */
	sofar: 'A first proof of concept covers identity, permissions and audit, against simulated robots. The rest is not built.'
};

/** The six parts of the control layer, as drawn in the architecture. */
export const layer = [
	{ name: 'Identity', icon: 'identity' },
	{ name: 'Permissions', icon: 'lock' },
	{ name: 'Connectivity', icon: 'nodes' },
	{ name: 'Orchestration', icon: 'flow' },
	{ name: 'Telemetry', icon: 'pulse' },
	{ name: 'Audit', icon: 'audit' }
];

/** What VNTA Robotics is designed to provide. Not a feature list of a shipped product. */
export const capabilities = [
	{ name: 'Machine identity', body: 'A verifiable identity for every machine.', icon: 'identity' },
	{ name: 'Authentication', body: 'A machine proves what it is before it connects.', icon: 'key' },
	{
		name: 'Permissions and policy',
		body: 'Rules for what a machine may do, and where, enforced by the layer.',
		icon: 'lock'
	},
	{
		name: 'Robot connectivity',
		body: 'One way to connect machines from different manufacturers.',
		icon: 'nodes'
	},
	{ name: 'Task orchestration', body: 'Assigning and coordinating work across machines.', icon: 'flow' },
	{ name: 'Telemetry', body: 'Status and health data from each connected machine.', icon: 'pulse' },
	{ name: 'Audit logs', body: 'A verifiable record of what each machine did, and when.', icon: 'audit' },
	{ name: 'Fleet visibility', body: 'One view of every machine, across sites.', icon: 'grid' },
	{
		name: 'Integrations',
		body: 'Connections to the systems an organisation already runs.',
		icon: 'plug'
	},
	{ name: 'Manufacturer APIs', body: 'APIs for working with different robot manufacturers.', icon: 'open' }
];

/** Kinds of machine the layer is designed to sit under. Examples, not a compatibility list. */
export const machines = [
	{ name: 'Mobile robots', icon: 'robot' },
	{ name: 'Robotic arms', icon: 'arm' },
	{ name: 'Vehicles', icon: 'vehicle' },
	{ name: 'Field machines', icon: 'field' }
];

/** Kinds of system on the other side. Categories, not a list of integrations. */
export const enterprise = ['WMS', 'MES', 'ERP', 'SCADA', 'Analytics', 'Custom APIs'];
