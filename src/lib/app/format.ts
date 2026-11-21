import type { Finding, Status } from './api';

const day = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat('en-IE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
export const fmtDate = (iso: string) => day.format(new Date(iso + 'T00:00:00Z'));
export const fmtMonth = (iso: string) => month.format(new Date(iso + 'T00:00:00Z'));
export const fmtStamp = (secs: number) => day.format(new Date(secs * 1000));

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const STATUS_LABEL: Record<Status, string> = {
	needs_review: 'Needs review',
	ready_for_approval: 'Ready for approval',
	in_progress: 'In progress',
	completed: 'Completed',
	unable_to_verify: 'Unable to verify',
	dismissed: 'Dismissed'
};

export const CONFIDENCE_LABEL = { high: 'Looks clear', medium: 'Worth a look', low: 'Check this' } as const;

/** One line saying when, in words that never claim more than is known. */
export function whenText(f: Finding): string {
	if (f.dateIso) {
		const base = fmtDate(f.dateIso) + (f.time ? `, ${f.time}` : '');
		return f.dateSource === 'you' ? `${base} (confirmed by you)` : base;
	}
	if (f.dateSource === 'unclear' && f.dateCandidates.length) return `Unclear: ${f.dateCandidates.map(fmtDate).join(' or ')}`;
	if (f.dateSource === 'unclear') return `Unclear: "${f.dateRaw}"`;
	if (f.relative) return `No date given: "${f.relative}"`;
	return f.amount ? f.amount.raw : 'No date found';
}

/** Still waiting for the person: shown on Home as needing attention. */
export const needsAttention = (f: Finding) => f.status === 'needs_review' || f.status === 'ready_for_approval';
export const isOpen = (f: Finding) => f.status !== 'completed' && f.status !== 'dismissed';
