<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Legal · VNTA</title>
	<meta
		name="description"
		content="Legal information and notices relating to VNTA and this website."
	/>
	<meta property="og:title" content="Legal · VNTA" />
	<meta
		property="og:description"
		content="Legal information and notices relating to VNTA and this website."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<!-- HERO -->
		<section class="hero">
			<h1 class="title">Legal</h1>
			<p class="lede">
				This page provides general legal information and notices relating to VNTA and this website.
				For contractual terms governing a paid engagement, please refer to the written agreement issued
				for that engagement.
			</p>
		</section>

		<!-- BODY -->
		<section class="section">
			<h2>Company</h2>
			<p>
				VNTA is a trading name of Vantanéant International Ltd. Unless stated otherwise, references to
				“VNTA”, “we”, “us”, or “our” refer to Vantanéant International Ltd.
			</p>

			<h2>Website information</h2>
			<p>
				This website is provided for informational purposes only. Content may be updated, revised, or
				removed without notice. We do not warrant that the website will be available, uninterrupted, or
				error-free.
			</p>

			<h2>No offer or advice</h2>
			<p>
				Nothing on this website constitutes an offer, proposal, or binding commitment. Any reference to
				services, packages, or capabilities is indicative only and may be tailored. Where information is
				provided, it is not intended to be relied upon as legal, financial, or professional advice.
			</p>

			<h2>Engagements and contracting</h2>
			<p>
				Commercial engagements with VNTA are governed exclusively by a separate written agreement (and,
				where applicable, supporting schedules or statements of work). In the event of any inconsistency
				between this website and a signed agreement, the signed agreement prevails.
			</p>

			<h2>Intellectual property</h2>
			<p>
				All content on this website, including text, visual identity, design elements, and materials,
				is owned by Vantanéant International Ltd or used under licence, unless otherwise stated. You may
				not reproduce, distribute, modify, or republish any part of this website without prior written
				permission.
			</p>

			<h2>Third-party links</h2>
			<p>
				This website may contain links to third-party websites or services. VNTA is not responsible for
				the content, availability, or policies of those third parties. Accessing third-party links is at
				your own risk.
			</p>

			<h2>Limitation of liability</h2>
			<p>
				To the maximum extent permitted by law, VNTA shall not be liable for any direct, indirect,
				incidental, consequential, or special loss arising from your use of this website or reliance on
				its content.
			</p>

			<h2>Jurisdiction</h2>
			<p>
				This legal notice (and any non-contractual disputes arising out of or in connection with it) is
				governed by the laws of Ireland. The courts of Ireland shall have exclusive jurisdiction.
			</p>

			<h2>Contact</h2>
			<p>
				For legal or administrative enquiries, contact <a class="inline-link" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>.
			</p>

			<p class="muted">
				Related pages: <a class="inline-link" href="{base}/privacy">Privacy</a> · <a class="inline-link" href="{base}/terms">Terms</a>
			</p>
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
		max-width: 820px;
	}

	.section {
		margin-bottom: 72px;
	}

	.section h2 {
		margin: 40px 0 12px;
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.section p {
		margin: 0;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1.65;
		max-width: 900px;
	}

	.section p + p {
		margin-top: 14px;
	}

	.inline-link {
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.28);
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	.inline-link:hover {
		color: rgba(255, 255, 255, 0.98);
		border-bottom-color: rgba(255, 255, 255, 0.55);
	}

	.muted {
		color: rgba(255, 255, 255, 0.55);
	}

	@media (max-width: 768px) {
		.hero {
			margin-bottom: 40px;
		}
	}
</style>
