<script lang="ts">
	// What a buyer receives: the parts of a readiness report, filled in from
	// the one real run VNTA has made against software it did not write (an
	// open-source VDA 5050 virtual vehicle, 11 October 2026). Every figure
	// here is from that run and agrees with CapabilityPanel. It is labelled as
	// an example, from a virtual vehicle, to every visitor.
	//
	// The three findings are the real findings of that run, published on
	// 14 October 2026 by the owner's decision. They are observations about one
	// version of one open-source library in one configuration, not a judgement
	// of it, and the library is not named. Do not add findings a run did not
	// produce.
	import Icon from '$lib/components/ui/Icon.svelte';

	const meta = [
		{ k: 'Integration', v: 'VDA 5050 virtual AGV' },
		{ k: 'Environment', v: 'External open-source implementation, unmodified, run in its own process' },
		{ k: 'Interface', v: 'VDA 5050 2.1.0 over MQTT, judged against the official schemas' },
		{ k: 'Checks', v: '37 run: 25 core, 12 protocol' }
	];

	const sums = [
		{ n: '32 / 37', l: 'checks passed' },
		{ n: '23 / 25', l: 'core checks' },
		{ n: '9 / 12', l: 'protocol checks' },
		{ n: '13 / 14', l: 'capabilities verified' }
	];

	// The five ways a check can end. A report never folds one into another.
	const outcomes = [
		{ name: 'Pass', tone: 'ok', body: 'Seen to work.' },
		{ name: 'Warning', tone: 'warn', body: 'Worked, with something to look at.' },
		{ name: 'Fail', tone: 'no', body: 'Tried, and did not work.' },
		{ name: 'Unsupported', tone: 'muted', body: 'Not offered by the system.' },
		{ name: 'Unknown', tone: 'muted', body: 'No answer in time. Never counted as a pass.' }
	];

	const findings = [
		{
			id: 'CAP-01 · PRO-04',
			area: 'Capability discovery',
			result: 'Fail',
			what: 'Asked for its factsheet, the vehicle answered, but named no functions, and the factsheet did not pass the official schema.',
			fix: 'Supply a factsheet that lists the vehicle’s functions, so a master control can discover them.'
		},
		{
			id: 'PRO-09',
			area: 'Connection topic QoS',
			result: 'Fail',
			what: 'The standard asks for the connection topic at QoS level 1. The vehicle’s ONLINE message and its last will both arrived at QoS 0.',
			fix: 'Publish connection messages at QoS 1, as VDA 5050 2.1.0 requires.'
		},
		{
			id: 'PRO-11',
			area: 'Connection state after reconnect',
			result: 'Fail',
			what: 'After a cut link was restored, state messages resumed within about a second, but no ONLINE message followed. A late subscriber was handed the retained CONNECTIONBROKEN while the vehicle was connected and publishing. Every individual message was schema-valid; the fault only showed over time.',
			fix: 'Publish ONLINE on the connection topic after every reconnect, not only after a restart, so a master control does not treat a live vehicle as lost.'
		}
	];

	const evidence = [
		'Every call and answer, with its latency',
		'Raw protocol messages, with timestamps',
		'Schema results for each message',
		'What was done to the system: a dropped link, a restart'
	];
</script>

<figure class="rep">
	<div class="rep__frame card">
		<div class="rep__bar">
			<span class="rep__label">Readiness report</span>
			<span class="rep__eg">Example · virtual vehicle, not a customer system</span>
		</div>

		<div class="rep__body">
			<div class="rep__top">
				<div>
					<p class="rep__k">Verdict</p>
					<p class="rep__verdict">Conditionally ready</p>
					<p class="rep__why">Every behavioural check passed: orders, pause, resume, cancel, duplicates, charging, recovery after a restart. Three findings: capability discovery, and two on the connection topic.</p>
				</div>
				<dl class="rep__meta">
					{#each meta as m}
						<div>
							<dt>{m.k}</dt>
							<dd>{m.v}</dd>
						</div>
					{/each}
				</dl>
			</div>

			<ul class="rep__sums">
				{#each sums as s}
					<li><b>{s.n}</b><span>{s.l}</span></li>
				{/each}
			</ul>

			<div class="rep__cols">
				<section class="rep__sec">
					<h3 class="rep__h">Findings and remediation</h3>
					<ul class="rep__finds">
						{#each findings as f}
							<li>
								<div class="rep__find-top">
									<span class="rep__id">{f.id}</span>
									<span class="rep__area">{f.area}</span>
									<span class="rep__res"><Icon name="ban" size={13} />{f.result}</span>
								</div>
								<p>{f.what}</p>
								<p class="rep__fix"><span>Remediation</span>{f.fix}</p>
							</li>
						{/each}
					</ul>
				</section>

				<div class="rep__side">
					<section class="rep__sec">
						<h3 class="rep__h">How each check can end</h3>
						<ul class="rep__outs">
							{#each outcomes as o}
								<li><span class="rep__dot rep__dot--{o.tone}"></span><b>{o.name}</b><span>{o.body}</span></li>
							{/each}
						</ul>
					</section>
					<section class="rep__sec">
						<h3 class="rep__h">Evidence kept with each result</h3>
						<ul class="rep__ev">
							{#each evidence as e}
								<li><Icon name="audit" size={15} />{e}</li>
							{/each}
						</ul>
					</section>
				</div>
			</div>
		</div>
	</div>
	<figcaption class="rep__cap">
		Findings from VNTA’s own test of an open-source VDA 5050 virtual vehicle, unmodified. Not a production or customer deployment, and
		not a judgement of the software. The capability matrix from the same run follows.
	</figcaption>
</figure>

<style>
	.rep {
		margin: 0;
		min-width: 0;
	}
	.rep__frame {
		overflow: hidden;
		box-shadow: var(--lift);
	}
	.rep__bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 4px 12px;
		padding: 9px 16px;
		border-bottom: 1px solid var(--line);
		background: var(--ground);
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.rep__label {
		color: var(--ink-60);
	}
	.rep__eg {
		color: var(--amber);
	}
	.rep__body {
		padding: clamp(16px, 2vw, 26px);
	}
	.rep__top {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 18px 36px;
	}
	.rep__k {
		margin: 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.rep__verdict {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 8px 0 0;
		padding: 5px 12px;
		border-radius: var(--r-chip);
		background: var(--amber-soft);
		color: var(--amber);
		font-weight: 600;
	}
	.rep__verdict::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}
	.rep__why {
		margin: 12px 0 0;
		font-size: 0.93rem;
		line-height: 1.5;
		color: var(--ink-80);
		max-width: 30rem;
		text-wrap: pretty;
	}
	.rep__meta {
		margin: 0;
		display: grid;
		border-top: 1px solid var(--line-soft);
		font-size: 0.86rem;
	}
	.rep__meta div {
		display: grid;
		grid-template-columns: 6.6rem minmax(0, 1fr);
		gap: 12px;
		padding: 8px 0;
		border-bottom: 1px solid var(--line-soft);
	}
	.rep__meta dt {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		color: var(--ink-60);
		padding-top: 1px;
	}
	.rep__meta dd {
		margin: 0;
		color: var(--ink);
		line-height: 1.4;
	}
	.rep__sums {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: var(--line-soft);
		border: 1px solid var(--line-soft);
		border-radius: 10px;
		overflow: hidden;
	}
	.rep__sums li {
		display: grid;
		gap: 2px;
		padding: 12px 14px;
		background: var(--paper, #fff);
	}
	.rep__sums b {
		font-size: 1.3rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.rep__sums span {
		font-size: 0.8rem;
		color: var(--ink-60);
	}
	.rep__cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 22px 36px;
		margin-top: 22px;
	}
	.rep__side {
		display: grid;
		gap: 22px;
		align-content: start;
	}
	.rep__h {
		margin: 0;
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.rep__finds,
	.rep__outs,
	.rep__ev {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
	}
	.rep__finds li {
		padding: 12px 0;
		border-top: 1px solid var(--line-soft);
	}
	.rep__find-top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 10px;
	}
	.rep__id {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		padding: 2px 6px;
		border-radius: 5px;
		background: var(--ground);
		color: var(--ink-80);
	}
	.rep__area {
		font-weight: 600;
		color: var(--ink);
	}
	.rep__res {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		margin-left: auto;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--red);
	}
	.rep__finds p {
		margin: 6px 0 0;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-80);
		text-wrap: pretty;
	}
	.rep__finds .rep__fix {
		display: grid;
		gap: 2px;
		padding: 8px 10px;
		border-left: 2px solid var(--blue);
		background: var(--blue-soft);
		border-radius: 0 6px 6px 0;
	}
	.rep__fix span {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.rep__outs li {
		display: grid;
		grid-template-columns: 10px 6.4rem minmax(0, 1fr);
		gap: 8px;
		align-items: baseline;
		padding: 5px 0;
		font-size: 0.86rem;
	}
	.rep__outs b {
		font-weight: 600;
		color: var(--ink);
	}
	.rep__outs span:last-child {
		color: var(--ink-60);
	}
	.rep__dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		align-self: center;
	}
	.rep__dot--ok {
		background: var(--green);
	}
	.rep__dot--warn {
		background: var(--amber);
	}
	.rep__dot--no {
		background: var(--red);
	}
	.rep__dot--muted {
		background: var(--ink-40);
	}
	.rep__ev li {
		display: grid;
		grid-template-columns: 15px minmax(0, 1fr);
		gap: 8px;
		align-items: start;
		padding: 4px 0;
		font-size: 0.88rem;
		color: var(--ink-80);
	}
	.rep__ev :global(svg) {
		margin-top: 2px;
		color: var(--ink-40);
	}
	.rep__cap {
		margin-top: 14px;
		max-width: 52rem;
		font-size: var(--t-small);
		line-height: 1.5;
		color: var(--ink-60);
	}
	@media (max-width: 520px) {
		.rep__outs li {
			grid-template-columns: 10px 5.6rem minmax(0, 1fr);
		}
		.rep__meta div {
			grid-template-columns: 1fr;
			gap: 2px;
		}
	}
	@media (min-width: 640px) {
		.rep__sums {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.rep__top {
			grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
		}
		.rep__cols {
			grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
		}
	}
</style>
