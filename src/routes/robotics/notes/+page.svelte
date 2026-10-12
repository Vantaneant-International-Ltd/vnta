<script lang="ts">
	// Notes from VNTA Robotics: what is being built, what it found, what is not
	// done. Only notes the daily job has published are listed here; see
	// $lib/server/notes.ts for how that works.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import { robotics, follow } from '$lib/content/site';
	import { notePath, longDate } from '$lib/content/notePaths';
	import { breadcrumb } from '$lib/content/structured';

	let { data } = $props();
	const list = $derived(data.list);
</script>

<Seo
	title="Notes | VNTA Robotics"
	shareTitle="VNTA Robotics | Notes"
	image="/share/robotics.png"
	imageAlt="VNTA Robotics. {robotics.positioning} In development."
	description="Short notes from VNTA Robotics on what is being built, what it found and what is not done. {robotics.honest}"
	ld={[breadcrumb('Robotics', '/robotics')]}
/>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="VNTA Robotics notes" href="{base}/robotics/notes/rss.xml" />
</svelte:head>

<main class="band">
	<div class="wrap">
		<div class="head">
			<div class="top">
				<p class="eyebrow">{robotics.name} · Notes</p>
				<Stage stage={robotics.stage} />
			</div>
			<h1 class="head__title">What we built, what it found, what is not done.</h1>
			<p class="head__text">{robotics.honest}</p>
		</div>

		{#if list.length === 0}
			<p class="empty card">Nothing has been published yet.</p>
		{:else}
			<ol class="list">
				{#each list as n}
					<li>
						<a class="item card" href="{base}{notePath(n.slug)}">
							<span class="item__meta"><time datetime={n.publishedAt}>{longDate(n.publishedAt)}</time><span>{n.kind}</span></span>
							<span class="item__title">{n.title}</span>
							<span class="item__sum">{n.summary}</span>
						</a>
					</li>
				{/each}
			</ol>
		{/if}
		<p class="feed">
			Follow on
			{#each follow as s, i}{#if i > 0}{' '}or{' '}{/if}<a class="link" href={s.href} rel="me noopener">{s.name}</a>{/each}{#if list.length > 0}, or without an account by <a class="link" href="{base}/robotics/notes/rss.xml">RSS feed</a>{/if}.
		</p>
	</div>
</main>

<style>
	.top {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.head__title {
		font-size: var(--t-h1);
		letter-spacing: -0.035em;
	}
	.empty {
		margin: 0;
		padding: 22px;
		color: var(--ink-60);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
		max-width: 52rem;
	}
	.item {
		display: grid;
		gap: 6px;
		padding: 18px 20px;
		transition: border-color var(--dur) var(--ease);
	}
	.item:hover {
		border-color: var(--ink-40);
	}
	.item__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.item__title {
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.item__sum {
		color: var(--ink-60);
		line-height: 1.5;
		text-wrap: pretty;
	}
	.feed {
		margin: 20px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.link {
		color: var(--blue);
		font-weight: 500;
	}
	.link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
