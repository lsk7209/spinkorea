# 근거 및 발견사항
확인일 2026-09-19T23:11:55.526020+09:00; commit cc03040ba8bbb79427547801744097c6b079d668; 운영 배포 SHA UNKNOWN.

E-HTTP = http-evidence.json (URL별 시각/리디렉션/허용된 헤더/본문·링크; 쿠키/전체 헤더 저장 안 함).
E-DOM = browser-results.json 및 browser-final.json. 새 Chromium 컨텍스트, 외부 요청 차단. random-choice-log의 초기 loading 캡처는 최종 캡처로 대체하며 장애 증거로 사용하지 않음.
E-LOCAL = browser-results.json / browser-followup.json / browser-final.json / percentage-zero.json / qr-decode.json / checks.log. 결과값은 로컬 소스 실행 증거이며 운영 동일 결과를 증명하지 않음.
E-SOURCE = 각 발견에 적힌 파일/행, 현재 commit 직접 읽기. 독립 내용 감사는 Spark 모델 unavailable 후 동일 범위를 Luna/max로 재시도하여 완료. 리더가 핵심 발췌와 HTTP를 대조.
E-PROVIDED = 사용자 제공 review prompt와 developer brief; 과거 판정은 현재 증거로 취급하지 않음.

## 공식 자료
- O-PRIVACY [ADSENSE-OFFICIAL] [Required content](https://support.google.com/adsense/answer/1348695?hl=en), 확인일 2026-09-19. Google 및 제3자 광고 쿠키, 이전 방문 기반 광고, 개인맞춤 광고 설정 해제 안내 항목. SPK-005 고지 대조.
- O-CMP [ADSENSE-OFFICIAL] [Google consent management requirements](https://support.google.com/adsense/answer/13554116?hl=en), 확인일 2026-09-19. EEA/UK/스위스 개인맞춤 광고의 인증 CMP/TCF 요건. 비개인맞춤이라는 이유만으로 모든 동의 의무 면제라고 판단하지 않음. 계정·국가 조건 미확인.
- O-CRAWLER [ADSENSE-OFFICIAL] [About the AdSense ads crawler](https://support.google.com/adsense/answer/99376?hl=en), 확인일 2026-09-19. Mediapartners-Google은 콘텐츠 판단; Google-Display-Ads-Bot은 사이트 추가 검증; 검색 크롤러와 별개. 직접 open 두 번 실패 후 공식 검색 색인 본문에서 확인, 실시간 원문 응답은 미확인.
- O-INVENTORY [ADSENSE-OFFICIAL] [Google-served ads on screens without publisher-content](https://support.google.com/publisherpolicies/answer/11112688?hl=en), 확인일 2026-09-19. 빈/저가치/오류 화면 광고 관련 정책. 실제 광고 표시 미검증이므로 코드 존재만으로 위반 확정하지 않음.
- O-PLACEMENT [ADSENSE-OFFICIAL] [Ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en), 확인일 2026-09-19. 실행/복사/다운로드와 광고 혼동 및 자동 새로고침 검토. 로컬 광고 차단이라 실제 배치는 미검증.
- O-NOINDEX [SEARCH-QUALITY] [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), 확인일 2026-09-19. 검색 색인 제어. 크롤러가 읽을 수 있어야 함; 광고 정책 면제 규정 아님.
- O-JS [SEARCH-QUALITY] [Understand JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), 확인일 2026-09-19. 최초 HTML와 렌더링된 DOM을 구분. 수집 차이를 곧 클로킹으로 확정하지 않음.
- O-NHLBI [EXPERT-INFERENCE] [How Sleep Works — Sleep Phases and Stages](https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep), 확인일 2026-09-19. 수면 단계는 계측으로 분류하며 주기는 변한다. 개인 기상 시각 처방의 근거가 아님.
- O-NIST [EXPERT-INFERENCE] [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html), 확인일 2026-09-19. 인증 시스템 지침. OTP는 phishing-resistant가 아니며 MFA가 모든 위협을 제거하지 않음. 생성기의 AdSense 필수조건으로 적용하지 않음.
- O-MDN [EXPERT-INFERENCE] [Crypto: getRandomValues()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues), 확인일 2026-09-19. 브라우저 난수 API. 생성/기록 절차 전체의 효능이나 계정 안전 보장의 근거 아님.

## 주요 발견 상세
### SPK-001 — JSON 큰 정수 무고지 변형
- 기존 진단 연결: A08
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/json-formatter
- 실제 확인 위치: src/pages/tools/JsonFormatter.tsx:24,43
- 관찰 사실/실제 결과: T03: {"id":9007199254740993} → {"id":9007199254740992}; 성공 알림, 정밀도 경고 없음.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 숫자를 보존하거나 변형 전에 명시적으로 거부/경고한다.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-LOCAL T03/T04-recheck
- 원인: JSON.parse가 Number로 변환한 뒤 JSON.stringify한다.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-LOCAL T03/T04-recheck; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 새 의존성 없이 우선 지원 한계를 표시하고 안전하지 않은 숫자 토큰을 변환 전에 식별하여 중단하는 최소안 설계. 문자열/지수/소수 오탐 방지 필요. 단순 숫자 정규식 전체 적용 금지.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 경계 정수의 무고지 변형 0건; 문법 오류는 원문을 유지하고 이전 출력의 무효 상태 표시.
- 회귀 테스트: MAX_SAFE_INTEGER 전후, 음수, 문자열 안 숫자, 지수, 정상/잘못된 쉼표, 복사.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.

### SPK-002 — 퍼센트 0분모에서 이전 결과 잔류 및 무한대 표시
- 기존 진단 연결: A08
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/percentage-calculator
- 실제 확인 위치: src/pages/tools/PercentageCalculator.tsx:29,36
- 관찰 사실/실제 결과: T15: 100→110 = +10% 후 기존 값을 0으로 바꿔도 +10% 유지. T16-corrected: 전체 0·일부 10 → ∞%.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 계산 불가 안내와 결과 무효화.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-LOCAL T15/T16-corrected
- 원인: 증감률 a===0 분기에 setRes3(null)이 없고 일부 비율 계산에는 0분모 검사가 없다.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-LOCAL T15/T16-corrected; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 두 분모 경로에서 유한성/0을 검사하고 이전 결과를 비운다.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 0/빈값/음수의 지원 정책 명시; NaN/Infinity/이전 성공 결과 잔류 없음.
- 회귀 테스트: 100→110→0, 전체0/일부10, 양수 정상, 빈값, 음수 정책.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.

### SPK-003 — 수면 글 산술 오류 두 건과 생리 효과 단정
- 기존 진단 연결: A02
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/sleep-optimization
- 실제 확인 위치: src/data/posts.tsx:4825,4830,4842; src/pages/tools/SleepCalculator.tsx:5,68
- 관찰 사실/실제 결과: 운영 HTTP: 7시간=90분×4+30분; 반감기6시간 가정인데 오후2시→자정 절반이라고 설명. 독립 검산은 390분=6.5시간, 2^(-10/6)=0.3149802625.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 단순 시간 계산과 실제 수면 단계·개인 대사를 구분한다.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-HTTP /blog/sleep-optimization; O-NHLBI
- 원인: 글의 산술/고정 주기 가정 오류. 계산기는 90분·입면15분 가정 및 개인차 안내가 이미 있다.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-HTTP /blog/sleep-optimization; O-NHLBI; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 두 식을 바로잡고 잘못된 기상시각 판정/효과 보장을 제거; 실제 계산기 가정과 연결.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 계산 일치, 모델 가정 표시, 개인 수면 처방/효과 보장 없음.
- 회귀 테스트: 독립 산술, 글↔수면 계산기/시간 계산기 링크 및 가정 비교.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 현재 본문 오류 Confirmed. 의료 처방 적합성·카페인 개인별 반감기는 판단하지 않음; 거절 인과 Unknown.

### SPK-004 — 비밀번호 글의 공격 조건 없는 해독 시간·MFA 안전 보장
- 기존 진단 연결: A03
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/password-strength
- 실제 확인 위치: src/data/posts.tsx:4423,4520; src/pages/tools/PasswordGenerator.tsx:35,42,103
- 관찰 사실/실제 결과: 운영 본문에 3시간·수백 년·수천 년 표 및 “2FA가 있으면 안전합니다”. 실제 생성기 안내는 계정 보장을 부인하고 Crypto API를 사용한다.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 예시 문자열 재사용 금지, 공격 환경·MFA 한계 구분.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-HTTP /blog/password-strength; E-LOCAL T12-final; O-NIST
- 원인: 오래된 보안 글과 현재 도구 안내가 불일치.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-HTTP /blog/password-strength; E-LOCAL T12-final; O-NIST; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 근거 없는 해독 시간 표를 제거/조건부 설명으로 교체하고 MFA를 위험 감소로 제한.
- 보존/수정 금지: Crypto API·로컬 생성·미지원시 오류를 보존. 선택 문자군은 pool이며 모든 문자군 반드시 포함 보장은 현재 명시되지 않음. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 무조건적 안전 보장 0건; 게시된 예시를 실제 비밀번호로 권하지 않음.
- 회귀 테스트: 본문/FAQ/생성기 안내 비교. 4/50자 및 마지막 문자군 유지 테스트 보존.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: Uint32 % charset.length의 작은 modulo bias는 정적 확인(P2 개선); 짧은 표본으로 보안 인증하지 않음. NIST 인증시스템 기준을 생성기의 광고 필수 규정으로 전용하지 않음.

### SPK-005 — 광고 개인정보 고지의 이전 방문 기반 설명·설정 링크 부족
- 기존 진단 연결: A06
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/privacy/
- 실제 확인 위치: src/pages/PrivacyPolicy.tsx:53,65; scripts/generate-assets.mjs:423
- 관찰 사실/실제 결과: 운영 DOM은 Google/쿠키와 개인 맞춤 설정을 언급하나 이전 사이트 방문을 활용하는 광고 설명 및 광고 설정 해제의 실제 링크가 없다. 최초 HTML에는 개인맞춤 설정 안내도 누락.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 실제 공급업체/이전 방문 기반 광고/설정 해제 안내를 제공한다.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-HTTP /privacy/; E-DOM /privacy/; O-PRIVACY
- 원인: 독립 정적 본문과 React 개인정보 문서 모두 공식 고지 항목을 완전히 담지 못한다.
- 분류: [ADSENSE-OFFICIAL]; AdSense 직접성: Direct; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-HTTP /privacy/; E-DOM /privacy/; O-PRIVACY; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 현재 광고 설정/업체 범위를 확인하고 공식 필수 고지와 실제 설정 링크를 양쪽 본문에 일치시킨다.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 공식 항목 대조 완료, 링크 작동, 입력 처리와 방문 통계 처리를 분리.
- 회귀 테스트: JS 전/후 개인정보 표시, 링크, 실제 설정별 CMP/지역 표본은 별도 검증.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 고지 누락은 Confirmed. 광고 실제 노출·EEA/UK/스위스 유입·CMP 설정·법률 적합성·거절 원인은 미확인. P0로 확대하지 않음.

### SPK-006 — 복사 거부에도 성공 알림
- 기존 진단 연결: A08
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/text-counter
- 실제 확인 위치: src/pages/tools/TextCounter.tsx:24; src/pages/tools/JsonFormatter.tsx:56; src/pages/tools/PasswordGenerator.tsx:66; src/pages/tools/RandomTeam.tsx:49
- 관찰 사실/실제 결과: T02: clipboard.writeText가 NotAllowedError로 거절돼도 “텍스트가 복사되었습니다.”; pageerror 동반. 다른 세 도구에도 미대기 패턴 확인.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 실제 Promise 성공/실패에 맞는 안내.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-LOCAL T02/T17
- 원인: writeText 완료를 기다리지 않고 즉시 toast.success.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P2
- 공식/원자료: E-LOCAL T02/T17; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 각 기존 handler에 await/try-catch 적용; 실제 성공만 성공 처리.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 거부/미지원/실패 성공 알림 0건; 원문 유지.
- 회귀 테스트: 허용/거부/미지원, 반복 복사, 키보드·모바일; 현재 성공 경로 테스트는 mock임.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 런타임 재현 1도구; 나머지 3도구는 정적 패턴만 확인. OS 실제 clipboard 복사는 미실행.

### SPK-007 — 0% 대출 입력에서 이유 없이 결과 사라짐
- 기존 진단 연결: A08
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/loan-calculator
- 실제 확인 위치: src/pages/tools/LoanCalculator.tsx:15,19
- 관찰 사실/실제 결과: T05: 원금120만원/금리0/12개월 입력 시 “위 항목을 모두 입력하면…”만 표시. T06 양수 금리는 정상.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 지원하면 월10만원/이자0; 미지원이면 0% 미지원 안내.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-LOCAL T05/T06/T07
- 원인: r<=0을 빈 입력과 함께 null 처리.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-LOCAL T05/T06/T07; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 0%를 P/n·총이자0으로 분리하거나 명시적인 지원 범위 안내.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 0% 결과/명시적 거부 중 선택한 계약 충족; 빈 값과 0 구분; 소수 개월의 조용한 truncation 방지 검토.
- 회귀 테스트: 0%, 12%, 빈값, 0/음수/소수 기간, 두 상환 방식.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 0% 지원 계약이 명시적이지 않아 “계산식 오답”이 아니라 미지원/입력 안내 결함으로 판정.

### SPK-008 — 글자수의 UTF-16 정의·플랫폼 대응 범위 미표시
- 기존 진단 연결: A05,A08
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/text-counter
- 실제 확인 위치: src/pages/tools/TextCounter.tsx:10,11,39,49
- 관찰 사실/실제 결과: A 한😀 → 공백포함5/제외4/UTF8 9B. 코드포인트는4/3. UTF-16 또는 grapheme 정의는 화면에 없고 네이버/자소서 대응을 포괄적으로 표현.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 어떤 정의를 세는지 명시하고 플랫폼별 동일성은 검증된 범위만 표현.
- 증거 유형·Evidence: SOURCE_CODE 및 LOCAL_TEST; Confirmed; E-LOCAL T01; E-DOM /tools/text-counter
- 원인: text.length와 whitespace 제거 길이를 일반 글자수로 라벨링.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P2
- 공식/원자료: E-LOCAL T01; E-DOM /tools/text-counter; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 기존 UTF-16 동작을 보존하면서 라벨/설명/예시를 명확히; 코드포인트 추가는 별도 선택.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: A 한😀, 결합 악센트, ZWJ 이모지, 줄바꿈 정의와 결과 일치.
- 회귀 테스트: 빈값0; UTF8 9; code unit/codepoint/grapheme 구분; 제출처별 기준 미검증 표기.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.

### SPK-009 — 정적 셸과 React 안내·관련 링크 불일치
- 기존 진단 연결: A05,A10,A11,A12
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/tools/text-counter; https://spinkorea.kr/contact; https://spinkorea.kr/privacy/; https://spinkorea.kr/tools
- 실제 확인 위치: scripts/generate-assets.mjs:177,415,770; src/pages/tools/TextCounter.tsx:62; src/components/ToolLayout.tsx:297
- 관찰 사실/실제 결과: 정적 tools에 AdSense 검토자 문장; DOM에는 없음. 정적 contact에는 문의 링크 없음; DOM에는 GitHub Issues. 정적 text-counter의 관련부는 첫6 sitePages, DOM은 대소문자/Lorem/JSON.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 핵심 안내와 목적에 맞는 링크가 초기 HTML·DOM에서 의미상 일치.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-HTTP; E-DOM; E-SOURCE
- 원인: 독립 생성기 renderShell의 sitePages.filter(...).slice(0,6)와 별도 trustPageBodies/approvalBodies. 전역 React 배열 버그가 아님.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-HTTP; E-DOM; E-SOURCE; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 생성기의 해당 안내/관련 링크를 실제 페이지 계약과 맞추고 심사자 목적 문장만 제거.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 3대상 문의/개인정보/정의·관련 링크 일치; tools 심사자 문장 없음.
- 회귀 테스트: 초기 HTML와 JS DOM 비교, canonical/robots/FAQ 정합, 자기/중복/미존재 링크.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 의미 차이는 Confirmed. 클로킹·렌더링 장애·캐시 원인은 확정하지 않음. 검색 스니펫 최신성은 미검증.

### SPK-010 — 랜덤 기록 글 템플릿 조사 오류·실행 양식 부족
- 기존 진단 연결: A01,A04
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/random-choice-log
- 실제 확인 위치: src/data/content-plan.generated.json:1247; src/data/generatedContent.tsx:305,314; src/data/postMetadata.ts:21; src/pages/BlogPost.tsx:293
- 관찰 사실/실제 결과: HTTP 및 완전히 로드된 DOM에 참가자 목록와/확률 설정를/결과 기록가 재현. HTTP200/noindex,follow, 허브/사이트맵 제외.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 직접 이용할 기록 양식/가상 작성 예시가 있고 자연스러운 문장.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-HTTP /blog/random-choice-log; E-DOM browser-final.json
- 원인: body 없는 생성 항목이 공통 템플릿으로 렌더링; generated source의 검색 제외는 의도적.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P1
- 공식/원자료: E-HTTP /blog/random-choice-log; E-DOM browser-final.json; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 해당 글을 기존 기능만 사용하는 기록 양식+가상예시로 재작성하는 설계. 공통 템플릿 조사의 영향은 별도 표본 조사.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 한 번의 가상 추첨 기록을 완성할 수 있음; 자동 기록기/가중치 등 없는 기능을 있는 것처럼 설명하지 않음.
- 회귀 테스트: 변수 조사 조합, 기존 라우트/noindex 보존, 명시적 목록 승인은 별도.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 공통 렌더러 사용 전체601개를 동일 저품질로 판정하지 않음; 심층 템플릿 표본은1개. noindex는 광고 정책 제외 장치가 아님.

### SPK-011 — Yes/No 글 간 고위험 결정 권장 충돌
- 기존 진단 연결: A09
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/yes-no-oracle-guide; https://spinkorea.kr/blog/yes-no-reversible-choice
- 실제 확인 위치: src/data/posts.tsx:3095,3130; src/data/content-plan.generated.json:27750
- 관찰 사실/실제 결과: 기존 글은 이직/이사/관계 등의 랜덤 결정을 권장; 새 글은 저위험·되돌릴 수 있는 행동으로 제한.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 위험 결정 범위가 도구·글·약관에서 일치.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-SOURCE; E-HTTP
- 원인: 글별 편집 기준 차이.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P2
- 공식/원자료: E-SOURCE; E-HTTP; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 기존 글의 사례를 저위험 선택으로 한정하고 인용 연구의 범위를 확인.
- 보존/수정 금지: yes-no-reversible-choice의 제외 기준과 기록 절차 보존. 유입 자료 없이 URL 통합하지 않음. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 의료/금융/계약/안전 판단을 랜덤에 위임하는 권장 없음.
- 회귀 테스트: 두 글·도구·약관 비교, 기존 정상 링크 보존.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.

### SPK-012 — 비공개 문의가 필요한 사용자도 공개 Issues로 유도
- 기존 진단 연결: A11
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/contact
- 실제 확인 위치: src/pages/Contact.tsx:76,81,90
- 관찰 사실/실제 결과: 운영 DOM에서 개인정보/제휴처럼 공개하기 어려운 내용도 현재 GitHub Issues로 접수한다고 안내. 링크는 별도 HTTP200 확인.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 민감 내용 게시를 예방하고 검증된 비공개 경로가 있으면 연결.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Confirmed; E-DOM /contact; contact-link.json
- 원인: 별도 비공개 연락 경로 없이 공개 이슈만 제공.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P2
- 공식/원자료: E-DOM /contact; contact-link.json; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 비공개 수신 채널 존재를 운영자가 확인한 뒤 연결; 그 전에는 개인정보/비밀번호 게시 금지 명시. 이메일을 만들어 쓰지 않음.
- 보존/수정 금지: 정상 입력 결과와 기존 URL을 보존한다. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 공개 문제 제보 링크는 유지; 민감정보 공개 유도 제거; 승인된 환경에서만 수신 확인.
- 회귀 테스트: 링크 정상, 비공개 안내, 로그인 필요 여부/수신 검증은 별도.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 실제 개인정보 게시/유출은 관찰하지 않음. 문의 불가라는 기존 단정은 반증; 실제 답변 수신은 NOT RUN.

### SPK-013 — CSS 기본 글 검색 의도 겹침
- 기존 진단 연결: A09
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/css-shadow-design; https://spinkorea.kr/blog/css-shadow-guide; https://spinkorea.kr/blog/css-shadow-states
- 실제 확인 위치: src/data/posts.tsx:2416,5202; src/data/content-plan.generated.json:28038
- 관찰 사실/실제 결과: 두 기본 글의 box-shadow 매개변수·생성기 설명이 겹침. 상태/포커스/접근성 글은 별도 실무 목적.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 고유 예시와 다른 사용자 작업이 분명해야 함.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Strong; E-SOURCE; E-HTTP
- 원인: 편집 범위가 인접. 정량 중복률/유입 잠식은 미측정.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: P2
- 공식/원자료: E-SOURCE; E-HTTP; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: MERGE REVIEW만 제안; 의도/예시 비교 후 GSC 유입·링크를 확보할 때 대표 URL 결정.
- 보존/수정 금지: css-shadow-states KEEP. 연령·글 길이를 삭제 근거로 쓰지 않음. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 고유 정보 손실 없음; 동등 목적지가 있을 때만 개별 승인으로 통합.
- 회귀 테스트: 고유 예시 보존, 내부 링크/1단계 redirect는 향후 승인된 변경에만 검사.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.

### SPK-014 — 추가 건강·AI 글의 수치/대상/기준 출처 검증 필요
- 기존 진단 연결: NEW
- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, 2026-09-19T23:11:55.526020+09:00; commit 위 참조, 운영 SHA UNKNOWN.
- 대상 URL: https://spinkorea.kr/blog/exercise-brain; https://spinkorea.kr/blog/bmi-limitations; https://spinkorea.kr/blog/ai-era-skills
- 실제 확인 위치: src/data/posts.tsx:5011,4593,6355
- 관찰 사실/실제 결과: 운동 기억력40% 등 수치, BMI 범위·인종 서술, AI가 할 수 없다는 단정 확인. 해당 연구·적용 집단·시점의 원자료 검증은 미실행.
- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.
- 기대 동작: 숫자·대상·기준일을 추적 가능한 원자료와 연결.
- 증거 유형·Evidence: SOURCE_CODE 및 LIVE_HTTP/LIVE_DOM; Unknown; E-SOURCE; E-HTTP
- 원인: 원자료 적용 범위는 Unknown; 인용 부정확성 자체를 확정하지 않음.
- 분류: [EXPERT-INFERENCE]; AdSense 직접성: Indirect; 거절 인과: Unknown.
- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.
- 심각도: Verification Required
- 공식/원자료: E-SOURCE; E-HTTP; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.
- 최소 변경 수정안: 출처 원문과 숫자/집단/조건을 대조하고 근거 없는 단정만 제한.
- 보존/수정 금지: BMI 한계 설명 및 boundaries-relationship의 구체적 대화 예시 보존. 이번 감사에서는 수정하지 않음.
- Acceptance Criteria: 각 주장에 근거/적용범위 또는 검증 필요 표시.
- 회귀 테스트: 실제 BMI/시급 도구 최신 기준·국가·대상은 별도 공식 검증.
- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.
- 남은 불확실성: 운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.
