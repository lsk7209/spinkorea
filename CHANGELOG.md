# Changelog

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/). 이전 이력은 `docs/HANDOFF.md`, `PROJECT_STATE.md`, `docs/site-quality/change-log.md`에 있다.

## [Released 2026-09-30] — fix/calculator-edge-cases (PR #12 → b470a1b, Production 배포·SHA 검증 완료)

### Fixed
- 시간 계산기: 더하기/빼기 결과가 자정을 넘으면 "(전날)", "(다음날)", "(N일 후/전)"를 표시(기존엔 01:00−2시간이 "23:00"만 표시).
- 복리 계산기: 음수 월납입 시 연금항은 무시하고 총 납입금에서만 차감해 이자가 부풀던 문제. 매월 납입을 복리 주기와 무관하게 월 단위로 일관 적용하고, 음수·비유한·범위 밖 입력(이율 0–100%, 기간 0–100년)은 안내 후 결과 숨김. 원금만일 때 결과는 기존 공식과 동일. "연평균 수익률"(납입금 포함 시 왜곡) → "실효 연이율".
- 만 나이 계산기: 미래 생년월일에서 음수 나이 표시 → 안내 문구, 입력 `max`=오늘.
- 퇴직금 계산기: 퇴사일 ≤ 입사일 또는 빈 날짜에서 음수·NaN 근속기간 노출 → 안내 후 결과 숨김, 음수 임금 0 처리.
- D-Day·만 나이: `new Date("YYYY-MM-DD")`(UTC 파싱) 때문에 UTC 음수 시간대에서 기념일·별자리가 하루 밀리던 문제 → 로컬 날짜 파싱.
- Unix 타임스탬프: 초/밀리초를 자릿수 대신 절댓값 크기(≥1e12 → ms)로 판정해 음수·선행 0 오판 해결, 해석 단위 표시, 범위 밖 값 거부, 복사 실패 시 성공 토스트 미표시, 클릭 복사 영역을 `button`으로.

### Accessibility
- 퍼센트 계산기 6개, 속도 계산기 시/분, 타이머 시/분/초, 시간 계산기 시/분 입력에 접근 가능한 이름 부여. 토글 버튼 `aria-pressed`, 오류 `role="alert"`.

### Security
- `/api/shorten`: short ID가 `byte % 62`로 앞 8글자에 편향되던 문제를 rejection sampling으로 제거, PK 충돌 시 최대 3회 재시도(다른 DB 오류는 재시도하지 않음).

### Changed
- 의존성: 미사용 `nanoid`, 불필요한 `@types/diff`(diff 8은 자체 타입 포함) 제거. `@vitejs/plugin-react`를 devDependencies로 이동(5.1.1 고정).

### Added
- `src/utils/date-calc.ts`, `src/utils/compound-interest.ts`(순수 함수), `tests/calculators.test.mjs`(16), API 하니스 3건(충돌 재시도·비충돌 오류·ID 분포), `npm run verify:browser:calculators`(UTC-8 브라우저 7건).
- 검증: `verify:local` exit 0(test 123/123, api-harness 15/15, build 699 렌더), `verify:browser` 11/11, `verify:browser:calculators` 7/7, `verify-tool-reliability-browser` 32/32, `verify-audit-repairs` PASS, pageerrors 0.
- 검증기 갱신: `verify-tool-reliability-browser`·`verify-audit-repairs`가 5acd0f8 재작성 전의 `random-choice-log`(noindex 초안, `체험모임-v1`)를 기대하던 것을 현재 계약(approved·index·sitemap 포함)으로 수정.

## [Unreleased] — 텍스트·문서 도구 글 30편 재작성 (2026-09-30, 로컬 전용·미배포)

### Added
- `텍스트·문서 도구` 분류의 자동 생성(noindex) 글 30편을 editorial 품질로 재작성. 대상: self-intro-length, email-subject-rule, proposal-summary-check, meeting-note-format, notice-copy-cleanup, faq-answer-length, blog-intro-hook, plain-language-rule, copy-before-share, markdown-table-check, case-style-guide, headline-trim-rule, meta-description-draft, bullet-list-edit, tone-of-voice-note, quote-cleanup-rule, social-share-copy, landing-copy-order, checklist-wording, summary-box-copy, document-version-note, mobile-reading-break, question-heading-rule, before-after-copy, newsletter-preview, privacy-copy-check, terms-summary-copy, help-page-structure, content-refresh-note, reader-question-bank.
- 방식: 명세 `output/rewrite-text/SPEC.md`로 사이트 실제 도구 기능 범위를 고정(글자수 세기 UTF-16, 바이트 UTF-8, 단어 빈도, 대소문자 변환, 마크다운 미리보기, diff — 각 도구 소스 확인). 내부 링크 3개는 App 라우트 중 주제에 맞는 도구, 외부 출처는 접속 확인한 10개(MDN String.length/Blob/Intl.Segmenter/toLowerCase, CommonMark·GFM 명세, W3C WCAG Readable, 개인정보 보호위원회, 국가법령정보센터 전자상거래법)만 사용.
- 금지: 맞춤법·문법 자동 교정, AI 요약·생성, 저장·계정·서버 기록·CSV·알림 등 없는 기능 약속 금지.
- 반영: `src/data/revised-editorial-text-tools-2026-09.json`(revisedAt 2026-09-30) → `scripts/apply-editorial-revisions.mjs`로 계획·청크에 적용. slug·최초 발행일·예약 시각 유지, `editorialReview: approved`. 30편 index·sitemap 포함(누적 재작성 225편, approved 245→275).
- 검증: batch/전체 check 0 오류(최대 유사도 0.28), `content:validate` pass, `build` 698 렌더, 조사 오류 0, `verify-search-scope` PASS, `type-check` PASS. 사람 정독 표본은 자동 검사 + slug별 요구사항 대조로 갈음.

## [Unreleased] — fix/spk2-reliability-batch (2026-09-29, 로컬 전용·미배포)

### Fixed
- 룰렛: 후보 변경 시 이전 결과·하이라이트·결과 공유가 남던 문제, 페이지 이동 후 늦은 타이머가 결과 저장·이벤트를 실행할 수 있던 문제, 연속 클릭 중복 실행 가드(SPK2-01).
- 룰렛: 후보 1개일 때 휠이 그려지지 않던 SVG 경로.
- 복원: URL·저장소 복원이 편집기와 다른 제한(버전·개수·길이)을 쓰던 문제, 압축 입력·해제 크기 상한 추가, 거부된 공유 링크가 저장값으로 조용히 대체되던 문제(SPK2-02).
- 공유: 현재 주소 대신 현재 후보로 링크를 생성, "결과 확인" 오표시 제거, 완성 URL 길이로 경고, 클립보드 실패 시 성공 토스트 미표시, React Router `history.state` 덮어쓰기(SPK2-03).
- `/random-number`: 이전 저장값 대신 숫자 후보로 시작, 페이지 전용 H1·소개, 없는 범위·개수 기능 약속 제거(SPK2-04).
- `/spinflow/:slug`: 알려진 alias 외에는 NotFound(noindex), Vercel rewrite allowlist, alias 적용 후 `?s=` 보존(SPK2-05).
- 생성기: 기존 slug의 제목·설명 수정이 메타데이터·HTML·OG·schema에 반영되지 않던 병합 분기, 손상 캐시 fail-closed, 실제 수정 시에만 `dateModified`/`lastmod` 갱신(SPK2-06).
- 블로그 CTA: 더 구체적인 키워드의 도구를 우선 연결(SPK2-08).
- 모달: 입력 label, 오류 연결·표시, 저장 시 항상 검증, Escape, 포커스 트랩·복귀, 배경 inert, TemplateModal dialog 역할(SPK2-09).
- 768px에서 가로 넘침, reduced-motion에서 회전·confetti 축소(SPK2-10).
- 분석: 공통 envelope, 입력 원문 키 차단, 초기화 실패 내성, lazy 페이지 제목 대기(SPK2-11).

### Fixed (follow-up)
- 정적 HTML의 관련 도구 목록을 각 도구 페이지 선언과 동일하게 생성(SPK2-07/08).

### Security
- API: `/api/shorten`은 `https://spinkorea.kr` 공유 링크만 허용·CORS 고정·Host 헤더 미사용, `/s/:id`는 리디렉션 전 재검증(오픈 리디렉트 차단), `/api/stats`는 결과 원문을 저장하지 않음, 잘못된 본문은 400(SPK2-13).

### Changed
- 홈 CTA 문구를 실제 동작(스크롤)에 맞춰 "후보 확인하고 룰렛 열기"로 변경(SPK2-17).
- README를 현재 Vercel 기준으로 갱신(SPK2-18).
- 콘텐츠: `hex-rgb-hsl-rounding` 제목이 원본 제목으로 반영됨(`updatedAt 2026-09-29`).

### Added
- `npm test`, `npm run test:api-harness`, `npm run verify:browser`, `npm run verify:local`.
- API 위협 모델·데이터 흐름 명세(`docs/spk2/api-threat-model-20260929.md`) — (SPK2-13/14).
- QA 보고서 `docs/spk2/qa-report-20260929.md`.
