# Client Portal (`/portal`)

A private, per-client reporting instrument. A managed client signs in and sees the
managed-service work VNTA delivers for them: implementations, features,
optimisations, security audits, regular audits, performance work, and files.

This is a VNTA reporting surface. It is **not** PC-build status, **not** the
client's own site admin/CMS, and **not** a marketing page.

The module is self-contained under `src/routes/portal/` so it can be lifted into a
standalone app later:

```
portal/
  +page.ts              route config (ssr=false, prerender=true — client-only, like /admin)
  +page.svelte          resolves identity, then renders sections in order
  resolve.ts            identity -> client id -> data file
  portal.css            module styles (tokens only; classes prefixed p-)
  components/           one component per section
  content/
    types.ts            shared schema (also consumed by the future email digest)
    clients.ts          authenticated email -> client id registry
    andrew.json         per-client data (currently placeholders)
```

## Access (edge, not app)

There is **no custom auth here.** `/portal` is gated by **Cloudflare Access**
(email one-time code) at the edge. Only invited emails ever reach the route.

The authenticated email is used for exactly one thing: **choosing which client
data file to load.** It is never rendered and never used for authorisation.

How the email resolves to a file:

- **Edge / a future server build** reads it straight from the
  `Cf-Access-Authenticated-User-Email` header
  (`emailFromHeaders(request.headers)` in `resolve.ts`).
- **This static build** has no app server, so the browser reads the same Access
  identity from Cloudflare's `/cdn-cgi/access/get-identity` endpoint
  (`getAuthenticatedEmail()`).
- **Local dev** (no Access in front) has no identity, so it falls back to the
  single default client (`DEFAULT_CLIENT_ID` in `content/clients.ts`).

`resolveClientId(email)`:

| email                         | result                                  |
| ----------------------------- | --------------------------------------- |
| `null` (local dev, no Access) | default client                          |
| mapped in `clients.ts`        | that client                             |
| authenticated but unmapped    | `null` → "No portal for this account."  |

Each client's JSON is a separate lazy chunk (`import.meta.glob`), so **only the
resolved client's file is ever fetched by the browser.** No other client's data
ships to a session.

## Adding a delivery or audit entry

Edit that client's file in `content/` (e.g. `content/andrew.json`). Follow
`content/types.ts`.

- **Delivery** (`delivery[]`): `{ date, category, title, detail }`. Newest first;
  the delivery log is a chronological timeline. `category` is a free label
  ("Feature", "Optimisation", "Launch").
- **Audit** (`audits[]`): `{ date, type, result, href? }`. Add `href` to link a
  report.
- **Security findings** (`security.findings`): leave a severity `null` until an
  audit has actually reported it — `null` renders as `TODO`, never as a real
  "0 findings" claim.

Dates are rendered verbatim (never parsed), so use whatever reads well
(`04 Aug 2026`). No en dashes anywhere in copy.

## Adding a client

1. Add `content/<id>.json` (copy `andrew.json`, follow `types.ts`).
2. Add one line to `CLIENT_BY_EMAIL` in `content/clients.ts`:
   `'their-access-email@example.com': '<id>'`.
3. Invite that email in the Cloudflare Access policy for `/portal`.

No client-picker UI and no shared bundle: the registry plus per-file code
splitting keep each client to their own record.

## Notes / follow-ups

- `content/andrew.json` is **all placeholders with `TODO` markers.** Replace with
  real, verified entries before sharing the link. Do not invent audit findings,
  dates, metrics, or claims.
- Confirm Andrew's **real Cloudflare Access email** and set it in `clients.ts`; the
  current value is a guess and a mismatch will deny him.
- Added one shared token, `--font-mono`, to `src/lib/styles/tokens.css` (no mono
  token existed; pages used the stack inline). Used for portal labels and dates.
