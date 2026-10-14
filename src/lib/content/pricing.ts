// =============================================================================
// VNTA Robotics: pricing
// -----------------------------------------------------------------------------
// The words and numbers on /robotics/pricing. Change them here.
//
// What must stay true:
// - Every price is "from", ex VAT, and follows an agreed scope. Nothing here
//   is a fixed price, and there is no checkout: every engagement goes request,
//   qualification, technical review, scope, proposal, pilot.
// - These prices have not been tested with a customer. No pilot has been run.
//   The page says VNTA Robotics is in development, and says so plainly.
// - Priced per integration, per deployment, or per engineering team. Never
//   per robot per month.
// - Three offers only: what VNTA can deliver now. Runtime as an annual
//   platform is planned. It is one line of text, never a card or a price.
// - No enterprise price. No savings claims. No customer logos. No "certified".
// - A validation report is not a safety certification.
//
// The internal cost and margin rules are in the vnta-robotics repository,
// docs/commercial/PRICING.md. They are not for this site.
// =============================================================================

export const pricing = {
	eyebrow: 'Pricing',
	headline: 'Validation for robot and fleet integrations.',
	lede: 'Start with one integration. See what actually works, with the evidence behind every result.',
	vat: 'Ex VAT',
	primaryCta: 'Validate an integration',
	secondaryCta: 'Become a design partner',
	/** Runtime, said once and quietly. Not an offer. */
	runtime: 'Runtime subscriptions will be introduced once repeated use across real deployments has been validated.'
};

export type Availability = 'Limited' | 'Case by case';

export type Tier = {
	id: string;
	/** What the request form calls this offer. */
	interest: string;
	label: string;
	price: string;
	availability: Availability;
	body: string;
	includes: string[];
	cta: string;
	note: string;
	/** The main offer. One tier only. */
	primary?: boolean;
};

export const tiers: Tier[] = [
	{
		id: 'design-partner',
		interest: 'Design partner',
		label: 'Design partner',
		price: 'From €2,500',
		availability: 'Limited',
		body: 'For initial production integrations while Validation is being developed.',
		includes: [
			'One integration',
			'Structured validation',
			'Evidence-backed findings',
			'Technical access and a direct feedback loop',
			'Discounted early-partner pricing'
		],
		cta: 'Become a design partner',
		note: 'In exchange for access to a real robot or fleet environment.'
	},
	{
		id: 'validation',
		interest: 'Validation',
		label: 'Validation',
		price: 'From €6,500',
		availability: 'Limited',
		primary: true,
		body: 'Independent validation of a robot or fleet integration, with evidence and readiness findings.',
		includes: [
			'Defined test scope',
			'Capability validation: declared against verified',
			'Failure and reconnect behaviour, where applicable',
			'Evidence capture: calls, messages, timestamps',
			'Readiness result',
			'Technical report, with remediation notes'
		],
		cta: 'Validate an integration',
		note: 'Final scope and price depend on integration complexity.'
	},
	{
		id: 'larger',
		interest: 'Larger deployment',
		label: 'Larger deployments',
		price: 'Scoped',
		availability: 'Case by case',
		body: 'For multiple systems, sites, vendors or custom adapters.',
		includes: [
			'Multi-system validation',
			'More than one adapter or vendor',
			'Site-specific test scenarios',
			'Deployment-level reporting'
		],
		cta: 'Discuss an integration',
		note: 'Scoped and priced by agreement, case by case.'
	}
];

export const units = {
	headline: 'Priced around integrations, not robot count.',
	body: 'The value today is in validating an integration before it goes into operation, not in running a fleet day to day. So it is priced by the integration.',
	list: [
		{ name: 'Per integration', body: 'One robot or fleet system, validated once.' },
		{ name: 'Per deployment', body: 'Several systems or sites, validated as one project.' }
	]
};

/** Every engagement, in order. Nothing is bought with a button. */
export const workflow = [
	{ name: 'Request', body: 'Tell us about the robot or fleet system.' },
	{ name: 'Qualification', body: 'We check it is something we can test today.' },
	{ name: 'Technical review', body: 'Interfaces, documentation, access.' },
	{ name: 'Scope', body: 'What will be tested, and how success is judged.' },
	{ name: 'Proposal', body: 'A price for that scope.' },
	{ name: 'Validation', body: 'The work, the result and the evidence.' }
];

export const faq: { q: string; a: string }[] = [
	{
		q: 'Has Validation been used on a real robot?',
		a: 'Not yet. It has been run against simulated robots and one external virtual vehicle: open-source VDA 5050 software that VNTA did not write. A first project with a design partner is the first contact with a real system, and part of it is writing the adapter for that system. That is why early places are limited and scoped carefully.'
	},
	{
		q: 'What does a validation include?',
		a: 'One agreed integration, a defined test scope, results backed by evidence, a readiness result, and a technical report with remediation notes.'
	},
	{
		q: 'Is this certification?',
		a: 'No. VNTA validation evaluates software integration behaviour. It is not safety, functional-safety or regulatory certification, and does not replace manufacturer commissioning or safety procedures.'
	},
	{
		q: 'Do you charge per robot?',
		a: 'No. Pricing is based on the integration and the scope of the deployment.'
	},
	{
		q: 'Which standards are supported today?',
		a: 'VDA 5050 version 2.1.0, tested against one external virtual vehicle. VDA 5050 3.0, ROS 2, Open-RMF and vendor fleet managers are planned and have no adapter yet. Support varies by protocol and implementation.'
	},
	{
		q: 'Can you test a simulated system?',
		a: 'Yes, where there is an adapter for its interface. Today that means VDA 5050 2.1.0. Testing against a simulator or a vendor test environment first, before any hardware is involved, is the sensible order.'
	},
	{
		q: 'Can you support a custom robot system?',
		a: 'Possibly. Each system needs an adapter. Custom adapters and validation scopes are looked at case by case.'
	},
	{
		q: 'Is the price fixed?',
		a: 'No. Every price here is a starting point, shown ex VAT. The scope is agreed before work begins and the proposal is priced for that scope.'
	},
	{
		q: 'Can I subscribe to a platform?',
		a: 'Not yet. Runtime subscriptions will be introduced once repeated use across real deployments has been validated.'
	}
];

/** The offers a request can be about. The first is the default. */
export const interests = ['Validation', 'Design partner', 'Larger deployment', 'Not sure yet'];

export const form = {
	title: 'Validate an integration',
	lede: 'Tell us about the integration. This is not a checkout: we read every request and reply about technical fit.',
	submit: 'Send request',
	thanks: 'Thanks. We are taking a small number of early validation projects, and we will review the technical fit before confirming anything.'
};
