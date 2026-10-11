// /sitemap.xml: the list of every public page, for search engines. The list is
// `publicPaths` in content/structured.ts: add a page there and it is here.
import { siteUrl } from '$lib/content/site';
import { publicPaths } from '$lib/content/structured';
import { publishedNotes } from '$lib/server/notesPublic';
import { notePath, notesPath } from '$lib/content/notePaths';

export const prerender = true;

export function GET() {
	const today = new Date().toISOString().slice(0, 10);
	// The notes index and each published note. Nothing until the first note is out.
	const notes = publishedNotes();
	const notePaths = notes.length ? [notesPath, ...notes.map((n) => notePath(n.slug))] : [];
	const urls = [...publicPaths(), ...notePaths]
		.map((path) => `\t<url><loc>${siteUrl}${path}</loc><lastmod>${today}</lastmod></url>`)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml; charset=utf-8' } }
	);
}
