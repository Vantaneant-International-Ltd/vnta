// /llms.txt: a plain summary of who we are and what a site costs, for the AI
// assistants people now ask instead of searching. Written from the same
// content file as the page, so the two can never disagree on a price.
import { work, plans, priceNotes, questions, studioEmail, replyWithin, euro } from '$lib/content/site';

export const prerender = true;

export function GET() {
	const lines = [
		'# VNTA',
		'',
		'> VNTA is a small studio in Dublin, Ireland. We build websites for Irish garages, car dealers, shops and trades, and look after them every month. VNTA is the trading name of Vantanéant International Ltd.',
		'',
		'## Prices',
		'',
		...plans.map(
			(p) =>
				`- ${p.name}: ${p.for} From ${euro(p.build)} to build, then ${euro(p.monthly)} a month. ${p.time}.`
		),
		'',
		...priceNotes.map((n) => `- ${n.name}: ${n.body}`),
		'',
		'## Work',
		'',
		...work.map((w) =>
			w.href
				? `- [${w.name}](${w.href}): ${w.trade}, ${w.place}. ${w.summary}`
				: `- ${w.name}: ${w.trade}, ${w.place}. ${w.status}. ${w.summary}`
		),
		'',
		'## Questions',
		'',
		...questions.flatMap((item) => [`### ${item.q}`, '', item.a, '']),
		'## Contact',
		'',
		`- [Get a price](https://vnta.xyz/contact): a fixed price back within ${replyWithin}.`,
		`- Email: ${studioEmail}`,
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
