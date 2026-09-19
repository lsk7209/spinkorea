# SpinKorea 정밀 재검증 보고서 — REVIEW ONLY

1. 검토·감사 문서 작성 완료. 제품 코드·콘텐츠·계정·배포 변경 없음.
2. JSON 정밀도 손실, 퍼센트 0분모, 복사 거부 성공 알림 등 로컬 기능 결함을 재현했다.
3. 수면 산식 오류와 비밀번호 보장 문장은 현재 운영 HTTP에서도 확인했다.
4. 문의 링크는 렌더링 후 존재하며 목적지 HTTP200이다. “문의 수단 없음”은 정정한다.
5. 추천·심사자 문구·개인정보 차이는 독립 정적 셸과 React 본문 차이로 설명된다.
6. 신규 글 생산보다 기존 기능/콘텐츠 정확성과 정책 고지의 사실 확인을 우선한다.
7. Policy PARTIAL / Crawl & Function FAIL / Publisher Value FAIL. 실제 광고·봇·계정은 미검증.
8. AdSense 거절 원문이 없어 거절 원인·승인 확률·100점 점수는 산정하지 않는다.

## 환경·범위
- 2026-09-19T23:11:55.526020+09:00; 저장소 E:\web\spinkorea, main, cc03040ba8bbb79427547801744097c6b079d668. 운영 SHA 미확인.
- React19/Vite7/TypeScript, npm/package-lock.json. curated JSX + generated JSON/chunks, 날짜와 source 분류에 따라 discovery/route 생성.
- 기존 docs/HANDOFF.md는9/8, PROJECT_STATE.md/.goal-harness는8/30 기록으로 현재 감사 완료의 증거가 아니다. 감사 고유 폴더에만 durable handoff를 기록했다.
- 초기 사용자 미추적 변경 .omc/.playwright-cli/output 및 두 입력문서/개선프롬프트를 보존. 추적 파일 diff 없음.
- Spark 시작 실패(Unknown model) 후 동일 읽기 전용 콘텐츠 범위를 Luna/max로 한 번 재시도하여 완료. 리더는 함수/HTTP/DOM/정책/최종 검증 담당.

## 커버리지와 인벤토리 해석
- 발견한 원본 URL 후보 1313개; 공개 HTTP 확인 158개. 이 후보 수에는 미래 source/기존 dist/fragment 변형이 포함되어 공개 페이지 수가 아니다.
- 운영 sitemap 149개 중 149개 HTTP 검사. HTTP/명시적noindex 이상 0개. 실제 색인 수·Google 접근은 UNKNOWN.
- 초기 허브 표본에서 도구51개, 블로그87개 링크. 기존86은 현재 값이 아니며 전체 공개 글 수를 뜻하지 않는다.
- 소스 메타데이터727개 = curated76/editorial50/generated601; content plan650개는 scheduled. 빌드/게시시간·현재 날짜·indexable 판정은 서로 다르다.
- 콘텐츠 심층 표본12개: A02/A03/A04, CSS3, YesNo2, exercise-brain/bmi-limitations/ai-era-skills/boundaries-relationship. 위험·중복·좋은 글을 함께 선정. 나머지 HTTP검사를 심층 품질검토로 세지 않는다.
- DOM5개: text-counter/contact/privacy/tools/random-choice-log. 로컬 도구8개, 기능·UX21사례(PASS15/FAIL6). 전체 도구 기능 PASS로 확대하지 않는다.
- 정규화 키는 원본에서 fragment만 제거; 원본 행은 유지, slash/query를 합치지 않음. 들어오는 링크 수는 최초 표본/확장 중 발견된 링크의 제한적 자료이며 전체 orphan 판정에 쓰지 않는다.
- 검사하지 않은 칸은 UNKNOWN. 기존 dist는 새 build가 아니므로 생성 증거와 운영 대응이 미확인이다. GSC/GA4/AdSense·거절원문·로그는 현재 요청에 미제공이며 계정 접근하지 않았다.

## Critical findings TOP 5
|ID|재현|등급|AdSense 직접성|
|---|---|---|---|
|SPK-001|JSON 9007199254740993→9007199254740992, 무경고|P1|Indirect|
|SPK-002|퍼센트 분모0에서 +10% 잔류/∞%|P1|Indirect|
|SPK-003|수면390분을7시간, 10시간후카페인 절반이라고 표기|P1|Indirect|
|SPK-004|공격환경없는 해독시간·2FA안전보장|P1|Indirect|
|SPK-005|개인정보 이전방문 광고설명·설정해제링크 누락|P1|Direct(고지요건), 거절인과Unknown|

발견14건의 필수 필드·최소 수정·보존/회귀/롤백은 evidence.md와 fix_backlog.md 참조. P0는 확인되지 않았다. 미확인 광고/개인정보 유출을 확정하지 않는다.

## 기존 진단 재현·정정
A01~A12 전체 상태는 prior_findings_review.csv. A02/A03/A04는 현재 문제 재현. A05/A10/A12는 최초HTML와 DOM을 나눠 판정해야 한다. A11 문의수단없음은 반증했지만 비공개문의 경로 부족은 별도 위험이다. A07의 예전 Crawl Gate PASS와67/100은 유지하지 않는다. 현재 안 보인다는 이유로 ALREADY_FIXED로 판정한 항목은 없다.

## 기능·데이터 흐름·구조
- 계산: 정상 양수 대출/윤년 날짜/균등 팀/QR 판독은 보존. 0%대출은 지원/거부정책 명확화가 필요. UTF16 길이 자체를 오류라고 하지 않고 라벨/플랫폼 범위 문제를 지적했다.
- 보안: 생성기 Crypto 사용, 4/50자 및 마지막 문자군 유지 확인. modulo bias는 작은 정적 개선 후보; 비밀번호 강도 인증/실제 크래킹 검사는 하지 않았다.
- 입력: Text/JSON/QR은 React state, QR은 qrcode.react canvas·PNG 로컬 내보내기. 관찰 범위에서 fetch 전송 경로는 찾지 못했다. GA helper는 pathname과 tool_path/result_type 중심이나 차단한 외부SDK 후속수집까지 보장하지 않는다.
- 룰렛은 use-state-persistence.ts:68 이후 URL의 압축 s 파라미터·localStorage에 후보/최근결과를 보존한다. 공유 URL은 입력을 담을 수 있으므로 “브라우저 처리”와 “절대 외부전송 없음”은 다르다. 사용자 네비게이션/공유 후의 서버·제3자 흐름은 이번 동적 범위 밖이다.
- generatedContent.tsx:793 HTML삽입은 저장소 authored body 경로다. 임의 도구입력의 직접HTML실행 취약점이라고 단정하지 않는다. 로컬 악성페이로드/공격검사는 실행하지 않았다.
- 기술SEO: HTTP/www 모두308 한단계→HTTPS apex200; 대표 미존재404. sitemap과robots200. Googlebot/광고봇 이름을 바꾼 요청이나 실제봇 로그검사는 하지 않았다.
- robots 규칙상 일반 공개경로 허용, /api/ 제외. ads.txt200 및 공개publisher ID가 index.html의 ID와 일치하지만 계정 소유·승인상태는 미확인.
- 메타robots 부재를 noindex로 보지 않음. noindex는 검색 제어이며 광고정책 제외가 아니다. HTTP/DOM의 의미 차이는 확인했으나 검색 스니펫·캐시/클로킹 원인은 미확인.
- 모바일: 텍스트도구360/390/768/1280에서 가로넘침없음.390 screenshot에서 입력·통계 표시를 확인; 복사 UI는 hover에 의존하는 숨김 상태여서 터치·키보드 사용성 추가검증 필요. 모든도구/실제기기/키보드 포커스 PASS가 아니다.

## 콘텐츠 가치·비교
|심층 페이지|사용자 고유 가치|제안|
|---|---|---|
|sleep-optimization|수면 시간 가정과 일상 준비|IMPROVE SPK-003|
|password-strength|비밀번호 생성·관리의 보안 기준|IMPROVE SPK-004|
|random-choice-log|추첨 절차를 기록하고 설명|IMPROVE SPK-010|
|css-shadow-design|디자인 예시로 그림자 적용|MERGE REVIEW SPK-013|
|css-shadow-guide|CSS 매개변수 입문|MERGE REVIEW SPK-013|
|css-shadow-states|상태·포커스·접근성 점검|KEEP|
|yes-no-oracle-guide|가벼운 선택을 시작할 계기|IMPROVE SPK-011|
|yes-no-reversible-choice|되돌릴 수 있는 선택의 제외기준|KEEP|
|exercise-brain|운동·집중 관계 이해|IMPROVE/출처검증 우선|
|bmi-limitations|BMI 해석 한계 이해|KEEP 한계설명, 수치/집단 검증|
|ai-era-skills|업무 역량 선택 기준|IMPROVE 확정 미래예측 제한|
|boundaries-relationship|거절·경계설정 대화예시|KEEP, 상황/도구연결 명확화|

공통UI 반복과 본문 실질중복을 구분했다. 정량 유사도/전체 저품질 비율은 계산하지 않았다. 신규 콘텐츠는 기존 개선 우선. 기존 URL의 유입·성과를 모르는 상태에서 통합/삭제/noindex 변경은 제안만으로 실행하지 않는다.

외부3개 실제 열람: [Wheel of Names FAQ](https://wheelofnames.com/faq)의 난수/당첨자제외 설명, [timeanddate](https://www.timeanddate.com/date/duration.html)의 종료일포함 옵션, [계산기닷컴](https://gyesanki.com/study/char-count/)의 계수/바이트 기준 안내를 정보구조 참고로만 사용했다. 승인·순위·매출·계산정확성 우월성을 비교하지 않았다.

## 최대10개의 미승인 관련 가설 (5개)
1. 부정확한 건강/보안 설명이 신뢰를 낮출 가능성: 현상 Confirmed, 거절인과 Unknown.
2. 생성형 기록 글의 반복/실행가치 부족: 표본1개 Confirmed, 전체확대/거절인과 Unknown.
3. 개인정보 광고고지 항목 누락: 직접공식고지 비교 Confirmed, 계정거절인과 Unknown.
4. 도구 결과 변형/실패 오안내: 로컬 Confirmed, 운영 동일재현·거절인과 Unknown.
5. 정적/렌더링 핵심안내 차이: Confirmed, 실제크롤러 해석/거절인과 Unknown.
봇차단·광고겹침·개인정보전송·CMP미준수는 현재 확정 가설에 올리지 않고 검증목록으로 남긴다.

## Gate
|Gate|판정|근거/재평가 조건|
|---|---|---|
|A Policy|PARTIAL|고지 누락 확인; 실제 광고·동의지역·계정·전송범위 미확인. 고지/설정대조 및 조건부동의검증 필요|
|B 접근·내비게이션|PARTIAL|sitemap 전수HTTP, 대표 redirect/404 정상; 실제봇/전체후보공개여부·필수안내정합은 미검증/불일치|
|B 기능|FAIL|로컬 JSON·퍼센트·복사·0%대출·계수정의 문제. 수정후 경계회귀·운영대응확인 필요|
|B 종합|FAIL|접근부분 통과를 기능전체 PASS로 바꾸지 않음|
|C Publisher Value|FAIL|수면/보안 부정확성·기록글 템플릿 문제; 좋은 상태별/저위험 글은 보존|

재신청 가능 판정은 내리지 않는다. 공식 광고 규정은 evidence.md의 [Google 고지 요건](https://support.google.com/adsense/answer/1348695?hl=en)·[CMP 조건](https://support.google.com/adsense/answer/13554116?hl=en)에 근거하며 검색지침·기술의견과 분리했다.

## 다음 작업 TOP10
1. JSON 위험숫자 변형 방지 — SPK-001, 무고지 변경0.
2. 퍼센트 0분모/잔류 제거 — SPK-002, 실패시 이전값0건.
3. 수면 두 산술식과 주기단정 교정 — SPK-003, 독립검산일치.
4. 비밀번호 고정시간/MFA보장 교정 — SPK-004, 포괄보장0.
5. 광고 설정 사실확인 후 고지 동기화 — SPK-005, 필수항목/링크 확인.
6. 복사 Promise실패 안내 — SPK-006, 거부시성공0.
7. 0%대출 지원/거부 명시 — SPK-007, 빈값과0구별.
8. 글자수 정의·플랫폼범위 명시 — SPK-008, 이모지/결합문자일치.
9. 정적셸 추천/문의/심사자문구 정렬 — SPK-009/012, 초기·DOM필수안내일치.
10. 랜덤기록 양식과 YesNo 위험범위 개선 — SPK-010/011, 실제사용예시/제외기준일치.

## 산출물·비실행
필수6개: report.md / url_inventory.csv / prior_findings_review.csv / test_results.md / fix_backlog.md / evidence.md. 추가: HANDOFF.md, 재현스크립트, 최소HTTP·브라우저 증거JSON, checks.log, QR더미PNG, 모바일스크린샷, coverage.json.
제품변경0. 설치/lock변경/계정조회/문의발송/광고클릭/커밋/푸시/배포/색인제출/리디렉션·noindex변경/새글작성·게시 NOT RUN. 기존 build 산출물은 갱신하지 않았다.
다음 하나의 작업: 승인된 수정 요청이 오면 fix_backlog 첫 최소 묶음(JSON·퍼센트·복사)부터 회귀 테스트와 함께 진행. 이번에는 구현하지 않는다.

할인 기능 범위 확인: `src/pages/tools/DiscountCalculator.tsx:12`는 단일 할인/할인율/정가 역산만 제공하며 연속할인 옵션은 없다. 연속할인 전용 테스트는 NOT APPLICABLE.
