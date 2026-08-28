# Project State

## Purpose

SpinKorea/SpinFlow의 검색 유입과 검색 방문자의 실제 도구 사용 전환을 개선한다.

## Current Work

- 2026-08-28: 기술 SEO, GEO/AEO 기반 엔티티, 내부 링크, CTA, GA4 전환 측정을 로컬 구현했다.
- 현재 브랜치: `main`; 기준 원격 커밋: `bac20fa`; 아직 커밋·푸시·배포하지 않았다.
- 외부 Google, Naver, Vercel, AdSense 또는 데이터베이스 상태는 변경하지 않았다.

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

## Validation

- `npm run type-check`: PASS.
- `npm run content:validate`: PASS, 600 plans / 76 existing titles / minimum score 88.
- `npm run build`: PASS, 625 static pages rendered.
- `npm run verify:growth`: PASS, 14 focused assertions.
- `node scripts/verify-search-scope.mjs`: PASS, 9 assertions.
- Playwright desktop/mobile: 홈 CTA, 룰렛 실행·결과, 도구 허브와 빠른 링크 노출 확인.
- 브라우저 콘솔의 유일한 오류는 로컬 AdSense 요청 403으로, 앱 런타임 오류는 확인되지 않았다.

## Evidence Boundaries

- GSC baseline: configured service-account file missing, `evidence_missing`.
- GA4 organic-to-conversion baseline: repository evidence상 `not_configured`; 새 이벤트 배포 후 주요 이벤트 지정 필요.
- Naver Search Advisor: `evidence_missing`; 계정/수집 요청 미실행.
- AI referral: `not_identifiable`.
- 라이브 canonical host와 실제 HTTP 404 응답은 검증하지 않았다.

## Remaining Risks

- Vercel catch-all 때문에 미지 URL은 HTTP 200 soft-404일 수 있다. 화면은 noindex 처리했지만 서버 404가 더 좋다.
- API 보안·취약 의존성·테스트 공백은 이전 감사에서 확인된 별도 HIGH 항목이며 이번 검색/전환 범위에서 수정하지 않았다.
- 금융·건강·노무 도구의 공식 출처, 기준일, 실제 책임 검토자 정보는 추가 보강이 필요하다.
- `postMetadata` 번들 538 kB 경고와 이미지 최적화 여지가 남아 있다.

## Remeasurement

- 변경 예정일: GitHub push 시점(아직 미실행).
- 기본 재측정일: 2026-09-11 또는 실제 배포 14일 후.
- 비교: 동일 14일 기간의 GSC 노출·클릭·CTR·평균순위, GA4 organic landing→`tool_result_viewed`, `tool_used`, `tool_engaged`, `content_to_tool_clicked`, `share_clicked`.
- Naver와 AI 검색은 동일 질문·동일 로케일 반복 관찰이 가능할 때만 비교한다.

## Next Actions

1. 변경 검토 후 허용 시 명시적 파일만 커밋하고 GitHub에 push.
2. GA4에서 `tool_result_viewed`를 주요 이벤트로 지정하고, `tool_used`와 `tool_engaged`는 보조 참여 지표로 사용하며 내부/테스트 트래픽을 제외.
3. GSC/Naver 기준선을 확보한 뒤 2026-09-11에 동기간 재측정.
4. 별도 보안 작업으로 공개 API와 취약 의존성 문제 해결.

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
