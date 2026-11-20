# VNTA Personal: what is true today

Updated 20 November 2026. This file says what works, what is only a drawing, and
what does not exist yet. Change it whenever that changes. Nothing is listed as
working until it has been run.

## Working (run and checked)

- **Public homepage** (`/`): hero, what VNTA handles, how it works, privacy and
  control, FAQ and beta sign-up. Builds as static pages. Looked at in a desktop
  and a phone-width browser.
- **Rule-based extractor** (`src/lib/extract/`): finds possible deadlines,
  payments, renewals, requests and appointments in plain text. 22 automated
  tests pass (`npm run test:extract`), including impossible dates, two-digit
  years, ambiguous dates, the sender's own promises, empty input, fabricated
  sources and duplicate documents.
- **Evidence rule**: every finding quotes the exact sentence and its position;
  `verifyEvidence` rejects any finding whose quote is not in the document.
- **Interactive demonstration** on the homepage: runs the real extractor in the
  browser on a made-up letter or typed text. Approve, dismiss, mark done and draft
  a reply work. No network calls. Nothing is saved.
- **Drafts** are text only, typed `status: 'draft'`, `sent: false`.

## Mocked or illustrative

- The hero preview is a drawing with demonstration data, labelled as such.
- The demo's approvals and drafts live in the page and are lost on refresh.

## Needs something outside the code

- **Beta sign-up** posts to `/api/inquiry`, which only exists on Cloudflare and
  needs the `INQUIRIES` D1 binding (or a Resend key). Not tested against the live
  function. Locally it shows its error message.
- **Share images** (`/og.png`, `/share/*`) still show the old branding. Regenerating
  them needs Playwright and an update to `scripts/share-cards.mjs`, which is stale.

## Not built yet

- The application (`app.vnta.xyz`): accounts, the five views (Home, Inbox,
  Actions, Timeline, Settings), persistence, per-user data access
- File upload, PDF text extraction, file validation, retention settings
- Data export and deletion
- Any AI model, and the consent flow that must come before one
- Email, calendar and any external action. None of these is in v1 by design.
- Privacy policy and terms for the product. The current pages describe the old site.

## Known limits of the extractor

- English only. Dates in words or numbers, amounts in €, £ and $.
- It does not know the date of a letter, so "within 14 days" gives no due date.
- An amount in a sentence with no date and no payment wording (for example
  "The renewal premium is €412.80") is not attached to the renewal yet.
- Rules will miss things. It reports "nothing found" as exactly that, never as
  "nothing to do".
