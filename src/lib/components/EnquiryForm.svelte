<script lang="ts">
	// The enquiry form: four boxes, two of them optional. Posts to the Pages
	// Function at /api/inquiry, which saves to D1 and emails the studio. The
	// function's columns are fixed (name, email, company, notes), so a phone
	// number travels inside the notes rather than as a new column.
	import { studioEmail, replyWithin } from '$lib/content/site';

	let { source = '/' }: { source?: string } = $props();

	let name = $state('');
	let contact = $state(''); // a phone number or an email, whichever they prefer
	let business = $state('');
	let notes = $state('');
	let website = $state(''); // honeypot, never shown

	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let error = $state('');

	const fallback = `That did not send. Email ${studioEmail} and we will pick it up there.`;

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;

		if (!name.trim()) {
			status = 'error';
			error = 'Add your name so we know who to reply to.';
			return;
		}
		if (!contact.trim()) {
			status = 'error';
			error = 'Add a phone number or an email so we can reply.';
			return;
		}

		status = 'sending';
		error = '';
		const isEmail = contact.includes('@');
		const body = [!isEmail && `Phone: ${contact.trim()}`, notes.trim()].filter(Boolean).join('\n\n');

		try {
			const res = await fetch('/api/inquiry', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name,
					email: isEmail ? contact.trim() : '',
					company: business,
					notes: body,
					website,
					source
				})
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.ok) {
				status = 'sent';
			} else {
				status = 'error';
				error = data.error || fallback;
			}
		} catch {
			status = 'error';
			error = fallback;
		}
	}
</script>

{#if status === 'sent'}
	<p class="sent" role="status">
		Sent. We will reply within {replyWithin} with a fixed price.
	</p>
{:else}
	<form class="form" onsubmit={submit} novalidate>
		<div class="field">
			<label for="eq-name">Your name</label>
			<input id="eq-name" name="name" type="text" bind:value={name} autocomplete="name" />
		</div>

		<div class="field">
			<label for="eq-contact">Phone or email</label>
			<input id="eq-contact" name="contact" type="text" bind:value={contact} />
		</div>

		<div class="field field--wide">
			<label for="eq-business">Your business <span class="opt">name or website</span></label>
			<input
				id="eq-business"
				name="business"
				type="text"
				bind:value={business}
				autocomplete="organization"
			/>
		</div>

		<div class="field field--wide">
			<label for="eq-notes">What do you need? <span class="opt">optional</span></label>
			<textarea id="eq-notes" name="notes" rows="3" bind:value={notes}></textarea>
		</div>

		<!-- Honeypot. Hidden from people, tempting to bots. -->
		<div class="hp" aria-hidden="true">
			<label for="eq-website">Website</label>
			<input id="eq-website" name="website" type="text" bind:value={website} tabindex="-1" />
		</div>

		<div class="actions">
			<button class="btn btn--solid" type="submit" disabled={status === 'sending'}>
				{status === 'sending' ? 'Sending' : 'Send'}
			</button>
			<span class="actions__alt">
				or email <a href="mailto:{studioEmail}?subject=Website%20enquiry">{studioEmail}</a>
			</span>
		</div>

		{#if status === 'error'}
			<p class="error" role="alert">{error}</p>
		{/if}
	</form>
{/if}

<style>
	.form {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}
	.field label {
		font-size: var(--t-small);
		font-weight: 600;
		color: var(--ink);
	}
	.opt {
		font-weight: 400;
		color: var(--ink-60);
		margin-left: 0.3em;
	}
	/* Soft filled fields with rounded corners, like the ones on a phone. */
	.field input,
	.field textarea {
		width: 100%;
		box-sizing: border-box;
		font-family: var(--font-ui);
		font-size: 1.0625rem; /* 16px or more keeps iOS from zooming on focus */
		line-height: 1.4;
		color: var(--ink);
		background: var(--field);
		border: 1px solid var(--line);
		border-radius: var(--r-field);
		padding: 13px 14px;
		transition: border-color var(--dur) var(--ease);
	}
	.field textarea {
		resize: vertical;
		min-height: 5.5rem;
		line-height: 1.5;
	}
	.field input:hover,
	.field textarea:hover,
	.field input:focus,
	.field textarea:focus {
		border-color: var(--ink-60);
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
		padding-top: 4px;
	}
	.actions__alt {
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.actions__alt a {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--ink-40);
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}

	.error,
	.sent {
		margin: 0;
		font-size: var(--t-body);
		line-height: 1.45;
		color: var(--ink);
	}
	.error {
		background: var(--card);
		border-radius: var(--r-field);
		padding: 12px 14px;
	}
	.sent {
		font-family: var(--font-display);
		font-size: var(--t-h3);
		line-height: 1.2;
		max-width: 22ch;
	}

	@media (min-width: 640px) {
		.form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.field--wide,
		.actions,
		.error {
			grid-column: 1 / -1;
		}
	}
</style>
