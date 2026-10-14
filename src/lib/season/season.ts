// The winter season: from 14 October to 6 January, by the visitor's own
// clock. It switches itself on and off; nobody has to remember. (It was
// 1 December; the owner asked for it from 14 October 2026.)
//
// To preview it out of season, add ?season=winter to any address.
// ?season=off turns it off in season.

export const WINTER = { from: { month: 10, day: 14 }, until: { month: 1, day: 6 } };

export function isWinter(now = new Date(), search = ''): boolean {
	const ask = new URLSearchParams(search).get('season');
	if (ask === 'winter') return true;
	if (ask === 'off') return false;
	const m = now.getMonth() + 1;
	const d = now.getDate();
	// From the start date to the end of the year, then the new year until the end date.
	const afterStart = m > WINTER.from.month || (m === WINTER.from.month && d >= WINTER.from.day);
	const beforeEnd = m < WINTER.until.month || (m === WINTER.until.month && d <= WINTER.until.day);
	return afterStart || beforeEnd;
}

export const lessMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
