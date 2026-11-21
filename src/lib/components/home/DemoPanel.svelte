<script lang="ts">
	// The live demonstration. It runs the real extractor (src/lib/extract) in
	// the browser on a made-up letter, or on whatever the visitor types. Nothing
	// is sent anywhere: there is no network call in this component.
	import { extract, draftReply, type Finding } from '$lib/extract/extract';
	import { SAMPLE_LETTER } from '$lib/extract/sample';
	import Icon from '$lib/components/ui/Icon.svelte';

	type Decision = 'approved' | 'dismissed' | 'done';

	let text = $state(SAMPLE_LETTER);
	let decisions = $state<Record<string, Decision>>({});
	let active = $state<string | null>(null);
	let drafting = $state<string | null>(null);
	let copied = $state(false);

	const result = $derived(extract(text));
	// A finding's identity is what it points at, so a decision survives edits elsewhere in the text.
	const keyOf = (f: Finding) => `${f.kind}|${f.evidence.quote}`;
	const decisionOf = (f: Finding) => decisions[keyOf(f)];

	const segments = $derived.by(() => {
		const out: { t: string; f?: Finding }[] = [];
		let at = 0;
		for (const f of result.findings) {
			if (f.evidence.start < at) continue;
			if (f.evidence.start > at) out.push({ t: text.slice(at, f.evidence.start) });
			out.push({ t: text.slice(f.evidence.start, f.evidence.end), f });
			at = f.evidence.end;
		}
		if (at < text.length) out.push({ t: text.slice(at) });
		return out;
	});

	const fmt = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
	const showDate = (iso: string) => fmt.format(new Date(iso + 'T00:00:00Z'));

	function when(f: Finding): string {
		if (f.date?.iso) return showDate(f.date.iso) + (f.time ? `, ${f.time}` : '');
		if (f.date?.ambiguous && f.date.candidates.length)
			return `Unclear: ${f.date.candidates.map(showDate).join(' or ')}`;
		if (f.date?.ambiguous) return `Unclear: "${f.date.raw}"`;
		if (f.relative) return `No date given: "${f.relative}"`;
		if (f.date) return `Check "${f.date.raw}"`;
		return f.amount ? f.amount.raw : 'No date found';
	}
	const sure = { high: 'Looks clear', medium: 'Worth a look', low: 'Check this' } as const;

	function decide(f: Finding, d: Decision) {
		const k = keyOf(f);
		if (decisions[k] === d) {
			const { [k]: _, ...rest } = decisions;
			decisions = rest;
		} else decisions = { ...decisions, [k]: d };
	}

	const draftFor = $derived(result.findings.find((f) => f.id === drafting));
	const draft = $derived(draftFor ? draftReply(draftFor) : null);

	async function copy() {
		if (!draft) return;
		try {
			await navigator.clipboard.writeText(draft.body);
			copied = true;
			setTimeout(() => (copied = false), 1800);
		} catch {
			copied = false;
		}
	}
	function reset() {
		text = SAMPLE_LETTER;
		decisions = {};
		drafting = null;
		active = null;
	}
	const label: Record<Decision, string> = { approved: 'Approved by you', dismissed: 'Dismissed', done: 'Done' };
</script>

<div class="demo">
	<div class="doc">
		<div class="doc__head">
			<span class="cap">Document</span>
			<button class="link" type="button" onclick={reset}>Reset the sample</button>
		</div>
		<div class="doc__view" aria-label="The letter, with the sentences VNTA found highlighted">
			{#each segments as s}{#if s.f}<button
						type="button"
						class="mark"
						class:on={active === s.f.id}
						onclick={() => (active = s.f!.id)}
						onmouseenter={() => (active = s.f!.id)}>{s.t}</button
					>{:else}<span>{s.t}</span>{/if}{/each}
		</div>
		<label class="edit">
			<span class="cap">Or try your own text</span>
			<textarea bind:value={text} rows="5" spellcheck="false"></textarea>
			<small>Runs in your browser. Nothing you type here is sent anywhere.</small>
		</label>
	</div>

	<div class="out">
		<div class="doc__head">
			<span class="cap">Suggested steps</span>
			<span class="cap" aria-live="polite">{result.findings.length} found</span>
		</div>

		{#if result.state === 'no_text'}
			<p class="empty">There is no text to read. Paste some text, or reset the sample.</p>
		{:else if result.state === 'nothing_found'}
			<p class="empty">
				VNTA did not find a deadline, payment, renewal or request in this text. That does not mean there is
				nothing to do. Read the document yourself.
			</p>
		{:else}
			<ul class="list">
				{#each result.findings as f (f.id)}
					{@const d = decisionOf(f)}
					<li class:on={active === f.id} class:muted={d === 'dismissed'} onmouseenter={() => (active = f.id)}>
						<div class="row">
							<b>{f.title}</b>
							<span class="state" class:state--set={!!d}>{d ? label[d] : 'Suggested'}</span>
						</div>
						<p class="when">{when(f)}{#if f.amount && f.kind !== 'payment'}<span> · {f.amount.raw}</span>{/if}</p>
						<p class="src">
							<span class="conf conf--{f.confidence}">{sure[f.confidence]}</span>
							Line {f.evidence.line}: “{f.evidence.quote}”
						</p>
						{#each f.notes as n}<p class="warn">{n}</p>{/each}
						<div class="acts">
							<button type="button" class="chip" aria-pressed={d === 'approved'} onclick={() => decide(f, 'approved')}>Approve</button>
							<button type="button" class="chip" aria-pressed={d === 'dismissed'} onclick={() => decide(f, 'dismissed')}>Dismiss</button>
							<button type="button" class="chip" aria-pressed={d === 'done'} onclick={() => decide(f, 'done')}>Mark done</button>
							<button type="button" class="chip chip--quiet" aria-pressed={drafting === f.id} onclick={() => (drafting = drafting === f.id ? null : f.id)}>
								<Icon name="mail" size={14} /> Draft a reply
							</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		{#if draft}
			<div class="draft">
				<div class="doc__head">
					<span class="cap">Draft. Not sent.</span>
					<button class="link" type="button" onclick={copy}>{copied ? 'Copied' : 'Copy'}</button>
				</div>
				<pre>{draft.body}</pre>
				<small>VNTA never sends this. Read it, fill in the [brackets], and send it yourself.</small>
			</div>
		{/if}
	</div>
</div>

<style>
	.demo {
		display: grid;
		gap: 20px;
		grid-template-columns: minmax(0, 1fr);
	}
	@media (min-width: 900px) {
		.demo {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: start;
		}
	}
	.doc,
	.out {
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		padding: clamp(16px, 2.4vw, 24px);
		display: grid;
		gap: 14px;
	}
	.doc__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.cap {
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
		font-weight: 600;
	}
	.link {
		background: none;
		border: 0;
		padding: 4px 0;
		font: inherit;
		font-size: var(--t-small);
		color: var(--blue);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.doc__view {
		white-space: pre-wrap;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--ink-80);
		max-height: 22rem;
		overflow: auto;
		overflow-wrap: anywhere;
	}
	.mark {
		all: unset;
		cursor: pointer;
		background: var(--blue-soft);
		border-bottom: 2px solid var(--blue);
		color: var(--ink);
		transition: background var(--dur) var(--ease);
	}
	.mark.on {
		background: #e4e0fa;
	}
	.mark:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.edit {
		display: grid;
		gap: 6px;
		border-top: 1px solid var(--line-soft);
		padding-top: 14px;
	}
	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-ctl);
		padding: 10px 12px;
		background: var(--field);
		color: var(--ink);
		font: inherit;
		font-size: 0.9rem;
		resize: vertical;
	}
	textarea:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	small {
		color: var(--ink-60);
		font-size: 0.82rem;
	}
	.empty {
		margin: 0;
		color: var(--ink-60);
		border-left: 2px solid var(--ink-20);
		padding-left: 12px;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
	}
	.list li {
		padding: 16px 0;
		border-top: 1px solid var(--line-soft);
		display: grid;
		gap: 6px;
	}
	.list li:first-child {
		border-top: 0;
		padding-top: 0;
	}
	.list li.on {
		box-shadow: inset 2px 0 0 var(--blue);
		padding-left: 12px;
	}
	.list li.muted {
		opacity: 0.55;
	}
	.row {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: baseline;
	}
	.row b {
		color: var(--ink);
		font-weight: 600;
	}
	.state {
		font-size: 0.75rem;
		color: var(--ink-60);
		border: 1px solid var(--ink-20);
		border-radius: var(--r-chip);
		padding: 2px 8px;
		white-space: nowrap;
	}
	.state--set {
		color: var(--blue);
		border-color: var(--blue);
	}
	.when {
		margin: 0;
		color: var(--ink);
		font-size: 1.05rem;
		font-weight: 500;
	}
	.src {
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-60);
		overflow-wrap: anywhere;
	}
	.conf {
		font-weight: 600;
		margin-right: 6px;
		color: var(--ink-80);
	}
	.conf--low {
		color: var(--amber);
	}
	.warn {
		margin: 0;
		font-size: 0.85rem;
		color: var(--ink-80);
		border-left: 2px solid var(--amber);
		padding-left: 10px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 6px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 36px;
		padding: 0 12px;
		border: 1px solid var(--ink-20);
		border-radius: var(--r-pill);
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.chip:hover {
		border-color: var(--ink-40);
	}
	.chip[aria-pressed='true'] {
		background: var(--navy);
		border-color: var(--navy);
		color: #fff;
	}
	.chip--quiet {
		color: var(--blue);
		border-color: transparent;
	}
	.chip--quiet[aria-pressed='true'] {
		background: var(--blue-soft);
		color: var(--ink);
		border-color: var(--blue);
	}
	.chip:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 2px;
	}
	.draft {
		border-top: 1px solid var(--line);
		padding-top: 14px;
		display: grid;
		gap: 10px;
	}
	pre {
		margin: 0;
		white-space: pre-wrap;
		font: inherit;
		font-size: 0.92rem;
		background: var(--ground);
		border: 1px dashed var(--ink-20);
		border-radius: var(--r-ctl);
		padding: 14px;
		color: var(--ink-80);
	}
	@media (prefers-reduced-motion: reduce) {
		.mark {
			transition: none;
		}
	}
</style>
