<script lang="ts">
	// The whole site. One white page, one column, one letter: no nav, no
	// sections, no footer, no design furniture. If an element survives removal,
	// remove it.
	import { base } from '$app/paths';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	// The houses stewarded under VNTA, each linking out to its own site. Set
	// lowercase: one quiet line under the signature, not a footer.
	const houses = [
		{ name: 'vendr', href: 'https://vendr.ie' },
		{ name: 'eirvox', href: 'https://eirvox.ie' },
		{ name: 'maison seul', href: 'https://maisonseul.com' }
	];
</script>

<svelte:head>
	<title>VNTA</title>
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
			<header class="head">
				<h1 class="mark"><Wordmark height={26} label="Vantanéant International" /></h1>
				<!-- The only nav on the site. A mailto rather than an anchor: the
				     letter fits one screen on desktop, so scrolling to the Diagnosis
				     paragraph would be a link that visibly does nothing. -->
				<a class="nav" href="mailto:studio@vnta.xyz?subject=Diagnosis">Diagnosis</a>
			</header>

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
					Founder, Vantanéant International
				</p>

				<p class="houses">
					{#each houses as house, i}<a href={house.href}>{house.name}</a>{#if i < houses.length - 1}<span
							class="houses__sep">&nbsp;&mdash;&nbsp;</span
						>{/if}{/each}
				</p>
			</div>
		</div>
	</div>

</main>

<style>
	/* One white page. The letter column is the entire layout system. */
	.page {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
	}

	/* One quiet line of houses, set in the byline grey directly beneath it.
	   No label, no bullets, no footer. */
	.letter p.houses {
		margin-top: 0.55em;
		margin-bottom: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-50);
	}
	.houses__sep { color: var(--ink-35); }
	.letter p.houses a {
		color: var(--ink-50);
		border-bottom: 1px solid transparent;
		transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}
	.letter p.houses a:hover { color: var(--ink); border-bottom-color: var(--ink-35); }

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

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-6);
		margin-bottom: clamp(24px, 3.5vh, 34px);
	}

	.mark {
		margin: 0;
		color: var(--ink);
		line-height: 0; /* the SVG is the heading, no extra leading */
	}

	/* Quiet as the byline: no border, background or underline until hover. */
	.nav {
		font-size: 0.85rem;
		line-height: 1;
		color: var(--ink-50);
		border-bottom: 1px solid transparent;
		padding-bottom: 2px;
		transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}
	.nav:hover { color: var(--ink); border-bottom-color: var(--ink-35); }

	.letter p {
		font-family: var(--font-body);
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--ink-85);
		margin: 0 0 1.2em;
		text-wrap: pretty;
	}

	/* The address is not decorated: it reads as part of the sentence, and only
	   admits to being a link on hover. */
	.letter p a {
		color: inherit;
		border-bottom: 1px solid transparent;
		transition: border-color var(--dur) var(--ease);
	}
	.letter p a:hover { border-bottom-color: var(--ink-35); }

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

	@media (max-width: 560px) {
		.sheet { align-items: flex-start; }
	}
</style>
