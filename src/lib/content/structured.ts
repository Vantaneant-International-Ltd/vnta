// =============================================================================
// Structured data
// -----------------------------------------------------------------------------
// The same facts as the page, written in the form search engines and AI
// assistants read (schema.org, as JSON-LD). It answers, without guessing:
// who VNTA is, where it is, what it sells and for how much, which sites it
// built, and which companies it owns. Everything here is read from site.ts,
// so a price changed there changes here too.
// =============================================================================
import {
	siteUrl,
	studioEmail,
	social,
	pitch,
	plans,
	work,
	houses,
	landings,
	type Landing
} from '$lib/content/site';

const ORG = `${siteUrl}/#organisation`;
const SITE = `${siteUrl}/#website`;
const houseId = (href: string) => `${href.replace(/\/$/, '')}/#organisation`;

/** VNTA itself: the studio, its prices, and the houses it owns. */
export const organisation = (description: string) => ({
	'@context': 'https://schema.org',
	'@type': ['Organization', 'ProfessionalService'],
	'@id': ORG,
	name: 'VNTA',
	alternateName: ['VNTA Group', 'Vantanéant International'],
	legalName: 'Vantanéant International Ltd',
	url: `${siteUrl}/`,
	logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
	image: `${siteUrl}/og.png`,
	email: studioEmail,
	description,
	slogan: pitch.headline,
	foundingDate: '2025',
	address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
	areaServed: { '@type': 'Country', name: 'Ireland' },
	knowsAbout: [
		'Brand design',
		'Brand strategy',
		'Website design',
		'Website development',
		'Websites for garages',
		'Websites for car dealers',
		'Online shops',
		'Search engine optimisation'
	],
	priceRange: `€${Math.min(...plans.map((p) => p.build))} to €${Math.max(...plans.map((p) => p.build))}`,
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'sales',
		email: studioEmail,
		url: `${siteUrl}/contact`,
		areaServed: 'IE',
		availableLanguage: 'en'
	},
	...(social.length ? { sameAs: social.map((s) => s.href) } : {}),
	makesOffer: plans.map((p) => ({
		'@type': 'Offer',
		name: `${p.name}`,
		description: `${p.for} From €${p.build} to build, then €${p.monthly} a month. ${p.time}.`,
		price: p.build,
		priceCurrency: 'EUR',
		url: `${siteUrl}/#prices`
	})),
	// The companies VNTA owns and runs.
	subOrganization: houses.map((h) => ({
		'@type': 'Organization',
		'@id': houseId(h.href),
		name: h.name,
		url: h.href,
		description: h.line,
		parentOrganization: { '@id': ORG }
	}))
});

export const website = () => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': SITE,
	url: `${siteUrl}/`,
	name: 'VNTA',
	inLanguage: 'en-IE',
	publisher: { '@id': ORG }
});

/** Questions and answers, so they can be quoted and not guessed at. */
export const faq = (items: { q: string; a: string }[]) => ({
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: items.map((item) => ({
		'@type': 'Question',
		name: item.q,
		acceptedAnswer: { '@type': 'Answer', text: item.a }
	}))
});

/** The brands and sites VNTA made, each one credited to VNTA. */
export const portfolio = () => ({
	'@context': 'https://schema.org',
	'@type': 'ItemList',
	name: 'Brands and websites by VNTA',
	itemListElement: [
		...work.map((w) => ({
			name: w.name,
			url: w.href,
			about: `${w.did} for a ${w.trade.toLowerCase()}, ${w.place}. ${w.summary}`
		})),
		...houses.map((h) => ({ name: h.name, url: h.href, about: h.line }))
	].map((item, i) => ({
		'@type': 'ListItem',
		position: i + 1,
		item: {
			'@type': 'WebSite',
			name: item.name,
			...(item.url ? { url: item.url } : {}),
			about: item.about,
			creator: { '@id': ORG }
		}
	}))
});

/** A landing page: the service it sells, its price, and where it sits. */
export const service = (l: Landing) => {
	const offered = plans.filter((p) => l.plans.includes(p.name));
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		'@id': `${siteUrl}/${l.slug}#service`,
		name: l.title,
		serviceType: 'Website design and development',
		description: l.description,
		url: `${siteUrl}/${l.slug}`,
		provider: { '@id': ORG },
		areaServed: { '@type': 'Country', name: 'Ireland' },
		offers: offered.map((p) => ({
			'@type': 'Offer',
			name: p.name,
			price: p.build,
			priceCurrency: 'EUR',
			description: `From €${p.build} to build, then €${p.monthly} a month. ${p.time}.`
		}))
	};
};

export const breadcrumb = (l: Landing) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [
		{ '@type': 'ListItem', position: 1, name: 'VNTA', item: `${siteUrl}/` },
		{ '@type': 'ListItem', position: 2, name: l.title, item: `${siteUrl}/${l.slug}` }
	]
});

/** Every public page, for the sitemap and for llms.txt. */
export const publicPaths = () => [
	'/',
	...landings.map((l) => `/${l.slug}`),
	'/contact',
	'/legal',
	'/privacy',
	'/terms'
];
