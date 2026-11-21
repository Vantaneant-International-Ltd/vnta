// The person's control over their own data: export, delete, retention.
import type { Env } from './types.ts';
import { ApiError } from './types.ts';
import { listDocuments, textKey, originalKey } from './documents.ts';
import { listFindings } from './findings.ts';
import { now } from './auth.ts';

export async function setRetention(env: Env, userId: string, days: unknown): Promise<number> {
	const allowed = [0, 30, 90, 180, 365];
	const n = Number(days);
	if (!allowed.includes(n)) throw new ApiError(400, 'Choose 30, 90, 180 or 365 days, or keep until you delete.');
	await env.DB.prepare('UPDATE users SET retention_days = ? WHERE id = ?').bind(n, userId).run();
	return n;
}

/** Deletes this person's documents older than their retention period. Run lazily on sign-in checks. */
export async function purgeExpired(env: Env, userId: string, retentionDays: number): Promise<number> {
	if (!retentionDays) return 0;
	const cutoff = now() - retentionDays * 86400;
	const { results } = await env.DB.prepare('SELECT id FROM documents WHERE user_id = ? AND created_at < ?').bind(userId, cutoff).all<{ id: string }>();
	for (const { id } of results) {
		await env.FILES.delete([originalKey(userId, id), textKey(userId, id)]);
		await env.DB.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').bind(id, userId).run();
	}
	return results.length;
}

/** Everything VNTA holds about this person, as one JSON file. */
export async function exportAll(env: Env, userId: string, email: string) {
	const docs = await listDocuments(env, userId);
	const documents = [];
	for (const d of docs) {
		const obj = await env.FILES.get(textKey(userId, d.id));
		documents.push({ ...d, text: obj ? await obj.text() : null });
	}
	const findings = await listFindings(env, userId);
	const { results: drafts } = await env.DB.prepare('SELECT id, finding_id, body, created_at FROM drafts WHERE user_id = ?').bind(userId).all();
	const user = await env.DB.prepare('SELECT retention_days, ai_consent_at, created_at FROM users WHERE id = ?').bind(userId).first();
	return {
		exportedAt: new Date().toISOString(),
		note: 'Everything VNTA holds about you. Original uploaded files are not included here; the text read from them is.',
		account: { email, ...user },
		documents,
		findings,
		drafts
	};
}

/** Permanent. Removes every stored file and every row, then the account itself. */
export async function deleteAccount(env: Env, userId: string): Promise<void> {
	let cursor: string | undefined;
	do {
		const page = await env.FILES.list({ prefix: `u/${userId}/`, cursor });
		if (page.objects.length) await env.FILES.delete(page.objects.map((o) => o.key));
		cursor = page.truncated ? page.cursor : undefined;
	} while (cursor);
	// Sessions, documents, findings and drafts go with the user row (ON DELETE CASCADE).
	await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
}
