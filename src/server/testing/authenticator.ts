// A pretend phone for tests: makes real WebAuthn messages (a P-256 key, CBOR, signatures)
// so the server's checks run against the same bytes a real device sends.
import { b64urlEncode } from '../passkeys.ts';

const enc = new TextEncoder();
const sha = async (b: Uint8Array) => new Uint8Array(await crypto.subtle.digest('SHA-256', b as BufferSource));
const concat = (...p: Uint8Array[]) => {
	const out = new Uint8Array(p.reduce((n, x) => n + x.length, 0));
	let o = 0;
	for (const x of p) (out.set(x, o), (o += x.length));
	return out;
};

// Minimal CBOR: unsigned/negative ints, byte strings, text strings, maps.
function head(major: number, n: number): Uint8Array {
	if (n < 24) return Uint8Array.of((major << 5) | n);
	if (n < 256) return Uint8Array.of((major << 5) | 24, n);
	return Uint8Array.of((major << 5) | 25, n >> 8, n & 255);
}
function cbor(v: unknown): Uint8Array {
	if (typeof v === 'number') return v >= 0 ? head(0, v) : head(1, -1 - v);
	if (typeof v === 'string') return concat(head(3, enc.encode(v).length), enc.encode(v));
	if (v instanceof Uint8Array) return concat(head(2, v.length), v);
	if (v instanceof Map) return concat(head(5, v.size), ...[...v].flatMap(([k, x]) => [cbor(k), cbor(x)]));
	throw new Error('unsupported cbor');
}

/** WebCrypto signs as r||s; WebAuthn wants a DER sequence. */
function toDer(raw: Uint8Array): Uint8Array {
	const int = (b: Uint8Array) => {
		let i = 0;
		while (i < b.length - 1 && b[i] === 0) i++;
		let x = b.slice(i);
		if (x[0] & 0x80) x = concat(Uint8Array.of(0), x);
		return concat(Uint8Array.of(0x02, x.length), x);
	};
	const body = concat(int(raw.slice(0, 32)), int(raw.slice(32)));
	return concat(Uint8Array.of(0x30, body.length), body);
}

export interface Options {
	userVerified?: boolean;
	origin?: string;
	rpId?: string;
	counter?: number;
}

export class FakePhone {
	credentialId = crypto.getRandomValues(new Uint8Array(32));
	keys!: CryptoKeyPair;
	counter = 0;
	userHandle: Uint8Array | null = null;
	private ready: Promise<void>;
	constructor() {
		this.ready = crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']).then((k) => void (this.keys = k));
	}
	get id() {
		return b64urlEncode(this.credentialId);
	}
	private flags(uv: boolean, attested: boolean) {
		return 0x01 | (uv ? 0x04 : 0) | (attested ? 0x40 : 0);
	}
	private counterBytes(n: number) {
		return Uint8Array.of(n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255);
	}

	async create(opts: { challenge: string; user: { id: string } }, o: Options = {}) {
		await this.ready;
		this.userHandle = Uint8Array.from(atob(opts.user.id.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (opts.user.id.length % 4)) % 4)), (c) => c.charCodeAt(0));
		const raw = new Uint8Array(await crypto.subtle.exportKey('raw', this.keys.publicKey));
		const cose = cbor(new Map<number, unknown>([[1, 2], [3, -7], [-1, 1], [-2, raw.slice(1, 33)], [-3, raw.slice(33, 65)]]));
		const rpHash = await sha(enc.encode(o.rpId ?? 'vnta.test'));
		const authData = concat(
			rpHash,
			Uint8Array.of(this.flags(o.userVerified ?? true, true)),
			this.counterBytes(0),
			new Uint8Array(16),
			Uint8Array.of(this.credentialId.length >> 8, this.credentialId.length & 255),
			this.credentialId,
			cose
		);
		const clientData = enc.encode(JSON.stringify({ type: 'webauthn.create', challenge: opts.challenge, origin: o.origin ?? 'https://vnta.test', crossOrigin: false }));
		return {
			id: this.id,
			rawId: this.id,
			type: 'public-key',
			response: {
				clientDataJSON: b64urlEncode(clientData),
				attestationObject: b64urlEncode(cbor(new Map<string, unknown>([['fmt', 'none'], ['attStmt', new Map()], ['authData', authData]]))),
				transports: ['internal']
			},
			clientExtensionResults: {}
		};
	}

	async get(opts: { challenge: string }, o: Options = {}) {
		await this.ready;
		this.counter = o.counter ?? this.counter + 1;
		const rpHash = await sha(enc.encode(o.rpId ?? 'vnta.test'));
		const authData = concat(rpHash, Uint8Array.of(this.flags(o.userVerified ?? true, false)), this.counterBytes(this.counter));
		const clientData = enc.encode(JSON.stringify({ type: 'webauthn.get', challenge: opts.challenge, origin: o.origin ?? 'https://vnta.test', crossOrigin: false }));
		const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, this.keys.privateKey, concat(authData, await sha(clientData)) as BufferSource));
		return {
			id: this.id,
			rawId: this.id,
			type: 'public-key',
			response: {
				clientDataJSON: b64urlEncode(clientData),
				authenticatorData: b64urlEncode(authData),
				signature: b64urlEncode(toDer(sig)),
				userHandle: this.userHandle ? b64urlEncode(this.userHandle) : undefined
			},
			clientExtensionResults: {}
		};
	}
}
