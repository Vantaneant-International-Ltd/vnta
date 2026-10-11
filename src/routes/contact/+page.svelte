<script lang="ts">
	// Contact: one form, for anyone who wants to talk to VNTA about what it is
	// designing.
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { breadcrumb } from '$lib/content/structured';
</script>

<Seo
	title="Contact | VNTA"
	image="/share/contact.png"
	imageAlt="Talk to VNTA."
	description="Contact VNTA about its infrastructure for autonomous systems, or about VNTA Robotics."
	ld={[breadcrumb('Contact', '/contact')]}
/>

<main class="band">
	<div class="wrap">
		<div class="quote">
			<div>
				<p class="eyebrow">Contact</p>
				<h1 class="quote__title">Talk to VNTA.</h1>
				<p class="quote__text">
					Write to us about VNTA, or about VNTA Robotics and what it is designed to do.
				</p>
			</div>
			<div class="quote__form card">
				<EnquiryForm source="/contact" />
			</div>
		</div>
	</div>
</main>

<style>
	.quote__title {
		margin-top: 14px;
	}
</style>
