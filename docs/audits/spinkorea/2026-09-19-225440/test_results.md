# 실행 테스트와 미실행 범위
시각 2026-09-19T23:11:55.526020+09:00. 로컬 Vite는 configFile:false, envDir=감사폴더, 전용 cacheDir, 임의 localhost 포트. 기존 .env를 로드하지 않음. 브라우저는 모든 외부 host 및 /api/·비GET 요청 차단. 제품 파일 편집 없음.

## 명령과 핵심 판정
- `node node_modules/typescript/bin/tsc --noEmit`: PASS (exit0). package lint가 동일 tsc이므로 독립 lint 통과라고 중복 집계하지 않음.
- `node scripts/verify-roulette-storage.mjs`: PASS, ROULETTE_STORAGE_OK / RECENT_TOOLS_STORAGE_OK.
- `node scripts/verify-spin-consistency.mjs`: PASS, SPIN_CONSISTENCY_OK. 정적 계약 검사이며 현재 실제 spin E2E 증명은 아님.
- `python <audit>/collect.py`, `python <audit>/expand-sitemap.py`: 순차 GET, 요청후450ms, 명시적 재시도0. 실제 Google 봇 검증 아님.
- `node <audit>/browser-audit.mjs`, `browser-followup.mjs`, `browser-final.mjs`, `percentage-zero.mjs`: 실제 React UI 실행. 원본 실패/정정 내역 보존.
- OpenCV QRCodeDetector: `qr-decode.json`, 더미 URL 일치 PASS; PNG 다운로드 PASS.

## 최종 테스트 사례 (최초 잘못된 판정은 아래 정정)
|ID|입력/기대|최종 판정/실제|
|---|---|---|
|T01|A 한😀: 코드포인트4/3, UTF16 5/4, UTF8 9|FAIL(정의/라벨): 5/4/9, UTF16 설명 없음|
|T01-edge ×4|빈값/a줄바꿈b/e+악센트/가족ZWJ|PASS 산출값 각각 0/3/2/11 code units, UTF8 0/3/3/25; 정의 미표시는 T01|
|T02|clipboard Promise 거부|FAIL 성공toast와 NotAllowedError|
|T03|큰 정수9007199254740993|FAIL 9007199254740992로 변형, 경고 없음|
|T04|잘못된 쉼표|PASS parser error; 이전 출력 유지 문제는 별도 개선. 최초 한국어toast matcher 실패를 기능 실패로 계산하지 않음|
|T05|120만원/0%/12개월|FAIL 결과누락/잘못된 미입력 안내; 0% 미지원 설명 없음|
|T06|120만원/12%/12개월|PASS 월106619원 (독립 계산 반올림106618.546...)|
|T07|기간0|PASS NaN/Infinity 없음; 명확한 오류 UX는 별도 개선|
|T08|2024-02-28~03-01|PASS 2일|
|T09|동일 날짜|PASS 같습니다 안내; 초기 같은 matcher 오류 정정|
|T10|역순|PASS 지난 기간 안내|
|T11|서로 다른10명/3팀|PASS 4·3·3, 결과 Person0~9 각1회; 원본 OBSERVED를 내용 검토해 판정|
|T12|비밀번호4/50자, 마지막문자군해제|PASS 길이4/50 및 최소1그룹 유지; 첫 숨겨진checkbox locator 실패 후 label 클릭으로 재검증|
|T13|QR더미 URL/PNG|PASS OpenCV 독립 decode 원문일치. Chromium BarcodeDetector 부재는 우회 완료|
|T14|텍스트도구360/390/768/1280|PASS 가로넘침없음; 390 screenshot 시각확인. 다른 도구/실기기/키보드/광고 가림은 미검증|
|T15|증감100→110 후 분모0|FAIL +10% 잔류|
|T16|전체0/일부10|FAIL ∞%; 최초 전체10/일부0은 정상0%로 테스트 입력을 정정|
|T17|clipboard resolve mock|PASS 원문 전달; OS clipboard/권한 허용 실제복사는 미검증|

집계 단위: 위17 ID 중 T01-edge 별도4사례를 더해 총21 기능/UX 사례. 최종 PASS15 / FAIL6. HTTP·DOM 관찰·명령검사는 이 분모에 포함하지 않음. 반복 재시도는 중복 집계하지 않음.

## NOT RUN / NOT APPLICABLE
- 전체 build: NOT RUN. build가 public 및 metadata와 node_modules/.cache를 쓰며 기존 dist 생성시점도 불명. 기존 dist는 발견용 자료만 사용. 기존 공유 작업의 산출물을 덮어쓰지 않고 격리 Vite UI로 검증.
- team UI는 실행; 홈 룰렛 후보1/전부제외/동일이름, 전체 도구 경계값/초대형 입력/깊은JSON: NOT RUN.
- 연속할인 전용 기능·날짜 양끝포함 옵션: NOT APPLICABLE(이번 실제 컴포넌트는 제공하지 않음). 수동 연속계산 81을 실제 기능 테스트 통과로 쓰지 않음.
- 건강/BMI/시급 최신 공식연도·집단, 실기기 키보드/초점, 모든 도구 반응형, 미지원crypto: NOT RUN.
- GSC/GA4/AdSense계정·거절원문·서버로그: 미제공, NOT RUN. 실제봇/광고표시/동의지역검사/문의수신/광고클릭은 NOT RUN.
- 광고script/GA request 시도는 blocked 로그로 관찰. third-party 라이브러리를 실행하지 않아 후속 전송/쿠키/광고새로고침은 증명 불가.

## 원본 실행 이력 (OBSERVED는 관찰이며 테스트 PASS 아님)
- T01 최초상태=FAIL; 기대=Labels specify UTF-16 or show codepoints 4/3; UTF-8 9B; 실제={"stats": "공백 포함\n5자\n공백 제외\n4자\n바이트(Byte)\n9B\n단어 / 줄\n2 / 1\n* 한글 1자 = 3Byte (UTF-8 기준)\n1 문단\n도구 소개\n\n자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외 글", "utf16Disclosure": false}
- T01-edge 최초상태=PASS; 기대=Source UTF16/whitespace formula matched; semantic definition remains missing; 실제={"input": "", "stats": "공백 포함\n0자\n공백 제외\n0자\n바이트(Byte)\n0B\n단어 / 줄\n0 / 0\n* 한글 1자 = 3Byte (UTF-8 기준)\n0 문단\n도구 소개\n\n자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외 글"}
- T01-edge 최초상태=PASS; 기대=Source UTF16/whitespace formula matched; semantic definition remains missing; 실제={"input": "a\nb", "stats": "공백 포함\n3자\n공백 제외\n2자\n바이트(Byte)\n3B\n단어 / 줄\n2 / 2\n* 한글 1자 = 3Byte (UTF-8 기준)\n1 문단\n도구 소개\n\n자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외 글"}
- T01-edge 최초상태=PASS; 기대=Source UTF16/whitespace formula matched; semantic definition remains missing; 실제={"input": "é", "stats": "공백 포함\n2자\n공백 제외\n2자\n바이트(Byte)\n3B\n단어 / 줄\n1 / 1\n* 한글 1자 = 3Byte (UTF-8 기준)\n1 문단\n도구 소개\n\n자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외 글"}
- T01-edge 최초상태=PASS; 기대=Source UTF16/whitespace formula matched; semantic definition remains missing; 실제={"input": "👩‍👩‍👧‍👦", "stats": "공백 포함\n11자\n공백 제외\n11자\n바이트(Byte)\n25B\n단어 / 줄\n1 / 1\n* 한글 1자 = 3Byte (UTF-8 기준)\n1 문단\n도구 소개\n\n자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외"}
- T02 최초상태=FAIL; 기대=Reject clipboard => no success toast; 실제={"successToast": true}
- T03 최초상태=FAIL; 기대=Preserve integer or warn; 실제={"output": "{\n  \"id\": 9007199254740992\n}", "warning": false}
- T04 최초상태=FAIL; 기대=Syntax error shown; 실제={"errorShown": false, "staleOutput": "{\n  \"id\": 9007199254740992\n}"}
- T05 최초상태=FAIL; 기대=0%/12 months => 100000 monthly, zero interest; 실제={"has100000": false, "tail": "대출 정보 입력\n대출 원금 (원)\n연 이자율 (%)\n대출 기간 (개월)\n원리금균등\n원금균등\n\n위 항목을 모두 입력하면 결과가 나타납니다.\n\n원리금균등상환 공식\n\n월납부금 = P × r(1+r)ⁿ / ((1+r)ⁿ-1)\n\nP=원금, r=월이율, n=기간(개월)\n\n원금균등상환 공식\n\n월납부금 = P/n + 잔여원금 × r\n\n매달 원금이 균등 감소, 이자는 점감\n\n도구 소개\n\n대출 원금, 금리, 기간을 입력하면 월 상환금, 총 이자, 총 상환금을 자동 계산합니다. 원리금균등·원금균등 두 방식 비교 가능.\n\n"}
- T06 최초상태=PASS; 기대=1200000 at 12% APR for 12 months => round 106618.546=106619; 실제={"has106619": true}
- T07 최초상태=PASS; 기대=zero term no NaN/Infinity; 실제={"nan": false}
- T08 최초상태=PASS; 기대=Elapsed 2 days; 실제={"excerpt": "총 일수, 주수, 개월수, 연수를 확인합니다.\n3\n프리셋 버튼으로 오늘 기준 1개월·1년 등을 빠르게 설정할 수 있습니다.\n활용 팁\n💡\n계약 만료일·근무 기간·프로젝트 일정 계산에 활용하세요.\n💡\n개월수·연수는 30.4일·365.2"}
- T09 최초상태=FAIL; 기대=same day indicated; 실제={"same": false}
- T10 최초상태=PASS; 기대=reverse date explicit; 실제={"past": true}
- T11 최초상태=OBSERVED; 기대=4/3/3 and each Person once in results; 실제="SpinFlow\n룰렛돌리기\n유틸리티\n블로그\n소개\n팀 구성이 완료되었습니다!\n도구 목록\n랜덤 팀 편성기\n참가자 이름 입력 (줄바꿈으로 구분)\n\n총 10명\n\n팀(조) 개수 설정\n3\n팀 나누기\n편성 결과\n1팀 (4명)\nPerson0, Person6, Person4, Person5\n2팀 (3명)\nPerson3, Person8, Person1\n3팀 (3명)\nPerson9, Person7, Person2\n👥 공정한 팀 편성이 필요한 순간\n학교/학원: 조별 과제, 발표 순서 정하기\n워크샵/엠티: 레크리에이션 게임 조 편성\n스포츠: 풋살, 농구 공평한 팀 나누기\n도구 소개\n\n이름을 한 줄씩 입력하면 무작위로 팀을 나눠드립니다. 스터디, 워크숍, 게임 대결에서 팀을 정하는 무료 도구입니다.\n\n사용 방법\n1\n참여자 이름을 한 줄씩 입력하세요.\n2\n나눌 팀 수를 설정하세요.\n3\n'팀 나누기' 버튼을 클릭하세요.\n4\n결과를 확인하고 공유하세요.\n자주 묻는 질문\n최대 몇 명까지 가능한가요?\n▼\n팀 인원이 균등하게 나뉘지 않으면 어떻게 되나요?\n▼\n관련 도구\n룰렛 돌리기\n\n당첨자 한 명 추첨\n\n주사위 던지기\n\n순서 정하기\n\n동전 던지기\n\n두 팀 선택 결정\n\n페이지 업데이트: 2026-05-05\n\nSpinFlow\n룰렛돌리기\n유틸리티 도구\n블로그\n소개\n\n© 2026 SpinFlow. All Rights Reserved.\n\nFAQ\n문의하기\n개인정보처리방침\n이용약관"
- T12 최초상태=OBSERVED; 기대=length 4 and 50; 실제={"min": [{"type": "range", "value": "4"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}], "max": [{"type": "range", "value": "50"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}, {"type": "checkbox", "value": "on"}]}
- T13 최초상태=OBSERVED; 기대=QR decodes to original and PNG exports; 실제={"decoded": "NOT RUN: browser BarcodeDetector unavailable", "download": "qrcode.png"}
- T14 최초상태=PASS; 기대=No horizontal viewport overflow; sampled text tool only; 실제=[{"width": 360, "scrollWidth": 360, "textareaVisible": true}, {"width": 390, "scrollWidth": 390, "textareaVisible": true}, {"width": 768, "scrollWidth": 768, "textareaVisible": true}, {"width": 1280, "scrollWidth": 1280, "textareaVisible": true}]
- T04-recheck 최초상태=PASS; 기대=Parser error displayed; initial test looked for wrong localized toast; 실제="Expected double-quoted property name in JSON at position 7 (line 1 column 8)"
- T09-recheck 최초상태=PASS; 기대=Same-day message (initial matcher was wrong); 실제=true
- T12-recheck 최초상태=BLOCKED; 기대=test completes; 실제="locator.uncheck: Element is not visible\nCall log:\n\u001b[2m  - waiting for locator('input[type=checkbox]').first()\u001b[22m\n\u001b[2m    - locator resolved to <input checked class=\"hidden\" type=\"checkbox\"/>\u001b[22m\n\u001b[2m  - attempting click action\u001b[22m\n\u001b[2m    - scrolling into view if needed\u001b[22m\n"
- T15 최초상태=FAIL; 기대=Changing denominator to zero invalidates old result; 실제={"before": "변화율\n▲ 10%", "after": "변화율\n▲ 10%"}
- T16 최초상태=PASS; 기대=Division by zero has explicit unsupported-input state; 실제={"infinite": false}
- T17 최초상태=PASS; 기대=Mock clipboard resolves and receives identical dummy; 실제={"mock": true}
- T12-final 최초상태=PASS; 기대=Length bounds; last group cannot be deselected; 실제={"values": [{"requested": 4, "actual": 4}, {"requested": 50, "actual": 50}], "checked": 1}
- T16-final 최초상태=OBSERVED; 기대=Zero denominator behavior; 실제="SpinFlow\n룰렛돌리기\n유틸리티\n블로그\n소개\n도구 목록\n퍼센트 계산기 (할인율, 인상률)\n전체 값의 비율 구하기\n전체 값\n의\n%는?\n결과-\n일부 값의 비율(%) 구하기\n전체 값\n중에서\n은?\n결과0%\n증감률(수익률) 계산하기\n기존 값\n에서\n변경된 값\n으로\n변화율\n-\n💡 퍼센트 계산 공식 요약\n\n① 전체의 X% 값 구하기\n\n전체값 × (비율 ÷ 100)\n\n예: 10,000원의 20% = 10,000 × 0.2 = 2,000원\n\n② 전체 중 일부의 비율(%)\n\n(일부값 ÷ 전체값) × 100\n\n예: 50명 중 5명 = (5÷50) × 100 = 10%\n\n③ 증감률 (수익률)\n\n((나중값 - 처음값) ÷ 처음값) × 100\n\n예: 1,000 → 1,500 = (500÷1000) × 100 = 50% 증가\n\n도구 소개\n\n전체 값의 몇 퍼센트는 얼마인지, 값이 얼마만큼 증가하거나 감소했는지(증감률) 등 실생활에 필요한 퍼센트 계산을 쉽게 해결하세요.\n\n사용 방법\n1\n계산 유형을 선택하세요 (X는 Y의 몇%?, X의 N%는 얼마? 등).\n2\n숫자를 입력하세요.\n3\n결과가 자동으로 계산됩니다.\n자주 묻는 질문\n할인 후 가격을 계산하려면 어떻게 하나요?\n▼\n증감률은 어떻게 계산하나요?\n▼\n관련 도구\nBMI 계산기\n\n체질량 지수 측정\n\n단위 변환기\n\n길이·무게·온도 변환\n\n시간 계산기\n\n시간 계산\n\n페이지 업데이트: 2026-05-05\n\nSpinFlow\n룰렛돌리기\n유틸리티 도구\n블로그\n소개\n\n© 2026 SpinFlow. All Rights Reserved.\n\nFAQ\n문의하기\n개인정보처리방침\n이용약관"
- T16-corrected 최초상태=FAIL; 기대=Total zero, part 10 => error, not infinity; 실제={"text": "SpinFlow\n룰렛돌리기\n유틸리티\n블로그\n소개\n도구 목록\n퍼센트 계산기 (할인율, 인상률)\n전체 값의 비율 구하기\n전체 값\n의\n%는?\n결과-\n일부 값의 비율(%) 구하기\n전체 값\n중에서\n은?\n결과∞%\n증감률(수익률) 계산하기\n기존 값\n에서\n변경된 값\n으로\n변화율\n-\n💡 퍼센트 계산 공식 요약\n\n① 전체의 X% 값 구하기\n\n전체값 × (비율 ÷ 100)\n\n예: 10,000원의 20% = 10,000 × 0.2 = 2,000원\n\n② 전체 중 일부의 비율(%)\n\n(일부값 ÷ 전체값) × 100\n\n예: 50명 중 5명 = (5÷50) × 100 = 10%\n\n③ 증감률 (수익률)\n\n((나중값 - 처음값) ÷ 처음값) × 100\n\n예: 1,000 → 1,500 = (500÷1000) × 100 = 50% 증가\n\n도구 소개\n\n전체 값의 몇 퍼센트는 얼마인지, 값이 얼마만큼 증가하거나 감소했는지(증감률) 등 실생활에 필요한 퍼센트 계산을 쉽게 해결하세요.\n\n사용 방법\n1\n계산 유형을 선택하세요 (X는 Y의 몇%?, X의 N%는 얼마? 등).\n2\n숫자를 입력하세요.\n3\n결과가 자동으로 계산됩니다.\n자주 묻는 질문\n할인 후 가격을 계산하려면 어떻게 하나요?\n▼\n증감률은 어떻게 계산하나요?\n▼\n관련 도구\nBMI 계산기\n\n체질량 지수 측정\n\n단위 변환기\n\n길이·무게·온도 변환\n\n시간 계산기\n\n시간 계산\n\n페이지 업데이트: 2026-05-05\n\nSpin"}
할인 기능 범위 확인: `src/pages/tools/DiscountCalculator.tsx:12`는 단일 할인/할인율/정가 역산만 제공하며 연속할인 옵션은 없다. 연속할인 전용 테스트는 NOT APPLICABLE.
