<script lang="ts">
	// One note. The words come from $lib/server/notes.ts; the page exists only
	// once the daily job has published it.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import { robotics, siteUrl, company, follow } from '$lib/content/site';
	import { notePath, notesPath, longDate } from '$lib/content/notePaths';

	let { data } = $props();
	const note = $derived(data.note);

	const article = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: note.title,
		description: note.summary,
		datePublished: note.publishedAt,
		url: siteUrl + notePath(note.slug),
		author: { '@type': 'Organization', name: 'VNTA', url: siteUrl },
		publisher: { '@type': 'Organization', name: company.legalName, url: siteUrl },
		...(note.image ? { image: `${siteUrl}/notes/${note.image.file}` } : {})
	});
	// Where this note went, in the order it went there.
	const also = $derived(
		[
			['Mastodon', note.posted.mastodon],
			['Bluesky', note.posted.bluesky],
			['Pixelfed', note.posted.pixelfed]
		]
			.filter(([, p]) => p)
			.map(([name, p]) => ({ name: name as string, url: (p as { url: string }).url }))
	);
</script>

<Seo
	title="{note.title} | VNTA Robotics"
	shareTitle="VNTA Robotics | {note.title}"
	image="/share/robotics.png"
	imageAlt="VNTA Robotics. {robotics.positioning} In development."
	description={note.summary}
	ld={[article]}
/>

<main class="band">
	<article class="wrap note">
		<header class="note__head">
			<p class="note__back"><a href="{base}{notesPath}">{robotics.name} · Notes</a></p>
			<h1 class="note__title">{note.title}</h1>
			<p class="note__meta">
				<time datetime={note.publishedAt}>{longDate(note.publishedAt)}</time>
				<Stage stage={robotics.stage} />
			</p>
		</header>

		<div class="note__cols">
			<div class="note__body">
				{#each note.body as para, i}
					<p class:lead={i === 0}>{para}</p>
				{/each}

				<p class="note__honest">{robotics.honest} {robotics.notSafety}</p>

				{#if also.length}
					<p class="note__also">
						Also posted on
						{#each also as s, i}{i === 0 ? '' : i === also.length - 1 ? ' and ' : ', '}<a href={s.url} rel="me noopener">{s.name}</a>{/each}.
					</p>
				{:else}
					<p class="note__also">
						Follow on
						{#each follow as s, i}{i === 0 ? '' : i === follow.length - 1 ? ' or ' : ', '}<a href={s.href} rel="me noopener">{s.name}</a>{/each}.
					</p>
				{/if}

				<div class="note__cta">
					<a class="btn btn--solid" href="{base}/robotics">
						What VNTA Robotics is
						<Icon name="arrow" size={18} />
					</a>
					<a class="btn btn--ghost" href="{base}/contact">Write to us</a>
				</div>
			</div>

			{#if note.image}
				<figure class="note__fig">
					<img src="{base}/notes/{note.image.file}" alt={note.image.alt} width="1080" height="1350" />
				</figure>
			{/if}
		</div>

		{#if data.older || data.newer}
			<nav class="note__nav" aria-label="More notes">
				{#if data.newer}<a href="{base}{notePath(data.newer.slug)}"><span>Newer</span>{data.newer.title}</a>{:else}<span></span>{/if}
				{#if data.older}<a class="right" href="{base}{notePath(data.older.slug)}"><span>Older</span>{data.older.title}</a>{/if}
			</nav>
		{/if}
	</article>
</main>

<style>
	.note__head {
		display: grid;
		gap: 14px;
		max-width: 46rem;
		margin-bottom: clamp(24px, 3vw, 40px);
	}
	.note__back {
		margin: 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.note__back a {
		color: var(--ink-60);
	}
	.note__back a:hover {
		color: var(--ink);
	}
	.note__title {
		margin: 0;
		font-size: var(--t-h1);
		line-height: 1.05;
		letter-spacing: -0.035em;
		text-wrap: balance;
	}
	.note__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 14px;
		margin: 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.note__cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(24px, 4vw, 56px);
		align-items: start;
	}
	.note__body {
		display: grid;
		gap: 16px;
		max-width: 40rem;
		min-width: 0;
	}
	.note__body p {
		margin: 0;
		font-size: 1.08rem;
		line-height: 1.65;
		white-space: pre-line;
		text-wrap: pretty;
	}
	.note__body p.lead {
		font-size: var(--t-h3);
		font-size: clamp(1.25rem, 1.7vw, 1.45rem);
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.015em;
		color: var(--ink);
	}
	.note__body p.note__honest {
		margin-top: 12px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
		font-size: 0.86rem;
		line-height: 1.55;
		color: var(--ink-60);
	}
	.note__body p.note__also {
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.note__also a {
		color: var(--blue);
		font-weight: 500;
	}
	.note__cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 8px;
	}
	.note__fig {
		margin: 0;
	}
	.note__fig img {
		display: block;
		width: 100%;
		max-width: 420px;
		height: auto;
		border-radius: var(--r-card);
		box-shadow: var(--lift);
	}
	.note__nav {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		margin-top: clamp(36px, 5vw, 64px);
		padding-top: 20px;
		border-top: 1px solid var(--line);
	}
	.note__nav a {
		display: grid;
		gap: 2px;
		font-weight: 600;
		color: var(--ink);
	}
	.note__nav a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.note__nav a span {
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.note__nav .right {
		text-align: right;
		grid-column: 2;
	}
	@media (min-width: 900px) {
		.note__cols {
			grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
		}
	}
</style>
