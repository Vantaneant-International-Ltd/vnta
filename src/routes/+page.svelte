<script lang="ts">
	// Holding page. The site is being rebuilt; until it ships this is the whole
	// of vnta.xyz: the mark, one line on what we do, and one way to reach us.
	// /portal, /legal, /privacy and /terms are untouched.
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
</script>

<svelte:head>
	<title>VNTA</title>
	<meta
		name="description"
		content="VNTA designs, builds and runs websites for Irish businesses. A new site is on the way. Write to studio@vnta.xyz."
	/>
	<meta property="og:title" content="VNTA" />
	<meta
		property="og:description"
		content="Websites designed, built and run for Irish businesses. A new site is on the way."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<main class="hold">
	<h1 class="hold__mark"><Wordmark height={0} label="VNTA" /></h1>

	<div class="hold__body">
		<p class="hold__line">A new site is on the way.</p>
		<p class="hold__what">
			We design, build and run websites for Irish businesses. The studio is open while this
			page is rebuilt.
		</p>
		<p class="hold__write">
			Write to <a href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>
		</p>
	</div>
</main>

<style>
	/* The mark at scale, then everything else in one quiet column beneath it.
	   The page is one screen tall and the body sits on its floor. */
	.hold {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: clamp(40px, 8vh, 96px);
		padding: clamp(28px, 4vw, 64px) 0 clamp(28px, 3.4vw, 52px);
		border-bottom: 1px solid var(--line);
	}

	/* Drawn, not typed: it scales to the page so it stays the real wordmark. */
	.hold__mark {
		margin: 0;
		line-height: 0;
		color: var(--ink);
		max-width: 1100px;
	}
	.hold__mark :global(svg) {
		width: 100%;
		height: auto !important;
	}

	.hold__body {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(14px, 1.6vw, 22px);
		align-items: end;
		border-top: 1px solid var(--line);
		padding-top: clamp(22px, 2.4vw, 36px);
	}
	.hold__line {
		margin: 0;
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.12;
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}
	.hold__what {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		color: var(--ink-50);
		max-width: 34ch;
		text-wrap: pretty;
	}
	.hold__write {
		margin: 0;
		font-size: 0.9rem;
		color: var(--ink-70);
	}
	.hold__write a {
		color: var(--ink);
		border-bottom: 1px solid var(--ink-35);
		padding-bottom: 2px;
		transition: border-color var(--dur) var(--ease);
	}
	.hold__write a:hover {
		border-bottom-color: var(--ink);
	}

	@media (min-width: 900px) {
		.hold__body {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.hold__write {
			justify-self: end;
		}
	}
</style>
