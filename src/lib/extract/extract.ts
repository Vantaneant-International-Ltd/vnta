// =============================================================================
// VNTA extractor v0: fixed rules, no AI model, no network.
// -----------------------------------------------------------------------------
// Reads plain text and proposes things that may need attention: deadlines,
// payments, renewals, replies asked for, appointments.
//
// Rules this file keeps, and the tests check:
// - A finding is only ever a SUGGESTION. Nothing here is verified. A person
//   approves or dismisses it elsewhere.
// - Every finding carries the exact words it came from and where they sit in
//   the document. `verifyEvidence` re-checks that, so a finding that invents
//   a source (from this code or from any model added later) is thrown away.
// - A date is only filled in when it can be read one way. "03/04/2027" could
//   be 3 April or 4 March, so the date stays empty and both readings are kept.
// - Impossible dates (31 February) and two-digit years are never guessed.
// - It never sends, pays or submits anything.
// =============================================================================

export type Kind = 'deadline' | 'payment' | 'renewal' | 'response' | 'appointment';
export type Confidence = 'high' | 'medium' | 'low';

export interface DateRef {
	raw: string;
	/** Position of `raw` in the document text. */
	start: number;
	end: number;
	/** YYYY-MM-DD, only when the text can be read one way. */
	iso: string | null;
	/** True when two readings are possible (03/04/2027). `iso` stays null. */
	ambiguous: boolean;
	/** Every reading that is a real date, as YYYY-MM-DD. */
	candidates: string[];
}

export interface Amount {
	raw: string;
	value: number;
	currency: 'EUR' | 'GBP' | 'USD';
}

export interface Evidence {
	/** The exact sentence from the document. */
	quote: string;
	start: number;
	end: number;
	/** 1-based line number of the start. */
	line: number;
}

export interface Finding {
	id: string;
	kind: Kind;
	title: string;
	date: DateRef | null;
	/** Set when the text says "within 14 days" and so on. There is no date to give. */
	relative: string | null;
	time: string | null;
	amount: Amount | null;
	confidence: Confidence;
	/** Plain-language reasons the person should look twice. */
	notes: string[];
	evidence: Evidence;
	/** Always 'suggested' here. Only a person moves it on. */
	status: 'suggested';
}

export type ExtractionState = 'ok' | 'no_text' | 'nothing_found';

export interface Extraction {
	state: ExtractionState;
	findings: Finding[];
}

// --- Dates -------------------------------------------------------------------

const MONTHS: Record<string, number> = {
	january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4, may: 5,
	june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8, september: 9, sept: 9, sep: 9,
	october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12
};
const MONTH_RE = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join('|');

const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD if it is a real calendar date, otherwise null. */
function realDate(y: number, m: number, d: number): string | null {
	if (y < 1900 || y > 2200 || m < 1 || m > 12 || d < 1 || d > 31) return null;
	const t = new Date(Date.UTC(y, m - 1, d));
	if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d) return null;
	return `${y}-${pad(m)}-${pad(d)}`;
}

function single(raw: string, start: number, iso: string | null): DateRef {
	return { raw, start, end: start + raw.length, iso, ambiguous: false, candidates: iso ? [iso] : [] };
}

export function findDates(text: string): DateRef[] {
	const out: DateRef[] = [];
	const taken: [number, number][] = [];
	const free = (s: number, e: number) => !taken.some(([a, b]) => s < b && e > a);
	const add = (d: DateRef) => {
		if (free(d.start, d.end)) {
			taken.push([d.start, d.end]);
			out.push(d);
		}
	};

	// 14 February 2027, 14th of Feb 2027
	for (const m of text.matchAll(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?(${MONTH_RE})\\.?,?\\s+(\\d{4})\\b`, 'gi'))) {
		add(single(m[0], m.index!, realDate(+m[3], MONTHS[m[2].toLowerCase()], +m[1])));
	}
	// February 14, 2027
	for (const m of text.matchAll(new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b`, 'gi'))) {
		add(single(m[0], m.index!, realDate(+m[3], MONTHS[m[1].toLowerCase()], +m[2])));
	}
	// 2027-02-14
	for (const m of text.matchAll(/\b(\d{4})-(\d{2})-(\d{2})\b/g)) {
		add(single(m[0], m.index!, realDate(+m[1], +m[2], +m[3])));
	}
	// 14/02/2027, 03.04.2027, 3-4-2027
	for (const m of text.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/g)) {
		const a = +m[1], b = +m[2], y = +m[3];
		const dmy = realDate(y, b, a);
		const mdy = realDate(y, a, b);
		const candidates = [...new Set([dmy, mdy].filter((x): x is string => !!x))];
		const start = m.index!;
		if (candidates.length === 2) {
			add({ raw: m[0], start, end: start + m[0].length, iso: null, ambiguous: true, candidates });
		} else {
			add(single(m[0], start, candidates[0] ?? null));
		}
	}
	// 14/02/27: two-digit years are never guessed.
	for (const m of text.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{2})\b(?![/.-]?\d)/g)) {
		add({ raw: m[0], start: m.index!, end: m.index! + m[0].length, iso: null, ambiguous: true, candidates: [] });
	}
	return out.sort((x, y) => x.start - y.start);
}

// --- Amounts -----------------------------------------------------------------

const CUR: Record<string, Amount['currency']> = { '€': 'EUR', eur: 'EUR', euro: 'EUR', euros: 'EUR', '£': 'GBP', gbp: 'GBP', '$': 'USD', usd: 'USD' };
const NUM = '\\d{1,3}(?:[,. ]\\d{3})*(?:[.,]\\d{2})?|\\d+(?:[.,]\\d{2})?';

/** "1,234.56" and "1.234,56" both mean 1234.56. A lone "12,50" is 12.50. */
export function parseNumber(s: string): number | null {
	const t = s.replace(/\s/g, '');
	const lastSep = Math.max(t.lastIndexOf(','), t.lastIndexOf('.'));
	let n: number;
	if (lastSep >= 0 && t.length - lastSep - 1 === 2) {
		n = parseFloat(t.slice(0, lastSep).replace(/[,.]/g, '') + '.' + t.slice(lastSep + 1));
	} else {
		n = parseFloat(t.replace(/[,.]/g, ''));
	}
	return Number.isFinite(n) ? n : null;
}

export function findAmounts(text: string): (Amount & { start: number })[] {
	const out: (Amount & { start: number })[] = [];
	const push = (raw: string, start: number, cur: string, num: string) => {
		const value = parseNumber(num);
		if (value !== null) out.push({ raw, start, value, currency: CUR[cur.toLowerCase()] });
	};
	for (const m of text.matchAll(new RegExp(`(€|£|\\$|\\b(?:EUR|GBP|USD)\\b)\\s?(${NUM})`, 'gi'))) push(m[0], m.index!, m[1], m[2]);
	for (const m of text.matchAll(new RegExp(`\\b(${NUM})\\s?(€|\\b(?:EUR|euros?)\\b)`, 'gi'))) push(m[0], m.index!, m[2], m[1]);
	return out.sort((a, b) => a.start - b.start);
}

// --- Cues --------------------------------------------------------------------

const CUES: { kind: Kind; strong: RegExp; weak?: RegExp }[] = [
	{ kind: 'renewal', strong: /\b(renew(?:al|s|ed)?|expir(?:es|y|ation|ing)|lapse[sd]?)\b/i },
	{ kind: 'appointment', strong: /\b(appointment|booked for|scheduled for|your (?:visit|consultation|interview))\b/i },
	{ kind: 'payment', strong: /\b(amount due|balance due|total due|payable|please pay|payment (?:is )?due|invoice|outstanding)\b/i, weak: /\b(pay|payment|fee|charge)\b/i },
	{ kind: 'response', strong: /\b(please (?:reply|respond|confirm|contact|return|send|provide|submit)|you (?:must|are required to|need to) (?:reply|respond|confirm|provide|submit|return)|let us know|we require|failure to respond)\b/i },
	{ kind: 'deadline', strong: /\b(deadline|due (?:by|on|date)|no later than|must be (?:received|paid|returned|submitted)|on or before)\b/i, weak: /\b(by|before|until|within)\b/i }
];

const RELATIVE = /\bwithin\s+(\d{1,3})\s+(day|week|month)s?\b(?:\s+of\s+(?:the\s+date\s+of\s+this\s+(?:letter|notice)|receipt|this\s+(?:letter|notice)))?/i;
const SENDER_PROMISE = /\b(we|our team|the company) (will|shall|aim to|expect to|'ll)\b/i;
const ADDRESSED_TO_READER = /\b(you|your|must|required|should|need to|has to|have to)\b/i;
const TIME = /\b([01]?\d|2[0-3])[:.]([0-5]\d)\s?(am|pm)?\b/i;

const TITLES: Record<Kind, string> = {
	deadline: 'Deadline',
	payment: 'Payment mentioned',
	renewal: 'Renewal or expiry',
	response: 'Reply or action requested',
	appointment: 'Appointment'
};

// --- Sentences ---------------------------------------------------------------

function* sentences(text: string): Generator<{ s: string; start: number }> {
	const sep = /(?<=[.!?])\s+(?=[A-Z0-9€£$])|\n+/g;
	let from = 0;
	for (const m of text.matchAll(sep)) {
		yield* trimmed(text, from, m.index!);
		from = m.index! + m[0].length;
	}
	yield* trimmed(text, from, text.length);
}
function* trimmed(text: string, a: number, b: number) {
	const raw = text.slice(a, b);
	const lead = raw.length - raw.trimStart().length;
	const s = raw.trim();
	if (s) yield { s, start: a + lead };
}

const lineOf = (text: string, index: number) => text.slice(0, index).split('\n').length;

// --- The extractor -----------------------------------------------------------

export function extract(text: string): Extraction {
	if (!text || !text.trim()) return { state: 'no_text', findings: [] };

	const findings: Finding[] = [];
	for (const { s, start } of sentences(text)) {
		const dates = findDates(s).map((d) => ({ ...d, start: d.start + start, end: d.end + start }));
		const amounts = findAmounts(s);
		const relative = s.match(RELATIVE);
		// A weak payment cue ("pay", "fee") only counts when an amount is beside it.
		const cue = CUES.map((c) => ({ c, strong: c.strong.test(s), weak: !!c.weak?.test(s) && (c.kind !== 'payment' || amounts.length > 0) })).filter((x) => x.strong || x.weak);
		if (!cue.length) continue;

		const picked = cue.find((x) => x.strong) ?? cue[0];
		const kind = picked.c.kind;
		const hasWhen = dates.length > 0 || !!relative;
		const hasMoney = amounts.length > 0;
		// A cue alone is not enough: there must be a date, a time limit or an amount to point at.
		if (!hasWhen && !(kind === 'payment' && hasMoney)) continue;
		// A weak cue ("by", "pay") needs something concrete beside it.
		if (!picked.strong && !(hasWhen && (hasMoney || dates.length === 1 || !!relative))) continue;
		// A weak cue must also be addressed to the reader. "We will reply within
		// 14 days" is the sender's promise, not something the reader has to do.
		if (!picked.strong && (SENDER_PROMISE.test(s) || !ADDRESSED_TO_READER.test(s))) continue;

		const date = dates[0] ?? null;
		const notes: string[] = [];
		let confidence: Confidence = picked.strong ? 'high' : 'medium';
		if (dates.length > 1) {
			notes.push('This sentence contains more than one date. Check which one applies.');
			confidence = 'medium';
		}
		if (date?.ambiguous) {
			notes.push(
				date.candidates.length
					? `The date "${date.raw}" could mean ${date.candidates.join(' or ')}. VNTA has not chosen one.`
					: `The date "${date.raw}" has a two-digit year. VNTA has not guessed the year.`
			);
			confidence = 'low';
		} else if (date && !date.iso) {
			notes.push(`"${date.raw}" is not a real calendar date. Check the document.`);
			confidence = 'low';
		}
		if (relative && !date) {
			notes.push('The time limit counts from a date that is not stated here, so VNTA cannot give a due date.');
			confidence = 'low';
		}
		if (amounts.length > 1) notes.push('More than one amount appears in this sentence.');

		const t = s.match(TIME);
		const time = kind === 'appointment' && t ? t[0] : null;
		const quoteStart = start;
		const id = `f${findings.length + 1}`;
		findings.push({
			id,
			kind,
			title: TITLES[kind],
			date,
			relative: relative && !date ? relative[0] : null,
			time,
			amount: amounts[0] ? { raw: amounts[0].raw, value: amounts[0].value, currency: amounts[0].currency } : null,
			confidence,
			notes,
			evidence: { quote: s, start: quoteStart, end: quoteStart + s.length, line: lineOf(text, quoteStart) },
			status: 'suggested'
		});
	}

	return { state: findings.length ? 'ok' : 'nothing_found', findings };
}

// --- Checks ------------------------------------------------------------------

/**
 * Keep only findings whose quote really is in the document at the place they
 * say, and whose date and amount appear inside that quote. Anything else is a
 * made-up source and is dropped. Run this on every finding that did not come
 * straight from `extract`, such as one proposed by a model later.
 */
export function verifyEvidence(text: string, findings: Finding[]): { kept: Finding[]; rejected: Finding[] } {
	const kept: Finding[] = [];
	const rejected: Finding[] = [];
	for (const f of findings) {
		const e = f.evidence;
		const ok =
			e.quote.length > 0 &&
			text.slice(e.start, e.end) === e.quote &&
			(!f.date || e.quote.includes(f.date.raw)) &&
			(!f.amount || e.quote.includes(f.amount.raw)) &&
			(!f.date?.iso || f.date.candidates.includes(f.date.iso));
		(ok ? kept : rejected).push(f);
	}
	return { kept, rejected };
}

/** Same words, different spacing or case: the same document. */
export function normaliseForFingerprint(text: string): string {
	return text.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** SHA-256 of the normalised text, as hex. Used to spot an upload that is already there. */
export async function documentFingerprint(text: string): Promise<string> {
	const bytes = new TextEncoder().encode(normaliseForFingerprint(text));
	const digest = await crypto.subtle.digest('SHA-256', bytes);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Collapse findings that point at the same thing, keeping the first. */
export function dedupeFindings(findings: Finding[]): Finding[] {
	const seen = new Set<string>();
	return findings.filter((f) => {
		const key = [f.kind, f.date?.iso ?? f.date?.raw ?? f.relative ?? '', f.amount ? `${f.amount.currency}${f.amount.value}` : ''].join('|');
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

// --- Drafts ------------------------------------------------------------------

export interface Draft {
	/** A draft is text for a person to read and send themselves. */
	status: 'draft';
	sent: false;
	body: string;
}

/** A starting point to copy. Square brackets are things only the person can fill in. */
export function draftReply(f: Finding): Draft {
	const about =
		f.kind === 'payment' && f.amount
			? `the payment of ${f.amount.raw}`
			: f.kind === 'appointment'
				? 'my appointment'
				: f.kind === 'renewal'
					? 'the renewal'
					: 'your letter';
	const when = f.date?.iso ? ` I understand the date involved is ${f.date.iso}.` : '';
	const body = [
		'Dear [name or team],',
		'',
		`I am writing about ${about}.${when} [Say what you want to confirm, ask or arrange.]`,
		'',
		'Please reply to confirm you have received this. [Add your reference number, if the letter has one.]',
		'',
		'Kind regards,',
		'[Your name]'
	].join('\n');
	return { status: 'draft', sent: false, body };
}
