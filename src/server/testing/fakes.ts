// Test stand-ins for Cloudflare D1 and R2. D1 is SQLite, so the fake runs the
// real migration on a real SQLite database (node:sqlite). R2 is a Map.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import type { D1Like, D1Statement, Env, Mailer, R2Like } from '../types';

export function fakeD1(): D1Like {
	const db = new DatabaseSync(':memory:');
	db.exec('PRAGMA foreign_keys = ON');
	db.exec(readFileSync(new URL('../../../migrations/0001_app.sql', import.meta.url), 'utf8'));
	const stmt = (sql: string, values: unknown[] = []): D1Statement => ({
		bind: (...v) => stmt(sql, v),
		run: async () => db.prepare(sql).run(...(values as any[])),
		first: async () => ((db.prepare(sql).get(...(values as any[])) as any) ?? null),
		all: async () => ({ results: db.prepare(sql).all(...(values as any[])) as any[] })
	});
	return {
		prepare: (sql) => stmt(sql),
		batch: async (list) => {
			db.exec('BEGIN');
			try {
				const out = [];
				for (const s of list) out.push(await s.run());
				db.exec('COMMIT');
				return out;
			} catch (e) {
				db.exec('ROLLBACK');
				throw e;
			}
		}
	};
}

export function fakeR2(): R2Like & { store: Map<string, Uint8Array> } {
	const store = new Map<string, Uint8Array>();
	const bytes = (v: string | ArrayBuffer | Uint8Array) =>
		typeof v === 'string' ? new TextEncoder().encode(v) : v instanceof Uint8Array ? v : new Uint8Array(v);
	return {
		store,
		put: async (k, v) => void store.set(k, bytes(v)),
		get: async (k) => {
			const b = store.get(k);
			return b ? { text: async () => new TextDecoder().decode(b), arrayBuffer: async () => b.buffer as ArrayBuffer } : null;
		},
		delete: async (keys) => void [keys].flat().forEach((k) => store.delete(k)),
		list: async ({ prefix }) => ({ objects: [...store.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })), truncated: false })
	};
}

export function testEnv() {
	const sent: { to: string; code: string }[] = [];
	const mailer: Mailer = { sendCode: async (to, code) => void sent.push({ to, code }) };
	const env: Env = { DB: fakeD1(), FILES: fakeR2() };
	return { env, mailer, sent, files: env.FILES as ReturnType<typeof fakeR2> };
}
