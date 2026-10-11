// Publishes VNTA Robotics notes: first on this site, then a short version on
// Mastodon and Bluesky with a link back. Run by .github/workflows/notes.yml
// every morning. The notes are in src/lib/server/notes.ts; what has been
// published is recorded in src/lib/server/notes-published.json, and the site
// shows only what is recorded there.
//
//   node scripts/publish-notes.mjs check     every note is fit to publish (run in CI)
//   node scripts/publish-notes.mjs status    what is out, what is next, what is held
//   node scripts/publish-notes.mjs site      publish the next due note on the site (writes the record)
//   node scripts/publish-notes.mjs wait <slug>   wait until that note's page is live
//   node scripts/publish-notes.mjs social    post fresh notes to Mastodon and Bluesky
//   node scripts/publish-notes.mjs verify mastodon|bluesky   check a key works, without posting anything
//   node scripts/publish-notes.mjs assets    copy published notes' pictures into the site (runs before each build)
//
// The rules, in one place:
//   - A note goes out when its date has come (Dublin time) and it has no `hold`.
//   - One note a day at most, oldest first. A backlog is worked off a day at a time.
//   - A note with a [BRACKET] left in it is never published.
//   - A network with no key set is skipped, quietly. Nothing breaks.
//   - Only a note published in the last two days is posted to a network, so
//     adding a key later does not flood the feed with old notes.
//   - Nothing is posted twice: what was posted is recorded, Mastodon is given
//     the note's address as a key, and Bluesky's recent posts are checked.
//
// Keys (GitHub repository secrets; see the README):
//   MASTODON_URL   the server, for example https://mastodon.social
//   MASTODON_TOKEN an access token with write:statuses and write:media
//   BLUESKY_HANDLE the handle, for example vnta.bsky.social
//   BLUESKY_APP_PASSWORD  an app password (Settings > Privacy and security > App passwords)
//   BLUESKY_PDS    only if the account is not on bsky.social
//
// For testing: NOTES_TODAY=2026-10-13 pretends it is that day; NOTES_DRY_RUN=1
// writes and posts nothing; NOTES_SITE, NOTES_LEDGER and NOTES_FILE point elsewhere.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const LEDGER = process.env.NOTES_LEDGER || `${root}src/lib/server/notes-published.json`;
const SITE = (process.env.NOTES_SITE || 'https://vnta.xyz').replace(/\/$/, '');
const DRY = process.env.NOTES_DRY_RUN === '1';

const BLUESKY_LIMIT = 300; // graphemes
const MASTODON_LIMIT = 500; // characters; a link counts as 23 there, we count it in full
const BLUESKY_IMAGE_LIMIT = 1_000_000; // bytes
const FRESH_DAYS = 2;

const { notes } = await import(process.env.NOTES_FILE || `${root}src/lib/server/notes.ts`);

// --- Small helpers -------------------------------------------------------------

/** Today in Dublin, as YYYY-MM-DD. */
const dublinDay = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Dublin' }).format(d);
const today = () => process.env.NOTES_TODAY || dublinDay();
const now = () => (process.env.NOTES_TODAY ? new Date(`${process.env.NOTES_TODAY}T08:17:00Z`) : new Date());

const graphemes = (s) => [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(s)].length;
const noteUrl = (n) => `${SITE}/robotics/notes/${n.slug}`;
// The pictures are kept outside the served folder. Only a published note's
// picture is copied into the site (the `assets` command, before every build),
// so a held note's picture cannot be reached by guessing its address.
const IMAGES = `${root}src/lib/content/note-images/`;
const SERVED = `${root}static/notes/`;
const imagePath = (n) => `${IMAGES}${n.image.file}`;

const readLedger = () => JSON.parse(readFileSync(LEDGER, 'utf8'));
const writeLedger = (ledger) => {
	if (DRY) return;
	writeFileSync(LEDGER, JSON.stringify(ledger, null, '\t') + '\n');
};

/** The text each network gets. */
const blueskyText = (n) => `${n.short}\n\n${noteUrl(n)}`;
const mastodonText = (n) => {
	const tags = (n.tags ?? []).map((t) => `#${t}`).join(' ');
	return `${n.short}\n\n${noteUrl(n)}${tags ? `\n\n${tags}` : ''}`;
};

// --- Check ---------------------------------------------------------------------

/** Everything that would stop a note being published. An empty list is a pass. */
function problems(n) {
	const out = [];
	const everything = [n.title, n.summary, n.short, ...n.body].join('\n');
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(n.slug)) out.push('the slug must be lower-case words joined by hyphens');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date) || Number.isNaN(Date.parse(n.date))) out.push('the date must be YYYY-MM-DD');
	if (/\[[^\]]*\]/.test(everything)) out.push('there is still a [BRACKET] to fill in');
	if (!n.title.trim() || !n.summary.trim() || !n.short.trim() || n.body.length === 0) out.push('title, summary, short and body are all needed');
	const b = graphemes(blueskyText(n));
	if (b > BLUESKY_LIMIT) out.push(`the short version with its link is ${b} characters; Bluesky allows ${BLUESKY_LIMIT}`);
	const m = mastodonText(n).length;
	if (m > MASTODON_LIMIT) out.push(`the short version with its link and tags is ${m} characters; Mastodon allows ${MASTODON_LIMIT}`);
	if (n.image) {
		if (!n.image.alt?.trim()) out.push('the image needs a description (alt)');
		if (!existsSync(imagePath(n))) out.push(`src/lib/content/note-images/${n.image.file} does not exist`);
		else if (statSync(imagePath(n)).size > BLUESKY_IMAGE_LIMIT) out.push(`${n.image.file} is over ${BLUESKY_IMAGE_LIMIT} bytes, Bluesky's limit`);
	}
	for (const t of n.tags ?? []) if (!/^[A-Za-z0-9_]+$/.test(t)) out.push(`the tag "${t}" must be letters and digits only, with no "#"`);
	return out;
}

function check() {
	let bad = 0;
	const seen = new Set();
	for (const n of notes) {
		const p = problems(n);
		if (seen.has(n.slug)) p.push('another note has the same slug');
		seen.add(n.slug);
		// A held note may be unfinished: that is what the hold is for. It is
		// checked again, in full, on the day it would go out.
		if (n.hold) continue;
		if (p.length) {
			bad += 1;
			console.error(`✗ ${n.slug}`);
			for (const x of p) console.error(`    ${x}`);
		}
	}
	const published = new Set(readLedger().published.map((e) => e.slug));
	for (const slug of published) if (!notes.some((n) => n.slug === slug)) (bad += 1), console.error(`✗ ${slug} is recorded as published but is no longer in notes.ts`);
	if (bad) process.exit(1);
	console.log(`${notes.filter((n) => !n.hold).length} notes fit to publish, ${notes.filter((n) => n.hold).length} held.`);
}

// --- What is due -----------------------------------------------------------------

/** The next note to publish today, or null. One a day, oldest first. */
function nextDue(ledger) {
	const day = today();
	if (ledger.published.some((e) => dublinDay(new Date(e.at)) === day)) return null;
	const out = new Set(ledger.published.map((e) => e.slug));
	const due = notes
		.filter((n) => !out.has(n.slug) && !n.hold && n.date <= day)
		.sort((a, b) => (a.date < b.date ? -1 : 1));
	for (const n of due) {
		const p = problems(n);
		if (p.length === 0) return n;
		console.error(`Skipping ${n.slug}: ${p.join('; ')}`);
	}
	return null;
}

function status() {
	const ledger = readLedger();
	const out = new Map(ledger.published.map((e) => [e.slug, e]));
	const day = today();
	for (const n of [...notes].sort((a, b) => (a.date < b.date ? -1 : 1))) {
		const e = out.get(n.slug);
		const state = e
			? `published ${dublinDay(new Date(e.at))}${e.mastodon ? ' · Mastodon' : ''}${e.bluesky ? ' · Bluesky' : ''}`
			: n.hold
				? `HELD: ${n.hold}`
				: n.date <= day
					? 'due'
					: 'scheduled';
		console.log(`${n.date}  ${n.slug.padEnd(34)} ${state}`);
	}
	const next = nextDue(ledger);
	console.log(next ? `\nNext to go out: ${next.slug}` : '\nNothing to publish today.');
}

// --- Pictures --------------------------------------------------------------------

/** Makes static/notes hold exactly the pictures of published notes, and nothing else. */
function assets() {
	const out = new Set(readLedger().published.map((e) => e.slug));
	rmSync(SERVED, { recursive: true, force: true });
	mkdirSync(SERVED, { recursive: true });
	let copied = 0;
	for (const n of notes) {
		if (!out.has(n.slug) || !n.image) continue;
		copyFileSync(imagePath(n), `${SERVED}${n.image.file}`);
		copied += 1;
	}
	console.log(`Pictures of published notes in the site: ${copied}.`);
}

// --- Site ------------------------------------------------------------------------

function site() {
	const ledger = readLedger();
	const n = nextDue(ledger);
	if (!n) {
		console.log('Nothing to publish today.');
		return;
	}
	ledger.published.push({ slug: n.slug, at: now().toISOString() });
	writeLedger(ledger);
	console.log(`${DRY ? 'Would publish' : 'Published'} on the site: ${n.slug}`);
	// Hands the slug to the workflow's next steps.
	if (process.env.GITHUB_OUTPUT && !DRY) writeFileSync(process.env.GITHUB_OUTPUT, `slug=${n.slug}\n`, { flag: 'a' });
}

async function wait(slug) {
	const url = `${SITE}/robotics/notes/${slug}`;
	const until = Date.now() + 10 * 60_000;
	while (Date.now() < until) {
		try {
			const res = await fetch(url, { redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
			if (res.ok) {
				console.log(`${url} is live.`);
				return;
			}
		} catch {
			/* not yet */
		}
		await new Promise((r) => setTimeout(r, 15_000));
	}
	console.error(`${url} did not come up within ten minutes. Not posting a link to a page that is not there.`);
	process.exit(1);
}

// --- Mastodon --------------------------------------------------------------------

async function postMastodon(n) {
	const base = process.env.MASTODON_URL.replace(/\/$/, '');
	const auth = { authorization: `Bearer ${process.env.MASTODON_TOKEN}` };
	const fail = async (what, res) => new Error(`Mastodon ${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);

	const mediaIds = [];
	if (n.image) {
		const form = new FormData();
		form.append('file', new Blob([readFileSync(imagePath(n))], { type: 'image/png' }), n.image.file);
		form.append('description', n.image.alt);
		const up = await fetch(`${base}/api/v2/media`, { method: 'POST', headers: auth, body: form });
		if (!up.ok) throw await fail('image upload', up);
		let media = await up.json();
		// 202 means it is still being processed. Ask until it has an address.
		for (let i = 0; up.status === 202 && !media.url && i < 30; i++) {
			await new Promise((r) => setTimeout(r, 2000));
			const again = await fetch(`${base}/api/v1/media/${media.id}`, { headers: auth });
			if (again.status === 200) media = await again.json();
			else if (again.status !== 206) throw await fail('image processing', again);
		}
		mediaIds.push(media.id);
	}

	const res = await fetch(`${base}/api/v1/statuses`, {
		method: 'POST',
		// The same key for the same note: if this call is repeated within the hour, Mastodon returns the first post.
		headers: { ...auth, 'content-type': 'application/json', 'idempotency-key': `vnta-note-${n.slug}` },
		body: JSON.stringify({ status: mastodonText(n), media_ids: mediaIds, visibility: 'public', language: 'en' })
	});
	if (!res.ok) throw await fail('post', res);
	const status = await res.json();
	return { id: String(status.id), url: status.url };
}

// --- Bluesky ---------------------------------------------------------------------

/**
 * Signs in. The account's name changes when its domain is verified, which
 * would leave BLUESKY_HANDLE out of date, so the account's permanent id (kept
 * in static/.well-known/atproto-did by the profile job) is tried as well.
 */
async function blueskySignIn(pds) {
	const idFile = `${root}static/.well-known/atproto-did`;
	const id = existsSync(idFile) ? readFileSync(idFile, 'utf8').trim() : '';
	let res;
	for (const identifier of [...new Set([process.env.BLUESKY_HANDLE, id].filter(Boolean))]) {
		res = await fetch(`${pds}/xrpc/com.atproto.server.createSession`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ identifier, password: process.env.BLUESKY_APP_PASSWORD })
		});
		if (res.ok) break;
	}
	return res;
}

async function postBluesky(n) {
	const pds = (process.env.BLUESKY_PDS || 'https://bsky.social').replace(/\/$/, '');
	const fail = async (what, res) => new Error(`Bluesky ${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);
	const json = { 'content-type': 'application/json' };

	const login = await blueskySignIn(pds);
	if (!login.ok) throw await fail('sign-in', login);
	const { accessJwt, did, handle } = await login.json();
	const auth = { authorization: `Bearer ${accessJwt}` };
	const web = (uri) => `https://bsky.app/profile/${handle || process.env.BLUESKY_HANDLE}/post/${uri.split('/').pop()}`;

	// Has this note's address already been posted? Then it was posted, and the record was lost.
	const url = noteUrl(n);
	const recent = await fetch(`${pds}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=app.bsky.feed.post&limit=50`, { headers: auth });
	if (recent.ok) {
		const found = ((await recent.json()).records ?? []).find((r) => typeof r.value?.text === 'string' && r.value.text.includes(url));
		if (found) return { uri: found.uri, url: web(found.uri), found: true };
	}

	const text = blueskyText(n);
	// A link is marked by where it sits in the text, counted in UTF-8 bytes.
	const bytes = (s) => new TextEncoder().encode(s).length;
	const start = bytes(text.slice(0, text.lastIndexOf(url)));
	const record = {
		$type: 'app.bsky.feed.post',
		text,
		createdAt: new Date().toISOString(),
		langs: ['en'],
		facets: [{ index: { byteStart: start, byteEnd: start + bytes(url) }, features: [{ $type: 'app.bsky.richtext.facet#link', uri: url }] }]
	};

	if (n.image) {
		const up = await fetch(`${pds}/xrpc/com.atproto.repo.uploadBlob`, { method: 'POST', headers: { ...auth, 'content-type': 'image/png' }, body: readFileSync(imagePath(n)) });
		if (!up.ok) throw await fail('image upload', up);
		const { blob } = await up.json();
		record.embed = { $type: 'app.bsky.embed.images', images: [{ alt: n.image.alt, image: blob, aspectRatio: { width: 1080, height: 1350 } }] };
	} else {
		// No picture: show the page as a card instead.
		record.embed = { $type: 'app.bsky.embed.external', external: { uri: url, title: `${n.title} | VNTA Robotics`, description: n.summary } };
	}

	const res = await fetch(`${pds}/xrpc/com.atproto.repo.createRecord`, {
		method: 'POST',
		headers: { ...auth, ...json },
		body: JSON.stringify({ repo: did, collection: 'app.bsky.feed.post', record })
	});
	if (!res.ok) throw await fail('post', res);
	const { uri } = await res.json();
	return { uri, url: web(uri) };
}

// --- Verify ----------------------------------------------------------------------

/** What the publisher needs a Mastodon key to be allowed to do, and nothing more. */
const MASTODON_NEEDS = ['write:statuses', 'write:media'];

/** Checks that a network's key is accepted, without posting anything. */
async function verify(which) {
	if (which === 'mastodon') {
		const base = (process.env.MASTODON_URL || '').replace(/\/$/, '');
		if (!base || !process.env.MASTODON_TOKEN) return console.log('Mastodon: no key set.');
		const res = await fetch(`${base}/api/v1/apps/verify_credentials`, { headers: { authorization: `Bearer ${process.env.MASTODON_TOKEN}` } });
		if (!res.ok) {
			console.error(`Mastodon refused the key (${res.status}). Check MASTODON_URL and MASTODON_TOKEN.`);
			process.exit(1);
		}
		const app = await res.json();
		console.log(`Mastodon: the key works (application "${app.name}").`);
		// Newer servers say what the key may do. Say so if it is more than posting.
		const scopes = Array.isArray(app.scopes) ? app.scopes : [];
		const extra = scopes.filter((x) => !MASTODON_NEEDS.includes(x));
		const missing = scopes.length ? MASTODON_NEEDS.filter((x) => !scopes.includes(x) && !scopes.includes('write')) : [];
		if (missing.length) {
			console.error(`Mastodon: the key may not ${missing.join(' or ')}. Posting will fail.`);
			process.exit(1);
		}
		// The owner chose a wider key on purpose, so that the profile job can keep the profile up to date. Said once, plainly, not as a warning.
		if (extra.length) console.log(`Mastodon: this key can do more than post (${extra.join(', ')}). Publishing notes only uses ${MASTODON_NEEDS.join(' and ')}.`);
		return;
	}
	if (which === 'bluesky') {
		if (!process.env.BLUESKY_HANDLE || !process.env.BLUESKY_APP_PASSWORD) return console.log('Bluesky: no key set.');
		const pds = (process.env.BLUESKY_PDS || 'https://bsky.social').replace(/\/$/, '');
		const res = await blueskySignIn(pds);
		if (!res.ok) {
			console.error(`Bluesky refused the key (${res.status}). Check BLUESKY_HANDLE and BLUESKY_APP_PASSWORD.`);
			process.exit(1);
		}
		console.log(`Bluesky: the key works (signed in as ${(await res.json()).handle}).`);
		return;
	}
	console.error('Usage: node scripts/publish-notes.mjs verify mastodon|bluesky');
	process.exit(2);
}

// --- Social ----------------------------------------------------------------------

async function social() {
	const networks = [
		{ key: 'mastodon', name: 'Mastodon', on: !!(process.env.MASTODON_URL && process.env.MASTODON_TOKEN), post: postMastodon },
		{ key: 'bluesky', name: 'Bluesky', on: !!(process.env.BLUESKY_HANDLE && process.env.BLUESKY_APP_PASSWORD), post: postBluesky }
	];
	for (const net of networks) if (!net.on) console.log(`${net.name}: no key set, skipped.`);

	const ledger = readLedger();
	const oldest = now().getTime() - FRESH_DAYS * 86_400_000;
	let failed = 0;
	for (const entry of ledger.published) {
		if (new Date(entry.at).getTime() < oldest) continue;
		const n = notes.find((x) => x.slug === entry.slug);
		if (!n) continue;
		for (const net of networks) {
			if (!net.on || entry[net.key]) continue;
			if (DRY) {
				console.log(`Would post to ${net.name}:\n${net.key === 'mastodon' ? mastodonText(n) : blueskyText(n)}\n`);
				continue;
			}
			try {
				const { found, ...posted } = await net.post(n);
				entry[net.key] = posted;
				// Written at once, so a later failure cannot lose the fact that this went out.
				writeLedger(ledger);
				console.log(`${net.name}: ${found ? 'already there' : 'posted'} ${posted.url}`);
			} catch (e) {
				failed += 1;
				console.error(`${net.name}: ${n.slug} was not posted. ${e.message}`);
			}
		}
	}
	if (failed) process.exit(1);
}

// --- Go --------------------------------------------------------------------------

const [command, arg] = process.argv.slice(2);
const commands = { check, status, site, wait: () => wait(arg), social, assets, verify: () => verify(arg) };
if (!commands[command]) {
	console.error('Usage: node scripts/publish-notes.mjs check | status | site | wait <slug> | social | assets');
	process.exit(2);
}
await commands[command]();
