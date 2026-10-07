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

<main class="band" data-theme="ink">
	<div class="wrap">
		<div class="head">
			<h1 class="head__title">Get a price</h1>
			<p class="head__text">
				Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
				nothing to ask. <a class="link" href="{base}/#prices">See the prices</a>
			</p>
		</div>
		<div class="contact__form">
			<EnquiryForm source="/contact" />
		</div>
	</div>
</main>

<style>
	@media (min-width: 900px) {
		.contact__form {
			margin-left: calc(50% + clamp(12px, 1.5vw, 24px));
		}
	}
</style>
