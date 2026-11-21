# Running the VNTA app live

The app is built and tested locally. To run it on vnta.xyz, someone with access to
the Cloudflare account needs to do these steps. Nothing here has been done yet, and
nothing is deployed from this repository without an explicit decision.

## 1. Create the storage

```sh
npx wrangler d1 create vnta-app
npx wrangler r2 bucket create vnta-files
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

## 4. Before inviting anyone

- Publish a privacy policy that matches what the app really does.
- Try the whole path with a real inbox: sign in, add a document, export, delete.

## Run it locally

```sh
npm install --ignore-engines
npm run app:dev      # builds, creates the local database, serves on http://localhost:8788
```

Sign-in codes are printed in that terminal. Local data lives in `dev/.wrangler/` and is
ignored by git.
