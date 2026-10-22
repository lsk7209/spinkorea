# AdSense 승인 대비 사이트 검토 리포트

- 검토일: 2026-10-22
- 대상: https://spinkorea.kr (SpinFlow / SpinKorea), 브랜치 `claude/zealous-rubin-0432bv`
- 상태: AdSense **신청 전**
- 방법: 저장소 코드·정적 자산·콘텐츠 데이터 정적 검토. 라이브 사이트 접속, AdSense/GSC 계정 확인, 실제 광고 렌더링 검증은 **하지 못했다** (아래 "미확인" 참고).

## 1. 요약

| 영역 | 판정 | 한 줄 평 |
|---|---|---|
| 필수 페이지 | 양호 | 소개·문의·개인정보처리방침·이용약관·FAQ 모두 존재, 푸터에서 전 페이지 링크 |
| 기술/SEO | 양호 | ads.txt, robots, sitemap, canonical, 404 실제 상태코드, 정적 프리렌더 |
| 콘텐츠 품질 | **주의** | 템플릿 조립형 자동 생성 글 376편이 URL로 접근 가능하고 광고 태그도 로드됨 |
| 정책 위반 요소 | **주의** | noindex 화면에 광고 스크립트 로드(이번에 수정), 동의 관리(CMP) 미확인 |
| 신뢰 신호(E-E-A-T) | 보통 | 운영자 실체(이름/사업자/주소)가 드러나지 않음 |

핵심 위험은 **"검토되지 않은 템플릿 글이 대량으로 존재한다는 점"** 하나로 모인다. 나머지는 이미 상당히 정비돼 있다.

## 2. 이미 잘 돼 있는 것

- `public/ads.txt` 게시자 레코드 형식 정상 (`google.com, pub-3050601904412736, DIRECT, f08c47fec0942fa0`).
- `index.html`에 AdSense 스니펫이 `<head>`에 있고 `.env.example`의 pub ID와 일치.
- 필수 페이지 5종 + 푸터 링크 (`src/components/Footer.tsx`).
- 개인정보처리방침에 Google 광고 쿠키, 개인 맞춤 광고 해제 경로(내 광고 센터), 파트너 사이트 데이터 사용 안내 링크 포함 (`src/data/site-guidance.json`).
- 존재하지 않는 경로는 `dist/404.html`로 **실제 404** 반환 (soft-404 아님), 404 화면은 `noindex`.
- 사이트맵(385 URL)에는 검토 승인된 글(curated/editorial)만 포함, 생성 글 0건.
- 도구 페이지: 사용법, 팁, FAQ, 관련 도구, 출처, 면책 문구를 갖춘 `ToolLayout` 공통 구조. 51종 도구.
- 편집 글 275편은 본문 분량·출처 링크·실제 사례가 있는 서술형 (샘플 확인).
- 보안 헤더(HSTS, nosniff, DENY, Referrer-Policy) 설정.
- 기존 가드 스크립트 `npm run audit:adsense-readiness` 통과.

## 3. 발견 사항과 조치

### A. [높음] 템플릿 조립형 자동 생성 글 376편

- 근거: 메타데이터 726편 중 `source: generated` 376편. 본문(`body`) 없이 `src/data/generatedContent.tsx`의 문장 변형 조합(`articleVariant % 6`, `toneVariant % 8` 등)으로 화면이 만들어진다.
- 주제 일부는 사이트 이용자와 무관한 운영 메모성이다 (예: `adsense-homepage-flow`, `fresh-sitemap-submit`, `intent-distribution-map`).
- 현재 `noindex,follow`이고 사이트맵·블로그 목록에서는 빠져 있으나, **URL로 직접 접근하면 열리고** 심사 크롤러가 방문할 수 있다. AdSense는 "가치가 낮은 콘텐츠", "자동 생성 콘텐츠"를 거절 사유로 본다.
- 권장(우선순위 순):
  1. **삭제 또는 영구 이동(410/301)**: 승인 전까지 376개 URL을 빌드 산출물에서 제외. 가장 안전하다.
  2. 유지해야 한다면 사람이 본문을 써서 `editorial`로 승격한 것만 남기기.
  3. 최소한 사이트 내부 링크에서 어떤 경로로도 노출되지 않는지 주기적으로 검증.
- 이번 변경에서 **삭제는 하지 않았다**. 콘텐츠 정책 변경이라 사용자 결정이 필요하다.

### B. [높음 → 수정함] noindex 화면에 AdSense 스크립트 로드

- 근거: `index.html`의 AdSense 태그가 생성 글·404의 정적 셸에도 그대로 복사됨. Auto Ads가 켜져 있으면 "게시자 콘텐츠가 없는 화면 광고" 정책 위반 소지.
- 조치: `scripts/generate-assets.mjs`의 `injectHtml`이 `robots`가 `noindex*`인 경로(생성 글, 404)에서 AdSense `<script>`와 `preconnect`를 제거. `scripts/audit-adsense-readiness.mjs`에 회귀 단언 추가.
- 한계: SPA 안에서 다른 페이지를 거쳐 클라이언트 라우팅으로 들어오면 이미 로드된 스크립트는 남는다. 근본 해결은 A.
- 로컬 검증: 정규식 치환 단위 확인과 가드 스크립트 통과. 전체 `npm run build`는 이 환경에 `node_modules`가 없어 **실행하지 못했다**.

### C. [중간 → 수정함] `google-adsense-account` 메타 태그 누락

- 조치: `index.html`에 `<meta name="google-adsense-account" content="ca-pub-3050601904412736">` 추가. 사이트 소유 확인 방법 중 하나로 스니펫과 병행 가능.

### D. [중간] 운영자 신원 정보 부족

- 소개 페이지는 "SpinFlow 편집팀"만 언급하고 이름·운영 주체·소재지가 없다. 문의는 개인 Gmail과 GitHub Issues.
- 권장: 소개 페이지에 운영자(실명 또는 상호), 운영 시작 연도, 콘텐츠 작성·검토 방식, 연락 이메일 명시. 가능하면 도메인 메일(예: `contact@spinkorea.kr`) 사용. 어떤 정보를 공개할지는 운영자가 정할 일이라 코드는 건드리지 않았다.

### E. [중간] 동의 관리(CMP) 미확인

- 대상 트래픽에 EEA/영국/스위스가 포함되면 Google 인증 CMP가 필요하다. 한국 트래픽 위주라면 우선순위는 낮지만, AdSense 계정의 "개인정보 보호 및 메시지"에서 설정 여부를 확인해야 한다. 기존 문서(`docs/HANDOFF.md`)도 같은 항목을 미해결로 남겨 두었다.

### F. [중간] 도구 사이트 특유의 "독자 가치" 보강

- 룰렛/계산 도구는 상호작용 비중이 크고 텍스트가 적어 보일 수 있다. 도구 페이지마다 계산 기준, 예시, 한계, 공식 출처 문구가 `ToolLayout`으로 채워지는 점은 좋다.
- 권장: 트래픽 상위 10개 도구에 한해 "계산 방식 설명 + 실제 예시 2개 + 자주 틀리는 점"을 300~600자씩 추가. 51개 전부를 한 번에 늘리기보다 핵심 도구 위주가 효과적이다.

### G. [낮음] 기타

- 콘텐츠 청크 파일이 큼 (`chunk-01.json` 약 613KB). 정책 사안은 아니나 속도 지표에 영향.
- `index.html` 정적 `<title>`/설명이 룰렛 중심. 사이트 정체성(룰렛 + 생활 유틸리티)과 일치하는지 확인.
- `Disallow: /api/`는 적절. `Mediapartners-Google`을 막는 규칙이 없는 점도 정상.
- 사이트 이전 문서(`docs/seo-audit/seo-audit-2026-08.md`)에 "AdSense 리소스 403"이 기록돼 있다. 승인 전 상태에서의 정상 동작으로 보이나 신청 후 재확인 필요.

## 4. 신청 전 체크리스트

- [ ] A: 생성 글 376편 처리 방침 결정 및 반영
- [ ] D: 소개 페이지에 운영자 정보 공개, 연락처 정비
- [ ] E: AdSense 계정에서 CMP/메시지 설정 확인 (EEA 트래픽 여부 포함)
- [ ] 배포 후 라이브에서 확인: ads.txt 200, `/robots.txt`, 생성 글 HTML에 `adsbygoogle` 없음, 존재하지 않는 경로 404
- [ ] Search Console에서 색인된 URL 수와 사이트맵 일치 확인, "크롤링됨 - 현재 색인 안 됨" 목록 점검
- [ ] 도메인 연령·트래픽 기준: 신규 도메인은 자연 유입이 어느 정도 생긴 뒤 신청하는 편이 통과 가능성이 높다 (정해진 최소 기준은 없다)
- [ ] 신청 후에는 광고 슬롯을 임의로 늘리지 말고 승인 결과를 기다리기

## 5. 미확인 항목 (이번 검토의 한계)

- 라이브 사이트 응답, 렌더링 결과, 속도 지표
- AdSense/Search Console 계정 상태, Auto Ads 제외 설정, CMP 설정
- 전체 `npm run verify:local`, `npm run build` 결과 (이 환경에 의존성 미설치)
- 편집 글 275편 전수 품질 검토 (샘플 수준)

## 6. 이번 변경 파일

- `scripts/generate-assets.mjs`: noindex 정적 셸에서 AdSense 태그 제거
- `scripts/audit-adsense-readiness.mjs`: 위 동작과 `google-adsense-account` 메타 단언 추가
- `index.html`: `google-adsense-account` 메타 추가
- `docs/adsense/adsense-readiness-review-2026-10-22.md`: 이 문서
