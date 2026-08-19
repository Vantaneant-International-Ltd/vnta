<script lang="ts">
	// Contact posts to the Pages Function at /api/inquiry, which captures to D1
	// and optionally emails. A mail draft is kept beside it: a visitor without a
	// mail client was the reason the old mailto quietly lost enquiries, and a
	// visitor who prefers their own client should not be forced through a form.
	let name = $state('');
	let email = $state('');
	let company = $state('');
	let notes = $state('');
	let website = $state(''); // honeypot, never shown

	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let error = $state('');

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;
		status = 'sending';
		error = '';
		try {
			const res = await fetch('/api/inquiry', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email, company, notes, website, source: '/contact' })
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.ok) {
				status = 'sent';
			} else {
				status = 'error';
				error = data.error || 'Could not send. Please email studio@vnta.xyz.';
			}
		} catch {
			status = 'error';
			error = 'Could not send. Please email studio@vnta.xyz.';
		}
	}
</script>

<svelte:head>
	<title>Contact · VNTA</title>
	<meta
		name="description"
		content="Write to Vantanéant International. Every residency begins with a Diagnosis: two weeks, €750 fixed."
	/>
	<meta property="og:title" content="Contact · VNTA" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main>
	<section class="statement" aria-label="Contact">
		<h1 class="statement__title">Contact</h1>
		<p class="statement__muted">
			One engagement at a time, so we answer everything ourselves. Expect a reply within two
			working days.
		</p>
	</section>

	<section class="band" aria-label="Write to us">
		<div class="band__head">
			<p class="band__label eyebrow">Write to us</p>
			<p class="band__aside">studio@vnta.xyz</p>
		</div>

		{#if status === 'sent'}
			<p class="sent">
				Received. We read everything ourselves and will come back to you within two working
				days.
			</p>
		{:else}
			<form class="form" onsubmit={submit} novalidate>
				<div class="field">
					<label for="name">Name</label>
					<input id="name" name="name" type="text" bind:value={name} autocomplete="name" />
				</div>

				<div class="field">
					<label for="email">Email</label>
					<input id="email" name="email" type="email" bind:value={email} autocomplete="email" />
				</div>

				<div class="field">
					<label for="company">Company</label>
					<input
						id="company"
						name="company"
						type="text"
						bind:value={company}
						autocomplete="organization"
					/>
				</div>

				<div class="field field--wide">
					<label for="notes">What are you building?</label>
					<textarea id="notes" name="notes" rows="5" bind:value={notes}></textarea>
				</div>

				<!-- Honeypot. Hidden from people, tempting to bots. -->
				<div class="hp" aria-hidden="true">
					<label for="website">Website</label>
					<input id="website" name="website" type="text" bind:value={website} tabindex="-1" />
				</div>

				<div class="actions">
					<button class="send" type="submit" disabled={status === 'sending'}>
						{status === 'sending' ? 'Sending' : 'Send'}
					</button>
					<span class="actions__alt">
						or write to <a href="mailto:studio@vnta.xyz?subject=Enquiry">studio@vnta.xyz</a>
					</span>
				</div>

				{#if status === 'error'}
					<p class="error" role="alert">{error}</p>
				{/if}
			</form>
		{/if}
	</section>
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
		max-width: 34ch;
	}

	/* --- Form: hairlines and space, like everything else ------------------ */
	.form {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(18px, 2vw, 28px);
		max-width: 46rem;
	}
	.field { display: flex; flex-direction: column; gap: 8px; }
	.field label {
		font-family: var(--font-sc);
		font-size: var(--t-label);
		letter-spacing: var(--track-label);
		text-transform: uppercase;
		color: var(--ink-50);
	}
	.field input,
	.field textarea {
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--ink);
		background: transparent;
		border: 0;
		border-bottom: 1px solid var(--line);
		border-radius: 0;
		padding: 8px 0;
		transition: border-color var(--dur) var(--ease);
	}
	.field textarea { resize: vertical; line-height: 1.55; }
	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-bottom-color: var(--ink);
	}

	.hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }

	.actions {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--s-4) clamp(18px, 2.4vw, 32px);
	}
	.send {
		font-family: var(--font-body);
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--paper);
		background: var(--ink);
		border: 1px solid var(--ink);
		border-radius: var(--radius);
		padding: 12px 30px;
		cursor: pointer;
		transition: background var(--dur) var(--ease);
	}
	.send:hover:not(:disabled) { background: var(--ink-85); }
	.send:disabled { opacity: 0.5; cursor: default; }

	.actions__alt { font-size: 0.85rem; color: var(--ink-50); }
	.actions__alt a {
		color: var(--ink);
		border-bottom: 1px solid transparent;
		transition: border-color var(--dur) var(--ease);
	}
	.actions__alt a:hover { border-bottom-color: var(--ink-35); }

	.sent,
	.error {
		margin: 0;
		font-size: 1.0625rem;
		line-height: 1.6;
		max-width: 46ch;
	}
	.sent { color: var(--ink); }
	.error { color: var(--ink); font-size: 0.9rem; }

	@media (min-width: 700px) {
		.form { grid-template-columns: repeat(3, minmax(0, 1fr)); }
		.field--wide { grid-column: 1 / -1; }
		.actions { grid-column: 1 / -1; }
		.error { grid-column: 1 / -1; }
	}
</style>
