// Passkeys (WebAuthn): sign in with a fingerprint, face or device PIN instead of an emailed code.
// - We store only the public key. The private key never leaves the person's device.
// - A passkey always needs the device to confirm it is you (user verification), so one
//   passkey is already two factors: something you have, and something you are or know.
// - Every challenge is random, works once and expires after five minutes.
// - The site address (origin) and RP ID are taken from the request, so a passkey made on
//   one address does not work on a look-alike.
import {
	generateRegistrationOptions,
	verifyRegistrationResponse,
	generateAuthenticationOptions,
	verifyAuthenticationResponse
} from '@simplewebauthn/server';
import { ApiError, type Env } from './types.ts';
import { createSession, logEvent, now, type User } from './auth.ts';
import { randomToken } from './crypto.ts';

const CHALLENGE_TTL = 5 * 60;
const MAX_PASSKEYS = 10;
const MAX_OPEN_CHALLENGES = 5000;
const RP_NAME = 'VNTA';

export function b64urlEncode(bytes: Uint8Array): string {
	let s = '';
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function b64urlDecode(text: string): Uint8Array<ArrayBuffer> {
	const s = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
	const raw = atob(s);
	const out = new Uint8Array(raw.length);
	for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
	return out;
}

function site(request: Request) {
	const u = new URL(request.url);
	return { rpID: u.hostname, origin: u.origin };
}

async function saveChallenge(env: Env, challenge: string, purpose: 'register' | 'signin', userId: string | null): Promise<string> {
	const t = now();
	await env.DB.prepare('DELETE FROM webauthn_challenges WHERE expires_at < ?').bind(t).run();
	const open = await env.DB.prepare('SELECT COUNT(*) AS n FROM webauthn_challenges').first<{ n: number }>();
	if ((open?.n ?? 0) > MAX_OPEN_CHALLENGES) throw new ApiError(429, 'Too many sign-in attempts right now. Try again in a few minutes.');
	const id = randomToken(16);
	await env.DB.prepare('INSERT INTO webauthn_challenges (id, challenge, purpose, user_id, expires_at) VALUES (?,?,?,?,?)')
		.bind(id, challenge, purpose, userId, t + CHALLENGE_TTL)
		.run();
	return id;
}

/** Fetches a challenge and deletes it in the same breath: it can never be used twice. */
async function takeChallenge(env: Env, id: unknown, purpose: 'register' | 'signin', userId: string | null): Promise<string> {
	const bad = new ApiError(400, 'That took too long or did not match. Please try again.');
	if (typeof id !== 'string' || !/^[0-9a-f]{32}$/.test(id)) throw bad;
	const row = await env.DB.prepare('SELECT challenge, purpose, user_id, expires_at FROM webauthn_challenges WHERE id = ?')
		.bind(id)
		.first<{ challenge: string; purpose: string; user_id: string | null; expires_at: number }>();
	await env.DB.prepare('DELETE FROM webauthn_challenges WHERE id = ?').bind(id).run();
	if (!row || row.expires_at < now() || row.purpose !== purpose || row.user_id !== userId) throw bad;
	return row.challenge;
}

// --- Adding a passkey (signed in) ------------------------------------------

export async function registrationOptions(env: Env, user: User, request: Request) {
	const { rpID } = site(request);
	const mine = await env.DB.prepare('SELECT id, transports FROM passkeys WHERE user_id = ?').bind(user.id).all<{ id: string; transports: string | null }>();
	if (mine.results.length >= MAX_PASSKEYS) throw new ApiError(400, `You can keep up to ${MAX_PASSKEYS} passkeys. Remove one first.`);
	const options = await generateRegistrationOptions({
		rpName: RP_NAME,
		rpID,
		userName: user.email,
		userID: new TextEncoder().encode(user.id),
		attestationType: 'none',
		excludeCredentials: mine.results.map((p) => ({ id: p.id, transports: p.transports ? JSON.parse(p.transports) : undefined })),
		// Discoverable, and the device must confirm it is you.
		authenticatorSelection: { residentKey: 'required', userVerification: 'required' }
	});
	return { options, challengeId: await saveChallenge(env, options.challenge, 'register', user.id) };
}

export async function registrationVerify(env: Env, user: User, request: Request, b: Record<string, unknown>, device: string) {
	const expectedChallenge = await takeChallenge(env, b.challengeId, 'register', user.id);
	const { rpID, origin } = site(request);
	let result;
	try {
		result = await verifyRegistrationResponse({
			response: b.response as any,
			expectedChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			requireUserVerification: true
		});
	} catch {
		throw new ApiError(400, 'We could not add that passkey. Please try again.');
	}
	if (!result.verified || !result.registrationInfo) throw new ApiError(400, 'We could not add that passkey. Please try again.');
	const c = result.registrationInfo.credential;
	const name = String(b.name ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 40) || device;
	try {
		await env.DB.prepare('INSERT INTO passkeys (id, user_id, public_key, counter, transports, name, created_at) VALUES (?,?,?,?,?,?,?)')
			.bind(c.id, user.id, b64urlEncode(c.publicKey), c.counter, c.transports ? JSON.stringify(c.transports) : null, name, now())
			.run();
	} catch {
		throw new ApiError(400, 'That passkey is already saved.');
	}
	await logEvent(env, user.id, 'passkey_added', device);
	return { id: c.id, name };
}

// --- Signing in with a passkey (not signed in) ------------------------------

export async function signinOptions(env: Env, request: Request) {
	const { rpID } = site(request);
	// No email asked and no list of credentials sent, so this reveals nothing about who has an account.
	const options = await generateAuthenticationOptions({ rpID, userVerification: 'required' });
	return { options, challengeId: await saveChallenge(env, options.challenge, 'signin', null) };
}

export async function signinVerify(env: Env, request: Request, b: Record<string, unknown>, device: string): Promise<string> {
	const expectedChallenge = await takeChallenge(env, b.challengeId, 'signin', null);
	const fail = new ApiError(400, 'That passkey did not work. Try again, or use an emailed code.');
	const response = b.response as any;
	const credId = typeof response?.id === 'string' ? response.id : '';
	const row = credId
		? await env.DB.prepare('SELECT id, user_id, public_key, counter, transports FROM passkeys WHERE id = ?')
				.bind(credId)
				.first<{ id: string; user_id: string; public_key: string; counter: number; transports: string | null }>()
		: null;
	if (!row) throw fail;
	// A passkey that names its owner must name the same owner we have on file.
	const handle = response?.response?.userHandle;
	if (typeof handle === 'string' && new TextDecoder().decode(b64urlDecode(handle)) !== row.user_id) throw fail;
	const { rpID, origin } = site(request);
	let result;
	try {
		result = await verifyAuthenticationResponse({
			response,
			expectedChallenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
			requireUserVerification: true,
			credential: {
				id: row.id,
				publicKey: b64urlDecode(row.public_key),
				counter: row.counter,
				transports: row.transports ? JSON.parse(row.transports) : undefined
			}
		});
	} catch {
		throw fail;
	}
	if (!result.verified) throw fail;
	await env.DB.prepare('UPDATE passkeys SET counter = ?, last_used_at = ? WHERE id = ?')
		.bind(result.authenticationInfo.newCounter, now(), row.id)
		.run();
	return createSession(env, row.user_id, 'passkey', device);
}

// --- Looking after them -------------------------------------------------------

export async function securityOverview(env: Env, user: User) {
	const passkeys = await env.DB.prepare('SELECT id, name, created_at, last_used_at FROM passkeys WHERE user_id = ? ORDER BY created_at')
		.bind(user.id)
		.all<{ id: string; name: string; created_at: number; last_used_at: number | null }>();
	const sessions = await env.DB.prepare('SELECT token_hash, method, device, created_at FROM sessions WHERE user_id = ? AND expires_at > ? ORDER BY created_at DESC')
		.bind(user.id, now())
		.all<{ token_hash: string; method: string; device: string | null; created_at: number }>();
	const events = await env.DB.prepare('SELECT kind, device, at FROM security_events WHERE user_id = ? ORDER BY at DESC LIMIT 20')
		.bind(user.id)
		.all<{ kind: string; device: string | null; at: number }>();
	return {
		passkeys: passkeys.results.map((p) => ({ id: p.id, name: p.name, createdAt: p.created_at, lastUsedAt: p.last_used_at })),
		sessions: sessions.results.map((s) => ({
			id: s.token_hash.slice(0, 16),
			method: s.method,
			device: s.device ?? 'a device',
			createdAt: s.created_at,
			current: s.token_hash.startsWith(user.sessionId)
		})),
		events: events.results.map((e) => ({ kind: e.kind, device: e.device, at: e.at }))
	};
}

export async function removePasskey(env: Env, user: User, id: string, device: string) {
	const r = (await env.DB.prepare('DELETE FROM passkeys WHERE id = ? AND user_id = ?').bind(id, user.id).run()) as { meta?: { changes?: number }; changes?: number };
	const changed = r?.meta?.changes ?? r?.changes ?? 0;
	if (!changed) throw new ApiError(404, 'Not found.');
	await logEvent(env, user.id, 'passkey_removed', device);
}

export async function revokeSession(env: Env, user: User, shortId: string, device: string) {
	if (!/^[0-9a-f]{16}$/.test(shortId)) throw new ApiError(404, 'Not found.');
	if (user.sessionId === shortId) throw new ApiError(400, 'That is the device you are using. Use Sign out instead.');
	await env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND substr(token_hash, 1, 16) = ?").bind(user.id, shortId).run();
	await logEvent(env, user.id, 'session_revoked', device);
}

/** Signs out every other device. The one in use stays signed in. */
export async function revokeOthers(env: Env, user: User, device: string) {
	await env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND substr(token_hash, 1, 16) <> ?").bind(user.id, user.sessionId).run();
	await logEvent(env, user.id, 'sessions_revoked', device);
}
