// =============================================================================
// Structured data
// -----------------------------------------------------------------------------
// The same facts as the page, written in the form search engines and AI
// assistants read (schema.org, as JSON-LD). It answers, without guessing: who
// VNTA is, where it is, and what it is designing. Everything here is read from
// site.ts. Nothing is offered for sale, so there are no prices and no offers.
// =============================================================================
import { siteUrl, contactEmail, social, pitch, company, robotics, capabilities } from '$lib/content/site';
import { studioPaths } from '$lib/content/studioStructured';

const ORG = `${siteUrl}/#organisation`;
const SITE = `${siteUrl}/#website`;

/** Every public page, for the sitemap and llms.txt. */
export const publicPaths = () => ['/', '/robotics', ...studioPaths(), '/contact', '/legal', '/privacy', '/terms'];

/** VNTA itself. */
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
	description: pitch.short,
	slogan: pitch.headline,
	foundingDate: company.founded,
	address: { '@type': 'PostalAddress', addressLocality: 'Dublin', addressCountry: 'IE' },
	knowsAbout: [
		'Autonomous systems',
		'Robotics infrastructure',
		'Machine identity',
		'Fleet orchestration',
		'Access control for autonomous machines',
		'Audit logging'
	],
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'general',
		email: contactEmail,
		url: `${siteUrl}/contact`,
		availableLanguage: 'en'
	},
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

/**
 * VNTA Robotics, described as what it is: software in development, a proof of concept. No price,
 * no rating, no availability, because none of those exist yet.
 */
export const roboticsProduct = () => ({
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': `${siteUrl}/robotics#software`,
	name: robotics.name,
	applicationCategory: 'Robotics infrastructure',
	description: `${robotics.what} ${robotics.honest}`,
	url: `${siteUrl}/robotics`,
	creator: { '@id': ORG },
	featureList: capabilities.map((c) => c.name)
});

export const breadcrumb = (name: string, path: string) => ({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [
		{ '@type': 'ListItem', position: 1, name: 'VNTA', item: `${siteUrl}/` },
		{ '@type': 'ListItem', position: 2, name, item: `${siteUrl}${path}` }
	]
});
