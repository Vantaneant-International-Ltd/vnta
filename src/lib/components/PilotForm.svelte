<script lang="ts">
	// The pilot request: a qualification form, not a checkout. It asks what an
	// engineer would need to judge technical fit, and promises nothing. Posts
	// to the same Pages Function as the contact form (/api/inquiry). That
	// function's columns are fixed, so the offer travels as `engagement`, the
	// deployment date as `timeline`, and everything else is written into the
	// notes as labelled lines.
	import { contactEmail } from '$lib/content/site';
	import { form, interests } from '$lib/content/pricing';

	let { interest = $bindable(interests[0]), source = '/robotics/pricing' }: { interest?: string; source?: string } = $props();

	let name = $state('');
	let email = $state('');
	let company = $state('');
	let role = $state('');
	let country = $state('');
	let maker = $state('');
	let system = $state('');
	let protocol = $state('');
	let robots = $state('');
	let fleet = $state('');
	let process = $state('');
	let problem = $state('');
	let date = $state('');
	let docs = $state('');
	let website = $state(''); // honeypot, never shown

	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let error = $state('');
	const fallback = `That did not send. Email ${contactEmail} and we will pick it up there.`;

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;
		const missing = !name.trim() ? 'your name' : !email.includes('@') ? 'an email address we can reply to' : !company.trim() ? 'your company' : !problem.trim() ? 'what you want to validate' : '';
		if (missing) {
			status = 'error';
			error = `Add ${missing}.`;
			return;
		}
		status = 'sending';
		error = '';
		const lines: [string, string][] = [
			['Role', role],
			['Country', country],
			['Robot manufacturer', maker],
			['Robot or fleet system', system],
			['Protocol', protocol],
			['Number of robots', robots],
			['Existing fleet manager', fleet],
			['Current commissioning process', process],
			['What they want to validate', problem],
			['Documentation or API availability', docs]
		];
		const notes = lines
			.filter(([, v]) => v.trim())
			.map(([k, v]) => `${k}: ${v.trim()}`)
			.join('\n');
		try {
			const res = await fetch('/api/inquiry', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email: email.trim(), company, engagement: `VNTA Robotics: ${interest}`, timeline: date, notes, website, source })
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data.ok) status = 'sent';
			else {
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
	<p class="sent" role="status">{form.thanks}</p>
{:else}
	<form class="form" onsubmit={submit} novalidate>
		<div class="field field--wide">
			<label for="pf-interest">What is this about?</label>
			<select id="pf-interest" bind:value={interest}>
				{#each interests as i}<option value={i}>{i}</option>{/each}
			</select>
		</div>

		<div class="field">
			<label for="pf-name">Name</label>
			<input id="pf-name" type="text" bind:value={name} autocomplete="name" />
		</div>
		<div class="field">
			<label for="pf-email">Work email</label>
			<input id="pf-email" type="email" bind:value={email} autocomplete="email" />
		</div>
		<div class="field">
			<label for="pf-company">Company</label>
			<input id="pf-company" type="text" bind:value={company} autocomplete="organization" />
		</div>
		<div class="field">
			<label for="pf-role">Role <span class="opt">optional</span></label>
			<input id="pf-role" type="text" bind:value={role} autocomplete="organization-title" />
		</div>
		<div class="field">
			<label for="pf-country">Country <span class="opt">optional</span></label>
			<input id="pf-country" type="text" bind:value={country} autocomplete="country-name" />
		</div>
		<div class="field">
			<label for="pf-date">Expected deployment date <span class="opt">optional</span></label>
			<input id="pf-date" type="text" bind:value={date} placeholder="For example: spring 2027" />
		</div>

		<p class="group">The integration</p>

		<div class="field">
			<label for="pf-maker">Robot manufacturer <span class="opt">optional</span></label>
			<input id="pf-maker" type="text" bind:value={maker} />
		</div>
		<div class="field">
			<label for="pf-system">Robot or fleet system <span class="opt">optional</span></label>
			<input id="pf-system" type="text" bind:value={system} />
		</div>
		<div class="field">
			<label for="pf-protocol">Protocol, if known <span class="opt">optional</span></label>
			<input id="pf-protocol" type="text" bind:value={protocol} placeholder="VDA 5050, ROS 2, a vendor API" />
		</div>
		<div class="field">
			<label for="pf-robots">Number of robots <span class="opt">optional</span></label>
			<input id="pf-robots" type="text" inputmode="numeric" bind:value={robots} />
		</div>
		<div class="field field--wide">
			<label for="pf-fleet">Existing fleet manager <span class="opt">optional</span></label>
			<input id="pf-fleet" type="text" bind:value={fleet} />
		</div>
		<div class="field field--wide">
			<label for="pf-process">How do you commission an integration today? <span class="opt">optional</span></label>
			<textarea id="pf-process" rows="2" bind:value={process}></textarea>
		</div>
		<div class="field field--wide">
			<label for="pf-problem">What do you want to validate?</label>
			<textarea id="pf-problem" rows="3" bind:value={problem}></textarea>
		</div>
		<div class="field field--wide">
			<label for="pf-docs">Technical documentation or API access <span class="opt">optional</span></label>
			<input id="pf-docs" type="text" bind:value={docs} placeholder="Is there documentation, a test environment, an API we could use?" />
		</div>

		<!-- Honeypot. Hidden from people, tempting to bots. -->
		<div class="hp" aria-hidden="true">
			<label for="pf-website">Website</label>
			<input id="pf-website" type="text" bind:value={website} tabindex="-1" />
		</div>

		<div class="actions">
			<button class="btn btn--solid" type="submit" disabled={status === 'sending'}>
				{status === 'sending' ? 'Sending' : form.submit}
			</button>
			<span class="actions__alt">No payment is taken. Or email <a href="mailto:{contactEmail}">{contactEmail}</a></span>
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
		gap: 14px;
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
	.field input,
	.field textarea,
	.field select {
		width: 100%;
		box-sizing: border-box;
		font-family: var(--font-ui);
		font-size: 1rem; /* 16px keeps iOS from zooming on focus */
		line-height: 1.4;
		color: var(--ink);
		background: var(--field);
		border: 1px solid var(--line);
		border-radius: var(--r-ctl);
		padding: 11px 13px;
		transition: border-color var(--dur) var(--ease);
	}
	.field select {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%235c6778' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m1 1.5 5 5 5-5'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 14px center;
		padding-right: 38px;
	}
	.field textarea {
		resize: vertical;
		line-height: 1.5;
	}
	.field input::placeholder {
		color: var(--ink-40);
	}
	.field input:hover,
	.field textarea:hover,
	.field select:hover,
	.field input:focus,
	.field textarea:focus,
	.field select:focus {
		border-color: var(--blue);
	}
	.group {
		margin: 10px 0 0;
		padding-top: 16px;
		border-top: 1px solid var(--line-soft);
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
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
		padding-top: 6px;
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
		line-height: 1.5;
		color: var(--ink);
	}
	.error {
		background: var(--red-soft);
		color: var(--red);
		border-radius: var(--r-ctl);
		padding: 12px 14px;
	}
	.sent {
		font-size: var(--t-lede);
		font-weight: 600;
		max-width: 34ch;
	}
	@media (min-width: 640px) {
		.form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.field--wide,
		.group,
		.actions,
		.error {
			grid-column: 1 / -1;
		}
	}
</style>
