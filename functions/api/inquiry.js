// POST /api/inquiry
// Captures an engagement inquiry to D1 (durable, no key needed) and, if a Resend
// key is configured, emails studio@vnta.xyz. Replaces the old mailto, which
// silently failed when the visitor had no mail client.

export async function onRequest(context) {
	const { request, env } = context;
	if (request.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'Bad request' }, 400);
	}

	const f = (k) => String(body?.[k] ?? '').slice(0, 4000).trim();
	const rec = {
		name: f('name'),
		email: f('email'),
		company: f('company'),
		engagement: f('engagement'),
		timeline: f('timeline'),
		budget: f('budget'),
		notes: f('notes'),
		source: f('source') || '/contact'
	};

	if (!rec.name && !rec.email && !rec.notes) {
		return json({ ok: false, error: 'Add your name, email, or a note first.' }, 400);
	}

	// Honeypot: a field no human sees. Bots fill it, so accept and drop.
	if (f('website')) return json({ ok: true });

	// Never report success when there is nowhere to put the message. Without
	// this the form thanks the visitor and the inquiry is lost.
	if (!env.INQUIRIES && !env.RESEND_API_KEY) {
		return json(
			{ ok: false, error: 'The form is not accepting messages. Please email studio@vnta.xyz.' },
			503
		);
	}

	// 1) Durable capture in D1 (the source of truth; never lost).
	if (env.INQUIRIES) {
		try {
			await env.INQUIRIES.prepare(
				'INSERT INTO inquiries (name,email,company,engagement,timeline,budget,notes,source) VALUES (?,?,?,?,?,?,?,?)'
			)
				.bind(
					rec.name,
					rec.email,
					rec.company,
					rec.engagement,
					rec.timeline,
					rec.budget,
					rec.notes,
					rec.source
				)
				.run();
		} catch (e) {
			return json({ ok: false, error: 'Could not save. Please email studio@vnta.xyz.' }, 500);
		}
	}

	// 2) Notification email via Resend. Best effort when D1 already holds the
	//    record; the only sink, and therefore fatal, when it does not.
	if (env.RESEND_API_KEY) {
		try {
			await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${env.RESEND_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					from: 'VNTA Site <studio@vnta.xyz>',
					to: ['studio@vnta.xyz'],
					reply_to: rec.email || undefined,
					subject: `Engagement inquiry: ${rec.name || rec.email || 'new'}`,
					text: `Name: ${rec.name}\nEmail: ${rec.email}\nCompany: ${rec.company}\nEngagement: ${rec.engagement}\nTimeline: ${rec.timeline}\nBudget: ${rec.budget}\nSource: ${rec.source}\n\n${rec.notes}`
				})
			});
		} catch (e) {
			if (!env.INQUIRIES) {
				return json({ ok: false, error: 'Could not send. Please email studio@vnta.xyz.' }, 502);
			}
			// already captured in D1; the email is best effort
		}
	}

	return json({ ok: true });
}

function json(obj, status = 200) {
	return new Response(JSON.stringify(obj), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}
