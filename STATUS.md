# Status | 마지막: 2026-05-06

## 현재 작업
생성글 데이터 청크 분할 완료. 생성글 상세는 해당 slug가 들어있는 청크만 동적 로드.

## 최근 변경 (최근 5개만)
- 05-06: `generatedContent` 732KB 단일 청크를 38KB 렌더러 + 10개 데이터 청크로 분할
- 05-06: 생성글 slug별 매니페스트와 `generated-content-chunks/*.json` 생성
- 05-06: 생성글 상세에서 필요한 데이터 청크만 동적 로드하도록 변경
- 05-06: chunk-01/chunk-10 샘플 브라우저 QA 통과
- 05-06: content validate/lint/build 통과, 500KB 청크 경고 제거

## TODO
- [ ] Bing Webmaster Tools IndexNow 403 재확인
- [ ] AdSense OAuth 인증 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap 발견 URL 갱신 상태 확인
- [ ] GitHub Actions Node.js 20 deprecation 경고 대응

## 결정사항
- WordPress 아님: 플러그인/테마 최적화 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-09-07 13:00 KST
- 생성 글 SEO: BlogPosting + FAQPage JSON-LD를 함께 출력
- 생성 글 성능: 본문 데이터는 60개 단위 JSON 청크로 분리

## 주의
- 배포 hook URL 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API 처리 가능
- Bing IndexNow 403은 optional warning으로 유지 중
