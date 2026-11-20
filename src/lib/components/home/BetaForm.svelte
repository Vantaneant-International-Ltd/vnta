<script lang="ts">
	// The private-beta list. It reuses the contact endpoint (/api/inquiry, which
	// saves to D1) with a source of "/beta", so no new infrastructure is needed.
	// It only exists on Cloudflare; locally the form shows its error message.
	import { contactEmail } from '$lib/content/site';
	import { base } from '$app/paths';

	let email = $state('');
	let name = $state('');
	let website = $state(''); // honeypot, never shown
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let error = $state('');

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (status === 'sending') return;
		if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
			status = 'error';
			error = 'Add an email address we can reach you on.';
			return;
		}
		status = 'sending';
		error = '';
		try {
			const res = await fetch('/api/inquiry', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: name.trim() || 'Beta list',
					email: email.trim(),
					notes: 'Private beta sign-up (VNTA Personal)',
					website,
					source: '/beta'
				})
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.ok) {
				status = 'sent';
			} else {
				status = 'error';
				error = data.error || `That did not send. Email ${contactEmail} and we will add you.`;
			}
		} catch {
			status = 'error';
			error = `That did not send. Email ${contactEmail} and we will add you.`;
		}
	}
</script>

{#if status === 'sent'}
	<div class="done" role="status">
		<h3>You are on the list.</h3>
		<p>We will write to you when there is room in the private beta. We will not add you to anything else.</p>
	</div>
{:else}
	<form onsubmit={submit} novalidate>
		<label>
			<span>Email</span>
			<input type="email" autocomplete="email" inputmode="email" bind:value={email} required aria-describedby="beta-note" />
		</label>
		<label>
			<span>Name <em>optional</em></span>
			<input type="text" autocomplete="name" bind:value={name} />
		</label>
		<input class="hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" bind:value={website} />
		<button class="btn btn--solid" type="submit" disabled={status === 'sending'}>
			{status === 'sending' ? 'Sending…' : 'Join the private beta'}
		</button>
		<p id="beta-note" class="note">
			We will use your email only to contact you about the beta. See the <a href="{base}/privacy">privacy policy</a>.
		</p>
		{#if status === 'error'}<p class="err" role="alert">{error}</p>{/if}
	</form>
{/if}

<style>
	form {
		display: grid;
		gap: 16px;
		max-width: 28rem;
	}
	label {
		display: grid;
		gap: 6px;
		font-size: var(--t-small);
		color: var(--ink-80);
	}
	em {
		font-style: normal;
		color: var(--ink-40);
		margin-left: 6px;
	}
	input[type='email'],
	input[type='text'] {
		min-height: 48px;
		padding: 0 14px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-ctl);
		background: var(--field);
		color: var(--ink);
		font: inherit;
	}
	input:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
	}
	.note {
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-60);
	}
	.note a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.err {
		margin: 0;
		color: var(--ink);
		border-left: 2px solid var(--red);
		padding-left: 12px;
		font-size: var(--t-small);
	}
	.done h3 {
		margin: 0 0 8px;
		font-size: var(--t-h2);
		letter-spacing: -0.02em;
	}
	.done p {
		margin: 0;
		color: var(--ink-60);
	}
</style>
