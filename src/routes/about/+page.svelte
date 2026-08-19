<script lang="ts">
	// About: what the company is, the four values it is built on, and the
	// clients it works with. Values are the brand's own (§1.4), stated in the
	// guideline's words rather than paraphrased.
	const values = [
		{ n: '01', name: 'Restraint', body: 'Strong brands are built through reduction and careful decisions, not excess or decoration.' },
		{ n: '02', name: 'Silence', body: 'Confidence without noise. Form, consistency, and presence in place of explanation.' },
		{ n: '03', name: 'Precision', body: 'Every decision is intentional, structured, and aligned with long term goals.' },
		{ n: '04', name: 'Timelessness', body: 'Systems designed to stay relevant across years, not seasons.' }
	];

	// What a Diagnosis leaves you with, whether or not it goes further.
	const diagnosis = [
		{ n: '01', name: 'A read', body: 'Brand, narrative, and market position, stated plainly.' },
		{ n: '02', name: 'A plan', body: 'Scoped to your situation, not sold from a menu.' },
		{ n: '03', name: 'A decision', body: 'A clear basis for going further, or not.' }
	];

	const clients = [
		{ n: '01', name: 'BUILDT', href: 'https://buildt.ie', body: 'Custom gaming and creator machines, repairs and diagnostics. Dublin.' }
	];
</script>

<svelte:head>
	<title>About · VNTA</title>
	<meta
		name="description"
		content="Vantanéant International is a holding company focused on building and guiding premium brands through strategy, design systems, and clear long-term direction."
	/>
	<meta property="og:title" content="About · VNTA" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<!-- STATEMENT -->
	<section class="statement" aria-label="About VNTA">
		<h1 class="statement__title">The company</h1>
		<div class="statement__cols">
			<p class="statement__lead">
				Vantanéant International is a holding company focused on building and guiding premium
				brands through strategy, design systems, and clear long-term direction.
			</p>
			<p class="statement__muted">
				Our aim is a refined corporate platform where design, fashion, and strategy coexist
				under one disciplined system. We work the way the groups we admire work: quietly, and
				over years.
			</p>
		</div>
	</section>

	<!-- APPROACH -->
	<section class="band" aria-label="How we work">
		<div class="band__head">
			<p class="band__label eyebrow">How we work</p>
		</div>
		<div class="prose">
			<p>
				We take residence inside one brand at a time and stay twelve months. We set direction,
				build the system underneath it, then hand over the keys.
			</p>
			<p>
				We are deliberately small. That is not a stage we are passing through, it is the design.
				One engagement at a time is the only arrangement in which the work stays ours.
			</p>
		</div>
	</section>

	<!-- DIAGNOSIS -->
	<section class="band" id="diagnosis" aria-label="The Diagnosis">
		<div class="band__head">
			<p class="band__label eyebrow">The Diagnosis</p>
			<p class="band__aside">Two weeks &middot; €750 fixed</p>
		</div>
		<div class="band__items">
			{#each diagnosis as item}
				<article class="item">
					<span class="item__n">{item.n}</span>
					<h2 class="item__name">{item.name}</h2>
					<p class="item__body">{item.body}</p>
				</article>
			{/each}
		</div>
		<p class="band__foot">
			Every residency starts here, and it is the only price we publish. Write to
			<a href="mailto:studio@vnta.xyz?subject=Diagnosis">studio@vnta.xyz</a>.
		</p>
	</section>

	<!-- VALUES -->
	<section class="band" id="values" aria-label="Brand values">
		<div class="band__head">
			<p class="band__label eyebrow">Values</p>
		</div>
		<div class="band__items band__items--two">
			{#each values as item}
				<article class="item">
					<span class="item__n">{item.n}</span>
					<h2 class="item__name">{item.name}</h2>
					<p class="item__body">{item.body}</p>
				</article>
			{/each}
		</div>
	</section>

	<!-- NOTE -->
	<section class="band" aria-label="A note from the founder">
		<div class="band__head">
			<p class="band__label eyebrow">A note</p>
		</div>
		<div class="prose">
			<p>
				Most companies say more than they have done. We would rather the reverse, so there is
				not much here.
			</p>
			<p>
				One engagement at a time is the only arrangement in which the work stays ours, and the
				only one in which a founder gets the whole of our attention rather than a share of it.
				If the system only works while we are standing in it, we have built the wrong thing.
			</p>
			<p class="note__sign">
				<span class="sign__name">Renato G.</span><br />
				Founder, Vantanéant International Ltd
			</p>
		</div>
	</section>

	<!-- CLIENTS -->
	<section class="band" id="clients" aria-label="Clients">
		<div class="band__head">
			<p class="band__label eyebrow">Clients</p>
		</div>
		<div class="band__items">
			{#each clients as item}
				<a class="item" href={item.href}>
					<span class="item__n">{item.n}</span>
					<h2 class="item__name">{item.name}</h2>
					<p class="item__body">{item.body}</p>
					<span class="arrow" aria-hidden="true">&rarr;</span>
				</a>
			{/each}
		</div>
	</section>
</main>

<style>
	.note__sign {
		margin: clamp(28px, 3.2vw, 40px) 0 0 !important;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--ink-50);
	}

	.band__foot {
		margin: clamp(24px, 2.6vw, 36px) 0 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--ink-50);
		max-width: 46ch;
	}
	.band__foot a {
		color: var(--ink);
		border-bottom: 1px solid transparent;
		transition: border-color var(--dur) var(--ease);
	}
	.band__foot a:hover { border-bottom-color: var(--ink-35); }

	.statement {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(16px, 2.2vw, 36px);
		align-items: start;
		padding: clamp(30px, 3.6vw, 56px) 0;
	}
	.statement__title {
		margin: 0;
		font-size: var(--t-h2);
		color: var(--ink);
	}
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

	@media (min-width: 900px) {
		/* The title is display type and will not fit the 150px label gutter, so
		   it takes a row of its own; the columns still align to the content
		   track the other bands use. */
		.statement { grid-template-columns: 150px minmax(0, 1fr); }
		.statement__title { grid-column: 1 / -1; }
		.statement__cols {
			grid-column: 2;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
