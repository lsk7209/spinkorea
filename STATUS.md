# Status | 마지막: 2026-10-22

## 현재 작업
AdSense 신청 준비. 핸드오프 남은 과제(링크·소제목·청크 분리) 완료.

## 최근 변경 (최근 5개만)
- 10-22: 런타임 글 메타데이터에서 비공개 생성 글 제외(postMetadata 번들 377KB → 193KB)
- 10-22: 글 본문을 글별 파일로 분리 로드(글 1편당 440~628KB 청크 → 약 13KB)
- 10-22: 편집 글 132편 범용 소제목 211개에 주제어 추가(5회 이상 반복 소제목 0개)
- 10-22: 외부 링크 없던 편집 글 23편에 공식·표준 참고 링크 추가(`editorial-external-sources.json`)
- 10-22: PR #17 신뢰 페이지 4종(/about·/contact·/privacy·/terms) 정적 HTML을 SSR로 교체

## TODO
- [ ] (사용자) AdSense CMP 설정 확인 (EEA 트래픽 여부)
- [ ] GSC 색인: 사이트맵 408 URL 제출·오류 0, 그러나 /about·도구·일부 글이 '발견됨-색인 안 됨'(10-22 조회) → 1~2주 후 재조회
- [ ] (사용자) `cs@spinkorea.kr` 수신 불가(MX·TXT 없음, DNS는 hosting.co.kr) — 호스팅 메일 포워딩 또는 Zoho 등 MX 추가, 아니면 수신 가능한 주소로 교체
- [ ] (사용자) Bing Webmaster Tools 사이트 인증(GSC 가져오기 가능) — IndexNow 403 원인 `UserForbiddedToAccessSite`, 키 파일은 정상

## 결정사항
- 배포는 `main` 머지가 아니라 `Scheduled publish` deploy hook으로만
- 운영 canonical은 `https://spinkorea.kr`(www는 308로 apex 리다이렉트, 10-22 확인)
- `source: generated` 글은 데이터 보존, 정적 HTML 미생성(404)
- 9월 편집 글 본문은 `editorial-drafts-*.json` 원본 + `extend-editorial-schedule.mjs` 재실행으로 반영(직접 수정 금지)
- 외부 참고 링크는 본문에만 추가, `primarySourceUrl`은 검증기 허용 도메인 유지

## 주의
- 배포 hook URL 출력 금지, GitHub Secret으로만 사용
- 신뢰 페이지 4종 정적 HTML은 React SSR 결과(실패 시 고정 문단 폴백)
- 빌드 시 `public/{sitemap,rss,llms}`·`post-metadata*.json` 변경은 의도치 않은 것 → 되돌릴 것
- 글 본문 로드는 `src/data/article-cache/`(빌드·predev 시 `split-article-chunks.mjs`로 생성, git 제외) 기준
