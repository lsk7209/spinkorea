# CHANGELOG

## Changed Files

| File | Change | Reason |
|---|---|---|
| `.goal-harness/*` | Added audit goal, state, evidence, risks, and review record | Make the review reproducible |
| `PROJECT_STATE.md` | Added canonical current-state handoff | Support later resumption |
| `src/utils/analytics.ts`, `src/components/AnalyticsRouteTracker.tsx`, `src/main.tsx`, `src/App.tsx` | Added queued SPA page views and privacy-safe conversion events | Measure search-to-tool behavior without sending user query data |
| `src/pages/Home.tsx`, `src/pages/ToolsIndex.tsx`, `src/components/MoreTools.tsx` | Added primary CTA, trust cues, quick paths, and internal navigation events | Reduce first-action friction |
| `src/components/SEO.tsx`, `src/components/ToolLayout.tsx`, `src/pages/About.tsx` | Added consistent entity and tool schema graphs | Improve machine-readable identity and tool understanding |
| `scripts/generate-assets.mjs`, `src/data/site-pages.json`, `public/sitemap.xml` | Unified Korean static metadata, added crawlable tool/blog directories, updated key lastmod values | Align source HTML with Korean intent and strengthen crawl paths |
| `src/pages/BlogIndex.tsx`, `src/pages/BlogPost.tsx` | Added content selection and content-to-tool conversion events | Measure editorial contribution to tool use |
| `src/pages/NotFound.tsx`, `public/robots.txt` | Added soft-404 noindex and repeated API exclusions | Reduce low-value indexation and crawler access to APIs |
| `scripts/verify-growth-optimization.mjs`, `package.json` | Added focused deterministic verifier | Prevent SEO/conversion regression |
| `src/pages/tools/{LottoGenerator,DiceRoller,CoinFlip,RandomTeam,PasswordGenerator,YesNoOracle,JsonFormatter,QrCodeGenerator}.tsx` | Added real completion-boundary events | Measure completed outcomes instead of first interaction |
| `src/data/post-metadata.runtime.generated.json`, `src/data/postMetadata.ts`, `scripts/generate-assets.mjs` | Added a runtime-only metadata projection | Reduce the blog metadata route chunk while preserving build-only source/link fields |
| `src/components/ToolLayout.tsx`, `HourlyWageCalculator.tsx`, `BmiCalculator.tsx`, `VatCalculator.tsx` | Added official references, review dates, disclaimers, and the current 2026 wage baseline | Strengthen YMYL trust and freshness |
# 2026-08-28 editorial schedule extension

- Added a SpinKorea-specific practical-tool editorial persona and two samples.
- Added 23 reviewed daily articles for September 8 through September 30.
- Added an idempotent extension script that preserves the existing content plan and legacy manifest entries.
- Added an `editorial` metadata source so reviewed data-driven articles are indexable while unreviewed generated pages stay noindex.
- Extended validation for the mixed 5-hour legacy and daily editorial schedule plus 3,500-character body floor.

# 2026-08-28 October editorial extension

- Added six researched draft files containing 27 independent articles for October 1-27 at 08:00 KST.
- Added six route-lazy October content chunks and updated the generated plan, manifest, and metadata projections.
- Added an idempotent October schedule integrator and a standalone research/template/link/length/similarity validator.
- Extended plan validation to assert the exact 50-day editorial run through October 27.
- Repaired the standalone validator so it remains reproducible after October drafts are integrated.

# 2026-08-28 Dependency security remediation

- Refreshed `package-lock.json` within existing semver declarations to remove all npm-audit findings.
- No package.json range, application source, content, route, or deployment configuration was changed.
