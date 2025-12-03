# SpinFlow v1.1

클라이언트 사이드 결정 룰렛 웹 애플리케이션

## 기능

- 🎯 공정한 난수 기반 룰렛 스핀
- 📱 모바일 우선 반응형 디자인
- 🔗 URL 기반 상태 공유
- 💾 localStorage 자동 저장
- 🎨 네온 느와르 다크 테마
- ♿ 접근성 지원 (키보드, 스크린 리더)
- 🎉 Confetti 효과
- 📊 SEO 최적화

## 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- lz-string
- canvas-confetti
- Cloudflare Pages + Workers + D1

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

## 클라우드플레어 배포

### 1. D1 데이터베이스 생성

```bash
npm run db:create
```

생성된 데이터베이스 ID를 `wrangler.toml`의 `database_id`에 입력합니다.

### 2. 데이터베이스 마이그레이션

```bash
npm run db:migrate
```

### 3. 빌드 및 배포

```bash
npm run deploy
```

또는 Cloudflare Pages 대시보드에서 GitHub 연동 후 자동 배포 설정:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `.`

## 프로젝트 구조

```
├── src/
│   ├── components/     # React 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── utils/         # 유틸리티 함수
│   ├── styles/        # 전역 스타일
│   └── types/         # TypeScript 타입
├── functions/         # Cloudflare Workers Functions
│   ├── api/           # API 엔드포인트
│   └── _middleware.ts # 미들웨어
├── db/                # D1 데이터베이스 스키마
└── wrangler.toml      # Cloudflare 설정
```

## 주요 특징

### 공정한 난수 생성

- `crypto.getRandomValues()` 사용
- 모듈로 편향 제거 (rejection sampling)
- 각 항목 동일 확률

### 상태 관리

- URL 쿼리 파라미터 `s`에 lz-string 압축 상태 저장
- localStorage에 최근 상태 및 결과 저장
- URL 길이 경고 (1,800자) 및 비권장 (2,000자)

### 애니메이션

- Framer Motion 물리 기반 회전
- 3-7초 회전 시간
- 최소 3바퀴 회전
- 당첨 섹터 강조 (글로우 효과)

## 라이선스

MIT

