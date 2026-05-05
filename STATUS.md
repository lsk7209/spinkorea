# Status | 마지막: 2026-05-06

## 현재 작업
예약 콘텐츠 200개 추가 완료. 기존 생성글 400개는 보존했고 총 600개 예약글로 확장.

## 최근 변경 (최근 5개만)
- 05-06: `generated-401~600` 신규 예약글 200개 추가
- 05-06: 기존 400개 `id/title/slug/publishAt` 변경 0건 확인
- 05-06: 신규 첫 글 `generated-401`은 2026-07-28 02:00 KST
- 05-06: 신규 마지막 글 `generated-600`은 2026-09-07 13:00 KST
- 05-06: content validate/lint/build/브라우저 QA 통과, 생성글 청크 727KB 경고 확인

## TODO
- [ ] Bing Webmaster Tools IndexNow 403 키 검증 상태 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap `isPending` 해소와 발견 URL 갱신 확인
- [ ] 600개 기준 `generatedContent` 청크 727KB 추가 분할 검토

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-09-07 13:00 KST
- 블로그 성능: 목록은 메타만, 상세 본문은 필요할 때만 로드

## 주의
- 배포 hook URL은 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API 처리 가능
- Bing IndexNow 403은 optional warning 유지 중
