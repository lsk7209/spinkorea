# SpinKorea.kr SEO 감사 — 2026-08-28

도구: [`AgricIDaniel/claude-seo`](https://github.com/AgricIDaniel/claude-seo) v2.2.5 (로컬 전용, 외부 AI/데이터 API 미사용).
대상: 라이브 `https://spinkorea.kr` — 대표 6개 URL (`/`, `/tools`, `/tools/lotto-generator`,
`/tools/hourly-wage`, `/blog`, `/blog/calculator-vs-excel`).
범위: technical · schema · GEO/AEO · content(E-E-A-T). 원본 산출물은 `raw/`.

> claude-seo의 점수·판정은 휴리스틱이며 Google 내부 신호가 아니다. 배포 후 GSC/GA4가 1차 근거다.

---

## 요약

이미 탄탄한 편 — 전 라우트 사전 렌더 HTML, 보안 헤더 대부분 구비, 유효한 JSON-LD 그래프,
robots에 AI·네이버·다음 크롤러 명시 허용, 사이트맵/RSS/llms.txt 정상. AI 크롤러가 JS를 실행하지
않아도 본문이 보인다.

핵심 결함 3가지:

1. **Soft-404** — 존재하지 않는 경로(`/아무거나`, `/blog/가짜슬러그`, `/sitemap_index.xml`)가
   HTTP **200**으로 홈 셸을 반환하고 원본 HTML에 `noindex`가 없다. 무한 저품질/중복 표면.
2. **블로그 글의 소셜/AI 메타가 부정확** — 정적 HTML의 `og:type`이 전 페이지 `website` 고정,
   `og:image`가 항상 사이트 기본 이미지(글 썸네일 아님), `article:published_time` 없음.
3. **신선도·E-E-A-T 신호 약함** — 도구 페이지에 갱신일 없음(추출 날짜가 `2026-01-01`),
   저자가 조직명뿐(개인·자격 없음), 큐레이트 글 76개 중 35개가 사실상 400~600자 수준.

---

## 영역별 결과

### 1. 기술 SEO

| 항목 | 상태 | 근거 |
|---|---|---|
| HTTPS / HSTS | ✅ | `strict-transport-security: max-age=31536000; includeSubDomains` |
| 보안 헤더 | ✅ (CSP 제외) | X-Content-Type-Options, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy 존재 |
| 사전 렌더 | ✅ | 6개 URL 전부 원본 HTML에 제목·설명·canonical·본문 텍스트·JSON-LD 포함 (`is_spa: false`) |
| robots.txt / 사이트맵 | ✅ | 사이트맵 선언·유효(urlset), AI·Yeti·Daumoa 허용, Bytespider 차단 |
| canonical | ✅ | 전 페이지 self-canonical |
| 생성 글 격리 | ✅ | `/blog/fair-random-draw` 등 원본 HTML에 `robots: noindex,follow` + self-canonical 확인 |
| **Soft-404** | 🔴 | `/nonexistent-page-check-xyz-123` → **200**, 홈 셸(5,633 B), `noindex` 없음. `/blog/<가짜>` 동일. `/sitemap_index.xml`·`/wp-sitemap.xml`도 200 HTML |
| www→apex 리다이렉트 | 🟡 | 존재하나 **307 임시** (`https://www.spinkorea.kr/tools` → `https://spinkorea.kr/tools`). 링크 자산 통합에는 308/301 영구가 필요 |
| favicon | 🟡 | `rel="icon"` + `apple-touch-icon`이 **`/og-image.png` (885 KB PNG)**. 실제 파비콘(32×32/180×180) 필요 |
| 내비게이션 예측(Speculation Rules) / LCP 프리로드 | 🟡 | `preload_check` 6개 URL 전부 50/100. speculation rules·preload 힌트·`fetchpriority=high` 전무 |
| Core Web Vitals 필드 데이터 | ⚪ | PSI/CrUX API 키 없어 미수집. 무료 PageSpeed Insights 키(Tier 0) 추가 권장 |
| 콘솔 오류 | ⚪ | 전 페이지 AdSense 리소스 **403** (사이트 승인 전으로 보임). `/tools`는 `frame-ancestors 'self'` 위반 리포트(google.com iframe 시도 — CSE 위젯 추정) |
| 강제 CSP 헤더 | 🟡 | 응답에 `Content-Security-Policy`(강제) 없음. 페이지 경험·보안 항목(SEO 가중치 낮음) |

### 2. 구조화 데이터 (Schema.org / JSON-LD)

| 항목 | 상태 | 근거 |
|---|---|---|
| 문법·유효성 | ✅ | 6개 URL 전부 `valid: true`, 절대 URL, `@id` 그래프 연결(Organization/WebSite) |
| 서버 렌더 마크업 | ✅ | 정적 HTML에 Organization+WebSite+WebPage/CollectionPage, 도구엔 WebApplication+BreadcrumbList, 블로그엔 BlogPosting 포함 (2025-12 JS-SEO 가이드 부합) |
| **`og:type`** | 🟡 | **전 페이지 `website`** — 블로그 글은 `article` + `article:published_time`/`modified_time`/`author` 필요 |
| **정적 `og:image`** | 🟡 | 블로그 글도 항상 `/og-image.png`. 런타임은 썸네일로 교정하나 소셜·AI 스크레이퍼는 정적을 먼저 읽음 → 글 썸네일(절대 URL) 필요 |
| `BlogPosting.author` | 🟡 | 정적: `{"@type":"Organization","name":"SpinFlow"}` — `@id`/`url` 없음. `#organization` 노드 참조 또는 Person 추가. 정적엔 `image`(ImageObject)·`mainEntityOfPage`도 없음 |
| `BreadcrumbList` | 🟡 | `ListItem`에 `item.@id`/`{"@type":"WebPage"}` 래퍼 없음 (경미) |
| `HowTo` (런타임, 도구) | 🟡 | Google이 HowTo 리치 결과 **2023-09 폐지** — 검색 가치 0. 엔지니어링 투자 중단 권장 |
| `FAQPage` (런타임, 도구·생성글) | 🟡 | Google이 전 사이트 FAQ 리치 결과 **2026-05-07 폐지** — SERP 가치 없음. 온페이지 UX로만 유지, 정적 추가 불필요 |
| `datePublished` | ⚪ | 날짜만(시간·오프셋 없음). 허용되나 신선도엔 `YYYY-MM-DDThh:mm:ss+09:00`가 유리 |

### 3. GEO / AI 검색 (AI Overviews · ChatGPT · Perplexity)

| 항목 | 상태 | 근거 |
|---|---|---|
| AI 크롤러 접근 | ✅ | GPTBot·OAI-SearchBot·ClaudeBot·PerplexityBot·Google-Extended 명시 허용. 본문 SSR 제공(AI 크롤러는 JS 미실행) |
| llms.txt | ✅ | 존재 (단, Google 검색은 무시 — 다른 엔진용). 페이지·글 각 12개만 나열 |
| 멀티모달 | ✅ | 계산기·룰렛 등 인터랙티브 도구 — GEO 연구상 AI 선택률 높음 |
| 인용 적합성(citability) | 🟡 | 블로그 "핵심 요약" 블록은 좋음. 큐레이트 글이 얕아 134~167단어 자기완결 답변 블록 부족 |
| **신선도** | 🟡 | 홈·`/tools`·`/tools/lotto-generator` 추출 발행일 `2026-01-01`(사실상 미상). 검토된 도구(`hourly-wage`)만 `2026-08-28`. GEO 연구: 3개월 이내 콘텐츠 인용률 3배. **도구 페이지에 노출 갱신일 + `dateModified` 필요** |
| **저자 권위** | 🟡 | 저자 = "SpinFlow 편집팀"(조직). 개인·자격·바이오·`sameAs` 없음 → AI 인용에 약한 신호 |
| 사이트맵 `lastmod` | 🟡 | 도구 페이지 `lastmod`가 손으로 넣은 상수(`2026-05-05` 다수). 빌드/git 날짜 파생 필요 |
| 엔티티 연결 | ⚪ | Person 스키마 없음, Organization 외 `sameAs` 없음 |

### 4. 콘텐츠 / E-E-A-T

| 항목 | 상태 | 근거 |
|---|---|---|
| 신뢰(Trust) | ✅ | HTTPS, 개인정보·약관·문의, 정정 경로, 큐레이트 글 바이라인, 편집 원칙 페이지 |
| Who/How/Why | 🟡 | 큐레이트 글은 바이라인 있음, 생성 글은 정확히 `noindex`. 다만 "How"(제작 과정)·"Who"(개인) 공개 없음 |
| **경험·전문성** | 🟡 | 저자 바이오·자격·1차 데이터·현장 근거 없음. 조직 저작뿐 |
| **YMYL 도구** | 🟡 | 시급·BMI·부가세만 `sources`/`reviewedAt`/`disclaimer` 보유. 나머지 금융·건강·노무 도구는 공식 출처·기준일·책임 검토자 미표기 → E-E-A-T 리스크 |
| **얕은 콘텐츠** | 🟡 | `posts.tsx` 큐레이트 76편 중 35편이 JSX 2,000자 미만(≈본문 400~600자). 커버리지 플로어 미달. (편집 50편 프로그램이 이미 보완 중) |
| 가독성·구조 | ✅ | H1→H2, 목록·표·목차 — 큐레이트·편집 글 양호 |

### 5. Agent-UX / 접근성 (`agent_ux_check`)

| URL | 점수 | 이슈 |
|---|---|---|
| `/` | 100 | — |
| `/tools` | 100 | — (input 1개 aria 라벨 없음, 경미) |
| `/tools/hourly-wage` | 100 | — |
| `/blog` | **80** | 접근 가능한 이름 없는 링크 12개 — 글 카드 `<Link>`에 `aria-label={post.title}` 필요 |
| `/tools/lotto-generator` | 94 | 이름 없는 아이콘 버튼 2개 — `aria-label` 필요 |
| `/blog/calculator-vs-excel` | 100 | — |

---

## 조치 목록 (티어별)

### T1 — 안전·기계적 (바로 적용)

| # | 항목 | 파일 |
|---|---|---|
| 1 | 블로그 글 정적 HTML에 `og:type=article` + `article:published_time`/`modified_time` 추가; 런타임(`SEO.tsx`에 `ogType` prop, `BlogPost.tsx`)도 동일 | `scripts/generate-assets.mjs` (`injectHtml`, `postRoutes`), `src/components/SEO.tsx`, `src/pages/BlogPost.tsx` |
| 2 | 블로그 글 정적 `og:image`/`twitter:image` = 글 썸네일(절대 URL), 없으면 기본 이미지 | `scripts/generate-assets.mjs` (`injectHtml`, `postRoutes`에 `image` 전달) |
| 3 | 정적 `BlogPosting`에 `author`/`publisher`를 `#organization` `@id` 참조, `image`(ImageObject), `mainEntityOfPage` 추가 | `scripts/generate-assets.mjs` (`writeDistAssets` postRoutes 그래프) |
| 4 | ~~`BreadcrumbList` `ListItem` 객체화~~ — 현재 `item`이 URL 문자열 형태이며 이는 Google이 문서화한 유효 형식임. 회귀 위험 대비 이득이 미미해 **보류** | — |
| 5 | 도구/페이지 `lastmod`를 상수 대신 빌드 날짜(또는 per-tool `reviewedAt`) 파생 | `scripts/generate-assets.mjs` (`getPageLastmod`), `src/data/site-pages.json` |
| 6 | www→apex **308 영구** 리다이렉트 | `vercel.json` |
| 7 | `/blog` 카드 `<Link aria-label>`, `/tools/lotto-generator` 아이콘 버튼 `aria-label` | `src/pages/BlogIndex.tsx`, `src/pages/tools/LottoGenerator.tsx` |
| 8 | 실제 파비콘(작은 PNG/ICO)로 교체, `apple-touch-icon`도 180×180 전용 | `index.html`, `public/` |
| 9 | `og-image.png` 최적화 (885 KB → ~150 KB, 1200×630 재압축) | `public/og-image.png` |
| 10 | `preconnect`: `pagead2.googlesyndication.com`, (썸네일 자가호스팅 전까지) `images.unsplash.com` | `index.html` |

### T2 — 구조적 (승인됨: T1+T2 전부)

| # | 항목 | 파일 |
|---|---|---|
| 11 | **Soft-404 → 서버 404**: 빌드 시 유효 라우트 매니페스트 방출 → 브랜드 `dist/404.html`(noindex) 추가 → `vercel.json` catch-all 조정해 미지 경로가 HTTP 404 반환(사전 렌더된 라우트는 200 유지) | `scripts/generate-assets.mjs`, `vercel.json`, `public/`(또는 생성) |
| 12 | **블로그 썸네일 자가호스팅** (126장) — **이번 패스 보류.** `update-thumbnails.mjs`가 `content-plan`·chunk의 썸네일을 카테고리 기준으로 재할당하므로, 로컬 경로를 넣어도 이 스크립트 실행 시 원격 URL로 되돌아감. 안전하게 하려면 `posts.tsx` + 편집 데이터 + `update-thumbnails.mjs`(로컬 경로 인지)를 함께 바꿔야 함. 별도 작업으로 분리. 완화책은 적용함(아래 참조) | `scripts/update-thumbnails.mjs`, `src/data/posts.tsx`, 편집 데이터, `public/thumbnails/` |
| 13 | **도구 페이지 신선도**: 노출 "최종 업데이트" 날짜 + `WebApplication.dateModified`(정적·런타임). per-tool `reviewedAt`을 `site-pages.json`에 | `src/data/site-pages.json`, `scripts/generate-assets.mjs`, `src/components/ToolLayout.tsx` |
| 14 | **LCP/예측**: LCP 이미지 `preload` + `fetchpriority="high"`, 상위 내비 경로 `<script type="speculationrules">` prefetch | `index.html`, `scripts/generate-assets.mjs` |

### T3 — 가이드만 (이번 패스 코드 변경 안 함)

- YMYL 도구 전체에 공식 출처 + 기준일 + **명시된 책임 검토자(자격 포함)**.
- 저자 E-E-A-T: Person 스키마, 저자 소개 페이지, `sameAs`.
- 얕은 큐레이트 글 35편 — 확장 또는 통합.
- 강제 `Content-Security-Policy` 헤더 도입(AdSense/GA 허용 목록 설계 필요).
- CWV 필드 데이터용 PageSpeed Insights API 키.
- GSC · 네이버 서치어드바이저 계정 연결(자격증명 필요).
- GA4에서 `tool_result_viewed` 주요 이벤트 지정.
- AdSense 승인/403 원인 조사.
- `HowTo` 마크업: 리치 결과 폐지됨 — 신규 투자 중단(제거는 선택).

---

---

## 적용 결과 (2026-08-28)

상세: `changes-applied-2026-08.md`. 10개 파일 수정 + 아이콘 5개 추가. 배포는 안 함.

**적용 완료**

- **T1-1/2**: 블로그 글 정적·런타임에 `og:type=article` + `article:published_time`/`modified_time`/`author`,
  `og:image`/`twitter:image` = 글 썸네일(절대 URL) + `og:image:width/height/alt`.
- **T1-3**: 정적 `BlogPosting`에 `@id`, `mainEntityOfPage`, `image`(ImageObject), Organization `logo`,
  `author`/`publisher` = `#organization` 참조. 런타임 `BlogPost.tsx`도 동일 정합.
- **T1-5(부분)**: 도구 `WebApplication`·`WebPage`에 `dateModified`(= `site-pages.json` `lastmod`),
  정적·런타임 도구 페이지에 노출 "페이지 업데이트" 날짜.
- **T1-6**: `vercel.json`에 www→apex **308 영구** 리다이렉트(`redirects` + host 조건).
- **T1-7**: `/blog` 카드 `<Link aria-label>`, `/tools/lotto-generator` 아이콘 버튼 `aria-label`.
- **T1-8**: 파비콘 885 KB PNG → `favicon-32.png`(1.9 KB)·`favicon-48.png`(3.2 KB),
  `apple-touch-icon.png`(180², 27 KB), `manifest.json` 아이콘을 `icon-192`/`icon-512`(정확한 크기·`purpose`)로 교체.
- **T1-10**: `preconnect` `pagead2.googlesyndication.com`·`images.unsplash.com`, `dns-prefetch` GTM.
- **T2-11**: **Soft-404 → 서버 404.** `vercel.json` catch-all 제거, `generate-assets.mjs`가 `dist/404.html`
  (noindex, canonical 없음) 생성. 사전 렌더 라우트는 Vercel 파일시스템 해석으로 200 유지,
  미지 경로는 `404.html` + HTTP 404. SPA 전용 라우트(`/spinflow/:slug`, `/spinflow-standalone`)는 명시 rewrite.
- **T2-12(완화)**: 블로그 `<img>`에 `width`/`height`(1600×900, CLS), 본문 히어로 `fetchpriority="high"`,
  `images.unsplash.com` `preconnect`. 완전 자가호스팅은 별도 작업.
- **T2-13**: 도구 신선도 — 위 T1-5 참조.
- **T2-14**: `index.html`에 Speculation Rules `prefetch`(same-origin, `eagerness: moderate`) —
  모든 사전 렌더 페이지에 전파. LCP 히어로 `fetchpriority="high"`.
- **부수 수정(SEO 범위 밖, 라우팅 개편에 수반)**:
  - `/s/:id` → `/api/s/:id` rewrite 추가. 단축 링크가 현재 catch-all에 먹혀 200 soft-404(리다이렉트 안 됨)였음.
    라우팅을 손대는 김에 의도된 동작으로 연결. **배포 후 실제 리다이렉트 확인 필요.** Turso 미설정 시 함수가 즉시 404.
  - `scripts/audit-adsense-readiness.mjs`의 낡은 단언 수정 — `postMetadata.ts`가 이미 `curated || editorial`을
    색인 대상으로 삼는데 스크립트는 `curated`만 기대해 baseline에서도 실패하던 것.

**배포 후 검증 필요 (로컬에서 확인 불가)**

- 미지 경로가 실제로 HTTP 404 반환 + `404.html` 표시 (Vercel 파일시스템 해석 동작).
- www→apex가 308 (Vercel 대시보드 도메인 리다이렉트가 vercel.json보다 먼저 동작하면 대시보드에서 변경 필요).
- `/s/<8자>` 단축 링크 301 리다이렉트.
- 스케줄 발행과 다음 빌드 사이(최대 ~20h)에 아직 빌드 안 된 예약 생성글 URL은 이제 soft-404 대신 404.
  생성글은 noindex·무링크·사이트맵 제외라 영향 미미. 다음 일일 빌드에서 해소.

**보류 → 후속 작업 (T3 + 위 T2-4/T2-12)**

- 썸네일 126장 자가호스팅(스크립트 정합 필요).
- YMYL 도구 전체 공식 출처·기준일·명시 검토자.
- 저자 Person 스키마·소개 페이지·`sameAs`.
- 얕은 큐레이트 글 35편 확장/통합.
- 강제 CSP 헤더, PageSpeed Insights API 키, GSC·네이버 연결, GA4 주요 이벤트, AdSense 403 조사.

---

## 검증 계획 (T1+T2 적용 후)

```
npm run type-check
npm run build
npm run content:validate
npm run verify:growth
node scripts/verify-search-scope.mjs
node scripts/audit-adsense-readiness.mjs
```

- `dist/blog/<curated>/index.html`에 `og:type=article` + `article:published_time` + 썸네일 `og:image`.
- `dist/404.html` 존재, 로컬 프리뷰에서 미지 경로 HTTP 404 / 알려진 라우트 200.
- `vercel.json` www→apex 308.
- `grep -r "images.unsplash.com\|picsum.photos" src/` 결과가 색인 대상 글에서 0.
- claude-seo 재실행(`raw/` 재생성) diff로 대상 발견사항 resolved 확인.
