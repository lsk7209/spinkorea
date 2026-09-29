# SpinFlow (SpinKorea)

`https://spinkorea.kr` — 무료 온라인 룰렛과 생활·개발·계산 웹 유틸리티. 브랜드 정본은 **SpinFlow**, 도메인 연결 이름은 **SpinKorea**.

## 현재 기준 (2026-09-29)

- 호스팅: **Vercel** (GitHub `main` push 시 연결된 Git 통합이 자동 배포). 설정은 `vercel.json`.
- 서버 API: `api/*.ts` Vercel Functions + `@libsql/client`(Turso). 현재 프런트엔드는 이 API를 호출하지 않는다. 위험 분석: `docs/spk2/api-threat-model-20260929.md`.
- 과거 Cloudflare Pages/D1 설명(`db/`, 구 README)은 이력이며 현재 배포 경로가 아니다.
- 예약 글은 `.github/workflows/scheduled-publish.yml`이 빌드 시점 기준으로 공개한다. 빌드는 `public/{sitemap.xml,rss.xml,llms.txt}`와 메타데이터 캐시를 다시 생성한다.

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion · React Router · lz-string · canvas-confetti · react-ga4

## 로컬 실행

```bash
npm ci            # lockfile 기준 설치
npm run dev       # 개발 서버
npm run build     # 정적 자산 생성 → tsc → vite build → 글 렌더 → dist 정적 HTML
npm run preview   # 빌드 결과 미리보기
```

환경 변수 예시는 `.env.example`. 로컬 개발에 비밀 값은 필요 없다.

## 검증

| 명령 | 내용 | 외부 쓰기 |
|---|---|---|
| `npm run type-check` | `tsc --noEmit` (`npm run lint`도 현재 같은 명령이다 — 별도 린터가 아님) | 없음 |
| `npm test` | `tests/*.test.mjs` 단위·계약 테스트 (Node 내장 `node:test`, Node 22.6+/24 권장: `.ts` 직접 import) | 없음 |
| `npm run test:api-harness` | API 핸들러 모의 실행(`@libsql/client` mock, 네트워크 없음) | 없음 |
| `npm run verify:browser` | 로컬 Vite + Playwright 브라우저 회귀(외부 요청 차단, 클립보드 mock). 사용자 수준 `@playwright/cli` 또는 `PLAYWRIGHT_MODULE` 필요 | 없음 |
| `npm run verify:local` | type-check → test → api-harness → 기존 verify 스크립트 → content:validate → build → 빌드 산출물 검사 → growth → search-scope | 없음 (로컬 `public/`·`dist/` 재생성) |

배포·색인 관련 명령(`notify:google`, `notify:indexnow`)은 외부로 전송하므로 로컬 QA 묶음에 포함하지 않는다.

## 배포와 원복

1. 기능 브랜치에서 `npm run verify:local`, `npm run verify:browser` 통과.
2. PR 리뷰 후 `main` merge → Vercel 자동 배포. 배포 ID·SHA·시각을 `docs/HANDOFF.md`에 기록.
3. 배포 후 확인: 주요 경로 200, 미지 경로(예: `/spinflow/audit-nonexistent-example`) 404, canonical/robots.
4. 원복: 문제 커밋을 `git revert` 후 push(강제 push·reset 금지) 또는 Vercel 대시보드에서 직전 배포로 promote.

## 구조

```
src/
  pages/        페이지 (Home = 룰렛, tools/*, Blog*)
  components/   UI 컴포넌트
  hooks/        use-roulette, use-state-persistence, use-modal-dialog …
  utils/        draw-controller, url-state, roulette-storage, share, analytics …
  data/         site-pages.json, 콘텐츠·메타데이터 캐시
api/            Vercel Functions (shorten, stats, s/[id])
scripts/        생성기(generate-assets.mjs, lib/metadata-merge.mjs)와 verify-* 스크립트
tests/          node:test 테스트
docs/           감사·QA·인계 문서 (docs/HANDOFF.md가 최신 인계)
```

## 동작 계약 요약

- **추첨:** `crypto.getRandomValues()` + rejection sampling으로 각 항목 동일 확률. 중복 이름은 별개 항목으로 계산된다. 후보가 바뀌면 현재 결과·하이라이트·결과 공유가 초기화되고 기록은 유지된다.
- **공유:** URL `?s=`에는 lz-string으로 압축한 후보 목록만 담긴다(결과 미포함, 암호화 아님). 복원은 v1, 1–100개, 항목당 1–50자(UTF-16)만 허용하며 위반 시 전체 거부 후 안내한다.
- **분석:** GA4 이벤트에 후보·결과·입력 원문·`s` 값을 보내지 않는다(`sanitizeEventParams`).
- **메타데이터:** 재빌드 시 slug·최초 발행일·예약 시각·검토 상태는 보존하고, 원본에서 바뀐 제목·설명·태그만 반영하며 그때만 `updatedAt`을 기록한다.

## 라이선스

MIT
