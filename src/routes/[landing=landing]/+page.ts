import { error } from '@sveltejs/kit';
import { landings } from '$lib/content/site';

export const prerender = true;

// One page is built for each landing in the content file.
export const entries = () => landings.map((l) => ({ landing: l.slug }));

export function load({ params }) {
	const landing = landings.find((l) => l.slug === params.landing);
	if (!landing) error(404, 'Not found');
	return { landing };
}
