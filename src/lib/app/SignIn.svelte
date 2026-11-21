<script lang="ts">
	// Email, then the six-digit code that was sent to it. No password.
	import { api, ApiFailure } from './api';
	import { session } from './session.svelte';
	import Wordmark from '$lib/components/ui/Wordmark.svelte';

	let step = $state<'email' | 'code'>('email');
	let email = $state('');
	let code = $state('');
	let busy = $state(false);
	let error = $state('');

	async function send(e: SubmitEvent) {
		e.preventDefault();
		busy = true;
		error = '';
		try {
			await api.start(email.trim());
			step = 'code';
		} catch (err) {
			error = err instanceof ApiFailure ? err.message : 'Something went wrong.';
		} finally {
			busy = false;
		}
	}
	async function verify(e: SubmitEvent) {
		e.preventDefault();
		busy = true;
		error = '';
		try {
			await api.verify(email.trim(), code);
			await session.init();
		} catch (err) {
			error = err instanceof ApiFailure ? err.message : 'Something went wrong.';
		} finally {
			busy = false;
		}
	}
</script>

<main class="wrap">
	<div class="card">
		<div class="mark"><Wordmark height={18} /><span class="dot" aria-hidden="true">.</span></div>
		{#if step === 'email'}
			<h1>Sign in</h1>
			<p class="sub">We will email you a six-digit code. There is no password to remember.</p>
			<form onsubmit={send}>
				<label>
					<span>Email</span>
					<input type="email" autocomplete="email" inputmode="email" required bind:value={email} />
				</label>
				<button class="btn btn--solid" disabled={busy}>{busy ? 'Sending…' : 'Send me a code'}</button>
			</form>
		{:else}
			<h1>Check your email</h1>
			<p class="sub">We sent a code to <b>{email}</b>. It works for 10 minutes.</p>
			<form onsubmit={verify}>
				<label>
					<span>Six-digit code</span>
					<input inputmode="numeric" autocomplete="one-time-code" maxlength="7" pattern="[0-9 ]*" required bind:value={code} />
				</label>
				<button class="btn btn--solid" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
				<button type="button" class="link" onclick={() => { step = 'email'; code = ''; error = ''; }}>Use a different email</button>
			</form>
		{/if}
		{#if error}<p class="err" role="alert">{error}</p>{/if}
		<p class="fine">VNTA is in private development. New accounts are created the first time an email signs in.</p>
	</div>
</main>

<style>
	.wrap {
		min-height: 100dvh;
		display: grid;
		place-items: center;
		padding: 24px;
		background: var(--ground);
	}
	.card {
		width: min(100%, 26rem);
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: clamp(24px, 5vw, 36px);
		display: grid;
		gap: 14px;
	}
	.mark {
		display: flex;
		align-items: flex-end;
		margin-bottom: 8px;
	}
	.dot {
		color: var(--blue);
		font-weight: 700;
		font-size: 1.5rem;
		line-height: 1;
		margin-left: 1px;
	}
	h1 {
		margin: 0;
		font-size: 1.7rem;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.sub {
		margin: 0;
		color: var(--ink-60);
	}
	form {
		display: grid;
		gap: 14px;
		margin-top: 6px;
	}
	label {
		display: grid;
		gap: 6px;
		font-size: var(--t-small);
		color: var(--ink-80);
	}
	input {
		min-height: 48px;
		padding: 0 14px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-ctl);
		background: var(--field);
		color: var(--ink);
		font: inherit;
		letter-spacing: 0.02em;
	}
	input:focus-visible,
	.link:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.link {
		background: none;
		border: 0;
		font: inherit;
		font-size: var(--t-small);
		color: var(--blue);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
		justify-self: start;
	}
	.err {
		margin: 0;
		border-left: 2px solid var(--red);
		padding-left: 12px;
		color: var(--ink);
		font-size: var(--t-small);
	}
	.fine {
		margin: 6px 0 0;
		font-size: 0.8rem;
		color: var(--ink-60);
	}
</style>
