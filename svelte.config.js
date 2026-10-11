import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// GitHub Pages + custom domain (vnta.xyz). The 404.html fallback lets the
		// client-only /admin route hydrate and serves a styled error for unknown URLs.
		adapter: adapter({ fallback: '404.html' }),
		paths: {
			base: ''
		},
		prerender: {
			entries: ['*'],
			// A note has a page only once it has been published, so before the
			// first one goes out /robotics/notes/[slug] has nothing to build.
			// That one route may be empty; any other unseen route is still an error.
			handleUnseenRoutes: ({ routes, message }) => {
				if (routes.every((r) => r === '/robotics/notes/[slug]')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
