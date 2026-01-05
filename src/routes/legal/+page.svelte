<svelte:head>
	<title>Legal — VNTA</title>
	<meta
		name="description"
		content="Terms and conditions governing the use of VNTA and its associated services."
	/>
	<meta property="og:title" content="Terms — VNTA" />
	<meta
		property="og:description"
		content="Terms and conditions governing the use of VNTA and its associated services."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<!-- HERO -->
		<section class="hero">
			<h1 class="title">Terms</h1>
			<p class="lede">
				These terms govern your use of VNTA and any related services, content, or communications.
			</p>
		</section>

		<!-- BODY -->
		<section class="section">
			<p>
				VNTA (Vantanéant International Ltd) provides strategic, creative, and operational services.
				By accessing this website or engaging with VNTA, you agree to the following terms.
			</p>

			<h2>Use of site</h2>
			<p>
				This site is provided for informational purposes only. Content may change without notice.
				We make no guarantees regarding completeness, accuracy, or availability.
			</p>

			<h2>Engagements</h2>
			<p>
				Any formal engagement with VNTA is governed by a separate written agreement. Nothing on this
				site constitutes an offer, proposal, or binding commitment.
			</p>

			<h2>Intellectual property</h2>
			<p>
				All content, trademarks, and materials on this site are the property of Vantanéant
				International Ltd or its respective houses, unless otherwise stated.
			</p>

			<h2>Limitation of liability</h2>
			<p>
				VNTA shall not be liable for any direct, indirect, or consequential loss arising from the
				use of this site or reliance on its content.
			</p>

			<h2>Jurisdiction</h2>
			<p>
				These terms are governed by the laws of Ireland. Any disputes shall be subject to the
				exclusive jurisdiction of Irish courts.
			</p>
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

	@media (max-width: 768px) {
		.hero {
			margin-bottom: 40px;
		}
	}
</style>
