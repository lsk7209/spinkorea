# 2026-09-20 로컬 수정 및 남은 작업

이 문서는 원본 감사의 제안 상태를 덮어쓰지 않고, 이후 진행 요청으로 구현한 결과를 기록한다. 작업 기준은 `main`의 `97b2c0d`이며 커밋·푸시·배포는 하지 않았다. 복구 기준은 `docs/HANDOFF.md`의 맨 위 현재 상태다.

## 변경 범위와 판정

| ID | 로컬 결과 | 남은 범위 |
| --- | --- | --- |
| SPK-001/002/006 | 이전 로컬 수정 보존. JSON 숫자 범위, 퍼센트 무효 결과, 복사 완료/실패 처리 회귀 통과 | 실제 OS 클립보드 권한과 운영 배포는 별도 |
| SPK-003 | 수면 글의 시간 산술·카페인 가정 교정. 계산기와 90분·입면 15분 가정 연결. 추천 등급/색상 제거 | 개인 수면 상태나 치료 효과를 검증한 것이 아님 |
| SPK-004 | 고정 해독 시간표·MFA 안전 보장 삭제. 난수는 기존 rejection sampling 유틸리티 재사용. 임의 강도 점수를 제거하고 결과 문자 수 표시 | 계정 침입·크래킹·실제 유출 검사 없음 |
| SPK-005 | 정적/React에 같은 제3자·이전 방문 기반 광고·설정 링크·입력 처리 구분 반영 | 실제 AdSense 설정, 지역별 CMP/동의, 보관 기간·운영 데이터 흐름 미확인 |
| SPK-007 | 0%는 P/n·이자 0. 빈 값/음수/소수 기간/비유한/범위 초과 차단. 원금균등 반복문 제거 | 실제 금융상품·수수료·일수·중도상환 견적 검증 아님 |
| SPK-008 | 기존 계산을 유지하고 UTF-16 코드 단위·UTF-8 바이트·공백 제외 정의와 예시 명시 | 제출처별 계산 기준 미확인 |
| SPK-009 | 공유 JSON으로 정의·개인정보·문의의 핵심 안내 통일. 정적 글자수 관련 링크 3개 일치. 도구 목록의 심사자 문장·없는 검색창 지시 제거 | 전체 사이트 모든 페이지의 정적/SPA 동등성 검사를 뜻하지 않음 |
| SPK-010 | 해당 글에 수기 기록 양식과 가상 추첨 1건, 제외·중복·재추첨·변경 이력 추가 | 원래 generated/noindex 유지. 편집 승인이나 검색 목록 승격 없음 |
| SPK-011 | Yes/No 글과 도구를 되돌릴 수 있는 저위험 선택으로 제한. 기존 후속 글 연결 | 고위험 판단을 대신하지 않음 |
| SPK-012 | 공개 Issues 유지. 민감정보 게시 금지와 비공개 수신 경로 미설정 표시. 소개·SEO의 비공개 접수 오해 제거 | 실제 수신 가능한 공개용 주소가 제공되지 않아 비공개 접수/수신 시험 미완료 |
| SPK-013 | 아래 콘텐츠 비교 완료. URL/본문/redirect/index 변경 없음 | 대표 URL 선택과 통합은 GSC/링크 자료 필요 |
| SPK-014 | 이번 로컬 수정과 분리 | 다른 건강·AI 수치와 기준의 원자료 대조, 실제 Google 크롤러/광고/분석 흐름 검증 필요 |

## 근거와 적용 범위

- 수면: [NHLBI 수면 단계](https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep)는 약 80~100분 주기 설명의 근거다. 개인의 단계는 시각만으로 판정하지 않는다. 생활 습관 문구는 [NHLBI 건강한 수면 습관](https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits)에 연결했다. 90×4+30=390분, 23:00+15+450분=06:45는 독립 산술이다. 10시간 후 약31.5%는 **가상의 6시간 반감기** 계산이지 측정된 개인 수치가 아니다.
- 비밀번호: [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html)는 인증 환경·위협·통제 수단을 구분하는 근거이며 생성기에 대한 인증이나 특정 길이 안전 보장으로 쓰지 않았다. [MDN getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)의 난수 기능 설명을 참고하고 기존 `src/utils/random.ts`의 rejection sampling을 재사용했다.
- 대출: [CFPB 고정 상환 설명](https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/)은 고정 금리 원리금 상환 모델의 참고 근거다. 0% 분기는 모델의 산술이며 모든 대출 상품에 관한 보장이 아니다. [계약별 이자 방식 구분](https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/)에 맞춰 중도상환의 보편적 절감 보장을 제거했다.
- 광고 고지: [AdSense 필수 개인정보 고지](https://support.google.com/adsense/answer/1348695?hl=ko), [개인 맞춤 광고 안내](https://support.google.com/adsense/answer/7549925?hl=en)를 대조했다. 링크는 Google 개인정보처리방침·내 광고 센터·파트너 사이트 데이터 안내다. 저장소의 GA/AdSense 코드 존재를 확인한 것이며 실제 광고 모드나 동의 준수를 통과시킨 것이 아니다.
- 분석: `src/utils/analytics.ts`의 `trackToolCompleted`는 도구 경로와 결과 유형만 받으며 생성된 비밀번호를 넣지 않는다. 제3자 SDK 실행을 차단한 브라우저 검사는 전체 운영 데이터 흐름의 증거가 아니다.
- 편집: 기존 사이트 페르소나와 공식 출처 대조를 기존 네 글의 제한된 교정에 적용했다. 대량 신규 원고, 단순 분량 늘리기, 편집 승인 변경은 하지 않았다. 세 curated 글의 제목·설명은 원본과 두 메타데이터 파일을 함께 고쳤다. 발행일과 예약 시각은 보존했다.

## SPK-013 CSS 글 비교

| 항목 | css-shadow-guide (2026-03-12) | css-shadow-design (2026-05-06) |
| --- | --- | --- |
| 공통 목적 | box-shadow 입문 및 생성기 연결 | box-shadow 입문 및 생성기 연결 |
| 중복 | offset/blur/spread/color, 카드·글로우 | 같은 파라미터와 카드·글로우 |
| 보존할 고유 내용 | 2px 4px 8px 0px 구문 설명, inset 코드 | X/Y 부호·spread 설명, 뉴모피즘 다중 그림자 |
| 현행 경로 | 그대로 유지 | 그대로 유지 |

콘텐츠만 보면 두 글의 고유 예시를 보존하는 통합 후보지만, 어느 URL을 남길지는 정하지 않았다. `css-shadow-states`는 기본/호버/포커스 상태를 다루는 별도 승인 글이다. GSC 유입·쿼리·선택 canonical·내부/외부 링크 비교가 없으므로 대표 URL 우위나 통합 효과는 미확인이다. 통합·redirect·삭제·noindex 변경은 실행하지 않았다.

## 검증과 한계

- Node v24.12.0에서 `verify-loan.mjs`, `verify-tool-reliability.mjs` 통과. 대출은 독립 월별 잔액/이자 합산으로 정상식을 대조했다.
- 타입 검사와 lint는 모두 `tsc --noEmit`이며 별개 정적 분석기로 중복 계산하지 않는다.
- 콘텐츠 검증: 650계획/50승인, 최소 점수88, 기존 승인 글 최대 유사도0.235. 이 수치는 새로 교정한 네 글의 의학/보안 인증이나 신규 승인 점수가 아니다.
- 전체 빌드: 688본문 렌더, 오류0. 성장 검사25개, 검색 범위 검사18개 통과.
- `verify-audit-repairs.mjs`: 교정된 정적 본문, 제목/설명 원본·캐시 일치, 기록 글의 원래 noindex, 핵심 안내/링크, 난수 rejection 경계 통과.
- 브라우저: 최종32/32 통과, pageerrors0. 결과는 `output/tool-reliability/browser-results.json`, 실행 로그는 `output/audit-repairs-browser.log`. 세 글 제목·canonical·index 정책과 개인정보의 공유 문구/링크도 확인했다. API 복사는 모의 허용/거부/없음/대기 처리다. 외부 SDK/API/non-GET는 차단하며, 운영 사이트나 실제 OS 클립보드 시험이 아니다.
- 처음 정적 검사는 ‘수백 년 안전이라고 말할 수 없다’는 부정문을 금지 숫자로 오탐했다. 테스트를 기존 해독 시간표/보장 문장과 명시적 한계 설명을 검사하도록 고쳐 통과시켰다. 제품 오류 수로 세지 않는다.
- 독립 Luna/max 검토 후 수면 등급, 비밀번호 점수, 대출 중도상환 표현, 정적 도구 목록의 검색창 지시, 문의 소개를 수정했다. 초기 Spark의 `Unknown model` 실패 이후 동일한 읽기 전용 범위를 Luna/max로 재시도했다.

## 파일과 부수 효과

- 도구: `LoanCalculator`, `SleepCalculator`, `PasswordGenerator`, `TextCounter`, `YesNoOracle`, `utils/loan.ts`; 이전 JSON/퍼센트/복사 변경 보존.
- 내용/안내: `posts.tsx`, `content-plan.generated.json`, `generated-content-chunks/chunk-01.json`, 두 post-metadata JSON, `site-guidance.json`, `site-pages.json`, `Contact.tsx`, `PrivacyPolicy.tsx`, `generate-assets.mjs`.
- 검사: `verify-loan.mjs`, `verify-audit-repairs.mjs`, 기존 작업의 두 tool-reliability 스크립트. 새 의존성 없음.
- 빌드가 `public/{llms.txt,rss.xml,sitemap.xml}`을 현재 시각에 맞췄다. 이미 예약되어 시각이 지난 글7개의 목록 반영과 수정 메타데이터를 포함한다. 예약·승인·index 정책 자체는 바꾸지 않았고 외부 발행은 하지 않았다. 최종 diff와 public/dist 일치가 검증된 생성물을 유지한다.
- 기존 `.omc/`, `.playwright-cli/`, 감사 vite-cache, 초안 문서, output은 보존했다. 롤백은 이번 범위의 diff만 되돌리고 기존 미추적 파일은 삭제하지 않는다.
- 실행하지 않음: 커밋/푸시, Vercel CLI/API, 배포, 광고 클릭, 메일·Issues 전송, 계정/CMP 변경, GSC·인덱싱 제출, DB 변경, URL 통합.

다음 작업은 SPK-014의 기존 건강·AI 문구를 원자료와 대조하는 읽기 전용 검증이다. 비공개 문의 주소와 실제 광고·동의·크롤러 자료는 별도로 확보해야 한다.
