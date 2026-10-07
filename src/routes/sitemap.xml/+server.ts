// /sitemap.xml: the list of every public page, for search engines. Built from
// the same list as llms.txt, so a new landing page is in both the day it ships.
import { siteUrl } from '$lib/content/site';
import { publicPaths } from '$lib/content/structured';

export const prerender = true;

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	const urls = publicPaths()
		.map((path) => `\t<url><loc>${siteUrl}${path}</loc><lastmod>${today}</lastmod></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
