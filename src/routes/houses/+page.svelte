<script lang="ts">
	// The houses, one band each. Written from the house brand books rather than
	// from the parent's guesses: Vendr from vendr-brand, Éirvox from
	// eirvox-brand and eirvox-voice. Maison Seul has no book in reach, so it
	// carries only what VNTA can stand over and no invented notes.
	//
	// Described in the parent's register, not each house's own. The houses speak
	// for themselves on their own sites.
	const houses = [
		{
			folio: 'I',
			name: 'Vendr',
			href: 'https://vendr.ie',
			site: 'vendr.ie',
			standfirst:
				'A modern vending platform: a quieter retail layer built on curation, infrastructure, and data.',
			notes: [
				{ n: '01', name: 'Curation', body: 'What is offered is the product. Chosen, not stocked.' },
				{ n: '02', name: 'Infrastructure', body: 'Placement, supply, and data as one system rather than a fleet.' },
				{ n: '03', name: 'Longevity', body: 'Thoughtful integration over scale. Durability over trend.' }
			]
		},
		{
			folio: 'II',
			name: 'Éirvox',
			href: 'https://eirvox.ie',
			site: 'eirvox.ie',
			standfirst:
				'Verification led enthusiast commerce. A focused specialist now, a curated marketplace over time, with DRIVE as its editorial layer.',
			notes: [
				{ n: '01', name: 'The registry', body: 'A serialised record per item. It ships only where the record is real.' },
				{ n: '02', name: 'Curation', body: 'Someone who knows vouches for it. Fewer, better things.' },
				{ n: '03', name: 'DRIVE', body: 'The editorial layer, and the only place editions are counted.' }
			]
		},
		{
			folio: 'III',
			name: 'Maison Seul',
			href: 'https://maisonseul.com',
			site: 'maisonseul.com',
			standfirst: 'Restraint, form, and cultural permanence. Built for longevity, not velocity.',
			notes: []
		}
	];
</script>

<svelte:head>
	<title>Houses · VNTA</title>
	<meta
		name="description"
		content="The houses stewarded by Vantanéant International: Vendr, Éirvox, and Maison Seul."
	/>
	<meta property="og:title" content="Houses · VNTA" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<!-- STATEMENT -->
	<section class="statement" aria-label="The houses">
		<h1 class="statement__title">The houses</h1>
		<div class="statement__cols">
			<p class="statement__lead">
				Three houses sit under Vantanéant International. Each holds its own name, its own
				system, and its own book.
			</p>
			<p class="statement__muted">
				They are not variations on a parent. A house that only works while we are standing in it
				is not a house, so each is built to be handed the keys.
			</p>
		</div>
	</section>

	<!-- ONE BAND PER HOUSE -->
	{#each houses as house}
		<section class="band house" id={house.name.toLowerCase().replace(' ', '-')} aria-label={house.name}>
			<div class="band__head">
				<p class="band__label eyebrow"><span class="band__folio">{house.folio}</span>House</p>
				<a class="band__aside" href={house.href}>{house.site} &rarr;</a>
			</div>

			<div class="house__body">
				<h2 class="house__name">{house.name}</h2>
				<p class="house__standfirst">{house.standfirst}</p>
			</div>

			{#if house.notes.length}
				<div class="band__items house__notes">
					{#each house.notes as note}
						<article class="item">
							<span class="item__n">{note.n}</span>
							<h3 class="item__name">{note.name}</h3>
							<p class="item__body">{note.body}</p>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	{/each}
</main>

<style>
	.statement {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(16px, 2.2vw, 36px);
		align-items: start;
		padding: clamp(30px, 3.6vw, 56px) 0;
		border-bottom: 1px solid var(--line);
	}
	.statement__title { margin: 0; font-size: var(--t-h2); color: var(--ink); }
	.statement__cols {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(14px, 2.2vw, 36px);
	}
	.statement__lead,
	.statement__muted {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		max-width: 32ch;
		text-wrap: pretty;
	}
	.statement__lead { color: var(--ink); }
	.statement__muted { color: var(--ink-50); }

	/* --- A house ---------------------------------------------------------- */
	.house__body {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(10px, 1.4vw, 18px);
		align-items: baseline;
	}

	/* The house name is the one place on this page that takes display scale.
	   Mixed case, not the tracked caps of the registers: these are names. */
	.house__name {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: var(--t-h3);
		line-height: 1.05;
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}
	.house__standfirst {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		color: var(--ink-50);
		max-width: 44ch;
		text-wrap: pretty;
	}

	.house__notes { margin-top: clamp(24px, 3vw, 40px); }

	@media (min-width: 900px) {
		.statement { grid-template-columns: 150px minmax(0, 1fr); }
		.statement__title { grid-column: 1 / -1; }
		.statement__cols {
			grid-column: 2;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		/* Name in the first third, standfirst beside it, so a house reads as a
		   spread rather than a stack. */
		.house__body { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: clamp(24px, 3vw, 48px); }
	}
</style>
