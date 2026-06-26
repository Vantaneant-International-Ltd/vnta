<script lang="ts">
	// No client-side logic required for terms
</script>

<svelte:head>
	<title>Terms · VNTA</title>
	<meta
		name="description"
		content="Engagement terms and commercial framework governing work with VNTA."
	/>
	<meta property="og:title" content="Terms · VNTA" />
	<meta
		property="og:description"
		content="Engagement terms and commercial framework governing work with VNTA."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main class="page-container">
	<div class="content content-width">
		<section class="hero">
			<h1 class="title">Terms</h1>
			<p class="subtitle">Engagement terms & commercial framework</p>

			<p class="lede">
				These terms describe how VNTA (Vantanéant International Ltd) typically works with
				clients. They are provided for clarity and transparency.
				<br /><br />
				Where a written agreement, statement of work, or contract is issued and signed,
				that document governs the engagement and takes precedence over these terms in the
				event of any inconsistency.
			</p>
		</section>

		<section class="section">
			<h2>1. About VNTA</h2>
			<p>
				VNTA is the trading name of <strong>Vantanéant International Ltd</strong>, an Irish
				company. References to “VNTA”, “we”, “us”, or “our” refer to Vantanéant International
				Ltd unless stated otherwise.
			</p>
		</section>

		<section class="section">
			<h2>2. Formation of engagements</h2>
			<p>
				Engagements are formed only once scope, duration, fees, and commercial terms are
				agreed in writing. This may be via a contract, proposal acceptance, statement of
				work, or similar written confirmation.
			</p>
			<p>
				VNTA is not obliged to commence work until an engagement is formally agreed and any
				required upfront payment is received.
			</p>
		</section>

		<section class="section">
			<h2>3. Services & working model</h2>
			<p>
				VNTA provides brand leadership, strategic direction, and execution oversight. Where
				engaged, VNTA operates as a hands-on partner and may lead decision-making within the
				agreed scope.
			</p>
			<p>
				Services may be delivered directly by VNTA or through trusted collaborators,
				partners, or specialist contributors, where appropriate to the engagement.
			</p>
		</section>

		<section class="section">
			<h2>4. Scope & change control</h2>
			<p>
				The scope of work is defined per engagement. Any material change to scope, timelines,
				or deliverables must be agreed in writing.
			</p>
			<p>
				Additional work outside the agreed scope may require revised fees, timelines, or
				a separate agreement.
			</p>
		</section>

		<section class="section">
			<h2>5. Fees, invoicing & payment</h2>
			<p>
				Fees, payment schedules, and invoicing terms are defined per engagement. Unless
				otherwise agreed, fees are payable in advance.
			</p>
			<p>
				Fees are non-refundable once work has commenced, except where explicitly agreed in
				writing. VNTA reserves the right to suspend work in the event of late or non-payment.
			</p>
		</section>

		<section class="section">
			<h2>6. Client responsibilities</h2>
			<p>
				Clients agree to provide timely access to information, materials, approvals, and
				personnel reasonably required for the engagement.
			</p>
			<p>
				Delays caused by missing inputs, late feedback, or withheld approvals may impact
				timelines without penalty to VNTA.
			</p>
		</section>

		<section class="section">
			<h2>7. Deliverables & acceptance</h2>
			<p>
				Deliverables are considered accepted once delivered in accordance with the agreed
				scope, unless the client raises material issues within a reasonable time.
			</p>
			<p>
				Revisions are limited to those defined in the engagement. Additional revisions may
				require additional fees.
			</p>
		</section>

		<section class="section">
			<h2>8. Intellectual property</h2>
			<p>
				Unless otherwise agreed, final deliverables created specifically for the client
				become the client’s property upon full payment.
			</p>
			<p>
				VNTA retains ownership of pre-existing materials, methods, frameworks, working
				files, and know-how, and grants the client a licence to use them as incorporated
				into the final deliverables.
			</p>
		</section>

		<section class="section">
			<h2>9. Confidentiality</h2>
			<p>
				Both parties agree to keep confidential information private and not disclose it to
				third parties, except where required by law or already in the public domain.
			</p>
		</section>

		<section class="section">
			<h2>10. Publicity & portfolio use</h2>
			<p>
				Unless otherwise agreed in writing, VNTA may reference the engagement and outcomes
				in portfolios, case studies, credentials, and internal materials.
			</p>
		</section>

		<section class="section">
			<h2>11. Limitation of liability</h2>
			<p>
				VNTA is not liable for indirect, incidental, or consequential losses arising from
				the engagement.
			</p>
			<p>
				Any liability is limited to the fees paid for the specific engagement giving rise
				to the claim, to the maximum extent permitted by law.
			</p>
		</section>

		<section class="section">
			<h2>12. Termination & suspension</h2>
			<p>
				Either party may terminate an engagement in accordance with the agreed contract
				terms or written agreement.
			</p>
			<p>
				Fees for work completed up to the termination date remain payable. VNTA may suspend
				work where payment obligations are not met.
			</p>
		</section>

		<section class="section">
			<h2>13. Governing law</h2>
			<p>
				These terms and any non-contractual disputes arising from them are governed by the
				laws of Ireland. The courts of Ireland have exclusive jurisdiction.
			</p>
		</section>

		<section class="section">
			<h2>14. Contact</h2>
			<p>
				For questions regarding these terms, contact
				<a class="inline-link" href="mailto:studio@vnta.xyz">studio@vnta.xyz</a>.
			</p>
		</section>
	</div>
</main>

<style>
	.hero {
		margin-bottom: 56px;
	}

	.title {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 5vw, 3.8rem);
		font-weight: 700;
		margin: 0 0 0.5rem;
		letter-spacing: -0.02em;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--ink-70);
		margin: 0 0 2.5rem;
	}

	.lede {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--ink-85);
		max-width: 820px;
	}

	.section {
		margin-bottom: 56px;
	}

	.section h2 {
		margin: 0 0 14px;
		font-family: var(--font-display);
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.section p {
		margin: 0 0 12px;
		color: var(--ink-85);
		line-height: 1.7;
		max-width: 900px;
	}

	.section p:last-child {
		margin-bottom: 0;
	}

	.inline-link {
		color: var(--ink);
		text-decoration: none;
		border-bottom: 1px solid var(--line);
	}

	.inline-link:hover {
		border-bottom-color: var(--ink-50);
	}
</style>
