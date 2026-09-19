# Release checkpoint — 2026-09-20 08:55 대한민국 표준시

Build689/TypeScript; loan/JSON/storage/spin/content/growth25/search18/static; reliability browser32/32 and built-preview SPK014 browser30/30, both pageerrors0; all727 metadata identities/dates/schedules/source flags preserved. PASS. See release report for command details and local proof limits.

---

# Current checks — SPK-014 — 2026-09-20

Report-only checks: exact claim-ID coverage E01–08/B01–09/A01–08 (25), SHA256 comparison of27 preserved changed/new product files, changed-product-path set equality, empty related BMI/hourly tool diff, local metadata/cache/render contract inspection, official PDF table visual comparison, independent final report review, git diff --check. Evidence: output/spk014/verification.json and source-review report. No implementation regression test, typecheck, build or browser rerun this slice; these are required only after future product edits. External state NOT RUN.

Result: all report-specific checks PASS; independent findings incorporated. Product behavior checks remain NOT RUN.

---

# Current checks — 2026-09-20 08:00 KST

On Node24.12.0: node scripts/verify-loan.mjs; node scripts/verify-tool-reliability.mjs; npm run type-check; npm run lint; npm run content:validate; npm run build; npm run verify:growth; node scripts/verify-search-scope.mjs; node scripts/verify-audit-repairs.mjs; node scripts/verify-tool-reliability-browser.mjs; git diff --check. All PASS. Build precedes static/search checks. Browser uses installed user-level Playwright or PLAYWRIGHT_MODULE, no dependency added. It blocks external/API/non-GET requests and mocks clipboard, so does not prove production or real permissions.

---

# Prior slice — 2026-09-20

Current checks: node scripts/verify-tool-reliability.mjs; npm run type-check (also lint); npm run build; npm run content:validate; npm run verify:growth; node scripts/verify-search-scope.mjs; browser regression; git diff --check.

---

# TESTS

## Required Checks

- `npm run type-check`
- `npm run content:validate`
- `npm run build`
- `node scripts/verify-search-scope.mjs`
- focused structured-data and analytics assertions
- desktop and mobile browser flow
- `git diff --check`

## User Scenario Tests

- Search visitor sees a clear homepage promise and starts the roulette.
- Visitor filters/selects a tool and triggers a privacy-safe engagement event.
- Blog visitor follows a related-tool CTA.
- Static tool HTML retains canonical, indexability, and tool schema.
