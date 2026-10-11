<script lang="ts">
	// One machine after one validation run: for each capability, what its
	// interface declares, and what the run verified.
	//
	// This is not a mock-up. The rows are the capability records the Runtime
	// produced on 11 October 2026 for the one external test subject: an
	// open-source VDA 5050 virtual vehicle that VNTA did not write. It is still
	// a virtual vehicle, not a real machine, and the label on the panel says so
	// to every visitor. If the suite or the subject changes, run it again and
	// update the rows; do not edit them to look better.
	//
	// It is a picture of a result, so it is one labelled image to a screen
	// reader, with a description, rather than forty loose scraps of text.
	import Icon from '$lib/components/ui/Icon.svelte';

	// `compact` is the short form that sits beside the headline.
	let { compact = false }: { compact?: boolean } = $props();

	type Row = { name: string; declared: 'Yes' | 'No'; verified: 'Verified' | 'Failed'; tests: number; why?: string };
	const rows: Row[] = [
		{ name: 'Connect', declared: 'Yes', verified: 'Verified', tests: 3 },
		{ name: 'Heartbeat', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Status', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Position', declared: 'Yes', verified: 'Verified', tests: 2 },
		{ name: 'Battery', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Capability discovery', declared: 'Yes', verified: 'Failed', tests: 2, why: 'It answered, but named no functions.' },
		{ name: 'Mission send', declared: 'Yes', verified: 'Verified', tests: 5 },
		{ name: 'Pause', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Resume', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Cancel', declared: 'Yes', verified: 'Verified', tests: 2 },
		{ name: 'Current mission', declared: 'Yes', verified: 'Verified', tests: 3 },
		{ name: 'Error reporting', declared: 'Yes', verified: 'Verified', tests: 1 },
		{ name: 'Charging', declared: 'Yes', verified: 'Verified', tests: 2 },
		{ name: 'Disconnect', declared: 'Yes', verified: 'Verified', tests: 1 }
	];
	const short = ['Mission send', 'Pause', 'Cancel', 'Position', 'Charging', 'Capability discovery'];
	const shown = $derived(compact ? short.map((n) => rows.find((r) => r.name === n)!) : rows);
</script>

<figure class="rec" class:rec--compact={compact}>
	<div
		class="rec__frame card"
		role="img"
		aria-label="Result of a real validation run against a virtual vehicle that speaks VDA 5050 version 2.1.0. Verdict: conditionally ready, 32 of 37 checks passed. Of 14 capabilities, all are declared; 13 were verified by tests and one, capability discovery, failed."
	>
		<div class="rec__bar" aria-hidden="true">
			<span class="rec__label">Validation result</span>
			<span class="rec__eg">Virtual vehicle</span>
		</div>

		<div class="rec__body" aria-hidden="true">
			<div class="rec__head">
				<span class="well"><Icon name="vehicle" size={22} /></span>
				<div class="rec__id">
					<p class="rec__name">VDA 5050 virtual AGV</p>
					<p class="rec__kind">External implementation · VDA 5050 2.1.0</p>
				</div>
				<span class="rec__verdict">Conditionally ready</span>
			</div>

			<div class="rec__sum">
				<span><b>32</b> of 37 checks passed</span>
				{#if !compact}
					<span><b>23</b> of 25 core checks</span>
					<span><b>9</b> of 12 protocol checks</span>
				{/if}
			</div>

			<div class="rec__table" class:rec__table--two={!compact}>
				<div class="rec__th">
					<span>Capability</span><span>Declared</span><span>Verified</span>
				</div>
				{#if !compact}
					<div class="rec__th rec__th--second">
						<span>Capability</span><span>Declared</span><span>Verified</span>
					</div>
				{/if}
				{#each shown as r}
					<div class="rec__row">
						<span class="rec__cap">
							{r.name}
							{#if r.why && !compact}<small>{r.why}</small>{/if}
						</span>
						<span class="rec__dec">{r.declared}</span>
						<span class="rec__ver rec__ver--{r.verified === 'Verified' ? 'ok' : 'no'}">
							<Icon name={r.verified === 'Verified' ? 'check' : 'ban'} size={13} />{r.verified}
						</span>
					</div>
				{/each}
			</div>
			{#if compact}<p class="rec__more">and 8 more capabilities</p>{/if}
		</div>
	</div>
	{#if !compact}
		<figcaption class="rec__cap-text">
			Output of a real validation run in the Runtime console. The vehicle is virtual: open-source VDA 5050 software that VNTA did not write.
			It is not a real machine.
		</figcaption>
	{/if}
</figure>

<style>
	.rec {
		margin: 0;
		min-width: 0;
	}
	.rec__frame {
		overflow: hidden;
		box-shadow: var(--lift);
	}
	.rec__bar {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 9px 16px;
		border-bottom: 1px solid var(--line);
		background: var(--ground);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.rec__label {
		color: var(--ink-60);
	}
	.rec__eg {
		color: var(--amber);
	}
	.rec__body {
		padding: clamp(14px, 1.8vw, 22px);
	}
	.rec__head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.rec__id {
		flex: 1;
		min-width: 0;
	}
	.rec__name {
		margin: 0;
		font-size: 1.06rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.rec__kind {
		margin: 1px 0 0;
		font-size: 0.82rem;
		color: var(--ink-60);
	}
	.rec__verdict {
		flex: none;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 4px 10px;
		border-radius: var(--r-chip);
		background: var(--amber-soft);
		color: var(--amber);
		font-size: 0.78rem;
		font-weight: 600;
		white-space: nowrap;
	}
	.rec__verdict::before {
		content: '';
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
	}
	.rec__sum {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 22px;
		margin-top: 14px;
		padding-top: 12px;
		border-top: 1px solid var(--line-soft);
		font-size: 0.84rem;
		color: var(--ink-60);
	}
	.rec__sum b {
		font-weight: 600;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	/* The table: three columns, drawn with a grid so it can fold into two
	   side by side on a wide screen. */
	.rec__table {
		margin-top: 12px;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		column-gap: 28px;
		font-size: 0.86rem;
	}
	.rec__th,
	.rec__row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 4.4rem 6.4rem;
		gap: 10px;
		align-items: start;
		padding: 8px 0;
		border-top: 1px solid var(--line-soft);
	}
	.rec__th {
		border-top: 0;
		padding-top: 4px;
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.rec__th--second {
		display: none;
	}
	.rec__cap {
		font-weight: 500;
		color: var(--ink);
	}
	.rec__cap small {
		display: block;
		margin-top: 1px;
		font-size: 0.78rem;
		font-weight: 400;
		color: var(--ink-60);
	}
	.rec__dec {
		color: var(--ink-60);
	}
	.rec__ver {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-weight: 600;
	}
	.rec__ver--ok {
		color: var(--green);
	}
	.rec__ver--no {
		color: var(--red);
	}
	.rec__more {
		margin: 8px 0 0;
		padding-top: 8px;
		border-top: 1px solid var(--line-soft);
		font-size: 0.8rem;
		color: var(--ink-60);
	}
	.rec__cap-text {
		margin-top: 14px;
		max-width: 52rem;
		font-size: var(--t-small);
		line-height: 1.5;
		color: var(--ink-60);
	}

	/* On a phone the verdict drops under the name, in line with it. */
	@media (max-width: 520px) {
		.rec__head {
			flex-wrap: wrap;
		}
		.rec__verdict {
			margin-left: 54px;
		}
		.rec__th,
		.rec__row {
			grid-template-columns: minmax(0, 1fr) 3.6rem 5.6rem;
		}
	}
	@media (min-width: 860px) {
		.rec__table--two {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-auto-flow: column;
			grid-template-rows: repeat(8, auto);
		}
		.rec__table--two .rec__th--second {
			display: grid;
			grid-column: 2;
			grid-row: 1;
		}
		.rec__table--two .rec__th:first-child {
			grid-column: 1;
			grid-row: 1;
		}
	}
</style>
