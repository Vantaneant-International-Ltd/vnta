<script lang="ts">
	// Privacy policy. Every sentence here describes something the code does or
	// something the owner must set up (docs/DEPLOY-APP.md, "Claims to verify at
	// launch"). If the app changes, change this page in the same commit.
	import Seo from '$lib/components/Seo.svelte';
	import { breadcrumb } from '$lib/content/structured';
	import { contactEmail, company } from '$lib/content/site';
	import { base } from '$app/paths';

	const held = [
		{ what: 'Your email address', why: 'To sign you in and to contact you about your account.', keep: 'Until you delete your account.' },
		{ what: 'Sign-in codes', why: 'To check it is you. Only a scrambled (hashed) copy is stored.', keep: '10 minutes, or until used.' },
		{ what: 'Your sessions', why: 'To keep you signed in. Only a hashed copy of the token is stored, with a label such as “Chrome on Mac” so you can recognise the device. No IP address.', keep: '30 days, or until you sign out.' },
		{ what: 'Passkeys', why: 'To let you sign in with your fingerprint, face or device PIN. We keep only the public key, a name, and when it was added and last used. The private key stays on your device.', keep: 'Until you remove it or delete your account.' },
		{ what: 'Sign-in activity', why: 'So you can spot a sign-in that was not you: what happened and on which device, never an IP address.', keep: 'The latest 20 events.' },
		{ what: 'Documents you add', why: 'To read them and find what may need doing. We keep the file you added and the text read from it.', keep: 'For the period you choose in Settings (default 1 year), or until you delete them.' },
		{ what: 'Suggestions and your decisions', why: 'Dates, amounts and the exact sentences VNTA quoted from your documents, with what you decided and any date you set.', keep: 'With the document they came from.' },
		{ what: 'Drafts', why: 'Text you asked VNTA to prepare. VNTA never sends it.', keep: 'With the suggestion they belong to.' },
		{ what: 'Your settings', why: 'Currently your chosen retention period.', keep: 'Until you delete your account.' }
	];
</script>

<Seo
	title="Privacy | VNTA"
	description="How VNTA handles your information: what it holds, why, where, for how long, and how to export or delete it."
	ld={[breadcrumb('Privacy', '/privacy')]}
/>

<div class="shell">
<main class="band">
	<div class="wrap">
		<article>
			<p class="eyebrow">Privacy</p>
			<h1>What VNTA does with your information.</h1>
			<p class="lede">
				Written in plain words. VNTA Studio’s website collects very little. VNTA’s document app is built but not open
				to the public yet; the parts of this page about the app describe how it is built to work, and apply when it opens.
			</p>

			<h2>The short version</h2>
			<ul>
				<li><b>VNTA reads only the documents you add.</b> It does not read your email or your calendar.</li>
				<li><b>Your documents are not sent to any AI service.</b> VNTA finds dates, amounts and requests with fixed rules.</li>
				<li><b>VNTA never pays, sends or submits anything for you.</b> A draft is only text for you to copy.</li>
				<li><b>You can download everything, and delete everything,</b> from Settings, whenever you like.</li>
				<li><b>We do not sell your information, show ads, or use your documents to train anything.</b></li>
			</ul>

			<h2>Who we are</h2>
			<p>
				VNTA is a trading name of {company.legalName}, {company.place}. We decide how and why your information is
				used (in data-protection terms, we are the controller). Write to us at
				<a href="mailto:{contactEmail}">{contactEmail}</a>.
			</p>

			<h2>What the app holds</h2>
			<div class="table" role="table" aria-label="What VNTA holds">
				<div class="tr th" role="row"><span role="columnheader">What</span><span role="columnheader">Why</span><span role="columnheader">How long</span></div>
				{#each held as h}
					<div class="tr" role="row"><b role="cell">{h.what}</b><span role="cell">{h.why}</span><span role="cell">{h.keep}</span></div>
				{/each}
			</div>
			<p>
				Documents can contain very personal information about you and other people, such as names, addresses and
				account numbers. We treat everything in them as private. Each person’s data is kept separate: the app only
				ever looks up data that belongs to the account that is signed in.
			</p>

			<h2>Why we are allowed to use it</h2>
			<ul>
				<li><b>To give you the service you asked for</b> (your email, documents, suggestions, drafts and settings).</li>
				<li><b>To keep VNTA secure</b>, using sign-in codes, limits on repeated attempts and standard server logs. This is our legitimate interest.</li>
				<li><b>With your consent</b>, for analytics on the public website. You can say no, and you can change your mind.</li>
				<li><b>To answer you</b>, when you use the contact form or join the private beta list.</li>
			</ul>

			<h2>Who else handles it</h2>
			<p>We use a small number of providers to run VNTA. They act on our instructions.</p>
			<ul>
				<li><b>Cloudflare</b> hosts the website and the app, and stores the database and your files. We choose Europe as the storage location for the app’s database and files.</li>
				<li><b>Resend</b> delivers the sign-in email. It receives your email address and the code.</li>
				<li><b>Google Analytics</b> measures visits to the public website, only if you accept cookies. It is not used inside the app.</li>
			</ul>
			<p>
				Cloudflare and Resend are companies that operate globally, so some processing may happen outside the
				European Economic Area. Where that happens, it relies on the legal safeguards those providers offer, such as
				standard contractual clauses.
			</p>

			<h2>AI</h2>
			<p>
				VNTA does not currently send your documents to any AI model or provider. If we ever add one, we will tell
				you, name the provider, explain what would be sent, and ask for your consent first. Nothing is sent unless you
				say yes.
			</p>

			<h2>Keeping and deleting</h2>
			<ul>
				<li>You choose how long documents are kept: 30, 90, 180 or 365 days, or until you delete them. Older documents are deleted, with their text, suggestions and drafts, the next time you open the app.</li>
				<li>You can delete a single document at any time.</li>
				<li>You can delete your whole account in Settings. That removes your documents, files, suggestions, drafts and sign-in records.</li>
				<li>Our database provider may keep short-term backups. Deleted data can remain in them for a limited time until they expire.</li>
			</ul>

			<h2>Your rights</h2>
			<p>
				Under data-protection law, including the GDPR, you can ask to see your information, correct it, delete it,
				restrict how it is used, receive it in a portable form, object to its use, and withdraw consent you gave.
			</p>
			<p>
				Most of this you can do yourself. <b>Settings &gt; Download</b> gives you everything in one file, and
				<b>Settings &gt; Delete my account</b> removes it. For anything else, email
				<a href="mailto:{contactEmail}">{contactEmail}</a> and we will answer within one month.
			</p>
			<p>
				If you are unhappy with how we handled something, you can complain to the Data Protection Commission, the
				Irish data-protection authority, at <a href="https://www.dataprotection.ie">dataprotection.ie</a>, or to the
				authority in your own country.
			</p>

			<h2>Cookies and measurement</h2>
			<ul>
				<li><b>In the app</b> there is one cookie, <code>vnta_session</code>. It keeps you signed in and is strictly necessary. There is no analytics, advertising or tracking in the app, and Google is not contacted from it.</li>
				<li><b>On the public website</b> we use Google Analytics, with IP anonymisation, to count visits. It sets cookies only if you press Accept. If you press Decline, no cookies are set, but Google may still receive limited, cookie-less signals such as which page was opened.</li>
				<li>We set no advertising cookies.</li>
			</ul>

			<h2>Logs</h2>
			<p>
				Our hosting keeps standard logs (such as IP address, browser and time of request) for security and
				reliability. We do not write the text of your documents or your email address into our own logs.
			</p>

			<h2>Contact form and the beta list</h2>
			<p>
				If you use the contact form or join the private beta list, we store what you send (such as your name,
				email and message) so we can reply and invite you. We use your email for that and nothing else.
			</p>

			<h2>Who VNTA is for</h2>
			<p>VNTA is for adults. It is not meant for anyone under 18.</p>

			<h2>Changes</h2>
			<p>
				If we change how VNTA uses your information in a way that matters, we will update this page and tell people
				with accounts before the change takes effect. Questions are welcome at
				<a href="mailto:{contactEmail}">{contactEmail}</a>. See also our <a href="{base}/terms">terms</a>.
			</p>

			<p class="updated">Last updated 21 November 2026</p>
		</article>
	</div>
</main>
</div>

<style>
	article {
		max-width: 44rem;
		margin: 0 auto;
		color: var(--ink-80);
		line-height: 1.7;
	}
	h1 {
		margin: 10px 0 18px;
		font-size: clamp(2.2rem, 5.5vw, 3.6rem);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1.05;
		color: var(--ink);
		text-wrap: balance;
	}
	.lede {
		margin: 0 0 40px;
		font-size: var(--t-lede);
		color: var(--ink-60);
	}
	h2 {
		margin: 44px 0 12px;
		font-size: 1.45rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	p {
		margin: 0 0 14px;
	}
	ul {
		margin: 0 0 14px;
		padding-left: 1.2rem;
		display: grid;
		gap: 8px;
	}
	b {
		color: var(--ink);
		font-weight: 600;
	}
	a {
		color: var(--blue);
		text-underline-offset: 3px;
	}
	code {
		background: var(--ground-2);
		padding: 1px 6px;
		border-radius: 6px;
		font-size: 0.9em;
	}
	.table {
		margin: 0 0 18px;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: var(--r-card);
		overflow: hidden;
		font-size: 0.93rem;
	}
	.tr {
		display: grid;
		gap: 4px;
		padding: 14px 18px;
		border-top: 1px solid var(--line-soft);
		line-height: 1.55;
	}
	.tr:first-child {
		border-top: 0;
	}
	.th {
		display: none;
	}
	@media (min-width: 720px) {
		.tr {
			grid-template-columns: 11rem 1fr 11rem;
			gap: 18px;
		}
		.th {
			display: grid;
			background: var(--ground-2);
			font-size: 0.75rem;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--ink-60);
			font-weight: 600;
		}
	}
	.updated {
		margin-top: 48px;
		color: var(--ink-60);
		font-size: 0.88rem;
	}
</style>
