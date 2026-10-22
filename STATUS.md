# Status | 마지막: 2026-10-22

## 현재 작업
AdSense 신청 준비. 핸드오프 남은 과제(링크·소제목·청크 분리) 완료.

## 최근 변경 (최근 5개만)
- 10-22: 글 본문을 글별 파일로 분리 로드(글 1편당 440~628KB 청크 → 약 13KB)
- 10-22: 편집 글 132편 범용 소제목 211개에 주제어 추가(5회 이상 반복 소제목 0개)
- 10-22: 외부 링크 없던 편집 글 23편에 공식·표준 참고 링크 추가(`editorial-external-sources.json`)
- 10-22: PR #17 신뢰 페이지 4종(/about·/contact·/privacy·/terms) 정적 HTML을 SSR로 교체
- 10-22: PR #15 빌드 수정(`node_modules/.cache` 미생성 시 ENOENT)

## TODO
- [ ] `postMetadata` 번들(368KB) 경량화 검토 — 글 페이지에서 로드 확인
- [ ] (사용자) AdSense CMP 설정·GSC 색인 상태 확인
- [ ] Bing IndexNow 403 재확인

## 결정사항
- 배포는 `main` 머지가 아니라 `Scheduled publish` deploy hook으로만
- 운영 canonical은 `https://www.spinkorea.kr` 유지
- `source: generated` 글은 데이터 보존, 정적 HTML 미생성(404)
- 9월 편집 글 본문은 `editorial-drafts-*.json` 원본 + `extend-editorial-schedule.mjs` 재실행으로 반영(직접 수정 금지)
- 외부 참고 링크는 본문에만 추가, `primarySourceUrl`은 검증기 허용 도메인 유지

## 주의
- 배포 hook URL 출력 금지, GitHub Secret으로만 사용
- 신뢰 페이지 4종 정적 HTML은 React SSR 결과(실패 시 고정 문단 폴백)
- 빌드 시 `public/{sitemap,rss,llms}`·`post-metadata*.json` 변경은 의도치 않은 것 → 되돌릴 것
- 글 본문 로드는 `src/data/article-cache/`(빌드·predev 시 `split-article-chunks.mjs`로 생성, git 제외) 기준
