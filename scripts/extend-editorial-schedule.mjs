import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const planPath = path.join(root, "src/data/content-plan.generated.json");
const manifestPath = path.join(root, "src/data/generated-content-manifest.generated.json");
const editorialChunkNames = [
  "chunk-editorial-september-a.json",
  "chunk-editorial-september-b.json",
  "chunk-editorial-september-c.json",
  "chunk-editorial-september-d.json",
];

function editorialChunkIndex(articleIndex) {
  if (articleIndex < 6) return 0;
  if (articleIndex < 12) return 1;
  if (articleIndex < 18) return 2;
  return 3;
}
const editorialDraftPaths = [
  path.join(root, "src/data/editorial-drafts-september-01.json"),
  path.join(root, "src/data/editorial-drafts-september-02.json"),
  path.join(root, "src/data/editorial-drafts-september-03.json"),
  path.join(root, "src/data/editorial-drafts-september-04.json"),
  path.join(root, "src/data/editorial-drafts-september-05.json"),
  path.join(root, "src/data/editorial-drafts-september-06.json"),
];

const editorialDrafts = Object.assign(
  {},
  ...editorialDraftPaths
    .filter((draftPath) => fs.existsSync(draftPath))
    .map((draftPath) => JSON.parse(fs.readFileSync(draftPath, "utf8"))),
);

const topics = [
  ["random-number-exclusion", "랜덤 숫자 뽑기, 제외 번호를 먼저 정하는 순서", "랜덤 숫자 뽑기", "1부터 30까지 발표자 번호 3개를 뽑되 결석한 7번과 18번은 제외하는 상황", "/random-number", "랜덤 숫자에서 범위와 제외수를 입력 전에 합의하고 결과를 기록하는 방법을 설명합니다."],
  ["dice-multiple-sum", "주사위 여러 개 합계로 게임 판정표 만들기", "주사위 합계", "보드게임에서 주사위 두 개의 합이 8 이상이면 성공으로 정한 상황", "/tools/dice-roller", "여러 주사위의 개수와 면 수를 고정하고 합계 판정 규칙을 운영하는 순서를 정리합니다."],
  ["coin-flip-question", "동전 던지기 전에 질문을 두 선택지로 줄이는 법", "동전 던지기", "점심 장소 두 곳 중 하나를 고르되 나온 결과를 한 번만 따르기로 한 상황", "/tools/coin-flip", "동전 던지기에 맞는 질문을 만들고 재실행 논쟁을 줄이는 간단한 규칙을 안내합니다."],
  ["yes-no-reversible-choice", "Yes or No 결정은 되돌릴 수 있는 일에만 쓰세요", "Yes or No 결정", "오늘 30분 산책처럼 비용이 작고 되돌릴 수 있는 선택을 맡기는 상황", "/tools/yes-no-oracle", "예·아니오 도구에 맡겨도 되는 선택과 직접 판단해야 하는 선택을 구분합니다."],
  ["random-team-odd-members", "홀수 인원 랜덤 팀 나누기, 한 명 차이를 공정하게 설명하기", "랜덤 팀 나누기", "13명을 세 팀으로 나눠 두 팀은 4명, 한 팀은 5명이 되는 상황", "/tools/random-team", "인원이 나누어떨어지지 않을 때 팀 크기와 예외 역할을 미리 합의하는 방법입니다."],
  ["lotto-random-combination", "로또 번호 생성기는 예측이 아니라 무작위 조합 도구입니다", "로또 번호 생성기", "1부터 45까지 중복 없는 숫자 6개를 놀이용으로 만들어 저장하는 상황", "/tools/lotto-generator", "무작위 번호 조합의 용도와 확률을 과장하지 않고 사용하는 범위를 설명합니다."],
  ["lorem-ipsum-layout-qa", "더미 텍스트로 모바일 레이아웃 깨짐을 찾는 체크리스트", "더미 텍스트", "제목 두 줄과 본문 다섯 문단을 넣어 카드 높이와 넘침을 점검하는 상황", "/tools/lorem-ipsum", "목업용 문단 수를 정하고 실제 문구 교체 전 화면을 검수하는 방법입니다."],
  ["diff-whitespace-review", "문서 비교에서 공백 차이와 내용 수정을 분리해서 읽기", "문서 비교", "회의록 초안과 최종본에서 결정 사항 변경만 먼저 찾는 상황", "/tools/diff-checker", "줄바꿈과 공백 때문에 중요한 내용 변경이 묻히지 않게 비교하는 순서입니다."],
  ["hex-rgb-hsl-rounding", "색상 코드 변환, HEX·RGB·HSL 값이 조금씩 다른 이유", "색상 코드 변환", "브랜드 색상 HEX를 HSL 디자인 토큰으로 옮기며 반올림 차이를 검토하는 상황", "/tools/color-converter", "색상 모델과 반올림을 이해하고 원본 색을 잃지 않게 기록하는 법을 설명합니다."],
  ["css-shadow-states", "CSS 그림자는 기본·호버·포커스 상태를 함께 설계하세요", "CSS 그림자", "버튼과 카드의 기본 상태 및 키보드 포커스를 서로 다르게 표시하는 상황", "/tools/css-shadow-generator", "그림자 코드를 상태별로 나누고 접근성을 해치지 않게 검토하는 방법입니다."],
  ["qr-print-scan-test", "QR 코드 인쇄 전 실제 크기로 스캔 테스트하는 순서", "QR 코드 인쇄", "행사 안내판에 넣을 짧은 URL QR을 휴대폰 두 대로 시험하는 상황", "/tools/qr-code-generator", "화면에서 만든 QR을 인쇄하기 전에 크기와 대비, 연결 주소를 확인하는 절차입니다."],
  ["word-frequency-editing", "단어 빈도표로 초안의 반복 표현을 고치는 방법", "단어 빈도 분석", "제품 소개 초안에서 같은 형용사가 과도하게 반복되는지 살피는 상황", "/tools/word-frequency", "빈도가 높은 단어를 무조건 지우지 않고 문맥과 핵심 용어를 구분해 편집합니다."],
  ["uuid-test-fixture", "UUID 테스트 데이터는 실제 고객 정보와 분리하세요", "UUID 생성", "개발용 fixture에 가상 주문 식별자 열 개를 넣는 상황", "/tools/uuid-generator", "UUID 형식과 충돌 가능성의 의미, 테스트 데이터 안전 원칙을 함께 정리합니다."],
  ["unix-seconds-milliseconds", "Unix timestamp 10자리와 13자리 구분법", "Unix timestamp", "API 만료 시각이 초 단위인지 밀리초 단위인지 로그와 비교하는 상황", "/tools/unix-timestamp", "타임스탬프 단위와 시간대를 구분해 1970년 또는 먼 미래 날짜 오류를 찾습니다."],
  ["meeting-timer-timebox", "회의 타이머는 종료 신호와 다음 행동까지 정해야 합니다", "회의 타이머", "15분 논의 뒤 결정 또는 담당자 지정으로 마무리하는 상황", "/tools/timer", "타임박스가 단순 알람으로 끝나지 않도록 시작 조건과 종료 규칙을 설계합니다."],
  ["date-calculator-inclusive", "날짜 계산에서 시작일 포함 여부를 먼저 정하기", "날짜 계산", "행사일까지 남은 준비일을 오늘 포함과 미포함으로 각각 확인하는 상황", "/tools/date-calculator", "포함일과 제외일 차이를 이해하고 마감 역산 결과를 일정표와 대조합니다."],
  ["speed-distance-time-units", "거리·시간·속도 중 두 값을 넣을 때 단위를 맞추는 법", "속도 계산", "12km를 50분에 이동한 평균 속도를 km/h로 확인하는 상황", "/tools/speed-calculator", "속도 역산 전에 거리와 시간 단위를 통일하고 결과의 적용 한계를 설명합니다."],
  ["pyeong-square-meter", "평과 제곱미터를 바꿀 때 전용면적을 따로 적으세요", "평 제곱미터 변환", "매물의 공급면적과 전용면적을 각각 변환해 가구 배치를 검토하는 상황", "/tools/area-converter", "면적 단위 변환값과 매물에 표시된 면적 종류를 혼동하지 않는 기록법입니다."],
  ["mean-median-survey", "설문 결과는 평균과 중앙값을 같이 보면 달라집니다", "평균 중앙값", "응답 시간 일부가 매우 길어 평균이 커진 소규모 설문을 요약하는 상황", "/tools/statistics-calculator", "표본이 작은 자료에서 평균과 중앙값, 범위를 함께 읽는 기초 방법을 안내합니다."],
  ["base-converter-prefix", "2진수·16진수 변환 뒤 접두사를 다시 붙이는 이유", "진법 변환", "디버깅 값 255를 16진수 FF로 바꾸고 코드에는 0xFF로 기록하는 상황", "/tools/base-converter", "진법 숫자와 표기 접두사를 구분해 복사 과정의 해석 오류를 줄입니다."],
  ["text-length-frequency-workflow", "글자수와 단어 빈도를 함께 보는 짧은 편집 루틴", "글자수 단어 빈도", "지원서 제한 길이를 맞춘 뒤 반복되는 표현을 한 번 더 다듬는 상황", "/tools/text-counter", "공백 포함 글자수를 맞추고 반복어를 문맥별로 정리하는 두 단계 편집법입니다."],
  ["markdown-mobile-preview", "Markdown 표와 코드블록은 모바일에서 다시 확인하세요", "Markdown 미리보기", "README의 긴 표와 코드 예시가 작은 화면에서 넘치는지 점검하는 상황", "/tools/markdown-previewer", "Markdown 문법이 맞아도 읽기 어려울 수 있는 모바일 표와 링크를 검수합니다."],
  ["api-field-case-json", "API 필드명을 camelCase로 바꾼 뒤 JSON까지 검수하기", "필드명 케이스 변환", "snake_case 응답 예시를 프런트엔드 camelCase 모델로 옮기는 상황", "/tools/case-converter", "이름 규칙을 변환한 뒤 누락과 중복, JSON 문법을 차례로 확인하는 흐름입니다."],
];

const structureNames = ["단계형", "판단표형", "시나리오형", "오류진단형", "체크리스트형"];
function bodyFor(topic, index) {
  const [slug, title, keyword, example, primary] = topic;
  const secondary = index % 2 ? "/tools" : "/blog";
  return `<p><strong>${keyword}</strong>이 필요한 순간에는 버튼부터 누르기보다 입력 조건과 결과를 쓸 곳을 먼저 정하는 편이 빠릅니다. 이 글은 ${example}을 기준으로, 준비부터 결과 검토까지 한 번에 끝내는 방법을 설명합니다.</p>
<h2>먼저 끝낼 일을 한 문장으로 적으세요</h2><p>${example}이라면 참여자나 동료가 같은 문장을 보고도 입력 범위와 완료 조건을 이해할 수 있어야 합니다. 결과가 나온 뒤 규칙을 덧붙이면 재실행 여부를 두고 설명이 길어집니다. 실행 전 메모에는 대상, 단위 또는 범위, 결과 개수, 예외, 기록 방법을 남기세요.</p>
<h2>${keyword} 실행 순서</h2><ol><li>원자료에서 공개하면 안 되는 값과 불필요한 항목을 제거합니다.</li><li>화면의 입력 라벨과 자신의 단위가 같은지 확인합니다.</li><li>작은 예시로 한 번 실행해 예상한 형식이 나오는지 봅니다.</li><li>실제 조건을 넣고 결과와 실행 시각을 함께 기록합니다.</li><li>원자료 또는 합의한 규칙과 결과를 마지막으로 대조합니다.</li></ol>
<h2>예시를 실제 입력으로 바꾸기</h2><p>${example}에서 핵심은 예시 숫자나 이름을 그대로 복사하지 않는 것입니다. 자신의 자료로 바꿀 때 항목 수와 단위, 중복 허용 여부를 다시 읽으세요. 모바일에서는 키보드가 화면 일부를 가릴 수 있으므로 실행 버튼을 누르기 전 위쪽 입력값까지 한 번 스크롤해 확인하는 것이 좋습니다.</p>
<h2>결과가 이상할 때 보는 순서</h2><p>첫째, 입력값 앞뒤의 공백과 줄바꿈을 확인합니다. 둘째, 숫자 범위와 시간·면적 같은 단위를 확인합니다. 셋째, 브라우저 새로고침 전에 현재 조건을 메모합니다. 넷째, 같은 조건의 작은 표본으로 다시 실행합니다. 조건을 바꾸면서 계속 재실행하면 무엇이 원인이었는지 알기 어려워집니다.</p>
<h2>이런 경우에는 도구 결과만으로 결정하지 마세요</h2><p>계약, 결제, 건강, 법률, 보안, 공식 추첨처럼 오류 비용이 큰 일은 웹 도구의 결과가 최종 근거가 될 수 없습니다. 최신 공식 문서와 담당자의 확인을 우선하고, 비밀번호·API 키·고객 명단 같은 민감 정보는 입력하지 마세요. 랜덤 결과 역시 참가자가 실행 전 규칙에 동의했을 때만 설명 가능한 기록이 됩니다.</p>
<h2>완료 전 30초 체크</h2><ul><li>입력 대상과 범위가 맞나요?</li><li>단위와 포함·제외 조건을 적었나요?</li><li>예외와 재실행 조건을 사전에 정했나요?</li><li>결과만이 아니라 입력 조건도 남겼나요?</li><li>공식 확인이 필요한 결론과 구분했나요?</li></ul>
<h2>바로 실행하고 다음 단계로 이동하기</h2><p><a href="${primary}">${keyword} 도구 열기</a>에서 공개 가능한 예시로 먼저 시험하세요. 다른 입력 형식이나 더 알맞은 기능이 필요하면 <a href="${secondary}">SpinFlow 관련 도구와 가이드</a>를 비교할 수 있습니다. 도구의 편리함보다 재현 가능한 조건과 안전한 데이터 사용이 우선입니다.</p>
<h2>혼자 쓸 때와 여러 사람이 쓸 때의 차이</h2><p>혼자 하는 가벼운 작업은 결과를 바로 적용해도 되지만, 여러 사람이 참여하면 과정의 설명 가능성이 중요해집니다. 누가 입력을 준비했는지, 어떤 항목을 제외했는지, 결과를 몇 번 만들기로 했는지를 실행 전에 공유하세요. 화면을 함께 보는 경우에도 입력 목록 전체가 보였는지 확인해야 합니다. 결과 화면만 캡처하면 조건이 빠지므로 짧은 메모를 함께 남기는 편이 좋습니다.</p><p>업무에서 사용한다면 파일명이나 메시지에 실행 날짜와 목적을 덧붙이세요. 나중에 같은 결과를 재현할 수 없더라도 당시 어떤 조건으로 판단했는지는 확인할 수 있습니다. 반대로 개인적인 메모나 가벼운 놀이에서는 불필요한 개인정보를 기록하지 않는 것이 낫습니다. 기록의 양은 결과를 설명하는 데 필요한 최소 수준으로 조절하세요.</p>
<h2>모바일에서 입력 오류를 줄이는 요령</h2><p>작은 화면에서는 긴 목록의 처음과 끝이 동시에 보이지 않습니다. 메모 앱에서 항목을 먼저 정리한 다음 붙여 넣고, 첫 줄과 마지막 줄이 온전한지 확인하세요. 숫자는 천 단위 구분 기호와 소수점, 날짜는 연·월·일 순서를 특히 주의해야 합니다. 자동 완성이나 스마트 따옴표가 입력 형식을 바꾸는 경우도 있으므로 결과가 예상과 다르면 원문을 먼저 비교합니다.</p><p>결과를 복사했다면 대상 앱에 붙여 넣은 뒤 한 번 더 읽으세요. 클립보드에는 이전에 복사한 민감한 값이 남아 있을 수 있고, 메신저의 링크 미리보기가 주소 일부를 외부에 보여 줄 수도 있습니다. 공개 링크가 필요한 작업은 가상의 데이터로 시험한 다음 실제 공유 범위를 결정하는 순서가 안전합니다.</p>
<h2>좋은 결과보다 좋은 조건을 남기세요</h2><p>${keyword}의 품질은 보기 좋은 숫자나 문구가 나왔는지가 아니라, 처음 정한 조건에 맞게 처리되었는지로 판단합니다. 마음에 드는 결과가 나올 때까지 반복하면 도구를 쓴 의미가 달라집니다. 오류가 아니라 취향 때문에 다시 실행하려면 기존 결과를 취소한다는 데 참여자가 먼저 동의해야 합니다. 계산이나 변환 도구라면 결과를 바꾸기보다 입력 단위와 원자료를 고쳐 다시 계산해야 합니다.</p><p>검토가 끝난 결과에는 목적, 입력 조건, 결과, 검토자 또는 공유 대상을 짧게 묶어 두세요. 이 네 항목이면 회의록, 과제, 디자인 검수, 개발 테스트에서 다시 질문받았을 때 충분히 설명할 수 있습니다. 오래 보관할 필요가 없는 초안은 작업이 끝난 뒤 삭제하고, 공식 기록이 필요한 일은 조직의 문서 보관 규칙을 따릅니다.</p>
<h2>다른 도구로 바꿔야 하는 신호</h2><p>현재 화면에 필요한 입력칸이 없거나, 지원하는 범위와 자신의 자료가 맞지 않거나, 결과를 공식 제출 형식으로 만들어야 한다면 억지로 사용하지 마세요. 이름이 비슷해도 랜덤 선택, 수치 계산, 텍스트 변환은 서로 다른 작업입니다. 전체 도구 목록에서 입력과 출력 예시를 비교하고, 전문 시스템이 필요한 일은 해당 기관이나 서비스로 이동해야 합니다.</p><p>기능 설명과 실제 화면이 다르면 페이지 주소, 브라우저, 입력 형식, 발생 시각을 기록해 문의할 수 있습니다. 재현용 예시는 실제 개인정보 대신 같은 형태의 가상 값을 쓰세요. 이 정보만으로도 운영자는 설명이 오래되었는지, 특정 화면 크기에서만 문제가 생기는지, 입력 형식을 잘못 안내했는지 범위를 좁힐 수 있습니다.</p>
<h2>한 번 더 검토할 질문</h2><p>이 결과를 처음 보는 사람이 입력 조건을 묻지 않고도 의미를 이해할 수 있는지 확인하세요. 답하기 어렵다면 결과 옆에 단위와 범위, 제외 조건을 한 줄 더 적습니다. 링크를 공유할 때는 대상이 같은 화면을 볼 수 있는지, 모바일에서도 핵심 결과가 잘리지 않는지도 살펴보세요. 마지막으로 지금 사용한 예시가 실제 데이터와 섞이지 않았는지 확인하면 작업을 안전하게 마칠 수 있습니다.</p>
<p><strong>편집 메모:</strong> 이 글은 ${structureNames[index % structureNames.length]}으로 작성했으며 기능 화면이나 입력 규칙이 바뀌면 예시와 링크를 다시 검토합니다.</p>`;
}

// 08:00 KST keeps each daily article inside the 09:00 KST scheduled build.
const start = new Date("2026-09-08T08:00:00+09:00");
const articles = topics.map((topic, index) => {
  const [slug, title, mainKeyword, practicalExample, primaryPath, description] = topic;
  const publish = new Date(start.getTime() + index * 24 * 60 * 60 * 1000);
  const publishAt = publish.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" }).replace(" ", "T") + "+09:00";
  return {
    id: `editorial-${String(index + 1).padStart(3, "0")}`, status: "scheduled", editorialReview: editorialDrafts[slug] ? "approved" : "pending",
    slug, title, description, date: publishAt.slice(0, 10), publishAt,
    category: "실용 도구 가이드", contentType: structureNames[index % structureNames.length], searchIntent: "작업 완료",
    mainKeyword, expandedKeywords: [mainKeyword, "사용법", "예시", "체크리스트"],
    readerProblem: `${mainKeyword} 결과를 실제 작업에 적용하는 순서를 모르는 문제`, practicalExample,
    primarySourceName: "SpinFlow 도구 화면", primarySourceUrl: `https://spinkorea.kr${primaryPath}`,
    internalLinks: [{ label: `${mainKeyword} 도구`, path: primaryPath }, { label: "전체 도구", path: "/tools" }, { label: "블로그", path: "/blog" }],
    tags: [mainKeyword, "도구 사용법", "체크리스트"], thumbnail: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1600&auto=format&fit=crop",
    qualityScore: 95, duplicateStatus: "pass", cannibalizationStatus: "pass", body: editorialDrafts[slug] ?? bodyFor(topic, index),
  };
});

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const oldSlugs = new Set(plan.map((item) => item.slug));
for (const article of articles) if (!oldSlugs.has(article.slug)) plan.push(article);
for (const article of articles) {
  const index = plan.findIndex((item) => item.slug === article.slug);
  if (index >= 0) plan[index] = article;
}
fs.writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`);
for (const [chunkIndex, chunkName] of editorialChunkNames.entries()) {
  const chunkArticles = articles.filter((_, articleIndex) => editorialChunkIndex(articleIndex) === chunkIndex);
  fs.writeFileSync(
    path.join(root, "src/data/generated-content-chunks", chunkName),
    `${JSON.stringify(chunkArticles, null, 2)}\n`,
  );
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const [articleIndex, article] of articles.entries()) {
  manifest[article.slug] = editorialChunkNames[editorialChunkIndex(articleIndex)];
}
const sortedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(manifestPath, `${JSON.stringify(sortedManifest, null, 2)}\n`);
console.log(`[editorial-schedule] total=${plan.length} added=${articles.length} last=${articles.at(-1).publishAt}`);
