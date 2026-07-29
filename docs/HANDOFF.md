# Current handoff — 2026-07-29 KST

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
