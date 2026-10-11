<script lang="ts">
	// The architecture, as one picture: machines on one side, the systems an
	// organisation already runs on the other, and VNTA Robotics between them.
	// Three panels joined by two dotted lines; side by side on a wide screen,
	// stacked top to bottom on a narrow one.
	//
	// It is a diagram of a design, not a screenshot of a product, and the line
	// under it says so.
	import Icon from '$lib/components/ui/Icon.svelte';
	import Symbol from '$lib/components/ui/Symbol.svelte';
	import { machines, layer, enterprise, robotics } from '$lib/content/site';
</script>

<figure class="arch">
	<div class="arch__row">
		<div class="arch__side card">
			<p class="arch__name">Robots and autonomous machines</p>
			<p class="arch__note">Designed to work across manufacturers.</p>
			<ul class="arch__tiles arch__tiles--2">
				{#each machines as m}
					<li><Icon name={m.icon} size={22} /><span>{m.name}</span></li>
				{/each}
			</ul>
		</div>

		<div class="arch__link" aria-hidden="true"><span></span></div>

		<div class="arch__core" data-theme="ink">
			<div class="arch__brand">
				<Symbol size={30} />
				<p class="arch__name">{robotics.name}</p>
				<p class="arch__note">The control layer</p>
			</div>
			<ul class="arch__tiles arch__tiles--3">
				{#each layer as l}
					<li><Icon name={l.icon} size={20} /><span>{l.name}</span></li>
				{/each}
			</ul>
		</div>

		<div class="arch__link" aria-hidden="true"><span></span></div>

		<div class="arch__side card">
			<p class="arch__name">Enterprise systems</p>
			<p class="arch__note">The systems an organisation already runs.</p>
			<ul class="arch__tiles arch__tiles--3 arch__tiles--text">
				{#each enterprise as e}
					<li><span>{e}</span></li>
				{/each}
			</ul>
		</div>
	</div>
	<figcaption class="arch__cap">
		<span class="stage stage--build">{robotics.stage}</span>
		<span>Architecture of the design. {robotics.honest}</span>
	</figcaption>
</figure>

<style>
	.arch {
		margin: 0;
	}
	.arch__row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
	}
	.arch__side,
	.arch__core {
		padding: clamp(18px, 2vw, 24px);
		border-radius: var(--r-card);
		min-width: 0;
	}
	.arch__core {
		background: var(--paper);
		color: var(--ink-80);
	}
	.arch__brand {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 2px;
		color: var(--ink);
	}
	.arch__brand :global(.symbol) {
		margin-bottom: 8px;
	}
	.arch__name {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--ink);
	}
	.arch__note {
		margin: 2px 0 0;
		font-size: var(--t-small);
		line-height: 1.4;
		color: var(--ink-60);
	}

	/* The small tiles inside each panel. */
	.arch__tiles {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.arch__tiles--2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.arch__tiles--3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.arch__tiles li {
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 7px;
		min-height: 74px;
		padding: 10px 6px;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--card);
		color: var(--ink);
		text-align: center;
		font-size: 0.8rem;
		font-weight: 500;
		line-height: 1.2;
	}
	.arch__tiles--text li {
		min-height: 52px;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		letter-spacing: 0.01em;
		color: var(--ink-80);
	}

	/* The join between two panels: a dotted line with a point at each end. */
	.arch__link {
		display: grid;
		place-items: center;
		height: 34px;
	}
	.arch__link span {
		position: relative;
		width: 0;
		height: 100%;
		border-left: 1.5px dotted var(--ink-40);
	}
	.arch__link span::before,
	.arch__link span::after {
		content: '';
		position: absolute;
		left: -4px;
		width: 6.5px;
		height: 6.5px;
		border-radius: 50%;
		background: var(--ground);
		border: 1.5px solid var(--ink-40);
		box-sizing: border-box;
	}
	.arch__link span::before {
		top: -3px;
	}
	.arch__link span::after {
		bottom: -3px;
	}

	.arch__cap {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 12px;
		margin-top: 16px;
		font-size: var(--t-small);
		color: var(--ink-60);
	}

	@media (min-width: 1000px) {
		.arch__row {
			grid-template-columns: minmax(0, 5fr) 44px minmax(0, 6fr) 44px minmax(0, 5fr);
			align-items: stretch;
		}
		.arch__side,
		.arch__core {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.arch__link {
			height: auto;
		}
		.arch__link span {
			width: 100%;
			height: 0;
			border-left: 0;
			border-top: 1.5px dotted var(--ink-40);
		}
		.arch__link span::before,
		.arch__link span::after {
			top: -4px;
			bottom: auto;
		}
		.arch__link span::before {
			left: -3px;
		}
		.arch__link span::after {
			left: auto;
			right: -3px;
		}
	}
</style>
