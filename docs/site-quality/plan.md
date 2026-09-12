# SpinKorea/SpinFlow 품질 개선 계획 (2026-09-12)

## 저장소 확인
- 저장소는 spinkorea.kr / SpinFlow(23_spinflow) 맞음. React + TypeScript + Vite, Tailwind, Framer Motion.
- 배포는 Vercel(`.vercel/`, `vercel.json`, `api/*.ts` Vercel Functions)이다. `README.md`가 "Cloudflare Pages + Workers + D1"로 서술하는 것은 실제와 다른 개발 문서 오류(P2, 사용자 비노출 문서).
- 이전 세션들이 `PROJECT_STATE.md`, `docs/seo-audit/`, `STATUS.md`, `docs/HANDOFF.md`에 2026-05~08월 사이 다수의 SEO/신뢰성 감사·수정을 이미 기록해 두었다. 이번 작업은 그 위에서 **재확인 후 실제로 남아있는 문제만** 다룬다. 과거 감사가 "이미 고쳤다"고 적은 항목을 재차 고친 것처럼 보고하지 않는다.

## 이번 세션 범위 (16절 전체가 아니라 지시문 마지막 문단 기준)
지시문은 "plan.md/tasks.md에 짧은 계획을 기록한 뒤 URL 감사와 안전한 P0/P1 수정부터 실제로 진행하라"고 명시한다. 명세 전체(16절)를 한 세션에 완결할 수 없으므로 아래를 이번 세션의 실제 완료 목표로 삼는다.

1. 실제 라우트/사이트맵/블로그 데이터로 URL 감사표(`url-audit.csv`) 작성 — 과거 "51개 도구, 80개 글" 참고값을 코드로 재확인.
2. 코드 리뷰로 발견된 CONFIRMED 문제 중 안전하게 고칠 수 있는 것을 실제로 수정하고 dev 서버 + 브라우저로 검증.
3. 나머지(전수 블로그 팩트체크 651편, 51개 도구 전수 브라우저 실행, 라이브 운영 사이트 HTTP 재확인, 광고/동의관리 계정 확인 등)는 `tasks.md`에 실행 가능한 다음 작업으로 남긴다.

## 변경 원칙 준수
- 브랜드(SpinFlow)·도메인·프레임워크·배포 방식을 바꾸지 않는다.
- 이메일 등 확인되지 않은 운영자 정보를 새로 만들지 않는다.
- noindex/robots 차단을 콘텐츠 품질 문제를 가리는 용도로 쓰지 않는다.
- git push, 운영 배포, 계정 설정 변경은 하지 않는다(로컬 커밋 이하만).

## 검증 방법
- `npm run dev`로 로컬 서버를 띄우고 chrome-devtools MCP로 실제 페이지 렌더링·콘솔 오류·표시값을 확인한다.
- `tsc`/`lint`/`build` 직접 실행은 세션 훅 정책상 금지되어 있으므로, 응답 종료 시 자동 Stop hook의 결과를 최종 상태로 삼는다(이 사실을 최종 보고서에 명시한다).
