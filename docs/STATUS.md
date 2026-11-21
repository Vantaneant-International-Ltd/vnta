# VNTA Personal: what is true today

Updated 21 November 2026. This file says what works, what is only a drawing, and
what does not exist yet. Change it whenever that changes. Nothing is listed as
working until it has been run.

## Working (run and checked)

Checked three ways: 54 automated tests (`npm test`), a browser run of the whole
app against the real Cloudflare local runtime (`npm run app:dev`), and a look at
desktop and phone screens.

**Public site**
- Homepage with all six sections and the in-browser demo on a made-up letter.

**The app** (`/app`, five views, responsive: sidebar on wide screens, tabs on phones)
- **Sign in** with an emailed six-digit code. Codes last 10 minutes, allow 5 tries,
  one per minute per email. Only hashes of codes and session tokens are stored.
- **Inbox**: add a PDF (with a text layer) or a text file. Files are checked by
  content, not name: 5 MB limit, wrong types, fake PDFs, empty, binary and
  non-UTF-8 files are refused with a plain message. Shows source, status and
  what was read. Duplicates are detected and not added twice. A scan or photo is
  reported as unreadable, never as "nothing to do".
- **Actions**: every suggestion with the exact sentence it came from (linked to
  the document, with the sentence marked in its text). Statuses: Needs review,
  Ready for approval, In progress, Completed, Unable to verify, and Dismissed.
  The person approves, dismisses, completes, reopens, or sets the date themselves.
  A date the person sets is kept apart from what the document said and labelled
  "confirmed by you".
- **Drafts**: saved as drafts that are not sent. There is no "sent" state anywhere.
- **Timeline**: dated open items in order, past-date items first, undated items
  listed separately. Not a calendar.
- **Home**: counts, what needs attention, what is coming up (60 days), recently done.
- **Settings**: retention period (30/90/180/365 days or until deleted, enforced
  when the person next opens the app), download everything as JSON, delete the
  account (typed confirmation; removes every file and row), sign out.
- **Isolation**: every query filters by the signed-in user. Tested with two users:
  no list, read, change, draft, delete or export crosses accounts. Changes from
  another website are refused (origin check).
- No document text or email address is written to logs.
- No demo data exists in the app. An empty account is empty.

**Extractor** (`src/lib/extract/`, 22 tests): see "Known limits" below.

**Privacy policy** (`/privacy`): rewritten to describe what the app really does.
Drafted, not reviewed by a lawyer. Its launch-time claims are listed in
`docs/DEPLOY-APP.md`. No analytics run inside the app (tested), and the old policy's
statement that declining sends no analytics was wrong and is corrected.

## Mocked or illustrative

- The hero preview on the homepage is a drawing, labelled as such.
- The homepage demo's approvals live in the page only.

## Needs something outside the code (owner action)

See `docs/DEPLOY-APP.md`. Until it is done, `/app` cannot sign anyone in on the
live site.
- A D1 database and an R2 bucket, and the `0001_app.sql` migration applied.
- `DB` and `FILES` bindings on the Pages project; `RESEND_API_KEY` (and optionally
  `LOGIN_FROM`) for sign-in emails. Without them, sign-in answers "not available".
- A Resend sending domain for `vnta.xyz`. Not tested against real email.
- The beta form uses the existing `INQUIRIES` binding. Not tested live.
- Share images (`/og.png`, `/share/*`) still show the old branding.

## Not built yet

- A separate `app.vnta.xyz` hostname (the app lives at `vnta.xyz/app` for now)
- OCR for scanned PDFs and photos
- Any AI model, and the consent flow that must come before one (the schema has a
  place for consent, `users.ai_consent_at`; nothing uses it)
- Email, calendar and any external action. Not in v1 by design.
- Reminders or notifications
- Retention runs when the person opens the app, not on a schedule
- Terms of service for the product (the terms page still describes the old site)
- Automated browser tests in CI. The browser run is a manual script for now.
- Email-code sign-in has no CAPTCHA or per-IP limit. Per-email limits only.

## Known limits of the extractor

- English only. Dates in words or numbers, amounts in €, £ and $.
- It does not know the date of a letter, so "within 14 days" gives no due date.
- An amount in a sentence with no date and no payment wording (for example
  "The renewal premium is €412.80") is not attached to the renewal yet.
- Rules will miss things. It reports "nothing found" as exactly that, never as
  "nothing to do".
