// The smallest slice of Cloudflare's D1 and R2 that VNTA uses. Declared here so
// the server code needs no extra type package, and so tests can supply fakes.

export interface D1Statement {
	bind(...values: unknown[]): D1Statement;
	run(): Promise<unknown>;
	first<T = Record<string, unknown>>(): Promise<T | null>;
	all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}
export interface D1Like {
	prepare(sql: string): D1Statement;
	batch(statements: D1Statement[]): Promise<unknown[]>;
}
export interface R2ObjectBodyLike {
	text(): Promise<string>;
	arrayBuffer(): Promise<ArrayBuffer>;
}
export interface R2Like {
	put(key: string, value: string | ArrayBuffer | Uint8Array, options?: unknown): Promise<unknown>;
	get(key: string): Promise<R2ObjectBodyLike | null>;
	delete(keys: string | string[]): Promise<void>;
	list(options: { prefix: string; cursor?: string }): Promise<{ objects: { key: string }[]; truncated: boolean; cursor?: string }>;
}

export interface Env {
	DB: D1Like;
	FILES: R2Like;
	/** Sends sign-in codes. Without it, sign-in is refused (never silently skipped). */
	RESEND_API_KEY?: string;
	LOGIN_FROM?: string;
	/** Local development only: print sign-in codes to the terminal. Never set in production. */
	DEV_LOG_LOGIN_CODES?: string;
}

export interface Mailer {
	sendCode(to: string, code: string): Promise<void>;
}

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}
