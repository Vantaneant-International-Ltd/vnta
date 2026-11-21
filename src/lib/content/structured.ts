// Structured data (schema.org JSON-LD), read from site.ts. Nothing is offered
// for sale, so there are no prices, offers or ratings.
import { siteUrl, contactEmail, social, pitch, company, faq as faqItems } from '$lib/content/site';
import { pitch as studioPitch } from '$lib/content/studio';
import { studioPaths } from '$lib/content/studioStructured';

const ORG = `${siteUrl}/#organisation`;
const SITE = `${siteUrl}/#website`;

/** Every public page, for the sitemap and llms.txt. */
export const publicPaths = () => [...studioPaths(), '/legal', '/privacy', '/terms'];

export const organisation = () => ({
	'@context': 'https://schema.org',
	'@type': 'Organization',
	'@id': ORG,
	name: 'VNTA',
	alternateName: ['Vantanéant International'],
	legalName: company.legalName,
	url: `${siteUrl}/`,
	logo: { '@type': 'ImageObject', url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
	image: `${siteUrl}/og.png`,
	email: contactEmail,
	description: studioPitch.short,
	slogan: studioPitch.headline,
	foundingDate: company.founded,
	address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
	contactPoint: { '@type': 'ContactPoint', contactType: 'general', email: contactEmail, url: `${siteUrl}/#quote`, availableLanguage: 'en' },
	...(social.length ? { sameAs: social.map((s) => s.href) } : {})
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

export const breadcrumb = (name: string, path: string) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [
		{ '@type': 'ListItem', position: 1, name: 'VNTA', item: `${siteUrl}/` },
		{ '@type': 'ListItem', position: 2, name, item: `${siteUrl}${path}` }
	]
});

/** The questions on a page, for search engines. The same words the page shows. */
export const faqPage = (items: { q: string; a: string }[] = faqItems) => ({
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }))
});
