# RISKS

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
