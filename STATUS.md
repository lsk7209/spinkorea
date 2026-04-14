# Status | 마지막: 2026-04-14

## 현재 작업
Cloudflare → Vercel + Turso 마이그레이션 완료. 빌드 통과.

## 최근 변경 (최근 5개)
- 04-14: Cloudflare(wrangler/D1/Workers) 제거 → Vercel + Turso 전환
- 04-14: api/shorten.ts, api/stats.ts, api/s/[id].ts (Vercel 서버리스) 생성
- 04-14: App.tsx — 12개 툴 라우트 추가, /spinflow 라우트, 404(NotFound) 추가
- 04-14: MoreTools.tsx — 24개 툴 전체 표시 (기존 12개 → 24개)
- 04-14: use-roulette.ts 타이밍 버그 수정 (3-7s 랜덤 → 5s 고정)

## TODO
- [ ] Vercel 프로젝트 연결 (vercel.com → GitHub import)
- [ ] Turso DB 생성 후 환경변수 설정 (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
- [ ] DB 마이그레이션 실행 (db/schema.sql → Turso)
- [ ] GA4 측정 ID 설정 (src/main.tsx — G-XXXXXXXXXX 교체)
- [ ] 번들 크기 최적화 (현재 901KB — dynamic import 적용 권장)

## 결정사항
- 단축 URL 경로: /{id} → /s/{id} (SPA 라우팅 충돌 방지)
- Turso 미설정 시 URL 단축/통계 API graceful 비활성화

## 주의
- .env.example 참고하여 .env.local 생성 필요
- Vercel 환경변수에 TURSO_DATABASE_URL, TURSO_AUTH_TOKEN 등록 필요
