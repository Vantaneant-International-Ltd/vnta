<script lang="ts">
	// Journal: dated notes, newest first, each signed. One entry for now, which
	// is the point. The index sits in the left gutter and the note runs beside
	// it, so a second entry needs no new layout.
	const entries = [
		{
			n: '01',
			date: 'August 2025',
			title: 'On staying small',
			body: [
				'Most companies say more than they have done. We would rather the reverse, so this is the only place we write anything down.',
				'We are deliberately small. That is not a stage we are passing through, it is the design. One engagement at a time is the only arrangement in which the work stays ours, and the only one in which a founder gets the whole of our attention rather than a share of it.',
				'We take residence inside one brand and stay twelve months. We set direction, build the system underneath it, then hand over the keys. If the system only works while we are standing in it, we have built the wrong thing.',
				'There is not much else to say until the work says it.'
			]
		}
	];
</script>

<svelte:head>
	<title>Journal · VNTA</title>
	<meta
		name="description"
		content="Notes from Vantanéant International. Written rarely, and only when there is something to say."
	/>
	<meta property="og:title" content="Journal · VNTA" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<section class="statement" aria-label="Journal">
		<h1 class="statement__title">Journal</h1>
		<p class="statement__muted">
			Written rarely, and only when there is something to say.
		</p>
	</section>

	{#each entries as entry}
		<article class="band" aria-label={entry.title}>
			<div class="band__head entry__meta">
				<p class="band__label eyebrow">{entry.date}</p>
				<span class="entry__n">{entry.n}</span>
			</div>

			<div class="entry">
				<h2 class="entry__title">{entry.title}</h2>
				<div class="prose">
					{#each entry.body as para}
						<p>{para}</p>
					{/each}
				</div>
				<p class="entry__sign">
					<span class="sign__name">Renato G.</span><br />
					Founder, Vantanéant International Ltd
				</p>
			</div>
		</article>
	{/each}
</main>

<style>
	.statement {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(12px, 2vw, 32px);
		align-items: baseline;
		padding: clamp(30px, 3.6vw, 56px) 0;
		border-bottom: 1px solid var(--line);
	}
	.statement__title { margin: 0; font-size: var(--t-h2); color: var(--ink); }
	.statement__muted {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		color: var(--ink-50);
		max-width: 32ch;
	}

	.entry__meta { align-items: baseline; }
	.entry__n {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--ink-35);
	}

	.entry__title {
		margin: 0 0 clamp(14px, 1.6vw, 20px);
		font-size: var(--t-h3);
		color: var(--ink);
	}

	.entry__sign {
		margin: clamp(28px, 3.2vw, 40px) 0 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-50);
	}

	@media (min-width: 900px) {
		/* auto, not a fixed gutter: the display title sizes its own track and
		   can never overflow into the line beside it. */
		.statement { grid-template-columns: auto minmax(0, 1fr); }
	}
</style>
