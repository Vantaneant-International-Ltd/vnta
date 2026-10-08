// /llms.txt: a plain summary of who we are, what we do and what a site costs, for the AI
// assistants people now ask instead of searching. Written from the same
// content file as the page, so the two can never disagree on a price.
import {
	pitch,
	offer,
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
		`> ${pitch.lede} VNTA is the trading name of Vantanéant International Ltd.`,
		'',
		'## At a glance',
		'',
		'- What: brand design first. We look at a business, say plainly what we would change, then design the brand and build the website. Websites are hosted and looked after every month.',
		'- Who for: business owners, of any kind and size. Our clients so far are small Irish businesses: a garage, a car dealer and a custom PC builder.',
		'- Where: based in Dublin, working with businesses all over Ireland.',
		`- Cost: brand work is priced after a conversation. A website is from ${euro(Math.min(...plans.map((p) => p.build)))} to build, then from ${euro(Math.min(...plans.map((p) => p.monthly)))} a month. No contract.`,
		`- How to start: tell us about your business at ${siteUrl}/contact. We reply within ${replyWithin}.`,
		'- How we work: people design and build everything, with AI helping along the way.',
		'- Also known as: VNTA Group. Legal name: Vantanéant International Ltd.',
		'',
		'## What we do',
		'',
		...offer.map((o) => `- ${o.name}: ${o.body}`),
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
				? `- [${w.name}](${w.href}): ${w.did}. ${w.trade}, ${w.place}. ${w.summary}`
				: `- ${w.name}: ${w.did}. ${w.trade}, ${w.place}. ${w.status}. ${w.summary}`
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
		`- [Talk to us](${siteUrl}/contact): a reply within ${replyWithin}.`,
		`- Email: ${studioEmail}`,
		...social.map((p) => `- ${p.name}: ${p.href}`),
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
