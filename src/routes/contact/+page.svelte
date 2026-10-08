<script lang="ts">
	// Contact: the same enquiry form as the foot of the home page, on its own
	// address for anyone who was sent a link to it.
	import { base } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { replyWithin } from '$lib/content/site';
</script>

<Seo
	title="Get a price for a website | VNTA"
	shareTitle="Get a price | VNTA"
	description="Tell VNTA what your business does and get a fixed price for a new website within {replyWithin}. It costs nothing to ask."
/>

<main class="band band--close" data-theme="ink">
	<div class="wrap">
		<div class="quote">
			<div>
				<h1 class="quote__title">Get a price</h1>
				<p class="quote__text">
					Tell us what you do. We reply within {replyWithin} with a fixed price. It costs
					nothing to ask. <a class="link" href="{base}/#prices">See the prices</a>
				</p>
			</div>
			<EnquiryForm source="/contact" />
		</div>
	</div>
</main>
