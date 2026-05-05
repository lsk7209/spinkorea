# Status | 마지막: 2026-05-05

## 현재 작업
기존 200개 예약 글을 보존하고 새 200개를 추가 생성 완료. 총 400개 강화 검증과 대표 5개 브라우저 QA 통과.

## 최근 변경 (최근 5개만)
- 05-05: 새 예약 글 200개 추가, 총 400개로 확장
- 05-05: 기존 200개 보존 확인, 새 첫 글 `generated-201`은 2026-06-16 10:00 KST
- 05-05: 새 마지막 글 `generated-400`은 2026-07-27 21:00 KST
- 05-05: content validate 400개 기준으로 갱신, 최소 품질 점수 88 확인
- 05-05: 대표 5개 글 브라우저 QA 통과, posts 청크 721KB 빌드 경고 확인

## TODO
- [ ] Bing Webmaster Tools에서 IndexNow 403 반영 지연 또는 키 검증 상태 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] 발행 후 GSC sitemap `isPending` 해소와 발견 URL 갱신 확인

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-07-27 21:00 KST
- 품질 게이트: 제목/출처/렌더러 구조/조사 오류/유사 제목까지 차단

## 주의
- 배포 훅 URL은 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API에서 처리 가능
- Bing IndexNow는 BWT 등록 후에도 403이 남을 수 있어 optional warning 유지
- 글 데이터 400개로 `posts` 청크가 721KB로 커짐. 다음 속도 개선 때 코드 스플리팅 검토 필요
