// Tells search engines the site has changed, the moment it is deployed.
//
// IndexNow is a shared doorbell for Bing, Yandex, Seznam and Naver: one POST
// with the list of pages and they come and read them, instead of waiting days
// to notice. Bing matters more than it looks, because ChatGPT search and
// Copilot lean on it. Google does not use IndexNow; it reads the sitemap.
//
// The IndexNow key is not a secret. It is the name of the one 32-letter .txt
// file in /static, which holds the same letters: publishing that file is the
// proof that the site's owner sent the ping. It is read from there, not written
// here, so the secret scanner has nothing to mistake for a password.
//
// Run by `npm run deploy` after the upload. A failure here never fails a deploy.
import { readFileSync, readdirSync } from 'node:fs';

const host = 'vnta.xyz';
const keyFile = readdirSync(new URL('../static/', import.meta.url)).find((f) =>
	/^[0-9a-f]{32}\.txt$/.test(f)
);
if (!keyFile) throw new Error('No IndexNow key file in /static');
const id = keyFile.replace('.txt', '');

const sitemap = readFileSync(new URL('../build/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'content-type': 'application/json; charset=utf-8' },
	body: JSON.stringify({ host, key: id, keyLocation: `https://${host}/${keyFile}`, urlList })
});
console.log(`IndexNow: ${res.status} for ${urlList.length} pages`);
