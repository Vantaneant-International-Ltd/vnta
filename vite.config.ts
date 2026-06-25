import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Public Supabase config (publishable key, safe in the client; RLS protects the
// data). Defaults are baked here so `npm run dev` and CI builds work without a
// .env file. Override via PUBLIC_SUPABASE_* in the environment when needed.
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL ?? 'https://fmmvqlqdhytcxeucdfbj.supabase.co';
const SUPABASE_ANON_KEY =
	process.env.PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_rpmSPCHja3L2Uy2_RrxjAA_Cz_NyHB2';
// Cloudflare Turnstile site key (public, safe in the client). The secret key is
// server-only and lives as a Supabase edge-function secret, never here.
const TURNSTILE_SITE_KEY = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? '0x4AAAAAADrAgdwjUX9NIVP3';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
		'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
		'import.meta.env.PUBLIC_TURNSTILE_SITE_KEY': JSON.stringify(TURNSTILE_SITE_KEY)
	}
});
