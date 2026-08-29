# RISKS

## 2026-08-30 focused repair risks

| Risk | Impact | Mitigation | Status |
|---|---|---|---|
| Removing the mobile FAB could remove the only spin action | Functional regression | Keep and browser-test the existing in-wheel SPIN button; retain FAB from `md` upward | Controlled |
| Editing generated XML directly would drift on the next build | SEO regression | Change `buildSitemap`, regenerate both public/dist outputs, and add source-independent output assertions | Controlled |
| Fleet audit parser misread `/api/` exclusion as global AI-bot blocking | Unnecessary robots regression | Leave robots unchanged and record the false positive | Controlled |
| Remote `main` changes during work | Lost other-computer work | Re-fetch and require exact remote ancestry immediately before push | Closed; exact no-drift check passed before runtime commit |
| Existing high-risk API/security items are outside this focused SEO release | Residual security risk | Do not broaden this release; preserve the existing risk record for a separately authorized security task | Open |

## Prior risk register

| Risk | Impact | Likelihood | Mitigation | Status |
|---|---|---|---|---|
| Unauthenticated DB-writing endpoints | Turso cost/storage abuse | High | Rate limit, quota, bounds, retention or disable endpoints | Open HIGH |
| Arbitrary redirect schemes and trusted Host header | Phishing/unsafe redirect and forged response URL | Medium | Allow only HTTP(S), use fixed public origin | Open HIGH |
| API excluded from TypeScript and tests | Production handler regressions escape build | High | API tsconfig plus handler tests in CI | Open HIGH |
| Vulnerable dependencies | Known security issues in toolchain/runtime | Medium | Upgrade with compatibility checks | Open HIGH |
| Mutable Vercel CLI execution in CI | Supply-chain exposure of CI secrets | Low/Medium | Pin dependency and use no-install | Open HIGH |
| README infrastructure drift | Operators run nonexistent or wrong commands | High | Rewrite deployment/run instructions to current stack | Open MEDIUM |

## Risk Notices

- This audit did not modify production, Vercel, databases, Google services, or GitHub remote state.
