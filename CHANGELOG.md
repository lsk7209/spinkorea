# Changelog

형식: [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/). 이전 이력은 `docs/HANDOFF.md`, `PROJECT_STATE.md`, `docs/site-quality/change-log.md`에 있다.

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
