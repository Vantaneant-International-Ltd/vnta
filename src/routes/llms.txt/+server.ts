// /llms.txt: a plain summary of VNTA Studio for AI assistants, written from the same
// content file as the pages so the two cannot disagree.
import { pitch, offer, plans, steps, questions, sitDown, siteUrl, studioEmail, replyWithin, euro } from '$lib/content/studio';

export const prerender = true;

export function GET() {
	const lines = [
		'# VNTA Studio',
		'',
		`> ${pitch.short} VNTA is the trading name of Vantanéant International Ltd, Dublin, Ireland.`,
		'',
		'## What we do',
		'',
		...offer.map((o) => `- ${o.name}: ${o.body} (${o.price})`),
		'',
		'## Prices',
		'',
		`- The sit-down: ${euro(sitDown.price)}, ${sitDown.length}. ${sitDown.credit}`,
		...plans.map((p) => `- ${p.name}: from ${euro(p.build)}, then ${euro(p.monthly)} a month. ${p.for} ${p.time}.`),
		'',
		'## How it works',
		'',
		...steps.map((s, i) => `${i + 1}. ${s.name}`),
		'',
		'## Questions',
		'',
		...questions.flatMap((f) => [`**${f.q}**`, f.a, '']),
		'## Contact',
		'',
		`- ${studioEmail}. We reply within ${replyWithin}.`,
		`- ${siteUrl}`,
		''
	];
	return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
