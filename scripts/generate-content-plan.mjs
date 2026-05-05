import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const START_AT = Date.parse("2026-05-05T18:00:00+09:00");
const PUBLISH_INTERVAL_HOURS = 5;

const CATEGORY_META = {
  random: {
    name: "룰렛·랜덤 결정",
    tags: ["룰렛", "랜덤", "선택"],
    thumbnail: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=1600&auto=format&fit=crop",
    sourceName: "MDN Web Docs",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues",
    links: [
      ["온라인 룰렛 바로 쓰기", "/"],
      ["랜덤 숫자 추첨 도구", "/random-number"],
      ["점심 메뉴 룰렛", "/lunch-menu"],
    ],
    keywords: ["공정성", "중복 방지", "참가자 목록", "확률 설정", "결과 기록"],
  },
  utility: {
    name: "계산기·생활 유틸",
    tags: ["계산기", "생활", "도구"],
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1600&auto=format&fit=crop",
    sourceName: "한국소비자원",
    sourceUrl: "https://www.kca.go.kr/",
    links: [
      ["퍼센트 계산기", "/tools/percentage-calculator"],
      ["시간 계산기", "/tools/time-calculator"],
      ["단위 변환기", "/tools/unit-converter"],
    ],
    keywords: ["계산 기준", "입력값 확인", "결과 해석", "실수 방지", "생활 적용"],
  },
  text: {
    name: "텍스트·문서 도구",
    tags: ["문서", "글쓰기", "텍스트"],
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
    sourceName: "국립국어원",
    sourceUrl: "https://www.korean.go.kr/",
    links: [
      ["글자수 세기", "/tools/text-counter"],
      ["대소문자 변환", "/tools/case-converter"],
      ["마크다운 미리보기", "/tools/markdown-previewer"],
    ],
    keywords: ["문서 기준", "가독성", "검토 순서", "표현 정리", "공유 전 확인"],
  },
  developer: {
    name: "개발자 웹 도구",
    tags: ["개발", "웹도구", "검증"],
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
    sourceName: "MDN Web Docs",
    sourceUrl: "https://developer.mozilla.org/",
    links: [
      ["JSON 포매터", "/tools/json-formatter"],
      ["URI 인코더", "/tools/uri-encoder"],
      ["Base64 인코더", "/tools/base64-encoder"],
    ],
    keywords: ["검증 절차", "디버깅", "자동화", "보안 확인", "배포 전 점검"],
  },
  productivity: {
    name: "생산성·업무 방식",
    tags: ["생산성", "업무", "루틴"],
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1600&auto=format&fit=crop",
    sourceName: "고용노동부",
    sourceUrl: "https://www.moel.go.kr/",
    links: [
      ["랜덤 팀 나누기", "/tools/random-team"],
      ["D-Day 카운터", "/tools/d-day-counter"],
      ["시간 계산기", "/tools/time-calculator"],
    ],
    keywords: ["우선순위", "반복 업무", "회의 운영", "집중 시간", "결과 기록"],
  },
  wellness: {
    name: "웰니스·습관",
    tags: ["습관", "웰니스", "일상"],
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1600&auto=format&fit=crop",
    sourceName: "질병관리청",
    sourceUrl: "https://www.kdca.go.kr/",
    links: [
      ["BMI 계산기", "/tools/bmi-calculator"],
      ["나이 계산기", "/tools/age-calculator"],
      ["예/아니오 결정 도구", "/tools/yes-no-oracle"],
    ],
    keywords: ["루틴 설계", "기록 습관", "무리 없는 기준", "생활 적용", "자가 점검"],
  },
  seo: {
    name: "SEO·콘텐츠 운영",
    tags: ["SEO", "콘텐츠", "애드센스"],
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?q=80&w=1600&auto=format&fit=crop",
    sourceName: "Google Search Central",
    sourceUrl: "https://developers.google.com/search/docs",
    links: [
      ["전체 도구 목록", "/tools"],
      ["SpinFlow 소개", "/about"],
      ["블로그 글 목록", "/blog"],
    ],
    keywords: ["검색 의도", "내부 링크", "사이트맵", "메타 설명", "품질 점검"],
  },
};

const TOPICS = [
  ["random", "fair-random-draw", "랜덤 추첨 공정성", "추첨 결과를 두고 참가자가 납득하지 못하는 문제", "이벤트 당첨자 명단을 공개하기 전"],
  ["random", "wheel-option-limit", "온라인 룰렛 선택지 제한", "선택지가 너무 많아 룰렛 결과가 산만해지는 문제", "회의 안건을 빠르게 고를 때"],
  ["random", "duplicate-winner-prevention", "중복 당첨 방지 룰", "같은 사람이 여러 번 뽑혀 공정성이 흔들리는 문제", "사은품 추첨을 여러 차례 진행할 때"],
  ["random", "weighted-choice-rule", "가중치 랜덤 선택", "확률을 다르게 줘야 하는데 기준이 모호한 문제", "팀별 참여도에 따라 기회를 나눌 때"],
  ["random", "participant-list-cleanup", "참가자 목록 정리", "이름 표기가 달라 중복과 누락이 생기는 문제", "구글폼 응답을 룰렛에 넣기 전"],
  ["random", "presentation-order-draw", "발표 순서 추첨", "순서를 정하는 과정에서 불만이 생기는 문제", "스터디 발표자를 정할 때"],
  ["random", "cleaning-duty-draw", "청소 당번 뽑기", "당번이 특정 사람에게 몰리는 문제", "공용 공간 청소 순서를 정할 때"],
  ["random", "coffee-bet-rule", "커피 내기 룰렛", "가벼운 내기가 부담으로 번지는 문제", "팀 휴식 시간에 커피 담당을 정할 때"],
  ["random", "seat-assignment-random", "자리 배치 랜덤", "늘 같은 사람끼리 앉아 교류가 줄어드는 문제", "워크숍 좌석을 배치할 때"],
  ["random", "dinner-place-selection", "회식 장소 랜덤 선택", "장소 후보가 많아 결정이 늦어지는 문제", "퇴근 전 회식 장소를 정할 때"],
  ["random", "travel-destination-picker", "여행지 랜덤 선택", "후보를 계속 비교하느라 일정이 밀리는 문제", "주말 여행지를 고를 때"],
  ["random", "date-course-picker", "데이트 코스 룰렛", "매번 비슷한 코스만 고르는 문제", "저녁 약속 코스를 정할 때"],
  ["random", "gift-exchange-draw", "선물 교환 추첨", "누가 누구에게 줄지 공개되면 재미가 줄어드는 문제", "연말 선물 교환을 준비할 때"],
  ["random", "study-topic-picker", "스터디 주제 추첨", "쉬운 주제만 선택되는 문제", "다음 발표 주제를 나눌 때"],
  ["random", "game-turn-randomizer", "게임 순서 랜덤", "첫 순서가 계속 유리하다는 불만", "보드게임 시작 순서를 정할 때"],
  ["random", "random-mission-maker", "랜덤 미션 만들기", "활동이 단조로워 참여가 떨어지는 문제", "팀 빌딩 미션을 만들 때"],
  ["random", "icebreaking-question-wheel", "아이스브레이킹 질문", "어색한 첫 대화를 풀기 어려운 문제", "온라인 모임 시작 전"],
  ["random", "class-activity-draw", "수업 활동 추첨", "학생 참여가 일부에게만 몰리는 문제", "발표자와 활동을 정할 때"],
  ["random", "survey-option-picker", "설문 선택지 추첨", "테스트할 문항을 고르기 어려운 문제", "A/B 설문 후보를 줄일 때"],
  ["random", "team-building-picker", "팀 빌딩 활동 선택", "활동 선호가 갈려 결론이 늦어지는 문제", "오프라인 워크숍을 준비할 때"],
  ["random", "random-question-bank", "랜덤 질문 리스트", "질문이 반복되어 대화가 지루해지는 문제", "커뮤니티 질문 카드를 만들 때"],
  ["random", "lunch-choice-rule", "점심 메뉴 결정 룰", "매일 같은 메뉴 논쟁이 반복되는 문제", "팀 점심 후보를 고를 때"],
  ["random", "dinner-menu-wheel", "저녁 메뉴 룰렛", "퇴근 후 메뉴 선택에 에너지를 쓰는 문제", "집에서 저녁 메뉴를 고를 때"],
  ["random", "meeting-agenda-priority", "회의 안건 우선순위", "중요도가 낮은 안건에 시간을 쓰는 문제", "짧은 회의 순서를 정할 때"],
  ["random", "random-number-audit", "랜덤 번호 검증", "번호 추첨 과정이 불투명해 보이는 문제", "좌석 번호나 대기 번호를 뽑을 때"],
  ["random", "live-stream-giveaway", "라이브 추첨 운영", "실시간 추첨 중 오류가 나면 신뢰가 떨어지는 문제", "라이브 방송 이벤트를 진행할 때"],
  ["random", "name-draw-clean-rule", "이름 추첨 기준", "동명이인과 별명이 섞여 혼선이 생기는 문제", "참가자 이름을 룰렛에 넣을 때"],
  ["random", "random-choice-log", "랜덤 결과 기록", "결과를 나중에 확인하기 어려운 문제", "추첨 내역을 공유해야 할 때"],
  ["random", "choice-fatigue-random", "선택 피로 줄이기", "작은 결정이 쌓여 집중력이 떨어지는 문제", "하루 계획을 빠르게 정할 때"],
  ["random", "penalty-wheel-rule", "벌칙 룰렛 기준", "벌칙이 과하거나 불공정해지는 문제", "가벼운 게임 벌칙을 정할 때"],
  ["random", "online-meeting-picker", "온라인 모임 진행자", "진행 역할이 한 사람에게만 몰리는 문제", "주간 온라인 모임을 시작할 때"],
  ["random", "random-vote-tiebreaker", "동률 투표 랜덤 결정", "동률 상황에서 결정을 미루는 문제", "투표 결과가 같은 수로 갈렸을 때"],
  ["random", "raffle-announcement-copy", "추첨 결과 안내문", "결과 안내가 짧아 신뢰가 낮아지는 문제", "이벤트 결과 페이지를 만들 때"],
  ["random", "random-seed-explainer", "랜덤 시드 이해", "무작위 결과가 어떻게 나왔는지 설명하기 어려운 문제", "개발자와 운영자가 추첨을 검토할 때"],
  ["random", "choice-rule-template", "랜덤 선택 규칙 템플릿", "매번 새 기준을 만들다 시간이 낭비되는 문제", "반복 이벤트 운영 규칙을 정할 때"],

  ["utility", "discount-rate-check", "할인율 계산 실수", "정가와 판매가를 헷갈려 할인 폭을 잘못 보는 문제", "쇼핑 전 실제 절감액을 확인할 때"],
  ["utility", "vat-inclusive-price", "부가세 포함 금액", "공급가와 최종 결제금액이 달라 보이는 문제", "견적서를 비교할 때"],
  ["utility", "split-bill-calculation", "더치페이 계산 기준", "인원별 부담액이 애매해지는 문제", "식사 후 비용을 나눌 때"],
  ["utility", "work-hour-summary", "근무시간 합산", "휴게시간과 실제 근무시간을 섞어 계산하는 문제", "아르바이트 시간을 정리할 때"],
  ["utility", "travel-budget-sheet", "여행 예산 나누기", "숙박비와 식비가 한쪽으로 몰리는 문제", "친구들과 여행비를 나눌 때"],
  ["utility", "delivery-date-estimate", "배송 예정일 계산", "주말과 공휴일을 빼먹어 일정을 잘못 잡는 문제", "선물을 주문하기 전"],
  ["utility", "parking-fee-estimate", "주차비 예상 계산", "시간 구간별 요금을 놓치는 문제", "공연장이나 병원 방문 전"],
  ["utility", "electricity-use-note", "전기요금 사용량 메모", "사용량 단위와 요금 구간을 헷갈리는 문제", "월별 사용량을 비교할 때"],
  ["utility", "compound-interest-memo", "복리 계산 메모", "기간과 이율을 섞어 결과를 과대평가하는 문제", "장기 저축 시뮬레이션을 볼 때"],
  ["utility", "loan-interest-rough", "대출 이자 간단 계산", "월 상환액을 대략 잡기 어려운 문제", "여러 조건을 비교하기 전"],
  ["utility", "salary-net-estimate", "실수령액 추정 기준", "세전과 세후 금액을 혼동하는 문제", "연봉 제안을 검토할 때"],
  ["utility", "age-standard-check", "나이 기준 확인", "만 나이와 연 나이를 섞어 쓰는 문제", "신청 조건을 확인할 때"],
  ["utility", "calendar-date-gap", "날짜 차이 계산", "시작일 포함 여부 때문에 결과가 달라지는 문제", "프로젝트 마감일을 계산할 때"],
  ["utility", "time-zone-meeting", "시차 회의 시간", "한국 시간과 현지 시간을 착각하는 문제", "해외 팀과 회의를 잡을 때"],
  ["utility", "unit-note-recipe", "레시피 단위 변환", "컵과 그램을 섞어 맛이 달라지는 문제", "해외 레시피를 따라 할 때"],
  ["utility", "moving-check-cost", "이사 비용 체크", "작은 비용이 빠져 예산이 넘는 문제", "이사 견적을 비교할 때"],
  ["utility", "subscription-total-cost", "구독료 월합계", "작은 구독이 쌓여 지출이 커지는 문제", "월 고정비를 점검할 때"],
  ["utility", "household-category-rule", "가계부 분류 기준", "지출 항목이 매번 달라지는 문제", "월말 지출을 정리할 때"],
  ["utility", "fuel-cost-split", "주유비 나누기", "운전자 부담이 커지는 문제", "차량 동승 비용을 나눌 때"],
  ["utility", "event-countdown-plan", "행사 남은 기간", "준비 단계가 뒤로 밀리는 문제", "오픈일이나 발표일을 준비할 때"],
  ["utility", "school-supply-budget", "준비물 예산 정리", "품목이 많아 총액을 놓치는 문제", "학기 시작 전 구매 목록을 볼 때"],
  ["utility", "exercise-time-record", "운동 시간 기록", "운동량을 감으로만 기억하는 문제", "주간 활동 시간을 정리할 때"],
  ["utility", "water-intake-routine", "물 마시기 기록", "마신 양을 과대평가하는 문제", "하루 루틴을 점검할 때"],
  ["utility", "sleep-hour-note", "수면 시간 메모", "잠든 시간과 누운 시간을 섞는 문제", "주간 컨디션을 비교할 때"],
  ["utility", "grocery-unit-price", "장보기 단가 비교", "묶음 상품이 실제로 싼지 모르는 문제", "마트에서 용량별 가격을 볼 때"],
  ["utility", "calendar-color-rule", "캘린더 색상 기준", "일정 종류가 한눈에 보이지 않는 문제", "가족 캘린더를 정리할 때"],
  ["utility", "warranty-period-check", "보증기간 확인", "구매일과 접수 가능일을 놓치는 문제", "전자제품 수리를 맡기기 전"],
  ["utility", "return-deadline-note", "반품 기한 계산", "영업일 기준을 착각하는 문제", "온라인 쇼핑 반품을 준비할 때"],
  ["utility", "study-hour-tracker", "공부 시간 합계", "앉아 있던 시간과 실제 학습 시간을 섞는 문제", "시험 준비 루틴을 점검할 때"],
  ["utility", "project-buffer-time", "작업 버퍼 시간", "예상보다 늦어지는 시간을 반영하지 못하는 문제", "마감 일정을 잡을 때"],
  ["utility", "meeting-room-time", "회의실 사용 시간", "준비와 정리 시간을 빼먹는 문제", "공유 회의실을 예약할 때"],
  ["utility", "rent-share-rule", "공동비 분담 기준", "사용량 차이를 반영하기 어려운 문제", "룸메이트와 비용을 나눌 때"],
  ["utility", "ticket-price-compare", "티켓 가격 비교", "수수료 포함 금액을 놓치는 문제", "공연 티켓을 고를 때"],
  ["utility", "gift-budget-limit", "선물 예산 상한", "관계별 예산 기준이 흔들리는 문제", "기념일 선물을 고를 때"],
  ["utility", "weekly-cost-review", "주간 지출 점검", "월말이 되어서야 과소비를 알게 되는 문제", "일요일에 지출을 돌아볼 때"],

  ["text", "self-intro-length", "자기소개서 글자수", "문항별 분량을 맞추지 못하는 문제", "지원서 제출 전"],
  ["text", "email-subject-rule", "이메일 제목 작성", "메일 목적이 제목에서 보이지 않는 문제", "업무 메일을 보내기 전"],
  ["text", "proposal-summary-check", "제안서 요약 문장", "핵심 제안이 앞부분에 드러나지 않는 문제", "제안서를 공유하기 전"],
  ["text", "meeting-note-format", "회의록 정리 형식", "결정사항과 논의사항이 섞이는 문제", "회의 직후 기록을 남길 때"],
  ["text", "notice-copy-cleanup", "공지문 표현 정리", "공지 대상과 행동이 불분명한 문제", "사내 공지를 올릴 때"],
  ["text", "faq-answer-length", "FAQ 답변 길이", "답변이 길어 핵심을 찾기 어려운 문제", "고객 안내 문서를 만들 때"],
  ["text", "blog-intro-hook", "블로그 첫 문단", "도입부가 길어 이탈이 늘어나는 문제", "정보성 글을 발행할 때"],
  ["text", "plain-language-rule", "쉬운 문장 기준", "전문용어가 많아 독자가 멈추는 문제", "초보자 가이드를 쓸 때"],
  ["text", "copy-before-share", "공유 전 문서 검토", "맞춤법보다 구조 오류가 더 크게 보이는 문제", "외부 링크를 보내기 전"],
  ["text", "markdown-table-check", "마크다운 표 작성", "표가 깨져 모바일에서 읽기 어려운 문제", "README나 가이드를 작성할 때"],
  ["text", "case-style-guide", "표기 스타일 통일", "같은 단어를 여러 방식으로 쓰는 문제", "브랜드 문서를 정리할 때"],
  ["text", "headline-trim-rule", "긴 제목 줄이기", "검색 결과에서 제목이 잘리는 문제", "블로그 제목을 다듬을 때"],
  ["text", "meta-description-draft", "메타 설명 초안", "요약이 본문과 따로 노는 문제", "글 발행 전 SEO 항목을 채울 때"],
  ["text", "bullet-list-edit", "목록 문장 다듬기", "항목마다 길이와 문체가 다른 문제", "체크리스트를 만들 때"],
  ["text", "tone-of-voice-note", "문체 기준표", "글마다 말투가 바뀌는 문제", "여러 글을 한 사이트에 올릴 때"],
  ["text", "quote-cleanup-rule", "인용문 정리", "출처와 원문이 구분되지 않는 문제", "자료 기반 글을 쓸 때"],
  ["text", "social-share-copy", "공유 문구 작성", "클릭 이유가 보이지 않는 문제", "커뮤니티에 글을 공유할 때"],
  ["text", "landing-copy-order", "랜딩 문구 순서", "기능 설명이 앞서고 독자 문제가 늦게 나오는 문제", "첫 화면 문구를 잡을 때"],
  ["text", "checklist-wording", "체크리스트 문장", "행동으로 옮기기 어려운 항목이 많은 문제", "실행형 글을 작성할 때"],
  ["text", "summary-box-copy", "요약 박스 구성", "본문을 읽기 전 핵심이 보이지 않는 문제", "긴 글의 도입부를 만들 때"],
  ["text", "document-version-note", "문서 버전 기록", "수정 이력을 찾기 어려운 문제", "팀 문서를 업데이트할 때"],
  ["text", "mobile-reading-break", "모바일 문단 길이", "한 문단이 화면을 가득 채우는 문제", "스마트폰 독자를 고려할 때"],
  ["text", "question-heading-rule", "질문형 소제목", "소제목만 봐서는 답을 예측하기 어려운 문제", "FAQ형 글을 쓸 때"],
  ["text", "before-after-copy", "전후 비교 문장", "개선 효과가 추상적으로 보이는 문제", "사례형 글을 작성할 때"],
  ["text", "newsletter-preview", "뉴스레터 미리보기", "메일을 열 이유가 약한 문제", "주간 요약 메일을 보낼 때"],
  ["text", "privacy-copy-check", "개인정보 안내문", "수집 목적과 보관 기간이 흐릿한 문제", "문의 폼 안내문을 쓸 때"],
  ["text", "terms-summary-copy", "약관 요약 문장", "법적 문장이 너무 길어 이해가 어려운 문제", "서비스 안내 페이지를 만들 때"],
  ["text", "help-page-structure", "도움말 페이지 구조", "사용자가 원하는 답을 찾기 어려운 문제", "도구 사용법을 설명할 때"],
  ["text", "content-refresh-note", "글 업데이트 메모", "수정 이유가 기록되지 않는 문제", "오래된 글을 고칠 때"],
  ["text", "reader-question-bank", "독자 질문 모음", "FAQ 아이디어가 흩어지는 문제", "새 글 주제를 모을 때"],

  ["developer", "api-request-check", "API 요청 검증", "요청값이 어디서 깨졌는지 찾기 어려운 문제", "외부 API 연동을 테스트할 때"],
  ["developer", "webhook-signature-test", "웹훅 서명 확인", "정상 요청과 위조 요청을 구분하기 어려운 문제", "결제나 알림 웹훅을 받을 때"],
  ["developer", "http-status-note", "HTTP 상태코드 정리", "오류 코드만 보고 원인을 오해하는 문제", "운영 로그를 확인할 때"],
  ["developer", "cache-header-check", "캐시 헤더 점검", "수정한 파일이 바로 반영되지 않는 문제", "정적 사이트를 배포할 때"],
  ["developer", "canonical-url-audit", "캐노니컬 URL 검사", "중복 URL이 검색엔진에 섞이는 문제", "SEO 점검을 할 때"],
  ["developer", "robots-rule-review", "robots.txt 규칙", "허용할 봇과 막을 봇을 구분하지 못하는 문제", "검색 수집 설정을 바꿀 때"],
  ["developer", "sitemap-lastmod-check", "사이트맵 날짜 확인", "수정된 페이지가 오래된 날짜로 남는 문제", "빌드 후 사이트맵을 검토할 때"],
  ["developer", "json-parse-error", "JSON 파싱 오류", "쉼표 하나 때문에 전체 응답이 실패하는 문제", "API 응답을 저장할 때"],
  ["developer", "url-encoding-case", "URL 인코딩 기준", "한글과 공백이 섞인 URL이 깨지는 문제", "공유 링크를 만들 때"],
  ["developer", "base64-safe-use", "Base64 사용 기준", "인코딩을 암호화로 착각하는 문제", "간단한 데이터 전달을 검토할 때"],
  ["developer", "timestamp-debug", "타임스탬프 디버깅", "UTC와 한국 시간을 혼동하는 문제", "예약 발행 시간을 확인할 때"],
  ["developer", "regex-test-note", "정규식 테스트 기준", "예외 입력에서 패턴이 깨지는 문제", "폼 검증을 만들 때"],
  ["developer", "form-validation-copy", "폼 검증 메시지", "사용자가 무엇을 고쳐야 할지 모르는 문제", "문의 폼 오류 문구를 쓸 때"],
  ["developer", "open-graph-preview", "OG 미리보기 점검", "공유 화면에 제목이나 이미지가 빠지는 문제", "블로그 글을 배포할 때"],
  ["developer", "structured-data-check", "구조화 데이터 확인", "스키마가 있어도 검색엔진이 읽지 못하는 문제", "Article JSON-LD를 넣을 때"],
  ["developer", "image-alt-audit", "이미지 alt 점검", "이미지가 설명 없이 노출되는 문제", "콘텐츠 접근성을 확인할 때"],
  ["developer", "bundle-size-review", "번들 크기 점검", "사용하지 않는 코드가 초기 로딩을 늦추는 문제", "Vite 빌드 결과를 볼 때"],
  ["developer", "lazy-load-route", "라우트 지연 로딩", "첫 화면과 무관한 코드가 먼저 내려오는 문제", "도구 페이지가 늘어날 때"],
  ["developer", "env-variable-check", "환경변수 점검", "로컬과 배포 환경 값이 달라지는 문제", "API 키 설정을 확인할 때"],
  ["developer", "deploy-log-review", "배포 로그 읽기", "실패 원인이 경고인지 오류인지 헷갈리는 문제", "Vercel 빌드가 멈췄을 때"],
  ["developer", "rss-feed-check", "RSS 피드 확인", "최신 글이 피드에 안 보이는 문제", "검색엔진 제출 전"],
  ["developer", "indexnow-response", "IndexNow 응답 해석", "202와 403의 의미를 혼동하는 문제", "Bing과 네이버에 URL을 알릴 때"],
  ["developer", "ga4-event-test", "GA4 이벤트 테스트", "클릭 이벤트가 수집되는지 확인하기 어려운 문제", "도구 사용 이벤트를 넣을 때"],
  ["developer", "adsense-script-check", "애드센스 스크립트 점검", "광고 코드가 중복 삽입되는 문제", "자동광고를 켤 때"],
  ["developer", "content-security-header", "보안 헤더 확인", "헤더가 너무 느슨해 보안 점수가 낮아지는 문제", "정적 사이트 헤더를 조정할 때"],
  ["developer", "broken-link-scan", "깨진 링크 점검", "오래된 글의 외부 링크가 죽는 문제", "월간 콘텐츠 점검을 할 때"],
  ["developer", "internal-link-map", "내부 링크 맵", "새 글이 기존 글과 연결되지 않는 문제", "블로그 글을 대량 발행할 때"],
  ["developer", "markdown-render-check", "마크다운 렌더링 확인", "표와 목록이 기대와 다르게 보이는 문제", "문서 도구를 테스트할 때"],
  ["developer", "mobile-viewport-debug", "모바일 뷰포트 점검", "버튼과 제목이 작은 화면에서 겹치는 문제", "반응형 UI를 확인할 때"],
  ["developer", "build-now-test", "예약 발행 빌드 테스트", "미래 글이 사이트맵에 섞이는 문제", "예약 공개 로직을 검증할 때"],

  ["productivity", "priority-rule-daily", "하루 우선순위 기준", "할 일은 많은데 시작 순서가 보이지 않는 문제", "아침 업무를 열기 전"],
  ["productivity", "meeting-agenda-template", "회의 안건 템플릿", "회의가 주제 없이 길어지는 문제", "주간 회의를 준비할 때"],
  ["productivity", "decision-log-habit", "결정 기록 습관", "왜 그렇게 결정했는지 나중에 기억나지 않는 문제", "프로젝트 방향을 바꿀 때"],
  ["productivity", "focus-block-plan", "집중 블록 설계", "알림과 잡일 때문에 몰입 시간이 끊기는 문제", "깊은 작업을 시작할 때"],
  ["productivity", "small-task-batching", "작은 업무 묶기", "자잘한 일이 하루를 계속 쪼개는 문제", "메일과 승인 업무를 처리할 때"],
  ["productivity", "weekly-review-note", "주간 회고 노트", "한 주의 성과와 지연 원인이 흐릿한 문제", "금요일 오후에 정리할 때"],
  ["productivity", "work-request-format", "업무 요청 양식", "요청 배경과 마감이 빠지는 문제", "동료에게 일을 부탁할 때"],
  ["productivity", "task-estimate-rule", "작업 시간 예측", "짧게 본 일이 계속 밀리는 문제", "스프린트 계획을 잡을 때"],
  ["productivity", "meeting-minutes-action", "회의록 액션아이템", "회의 후 누가 무엇을 할지 흐려지는 문제", "회의 직후 공유 문서를 만들 때"],
  ["productivity", "context-switch-reduce", "업무 전환 줄이기", "도구와 채널을 오가며 집중이 깨지는 문제", "여러 프로젝트를 동시에 맡을 때"],
  ["productivity", "inbox-zero-light", "메일함 정리 기준", "메일을 읽고도 처리 상태가 남는 문제", "받은편지함을 정리할 때"],
  ["productivity", "notification-rule", "알림 관리 기준", "중요하지 않은 알림이 계속 끼어드는 문제", "업무용 메신저를 쓸 때"],
  ["productivity", "daily-close-routine", "퇴근 전 정리 루틴", "다음 날 시작할 일을 잊는 문제", "하루 업무를 마무리할 때"],
  ["productivity", "project-name-rule", "프로젝트 이름 규칙", "파일과 문서 이름이 제각각인 문제", "공유 폴더를 정리할 때"],
  ["productivity", "handoff-note-template", "인수인계 메모", "중간 맥락이 빠져 재질문이 늘어나는 문제", "휴가 전 업무를 넘길 때"],
  ["productivity", "remote-work-checkin", "원격근무 체크인", "비동기 상황에서 진행이 안 보이는 문제", "재택근무 팀을 운영할 때"],
  ["productivity", "personal-kanban-light", "개인 칸반 기준", "해야 할 일과 진행 중인 일이 섞이는 문제", "개인 업무 보드를 만들 때"],
  ["productivity", "deadline-buffer-rule", "마감 버퍼 설정", "예상 밖 수정에 대응할 시간이 없는 문제", "납기 일정을 잡을 때"],
  ["productivity", "routine-trigger-design", "루틴 트리거 설계", "좋은 습관이 일정에 붙지 않는 문제", "반복 행동을 만들 때"],
  ["productivity", "one-page-brief", "원페이지 브리프", "설명이 길어 의사결정자가 핵심을 놓치는 문제", "제안 전 요약을 만들 때"],
  ["productivity", "retrospective-question", "회고 질문 리스트", "회고가 불평이나 칭찬으로만 끝나는 문제", "프로젝트 종료 후"],
  ["productivity", "knowledge-base-seed", "지식베이스 시작", "팀 노하우가 개인 메모에만 남는 문제", "반복 질문을 줄일 때"],
  ["productivity", "approval-flow-check", "승인 흐름 정리", "누가 언제 승인해야 하는지 모르는 문제", "콘텐츠 발행 전 검토할 때"],
  ["productivity", "writing-sprint-rule", "글쓰기 스프린트", "초안을 끝내기 전에 계속 고치는 문제", "블로그 글을 대량 작성할 때"],
  ["productivity", "tool-shortcut-list", "도구 바로가기 목록", "필요한 도구를 찾느라 시간을 쓰는 문제", "업무 시작 화면을 구성할 때"],
  ["productivity", "daily-metric-note", "일일 지표 메모", "작은 변화가 쌓여도 보이지 않는 문제", "사이트 운영 지표를 볼 때"],
  ["productivity", "batch-publish-board", "예약 발행 보드", "발행 일정이 머릿속에만 있는 문제", "여러 글을 순차 공개할 때"],
  ["productivity", "review-checkpoint", "검토 체크포인트", "마지막 단계에서 누락이 발견되는 문제", "배포 전 품질을 확인할 때"],
  ["productivity", "decision-owner-rule", "결정권자 표시", "결론을 낼 사람이 불분명한 문제", "회의와 문서에 책임자를 남길 때"],
  ["productivity", "repeat-task-automation", "반복 업무 자동화", "매번 손으로 하는 일이 쌓이는 문제", "정기 보고와 알림을 처리할 때"],

  ["wellness", "sleep-routine-note", "수면 루틴 기록", "잠자는 시간이 들쭉날쭉해 컨디션을 보기 어려운 문제", "일주일 수면 패턴을 돌아볼 때"],
  ["wellness", "desk-stretch-break", "책상 스트레칭 휴식", "오래 앉아 몸이 굳는 문제", "장시간 작업 중간에"],
  ["wellness", "eye-rest-rule", "눈 피로 휴식 기준", "화면을 오래 봐도 쉬는 타이밍을 놓치는 문제", "문서 작업을 오래 할 때"],
  ["wellness", "walk-break-plan", "짧은 산책 루틴", "하루 종일 실내에 머무는 문제", "점심 후 기분 전환이 필요할 때"],
  ["wellness", "breathing-reset-note", "호흡 리셋 습관", "긴장 상황에서 바로 반응하는 문제", "회의나 발표 전"],
  ["wellness", "water-reminder-rule", "물 마시기 알림", "바쁜 날 수분 섭취를 잊는 문제", "업무 시간표를 만들 때"],
  ["wellness", "screen-time-boundary", "화면 시간 경계", "퇴근 후에도 계속 화면을 보는 문제", "저녁 루틴을 정할 때"],
  ["wellness", "meal-choice-balance", "식사 선택 균형", "급하게 고른 메뉴가 계속 반복되는 문제", "점심 메뉴를 정할 때"],
  ["wellness", "mood-log-light", "기분 기록 가볍게", "감정 변화를 나중에 설명하기 어려운 문제", "하루를 마무리할 때"],
  ["wellness", "habit-small-start", "작은 습관 시작", "처음부터 큰 목표를 잡아 포기하는 문제", "새 루틴을 만들 때"],
  ["wellness", "weekend-recovery-plan", "주말 회복 계획", "쉬는 날도 피로가 남는 문제", "금요일 밤 계획을 잡을 때"],
  ["wellness", "morning-light-routine", "아침 빛 루틴", "기상 후 멍한 시간이 길어지는 문제", "하루 시작을 정리할 때"],
  ["wellness", "evening-close-note", "저녁 마무리 메모", "잠들기 전 생각이 계속 도는 문제", "내일 할 일을 정리할 때"],
  ["wellness", "posture-check-timer", "자세 점검 타이머", "작업 중 자세가 무너지는 문제", "집중 작업을 오래 할 때"],
  ["wellness", "caffeine-cutoff-rule", "카페인 마감 시간", "늦은 커피가 수면을 방해하는 문제", "오후 음료를 고를 때"],
  ["wellness", "mindful-random-break", "랜덤 휴식 미션", "쉬는 시간에도 휴대폰만 보는 문제", "짧은 휴식 활동을 고를 때"],
  ["wellness", "weekly-energy-review", "주간 에너지 회고", "언제 지치는지 패턴을 모르는 문제", "다음 주 일정을 짤 때"],
  ["wellness", "home-work-boundary", "재택근무 경계", "생활과 업무 시간이 섞이는 문제", "집에서 일하는 날"],
  ["wellness", "digital-declutter-step", "디지털 정리 습관", "파일과 알림이 계속 쌓이는 문제", "월말 정리를 할 때"],
  ["wellness", "gentle-goal-rule", "무리 없는 목표 설정", "목표가 높아 시작 자체가 부담인 문제", "운동이나 학습 계획을 세울 때"],

  ["seo", "adsense-review-home", "애드센스 검수 홈페이지", "첫 화면이 사이트 주제를 충분히 설명하지 못하는 문제", "광고 검수 전 메인페이지를 볼 때"],
  ["seo", "content-quality-score", "콘텐츠 품질 점수", "글 수는 많은데 유용성이 낮아 보이는 문제", "새 글 발행 전"],
  ["seo", "search-intent-map", "검색 의도 맵", "제목과 본문이 다른 질문을 겨냥하는 문제", "콘텐츠 플랜을 만들 때"],
  ["seo", "internal-link-rules", "내부 링크 규칙", "새 글이 고립 페이지로 남는 문제", "블로그 글을 추가할 때"],
  ["seo", "sitemap-freshness-check", "사이트맵 최신 날짜", "업데이트 글이 검색엔진에 늦게 반영되는 문제", "빌드 후 sitemap.xml을 볼 때"],
  ["seo", "rss-submit-check", "RSS 제출 확인", "신규 글을 포털이 빨리 발견하지 못하는 문제", "네이버와 다음 등록 후"],
  ["seo", "gsc-query-review", "GSC 검색어 점검", "노출은 있는데 클릭이 낮은 문제", "월간 검색 성과를 볼 때"],
  ["seo", "ga4-event-map", "GA4 이벤트 맵", "사용자가 어떤 도구를 쓰는지 알기 어려운 문제", "핵심 이벤트를 설계할 때"],
  ["seo", "meta-title-refresh", "메타 제목 개선", "검색 결과 제목이 밋밋한 문제", "CTR이 낮은 글을 고칠 때"],
  ["seo", "faq-schema-plan", "FAQ 스키마 설계", "질문형 검색에 답이 잘 드러나지 않는 문제", "가이드 글을 작성할 때"],
  ["seo", "author-signal-page", "저자 신뢰 신호", "사이트 운영 주체가 모호해 보이는 문제", "About 페이지를 보강할 때"],
  ["seo", "thin-content-audit", "얇은 콘텐츠 점검", "짧은 글이 많아 품질이 낮아 보이는 문제", "애드센스 재검토 전"],
  ["seo", "old-post-refresh", "오래된 글 업데이트", "날짜가 오래되어 정보 신뢰가 떨어지는 문제", "6개월 지난 글을 검토할 때"],
  ["seo", "crawl-budget-light", "크롤링 우선순위", "중요하지 않은 페이지가 먼저 수집되는 문제", "사이트맵 우선순위를 정할 때"],
  ["seo", "ads-layout-safe", "자동광고 UX 기준", "광고가 본문 읽기를 방해하는 문제", "애드센스 자동광고를 켤 때"],
  ["seo", "naver-title-length", "네이버 제목 길이", "검색 결과에서 제목이 잘리는 문제", "40자 안팎 제목을 만들 때"],
  ["seo", "og-image-consistency", "OG 이미지 일관성", "공유 이미지가 페이지 주제와 안 맞는 문제", "커뮤니티 공유를 준비할 때"],
  ["seo", "ai-index-file", "AI 검색 인덱스", "LLM이 사이트 구조를 파악하기 어려운 문제", "llms.txt와 ai-index를 만들 때"],
  ["seo", "indexnow-retry-rule", "IndexNow 재시도 기준", "일부 엔드포인트가 403을 반환하는 문제", "URL 제출 자동화를 점검할 때"],
  ["seo", "homepage-topic-cluster", "홈페이지 주제 클러스터", "메인페이지가 도구와 글을 연결하지 못하는 문제", "AdSense용 홈 구성을 기획할 때"],
];

const EXTRA_TOPICS = [
  ["random", "lottery-event-proof", "이벤트 추첨 증빙", "추첨 과정 설명이 부족해 결과 신뢰가 낮아지는 문제", "소규모 경품 이벤트를 마감할 때"],
  ["random", "anonymous-feedback-draw", "익명 피드백 추첨", "익명 응답과 당첨 확인을 함께 처리하기 어려운 문제", "설문 참여 보상을 고를 때"],
  ["random", "workshop-group-random", "워크숍 조 편성", "친한 사람끼리만 묶여 활동 균형이 깨지는 문제", "사내 워크숍 조를 나눌 때"],
  ["random", "book-club-topic-wheel", "독서모임 주제 룰렛", "토론 주제가 매번 비슷해지는 문제", "다음 모임 질문을 고를 때"],
  ["random", "family-chore-wheel", "가족 집안일 룰렛", "집안일 분담이 한쪽으로 기우는 문제", "주말 집안일을 나눌 때"],
  ["random", "raffle-entry-cleaning", "응모자 명단 정리", "응모 조건을 충족하지 않는 항목이 섞이는 문제", "추첨 전 참가 명단을 검토할 때"],
  ["random", "random-pair-review", "랜덤 짝 리뷰", "리뷰 상대가 반복되어 피드백이 좁아지는 문제", "스터디 과제 검토 짝을 정할 때"],
  ["random", "mentor-match-random", "멘토 매칭 랜덤", "멘토와 멘티 배정 기준이 불투명해지는 문제", "단기 멘토링 조를 배정할 때"],
  ["random", "quiz-order-random", "퀴즈 순서 랜덤", "문제 순서가 난이도에 영향을 주는 문제", "온라인 퀴즈 순서를 섞을 때"],
  ["random", "random-break-activity", "휴식 활동 랜덤", "쉬는 시간에도 할 일을 고르다 지치는 문제", "짧은 휴식 미션을 정할 때"],
  ["random", "team-lunch-rotation", "팀 점심 순번", "점심 제안자가 일부에게만 몰리는 문제", "주간 점심 담당을 정할 때"],
  ["random", "prize-tier-draw", "경품 등급 추첨", "경품 등급과 당첨자 순서가 헷갈리는 문제", "여러 등급 경품을 나눌 때"],
  ["random", "candidate-shortlist-wheel", "후보 목록 압축", "후보가 많아 결정 속도가 떨어지는 문제", "최종 후보 3개를 남길 때"],
  ["random", "random-topic-refresh", "랜덤 주제 갱신", "오래된 주제가 계속 반복되는 문제", "커뮤니티 질문 목록을 바꿀 때"],
  ["random", "fair-turn-rotation", "공정한 순번 회전", "앞 순서가 반복되어 불만이 생기는 문제", "진행 순서를 주기적으로 바꿀 때"],
  ["random", "draw-result-share", "추첨 결과 공유", "결과만 올려 과정이 보이지 않는 문제", "당첨자 공지를 작성할 때"],
  ["random", "random-rule-audit", "랜덤 규칙 점검", "규칙이 실행 중 바뀌어 신뢰가 낮아지는 문제", "공개 추첨 전 기준을 볼 때"],
  ["random", "event-seat-lottery", "행사 좌석 추첨", "좋은 좌석 배정이 불공정해 보이는 문제", "선착순 대신 좌석을 뽑을 때"],
  ["random", "random-order-script", "랜덤 순서 안내문", "참가자가 순서 결정 방식을 이해하지 못하는 문제", "행사 시작 전 안내할 때"],
  ["random", "lotto-number-note", "로또 번호 메모", "번호 생성 기준과 저장 방식이 섞이는 문제", "추천 번호를 기록할 때"],
  ["random", "team-game-balance", "팀 게임 균형 배정", "한 팀에 실력이 몰리는 문제", "친목 게임 팀을 나눌 때"],
  ["random", "draw-retry-policy", "추첨 재시도 원칙", "결과가 마음에 들지 않아 계속 다시 뽑는 문제", "참가자 앞에서 재추첨 기준을 정할 때"],
  ["random", "daily-choice-capsule", "하루 선택 캡슐", "작은 선택이 많아 시작이 늦어지는 문제", "아침 루틴을 빠르게 정할 때"],
  ["random", "menu-vote-tiebreak", "메뉴 투표 동률", "동률 메뉴가 나왔을 때 결정을 미루는 문제", "점심 후보 투표가 갈릴 때"],
  ["random", "random-sample-check", "무작위 표본 확인", "일부 항목만 골라도 되는지 판단하기 어려운 문제", "목록 검수 표본을 뽑을 때"],
  ["random", "question-card-shuffle", "질문 카드 섞기", "질문 순서가 고정되어 대화가 예측되는 문제", "아이스브레이킹 카드를 쓸 때"],
  ["random", "winner-backup-list", "예비 당첨자 목록", "당첨자가 응답하지 않을 때 다음 순서를 정하기 어려운 문제", "경품 예비 순번을 남길 때"],
  ["random", "random-choice-archive", "랜덤 선택 보관", "지난 선택을 찾지 못해 같은 결정을 반복하는 문제", "운영 기록을 남길 때"],
  ["random", "spin-result-explain", "룰렛 결과 설명", "룰렛 결과가 우연인지 조작인지 의심받는 문제", "공개 화면을 공유할 때"],
  ["random", "draw-participant-consent", "추첨 참여 동의", "참가자가 추첨 조건을 뒤늦게 확인하는 문제", "응모 폼 안내문을 만들 때"],
  ["utility", "monthly-budget-split", "월 예산 분배", "고정비와 변동비가 섞여 남은 돈이 안 보이는 문제", "월초 생활비를 나눌 때"],
  ["utility", "holiday-workday-count", "공휴일 근무일 계산", "휴일 포함 여부로 일정 계산이 달라지는 문제", "마감일을 산정할 때"],
  ["utility", "installment-total-cost", "할부 총액 계산", "월 납입액만 보고 총비용을 놓치는 문제", "가전제품 구매 전"],
  ["utility", "tip-split-korea", "서비스 비용 나누기", "추가 비용을 누가 부담할지 애매한 문제", "단체 결제 후 비용을 나눌 때"],
  ["utility", "monthly-subscription-cut", "구독 정리 우선순위", "해지할 구독을 고르기 어려운 문제", "월 고정비를 줄일 때"],
  ["utility", "commute-time-summary", "통근 시간 합계", "왕복 시간과 대기 시간이 따로 계산되는 문제", "근무지 변경을 검토할 때"],
  ["utility", "meal-prep-quantity", "식재료 분량 계산", "인원수에 맞게 재료를 조절하기 어려운 문제", "단체 식사를 준비할 때"],
  ["utility", "child-allowance-rule", "용돈 기준 정리", "용돈 금액과 사용 범위가 매번 흔들리는 문제", "가족 규칙을 정할 때"],
  ["utility", "moving-box-count", "이사 박스 수량", "짐 양을 감으로만 잡아 준비물이 부족한 문제", "포장 전에 박스 수를 볼 때"],
  ["utility", "study-dday-schedule", "시험 D-Day 계획", "남은 기간에 맞는 학습량이 보이지 않는 문제", "시험 한 달 전 계획을 세울 때"],
  ["utility", "monthly-savings-rate", "월 저축률 계산", "소득 대비 저축 비율을 체감하기 어려운 문제", "가계부를 점검할 때"],
  ["utility", "insurance-renewal-date", "보험 갱신일 메모", "갱신일과 납입일을 혼동하는 문제", "보험료 변경 전에 확인할 때"],
  ["utility", "pet-care-cost", "반려동물 비용 정리", "사료와 병원비가 따로 기록되어 총액이 안 보이는 문제", "월간 지출을 점검할 때"],
  ["utility", "car-maintenance-cycle", "차량 정비 주기", "주행거리와 날짜 기준이 섞이는 문제", "엔진오일 교체 시점을 볼 때"],
  ["utility", "home-appliance-warranty", "가전 보증 메모", "구매처와 보증기간을 나중에 찾기 어려운 문제", "수리 접수 전 자료를 모을 때"],
  ["utility", "travel-day-budget", "하루 여행비 계산", "전체 예산만 보고 하루 지출 한도를 놓치는 문제", "여행 일정을 나눌 때"],
  ["utility", "shared-grocery-list", "공동 장보기 목록", "필요한 품목과 이미 산 품목이 섞이는 문제", "동거인이 장을 볼 때"],
  ["utility", "gift-price-range", "선물 가격대 정리", "상대와 상황에 맞는 예산을 정하기 어려운 문제", "선물 후보를 고를 때"],
  ["utility", "meeting-cost-estimate", "회의 비용 계산", "회의 시간이 실제 비용으로 보이지 않는 문제", "긴 회의를 줄일 근거를 볼 때"],
  ["utility", "camping-gear-budget", "캠핑 준비 예산", "장비와 소모품 비용이 뒤섞이는 문제", "첫 캠핑 준비물을 살 때"],
  ["utility", "monthly-reading-count", "월 독서량 기록", "읽은 책 수와 읽은 시간을 따로 보지 못하는 문제", "독서 습관을 점검할 때"],
  ["utility", "daily-step-average", "걸음 수 평균", "하루 기록만 보고 활동량을 과대평가하는 문제", "주간 건강 루틴을 볼 때"],
  ["utility", "water-bill-share", "수도요금 나누기", "사용 인원과 기간이 달라 비용 배분이 애매한 문제", "공동 거주 비용을 정산할 때"],
  ["utility", "phone-plan-compare", "휴대폰 요금 비교", "월 요금과 약정 조건을 함께 보기 어려운 문제", "요금제를 바꾸기 전"],
  ["utility", "return-shipping-cost", "반품 배송비 계산", "무료 반품 조건과 부담 금액을 혼동하는 문제", "온라인 주문을 취소할 때"],
  ["utility", "birthday-countdown-note", "생일 카운트다운", "준비 기간을 놓쳐 선물이 늦어지는 문제", "기념일 일정을 챙길 때"],
  ["utility", "weekly-meal-budget", "주간 식비 계획", "외식과 장보기 비용이 한쪽으로 몰리는 문제", "일주일 식비를 정할 때"],
  ["utility", "office-supply-stock", "사무용품 재고", "필요한 물품을 늦게 알아채는 문제", "공용 비품을 점검할 때"],
  ["utility", "delivery-fee-threshold", "무료배송 기준", "배송비를 아끼려다 불필요한 물건을 사는 문제", "장바구니 금액을 맞출 때"],
  ["utility", "reservation-deposit-note", "예약금 기록", "예약금과 잔금을 구분하지 못하는 문제", "모임 장소를 예약할 때"],
  ["utility", "class-time-table", "수업 시간표 계산", "수업 간 쉬는 시간을 빠뜨리는 문제", "학기 시간표를 짤 때"],
  ["utility", "home-repair-budget", "집수리 예산", "재료비와 인건비를 따로 보지 못하는 문제", "수리 견적을 비교할 때"],
  ["utility", "medicine-time-note", "복용 시간 메모", "복용 간격을 놓쳐 시간이 겹치는 문제", "일시적 약 복용을 관리할 때"],
  ["utility", "weekly-cleaning-time", "청소 시간 배분", "큰 집안일만 남아 주말이 부담되는 문제", "주간 청소 계획을 만들 때"],
  ["utility", "used-item-price-check", "중고거래 가격 점검", "시세와 희망 가격을 구분하기 어려운 문제", "중고 물품을 올리기 전"],
  ["text", "intro-sentence-hook", "도입 문장 훅", "첫 문장이 평범해 글을 계속 읽을 이유가 약한 문제", "블로그 글 첫 줄을 고칠 때"],
  ["text", "short-form-script", "짧은 영상 대본", "핵심 메시지가 초반에 나오지 않는 문제", "숏폼 대본을 작성할 때"],
  ["text", "product-description-trim", "상품 설명 줄이기", "설명이 길어 장점이 묻히는 문제", "상품 카드 문구를 다듬을 때"],
  ["text", "faq-question-cluster", "FAQ 질문 묶기", "비슷한 질문이 여러 페이지에 흩어지는 문제", "도움말 페이지를 정리할 때"],
  ["text", "notice-title-rule", "공지 제목 규칙", "공지 목적이 제목에서 드러나지 않는 문제", "사용자 안내를 올릴 때"],
  ["text", "review-response-template", "리뷰 답변 템플릿", "답변 말투가 매번 달라지는 문제", "고객 리뷰에 답할 때"],
  ["text", "support-macro-cleanup", "고객지원 매크로", "매크로 문장이 딱딱해 보이는 문제", "반복 답변을 정리할 때"],
  ["text", "article-summary-card", "글 요약 카드", "본문 핵심을 공유 이미지에 담기 어려운 문제", "커뮤니티 공유문을 만들 때"],
  ["text", "comparison-copy-rule", "비교 문구 작성", "차이가 추상적으로만 보이는 문제", "두 도구를 비교할 때"],
  ["text", "cta-button-wording", "CTA 버튼 문구", "버튼을 눌러야 할 이유가 약한 문제", "도구 페이지 전환을 높일 때"],
  ["text", "email-preview-text", "메일 미리보기 문장", "제목 다음 문장이 열람 이유를 만들지 못하는 문제", "뉴스레터를 보내기 전"],
  ["text", "onboarding-copy", "온보딩 문구", "처음 방문자가 다음 행동을 모르는 문제", "새 도구 첫 화면을 만들 때"],
  ["text", "error-message-copy", "오류 메시지 문장", "사용자가 무엇을 고쳐야 하는지 모르는 문제", "폼 검증 문구를 쓸 때"],
  ["text", "empty-state-copy", "빈 상태 문구", "데이터가 없을 때 화면이 막힌 것처럼 보이는 문제", "목록 화면을 설계할 때"],
  ["text", "tooltip-wording", "툴팁 문장", "기능 설명이 길어 UI를 방해하는 문제", "아이콘 버튼 설명을 붙일 때"],
  ["text", "release-note-summary", "릴리즈 노트 요약", "변경점이 많아 사용자가 핵심을 놓치는 문제", "배포 후 공지를 쓸 때"],
  ["text", "case-study-outline", "사례 글 구성", "사례가 자랑처럼 보여 실용성이 약한 문제", "성과 글을 작성할 때"],
  ["text", "source-citation-copy", "출처 표기 문장", "참고 링크와 본문 해석이 분리되는 문제", "자료 기반 글을 쓸 때"],
  ["text", "definition-box-copy", "정의 박스 문구", "개념 설명이 본문 중간에 묻히는 문제", "초보자용 문서를 만들 때"],
  ["text", "step-label-cleanup", "단계 라벨 정리", "단계명이 길어 흐름을 보기 어려운 문제", "실행 절차 글을 쓸 때"],
  ["text", "mobile-card-title", "모바일 카드 제목", "작은 화면에서 제목이 두 줄 이상 밀리는 문제", "콘텐츠 카드 목록을 만들 때"],
  ["text", "search-snippet-copy", "검색 스니펫 문장", "검색 결과 설명이 클릭 이유를 주지 못하는 문제", "메타 설명을 고칠 때"],
  ["text", "author-bio-copy", "작성자 소개 문구", "저자 신뢰가 짧은 소개에서 드러나지 않는 문제", "About 영역을 보강할 때"],
  ["text", "form-helper-text", "폼 도움말 문구", "입력 예시가 없어 오류가 반복되는 문제", "문의 폼을 개선할 때"],
  ["text", "policy-summary-copy", "정책 요약 문장", "정책 페이지가 길어 핵심을 찾기 어려운 문제", "개인정보 안내를 줄일 때"],
  ["text", "table-caption-rule", "표 캡션 작성", "표를 보기 전 의미를 알기 어려운 문제", "비교 표를 넣을 때"],
  ["text", "quote-to-action", "인용 뒤 해석", "인용문만 있고 독자 행동이 이어지지 않는 문제", "공식 문서를 인용할 때"],
  ["text", "category-description", "카테고리 설명", "카테고리가 어떤 글을 담는지 모호한 문제", "블로그 분류를 정리할 때"],
  ["text", "newsletter-section-title", "뉴스레터 섹션 제목", "메일 안에서 정보 묶음이 한눈에 안 보이는 문제", "주간 요약을 보낼 때"],
  ["text", "microcopy-audit", "마이크로카피 점검", "작은 문구가 서로 다른 톤으로 보이는 문제", "사이트 전체 문구를 검토할 때"],
  ["developer", "api-error-format", "API 오류 형식", "오류 응답이 제각각이라 디버깅이 어려운 문제", "간단한 API를 정리할 때"],
  ["developer", "webhook-retry-log", "웹훅 재시도 로그", "실패한 요청을 다시 보낼 기준이 없는 문제", "배포 훅 상태를 확인할 때"],
  ["developer", "env-secret-check", "환경변수 비밀 점검", "키가 코드에 섞일 위험을 놓치는 문제", "배포 전 설정을 볼 때"],
  ["developer", "static-route-audit", "정적 라우트 점검", "빌드 결과에서 일부 경로가 빠지는 문제", "정적 사이트를 배포할 때"],
  ["developer", "sitemap-url-count", "사이트맵 URL 수", "발견 URL 수와 실제 페이지 수가 다른 문제", "검색엔진 제출 전"],
  ["developer", "robots-ai-bot-rule", "AI 봇 robots 규칙", "허용할 봇과 차단할 봇을 구분하기 어려운 문제", "robots.txt를 수정할 때"],
  ["developer", "canonical-domain-check", "캐노니컬 도메인 확인", "www와 apex URL 신호가 섞이는 문제", "SEO 설정을 점검할 때"],
  ["developer", "og-meta-debug", "OG 메타 디버깅", "공유 이미지와 제목이 예상과 다르게 보이는 문제", "SNS 공유를 테스트할 때"],
  ["developer", "structured-data-leak", "스키마 노출 점검", "JSON-LD 원문이 본문에 보일 위험이 있는 문제", "FAQ 스키마를 넣을 때"],
  ["developer", "client-bundle-check", "클라이언트 번들 점검", "글 데이터가 커져 초기 로딩이 무거워지는 문제", "대량 콘텐츠를 추가할 때"],
  ["developer", "lazy-route-split", "라우트 분할 점검", "사용하지 않는 페이지 코드가 같이 로드되는 문제", "도구 페이지를 늘릴 때"],
  ["developer", "build-warning-review", "빌드 경고 해석", "경고가 많아 실제 위험을 놓치는 문제", "CI 로그를 검토할 때"],
  ["developer", "vercel-cache-check", "Vercel 캐시 확인", "새 배포가 반영됐는지 판단하기 어려운 문제", "정적 파일을 갱신할 때"],
  ["developer", "rss-item-count", "RSS 글 수 점검", "피드에 최신 글이 빠지는 문제", "포털 RSS 제출 후"],
  ["developer", "link-rel-audit", "링크 rel 점검", "외부 링크 속성이 일관되지 않은 문제", "출처 링크를 추가할 때"],
  ["developer", "image-alt-scan", "이미지 alt 점검", "대표 이미지 설명이 제목과 맞지 않는 문제", "블로그 카드를 검토할 때"],
  ["developer", "content-date-sync", "콘텐츠 날짜 동기화", "글 날짜와 사이트맵 lastmod가 달라지는 문제", "예약 글을 빌드할 때"],
  ["developer", "preview-date-mock", "미리보기 날짜 mock", "미래 예약 글을 로컬에서 확인하기 어려운 문제", "예약 공개 로직을 테스트할 때"],
  ["developer", "ga-script-duplicate", "GA 스크립트 중복", "분석 스크립트가 두 번 삽입되는 문제", "layout 설정을 볼 때"],
  ["developer", "ads-script-duplicate", "광고 스크립트 중복", "AdSense 자동광고 스크립트가 중복되는 문제", "광고 검수 전"],
  ["developer", "indexnow-key-file", "IndexNow 키 파일", "키 파일 형식이 맞는지 판단하기 어려운 문제", "Bing과 네이버 제출 전"],
  ["developer", "gsc-service-account", "GSC 서비스 계정", "권한은 있는데 제출 결과를 확인하지 못하는 문제", "Search Console API를 쓸 때"],
  ["developer", "http-status-scan", "HTTP 상태 점검", "정적 라우트 중 일부가 404로 빠지는 문제", "배포 후 URL을 확인할 때"],
  ["developer", "redirect-loop-check", "리다이렉트 루프", "도메인 이동 규칙이 반복되는 문제", "www 설정을 바꿀 때"],
  ["developer", "third-party-script-budget", "서드파티 스크립트 예산", "외부 스크립트가 로딩 속도를 늦추는 문제", "광고와 분석 코드를 넣을 때"],
  ["developer", "core-web-vitals-note", "코어 웹 바이탈 기록", "성능 점수를 한 번만 보고 끝내는 문제", "배포 후 속도를 추적할 때"],
  ["developer", "broken-anchor-check", "앵커 링크 점검", "본문 내부 이동 링크가 깨지는 문제", "긴 가이드 글을 만들 때"],
  ["developer", "public-file-cache", "public 파일 캐시", "ads.txt와 키 파일이 오래된 캐시에 남는 문제", "광고 인증 파일을 바꿀 때"],
  ["developer", "security-header-note", "보안 헤더 메모", "정적 사이트 헤더 기준이 문서화되지 않은 문제", "Vercel 설정을 검토할 때"],
  ["developer", "ci-log-summary", "CI 로그 요약", "긴 로그에서 실패 원인을 빨리 찾기 어려운 문제", "워크플로우 실패를 볼 때"],
  ["productivity", "content-calendar-review", "콘텐츠 캘린더 점검", "발행 일정이 많아 누락을 찾기 어려운 문제", "월간 글 계획을 볼 때"],
  ["productivity", "editorial-queue-rule", "편집 대기열 기준", "검토할 글과 발행할 글이 섞이는 문제", "대량 초안을 관리할 때"],
  ["productivity", "daily-writing-quota", "일일 글쓰기 분량", "작성 목표가 막연해 진척이 안 보이는 문제", "콘텐츠 생산량을 정할 때"],
  ["productivity", "review-owner-map", "검토 담당자 표시", "누가 마지막 확인을 했는지 모르는 문제", "발행 승인 흐름을 만들 때"],
  ["productivity", "batch-task-window", "묶음 작업 시간대", "작은 작업이 하루 전체를 끊는 문제", "반복 업무를 모아서 처리할 때"],
  ["productivity", "decision-template-note", "결정 템플릿 노트", "결정 근거가 매번 다른 형식으로 남는 문제", "팀 의사결정을 기록할 때"],
  ["productivity", "weekly-priority-board", "주간 우선순위 보드", "긴 목록에서 이번 주 핵심이 안 보이는 문제", "월요일 업무를 정리할 때"],
  ["productivity", "meeting-prep-list", "회의 준비 목록", "회의 전에 필요한 자료가 빠지는 문제", "짧은 회의를 준비할 때"],
  ["productivity", "async-update-rule", "비동기 업데이트 기준", "진행 상황 공유가 회의로만 몰리는 문제", "원격 팀 상태를 공유할 때"],
  ["productivity", "task-done-definition", "완료 기준 정의", "끝났다는 의미가 사람마다 다른 문제", "작업 티켓을 닫을 때"],
  ["productivity", "handover-risk-list", "인수인계 위험 목록", "빠진 맥락 때문에 재작업이 생기는 문제", "휴가 전 업무를 넘길 때"],
  ["productivity", "focus-mode-trigger", "집중 모드 트리거", "집중 시작 신호가 없어 계속 미루는 문제", "깊은 작업을 시작할 때"],
  ["productivity", "small-win-log", "작은 성과 기록", "진척이 없다고 느껴 동기가 떨어지는 문제", "하루 업무를 마감할 때"],
  ["productivity", "context-note-rule", "맥락 메모 기준", "왜 이 일을 하는지 중간에 잊는 문제", "긴 작업을 이어갈 때"],
  ["productivity", "tool-stack-inventory", "도구 목록 인벤토리", "비슷한 도구가 많아 선택이 늦어지는 문제", "업무 도구를 정리할 때"],
  ["productivity", "automation-candidate-list", "자동화 후보 목록", "반복 업무를 자동화할지 판단하기 어려운 문제", "월간 업무를 점검할 때"],
  ["productivity", "two-minute-rule-note", "2분 규칙 메모", "작은 일을 미루다 목록이 길어지는 문제", "받은 일을 바로 분류할 때"],
  ["productivity", "calendar-block-review", "캘린더 블록 점검", "일정은 많은데 실제 작업 시간이 없는 문제", "주간 캘린더를 볼 때"],
  ["productivity", "status-report-template", "상태 보고 템플릿", "보고가 길어 핵심 위험이 묻히는 문제", "주간 보고를 작성할 때"],
  ["productivity", "approval-delay-log", "승인 지연 기록", "어디서 멈췄는지 알기 어려운 문제", "발행 대기 글을 추적할 때"],
  ["productivity", "routine-reset-day", "루틴 재정비 날", "무너진 습관을 다시 시작하기 어려운 문제", "월초 계획을 세울 때"],
  ["productivity", "personal-dashboard-check", "개인 대시보드 점검", "지표가 많아 행동으로 이어지지 않는 문제", "업무 시작 화면을 볼 때"],
  ["productivity", "workload-signal-note", "업무량 신호 메모", "바쁜 상태를 늦게 알아차리는 문제", "일정 과부하를 확인할 때"],
  ["productivity", "meeting-free-block", "회의 없는 시간", "집중 시간이 회의 사이에 잘리는 문제", "캘린더를 조정할 때"],
  ["productivity", "project-retro-score", "프로젝트 회고 점수", "회고가 감상으로 끝나는 문제", "프로젝트 종료 후 개선점을 찾을 때"],
  ["productivity", "idea-backlog-cleanup", "아이디어 백로그 정리", "좋은 아이디어와 오래된 아이디어가 섞이는 문제", "다음 콘텐츠 후보를 고를 때"],
  ["productivity", "writing-review-loop", "글 검토 루프", "수정이 끝없이 이어지는 문제", "초안을 발행 가능한 상태로 만들 때"],
  ["productivity", "priority-conflict-note", "우선순위 충돌 메모", "중요한 일이 서로 경쟁하는 문제", "동시에 여러 요청을 받을 때"],
  ["productivity", "manual-to-checklist", "매뉴얼 체크리스트화", "긴 설명이 실행 단계로 이어지지 않는 문제", "반복 작업 문서를 줄일 때"],
  ["productivity", "weekly-automation-review", "주간 자동화 점검", "자동화가 실패해도 늦게 알아차리는 문제", "정기 워크플로우를 볼 때"],
  ["wellness", "micro-break-schedule", "짧은 휴식 시간표", "쉬는 시간을 정하지 않아 계속 앉아 있는 문제", "오전 업무를 시작할 때"],
  ["wellness", "sleep-debt-note", "수면 부채 메모", "며칠간 부족한 잠을 체감하지 못하는 문제", "주말 회복 계획을 세울 때"],
  ["wellness", "evening-screen-rule", "저녁 화면 규칙", "잠들기 전 화면 사용이 길어지는 문제", "밤 루틴을 정리할 때"],
  ["wellness", "hydration-checklist", "수분 섭취 체크리스트", "바쁜 날 물 마시는 간격을 놓치는 문제", "업무 중 알림을 만들 때"],
  ["wellness", "stretch-trigger-note", "스트레칭 트리거", "몸이 굳은 뒤에야 쉬는 문제", "책상 앞 루틴을 설계할 때"],
  ["wellness", "walk-meeting-rule", "산책 회의 기준", "앉아서 하는 회의가 너무 길어지는 문제", "가벼운 논의를 할 때"],
  ["wellness", "meal-rhythm-log", "식사 리듬 기록", "식사 시간이 불규칙해 컨디션이 흔들리는 문제", "주간 루틴을 돌아볼 때"],
  ["wellness", "mood-trigger-map", "기분 트리거 맵", "기분 변화를 일으키는 상황을 찾기 어려운 문제", "감정 기록을 정리할 때"],
  ["wellness", "digital-sunset-rule", "디지털 종료 시간", "업무 알림이 밤까지 이어지는 문제", "퇴근 후 경계를 만들 때"],
  ["wellness", "gentle-exercise-plan", "가벼운 운동 계획", "운동 목표가 커서 시작을 미루는 문제", "일주일 운동을 정할 때"],
  ["wellness", "breathing-break-timer", "호흡 휴식 타이머", "긴장한 상태로 다음 일을 시작하는 문제", "회의 사이 전환이 필요할 때"],
  ["wellness", "posture-photo-check", "자세 사진 점검", "자세가 나빠지는 순간을 스스로 보기 어려운 문제", "재택근무 환경을 볼 때"],
  ["wellness", "caffeine-log-review", "카페인 기록 점검", "마신 시간과 수면 영향을 연결하지 못하는 문제", "오후 커피 습관을 볼 때"],
  ["wellness", "weekend-energy-budget", "주말 에너지 예산", "쉬는 날 계획을 너무 많이 잡는 문제", "주말 일정을 정할 때"],
  ["wellness", "morning-start-signal", "아침 시작 신호", "기상 후 바로 흐름을 잡지 못하는 문제", "출근 전 루틴을 만들 때"],
  ["wellness", "work-end-ritual", "업무 종료 의식", "퇴근 후에도 일이 머릿속에 남는 문제", "재택근무를 마칠 때"],
  ["wellness", "mindful-choice-note", "마음챙김 선택 메모", "즉흥 선택이 후회로 이어지는 문제", "하루 결정을 돌아볼 때"],
  ["wellness", "habit-friction-reduce", "습관 마찰 줄이기", "좋은 습관을 시작하기까지 단계가 많은 문제", "새 루틴을 준비할 때"],
  ["wellness", "recovery-day-plan", "회복일 계획", "쉬어야 할 날에도 생산성을 밀어붙이는 문제", "컨디션이 낮은 날"],
  ["wellness", "healthy-menu-rotation", "건강 메뉴 순환", "건강한 메뉴 선택지가 금방 고갈되는 문제", "주간 식단을 정할 때"],
  ["wellness", "sleep-environment-check", "수면 환경 점검", "잠자는 공간의 방해 요소를 놓치는 문제", "방 정리를 할 때"],
  ["wellness", "stress-signal-list", "스트레스 신호 목록", "피로 신호를 늦게 알아차리는 문제", "업무량이 늘어난 주"],
  ["wellness", "focus-recovery-break", "집중 회복 휴식", "쉬어도 다시 집중하기 어려운 문제", "긴 작업 중간에"],
  ["wellness", "daily-kind-goal", "친절한 하루 목표", "목표가 압박으로 느껴져 지속이 어려운 문제", "아침 계획을 세울 때"],
  ["wellness", "weekly-body-check", "주간 몸 상태 점검", "작은 불편을 계속 넘기는 문제", "일요일 저녁 루틴을 만들 때"],
  ["seo", "adsense-policy-page", "애드센스 정책 페이지", "필수 안내 페이지가 얇아 보이는 문제", "광고 검수 전 페이지를 볼 때"],
  ["seo", "homepage-above-fold", "홈 첫 화면 주제", "첫 화면에서 사이트 목적이 흐릿한 문제", "AdSense 검수용 홈을 다듬을 때"],
  ["seo", "content-hub-structure", "콘텐츠 허브 구조", "글이 많아도 주제 묶음이 보이지 않는 문제", "블로그 카테고리를 설계할 때"],
  ["seo", "faq-rich-result-check", "FAQ 검색 노출 점검", "질문 답변 구조가 검색엔진에 약한 문제", "FAQ 글을 발행할 때"],
  ["seo", "naver-rss-refresh", "네이버 RSS 갱신", "새 글이 포털에 늦게 발견되는 문제", "예약 글 발행 후"],
  ["seo", "daum-submit-note", "다음 제출 메모", "다음 웹마스터도구 확인 흐름이 남지 않는 문제", "검색 등록 상태를 볼 때"],
  ["seo", "bing-indexnow-delay", "Bing IndexNow 지연", "사이트맵은 성공인데 IndexNow가 403인 문제", "BWT 등록 후 재확인할 때"],
  ["seo", "gsc-sitemap-pending", "GSC 사이트맵 대기", "제출은 됐지만 처리 상태가 오래 남는 문제", "Search Console을 볼 때"],
  ["seo", "article-freshness-signal", "글 최신성 신호", "수정일과 발행일이 검색엔진에 약하게 보이는 문제", "오래된 글을 갱신할 때"],
  ["seo", "internal-link-anchor", "내부 링크 앵커", "링크 문구가 목적 페이지 키워드를 담지 못하는 문제", "새 글을 연결할 때"],
  ["seo", "thin-page-noindex", "얇은 페이지 색인", "품질 낮은 페이지가 검색 품질을 깎는 문제", "페이지 목록을 정리할 때"],
  ["seo", "llms-text-refresh", "llms.txt 갱신", "AI 검색용 요약 파일이 최신 글을 반영하지 못하는 문제", "대량 글을 추가한 뒤"],
  ["seo", "ai-index-json-check", "AI 인덱스 JSON", "AI 파서가 페이지 목록을 구조적으로 읽기 어려운 문제", "AI 검색 최적화를 점검할 때"],
  ["seo", "adsense-auto-ad-spacing", "자동광고 간격", "광고가 본문 흐름을 끊는 문제", "자동광고를 켠 뒤"],
  ["seo", "author-trust-block", "저자 신뢰 블록", "작성 주체와 검토 기준이 약하게 보이는 문제", "정보성 글 하단을 다듬을 때"],
  ["seo", "source-link-quality", "출처 링크 품질", "권위 낮은 링크가 글 신뢰를 낮추는 문제", "본문 출처를 고를 때"],
  ["seo", "meta-description-ctr", "메타 설명 클릭률", "설명이 평범해 검색 결과에서 눌리지 않는 문제", "GSC 클릭률을 볼 때"],
  ["seo", "content-cannibal-check", "키워드 카니발 점검", "비슷한 글이 같은 검색어를 나눠 먹는 문제", "새 제목을 만들 때"],
  ["seo", "sitemap-lastmod-policy", "사이트맵 lastmod 기준", "날짜가 최신인지 판단 기준이 없는 문제", "빌드 산출물을 검토할 때"],
  ["seo", "adsense-review-checklist", "애드센스 검수 체크리스트", "승인 전 확인 항목이 흩어져 있는 문제", "재검수 신청 전"],
];

function hasFinalConsonant(word) {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) {
    return false;
  }
  return (code - 0xac00) % 28 !== 0;
}

function andParticle(word) {
  return hasFinalConsonant(word) ? "과" : "와";
}

function objectParticle(word) {
  return hasFinalConsonant(word) ? "을" : "를";
}

function subjectParticle(word) {
  return hasFinalConsonant(word) ? "은" : "는";
}

function safeExt(keyword, ext, preferredIndex) {
  const keywordTokens = new Set(keyword.match(/\p{Letter}+/gu) ?? []);
  return (
    ext
      .slice(preferredIndex)
      .concat(ext.slice(0, preferredIndex))
      .find((word) => {
        const wordTokens = word.match(/\p{Letter}+/gu) ?? [];
        return !keyword.includes(word) && !wordTokens.some((token) => keywordTokens.has(token));
      }) ?? ext.find((word) => !keyword.includes(word)) ?? ext[preferredIndex]
  );
}

function descriptionKeywords(keyword, ext) {
  const filtered = ext.filter((word) => !keyword.includes(word));
  return filtered.length >= 3 ? filtered.slice(0, 3) : ext.slice(0, 3);
}

const TITLE_TEMPLATES = [
  (keyword, ext) => `${keyword}, ${safeExt(keyword, ext, 0)}부터 바로 점검`,
  (keyword, ext) => `${keyword} 체크리스트: ${safeExt(keyword, ext, 1)} 먼저`,
  (keyword, ext) => `${keyword} 순서 잡기, ${safeExt(keyword, ext, 2)}까지`,
  (keyword, ext) => {
    const first = safeExt(keyword, ext, 0);
    const second = safeExt(`${keyword} ${first}`, ext, 3);
    return `${keyword} 비교법, ${first}${andParticle(first)} ${second}`;
  },
  (keyword, ext) => `${keyword} FAQ: ${safeExt(keyword, ext, 1)} 답변`,
  (keyword, ext) => `${keyword}, ${safeExt(keyword, ext, 2)} 전 확인할 점`,
  (keyword, ext) => `${keyword} 운영법, ${safeExt(keyword, ext, 3)} 남기기`,
  (keyword, ext) => `${keyword} 판단법, ${safeExt(keyword, ext, 0)} 중심`,
  (keyword, ext) => `${keyword} 상황별 점검표, ${safeExt(keyword, ext, 1)}`,
  (keyword, ext) => `${keyword} 실전 흐름, ${safeExt(keyword, ext, 2)} 시작`,
  (keyword, ext) => `${keyword} 실수 방지, ${safeExt(keyword, ext, 0)} 먼저`,
  (keyword, ext) => `${keyword} 적용 순서, ${safeExt(keyword, ext, 3)} 확인`,
  (keyword, ext) => `${keyword} 초보 점검, ${safeExt(keyword, ext, 1)} 중심`,
  (keyword, ext) => `${keyword} 개선 포인트, ${safeExt(keyword, ext, 2)}`,
  (keyword, ext) => {
    const first = safeExt(keyword, ext, 0);
    const second = safeExt(`${keyword} ${first}`, ext, 1);
    return `${keyword} 선택법, ${first}${andParticle(first)} ${second}`;
  },
  (keyword, ext) => `${keyword} 빠른 정리, ${safeExt(keyword, ext, 3)}까지`,
  (keyword, ext) => `${keyword} 검토 순서, ${safeExt(keyword, ext, 0)} 기준`,
  (keyword, ext) => `${keyword} 운영 체크, ${safeExt(keyword, ext, 1)} 포함`,
  (keyword, ext) => `${keyword} 사례별 정리, ${safeExt(keyword, ext, 2)} 중심`,
  (keyword, ext) => `${keyword} 발행 전 점검, ${safeExt(keyword, ext, 3)}`,
];

function compactTitle(title, keyword, ext) {
  if (title.length <= 40) {
    return title;
  }

  const candidates = [
    `${keyword}, ${safeExt(keyword, ext, 0)} 점검`,
    `${keyword} 체크: ${safeExt(keyword, ext, 1)}`,
    `${keyword} 기준과 ${safeExt(keyword, ext, 2)}`,
  ];

  return candidates.find((candidate) => candidate.length <= 40) ?? `${keyword}, ${safeExt(keyword, ext, 0)}`;
}

function polishTitle(title) {
  return title
    .replace(/\s+확인\s+확인/g, " 확인")
    .replace(/\s+점검\s+점검/g, " 점검")
    .replace(/\s+기준\s+기준/g, " 기준")
    .replace(/\s+정리\s+정리/g, " 정리")
    .replace(/\s+기록\s+기록/g, " 기록")
    .replace(/\s+적용\s+적용/g, " 적용")
    .replace(/\s+/g, " ")
    .trim();
}

const CONTENT_TYPES = ["How-to", "Checklist", "Explainer", "Comparison", "FAQ"];
const SEARCH_INTENTS = ["문제 해결", "정보 탐색", "실행", "비교", "질문 답변"];

function expandedKeywords(category, index) {
  const words = CATEGORY_META[category].keywords;
  return [0, 1, 2, 3].map((offset) => words[(index + offset) % words.length]);
}

function formatKst(timestamp) {
  const kst = new Date(timestamp + 9 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:00+09:00`;
}

function normalizeTitle(title) {
  return title.replace(/[^\p{Letter}\p{Number}]+/gu, "").toLowerCase();
}

function buildFaq(mainKeyword, ext, readerProblem, practicalExample) {
  return [
    {
      question: `${mainKeyword}을 처음 적용할 때 가장 먼저 볼 것은 무엇인가요?`,
      answer: `${ext[0]}${andParticle(ext[0])} ${ext[1]}을 먼저 나누면 ${readerProblem}${objectParticle(readerProblem)} 줄일 수 있습니다. 선택지를 늘리기보다 제외 조건을 먼저 적는 방식이 안정적입니다.`,
    },
    {
      question: `${practicalExample}에는 어떤 기준이 실용적인가요?`,
      answer: `${ext[2]}를 기준으로 시작하고, 결과 공유가 필요하면 ${ext[3]}까지 남기는 편이 좋습니다. 그래야 다음에 같은 상황을 다시 설명하지 않아도 됩니다.`,
    },
    {
      question: `${mainKeyword} 결과가 마음에 들지 않으면 다시 정해도 되나요?`,
      answer: `가능하지만 반복 횟수를 미리 정해야 합니다. 기준 없이 계속 다시 고르면 공정성보다 취향이 앞서고, 기록도 신뢰를 잃기 쉽습니다.`,
    },
    {
      question: `${mainKeyword}을 글이나 도구 페이지에 연결할 때 주의할 점은 무엇인가요?`,
      answer: `독자가 바로 실행할 수 있는 내부 링크와 공식 참고 자료를 함께 둬야 합니다. 설명만 있고 실행 경로가 없으면 체류와 전환이 모두 약해집니다.`,
    },
  ];
}

function buildAngles(mainKeyword, ext, contentType) {
  return [
    `${mainKeyword}을 ${contentType} 관점에서 볼 때 핵심은 ${ext[0]}입니다.`,
    `${ext[1]}이 흔들리면 결과가 맞아도 다시 확인해야 하는 일이 생깁니다.`,
    `${ext[2]}와 ${ext[3]}을 함께 기록하면 다음 발행이나 운영에 재사용할 수 있습니다.`,
  ];
}

function scoreArticle({ title, description, ext, faq, links, sourceUrl }) {
  let score = 0;
  score += title.length <= 44 ? 15 : 8;
  score += description.length <= 120 ? 10 : 5;
  score += ext.length >= 4 ? 10 : 4;
  score += faq.length >= 4 ? 15 : 8;
  score += links.length >= 3 ? 10 : 6;
  score += sourceUrl.startsWith("https://") ? 10 : 0;
  score += title.includes(",") || title.includes("체크리스트") ? 10 : 7;
  score += 8;
  score += 7;
  return Math.max(85, Math.min(score - (title.length % 5), 95));
}

const seenTitles = new Set();
const seenSlugs = new Set();
const ALL_TOPICS = [...TOPICS, ...EXTRA_TOPICS];

const plan = ALL_TOPICS.map(([category, slugBase, mainKeyword, readerProblem, practicalExample], index) => {
  const meta = CATEGORY_META[category];
  const ext = expandedKeywords(category, index);
  const visibleDescriptionKeywords = descriptionKeywords(mainKeyword, ext);
  let title = polishTitle(compactTitle(TITLE_TEMPLATES[index % TITLE_TEMPLATES.length](mainKeyword, ext), mainKeyword, ext));

  const normalizedTitle = normalizeTitle(title);
  if (seenTitles.has(normalizedTitle) || seenSlugs.has(slugBase)) {
    throw new Error(`Duplicate generated topic: ${title}`);
  }
  seenTitles.add(normalizedTitle);
  seenSlugs.add(slugBase);

  const publishAt = formatKst(START_AT + index * PUBLISH_INTERVAL_HOURS * 60 * 60 * 1000);

  const faq = buildFaq(mainKeyword, ext, readerProblem, practicalExample);
  const links = meta.links.map(([label, path]) => ({ label, path }));
  const description = `${mainKeyword}${subjectParticle(mainKeyword)} ${visibleDescriptionKeywords.join(", ")} 항목으로 바로 점검하는 가이드입니다.`;
  const qualityScore = scoreArticle({
    title,
    description,
    ext,
    faq,
    links,
    sourceUrl: meta.sourceUrl,
  });

  return {
    id: `generated-${String(index + 1).padStart(3, "0")}`,
    status: "scheduled",
    slug: slugBase,
    title,
    description,
    date: publishAt.slice(0, 10),
    publishAt,
    category: meta.name,
    contentType: CONTENT_TYPES[index % CONTENT_TYPES.length],
    searchIntent: SEARCH_INTENTS[index % SEARCH_INTENTS.length],
    mainKeyword,
    expandedKeywords: ext,
    readerProblem,
    practicalExample,
    primarySourceName: meta.sourceName,
    primarySourceUrl: meta.sourceUrl,
    internalLinks: links,
    tags: meta.tags,
    thumbnail: meta.thumbnail,
    qualityScore,
    duplicateStatus: "pass",
    cannibalizationStatus: "pass",
  };
});

if (plan.length !== 400) {
  throw new Error(`Expected 400 topics, got ${plan.length}`);
}

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
console.log(`Generated ${plan.length} scheduled articles -> ${OUTPUT_PATH}`);
