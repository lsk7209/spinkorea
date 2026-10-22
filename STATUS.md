# Status | 마지막: 2026-10-22

## 현재 작업
AdSense 신청 준비. 편집 글 외부 참고 링크 보강 배포 중.

## 최근 변경 (최근 5개만)
- 10-22: 외부 링크 없던 편집 글 23편에 공식·표준 참고 링크 추가(`editorial-external-sources.json`)
- 10-22: PR #17 신뢰 페이지 4종(/about·/contact·/privacy·/terms) 정적 HTML을 SSR로 교체
- 10-22: PR #15 빌드 수정(`node_modules/.cache` 미생성 시 ENOENT)
- 10-22: PR #14 미검토 생성 글 376편 비공개(404), 404 화면 AdSense 제거, 연락처 `cs@spinkorea.kr` 통일
- 10-22: 도구 51종 정적 HTML SSR 교체, 핵심 도구 10종 계산 방식 해설 추가

## TODO
- [ ] 콘텐츠 청크(450~640KB) 분리 — 생성 파이프라인 변경 필요
- [ ] 편집 글 범용 소제목("정리" 32, "흔한 실수" 31) 주제어 포함으로 개선
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
- `/about` 운영 정보·푸터 이메일은 정적 HTML이 아닌 React 렌더(브라우저에서 확인)
- 빌드 시 `public/{sitemap,rss,llms}`·`post-metadata*.json` 변경은 의도치 않은 것 → 되돌릴 것
