# Status | 마지막: 2026-05-05

## 현재 작업
200개 예약 글 생성/품질 보강/자동 발행 검증 완료. GitHub Actions 예약 발행 workflow 수동 실행 성공.

## 최근 변경 (최근 5개만)
- 05-05: GitHub Actions `Scheduled publish` 수동 실행 성공, Vercel/GSC/Naver IndexNow 단계 통과
- 05-05: IndexNow 키 파일을 BOM/개행 없는 32바이트 파일로 정규화, 커밋 `81b68ec` 배포
- 05-05: 라이브 sitemap 92개 URL, 최신 lastmod 2026-05-05 확인 후 GSC에 92개 제출
- 05-05: GSC sitemap 제출 스크립트와 예약 발행 workflow Google 알림 단계 추가
- 05-05: GSC notify 스크립트 비www/www/sc-domain 속성 후보 매칭으로 보정

## TODO
- [x] GitHub Secret `GOOGLE_SERVICE_ACCOUNT_JSON` 등록 후 scheduled-publish에서 GSC 제출 확인
- [x] GitHub Secret `VERCEL_DEPLOY_HOOK_URL` 등록 후 scheduled-publish 자동 배포 확인
- [ ] Bing Webmaster Tools에서 사이트 소유권/XML 인증 확인 후 Bing IndexNow 403 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap `isPending` 해소 및 발견 URL 수 갱신 확인

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: `publishAt` ISO KST 기준으로 공개 여부 판단
- 사이트맵 날짜: 정적 페이지는 명시 lastmod, `/blog`는 최신 공개 글 날짜 사용
- Google 알림: URL별 강제 색인 대신 Search Console sitemap submit/list API 사용
- 예약 글: 2026-05-05 18:00 KST부터 5시간 간격, 마지막 2026-06-16 05:00 KST
- IndexNow: Naver는 200 성공, Bing은 키 파일 정상 접근에도 403으로 BWT 소유권 확인 필요

## 주의
- 배포 훅 URL은 외부 노출 금지, GitHub Secret으로만 저장 필요
- `npm run notify:google` 결과는 `google-audit-output/gsc-sitemap-submit.json`에 기록됨
- `gh` 미로그인 상태라 GitHub Secrets 자동 등록은 못 함
