# SEO 감사 조치 — 변경 상세 (2026-08-28)

감사: `seo-audit-2026-08.md`. 커밋·푸시·배포 없음. `npm run build` + 검증 6종 통과.

## 파일별 변경

### `scripts/generate-assets.mjs` (정적 프리렌더)
- `injectHtml()`: 라우트별 `og:type`(블로그 글 `article`, 그 외 `website`), `og:image`/`twitter:image`를
  `route.image`(글 썸네일 절대 URL)로, `og:image:width/height/alt` 추가, `article:published_time`/
  `article:modified_time`/`article:author`(글만). 관련 태그 strip 정규식도 추가.
- `writeDistAssets()` `postRoutes`: `ogType/image/articlePublishedTime/articleModifiedTime` 전달,
  `BlogPosting` 그래프에 `@id`·`mainEntityOfPage`·`image`(ImageObject)·Organization `logo` 추가.
- `structuredDataForPage()`: 도구 `WebApplication`·`WebPage`에 `dateModified`(= `page.lastmod`).
- `renderToolGuide()`: 정적 도구 안내에 "페이지 업데이트: <time>" 노출.
- **`write404Html()` 신규**: `dist/404.html` 생성(noindex, canonical 제거, 브랜드 본문). `writeDistAssets`에서 호출.

### `src/components/SEO.tsx` (런타임 head)
- `SEOProps`에 `ogType`·`articlePublishedTime`·`articleModifiedTime` 추가.
- `og:type`를 하드코딩 `"website"` → `ogType` prop. `article:*` 메타를 조건부 set/remove.
- `useEffect` 의존성 배열에 신규 prop 3개 추가.

### `src/pages/BlogPost.tsx` (런타임)
- `<SEO>`에 `ogType="article"` + `articlePublishedTime`/`articleModifiedTime` 전달.
- `blogPostingStructuredData`: `@id`, `image`를 ImageObject로, `author`/`publisher`를 `#organization` 참조로 정리.
- 본문 히어로 `<img>`에 `width/height`(1600×900) + `fetchPriority="high"`.

### `src/components/ToolLayout.tsx` (런타임, 도구 공통)
- `site-pages.json`에서 현재 경로 `lastmod` 조회 → `WebApplication.dateModified`(런타임 JSON-LD 정합) +
  화면 하단 "페이지 업데이트" 노출.

### `src/pages/BlogIndex.tsx`
- 글 카드 `<Link>`에 `aria-label={post.title}` (a11y: 이름 없는 링크 12개 해소).
- 카드 `<img>`에 `width/height`(1600×900, CLS).

### `src/pages/tools/LottoGenerator.tsx`
- 게임 수 증감 아이콘 버튼 2개에 `aria-label`.

### `index.html`
- 파비콘: `og-image.png`(885 KB) → `favicon-32.png`/`favicon-48.png`. `apple-touch-icon` → `apple-touch-icon.png`(180²).
- `preconnect`(googlesyndication, unsplash) + `dns-prefetch`(GTM).
- `og:image:width/height/alt`(1024²) 추가.
- **Speculation Rules** `<script type="speculationrules">` — same-origin 문서 `prefetch`, `eagerness: moderate`.

### `public/manifest.json`
- 아이콘: `og-image.png`(잘못된 512 선언) → `icon-192.png` + `icon-512.png`(정확한 크기), `purpose` `any`/`maskable` 분리.

### `public/` 신규 아이콘 (기존 `og-image.png`에서 PIL 리사이즈·양자화, 외부 생성 아님)
`favicon-32.png` 1.9 KB · `favicon-48.png` 3.2 KB · `apple-touch-icon.png` 27 KB ·
`icon-192.png` 30 KB · `icon-512.png` 169 KB.

### `vercel.json`
- **catch-all rewrite `/((?!api/).*) → /index.html` 제거** (soft-404 원인).
- `redirects`: `www.spinkorea.kr` → `https://spinkorea.kr` `permanent`(308).
- `rewrites`: `/s/:id → /api/s/:id`(단축 링크 복구), `/spinflow-standalone`·`/spinflow/:slug → /index.html`(SPA).
- content 라우트 명시 rewrite 제거 — Vercel 파일시스템 해석이 `dist/<path>/index.html`을 처리(라이브
  `/tools/lotto-generator`가 프리렌더 파일로 서빙됨을 감사에서 확인).

### `scripts/audit-adsense-readiness.mjs`
- 낡은 단언 `return post.source === "curated";` → `curated || editorial`(현재 `postMetadata.ts`와 일치).

## 검증 (모두 통과)

```
npm run type-check              PASS
npm run build                   PASS (627 페이지 렌더, dist/404.html 생성)
npm run verify:growth           PASS 24/24
node scripts/verify-search-scope.mjs   PASS 13/13
node scripts/audit-adsense-readiness.mjs   PASS
npm run content:validate        PASS (650 plans, 50 approved editorial, similarity 0.235)
```

로컬 정적 서버: 알려진 라우트 200, 미지 라우트 404. (claude-seo 스크립트는 localhost SSRF 차단으로 재감사 불가 → 배포 후.)
