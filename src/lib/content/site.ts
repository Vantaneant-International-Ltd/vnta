// =============================================================================
// VNTA site content
// -----------------------------------------------------------------------------
// Everything the public pages say that is likely to change: the pitch, the
// work, the prices, the steps, the questions. Change it here, once.
//
// VNTA is a brand studio. It looks at a business, works out what it needs to
// change, and then designs it: the brand first, and a website where one is
// needed. The website prices are still on the page, lower down.
//
// House rules for copy:
// - The reader owns or runs a business, of any kind and any size, and is
//   often on a phone. Short words, short lines, nothing they have to work
//   out. An investor reading the same page should see a real, working
//   studio; nothing on the public site is addressed to investors.
// - Plain punctuation. No em or en dashes.
// - No claim that is not true today, and no client fact that is not on the
//   client's own site or in their repo.
// =============================================================================

export const siteUrl = 'https://vnta.xyz';
export const studioEmail = 'studio@vnta.xyz';

/**
 * VNTA's own public profiles: Instagram, Facebook, LinkedIn, X and so on.
 * Each one listed here is shown in the foot of every page and is handed to
 * search engines and AI assistants as "this profile is the same VNTA", which
 * is how they join the dots between the site and the profiles. Only add a
 * profile that is real and ours, with its full address.
 */
export const social: { name: string; href: string }[] = [];

/** How fast we answer an enquiry. Used in the hero, the steps and the form. */
export const replyWithin = 'two working days';

// --- The pitch ---------------------------------------------------------------
// The first thing anyone reads. The headline is also the line on the share
// card (static/og.png): change it there too.

export const pitch = {
	headline: 'We look at your business and see what to change.',
	lede: 'VNTA is a brand studio in Dublin. We sit down with you, work out what the business needs, then design the brand and build the website.',
	/** One line for search results, share cards and the foot. */
	short: 'A brand studio in Dublin. We design brands and build websites, for other people\'s businesses and for our own.'
};

/** What we do: three things, and a client can come for any one of them. */
export const offer = [
	{
		name: 'The sit-down',
		body: 'We look at the whole business with you: what you sell, who buys it, and what is getting in the way. Then we tell you plainly what we would change.'
	},
	{
		name: 'The brand',
		body: 'How the business looks and sounds everywhere a customer meets it. The logo, the colours, the type and the words.'
	},
	{
		name: 'The website',
		body: 'Designed and built from scratch, set up to be found, and looked after every month.'
	}
];

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
	dark: boolean; // a dark card needs a lighter edge on its screens
};

export type Work = {
	world: World;
	name: string;
	did: 'Brand and website' | 'Website'; // what VNTA made for them. Only claim the brand where it is ours.
	trade: string;
	place: string;
	status: 'Live' | 'In build';
	href?: string;
	domain?: string;
	image: string; // stem under /work: the laptop and -phone screenshots
	alt: string;
	summary: string;
	built: string[];
};

export const work: Work[] = [
	{
		world: { bg: '#151921', ink: '#eef1f6', soft: '#9a9fa8', line: '#38404c', accent: '#62a1f6', dark: true },
		name: 'L.M. Motors',
		did: 'Website',
		trade: 'Used car dealer',
		place: 'Sallins, Co. Kildare',
		status: 'In build',
		image: 'lm-motors',
		alt: 'The L.M. Motors home page on a laptop and a phone: Used cars, exactly as described, with a search by make, model and budget.',
		summary:
			'Customers search the stock, shortlist cars, then ring or message about the one they want.',
		built: [
			'Search and filter every car',
			'A page for each car, easy to find on Google',
			'Sell your car and finance pages'
		]
	},
	{
		world: { bg: '#191a19', ink: '#f4f5f2', soft: '#b9beb8', line: '#333633', accent: '#8bc24a', dark: true },
		name: 'EZGO Auto Works',
		did: 'Brand and website',
		trade: 'Garage',
		place: 'Finglas, Dublin 11',
		status: 'Live',
		href: 'https://ezgoautoworks.ie',
		domain: 'ezgoautoworks.ie',
		image: 'ezgo-auto-works',
		alt: 'The EZGO Auto Works home page on a laptop and a phone: Fixed. Sprayed. Detailed. beside a photo of a mechanic under a car.',
		summary:
			'The brand and the site. Mechanics, bodywork and detailing under one roof, with the prices shown and a ring or a WhatsApp one tap away.',
		built: [
			'A clear price list',
			'WhatsApp and phone on every page',
			'Pages written for local Google searches'
		]
	},
	{
		world: { bg: '#070810', ink: '#f3f1ee', soft: '#a8a39c', line: '#22232b', accent: '#b06a4e', dark: true },
		name: 'BUILDT',
		did: 'Brand and website',
		trade: 'Custom PC builder',
		place: 'Dublin',
		status: 'Live',
		href: 'https://buildt.ie',
		domain: 'buildt.ie',
		image: 'buildt',
		alt: 'The BUILDT home page on a laptop and a phone: BUILDT by hand. Proven on the bench.',
		summary:
			'The brand and the site. Customers build their own PC on it, watch the price change, and order.',
		built: [
			'A build your own PC tool with live prices',
			'Ready built PCs to buy',
			'The owner updates stock and prices himself'
		]
	}
];

// --- The wall ----------------------------------------------------------------
// The row of tiles under the top of the home page. Six show at a time; every
// couple of seconds one tile turns over to the next name in this list. The
// first six are the ones a visitor sees before anything turns, so the clients
// lead.
//
// Three kinds, and the page says so in the line above the tiles:
//   client  a business we have worked for
//   house   a company of our own
//   tool    something we build on. Only tools we really use. Its mark comes
//           from ui/toolMarks.ts, under the same name.
// `image` is a file in static/logos, drawn in white for a dark tile. Set
// `named` when the picture already spells the name out. A company with no
// `image` yet is set in type; add the file and name it here when we have it.

export type Mark = {
	name: string;
	kind: 'client' | 'house' | 'tool';
	image?: string;
	named?: boolean;
};

export const wall: Mark[] = [
	{ name: 'EZGO Auto Works', kind: 'client', image: 'ezgo.svg' },
	{ name: 'Cloudflare', kind: 'tool' },
	{ name: 'BUILDT', kind: 'client', image: 'buildt.png', named: true },
	{ name: 'Shopify', kind: 'tool' },
	{ name: 'L.M. Motors', kind: 'client', image: 'lm-motors.png', named: true },
	{ name: 'Claude', kind: 'tool' },
	{ name: 'Carbon Wheels', kind: 'house' },
	{ name: 'Svelte', kind: 'tool' },
	{ name: 'Vendr', kind: 'house' },
	{ name: 'GitHub', kind: 'tool' },
	{ name: 'Maison Seul', kind: 'house' },
	{ name: 'Google Analytics', kind: 'tool' }
];

// --- Prices ------------------------------------------------------------------
// Brand work has no price list: it is priced after the sit-down. The websites
// do. Two numbers per plan: a one-time build fee, then a monthly fee that
// covers running the site. Both are "from" prices; the quote is fixed before
// we start.

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
		name: 'Tell us about your business',
		body: `We reply within ${replyWithin}.`
	},
	{
		name: 'We sit down',
		body: 'You talk, we ask questions, and we tell you plainly what we would change.'
	},
	{
		name: 'We design it',
		body: 'The brand first, then the website if you need one. You see it and change what you like.'
	},
	{
		name: 'We build it and run it',
		body: 'We launch it, then look after it every month.'
	}
];

// --- Questions ---------------------------------------------------------------

export const questions = [
	{
		q: 'Do I have to want a website?',
		a: 'No. You can come for the brand alone, or just to talk the business through. We start with the conversation and see what you need.'
	},
	{
		q: 'What is brand design?',
		a: 'It is how your business looks and sounds everywhere a customer meets it: the logo, the colours, the type and the words. Done well, people know it is you before they read the name.'
	},
	{
		q: 'What does brand work cost?',
		a: 'It depends on what the business needs, so we price it after we talk. You get the figure in writing before we start.'
	},
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
// `image` is the stem of the screenshots under /work, the same files a client
// job has (the laptop and the -phone).

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
		alt: 'The Carbon Wheels home page on a laptop and a phone: Carbon steering wheels, done properly, beside a photo of a steering wheel.',
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
		alt: 'The Vendr home page on a laptop and a phone: A quieter form of retail.'
	},
	{
		world: { bg: '#121619', ink: '#f2f3f1', soft: '#a9aeb1', line: '#2a3034', accent: '#f2f3f1', dark: true },
		name: 'Maison Seul',
		href: 'https://maisonseul.com',
		domain: 'maisonseul.com',
		line: 'Singular objects.',
		status: '2027',
		image: 'maison-seul',
		alt: 'The Maison Seul home page on a laptop and a phone: the name on a dark page.'
	}
];

// --- Landing pages -----------------------------------------------------------
// One short page for each thing people actually type into Google or ask an AI:
// "website for a garage", "car dealer website", "online shop", "web design
// Dublin". Each one answers that search with a real example and a real price.
// Same rules as the rest of the copy: nothing that is not true today.

export type Landing = {
	slug: string; // the page address, /<slug>
	label: string; // the short link text in the foot
	title: string; // the heading on the page
	metaTitle: string; // the line Google shows, 60 characters or fewer
	description: string; // the two lines under it, 160 characters or fewer
	lede: string;
	plans: string[]; // names from `plans`
	gets: string[]; // what you get
	examples: string[]; // names from `work` or `houses`
	questions: { q: string; a: string }[];
};

export const landings: Landing[] = [
	{
		slug: 'websites-for-garages',
		label: 'Websites for garages',
		title: 'Websites for garages',
		metaTitle: 'Websites for garages in Ireland, from €950 | VNTA',
		description:
			'VNTA builds websites for Irish garages and mechanics. Your services, your prices, and call and WhatsApp buttons on every page. From €950, then €39 a month.',
		lede: 'A garage website has one job: get people to ring. We build it, put your prices on it, and look after it every month.',
		plans: ['Website'],
		gets: [
			'Your services and your prices, easy to read on a phone',
			'Call and WhatsApp buttons on every page',
			'A page for each main service, written for local Google searches',
			'Set up to be found on Google and by AI',
			'Hosting, security, updates and small changes every month'
		],
		examples: ['EZGO Auto Works'],
		questions: [
			{
				q: 'Can customers ring or message me from the site?',
				a: 'Yes. Call and WhatsApp buttons sit on every page, so a customer can reach you in one tap.'
			},
			{
				q: 'I do bodywork and detailing too. Can it show all of it?',
				a: 'Yes. EZGO Auto Works does mechanics, bodywork and detailing under one roof, and the site we built shows all three.'
			},
			{
				q: 'How much is a website for a garage?',
				a: 'From €950 to build, then from €39 a month to host it and look after it. You get the exact price in writing before we start.'
			}
		]
	},
	{
		slug: 'websites-for-car-dealers',
		label: 'Websites for car dealers',
		title: 'Websites for car dealers',
		metaTitle: 'Websites for car dealers in Ireland, from €1,900 | VNTA',
		description:
			'VNTA builds websites for Irish car dealers. Your stock with search and filters, a page for every car, and you add and remove cars yourself. From €1,900.',
		lede: 'People come to a dealer website to see the cars. So we put your stock first, with search, filters and a page for every car.',
		plans: ['Website with stock'],
		gets: [
			'Your stock, with search and filters',
			'A page for every car, easy to find on Google and easy to share',
			'Add and remove cars yourself',
			'Call and WhatsApp buttons on every page',
			'Hosting, security, updates and small changes every month'
		],
		examples: ['L.M. Motors'],
		questions: [
			{
				q: 'Can I add and remove cars myself?',
				a: 'Yes. You add and remove cars yourself, so the site always matches the forecourt. No need to ring us for every change.'
			},
			{
				q: 'Can it have sell your car and finance pages?',
				a: 'Yes. The L.M. Motors site we are building has both.'
			},
			{
				q: 'How much is a website for a car dealer?',
				a: 'From €1,900 to build, then from €59 a month to host it and look after it. You get the exact price in writing before we start.'
			}
		]
	},
	{
		slug: 'online-shops',
		label: 'Online shops',
		title: 'Online shops',
		metaTitle: 'Online shops for Irish businesses, from €3,500 | VNTA',
		description:
			'VNTA builds online shops for Irish businesses. A cart, online payment, and you manage orders, stock and prices yourself. From €3,500, then €89 a month.',
		lede: 'Sell and get paid online. We build the shop, and you manage your own orders, stock and prices.',
		plans: ['Online shop'],
		gets: [
			'A cart and online payment',
			'Your products, with search and filters',
			'Manage orders, stock and prices yourself',
			'Set up to be found on Google and by AI',
			'Hosting, security, updates and small changes every month'
		],
		examples: ['BUILDT', 'Carbon Wheels'],
		questions: [
			{
				q: 'Do you run a shop yourselves?',
				a: 'Yes. Carbon Wheels is our own shop. It sells carbon steering wheels for BMW and opens on 1 November 2026.'
			},
			{
				q: 'Can I change stock and prices myself?',
				a: 'Yes. You manage orders, stock and prices yourself.'
			},
			{
				q: 'How long does an online shop take?',
				a: 'Five to eight weeks from the day we agree the price.'
			}
		]
	},
	{
		slug: 'web-design-dublin',
		label: 'Web design in Dublin',
		title: 'Web design in Dublin',
		metaTitle: 'Web design in Dublin, from €950 | VNTA',
		description:
			'VNTA is a small web design studio in Dublin. We build websites for local businesses and look after them every month. From €950, then €39 a month.',
		lede: 'VNTA is a small studio in Dublin. We build websites for local businesses and look after them every month.',
		plans: ['Website', 'Website with stock', 'Online shop'],
		gets: [
			'A website designed and built from scratch for your business',
			'Easy to use on a phone',
			'Set up to be found on Google and by AI',
			'Hosting, security, updates and small changes every month',
			'A fixed price in writing before we start'
		],
		examples: ['EZGO Auto Works', 'BUILDT'],
		questions: [
			{
				q: 'How much does a website cost in Dublin?',
				a: 'With us, a new website is from €950, then from €39 a month to host it and look after it. You get the exact price in writing before we start.'
			},
			{
				q: 'Do you only work in Dublin?',
				a: 'No. We are based in Dublin and work with businesses all over Ireland. L.M. Motors, for one, is in Sallins, Co. Kildare.'
			},
			{
				q: 'Who looks after the site once it is live?',
				a: 'We do. The monthly fee covers hosting, security, updates and small changes.'
			}
		]
	}
];

/**
 * The address of a screenshot under /work. Browsers keep these pictures for a
 * week, so when any of them is retaken, change `shotsVersion` and every
 * visitor gets the new ones straight away instead of next week.
 */
export const shotsVersion = '2026-10-08';
export const shot = (stem: string, variant = '') => `/work/${stem}${variant}.jpg?v=${shotsVersion}`;

/** A world as the inline custom properties its card reads. */
export const worldStyle = (w: World) =>
	`--w-bg:${w.bg};--w-ink:${w.ink};--w-soft:${w.soft};--w-line:${w.line};--w-accent:${w.accent};` +
	`--device:${w.dark ? '#3a3a3c' : '#1f1f1f'}`;

/** Formats a euro amount the way the page prints it: €1,900. */
export const euro = (n: number) => `€${n.toLocaleString('en-IE')}`;
