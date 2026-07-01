<script lang="ts">
	import type { SecurityBlock, AuditEntry } from '../content/types';

	let { security, audits }: { security: SecurityBlock; audits: AuditEntry[] } = $props();

	// Findings are only reported once an audit has run. null renders as TODO so a
	// placeholder never reads as a real "0 findings" claim.
	const fig = (n: number | null) => (n == null ? 'TODO' : String(n));
	const criticalHigh = $derived(
		`${fig(security.findings.critical)} / ${fig(security.findings.high)}`
	);
</script>

<section class="p-section" aria-labelledby="p-security-h">
	<div class="p-shead">
		<h2 class="p-shead__name" id="p-security-h">Security and audits</h2>
		<span class="p-shead__meta">{security.cadence} cadence</span>
	</div>

	<div class="p-grid">
		<div class="p-cell">
			<div class="p-cell__k">Last audit</div>
			<div class="p-cell__v p-cell__v--sm">{security.lastAuditDate}</div>
		</div>
		<div class="p-cell">
			<div class="p-cell__k">Critical / High</div>
			<div class="p-cell__v">{criticalHigh}</div>
		</div>
		<div class="p-cell">
			<div class="p-cell__k">Cadence</div>
			<div class="p-cell__v p-cell__v--sm">{security.cadence}</div>
		</div>
	</div>

	{#each security.notes as note}
		<p class="p-note">{note}</p>
	{/each}

	{#if audits.length}
		<ol class="p-rows">
			{#each audits as audit}
				<li class="p-row">
					<span class="p-row__date">{audit.date}</span>
					<span class="p-row__type">{audit.type}</span>
					<span class="p-row__result">{audit.result}</span>
					{#if audit.href}
						<a class="p-row__link" href={audit.href}>Open</a>
					{:else}
						<span class="p-row__link" aria-hidden="true"></span>
					{/if}
				</li>
			{/each}
		</ol>
	{/if}
</section>
