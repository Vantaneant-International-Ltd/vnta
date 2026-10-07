// Tells search engines the site has changed, the moment it is deployed.
//
// IndexNow is a shared doorbell for Bing, Yandex, Seznam and Naver: one POST
// with the list of pages and they come and read them, instead of waiting days
// to notice. Bing matters more than it looks, because ChatGPT search and
// Copilot lean on it. Google does not use IndexNow; it reads the sitemap.
//
// The key below is not a secret. It is proved by the file of the same name in
// /static, which only the owner of the site can publish.
//
// Run by `npm run deploy` after the upload. A failure here never fails a deploy.
import { readFileSync } from 'node:fs';

const host = 'vnta.xyz';
const key = '8f49db49f0aaca12c9bcf55dca38775e';

const sitemap = readFileSync(new URL('../build/sitemap.xml', import.meta.url), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'content-type': 'application/json; charset=utf-8' },
	body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList })
});
console.log(`IndexNow: ${res.status} for ${urlList.length} pages`);
