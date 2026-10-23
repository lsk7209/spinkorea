# Release readiness continuation — 2026-10-23

사용자가 권장 순서(기기/성능 점검 → 배포 → 운영 화면 확인)를 승인하여 출시 절차를 진행합니다. `scripts/verify-release-browser.mjs`는 실제 빌드 산출물과 운영 URL을 같은 기준으로 확인합니다.

- Android SDK adb로 조회했으나 연결 기기는 없습니다. 실물 기기/실제 스크린리더 검증을 완료했다고 주장하지 않습니다.
- 빌드 산출물의 390px 터치 환경에서 편집·2명 추첨·발표·Escape·실제 Chromium 클립보드 읽기/쓰기 PASS(mock 아님). Chromium 접근성 트리의 이름 없는 조작 요소 0개.
- 캐시 비활성, CPU 4배 제한, 지연 150ms, 다운로드 1.6Mbps의 3회 로컬 측정: LCP 868/840/876ms(중앙값 868ms), CLS 모두 0. 초기 자원 약 179KB. 관측된 최장 long task 775ms. 실사용 INP·현장 Core Web Vitals 또는 이전 버전 대비 개선량을 뜻하지 않습니다. 지속적인 반응성은 운영 데이터로 확인할 항목입니다.
- 11개 주요 경로 200/H1 1개/390px 가로 넘침 없음, pageerrors 0, 광고 요청 시도 0. 비용 제한 감사도 critical 0.
- 로그/JSON은 `output/redesign-release-audit.log`, `output/release-20261023/local.json`에 보관합니다.

추가 회귀 검사: 기존 브라우저 suite를 현재 UI의 명시적 저장·회차 기록·발표 모드로 갱신했고 11/11, pageerrors0입니다. 계산기 브라우저7/7, 배포 가드8/8도 통과했습니다.

## Release risk notice

Task: tested redesign production release through existing PR and Scheduled publish workflow.
Why needed: user explicitly authorized the recommended release sequence.
Impact: public frontend and existing date-based content generation. No DB migration, DNS, account/CMP configuration or paid resource change.
Rollback: focused revert of the release merge via PR, then the same Scheduled publish workflow; never force push/reset unrelated work.
Safer path: manual workflow uses notify=false; existing SHA freshness guard and cost guard retained. No search-engine notifications requested.
Approval: already supplied by user in this conversation; no additional proceed prompt.

--- Completed local implementation record ---

# SpinFlow 스핀코리아 리디자인 검토 — 2026-10-23

상태: 로컬 구현 완료. 커밋·푸시·배포·외부 계정 변경은 실행하지 않았습니다.

## 적용 결과

최신 HOME & MOBILE / GUIDE & RESULT 보드를 최종 시각 기준으로 사용했습니다. 종이색·먹색, 명조 제목과 고딕 조작부, 네 색상과 원형 눈금 룰렛, 연두 명단 색인, 모서리를 자른 주황 버튼, 절취선 결과 카드를 실제 HTML/SVG 텍스트로 구현했습니다. 이미지를 페이지 배경으로 붙이지 않았습니다. 헤더·푸터는 `SpinFlow 스핀코리아`로 통일했습니다. 시안의 예시를 실제 이용 실적으로 표시하지 않습니다.

홈은 원본 명단·현재 후보·제외 인원을 실제 상태로 표시합니다. N명 묶음 내 중복 방지는 고정이며 해제 토글이 없습니다. 이름이 같아도 원본 명단 번호로 구분합니다. 추첨 후 자동 제외는 별도 설정으로 원본 명단을 보존합니다. 회전 중 입력·중복 시작을 막고, 완료한 룰렛·화면 결과·복사 조건·회차 기록은 같은 추첨 스냅샷을 사용합니다. 다음 회차와 명단 수정이 과거 기록을 바꾸지 않습니다.

최근 20회차는 브라우저에 저장하며, 저장 실패는 화면에 알리고 현재 세션 기록은 유지합니다. 회차 삭제 버튼은 회차 기록만 삭제합니다. 저장된 명단·최근 결과까지 지우는 사이트 데이터 삭제 방법을 개인정보 안내에 적었습니다. 팀 편성 이동에서도 중복 이름의 원본 번호를 유지합니다. 공유 링크는 후보만 포함하며 결과·제외 상태는 포함하지 않는다고 알립니다. GA 초기 설정에서도 URL 검색문자열·해시를 제거했습니다.

기본 광고 로더를 제거했습니다. 홈·조작부·결과·발표 모드에서 광고를 요청하지 않으며, 비활성 광고 자리에 빈 박스를 만들지 않습니다. FAQ와 생성 llms 안내도 현재 상태로 맞췄습니다. 가이드는 검색·분류·빈 결과·본문 목차를 제공하며 기존 글 URL·발행일을 유지합니다.

발표 모드는 결과를 먼저 읽는 DOM/화면 순서와 상단 종료 버튼을 제공합니다. 명단 편집과 발표 모드에 초점 이동·Tab 가두기·Escape 종료·초점 복귀를 적용했습니다. 복사 성공/실패 알림은 발표 시 하단에 표시합니다.

## 계산 정확성 수정과 지원 범위

- 퇴직금: 마지막 근무일 다음 날을 퇴직일로 사용하고, 직전 3개월의 실제 달력 일수(89~92일)를 적용합니다. 365일 고정 대신 달력상 1년 근속을 판정합니다. 월급이 매달 같다는 평균임금 가정이며 제외 기간·통상임금 하한·연차수당·세금 등은 별도 반영하지 않는다고 표시합니다.
- 급여: 기존 세금 근사를 2026년 공식 근로소득 간이세액표 646구간으로 교체했습니다. 본인 포함 가족 1~11명, 해당 가족 중 8~20세 자녀, 원천징수 100%를 지원합니다. 2026년 3~12월·월 과세급여 1천만원 미만만 계산하고 범위 밖은 결과를 숨깁니다.
- 국민연금: 2026년 근로자 4.75%, 6월까지 40만~637만원, 7월부터 41만~659만원을 적용합니다. 기준소득월액 천원 미만·보험료 10원 미만 절사를 적용합니다.
- 건강·요양·고용보험은 화면에 명시한 보수 가정과 절사 규칙의 참고값입니다. 실제 개인별 가입·신고 보수·보험료 상하한·정산을 모두 구현한 급여 시스템은 아닙니다. 법률·세무 확정값을 보증하지 않습니다.

공식 근거: [국세 간이세액표 PDF](https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=169798151), [국민연금 적용기간·상하한](https://nps.or.kr/pnsinfo/ntpsklg/getOHAF0038M0.do?menuId=MN24001113&tab=tab5), [국민연금 보험료율](https://ma.nps.or.kr/pnsinfo/ntpsklg/getOHAF0016M0.do?menuId=MN24001108), [건강·요양보험 2026 공지](https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html), [고용보험](https://edrm.ei.go.kr/ei/eim/eg/ei/eiEminsr/retrieveEi0301Info.do), [고용노동부 퇴직금](https://moel.go.kr/retirementpayCal.do).

## 검증 증거

- `npm run verify:local` PASS: 타입 검사, 143개 단위·계약 테스트, API 15개, 저장·결과 일관성·도구 신뢰성·대출·콘텐츠·빌드·초기 HTML·한국어·성장·검색 범위 검증.
- 최종 수정 후 `npm test` 143/143 PASS, `npm run build` PASS: 도구/정책 55개 및 전체 721개 렌더링, 실패 0.
- 계산기 브라우저 경계 검증 7/7 PASS, pageerrors 0.
- 리디자인 브라우저: 320/360/390/768/1024/1440px 홈, 모바일 명단 편집·N명·복사·제외·기록 재접속·중복 이름 팀 전달·공식 세금값·지원범위 차단·저장 차단 안내·발표 초점/Escape를 검증했습니다. 가이드·급여·퇴직금·도구·비밀번호·개인정보 경로도 확인했습니다. 가로 넘침·pageerrors·광고 요청 0. 외부 요청은 테스트에서 차단했고, 광고 도메인 시도는 별도로 기록했습니다.
- 주요 색 대비: 먹색/종이 13.79:1, 보조 글자/종이 5.16:1, 흰색/주황 버튼 4.97:1, 초점/종이 5.74:1, 입력 테두리/종이 3.62:1, 먹색/연두 11.76:1. 전체 페이지 자동 WCAG 인증을 뜻하지 않습니다.
- 독립 코드 리뷰의 기록 저장 실패·광고 안내·발표 초점 순서·알림 누락 지적을 수정하고 재검토 PASS를 받았습니다.

로그: `output/redesign-verify-local.log`, `output/redesign-final-tests.log`, `output/redesign-final-build.log`, `output/redesign-calculator-browser.log`, `output/redesign-browser.log`, `output/redesign/browser.json`, `output/redesign/contrast.json`.

화면 캡처: [모바일 홈](../output/redesign/home-390-viewport.png), [데스크톱 홈](../output/redesign/home-1440-viewport.png), [모바일 결과](../output/redesign/result-mobile.png), [발표 모바일](../output/redesign/presentation-mobile.png), [발표 데스크톱](../output/redesign/presentation-desktop.png), [가이드 모바일](../output/redesign/guides-360.png), [가이드 데스크톱](../output/redesign/guides-1440.png), [급여](../output/redesign/salary-1440.png).

## 보존과 미확인

기존 `.gitignore` 수정과 관련 없는 untracked 작업을 보존했습니다. 빌드가 날짜 기준으로 갱신한 RSS·사이트맵·게시글 메타데이터는 리디자인 범위 밖이므로 원래 체크아웃 내용으로 복원했습니다. llms는 광고 안내 수정만 남겼습니다. 다음 빌드는 기존 날짜 기반 게시 규칙에 따라 다시 생성합니다.

첨부 명세에서 참조한 원본 `spinkorea-development-prompt-20261023.md`는 제공 경로와 저장소에서 찾지 못했습니다. 제공된 리디자인 명세·현재 구현·기존 개선 요구와 감사 자료로 요구를 복원했습니다. 원본 전체와의 일대일 적합성은 미확인입니다.

실물 모바일·스크린리더 전체 검증, 실제 OS 클립보드 권한별 동작, 성능 전후 측정, 운영 GA/AdSense/CMP 계정 상태, 실제 배포·외부 URL 검증은 미확인입니다. 브라우저 검증의 복사는 mock clipboard로 내용 일치를 검증했습니다. 운영 환경과 계정 활성화는 이번 로컬 완료에 포함하지 않습니다.
