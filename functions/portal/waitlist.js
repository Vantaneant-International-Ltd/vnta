// Cloudflare Pages Function -> GET /portal/waitlist
// Andrew's live BUILDT launch-list signups, read from the buildt-waitlist D1
// (bound as WAITLIST). Sits under /portal, so Cloudflare Access gates it: only a
// signed-in client sees these leads.

export async function onRequest(context) {
	const { env } = context;
	const out = { total: 0, signups: [] };

	if (env.WAITLIST) {
		try {
			const res = await env.WAITLIST.prepare(
				'SELECT email, phone, source, created_at FROM waitlist ORDER BY datetime(created_at) DESC LIMIT 200'
			).all();
			out.signups = (res.results || []).map((r) => ({
				email: r.email,
				phone: r.phone || null,
				source: r.source || null,
				created_at: r.created_at
			}));
			out.total = out.signups.length;
		} catch (e) {
			// leave empty; portal renders "no signups"
		}
	}

	return new Response(JSON.stringify(out), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
	});
}
