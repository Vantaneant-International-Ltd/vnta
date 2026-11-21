// Run: npm run test:server
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from './api.ts';
import { testEnv } from './testing/fakes.ts';

const ORIGIN = 'https://vnta.test';
const LETTER = `Your home insurance policy renews on 14 February 2027. The renewal premium is €412.80.
Please confirm by 31 January 2027 that your details are correct.
If you wish to change your payment date, tell us before 03/02/2027.
We will reply within 14 days.
`;

type T = ReturnType<typeof testEnv>;

async function call(t: T, method: string, path: string, opts: { body?: unknown; form?: FormData; cookie?: string; origin?: string | null } = {}) {
	const headers: Record<string, string> = {};
	if (opts.origin !== null && method !== 'GET') headers.origin = opts.origin ?? ORIGIN;
	if (opts.cookie) headers.cookie = opts.cookie;
	let body: BodyInit | undefined;
	if (opts.form) body = opts.form;
	else if (opts.body !== undefined) {
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

/** Sign in as an email and return the session cookie. */
async function signIn(t: T, email: string) {
	t.sent.length = 0;
	assert.equal((await call(t, 'POST', '/auth/start', { body: { email } })).status, 200);
	const code = t.sent.at(-1)!.code;
	const r = await call(t, 'POST', '/auth/verify', { body: { email, code } });
	assert.equal(r.status, 200);
	return r.res.headers.get('set-cookie')!.split(';')[0];
}

const upload = (name: string, content: string | Uint8Array, type = 'text/plain') => {
	const f = new FormData();
	f.set('file', new File([content as BlobPart], name, { type }));
	return f;
};

// --- Sign-in ----------------------------------------------------------------

test('sign-in needs a code from the email, and a session cookie opens /me', async () => {
	const t = testEnv();
	assert.equal((await call(t, 'GET', '/me')).status, 401);
	const cookie = await signIn(t, 'Ana@Example.com');
	const me = await call(t, 'GET', '/me', { cookie });
	assert.equal(me.status, 200);
	assert.equal(me.data.user.email, 'ana@example.com');
});

test('a wrong code is refused, and five wrong tries lock that code', async () => {
	const t = testEnv();
	await call(t, 'POST', '/auth/start', { body: { email: 'a@example.com' } });
	const good = t.sent[0].code;
	const wrong = good === '000000' ? '111111' : '000000';
	for (let i = 0; i < 5; i++) assert.equal((await call(t, 'POST', '/auth/verify', { body: { email: 'a@example.com', code: wrong } })).status, 400);
	assert.equal((await call(t, 'POST', '/auth/verify', { body: { email: 'a@example.com', code: good } })).status, 400, 'locked even for the right code');
});

test('a code cannot be asked for twice within a minute, and cannot be reused', async () => {
	const t = testEnv();
	await call(t, 'POST', '/auth/start', { body: { email: 'a@example.com' } });
	assert.equal((await call(t, 'POST', '/auth/start', { body: { email: 'a@example.com' } })).status, 429);
	const code = t.sent[0].code;
	assert.equal((await call(t, 'POST', '/auth/verify', { body: { email: 'a@example.com', code } })).status, 200);
	assert.equal((await call(t, 'POST', '/auth/verify', { body: { email: 'a@example.com', code } })).status, 400);
});

test('with no way to send email, sign-in is refused rather than skipped', async () => {
	const t = testEnv();
	const res = await handle(new Request(`${ORIGIN}/api/app/auth/start`, { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body: JSON.stringify({ email: 'a@example.com' }) }), t.env, null);
	assert.equal(res.status, 503);
});

test('only a hash of the session token is stored', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const token = cookie.split('=')[1];
	const rows = (await t.env.DB.prepare('SELECT token_hash FROM sessions').all<{ token_hash: string }>()).results;
	assert.equal(rows.length, 1);
	assert.notEqual(rows[0].token_hash, token);
});

test('changes from another site are refused', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	assert.equal((await call(t, 'PATCH', '/settings', { cookie, body: { retentionDays: 30 }, origin: 'https://evil.example' })).status, 403);
	assert.equal((await call(t, 'PATCH', '/settings', { cookie, body: { retentionDays: 30 }, origin: null })).status, 403);
});

test('logout ends the session', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/auth/logout', { cookie });
	assert.equal((await call(t, 'GET', '/me', { cookie })).status, 401);
});

// --- Upload -> suggestions --------------------------------------------------

test('uploading a text file saves suggestions, each with its exact source sentence', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const r = await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	assert.equal(r.status, 200);
	assert.equal(r.data.duplicate, false);
	assert.ok(r.data.findingCount >= 3);
	const doc = await call(t, 'GET', `/documents/${r.data.document.id}`, { cookie });
	assert.equal(doc.data.text, LETTER);
	for (const f of doc.data.findings) {
		assert.equal(doc.data.text.slice(f.evidence.start, f.evidence.end), f.evidence.quote);
		assert.equal(f.status, 'needs_review');
	}
});

test('an ambiguous date is stored as unclear, with both readings and no chosen date', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const r = await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const { findings } = (await call(t, 'GET', `/documents/${r.data.document.id}`, { cookie })).data;
	const f = findings.find((x: any) => x.dateRaw === '03/02/2027');
	assert.equal(f.dateSource, 'unclear');
	assert.equal(f.dateIso, null);
	assert.deepEqual([...f.dateCandidates].sort(), ['2027-02-03', '2027-03-02']);
});

test('the same document uploaded twice is not added twice', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const a = await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const b = await call(t, 'POST', '/documents', { cookie, form: upload('copy.txt', LETTER.toUpperCase().replace(/\n/g, '\n\n')) });
	assert.equal(b.data.duplicate, true);
	assert.equal(b.data.document.id, a.data.document.id);
	assert.equal((await call(t, 'GET', '/documents', { cookie })).data.documents.length, 1);
});

test('a document with nothing in it is kept and says so, not "nothing to do"', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const r = await call(t, 'POST', '/documents', { cookie, form: upload('note.txt', 'Thanks for a lovely weekend.') });
	assert.equal(r.data.document.textState, 'nothing_found');
	assert.equal(r.data.findingCount, 0);
});

test('files are checked by content: wrong types, fake PDFs, empty and oversize are refused', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const up = (f: FormData) => call(t, 'POST', '/documents', { cookie, form: f });
	assert.equal((await up(upload('x.exe', 'MZ...'))).status, 415);
	assert.equal((await up(upload('x.pdf', 'this is not a pdf'))).status, 415);
	assert.equal((await up(upload('empty.txt', ''))).status, 400);
	assert.equal((await up(upload('big.txt', new Uint8Array(5 * 1024 * 1024 + 1).fill(97)))).status, 413);
	assert.equal((await up(upload('bin.txt', new Uint8Array([104, 105, 0, 1])))).status, 400);
	assert.equal((await up(upload('latin.txt', new Uint8Array([0xe9, 0xe9, 0xe9])))).status, 400, 'not UTF-8');
	assert.equal((await up(upload('broken.pdf', '%PDF-1.4 not really'))).status, 422, 'damaged PDF');
});

test('nothing is saved when an upload is refused', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('x.pdf', '%PDF-1.4 not really') });
	assert.equal(t.files.store.size, 0);
	assert.equal((await call(t, 'GET', '/documents', { cookie })).data.documents.length, 0);
});

// --- One person can never see or change another's data ----------------------

test('a second person sees nothing of the first, and cannot touch it by id', async () => {
	const t = testEnv();
	const ana = await signIn(t, 'ana@example.com');
	const ben = await signIn(t, 'ben@example.com');
	const up = await call(t, 'POST', '/documents', { cookie: ana, form: upload('letter.txt', LETTER) });
	const docId = up.data.document.id;
	const fid = (await call(t, 'GET', '/findings', { cookie: ana })).data.findings[0].id;

	assert.deepEqual((await call(t, 'GET', '/documents', { cookie: ben })).data.documents, []);
	assert.deepEqual((await call(t, 'GET', '/findings', { cookie: ben })).data.findings, []);
	assert.equal((await call(t, 'GET', `/documents/${docId}`, { cookie: ben })).status, 404);
	assert.equal((await call(t, 'DELETE', `/documents/${docId}`, { cookie: ben })).status, 404);
	assert.equal((await call(t, 'PATCH', `/findings/${fid}`, { cookie: ben, body: { status: 'completed' } })).status, 404);
	assert.equal((await call(t, 'POST', `/findings/${fid}/drafts`, { cookie: ben })).status, 404);
	assert.equal((await call(t, 'GET', `/findings/${fid}/drafts`, { cookie: ben })).status, 404);
	// and Ana's data is unchanged
	assert.equal((await call(t, 'GET', `/documents/${docId}`, { cookie: ana })).status, 200);
});

test("Ben's export holds none of Ana's data", async () => {
	const t = testEnv();
	const ana = await signIn(t, 'ana@example.com');
	const ben = await signIn(t, 'ben@example.com');
	await call(t, 'POST', '/documents', { cookie: ana, form: upload('letter.txt', LETTER) });
	const exp = await call(t, 'GET', '/export', { cookie: ben });
	assert.equal(exp.data.documents.length, 0);
	assert.ok(!exp.text.includes('insurance'));
});

// --- Review: approve, correct, draft ----------------------------------------

test('the person can approve, complete and dismiss; unknown states are refused', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const f = (await call(t, 'GET', '/findings', { cookie })).data.findings[0];
	for (const s of ['in_progress', 'completed', 'dismissed', 'unable_to_verify']) {
		assert.equal((await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { status: s } })).data.finding.status, s);
	}
	assert.equal((await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { status: 'sent' } })).status, 400);
});

test("the person's own date is kept apart from the document's and is marked as theirs", async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const f = (await call(t, 'GET', '/findings', { cookie })).data.findings.find((x: any) => x.dateRaw === '03/02/2027');
	assert.equal((await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { dateIso: '2027-02-31' } })).status, 400, 'not a real date');
	assert.equal((await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { dateIso: 'tomorrow' } })).status, 400);
	const ok = (await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { dateIso: '2027-02-03' } })).data.finding;
	assert.equal(ok.dateIso, '2027-02-03');
	assert.equal(ok.dateSource, 'you');
	assert.equal(ok.dateRaw, '03/02/2027', 'what the document said is preserved');
	const cleared = (await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { dateIso: null } })).data.finding;
	assert.equal(cleared.dateSource, 'unclear');
});

test('a draft is saved as a draft that was not sent, and lifts a waiting suggestion to ready for approval', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const f = (await call(t, 'GET', '/findings', { cookie })).data.findings[0];
	const r = await call(t, 'POST', `/findings/${f.id}/drafts`, { cookie });
	assert.equal(r.data.draft.status, 'draft');
	assert.equal(r.data.draft.sent, false);
	assert.match(r.data.draft.body, /\[Your name\]/);
	assert.equal(r.data.finding.status, 'ready_for_approval');
	assert.equal((await call(t, 'GET', `/findings/${f.id}/drafts`, { cookie })).data.drafts.length, 1);
	// a decision the person already made is not undone by drafting
	await call(t, 'PATCH', `/findings/${f.id}`, { cookie, body: { status: 'completed' } });
	assert.equal((await call(t, 'POST', `/findings/${f.id}/drafts`, { cookie })).data.finding.status, 'completed');
});

// --- Privacy controls -------------------------------------------------------

test('deleting one document removes its files, suggestions and drafts', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const up = await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const f = (await call(t, 'GET', '/findings', { cookie })).data.findings[0];
	await call(t, 'POST', `/findings/${f.id}/drafts`, { cookie });
	assert.equal((await call(t, 'DELETE', `/documents/${up.data.document.id}`, { cookie })).status, 200);
	assert.equal(t.files.store.size, 0);
	assert.equal((await t.env.DB.prepare('SELECT COUNT(*) AS n FROM findings').first<{ n: number }>())!.n, 0);
	assert.equal((await t.env.DB.prepare('SELECT COUNT(*) AS n FROM drafts').first<{ n: number }>())!.n, 0);
});

test('export returns everything held, including the text', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	const exp = await call(t, 'GET', '/export', { cookie });
	assert.equal(exp.res.headers.get('content-disposition'), 'attachment; filename="vnta-export.json"');
	assert.equal(exp.data.documents[0].text, LETTER);
	assert.ok(exp.data.findings.length >= 3);
});

test('deleting the account needs the phrase, then removes every file and row, and ends the session', async () => {
	const t = testEnv();
	const ana = await signIn(t, 'ana@example.com');
	const ben = await signIn(t, 'ben@example.com');
	await call(t, 'POST', '/documents', { cookie: ana, form: upload('letter.txt', LETTER) });
	await call(t, 'POST', '/documents', { cookie: ben, form: upload('other.txt', 'Please pay €10 by 1 June 2027.') });
	assert.equal((await call(t, 'DELETE', '/account', { cookie: ana, body: {} })).status, 400);
	assert.equal((await call(t, 'DELETE', '/account', { cookie: ana, body: { confirm: 'delete my account' } })).status, 200);
	assert.equal((await call(t, 'GET', '/me', { cookie: ana })).status, 401);
	const users = (await t.env.DB.prepare('SELECT id, email FROM users').all<{ id: string; email: string }>()).results;
	assert.deepEqual(users.map((u) => u.email), ['ben@example.com'], "only Ben's account remains");
	const benId = users[0].id;
	const keys = [...t.files.store.keys()];
	assert.equal(keys.length, 2, "Ben's original and text only");
	assert.ok(keys.every((k) => k.startsWith(`u/${benId}/`)), "every remaining file is Ben's");
	assert.equal((await call(t, 'GET', '/documents', { cookie: ben })).data.documents.length, 1, "Ben's document is untouched");
	assert.equal((await t.env.DB.prepare("SELECT COUNT(*) AS n FROM sessions").first<{ n: number }>())!.n, 1, "Ana's session is gone");
});

test('retention: documents older than the chosen period are deleted, newer ones stay', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('old.txt', LETTER) });
	await call(t, 'POST', '/documents', { cookie, form: upload('new.txt', 'Pay €5 by 2 June 2027.') });
	await t.env.DB.prepare("UPDATE documents SET created_at = created_at - 100*86400 WHERE name = 'old.txt'").run();
	assert.equal((await call(t, 'PATCH', '/settings', { cookie, body: { retentionDays: 7 } })).status, 400, 'only listed periods');
	assert.equal((await call(t, 'PATCH', '/settings', { cookie, body: { retentionDays: 90 } })).data.retentionDays, 90);
	const me = await call(t, 'GET', '/me', { cookie });
	assert.equal(me.data.purged, 1);
	assert.deepEqual((await call(t, 'GET', '/documents', { cookie })).data.documents.map((d: any) => d.name), ['new.txt']);
});

test('retention of 0 keeps documents until the person deletes them', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('old.txt', LETTER) });
	await t.env.DB.prepare('UPDATE documents SET created_at = 1').run();
	await call(t, 'PATCH', '/settings', { cookie, body: { retentionDays: 0 } });
	assert.equal((await call(t, 'GET', '/me', { cookie })).data.purged, 0);
	assert.equal((await call(t, 'GET', '/documents', { cookie })).data.documents.length, 1);
});

// --- Logs -------------------------------------------------------------------

test('a server error returns a plain message and never echoes document text', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	await call(t, 'POST', '/documents', { cookie, form: upload('letter.txt', LETTER) });
	(t.env.DB as any).prepare = () => { throw new Error('boom: insurance €412.80'); };
	const origErr = console.error;
	const logged: string[] = [];
	console.error = (...a: unknown[]) => void logged.push(a.join(' '));
	const r = await call(t, 'GET', '/documents', { cookie });
	console.error = origErr;
	assert.equal(r.status, 500);
	assert.ok(!r.text.includes('insurance'));
	assert.ok(!logged.join('').includes('insurance'));
});

// --- PDF --------------------------------------------------------------------

/** A tiny but valid one-page PDF. With no text, it has a page and nothing readable, like a scan. */
function makePdf(lines: string[]): Uint8Array {
	const esc = (s: string) => s.replace(/[\\()]/g, '\\$&');
	const stream = lines.length ? `BT /F1 12 Tf 50 750 Td 16 TL ${lines.map((l) => `(${esc(l)}) Tj T*`).join(' ')} ET` : '0.9 g 50 50 100 100 re f';
	const objs = [
		'<< /Type /Catalog /Pages 2 0 R >>',
		'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
		'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
		`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
		'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
	];
	let out = '%PDF-1.4\n';
	const offsets: number[] = [];
	objs.forEach((o, i) => {
		offsets.push(out.length);
		out += `${i + 1} 0 obj\n${o}\nendobj\n`;
	});
	const xref = out.length;
	out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('')}`;
	out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
	return new TextEncoder().encode(out);
}

test('a PDF with a text layer is read and gives suggestions with their sources', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const pdf = makePdf(['Dear Ms Example,', 'Your policy renews on 14 February 2027.', 'Please confirm by 31 January 2027.']);
	const r = await call(t, 'POST', '/documents', { cookie, form: upload('policy.pdf', pdf, 'application/pdf') });
	assert.equal(r.status, 200, r.text);
	assert.equal(r.data.document.kind, 'pdf');
	assert.ok(r.data.findingCount >= 2);
	const doc = (await call(t, 'GET', `/documents/${r.data.document.id}`, { cookie })).data;
	for (const f of doc.findings) assert.equal(doc.text.slice(f.evidence.start, f.evidence.end), f.evidence.quote);
	assert.ok(doc.findings.some((f: any) => f.dateIso === '2027-02-14'));
});

test('a PDF with no text layer is kept and reported as unreadable, with no made-up suggestions', async () => {
	const t = testEnv();
	const cookie = await signIn(t, 'a@example.com');
	const r = await call(t, 'POST', '/documents', { cookie, form: upload('scan.pdf', makePdf([]), 'application/pdf') });
	assert.equal(r.status, 200, r.text);
	assert.equal(r.data.document.textState, 'no_text');
	assert.equal(r.data.findingCount, 0);
});
