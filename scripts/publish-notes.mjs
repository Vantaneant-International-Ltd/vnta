// Publishes VNTA Robotics notes: first on this site, then a short version on
// Mastodon and Bluesky with a link back. Run by .github/workflows/notes.yml
// every morning. The notes are in src/lib/server/notes.ts; what has been
// published is recorded in src/lib/server/notes-published.json, and the site
// shows only what is recorded there.
//
// It also sends the posts that belong to one network only and have no page
// (src/lib/server/posts.ts, recorded in posts-sent.json), run by
// .github/workflows/posts.yml.
//
// The two networks are not given the same thing:
//   Mastodon   the fuller version with hashtags, the morning the note is published.
//   Bluesky    its own shorter line, the morning after.
//
//   node scripts/publish-notes.mjs check     every note is fit to publish (run in CI)
//   node scripts/publish-notes.mjs status    what is out, what is next, what is held
//   node scripts/publish-notes.mjs site      publish the next due note on the site (writes the record)
//   node scripts/publish-notes.mjs wait <slug>   wait until that note's page is live
//   node scripts/publish-notes.mjs social    post fresh notes to Mastodon and Bluesky
//   node scripts/publish-notes.mjs posts     send the one-network posts that are due
//   node scripts/publish-notes.mjs verify mastodon|bluesky|pixelfed   check a key works, without posting anything
//   node scripts/publish-notes.mjs assets    copy published notes' pictures into the site (runs before each build)
//
// The rules, in one place:
//   - A note goes out when its date has come (Dublin time) and it has no `hold`.
//   - One note a day at most, oldest first. A backlog is worked off a day at a time.
//   - A note with a [BRACKET] left in it is never published.
//   - A network with no key set is skipped, quietly. Nothing breaks.
//   - Only a note published in the last three days is posted to a network, so
//     adding a key later does not flood the feed with old notes.
//   - Nothing is posted twice: what was posted is recorded, Mastodon is given
//     the note's address as a key, and Bluesky's recent posts are checked.
//   - A one-network post goes out once, on or after its date, and not if it
//     is more than three days late.
//
// Keys (GitHub repository secrets; see the README):
//   MASTODON_URL   the server, for example https://mastodon.social
//   MASTODON_TOKEN an access token with write:statuses and write:media
//   BLUESKY_HANDLE the handle, for example vnta.bsky.social
//   BLUESKY_APP_PASSWORD  an app password (Settings > Privacy and security > App passwords)
//   BLUESKY_PDS    only if the account is not on bsky.social
//   PIXELFED_URL   the server, for example https://pixelfed.social
//   PIXELFED_TOKEN a personal access token with read and write (Settings > Applications)
//
// Pixelfed is pictures first, so only a one-network post with a picture goes
// there. Notes do not, yet.
//
// For testing: NOTES_TODAY=2026-10-13 pretends it is that day; NOTES_DRY_RUN=1
// writes and posts nothing; NOTES_SITE, NOTES_LEDGER, NOTES_FILE, POSTS_LEDGER
// and POSTS_FILE point elsewhere.
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const LEDGER = process.env.NOTES_LEDGER || `${root}src/lib/server/notes-published.json`;
const SITE = (process.env.NOTES_SITE || 'https://vnta.xyz').replace(/\/$/, '');
const DRY = process.env.NOTES_DRY_RUN === '1';

const BLUESKY_LIMIT = 300; // graphemes
const MASTODON_LIMIT = 500; // characters; a link counts as 23 there, we count it in full
const PIXELFED_LIMIT = 500; // characters in a caption, the default on a Pixelfed server
const BLUESKY_IMAGE_LIMIT = 1_000_000; // bytes
const FRESH_DAYS = 3;
/** How many mornings after a note is published each network gets it. */
const AFTER = { mastodon: 0, bluesky: 1 };
const SENT = process.env.POSTS_LEDGER || `${root}src/lib/server/posts-sent.json`;

const { notes } = await import(process.env.NOTES_FILE || `${root}src/lib/server/notes.ts`);
const { posts } = await import(process.env.POSTS_FILE || `${root}src/lib/server/posts.ts`);

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
const POST_IMAGES = `${root}src/lib/content/post-images/`;
/** A note's picture, in the shape the two senders take. */
const noteImage = (n) => (n.image ? { path: imagePath(n), name: n.image.file, alt: n.image.alt, width: 1080, height: 1350 } : null);
const postImage = (p) => (p.image ? { path: `${POST_IMAGES}${p.image.file}`, name: p.image.file, alt: p.image.alt, width: p.image.width, height: p.image.height } : null);

/** Whole days, in Dublin, between a moment and today. */
const daysSince = (iso) => Math.round((Date.parse(today()) - Date.parse(dublinDay(new Date(iso)))) / 86_400_000);
/** Whole days between a YYYY-MM-DD and today. */
const daysLate = (day) => Math.round((Date.parse(today()) - Date.parse(day)) / 86_400_000);

/** On GitHub, a line that shows on the run's page as well as in its log. */
const flag = (kind, message) => {
	const line = message.replace(/\s+/g, ' ').trim();
	if (process.env.GITHUB_ACTIONS) console.log(`::${kind}::${line}`);
	else (kind === 'error' ? console.error : console.log)(line);
};

const readLedger = () => JSON.parse(readFileSync(LEDGER, 'utf8'));
const writeLedger = (ledger) => {
	if (DRY) return;
	writeFileSync(LEDGER, JSON.stringify(ledger, null, '\t') + '\n');
};

const readSent = () => JSON.parse(readFileSync(SENT, 'utf8'));
const writeSent = (ledger) => {
	if (DRY) return;
	writeFileSync(SENT, JSON.stringify(ledger, null, '\t') + '\n');
};

/** The text each network gets. Bluesky has its own shorter line where a note gives one. */
const blueskyText = (n) => `${n.bluesky ?? n.short}\n\n${noteUrl(n)}`;
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
	if (n.bluesky !== undefined && !n.bluesky.trim()) out.push('the Bluesky line is empty; delete it to use the short version');
	if (/\[[^\]]*\]/.test(n.bluesky ?? '')) out.push('there is still a [BRACKET] to fill in, in the Bluesky line');
	const b = graphemes(blueskyText(n));
	if (b > BLUESKY_LIMIT) out.push(`the Bluesky version with its link is ${b} characters; Bluesky allows ${BLUESKY_LIMIT}`);
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

/** Everything that would stop a one-network post being sent. */
function postProblems(p) {
	const out = [];
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.id ?? '')) out.push('the id must be lower-case words joined by hyphens');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date ?? '') || Number.isNaN(Date.parse(p.date))) out.push('the date must be YYYY-MM-DD');
	if (!['mastodon', 'bluesky', 'pixelfed'].includes(p.network)) out.push('the network must be mastodon, bluesky or pixelfed');
	if (p.network === 'pixelfed' && !p.image) out.push('a Pixelfed post needs a picture');
	if (!p.text?.trim()) out.push('there is no text');
	else if (/\[[^\]]*\]/.test(p.text)) out.push('there is still a [BRACKET] to fill in');
	else if (p.network === 'bluesky' && graphemes(p.text) > BLUESKY_LIMIT) out.push(`it is ${graphemes(p.text)} characters; Bluesky allows ${BLUESKY_LIMIT}`);
	else if (p.network === 'mastodon' && p.text.length > MASTODON_LIMIT) out.push(`it is ${p.text.length} characters; Mastodon allows ${MASTODON_LIMIT}`);
	else if (p.network === 'pixelfed' && p.text.length > PIXELFED_LIMIT) out.push(`it is ${p.text.length} characters; Pixelfed allows ${PIXELFED_LIMIT}`);
	if (p.image) {
		const file = `${POST_IMAGES}${p.image.file}`;
		if (!p.image.alt?.trim()) out.push('the image needs a description (alt)');
		if (!(p.image.width > 0 && p.image.height > 0)) out.push('the image needs its width and height in pixels');
		if (!/\.png$/.test(p.image.file ?? '')) out.push('the image must be a PNG');
		else if (!existsSync(file)) out.push(`src/lib/content/post-images/${p.image.file} does not exist`);
		else if (statSync(file).size > BLUESKY_IMAGE_LIMIT) out.push(`${p.image.file} is over ${BLUESKY_IMAGE_LIMIT} bytes`);
	}
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
	const ids = new Set();
	for (const p of posts) {
		const problemsHere = postProblems(p);
		if (ids.has(p.id)) problemsHere.push('another post has the same id');
		ids.add(p.id);
		if (p.hold || !problemsHere.length) continue;
		bad += 1;
		console.error(`✗ post ${p.id}`);
		for (const x of problemsHere) console.error(`    ${x}`);
	}
	if (bad) process.exit(1);
	console.log(`${notes.filter((n) => !n.hold).length} notes fit to publish, ${notes.filter((n) => n.hold).length} held.`);
	console.log(`${posts.filter((p) => !p.hold).length} one-network posts fit to send, ${posts.filter((p) => p.hold).length} held.`);
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

/**
 * Posts to Mastodon. `key` is this post's own name: if the same call is
 * repeated within the hour, Mastodon returns the first post, not a second one.
 */
async function sendMastodon({ text, image, key }) {
	const base = process.env.MASTODON_URL.replace(/\/$/, '');
	const auth = { authorization: `Bearer ${process.env.MASTODON_TOKEN}` };
	const fail = async (what, res) => new Error(`Mastodon ${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);

	const mediaIds = [];
	if (image) {
		const form = new FormData();
		form.append('file', new Blob([readFileSync(image.path)], { type: 'image/png' }), image.name);
		form.append('description', image.alt);
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
		headers: { ...auth, 'content-type': 'application/json', 'idempotency-key': key },
		body: JSON.stringify({ status: text, media_ids: mediaIds, visibility: 'public', language: 'en' })
	});
	if (!res.ok) throw await fail('post', res);
	const status = await res.json();
	return { id: String(status.id), url: status.url };
}

const postMastodon = (n) => sendMastodon({ text: mastodonText(n), image: noteImage(n), key: `vnta-note-${n.slug}` });

// --- Pixelfed --------------------------------------------------------------------

/**
 * A key as it should be sent. Spaces and line breaks picked up while copying
 * are dropped: no key has any, so nothing is lost.
 */
const keyOf = (name) => (process.env[name] ?? '').replace(/\s+/g, '');

/**
 * A key is plain letters, digits and a few signs. One that was retyped, or
 * copied out of a picture, can carry a look-alike letter from another
 * alphabet, and then it cannot even be sent. Says what is wrong in plain
 * words, without showing any of the key.
 */
function keyFault(name) {
	const value = keyOf(name);
	const odd = [...value].map((ch, i) => ({ ch, at: i + 1 })).filter(({ ch }) => !/^[\x21-\x7e]$/.test(ch));
	if (!odd.length) return '';
	const cyrillic = odd.filter(({ ch }) => /\p{Script=Cyrillic}/u.test(ch)).length;
	const kind = cyrillic === odd.length ? 'Cyrillic letters' : cyrillic ? 'letters from other alphabets, some Cyrillic' : 'characters that are not plain letters or digits';
	const shape = /^eyJ/.test(value) && value.split('.').length === 3 ? 'It has the shape of a key otherwise.' : 'It does not have the shape of a key at all (a key starts with "eyJ" and has two full stops in it): something else may have been pasted.';
	return `${name} is ${[...value].length} characters long and ${odd.length} of them are ${kind} (at ${odd.slice(0, 6).map((o) => o.at).join(', ')}${odd.length > 6 ? ', ...' : ''}). ${shape} A key is plain English letters and digits only. Copy it again with the copy button and save the secret again.`;
}

/** Text as a person reads it, from the HTML a server sends back: for comparing, not for showing. */
const plain = (html) =>
	String(html ?? '')
		.replace(/<br\s*\/?>(?=.)/gi, ' ')
		.replace(/<\/p>\s*<p>/gi, ' ')
		.replace(/<[^>]*>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&#0?39;|&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();

/**
 * Posts a picture with its caption to Pixelfed, which answers to the same
 * calls as Mastodon. It has no key that stops a repeat, so the account's
 * recent posts are looked through first.
 */
async function sendPixelfed({ text, image }) {
	if (keyFault('PIXELFED_TOKEN')) throw new Error(keyFault('PIXELFED_TOKEN'));
	const base = process.env.PIXELFED_URL.replace(/\/$/, '');
	const auth = { authorization: `Bearer ${keyOf('PIXELFED_TOKEN')}`, accept: 'application/json' };
	const fail = async (what, res) => new Error(`Pixelfed ${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);

	const me = await fetch(`${base}/api/v1/accounts/verify_credentials`, { headers: auth });
	if (!me.ok) throw await fail('sign-in', me);
	const account = await me.json();
	try {
		const recent = await fetch(`${base}/api/v1/accounts/${account.id}/statuses?limit=20`, { headers: auth });
		if (recent.ok) {
			const want = text.replace(/\s+/g, ' ').trim();
			const found = (await recent.json()).find((s) => plain(s.content) === want || (typeof s.content_text === 'string' && s.content_text.replace(/\s+/g, ' ').trim() === want));
			if (found) return { id: String(found.id), url: found.url, found: true };
		}
	} catch {
		/* Looking was a courtesy. The record of what was sent is the real guard. */
	}

	const form = new FormData();
	form.append('file', new Blob([readFileSync(image.path)], { type: 'image/png' }), image.name);
	form.append('description', image.alt);
	const up = await fetch(`${base}/api/v1/media`, { method: 'POST', headers: auth, body: form });
	if (!up.ok) throw await fail('image upload', up);
	const media = await up.json();

	const res = await fetch(`${base}/api/v1/statuses`, {
		method: 'POST',
		headers: { ...auth, 'content-type': 'application/json' },
		body: JSON.stringify({ status: text, media_ids: [String(media.id)], visibility: 'public' })
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

/**
 * Bluesky does not find links and hashtags in a post by itself: each one is
 * marked by where it sits in the text, counted in UTF-8 bytes.
 */
function blueskyFacets(text) {
	const bytes = (str) => new TextEncoder().encode(str).length;
	const mark = (at, piece, feature) => ({ index: { byteStart: bytes(text.slice(0, at)), byteEnd: bytes(text.slice(0, at)) + bytes(piece) }, features: [feature] });
	const out = [];
	for (const m of text.matchAll(/https?:\/\/[^\s]*[^\s.,;:!?)\]'"]/g)) out.push(mark(m.index, m[0], { $type: 'app.bsky.richtext.facet#link', uri: m[0] }));
	for (const m of text.matchAll(/(^|\s)(#([A-Za-z][A-Za-z0-9_]*))/g)) out.push(mark(m.index + m[1].length, m[2], { $type: 'app.bsky.richtext.facet#tag', tag: m[3] }));
	return out;
}

/**
 * Posts to Bluesky. `same` says whether an earlier post is this one: recent
 * posts are looked through first, so a post whose record was lost is found
 * and not repeated. `card` is shown when there is no picture.
 */
async function sendBluesky({ text, image, card, same }) {
	const pds = (process.env.BLUESKY_PDS || 'https://bsky.social').replace(/\/$/, '');
	const fail = async (what, res) => new Error(`Bluesky ${what}: ${res.status} ${(await res.text()).slice(0, 300)}`);
	const json = { 'content-type': 'application/json' };

	const login = await blueskySignIn(pds);
	if (!login.ok) throw await fail('sign-in', login);
	const { accessJwt, did, handle } = await login.json();
	const auth = { authorization: `Bearer ${accessJwt}` };
	const web = (uri) => `https://bsky.app/profile/${handle || process.env.BLUESKY_HANDLE}/post/${uri.split('/').pop()}`;

	const recent = await fetch(`${pds}/xrpc/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=app.bsky.feed.post&limit=50`, { headers: auth });
	if (recent.ok) {
		const found = ((await recent.json()).records ?? []).find((r) => typeof r.value?.text === 'string' && same(r.value.text));
		if (found) return { uri: found.uri, url: web(found.uri), found: true };
	}

	const record = { $type: 'app.bsky.feed.post', text, createdAt: new Date().toISOString(), langs: ['en'] };
	const facets = blueskyFacets(text);
	if (facets.length) record.facets = facets;

	if (image) {
		const up = await fetch(`${pds}/xrpc/com.atproto.repo.uploadBlob`, { method: 'POST', headers: { ...auth, 'content-type': 'image/png' }, body: readFileSync(image.path) });
		if (!up.ok) throw await fail('image upload', up);
		const { blob } = await up.json();
		record.embed = { $type: 'app.bsky.embed.images', images: [{ alt: image.alt, image: blob, aspectRatio: { width: image.width, height: image.height } }] };
	} else if (card) {
		// No picture: show the page as a card instead.
		record.embed = { $type: 'app.bsky.embed.external', external: card };
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

const postBluesky = (n) =>
	sendBluesky({
		text: blueskyText(n),
		image: noteImage(n),
		card: { uri: noteUrl(n), title: `${n.title} | VNTA Robotics`, description: n.summary },
		// Has this note's address already been posted? Then it was posted, and the record was lost.
		same: (text) => text.includes(noteUrl(n))
	});

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
	if (which === 'pixelfed') {
		const base = (process.env.PIXELFED_URL || '').replace(/\/$/, '');
		if (!base || !process.env.PIXELFED_TOKEN) return console.log('Pixelfed: no key set.');
		if (keyFault('PIXELFED_TOKEN')) {
			flag('error', `Pixelfed: ${keyFault('PIXELFED_TOKEN')}`);
			process.exit(1);
		}
		let res;
		try {
			res = await fetch(`${base}/api/v1/accounts/verify_credentials`, { headers: { authorization: `Bearer ${keyOf('PIXELFED_TOKEN')}`, accept: 'application/json' } });
		} catch (e) {
			flag('error', `Pixelfed could not be reached at the address in PIXELFED_URL. ${e.message}`);
			process.exit(1);
		}
		if (!res.ok) {
			flag('error', `Pixelfed refused the key (${res.status}). Check PIXELFED_URL and PIXELFED_TOKEN.`);
			process.exit(1);
		}
		const account = await res.json();
		// The name is public. It is said in pieces because GitHub hides the server's address in a run's notes.
		flag('notice', `Pixelfed: the key works (signed in as @${account.username ?? account.acct}).`);
		return;
	}
	console.error('Usage: node scripts/publish-notes.mjs verify mastodon|bluesky|pixelfed');
	process.exit(2);
}

// --- Social ----------------------------------------------------------------------

const haveKeys = () => ({
	mastodon: !!(process.env.MASTODON_URL && process.env.MASTODON_TOKEN),
	bluesky: !!(process.env.BLUESKY_HANDLE && process.env.BLUESKY_APP_PASSWORD),
	pixelfed: !!(process.env.PIXELFED_URL && process.env.PIXELFED_TOKEN)
});

async function social() {
	const on = haveKeys();
	const networks = [
		{ key: 'mastodon', name: 'Mastodon', on: on.mastodon, post: postMastodon, text: mastodonText },
		{ key: 'bluesky', name: 'Bluesky', on: on.bluesky, post: postBluesky, text: blueskyText }
	];
	for (const net of networks) if (!net.on) console.log(`${net.name}: no key set, skipped.`);

	const ledger = readLedger();
	let failed = 0;
	for (const entry of ledger.published) {
		const age = daysSince(entry.at);
		if (age > FRESH_DAYS) continue;
		const n = notes.find((x) => x.slug === entry.slug);
		if (!n) continue;
		for (const net of networks) {
			if (!net.on || entry[net.key]) continue;
			// Each network has its own day.
			const wait = AFTER[net.key] - age;
			if (wait > 0) {
				console.log(`${net.name}: ${n.slug} goes out ${wait === 1 ? 'tomorrow' : `in ${wait} days`}.${DRY ? `\n${net.text(n)}\n` : ''}`);
				continue;
			}
			if (DRY) {
				console.log(`Would post to ${net.name}:\n${net.text(n)}\n`);
				continue;
			}
			try {
				const { found, ...posted } = await net.post(n);
				entry[net.key] = posted;
				// Written at once, so a later failure cannot lose the fact that this went out.
				writeLedger(ledger);
				flag('notice', `${net.name}: ${found ? 'already there' : 'posted'} ${posted.url}`);
			} catch (e) {
				failed += 1;
				flag('error', `${net.name}: ${n.slug} was not posted. ${e.message}`);
			}
		}
	}
	if (failed) process.exit(1);
}

// --- One-network posts -----------------------------------------------------------

async function sendPosts() {
	const on = haveKeys();
	const names = { mastodon: 'Mastodon', bluesky: 'Bluesky', pixelfed: 'Pixelfed' };
	const ledger = readSent();
	const done = new Set(ledger.sent.map((e) => e.id));
	const day = today();
	let failed = 0;
	let due = 0;
	for (const p of posts) {
		if (done.has(p.id) || p.hold || p.date > day) continue;
		const name = names[p.network];
		if (daysLate(p.date) > FRESH_DAYS) {
			console.log(`${p.id}: more than ${FRESH_DAYS} days late, not sent. Change its date if it should still go.`);
			continue;
		}
		const wrong = postProblems(p);
		if (wrong.length) {
			failed += 1;
			flag('error', `${p.id} was not sent: ${wrong.join('; ')}`);
			continue;
		}
		due += 1;
		if (!on[p.network]) {
			console.log(`${name}: no key set, ${p.id} skipped.`);
			continue;
		}
		if (DRY) {
			console.log(`Would post to ${name} (${p.id}):\n${p.text}\n`);
			continue;
		}
		try {
			const sent =
				p.network === 'mastodon'
					? await sendMastodon({ text: p.text, image: postImage(p), key: `vnta-post-${p.id}` })
					: p.network === 'pixelfed'
						? await sendPixelfed({ text: p.text, image: postImage(p) })
						: await sendBluesky({ text: p.text, image: postImage(p), same: (text) => text === p.text });
			// `ref` is the network's own name for the post. It must not be called `id`: that is ours.
			ledger.sent.push({ id: p.id, network: p.network, at: now().toISOString(), url: sent.url, ref: sent.id ?? sent.uri });
			writeSent(ledger);
			flag('notice', `${name}: ${sent.found ? 'already there' : 'posted'} ${sent.url}`);
		} catch (e) {
			failed += 1;
			flag('error', `${name}: ${p.id} was not posted. ${e.message}`);
		}
	}
	if (!due) console.log('No one-network post is due.');
	if (failed) process.exit(1);
}

// --- Go --------------------------------------------------------------------------

const [command, arg] = process.argv.slice(2);
const commands = { check, status, site, wait: () => wait(arg), social, posts: sendPosts, assets, verify: () => verify(arg) };
if (!commands[command]) {
	console.error('Usage: node scripts/publish-notes.mjs check | status | site | wait <slug> | social | posts | assets | verify <network>');
	process.exit(2);
}
await commands[command]();
