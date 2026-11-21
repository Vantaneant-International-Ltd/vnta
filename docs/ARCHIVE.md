# Archive: VNTA Robotics website (November 2026)

In November 2026 VNTA changed direction, from robotics integration validation to
**VNTA Personal**, a consumer product for everyday administration. The robotics
work was archived, not deleted.

## Where everything is

| What | Where |
| --- | --- |
| The whole site as it was, before the pivot | commit `a398702` (the last commit on `main` before the pivot). A local tag `archive/robotics-site-2026-11-20` points at it, but pushing tags was blocked, so use the commit. |
| Robotics product code, `STATUS.md`, pricing and margin rules | the private `vnta-robotics` repository. **Not touched.** |
| The robotics pages, components, notes and pricing | in git history at that commit |

To look at an old file: `git show a398702:src/routes/robotics/+page.svelte`.
To bring the old site back: `git checkout a398702 -- <path>`.

A tag would be nicer than a commit hash. Someone with tag-push access can run
`git tag archive/robotics-site-2026-11-20 a398702 && git push origin archive/robotics-site-2026-11-20`.

## What was removed from the working tree

- `src/routes/robotics/` (the product page, pricing page and the notes pages and RSS feed)
- `src/lib/components/`: `Architecture`, `CapabilityPanel`, `RouteMap`, `SampleReport`, `PilotForm`, `Stage`
- `src/lib/content/pricing.ts`, `notePaths.ts`; `src/lib/server/` (notes and social posts)
- `src/lib/content/note-images/`, `post-images/`
- `scripts/publish-notes.*` and `scripts/fixtures/`
- `.github/workflows/notes.yml` and `posts.yml`. These were scheduled jobs that deployed
  the site and posted robotics notes to Mastodon, Bluesky and Pixelfed every day.
  They are gone from this branch, so **merging this branch stops them**.

## What was kept

- The domain, Cloudflare Pages project, deploy workflow, `_headers`, `_redirects`
- The contact function (`functions/api/inquiry.js`, saves to D1)
- **The client portal and its functions, untouched** (`src/routes/portal`, `functions/portal`).
  It holds a live client's data and is gated by Cloudflare Access.
- **VNTA Studio** (`/studio`), untouched
- The social-profile job (`social-profile.yml`), with its text updated

## Redirects

`/robotics` and everything under it now forward to `/` (`static/_redirects`).
The old `/robotics/notes/rss.xml` feed no longer exists.
