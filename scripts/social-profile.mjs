// Keeps VNTA's Mastodon and Bluesky profiles matching src/lib/content/social.ts,
// and puts the proof that VNTA owns vnta.xyz where Bluesky looks for it.
// Run by .github/workflows/social-profile.yml.
//
//   node scripts/social-profile.mjs did      write the Bluesky account's id to static/.well-known/atproto-did
//   node scripts/social-profile.mjs apply    set the Mastodon links and any missing description
//
// It uses the same keys as the note publisher (see scripts/publish-notes.mjs).
// The Mastodon key must be allowed to read and write the account's profile
// (read:accounts, write:accounts); a key that can only post is told so plainly.
//
// It adds, and never takes away: a description someone typed is left alone, a
// link field someone added is kept if there is room, and the name, picture,
// followers and posts are never touched.
//
// For testing: SOCIAL_SITE, SOCIAL_DID_FILE and SOCIAL_DRY_RUN=1.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const { mastodon, bluesky } = await import(process.env.SOCIAL_FILE || `${root}src/lib/content/social.ts`);
const SITE = (process.env.SOCIAL_SITE || 'https://vnta.xyz').replace(/\/$/, '');
const DID_FILE = process.env.SOCIAL_DID_FILE || `${root}static/.well-known/atproto-did`;
const DRY = process.env.SOCIAL_DRY_RUN === '1';
const WAIT_MS = Number(process.env.SOCIAL_WAIT_MS ?? 5 * 60_000);

/** A line a person will see on the run's page on GitHub, as well as in the log. */
const say = (text) => console.log(process.env.GITHUB_ACTIONS ? `::notice::${text}` : text);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = false;
const fail = (text) => {
	failed = true;
	console.error(process.env.GITHUB_ACTIONS ? `::error::${text}` : text);
};

// --- Bluesky ---------------------------------------------------------------------

const pds = () => (process.env.BLUESKY_PDS || 'https://bsky.social').replace(/\/$/, '');
const storedDid = () => (existsSync(DID_FILE) ? readFileSync(DID_FILE, 'utf8').trim() : '');

/** Signs in. The handle changes when the domain is verified, so the account's id is tried too. */
async function blueskySession() {
	if (!process.env.BLUESKY_APP_PASSWORD) return null;
	const names = [process.env.BLUESKY_HANDLE, storedDid(), bluesky.domain, bluesky.firstHandle].filter(Boolean);
	for (const identifier of [...new Set(names)]) {
		const res = await fetch(`${pds()}/xrpc/com.atproto.server.createSession`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ identifier, password: process.env.BLUESKY_APP_PASSWORD })
		});
		if (res.ok) return res.json();
	}
	fail('Bluesky refused the key under every name tried. Check BLUESKY_HANDLE and BLUESKY_APP_PASSWORD.');
	return null;
}

/** Writes the account's id where Bluesky looks for it when a domain is claimed as a name. */
async function did() {
	const session = await blueskySession();
	if (!session) return say('Bluesky: no key set, so its id was not written.');
	if (!/^did:[a-z]+:[A-Za-z0-9._:%-]+$/.test(session.did)) return fail(`Bluesky gave an id that does not look like one: ${session.did}`);
	if (storedDid() === session.did) return say(`Bluesky: the id is already on the site. Signed in as ${session.handle}.`);
	if (!DRY) {
		mkdirSync(dirname(DID_FILE), { recursive: true });
		writeFileSync(DID_FILE, session.did);
		if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, 'changed=1\n', { flag: 'a' });
	}
	say(`Bluesky: wrote the account's id for ${bluesky.domain}. Signed in as ${session.handle}.`);
}

async function applyBluesky() {
	const session = await blueskySession();
	if (!session) return say('Bluesky: no key set, skipped.');
	const auth = { authorization: `Bearer ${session.accessJwt}` };
	const at = `repo=${encodeURIComponent(session.did)}&collection=app.bsky.actor.profile&rkey=self`;
	const got = await fetch(`${pds()}/xrpc/com.atproto.repo.getRecord?${at}`, { headers: auth });
	const current = got.ok ? (await got.json()).value : null;
	if (current?.description?.trim()) return say(`Bluesky (${session.handle}): it already has a description, left as it is.`);
	if (DRY) return say(`Bluesky (${session.handle}): would set the description.`);
	// Everything already on the profile (name, picture) is sent back unchanged.
	const record = { ...(current ?? {}), $type: 'app.bsky.actor.profile', description: bluesky.bio };
	const put = await fetch(`${pds()}/xrpc/com.atproto.repo.putRecord`, {
		method: 'POST',
		headers: { ...auth, 'content-type': 'application/json' },
		body: JSON.stringify({ repo: session.did, collection: 'app.bsky.actor.profile', rkey: 'self', record })
	});
	if (!put.ok) return fail(`Bluesky would not save the description: ${put.status} ${(await put.text()).slice(0, 200)}`);
	say(`Bluesky (${session.handle}): description set.`);
}

// --- Mastodon --------------------------------------------------------------------

/** Waits until this site really carries the link back to the Mastodon profile. Without it there is no tick. */
async function siteLinksBack() {
	const until = Date.now() + WAIT_MS;
	do {
		try {
			const html = await (await fetch(`${SITE}/`, { headers: { 'cache-control': 'no-cache' } })).text();
			if (new RegExp(`rel="me[^"]*"[^>]*href="${mastodon.url}"|href="${mastodon.url}"[^>]*rel="me`).test(html)) return true;
		} catch {
			/* not yet */
		}
		if (Date.now() < until) await sleep(Math.min(15_000, WAIT_MS));
	} while (Date.now() < until);
	return false;
}

async function applyMastodon() {
	const base = (process.env.MASTODON_URL || '').replace(/\/$/, '');
	if (!base || !process.env.MASTODON_TOKEN) return say('Mastodon: no key set, skipped.');
	const auth = { authorization: `Bearer ${process.env.MASTODON_TOKEN}` };

	const me = await fetch(`${base}/api/v1/accounts/verify_credentials`, { headers: auth });
	if (me.status === 403) return fail('Mastodon: this key may post but may not read or change the profile. Nothing was changed. (It needs read:accounts and write:accounts.)');
	if (!me.ok) return fail(`Mastodon refused the key: ${me.status}.`);
	const account = await me.json();
	if (account.url && account.url !== mastodon.url) return fail(`Mastodon: this key is for ${account.url}, not ${mastodon.url}. Nothing was changed.`);

	// What is there now, as the account's owner typed it.
	const now = (account.source?.fields ?? []).map((f) => ({ name: f.name, value: f.value }));
	const ours = new Set(mastodon.fields.map((f) => f.name.toLowerCase()));
	const others = now.filter((f) => f.name && !ours.has(f.name.toLowerCase()));
	// Ours first, then whatever else was there, up to the four Mastodon shows.
	const fields = [...mastodon.fields, ...others].slice(0, 4);
	const dropped = [...mastodon.fields, ...others].length - fields.length;

	const linked = await siteLinksBack();
	if (!linked) say(`Mastodon: ${SITE} does not show the link back to the profile yet, so the green tick will not appear until this is run again.`);

	const form = new URLSearchParams();
	fields.forEach((f, i) => {
		form.set(`fields_attributes[${i}][name]`, f.name);
		form.set(`fields_attributes[${i}][value]`, f.value);
	});
	const hasBio = !!account.source?.note?.trim();
	if (!hasBio) form.set('note', mastodon.bio);
	if (DRY) return say(`Mastodon: would set ${fields.length} links${hasBio ? '' : ' and the description'}.`);

	// Saving the profile is also what makes Mastodon go and check the links.
	const res = await fetch(`${base}/api/v1/accounts/update_credentials`, { method: 'PATCH', headers: auth, body: form });
	if (!res.ok) return fail(`Mastodon would not save the profile: ${res.status} ${(await res.text()).slice(0, 200)}`);
	say(`Mastodon: ${fields.length} links set${hasBio ? '; the description was already there and was left alone' : '; description set'}${dropped ? `; ${dropped} older link(s) did not fit` : ''}.`);

	// Mastodon checks the links a moment later. Look once more and say what it found.
	if (linked) {
		await sleep(Math.min(20_000, WAIT_MS));
		const again = await fetch(`${base}/api/v1/accounts/verify_credentials`, { headers: auth });
		if (again.ok) {
			const ticked = ((await again.json()).fields ?? []).filter((f) => f.verified_at).map((f) => f.name);
			say(ticked.length ? `Mastodon: green tick on ${ticked.join(', ')}.` : 'Mastodon: no green tick yet. It can take a few minutes; run this again if it has not appeared.');
		}
	}
}

// --- Go --------------------------------------------------------------------------

const [command] = process.argv.slice(2);
if (command === 'did') await did();
else if (command === 'apply') {
	await applyMastodon();
	await applyBluesky();
} else {
	console.error('Usage: node scripts/social-profile.mjs did | apply');
	process.exit(2);
}
if (failed) process.exit(1);
