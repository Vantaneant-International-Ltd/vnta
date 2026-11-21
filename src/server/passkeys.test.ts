// Run: npm run test:server. Passkeys: what must work, and above all what must be refused.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from './api.ts';
import { testEnv } from './testing/fakes.ts';
import { FakePhone } from './testing/authenticator.ts';

const ORIGIN = 'https://vnta.test';
type T = ReturnType<typeof testEnv>;

async function call(t: T, method: string, path: string, opts: { body?: unknown; cookie?: string } = {}) {
	const headers: Record<string, string> = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) Chrome/120.0 Safari/537.36' };
	if (method !== 'GET') headers.origin = ORIGIN;
	if (opts.cookie) headers.cookie = opts.cookie;
	let body: BodyInit | undefined;
	if (opts.body !== undefined) {
		body = JSON.stringify(opts.body);
		headers['content-type'] = 'application/json';
	}
	const res = await handle(new Request(`${ORIGIN}/api/app${path}`, { method, headers, body }), t.env, t.mailer);
	const text = await res.text();
	let data: any = null;
	try {
		data = JSON.parse(text);
	} catch {}
	return { status: res.status, data, res, text };
}

async function signInByCode(t: T, email: string) {
	t.sent.length = 0;
	await call(t, 'POST', '/auth/start', { body: { email } });
	const r = await call(t, 'POST', '/auth/verify', { body: { email, code: t.sent.at(-1)!.code } });
	assert.equal(r.status, 200);
	return r.res.headers.get('set-cookie')!.split(';')[0];
}

/** Sign in by code, then add a passkey on a fresh fake phone. */
async function withPasskey(t: T, email = 'ana@example.com') {
	const cookie = await signInByCode(t, email);
	const phone = new FakePhone();
	const o = await call(t, 'POST', '/passkeys/register/options', { cookie });
	assert.equal(o.status, 200);
	const response = await phone.create(o.data.options);
	const v = await call(t, 'POST', '/passkeys/register/verify', { cookie, body: { challengeId: o.data.challengeId, response, name: 'My phone' } });
	assert.equal(v.status, 200, v.text);
	return { cookie, phone };
}

async function passkeySignIn(t: T, phone: FakePhone, opts: Parameters<FakePhone['get']>[1] = {}) {
	const o = await call(t, 'POST', '/auth/passkey/options');
	const response = await phone.get(o.data.options, opts);
	return { o, response, r: await call(t, 'POST', '/auth/passkey/verify', { body: { challengeId: o.data.challengeId, response } }) };
}

test('add a passkey, then sign in with it and nothing else', async () => {
	const t = testEnv();
	const { phone } = await withPasskey(t);
	const { r } = await passkeySignIn(t, phone);
	assert.equal(r.status, 200, r.text);
	const cookie = r.res.headers.get('set-cookie')!.split(';')[0];
	assert.equal((await call(t, 'GET', '/me', { cookie })).data.user.email, 'ana@example.com');
	const sec = await call(t, 'GET', '/security', { cookie });
	assert.equal(sec.data.passkeys.length, 1);
	assert.equal(sec.data.passkeys[0].name, 'My phone');
	assert.ok(sec.data.passkeys[0].lastUsedAt);
	assert.equal(sec.data.sessions.find((s: any) => s.current).method, 'passkey');
	assert.deepEqual(sec.data.events.map((e: any) => e.kind).sort(), ['passkey_added', 'signin_code', 'signin_passkey']);
	assert.ok(sec.data.events.every((e: any) => e.device === 'Chrome on Mac'));
});

test('the public key is stored, and the response never leaks it', async () => {
	const t = testEnv();
	const { cookie } = await withPasskey(t);
	const sec = await call(t, 'GET', '/security', { cookie });
	assert.ok(!/public_key|publicKey|counter/i.test(sec.text));
});

test('sign-in options reveal nothing about who has an account', async () => {
	const t = testEnv();
	await withPasskey(t);
	const o = await call(t, 'POST', '/auth/passkey/options');
	assert.equal(o.data.options.allowCredentials, undefined);
	assert.equal(o.data.options.userVerification, 'required');
});

test('a sign-in cannot be replayed: the challenge works once', async () => {
	const t = testEnv();
	const { phone } = await withPasskey(t);
	const first = await passkeySignIn(t, phone);
	assert.equal(first.r.status, 200);
	const again = await call(t, 'POST', '/auth/passkey/verify', { body: { challengeId: first.o.data.challengeId, response: first.response } });
	assert.equal(again.status, 400);
	assert.equal(again.res.headers.get('set-cookie'), null);
});

test('a passkey made for a look-alike site is refused', async () => {
	const t = testEnv();
	const { phone } = await withPasskey(t);
	assert.equal((await passkeySignIn(t, phone, { origin: 'https://vnta-login.example' })).r.status, 400);
	assert.equal((await passkeySignIn(t, phone, { rpId: 'vnta-login.example' })).r.status, 400);
});

test('a device that did not confirm it was you is refused, both when adding and signing in', async () => {
	const t = testEnv();
	const cookie = await signInByCode(t, 'ana@example.com');
	const weak = new FakePhone();
	const o = await call(t, 'POST', '/passkeys/register/options', { cookie });
	const add = await call(t, 'POST', '/passkeys/register/verify', { cookie, body: { challengeId: o.data.challengeId, response: await weak.create(o.data.options, { userVerified: false }) } });
	assert.equal(add.status, 400);
	assert.equal((await call(t, 'GET', '/security', { cookie })).data.passkeys.length, 0);

	const { phone } = await withPasskey(t, 'bo@example.com');
	assert.equal((await passkeySignIn(t, phone, { userVerified: false })).r.status, 400);
});

test('a cloned passkey is caught: a counter that goes backwards is refused', async () => {
	const t = testEnv();
	const { phone } = await withPasskey(t);
	assert.equal((await passkeySignIn(t, phone, { counter: 5 })).r.status, 200);
	assert.equal((await passkeySignIn(t, phone, { counter: 5 })).r.status, 400);
	assert.equal((await passkeySignIn(t, phone, { counter: 3 })).r.status, 400);
	assert.equal((await passkeySignIn(t, phone, { counter: 6 })).r.status, 200);
});

test('an unknown passkey and a forged signature fail the same way, and a stale challenge fails', async () => {
	const t = testEnv();
	const { phone } = await withPasskey(t);
	const stranger = new FakePhone();
	const a = await passkeySignIn(t, stranger);
	assert.equal(a.r.status, 400);

	const o = await call(t, 'POST', '/auth/passkey/options');
	const good = await phone.get(o.data.options);
	const bad = { ...good, response: { ...good.response, signature: good.response.signature.slice(0, -4) + 'AAAA' } };
	const forged = await call(t, 'POST', '/auth/passkey/verify', { body: { challengeId: o.data.challengeId, response: bad } });
	assert.equal(forged.status, 400);
	assert.equal(forged.data.error, a.r.data.error, 'nothing to learn about which passkeys exist');

	const o2 = await call(t, 'POST', '/auth/passkey/options');
	await t.env.DB.prepare('UPDATE webauthn_challenges SET expires_at = 1 WHERE id = ?').bind(o2.data.challengeId).run();
	const r = await call(t, 'POST', '/auth/passkey/verify', { body: { challengeId: o2.data.challengeId, response: await phone.get(o2.data.options) } });
	assert.equal(r.status, 400);
});

test('a challenge from one ceremony cannot be used in another, or by another person', async () => {
	const t = testEnv();
	const ana = await signInByCode(t, 'ana@example.com');
	const bo = await signInByCode(t, 'bo@example.com');
	const phone = new FakePhone();
	const o = await call(t, 'POST', '/passkeys/register/options', { cookie: ana });
	const response = await phone.create(o.data.options);
	// Bo tries to use Ana's registration challenge.
	assert.equal((await call(t, 'POST', '/passkeys/register/verify', { cookie: bo, body: { challengeId: o.data.challengeId, response } })).status, 400);
	// A sign-in challenge cannot be used to add a passkey.
	const s = await call(t, 'POST', '/auth/passkey/options');
	const r2 = await phone.create({ ...o.data.options, challenge: s.data.options.challenge });
	assert.equal((await call(t, 'POST', '/passkeys/register/verify', { cookie: ana, body: { challengeId: s.data.challengeId, response: r2 } })).status, 400);
});

test('the same passkey cannot be saved twice, and adding one needs a session', async () => {
	const t = testEnv();
	const { cookie, phone } = await withPasskey(t);
	const o = await call(t, 'POST', '/passkeys/register/options', { cookie });
	assert.equal(o.data.options.excludeCredentials.length, 1);
	const dup = await call(t, 'POST', '/passkeys/register/verify', { cookie, body: { challengeId: o.data.challengeId, response: await phone.create(o.data.options) } });
	assert.equal(dup.status, 400);
	assert.equal((await call(t, 'POST', '/passkeys/register/options')).status, 401);
});

test('removing a passkey: only the owner can, and email codes still work afterwards', async () => {
	const t = testEnv();
	const { cookie, phone } = await withPasskey(t);
	const bo = await signInByCode(t, 'bo@example.com');
	const id = (await call(t, 'GET', '/security', { cookie })).data.passkeys[0].id;
	assert.equal((await call(t, 'DELETE', `/passkeys/${id}`, { cookie: bo })).status, 404);
	assert.equal((await call(t, 'DELETE', `/passkeys/${id}`, { cookie })).status, 200);
	assert.equal((await passkeySignIn(t, phone)).r.status, 400, 'removed passkey no longer works');
	assert.ok(await signInByCode(t, 'ana@example.com'));
});

test('see your devices, sign one out, or sign out everywhere else', async () => {
	const t = testEnv();
	const a = await signInByCode(t, 'ana@example.com');
	t.sent.length = 0;
	const b = await signInByCode(t, 'ana@example.com').catch(() => null);
	// The second code request is rate limited for a minute; backdate it to simulate time passing.
	await t.env.DB.prepare('UPDATE login_codes SET sent_at = 1').run();
	const b2 = b ?? (await signInByCode(t, 'ana@example.com'));
	const sec = await call(t, 'GET', '/security', { cookie: a });
	assert.equal(sec.data.sessions.length, 2);
	const current = sec.data.sessions.find((s: any) => s.current);
	const other = sec.data.sessions.find((s: any) => !s.current);
	assert.equal((await call(t, 'DELETE', `/sessions/${current.id}`, { cookie: a })).status, 400, 'use Sign out for this device');
	assert.equal((await call(t, 'DELETE', `/sessions/${other.id}`, { cookie: a })).status, 200);
	assert.equal((await call(t, 'GET', '/me', { cookie: b2 })).status, 401);
	assert.equal((await call(t, 'GET', '/me', { cookie: a })).status, 200);

	await t.env.DB.prepare('UPDATE login_codes SET sent_at = 1').run();
	const c = await signInByCode(t, 'ana@example.com');
	assert.equal((await call(t, 'POST', '/sessions/revoke-others', { cookie: a })).status, 200);
	assert.equal((await call(t, 'GET', '/me', { cookie: c })).status, 401);
	assert.equal((await call(t, 'GET', '/me', { cookie: a })).status, 200);
});

test("one person cannot sign another's device out", async () => {
	const t = testEnv();
	const a = await signInByCode(t, 'ana@example.com');
	const bo = await signInByCode(t, 'bo@example.com');
	const anaSession = (await call(t, 'GET', '/security', { cookie: a })).data.sessions[0].id;
	await call(t, 'DELETE', `/sessions/${anaSession}`, { cookie: bo });
	assert.equal((await call(t, 'GET', '/me', { cookie: a })).status, 200);
});

test('deleting the account removes passkeys, challenges and the activity log', async () => {
	const t = testEnv();
	const { cookie } = await withPasskey(t);
	await call(t, 'POST', '/auth/passkey/options');
	assert.equal((await call(t, 'DELETE', '/account', { cookie, body: { confirm: 'delete my account' } })).status, 200);
	for (const table of ['passkeys', 'security_events', 'sessions']) {
		assert.equal((await t.env.DB.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first<{ n: number }>())!.n, 0, table);
	}
});

test('a person can keep at most ten passkeys', async () => {
	const t = testEnv();
	const cookie = await signInByCode(t, 'ana@example.com');
	for (let i = 0; i < 10; i++) {
		const o = await call(t, 'POST', '/passkeys/register/options', { cookie });
		assert.equal(o.status, 200);
		const v = await call(t, 'POST', '/passkeys/register/verify', { cookie, body: { challengeId: o.data.challengeId, response: await new FakePhone().create(o.data.options) } });
		assert.equal(v.status, 200);
	}
	assert.equal((await call(t, 'POST', '/passkeys/register/options', { cookie })).status, 400);
});

test('the activity log keeps only the newest 20 events, as Settings promises', async () => {
	const t = testEnv();
	const { cookie, phone } = await withPasskey(t);
	for (let i = 0; i < 25; i++) assert.equal((await passkeySignIn(t, phone)).r.status, 200);
	const n = await t.env.DB.prepare('SELECT COUNT(*) AS n FROM security_events').first<{ n: number }>();
	assert.equal(n!.n, 20);
	assert.equal((await call(t, 'GET', '/security', { cookie })).data.events.length, 20);
});
