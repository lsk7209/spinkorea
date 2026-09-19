from pathlib import Path
import json,csv,datetime,collections,re,urllib.robotparser
P=Path(__file__).parent; ROOT=P.resolve().parents[3]; now=datetime.datetime.now().astimezone().isoformat()
http=json.loads((P/'http-evidence.json').read_text(encoding='utf8')); by={x['url']:x for x in http}
br=json.loads((P/'browser-results.json').read_text(encoding='utf8'))
follow=json.loads((P/'browser-followup.json').read_text(encoding='utf8')); final=json.loads((P/'browser-final.json').read_text(encoding='utf8'))
rawtests=br['results']+follow['results']+final['results']+json.loads((P/'percentage-zero.json').read_text(encoding='utf8'))['results']
rows=list(csv.DictReader((P/'url_inventory.csv').open(encoding='utf-8-sig')));cols=list(rows[0])
robot=urllib.robotparser.RobotFileParser();robot.parse(by['https://spinkorea.kr/robots.txt']['text'].splitlines())
dom={x['id'][4:]:x['actual'] for x in br['results'] if x['id'].startswith('LIVE/')}
for x in rows:
 if urllib.parse.urlsplit(x['url']).netloc=='spinkorea.kr':x['robots_access']='ROBOTS_RULE_ALLOW' if robot.can_fetch('Googlebot',x['url']) else 'ROBOTS_RULE_DISALLOW'
 if x['url'].replace('https://spinkorea.kr','') in dom:x['rendered_content_status']='LIVE_DOM_OBSERVED_THIRD_PARTIES_BLOCKED'
 if x['url'].split('#')[0] in by:x['notes']='HTTP observation applies to fetched URL only; fragment variants retained; deployment SHA UNKNOWN'
 if x['http_status']=='UNKNOWN':x['notes']='Candidate only: source/future/stale-build/link evidence is not proof of public availability'
 if '/blog/random-choice-log' in x['url']:x['proposed_action']='IMPROVE';x['notes']='Generated route intentionally noindex/list-excluded; direct 200 is not a draft leak'
for x in rows:
 if x['incoming_internal_links_in_sample']=='UNKNOWN':continue
 # Preserve original discovery counts; this is a sample, not a global backlink count.
with (P/'url_inventory.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(rows)
F=[]
def finding(i,title,prior,url,loc,fact,expected,cause,fix,ac,test,priority='P1',direct='Indirect',evidence='Confirmed',kind='EXPERT-INFERENCE',ref='E-LOCAL',preserve='정상 입력 결과와 기존 URL을 보존한다.',uncertainty='운영 기능 실행 및 배포 SHA는 미확인. AdSense 거절 인과는 Unknown.'):
 F.append(dict(id=f'SPK-{i:03}',title=title,prior=prior,url=url,loc=loc,fact=fact,expected=expected,cause=cause,fix=fix,ac=ac,test=test,priority=priority,direct=direct,evidence=evidence,kind=kind,ref=ref,preserve=preserve,uncertainty=uncertainty))
finding(1,'JSON 큰 정수 무고지 변형','A08','/tools/json-formatter','src/pages/tools/JsonFormatter.tsx:24,43','T03: {"id":9007199254740993} → {"id":9007199254740992}; 성공 알림, 정밀도 경고 없음.','숫자를 보존하거나 변형 전에 명시적으로 거부/경고한다.','JSON.parse가 Number로 변환한 뒤 JSON.stringify한다.','새 의존성 없이 우선 지원 한계를 표시하고 안전하지 않은 숫자 토큰을 변환 전에 식별하여 중단하는 최소안 설계. 문자열/지수/소수 오탐 방지 필요. 단순 숫자 정규식 전체 적용 금지.','경계 정수의 무고지 변형 0건; 문법 오류는 원문을 유지하고 이전 출력의 무효 상태 표시.','MAX_SAFE_INTEGER 전후, 음수, 문자열 안 숫자, 지수, 정상/잘못된 쉼표, 복사.',ref='E-LOCAL T03/T04-recheck')
finding(2,'퍼센트 0분모에서 이전 결과 잔류 및 무한대 표시','A08','/tools/percentage-calculator','src/pages/tools/PercentageCalculator.tsx:29,36','T15: 100→110 = +10% 후 기존 값을 0으로 바꿔도 +10% 유지. T16-corrected: 전체 0·일부 10 → ∞%.','계산 불가 안내와 결과 무효화.','증감률 a===0 분기에 setRes3(null)이 없고 일부 비율 계산에는 0분모 검사가 없다.','두 분모 경로에서 유한성/0을 검사하고 이전 결과를 비운다.','0/빈값/음수의 지원 정책 명시; NaN/Infinity/이전 성공 결과 잔류 없음.','100→110→0, 전체0/일부10, 양수 정상, 빈값, 음수 정책.',ref='E-LOCAL T15/T16-corrected')
finding(3,'수면 글 산술 오류 두 건과 생리 효과 단정','A02','/blog/sleep-optimization','src/data/posts.tsx:4825,4830,4842; src/pages/tools/SleepCalculator.tsx:5,68','운영 HTTP: 7시간=90분×4+30분; 반감기6시간 가정인데 오후2시→자정 절반이라고 설명. 독립 검산은 390분=6.5시간, 2^(-10/6)=0.3149802625.','단순 시간 계산과 실제 수면 단계·개인 대사를 구분한다.','글의 산술/고정 주기 가정 오류. 계산기는 90분·입면15분 가정 및 개인차 안내가 이미 있다.','두 식을 바로잡고 잘못된 기상시각 판정/효과 보장을 제거; 실제 계산기 가정과 연결.','계산 일치, 모델 가정 표시, 개인 수면 처방/효과 보장 없음.','독립 산술, 글↔수면 계산기/시간 계산기 링크 및 가정 비교.',ref='E-HTTP /blog/sleep-optimization; O-NHLBI',uncertainty='현재 본문 오류 Confirmed. 의료 처방 적합성·카페인 개인별 반감기는 판단하지 않음; 거절 인과 Unknown.')
finding(4,'비밀번호 글의 공격 조건 없는 해독 시간·MFA 안전 보장','A03','/blog/password-strength','src/data/posts.tsx:4423,4520; src/pages/tools/PasswordGenerator.tsx:35,42,103','운영 본문에 3시간·수백 년·수천 년 표 및 “2FA가 있으면 안전합니다”. 실제 생성기 안내는 계정 보장을 부인하고 Crypto API를 사용한다.','예시 문자열 재사용 금지, 공격 환경·MFA 한계 구분.','오래된 보안 글과 현재 도구 안내가 불일치.','근거 없는 해독 시간 표를 제거/조건부 설명으로 교체하고 MFA를 위험 감소로 제한.','무조건적 안전 보장 0건; 게시된 예시를 실제 비밀번호로 권하지 않음.','본문/FAQ/생성기 안내 비교. 4/50자 및 마지막 문자군 유지 테스트 보존.',ref='E-HTTP /blog/password-strength; E-LOCAL T12-final; O-NIST',preserve='Crypto API·로컬 생성·미지원시 오류를 보존. 선택 문자군은 pool이며 모든 문자군 반드시 포함 보장은 현재 명시되지 않음.',uncertainty='Uint32 % charset.length의 작은 modulo bias는 정적 확인(P2 개선); 짧은 표본으로 보안 인증하지 않음. NIST 인증시스템 기준을 생성기의 광고 필수 규정으로 전용하지 않음.')
finding(5,'광고 개인정보 고지의 이전 방문 기반 설명·설정 링크 부족','A06','/privacy/','src/pages/PrivacyPolicy.tsx:53,65; scripts/generate-assets.mjs:423','운영 DOM은 Google/쿠키와 개인 맞춤 설정을 언급하나 이전 사이트 방문을 활용하는 광고 설명 및 광고 설정 해제의 실제 링크가 없다. 최초 HTML에는 개인맞춤 설정 안내도 누락.','실제 공급업체/이전 방문 기반 광고/설정 해제 안내를 제공한다.','독립 정적 본문과 React 개인정보 문서 모두 공식 고지 항목을 완전히 담지 못한다.','현재 광고 설정/업체 범위를 확인하고 공식 필수 고지와 실제 설정 링크를 양쪽 본문에 일치시킨다.','공식 항목 대조 완료, 링크 작동, 입력 처리와 방문 통계 처리를 분리.','JS 전/후 개인정보 표시, 링크, 실제 설정별 CMP/지역 표본은 별도 검증.',direct='Direct',kind='ADSENSE-OFFICIAL',ref='E-HTTP /privacy/; E-DOM /privacy/; O-PRIVACY',uncertainty='고지 누락은 Confirmed. 광고 실제 노출·EEA/UK/스위스 유입·CMP 설정·법률 적합성·거절 원인은 미확인. P0로 확대하지 않음.')
finding(6,'복사 거부에도 성공 알림','A08','/tools/text-counter','src/pages/tools/TextCounter.tsx:24; src/pages/tools/JsonFormatter.tsx:56; src/pages/tools/PasswordGenerator.tsx:66; src/pages/tools/RandomTeam.tsx:49','T02: clipboard.writeText가 NotAllowedError로 거절돼도 “텍스트가 복사되었습니다.”; pageerror 동반. 다른 세 도구에도 미대기 패턴 확인.','실제 Promise 성공/실패에 맞는 안내.','writeText 완료를 기다리지 않고 즉시 toast.success.','각 기존 handler에 await/try-catch 적용; 실제 성공만 성공 처리.','거부/미지원/실패 성공 알림 0건; 원문 유지.','허용/거부/미지원, 반복 복사, 키보드·모바일; 현재 성공 경로 테스트는 mock임.',priority='P2',ref='E-LOCAL T02/T17',uncertainty='런타임 재현 1도구; 나머지 3도구는 정적 패턴만 확인. OS 실제 clipboard 복사는 미실행.')
finding(7,'0% 대출 입력에서 이유 없이 결과 사라짐','A08','/tools/loan-calculator','src/pages/tools/LoanCalculator.tsx:15,19','T05: 원금120만원/금리0/12개월 입력 시 “위 항목을 모두 입력하면…”만 표시. T06 양수 금리는 정상.','지원하면 월10만원/이자0; 미지원이면 0% 미지원 안내.','r<=0을 빈 입력과 함께 null 처리.','0%를 P/n·총이자0으로 분리하거나 명시적인 지원 범위 안내.','0% 결과/명시적 거부 중 선택한 계약 충족; 빈 값과 0 구분; 소수 개월의 조용한 truncation 방지 검토.','0%, 12%, 빈값, 0/음수/소수 기간, 두 상환 방식.',ref='E-LOCAL T05/T06/T07',uncertainty='0% 지원 계약이 명시적이지 않아 “계산식 오답”이 아니라 미지원/입력 안내 결함으로 판정.')
finding(8,'글자수의 UTF-16 정의·플랫폼 대응 범위 미표시','A05,A08','/tools/text-counter','src/pages/tools/TextCounter.tsx:10,11,39,49','A 한😀 → 공백포함5/제외4/UTF8 9B. 코드포인트는4/3. UTF-16 또는 grapheme 정의는 화면에 없고 네이버/자소서 대응을 포괄적으로 표현.','어떤 정의를 세는지 명시하고 플랫폼별 동일성은 검증된 범위만 표현.','text.length와 whitespace 제거 길이를 일반 글자수로 라벨링.','기존 UTF-16 동작을 보존하면서 라벨/설명/예시를 명확히; 코드포인트 추가는 별도 선택.','A 한😀, 결합 악센트, ZWJ 이모지, 줄바꿈 정의와 결과 일치.','빈값0; UTF8 9; code unit/codepoint/grapheme 구분; 제출처별 기준 미검증 표기.',priority='P2',ref='E-LOCAL T01; E-DOM /tools/text-counter')
finding(9,'정적 셸과 React 안내·관련 링크 불일치','A05,A10,A11,A12','/tools/text-counter; /contact; /privacy/; /tools','scripts/generate-assets.mjs:177,415,770; src/pages/tools/TextCounter.tsx:62; src/components/ToolLayout.tsx:297','정적 tools에 AdSense 검토자 문장; DOM에는 없음. 정적 contact에는 문의 링크 없음; DOM에는 GitHub Issues. 정적 text-counter의 관련부는 첫6 sitePages, DOM은 대소문자/Lorem/JSON.','핵심 안내와 목적에 맞는 링크가 초기 HTML·DOM에서 의미상 일치.','독립 생성기 renderShell의 sitePages.filter(...).slice(0,6)와 별도 trustPageBodies/approvalBodies. 전역 React 배열 버그가 아님.','생성기의 해당 안내/관련 링크를 실제 페이지 계약과 맞추고 심사자 목적 문장만 제거.','3대상 문의/개인정보/정의·관련 링크 일치; tools 심사자 문장 없음.','초기 HTML와 JS DOM 비교, canonical/robots/FAQ 정합, 자기/중복/미존재 링크.',priority='P1',ref='E-HTTP; E-DOM; E-SOURCE',uncertainty='의미 차이는 Confirmed. 클로킹·렌더링 장애·캐시 원인은 확정하지 않음. 검색 스니펫 최신성은 미검증.')
finding(10,'랜덤 기록 글 템플릿 조사 오류·실행 양식 부족','A01,A04','/blog/random-choice-log','src/data/content-plan.generated.json:1247; src/data/generatedContent.tsx:305,314; src/data/postMetadata.ts:21; src/pages/BlogPost.tsx:293','HTTP 및 완전히 로드된 DOM에 참가자 목록와/확률 설정를/결과 기록가 재현. HTTP200/noindex,follow, 허브/사이트맵 제외.','직접 이용할 기록 양식/가상 작성 예시가 있고 자연스러운 문장.','body 없는 생성 항목이 공통 템플릿으로 렌더링; generated source의 검색 제외는 의도적.','해당 글을 기존 기능만 사용하는 기록 양식+가상예시로 재작성하는 설계. 공통 템플릿 조사의 영향은 별도 표본 조사.','한 번의 가상 추첨 기록을 완성할 수 있음; 자동 기록기/가중치 등 없는 기능을 있는 것처럼 설명하지 않음.','변수 조사 조합, 기존 라우트/noindex 보존, 명시적 목록 승인은 별도.',ref='E-HTTP /blog/random-choice-log; E-DOM browser-final.json',uncertainty='공통 렌더러 사용 전체601개를 동일 저품질로 판정하지 않음; 심층 템플릿 표본은1개. noindex는 광고 정책 제외 장치가 아님.')
finding(11,'Yes/No 글 간 고위험 결정 권장 충돌','A09','/blog/yes-no-oracle-guide; /blog/yes-no-reversible-choice','src/data/posts.tsx:3095,3130; src/data/content-plan.generated.json:27750','기존 글은 이직/이사/관계 등의 랜덤 결정을 권장; 새 글은 저위험·되돌릴 수 있는 행동으로 제한.','위험 결정 범위가 도구·글·약관에서 일치.','글별 편집 기준 차이.','기존 글의 사례를 저위험 선택으로 한정하고 인용 연구의 범위를 확인.','의료/금융/계약/안전 판단을 랜덤에 위임하는 권장 없음.','두 글·도구·약관 비교, 기존 정상 링크 보존.',priority='P2',ref='E-SOURCE; E-HTTP',preserve='yes-no-reversible-choice의 제외 기준과 기록 절차 보존. 유입 자료 없이 URL 통합하지 않음.')
finding(12,'비공개 문의가 필요한 사용자도 공개 Issues로 유도','A11','/contact','src/pages/Contact.tsx:76,81,90','운영 DOM에서 개인정보/제휴처럼 공개하기 어려운 내용도 현재 GitHub Issues로 접수한다고 안내. 링크는 별도 HTTP200 확인.','민감 내용 게시를 예방하고 검증된 비공개 경로가 있으면 연결.','별도 비공개 연락 경로 없이 공개 이슈만 제공.','비공개 수신 채널 존재를 운영자가 확인한 뒤 연결; 그 전에는 개인정보/비밀번호 게시 금지 명시. 이메일을 만들어 쓰지 않음.','공개 문제 제보 링크는 유지; 민감정보 공개 유도 제거; 승인된 환경에서만 수신 확인.','링크 정상, 비공개 안내, 로그인 필요 여부/수신 검증은 별도.',priority='P2',ref='E-DOM /contact; contact-link.json',uncertainty='실제 개인정보 게시/유출은 관찰하지 않음. 문의 불가라는 기존 단정은 반증; 실제 답변 수신은 NOT RUN.')
finding(13,'CSS 기본 글 검색 의도 겹침','A09','/blog/css-shadow-design; /blog/css-shadow-guide; /blog/css-shadow-states','src/data/posts.tsx:2416,5202; src/data/content-plan.generated.json:28038','두 기본 글의 box-shadow 매개변수·생성기 설명이 겹침. 상태/포커스/접근성 글은 별도 실무 목적.','고유 예시와 다른 사용자 작업이 분명해야 함.','편집 범위가 인접. 정량 중복률/유입 잠식은 미측정.','MERGE REVIEW만 제안; 의도/예시 비교 후 GSC 유입·링크를 확보할 때 대표 URL 결정.','고유 정보 손실 없음; 동등 목적지가 있을 때만 개별 승인으로 통합.','고유 예시 보존, 내부 링크/1단계 redirect는 향후 승인된 변경에만 검사.',priority='P2',evidence='Strong',ref='E-SOURCE; E-HTTP',preserve='css-shadow-states KEEP. 연령·글 길이를 삭제 근거로 쓰지 않음.')
finding(14,'추가 건강·AI 글의 수치/대상/기준 출처 검증 필요','NEW','/blog/exercise-brain; /blog/bmi-limitations; /blog/ai-era-skills','src/data/posts.tsx:5011,4593,6355','운동 기억력40% 등 수치, BMI 범위·인종 서술, AI가 할 수 없다는 단정 확인. 해당 연구·적용 집단·시점의 원자료 검증은 미실행.','숫자·대상·기준일을 추적 가능한 원자료와 연결.','원자료 적용 범위는 Unknown; 인용 부정확성 자체를 확정하지 않음.','출처 원문과 숫자/집단/조건을 대조하고 근거 없는 단정만 제한.','각 주장에 근거/적용범위 또는 검증 필요 표시.','실제 BMI/시급 도구 최신 기준·국가·대상은 별도 공식 검증.',priority='Verification Required',evidence='Unknown',ref='E-SOURCE; E-HTTP',preserve='BMI 한계 설명 및 boundaries-relationship의 구체적 대화 예시 보존.')

official=[
('O-PRIVACY','ADSENSE-OFFICIAL','Required content','https://support.google.com/adsense/answer/1348695?hl=en','Google 및 제3자 광고 쿠키, 이전 방문 기반 광고, 개인맞춤 광고 설정 해제 안내 항목. SPK-005 고지 대조.'),
('O-CMP','ADSENSE-OFFICIAL','Google consent management requirements','https://support.google.com/adsense/answer/13554116?hl=en','EEA/UK/스위스 개인맞춤 광고의 인증 CMP/TCF 요건. 비개인맞춤이라는 이유만으로 모든 동의 의무 면제라고 판단하지 않음. 계정·국가 조건 미확인.'),
('O-CRAWLER','ADSENSE-OFFICIAL','About the AdSense ads crawler','https://support.google.com/adsense/answer/99376?hl=en','Mediapartners-Google은 콘텐츠 판단; Google-Display-Ads-Bot은 사이트 추가 검증; 검색 크롤러와 별개. 직접 open 두 번 실패 후 공식 검색 색인 본문에서 확인, 실시간 원문 응답은 미확인.'),
('O-INVENTORY','ADSENSE-OFFICIAL','Google-served ads on screens without publisher-content','https://support.google.com/publisherpolicies/answer/11112688?hl=en','빈/저가치/오류 화면 광고 관련 정책. 실제 광고 표시 미검증이므로 코드 존재만으로 위반 확정하지 않음.'),
('O-PLACEMENT','ADSENSE-OFFICIAL','Ad placement policies','https://support.google.com/adsense/answer/1346295?hl=en','실행/복사/다운로드와 광고 혼동 및 자동 새로고침 검토. 로컬 광고 차단이라 실제 배치는 미검증.'),
('O-NOINDEX','SEARCH-QUALITY','Block Search indexing with noindex','https://developers.google.com/search/docs/crawling-indexing/block-indexing','검색 색인 제어. 크롤러가 읽을 수 있어야 함; 광고 정책 면제 규정 아님.'),
('O-JS','SEARCH-QUALITY','Understand JavaScript SEO basics','https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics','최초 HTML와 렌더링된 DOM을 구분. 수집 차이를 곧 클로킹으로 확정하지 않음.'),
('O-NHLBI','EXPERT-INFERENCE','How Sleep Works — Sleep Phases and Stages','https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep','수면 단계는 계측으로 분류하며 주기는 변한다. 개인 기상 시각 처방의 근거가 아님.'),
('O-NIST','EXPERT-INFERENCE','NIST SP 800-63B-4','https://pages.nist.gov/800-63-4/sp800-63b.html','인증 시스템 지침. OTP는 phishing-resistant가 아니며 MFA가 모든 위협을 제거하지 않음. 생성기의 AdSense 필수조건으로 적용하지 않음.'),
('O-MDN','EXPERT-INFERENCE','Crypto: getRandomValues()','https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues','브라우저 난수 API. 생성/기록 절차 전체의 효능이나 계정 안전 보장의 근거 아님.')]

lines=['# 근거 및 발견사항',f'확인일 {now}; commit cc03040ba8bbb79427547801744097c6b079d668; 운영 배포 SHA UNKNOWN.','',
'E-HTTP = http-evidence.json (URL별 시각/리디렉션/허용된 헤더/본문·링크; 쿠키/전체 헤더 저장 안 함).',
'E-DOM = browser-results.json 및 browser-final.json. 새 Chromium 컨텍스트, 외부 요청 차단. random-choice-log의 초기 loading 캡처는 최종 캡처로 대체하며 장애 증거로 사용하지 않음.',
'E-LOCAL = browser-results.json / browser-followup.json / browser-final.json / percentage-zero.json / qr-decode.json / checks.log. 결과값은 로컬 소스 실행 증거이며 운영 동일 결과를 증명하지 않음.',
'E-SOURCE = 각 발견에 적힌 파일/행, 현재 commit 직접 읽기. 독립 내용 감사는 Spark 모델 unavailable 후 동일 범위를 Luna/max로 재시도하여 완료. 리더가 핵심 발췌와 HTTP를 대조.',
'E-PROVIDED = 사용자 제공 review prompt와 developer brief; 과거 판정은 현재 증거로 취급하지 않음.','', '## 공식 자료']
for oid,kind,title,url,desc in official:lines += [f'- {oid} [{kind}] [{title}]({url}), 확인일 2026-09-19. {desc}']
lines+=['','## 주요 발견 상세']
for f in F:
 lines += [f"### {f['id']} — {f['title']}",f"- 기존 진단 연결: {f['prior']}",f"- 환경/시각: 소스+명시된 로컬 또는 운영 관찰, {now}; commit 위 참조, 운영 SHA UNKNOWN.",f"- 대상 URL: {'; '.join('https://spinkorea.kr'+u.strip() for u in f['url'].split(';'))}",f"- 실제 확인 위치: {f['loc']}",f"- 관찰 사실/실제 결과: {f['fact']}",f"- 재현: test_results.md의 해당 T ID 또는 http-evidence.json의 대상 URL을 확인; 스크립트 명령과 입력은 원본 증거에 보존.",f"- 기대 동작: {f['expected']}",f"- 증거 유형·Evidence: SOURCE_CODE 및 {('LOCAL_TEST' if 'E-LOCAL' in f['ref'] else 'LIVE_HTTP/LIVE_DOM' if 'E-HTTP' in f['ref'] or 'E-DOM' in f['ref'] else 'SOURCE_CODE')}; {f['evidence']}; {f['ref']}",f"- 원인: {f['cause']}",f"- 분류: [{f['kind']}]; AdSense 직접성: {f['direct']}; 거절 인과: Unknown.",f"- 범위: 위 대상 중 명시한 재현 조건만 확인. 공통 패턴의 전체 영향 URL 수는 미확정.",f"- 심각도: {f['priority']}",f"- 공식/원자료: {f['ref']}; 공식 요건이 아닌 기능 오류는 독립 입력/기대값과 소스가 원자료.",f"- 최소 변경 수정안: {f['fix']}",f"- 보존/수정 금지: {f['preserve']} 이번 감사에서는 수정하지 않음.",f"- Acceptance Criteria: {f['ac']}",f"- 회귀 테스트: {f['test']}",'- 롤백·의존: 현재는 문서만 생성. 향후 승인된 최소 파일 diff를 별도 커밋으로 적용한 뒤 그 커밋을 revert; 지금 git/robots/redirect/noindex/광고 설정 변경 없음.',f"- 남은 불확실성: {f['uncertainty']}",'']
(P/'evidence.md').write_text('\n'.join(lines),encoding='utf8')

prior=[
('A01','/blog/random-choice-log','허브 밖 글·과거51/86','PARTIALLY_REPRODUCED','HTTP200/noindex,follow, 허브·sitemap 제외; 소스의 generated 검색 제외 정책과 일치','과거 글86은 현재 총량이 아님. 이번 허브87/도구51; 전체 후보와 색인은 별도','SPK-010'),
('A02','/blog/sleep-optimization','수면/카페인 산식·단정','REPRODUCED','390분/31.498% 독립 검산 및 운영 본문 일치','계산기의 개인차 고지는 존재','SPK-003'),
('A03','/blog/password-strength','고정 해독 시간/MFA','REPRODUCED','고정 시간 표·안전 보장 현재 HTTP 존재','생성기는 Crypto 사용/보장 부인; 글과 구분','SPK-004'),
('A04','/blog/random-choice-log','조사 오류·실행 양식 부족','REPRODUCED','3종 조사 오류 HTTP+최종 DOM','초기 loading 캡처는 결함 아님; 공통 템플릿 전체 품질 미확정','SPK-010'),
('A05','text-counter/contact/privacy','추출과 렌더링 차이','REPRODUCED','초기 HTML·DOM의 관련 링크/문의/정책 안내 차이','검색 스니펫은 NOT RUN; 클로킹 아님','SPK-008;SPK-009'),
('A06','privacy/광고/입력','고지·처리 일치','PARTIALLY_REPRODUCED','Google/쿠키/개인맞춤 설정 언급은 존재; 과거방문 설명·설정 링크 부족','실제 광고·CMP·전송 증명은 UNVERIFIED; 제3자 요청 차단','SPK-005'),
('A07','HTTP/www/robots/sitemap','봇 접근/색인 설정','PARTIALLY_REPRODUCED','HTTP/www308→apex200, unknown404, robots/sitemap200','실제 Google 봇 접근·로그 UNKNOWN; 과거 Crawl Gate PASS 철회 유지',''),
('A08','대표 도구','미실행 제안 시나리오','PARTIALLY_REPRODUCED','이번 실행의 실제 PASS/FAIL은 test_results.md','과거 표를 버그 목록으로 간주하지 않음','SPK-001;SPK-002;SPK-006;SPK-007;SPK-008'),
('A09','CSS3/YesNo2','겹침·고위험 권장 충돌','PARTIALLY_REPRODUCED','기본CSS 의도 겹침 Strong; YesNo 범위충돌 Confirmed','states/reversible 고유 가치 보존; 유입·정량 중복률 없음','SPK-011;SPK-013'),
('A10','text-counter 추천','로또/주사위 추천','PARTIALLY_REPRODUCED','정적 HTML 첫6 sitePages; DOM 관련3도구 정상','React 추천 버그가 아니라 독립 static generator 문제','SPK-009'),
('A11','contact/FAQ','문의 가능 여부 미확인','REFUTED','DOM에 GitHub Issues 링크, 목적지HTTP200','문의 수단 없음은 반증. 수신 NOT RUN; 비공개 문의는 별도 문제','SPK-012;SPK-009'),
('A12','tools/blog/common','심사자 목적 문구','PARTIALLY_REPRODUCED','/tools 초기HTML에 AdSense 검토자; DOM없음','privacy 필수 AdSense 고지는 보존','SPK-009')]
with (P/'prior_findings_review.csv').open('w',encoding='utf-8-sig',newline='') as out:
 w=csv.writer(out);w.writerow('prior_id target prior_claim verification_status current_environment current_evidence evidence_reference correction_or_limit linked_finding_id next_action'.split())
 for id,target,claim,status,ev,limit,fid in prior:w.writerow([id,target,claim,status,'source + named live/local evidence',ev,'evidence.md;http-evidence.json;test_results.md',limit,fid,'fix_backlog.md의 해당 ID 참조; 미검증 조건 먼저 확인'])

tests=['# 실행 테스트와 미실행 범위',f'시각 {now}. 로컬 Vite는 configFile:false, envDir=감사폴더, 전용 cacheDir, 임의 localhost 포트. 기존 .env를 로드하지 않음. 브라우저는 모든 외부 host 및 /api/·비GET 요청 차단. 제품 파일 편집 없음.',
'', '## 명령과 핵심 판정',
'- `node node_modules/typescript/bin/tsc --noEmit`: PASS (exit0). package lint가 동일 tsc이므로 독립 lint 통과라고 중복 집계하지 않음.',
'- `node scripts/verify-roulette-storage.mjs`: PASS, ROULETTE_STORAGE_OK / RECENT_TOOLS_STORAGE_OK.',
'- `node scripts/verify-spin-consistency.mjs`: PASS, SPIN_CONSISTENCY_OK. 정적 계약 검사이며 현재 실제 spin E2E 증명은 아님.',
'- `python <audit>/collect.py`, `python <audit>/expand-sitemap.py`: 순차 GET, 요청후450ms, 명시적 재시도0. 실제 Google 봇 검증 아님.',
'- `node <audit>/browser-audit.mjs`, `browser-followup.mjs`, `browser-final.mjs`, `percentage-zero.mjs`: 실제 React UI 실행. 원본 실패/정정 내역 보존.',
'- OpenCV QRCodeDetector: `qr-decode.json`, 더미 URL 일치 PASS; PNG 다운로드 PASS.',
'', '## 최종 테스트 사례 (최초 잘못된 판정은 아래 정정)',
'|ID|입력/기대|최종 판정/실제|', '|---|---|---|',
'|T01|A 한😀: 코드포인트4/3, UTF16 5/4, UTF8 9|FAIL(정의/라벨): 5/4/9, UTF16 설명 없음|',
'|T01-edge ×4|빈값/a줄바꿈b/e+악센트/가족ZWJ|PASS 산출값 각각 0/3/2/11 code units, UTF8 0/3/3/25; 정의 미표시는 T01|',
'|T02|clipboard Promise 거부|FAIL 성공toast와 NotAllowedError|',
'|T03|큰 정수9007199254740993|FAIL 9007199254740992로 변형, 경고 없음|',
'|T04|잘못된 쉼표|PASS parser error; 이전 출력 유지 문제는 별도 개선. 최초 한국어toast matcher 실패를 기능 실패로 계산하지 않음|',
'|T05|120만원/0%/12개월|FAIL 결과누락/잘못된 미입력 안내; 0% 미지원 설명 없음|',
'|T06|120만원/12%/12개월|PASS 월106619원 (독립 계산 반올림106618.546...)|',
'|T07|기간0|PASS NaN/Infinity 없음; 명확한 오류 UX는 별도 개선|',
'|T08|2024-02-28~03-01|PASS 2일|',
'|T09|동일 날짜|PASS 같습니다 안내; 초기 같은 matcher 오류 정정|',
'|T10|역순|PASS 지난 기간 안내|',
'|T11|서로 다른10명/3팀|PASS 4·3·3, 결과 Person0~9 각1회; 원본 OBSERVED를 내용 검토해 판정|',
'|T12|비밀번호4/50자, 마지막문자군해제|PASS 길이4/50 및 최소1그룹 유지; 첫 숨겨진checkbox locator 실패 후 label 클릭으로 재검증|',
'|T13|QR더미 URL/PNG|PASS OpenCV 독립 decode 원문일치. Chromium BarcodeDetector 부재는 우회 완료|',
'|T14|텍스트도구360/390/768/1280|PASS 가로넘침없음; 390 screenshot 시각확인. 다른 도구/실기기/키보드/광고 가림은 미검증|',
'|T15|증감100→110 후 분모0|FAIL +10% 잔류|',
'|T16|전체0/일부10|FAIL ∞%; 최초 전체10/일부0은 정상0%로 테스트 입력을 정정|',
'|T17|clipboard resolve mock|PASS 원문 전달; OS clipboard/권한 허용 실제복사는 미검증|',
'','집계 단위: 위17 ID 중 T01-edge 별도4사례를 더해 총21 기능/UX 사례. 최종 PASS15 / FAIL6. HTTP·DOM 관찰·명령검사는 이 분모에 포함하지 않음. 반복 재시도는 중복 집계하지 않음.',
'','## NOT RUN / NOT APPLICABLE',
'- 전체 build: NOT RUN. build가 public 및 metadata와 node_modules/.cache를 쓰며 기존 dist 생성시점도 불명. 기존 dist는 발견용 자료만 사용. 기존 공유 작업의 산출물을 덮어쓰지 않고 격리 Vite UI로 검증.',
'- team UI는 실행; 홈 룰렛 후보1/전부제외/동일이름, 전체 도구 경계값/초대형 입력/깊은JSON: NOT RUN.',
'- 연속할인 전용 기능·날짜 양끝포함 옵션: NOT APPLICABLE(이번 실제 컴포넌트는 제공하지 않음). 수동 연속계산 81을 실제 기능 테스트 통과로 쓰지 않음.',
'- 건강/BMI/시급 최신 공식연도·집단, 실기기 키보드/초점, 모든 도구 반응형, 미지원crypto: NOT RUN.',
'- GSC/GA4/AdSense계정·거절원문·서버로그: 미제공, NOT RUN. 실제봇/광고표시/동의지역검사/문의수신/광고클릭은 NOT RUN.',
'- 광고script/GA request 시도는 blocked 로그로 관찰. third-party 라이브러리를 실행하지 않아 후속 전송/쿠키/광고새로고침은 증명 불가.',
'','## 원본 실행 이력 (OBSERVED는 관찰이며 테스트 PASS 아님)']
for x in rawtests:
 if x['id'].startswith('LIVE'):continue
 tests += [f"- {x['id']} 최초상태={x['status']}; 기대={x['expected']}; 실제={json.dumps(x['actual'],ensure_ascii=False)[:1700]}"]
(P/'test_results.md').write_text('\n'.join(tests),encoding='utf8')

back=['# 최소 변경 백로그 — 제안만, 구현하지 않음','승인 대상은 각 ID의 최소 파일/조건이다. 배포·설정·삭제·URL통합은 이번 권한에 없음. 상세 사실과 불확실성은 evidence.md 참조.','', '## 확인된 수정 후보']
for f in F:
 if f['priority']=='Verification Required':continue
 score='별도 수치화 없음 (우선순위/선행관계 사용)'
 back += [f"### {f['id']} {f['priority']} {f['title']}",f"- 원인/위치: {f['cause']} {f['loc']}",f"- 영향 URL: {f['url']}; 근거 {f['ref']} ({f['evidence']})",f"- 최소안: {f['fix']}",f"- 보존: {f['preserve']}",f"- 완료 기준: {f['ac']}",f"- 회귀: {f['test']}",'- 롤백: 향후 승인된 개별 변경 diff/commit revert. 데이터 마이그레이션 없음.','- 의존/승인: 현재 구현 승인 없음; 수정 범위 확정 후 별도 요청에서 진행. 계정·비공개 연락처는 실제 설정 증빙 필요.','']
back += ['## 먼저 검증할 항목',
'- SPK-014: 건강/AI 수치·기준 원자료 대조, BMI/시급 대상·연도 확인. 오류라고 확정한 상태가 아님.',
'- 실제 Google 접근: 제공된 crawler diagnostics 또는 검증된 서버로그. UA 모방으로 대체 불가.',
'- 광고/CMP: 지역별 실제 광고형태·인증CMP·동의상태 및 오류/빈/404 광고표시 확인. 스크립트 존재만으로 P0 부여 금지.',
'- 데이터 흐름: GA/오류/공유 동작의 통제된 모의 수집 endpoint로 더미만 추적; 실제 비밀번호/입력 전송 금지. 현재 localhost 테스트에서는 third-party SDK 실행을 차단함.',
'- CSS 대표 URL: GSC/내부 링크·고유예시를 비교한 뒤 선택. 지금 redirect/noindex/delete 없음.',
'', '## 대표 콘텐츠 리빌드 설계 (4개)',
'|대상|사용자 의도/고유 가치|보존·제거·추가|도구 연결·완료 기준|', '|---|---|---|---|',
'|sleep-optimization|입면 가정을 이해하고 참고 시간을 계산|수면환경 조언 보존; 잘못된 식/주기진단 제거;390분/31.5% 가정 예시·NHLBI범위 추가|현재 sleep/time calculator 가정과 대조, 처방 없음|',
'|password-strength|계정마다 다른 생성문자열을 안전하게 사용|재사용금지/관리자 안내 보존;고정해독시간·MFA보장 제거;공격환경·NIST적용범위 추가|random-password와 설명일치; 공개예시 재사용권장0|',
'|random-choice-log|추첨 절차를 나중에 검토할 기록 작성|주제/기존URL 유지;변수치환 반복 제거;가상 양식 실행시각·후보버전·제외·재추첨·결과·변경이력|홈/팀도구에 실제 있는 기능만; 복사 가능한 수기 기록1건 완성|',
'|yes-no-oracle-guide|가벼운 결정을 시작할 기준 선택|저위험선택 설명보존;이직/계약 위임 권장 제거;되돌림·실패비용 예시 추가|yes-no-reversible-choice 제외기준 연결; 연구근거 미검증은 단정안함|',
'', '## 첫 최소 작업 묶음 제안',
'1. JsonFormatter 큰 정수 무고지 변형, PercentageCalculator 0분모/결과 잔류, 대표 복사 handler 실패 안내를 각 회귀 테스트와 함께 수정.',
'2. 별도 콘텐츠 묶음으로 수면 산식과 비밀번호 보장만 최소 교정.',
'3. 광고 설정/고지의 사실확인이 끝나면 정적 셸·DOM 개인정보/문의 안내를 동기화.',
'현재 단계는 여기서 종료. 제품 구현/게시/커밋/푸시는 시작하지 않는다.']
(P/'fix_backlog.md').write_text('\n'.join(back),encoding='utf8')

sm=[x for x in rows if x['sitemap_included']=='True'];smchecked=[x for x in sm if x['http_status']!='UNKNOWN']; errors=[x for x in http if x.get('status',0)>=400]
badsm=[x for x in smchecked if x['http_status']!='200' or 'noindex' in x['meta_robots']]
summary={'candidate_urls':len(rows),'http_urls':len(http),'sitemap_urls':len(sm),'sitemap_http_checked':len(smchecked),'sitemap_http_or_noindex_anomalies':len(badsm),'http_status_counts':dict(collections.Counter(str(x.get('status','ERROR')) for x in http)),'deep_articles':12,'live_dom_unique_pages':5,'local_tool_pages':8,'function_cases':21,'function_pass':15,'function_fail':6}
(P/'coverage.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf8')
report=f'''# SpinKorea 정밀 재검증 보고서 — REVIEW ONLY

1. 검토·감사 문서 작성 완료. 제품 코드·콘텐츠·계정·배포 변경 없음.
2. JSON 정밀도 손실, 퍼센트 0분모, 복사 거부 성공 알림 등 로컬 기능 결함을 재현했다.
3. 수면 산식 오류와 비밀번호 보장 문장은 현재 운영 HTTP에서도 확인했다.
4. 문의 링크는 렌더링 후 존재하며 목적지 HTTP200이다. “문의 수단 없음”은 정정한다.
5. 추천·심사자 문구·개인정보 차이는 독립 정적 셸과 React 본문 차이로 설명된다.
6. 신규 글 생산보다 기존 기능/콘텐츠 정확성과 정책 고지의 사실 확인을 우선한다.
7. Policy PARTIAL / Crawl & Function FAIL / Publisher Value FAIL. 실제 광고·봇·계정은 미검증.
8. AdSense 거절 원문이 없어 거절 원인·승인 확률·100점 점수는 산정하지 않는다.

## 환경·범위
- {now}; 저장소 E:\\web\\spinkorea, main, cc03040ba8bbb79427547801744097c6b079d668. 운영 SHA 미확인.
- React19/Vite7/TypeScript, npm/package-lock.json. curated JSX + generated JSON/chunks, 날짜와 source 분류에 따라 discovery/route 생성.
- 기존 docs/HANDOFF.md는9/8, PROJECT_STATE.md/.goal-harness는8/30 기록으로 현재 감사 완료의 증거가 아니다. 감사 고유 폴더에만 durable handoff를 기록했다.
- 초기 사용자 미추적 변경 .omc/.playwright-cli/output 및 두 입력문서/개선프롬프트를 보존. 추적 파일 diff 없음.
- Spark 시작 실패(Unknown model) 후 동일 읽기 전용 콘텐츠 범위를 Luna/max로 한 번 재시도하여 완료. 리더는 함수/HTTP/DOM/정책/최종 검증 담당.

## 커버리지와 인벤토리 해석
- 발견한 원본 URL 후보 {len(rows)}개; 공개 HTTP 확인 {len(http)}개. 이 후보 수에는 미래 source/기존 dist/fragment 변형이 포함되어 공개 페이지 수가 아니다.
- 운영 sitemap {len(sm)}개 중 {len(smchecked)}개 HTTP 검사. HTTP/명시적noindex 이상 {len(badsm)}개. 실제 색인 수·Google 접근은 UNKNOWN.
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
'''
(P/'report.md').write_text(report,encoding='utf8')
(P/'HANDOFF.md').write_text(f'''# Current audit handoff
Timestamp: {now}
Goal: User-supplied REVIEW ONLY prompt A01-A12 and developer brief revalidation.
State: REVIEWING. Six required artifacts written; final scope/artifact validation pending.
Source: main cc03040ba8bbb79427547801744097c6b079d668. Deployment SHA UNKNOWN. Initial dirty/untracked files preserved.
Completed: source/content independent audit (Spark unavailable -> Luna/max same lane), official references, sitemap HTTP, five live DOM pages, eight isolated local tool pages, 21 final cases PASS15/FAIL6, tsc and two existing verifiers PASS, independent QR decode PASS.
Changed files: only docs/audits/spinkorea/2026-09-19-225440/. No tracked product changes.
Side effects: public low-rate GET, temporary isolated Vite and Chromium (closed), own cache and audit evidence. Rollback: remove this exact generated directory if requested; no product rollback needed.
Limitations: full build NOT RUN; ads/CMP/account/real crawler/device/real mail receiver UNKNOWN. Report documents test matcher corrections and raw evidence.
Not run/sent: credentials, external writes, mail/forms/ads clicks, product edits, commits/push/deploy, account operations, index submissions.
Next: verify six-file schema, counts, links, git scope and mark review complete without implementation.
''',encoding='utf8')
print(json.dumps(summary,ensure_ascii=False))
