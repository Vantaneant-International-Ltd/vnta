// Takes a picture of each address given, as a visitor who is not signed in
// sees it. Run by .github/workflows/screenshots.yml, next to an installed
// copy of Playwright.
//
//   node screenshot.mjs <folder> <address> [<address> ...]
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const [folder, ...urls] = process.argv.slice(2);
if (!folder || urls.length === 0) {
	console.error('Usage: node screenshot.mjs <folder> <address> [<address> ...]');
	process.exit(2);
}

const browser = await chromium.launch();
let failed = 0;
const list = [];
for (const [i, url] of urls.entries()) {
	let host = 'page';
	try {
		const u = new URL(url);
		if (!/^https?:$/.test(u.protocol)) throw new Error('not a web address');
		host = u.hostname.replace(/[^a-z0-9.-]/gi, '');
	} catch {
		failed += 1;
		console.log(`::error::Not a web address: ${String(url).slice(0, 100)}`);
		continue;
	}
	const file = `${String(i + 1).padStart(2, '0')}-${host}.png`;
	// A phone-shaped window, twice as sharp: both networks show a single post well at this width.
	const page = await browser.newPage({ viewport: { width: 600, height: 1000 }, deviceScaleFactor: 2, locale: 'en-IE', timezoneId: 'Europe/Dublin' });
	try {
		const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
		// Both are apps that draw themselves after loading. Give them time, and the picture time to arrive.
		await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
		await page.waitForTimeout(5000);
		await page.screenshot({ path: `${folder}/${file}` });
		list.push(`${file}  ${url}`);
		console.log(`::notice::${file}: ${res?.status() ?? '?'} "${(await page.title()).slice(0, 80)}"`);
	} catch (e) {
		failed += 1;
		console.log(`::error::${url}: ${String(e.message).split('\n')[0].slice(0, 200)}`);
	}
	await page.close();
}
await browser.close();
writeFileSync(`${folder}/README.txt`, list.join('\n') + '\n');
if (failed) process.exit(1);
