<script lang="ts">
	// The whole site. One white page, one column, one letter — the abc.xyz
	// register: no nav, no sections, no design furniture. If an element survives
	// removal, remove it.
	import { base } from '$app/paths';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	// The houses stewarded under VNTA. Plain text until each has a site of its
	// own; then the name becomes the link.
	const houses = ['Vendr', 'Eirvox', 'Maison Seul'];
</script>

<svelte:head>
	<title>Vantanéant International</title>
	<meta
		name="description"
		content="Vantanéant International is a holding company. We take residence inside one brand at a time and stay twelve months. It begins with a Diagnosis. Two weeks, €750 fixed."
	/>
	<meta property="og:title" content="Vantanéant International" />
	<meta
		property="og:description"
		content="A holding company. One brand at a time, twelve months in residence."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page">
	<!-- White: the letter. -->
	<div class="sheet">
		<div class="column">
			<h1 class="mark"><Wordmark height={26} label="Vantanéant International" /></h1>

			<div class="letter">
				<p>
					Vantanéant International is a holding company. We take residence inside one brand
					at a time and stay twelve months. We set direction, build the system underneath
					it, then hand over the keys.
				</p>

				<p>
					We are deliberately small. That is not a stage we are passing through, it is the
					design. One engagement at a time is the only arrangement in which the work stays
					ours.
				</p>

				<p>
					If you are considering a residency, it begins with a Diagnosis. Two weeks, €750
					fixed. A clear read on brand, narrative, and position, and a scoped plan, whether
					or not we go further. Write to
					<a href="mailto:studio@vnta.xyz?subject=Diagnosis">studio@vnta.xyz</a>.
				</p>

				<p>
					There is nothing else on this page because there is nothing else to say until the
					work says it.
				</p>

				<p class="sign">
					<span class="sign__name">Renato G.</span><br />
					Founder, Vantanéant International Ltd
				</p>
			</div>
		</div>
	</div>

	<!-- Black: the register. Two tones, no third. -->
	<footer class="band" data-theme="ink">
		<div class="column band__inner">
			<p class="band__line">
				<span class="band__label">Houses</span>
				{#each houses as house, i}<span>{house}</span
					>{#if i < houses.length - 1}<span class="sep">·</span>{/if}{/each}
			</p>
			<p class="band__line band__line--meta">
				<a href="{base}/legal">Legal</a><span class="sep">·</span>
				<a href="{base}/privacy">Privacy</a><span class="sep">·</span>
				<a href="{base}/terms">Terms</a><span class="sep">·</span>
				<span>Dublin, est. 2025</span>
			</p>
		</div>
	</footer>
</main>

<style>
	/* Two tones, no third: white sheet, black band. The letter column is the
	   entire layout system. */
	.page {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
	}

	/* --- White: the sheet ------------------------------------------------- */
	.sheet {
		flex: 1;
		display: flex;
		align-items: center;
		padding: clamp(48px, 8vh, 88px) clamp(24px, 6vw, 40px);
	}

	.column {
		width: 100%;
		max-width: 34rem; /* about 52 characters, a letter measure */
		margin: 0 auto;
	}

	.mark {
		margin: 0 0 clamp(24px, 3.5vh, 34px);
		color: var(--ink);
		line-height: 0; /* the SVG is the heading, no extra leading */
	}

	.letter p {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--ink-85);
		margin: 0 0 1.2em;
		text-wrap: pretty;
	}

	/* Inline links carry an underline, the only ornament on the sheet. */
	.letter a {
		color: var(--ink);
		border-bottom: 1px solid var(--ink-35);
		transition: border-color var(--dur) var(--ease);
	}
	.letter a:hover { border-bottom-color: var(--ink); }

	.letter p.sign {
		margin-top: clamp(30px, 4vh, 38px);
		margin-bottom: 0;
		color: var(--ink-50);
		font-size: 0.95rem;
		line-height: 1.5;
	}
	/* A signature, not a heading: the script face, set larger than the body so
	   it reads as a pen mark at the foot of a letter. */
	.sign__name {
		font-family: var(--font-sign);
		font-size: 2.4rem;
		letter-spacing: 0.005em;
		color: var(--ink);
		line-height: 1.5;
	}

	/* --- Black: the band -------------------------------------------------- */
	.band {
		background: var(--ink-bg);
		color: var(--ink-fg);
		padding: clamp(26px, 4vh, 38px) clamp(24px, 6vw, 40px);
	}
	.band__inner { display: flex; flex-direction: column; gap: 0.7em; }

	.band__line {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0.5em;
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-85);
	}
	.band__line--meta { font-size: 0.8rem; color: var(--ink-50); }

	.band__label {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-35);
		margin-right: 0.4em;
	}

	.sep { color: var(--ink-35); }

	.band__line--meta a { transition: color var(--dur) var(--ease); }
	.band__line--meta a:hover { color: var(--ink-fg); }

	@media (max-width: 560px) {
		.sheet { align-items: flex-start; }
	}
</style>
