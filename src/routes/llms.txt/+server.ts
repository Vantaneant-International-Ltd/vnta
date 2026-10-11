// /llms.txt: a plain summary of who VNTA is and what it is building, for the AI
// assistants people now ask instead of searching. Written from the same
// content file as the pages, so the two can never disagree.
import {
	pitch,
	statement,
	systems,
	principles,
	company,
	robotics,
	capabilities,
	social,
	siteUrl,
	contactEmail
} from '$lib/content/site';

export const prerender = true;

export function GET() {
	const lines = [
		'# VNTA',
		'',
		`> ${pitch.short} ${pitch.lede} VNTA is the trading name of ${company.legalName}.`,
		'',
		'## At a glance',
		'',
		'- What: software infrastructure for autonomous systems. Identity, permissions, connectivity, orchestration, telemetry and audit.',
		`- First system: ${robotics.name}. ${robotics.what}`,
		`- Status: ${robotics.honest}`,
		'- What VNTA is: a technology company first. It also runs a small studio (see VNTA Studio below); the studio is not the company\'s main work.',
		`- Founded: ${company.founded}. Based in ${company.place}.`,
		'',
		'## Why',
		'',
		statement.body,
		'',
		`## ${robotics.name}`,
		'',
		`${robotics.positioning} ${robotics.body}`,
		'',
		'It is being designed to provide:',
		'',
		...capabilities.map((c) => `- ${c.name}: ${c.body}`),
		'',
		`More: ${siteUrl}/robotics`,
		'',
		'## One infrastructure layer, many autonomous systems',
		'',
		...systems.map((s) => `- ${s.name} (${s.stage.toLowerCase()}): ${s.body}`),
		'',
		'Only robotics is being built today. Agents and compute are research directions, not products.',
		'',
		'## Principles',
		'',
		...principles.map((p) => `- ${p.name}: ${p.body}`),
		'',
		'## VNTA Studio',
		'',
		`${company.studio} It is separate from the technology work and has its own pages: ${siteUrl}/studio`,
		'',
		'## Contact',
		'',
		`- Contact page: ${siteUrl}/contact`,
		`- Email: ${contactEmail}`,
		...social.map((p) => `- ${p.name}: ${p.href}`),
		''
	];

	return new Response(lines.join('\n'), {
		headers: { 'content-type': 'text/plain; charset=utf-8' }
	});
}
