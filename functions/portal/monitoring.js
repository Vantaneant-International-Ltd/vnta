// Cloudflare Pages Function -> GET /portal/monitoring
// Live data for the client portal. Sits under /portal, so Cloudflare Access
// already gates it (only a signed-in client reaches it).
//
// Uptime comes from UptimeRobot (secret UPTIMEROBOT_API_KEY). Performance via
// PageSpeed Insights is optional: anonymous PSI is quota-limited, so any failure
// is swallowed and the portal keeps its committed performance figures.

const MONITOR_MATCH = 'buildt.ie';
const DAYS = 90;

export async function onRequest(context) {
	const { env } = context;
	const out = { siteHealth: null, monitors: [], performance: [] };

	const key = env.UPTIMEROBOT_API_KEY;
	if (key) {
		try {
			const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'cache-control': 'no-cache'
				},
				body: `api_key=${encodeURIComponent(key)}&format=json&logs=1&custom_uptime_ratios=90`
			});
			const data = await res.json();
			const m = (data.monitors || []).find((x) => (x.url || '').includes(MONITOR_MATCH));
			if (m) {
				out.siteHealth =
					m.status === 2 ? 'Operational' : m.status === 8 || m.status === 9 ? 'Down' : 'Degraded';
				const ratio = parseFloat(m.custom_uptime_ratio);
				out.monitors = [
					{
						name: 'buildt.ie',
						uptime: isNaN(ratio) ? undefined : ratio === 100 ? '100%' : ratio.toFixed(2) + '%',
						days: buildDays(m)
					}
				];
			}
		} catch (e) {
			// leave monitors empty; portal falls back to its committed snapshot
		}
	}

	try {
		const psiKey = env.GOOGLE_PSI_API_KEY;
		const psi = await fetch(
			'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://buildt.ie&strategy=mobile' +
				'&category=performance&category=accessibility&category=best-practices&category=seo' +
				(psiKey ? `&key=${psiKey}` : '')
		);
		const pd = await psi.json();
		const cats = pd && pd.lighthouseResult && pd.lighthouseResult.categories;
		if (cats && cats.performance) {
			const pct = (k) => (cats[k] ? Math.round(cats[k].score * 100) : null);
			out.performance = [
				{
					date: today(),
					title: 'Lighthouse, mobile',
					metric: String(pct('performance')),
					detail: `Accessibility ${pct('accessibility')}, best practices ${pct('best-practices')}, SEO ${pct('seo')}. Live via PageSpeed Insights.`
				}
			];
		}
	} catch (e) {
		// keep committed performance
	}

	return new Response(JSON.stringify(out), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
	});
}

// Honest 90-day strip: no-data before the monitor was created, incident on any
// day with a down event, operational otherwise. 0 = no data, 1 = up, 2 = incident.
function buildDays(m) {
	const dayOf = (unix) => Math.floor(unix / 86400);
	const todayIdx = dayOf(Date.now() / 1000);
	const created = dayOf(m.create_datetime || Date.now() / 1000);
	const down = new Set();
	for (const log of m.logs || []) {
		if (log.type === 1) down.add(dayOf(log.datetime));
	}
	const days = [];
	for (let i = DAYS - 1; i >= 0; i--) {
		const d = todayIdx - i;
		if (d < created) days.push(0);
		else if (down.has(d)) days.push(2);
		else days.push(1);
	}
	return days;
}

function today() {
	const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const d = new Date();
	return `${d.getUTCDate()} ${mo[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
