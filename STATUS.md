# Status | 마지막: 2026-05-06

## 현재 작업
블로그 성능 최적화 진행. 목록/SEO는 메타데이터만 로드하고, 상세 본문은 생성글/기존글 소스별로 지연 로드하도록 변경.

## 최근 변경 (최근 5개만)
- 05-06: `post-metadata.generated.json` 생성 파이프라인 추가
- 05-06: `/blog` 목록에서 무거운 본문 번들 import 제거
- 05-06: `/blog/:slug` 상세 본문을 동적 import로 분리
- 05-06: 기존 `posts` 721KB 단일 청크를 `posts` 231KB, `generatedContent` 489KB, 메타 230KB로 분리
- 05-06: lint/build 및 브라우저 QA 통과

## TODO
- [ ] Bing Webmaster Tools IndexNow 403 키 검증 상태 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap `isPending` 해소와 발견 URL 갱신 확인
- [ ] 메타데이터 230KB 추가 축소 검토

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-07-27 21:00 KST
- 블로그 성능: 목록은 메타만, 상세 본문은 필요할 때만 로드

## 주의
- 배포 hook URL은 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API 처리 가능
- Bing IndexNow 403은 optional warning 유지 중
