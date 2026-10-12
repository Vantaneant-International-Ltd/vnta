// Tests for the note publisher, against pretend Mastodon and Bluesky servers
// on this machine. Nothing here touches a real network or the real record of
// what has been published.
//
//   node --test scripts/publish-notes.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./publish-notes.mjs', import.meta.url));
// Made-up notes, so the tests do not depend on what the real ones say.
const fixture = fileURLToPath(new URL('./fixtures/notes.fixture.ts', import.meta.url));
const postsFixture = fileURLToPath(new URL('./fixtures/posts.fixture.ts', import.meta.url));

/** A pretend Mastodon server and Bluesky server in one, remembering what it was sent. */
async function pretend() {
	const seen = { statuses: [], media: [], records: [], blobs: 0, sessions: 0, pix: [], pixMedia: [] };
	const server = createServer(async (req, res) => {
		const chunks = [];
		for await (const c of req) chunks.push(c);
		const body = Buffer.concat(chunks);
		const send = (code, obj) => {
			res.writeHead(code, { 'content-type': 'application/json' });
			res.end(JSON.stringify(obj));
		};
		const url = new URL(req.url, 'http://x');
		if (req.method === 'GET' && url.pathname.startsWith('/robotics/notes/')) return send(200, {});
		// Pixelfed: the same kind of calls as Mastodon, told apart here by its key.
		if (req.headers.authorization === 'Bearer pix-token' || url.pathname.startsWith('/api/v1/accounts/')) {
			if (req.headers.authorization !== 'Bearer pix-token') return send(401, { error: 'Unauthenticated.' });
			if (url.pathname === '/api/v1/accounts/verify_credentials') return send(200, { id: '77', username: 'vnta', url: 'https://pix.example/vnta' });
			if (url.pathname === '/api/v1/accounts/77/statuses') return send(200, seen.pix.map((s, i) => ({ id: `p${i + 1}`, url: `https://pix.example/p/vnta/p${i + 1}`, content: s.status.replace(/\n/g, '<br />').replace(/#(\w+)/g, '<a href="https://pix.example/discover/tags/$1">#$1</a>') })));
			if (url.pathname === '/api/v1/media') {
				seen.pixMedia.push({ bytes: body.length, hasAlt: body.includes('name="description"') });
				return send(200, { id: `pm${seen.pixMedia.length}` });
			}
			if (url.pathname === '/api/v1/statuses') {
				seen.pix.push(JSON.parse(body.toString()));
				return send(200, { id: `p${seen.pix.length}`, url: `https://pix.example/p/vnta/p${seen.pix.length}` });
			}
			return send(404, { error: 'no such address' });
		}
		// Mastodon
		if (url.pathname === '/api/v1/apps/verify_credentials') {
			if (req.headers.authorization !== 'Bearer masto-token' && req.headers.authorization !== 'Bearer wide-token') return send(401, { error: 'The access token is invalid' });
			const wide = req.headers.authorization === 'Bearer wide-token';
			return send(200, { name: 'VNTA notes', scopes: wide ? ['read', 'write', 'follow', 'push'] : ['write:statuses', 'write:media'] });
		}
		if (url.pathname === '/api/v2/media') {
			seen.media.push({ auth: req.headers.authorization, type: req.headers['content-type'], bytes: body.length, hasAlt: body.includes('name="description"') });
			return send(200, { id: `m${seen.media.length}`, url: 'https://files.example/m.png' });
		}
		if (url.pathname === '/api/v1/statuses') {
			const sent = JSON.parse(body.toString());
			seen.statuses.push({ ...sent, key: req.headers['idempotency-key'], auth: req.headers.authorization });
			return send(200, { id: 1000 + seen.statuses.length, url: `https://social.example/@vnta/${1000 + seen.statuses.length}` });
		}
		// Bluesky
		if (url.pathname === '/xrpc/com.atproto.server.createSession') {
			seen.sessions += 1;
			const { identifier, password } = JSON.parse(body.toString());
			if (password !== 'app-pass') return send(401, { error: 'AuthenticationRequired' });
			return send(200, { accessJwt: 'jwt', did: 'did:plc:test', handle: identifier });
		}
		if (url.pathname === '/xrpc/com.atproto.repo.listRecords') return send(200, { records: seen.records.map((r, i) => ({ uri: `at://did:plc:test/app.bsky.feed.post/rk${i + 1}`, value: r })) });
		if (url.pathname === '/xrpc/com.atproto.repo.uploadBlob') {
			seen.blobs += 1;
			return send(200, { blob: { $type: 'blob', ref: { $link: `cid${seen.blobs}` }, mimeType: req.headers['content-type'], size: body.length } });
		}
		if (url.pathname === '/xrpc/com.atproto.repo.createRecord') {
			const { record } = JSON.parse(body.toString());
			seen.records.push(record);
			return send(200, { uri: `at://did:plc:test/app.bsky.feed.post/rk${seen.records.length}`, cid: 'c' });
		}
		send(404, { error: 'no such address' });
	});
	await new Promise((r) => server.listen(0, '127.0.0.1', r));
	const origin = `http://127.0.0.1:${server.address().port}`;
	return { seen, origin, close: () => new Promise((r) => server.close(r)) };
}

/** A world of its own: an empty record of what is published, and the pretend servers. */
async function world(t, { keys = true } = {}) {
	const fake = await pretend();
	t.after(() => fake.close());
	const dir = mkdtempSync(join(tmpdir(), 'notes-'));
	const ledger = join(dir, 'published.json');
	writeFileSync(ledger, '{ "published": [] }\n');
	const sent = join(dir, 'sent.json');
	writeFileSync(sent, '{ "sent": [] }\n');
	const env = {
		PATH: process.env.PATH,
		NOTES_LEDGER: ledger,
		NOTES_SITE: 'https://vnta.xyz',
		NOTES_FILE: fixture,
		POSTS_FILE: postsFixture,
		POSTS_LEDGER: sent,
		...(keys ? { MASTODON_URL: fake.origin, MASTODON_TOKEN: 'masto-token', BLUESKY_PDS: fake.origin, BLUESKY_HANDLE: 'vnta.example', BLUESKY_APP_PASSWORD: 'app-pass', PIXELFED_URL: fake.origin, PIXELFED_TOKEN: 'pix-token' } : {})
	};
	// Run without blocking: the pretend servers live in this process and must be free to answer.
	const run = (command, day, extra = {}) =>
		new Promise((resolve) => {
			const child = spawn(process.execPath, [script, ...command.split(' ')], { env: { ...env, NOTES_TODAY: day, ...extra } });
			let out = '';
			child.stdout.on('data', (d) => (out += d));
			child.stderr.on('data', (d) => (out += d));
			child.on('close', (code) => resolve({ code, out }));
		});
	return {
		...fake,
		run,
		read: () => JSON.parse(readFileSync(ledger, 'utf8')).published,
		write: (published) => writeFileSync(ledger, JSON.stringify({ published })),
		sent: () => JSON.parse(readFileSync(sent, 'utf8')).sent,
		forget: () => writeFileSync(sent, '{ "sent": [] }\n')
	};
}

test('the real notes are all fit to publish', async (t) => {
	const w = await world(t);
	const r = await w.run('check', '2026-10-11', { NOTES_FILE: '', POSTS_FILE: '' });
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /notes fit to publish/);
	assert.match(r.out, /one-network posts fit to send/);
});

test('the check fails on a note that is not held and not finished', async (t) => {
	const w = await world(t);
	const r = await w.run('check', '2026-10-11');
	assert.equal(r.code, 1);
	assert.match(r.out, /unfinished/);
	assert.match(r.out, /there is still a \[BRACKET\] to fill in/);
	assert.doesNotMatch(r.out, /✗ template/, 'a held note may be unfinished');
});

test('nothing goes out before its date', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-12')).out, /Nothing to publish today/);
	assert.deepEqual(w.read(), []);
});

test('one note a day, oldest first; a held note and an unfinished note never go out', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-13')).out, /Published on the site: alpha/);
	assert.match((await w.run('site', '2026-10-13')).out, /Nothing to publish today/, 'a second run the same day publishes nothing more');
	assert.match((await w.run('site', '2026-10-15')).out, /bravo/);
	assert.match((await w.run('site', '2026-10-20')).out, /charlie/);
	assert.match((await w.run('site', '2026-10-22')).out, /delta/);
	// 27 October is the held note's day. Nothing else is due, so nothing goes out.
	assert.match((await w.run('site', '2026-10-27')).out, /Nothing to publish today/);
	assert.match((await w.run('site', '2026-10-29')).out, /echo/);
	// Far in the future: the rest come out one a day. The held ones and the unfinished one never do.
	for (const d of ['2027-01-04', '2027-01-05', '2027-01-06']) await w.run('site', d);
	assert.deepEqual(
		w.read().map((e) => e.slug),
		['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot']
	);
});

test('a backlog is worked off one day at a time', async (t) => {
	const w = await world(t);
	// The job was switched on late: three notes are already due.
	assert.match((await w.run('site', '2026-10-21')).out, /alpha/);
	assert.match((await w.run('site', '2026-10-21')).out, /Nothing to publish today/);
	assert.match((await w.run('site', '2026-10-22')).out, /bravo/);
});

test('a note with a picture goes to both networks, each on its own day and in its own words', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	const first = (await w.run('social', '2026-10-13'));
	assert.equal(first.code, 0, first.out);
	assert.match(first.out, /Bluesky: alpha goes out tomorrow/);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 0], 'the first morning is Mastodon only');
	const r = (await w.run('social', '2026-10-14'));
	assert.equal(r.code, 0, r.out);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 1], 'the next morning is Bluesky only');
	const url = 'https://vnta.xyz/robotics/notes/alpha';

	// Mastodon
	assert.equal(w.seen.media.length, 1);
	assert.equal(w.seen.media[0].auth, 'Bearer masto-token');
	assert.ok(w.seen.media[0].hasAlt && w.seen.media[0].bytes > 100_000, 'the picture and its description were sent');
	const status = w.seen.statuses[0];
	assert.ok(status.status.startsWith('The short version of alpha') && status.status.includes(url) && status.status.endsWith('#testing #robotics'));
	assert.ok(status.status.length <= 500);
	assert.deepEqual([status.media_ids, status.visibility, status.key], [['m1'], 'public', 'vnta-note-alpha']);

	// Bluesky
	const record = w.seen.records[0];
	assert.equal(record.$type, 'app.bsky.feed.post');
	assert.equal(record.text, `Alpha, in one line for Bluesky.\n\n${url}`, 'Bluesky gets its own line, and no hashtags');
	assert.ok([...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(record.text)].length <= 300);
	const { byteStart, byteEnd } = record.facets[0].index;
	assert.equal(Buffer.from(record.text, 'utf8').subarray(byteStart, byteEnd).toString(), url, 'the link is marked exactly, in bytes');
	assert.equal(record.facets[0].features[0].uri, url);
	assert.equal(record.embed.$type, 'app.bsky.embed.images');
	assert.ok(record.embed.images[0].alt.length > 20 && record.embed.images[0].image.ref.$link === 'cid1');
	assert.deepEqual(record.embed.images[0].aspectRatio, { width: 1080, height: 1350 });

	// Recorded, with where each one is.
	const [entry] = w.read();
	assert.equal(entry.mastodon.url, 'https://social.example/@vnta/1001');
	assert.equal(entry.bluesky.url, 'https://bsky.app/profile/vnta.example/post/rk1');
});

test('nothing is posted twice', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	(await w.run('social', '2026-10-13'));
	(await w.run('social', '2026-10-13'));
	(await w.run('social', '2026-10-14'));
	(await w.run('social', '2026-10-14'));
	(await w.run('social', '2026-10-15'));
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 1]);
});

test('if the record of a Bluesky post is lost, it is found again and not repeated', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	(await w.run('social', '2026-10-13'));
	(await w.run('social', '2026-10-14'));
	// Lose what was recorded about the networks, as a failed save would.
	w.write(w.read().map(({ slug, at }) => ({ slug, at })));
	const r = (await w.run('social', '2026-10-14'));
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /Bluesky: already there/);
	assert.equal(w.seen.records.length, 1, 'Bluesky was not posted to a second time');
	assert.equal(w.read()[0].bluesky.url, 'https://bsky.app/profile/vnta.example/post/rk1');
});

test('a note with no picture is posted with a card for the page', async (t) => {
	const w = await world(t);
	for (const d of ['2026-10-13', '2026-10-15', '2026-10-20']) (await w.run('site', d));
	(await w.run('site', '2026-10-22'));
	const r = (await w.run('social', '2026-10-22'));
	assert.equal(r.code, 0, r.out);
	assert.equal((await w.run('social', '2026-10-23')).code, 0);
	const record = w.seen.records.at(-1);
	assert.equal(record.embed.$type, 'app.bsky.embed.external');
	assert.equal(record.embed.external.uri, 'https://vnta.xyz/robotics/notes/delta');
	assert.deepEqual(w.seen.statuses.at(-1).media_ids, []);
});

test('an old note is not posted when a key is added later', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	// Keys were not there on the day; a week later they are.
	const r = (await w.run('social', '2026-10-20'));
	assert.equal(r.code, 0, r.out);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [0, 0]);
});

test('with no keys set, the networks are skipped and nothing fails', async (t) => {
	const w = await world(t, { keys: false });
	(await w.run('site', '2026-10-13'));
	const r = (await w.run('social', '2026-10-13'));
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /Mastodon: no key set, skipped/);
	assert.match(r.out, /Bluesky: no key set, skipped/);
	assert.deepEqual(Object.keys(w.read()[0]).sort(), ['at', 'slug']);
});

test('if one network refuses, the other still gets the note and the run is marked failed', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	// Bluesky's day is the 14th. Run only then, so both are due at once.
	const r = (await w.run('social', '2026-10-14', { BLUESKY_APP_PASSWORD: 'wrong' }));
	assert.equal(r.code, 1);
	assert.match(r.out, /Bluesky: alpha was not posted/);
	const [entry] = w.read();
	assert.ok(entry.mastodon && !entry.bluesky);
	// The next run, with the right password, posts only what is missing.
	assert.equal((await w.run('social', '2026-10-14')).code, 0);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 1]);
});

test('a note that missed its morning still goes out for three days, then not at all', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	// Bluesky was down on the 14th and 15th.
	(await w.run('social', '2026-10-13'));
	assert.equal((await w.run('social', '2026-10-16')).code, 0);
	assert.equal(w.seen.records.length, 1, 'three days on, it still goes');
	const late = await world(t);
	(await late.run('site', '2026-10-13'));
	(await late.run('social', '2026-10-17'));
	assert.deepEqual([late.seen.statuses.length, late.seen.records.length], [0, 0], 'four days on, it does not');
});

test('a one-network post goes to that network only, once, with its picture', async (t) => {
	const w = await world(t);
	assert.match((await w.run('posts', '2026-10-11')).out, /No one-network post is due/);
	const r = await w.run('posts', '2026-10-12');
	assert.equal(r.code, 0, r.out);

	// Mastodon: exactly the text, the picture with its description, and its own key.
	assert.equal(w.seen.statuses.length, 1);
	assert.equal(w.seen.statuses[0].status, 'Hello, fediverse 👀\n\n#introduction');
	assert.deepEqual([w.seen.statuses[0].media_ids, w.seen.statuses[0].key], [['m1'], 'vnta-post-hello-mastodon']);
	assert.ok(w.seen.media[0].hasAlt && w.seen.media[0].bytes > 10_000);

	// Bluesky: the hashtag and the link are marked exactly, in bytes, after an emoji.
	assert.equal(w.seen.records.length, 1);
	const record = w.seen.records[0];
	const piece = (f) => Buffer.from(record.text, 'utf8').subarray(f.index.byteStart, f.index.byteEnd).toString();
	const link = record.facets.find((f) => f.features[0].$type === 'app.bsky.richtext.facet#link');
	const tag = record.facets.find((f) => f.features[0].$type === 'app.bsky.richtext.facet#tag');
	assert.deepEqual([piece(link), link.features[0].uri], ['https://vnta.xyz/robotics', 'https://vnta.xyz/robotics'], 'the full stop after the link is not part of it');
	assert.deepEqual([piece(tag), tag.features[0].tag], ['#robots', 'robots']);
	assert.deepEqual(record.embed.images[0].aspectRatio, { width: 2001, height: 2001 });

	// Recorded, and not sent again. The held one never goes.
	assert.deepEqual(w.sent().map((e) => [e.id, e.network, e.url]), [
		['hello-mastodon', 'mastodon', 'https://social.example/@vnta/1001'],
		['hello-bluesky', 'bluesky', 'https://bsky.app/profile/vnta.example/post/rk1'],
		['hello-pixelfed', 'pixelfed', 'https://pix.example/p/vnta/p1']
	]);

	// Pixelfed: the caption, and the picture with its description.
	assert.deepEqual(w.seen.pix, [{ status: 'Hello, Pixelfed 👀\n\n#introduction', media_ids: ['pm1'], visibility: 'public' }]);
	assert.ok(w.seen.pixMedia[0].hasAlt && w.seen.pixMedia[0].bytes > 10_000);
	await w.run('posts', '2026-10-12');
	await w.run('posts', '2026-10-13');
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length, w.seen.pix.length], [1, 1, 1]);

	// The later one goes on its own day, with no picture and nothing marked.
	await w.run('posts', '2026-10-20');
	assert.equal(w.seen.records.length, 2);
	assert.deepEqual([w.seen.records[1].text, w.seen.records[1].facets, w.seen.records[1].embed], ['A later line, with no picture.', undefined, undefined]);
});

test('a one-network post that is days late is not sent, and a lost record does not repeat one', async (t) => {
	const w = await world(t);
	const late = await w.run('posts', '2026-10-16');
	assert.match(late.out, /hello-mastodon: more than 3 days late, not sent/);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [0, 0]);

	const again = await world(t);
	await again.run('posts', '2026-10-12');
	again.forget();
	const r = await again.run('posts', '2026-10-12', { MASTODON_URL: '', MASTODON_TOKEN: '' });
	assert.match(r.out, /Bluesky: already there/);
	assert.equal(again.seen.records.length, 1, 'Bluesky was not posted to a second time');
	assert.match(r.out, /Pixelfed: already there/);
	assert.equal(again.seen.pix.length, 1, 'Pixelfed was not posted to a second time');
});

test('a dry run of the one-network posts says what would go and sends nothing', async (t) => {
	const w = await world(t);
	const r = await w.run('posts', '2026-10-12', { NOTES_DRY_RUN: '1' });
	assert.match(r.out, /Would post to Mastodon \(hello-mastodon\)/);
	assert.match(r.out, /Would post to Bluesky \(hello-bluesky\)/);
	assert.match(r.out, /Would post to Pixelfed \(hello-pixelfed\)/);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length, w.seen.pix.length, w.sent().length], [0, 0, 0, 0]);
});

test('the Pixelfed key can be checked without posting, and a picture is required there', async (t) => {
	const w = await world(t);
	const ok = await w.run('verify pixelfed', '2026-10-12');
	assert.equal(ok.code, 0, ok.out);
	assert.match(ok.out, /Pixelfed: the key works \(signed in as @vnta\)/);
	assert.equal((await w.run('verify pixelfed', '2026-10-12', { PIXELFED_TOKEN: 'nope' })).code, 1);
	assert.equal(w.seen.pix.length, 0, 'nothing was posted');
	// The fixture holds a Pixelfed post with no picture: held, so the check passes over it; released, it would fail.
	const r = await w.run('check', '2026-10-12', { NOTES_FILE: '' });
	assert.doesNotMatch(r.out, /no-picture/);
});

test('a dry run writes and posts nothing', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-13', { NOTES_DRY_RUN: '1' })).out, /Would publish on the site: alpha/);
	assert.deepEqual(w.read(), []);
});

test('waiting for a page returns once the page answers', async (t) => {
	const w = await world(t);
	const r = (await w.run('wait alpha', '2026-10-13', { NOTES_SITE: w.origin }));
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /is live/);
});

test('a key can be checked without posting anything', async (t) => {
	const w = await world(t);
	const m = await w.run('verify mastodon', '2026-10-13');
	assert.equal(m.code, 0, m.out);
	assert.match(m.out, /Mastodon: the key works/);
	assert.doesNotMatch(m.out, /can do more than post/);
	const b = await w.run('verify bluesky', '2026-10-13');
	assert.equal(b.code, 0, b.out);
	assert.match(b.out, /Bluesky: the key works \(signed in as vnta.example\)/);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length, w.seen.media.length], [0, 0, 0], 'nothing was posted');
});

test('a key that is refused fails the check, and a key that can do too much is pointed out', async (t) => {
	const w = await world(t);
	assert.equal((await w.run('verify mastodon', '2026-10-13', { MASTODON_TOKEN: 'nope' })).code, 1);
	assert.equal((await w.run('verify bluesky', '2026-10-13', { BLUESKY_APP_PASSWORD: 'nope' })).code, 1);
	const wide = await w.run('verify mastodon', '2026-10-13', { MASTODON_TOKEN: 'wide-token' });
	assert.equal(wide.code, 0, wide.out);
	assert.match(wide.out, /can do more than post \(read, write, follow, push\)/);
});
