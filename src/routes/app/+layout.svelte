<script lang="ts">
	// The signed-in shell: a sidebar on wide screens, tabs along the bottom on
	// phones. It decides between sign-in and the app, and loads the person's data once.
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import Icon from '$lib/components/ui/Icon.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';
	import SignIn from '$lib/app/SignIn.svelte';
	import { session } from '$lib/app/session.svelte';
	import { needsAttention } from '$lib/app/format';

	let { children } = $props();
	onMount(() => session.init());

	const items = [
		{ href: '/app', label: 'Home', icon: 'home' },
		{ href: '/app/inbox', label: 'Inbox', icon: 'inbox' },
		{ href: '/app/actions', label: 'Actions', icon: 'check' },
		{ href: '/app/timeline', label: 'Timeline', icon: 'calendar' },
		{ href: '/app/settings', label: 'Settings', icon: 'settings' }
	];
	const path = $derived($page.url.pathname.replace(/\/$/, '') || '/app');
	const active = (href: string) => (href === '/app' ? path === '/app' : path.startsWith(href));
	const waiting = $derived(session.findings.filter(needsAttention).length);
</script>

<svelte:head>
	<title>VNTA</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if session.state === 'loading'}
	<div class="center" role="status">Loading…</div>
{:else if session.state === 'out'}
	<SignIn />
{:else if session.state === 'offline'}
	<div class="center">
		<p>{session.error || 'VNTA could not be reached.'}</p>
		<button class="btn btn--solid" onclick={() => session.init()}>Try again</button>
	</div>
{:else}
	<div class="app">
		<aside class="side">
			<a class="brand" href="{base}/app" aria-label="VNTA Home"><Wordmark height={17} /><span class="dot" aria-hidden="true">.</span></a>
			<nav aria-label="App">
				{#each items as it}
					<a href="{base}{it.href}" aria-current={active(it.href) ? 'page' : undefined}>
						<Icon name={it.icon} size={18} />
						<span>{it.label}</span>
						{#if it.href === '/app/actions' && waiting}<span class="count" aria-label="{waiting} waiting">{waiting}</span>{/if}
					</a>
				{/each}
			</nav>
			<p class="who" title={session.email}>{session.email}</p>
		</aside>
		<div class="main">
			{#if session.error}<p class="banner" role="alert">{session.error}</p>{/if}
			{@render children()}
		</div>
		<nav class="tabs" aria-label="App">
			{#each items as it}
				<a href="{base}{it.href}" aria-current={active(it.href) ? 'page' : undefined}>
					<Icon name={it.icon} size={20} />
					<span>{it.label}</span>
					{#if it.href === '/app/actions' && waiting}<span class="count" aria-label="{waiting} waiting">{waiting}</span>{/if}
				</a>
			{/each}
		</nav>
	</div>
{/if}

<style>
	.center {
		min-height: 100dvh;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 16px;
		color: var(--ink-60);
		background: var(--ground);
	}
	.app {
		min-height: 100dvh;
		background: var(--ground);
		color: var(--ink-80);
	}
	.side {
		display: none;
	}
	.main {
		padding: clamp(20px, 4vw, 48px);
		padding-bottom: 96px; /* clear of the tab bar */
		max-width: 62rem;
		margin: 0 auto;
	}
	.banner {
		margin: 0 0 16px;
		border-left: 2px solid var(--red);
		padding-left: 12px;
		color: var(--ink);
	}
	.dot {
		color: var(--blue);
		font-weight: 700;
		font-size: 1.5rem;
		line-height: 1;
		margin-left: 1px;
	}
	.count {
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 9px;
		background: var(--blue);
		color: #fff;
		font-size: 0.7rem;
		font-weight: 600;
		display: inline-grid;
		place-items: center;
	}
	.tabs {
		position: fixed;
		inset: auto 0 0 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		background: var(--paper);
		border-top: 1px solid var(--line);
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 5;
	}
	.tabs a {
		position: relative;
		display: grid;
		justify-items: center;
		gap: 2px;
		padding: 9px 0 8px;
		font-size: 0.7rem;
		color: var(--ink-60);
		text-decoration: none;
	}
	.tabs a[aria-current='page'] {
		color: var(--ink);
		font-weight: 600;
	}
	.tabs a[aria-current='page'] :global(svg) {
		color: var(--blue);
	}
	.tabs .count {
		position: absolute;
		top: 4px;
		left: calc(50% + 6px);
	}
	.tabs a:focus-visible,
	.side a:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: -2px;
	}
	@media (min-width: 900px) {
		.app {
			display: grid;
			grid-template-columns: 232px minmax(0, 1fr);
		}
		.tabs {
			display: none;
		}
		.main {
			padding-bottom: 48px;
			width: 100%;
		}
		.side {
			display: flex;
			flex-direction: column;
			gap: 28px;
			position: sticky;
			top: 0;
			height: 100dvh;
			padding: 28px 16px;
			border-right: 1px solid var(--line);
			background: var(--paper);
		}
		.brand {
			display: flex;
			align-items: flex-end;
			padding: 0 10px;
			text-decoration: none;
		}
		.side nav {
			display: grid;
			gap: 2px;
		}
		.side nav a {
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 10px;
			border-radius: 10px;
			color: var(--ink-60);
			text-decoration: none;
			font-size: 0.95rem;
		}
		.side nav a:hover {
			background: var(--ground);
			color: var(--ink);
		}
		.side nav a[aria-current='page'] {
			background: var(--ground-2);
			color: var(--ink);
			font-weight: 600;
		}
		.side nav .count {
			margin-left: auto;
		}
		.who {
			margin: auto 10px 0;
			font-size: 0.8rem;
			color: var(--ink-60);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
