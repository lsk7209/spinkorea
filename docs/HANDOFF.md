# Current handoff — 2026-08-30 03:43 KST

## User goal

Audit and optimize the dashboard fleet with GitHub-first handling for sites changed on another computer. This checkout owns the focused SpinKorea SEO/SXO repair.

## Exact current state

- Runtime source commit `9db17d0e63ddfe7772d9437250fb0da1e90a2a99` is on remote `main`; same-SHA Hosting Cost Guard `33268913711` and Production deployment `6158893572` are successful. This documentation closeout follows that runtime commit.
- The original `D:\web\spinkorea` checkout is clean but five commits behind and is deliberately untouched.
- Fresh public mobile evidence confirms the 112x112 fixed SPIN control obscures the lunch preset card, while the roulette already contains its own SPIN action.
- The focused source fix is live: the duplicate fixed SPIN control is hidden below `md`, and the sitemap generator emits only `loc` and truthful `lastmod`. Robots remains unchanged because it already allows named AI/search crawlers.

## Completed work

- GitHub/deployment baseline, repository/handoff review, generator ownership mapping, mobile geometry reproduction, focused implementation, full local gate, independent Luna/max review, exact push, same-SHA deployment monitoring, and final public desktop/mobile checks are complete.
- Goal Harness acceptance, evidence, risks, plan, review, stop condition, and canonical project state are current.

## Changed files or live systems

- Runtime commit `9db17d0` changed `src/components/SpinButton.tsx`, `scripts/generate-assets.mjs`, `scripts/verify-growth-optimization.mjs`, `scripts/verify-search-scope.mjs`, and `public/sitemap.xml`.
- Remote `main` and its Git-connected Production deployment changed. Goal Harness, `PROJECT_STATE.md`, and this handoff are the documentation closeout.
- No database, content publishing, indexing submission, Google/Naver/AdSense/DNS account state, or direct Vercel CLI/API mutation occurred.

## Fresh validation evidence

- Public homepage: HTTP 200, apex self-canonical, one H1, no horizontal overflow.
- Fixed button/card overlap: about 7,560 square pixels at 390x844.
- Local gates: clean install; type/content/editorial/growth/search/build/full and production dependency audits all PASS; 635 routes rendered.
- Local mobile: fixed SPIN is hidden and the in-wheel control produces a result. Local desktop: fixed SPIN remains visible and produces a result.
- Sitemap: valid XML, 138 URL/loc/lastmod entries, zero changefreq/priority.
- Independent review: source GO, BLOCKER 0, HIGH 0; documentation drift and the low sitemap-verifier gap were repaired.
- Same-SHA release: Hosting Cost Guard `33268913711` success; Production `6158893572` success.
- Final public: homepage 200/self-canonical/one H1/no overflow; sitemap and robots 200; unknown route 404; mobile in-wheel result works with fixed control hidden; desktop fixed control remains visible.

## Side effects and rollback

- Roll back the product change by reverting runtime commit `9db17d0`, pushing the focused revert, and confirming the resulting Git-connected deployment. No database or account rollback is required.

## Blockers or risks

- No in-scope blocker. Public API authentication/rate-limit/test risks remain explicitly outside this SEO/SXO release.

## Single next step

Return to `D:\web\multi-dashboard`, record SpinKorea as complete in the fleet ledger, and choose the next site from fresh dashboard evidence.

## Deliberately not run or sent

- No bulk content rewrite, scheduled publishing, GSC/IndexNow submission, DB write, direct Vercel CLI/API mutation, or Google/Naver/AdSense/DNS account change.

# Prior handoff — 2026-08-11 KST

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
