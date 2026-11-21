// Small helpers on the Web Crypto API, available in Workers, browsers and Node.

export async function sha256Hex(input: string | Uint8Array): Promise<string> {
	const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
	const d = await crypto.subtle.digest('SHA-256', bytes as BufferSource);
	return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** A long random string for session tokens and ids. */
export function randomToken(bytes = 32): string {
	const a = crypto.getRandomValues(new Uint8Array(bytes));
	return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** A six-digit sign-in code with no modulo bias. */
export function randomCode(): string {
	const limit = Math.floor(0x100000000 / 1_000_000) * 1_000_000;
	const buf = new Uint32Array(1);
	do crypto.getRandomValues(buf);
	while (buf[0] >= limit);
	return String(buf[0] % 1_000_000).padStart(6, '0');
}

/** Compare two strings without stopping at the first difference. */
export function safeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}
