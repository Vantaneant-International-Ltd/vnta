// =============================================================================
// VNTA site content
// -----------------------------------------------------------------------------
// Everything the public pages say that is likely to change: the work, the
// prices, the steps, the questions. Change it here, once.
//
// House rules for copy:
// - The reader runs a garage, a shop or a trade, and is on a phone. Short
//   words, short lines, nothing they have to work out.
// - Plain punctuation. No em or en dashes.
// - No claim that is not true today, and no client fact that is not on the
//   client's own site or in their repo.
// =============================================================================

export const studioEmail = 'studio@vnta.xyz';

/** How fast we answer an enquiry. Used in the hero, the steps and the form. */
export const replyWithin = 'two working days';

// --- The work ----------------------------------------------------------------
// Newest first. `href` is left out for a site that is not live yet.

/**
 * A project's world: the few colours its card borrows from the project's own
 * brand, so each one gets a spotlight in its own light. Kept small on purpose:
 * a ground, the text on it, a quiet text, a line, and one accent. The ground,
 * the text and the accent are that project's own; where a project's colours
 * are not known yet, the card stays in VNTA's greys.
 */
export type World = {
	bg: string; // the card
	ink: string; // text on it
	soft: string; // quiet text
	line: string; // hairlines
	accent: string; // list marks and link underlines, nothing more
	dark: boolean; // a dark card needs lighter device bodies
};

export type Work = {
	world: World;
	name: string;
	trade: string;
	place: string;
	status: 'Live' | 'In build';
	href?: string;
	domain?: string;
	image: string; // stem under /work: laptop, -tablet and -phone screenshots
	alt: string;
	summary: string;
	built: string[];
};

export const work: Work[] = [
	{
		world: { bg: '#151921', ink: '#eef1f6', soft: '#9a9fa8', line: '#38404c', accent: '#62a1f6', dark: true },
		name: 'L.M. Motors',
		trade: 'Used car dealer',
		place: 'Sallins, Co. Kildare',
		status: 'In build',
		image: 'lm-motors',
		alt: 'The L.M. Motors home page on a laptop, a tablet and a phone: Used cars, exactly as described, with a search by make, model and budget.',
		summary:
			'Customers search the stock, shortlist cars, then ring or message about the one they want.',
		built: [
			'Search and filter every car',
			'A page for each car, easy to find on Google',
			'Sell your car and finance pages'
		]
	},
	{
		world: { bg: '#f3f4f2', ink: '#0b0c0d', soft: '#555b56', line: '#dcdfda', accent: '#8cc63f', dark: false },
		name: 'EZGO Auto Works',
		trade: 'Garage',
		place: 'Finglas, Dublin 11',
		status: 'Live',
		href: 'https://ezgoautoworks.ie',
		domain: 'ezgoautoworks.ie',
		image: 'ezgo-auto-works',
		alt: 'The EZGO Auto Works home page on a laptop, a tablet and a phone: Fixed. Sprayed. Detailed. beside a photo of a mechanic under a car.',
		summary:
			'Mechanics, bodywork and detailing under one roof. The site shows the prices and gets people to ring or WhatsApp.',
		built: [
			'A clear price list',
			'WhatsApp and phone on every page',
			'Pages written for local Google searches'
		]
	},
	{
		world: { bg: '#070810', ink: '#f3f1ee', soft: '#a8a39c', line: '#22232b', accent: '#b06a4e', dark: true },
		name: 'BUILDT',
		trade: 'Custom PC builder',
		place: 'Dublin',
		status: 'Live',
		href: 'https://buildt.ie',
		domain: 'buildt.ie',
		image: 'buildt',
		alt: 'The BUILDT home page on a laptop, a tablet and a phone: BUILDT by hand. Proven on the bench.',
		summary: 'Customers build their own PC on the site, watch the price change, and order.',
		built: [
			'A build your own PC tool with live prices',
			'Ready built PCs to buy',
			'The owner updates stock and prices himself'
		]
	}
];

// --- Prices ------------------------------------------------------------------
// Two numbers per plan: a one-time build fee, then a monthly fee that covers
// running the site. Both are "from" prices; the quote is fixed before we start.

export type Plan = {
	name: string;
	for: string;
	build: number;
	monthly: number;
	time: string;
	includes: string[];
};

export const plans: Plan[] = [
	{
		name: 'Website',
		for: 'For garages, trades, salons and cafés.',
		build: 950,
		monthly: 39,
		time: 'Live in 2 to 3 weeks',
		includes: [
			'Up to six pages',
			'Your services and prices',
			'Call and WhatsApp buttons',
			'Set up to be found on Google and by AI'
		]
	},
	{
		name: 'Website with stock',
		for: 'For car dealers and anyone with a list that changes.',
		build: 1900,
		monthly: 59,
		time: 'Live in 3 to 5 weeks',
		includes: [
			'Everything in Website',
			'Your stock, with search and filters',
			'A page for every item',
			'Add and remove items yourself'
		]
	},
	{
		name: 'Online shop',
		for: 'For selling and getting paid online.',
		build: 3500,
		monthly: 89,
		time: 'Live in 5 to 8 weeks',
		includes: [
			'Everything in Website with stock',
			'Cart and online payment',
			'Manage orders, stock and prices'
		]
	}
];

/** The three things people ask straight after the price. */
export const ownedFrom = 699; // buying the site outright: code, database, hosting
export const priceNotes = [
	{
		name: 'The monthly fee',
		body: 'Covers hosting, security, updates and small changes.'
	},
	{
		name: 'No contract',
		body: 'Month to month. Cancel with 30 days notice.'
	},
	{
		name: 'Own it outright',
		body: `From €${ownedFrom}, one time, and it is all yours to keep.`
	}
];

// --- How it works ------------------------------------------------------------

export const steps = [
	{
		name: 'Tell us what you do',
		body: `We send you a fixed price within ${replyWithin}.`
	},
	{
		name: 'We design it',
		body: 'You see it and change what you like before we build.'
	},
	{
		name: 'We build it and run it',
		body: 'We launch it, then look after it every month.'
	}
];

// --- Questions ---------------------------------------------------------------

export const questions = [
	{
		q: 'I already have a website. Can you redo it?',
		a: 'Yes. We keep the page addresses Google already knows, so you do not lose the customers who find you today.'
	},
	{
		q: 'Who owns the website?',
		a: `Your name, your content and your domain are yours from day one. The site runs on our hosting while you pay monthly. To hold it all yourself, buy it outright from €${ownedFrom}.`
	},
	{
		q: 'What else will I pay for?',
		a: 'Your domain, about €37 a year for a .ie. If your site needs an outside service, we pass it on at cost and add nothing.'
	},
	{
		q: 'Will people find me?',
		a: 'We set your site up for Google, and for AI too, so people who ask an AI for a business like yours can find you as well. Nobody can honestly promise the top spot.'
	},
	{
		q: 'Is my website built by AI?',
		a: 'Not on its own. People design and build it, and we use AI to help us do the work. We are proud of how we work.'
	}
];

// --- Our own houses ----------------------------------------------------------
// The companies VNTA builds and runs for itself. The first one is the lead: it
// gets the full spotlight, the same as a client job. The rest follow in a row
// of smaller cards. Every line here is the house's own published wording, and
// every picture is a screen grab of the house's live site, never a mock-up.
//
// `image` is the stem of the screenshots under /work, the same three files a
// client job has (laptop, -tablet and -phone).

export type House = {
	world: World;
	name: string;
	kind?: string; // the lead house only
	href: string;
	domain: string;
	line: string;
	status: string;
	image: string;
	alt: string;
	built?: string[]; // the lead house only
};

export const houses: House[] = [
	{
		world: { bg: '#eff0eb', ink: '#111111', soft: '#5b5c57', line: '#d6d7d1', accent: '#cf1f2a', dark: false },
		name: 'Carbon Wheels',
		kind: 'Online shop',
		href: 'https://carbonwheels.ie',
		domain: 'carbonwheels.ie',
		line: 'Carbon steering wheels for BMW. Brand new and complete, with the airbag and buttons already fitted.',
		status: 'Opens 1 November',
		image: 'carbon-wheels',
		alt: 'The Carbon Wheels home page on a laptop, a tablet and a phone: Carbon steering wheels for BMW, beside a photo of a steering wheel.',
		built: [
			'Type your reg to check a wheel fits your car',
			'Six styles to swipe through',
			'A list to join before opening day'
		]
	},
	{
		world: { bg: '#f4f4f4', ink: '#000000', soft: '#5c5c5c', line: '#d2d2d2', accent: '#000000', dark: false },
		name: 'Vendr',
		href: 'https://vendr.ie',
		domain: 'vendr.ie',
		line: 'A quieter form of retail.',
		status: 'Coming soon',
		image: 'vendr',
		alt: 'The Vendr home page on a laptop, a tablet and a phone: A quieter form of retail.'
	},
	{
		world: { bg: '#121619', ink: '#f2f3f1', soft: '#a9aeb1', line: '#2a3034', accent: '#f2f3f1', dark: true },
		name: 'Maison Seul',
		href: 'https://maisonseul.com',
		domain: 'maisonseul.com',
		line: 'Singular objects.',
		status: '2027',
		image: 'maison-seul',
		alt: 'The Maison Seul home page on a laptop, a tablet and a phone: the name on a dark page.'
	}
];

/** A world as the inline custom properties its card reads. */
export const worldStyle = (w: World) =>
	`--w-bg:${w.bg};--w-ink:${w.ink};--w-soft:${w.soft};--w-line:${w.line};--w-accent:${w.accent};` +
	`--device:${w.dark ? '#3a3a3c' : '#333333'};--metal:${w.dark ? '#8e8e93' : '#c7c7cc'};--metal-dark:${w.dark ? '#636366' : '#a1a1a6'}`;

/** Formats a euro amount the way the page prints it: €1,900. */
export const euro = (n: number) => `€${n.toLocaleString('en-IE')}`;
