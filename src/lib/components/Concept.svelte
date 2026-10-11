<script lang="ts">
	// An interface concept: how one machine's record could look in VNTA
	// Robotics. Its identity, what it is and is not allowed to do, and the trail
	// it leaves. Everything in it is an example made for this picture. There is
	// no site, no manufacturer and no robot behind it, and the label on the
	// panel says so to every visitor.
	//
	// It is a picture, so it is one labelled image to a screen reader, with a
	// description, rather than forty loose scraps of text.
	import Icon from '$lib/components/ui/Icon.svelte';

	// `compact` is the short form that sits beside the headline: the record's
	// head, its identity and its permissions, without the log or the caption.
	let { compact = false }: { compact?: boolean } = $props();

	const identity = [
		['Machine ID', 'AMR-0427'],
		['Type', 'Autonomous mobile robot'],
		['Manufacturer', 'Example Robotics'],
		['Site', 'Example site, Floor 1'],
		['Owner', 'Operations'],
		['Commissioned', '18 Jan']
	];
	const rules = [
		{ name: 'Allowed zones', tone: 'ok', icon: 'check', items: ['Aisle A', 'Aisle B', 'Charging'] },
		{ name: 'Restricted zones', tone: 'no', icon: 'ban', items: ['Server room', 'Offices'] },
		{ name: 'Approved actions', tone: 'ok', icon: 'check', items: ['Move materials', 'Dock to charge'] },
		{ name: 'Needs approval', tone: 'ask', icon: 'clock', items: ['Enter a new zone', 'Use the loading dock'] }
	];
	const log = [
		['10:42:17', 'Moved to Aisle B', 'Navigating to waypoint'],
		['10:41:32', 'Task started', 'Assigned by the fleet manager'],
		['10:39:58', 'Entered Aisle B', 'Zone transition, allowed'],
		['08:21:03', 'Docked to charge', 'Charging complete'],
		['Yesterday', 'Permission granted', 'Access to Aisle B, by an administrator']
	];
</script>

<figure class="concept" class:concept--compact={compact}>
	<div
		class="concept__frame card"
		role="img"
		aria-label="Interface concept with example data: the record of one machine, AMR-0427. It shows the machine's identity, the zones and actions it is allowed, restricted from, or needs approval for, and a time-stamped audit log of what it did."
	>
		<div class="concept__bar" aria-hidden="true">
			<span class="concept__label">Interface concept</span>
			<span class="concept__eg">Example data</span>
		</div>

		<div class="concept__body" aria-hidden="true">
			<div class="concept__head">
				<span class="well"><Icon name="robot" size={22} /></span>
				<div class="concept__id">
					<p class="concept__name">AMR-0427</p>
					<p class="concept__kind">Autonomous mobile robot</p>
				</div>
				<span class="concept__state">Online</span>
			</div>

			<div class="concept__tabs">
				<span class="is-on"><Icon name="identity" size={15} />Identity</span>
				<span><Icon name="lock" size={15} />Permissions</span>
				<span><Icon name="flow" size={15} />Tasks</span>
				<span><Icon name="pulse" size={15} />Telemetry</span>
				<span><Icon name="audit" size={15} />Audit</span>
			</div>

			<div class="concept__cols">
				<div class="concept__box">
					<p class="concept__title">Identity</p>
					<dl class="concept__rows">
						{#each identity as [k, v]}
							<div><dt>{k}</dt><dd>{v}</dd></div>
						{/each}
					</dl>
				</div>

				<div class="concept__box">
					<p class="concept__title">Permissions</p>
					<ul class="concept__rules">
						{#each rules as r}
							<li>
								<span class="concept__rule concept__rule--{r.tone}"><Icon name={r.icon} size={13} />{r.name}</span>
								<span class="concept__tags">
									{#each r.items as item}<i>{item}</i>{/each}
								</span>
							</li>
						{/each}
					</ul>
				</div>

				{#if !compact}
					<div class="concept__box">
						<p class="concept__title">Audit log</p>
						<ol class="concept__log">
							{#each log as [time, what, why]}
								<li>
									<span class="concept__what">{what}</span>
									<span class="concept__time">{time}</span>
									<span class="concept__why">{why}</span>
								</li>
							{/each}
						</ol>
					</div>
				{/if}
			</div>
		</div>
	</div>
	{#if !compact}
		<figcaption class="concept__cap">
			A design for the machine record: identity, permissions and audit in one place. Example
			data, not a live system.
		</figcaption>
	{/if}
</figure>

<style>
	.concept {
		margin: 0;
		min-width: 0;
	}
	.concept__frame {
		overflow: hidden;
		box-shadow: var(--lift);
	}
	/* The strip that says what this is. Always visible, never subtle. */
	.concept__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 9px clamp(14px, 1.8vw, 20px);
		background: var(--ground);
		border-bottom: 1px solid var(--line);
		font-size: var(--t-micro);
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-60);
	}
	.concept__eg {
		color: var(--amber);
	}
	.concept__body {
		padding: clamp(14px, 1.8vw, 20px);
	}

	.concept__head {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.concept__id {
		flex: 1;
		min-width: 0;
	}
	.concept__name {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--ink);
	}
	.concept__kind {
		margin: 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.concept__state {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 4px 10px 4px 9px;
		border-radius: var(--r-chip);
		background: var(--green-soft);
		color: var(--green);
		font-size: 0.8rem;
		font-weight: 600;
	}
	.concept__state::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}

	/* The tabs are part of the picture, not controls. On a narrow screen the
	   last ones simply run off the edge of the panel. */
	.concept__tabs {
		display: flex;
		gap: 4px;
		margin: 14px 0 0;
		border-bottom: 1px solid var(--line);
		overflow: hidden;
		min-width: 0;
	}
	.concept__body,
	.concept__cols {
		min-width: 0;
	}
	.concept__tabs span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 9px 10px;
		font-size: 0.84rem;
		font-weight: 500;
		color: var(--ink-60);
		white-space: nowrap;
	}
	.concept__tabs .is-on {
		color: var(--blue);
		box-shadow: inset 0 -2px 0 var(--blue);
	}

	.concept__cols {
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
		margin-top: 14px;
	}
	.concept__box {
		padding: 14px;
		border: 1px solid var(--line);
		border-radius: 12px;
		min-width: 0;
	}
	.concept__title {
		margin: 0 0 8px;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
	}

	.concept__rows {
		margin: 0;
	}
	.concept__rows div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 7px 0;
		border-top: 1px solid var(--line-soft);
		font-size: 0.84rem;
	}
	.concept__rows div:first-child {
		border-top: 0;
	}
	.concept__rows dt {
		color: var(--ink-60);
	}
	.concept__rows dd {
		margin: 0;
		color: var(--ink);
		font-weight: 500;
		text-align: right;
	}

	.concept__rules {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.concept__rules li {
		display: grid;
		gap: 6px;
	}
	.concept__rule {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--ink);
	}
	.concept__rule :global(.icon) {
		padding: 3px;
		border-radius: 50%;
		box-sizing: content-box;
	}
	.concept__rule--ok :global(.icon) {
		background: var(--green-soft);
		color: var(--green);
	}
	.concept__rule--no :global(.icon) {
		background: var(--red-soft);
		color: var(--red);
	}
	.concept__rule--ask :global(.icon) {
		background: var(--amber-soft);
		color: var(--amber);
	}
	.concept__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.concept__tags i {
		padding: 3px 8px;
		border-radius: 6px;
		background: var(--ground-2);
		font-style: normal;
		font-size: 0.76rem;
		font-weight: 500;
		color: var(--ink-80);
	}

	.concept__log {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.concept__log li {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0 10px;
		padding: 7px 0 7px 16px;
		border-top: 1px solid var(--line-soft);
		font-size: 0.82rem;
	}
	.concept__log li:first-child {
		border-top: 0;
	}
	.concept__log li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 13px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--blue);
	}
	.concept__what {
		font-weight: 600;
		color: var(--ink);
	}
	.concept__time {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--ink-60);
		white-space: nowrap;
	}
	.concept__why {
		grid-column: 1 / -1;
		color: var(--ink-60);
	}

	.concept__cap {
		margin-top: 14px;
		font-size: var(--t-small);
		color: var(--ink-60);
		max-width: 44rem;
	}

	@media (min-width: 560px) {
		.concept--compact .concept__cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 900px) {
		.concept__cols {
			grid-template-columns: minmax(0, 10fr) minmax(0, 11fr) minmax(0, 12fr);
		}
		.concept--compact .concept__cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
