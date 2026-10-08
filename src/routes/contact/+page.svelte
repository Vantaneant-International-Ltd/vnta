<script lang="ts">
	// Contact: the same enquiry form as the close of the home page, on its own
	// address for anyone who was sent a link to it.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { replyWithin } from '$lib/content/site';
</script>

<Seo
	title="Talk to VNTA about your brand or your website"
	shareTitle="Talk to us | VNTA"
	description="Tell VNTA about your business. Brand design, a new website, or just a conversation about what to change. We reply within {replyWithin}. It costs nothing to ask."
/>

<main class="band band--close" data-theme="ink">
	<div class="wrap">
		<div class="quote">
			<div>
				<h1 class="quote__title">Talk to us</h1>
				<p class="quote__text">
					Tell us about your business. We reply within {replyWithin}. It costs nothing
					to ask. <a class="link" href="{base}/#prices">See the prices</a>
				</p>
			</div>
			<EnquiryForm source="/contact" />
		</div>
	</div>
</main>
