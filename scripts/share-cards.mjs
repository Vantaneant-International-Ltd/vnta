// Draws the share cards: the picture that shows when a link to the site is
// sent on WhatsApp, iMessage, LinkedIn, X and the rest. One card per page, so
// a Robotics link and a Studio link never look the same. 1200 by 630, into
// static/share/.
//
//   npm i --no-save playwright && npx playwright install chromium   (once)
//   node scripts/share-cards.mjs
//
// The words come from the content files, so run it again after changing a
// headline, a landing page title or a price. Each page names its own card in
// its <Seo image="..."> line.
//
// Two families, to match the two sides of the site: navy and Inter for the
// company, graphite and the display face for the studio.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
let chromium;
try {
	({ chromium } = require('playwright'));
} catch {
	console.error('This needs Playwright:  npm i --no-save playwright && npx playwright install chromium');
	process.exit(1);
}

const site = await import(`${root}src/lib/content/site.ts`);
const studio = await import(`${root}src/lib/content/studio.ts`);
const pricing = await import(`${root}src/lib/content/pricing.ts`);

const b64 = (p, type) => `data:${type};base64,${readFileSync(root + p).toString('base64')}`;
const font = (p) => b64(`node_modules/${p}`, 'font/woff2');
const paths = (f) =>
	[...readFileSync(root + f, 'utf8').matchAll(/<path d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join('');
const wordmark = `<svg class="mark" viewBox="203.3 478.9 596.5 120.2">${paths('src/lib/components/ui/Wordmark.svelte')}</svg>`;
const symbol = `<svg class="sun" viewBox="210 213 566 566">${paths('src/lib/components/ui/Symbol.svelte')}</svg>`;

const faces = `
@font-face{font-family:Inter;src:url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')});font-weight:100 900}
@font-face{font-family:Display;src:url(${font('@fontsource/marcellus/files/marcellus-latin-400-normal.woff2')})}
@font-face{font-family:Caps;src:url(${font('@fontsource/marcellus-sc/files/marcellus-sc-latin-400-normal.woff2')})}
@font-face{font-family:Sans;src:url(${font('@fontsource/manrope/files/manrope-latin-500-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden}
.in{position:absolute;inset:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.foot{display:flex;justify-content:space-between;align-items:flex-end}
.mark{height:34px;fill:currentColor}`;

/** The company: navy, Inter, a faint grid, and a small panel of tiles on the right. */
const company = ({ eyebrow, headline, chip, tiles = [], address }) => `<!doctype html><meta charset="utf-8"><style>${faces}
body{background:#0f1b2d;color:#fff;font-family:Inter;font-feature-settings:'cv11','ss03'}
.grid{position:absolute;inset:0;background-image:linear-gradient(#1a2940 1px,transparent 1px),linear-gradient(90deg,#1a2940 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(70% 90% at 90% 60%,#000 0%,transparent 75%)}
.top{font-size:21px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#9aa7ba}
h1{font-weight:600;font-size:${tiles.length ? 70 : 88}px;line-height:1.04;letter-spacing:-.04em;max-width:${tiles.length ? 640 : 900}px;text-wrap:balance}
.chip{display:inline-flex;align-items:center;gap:10px;margin-top:26px;padding:9px 16px;border-radius:9px;background:#1c2f52;color:#8fb4ff;font-size:22px;font-weight:600}
.chip i{width:11px;height:11px;border-radius:50%;background:#8fb4ff}
.url{font:500 22px ui-monospace,Menlo,monospace;color:#9aa7ba}
.tiles{position:absolute;right:72px;top:168px;width:372px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tiles span{display:flex;align-items:center;height:76px;padding:0 20px;border:1px solid #26364d;border-radius:14px;background:#162338;font-size:22px;font-weight:500;color:#d6dde8}
</style><div class="grid"></div>
${tiles.length ? `<div class="tiles">${tiles.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}
<div class="in"><div class="top">${eyebrow}</div>
<div><h1>${headline}</h1>${chip ? `<span class="chip"><i></i>${chip}</span>` : ''}</div>
<div class="foot">${wordmark}<span class="url">${address}</span></div></div>`;

/** The studio: graphite, the display face, the symbol rising from the corner. */
const studioCard = ({ headline, line, address }) => `<!doctype html><meta charset="utf-8"><style>${faces}
body{background:#2b2b2b;color:#f2f2f2;font-family:Display}
.sun{position:absolute;right:-150px;bottom:-190px;width:720px;fill:#f2f2f2;opacity:.07}
.top{font-family:Caps;font-size:26px;letter-spacing:.08em;color:#b0b0b0}
h1{font-weight:400;font-size:${headline.length > 30 ? 84 : 104}px;line-height:1.02;letter-spacing:-.018em;max-width:1000px;text-wrap:balance}
.line{margin-top:22px;font-family:Sans;font-size:30px;color:#dcdcdc}
.url{font-family:Sans;font-size:23px;color:#b0b0b0}
</style>${symbol}
<div class="in"><div class="top">VNTA Studio</div>
<div><h1>${headline}</h1>${line ? `<p class="line">${line}</p>` : ''}</div>
<div class="foot">${wordmark}<span class="url">${address}</span></div></div>`;

const euro = (n) => `€${n.toLocaleString('en-IE')}`;
const plan = (name) => studio.plans.find((p) => p.name === name);
const from = (l) => {
	const offered = l.plans.map(plan);
	const build = Math.min(...offered.map((p) => p.build));
	const monthly = Math.min(...offered.map((p) => p.monthly));
	return `From ${euro(build)}, then ${euro(monthly)} a month`;
};

const cards = {
	home: company({
		eyebrow: site.pitch.eyebrow,
		headline: site.pitch.headline,
		chip: `${site.robotics.name}, ${site.robotics.stage.toLowerCase()}`,
		address: 'vnta.xyz'
	}),
	robotics: company({
		eyebrow: site.robotics.name,
		headline: site.robotics.positioning,
		chip: site.robotics.stage,
		tiles: site.layer.map((l) => l.name),
		address: 'vnta.xyz/robotics'
	}),
	'robotics-pricing': company({
		eyebrow: `${site.robotics.name} pricing`,
		headline: pricing.pricing.headline,
		chip: site.robotics.stage,
		address: 'vnta.xyz/robotics/pricing'
	}),
	contact: company({ eyebrow: 'Contact', headline: 'Talk to VNTA.', address: 'vnta.xyz/contact' }),
	studio: studioCard({
		headline: studio.pitch.headline,
		line: `Brand design and websites, Dublin. A sit-down is ${euro(studio.sitDown.price)}.`,
		address: 'vnta.xyz/studio'
	}),
	...Object.fromEntries(
		studio.landings.map((l) => [
			`studio-${l.slug}`,
			studioCard({ headline: l.title, line: from(l), address: `vnta.xyz/studio/${l.slug}` })
		])
	)
};

mkdirSync(`${root}static/share`, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [name, html] of Object.entries(cards)) {
	await page.setContent(html);
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: `${root}static/share/${name}.png` });
	console.log(`static/share/${name}.png`);
}
await browser.close();
