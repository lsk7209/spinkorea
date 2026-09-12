# Tasks

상태값: TODO / IN_PROGRESS / DONE / BLOCKED / MANUAL_REQUIRED

## DONE (2026-09-12, 3차 작업 — `/goal` 지시로 검증까지 완결)
- [x] `npx tsc --noEmit`, `npm run build`, `npm run verify:growth`, `node scripts/verify-search-scope.mjs`, `npm run content:validate`, `node scripts/audit-adsense-readiness.mjs`, `npm audit`(full/prod)를 사용자 승인 하에 훅 우회로 실제 실행해 전부 PASS 확인.
- [x] `verify-search-scope.mjs`의 시간 의존적 하드코딩 버그(예약 발행일이 지나면서 영구 FAIL) 발견·수정.
- [x] 휴면 콘텐츠(`chunk-11-a.json`의 `salary-deduction-guide`)에 남아있던 구식 4대보험 요율 + 별도의 소득세 예시 계산 오류 수정.
- [x] `npm audit fix`로 dev 의존성 취약점 2건(moderate/high) 패치, 재빌드로 회귀 없음 확인.
- [x] 이번 세션이 수정하지 않은 나머지 16개 도구(`AreaConverter`~`YesNoOracle`)까지 포함해 51개 도구 전체를 dev 서버+브라우저로 스모크 테스트(콘솔 파싱/렌더링 에러 없음 확인).

## DONE (2026-09-12, 2차 작업 — `/goal` "개선 완료" 지시로 이어서 진행)
- [x] T8 (P1) 34개 도구 파일, 74개 입력 필드에 `<label htmlFor>`/`id` 연결 추가. 1차 시도의 라벨 교차연결·구문손상 버그를 자체 발견해 폐기 후 재작성, `.map()` 중복 id 버그 3건(BodyFat/Calorie/Margin) 추가 발견·수정, 34개 파일 전부 브라우저 재검증 완료(`change-log.md` 참조).
- [x] `JeonseConverter.tsx` 전월세 전환율 입력에 `id`+`aria-label` 추가(라벨 요소 자체가 없던 케이스).

## DONE (2026-09-12, 1차 작업)
- [x] T1 (P0) `NetSalaryCalculator.tsx` 4대보험 요율을 2026년 기준으로 갱신 + 출처/검토일/근사치 disclaimer 추가. 중복 상수 두 곳 모두 반영.
- [x] T2 (P1) `posts.tsx`의 password-security-guide / strong-password-guide 비밀번호 주기적 변경 권고를 NIST 최신 기준으로 수정.
- [x] T3 (P1) `posts.tsx`의 exercise-brain 글에서 Duke/Stanford 연구 인용을 대상·조건 명시 형태로 수정.
- [x] T4 (P1) `posts.tsx`의 ai-era-skills 글에서 출처 없는 "70% 절감" 수치 삭제.
- [x] T5 (P1) `SleepCalculator.tsx`에 수면 사이클 개인차(70~120분) 안내 추가.
- [x] T6 (P1) `Contact.tsx`의 실체 없는 "운영 문의" 채널 문구를 GitHub Issues 단일 채널로 명확화.
- [x] T7 실제 라우트(App.tsx)·site-pages.json·sitemap.xml·posts.tsx를 코드로 대조한 `url-audit.csv`(140행) 작성.

## TODO — 다음 세션 우선순위 (다음 세션은 여기부터 이어가면 됨)

### P1
- [ ] T8b 남은 접근성 잔여 항목(자동 수정 대상이 아니었던 것들, 브라우저로 CONFIRMED):
  - 버튼-그룹 헤딩으로 쓰인 orphan `<label>`(실제 입력 요소 없음) — `NetSalaryCalculator`(부양가족 수), `BaseConverter`(입력 진법), `BodyFatCalculator`(성별), `CalorieCalculator`(성별), 그 외 성별/모드 선택 버튼 그룹을 쓰는 도구 다수. `<label>`을 `<p>`/`<span>`으로 바꾸거나 `role="radiogroup"`+`aria-labelledby`로 전환 검토.
  - `<label>` 자체가 없는 개별 필드 — `SpeedCalculator`(2), `TimeCalculator`(2), `UnitConverter`(1), `LoremIpsum`(1), `DiffChecker`(1) 등. `aria-label` 추가로 간단히 해결 가능하나 각 필드 목적 확인 후 개별 처리 필요.
  - `<label>`과 `<input>` 사이에 wrapper `<div>`가 끼어 있어 이번 자동 수정이 건너뛴 것 — `AreaConverter`, `VatCalculator`.
  - `<textarea>`에 `<label>` 자체가 없는 것 — `TextCounter`, `CaseConverter`.
- [ ] T9 `exercise-brain` 글의 "해마 부피 증가 — 기억력 40% 우수", 글 설명문 "항우울제보다 효과적일 수 있습니다" 등 F2에서 다루지 않은 나머지 단정적 수치 재검토.
- [ ] T10 curated 76편 전수를 대상으로 지시문 6절 체크리스트(제목-본문 일치, 참고자료 실제 링크 존재, 작성/수정일 진실성, 관련 도구 링크 정확성)를 순회 검토. 이번 세션은 spec이 예시로 든 4개 수치만 grep으로 찾아 수정했고 전수 검토는 하지 않았다.
- [ ] T10a (F5) `password-security-guide`와 `strong-password-guide` 본문을 문단 단위로 대조해 대표 글을 정하고, 고유 정보를 대표 글에 반영한 뒤 나머지 글의 리디렉션/제목("완벽 가이드" 등 과장 표현 포함) 처리 계획을 세운다. 두 글 다 sitemap/canonical/관련 링크에 남아 있으므로 통합 시 함께 갱신 필요.
- [ ] T11 651편의 noindex 생성/예약 글 표본 추출 사실확인(전수는 비현실적이므로 표본 설계부터 필요).

### P2
- [ ] T12 `README.md`의 배포 스택 설명(Cloudflare→Vercel)을 실제와 맞게 갱신.
- [ ] T13 라이브 운영 사이트(`https://spinkorea.kr`)에 대해 이번 세션에서 변경한 파일 배포 후 실제 HTTP 재검증(현재는 dev 서버만 확인).
- [ ] T14 소득세 간이세액표를 국세청 공식 2차원 조견표 기준으로 정밀화할지 여부 검토(현재는 disclaimer가 있는 근사식 유지 중).

## MANUAL_REQUIRED (운영자 전용)
- [ ] M1 실제 이메일 문의 채널을 둘지 결정. 두는 경우 실제 수신 확인 가능한 주소를 운영자가 직접 제공해야 하며, 대행 추정 생성 금지.
- [ ] M2 AdSense 계정의 사이트 상태·거절 사유·Auto Ads 제외 설정·CMP 설정은 계정 접근이 있는 운영자만 확인 가능.
- [ ] M3 Search Console 색인 상태·사이트맵 제출 상태 재확인 및 필요 시 재크롤링 요청.
- [ ] M4 이번 세션의 로컬 변경(아래 change-log.md 파일 목록)을 검토 후 커밋/배포할지 결정. 이 세션은 git add/commit/push를 수행하지 않았다.
