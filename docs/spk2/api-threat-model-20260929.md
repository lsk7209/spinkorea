# SPK2-13 / SPK2-14 — 공개 API 위협 모델과 데이터 흐름 (명세 전용)

작성: 2026-09-29 KST · 기준 SHA `95ff1b9` · 브랜치 `fix/spk2-reliability-batch`

> 이 문서는 **명세와 모의(mock) 검증 결과**다. 운영 API·DB·WAF·CORS·인증 정책은 변경하지 않았고, 운영 POST도 보내지 않았다. 아래 "GAP"은 소스와 모의 실행으로 확인한 검증 공백이며, **실제 침해·악용·유출이 확인됐다는 뜻이 아니다.**

## 1. 확인 범위

| 항목 | 결과 |
|---|---|
| 호출자 탐색 | `src/` 전체에서 `/api/shorten`, `/api/stats` 호출 코드 없음 (grep). 현재 프런트엔드는 두 API를 쓰지 않는다. |
| 리디렉션 | `vercel.json`의 `/s/:id` → `api/s/[id].ts` rewrite 존재. |
| 모의 실행 | `npm run test:api-harness` — `@libsql/client`를 `mock.module`로 대체, 네트워크·DB 없음. 10/10 통과(현재 동작 고정). |
| 미확인 | 운영 환경변수(TURSO_*), 실제 DB 스키마·데이터, Vercel WAF/Firewall·rate limit 설정, 외부 호출 이력. |

## 2. 모의 검증으로 고정한 현재 동작

| ID | 대상 | 관측 | 영향(가설) |
|---|---|---|---|
| GAP-1 | shorten, stats | `req.body`가 `null`이면 구조 분해에서 `TypeError`가 try 밖에서 발생 → 플랫폼 500 | 오류 응답 계약 불명확, 로그 소음 |
| GAP-2 (PROBE-06) | shorten | `mailto:`, `javascript:`, 외부 호스트 URL이 400 없이 저장됨 | `/s/:id`가 임의 URL로 리디렉션하는 오픈 리디렉터가 될 수 있음 |
| GAP-3 | shorten | `Access-Control-Allow-Origin: *`, 인증·rate limit 코드 없음 | 제3자 사이트에서 단축 링크 대량 생성 가능성 |
| GAP-4 | stats | DB 미설정 시 `{success:true}` 반환 | 저장되지 않았는데 성공처럼 보임 |
| GAP-5 (PROBE-07/08) | stats | `itemsCount=1.5`, 10,001자 `result` 원문이 DB로 전달 | 사용자 입력 원문 저장(개인정보 최소화 원칙과 충돌 가능), 저장 용량 |

정상 거부가 확인된 경로: 비 POST 405, shorten DB 미설정 503, 누락·비문자열·4,096자 초과·파싱 불가 URL 400, stats 타입 오류·0 이하 400 — 모두 DB 호출 0회.

## 3. 승인 후 적용할 권장 계약 (미적용)

1. **API 용도 결정 먼저.** 프런트엔드 호출자가 없으므로 (a) 엔드포인트 비활성화, (b) 내부 공유 전용으로 축소 중 하나를 운영자가 결정한다. 결정 전 임의 폐쇄 금지.
2. **shorten 허용 목록:** `protocol === 'https:'`, `hostname === 'spinkorea.kr'`, 포트·자격증명 없음, 경로는 공개 라우트 목록 내, 쿼리는 `s`만 허용. 응답 URL은 `req.headers.host`가 아닌 고정 정규 origin으로 생성.
3. **본문 검증:** `typeof req.body === 'object' && req.body !== null && !Array.isArray(req.body)`를 먼저 확인하고 400 반환. 전체 본문 크기 상한.
4. **stats 최소화:** `result` 원문을 저장하지 않는다(필요하면 길이 버킷·항목 수 정수만). `Number.isInteger(itemsCount) && 1 <= itemsCount <= 100`.
5. **응답 계약:** DB 미설정 시 `503 {stored:false}` 또는 `202 {stored:false}`로 성공과 구분.
6. **남용 방지:** CORS는 인증 수단이 아니다. rate limit은 서버리스 분산 환경을 고려해 Vercel Firewall/WAF 또는 외부 저장소 기반으로 설계한다(프로세스 메모리 카운터로 해결됐다고 보고하지 않음).
7. **로그:** 예외 로그에 URL·본문·토큰을 남기지 않는다.

승인 후 검증 기준: 실패 요청의 DB write 0회, 기존 허용 링크 호환, 위 하네스의 GAP 테스트를 "거부" 기대값으로 뒤집어 통과.

## 4. SPK2-14 데이터 흐름 표 (소스 기준)

| 흐름 | 무엇이 | 어디로 | 근거 파일 | 비고 |
|---|---|---|---|---|
| 도구 계산·추첨 | 입력 후보, 결과 | 브라우저 메모리 | `src/hooks/use-roulette.ts`, 각 도구 | 서버 전송 코드 없음 |
| 기기 저장 | 최근 후보, 최근 결과(5분), 기록 10개 | localStorage `spinflow:*` | `use-state-persistence.ts` | 사용자가 브라우저에서 삭제 가능 |
| 명시적 공유 | 후보 목록(결과 제외) | URL `?s=` (lz-string 압축, 암호화 아님) | `url-state.ts`, `ShareButtons.tsx` | 링크를 받는 사람·중간 서비스가 후보를 볼 수 있음 |
| 방문 분석 | 이벤트명, `tool_id`, `tool_path`(쿼리 제외), 항목 수, 배치 | GA4 (`react-ga4`) | `src/utils/analytics.ts` | `items/result/text/password/s/state/query` 키는 전송 전 제거(테스트) |
| 광고 | 페이지 요청·쿠키 등 광고 사업자 처리 | AdSense 스크립트 (`index.html`) | `index.html` | 동의·CMP·지역 설정은 **미확인** |
| 서버 API | (현재 호출자 없음) | Turso/libSQL | `api/*.ts` | 위 GAP 참조 |

정책 문구 점검 원칙: "입력값은 브라우저에서 처리"는 계산 흐름에 한해 사실이다. "완전 익명", "어떤 데이터도 전송하지 않음" 같은 표현은 분석·광고 흐름 때문에 사용하지 않는다. CMP/동의 설정 변경은 별도 승인 작업이다.

## 5. 적용 결과 (2026-09-29 19:40 KST, 브랜치 코드 — 배포 전)

운영자 위임("알아서 진행")에 따라 3절 권장 계약 중 코드로 가능한 부분을 적용했다. **배포 전까지 운영 동작은 바뀌지 않는다.**

| GAP | 조치 | 테스트 |
|---|---|---|
| GAP-1 | 두 API 모두 본문을 객체로 먼저 확인, null/배열/문자열 본문은 400 | api-contract |
| GAP-2 | shorten: https://spinkorea.kr만, 자격증명·포트·hash·// 경로 거부, 쿼리는 s만. /s/:id도 리디렉션 직전 같은 규칙으로 재검증(기존 행 방어), 301→302 | api-contract |
| GAP-3 | CORS * → https://spinkorea.kr. 응답 shortUrl은 Host 헤더가 아닌 고정 origin | api-contract |
| GAP-4 | stats DB 미설정 시 503 {stored:false} | api-contract |
| GAP-5 | stats: itemsCount 정수 1–100, esult 1–50자 검증 후 **원문은 저장하지 않고 빈 문자열 저장**(스키마 변경 없음) | api-contract |

남은 항목(승인·인프라 필요): rate limit(Vercel Firewall 등), 기존 DB 행 정리, 엔드포인트 폐쇄 여부 결정. 현재 프런트엔드 호출자가 없으므로 이번 변경으로 깨지는 사용자 기능은 없다.