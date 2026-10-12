<script lang="ts">
	// Contact: one form, for anyone who wants to talk to VNTA about what it is
	// designing.
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { breadcrumb } from '$lib/content/structured';
	import { follow } from '$lib/content/site';
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
				<p class="quote__follow">
					Or follow along on
					{#each follow as s, i}{i === 0 ? '' : i === follow.length - 1 ? ' and ' : ', '}<a href={s.href} rel="me noopener">{s.name}</a>{/each}.
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
	.quote__follow {
		margin: 14px 0 0;
		font-size: var(--t-small);
		color: var(--ink-60);
	}
	.quote__follow a {
		color: var(--blue);
		font-weight: 500;
	}
</style>
