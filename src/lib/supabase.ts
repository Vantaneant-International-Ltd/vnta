// Browser Supabase client for this static site. The publishable key is public
// by design — Row-Level Security is what protects the data. No service_role here.
//
// VNTA shares the vendr Supabase project; all VNTA objects are namespaced with a
// `vnta_` prefix and gated by their own `vnta_admins` / `vnta_is_admin()`.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(url, anonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true // completes the magic-link redirect
	}
});

/** Is the currently signed-in user a VNTA admin? Uses the SECURITY DEFINER RPC. */
export async function isAdmin(): Promise<boolean> {
	const { data, error } = await supabase.rpc('vnta_is_admin');
	if (error) return false;
	return data === true;
}

/** Best-effort audit entry. Never blocks the UI. */
export async function logActivity(action: string, detail: string | null = null): Promise<void> {
	const { data } = await supabase.auth.getUser();
	const actor = data?.user?.email ?? null;
	await supabase.from('vnta_activity_log').insert({ actor_email: actor, action, detail });
}

/** Public list of published postings for the careers page. */
export type JobPosting = {
	id: string;
	slug: string;
	title: string;
	meta: string | null;
	status: 'Open' | 'Closed';
	apply_subject: string | null;
	apply_lead: string | null;
	sections: Array<{ heading: string; body?: string; bullets?: string[] }>;
	requires_cv: boolean;
	requires_portfolio: boolean;
	ack_pay: boolean;
	is_published: boolean;
	sort_order: number;
};
