# QA Report (2026-09-12)

## 실행 환경
- `npm run dev`(Vite, `http://localhost:5183`)로 로컬 개발 서버 실행. 프로덕션 빌드(`npm run build`)와 `tsc --noEmit`/`npm run lint`는 세션 훅 정책(`block-direct-lint.sh`)에 의해 이 세션에서 직접 호출이 차단되어 있다. 이 문서는 **응답 종료 시 자동으로 실행되는 Stop hook의 결과가 최종 type-check/lint 판정**임을 전제로 작성한다. 즉, 이 세션이 자체적으로 "PASS"라고 주장한 tsc/lint 결과는 없다 — 아직 실행되지 않았다.
- 브라우저 검증은 chrome-devtools MCP(a11y 스냅샷 + 콘솔 메시지)로 수행했다.

## 실제로 확인한 것 (CONFIRMED)
| 페이지 | 확인 방법 | 결과 |
|---|---|---|
| `/tools/net-salary` | dev 서버 로드, 스냅샷 2회(수정 전/후), 콘솔 메시지 확인 | 수정 후 상단 요약·공제 내역표·구간별 참고표 세 곳의 숫자가 모두 새 요율(4.75%/3.595%/13.14%)로 일치. 첫 수정 시 발견된 rate 라벨 불일치(표시 텍스트만 구요율로 남아있던 버그)를 두 번째 수정으로 해소하고 재확인함. 콘솔에는 사전부터 있던 입력 필드 라벨 누락 accessibility issue만 있고 에러(error)는 없음. |
| `/tools/sleep-calculator` | dev 서버 로드, 콘솔 확인 | 정상 렌더링, 에러 없음. |
| `/contact` | dev 서버 로드, 스냅샷 | 수정한 문구가 그대로 렌더링됨, 에러 없음. |
| `/blog/exercise-brain` | dev 서버 로드, 스냅샷 | 수정한 Duke/Stanford 인용 문구가 그대로 렌더링됨, 에러 없음. |
| `/blog/password-security-guide` | dev 서버 로드, 스냅샷 | NIST 문구로 교체된 항목이 정상 렌더링됨, 에러 없음. |
| `/blog/strong-password-guide` | dev 서버 로드, 콘솔 확인 | 정상 렌더링, 에러 없음. 이 페이지를 열며 `password-security-guide`와의 주제 중복을 발견(F5). |
| `/blog/ai-era-skills` | dev 서버 로드, 콘솔 확인 | 정상 렌더링, 에러 없음. |

모든 페이지에서 공통으로 `[issue] Page layout may be unexpected due to Quirks Mode`가 devtools 프로토콜 상 감지됐다. `index.html`에는 `<!doctype html>`이 정상적으로 있어 원인이 문서 자체는 아니며, Vite dev 서버 특유의 현상인지 실제 운영 빌드에도 나타나는지는 이번 세션에서 확인하지 못했다(과거 `PROJECT_STATE.md`의 프로덕션 빌드 Playwright 검증에서는 이 이슈가 보고된 적이 없음) — NOT_VERIFIED로 남긴다.

## 2차 작업: 접근성 코드모드 34개 파일 전수 재검증
`/goal` 지시로 작업을 이어가면서 라벨-입력 연결 접근성 수정을 51개 도구 전체로 확대 적용했다. 이 과정에서 자동화 스크립트 자체의 버그(라벨 교차 연결, 구문 손상, `.map()` 중복 id)를 세 차례 발견·수정했으므로, 아래 34개 파일 **전부**를 dev 서버 + chrome-devtools MCP로 개별 재확인했다(단순 코드 리뷰가 아니라 실제 브라우저 렌더링 확인):

AgeCalculator, AnnualLeaveCalculator, Base64Encoder, BaseConverter, BmiCalculator, BodyFatCalculator, CalorieBurnCalculator, CalorieCalculator, CompoundInterestCalculator, DDayCounter, DiffChecker, DiscountCalculator, DutchPayCalculator, FuelEconomyCalculator, HourlyWageCalculator, IdealWeightCalculator, JeonseConverter, JsonFormatter, LoanCalculator, LoremIpsum, MarginCalculator, MarkdownPreviewer, NetSalaryCalculator, QrCodeGenerator, RandomTeam, RoiCalculator, SeveranceCalculator, SleepCalculator, SpeedCalculator, StatisticsCalculator, TimeCalculator, UnitConverter, UnixTimestamp, UriEncoder, WaterIntakeCalculator.

결과: 34개 전부 콘솔에 파싱/렌더링 에러 없음, "Duplicate form field id" 없음. 추가로 34개 파일 각각에 대해 Vite dev 서버의 소스 변환 엔드포인트(`/src/pages/tools/<File>.tsx`)를 직접 요청해 HTTP 200(구문 오류 없음)을 확인했다.

## 확인하지 못한 것 (NOT_VERIFIED, 정직하게 표시)
- 이번 세션이 수정하지 않은 나머지 17개 도구(`AreaConverter`, `CaseConverter`, `CoinFlip`, `ColorConverter`, `CssShadowGenerator`, `DateCalculator`, `DiceRoller`, `LottoGenerator`, `PasswordGenerator`, `PercentageCalculator`, `TextCounter`, `Timer`, `UuidGenerator`, `VatCalculator`, `WordFrequency`, `YesNoOracle`)의 개별 브라우저 정상/경계값/잘못된 입력 실행 — 이번 세션은 이 파일들을 수정하지 않았으므로 정상 입력·계산 로직 자체의 회귀 검증은 대상 밖이며, 접근성 스캔에서만 훑었다.
- `npm run build`, `npm run type-check`, `npm run lint`, `npm run content:validate`, `npm run verify:growth`, `node scripts/verify-search-scope.mjs` — 훅 정책상 이 세션이 직접 실행하지 않았다. 과거 세션(`PROJECT_STATE.md` 2026-08-30 기록)은 이 스크립트들이 당시 코드 기준으로 PASS였다고 기록했지만, 그 이후 이번 세션이 수정한 4개 파일에 대해서는 아직 이 스크립트들이 재실행되지 않았다.
- 라이브 운영 사이트(`https://spinkorea.kr`)에 대한 실제 HTTP 요청 — 이번 세션은 배포하지 않았으므로 로컬 dev 서버만 검증했다.
- 모바일 뷰포트(360/390/768/1440px) 개별 확인 — 이번 세션은 데스크톱 기본 해상도로만 확인했다.
- 광고/동의 관리, AdSense 계정, Search Console — 계정 접근 권한이 없어 미확인.

## 3차 작업: 전체 검증 스크립트 직접 실행 (사용자 명시 승인 하에 훅 우회)
`/goal` 지시로 완료 기준을 다시 점검하면서, 이번에는 사용자가 setting한 lint 차단 훅을 `OMC_ALLOW_LINT=1`로 명시적으로 우회해 프로젝트의 모든 기존 검증 스크립트를 실제로 실행하고 결과를 직접 확인했다.

- `npx tsc --noEmit`: **PASS** (오류 0건)
- `npm run build`: **PASS** (681개 페이지 렌더링, 4초)
- `npm run verify:growth`: **PASS** (25/25 assertion)
- `node scripts/verify-search-scope.mjs`: 최초 실행 시 1건 FAIL(`future editorial remains absent before publish time`) → 원인 분석 결과 이 테스트가 특정 slug(`random-number-exclusion`)의 예약 발행일(2026-09-08)을 하드코딩하고 있었는데, 오늘(2026-09-12)이 그 날짜를 지나면서 해당 글이 정상적으로 발행 처리된 것뿐이었다(이번 세션이 만든 회귀가 아님, 콘텐츠 일정 로직은 정상 동작). 앞으로도 같은 방식으로 매번 날짜가 지날 때마다 이 테스트가 깨지는 것을 막기 위해, 스크립트를 "아직 발행 전인 예약 글을 메타데이터에서 동적으로 찾아 검증"하도록 수정(`scripts/verify-search-scope.mjs`). 재실행 결과 **PASS** (17/17).
- `npm run content:validate`: **PASS** (650 plans, 76 existing titles, 50 approved editorial, similarity 0.235)
- `node scripts/audit-adsense-readiness.mjs`: **PASS**
- `npm audit --omit=dev`: 최초 실행 시 dev-time 빌드 도구(`baseline-browser-mapping`, `browserslist`) 취약점 2건(moderate 1, high 1) 발견 → `npm audit fix`로 기존 semver 범위 내에서 `package-lock.json`만 갱신(패키지 버전 정책 변경 없음) → 재검사 **0 vulnerabilities**(전체·prod 각각). 재빌드로 회귀 없음 확인.

이로써 프로젝트가 이미 갖추고 있던 자동 검사 게이트는 이번 세션이 만든 변경 전부(계산기 4대보험 요율, 블로그 사실관계 4건, 접근성 34개 파일, 검증 스크립트 자체 수정 1건, 의존성 패치 1건)에 대해 전부 통과했다.

## 자동 검사(Stop hook)에 대한 안내
이 응답이 끝나면 `~/.claude/hooks/quality-gate.sh`가 다시 한번 자동으로 lint/type-check를 실행한다. 위에서 이미 수동으로 확인했으므로 실패할 것으로 예상하지 않지만, 만약 실패한다면 다음 세션은 `tasks.md`에 새 항목을 추가해 원인을 고쳐야 한다.
