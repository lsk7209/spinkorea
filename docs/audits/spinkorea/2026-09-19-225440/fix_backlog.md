# Release checkpoint — 2026-09-20

SPK-014 source corrections and related adult BMI boundary fixes are now implemented and locally verified alongside the earlier repairs. Fresh build689 and browser62/62 PASS. Released in ce9d881; same-SHA Production6547101903 success, live browser30/30 and HTTP9/9 PASS. See release-20260920.md. Operational inbox/CMP/account/crawler questions remain unverified.

---

# 후속 상태 — 2026-09-20 08:33 KST

아래는 2026-09-19 최초 감사 시점의 제안 기록이다. 이후 로컬 수정 상태는 [local-repairs-20260920.md](local-repairs-20260920.md), 최신 SPK-014 원자료 대조와 수정안은 [spk014-source-review-20260920.md](spk014-source-review-20260920.md)를 따른다. SPK-014의25개 주장 감사는 완료됐으며 제품 반영은 아직 하지 않았다. 다음 작은 수정은 세 글/두 메타데이터 캐시와 연결 BMI 분류·FAQ·안내 문구다. 실제 계정/문의 수신/CMP/GSC 및 배포 증거는 별도로 미확인이다. 최초 기록의 미승인 표기는 당시 상태이며 이후 사용자 지시를 취소하지 않는다.

---

# 최소 변경 백로그 — 제안만, 구현하지 않음
승인 대상은 각 ID의 최소 파일/조건이다. 배포·설정·삭제·URL통합은 이번 권한에 없음. 상세 사실과 불확실성은 evidence.md 참조.

## 확인된 수정 후보
### SPK-001 P1 JSON 큰 정수 무고지 변형
- 원인/위치: JSON.parse가 Number로 변환한 뒤 JSON.stringify한다. src/pages/tools/JsonFormatter.tsx:24,43
- 영향 URL: /tools/json-formatter; 근거 E-LOCAL T03/T04-recheck (Confirmed)
- 최소안: 새 의존성 없이 우선 지원 한계를 표시하고 안전하지 않은 숫자 토큰을 변환 전에 식별하여 중단하는 최소안 설계. 문자열/지수/소수 오탐 방지 필요. 단순 숫자 정규식 전체 적용 금지.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 경계 정수의 무고지 변형 0건; 문법 오류는 원문을 유지하고 이전 출력의 무효 상태 표시.
- 회귀: MAX_SAFE_INTEGER 전후, 음수, 문자열 안 숫자, 지수, 정상/잘못된 쉼표, 복사.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-002 P1 퍼센트 0분모에서 이전 결과 잔류 및 무한대 표시
- 원인/위치: 증감률 a===0 분기에 setRes3(null)이 없고 일부 비율 계산에는 0분모 검사가 없다. src/pages/tools/PercentageCalculator.tsx:29,36
- 영향 URL: /tools/percentage-calculator; 근거 E-LOCAL T15/T16-corrected (Confirmed)
- 최소안: 두 분모 경로에서 유한성/0을 검사하고 이전 결과를 비운다.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 0/빈값/음수의 지원 정책 명시; NaN/Infinity/이전 성공 결과 잔류 없음.
- 회귀: 100→110→0, 전체0/일부10, 양수 정상, 빈값, 음수 정책.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-003 P1 수면 글 산술 오류 두 건과 생리 효과 단정
- 원인/위치: 글의 산술/고정 주기 가정 오류. 계산기는 90분·입면15분 가정 및 개인차 안내가 이미 있다. src/data/posts.tsx:4825,4830,4842; src/pages/tools/SleepCalculator.tsx:5,68
- 영향 URL: /blog/sleep-optimization; 근거 E-HTTP /blog/sleep-optimization; O-NHLBI (Confirmed)
- 최소안: 두 식을 바로잡고 잘못된 기상시각 판정/효과 보장을 제거; 실제 계산기 가정과 연결.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 계산 일치, 모델 가정 표시, 개인 수면 처방/효과 보장 없음.
- 회귀: 독립 산술, 글↔수면 계산기/시간 계산기 링크 및 가정 비교.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-004 P1 비밀번호 글의 공격 조건 없는 해독 시간·MFA 안전 보장
- 원인/위치: 오래된 보안 글과 현재 도구 안내가 불일치. src/data/posts.tsx:4423,4520; src/pages/tools/PasswordGenerator.tsx:35,42,103
- 영향 URL: /blog/password-strength; 근거 E-HTTP /blog/password-strength; E-LOCAL T12-final; O-NIST (Confirmed)
- 최소안: 근거 없는 해독 시간 표를 제거/조건부 설명으로 교체하고 MFA를 위험 감소로 제한.
- 보존: Crypto API·로컬 생성·미지원시 오류를 보존. 선택 문자군은 pool이며 모든 문자군 반드시 포함 보장은 현재 명시되지 않음.
- 완료 기준: 무조건적 안전 보장 0건; 게시된 예시를 실제 비밀번호로 권하지 않음.
- 회귀: 본문/FAQ/생성기 안내 비교. 4/50자 및 마지막 문자군 유지 테스트 보존.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-005 P1 광고 개인정보 고지의 이전 방문 기반 설명·설정 링크 부족
- 원인/위치: 독립 정적 본문과 React 개인정보 문서 모두 공식 고지 항목을 완전히 담지 못한다. src/pages/PrivacyPolicy.tsx:53,65; scripts/generate-assets.mjs:423
- 영향 URL: /privacy/; 근거 E-HTTP /privacy/; E-DOM /privacy/; O-PRIVACY (Confirmed)
- 최소안: 현재 광고 설정/업체 범위를 확인하고 공식 필수 고지와 실제 설정 링크를 양쪽 본문에 일치시킨다.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 공식 항목 대조 완료, 링크 작동, 입력 처리와 방문 통계 처리를 분리.
- 회귀: JS 전/후 개인정보 표시, 링크, 실제 설정별 CMP/지역 표본은 별도 검증.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-006 P2 복사 거부에도 성공 알림
- 원인/위치: writeText 완료를 기다리지 않고 즉시 toast.success. src/pages/tools/TextCounter.tsx:24; src/pages/tools/JsonFormatter.tsx:56; src/pages/tools/PasswordGenerator.tsx:66; src/pages/tools/RandomTeam.tsx:49
- 영향 URL: /tools/text-counter; 근거 E-LOCAL T02/T17 (Confirmed)
- 최소안: 각 기존 handler에 await/try-catch 적용; 실제 성공만 성공 처리.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 거부/미지원/실패 성공 알림 0건; 원문 유지.
- 회귀: 허용/거부/미지원, 반복 복사, 키보드·모바일; 현재 성공 경로 테스트는 mock임.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-007 P1 0% 대출 입력에서 이유 없이 결과 사라짐
- 원인/위치: r<=0을 빈 입력과 함께 null 처리. src/pages/tools/LoanCalculator.tsx:15,19
- 영향 URL: /tools/loan-calculator; 근거 E-LOCAL T05/T06/T07 (Confirmed)
- 최소안: 0%를 P/n·총이자0으로 분리하거나 명시적인 지원 범위 안내.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 0% 결과/명시적 거부 중 선택한 계약 충족; 빈 값과 0 구분; 소수 개월의 조용한 truncation 방지 검토.
- 회귀: 0%, 12%, 빈값, 0/음수/소수 기간, 두 상환 방식.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-008 P2 글자수의 UTF-16 정의·플랫폼 대응 범위 미표시
- 원인/위치: text.length와 whitespace 제거 길이를 일반 글자수로 라벨링. src/pages/tools/TextCounter.tsx:10,11,39,49
- 영향 URL: /tools/text-counter; 근거 E-LOCAL T01; E-DOM /tools/text-counter (Confirmed)
- 최소안: 기존 UTF-16 동작을 보존하면서 라벨/설명/예시를 명확히; 코드포인트 추가는 별도 선택.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: A 한😀, 결합 악센트, ZWJ 이모지, 줄바꿈 정의와 결과 일치.
- 회귀: 빈값0; UTF8 9; code unit/codepoint/grapheme 구분; 제출처별 기준 미검증 표기.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-009 P1 정적 셸과 React 안내·관련 링크 불일치
- 원인/위치: 독립 생성기 renderShell의 sitePages.filter(...).slice(0,6)와 별도 trustPageBodies/approvalBodies. 전역 React 배열 버그가 아님. scripts/generate-assets.mjs:177,415,770; src/pages/tools/TextCounter.tsx:62; src/components/ToolLayout.tsx:297
- 영향 URL: /tools/text-counter; /contact; /privacy/; /tools; 근거 E-HTTP; E-DOM; E-SOURCE (Confirmed)
- 최소안: 생성기의 해당 안내/관련 링크를 실제 페이지 계약과 맞추고 심사자 목적 문장만 제거.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 3대상 문의/개인정보/정의·관련 링크 일치; tools 심사자 문장 없음.
- 회귀: 초기 HTML와 JS DOM 비교, canonical/robots/FAQ 정합, 자기/중복/미존재 링크.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-010 P1 랜덤 기록 글 템플릿 조사 오류·실행 양식 부족
- 원인/위치: body 없는 생성 항목이 공통 템플릿으로 렌더링; generated source의 검색 제외는 의도적. src/data/content-plan.generated.json:1247; src/data/generatedContent.tsx:305,314; src/data/postMetadata.ts:21; src/pages/BlogPost.tsx:293
- 영향 URL: /blog/random-choice-log; 근거 E-HTTP /blog/random-choice-log; E-DOM browser-final.json (Confirmed)
- 최소안: 해당 글을 기존 기능만 사용하는 기록 양식+가상예시로 재작성하는 설계. 공통 템플릿 조사의 영향은 별도 표본 조사.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 한 번의 가상 추첨 기록을 완성할 수 있음; 자동 기록기/가중치 등 없는 기능을 있는 것처럼 설명하지 않음.
- 회귀: 변수 조사 조합, 기존 라우트/noindex 보존, 명시적 목록 승인은 별도.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-011 P2 Yes/No 글 간 고위험 결정 권장 충돌
- 원인/위치: 글별 편집 기준 차이. src/data/posts.tsx:3095,3130; src/data/content-plan.generated.json:27750
- 영향 URL: /blog/yes-no-oracle-guide; /blog/yes-no-reversible-choice; 근거 E-SOURCE; E-HTTP (Confirmed)
- 최소안: 기존 글의 사례를 저위험 선택으로 한정하고 인용 연구의 범위를 확인.
- 보존: yes-no-reversible-choice의 제외 기준과 기록 절차 보존. 유입 자료 없이 URL 통합하지 않음.
- 완료 기준: 의료/금융/계약/안전 판단을 랜덤에 위임하는 권장 없음.
- 회귀: 두 글·도구·약관 비교, 기존 정상 링크 보존.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-012 P2 비공개 문의가 필요한 사용자도 공개 Issues로 유도
- 원인/위치: 별도 비공개 연락 경로 없이 공개 이슈만 제공. src/pages/Contact.tsx:76,81,90
- 영향 URL: /contact; 근거 E-DOM /contact; contact-link.json (Confirmed)
- 최소안: 비공개 수신 채널 존재를 운영자가 확인한 뒤 연결; 그 전에는 개인정보/비밀번호 게시 금지 명시. 이메일을 만들어 쓰지 않음.
- 보존: 정상 입력 결과와 기존 URL을 보존한다.
- 완료 기준: 공개 문제 제보 링크는 유지; 민감정보 공개 유도 제거; 승인된 환경에서만 수신 확인.
- 회귀: 링크 정상, 비공개 안내, 로그인 필요 여부/수신 검증은 별도.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

### SPK-013 P2 CSS 기본 글 검색 의도 겹침
- 원인/위치: 편집 범위가 인접. 정량 중복률/유입 잠식은 미측정. src/data/posts.tsx:2416,5202; src/data/content-plan.generated.json:28038
- 영향 URL: /blog/css-shadow-design; /blog/css-shadow-guide; /blog/css-shadow-states; 근거 E-SOURCE; E-HTTP (Strong)
- 최소안: MERGE REVIEW만 제안; 의도/예시 비교 후 GSC 유입·링크를 확보할 때 대표 URL 결정.
- 보존: css-shadow-states KEEP. 연령·글 길이를 삭제 근거로 쓰지 않음.
- 완료 기준: 고유 정보 손실 없음; 동등 목적지가 있을 때만 개별 승인으로 통합.
- 회귀: 고유 예시 보존, 내부 링크/1단계 redirect는 향후 승인된 변경에만 검사.
- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.
- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.

## 먼저 검증할 항목
- SPK-014: 건강/AI 수치·기준 원자료 대조, BMI/시급 대상·연도 확인. 오류라고 확정한 상태가 아님.
- 실제 Google 접근: 제공된 crawler diagnostics 또는 검증된 서버로그. UA 모방으로 대체 불가.
- 광고/CMP: 지역별 실제 광고형태·인증CMP·동의상태 및 오류/빈/404 광고표시 확인. 스크립트 존재만으로 P0 부여 금지.
- 데이터 흐름: GA/오류/공유 동작의 통제된 모의 수집 endpoint로 더미만 추적; 실제 비밀번호/입력 전송 금지. 현재 localhost 테스트에서는 third-party SDK 실행을 차단함.
- CSS 대표 URL: GSC/내부 링크·고유예시를 비교한 뒤 선택. 지금 redirect/noindex/delete 없음.

## 대표 콘텐츠 리빌드 설계 (4개)
|대상|사용자 의도/고유 가치|보존·제거·추가|도구 연결·완료 기준|
|---|---|---|---|
|sleep-optimization|입면 가정을 이해하고 참고 시간을 계산|수면환경 조언 보존; 잘못된 식/주기진단 제거;390분/31.5% 가정 예시·NHLBI범위 추가|현재 sleep/time calculator 가정과 대조, 처방 없음|
|password-strength|계정마다 다른 생성문자열을 안전하게 사용|재사용금지/관리자 안내 보존;고정해독시간·MFA보장 제거;공격환경·NIST적용범위 추가|random-password와 설명일치; 공개예시 재사용권장0|
|random-choice-log|추첨 절차를 나중에 검토할 기록 작성|주제/기존URL 유지;변수치환 반복 제거;가상 양식 실행시각·후보버전·제외·재추첨·결과·변경이력|홈/팀도구에 실제 있는 기능만; 복사 가능한 수기 기록1건 완성|
|yes-no-oracle-guide|가벼운 결정을 시작할 기준 선택|저위험선택 설명보존;이직/계약 위임 권장 제거;되돌림·실패비용 예시 추가|yes-no-reversible-choice 제외기준 연결; 연구근거 미검증은 단정안함|

## 첫 최소 작업 묶음 제안
1. JsonFormatter 큰 정수 무고지 변형, PercentageCalculator 0분모/결과 잔류, 대표 복사 handler 실패 안내를 각 회귀 테스트와 함께 수정.
2. 별도 콘텐츠 묶음으로 수면 산식과 비밀번호 보장만 최소 교정.
3. 광고 설정/고지의 사실확인이 끝나면 정적 셸·DOM 개인정보/문의 안내를 동기화.
현재 단계는 여기서 종료. 제품 구현/게시/커밋/푸시는 시작하지 않는다.