# EVIDENCE

## 2026-08-30 baseline

- Remote source of truth: `lsk7209/spinkorea` `main` at `c2d0ff1cdb2ea81ec1061377a3a8895ce3c808bd`; successful same-SHA Production deployment `6136416928` and successful Actions runs were observed before editing.
- Preservation boundary: `D:\web\spinkorea` is clean but five commits behind and remains read-only. Work occurs only in `D:\web\seo-worktrees\spinkorea-seo-20260830`.
- Public mobile geometry at 390x844: the fixed SPIN button was `{x:246,y:700,w:112,h:112}` and the lunch preset card was `{x:201,y:612.5,w:173,h:155}`, producing about 7,560 square pixels of overlap.
- The roulette itself exposes a separate 64x64 SPIN button, so the mobile fixed button is duplicate functionality.
- `public/sitemap.xml` contains 138 URLs, 138 `changefreq` tags, and 138 `priority` tags. Generator ownership is `scripts/generate-assets.mjs`.
- Audit false positive: `public/robots.txt` explicitly allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended, OAI-SearchBot, Yeti, and Daumoa; only `/api/` is excluded.

## 2026-08-30 local implementation verification

- `npm ci`: 275 packages audited, 0 vulnerabilities.
- `npm run type-check`: PASS.
- `npm run content:validate`: PASS, 650 generated plans, 76 existing titles, 50 approved editorial entries, quality floor 88, maximum similarity 0.235.
- `node scripts/validate-editorial-drafts.mjs`: PASS, 27 October drafts and maximum compared similarity 0.219.
- `npm run build`: PASS, Vite build plus 635 generated static routes.
- `npm run verify:growth`: 25/25 PASS, including the mobile duplicate-control assertion.
- `node scripts/verify-search-scope.mjs`: 18/18 PASS, including public/dist equality, paired URL/lastmod, canonical HTTPS uniqueness, and date-format assertions.
- `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- Valid XML sitemap: 138 `url`, 138 `loc`, 138 `lastmod`, zero `changefreq`, zero `priority`.
- Local Playwright mobile 390x844: HTTP 200, apex canonical, one H1, no overflow, fixed SPIN `display:none`/0x0, in-wheel SPIN visible and result produced.
- Local Playwright desktop 1440x1000: HTTP 200, apex canonical, one H1, no overflow, fixed SPIN visible at 112x112 and result produced.
- The only browser console error remained the already-documented third-party AdSense 403; no product runtime failure was observed.

## 2026-08-30 independent review and live release

- Independent Luna/max final review: source GO, BLOCKER 0, HIGH 0. The noted harness/project-state drift and sitemap-verifier gaps were repaired before closeout.
- Runtime commit: `9db17d0e63ddfe7772d9437250fb0da1e90a2a99`, exactly five staged files, 0 secret-pattern hits, pushed after exact remote no-drift verification.
- Same-SHA GitHub Action: Hosting Cost Guard `33268913711`, completed `success`.
- Same-SHA Production deployment: `6158893572`, completed `success`.
- Final public HTTP: `/` 200 with apex canonical; `/sitemap.xml` 200 and valid XML with 138 URL/loc/lastmod entries plus zero `changefreq`/`priority`; `/robots.txt` 200 with sitemap reference, GPTBot/ClaudeBot rules, and `/api/` exclusion; unknown verification route 404.
- Final public Playwright mobile 390x844: one H1, apex canonical, no horizontal overflow, in-wheel SPIN 64x64 visible, duplicate fixed SPIN `display:none`/0x0, result produced.
- Final public Playwright desktop 1440x1000: in-wheel SPIN visible and fixed SPIN remains visible at 112x112.

## Prior evidence history

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

## 2026-08-28 Dependency security remediation

- Baseline `npm audit --json`: 8 vulnerable package paths (6 high, 2 low) across nanoid, postcss, react-router, react-router-dom, vite, ws, esbuild, and Babel paths.
- `npm audit fix`: updated 25, added 2, removed 5 transitive package entries without changing declared dependency ranges; audit result 0.
- Clean `npm ci`: PASS; 275 packages audited, 0 vulnerabilities.
- `npm audit --json`: PASS, total 0. `npm audit --omit=dev --json`: PASS, total 0.
- Resolved safe versions include nanoid 5.1.16 and 3.3.18, postcss 8.5.26, react-router/react-router-dom 7.18.2, vite 7.3.6, esbuild 0.28.2, ws 8.21.3, and @babel/core 7.29.7.
- `npm run type-check`: PASS; `npm run build`: PASS, Vite 7.3.6, 3,317 modules and 627 pages rendered.
- `npm run content:validate`: PASS (650 plans, 50 approved); editorial validator PASS (27 October drafts); growth PASS 24/24; search scope PASS 13/13.
- `git diff --check`: PASS.
- Dependency import smoke for `@libsql/client`, `nanoid`, and `react-router-dom`: PASS.
