
<svelte:head>
	<title>Horizon — VNTA</title>
	<meta
		name="description"
		content="Not a roadmap. A directional horizon for VNTA across 2026–2027."
	/>
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<h1 class="title">Directional Horizon</h1>
		<p class="lede">
			Not a roadmap. A statement of focus for the 2026–2027 horizon.
		</p>

		<div class="frame" aria-label="VNTA Directional Horizon">
			<img src="/vnta-directional-horizon.svg" alt="VNTA Directional Horizon (2026–2027)" />
		</div>

		<p class="note">
			VNTA advances by readiness, not timelines. Visibility follows stability — never the reverse.
		</p>
	</div>
</main>

<style>
	.title {
		margin: 0 0 14px;
		font-size: clamp(2.2rem, 3.6vw, 3rem);
		line-height: 1.15;
		font-family: 'Playfair Display', 'Times New Roman', serif;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.015em;
	}

	.lede {
		margin: 0 0 22px;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		max-width: 78ch;
	}

	.frame {
		border-radius: 18px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}

	.frame img {
		display: block;
		width: 100%;
		height: auto;
	}

	.note {
		margin: 18px 0 0;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.7;
		max-width: 78ch;
	}
</style>
