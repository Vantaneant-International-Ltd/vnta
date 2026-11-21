# Running the VNTA app live

The app is built and tested locally. To run it on vnta.xyz, someone with access to
the Cloudflare account needs to do these steps. Nothing here has been done yet, and
nothing is deployed from this repository without an explicit decision.

## 1. Create the storage

Create both in the EU. The privacy policy says the app's database and files are stored in
Europe, so this step makes that sentence true.

```sh
npx wrangler d1 create vnta-app --location weur
npx wrangler r2 bucket create vnta-files --jurisdiction eu
npx wrangler d1 migrations apply vnta-app --remote   # run from a wrangler config that names the DB; or paste migrations/0001_app.sql in the dashboard
```

## 2. Bind them to the Pages project (Dashboard: Workers & Pages > vnta > Settings > Bindings)

| Type | Name | Value |
| --- | --- | --- |
| D1 database | `DB` | `vnta-app` |
| R2 bucket | `FILES` | `vnta-files` |
| Secret | `RESEND_API_KEY` | from Resend |
| Variable (optional) | `LOGIN_FROM` | `VNTA <login@vnta.xyz>` once the domain is verified in Resend |

**Do not set `DEV_LOG_LOGIN_CODES` on the live project.** It prints sign-in codes to
logs instead of emailing them and exists for local development only.

**Do not add a `wrangler.toml` to the repository root.** On Pages, that file takes
over the project's settings from the dashboard and would drop the bindings above and
the existing `INQUIRIES` binding. The file in `dev/` is for local use only.

## 3. Verify the sending domain in Resend

Add `vnta.xyz` in Resend, add the DNS records it asks for, then send yourself a test
sign-in code from the live site.

## 4. Claims to verify at launch

`/privacy` makes statements the code cannot prove. Check each one before anyone is invited,
and change the page in the same commit if one is not true:

- [ ] D1 database and R2 bucket were created in the EU (step 1).
- [ ] Resend and Cloudflare have signed data-processing terms with the company, and the
      international-transfer wording on the page matches them.
- [ ] No analytics or third-party script loads inside `/app` (open the app with the browser's
      network tab and confirm no request to Google).
- [ ] The retention, export and delete controls work on the live site.
- [ ] A lawyer has read the privacy page and the terms. They were drafted, not reviewed.

Passkeys are bound to the site's hostname. They work on whatever address the app is served from
(vnta.xyz today). If the app later moves to `app.vnta.xyz`, existing passkeys will stop working and
people will need to add them again, so decide the final address before inviting users.
Apply `migrations/0002_security.sql` as well as `0001_app.sql`.

## 5. Before inviting anyone

- Publish a privacy policy that matches what the app really does.
- Try the whole path with a real inbox: sign in, add a document, export, delete.

## Run it locally

```sh
npm install --ignore-engines
npm run app:dev      # builds, creates the local database, serves on http://localhost:8788
```

Sign-in codes are printed in that terminal. Local data lives in `dev/.wrangler/` and is
ignored by git.
