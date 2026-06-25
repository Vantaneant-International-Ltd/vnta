// POST /functions/v1/vnta-submit
// Verified write path for the two public VNTA forms (careers application,
// pricing/contact inquiry). The browser sends the form payload plus a Cloudflare
// Turnstile token; this function verifies the token server-side and only then
// inserts using the service role. Once anon INSERT is revoked on vnta_applications
// and vnta_inquiries (see supabase/revoke-anon-insert-vnta-forms.sql), this is the
// only way those rows get created.
//
// verify_jwt is OFF for this function: the caller is an anonymous public form, the
// gate is Turnstile, not a Supabase JWT. Deploy with --no-verify-jwt.
//
// Env (set on the project, never committed):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (auto-injected)
//   TURNSTILE_SECRET_KEY                      (set via supabase secrets)

import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.45.4';
import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { verifyTurnstile } from '../_shared/turnstile.ts';

const url = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
const admin: SupabaseClient = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});

function clientIp(req: Request): string | null {
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  return fwd.split(',')[0]?.trim() || null;
}
function json(req: Request, body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders(req) },
  });
}
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

Deno.serve(async (req: Request) => {
  const pre = handleCors(req);
  if (pre) return pre;
  if (req.method !== 'POST') return json(req, { ok: false, error: 'Method not allowed.' }, 405);

  let payload: Record<string, unknown>;
  try { payload = await req.json(); } catch { return json(req, { ok: false, error: 'Invalid JSON body.' }, 400); }

  // Turnstile gate first. No insert happens unless the token verifies.
  const v = await verifyTurnstile(str(payload.turnstileToken), clientIp(req));
  if (!v.ok) {
    console.warn('[vnta-submit] turnstile rejected:', v.reason);
    return json(req, { ok: false, error: 'Could not verify you are human. Please retry.' }, 403);
  }

  const form = str(payload.form);
  const d = (payload.data ?? {}) as Record<string, unknown>;

  if (form === 'inquiry') {
    // Column CHECK constraints on vnta_inquiries remain as defense in depth.
    const { error } = await admin.from('vnta_inquiries').insert({
      kind: str(d.kind) || 'contact',
      name: str(d.name),
      email: str(d.email),
      company: str(d.company),
      engagement: str(d.engagement),
      timeline: str(d.timeline),
      budget: str(d.budget),
      notes: str(d.notes),
      source: str(d.source) || '/pricing',
    });
    if (error) { console.error('[vnta-submit] inquiry insert failed:', error); return json(req, { ok: false, error: 'Could not submit.' }, 500); }
    return json(req, { ok: true }, 200);
  }

  if (form === 'application') {
    // cv_path is produced by the client uploading the CV to the vnta-cvs bucket
    // before calling this function. See the note in the build report about that
    // upload still being anon.
    const { error } = await admin.from('vnta_applications').insert({
      posting_slug: str(d.posting_slug),
      role_title: str(d.role_title),
      name: str(d.name),
      email: str(d.email),
      location: str(d.location),
      links: str(d.links),
      lane: str(d.lane),
      vendr_lane: str(d.vendr_lane),
      vendr_examples: str(d.vendr_examples),
      pitch: str(d.pitch),
      cv_path: str(d.cv_path),
      cv_filename: str(d.cv_filename),
      ack_contractor: d.ack_contractor === true,
      ack_pay: d.ack_pay === true,
    });
    if (error) { console.error('[vnta-submit] application insert failed:', error); return json(req, { ok: false, error: 'Could not submit.' }, 500); }
    return json(req, { ok: true }, 200);
  }

  return json(req, { ok: false, error: 'Unknown form.' }, 400);
});
