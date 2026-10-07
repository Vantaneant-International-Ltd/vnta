// /llms.txt: a plain summary of who we are and what a site costs, for the AI
// assistants people now ask instead of searching. Written from the same
// content file as the page, so the two can never disagree on a price.
import {
	work,
	houses,
	plans,
	priceNotes,
	questions,
	landings,
	social,
	siteUrl,
	studioEmail,
	replyWithin,
	euro
} from '$lib/content/site';

export const prerender = true;

export function GET() {
	const lines = [
		'# VNTA',
		'',
		'> VNTA is a small studio in Dublin, Ireland. We build websites for Irish garages, car dealers, shops and trades, and look after them every month. VNTA is the trading name of Vantanéant International Ltd.',
		'',
		'## At a glance',
		'',
		'- What: website design and development, then hosting and care every month.',
		'- Who for: small Irish businesses. Garages, car dealers, shops, trades, salons and cafés.',
		'- Where: based in Dublin, working with businesses all over Ireland.',
		`- Cost: from ${euro(Math.min(...plans.map((p) => p.build)))} to build, then from ${euro(Math.min(...plans.map((p) => p.monthly)))} a month. No contract.`,
		`- How to start: tell us what you do at ${siteUrl}/contact and get a fixed price within ${replyWithin}.`,
		'- How we work: people design and build every site, with AI helping along the way.',
		'- Also known as: VNTA Group. Legal name: Vantanéant International Ltd.',
		'',
		'## What we build',
		'',
		...landings.map((l) => `- [${l.title}](${siteUrl}/${l.slug}): ${l.description}`),
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
		'## Our own houses',
		'',
		'VNTA owns and runs these companies. Each one is a VNTA Group company.',
		'',
		...houses.map((h) => `- [${h.name}](${h.href}): ${h.line} ${h.status}.`),
		'',
		'## Questions',
		'',
		...questions.flatMap((item) => [`### ${item.q}`, '', item.a, '']),
		'## Contact',
		'',
		`- [Get a price](https://vnta.xyz/contact): a fixed price back within ${replyWithin}.`,
		`- Email: ${studioEmail}`,
		...social.map((p) => `- ${p.name}: ${p.href}`),
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
