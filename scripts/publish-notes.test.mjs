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

/** A pretend Mastodon server and Bluesky server in one, remembering what it was sent. */
async function pretend() {
	const seen = { statuses: [], media: [], records: [], blobs: 0, sessions: 0 };
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
		// Mastodon
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
	const ledger = join(mkdtempSync(join(tmpdir(), 'notes-')), 'published.json');
	writeFileSync(ledger, '{ "published": [] }\n');
	const env = {
		PATH: process.env.PATH,
		NOTES_LEDGER: ledger,
		NOTES_SITE: 'https://vnta.xyz',
		...(keys ? { MASTODON_URL: fake.origin, MASTODON_TOKEN: 'masto-token', BLUESKY_PDS: fake.origin, BLUESKY_HANDLE: 'vnta.example', BLUESKY_APP_PASSWORD: 'app-pass' } : {})
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
		write: (published) => writeFileSync(ledger, JSON.stringify({ published }))
	};
}

test('every note that is not held is fit to publish', async (t) => {
	const w = await world(t);
	const r = (await w.run('check', '2026-10-11'));
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /8 notes fit to publish, 4 held/);
});

test('nothing goes out before its date', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-12')).out, /Nothing to publish today/);
	assert.deepEqual(w.read(), []);
});

test('one note a day, oldest first, and a held note never goes out', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-13')).out, /Published on the site: the-one-question/);
	assert.match((await w.run('site', '2026-10-13')).out, /Nothing to publish today/, 'a second run the same day publishes nothing more');
	assert.match((await w.run('site', '2026-10-15')).out, /declared-is-not-verified/);
	assert.match((await w.run('site', '2026-10-20')).out, /what-we-tested-against/);
	assert.match((await w.run('site', '2026-10-22')).out, /twenty-minutes/);
	// 27 October is the held note's day. Nothing else is due, so nothing goes out.
	assert.match((await w.run('site', '2026-10-27')).out, /Nothing to publish today/);
	assert.match((await w.run('site', '2026-10-29')).out, /our-own-rig-lied-first/);
	// Far in the future: the rest come out one a day, and the four held notes never do.
	const days = ['2027-01-04', '2027-01-05', '2027-01-06', '2027-01-07', '2027-01-08'];
	for (const d of days) (await w.run('site', d));
	assert.deepEqual(
		w.read().map((e) => e.slug),
		['the-one-question', 'declared-is-not-verified', 'what-we-tested-against', 'twenty-minutes', 'our-own-rig-lied-first', 'above-not-instead', 'a-timeout-is-not-a-pass', 'what-it-cannot-do-yet']
	);
});

test('a backlog is worked off one day at a time', async (t) => {
	const w = await world(t);
	// The job was switched on late: three notes are already due.
	assert.match((await w.run('site', '2026-10-21')).out, /the-one-question/);
	assert.match((await w.run('site', '2026-10-21')).out, /Nothing to publish today/);
	assert.match((await w.run('site', '2026-10-22')).out, /declared-is-not-verified/);
});

test('a note with a picture goes to both networks, with its link, picture and description', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	const r = (await w.run('social', '2026-10-13'));
	assert.equal(r.code, 0, r.out);
	const url = 'https://vnta.xyz/robotics/notes/the-one-question';

	// Mastodon
	assert.equal(w.seen.media.length, 1);
	assert.equal(w.seen.media[0].auth, 'Bearer masto-token');
	assert.ok(w.seen.media[0].hasAlt && w.seen.media[0].bytes > 100_000, 'the picture and its description were sent');
	const status = w.seen.statuses[0];
	assert.ok(status.status.includes(url) && status.status.endsWith('#robotics #commissioning'));
	assert.ok(status.status.length <= 500);
	assert.deepEqual([status.media_ids, status.visibility, status.key], [['m1'], 'public', 'vnta-note-the-one-question']);

	// Bluesky
	const record = w.seen.records[0];
	assert.equal(record.$type, 'app.bsky.feed.post');
	assert.ok([...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(record.text)].length <= 300);
	const { byteStart, byteEnd } = record.facets[0].index;
	assert.equal(Buffer.from(record.text, 'utf8').subarray(byteStart, byteEnd).toString(), url, 'the link is marked exactly, in bytes');
	assert.equal(record.facets[0].features[0].uri, url);
	assert.equal(record.embed.$type, 'app.bsky.embed.images');
	assert.ok(record.embed.images[0].alt.length > 20 && record.embed.images[0].image.ref.$link === 'cid1');

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
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 1]);
});

test('if the record of a Bluesky post is lost, it is found again and not repeated', async (t) => {
	const w = await world(t);
	(await w.run('site', '2026-10-13'));
	(await w.run('social', '2026-10-13'));
	// Lose what was recorded about the networks, as a failed save would.
	w.write(w.read().map(({ slug, at }) => ({ slug, at })));
	const r = (await w.run('social', '2026-10-13'));
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
	const record = w.seen.records.at(-1);
	assert.equal(record.embed.$type, 'app.bsky.embed.external');
	assert.equal(record.embed.external.uri, 'https://vnta.xyz/robotics/notes/twenty-minutes');
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
	const r = (await w.run('social', '2026-10-13', { BLUESKY_APP_PASSWORD: 'wrong' }));
	assert.equal(r.code, 1);
	assert.match(r.out, /Bluesky: the-one-question was not posted/);
	const [entry] = w.read();
	assert.ok(entry.mastodon && !entry.bluesky);
	// The next run, with the right password, posts only what is missing.
	assert.equal((await w.run('social', '2026-10-13')).code, 0);
	assert.deepEqual([w.seen.statuses.length, w.seen.records.length], [1, 1]);
});

test('a dry run writes and posts nothing', async (t) => {
	const w = await world(t);
	assert.match((await w.run('site', '2026-10-13', { NOTES_DRY_RUN: '1' })).out, /Would publish on the site: the-one-question/);
	assert.deepEqual(w.read(), []);
});

test('waiting for a page returns once the page answers', async (t) => {
	const w = await world(t);
	const r = (await w.run('wait the-one-question', '2026-10-13', { NOTES_SITE: w.origin }));
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /is live/);
});
