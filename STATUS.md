# Status | 마지막: 2026-05-05

## 현재 작업
200개 예약 글 제목·메타·본문 템플릿 재생성 완료. 강화 검증과 대표 5개 브라우저 QA 통과.

## 최근 변경 (최근 5개만)
- 05-05: 제목 템플릿을 20종으로 늘리고 조사/반복 오류 후처리 추가
- 05-05: 본문 렌더러에 5종 문맥 섹션 로테이션 추가
- 05-05: content validate에 금지 문구, 제목 유사도, 조사 오류 차단 규칙 추가
- 05-05: 200개 예약 글 재생성, 최소 품질 점수 88 확인
- 05-05: IndexNow 키 `d805...9fb4` 배포, Naver 200/Bing 403 확인

## TODO
- [ ] Bing Webmaster Tools에서 IndexNow 403 반영 지연 또는 키 검증 상태 재확인
- [ ] AdSense OAuth 승인 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] 발행 후 GSC sitemap `isPending` 해소와 발견 URL 갱신 확인

## 결정사항
- WordPress 아님: 플러그인/테마 정리는 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-06-16 05:00 KST
- 품질 게이트: 제목/출처/렌더러 구조/조사 오류/유사 제목까지 차단

## 주의
- 배포 훅 URL은 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API에서 처리 가능
- Bing IndexNow는 BWT 등록 후에도 403이 남을 수 있어 optional warning 유지
