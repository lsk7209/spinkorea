# Status | 마지막: 2026-05-05

## 현재 작업
200개 예약 글 생성/품질 보강/자동 발행 검증 완료. 라이브 배포 연결 대기.

## 최근 변경 (최근 5개만)
- 05-05: GSC sitemap 제출 스크립트와 예약 발행 workflow Google 알림 단계 추가
- 05-05: GSC notify 스크립트 비www/www/sc-domain 속성 후보 매칭으로 보정
- 05-05: 서비스 계정 siteOwner 확인 후 `https://spinkorea.kr/sitemap.xml` GSC API 제출 성공
- 05-05: 제목 카니발리제이션 위험 2건 조정, 생성 본문 조사/CTA 문구 보강
- 05-05: 기존 제목 76개와 중복 없는 예약 글 200개 생성, 품질 점수 최소 91 검증

## TODO
- [ ] Vercel 프로젝트 링크 또는 `VERCEL_DEPLOY_HOOK_URL` 등록 후 라이브 sitemap 재확인
- [ ] GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON` 등록 후 scheduled-publish에서 GSC 제출 확인
- [ ] Naver Search Advisor 사이트 등록/소유 확인 후 IndexNow 403 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap `isPending` 해소 및 발견 URL 수 갱신 확인

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: `publishAt` ISO KST 기준으로 공개 여부 판단
- 사이트맵 날짜: 정적 페이지는 명시 lastmod, `/blog`는 최신 공개 글 날짜 사용
- Google 알림: URL별 강제 색인 대신 Search Console sitemap submit/list API 사용
- 예약 글: 2026-05-05 18:00 KST부터 5시간 간격, 마지막 2026-06-16 05:00 KST

## 주의
- 현재 Vercel CLI에 프로젝트 링크가 없어 로컬 수정분을 직접 배포하지 못함
- 라이브 sitemap은 아직 구버전 캐시일 수 있으므로 배포 후 재검증 필요
- `npm run notify:google` 결과는 `google-audit-output/gsc-sitemap-submit.json`에 기록됨
- `gh` 미로그인 상태라 GitHub Secrets 자동 등록은 못 함
