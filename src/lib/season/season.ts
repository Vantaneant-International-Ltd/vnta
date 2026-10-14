// The winter season: from 1 December to 6 January, by the visitor's own
// clock. It switches itself on and off; nobody has to remember.
//
// To preview it out of season, add ?season=winter to any address.
// ?season=off turns it off in season.

export const WINTER = { from: { month: 12, day: 1 }, until: { month: 1, day: 6 } };

export function isWinter(now = new Date(), search = ''): boolean {
	const ask = new URLSearchParams(search).get('season');
	if (ask === 'winter') return true;
	if (ask === 'off') return false;
	const m = now.getMonth() + 1;
	const d = now.getDate();
	return (m === WINTER.from.month && d >= WINTER.from.day) || (m === WINTER.until.month && d <= WINTER.until.day);
}

export const lessMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
