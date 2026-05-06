# Status | 마지막: 2026-05-06

## 현재 작업
GSC 실제 노출 키워드 기준 메인 페이지 SEO 스니펫 개선 완료.

## 최근 변경 (최근 5개만)
- 05-06: 메인 title/description/H1을 `온라인 룰렛`, `무료 룰렛`, `스핀 돌리기` 노출 쿼리 기준으로 개선
- 05-06: 2026-05-06 09:00 KST 예약글 `weighted-choice-rule`이 sitemap/RSS/llms에 포함
- 05-06: GSC sitemap API 재제출 성공, submitted URL 96 / warnings 0 / errors 0 확인
- 05-06: IndexNow HOST를 env로 오버라이드 가능하게 변경, 기본값은 운영 canonical `www.spinkorea.kr`
- 05-06: robots.txt Sitemap을 운영 canonical `https://www.spinkorea.kr/sitemap.xml`로 정렬

## TODO
- [ ] Bing Webmaster Tools IndexNow 403은 BWT IndexNow 탭에서 사이트 권한/수신 로그 재확인
- [ ] AdSense OAuth 인증 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap 발견 URL 갱신 상태 확인
- [ ] GitHub Actions Node.js 20 deprecation 경고 대응

## 결정사항
- WordPress 아님: 플러그인/테마 최적화 대상 없음
- 운영 canonical은 현재 Vercel 리다이렉트 기준에 맞춰 `https://www.spinkorea.kr` 유지
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-09-07 13:00 KST
- 생성 글 SEO: BlogPosting + FAQPage JSON-LD를 함께 출력
- 생성 글 성능: 본문 데이터는 60개 단위 JSON 청크로 분리

## 주의
- 배포 hook URL 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API 처리 가능하나 실제 운영 canonical은 www
- Bing IndexNow 403은 optional warning으로 유지 중, Naver IndexNow는 200 확인
