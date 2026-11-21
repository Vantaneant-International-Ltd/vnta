// The app's HTTP API. One function: handle(request, env). Routes live under /api/app.
// Rules: every route except sign-in needs a session; every data query is
// filtered by the signed-in user's id; changes must come from our own site.
import { ApiError, type Env, type Mailer } from './types.ts';
import * as auth from './auth.ts';
import { addDocument, deleteDocument, getDocument, listDocuments } from './documents.ts';
import { createDraft, listDrafts, listFindings, updateFinding } from './findings.ts';
import { deleteAccount, exportAll, purgeExpired, setRetention } from './account.ts';

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
	});

/** Changes must come from the same site, so another site cannot act with a visitor's cookie. */
function sameOrigin(request: Request): boolean {
	const origin = request.headers.get('origin');
	if (!origin) return false;
	try {
		return new URL(origin).host === new URL(request.url).host;
	} catch {
		return false;
	}
}

async function body(request: Request): Promise<Record<string, unknown>> {
	try {
		const b = await request.json();
		return b && typeof b === 'object' ? (b as Record<string, unknown>) : {};
	} catch {
		throw new ApiError(400, 'Bad request.');
	}
}

export async function handle(request: Request, env: Env, mailer: Mailer | null = auth.resendMailer(env)): Promise<Response> {
	try {
		const url = new URL(request.url);
		const path = url.pathname.replace(/^\/api\/app/, '').replace(/\/+$/, '') || '/';
		const method = request.method;
		if (method !== 'GET' && !sameOrigin(request)) throw new ApiError(403, 'Not allowed.');

		// --- Sign-in (no session yet) ---
		if (method === 'POST' && path === '/auth/start') {
			await auth.startLogin(env, (await body(request)).email, mailer);
			return json({ ok: true });
		}
		if (method === 'POST' && path === '/auth/verify') {
			const b = await body(request);
			const token = await auth.verifyLogin(env, b.email, b.code);
			return json({ ok: true }, 200, { 'set-cookie': auth.cookieHeader(token) });
		}
		if (method === 'POST' && path === '/auth/logout') {
			await auth.endSession(env, request);
			return json({ ok: true }, 200, { 'set-cookie': auth.clearCookieHeader() });
		}

		// --- Everything below needs a session ---
		const user = await auth.sessionUser(env, request);
		if (!user) throw new ApiError(401, 'Sign in to continue.');

		if (method === 'GET' && path === '/me') {
			const purged = await purgeExpired(env, user.id, user.retentionDays);
			return json({ user: { email: user.email, retentionDays: user.retentionDays }, purged });
		}
		if (method === 'PATCH' && path === '/settings') {
			return json({ retentionDays: await setRetention(env, user.id, (await body(request)).retentionDays) });
		}
		if (method === 'GET' && path === '/export') {
			const data = await exportAll(env, user.id, user.email);
			return json(data, 200, { 'content-disposition': 'attachment; filename="vnta-export.json"' });
		}
		if (method === 'DELETE' && path === '/account') {
			const b = await body(request);
			if (b.confirm !== 'delete my account') throw new ApiError(400, 'Type the confirmation phrase to delete.');
			await deleteAccount(env, user.id);
			return json({ ok: true }, 200, { 'set-cookie': auth.clearCookieHeader() });
		}

		if (method === 'GET' && path === '/documents') return json({ documents: await listDocuments(env, user.id) });
		if (method === 'POST' && path === '/documents') {
			let form: FormData;
			try {
				form = await request.formData();
			} catch {
				throw new ApiError(400, 'Send the file as a form upload.');
			}
			const file = form.get('file');
			if (!(file instanceof File)) throw new ApiError(400, 'Choose a file to add.');
			return json(await addDocument(env, user.id, file.name, new Uint8Array(await file.arrayBuffer())));
		}
		let m = path.match(/^\/documents\/([0-9a-f]+)$/);
		if (m && method === 'GET') {
			const d = await getDocument(env, user.id, m[1]);
			return json({ ...d, findings: await listFindings(env, user.id, m[1]) });
		}
		if (m && method === 'DELETE') {
			await deleteDocument(env, user.id, m[1]);
			return json({ ok: true });
		}

		if (method === 'GET' && path === '/findings') return json({ findings: await listFindings(env, user.id) });
		m = path.match(/^\/findings\/([0-9a-f]+)$/);
		if (m && method === 'PATCH') {
			const b = await body(request);
			return json({ finding: await updateFinding(env, user.id, m[1], { status: b.status, dateIso: b.dateIso }) });
		}
		m = path.match(/^\/findings\/([0-9a-f]+)\/drafts$/);
		if (m && method === 'GET') return json({ drafts: await listDrafts(env, user.id, m[1]) });
		if (m && method === 'POST') return json(await createDraft(env, user.id, m[1]));

		throw new ApiError(404, 'Not found.');
	} catch (e) {
		if (e instanceof ApiError) return json({ error: e.message }, e.status);
		// Never put document text or addresses in logs: record only that something failed.
		console.error('app api error', e instanceof Error ? e.name : 'unknown');
		return json({ error: 'Something went wrong on our side.' }, 500);
	}
}
