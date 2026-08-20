<script lang="ts">
	// The home spread: the mark at scale, the statement, the companies. Chrome
	// comes from the layout. Proportions follow the reference layout; the type
	// and palette follow the guideline.
	import { base } from '$app/paths';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	// Who we work for, shown under the companies we own.
	const clients = [
		{ n: '01', name: 'BUILDT', href: 'https://buildt.ie', body: 'Custom gaming and creator machines, repairs and diagnostics. Dublin.' },
		{ n: '02', name: 'EZGO Autoworks', href: 'https://ezgoautoworks.ie', body: 'A full service garage. Servicing, repairs, and diagnostics. Ireland.' }
	];

	const companies = [
		{ n: '01', name: 'Vendr', href: 'https://vendr.ie', body: 'Commerce led. Operational clarity and modern distribution.' },
		{ n: '02', name: 'Eirvox', href: 'https://eirvox.ie', body: 'Communications and signal. Voice, narrative, transmission.' },
		{ n: '03', name: 'Maison Seul', href: 'https://maisonseul.com', body: 'Restraint and form. Built for longevity, not velocity.' }
	];
</script>

<svelte:head>
	<title>VNTA</title>
	<meta
		name="description"
		content="Vantanéant International is a holding company building and guiding premium brands through strategy, design systems, and long-term direction."
	/>
	<meta property="og:title" content="VNTA" />
	<meta
		property="og:description"
		content="A holding company. One brand at a time, twelve months in residence."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<!-- HERO -->
	<section class="hero" aria-label="Vantanéant International">
		<h1 class="hero__mark"><Wordmark height={0} label="VNTA" /></h1>
		<div class="hero__side">
			<p class="eyebrow">Holding company</p>
			<p class="hero__claim">One brand<br />at a time.</p>
		</div>
	</section>

	<!-- STATEMENT -->
	<section class="statement" aria-label="What we do">
		<div class="statement__text">
			<p class="statement__lead">
				Vantanéant International is a holding company building and guiding premium brands
				through strategy, design systems, and clear long-term direction.
			</p>
			<p class="statement__muted">
				We take residence inside one brand at a time, set direction, build the system
				underneath it, then hand over the keys.
			</p>
		</div>
		<a class="statement__link" href="{base}/about">
			Our approach <span class="arrow" aria-hidden="true">&rarr;</span>
		</a>
	</section>

	<!-- COMPANIES -->
	<section class="band" id="companies" aria-label="Our companies">
		<div class="band__head">
			<p class="band__label eyebrow"><span class="band__folio">I</span>Our companies</p>
		</div>
		<div class="band__items">
			{#each companies as item}
				<a class="item" href={item.href}>
					<span class="item__n">{item.n}</span>
					<h2 class="item__name">{item.name}</h2>
					<p class="item__body">{item.body}</p>
					<span class="arrow" aria-hidden="true">&rarr;</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- CLIENTS -->
	<section class="band" id="clients" aria-label="Clients">
		<div class="band__head">
			<p class="band__label eyebrow"><span class="band__folio">II</span>Clients</p>
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

	<!-- DIAGNOSIS: how a brand joins the list above -->
	<section class="band" id="diagnosis" aria-label="The Diagnosis">
		<div class="band__head">
			<p class="band__label eyebrow"><span class="band__folio">III</span>The Diagnosis</p>
			<p class="band__aside">Two weeks &middot; €750 fixed</p>
		</div>
		<div class="offer">
			<p class="offer__body">
				Every residency starts here, and it is the only price we publish. A clear read on brand,
				narrative, and position, and a scoped plan, whether or not we go further.
			</p>
			<a class="offer__link" href="{base}/contact">
				Begin a Diagnosis <span class="arrow" aria-hidden="true">&rarr;</span>
			</a>
		</div>
	</section>
</main>

<style>
	/* --- Hero: the drawn mark at scale, the claim set against it ----------- */
	.hero {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(16px, 2.6vw, 46px);
		align-items: end;
		padding: clamp(28px, 3.8vw, 58px) 0 clamp(24px, 3vw, 46px);
	}

	/* The mark is drawn, not typed: it scales to its column so it stays the real
	   wordmark rather than a typeface impersonating it (§2.2). */
	.hero__mark { margin: 0; line-height: 0; color: var(--ink); }
	.hero__mark :global(svg) { width: 100%; height: auto !important; }

	.hero__side { padding-bottom: clamp(2px, 0.6vw, 8px); }
	.hero__claim {
		margin: clamp(10px, 1.2vw, 16px) 0 0;
		font-family: var(--font-display);
		font-weight: 400;
		font-size: clamp(1.6rem, 2.8vw, 2.5rem);
		line-height: 1.12;
		letter-spacing: var(--track-tight);
		color: var(--ink);
	}

	/* --- Statement -------------------------------------------------------- */
	.statement {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(14px, 2.2vw, 36px);
		align-items: start;
		padding: clamp(32px, 3.8vw, 60px) 0;
	}
	/* The grey line sits under the black one, not beside it. */
	.statement__text {
		display: flex;
		flex-direction: column;
		gap: clamp(14px, 1.6vw, 22px);
	}
	.statement__lead,
	.statement__muted {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		max-width: 30ch;
		text-wrap: pretty;
	}
	.statement__lead { color: var(--ink); }
	.statement__muted { color: var(--ink-50); }

	.statement__link {
		justify-self: start;
		align-self: end;
		font-size: 0.81rem;
		color: var(--ink-70);
		border-bottom: 1px solid transparent;
		padding-bottom: 3px;
		white-space: nowrap;
		transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}
	.statement__link:hover { color: var(--ink); border-bottom-color: var(--ink-35); }

	/* --- The offer: the same spread as the statement --------------------- */
	.offer {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(14px, 2.2vw, 36px);
		align-items: end;
	}
	.offer__body {
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(1.02rem, 1.25vw, 1.15rem);
		line-height: 1.46;
		color: var(--ink-50);
		max-width: 42ch;
		text-wrap: pretty;
	}
	.offer__link {
		justify-self: start;
		font-size: 0.81rem;
		color: var(--ink-70);
		border-bottom: 1px solid transparent;
		padding-bottom: 3px;
		white-space: nowrap;
		transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
	}
	.offer__link:hover { color: var(--ink); border-bottom-color: var(--ink-35); }

	@media (min-width: 900px) {
		/* The mark holds the left 58% of the page, as in the reference. */
		.hero { grid-template-columns: 58% minmax(0, 1fr); }
		/* Text in the first third, the link in the last, and the middle left
		   empty on purpose. */
		.statement { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.statement__text { grid-column: 1; }
		.statement__link { grid-column: 3; align-self: end; }
		/* The offer keeps the statement's rhythm: text left, link in the last
		   third, middle empty. */
		.offer { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.offer__body { grid-column: 1 / span 2; max-width: 46ch; }
		.offer__link { grid-column: 3; }
	}
</style>
