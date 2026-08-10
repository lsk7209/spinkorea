# Current handoff — 2026-08-11 KST

## User goal

Improve the next AdSense-readiness candidate without changing any Google account or review state.

## Current state

- The current working repository is `D:\web\spinkorea`, branch `main`, and it was clean before this focused repair.
- Public discovery on 2026-08-11 found one legacy route, `/blog/fuel-economy-guide`, returning the homepage with HTTP 200 and an apex canonical. The slug was retained as generated content but had no emitted static route.
- The local repair restores that exact legacy route as an intentional, self-canonical `noindex,follow` page. It remains excluded from sitemap, RSS, llms, blog discovery, and IndexNow inputs.

## Completed and deployed work

- Added `src/data/legacy-post-metadata.json` with only `fuel-economy-guide`.
- Updated `scripts/generate-assets.mjs` and regenerated `src/data/post-metadata.generated.json` so the one legacy record is emitted safely.
- Expanded `scripts/verify-search-scope.mjs` with exact route, canonical, robots, and discovery-exclusion checks.
- Fresh local validation passed: `npm run type-check`, `npm run build`, `node scripts/verify-search-scope.mjs` (9 assertions), `git diff --check`, and independent 13-assertion build-output verification.
- Focused commit `b60022b` was pushed to `origin/main`. After the Git-connected deployment propagated, a public fetch confirmed HTTP 200, self-canonical `https://spinkorea.kr/blog/fuel-economy-guide`, and `noindex,follow`. The live sitemap, RSS, and llms feed each return HTTP 200 and do not contain the legacy slug.

## Side effects and rollback

- No CMS, SSH, AdSense, GSC, or index-submission action has been made.
- The source change affects one legacy URL only. Roll back by reverting focused commit `b60022b`, then wait for the Git-connected deployment and rerun the scope verifier.

## Single next step

Treat this priority repair as complete. Choose the next additional-ten site only from fresh, site-specific evidence; do not change any AdSense review or account state.

# Prior handoff — 2026-07-29 KST

## User goal

Improve the site fleet for AdSense review readiness and useful Google search visibility without bulk AI-style content expansion.

## Current state

- This isolated checkout is `D:\web\_review\spinkorea-20260729d`, cloned from `origin/main` at `847575e` because the primary `D:\web\spinkorea` checkout has unrelated, uncommitted generated-content changes.
- Fresh dashboard evidence from `2026-07-29T03:03:00.728Z`: AdSense loader and ads.txt are healthy; GSC has 50 impressions, zero clicks, average position 42.04. The primary landing path is the online roulette route.
- The browser review confirmed the homepage provides a functioning roulette and clear utility navigation.
- The site had 506 published blog posts, 498 of which are generated. Their static HTML exposed only a title/summary shell, while sitemap, RSS, and blog index promoted all of them. This is a high-confidence low-value and topical-dilution risk.

## Completed in this checkout

- Limited the visible blog list, sitemap, RSS, and llms feed to reviewed (`curated`) posts.
- Preserved generated and legacy post URLs for existing visitors, but emits `noindex,follow` both in prerendered HTML and after client navigation.
- Preserved existing metadata rows that the generator cannot reconstruct, so a normal build cannot silently turn existing blog URLs into missing routes.
- Added `scripts/verify-search-scope.mjs` to prove generated URLs are excluded from the sitemap and carry `noindex`, while a reviewed editorial URL remains indexable.

## Fresh validation evidence

- `npm ci` completed.
- `npm run content:validate` passed: 600 generated plans, 76 existing titles, quality floor 88.
- `npm run build` passed.
- `node scripts/verify-search-scope.mjs` passed all five assertions.
- `npm run type-check` passed.
- The generated metadata file remains byte-for-byte equal to `HEAD` after a build, so this release does not silently remove legacy routes.

## Single next step

Commit and push `main`, wait for the Git-connected Vercel deployment, then recheck public sitemap plus generated, legacy, and reviewed routes.

## Side effects and rollback

- This change intentionally removes unreviewed generated and legacy pages from future sitemap/RSS/blog-list discovery. Existing direct URLs still render, with `noindex,follow`.
- Roll back by reverting the resulting focused commit in this repository; no external indexing request, AdSense submission, data write, or production credential action has been made.
