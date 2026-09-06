// Cloudflare Pages Function -> GET /portal/delivery
// Live delivery log for Andrew's portal, generated from client-buildt's own
// merge history instead of hand-typed into this repo's JSON. Sits under
// /portal, so Cloudflare Access already gates it.
//
// Only merge commits with a real, hand-written subject count as delivery
// entries: this repo merges routine branch syncs with git's default "Merge
// branch 'x' into y" message and merges finished work with a descriptive one,
// so filtering that pattern out is enough to separate the two. The merge
// commit body (already written in client-facing language in this repo)
// becomes the entry detail.
//
// Requires secret GITHUB_TOKEN with read access to the private client-buildt
// repo. Any failure (missing token, API error) falls back to the committed
// snapshot, same pattern as monitoring.js.

const REPO = 'Vantaneant-International-Ltd/client-buildt';

export async function onRequest(context) {
	const { env } = context;
	const out = { delivery: [], ok: false };

	const token = env.GITHUB_TOKEN;
	if (!token) {
		return new Response(JSON.stringify(out), {
			headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
		});
	}

	try {
		const commits = await fetchCommits(token);
		out.delivery = commits
			.filter((c) => (c.parents || []).length > 1)
			.map(toEntry)
			.filter((e) => e !== null);
		out.ok = true;
	} catch (e) {
		// leave delivery empty; portal falls back to its committed snapshot
	}

	return new Response(JSON.stringify(out), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
	});
}

async function fetchCommits(token) {
	const commits = [];
	for (const page of [1, 2]) {
		const res = await fetch(
			`https://api.github.com/repos/${REPO}/commits?sha=main&per_page=100&page=${page}`,
			{
				headers: {
					authorization: `Bearer ${token}`,
					accept: 'application/vnd.github+json',
					'user-agent': 'vnta-portal'
				}
			}
		);
		if (!res.ok) break;
		const batch = await res.json();
		commits.push(...batch);
		if (batch.length < 100) break;
	}
	return commits;
}

function toEntry(c) {
	const message = c.commit?.message || '';
	const rawTitle = message.split('\n')[0].trim();
	// Routine branch-sync merges keep git's default message and carry nothing
	// worth reporting; real feature merges in this repo get a hand-written one.
	if (!rawTitle || /^merge branch/i.test(rawTitle)) return null;
	const detail = bodyWithoutTrailers(message);
	// "Merge deposit model and..." reads better to a client as "Deposit model and...".
	const stripped = rawTitle.replace(/^merge\s+/i, '');
	const title = stripped ? stripped[0].toUpperCase() + stripped.slice(1) : rawTitle;
	return {
		date: formatDate(c.commit.author?.date || c.commit.committer?.date),
		category: categorize(rawTitle),
		title,
		detail: detail || title
	};
}

// Strips the trailers Claude Code appends (Co-Authored-By, Claude-Session) and
// any merge-conflict listing, keeping only the human-facing summary.
function bodyWithoutTrailers(message) {
	const lines = message.split('\n').slice(1);
	const kept = [];
	for (const line of lines) {
		if (/^(co-authored-by|claude-session|#\s*conflicts)/i.test(line.trim())) break;
		kept.push(line);
	}
	return kept.join('\n').trim();
}

function categorize(title) {
	const t = title.toLowerCase();
	if (/security|lock|guard|harden|audit/.test(t)) return 'Security';
	if (/seo/.test(t)) return 'Optimisation';
	if (/design|brand/.test(t)) return 'Design';
	return 'Feature';
}

function formatDate(iso) {
	if (!iso) return '';
	const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const d = new Date(iso);
	return `${d.getUTCDate()} ${mo[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
