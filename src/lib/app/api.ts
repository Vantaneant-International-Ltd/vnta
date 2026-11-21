// The browser's side of /api/app. Types mirror src/server/findings.ts and documents.ts.

export type Status = 'needs_review' | 'ready_for_approval' | 'in_progress' | 'completed' | 'unable_to_verify' | 'dismissed';

export interface Finding {
	id: string;
	documentId: string;
	documentName: string;
	kind: string;
	title: string;
	status: Status;
	confidence: 'high' | 'medium' | 'low';
	notes: string[];
	dateIso: string | null;
	dateSource: 'you' | 'document' | 'unclear' | 'none';
	dateRaw: string | null;
	dateCandidates: string[];
	relative: string | null;
	time: string | null;
	amount: { raw: string; value: number; currency: string } | null;
	evidence: { quote: string; start: number; end: number; line: number };
	createdAt: number;
	updatedAt: number;
}
export interface Doc {
	id: string;
	name: string;
	kind: 'pdf' | 'text';
	size: number;
	textState: 'ok' | 'no_text' | 'nothing_found';
	charCount: number;
	createdAt: number;
}
export interface Draft {
	id: string;
	findingId: string;
	body: string;
	status: 'draft';
	sent: false;
	createdAt: number;
}
export type AddResult =
	| { duplicate: true; document: Doc }
	| { duplicate: false; document: Doc; findingCount: number; rejectedCount: number };

export interface Security {
	passkeys: { id: string; name: string; createdAt: number; lastUsedAt: number | null }[];
	sessions: { id: string; method: 'code' | 'passkey'; device: string; createdAt: number; current: boolean }[];
	events: { kind: string; device: string | null; at: number }[];
}

export class ApiFailure extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

async function call<T>(method: string, path: string, body?: unknown | FormData): Promise<T> {
	const init: RequestInit = { method, credentials: 'same-origin' };
	if (body instanceof FormData) init.body = body;
	else if (body !== undefined) {
		init.body = JSON.stringify(body);
		init.headers = { 'content-type': 'application/json' };
	}
	let res: Response;
	try {
		res = await fetch(`/api/app${path}`, init);
	} catch {
		throw new ApiFailure(0, 'Could not reach VNTA. Check your connection and try again.');
	}
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new ApiFailure(res.status, data.error || 'Something went wrong.');
	return data as T;
}

export const api = {
	start: (email: string) => call<{ ok: true }>('POST', '/auth/start', { email }),
	verify: (email: string, code: string) => call<{ ok: true }>('POST', '/auth/verify', { email, code }),
	logout: () => call<{ ok: true }>('POST', '/auth/logout'),
	me: () => call<{ user: { email: string; retentionDays: number }; purged: number }>('GET', '/me'),
	documents: () => call<{ documents: Doc[] }>('GET', '/documents'),
	document: (id: string) => call<{ document: Doc; text: string; findings: Finding[] }>('GET', `/documents/${id}`),
	upload: (file: File) => {
		const f = new FormData();
		f.set('file', file);
		return call<AddResult>('POST', '/documents', f);
	},
	removeDocument: (id: string) => call<{ ok: true }>('DELETE', `/documents/${id}`),
	findings: () => call<{ findings: Finding[] }>('GET', '/findings'),
	update: (id: string, patch: { status?: Status; dateIso?: string | null }) =>
		call<{ finding: Finding }>('PATCH', `/findings/${id}`, patch),
	drafts: (id: string) => call<{ drafts: Draft[] }>('GET', `/findings/${id}/drafts`),
	makeDraft: (id: string) => call<{ finding: Finding; draft: Draft }>('POST', `/findings/${id}/drafts`),
	setRetention: (retentionDays: number) => call<{ retentionDays: number }>('PATCH', '/settings', { retentionDays }),
	security: () => call<Security>('GET', '/security'),
	passkeyRegisterOptions: () => call<{ options: any; challengeId: string }>('POST', '/passkeys/register/options'),
	passkeyRegisterVerify: (challengeId: string, response: unknown, name: string) =>
		call<{ id: string; name: string }>('POST', '/passkeys/register/verify', { challengeId, response, name }),
	passkeySigninOptions: () => call<{ options: any; challengeId: string }>('POST', '/auth/passkey/options'),
	passkeySigninVerify: (challengeId: string, response: unknown) => call<{ ok: true }>('POST', '/auth/passkey/verify', { challengeId, response }),
	removePasskey: (id: string) => call<{ ok: true }>('DELETE', `/passkeys/${id}`),
	signOutDevice: (id: string) => call<{ ok: true }>('DELETE', `/sessions/${id}`),
	signOutOthers: () => call<{ ok: true }>('POST', '/sessions/revoke-others'),
	deleteAccount: () => call<{ ok: true }>('DELETE', '/account', { confirm: 'delete my account' })
};
