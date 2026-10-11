// =============================================================================
// Structured data for the studio pages (/studio)
// -----------------------------------------------------------------------------
// The same facts as the page, written in the form search engines and AI
// assistants read (schema.org, as JSON-LD). It answers, without guessing:
// who VNTA is, where it is, what it sells and for how much, which sites it
// built, and which companies it owns. Everything here is read from site.ts,
// so a price changed there changes here too.
// =============================================================================
import { siteUrl, plans, work, houses, landings, type Landing } from '$lib/content/studio';

const ORG = `${siteUrl}/#organisation`;

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
		'@id': `${siteUrl}/studio/${l.slug}#service`,
		name: l.title,
		serviceType: 'Website design and development',
		description: l.description,
		url: `${siteUrl}/studio/${l.slug}`,
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
		{ '@type': 'ListItem', position: 2, name: 'Studio', item: `${siteUrl}/studio` },
		{ '@type': 'ListItem', position: 3, name: l.title, item: `${siteUrl}/studio/${l.slug}` }
	]
});

/** The studio's public pages, for the sitemap. */
export const studioPaths = () => ['/studio', ...landings.map((l) => `/studio/${l.slug}`)];
