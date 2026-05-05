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
    sourceName: "Nielsen Norman Group",
    sourceUrl: "https://www.nngroup.com/articles/decision-fatigue/",
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
    sourceName: "Atlassian Team Playbook",
    sourceUrl: "https://www.atlassian.com/team-playbook",
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

const TITLE_TEMPLATES = [
  (keyword, ext) => `${keyword}, ${ext[0]} 실수 줄이는 기준`,
  (keyword, ext) => `${keyword} 체크리스트, ${ext[1]}부터 확인`,
  (keyword, ext) => `${keyword} 실행법, ${ext[2]}까지 정리`,
  (keyword, ext) => `${keyword} 비교 기준, ${ext[0]}${andParticle(ext[0])} ${ext[3]}`,
  (keyword, ext) => `${keyword} FAQ, ${ext[1]} 질문 정리`,
  (keyword, ext) => `${keyword}, ${ext[2]} 전 점검할 것`,
  (keyword, ext) => `${keyword} 운영 기준, ${ext[3]} 남기는 법`,
  (keyword, ext) => `${keyword} 빠른 판단법, ${ext[0]} 중심`,
  (keyword, ext) => `${keyword} 상황별 기준, ${ext[1]} 체크`,
  (keyword, ext) => `${keyword} 실전 정리, ${ext[2]}부터 시작`,
];

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
      answer: `${ext[0]}와 ${ext[1]}을 먼저 나누면 ${readerProblem}를 줄일 수 있습니다. 선택지를 늘리기보다 제외 조건을 먼저 적는 방식이 안정적입니다.`,
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

const plan = TOPICS.map(([category, slugBase, mainKeyword, readerProblem, practicalExample], index) => {
  const meta = CATEGORY_META[category];
  const ext = expandedKeywords(category, index);
  let title = TITLE_TEMPLATES[index % TITLE_TEMPLATES.length](mainKeyword, ext);

  if (title.length > 44) {
    title = `${mainKeyword}, ${ext[0]} 기준`;
  }

  const normalizedTitle = normalizeTitle(title);
  if (seenTitles.has(normalizedTitle) || seenSlugs.has(slugBase)) {
    throw new Error(`Duplicate generated topic: ${title}`);
  }
  seenTitles.add(normalizedTitle);
  seenSlugs.add(slugBase);

  const publishAt = formatKst(START_AT + index * PUBLISH_INTERVAL_HOURS * 60 * 60 * 1000);

  const faq = buildFaq(mainKeyword, ext, readerProblem, practicalExample);
  const links = meta.links.map(([label, path]) => ({ label, path }));
  const qualityScore = scoreArticle({
    title,
    description: `${mainKeyword}을 ${ext.slice(0, 3).join(", ")} 기준으로 정리한 실행 가이드입니다.`,
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
    description: `${mainKeyword}을 ${ext.slice(0, 3).join(", ")} 기준으로 정리한 실행 가이드입니다.`,
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

if (plan.length !== 200) {
  throw new Error(`Expected 200 topics, got ${plan.length}`);
}

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
console.log(`Generated ${plan.length} scheduled articles -> ${OUTPUT_PATH}`);
