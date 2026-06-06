<svelte:head>
	<title>Privacy · VNTA</title>
	<meta
		name="description"
		content="Privacy policy for VNTA (Vantanéant International Ltd)."
	/>
	<meta property="og:title" content="Privacy · VNTA" />
	<meta property="og:description" content="Privacy policy for VNTA." />
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<section class="hero">
			<h1 class="title">Privacy</h1>
			<p class="lede">
				VNTA respects privacy. This page explains what we collect (and what we don’t), and how to contact us.
			</p>
		</section>

		<section class="statement">
			<p>
				Minimal data.<br />
				Clear intent.
			</p>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>What we collect</h2>
				<p>Only what the site needs to work and to reply to you.</p>
			</div>

			<div class="panel">
				<ul class="list">
					<li>
						<b>Messages and inquiries</b> you send us, by email to
						<a class="inline-link" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a> or through the inquiry form
						(name, email, company, and your message). We use them to respond and to keep a record of the request.
					</li>
					<li>
						<b>Anonymous analytics</b> through Google Analytics, with IP anonymisation. It loads only after you
						accept cookies. Decline and it sets no cookies and sends no analytics.
					</li>
					<li>
						<b>Basic server logs</b> (standard hosting logs such as IP address, user agent, and request time),
						used for security and reliability.
					</li>
				</ul>
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>Cookies</h2>
				<p>One analytics tool, and only with your consent.</p>
			</div>

			<div class="panel panel--muted">
				<p class="body">
					VNTA uses Google Analytics for anonymous usage measurement. It runs only after you accept cookies.
					We set no marketing or advertising cookies.
				</p>
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>Your rights</h2>
				<p>You can request access, correction, or deletion of personal data you’ve shared with us.</p>
			</div>

			<div class="panel">
				<p class="body">
					Email <a class="inline-link" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a> with your request.
				</p>
			</div>
		</section>

		<section class="section">
			<div class="section-head">
				<h2>Last updated</h2>
				<p>June 2026</p>
			</div>
		</section>
	</div>
</main>

<style>
	.hero {
		margin-bottom: 56px;
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2.6rem, 5vw, 4rem);
		font-weight: 700;
		margin: 0 0 0.75rem;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.78);
		max-width: 780px;
	}

	.statement {
		margin: 0 0 72px;
		padding: 28px 32px;
		border-radius: var(--radius);
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: var(--surface);
	}

	.statement p {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.75rem;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.92);
		letter-spacing: -0.01em;
	}

	.section {
		margin: 0 0 64px;
	}

	.section-head {
		margin-bottom: 18px;
	}

	.section-head h2 {
		margin: 0 0 10px;
		font-family: var(--font-display);
		font-size: 1.9rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.section-head p {
		margin: 0;
		color: rgba(255, 255, 255, 0.65);
		line-height: 1.6;
	}

	.panel {
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--radius);
		padding: 22px 22px;
		background: var(--surface);
	}

	.panel--muted {
		background: rgba(255, 255, 255, 0.015);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.list {
		margin: 0;
		padding-left: 1.1rem;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.7;
	}

	.list li {
		margin: 0 0 12px;
	}

	.body {
		margin: 0;
		color: rgba(255, 255, 255, 0.78);
		line-height: 1.7;
	}

	.inline-link {
		color: rgba(255, 255, 255, 0.92);
		text-decoration: underline;
		text-decoration-color: rgba(255, 255, 255, 0.3);
		text-underline-offset: 3px;
	}

	.inline-link:hover {
		text-decoration-color: rgba(255, 255, 255, 0.6);
	}

	@media (max-width: 768px) {
		.statement {
			padding: 22px 20px;
		}

		.statement p {
			font-size: 1.5rem;
		}
	}
</style>
