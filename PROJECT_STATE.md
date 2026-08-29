# Project State

## Purpose

SpinKorea/SpinFlow의 검색 유입과 검색 방문자의 실제 도구 사용 전환을 개선한다.

## Current Work

- 2026-08-30: 대시보드 fleet 감사에서 확인된 모바일 고정 SPIN 겹침과 sitemap 불필요 힌트를 최소 범위로 수정하고 실서비스 검증까지 완료했다.
- 현재 브랜치: `main`; 배포된 런타임 커밋: `9db17d0e63ddfe7772d9437250fb0da1e90a2a99`; GitHub Action `33268913711`과 Production 배포 `6158893572`가 동일 SHA에서 성공했다.
- 외부 Google, Naver, AdSense, DNS, 데이터베이스 상태는 변경하지 않았다. 일반 Git push에 연결된 Production 배포만 실행됐다.

## Decisions

- 1차 전환: 방문자가 실제 결과를 확인함(`tool_result_viewed`; 현재 홈 룰렛에서 측정).
- 2차 전환: 룰렛 실행(`tool_used`), 개별 도구 참여(`tool_engaged`), 공유, 콘텐츠→도구 이동, 도구 간 이동.
- 브랜드 정본은 `SpinFlow`, 도메인 연결 이름은 `SpinKorea`로 구조화 데이터에 명시한다.
- 생성 글은 기존 `noindex,follow` 상태와 sitemap/RSS/llms 제외 경계를 유지한다.
- GA4에는 사용자 입력이나 URL 쿼리 문자열을 보내지 않는다.

## Material Changes

- 홈: 즉시 실행 CTA와 회원가입/브라우저 처리/기기 지원 신뢰 신호.
- 도구 허브: 목적별 바로가기, ItemList/CollectionPage, 모든 도구의 정적 크롤 링크.
- 도구 상세: WebApplication, BreadcrumbList, HowTo/FAQ와 개인정보 안전 전환 이벤트.
- 블로그: 콘텐츠 선택·도구 CTA 측정과 검토된 글 76개의 정적 허브 링크.
- 전역 SEO: Organization/WebSite 엔티티와 SpinFlow/SpinKorea 이름 연결.
- 정적 HTML: 영어 승인용 홈 메타·본문을 한국어 검색 의도와 사용자 안내로 교체.
- 404: `noindex,follow`; AI 크롤러별 `/api/` 차단 유지.
- 모바일 홈: 룰렛 내부 SPIN은 유지하고 중복 고정 SPIN은 `md` 미만에서 숨겨 추천 카드 가림을 제거했다.
- Sitemap: 모든 138개 URL의 `loc`와 실제 `lastmod`를 유지하고 검색엔진이 무시하는 `changefreq`·`priority` 출력은 제거했다.

## Validation

- `npm run type-check`: PASS.
- `npm run lint`: PASS.
- `npm run content:validate`: PASS, 650 plans / 76 existing titles / 50 approved editorial / minimum score 88.
- `node scripts/validate-editorial-drafts.mjs`: PASS, 27 October drafts / maximum similarity 0.219.
- `npm run build`: PASS, 635 static pages rendered.
- `npm run verify:growth`: PASS, 25 focused assertions.
- `node scripts/verify-search-scope.mjs`: PASS, 18 assertions across public/dist sitemap and index boundaries.
- `npm audit` and `npm audit --omit=dev`: PASS, 0 vulnerabilities.
- Playwright local and public desktop/mobile: one H1, apex canonical, no overflow, mobile in-wheel result, hidden duplicate mobile FAB, visible desktop FAB 확인.
- 브라우저 콘솔의 유일한 오류는 로컬 AdSense 요청 403으로, 앱 런타임 오류는 확인되지 않았다.

## Evidence Boundaries

- GSC baseline: configured service-account file missing, `evidence_missing`.
- GA4 organic-to-conversion baseline: repository evidence상 `not_configured`; 새 이벤트 배포 후 주요 이벤트 지정 필요.
- Naver Search Advisor: `evidence_missing`; 계정/수집 요청 미실행.
- AI referral: `not_identifiable`.
- 라이브 apex canonical과 임의 미존재 경로의 실제 HTTP 404 응답을 검증했다.

## Remaining Risks

- 미지 URL은 현재 실서비스에서 HTTP 404를 반환한다. 이 확인은 전체 API 보안 범위를 대체하지 않는다.
- 공개 API 인증·rate limit·quota 및 API 테스트 공백은 이전 감사의 별도 HIGH 범위다. 의존성 감사는 현재 full/prod 모두 0건이다.
- 금융·건강·노무 도구의 공식 출처, 기준일, 실제 책임 검토자 정보는 추가 보강이 필요하다.
- `postMetadata` 빌드 청크는 약 356 kB이며 추가 번들·이미지 최적화 여지가 남아 있다.

## Remeasurement

- 변경 배포일: 2026-08-30 KST.
- 기본 재측정일: 2026-09-13 또는 실제 데이터가 14일 누적된 직후.
- 비교: 동일 14일 기간의 GSC 노출·클릭·CTR·평균순위, GA4 organic landing→`tool_result_viewed`, `tool_used`, `tool_engaged`, `content_to_tool_clicked`, `share_clicked`.
- Naver와 AI 검색은 동일 질문·동일 로케일 반복 관찰이 가능할 때만 비교한다.

## Next Actions

1. 2026-09-13에 GSC 노출·클릭·CTR·평균순위와 GA4 organic→도구 결과 전환을 동일 14일 기준으로 재측정한다.
2. 계정 변경 권한이 별도로 주어질 때만 GA4 주요 이벤트 지정이나 GSC/Naver 작업을 수행한다.
3. 별도 보안 작업으로 공개 API 인증·rate limit·quota·테스트 경계를 해결한다.

## 2026-08-28 Editorial Schedule Phase

- SpinKorea 편집 페르소나와 검수 샘플 2개를 `personas/spinkorea`에 추가했다.
- 반복 템플릿 확대 대신 2026-09-08~09-30에 하루 1편, 총 23편의 도구 과업형 글을 예약했다. 마지막 예약은 2026-09-30 13:00 KST다.
- 최초 공통 본문은 리뷰에서 유사도 0.959~0.969로 차단했다. 이후 23개를 실제 도구 동작과 독립 검색 의도에 맞춰 모두 다시 작성했으며, 태그 제외 3,752~6,181자·H2 6개 이상·내부 링크 3개·안전 HTML·본문 Jaccard 최대 0.235 게이트를 통과해 `editorialReview: approved`/index 대상으로 승격했다.
- 기존 600개 계획과 매니페스트의 레거시 86개 slug를 보존하는 멱등 append 스크립트를 추가했다.
- 예약 시각은 08:00 KST로 정해 09:00 KST 일일 빌드에 포함된다.
- 23개 본문은 4개 lazy chunk로 분리했다. 단일 89.69kB gzip 청크 대신 상세 페이지가 19.93~26.38kB gzip 청크 하나만 불러온다.
- 검증: `content:validate` PASS(623 plans, approved 23, similarity max 0.235, last 2026-09-30), typecheck/build PASS, growth 24/24 PASS, search scope 9/9 PASS. 미래 시점 빌드도 699개 본문 렌더링 PASS 후 현재 시점 산출물로 복원했다.

## 2026-08-28 October Editorial Extension

- Added 27 independently researched articles scheduled every day at 08:00 KST from 2026-10-01 through 2026-10-27. Together with the September set, the site now has 50 continuous daily editorial slots from 2026-09-08 through 2026-10-27.
- Each October article has an article-specific research question, reader outcome, original contribution, 3-5 attributed sources, 3 internal links, 3-5 external source links, at least 6 H2 sections, and at least 3,500 Korean plain-text characters.
- Added an idempotent October schedule integrator and a standalone draft validator. The validator can run before or after integration without treating the integrated October set as pre-existing duplicates.
- Non-template gates passed: unique H2 sequences, no repeated long paragraphs, maximum October-plus-September draft Jaccard 0.219; integrated editorial maximum 0.235.
- October bodies are split into six route-lazy chunks at 14.98-22.42 kB gzip.
- Validation passed: content plan 650/50 approved, typecheck, production build, growth 24/24, search scope 13/13, and `git diff --check`.
- Future build at 2026-10-28 rendered 726 pages and verified the final 2026-10-27 article in HTML, sitemap, RSS, and llms.txt without noindex. A normal build then restored current-time assets (627 rendered pages).
- No Git commit, GitHub push, Vercel operation, or external publishing/account mutation was performed in this phase.

## 2026-08-28 Dependency Security Remediation

- Reproduced the GitHub dependency warning locally as 8 affected package paths (6 high, 2 low) in the current npm audit database.
- Updated only `package-lock.json` within existing declared semver ranges. Patched nanoid, postcss, react-router, Vite, esbuild, ws, and Babel dependency paths without a major-version application migration.
- A clean `npm ci`, full `npm audit`, and production-only audit all report 0 vulnerabilities.
- Regression checks pass: typecheck, production build (3,317 modules, 627 pages), content plan 650/50, editorial QA, growth 24/24, and search scope 13/13.
- Vercel and other hosting settings were not changed.

## 2026-08-28 Growth Phase 2

- 로또, 주사위, 동전, 랜덤 팀, 비밀번호, Yes/No, JSON, QR의 실제 결과 완료 지점에 `tool_result_viewed`를 추가했다.
- 이벤트 계약은 `tool_path`와 `result_type`만 전송하며 입력 내용과 실제 결과값은 전송하지 않는다.
- 블로그 런타임 메타데이터를 빌드용 원본과 분리했다. JSON은 678,108 B에서 385,788 B로, 빌드 JS 청크는 538.53 kB에서 328.41 kB로 감소했다.
- 시급, BMI, 부가가치세 도구에 공식 출처, 최종 검토일, 참고용 한계를 표시하고 정적 HTML 안내에도 동일 근거를 추가했다.
- 시급 계산기의 기본값과 최저임금 경고를 2026년 적용 10,320원으로 갱신했다.
- 최종 리뷰 후 BMI 출처를 국내 분류와 일치하는 질병관리청 자료로 교체하고, 시급 결과에서 주휴 제외 단순 환산과 209시간 기준 월 환산을 분리했다.
- 검증: typecheck, production build 625 pages, growth 24/24, search scope 9/9, content validation, random-team 완료 흐름, 390x844 모바일 출처 UI 통과.
- 외부 계정 변경, Git push, 배포는 수행하지 않았다.

## 2026-08-28 SEO Audit (claude-seo skill) + Remediation

- 오픈소스 스킬 `AgricIDaniel/claude-seo` v2.2.5(로컬 전용, 외부 AI/데이터 API 미사용)를 `~/.claude/`에 수동 설치하고 라이브 `https://spinkorea.kr` 대표 6개 URL에 타깃 감사(technical/schema/GEO/content) 실행. 산출물은 `docs/seo-audit/`.
- 핵심 결함 3: (1) soft-404 — 미지 경로가 200 홈 셸(noindex 없음), (2) 블로그 글 정적 메타 부정확(`og:type=website` 고정, `og:image`가 항상 기본 이미지, `article:*` 없음), (3) 신선도·E-E-A-T 약함(도구 갱신일 없음, 저자 조직명뿐, 큐레이트 76편 중 35편 얕음).
- 적용(T1+T2): 블로그 `og:type=article`+`article:*`+썸네일 `og:image`, `BlogPosting` 그래프 보강(`@id`/`mainEntityOfPage`/ImageObject), 도구 `WebApplication.dateModified` + 노출 갱신일, 파비콘 885 kB→1.9 kB, `preconnect`, Speculation Rules `prefetch`, `<img>` 치수, aria-label(blog 카드·lotto 버튼).
- soft-404: `vercel.json` catch-all 제거 → `generate-assets.mjs`가 `dist/404.html`(noindex) 생성, Vercel 파일시스템 해석이 프리렌더 라우트 200 유지, 미지 경로 HTTP 404. SPA 전용 라우트만 명시 rewrite. www→apex 308 redirect 추가.
- 부수: `/s/:id → /api/s/:id` rewrite(단축 링크가 catch-all에 먹혀 리다이렉트 안 되던 것 복구), `audit-adsense-readiness.mjs` 낡은 단언(`curated` only → `curated||editorial`) 수정.
- 검증: typecheck, production build 627 pages(+`dist/404.html`), growth 24/24, search scope 13/13, adsense-readiness PASS, content:validate PASS(650/50, similarity 0.235). 로컬 정적 서버: 알려진 라우트 200 / 미지 404.
- 보류(후속): 썸네일 126장 자가호스팅(`update-thumbnails.mjs` 정합 필요), YMYL 검토자·출처, 저자 Person 스키마, 얕은 글 확장, 강제 CSP, PSI API 키, GSC·네이버 연결, GA4 주요 이벤트, AdSense 403 조사.
- 배포 후 검증 필요: 미지 경로 실제 404 + `404.html` 표시, www 308(대시보드 리다이렉트가 선행하면 대시보드 변경), `/s/` 단축 링크 301. Git push·배포·외부 계정 변경 없음.
