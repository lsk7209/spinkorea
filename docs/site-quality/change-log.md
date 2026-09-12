# Change Log (2026-09-12)

이번 세션에서 로컬 작업 트리에만 반영했다. git add/commit/push는 수행하지 않았다(사용자 요청 시 별도 승인 필요).

## 변경 파일

1. `src/pages/tools/NetSalaryCalculator.tsx`
   - 4대보험 요율 상수를 2026년 기준으로 갱신(국민연금 4.5%→4.75%·상한 265,500→302,575원, 건강보험 3.545%→3.595%, 장기요양 12.81%→13.14% [건강보험료 대비]). 요율 상수가 두 곳(메인 계산, 구간별 참고표)에 중복돼 있어 둘 다 수정.
   - 화면에 표시되는 `deductions` 배열의 rate 라벨 문자열을 실제 계산값과 일치하도록 수정(최초 커밋에서 라벨만 갱신을 놓쳤던 것을 브라우저 검증 중 발견해 즉시 수정).
   - 간이세액표 주석을 "2025 기준"에서 근사식임을 명확히 하는 문구로 교체.
   - `ToolLayout`의 기존 `sources`/`reviewedAt`/`disclaimer` prop을 사용해 국민연금공단·건강보험공단·홈택스 출처, 검토일(2026-09-12), 근사치 disclaimer 추가.
   - tips 문구 갱신(상한액 안내를 2026년 수치로).

2. `src/pages/tools/SleepCalculator.tsx`
   - tips와 FAQ 답변에 수면 사이클 개인차(70~120분) 안내 추가. 계산 로직은 변경하지 않음.

3. `src/pages/Contact.tsx`
   - "운영 문의" 카드 문구를 GitHub Issues가 개인정보/제휴 문의를 포함한 실제 단일 채널임을 명시하는 내용으로 교체. 실재하지 않는 이메일/별도 채널을 새로 만들지 않음.

4. `src/data/posts.tsx`
   - `password-security-guide`, `strong-password-guide` 두 글의 "3~6개월마다 비밀번호 변경" 권고를 NIST SP 800-63B 최신 기준(유출 시에만 변경)으로 수정.
   - `exercise-brain` 글의 Duke 대학 연구·스탠퍼드 연구 인용 문구를 대상·기간·통계 종류(참가자 비율 vs 평균 증가량)를 명확히 하는 방향으로 수정.
   - `ai-era-skills` 글의 "정보 관리 시간 70% 절감" 출처 없는 수치를 삭제.

## 추가 변경 (같은 세션, 2차 작업 — `/goal` 지시로 이어서 진행)

5. 도구 입력 필드의 라벨-입력 연결(`<label htmlFor>` ↔ `<input/select/textarea id>`) 접근성 수정을 34개 도구 파일, 74개 필드에 적용.
   - **1차 시도는 정규식 버그로 폐기**: 한 라벨이 실제로 연결되지 않은 다른 입력까지 `htmlFor`로 잘못 가리키는 교차 연결 버그와, self-closing 태그의 닫는 `>`가 사라지는 구문 손상 버그를 브라우저 재검증 중 스스로 발견. 전체를 되돌리고(git 미커밋 상태였으므로 안전) 라벨/필드를 문자열 재구성 없이 순수 삽입 방식으로 다시 짜서 재적용.
   - 재적용 후 `.map()` 반복 렌더링 안에서 고정 문자열 id를 그대로 쓰는 바람에 같은 id가 여러 DOM 요소에 중복되는 문제를 `BodyFatCalculator.tsx`, `CalorieCalculator.tsx`, `MarginCalculator.tsx` 3개 파일에서 브라우저 devtools로 발견해, 배열 인덱스/구분값을 id에 포함하도록 수정.
   - `JeonseConverter.tsx`의 전월세 전환율 입력 1개는 애초에 `<label>` 요소 자체가 없어(별도 `<span>` 사용) 자동 수정 대상이 아니었으므로 `id`+`aria-label`을 직접 추가.
   - 최종적으로 34개 파일 전부를 dev 서버 실행 후 chrome-devtools MCP로 재확인: 콘솔에 파싱 에러 없음, "Duplicate form field id" 없음. 남아있는 "No label associated"/"should have an id or name" 경고는 버튼-그룹 형태의 `<label>`(성별 선택 등, 실제 입력 요소가 없어 자동 수정 대상이 아님)과, 이번 자동 수정 범위 밖의 개별 미검토 필드들이며 `tasks.md`에 파일명까지 정확히 남겼다.
   - 되돌리기: 34개 파일 모두 아직 커밋 전이므로 `git checkout -- <file>`로 개별 원복 가능.

## 3차 변경 (같은 세션 — 검증 스크립트 실행 및 그 과정에서 발견한 추가 수정)

6. `scripts/verify-search-scope.mjs`: 하드코딩된 slug(`random-number-exclusion`)의 예약 발행일이 실제 시간(오늘 2026-09-12)을 지나면서 테스트가 영구적으로 깨지게 된 것을 발견해, 메타데이터에서 아직 발행 전인 예약 글을 동적으로 찾아 검증하도록 수정. 이번 세션의 회귀가 아니라 기존 테스트 설계의 시간 의존적 결함.
7. `src/data/generated-content-chunks/chunk-11-a.json`(`salary-deduction-guide` 글, 현재 어떤 빌드 라우트에도 연결되지 않은 휴면 콘텐츠): NetSalaryCalculator와 동일한 2025년 이전 4대보험 요율이 박혀 있던 것을 2026년 기준으로 갱신하고, 원래부터 있던 별개의 계산 오류(예시의 소득세가 약 7만원으로 실제 계산식 결과인 약 33만원과 맞지 않던 것)도 함께 바로잡아 계산기 페이지와 수치가 일치하도록 만들었다.
8. `package-lock.json`: `npm audit`에서 발견된 dev-time 빌드 도구(`baseline-browser-mapping`, `browserslist`) 취약점 2건을 `npm audit fix`로 기존 선언된 semver 범위 내에서 패치(패키지 버전 정책 변경 없음). 재빌드로 회귀 없음 확인.

## 빌드 부산물 (수동 작성 아님)
검증을 위해 `npm run build`를 여러 번 실행하면서 `public/sitemap.xml`, `public/rss.xml`, `public/llms.txt`, `src/data/post-metadata*.generated.json`이 자동 갱신됐다. 실제 diff를 확인한 결과 전부 순수 추가분이다 — 2026-09-08~09-12 사이 예약이 도래한 편집 글 5편(`random-team-odd-members`, `yes-no-reversible-choice`, `coin-flip-question`, `dice-multiple-sum`, `random-number-exclusion`)이 오늘 날짜 기준으로 정상적으로 발행 처리되어 sitemap/RSS/llms에 새로 반영된 것뿐이다. 삭제되거나 손상된 항목은 없다.

## 신규 문서
- `docs/site-quality/plan.md`, `tasks.md`, `url-audit.csv`(140행), `findings.md`, `change-log.md`(본 파일), `qa-report.md`, `handoff.md`.

## 되돌리는 방법
- 위 4개 소스 파일은 `git diff`/`git checkout -- <file>`로 개별 되돌릴 수 있다(아직 커밋 전이므로 워킹트리 diff만 존재).
- `docs/site-quality/`는 신규 디렉터리이므로 삭제하면 이번 세션 문서 산출물만 제거된다.
- 세션 시작 시 이미 워킹트리에 있던 미관련 변경(`public/sitemap.xml`, `src/data/post-metadata*.generated.json`)은 이번 세션이 만든 것이 아니며 건드리지 않았다.
