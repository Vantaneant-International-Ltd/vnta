// Server-side Cloudflare Turnstile verification. The SECRET key is read from env
// only (never hardcoded, never sent to the client). Set it once on the Supabase
// project:  supabase secrets set TURNSTILE_SECRET_KEY=...  (or via the dashboard).

const SECRET = Deno.env.get('TURNSTILE_SECRET_KEY');
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult { ok: boolean; reason?: string; }

export async function verifyTurnstile(token: string, ip: string | null): Promise<TurnstileResult> {
  if (!SECRET) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY is not set on this project.');
    return { ok: false, reason: 'misconfigured' };
  }
  if (!token) return { ok: false, reason: 'missing_token' };

  const body = new URLSearchParams();
  body.set('secret', SECRET);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  try {
    const res = await fetch(SITEVERIFY, { method: 'POST', body });
    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    if (data && (data as { success?: boolean }).success === true) return { ok: true };
    const codes = ((data as { 'error-codes'?: string[] })['error-codes'] ?? []).join(',');
    return { ok: false, reason: codes || 'verification_failed' };
  } catch (err) {
    console.error('[turnstile] siteverify request failed:', err);
    return { ok: false, reason: 'siteverify_unreachable' };
  }
}
