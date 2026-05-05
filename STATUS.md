# Status | 마지막: 2026-05-06

## 현재 작업
예약 콘텐츠 600개 제목/본문 품질 보강 완료. 조사 오류, 메타 설명 반복, FAQ 스키마를 개선.

## 최근 변경 (최근 5개만)
- 05-06: 생성 설명문 600개 전부 고유화, 기존 반복 설명 템플릿 0건
- 05-06: 생성 본문 조사 처리 보강(`은/는`, `을/를`, `과/와`, `이/가`)
- 05-06: 생성 글 상세에 FAQPage JSON-LD 추가
- 05-06: content validate/lint/build 및 브라우저 QA 통과
- 05-06: `generatedContent` 청크 732KB 경고 유지

## TODO
- [ ] Bing Webmaster Tools IndexNow 403 재확인
- [ ] AdSense OAuth 인증 후 `npm run audit:adsense -- --code=...` 재실행
- [ ] GSC sitemap 발견 URL 갱신 상태 확인
- [ ] `generatedContent` 청크 732KB 추가 분할 검토

## 결정사항
- WordPress 아님: 플러그인/테마 최적화 대상 없음
- 예약 발행: 2026-05-05 18:00 KST부터 5시간 간격 유지
- 마지막 예약 글: 2026-09-07 13:00 KST
- 생성 글 SEO: BlogPosting + FAQPage JSON-LD를 함께 출력

## 주의
- 배포 hook URL 출력 금지, GitHub Secret으로만 사용
- GSC URL-prefix 속성은 `https://spinkorea.kr/sitemap.xml` 제출만 API 처리 가능
- Bing IndexNow 403은 optional warning으로 유지 중
