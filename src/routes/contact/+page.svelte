<script lang="ts">
	// Contact: the same enquiry form as the foot of the home page, on its own
	// address for anyone who was sent a link to it.
	import { base } from '$app/paths';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { replyWithin } from '$lib/content/site';
</script>

<svelte:head>
	<title>Get a price | VNTA</title>
	<meta
		name="description"
		content="Tell VNTA what your business does and get a fixed price for a new website within {replyWithin}."
	/>
	<meta property="og:title" content="Get a price | VNTA" />
</svelte:head>

<main class="band" data-theme="tint">
	<div class="wrap">
		<div class="contact card" data-theme="ink">
			<div>
				<h1 class="head__title">Get a price</h1>
				<p class="head__text contact__text">
					Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
					nothing to ask. <a class="link" href="{base}/#prices">See the prices</a>
				</p>
			</div>
			<EnquiryForm source="/contact" />
		</div>
	</div>
</main>

<style>
	.contact {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(24px, 4vw, 56px);
		align-items: start;
		background: var(--paper);
		color: var(--ink);
		padding: clamp(24px, 4.4vw, 56px);
		border-radius: clamp(24px, 3vw, 32px);
	}
	.contact__text {
		margin-top: 12px;
	}
	@media (min-width: 900px) {
		.contact {
			grid-template-columns: minmax(0, 4fr) minmax(0, 6fr);
		}
	}
</style>
