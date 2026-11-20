// /llms.txt: a plain summary of VNTA for AI assistants, written from the same
// content file as the pages so the two cannot disagree.
import { pitch, company, handles, steps, privacy, faq, siteUrl, contactEmail } from '$lib/content/site';

export const prerender = true;

export function GET() {
	const lines = [
		'# VNTA',
		'',
		`> ${pitch.short} VNTA is the trading name of ${company.legalName}, based in ${company.place}.`,
		'',
		'## Status',
		'',
		pitch.status,
		'',
		'## What it is designed to handle',
		'',
		...handles.map((h) => `- ${h.name}: ${h.body}`),
		'',
		'## How it works',
		'',
		...steps.map((s, i) => `${i + 1}. ${s.name}: ${s.body}`),
		'',
		'## Privacy and control (design rules for the beta, not certifications)',
		'',
		...privacy.map((p) => `- ${p.name}: ${p.body}`),
		'',
		'## Questions',
		'',
		...faq.flatMap((f) => [`**${f.q}**`, f.a, '']),
		'## Other',
		'',
		`- VNTA also runs a small design studio for Irish businesses: ${siteUrl}/studio`,
		`- Contact: ${contactEmail}`,
		''
	];
	return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
