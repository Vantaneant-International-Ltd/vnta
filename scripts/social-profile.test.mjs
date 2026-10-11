// Tests for the profile job, against pretend Mastodon and Bluesky servers and
// a pretend copy of the site. Nothing real is touched.
//
//   node --test scripts/social-profile.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./social-profile.mjs', import.meta.url));
const PROFILE = 'https://mastodon.social/@vntagroup';

async function world(t, { linked = true, scopes = 'all', note = '', fields = [], description = '' } = {}) {
	const seen = { updates: [], puts: [] };
	const state = { note, fields: fields.map((f) => ({ ...f, verified_at: null })), description };
	const server = createServer(async (req, res) => {
		const chunks = [];
		for await (const c of req) chunks.push(c);
		const body = Buffer.concat(chunks).toString();
		const send = (code, obj, type = 'application/json') => {
			res.writeHead(code, { 'content-type': type });
			res.end(typeof obj === 'string' ? obj : JSON.stringify(obj));
		};
		const url = new URL(req.url, 'http://x');
		if (url.pathname === '/') return send(200, linked ? `<html><head><link rel="me" href="${PROFILE}"></head></html>` : '<html></html>', 'text/html');
		if (url.pathname === '/api/v1/accounts/verify_credentials') {
			if (scopes === 'post-only') return send(403, { error: 'This action is outside the authorized scopes' });
			return send(200, { url: PROFILE, source: { note: state.note, fields: state.fields.map(({ name, value }) => ({ name, value })) }, fields: state.fields });
		}
		if (url.pathname === '/api/v1/accounts/update_credentials') {
			const form = new URLSearchParams(body);
			const next = [];
			for (let i = 0; form.has(`fields_attributes[${i}][name]`); i++) {
				const value = form.get(`fields_attributes[${i}][value]`);
				// Like Mastodon: a link is ticked only if the site links back.
				next.push({ name: form.get(`fields_attributes[${i}][name]`), value, verified_at: linked && value.startsWith('https://vnta.xyz') ? '2026-10-12T00:00:00Z' : null });
			}
			state.fields = next;
			if (form.has('note')) state.note = form.get('note');
			seen.updates.push({ fields: next.map(({ name, value }) => `${name}=${value}`), note: form.get('note') });
			return send(200, {});
		}
		if (url.pathname === '/xrpc/com.atproto.server.createSession') {
			const { identifier, password } = JSON.parse(body);
			seen.identifier = identifier;
			if (password !== 'app-pass' || identifier === 'old-name.example') return send(401, { error: 'AuthenticationRequired' });
			return send(200, { accessJwt: 'jwt', did: 'did:plc:abc123', handle: 'vntagroup.bsky.social' });
		}
		if (url.pathname === '/xrpc/com.atproto.repo.getRecord') return send(200, { value: { $type: 'app.bsky.actor.profile', displayName: 'VNTA', avatar: { ref: 'pic' }, description: state.description } });
		if (url.pathname === '/xrpc/com.atproto.repo.putRecord') {
			seen.puts.push(JSON.parse(body).record);
			return send(200, {});
		}
		send(404, {});
	});
	await new Promise((r) => server.listen(0, '127.0.0.1', r));
	t.after(() => new Promise((r) => server.close(r)));
	const origin = `http://127.0.0.1:${server.address().port}`;
	const didFile = join(mkdtempSync(join(tmpdir(), 'social-')), '.well-known', 'atproto-did');
	const env = { PATH: process.env.PATH, SOCIAL_SITE: origin, SOCIAL_DID_FILE: didFile, SOCIAL_WAIT_MS: '50', MASTODON_URL: origin, MASTODON_TOKEN: 't', BLUESKY_PDS: origin, BLUESKY_HANDLE: 'vntagroup.bsky.social', BLUESKY_APP_PASSWORD: 'app-pass' };
	const run = (command, extra = {}) =>
		new Promise((resolve) => {
			const child = spawn(process.execPath, [script, command], { env: { ...env, ...extra } });
			let out = '';
			child.stdout.on('data', (d) => (out += d));
			child.stderr.on('data', (d) => (out += d));
			child.on('close', (code) => resolve({ code, out }));
		});
	return { seen, run, didFile };
}

test('an empty profile gets its links and description, and the site link earns the tick', async (t) => {
	const w = await world(t);
	const r = await w.run('apply');
	assert.equal(r.code, 0, r.out);
	assert.deepEqual(w.seen.updates[0].fields, ['Website=https://vnta.xyz', 'Robotics=https://vnta.xyz/robotics', 'Studio=https://vnta.xyz/studio', 'Based=Dublin, Ireland']);
	assert.equal(w.seen.updates[0].note, 'A VNTA picture.');
	assert.match(r.out, /green tick on Website, Robotics, Studio/);
	// Bluesky: the description is set, and what was already on the profile is kept.
	assert.equal(w.seen.puts[0].description, 'Infrastructure for autonomous systems. Dublin.\nA VNTA picture.');
	assert.deepEqual([w.seen.puts[0].displayName, w.seen.puts[0].avatar.ref], ['VNTA', 'pic']);
});

test('a description someone typed is never overwritten, and their own link is kept if there is room', async (t) => {
	const w = await world(t, { note: 'Typed by hand.', description: 'Also typed by hand.', fields: [{ name: 'Press', value: 'press@example.com' }] });
	const r = await w.run('apply');
	assert.equal(r.code, 0, r.out);
	assert.equal(w.seen.updates[0].note, null, 'the description was not sent');
	assert.equal(w.seen.updates[0].fields.length, 4);
	assert.match(r.out, /1 older link\(s\) did not fit/);
	assert.equal(w.seen.puts.length, 0, 'the Bluesky description was left alone');
	assert.match(r.out, /already has a description, left as it is/);
});

test('a key that can only post is told so, and nothing is changed', async (t) => {
	const w = await world(t, { scopes: 'post-only' });
	const r = await w.run('apply');
	assert.equal(r.code, 1);
	assert.match(r.out, /may post but may not read or change the profile/);
	assert.equal(w.seen.updates.length, 0);
});

test('if the site does not link back yet, the links are still set and it says the tick must wait', async (t) => {
	const w = await world(t, { linked: false });
	const r = await w.run('apply');
	assert.equal(r.code, 0, r.out);
	assert.match(r.out, /does not show the link back to the profile yet/);
	assert.equal(w.seen.updates.length, 1);
});

test('the Bluesky id is written once, and signing in still works after the name changes', async (t) => {
	const w = await world(t);
	const first = await w.run('did');
	assert.equal(first.code, 0, first.out);
	assert.equal(readFileSync(w.didFile, 'utf8'), 'did:plc:abc123');
	assert.match((await w.run('did')).out, /already on the site/);
	// The old name no longer works; the stored id does.
	const later = await w.run('did', { BLUESKY_HANDLE: 'old-name.example' });
	assert.equal(later.code, 0, later.out);
	assert.equal(w.seen.identifier, 'did:plc:abc123');
});

test('a dry run changes nothing', async (t) => {
	const w = await world(t);
	const r = await w.run('apply', { SOCIAL_DRY_RUN: '1' });
	assert.equal(r.code, 0, r.out);
	assert.deepEqual([w.seen.updates.length, w.seen.puts.length], [0, 0]);
	await w.run('did', { SOCIAL_DRY_RUN: '1' });
	assert.equal(existsSync(w.didFile), false);
});
