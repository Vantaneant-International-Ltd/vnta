// Checks an upload before anything is stored, and reads its text.
// Supported: PDF with a text layer, and plain text. Anything else is refused.
// A scanned PDF has no text layer; there is no OCR, so it is reported as unreadable.
import { ApiError } from './types.ts';

export const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_CHARS = 200_000;

export type FileKind = 'pdf' | 'text';

const startsWith = (b: Uint8Array, s: string) => s.split('').every((c, i) => b[i] === c.charCodeAt(0));

/** Decides the kind from the content, not from the file name or the type the browser claims. */
export function validateUpload(name: string, bytes: Uint8Array): FileKind {
	if (bytes.byteLength === 0) throw new ApiError(400, 'That file is empty.');
	if (bytes.byteLength > MAX_BYTES) throw new ApiError(413, 'That file is larger than 5 MB.');
	const lower = name.toLowerCase();
	if (startsWith(bytes, '%PDF-')) {
		if (!lower.endsWith('.pdf')) throw new ApiError(400, 'The file name should end in .pdf.');
		return 'pdf';
	}
	if (lower.endsWith('.txt') || lower.endsWith('.text')) {
		if (bytes.includes(0)) throw new ApiError(400, 'That does not look like a text file.');
		return 'text';
	}
	throw new ApiError(415, 'Only PDF and plain text files can be added.');
}

/** A safe display name: no path, no control characters, limited length. */
export function cleanName(raw: string): string {
	const base = raw.split(/[\\/]/).pop() ?? '';
	const s = base.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 120);
	return s || 'document';
}

export async function readText(kind: FileKind, bytes: Uint8Array): Promise<string> {
	let text: string;
	if (kind === 'text') {
		try {
			text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
		} catch {
			throw new ApiError(400, 'That text file is not UTF-8. Save it as UTF-8 and try again.');
		}
	} else {
		try {
			const { extractText, getDocumentProxy } = await import('unpdf');
			const pdf = await getDocumentProxy(new Uint8Array(bytes));
			const out = await extractText(pdf, { mergePages: true });
			text = Array.isArray(out.text) ? out.text.join('\n') : out.text;
		} catch {
			throw new ApiError(422, 'That PDF could not be read. It may be damaged or password protected.');
		}
	}
	text = text.replace(/\r\n?/g, '\n').replace(/\u0000/g, '');
	if (text.length > MAX_CHARS) throw new ApiError(413, 'That document has more text than VNTA can read at once.');
	return text;
}
