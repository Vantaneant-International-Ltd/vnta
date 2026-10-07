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

<main>
	<section class="sec contact" aria-labelledby="contact-title">
		<div class="contact__side">
			<h1 class="sec__title" id="contact-title">Get a price</h1>
			<p class="contact__lede">
				Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
				nothing to ask.
			</p>
			<p class="contact__alt">
				Want the numbers first? <a class="link" href="{base}/#prices">See the prices</a>
			</p>
		</div>
		<EnquiryForm source="/contact" />
	</section>
</main>

<style>
	.contact {
		display: grid;
		grid-template-columns: 1fr;
		gap: clamp(28px, 4vw, 64px);
		align-items: start;
	}
	.contact__lede {
		margin: 18px 0 0;
		font-size: 1.0625rem;
		line-height: 1.55;
		color: var(--ink-85);
		max-width: 40ch;
		text-wrap: pretty;
	}
	.contact__alt {
		margin: 14px 0 0;
		font-size: 0.94rem;
		color: var(--ink-70);
	}
	@media (min-width: 900px) {
		.contact {
			grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		}
	}
</style>
