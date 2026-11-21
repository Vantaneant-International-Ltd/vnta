// Document in, suggested actions out. Everything here is scoped to one user.
//
// Order of work for an upload:
//   validate -> read text -> fingerprint -> already there? -> store original and
//   text in R2 -> extract -> verify every finding against the text -> save.
// Findings that fail verification are dropped and counted, never saved.
import type { Env } from './types.ts';
import { ApiError } from './types.ts';
import { cleanName, readText, validateUpload } from './files.ts';
import { extract, verifyEvidence, dedupeFindings, documentFingerprint, type Finding } from '../lib/extract/extract.ts';
import { randomToken } from './crypto.ts';
import { now } from './auth.ts';

const prefix = (userId: string) => `u/${userId}/`;
export const textKey = (userId: string, docId: string) => `${prefix(userId)}${docId}.txt`;
export const originalKey = (userId: string, docId: string) => `${prefix(userId)}${docId}.orig`;

export interface DocumentRow {
	id: string;
	name: string;
	kind: 'pdf' | 'text';
	size: number;
	textState: 'ok' | 'no_text' | 'nothing_found';
	charCount: number;
	createdAt: number;
}

const toDoc = (r: any): DocumentRow => ({
	id: r.id,
	name: r.name,
	kind: r.kind,
	size: r.size,
	textState: r.text_state,
	charCount: r.char_count,
	createdAt: r.created_at
});

export type AddResult =
	| { duplicate: true; document: DocumentRow }
	| { duplicate: false; document: DocumentRow; findingCount: number; rejectedCount: number };

export async function addDocument(env: Env, userId: string, fileName: string, bytes: Uint8Array): Promise<AddResult> {
	const name = cleanName(fileName);
	const kind = validateUpload(name, bytes);
	const text = await readText(kind, bytes);
	const fingerprint = await documentFingerprint(text);

	const existing = await env.DB.prepare('SELECT * FROM documents WHERE user_id = ? AND fingerprint = ?')
		.bind(userId, fingerprint)
		.first();
	if (existing) return { duplicate: true, document: toDoc(existing) };

	const id = randomToken(12);
	const result = extract(text);
	const { kept, rejected } = verifyEvidence(text, dedupeFindings(result.findings));
	const t = now();

	await env.FILES.put(originalKey(userId, id), bytes);
	await env.FILES.put(textKey(userId, id), text);

	const stmts = [
		env.DB.prepare(
			'INSERT INTO documents (id,user_id,name,kind,size,fingerprint,text_state,char_count,created_at) VALUES (?,?,?,?,?,?,?,?,?)'
		).bind(id, userId, name, kind, bytes.byteLength, fingerprint, result.state, text.length, t),
		...kept.map((f) => insertFinding(env, userId, id, f, t))
	];
	try {
		await env.DB.batch(stmts);
	} catch (e) {
		await env.FILES.delete([originalKey(userId, id), textKey(userId, id)]);
		throw e;
	}
	const row = await env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(id, userId).first();
	return { duplicate: false, document: toDoc(row), findingCount: kept.length, rejectedCount: rejected.length };
}

function insertFinding(env: Env, userId: string, docId: string, f: Finding, t: number) {
	return env.DB.prepare(
		`INSERT INTO findings (id,user_id,document_id,kind,title,date_raw,date_iso,date_ambiguous,date_candidates,relative,time,
			amount_raw,amount_value,amount_currency,confidence,notes,quote,q_start,q_end,line,status,created_at,updated_at)
		 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'needs_review',?,?)`
	).bind(
		randomToken(12), userId, docId, f.kind, f.title,
		f.date?.raw ?? null, f.date?.iso ?? null, f.date?.ambiguous ? 1 : 0, JSON.stringify(f.date?.candidates ?? []),
		f.relative, f.time, f.amount?.raw ?? null, f.amount?.value ?? null, f.amount?.currency ?? null,
		f.confidence, JSON.stringify(f.notes), f.evidence.quote, f.evidence.start, f.evidence.end, f.evidence.line, t, t
	);
}

export async function listDocuments(env: Env, userId: string): Promise<DocumentRow[]> {
	const { results } = await env.DB.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').bind(userId).all();
	return results.map(toDoc);
}

export async function getDocument(env: Env, userId: string, id: string) {
	const row = await env.DB.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').bind(id, userId).first();
	if (!row) throw new ApiError(404, 'Not found.');
	const obj = await env.FILES.get(textKey(userId, id));
	return { document: toDoc(row), text: obj ? await obj.text() : '' };
}

export async function deleteDocument(env: Env, userId: string, id: string): Promise<void> {
	const row = await env.DB.prepare('SELECT id FROM documents WHERE id = ? AND user_id = ?').bind(id, userId).first();
	if (!row) throw new ApiError(404, 'Not found.');
	await env.FILES.delete([originalKey(userId, id), textKey(userId, id)]);
	await env.DB.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').bind(id, userId).run(); // findings and drafts cascade
}
