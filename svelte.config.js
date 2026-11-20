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
			entries: ['*']
		}
	}
};

export default config;
