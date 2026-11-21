// Passwordless sign-in: an emailed six-digit code, then a session cookie.
// - Codes last 10 minutes, allow 5 tries, and one can be sent per email per minute.
// - Only hashes of codes and session tokens are stored.
// - A request that is not a sign-in never reveals whether an email has an account.
import { ApiError, type Env, type Mailer } from './types.ts';
import { sha256Hex, randomCode, randomToken, safeEqual } from './crypto.ts';

export const COOKIE = 'vnta_session';
const CODE_TTL = 10 * 60;
const RESEND_AFTER = 60;
const MAX_TRIES = 5;
const SESSION_TTL = 30 * 24 * 60 * 60;

export const now = () => Math.floor(Date.now() / 1000);

export function normaliseEmail(raw: unknown): string {
	const e = String(raw ?? '').trim().toLowerCase();
	if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new ApiError(400, 'Enter a valid email address.');
	return e;
}

export function resendMailer(env: Env): Mailer | null {
	if (env.RESEND_API_KEY) {
		return {
			async sendCode(to, code) {
				const res = await fetch('https://api.resend.com/emails', {
					method: 'POST',
					headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
					body: JSON.stringify({
						from: env.LOGIN_FROM || 'VNTA <login@vnta.xyz>',
						to,
						subject: 'Your VNTA sign-in code',
						text: `Your VNTA sign-in code is ${code}.\n\nIt works for 10 minutes. If you did not ask for it, ignore this email.`
					})
				});
				if (!res.ok) throw new ApiError(502, 'We could not send the code. Try again in a moment.');
			}
		};
	}
	if (env.DEV_LOG_LOGIN_CODES === '1') {
		return { async sendCode(_to, code) { console.log(`[dev] VNTA sign-in code: ${code}`); } };
	}
	return null;
}

export async function startLogin(env: Env, emailRaw: unknown, mailer: Mailer | null): Promise<void> {
	const email = normaliseEmail(emailRaw);
	if (!mailer) throw new ApiError(503, 'Sign-in is not available yet.');
	const t = now();
	const prev = await env.DB.prepare('SELECT sent_at FROM login_codes WHERE email = ?').bind(email).first<{ sent_at: number }>();
	if (prev && t - prev.sent_at < RESEND_AFTER) throw new ApiError(429, 'A code was just sent. Wait a minute before asking again.');
	const code = randomCode();
	await env.DB.prepare(
		'INSERT INTO login_codes (email, code_hash, expires_at, attempts, sent_at) VALUES (?,?,?,0,?) ' +
			'ON CONFLICT(email) DO UPDATE SET code_hash=excluded.code_hash, expires_at=excluded.expires_at, attempts=0, sent_at=excluded.sent_at'
	)
		.bind(email, await sha256Hex(`${email}:${code}`), t + CODE_TTL, t)
		.run();
	await mailer.sendCode(email, code);
}

/** Returns a new session token, creating the account the first time an email signs in. */
export async function verifyLogin(env: Env, emailRaw: unknown, codeRaw: unknown): Promise<string> {
	const email = normaliseEmail(emailRaw);
	const code = String(codeRaw ?? '').replace(/\s/g, '');
	const bad = new ApiError(400, 'That code is not right, or it has expired.');
	if (!/^\d{6}$/.test(code)) throw bad;
	const row = await env.DB.prepare('SELECT code_hash, expires_at, attempts FROM login_codes WHERE email = ?')
		.bind(email)
		.first<{ code_hash: string; expires_at: number; attempts: number }>();
	const t = now();
	if (!row || row.expires_at < t || row.attempts >= MAX_TRIES) throw bad;
	if (!safeEqual(row.code_hash, await sha256Hex(`${email}:${code}`))) {
		await env.DB.prepare('UPDATE login_codes SET attempts = attempts + 1 WHERE email = ?').bind(email).run();
		throw bad;
	}
	await env.DB.prepare('DELETE FROM login_codes WHERE email = ?').bind(email).run();

	let user = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first<{ id: string }>();
	if (!user) {
		const id = randomToken(16);
		await env.DB.prepare('INSERT INTO users (id, email, created_at) VALUES (?,?,?)').bind(id, email, t).run();
		user = { id };
	}
	const token = randomToken(32);
	await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?,?,?,?)')
		.bind(await sha256Hex(token), user.id, t, t + SESSION_TTL)
		.run();
	return token;
}

export interface User {
	id: string;
	email: string;
	retentionDays: number;
	createdAt: number;
}

export function readCookie(request: Request, name = COOKIE): string | null {
	const h = request.headers.get('cookie');
	if (!h) return null;
	for (const part of h.split(';')) {
		const i = part.indexOf('=');
		if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
	}
	return null;
}

export async function sessionUser(env: Env, request: Request): Promise<User | null> {
	const token = readCookie(request);
	if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
	const row = await env.DB.prepare(
		'SELECT u.id, u.email, u.retention_days, u.created_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?'
	)
		.bind(await sha256Hex(token), now())
		.first<{ id: string; email: string; retention_days: number; created_at: number }>();
	return row ? { id: row.id, email: row.email, retentionDays: row.retention_days, createdAt: row.created_at } : null;
}

export async function endSession(env: Env, request: Request): Promise<void> {
	const token = readCookie(request);
	if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
}

export const cookieHeader = (token: string) =>
	`${COOKIE}=${token}; Path=/; Max-Age=${SESSION_TTL}; HttpOnly; Secure; SameSite=Lax`;
export const clearCookieHeader = () => `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
