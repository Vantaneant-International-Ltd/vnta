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
// - Runtime as an annual platform is planned. It must never look like
//   something that can be bought today.
// - No enterprise price. No savings claims. No customer logos. No "certified".
// - A validation report is not a safety certification.
//
// The internal cost and margin rules are in the vnta-robotics repository,
// docs/commercial/PRICING.md. They are not for this site.
// =============================================================================

export const pricing = {
	eyebrow: 'Pricing',
	headline: 'Validation for real robot deployments.',
	lede: 'Start with one integration. Validate what actually works. Scale into Runtime as the platform matures.',
	banner: {
		label: 'In development',
		text: 'VNTA Robotics is currently in development and accepting a limited number of early validation and commissioning projects. So far it has been tested with simulated robots and one external virtual vehicle.'
	},
	vat: 'Ex VAT',
	primaryCta: 'Request a validation pilot',
	secondaryCta: 'Talk to engineering'
};

export type Availability = 'Limited' | 'Case by case' | 'Coming later';

export type Tier = {
	id: string;
	label: string;
	title: string;
	price: string;
	per?: string;
	availability: Availability;
	body: string;
	includes: string[];
	cta: string;
	note: string;
	/** The main offer. One tier only. */
	primary?: boolean;
	/** Planned, not for sale. Drawn quieter, and its list reads as intentions. */
	planned?: boolean;
};

export const tiers: Tier[] = [
	{
		id: 'design-partner',
		label: 'Design partner',
		title: 'Early partner',
		price: 'From €2,500',
		availability: 'Limited',
		body: 'For early integrators and operators who can give real technical access and structured feedback while the product is being built.',
		includes: [
			'One agreed integration',
			'Core validation suite',
			'Compatibility report',
			'Direct line to the people building it',
			'A say in what gets built next'
		],
		cta: 'Apply for design partner',
		note: 'In exchange for access to a real robot or fleet environment.'
	},
	{
		id: 'validation-pilot',
		label: 'Validation pilot',
		title: 'One real integration',
		price: 'From €6,500',
		availability: 'Limited',
		primary: true,
		body: 'Validate one robot or fleet integration and receive a readiness report backed by evidence.',
		includes: [
			'One agreed integration',
			'Capability discovery',
			'Validation test suite',
			'Mission lifecycle testing',
			'Reconnect and failure testing',
			'Capability matrix: declared against verified',
			'Compatibility and readiness report',
			'Logs and test evidence',
			'Technical findings review',
			'Remediation notes where relevant',
			'Implementation support during the pilot'
		],
		cta: 'Request a pilot',
		note: 'Final scope and price depend on integration complexity.'
	},
	{
		id: 'advanced-commissioning',
		label: 'Advanced commissioning',
		title: 'Broader scope',
		price: 'From €12,500',
		availability: 'Case by case',
		body: 'For multiple robot systems, custom integration work, site-specific scenarios or a more complex fleet manager.',
		includes: [
			'Extended validation suites',
			'Multiple systems or adapters',
			'Custom test scenarios',
			'More detailed technical findings',
			'Priority engineering support',
			'Deployment-specific reporting'
		],
		cta: 'Talk to engineering',
		note: 'Taken on case by case. Not a standard offer yet.'
	},
	{
		id: 'runtime',
		label: 'Runtime',
		title: 'Platform access',
		price: 'From €24,000',
		per: 'a year',
		availability: 'Coming later',
		planned: true,
		body: 'For integrators using VNTA Robotics across repeated deployments. Planned: this is not available today.',
		includes: [
			'Reusable validation environment',
			'Multiple projects',
			'Saved test suites',
			'Historical validation evidence',
			'Shared capability model',
			'SDK and API access as it becomes available',
			'Connector library',
			'Team access'
		],
		cta: 'Join the waitlist',
		note: 'What the platform is intended to include. None of it can be bought yet.'
	}
];

export const enterprise = {
	label: 'Enterprise',
	title: 'Larger organisations',
	price: 'Custom',
	body: 'For larger integrators and multi-site operators with requirements of their own. Scoped and priced by agreement.',
	includes: [
		'Multiple teams and sites',
		'Private deployment: on-premise or private cloud',
		'Custom connectors',
		'Dedicated support and SLA',
		'Security review'
	],
	cta: 'Talk to engineering',
	note: 'Discussed case by case while the product is in development.'
};

export const units = {
	headline: 'Priced around integrations and deployments, not robot count.',
	body: 'The value today is in integrating and validating, not in running a fleet day to day. So VNTA Robotics is priced by the work it helps reduce.',
	list: [
		{ name: 'Per integration', body: 'One robot or fleet system, validated once.' },
		{ name: 'Per deployment', body: 'A commissioning project with a wider scope.' },
		{ name: 'Per engineering team', body: 'Platform access for repeated use. Planned.' }
	],
	lines: [
		'The annual platform becomes relevant when VNTA Robotics is used repeatedly across projects.',
		'Pilot scope and final pricing depend on integration complexity.'
	]
};

/** Every engagement, in order. Nothing is bought with a button. */
export const workflow = [
	{ name: 'Request', body: 'Tell us about the robot or fleet system.' },
	{ name: 'Qualification', body: 'We check it is something we can test today.' },
	{ name: 'Technical review', body: 'Interfaces, documentation, access.' },
	{ name: 'Scope', body: 'What will be tested, and how success is judged.' },
	{ name: 'Proposal', body: 'A price for that scope.' },
	{ name: 'Pilot', body: 'The work, and the report.' }
];

export const status: { when: 'Now' | 'Next' | 'Later'; items: string[] }[] = [
	{
		when: 'Now',
		items: [
			'Simulated robot validation',
			'Common capability model',
			'Validation test runner',
			'Compatibility and readiness reports',
			'External VDA 5050 testing, against a virtual vehicle'
		]
	},
	{
		when: 'Next',
		items: [
			'A first real robot or fleet-manager integration',
			'More external implementations',
			'Pilot deployments with integrators',
			'Runtime API and SDK'
		]
	},
	{
		when: 'Later',
		items: [
			'Sending work through one interface',
			'Access: mission governance',
			'Identity: machine trust',
			'Broader autonomous-system infrastructure'
		]
	}
];

export const faq: { q: string; a: string }[] = [
	{
		q: 'Has VNTA Robotics been used on a real robot?',
		a: 'Not yet. It has been run against simulated robots and one external virtual vehicle: open-source VDA 5050 software that VNTA did not write. A first pilot is the first contact with a real system, and part of it is writing the adapter for that system. That is why early places are limited and scoped carefully.'
	},
	{
		q: 'What does the pilot include?',
		a: 'One agreed integration, a defined validation suite, results backed by evidence, a compatibility and readiness report, and a technical review of the findings.'
	},
	{
		q: 'Do you certify robots as safe?',
		a: 'No. VNTA validation evaluates software integration behaviour. It is not a functional-safety certification and does not replace manufacturer commissioning or safety procedures.'
	},
	{
		q: 'Do you charge per robot?',
		a: 'No. Pricing is based on integration scope, deployment use and, later, platform access.'
	},
	{
		q: 'Which standards are supported today?',
		a: 'VDA 5050 version 2.1.0, tested against one external virtual vehicle. Adapters for ROS 2, Open-RMF and vendor fleet managers are planned and do not exist yet. Support varies by protocol and implementation.'
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
		q: 'Are pilots refundable?',
		a: 'Commercial terms are agreed before each pilot, based on its scope and success criteria.'
	},
	{
		q: 'Can I buy Runtime today?',
		a: 'No. Runtime as an annual platform is planned. An early API exists that reads capabilities and starts validation. You can join the waitlist.'
	}
];

/** The offers a request can be about. The first is the default. */
export const interests = ['Validation pilot', 'Design partner', 'Advanced commissioning', 'Runtime waitlist', 'Enterprise', 'Not sure yet'];

export const form = {
	title: 'Request a validation pilot',
	lede: 'Tell us about the integration. This is not a checkout: we read every request and reply about technical fit.',
	submit: 'Submit pilot request',
	thanks: 'Thanks. VNTA is currently selecting a small number of integrations for the development program. We’ll review the technical fit before confirming a pilot.'
};
