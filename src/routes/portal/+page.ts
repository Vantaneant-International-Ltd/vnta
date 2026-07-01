// Portal is a client-only route: it resolves the authenticated identity and
// fetches that client's data at runtime (mirrors /admin). Don't SSR or crawl
// it; it emits a static shell GitHub Pages serves, then hydrates behind
// Cloudflare Access.
export const ssr = false;
export const prerender = true;
