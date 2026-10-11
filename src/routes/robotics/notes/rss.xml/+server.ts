// /robotics/notes/rss.xml: the notes as a feed, so they can be followed
// without an account on anyone's network. Built from the same list as the
// pages, so it only ever holds published notes.
import { siteUrl } from '$lib/content/site';
import { publishedNotes } from '$lib/server/notesPublic';
import { notePath } from '$lib/content/notePaths';

export const prerender = true;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
	const items = publishedNotes()
		.map((n) => {
			const url = siteUrl + notePath(n.slug);
			const html = n.body.map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
			return [
				'\t\t<item>',
				`\t\t\t<title>${esc(n.title)}</title>`,
				`\t\t\t<link>${url}</link>`,
				`\t\t\t<guid isPermaLink="true">${url}</guid>`,
				`\t\t\t<pubDate>${new Date(n.publishedAt).toUTCString()}</pubDate>`,
				`\t\t\t<description>${esc(n.summary)}</description>`,
				`\t\t\t<content:encoded><![CDATA[${html}]]></content:encoded>`,
				'\t\t</item>'
			].join('\n');
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>VNTA Robotics notes</title>
		<link>${siteUrl}/robotics/notes</link>
		<atom:link href="${siteUrl}/robotics/notes/rss.xml" rel="self" type="application/rss+xml" />
		<description>What VNTA Robotics is building, what it found, and what is not done. In development.</description>
		<language>en-ie</language>
${items}
	</channel>
</rss>
`;
	return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
