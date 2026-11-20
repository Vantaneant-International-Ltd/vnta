<script lang="ts">
	// Contact: one form, for anyone who wants to talk to VNTA.
	import Seo from '$lib/components/Seo.svelte';
	import EnquiryForm from '$lib/components/EnquiryForm.svelte';
	import { breadcrumb } from '$lib/content/structured';
	import { follow } from '$lib/content/site';
</script>

<Seo
	title="Contact | VNTA"
	imageAlt="Talk to VNTA."
	description="Contact VNTA about the private beta, or anything else."
	ld={[breadcrumb('Contact', '/contact')]}
/>

<main class="band">
	<div class="wrap">
		<div class="quote">
			<div>
				<p class="eyebrow">Contact</p>
				<h1 class="quote__title">Talk to VNTA.</h1>
				<p class="quote__text">
					Questions about VNTA or the private beta? Write to us.
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
