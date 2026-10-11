// Where notes live, and how their dates are written. Safe to use anywhere.
// The notes themselves are in $lib/server, which only the build can read: a
// note that is held or not yet due must never reach a visitor's browser.
export const notesPath = '/robotics/notes';
export const notePath = (slug: string) => `${notesPath}/${slug}`;

/** "13 October 2026" from an ISO date or timestamp. */
export const longDate = (iso: string) =>
	new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Dublin' }).format(new Date(iso));
