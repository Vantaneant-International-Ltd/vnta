<svelte:head>
	<title>Privacy — VNTA</title>
	<meta
		name="description"
		content="Privacy policy for VNTA (Vantanéant International Ltd)."
	/>
	<meta property="og:title" content="Privacy — VNTA" />
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
				<p>Currently, this site does not use analytics or tracking tools by default.</p>
			</div>

			<div class="panel">
				<ul class="list">
					<li>
						<b>Emails you send us</b> (e.g. to <a class="inline-link" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>).
						We use the information you provide to respond.
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
				<p>If we add analytics or cookies later, we’ll update this page.</p>
			</div>

			<div class="panel panel--muted">
				<p class="body">
					At the time of writing, VNTA does not intentionally set marketing or analytics cookies.
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
				<p>January 2026</p>
			</div>
		</section>
	</div>
</main>

<style>
	.hero {
		margin-bottom: 56px;
	}

	.title {
		font-family: 'Playfair Display', serif;
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
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		backdrop-filter: blur(10px);
	}

	.statement p {
		margin: 0;
		font-family: 'Playfair Display', serif;
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
		font-family: 'Playfair Display', serif;
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
		border-radius: 18px;
		padding: 22px 22px;
		background: rgba(255, 255, 255, 0.02);
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
