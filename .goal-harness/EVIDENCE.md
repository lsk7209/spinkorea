# EVIDENCE

## Validation Level

Level: 4

## Commands Run

| Command | Result | Notes |
|---|---|---|
| harness-init.py | PASS | size=large, domain=general, created=2026-08-27T21:25:16+09:00 |
| `npm ci` | PASS | 277 packages installed |
| `npm audit --omit=dev` | FAIL | 8 vulnerabilities: 2 low, 6 high |
| `npm run type-check` | PASS | TypeScript no-emit check |
| `npm run content:validate` | PASS | 600 plans, 76 existing titles, minimum score 88 |
| `npm run build` | PASS | 3306 modules, 624 static pages |
| `node scripts/verify-search-scope.mjs` | PASS | 9/9 assertions |
| `node scripts/audit-hosting-costs.mjs .` | PASS | No cost findings; no test command detected |
| local preview HTTP smoke | PASS | Six representative routes returned 200; Vite SPA fallback is a boundary |

## Test Results

| Test | Result | Notes |
|---|---|---|

## Failed Checks

- Dependency security audit reported upgradeable vulnerable packages.

## Fixes Applied

- No product code was changed. Build-generated line-ending noise was restored to HEAD.

## Completion Evidence

- Typecheck, content validation, production build, search-scope assertions, and local HTTP smoke passed.
- No browser interaction, API integration test, or live production validation was performed.

## 2026-08-28 Search And Conversion Optimization

| Command or check | Result | Notes |
|---|---|---|
| `npm run audit:gsc` | N/A | Configured service-account file missing; baseline recorded as evidence_missing |
| `npm run type-check` | PASS | Application and new analytics/schema code compile |
| `npm run content:validate` | PASS | 600 plans, 76 existing titles, minimum score 88 |
| `npm run build` | PASS | 3307 modules transformed, 625 static pages rendered |
| `npm run verify:growth` | PASS | 17 assertions for entity, Korean meta, route metadata, schemas, crawlable directories, events, CTA, 404 noindex |
| `node scripts/verify-search-scope.mjs` | PASS | 9/9 index/noindex boundary assertions |
| Playwright desktop flow | PASS | Home CTA visible; roulette executed and returned a result; tools hub loaded |
| Playwright mobile 390x844 | PASS | Quick paths, search, categories and tool grid remained accessible |
| Runtime JSON-LD inspection | PASS | `/tools` graph: Organization, WebSite, CollectionPage, ItemList |
| `git diff --check` | PASS | Line-ending notices only |

Browser console boundary: one expected local AdSense network 403; no application exception observed.

Validation level remains Level 4. Live deployment and external analytics/search account state were not verified.

## 2026-08-28 Completion, Trust, And Blog Performance Phase

| Command or check | Result | Notes |
|---|---|---|
| `npm run type-check` | PASS | Completion helper, 8 integrations, source props, and runtime metadata compile |
| `npm run build` | PASS | 3307 modules transformed and 625 static pages rendered |
| `npm run verify:growth` | PASS | 24 focused assertions |
| `node scripts/verify-search-scope.mjs` | PASS | 9/9 index/noindex boundaries retained |
| `npm run content:validate` | PASS | 600 plans, 76 existing titles, minimum score 88 |
| Runtime metadata comparison | PASS | JSON 678,108 B to 385,788 B; built JS 538.53 kB to 328.41 kB raw |
| Playwright random-team completion | PASS | Four names produced two teams after the completion callback |
| Playwright mobile 390x844 | PASS | 2026 wage default, official source, review date, and disclaimer visible |
| `git diff --check` | PASS | Line-ending notices only |

Browser console boundary remains the expected local AdSense request error; no application exception was observed.
# 2026-08-28 editorial schedule

- `node scripts/extend-editorial-schedule.mjs`: 623 total, 23 extension rows, last 2026-09-30 08:00 KST.
- `npm run content:validate`: PASS; 623 plans, 76 curated titles, minimum score 88.
- `npm run type-check`: PASS.
- `npm run build`: PASS; 3,308 modules, generated editorial chunk 221.49 kB raw / 11.13 kB gzip and lazy-loaded only on matching article routes.
- `npm run verify:growth`: PASS 24/24.
- `node scripts/verify-search-scope.mjs`: PASS 9/9.
- Product review found 0.959-0.969 template similarity and blocked approval. All 23 were subsequently rewritten as independent articles. Final validation reports 23 approved, minimum plain-body length 3,752, maximum pairwise token Jaccard 0.235.
- Daily publication changed to 08:00 KST so the 09:00 KST scheduled build can include the article without a one-day SEO discovery delay.
- Future-date production build with `BUILD_NOW=2026-10-01T00:00:00+09:00`: PASS, 699 article bodies rendered. A normal build then restored present-time public assets.
- Performance: the combined editorial chunk was split into four route-lazy chunks, gzip 26.29, 26.38, 22.91 and 19.93 kB instead of one 89.69 kB chunk.
- Future index verification after policy repair: route exists, no `noindex`, sitemap=true, RSS=true, recent editorial present in llms=true. Normal-time build rerun restored current public assets.
- Expanded `verify-search-scope`: PASS 13/13, including editorial metadata source, static predicate, runtime robots policy, and future-page exclusion before publish time.
- Independent test re-review: no material findings.

## 2026-08-28 October 27-article extension

- `node scripts/validate-editorial-drafts.mjs`: PASS; 6 files, 27 October drafts, 50 editorial drafts compared, maximum Jaccard 0.219.
- `npm run content:validate`: PASS; 650 plans, 50 approved editorial posts, exact last slot 2026-10-27 08:00 KST, maximum integrated similarity 0.235.
- `npm run type-check`: PASS; `npm run verify:growth`: PASS 24/24; `node scripts/verify-search-scope.mjs`: PASS 13/13.
- Current production build: PASS; 3,317 modules and 627 currently publishable pages rendered.
- Future build with `BUILD_NOW=2026-10-28T00:00:00+09:00`: PASS; 726 pages rendered. `/blog/dutch-pay-discount-rounding/` exists, has no noindex, and is present in sitemap, RSS, and llms.txt.
- Normal production build rerun after the future check restored current-time public assets.
- Six October route-lazy chunks are 14.98-22.42 kB gzip.
- `git diff --check`: PASS with line-ending notices only.
