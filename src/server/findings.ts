// Suggested actions, as the person sees and changes them.
// A person moves a finding between states. VNTA only ever creates them as
// "needs_review", and moves one to "ready_for_approval" when a draft is made.
import type { Env } from './types.ts';
import { ApiError } from './types.ts';
import { randomToken } from './crypto.ts';
import { now } from './auth.ts';
import { draftReply, type Finding as Extracted } from '../lib/extract/extract.ts';

export const STATUSES = ['needs_review', 'ready_for_approval', 'in_progress', 'completed', 'unable_to_verify', 'dismissed'] as const;
export type Status = (typeof STATUSES)[number];

export interface FindingOut {
	id: string;
	documentId: string;
	documentName: string;
	kind: string;
	title: string;
	status: Status;
	confidence: 'high' | 'medium' | 'low';
	notes: string[];
	/** The date to show: the person's own if they set one, else the document's if it reads one way. */
	dateIso: string | null;
	/** 'you' = confirmed by the person; 'document' = read from the text; 'unclear' = could be several; 'none' = no date. */
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

const SELECT = `SELECT f.*, d.name AS document_name FROM findings f JOIN documents d ON d.id = f.document_id AND d.user_id = f.user_id`;

function toOut(r: any): FindingOut {
	const candidates: string[] = JSON.parse(r.date_candidates || '[]');
	const dateSource = r.user_date_iso ? 'you' : r.date_iso ? 'document' : r.date_ambiguous ? 'unclear' : 'none';
	return {
		id: r.id,
		documentId: r.document_id,
		documentName: r.document_name,
		kind: r.kind,
		title: r.title,
		status: r.status,
		confidence: r.confidence,
		notes: JSON.parse(r.notes || '[]'),
		dateIso: r.user_date_iso ?? r.date_iso ?? null,
		dateSource,
		dateRaw: r.date_raw,
		dateCandidates: candidates,
		relative: r.relative,
		time: r.time,
		amount: r.amount_raw ? { raw: r.amount_raw, value: r.amount_value, currency: r.amount_currency } : null,
		evidence: { quote: r.quote, start: r.q_start, end: r.q_end, line: r.line },
		createdAt: r.created_at,
		updatedAt: r.updated_at
	};
}

export async function listFindings(env: Env, userId: string, documentId?: string): Promise<FindingOut[]> {
	const q = documentId
		? env.DB.prepare(`${SELECT} WHERE f.user_id = ? AND f.document_id = ? ORDER BY f.q_start`).bind(userId, documentId)
		: env.DB.prepare(`${SELECT} WHERE f.user_id = ? ORDER BY f.created_at DESC, f.q_start`).bind(userId);
	return (await q.all()).results.map(toOut);
}

async function one(env: Env, userId: string, id: string): Promise<FindingOut> {
	const row = await env.DB.prepare(`${SELECT} WHERE f.id = ? AND f.user_id = ?`).bind(id, userId).first();
	if (!row) throw new ApiError(404, 'Not found.');
	return toOut(row);
}

/** True only for a real calendar date written YYYY-MM-DD. */
export function isRealIsoDate(s: unknown): s is string {
	if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
	const [y, m, d] = s.split('-').map(Number);
	const t = new Date(Date.UTC(y, m - 1, d));
	return y >= 1900 && y <= 2200 && t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export async function updateFinding(
	env: Env,
	userId: string,
	id: string,
	patch: { status?: unknown; dateIso?: unknown }
): Promise<FindingOut> {
	await one(env, userId, id);
	const sets: string[] = [];
	const vals: unknown[] = [];
	if (patch.status !== undefined) {
		if (!STATUSES.includes(patch.status as Status)) throw new ApiError(400, 'Unknown status.');
		sets.push('status = ?');
		vals.push(patch.status);
	}
	if (patch.dateIso !== undefined) {
		// null clears the person's date; otherwise it must be a real date.
		if (patch.dateIso !== null && !isRealIsoDate(patch.dateIso)) throw new ApiError(400, 'That is not a real date.');
		sets.push('user_date_iso = ?');
		vals.push(patch.dateIso);
	}
	if (!sets.length) throw new ApiError(400, 'Nothing to change.');
	await env.DB.prepare(`UPDATE findings SET ${sets.join(', ')}, updated_at = ? WHERE id = ? AND user_id = ?`)
		.bind(...vals, now(), id, userId)
		.run();
	return one(env, userId, id);
}

export interface DraftOut {
	id: string;
	findingId: string;
	body: string;
	status: 'draft';
	sent: false;
	createdAt: number;
}
const toDraft = (r: any): DraftOut => ({ id: r.id, findingId: r.finding_id, body: r.body, status: 'draft', sent: false, createdAt: r.created_at });

export async function createDraft(env: Env, userId: string, findingId: string): Promise<{ finding: FindingOut; draft: DraftOut }> {
	const f = await one(env, userId, findingId);
	// Rebuild the shape the drafter expects from what is stored.
	const asExtracted = {
		kind: f.kind,
		date: f.dateIso ? { raw: f.dateRaw ?? f.dateIso, iso: f.dateIso, ambiguous: false, candidates: [f.dateIso], start: 0, end: 0 } : null,
		amount: f.amount
	} as unknown as Extracted;
	const body = draftReply(asExtracted).body;
	const id = randomToken(12);
	const t = now();
	await env.DB.prepare('INSERT INTO drafts (id,user_id,finding_id,body,created_at) VALUES (?,?,?,?,?)').bind(id, userId, findingId, body, t).run();
	// Only lift a finding that is still waiting; never undo something the person already decided.
	if (f.status === 'needs_review') {
		await env.DB.prepare("UPDATE findings SET status = 'ready_for_approval', updated_at = ? WHERE id = ? AND user_id = ?").bind(t, findingId, userId).run();
	}
	const draft = toDraft(await env.DB.prepare('SELECT * FROM drafts WHERE id = ? AND user_id = ?').bind(id, userId).first());
	return { finding: await one(env, userId, findingId), draft };
}

export async function listDrafts(env: Env, userId: string, findingId: string): Promise<DraftOut[]> {
	await one(env, userId, findingId);
	const { results } = await env.DB.prepare('SELECT * FROM drafts WHERE user_id = ? AND finding_id = ? ORDER BY created_at DESC').bind(userId, findingId).all();
	return results.map(toDraft);
}
