import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_ORIGIN = "https://spinkorea.kr";
const BUILD_NOW = new Date(process.env.BUILD_NOW ?? process.env.PUBLISH_NOW ?? Date.now());
const TODAY = formatKstDate(BUILD_NOW);
const SITE_PAGES_PATH = path.join(ROOT, "src", "data", "site-pages.json");
const POSTS_PATH = path.join(ROOT, "src", "data", "posts.tsx");
const CONTENT_PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const POST_METADATA_PATH = path.join(ROOT, "src", "data", "post-metadata.generated.json");
const STATIC_CONTENT_PATH = path.join(ROOT, "node_modules", ".cache", "spinkorea-generated-content-html.json");

const sitePages = JSON.parse(fs.readFileSync(SITE_PAGES_PATH, "utf8"));

const approvalMetaOverrides = {
  "/": {
    title: "spinkorea SpinFlow free roulette and utility tools",
    description:
      "spinkorea SpinFlow provides free roulette, random draw, calculator, converter, and productivity tools with clear policies, sitemap, RSS, and Auto Ads disclosure.",
  },
  "/spinflow": {
    title: "spinkorea SpinFlow roulette wheel guide",
    description:
      "spinkorea SpinFlow roulette helps visitors create fair random choices, compare templates, record results, and understand safe use before sharing a draw.",
  },
  "/lunch-menu": {
    title: "spinkorea SpinFlow 점심 메뉴 추천 룰렛",
    description:
      "spinkorea SpinFlow에서 점심 후보와 식사 조건을 확인한 뒤 룰렛으로 가벼운 메뉴 선택을 시작하세요.",
  },
  "/random-number": {
    title: "spinkorea SpinFlow 랜덤 숫자 뽑기",
    description:
      "spinkorea SpinFlow 랜덤 숫자 도구는 범위와 중복 규칙을 확인한 뒤 수업, 게임, 순서 정하기용 숫자를 생성합니다.",
  },
  "/tools": {
    title: "spinkorea SpinFlow 무료 웹 유틸리티 모음",
    description:
      "spinkorea SpinFlow의 랜덤, 텍스트, 개발, 계산, 날짜, 건강, 생활 금융 도구를 목적별로 찾아보세요.",
  },
  "/faq": {
    title: "spinkorea SpinFlow 자주 묻는 질문",
    description:
      "spinkorea SpinFlow 룰렛과 유틸리티의 사용법, 결과 한계, 개인정보, 광고, 오류 제보 기준을 확인하세요.",
  },
  "/blog": {
    title: "spinkorea SpinFlow 블로그 | 결정·생산성·유틸리티 가이드",
    description:
      "spinkorea SpinFlow 블로그에서 랜덤 선택, 계산, 텍스트·개발 도구를 실제 작업에 적용하는 방법을 읽어보세요.",
  },
  "/tools/lotto-generator": {
    title: "spinkorea SpinFlow 로또 번호 생성기",
    description:
      "spinkorea SpinFlow에서 1부터 45까지 번호 6개를 1~5게임 생성하고, 당첨을 보장하지 않는 도구의 한계를 확인하세요.",
  },
  "/tools/dice-roller": {
    title: "spinkorea SpinFlow 온라인 주사위 던지기",
    description:
      "spinkorea SpinFlow 온라인 주사위는 1~5개의 6면 주사위를 굴려 게임, 수업, 순서 정하기에 참고 결과를 제공합니다.",
  },
  "/tools/coin-flip": {
    title: "spinkorea SpinFlow 동전 던지기",
    description:
      "spinkorea SpinFlow 동전 던지기로 앞면과 뒷면 중 하나를 선택하고, 두 후보의 의미와 재실행 규칙을 먼저 정하세요.",
  },
  "/tools/yes-no-oracle": {
    title: "spinkorea SpinFlow Yes or No 결정 도구",
    description:
      "spinkorea SpinFlow Yes or No 도구는 질문에 YES, NO, MAYBE, TRY AGAIN 중 하나를 보여주는 가벼운 결정 보조 기능입니다.",
  },
  "/tools/random-team": {
    title: "spinkorea SpinFlow 랜덤 팀 편성기",
    description:
      "spinkorea SpinFlow 랜덤 팀 편성기에 이름을 한 줄씩 입력하고 2~10개 팀으로 나누는 규칙과 개인정보 주의사항을 확인하세요.",
  },
};

const approvalBodies = {
  "/": [
    "spinkorea is the public home of SpinFlow, a free web utility collection for people who need quick decisions, lightweight calculations, text helpers, and random draw tools without account registration. The site is built around practical tasks such as choosing a lunch menu, drawing a presenter order, generating a number, checking text length, converting data formats, or creating a simple timer workflow.",
    "The home page is designed to be understandable before the React application hydrates. It explains the site purpose, links to policy pages, exposes sitemap, RSS, robots, and llms assets, and keeps the main tool paths reachable through normal links. This gives search crawlers and AdSense reviewers enough context to evaluate the site even when they do not interact with the roulette component.",
    "SpinFlow results are generated from user input, templates, or browser-side randomization logic. They are useful for entertainment, education, classroom activities, meetings, small events, and everyday convenience, but they are not legal, medical, financial, or professional advice. Important decisions should still be confirmed with responsible people, official rules, or the relevant organization.",
    "The site separates utility content from advertising. Google AdSense Auto Ads may load through the approved publisher script, but the generated static guidance does not insert manual ad slots and does not change tool behavior based on ad display. Utility links, blog links, policy links, and correction paths remain visible so users can keep using the page even if ads are not shown.",
    "Editorial quality is maintained by describing what each tool does, when it is appropriate, and where users should go next. Blog articles and tool pages are listed in sitemap and RSS outputs so new guidance can be discovered by crawlers. When a tool page is short because the interactive UI carries the main function, this static explanation provides context about purpose, limitations, privacy, and responsible use.",
    "Visitors who find an error, unclear label, broken route, or policy concern can use the contact page. The privacy and terms pages explain data handling, cookies, advertising, and acceptable use. This review path helps the service stay useful for real visitors while reducing low-value-content risk during AdSense review.",
    "The recommended path for a new visitor is simple. Use the roulette page when a group needs one result from a list, use the random number and dice tools when a numeric result is easier, use text utilities when a document needs counting or formatting, and use calculators when a date, time, percentage, unit, or body index needs a quick check. This structure keeps the site focused on useful tasks instead of unrelated filler.",
    "Each tool should be understood with its own limits. A roulette result is only as fair as the entered list, a password result should still be stored securely by the user, a calculator result should be checked when the stakes are high, and a formatter result should be reviewed before it is copied into production work. The site repeats these practical cautions because visitors often arrive directly from search without reading the about page first.",
    "The service also tries to reduce friction for mobile users. Main navigation, policy links, sitemap links, and the primary utility route remain accessible without a login flow, subscription wall, or heavy onboarding sequence. That matters for AdSense review because a reviewer should be able to see a real service, verify the publisher context, and understand the value of the page within a few scrolls.",
    "spinkorea does not present generated random results as guaranteed truth. The role of the site is to make low-risk choices easier, document basic guidance, and provide a collection of small browser tools. The editorial standard is to explain use cases, connect related utilities, disclose advertising, and maintain crawlable pages that remain useful even when JavaScript loads slowly or a visitor only reads the static HTML.",
    "Maintenance checks include public sitemap generation, RSS output for blog guidance, robots.txt with a sitemap reference, llms.txt for machine-readable context, canonical URLs, and static shells for important routes. These assets help search systems understand that SpinFlow is a coherent utility site with supporting documentation, not only a single interactive widget.",
    "For content quality, the site favors concrete workflows over generic claims. Examples include how to prepare a participant list before a draw, how to compare randomization methods, how to check text length before submitting a document, and how to choose the right calculator for a common everyday task. These examples support real user intent and give reviewers more context than a short tool label would provide.",
    "If the home page is used as an entry point for a school, office, event, or family activity, the safest approach is to explain the rule first, enter the options openly, run the tool once, and record the result if the group needs accountability. This keeps the tool transparent while preserving the lightweight nature of the service.",
  ],
  "/spinflow": [
    "spinkorea SpinFlow roulette is an interactive decision tool for creating a fair random choice from a list of options. Users can type their own items, choose a template, spin the wheel, save the latest result, and share a simple outcome when the URL remains safe to share. The page is intended for low-risk everyday choices such as lunch menus, presentation order, classroom activities, party games, and quick team discussions.",
    "The roulette page should be used as a decision aid, not as a substitute for official selection rules, paid prize audits, legal drawings, medical advice, financial advice, or employment decisions. If a draw has legal or monetary impact, the organizer should document the participant list, rules, randomization method, and appeal process outside this casual web tool.",
    "For better results, users should remove duplicate entries, agree on the participant list before spinning, avoid changing weights after the result, and save a screenshot or written record when the outcome needs to be shared. The tool is strongest when the group already accepts that a random decision is appropriate.",
    "This static section is included so crawlers and AdSense reviewers can understand the purpose of the route before the roulette interface hydrates in the browser. The route has a clear canonical URL, a host-front meta title and description, internal links to policy pages, and no manual ad unit placement inside the tool explanation.",
    "SpinFlow also links to related utilities such as dice rolling, coin flipping, random teams, number generation, text counters, calculators, converters, and blog guidance. These internal links help visitors move from one practical task to another without encountering empty category pages or doorway-only content.",
    "The advertising policy is conservative. Google AdSense Auto Ads may appear through the site-wide loader, but ad display does not affect the random result, the item list, the templates, or the saved result history. If a visitor notices a confusing ad position, broken layout, or outdated instruction, the contact page is the proper correction route.",
    "A good roulette session starts before the spin button is pressed. The organizer should write the options in plain language, remove duplicates unless repeated entries are intentionally used as weights, confirm that everyone understands the rule, and avoid editing the list after a result has appeared. This keeps the process easier to explain when the result is shared with a classroom, meeting, club, or small event group.",
    "Templates are useful when the user needs a common starting point, but the final list should still match the actual situation. A lunch template does not know dietary restrictions, a game template does not know house rules, and a presentation-order template does not know who is absent. SpinFlow gives structure, while the user remains responsible for the final list.",
    "The page stores recent results only for convenience in the browser experience. Users should not treat browser history as a permanent audit record. When a draw matters, copy the participant list, note the date, write the result somewhere separate, and keep any organizer rule outside the tool. This guidance prevents the roulette page from being mistaken for an official compliance system.",
    "The route is part of a broader utility site rather than a standalone ad page. Internal navigation points to the home page, blog, policy pages, random number tools, dice tools, coin flip tools, team tools, calculators, converters, and text helpers. These links give users real next steps and show crawlers that the roulette page belongs to a larger practical service.",
    "Privacy expectations are intentionally modest. The roulette works with simple user-entered labels, and visitors should avoid entering sensitive personal information, phone numbers, addresses, account details, medical data, or private business secrets into any casual decision tool. If an option needs privacy protection, use a neutral label instead.",
    "The static guidance also helps accessibility and resilience. A visitor can read the page purpose, warnings, policy links, and related routes even before the animated wheel is available. This is important for slow devices, text-only crawlers, and review systems that evaluate the HTML response rather than completing every interactive action.",
    "AdSense approval depends on useful content, clear ownership, and policy compliance. This route supports that by explaining the tool, identifying limitations, keeping manual ad slots out of the app surface, providing internal links, and maintaining canonical metadata. The goal is to make the page valuable as a free decision guide as well as an interactive roulette.",
    "When users need a more suitable random method, they should choose the related tool instead of forcing every decision into a wheel. Dice are better for board-game style outcomes, a coin flip is better for two equal options, a random team tool is better for grouping people, and a number generator is better when only a numeric range matters.",
  ],
  "/lunch-menu": [
    "점심 메뉴 추천 룰렛은 식사 후보가 많아 결정을 미루는 상황에서 사용할 수 있는 가벼운 선택 도구입니다. 한식, 중식, 일식, 양식, 분식처럼 큰 범주를 먼저 정하거나, 실제 주변 식당 이름을 직접 입력해 모임 구성원이 받아들이기 쉬운 방식으로 결과를 만들 수 있습니다.",
    "좋은 점심 추첨은 룰렛을 돌리기 전에 조건을 정하는 데서 시작합니다. 예산, 이동 가능 시간, 대기 시간, 알레르기, 채식 여부, 전날 먹은 메뉴, 배달 가능 여부를 먼저 걸러내면 결과가 나와도 다시 논쟁하는 일을 줄일 수 있습니다.",
    "SpinFlow는 식당 품질이나 영업 시간을 보장하지 않습니다. 결과가 나온 뒤에는 지도, 식당 공지, 배달 앱, 매장 전화 등 실제 운영 정보를 확인해야 합니다. 특히 단체 식사나 예약이 필요한 경우에는 무작위 결과보다 좌석 가능 여부가 우선입니다.",
    "이 페이지의 목적은 점심 결정을 대신하는 것이 아니라 선택 과정을 짧게 만드는 것입니다. 후보 목록을 공개하고 중복을 제거한 뒤 한 번의 룰렛 결과를 수용하는 방식은 직장, 학교, 가족 모임에서 결정 피로를 줄이는 데 도움이 됩니다.",
    "광고가 표시되더라도 룰렛 후보, 결과, 저장 기록에는 영향을 주지 않습니다. 중요한 행사는 결과 화면을 캡처하거나 참가자와 함께 확인해 투명성을 남기는 것이 좋습니다.",
    "후보를 입력할 때는 음식 이름만 적기보다 실제로 선택할 수 있는 단위로 정리하는 편이 좋습니다. 예를 들어 같은 식당의 여러 메뉴를 모두 넣으면 특정 식당이 과하게 선택될 수 있으므로 식당 단위와 메뉴 단위를 섞지 않는 것이 이해하기 쉽습니다.",
    "인원이 많은 점심이라면 먼저 참석자에게 먹을 수 없는 음식과 피하고 싶은 조건을 확인하세요. 룰렛은 입력된 후보를 기계적으로 선택할 뿐 알레르기, 종교적 식단, 건강 상태, 예산을 자동으로 판단하지 않으므로 최종 확인은 식사 모임이 맡아야 합니다.",
    "결과를 한 번에 확정하기 어렵다면 재추첨 규칙을 미리 정할 수 있습니다. 예를 들어 참석자 전원이 먹을 수 없는 결과만 다시 돌리고, 단순히 마음에 들지 않는다는 이유로 반복하지 않으면 룰렛을 사용하는 기준이 더 투명해집니다.",
    "점심 시간에는 이동과 대기 시간이 실제 만족도를 좌우합니다. 결과가 나온 뒤 매장 영업 여부, 휴무일, 라스트오더, 배달 가능 지역, 예약 필요 여부를 별도로 확인하면 도구의 결과와 현실적인 실행 계획을 자연스럽게 연결할 수 있습니다.",
    "모바일에서 후보를 편집할 때는 한 줄에 하나의 선택지를 입력하고 불필요한 공백이나 동일한 항목을 정리하세요. 목록이 짧을수록 결과를 구성원에게 설명하기 쉽고, 공유 링크를 열었을 때 누구나 같은 후보를 확인할 수 있습니다.",
    "점심 메뉴를 결정하는 과정 자체가 모임의 약속이 될 수도 있습니다. 후보를 함께 정하고 한 번만 실행한 뒤 결과를 받아들이는 방식, 또는 각자 한 후보씩 제안한 다음 추첨하는 방식처럼 팀의 상황에 맞는 규칙을 먼저 합의해 보세요.",
    "이 도구는 음식점 추천 데이터베이스나 예약 서비스가 아닙니다. 특정 식당의 가격, 맛, 위생, 재료, 영업 상태에 관한 판단은 검색 결과와 매장 안내를 기준으로 해야 하며, 룰렛 결과를 업체에 대한 보증으로 해석하면 안 됩니다.",
    "점심 후보가 너무 많다면 카테고리 룰렛으로 범위를 좁힌 뒤 실제 메뉴 룰렛을 한 번 더 사용할 수 있습니다. 반대로 이미 후보가 두 개뿐이면 동전 던지기처럼 더 단순한 도구가 적합할 수 있어 상황에 맞는 도구 선택이 중요합니다.",
    "식사 시간이 짧은 날에는 맛의 선호보다 이동 거리와 주문 대기 시간이 더 중요한 조건이 될 수 있습니다. 후보를 입력할 때 예상 이동 시간이나 포장 가능 여부를 메모해 두고, 결과가 나온 뒤 실제 영업 정보를 확인하세요.",
    "모임 구성원이 각자 다른 메뉴를 먹어야 한다면 식당 후보를 뽑는지 메뉴 후보를 뽑는지 먼저 구분하세요. 한 번에 모든 사람의 식사를 결정하려 하기보다 공통으로 갈 장소를 정한 뒤 개인 메뉴는 현장에서 선택하는 방식이 충돌을 줄일 수 있습니다.",
    "새로운 메뉴를 시도하는 날에는 후보를 익숙한 음식과 새로운 음식으로 나누어 별도 목록으로 만들 수 있습니다. 룰렛은 목록의 항목을 구분하지 않으므로, 모험적인 선택의 범위와 피하고 싶은 선택을 참가자끼리 먼저 정해야 합니다.",
    "식단이나 알레르기 조건은 재미보다 우선합니다. 결과가 나온 뒤 재료와 조리 환경을 확인하고, 섭취 가능 여부가 불확실하면 다른 후보를 선택하세요. 도구는 메뉴 이름만 보고 성분이나 안전성을 판단하지 않습니다.",
    "결정이 끝난 뒤에는 후보와 결과를 계속 바꾸기보다 실제 식사에 집중하세요. 다음 날 같은 고민을 줄이고 싶다면 어떤 조건을 적용했는지, 참석자들이 어떤 결과를 수용했는지만 짧게 메모해 다음 목록을 준비하는 데 활용할 수 있습니다.",
    "점심 외에도 저녁, 간식, 회식 장소, 주말 브런치 후보를 같은 방식으로 정할 수 있습니다. 다만 시간대와 예산이 달라지면 점심용 템플릿을 그대로 쓰기보다 실제 상황에 맞는 후보를 새로 입력해야 합니다.",
    "룰렛을 돌리는 순간보다 후보를 합의하는 과정이 더 중요할 수 있습니다. 누구나 결과를 이해하고 수용할 수 있는 목록인지 확인하고, 참가자가 빠졌거나 조건이 바뀌었다면 결과를 확정하기 전에 목록을 다시 정리하세요.",
    "후보의 표현을 같은 수준으로 맞추면 결과를 비교하기 쉽습니다. 식당 이름과 음식 종류를 한 목록에 섞기보다 먼저 식당을 고른 뒤 메뉴를 정하거나, 메뉴 종류만 모아 한 번에 선택하는 식으로 단계별 목표를 나누세요.",
    "결과가 나온 뒤 참석자가 먹을 수 없는 메뉴라는 사실을 알게 되면 억지로 따르지 말고 안전한 후보를 선택하세요. 재추첨이 필요하다면 그 이유를 모두에게 알리고, 다음 실행에서 적용할 목록과 조건을 다시 확인하는 것이 좋습니다.",
    "점심 모임의 만족도는 음식뿐 아니라 대화 시간과 이동 부담에도 영향을 받습니다. 선택 전에 이동 가능한 거리와 식사 종료 시각을 정하고, 결과가 그 범위를 벗어나면 룰렛보다 현실적인 조건을 우선하세요.",
    "친구나 동료에게 링크를 공유할 때는 후보 목록에 공개하면 안 되는 정보가 들어 있지 않은지 확인하세요. 메뉴와 식당 이름만 공유해도 충분하며, 개인의 건강·식단 사유를 후보 이름에 직접 적을 필요는 없습니다.",
    "이 페이지의 콘텐츠는 메뉴 선택 과정을 돕기 위한 안내입니다. 특정 음식이 건강에 좋다거나 특정 식당을 추천한다는 의학적·상업적 판단을 제공하지 않으므로, 알레르기와 건강 관련 선택은 전문 안내와 실제 성분표를 기준으로 결정하세요.",
  ],
  "/random-number": [
    "랜덤 숫자 뽑기는 번호표, 발표 순서, 간단한 게임, 수업 활동, 이벤트 준비처럼 숫자 하나 또는 여러 개가 필요한 순간에 쓰는 무료 도구입니다. 숫자 범위와 중복 허용 여부를 미리 정하면 결과를 더 쉽게 설명할 수 있습니다.",
    "이 도구는 브라우저의 난수 기능을 활용해 일반적인 무작위 숫자 선택을 돕습니다. 다만 금전이 걸린 추첨, 법적 증빙이 필요한 복권형 이벤트, 보안 토큰 생성, 암호 키 생성처럼 높은 신뢰성이 필요한 용도에는 별도의 공식 절차나 전문 시스템을 사용해야 합니다.",
    "공정하게 사용하려면 참가자 수, 번호 범위, 제외 번호, 재추첨 조건을 먼저 합의하세요. 결과가 나온 뒤 조건을 바꾸면 참가자가 결과를 신뢰하기 어렵습니다. 필요한 경우 결과와 시간을 별도로 기록해 두는 것이 좋습니다.",
    "SpinFlow의 숫자 결과는 사용자의 의사결정을 돕는 참고용입니다. 학교 활동, 소규모 모임, 회의 순서 정하기처럼 저위험 상황에 가장 적합하며, 개인정보나 민감한 식별번호를 입력하지 않는 것이 안전합니다.",
    "관련 도구로는 주사위, 동전 던지기, 랜덤 팀 편성, 룰렛, 로또 번호 생성기가 있습니다. 숫자가 아니라 사람이나 선택지를 고르는 상황이라면 해당 도구를 쓰는 편이 더 명확합니다.",
    "숫자를 뽑기 전에 범위의 시작과 끝을 말로 확인하세요. 1부터 10까지와 0부터 10까지는 가능한 결과의 수가 다르고, 끝값을 포함하는지 여부도 결과 해석에 영향을 주므로 참가자에게 같은 규칙을 보여주는 것이 좋습니다.",
    "중복을 허용하는 추첨과 허용하지 않는 추첨은 서로 다른 문제입니다. 독립적으로 여러 번 실행하면 같은 숫자가 다시 나올 수 있으므로, 비복원 추출이 필요하다면 이미 나온 숫자를 목록에서 제거하거나 전용 목록을 만들어 관리해야 합니다.",
    "발표 순서를 정할 때는 참가자 목록을 먼저 확정하고 번호와 사람의 대응표를 남기세요. 숫자만 기록하면 나중에 누구에게 어떤 순서가 배정되었는지 헷갈릴 수 있으며, 재추첨이 필요한 조건도 실행 전에 정해 두는 것이 좋습니다.",
    "수업이나 소규모 행사의 경우 진행자는 화면을 참가자에게 공유하고 입력 조건을 읽어 주면 됩니다. 결과가 나온 뒤에는 마음에 들지 않는 숫자만 골라 다시 실행하기보다 사전에 정한 재실행 기준을 적용해야 불필요한 오해를 줄일 수 있습니다.",
    "로또 번호를 만들 때는 번호 조합을 재미나 참고용으로만 사용하세요. 과거 당첨 기록이나 특정 숫자 패턴이 미래 당첨을 예측한다는 근거는 이 도구에서 제공하지 않으며, 번호 생성 결과가 당첨 확률이나 당첨을 보장하지도 않습니다.",
    "숫자 생성기는 보안 비밀번호, 인증 코드, 암호 키, 결제 추첨처럼 공격이나 분쟁을 전제로 한 시스템의 대체품이 아닙니다. 그런 목적에는 운영 주체가 검증하고 기록하는 전용 보안·추첨 절차를 사용해야 합니다.",
    "브라우저에서 결과를 확인한 뒤 복사하거나 공유할 때는 입력값과 결과가 함께 노출되지 않는지 확인하세요. 번호 자체는 민감하지 않을 수 있지만 계정 번호, 전화번호, 주민등록번호와 같은 식별정보를 입력해 추첨하는 것은 피해야 합니다.",
    "결과를 반복해서 확인하고 싶다면 실행 시각, 범위, 중복 규칙, 결과를 별도 메모에 남길 수 있습니다. 이 기록은 도구가 공식 감사 로그를 제공한다는 뜻이 아니라, 소규모 활동에서 참여자가 같은 조건을 확인하도록 돕는 사용자 기록입니다.",
    "랜덤 숫자보다 두 선택지 중 하나가 필요하면 동전 던지기가 더 단순합니다. 여러 사람을 균등하게 나누려면 랜덤 팀 편성기가, 여러 후보 중 한 가지를 선택하려면 룰렛이 더 적합하므로 문제의 형태에 맞는 도구를 선택하세요.",
    "범위를 정할 때는 실제 참가자 수와 숫자의 대응 방식을 함께 적으세요. 1번부터 20번까지 발표자를 배정한다면 명단의 순서가 고정되어 있어야 하며, 실행 후 명단을 다시 정렬하면 같은 숫자라도 다른 사람에게 배정될 수 있습니다.",
    "번호를 여러 개 뽑는 활동은 한 번에 몇 개를 뽑을지와 중복 처리 방식을 먼저 정해야 합니다. 같은 번호를 허용하면 독립적인 반복 결과가 되고, 중복을 제외하면 이미 나온 번호를 목록에서 제거하는 별도 절차가 필요합니다.",
    "이벤트 추첨에서 참여자 명단을 사용할 때는 참여 자격과 개인정보 공개 범위를 먼저 확인하세요. 이름 대신 참가 번호나 닉네임을 사용할 수 있고, 당첨자 공개가 필요한 경우에도 운영자가 정한 개인정보 처리 안내를 따라야 합니다.",
    "수업에서 숫자를 선택할 때는 학생의 출석 여부, 발표 가능 여부, 이미 발표한 사람의 제외 여부를 먼저 정리하세요. 랜덤 기능은 입력된 범위를 그대로 처리하므로 교육적 규칙이나 예외를 자동으로 기억하지 않습니다.",
    "숫자 결과가 실제 업무나 행사에서 사용되면 실행 담당자를 정하고 화면을 함께 확인하는 것이 좋습니다. 한 사람이 결과를 말로 전달하는 것보다 조건과 결과를 동시에 보여주면 입력 변경이나 잘못된 전달을 줄일 수 있습니다.",
    "결과를 다시 뽑는 것이 필요한 경우에도 사유를 남기세요. 입력 누락, 네트워크 오류, 참가자 추가처럼 객관적인 이유와 단순한 선호를 구분하면 소규모 추첨이라도 참여자가 과정을 신뢰하기 쉽습니다.",
    "랜덤 숫자는 일정한 규칙을 대신해 주는 기능이 아니라 규칙 안에서 한 가지 결과를 선택하는 기능입니다. 결과에 따라 보상이나 불이익이 발생한다면 접근성, 이의 제기, 재검토 방법까지 포함한 운영 규칙을 별도로 마련하세요.",
    "범위와 명단의 대응표를 저장할 때는 숫자와 사람의 관계가 바뀌지 않도록 버전을 구분하세요. 참석자가 추가되거나 빠진 뒤 같은 숫자 결과를 사용하면 배정 대상이 달라지므로, 조건이 바뀐 경우 새 실행으로 처리하는 것이 안전합니다.",
    "중복 없는 번호가 필요한 경우에는 가능한 숫자 목록을 직접 확인하고 이미 뽑힌 값을 제외하는 절차를 기록하세요. 화면에 여러 숫자가 표시된다는 사실만으로 항상 비복원 추출이 되는 것은 아니며, 도구의 해당 옵션과 실제 동작을 확인해야 합니다.",
    "행사 진행자는 실행 전에 테스트 결과를 본 실행 결과와 섞지 않도록 주의하세요. 준비 화면에서 눌러 본 값은 참가자에게 적용할 결과가 아니므로, 공식 실행 시각과 화면을 구분해 기록하면 혼동을 줄일 수 있습니다.",
    "결과를 참가자에게 전달할 때는 숫자만 말하지 말고 범위, 중복 규칙, 실행 순서를 함께 알려 주세요. 같은 숫자라도 어떤 조건에서 생성되었는지에 따라 의미가 달라질 수 있어 간단한 설명이 신뢰를 높입니다.",
    "확률이라는 표현을 사용할 때는 장기적인 수학적 모델과 한 번의 결과를 구분하세요. 특정 숫자가 자주 나왔거나 오랫동안 나오지 않았다는 이유로 다음 결과를 예측할 수 없으며, 번호 선택 결과를 투자 판단으로 확대하지 않아야 합니다.",
  ],
  "/tools": [
    "무료 웹 유틸리티 모음은 SpinFlow의 전체 도구를 한 곳에서 찾기 위한 허브입니다. 랜덤 추첨, 텍스트 처리, 개발자 도구, 날짜·시간 계산, 생활 금융 계산, 건강 관련 계산처럼 서로 다른 작업을 분류해 사용자가 필요한 도구로 바로 이동할 수 있게 합니다.",
    "도구 허브는 검색용 목록만 늘리는 페이지가 아니라 실제 작업 경로를 연결하는 안내 페이지입니다. 사용자는 글자수 세기에서 문서 길이를 확인하고, JSON 포맷터에서 API 응답을 정리하고, 더치페이 계산기에서 모임 비용을 나누고, D-Day 카운터에서 일정까지 남은 시간을 확인할 수 있습니다.",
    "각 계산기는 입력값을 바탕으로 브라우저에서 결과를 보여주는 참고용 도구입니다. 세금, 급여, 대출, 건강, 투자처럼 현실의 조건이 복잡한 분야에서는 최종 결정 전에 공식 기관, 계약서, 전문가 안내를 함께 확인해야 합니다.",
    "개인정보가 필요한 작업은 최소한의 값만 입력하는 것이 좋습니다. 비밀번호 생성기, UUID 생성기, 인코더, QR 코드 도구처럼 복사와 공유가 쉬운 기능은 결과를 어디에 붙여 넣는지 사용자가 직접 관리해야 합니다.",
    "이 허브는 내부 링크 품질을 높이기 위해 각 도구의 목적을 구분하고, 관련 블로그와 정책 페이지로 이어지는 경로를 유지합니다. AdSense 검토자는 이 페이지에서 사이트가 단일 위젯이 아니라 여러 실용 도구를 제공하는 서비스임을 확인할 수 있습니다.",
    "랜덤 카테고리는 선택이나 순서를 정하는 작업에 적합합니다. 로또 번호 생성기는 1부터 45까지의 번호 조합, 주사위는 6면 결과, 동전은 앞면과 뒷면, Yes or No는 가벼운 질문의 선택, 랜덤 팀은 이름 목록의 분배처럼 서로 다른 입력 형식을 사용합니다.",
    "텍스트·개발 카테고리는 붙여 넣은 값의 형식과 길이를 점검하는 데 유용합니다. 글자 수를 확인한 뒤 제출 규칙을 비교하고, JSON을 정리한 뒤 실제 API 형식을 검증하며, 인코더 결과를 복사하기 전에 원문과 대상 서비스의 요구 형식을 함께 확인하세요.",
    "계산기 카테고리는 숫자를 빠르게 비교하는 출발점으로 사용할 수 있습니다. 같은 계산이라도 단위, 반올림, 세금 포함 여부, 기간, 적용 법령에 따라 결과가 달라질 수 있으므로 화면의 숫자를 공식 결정으로 받아들이지 말고 입력 조건을 기록해 두는 것이 좋습니다.",
    "건강·피트니스 도구는 신체 정보와 생활 습관을 단순한 공식에 넣어 참고값을 보여줍니다. 진단, 처방, 운동 제한, 섭식 계획을 결정하는 기능이 아니므로 몸 상태에 관한 걱정이 있으면 의료 전문가와 상담하고 계산 결과는 대화의 참고 자료로만 사용하세요.",
    "날짜·시간 도구는 일정, 기간, 타이머, D-Day처럼 기준 시점이 분명한 작업을 돕습니다. 시간대와 서머타임, 자정 경계, 포함일 계산 여부가 결과에 영향을 줄 수 있으므로 실제 예약이나 계약에서 사용할 날짜는 원본 일정과 한 번 더 비교해야 합니다.",
    "생활 금융 도구는 급여, 대출, 전월세, 복리, 부가세, 더치페이처럼 입력값을 정리하는 데 초점을 둡니다. 금리와 법정 기준은 바뀔 수 있고 개인별 조건도 다르므로 금융기관 안내, 계약서, 최신 공식 자료를 최종 기준으로 삼으세요.",
    "도구를 찾을 때는 결과의 이름보다 작업의 목적을 먼저 생각하면 선택이 쉬워집니다. 사람을 나누는 일에는 팀 편성, 두 후보 중 하나를 정하는 일에는 동전, 숫자 범위가 필요한 일에는 랜덤 숫자, 후보 목록에서 하나를 고르는 일에는 룰렛이 알맞습니다.",
    "입력 내용은 화면에 붙여 넣기 전에 공개되어도 괜찮은지 확인하세요. 고객 목록, 내부 문서, API 키, 비밀번호, 건강 기록, 결제 정보는 무료 웹 도구에 입력하지 말고 필요한 경우 가상의 샘플 데이터로 먼저 테스트하세요.",
    "결과를 복사하는 기능은 편리하지만 복사한 값이 클립보드와 메신저, 문서, 로그에 남을 수 있습니다. 특히 비밀번호나 토큰을 생성하는 경우에는 안전한 비밀번호 관리 도구와 보관 절차를 사용하고, 사용 후 공유 기록을 정리하세요.",
    "모바일에서는 화면 폭과 키보드 때문에 긴 입력을 확인하기 어려울 수 있습니다. 실행 전 범위와 단위를 다시 읽고, 결과가 잘리지 않았는지 확인한 뒤 필요한 값만 복사하면 작은 화면에서도 실수를 줄일 수 있습니다.",
    "각 도구 페이지에는 사용 순서와 관련 도구 링크가 함께 제공됩니다. 처음 방문한 기능이 문제에 맞지 않으면 뒤로 돌아가 검색어를 바꾸기보다 관련 링크를 따라 더 적합한 도구로 이동하는 것이 빠릅니다.",
    "SpinFlow의 도구는 회원가입이나 설치 없이 브라우저에서 시작할 수 있는 작은 작업을 대상으로 합니다. 따라서 서비스가 해결할 수 있는 범위를 명확히 알고, 공식 제출·결제·법률·의료·보안 시스템을 대신하지 않는다는 원칙을 지키는 것이 중요합니다.",
    "허브의 검색창은 도구 이름과 짧은 설명을 기준으로 목록을 좁히는 용도입니다. 원하는 결과가 보이지 않으면 같은 작업을 다른 표현으로 검색하거나 카테고리 탭을 바꾸고, 도구 페이지에서 제공 범위와 입력 형식을 확인하세요.",
    "랜덤 도구는 결과를 빠르게 만들지만 공정성은 입력 목록과 사전 합의에 달려 있습니다. 계산 도구는 결과를 빠르게 보여주지만 공식을 적용할 값과 기준일이 정확해야 하므로, 어떤 카테고리든 실행 전 조건을 읽는 습관이 필요합니다.",
    "개발자 도구의 결과는 복사하기 편한 형태로 제공되더라도 악성 코드나 비밀값을 자동으로 검증하지 않습니다. 외부에서 받은 문자열을 포맷하거나 변환할 때는 내용을 먼저 확인하고, 실행 가능한 코드나 링크를 바로 운영 환경에 붙여 넣지 마세요.",
    "브라우저에서만 처리되는 기능이라도 화면 캡처, 클립보드, 방문 기록, 분석 도구를 통해 결과가 사용자 기기에 남을 수 있습니다. 입력값과 출력값을 저장하거나 공유할 때는 정보의 민감도와 보관 기간을 직접 판단해야 합니다.",
    "도구 페이지의 설명과 실제 화면이 다르면 페이지 주소와 실행 조건을 기록해 문의하세요. 기능 이름, 입력 범위, 결과 형식이 바뀐 경우에는 관련 안내와 내부 링크를 함께 정리해야 방문자가 오래된 정보를 따라 하지 않게 됩니다.",
    "한 번에 하나의 목적을 해결하는 것이 좋습니다. 여러 계산을 섞어 결과를 추정하거나 서로 다른 도구의 기본값을 비교할 때는 입력 단위와 반올림 조건을 메모하고, 최종 값은 원자료 또는 공식 문서와 대조하세요.",
    "도구 목록의 숫자는 현재 제공되는 기능을 찾기 위한 안내이며, 모든 기능이 같은 계산 공식이나 저장 방식을 사용한다는 뜻은 아닙니다. 페이지를 열었을 때 제목과 입력 항목을 확인하고 필요한 옵션이 실제로 있는지 먼저 살펴보세요.",
    "랜덤·텍스트·계산·건강 카테고리를 한 페이지에서 연결하는 이유는 방문자가 문제에 맞는 작은 기능을 찾도록 돕기 위해서입니다. 검색 결과만 보고 가장 비슷한 이름의 도구를 고르기보다 입력값과 출력값을 비교해 선택하세요.",
    "계산 결과를 문서나 메시지에 붙여 넣을 때는 단위와 소수점 표시를 함께 복사하는 것이 좋습니다. 숫자만 옮기면 원래의 기준이 사라져 다른 사람이 결과를 잘못 해석할 수 있으므로 결과 설명을 짧게 남겨 주세요.",
    "도구 허브에서 제공하는 기능은 무료로 시작할 수 있지만, 외부 서비스의 유료 기능이나 공식 제출을 대신하지 않습니다. QR과 인코딩 결과를 실제 시스템에 사용하기 전에는 대상 서비스에서 다시 열어 보고, 금융·건강 값은 최신 기준과 비교하세요.",
  ],
  "/faq": [
    "자주 묻는 질문 페이지는 룰렛, 랜덤 추첨, 계산기, 개인정보, 광고, 오류 제보에 대한 기본 답변을 정리합니다. 새 방문자가 도구를 쓰기 전에 서비스 범위와 한계를 빠르게 확인할 수 있게 하는 신뢰 페이지입니다.",
    "SpinFlow의 핵심 원칙은 회원가입 없이 바로 쓰는 것입니다. 사용자가 입력한 룰렛 항목이나 계산값은 주로 브라우저에서 처리되며, 서비스 개선을 위한 익명 분석과 광고 관련 쿠키는 개인정보처리방침에서 확인할 수 있습니다.",
    "FAQ 답변은 도구 결과가 전문 판단을 대체하지 않는다는 점을 반복해 안내합니다. 급여, 대출, 건강, 투자, 법적 절차에 가까운 계산은 편의를 위한 예비 계산이며 최종 판단에는 공식 자료나 전문가 확인이 필요합니다.",
    "오류 제보는 서비스 품질을 높이는 중요한 경로입니다. 사용자는 문제가 생긴 URL, 입력값, 브라우저, 재현 순서를 함께 보내면 운영자가 더 빠르게 확인할 수 있습니다. 새 도구 제안도 같은 문의 경로로 받을 수 있습니다.",
    "광고는 도구 결과를 바꾸지 않습니다. Google AdSense 자동 광고가 표시될 수 있지만 룰렛 결과, 계산 결과, 저장된 항목, 공유 URL에 영향을 주지 않는다는 점을 명확히 안내합니다.",
    "룰렛과 랜덤 도구는 입력 목록과 실행 시점의 규칙에 따라 결과를 선택합니다. 참가자와 함께 사용할 때는 후보 목록, 중복 처리, 재실행 기준을 먼저 확인하고, 결과가 마음에 들지 않는다는 이유만으로 조건을 바꾸지 않는 것이 좋습니다.",
    "계산기 결과가 다른 사이트와 다르면 입력 단위와 계산 기준을 먼저 비교하세요. 월 단위와 연 단위, 세전과 세후, 세금 포함과 별도, 반올림 시점이 다르면 같은 숫자를 넣어도 결과가 달라질 수 있습니다.",
    "건강 관련 계산기는 지표를 간단히 확인하는 도구입니다. BMI, 칼로리, 체지방, 수분, 수면 관련 결과는 개인의 질환이나 약물, 운동 능력, 생활 환경을 모두 반영하지 않으므로 진단이나 치료 계획으로 사용하면 안 됩니다.",
    "금융·노무 계산기는 예산을 가늠하거나 질문을 준비하는 데 도움을 줍니다. 실제 지급액, 대출 승인, 세금 신고, 퇴직금, 전월세 계약은 최신 법령과 계약 조건을 적용해야 하므로 담당 기관이나 전문가의 확인이 필요합니다.",
    "개인정보를 입력해야 하는 것처럼 보이는 작업도 실제 값 대신 예시 값을 사용할 수 있는지 먼저 확인하세요. 서비스에 입력한 내용은 브라우저 기능과 제3자 분석·광고 설정의 영향을 받을 수 있으므로 민감한 정보는 사용하지 않는 편이 안전합니다.",
    "광고가 콘텐츠 위에 겹치거나 버튼을 가리거나 페이지 이동을 방해하면 문의 페이지를 통해 URL과 화면 상황을 알려 주세요. 광고의 위치와 표시 여부는 도구 결과의 조건이 아니며, 운영자가 문제를 확인할 때는 재현 정보가 중요합니다.",
    "모든 페이지가 동일한 입력 형식을 사용하는 것은 아닙니다. 랜덤 도구는 항목과 범위, 텍스트 도구는 원문과 옵션, 계산기는 단위와 기간, 날짜 도구는 기준일과 시간대를 요구하므로 실행 전에 화면의 라벨을 읽어 주세요.",
    "도구가 작동하지 않는다면 새로고침 전에 입력 내용을 안전한 곳에 복사하고, 브라우저 확장 프로그램이나 네트워크 차단 기능이 원인인지 확인할 수 있습니다. 그래도 문제가 반복되면 정확한 URL, 브라우저, 입력 조건, 오류 문구를 문의에 포함해 주세요.",
    "FAQ는 서비스의 전체 사용 설명서를 대신하지 않습니다. 각 도구의 정적 안내와 관련 블로그에는 입력 예시, 결과 해석, 비슷한 도구를 선택하는 기준이 더 자세히 정리되어 있으므로 질문에 해당하는 페이지로 이동해 확인할 수 있습니다.",
    "정책 페이지에서는 개인정보처리방침, 이용약관, 문의 경로를 확인할 수 있습니다. 광고와 분석 기술의 사용, 문의 과정에서 직접 제공하는 정보, 서비스 결과의 책임 범위를 구분해서 읽으면 기능을 더 안전하게 이용할 수 있습니다.",
    "SpinFlow는 결과를 보장하는 추첨 기관이나 전문 자문 서비스가 아닙니다. 법률·의료·금융·보안·공식 이벤트처럼 오류 비용이 큰 상황에서는 해당 분야의 공식 절차와 담당자의 판단을 우선해야 합니다.",
    "회원가입이 없다는 것은 모든 데이터가 영원히 사라진다는 뜻이 아닙니다. 브라우저 저장 기능, 분석·광고 설정, 사용자가 직접 복사한 기록은 별도로 관리될 수 있으므로 개인정보처리방침과 기기 설정을 함께 확인하세요.",
    "랜덤 결과에 이의를 제기할 필요가 있는 행사는 실행 전 규칙과 실행 후 기록을 준비해야 합니다. 어떤 도구를 사용했는지, 참가자 목록은 무엇인지, 언제 실행했는지, 어떤 경우에 재실행하는지를 문서로 남기면 설명이 쉬워집니다.",
    "페이지 제목이나 검색 결과의 짧은 설명만으로 기능의 전체 범위를 판단하지 마세요. 도구 화면의 입력 라벨과 정적 사용 안내, 관련 FAQ를 함께 읽어야 지원하지 않는 옵션을 잘못 기대하는 일을 줄일 수 있습니다.",
    "문의를 보낼 때는 비밀번호, 주민등록번호, 계좌번호, 진료 기록과 같은 민감한 값을 제거하세요. 문제를 재현하는 데 필요한 최소한의 예시값과 오류 상황만 보내도 운영자가 원인을 확인하는 데 충분할 수 있습니다.",
    "업데이트된 기능은 이전에 저장한 URL이나 화면과 다르게 보일 수 있습니다. 공유 링크를 다시 사용할 때는 최신 화면에서 입력과 결과를 확인하고, 중요한 문서나 행사에 붙인 설명은 기능 변경 뒤 한 번 더 검토하세요.",
    "광고와 콘텐츠는 서로 다른 목적을 가집니다. 광고를 클릭해야 계산이나 추첨이 진행되는 구조가 아니며, 광고의 내용이 도구의 추천·결과·정책을 대변하지 않는다는 점을 기억하세요.",
    "결과를 공유하는 기능은 사용자의 편의를 위한 것이며, 공유한 링크가 공식 기록으로 자동 등록되지는 않습니다. 행사나 업무에서 결과를 확정할 때는 담당자가 별도 문서에 조건과 결과를 남겨야 합니다.",
    "도구의 기본값은 모든 사람의 상황에 맞는 정답이 아닙니다. 나이, 기간, 금액, 단위, 팀 수, 범위처럼 화면에 표시된 값을 자신의 상황에 맞게 바꾸고, 변경한 조건을 결과와 함께 기록하세요.",
    "페이지의 정적 안내가 길더라도 실행 버튼을 누르기 전에는 해당 도구의 제한사항을 읽는 것이 좋습니다. 지원하지 않는 면 수, 중복 규칙, 단위, 저장 여부를 잘못 기대하면 결과 자체보다 사용 과정에서 문제가 생길 수 있습니다.",
    "서비스 운영자는 문의와 오류 제보를 통해 설명을 보완합니다. 기능 개선을 요청할 때는 원하는 결과와 현재 화면의 차이를 구체적으로 적고, 재현에 필요하지 않은 개인정보와 비밀값은 보내지 마세요.",
    "정책과 안내가 충돌하는 것처럼 보일 때는 개인정보처리방침과 이용약관을 우선 확인하고, 특정 사례는 문의로 확인하세요. 일반적인 FAQ가 개인 상황의 법적·의료적·금융적 판단을 대신하지 않는다는 점도 함께 기억해야 합니다.",
  ],
  "/blog": [
    "SpinFlow 블로그는 룰렛 활용법, 결정 피로 줄이기, 생산성 습관, 텍스트·개발 도구 사용법, 생활 계산 예시를 설명하는 가이드 모음입니다. 단순히 글 제목을 나열하는 곳이 아니라 도구 사용 맥락을 독자에게 연결하는 허브입니다.",
    "블로그 글은 사용자가 어떤 상황에서 어떤 도구를 선택해야 하는지 설명합니다. 예를 들어 랜덤 팀 편성은 참가자 목록과 재추첨 기준을 먼저 정해야 하고, 글자수 세기는 제출 규칙의 공백 포함 여부를 확인해야 하며, 계산기는 입력 단위와 반올림 기준을 이해해야 합니다.",
    "이 페이지는 최신 글을 카드로 보여주고 개별 글로 이동하는 내부 링크를 제공합니다. 사이트맵, RSS, llms.txt와 함께 작동해 검색 시스템이 새 글과 오래된 글의 관계를 이해하도록 돕습니다.",
    "콘텐츠 품질 기준은 반복 문장보다 실제 사용 상황입니다. 좋은 글은 문제 상황, 입력값, 확인 순서, 주의점, 관련 도구를 구분해야 합니다. 단순 키워드 반복이나 짧은 소개만 있는 글은 확장 대상입니다.",
    "광고가 표시되더라도 블로그의 목적은 도구 사용법과 결정 기준을 설명하는 것입니다. 사용자가 오류나 오래된 설명을 발견하면 문의 페이지로 정정 요청을 보낼 수 있습니다.",
    "도구 사용법을 읽을 때는 먼저 자신의 문제를 한 문장으로 정리해 보세요. 무엇을 선택할지, 어떤 값을 비교할지, 얼마나 남았는지, 어떤 형식으로 바꿀지를 정하면 관련 글과 도구를 찾는 시간이 짧아집니다.",
    "랜덤 선택 글에서는 결과 자체보다 실행 전에 정한 규칙을 중요하게 다룹니다. 후보를 정리하고 중복과 제외 조건을 확인한 뒤 실행하면, 결과가 나온 뒤 참가자에게 과정을 설명하기가 더 쉽습니다.",
    "계산기 글은 숫자를 보여주는 데서 끝나지 않고 어떤 입력이 결과를 바꾸는지 설명하는 것을 목표로 합니다. 단위, 기간, 세율, 반올림, 포함일 여부를 함께 확인하면 계산 결과를 실제 상황에 적용할 때 생기는 실수를 줄일 수 있습니다.",
    "개발자 도구 글은 복사한 결과를 곧바로 운영 환경에 붙여 넣기보다 원문과 대상 시스템의 요구사항을 확인하도록 안내합니다. JSON, Base64, URI, QR, CSS 같은 형식은 같은 문자열이라도 사용 위치에 따라 해석이 달라질 수 있습니다.",
    "생활과 건강 관련 글은 참고 계산의 한계를 함께 설명합니다. 개인별 계약, 최신 제도, 건강 상태를 웹 계산 하나로 확정할 수 없으므로 글에서 제시한 예시는 질문을 준비하거나 범위를 가늠하는 출발점으로 활용해야 합니다.",
    "각 글의 관련 도구 링크는 독자가 다음 행동으로 이동할 수 있게 배치합니다. 설명만 읽고 끝내지 않고 예시 입력을 직접 넣어 보거나, 결과가 필요하지 않은 경우에는 더 간단한 도구로 돌아가는 흐름을 권장합니다.",
    "콘텐츠를 읽다가 실제 화면과 설명이 다르면 문의 페이지를 통해 URL과 차이점을 알려 주세요. 기능이 바뀌거나 브라우저 동작이 달라질 수 있으므로 운영자는 재현 가능한 정보와 최신 화면을 기준으로 내용을 수정합니다.",
    "글을 게시할 때는 해당 주제와 직접 연결되는 도구, 정책, 공식 참고 자료가 있는지 확인합니다. 독자가 추가로 검증할 수 있는 경로를 제공하면 짧은 팁도 실제 작업에 활용하기 쉬운 안내가 됩니다.",
    "블로그의 목적은 키워드만 반복해 방문을 유도하는 것이 아니라, 방문자가 자신의 작업을 끝내도록 돕는 것입니다. 문제를 정의하고, 입력을 준비하고, 결과를 검토하고, 필요한 경우 공식 자료로 확인하는 네 단계를 기본 흐름으로 삼습니다.",
    "새 글과 오래된 글을 함께 읽을 때는 게시일과 현재 화면을 비교하세요. 제도, 가격, 브라우저 지원, 서비스 기능은 바뀔 수 있으므로 시간이 중요한 주제는 글 속 참고 링크와 현재 공식 안내를 함께 확인해야 합니다.",
    "SpinFlow 블로그는 댓글이나 회원 전용 자료를 전제로 하지 않고 공개된 가이드와 도구 링크를 제공합니다. 따라서 민감한 개인 사례는 공개 입력창이나 문의 내용에 그대로 적지 말고, 필요한 경우 세부정보를 가린 예시로 질문하는 것이 안전합니다.",
    "글을 읽은 뒤 바로 도구를 실행할 때는 예시 입력과 자신의 실제 입력을 구분하세요. 예시 숫자, 가상의 이름, 테스트용 문자열을 그대로 복사하면 실제 결과를 잘못 해석할 수 있으므로 실행 전에 입력값을 다시 확인해야 합니다.",
    "결정과 추첨에 관한 글은 누가 결과를 받아들일지까지 고려합니다. 참여자에게 규칙을 알리고 후보 목록을 확정한 뒤 실행하면 단순히 버튼을 누르는 것보다 과정의 신뢰성과 설명 가능성을 높일 수 있습니다.",
    "계산과 변환에 관한 글은 입력값의 출처를 확인하는 습관을 권장합니다. 영수증, 계약서, 공식 표, API 문서에서 값을 가져왔다면 단위와 기준일을 함께 기록하고, 결과를 복사한 뒤 원자료와 비교하세요.",
    "보안과 개인정보를 다루는 글에서는 편리한 브라우저 기능의 한계도 함께 설명합니다. 비밀번호와 토큰은 생성보다 보관이 중요하고, 공개 링크와 클립보드는 사용자가 관리해야 하며, 민감한 값은 테스트 페이지에도 넣지 않는 것이 원칙입니다.",
    "블로그 글에 공식 참고 자료가 연결된 경우에는 링크의 원문과 적용 범위를 확인하세요. 한 기관의 일반 안내가 모든 개인 상황에 적용되는 것은 아니며, 최신 공지나 계약 조건이 더 구체적인 기준이 될 수 있습니다.",
    "사이트의 콘텐츠는 새로운 도구와 질문이 생길 때 보완됩니다. 기존 글의 표현이 기능과 맞지 않거나 설명이 부족하다고 느끼면 문의 경로로 알려 주세요. 수정이 필요한 문장과 실제 화면을 함께 보내면 검토 범위를 좁힐 수 있습니다.",
    "글의 예시를 따라 할 때는 자신의 목적과 다른 단계가 있는지 먼저 확인하세요. 같은 랜덤 도구라도 식사 후보를 고르는 경우와 공식 이벤트를 운영하는 경우의 책임과 기록 방법은 다르므로, 글의 적용 범위를 읽어야 합니다.",
    "문서와 개발 작업에서는 결과를 얻은 뒤 검증하는 단계를 생략하지 않는 것이 중요합니다. 변환 결과를 원문과 비교하고, 계산값을 단위와 공식에 대조하며, 생성된 문자열을 대상 환경에서 테스트하면 복사 오류를 줄일 수 있습니다.",
    "콘텐츠를 읽는 중 페이지가 이동하거나 기능이 바뀌었다면 게시일만으로 최신성을 판단하지 말고 현재 화면을 기준으로 확인하세요. 특히 금융 기준, 건강 정보, 브라우저 지원, 개인정보 정책은 변경 가능성이 높아 공식 안내를 함께 봐야 합니다.",
    "블로그의 관련 링크는 독자에게 다음 확인 경로를 제공하기 위한 것입니다. 글에서 제시한 원칙을 실제 입력에 적용하고 결과를 검토한 뒤, 더 전문적인 판단이 필요한 경우 해당 기관이나 전문가에게 질문할 수 있도록 연결합니다.",
    "좋은 사용 기록은 거창한 감사 보고서가 아니어도 됩니다. 실행 날짜, 입력 조건, 결과, 재실행 여부를 짧게 적어 두면 모임과 업무에서 결과를 다시 확인할 수 있고, 오류가 생겼을 때 문제를 재현하기도 쉽습니다.",
  ],
};

const approvalSectionHeadings = {
  "/lunch-menu": "조건을 먼저 정하면 점심 선택이 쉬워집니다",
  "/random-number": "추첨 전에 범위와 규칙을 합의하세요",
  "/tools": "작업별로 도구를 선택하는 방법",
  "/faq": "사용 전에 알아둘 서비스 기준",
  "/blog": "도구를 실제 상황에 연결하는 가이드",
};

const officialReferenceLinks = [
  ["Google AdSense 정책", "https://support.google.com/adsense/"],
  ["Google Search Central", "https://developers.google.com/search"],
  ["개인정보보호위원회", "https://www.pipc.go.kr/"],
];

const toolGuideDetails = {
  "/tools/lotto-generator": {
    heading: "1~45 번호 조합을 이해하는 방법",
    paragraphs: [
      "로또 번호 생성기는 1부터 45까지의 숫자 중 한 게임마다 6개를 골라 오름차순으로 보여주는 도구입니다. 한 번에 1게임부터 5게임까지 만들 수 있어 여러 조합을 종이에 옮기거나 친구와 비교하기 편합니다.",
      "화면에서 게임 수를 먼저 선택한 다음 번호 생성 버튼을 누르세요. 결과는 게임별로 구분되어 표시되고 전체 복사 기능을 사용하면 줄바꿈이 포함된 목록을 다른 메모나 문서로 옮길 수 있습니다.",
      "한 게임 안에서는 같은 번호가 두 번 나오지 않도록 처리하지만, 서로 다른 게임 사이에는 같은 번호가 포함될 수 있습니다. 여러 게임이 완전히 겹치지 않는다는 뜻은 아니므로 결과를 볼 때 게임 단위와 전체 목록을 구분해야 합니다.",
      "번호 선택에는 브라우저가 제공하는 보안 난수 기능이 사용됩니다. 이는 번호를 사람이 정한 패턴으로 고르는 대신 범위 안에서 값을 선택하는 구현상의 설명이며, 특정 조합이 다른 조합보다 당첨에 유리하다는 의미는 아닙니다.",
      "생성된 번호는 재미와 조합 참고를 위한 결과입니다. 과거 당첨 번호, 생일 숫자, 연속 숫자, 자주 나온 숫자를 분석해 미래 당첨을 예측하거나 당첨을 보장하는 기능은 이 도구에 없습니다.",
      "실제 복권을 구매하거나 이벤트에 사용할 때는 해당 운영 주체의 공식 판매 기간, 참여 방법, 수수료, 당첨 확인, 개인정보 처리 안내를 따르세요. SpinFlow의 화면은 공식 복권 용지나 당첨 증명서가 아닙니다.",
      "여러 사람이 함께 번호를 정한다면 게임 수와 생성 시점을 먼저 공유하고 결과를 한 번에 확인하는 편이 좋습니다. 결과가 마음에 들지 않는다는 이유로 일부 번호만 바꾸면 처음 정한 무작위 규칙과 달라질 수 있습니다.",
      "결과를 기록할 필요가 있다면 생성 날짜와 게임 번호를 함께 메모하세요. 이 기록은 번호 조합을 다시 확인하기 위한 사용자 메모일 뿐이며, 사이트가 구매 내역이나 공식 추첨 기록을 저장한다는 뜻은 아닙니다.",
      "로또 조합이 아니라 참가자 순서나 한정된 범위의 숫자를 뽑으려면 랜덤 숫자 뽑기, 주사위, 룰렛 중 목적에 맞는 도구가 더 적합할 수 있습니다. 문제의 형태를 먼저 정하면 불필요한 재실행을 줄일 수 있습니다.",
      "번호를 복사하거나 공유할 때는 개인 연락처, 계좌번호, 식별번호를 함께 붙여 넣지 않도록 확인하세요. 이 도구에는 번호 생성에 필요한 정보만 사용하고, 민감한 개인 데이터를 입력하지 않는 것이 안전합니다.",
      "번호 조합이 반복해서 달라지는 것은 정상입니다. 난수 결과는 이전 결과를 기억해 당첨 가능성을 조정하지 않으며, 여러 번 생성한다고 해서 특정 번호의 확률이 올라가거나 내려간다고 해석할 수 없습니다.",
      "가장 좋은 사용법은 결과의 한계를 알고 가볍게 참고하는 것입니다. 구매나 금전 지출을 결정할 때는 예산을 먼저 정하고, 생성된 번호를 행운의 근거 또는 투자 조언처럼 받아들이지 마세요.",
      "게임 수를 늘리면 화면에서 비교할 조합은 많아지지만 당첨을 보장하는 전략이 생기는 것은 아닙니다. 예산과 참여 목적을 먼저 정하고, 생성 결과가 소비를 부추기는 방식으로 사용되지 않도록 스스로 한도를 정하세요.",
      "번호를 직접 고른 조합과 생성기로 만든 조합은 이 도구 안에서 우열을 비교할 수 없습니다. 어떤 방식으로 번호를 선택하든 공식 추첨의 결과는 별도로 정해지므로, 생성기의 역할은 조합을 편하게 만드는 데 한정됩니다.",
      "복사한 결과를 종이나 메시지에 옮길 때는 게임별 줄바꿈을 유지하고 숫자가 빠지지 않았는지 확인하세요. 화면에 표시된 순서는 보기 편하도록 정렬된 것이며, 공식 용지에 옮길 때는 해당 기관의 입력 형식을 따라야 합니다.",
      "과거 결과를 이 페이지에 입력해 패턴을 찾는 기능은 제공하지 않습니다. 통계 자료를 참고하더라도 표본과 계산 방법을 확인해야 하며, 과거 빈도가 다음 회차의 특정 번호를 정한다는 뜻으로 해석해서는 안 됩니다.",
      "번호 생성은 브라우저에서 실행되므로 사용자는 자신의 화면에서 결과를 확인할 수 있습니다. 그러나 이 특성만으로 공인된 추첨 절차나 서버 감사 기록이 생기는 것은 아니므로, 공식 이벤트는 참가자에게 별도의 운영 기준을 공개하세요.",
      "생성된 조합을 친구와 공유할 때는 번호를 선택한 사람, 공유한 날짜, 사용 목적을 필요에 따라 함께 적으세요. 조합의 출처를 설명하는 데 도움이 되지만, 그 기록이 당첨이나 당첨금 지급을 보장하지는 않습니다.",
      "각 게임은 생성 버튼을 누른 시점에 별도로 만들어지는 결과로 보세요. 이전 게임의 번호를 다음 게임의 기준으로 삼거나, 일부 숫자만 골라 다시 조합하면 처음 합의한 규칙과 다른 결과가 되므로 변경한 내용을 함께 기록하는 편이 안전합니다.",
      "당첨 여부를 확인할 때는 반드시 해당 복권 운영 주체의 공식 발표와 공식 판매 기록을 기준으로 삼으세요. 생성 결과를 보여 주는 화면이나 공유 링크를 당첨 확인 페이지로 오해하지 말고, 출처가 불분명한 결제·개인정보 입력 링크도 열지 않는 것이 좋습니다.",
      "페이지에 표시되는 광고나 관련 도구 링크는 번호 선택 과정에 참여하지 않습니다. 번호를 생성하는 규칙과 광고 표시를 분리해 이해하고, 결과를 확인할 때는 화면의 숫자와 자신이 정한 게임 규칙만 다시 살펴보세요.",
    ],
  },
  "/tools/dice-roller": {
    heading: "현재 도구가 제공하는 6면 주사위 규칙",
    paragraphs: [
      "온라인 주사위 던지기는 1부터 6까지의 숫자가 있는 6면 주사위를 1개에서 5개까지 동시에 굴리는 도구입니다. 각 주사위 결과와 여러 주사위의 합계를 한 화면에서 확인할 수 있습니다.",
      "사용할 주사위 개수를 먼저 선택하고 굴리기 버튼을 누르세요. 애니메이션이 끝난 뒤 각 주사위의 면과 합계를 확인하면 보드게임 순서, 수업 활동, 간단한 팀 결정에 바로 활용할 수 있습니다.",
      "이 페이지는 D6 주사위만 지원합니다. D4, D8, D10, D12, D20처럼 다른 면 수가 필요한 RPG나 보드게임을 대신하지 않으므로 게임 규칙에 맞는 실제 주사위나 별도 도구를 사용해야 합니다.",
      "각 면은 브라우저의 보안 난수 기능을 이용해 1부터 6 사이에서 선택됩니다. 구현이 공정한 결과를 보장하는 공식 추첨 시스템이라는 뜻은 아니며, 금전이나 법적 권리가 걸린 결과에는 운영 주체의 검증 절차가 필요합니다.",
      "주사위가 여러 개일 때 합계는 각 결과를 더한 값입니다. 같은 합계라도 구성하는 면의 조합은 여러 가지일 수 있으므로 합계만 기록할지 각각의 주사위 값을 기록할지 게임 시작 전에 합의하는 것이 좋습니다.",
      "실제 게임에서 사용할 때는 주사위 개수, 재굴림 조건, 특수 규칙, 결과를 적용하는 순서를 먼저 정하세요. 도구는 화면에 적힌 숫자를 보여주지만 어떤 게임 규칙을 적용할지는 참가자와 진행자가 결정해야 합니다.",
      "연속으로 같은 결과가 나오거나 예상보다 높은 합계가 나오는 것은 가능한 결과입니다. 이전 실행이 다음 실행을 바꾸지는 않으므로 결과가 이상해 보인다는 이유만으로 특정 실행만 골라 기록하지 않도록 주의하세요.",
      "교실이나 모임에서는 화면을 함께 보고 굴리기 전 주사위 개수와 적용 규칙을 읽어 주면 분쟁을 줄일 수 있습니다. 결과를 공유해야 한다면 실행 뒤 화면을 캡처하고 날짜와 활동명을 별도 메모에 남길 수 있습니다.",
      "주사위 도구에는 참가자 이름이나 연락처를 입력할 필요가 없습니다. 게임명이나 팀명처럼 공개되어도 괜찮은 짧은 메모만 사용하고, 민감한 정보는 입력창과 공유 화면에 넣지 마세요.",
      "두 후보 중 하나만 선택하면 동전 던지기가 더 간단하고, 여러 선택지 중 하나를 고르면 룰렛이 더 자연스럽습니다. 숫자 범위를 직접 정해야 한다면 랜덤 숫자 뽑기를 선택하는 편이 결과를 설명하기 쉽습니다.",
      "이 페이지의 주사위 결과는 편의와 놀이를 위한 참고 결과입니다. 추첨 증빙, 경기 판정, 금전 분배, 법적 분쟁의 단독 증거로 사용하지 말고 필요한 경우 공인된 절차와 기록 방식을 사용하세요.",
      "브라우저에서 계산되는 결과는 네트워크 상태와 관계없이 화면에 표시되지만, 새로고침 뒤 같은 결과가 복원된다는 보장은 없습니다. 결과를 보존해야 한다면 실행 직후 필요한 값만 별도로 기록하세요.",
      "한 개의 주사위와 여러 개의 주사위는 가능한 합계와 분포가 다릅니다. 게임에서 합계를 사용하는지 특정 주사위 면을 사용하는지 먼저 정하고, 도구가 보여주는 개별 값과 합계를 혼동하지 않도록 하세요.",
      "주사위 개수를 바꾸면 이전 결과와 새 결과를 같은 라운드로 비교하기 어렵습니다. 실행 전에 사용할 개수를 확정하고, 다시 굴리는 경우에도 왜 다시 실행했는지 참여자에게 알려 주는 것이 좋습니다.",
      "주사위 애니메이션은 결과를 보여주기 전의 시각적 과정입니다. 애니메이션 속도나 화면 효과가 실제 확률을 조정하는 기능은 아니며, 결과를 바꾸기 위해 버튼을 여러 번 누르는 것은 별도의 실행으로 봐야 합니다.",
      "온라인 결과를 실제 보드게임에 적용할 때는 게임판이나 진행자의 규칙이 우선입니다. 특정 면이 특별한 효과를 가지거나 실패 시 재굴림하는 규칙은 게임 설명서에 따라 처리하고, 도구의 기본 합계만으로 규칙을 추정하지 마세요.",
      "어린이 수업이나 가족 활동에서는 숫자의 의미와 재실행 조건을 쉬운 말로 설명하세요. 결과에 따라 불이익을 주는 활동이라면 참가자의 동의와 안전을 먼저 확인하고, 무작위 결과를 벌이나 평가의 유일한 근거로 사용하지 않는 것이 좋습니다.",
      "주사위 결과를 문서로 옮길 때는 주사위 수, 각 면, 합계, 실행 시각을 구분해 적으면 나중에 다시 확인하기 쉽습니다. 단순한 놀이에서는 합계만으로 충분하지만, 기록이 필요한 경우 원래 화면과 기록을 비교하세요.",
      "주사위의 개별 결과를 팀이나 순서에 연결할 때는 참가자 목록의 범위가 주사위 결과와 맞는지 확인하세요. 여섯 명이 아닌데 1부터 6까지를 쓰면 일부 숫자의 의미가 달라질 수 있으므로 대응 규칙을 먼저 정해야 합니다.",
      "같은 화면을 여러 명이 보는 상황에서는 한 사람만 버튼을 누르고 결과를 읽어 주는 방식이 좋습니다. 여러 기기에서 동시에 실행하면 서로 다른 결과가 생길 수 있으므로, 실행 주체와 확정 결과를 미리 정하세요.",
      "이 페이지의 결과는 화면에서 빠르게 확인하는 용도입니다. 장시간 보관해야 하는 게임 기록이나 공식 경기 결과는 게임의 기록지, 주최자의 기록 시스템, 참가자 확인 절차를 함께 사용하세요.",
    ],
  },
  "/tools/coin-flip": {
    heading: "두 선택지를 동전 던지기로 정하는 방법",
    paragraphs: [
      "동전 던지기는 앞면과 뒷면 중 하나를 선택해 두 후보의 결정을 빠르게 끝내는 도구입니다. 메뉴 두 가지, 진행 순서 두 가지, 게임의 선공처럼 선택지가 정확히 둘일 때 가장 이해하기 쉽습니다.",
      "동전 던지기 버튼을 누르면 화면에 앞면 또는 뒷면 결과가 표시됩니다. 사용 전에 앞면이 어떤 선택을 뜻하고 뒷면이 어떤 선택을 뜻하는지 참가자 모두가 알고 있어야 결과를 바로 적용할 수 있습니다.",
      "각 실행은 두 결과 중 하나를 같은 선택 공간에서 고르는 방식입니다. 실제 동전의 무게나 바람을 측정하는 시뮬레이션이 아니라 브라우저 난수에 기반한 디지털 선택이므로, 도구의 성격을 알고 사용하는 것이 좋습니다.",
      "앞면이 여러 번 연속으로 나와도 다음 실행에서 뒷면이 나올 차례가 자동으로 생기지는 않습니다. 이전 결과를 보정하기 위해 다시 돌리기보다, 재실행 조건을 미리 정하고 그 조건을 지키는 편이 투명합니다.",
      "동전을 사용하기 전에 후보 이름을 짧고 분명하게 정하세요. 예를 들어 앞면은 A 식당, 뒷면은 B 식당처럼 대응표를 먼저 보여주면 결과를 확인한 뒤 선택을 바꾸었다는 오해를 줄일 수 있습니다.",
      "단체로 결정할 때는 참가자들이 두 후보에 동의했는지 확인하세요. 알레르기, 예산, 일정, 안전 문제처럼 반드시 고려해야 하는 조건이 있는 경우에는 동전 결과보다 그 조건을 먼저 적용해야 합니다.",
      "결과가 중요한 경기나 행사의 공식 선공 결정이라면 주최자가 인정하는 방식과 기록을 따르세요. 이 페이지는 온라인 편의를 위한 도구이며, 공식 심판 기록이나 금전 분쟁을 위한 감사 로그를 제공하지 않습니다.",
      "결과를 공유할 때는 앞면과 뒷면의 의미, 실행 시각, 재실행 여부를 함께 적으면 됩니다. 화면 캡처는 간단한 모임 기록에 도움이 되지만, 화면만으로 결과의 공식성을 보증하는 것은 아닙니다.",
      "동전 던지기에는 이름, 연락처, 계정 정보가 필요하지 않습니다. 후보를 설명하기 위해 개인정보를 입력하지 말고, 필요한 경우 A와 B 또는 메뉴 이름처럼 최소한의 표현만 사용하세요.",
      "세 가지 이상의 후보에서 하나를 선택하려면 룰렛이나 랜덤 숫자 도구가 더 적합합니다. 여러 사람을 팀으로 나눌 때는 랜덤 팀 편성기를 사용하면 동전 결과를 반복해서 적용하는 수고를 줄일 수 있습니다.",
      "같은 선택을 여러 번 실행해 통계를 만들더라도 짧은 실행 결과만으로 실제 동전의 장기 확률이나 미래 결과를 예측할 수는 없습니다. 통계가 필요한 경우 실행 횟수와 조건을 함께 기록하고 결과를 과장하지 마세요.",
      "이 도구는 일상적인 양자택일과 가벼운 놀이에 적합합니다. 의료, 법률, 금융, 안전, 고용처럼 선택의 책임이 큰 상황에서는 동전 결과를 판단 근거로 사용하지 말고 해당 분야의 정보와 담당자 판단을 우선하세요.",
      "앞면과 뒷면의 이름은 결과가 나온 뒤 바꾸지 말고 실행 전에 정하세요. 후보의 의미를 바꾸면 같은 결과도 다른 선택이 되므로, 간단한 대응표를 화면이나 메모에 남기는 것이 좋습니다.",
      "두 후보의 조건이 완전히 같지 않다면 동전 결과만으로 공정하다고 말하기 어렵습니다. 한 후보가 예산, 거리, 건강, 안전 조건을 충족하지 못하면 먼저 그 후보를 제외하고 실제로 선택 가능한 후보만 비교해야 합니다.",
      "재실행을 허용할 때는 횟수와 이유를 정하세요. 연결 오류나 참가자 확인 누락처럼 절차상 문제가 있는 경우와 단순한 결과 불만을 구분하면, 동전 던지기가 선택을 미루는 수단으로 변하는 일을 막을 수 있습니다.",
      "한 번의 동전 결과가 장기적인 우열이나 실제 확률을 증명하지는 않습니다. 여러 번 실행한 기록을 볼 때도 표본 수, 실행 조건, 중단 기준을 함께 기록하고 우연한 연속 결과를 규칙으로 해석하지 마세요.",
      "결과를 메신저로 보낼 때는 앞면 또는 뒷면만 보내기보다 그 의미와 실행 조건을 함께 적으세요. 선택의 상대방이 같은 규칙을 알고 있어야 결과를 오해하지 않고, 필요하면 실행 화면을 함께 확인할 수 있습니다.",
      "동전 도구는 결정을 편하게 하지만 책임을 이전하지 않습니다. 결과에 따라 계약을 체결하거나 건강·재정 결정을 내리는 상황에서는 관련 정보를 검토하고, 동전은 긴장을 풀기 위한 보조 수단으로만 사용하세요.",
      "앞면과 뒷면에 연결할 후보는 실행 버튼을 누르기 전에 화면이나 메모에 적어 두세요. 결과가 나온 뒤 의미를 정하면 선택자에게 유리한 방식으로 규칙을 바꾼 것처럼 보일 수 있습니다.",
      "동전 결과의 통계를 화면에서 보더라도 기록은 현재 브라우저 화면의 실행 횟수에 한정됩니다. 다른 기기나 새로고침 뒤의 결과가 자동으로 합쳐지지 않을 수 있으므로 장기 통계처럼 사용하지 마세요.",
      "공식 행사의 선공을 정하는 경우에는 행사 규정과 참가자 합의를 우선하세요. 이 도구를 사용했다는 사실보다 실행 전 공개한 규칙, 결과 확인, 이의 제기 방법이 더 중요할 수 있습니다.",
    ],
  },
  "/tools/yes-no-oracle": {
    heading: "Yes, No, Maybe 결과를 가볍게 활용하는 방법",
    paragraphs: [
      "Yes or No 결정 도구는 질문을 입력하면 YES, NO, MAYBE, TRY AGAIN 중 하나를 보여주는 가벼운 결정 보조 기능입니다. 답을 알고 싶은 사실을 판정하는 서비스가 아니라, 결정을 미루는 순간 생각을 정리하는 계기를 제공하는 도구입니다.",
      "질문은 짧고 구체적으로 입력하세요. 오늘 어떤 메뉴를 고를지, 지금 산책을 할지처럼 선택 범위가 분명한 질문은 결과를 행동으로 옮기기 쉽지만, 여러 조건이 섞인 질문은 먼저 작은 질문으로 나누는 것이 좋습니다.",
      "결과는 브라우저의 보안 난수 기능으로 네 가지 답변 중 하나를 선택합니다. 질문의 내용, 사용자의 성격, 과거 결과, 미래 사건을 분석하는 인공지능이나 점술 시스템이 아니므로 답변에 특별한 예측 능력이 있다고 해석하면 안 됩니다.",
      "MAYBE와 TRY AGAIN은 즉시 결론을 내리기 전에 조건을 더 확인하라는 신호로 활용할 수 있습니다. 다시 버튼을 눌러 원하는 답이 나올 때까지 반복하기보다, 질문을 다시 쓰거나 필요한 정보를 확인하는 편이 더 유용합니다.",
      "사소한 선택에서 결정 피로를 줄이는 용도로 사용하세요. 간식, 영화, 산책, 작업 순서처럼 결과를 바꿔도 큰 문제가 없는 상황에 적합하며, 결과를 가볍게 받아들이고 마음에 들지 않으면 왜 그런지 스스로 점검할 수 있습니다.",
      "의료 증상, 법률 대응, 투자·대출, 채용, 계약, 안전과 관련된 질문에는 사용하지 마세요. 이런 결정은 무작위 답변이 아니라 사실관계, 최신 규정, 위험도, 전문가 의견을 바탕으로 판단해야 합니다.",
      "결과를 친구나 팀과 공유할 때는 도구가 결정 책임을 대신하지 않는다는 점을 먼저 설명하세요. 질문에 포함된 개인 사정과 민감한 정보가 URL이나 화면에 남지 않는지 확인하고, 공개가 필요한 경우 중립적인 표현을 사용하세요.",
      "Yes or No 도구에서 네 결과가 나오는 것은 정상입니다. 화면 설명이나 관련 도구의 링크가 YES와 NO만 설명하더라도 실제 인터페이스에는 MAYBE와 TRY AGAIN이 포함되므로 결과를 모두 선택지로 인정해야 합니다.",
      "한 번의 답변으로 결정을 끝내기 어렵다면 선택 기준을 적어 보세요. 비용, 시간, 안전, 다른 사람에게 미치는 영향처럼 직접 확인할 수 있는 기준을 정리하면 랜덤 답변은 판단을 대신하는 것이 아니라 생각을 시작하는 장치가 됩니다.",
      "두 후보 중 하나만 고르면 동전 던지기가, 여러 후보를 비교하면 룰렛이, 숫자 범위가 필요하면 랜덤 숫자 도구가 더 적합합니다. 도구를 문제에 맞게 선택하면 결과의 의미를 설명하기도 쉬워집니다.",
      "이 페이지는 질문을 서버에서 분석하거나 정답 데이터베이스와 대조해 답하는 기능을 제공하지 않습니다. 입력창에 비밀번호, 연락처, 건강 기록, 계정 정보, 업무 비밀을 넣지 말고 공개되어도 괜찮은 짧은 질문만 사용하세요.",
      "가벼운 재미를 위한 결과라도 다른 사람에게 행동을 강요하는 근거로 사용하면 안 됩니다. 함께 결정하는 상황에서는 참가자의 동의와 현실적인 조건을 확인하고, 결과를 받아들일지 여부를 당사자들이 선택해야 합니다.",
      "질문을 한 번에 너무 넓게 만들면 결과를 받아들일 기준이 없어집니다. 해야 할 일, 시점, 선택지, 확인할 조건을 나누어 한 가지 질문으로 만들면 MAYBE나 TRY AGAIN이 나왔을 때 다음 행동을 정하기도 쉽습니다.",
      "YES나 NO가 나와도 현실의 조건을 다시 확인하세요. 도구는 입력한 문장의 사실 여부를 읽지 않으며, 질문에 포함되지 않은 비용, 일정, 위험, 다른 사람의 의사를 자동으로 고려하지 않습니다.",
      "결과를 기록할 때는 질문과 답변을 함께 적되 개인의 민감한 사정은 가리세요. 질문 문장이 그대로 공유되면 관계, 건강, 업무 정보가 노출될 수 있으므로 다른 사람에게 보여 줄 필요가 있는 수준으로만 요약하는 것이 안전합니다.",
      "반복 실행은 판단을 강화하는 절차가 아닙니다. 원하는 답을 얻을 때까지 버튼을 누르면 무작위 선택의 의미가 약해지므로, 실행 횟수나 질문을 다시 검토하는 조건을 미리 정하고 그 범위 안에서 사용하세요.",
      "친구와 함께 사용할 때는 결과가 재미있는 의견 제안인지, 실제 결정 규칙인지 구분하세요. 누군가 결과를 원하지 않거나 선택에 영향을 받는다면 결과를 강요하지 말고 대화를 통해 대안을 정하는 것이 바람직합니다.",
      "결정이 중요할수록 체크리스트와 상담이 더 적합합니다. 계약, 돈, 건강, 안전과 관련된 질문은 필요한 자료와 위험을 적고 담당자에게 확인한 뒤, Yes or No 도구는 긴장을 풀거나 사소한 선택을 정하는 용도로 제한하세요.",
      "답변의 색상과 애니메이션은 사용 경험을 위한 화면 요소입니다. 색이나 표시 순서가 질문의 중요도, 답변의 확률, 의미의 강도를 평가하는 기능은 아니므로 화면 효과를 근거로 결과를 과장하지 마세요.",
      "질문을 입력할 때 다른 사람의 이름이나 비공개 사정을 포함하지 않아도 됩니다. 오늘 할 일처럼 중립적인 표현으로 바꾸면 결과를 공유할 때 개인정보와 관계 정보가 불필요하게 노출되는 것을 줄일 수 있습니다.",
      "결과가 마음에 들지 않을 때에는 왜 그런 반응이 생겼는지 확인하는 것이 더 유용할 수 있습니다. 실제로 원하는 선택이 있었는지, 추가 정보가 필요한지, 다른 사람의 동의가 필요한지를 적어 보면 도구 밖의 판단 기준이 드러납니다.",
    ],
  },
  "/tools/random-team": {
    heading: "이름 목록을 팀으로 나누기 전에 정할 규칙",
    paragraphs: [
      "랜덤 팀 편성기는 참가자 이름을 한 줄에 하나씩 입력하고 2개부터 10개까지의 팀으로 나누는 도구입니다. 스터디, 수업, 워크숍, 보드게임, 소규모 대회에서 빠르게 그룹을 만들 때 사용할 수 있습니다.",
      "먼저 이름 목록을 확인하고 팀 수를 정하세요. 참가자 수가 팀 수보다 적으면 실행할 수 없으며, 참가자 수가 팀 수로 나누어 떨어지지 않으면 일부 팀에 한 명이 더 배정될 수 있으므로 이 규칙을 시작 전에 알려주는 것이 좋습니다.",
      "이름은 줄바꿈으로 구분하고 불필요한 앞뒤 공백을 정리하세요. 같은 이름을 두 번 입력하면 서로 다른 참가자라고 보고 두 항목으로 처리할 수 있으므로, 동명이인이 있다면 닉네임이나 번호를 붙여 결과를 구분하세요.",
      "팀을 만들 때 목록은 브라우저에서 섞인 뒤 팀 수에 맞춰 순서대로 분배됩니다. 브라우저가 제공하는 보안 난수 기능을 사용하지만, 공식 경기 추첨이나 금전 분쟁을 위한 독립 감사 시스템은 아니므로 중요한 행사는 별도 진행 규칙과 기록을 마련해야 합니다.",
      "팀 인원을 완전히 똑같게 나누기 어려운 경우 배정 순서에 따라 차이가 생깁니다. 팀별 인원 차이를 허용할지, 남는 인원을 교대로 배치할지, 진행자가 직접 조정할지 사전에 합의하면 결과를 설명하기 쉽습니다.",
      "공정한 팀 편성을 위해서는 입력 목록을 실행 직전에 확정해야 합니다. 결과가 나온 뒤 특정 사람을 빼거나 원하는 팀으로 옮기면 무작위 편성의 의미가 달라지므로, 예외가 필요하면 예외 조건과 재실행 방법을 모두 공개하세요.",
      "수업이나 워크숍에서는 이름 대신 번호나 별칭을 사용할 수 있습니다. 출석 명단, 전화번호, 이메일, 고객 정보처럼 팀 편성에 필요 없는 개인정보는 입력하지 말고, 결과를 공유할 때도 최소한의 정보만 보이게 하세요.",
      "결과를 복사하면 팀별 이름 목록을 메신저나 문서로 옮길 수 있습니다. 공유 전에 수신자와 목적을 확인하고, 참가자가 공개를 원하지 않는 이름이 있다면 별칭으로 바꾸거나 결과를 개인적으로 전달하는 방식이 안전합니다.",
      "팀 구성 결과가 마음에 들지 않는다는 이유만으로 여러 번 실행하면 원하는 결과가 나올 때까지 고르는 문제가 생길 수 있습니다. 재편성 조건을 미리 정하고, 기술적인 오류나 참가자 누락처럼 합의한 사유가 있을 때만 다시 실행하세요.",
      "여러 후보 중 한 명을 뽑는 일에는 룰렛, 두 선택지에는 동전, 순서를 숫자로 정하는 일에는 주사위나 랜덤 숫자 도구가 더 간단할 수 있습니다. 팀 편성기는 사람을 여러 그룹으로 나눌 때 사용하세요.",
      "팀 편성기는 능력, 성격, 성별, 친밀도, 업무 적합성을 판단하지 않습니다. 협업 목적에 따라 실력 균형이나 안전 배려가 필요하다면 무작위 결과를 그대로 확정하기 전에 담당자가 필요한 조정을 검토해야 합니다.",
      "화면의 결과는 새로고침이나 다른 실행으로 자동 보존되는 공식 명단이 아닙니다. 행사에서 결과를 사용한다면 팀 수, 참가자 목록, 실행 시각, 확정 여부를 별도 문서에 남겨 참가자와 같은 내용을 확인하세요.",
      "참가자 목록의 순서는 결과의 팀 배정 자체를 정하지 않지만, 목록 누락을 찾는 데는 중요합니다. 실행 전에 출석자 수와 입력 줄 수를 맞추고, 동명이인이나 별칭을 구별해 결과를 전달할 때 혼란이 없도록 하세요.",
      "팀 수를 많이 늘리면 팀마다 한두 명만 배정될 수 있습니다. 활동의 목적과 필요한 협업 인원을 고려해 팀 수를 정하고, 도구가 허용하는 범위 안에서도 실제 활동에 적합한 규모인지 확인하세요.",
      "팀별 인원이 달라질 때는 남는 인원을 어느 팀에 배치할지의 규칙을 미리 합의하세요. 결과가 나온 뒤 특정 팀만 계속 바꾸면 입력 목록을 섞은 절차와 확정 절차가 분리되지 않아 참여자가 납득하기 어려울 수 있습니다.",
      "무작위 편성 뒤에 담당자의 조정이 필요할 수 있다는 점을 처음부터 알려 주세요. 안전, 접근성, 역할 충돌, 업무상 기밀처럼 무작위보다 우선하는 조건이 있다면 편성 후 검토를 거쳐 최종 팀을 확정해야 합니다.",
      "결과를 단체 채팅에 올릴 때는 참가자 모두가 볼 수 있는 공간인지 확인하고, 불필요한 개인정보를 제거하세요. 이름을 공개하기 어려운 활동이라면 번호와 별칭 대응표를 별도 보관하고 공유 범위를 제한할 수 있습니다.",
      "팀 편성기는 사람 사이의 관계나 능력을 평가하는 기능이 아닙니다. 결과가 활동 목적에 맞지 않으면 도구의 오류라고 단정하기보다 사전에 정한 예외 기준을 적용하고, 다음 실행이 필요한 이유를 참가자에게 설명하세요.",
      "결과를 확정하기 전에 각 팀의 이름이 빠지거나 중복되지 않았는지 세어 보세요. 입력 목록이 길수록 화면을 빠르게 읽다가 누락을 놓칠 수 있으므로, 원래 명단과 팀 결과를 한 번 비교하는 절차가 필요합니다.",
      "팀 수를 정할 때는 실제 활동의 역할과 시간을 고려하세요. 팀이 너무 작으면 협업 효과가 줄고 너무 크면 발언 기회가 줄 수 있으므로, 무작위 결과를 만든 뒤 활동 목적에 맞는지 진행자가 검토해야 합니다.",
      "새로고침이나 브라우저 종료 뒤에 같은 팀이 자동으로 복원된다고 가정하지 마세요. 결과를 계속 사용해야 한다면 팀별 목록을 복사해 안전한 문서에 보관하고, 공유 문서의 권한도 확인하세요.",
    ],
  },
};

const trustPageBodies = {
  "/about": [
    "SpinFlow는 회원가입 없이 사용할 수 있는 무료 웹 유틸리티 서비스입니다. 점심 메뉴, 순서 정하기, 추첨, 숫자 생성, 텍스트 변환, 날짜 계산처럼 작지만 반복되는 결정을 빠르게 처리하도록 돕습니다.",
    "운영 원칙은 단순합니다. 결과를 과장하지 않고, 도구 결과가 참고 정보임을 분명히 밝히며, 개인정보를 최소한으로 처리하고, 오류 제보와 개선 요청을 받을 수 있는 연락 경로를 유지합니다.",
    "일부 페이지에는 광고가 표시될 수 있지만 도구와 콘텐츠의 목적은 이용자에게 실용적인 기능과 판단 기준을 제공하는 것입니다.",
  ],
  "/contact": [
    "SpinFlow 도구 사용 중 발견한 오류, 콘텐츠 정정 요청, 개인정보 관련 문의, 광고 및 제휴 제안은 문의 경로를 통해 보낼 수 있습니다.",
    "기능 오류나 계산 결과 이상을 제보할 때는 관련 URL, 입력 조건, 재현 방법을 함께 남겨 주세요. 개인정보 또는 광고 관련 문의는 요청 목적과 관련 페이지 주소를 포함하면 더 빠르게 검토할 수 있습니다.",
    "개인정보 처리 방식은 개인정보처리방침, 서비스 이용 조건은 이용약관에 정리되어 있습니다.",
  ],
  "/privacy": [
    "SpinFlow는 회원가입 없이 사용할 수 있는 무료 웹 서비스이며 이용자의 개인정보를 최소한으로 처리합니다. 방문 페이지, 유입 경로, 체류 시간, 브라우저 유형 등 비식별 분석 정보가 서비스 품질 개선을 위해 사용될 수 있습니다.",
    "Google Analytics와 Google AdSense 등 제3자 서비스가 쿠키 또는 유사 기술을 사용해 방문 통계 분석, 광고 노출, 광고 성과 측정을 수행할 수 있습니다. Google의 개인정보 처리 방식은 Google 개인정보처리방침에서 확인할 수 있습니다.",
    "문의 또는 오류 제보 시 사용자가 직접 제공한 연락 정보와 문의 내용은 답변과 정정 처리에 필요한 기간 동안 보관될 수 있습니다. 개인정보 열람, 정정, 삭제, 처리 중지 요청은 문의하기 페이지를 통해 보낼 수 있습니다.",
  ],
  "/terms": [
    "본 약관은 SpinFlow가 제공하는 랜덤 결정 도구, 계산기, 텍스트 도구, 블로그 콘텐츠 등 웹 서비스의 이용 조건과 운영 기준을 안내합니다.",
    "룰렛, 주사위, 추첨, 예/아니오 도구 등은 사용자의 선택을 돕기 위한 참고용 기능입니다. 결과는 무작위 또는 입력값 기반으로 생성되며 법적, 의학적, 금융적, 전문적 판단을 대신하지 않습니다.",
    "일부 페이지에는 Google AdSense 등 광고가 표시될 수 있습니다. 콘텐츠와 도구의 기본 목적은 이용자에게 실용적인 정보와 기능을 제공하는 것이며, 오류를 발견하면 문의하기 페이지를 통해 정정 요청을 보낼 수 있습니다.",
  ],
};

function formatKstDate(date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getPublishAt(post) {
  return post.publishAt ?? `${post.date}T00:00:00+09:00`;
}

function getPublishTime(post) {
  return new Date(getPublishAt(post)).getTime();
}

function isPublished(post) {
  return getPublishTime(post) <= BUILD_NOW.getTime();
}

function getPublishDate(post) {
  return getPublishAt(post).slice(0, 10);
}

function getPageLastmod(page, posts) {
  if (page.path === "/blog") {
    return posts[0] ? getPublishDate(posts[0]) : page.lastmod;
  }

  if (!page.lastmod) {
    throw new Error(`Missing lastmod in site-pages.json: ${page.path}`);
  }

  return page.lastmod;
}

function extractCuratedPosts() {
  const source = fs.readFileSync(POSTS_PATH, "utf8");
  const blockRegex = /{\s*slug:\s*"([^"]+)"([\s\S]*?)(?=\n\s*{\s*slug:|\n\s*];)/g;
  const posts = [];
  let match;

  while ((match = blockRegex.exec(source))) {
    const [, slug, block] = match;
    const title = block.match(/title:\s*"([^"]+)"/)?.[1];
    const description = block.match(/description:\s*"([^"]+)"/)?.[1];
    const date = block.match(/date:\s*"([^"]+)"/)?.[1];
    const tagBlock = block.match(/tags:\s*\[([\s\S]*?)\]/)?.[1] ?? "";
    const tags = [...tagBlock.matchAll(/"([^"]+)"/g)].map((tagMatch) => tagMatch[1]);
    const thumbnail = block.match(/thumbnail:\s*"([^"]+)"/)?.[1];

    if (title && description && date) {
      posts.push({
        slug,
        title,
        description,
        date,
        tags,
        thumbnail,
        source: "curated",
      });
    }
  }

  return posts;
}

function extractGeneratedPosts() {
  if (!fs.existsSync(CONTENT_PLAN_PATH)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(CONTENT_PLAN_PATH, "utf8"))
    .filter((post) => ["scheduled", "published"].includes(post.status))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      publishAt: post.publishAt,
      tags: post.tags,
      thumbnail: post.thumbnail,
      qualityScore: post.qualityScore,
      category: post.category,
      contentType: post.contentType,
      primarySourceName: post.primarySourceName,
      primarySourceUrl: post.primarySourceUrl,
      internalLinks: post.internalLinks,
      source: "generated",
    }));
}

function extractAllPosts() {
  return [...extractCuratedPosts(), ...extractGeneratedPosts()];
}

function mergeWithExistingMetadata(posts) {
  if (!fs.existsSync(POST_METADATA_PATH)) return posts;

  try {
    const existing = JSON.parse(fs.readFileSync(POST_METADATA_PATH, "utf8"));
    if (!Array.isArray(existing)) return posts;
    const existingSlugs = new Set(existing.map((post) => post.slug));
    return [...existing, ...posts.filter((post) => !existingSlugs.has(post.slug))];
  } catch {
    return posts;
  }
}

function extractPosts() {
  return mergeWithExistingMetadata(extractAllPosts())
    .filter(isPublished)
    .sort((a, b) => getPublishTime(b) - getPublishTime(a));
}

function isIndexablePost(post) {
  return post.source === "curated";
}

function buildSitemap(posts) {
  const pageUrls = sitePages.map((page) => ({
    loc: `${SITE_ORIGIN}${page.path}`,
    lastmod: getPageLastmod(page, posts),
    changefreq: page.changefreq,
    priority: page.priority,
  }));
  const postUrls = posts.map((post) => ({
    loc: `${SITE_ORIGIN}/blog/${post.slug}`,
    lastmod: getPublishDate(post),
    changefreq: "yearly",
    priority: 0.7,
  }));

  const urls = [...pageUrls, ...postUrls]
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRss(posts) {
  const latest = posts[0] ? getPublishAt(posts[0]) : `${TODAY}T00:00:00+09:00`;
  const latestDate = new Date(latest).toUTCString();
  const items = posts
    .map((post) => {
      const url = `${SITE_ORIGIN}/blog/${post.slug}`;
      const pubDate = new Date(getPublishAt(post)).toUTCString();
      return `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${url}</link>
      <description>${escapeHtml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>`;
    })
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SpinFlow 블로그</title>
    <link>${SITE_ORIGIN}/blog</link>
    <description>결정 피로 극복, 생산성 향상, 디지털 웰빙과 무료 웹 유틸리티 활용 가이드입니다.</description>
    <language>ko</language>
    <lastBuildDate>${latestDate}</lastBuildDate>
    <atom:link href="${SITE_ORIGIN}/rss.xml" rel="self" type="application/rss+xml"/>

${items}
  </channel>
</rss>
`;
}

function buildLlms(posts) {
  const pageLines = sitePages
    .slice(0, 12)
    .map((page) => `- [${page.heading}](${SITE_ORIGIN}${page.path}) — ${page.summary}`)
    .join("\n");
  const postLines = posts
    .slice(0, 12)
    .map((post) => `- [${post.title}](${SITE_ORIGIN}/blog/${post.slug}) — ${post.description}`)
    .join("\n");

  return `# SpinFlow — 무료 온라인 룰렛 & 유틸리티 도구 모음

## 서비스 요약
SpinFlow는 결정 피로를 줄여주는 무료 웹 서비스입니다. 온라인 룰렛, 랜덤 추첨, 계산기, 변환기, 개발자 도구를 설치 없이 제공합니다.

## 주요 페이지
${pageLines}

## 최신 블로그
${postLines}

## 기술 정보
React, TypeScript, Vite, Tailwind CSS 기반이며 robots.txt, sitemap.xml, rss.xml, JSON-LD, AdSense 자동광고, GA4를 사용합니다.
`;
}

function structuredDataForPage(page) {
  if (page.path === "/") {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SpinFlow",
      url: SITE_ORIGIN,
      description: page.description,
      inLanguage: "ko-KR",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: `${SITE_ORIGIN}${page.path}`,
    description: page.description,
    inLanguage: "ko-KR",
  };
}

function renderShell(page) {
  const related = sitePages
    .filter((item) => item.path !== page.path)
    .slice(0, 6)
    .map((item) => `<li><a href="${item.path}">${escapeHtml(item.heading)}</a></li>`)
    .join("");
  const homeBody = approvalBodies[page.path] ?? [];
  const approvalHeading = approvalSectionHeadings[page.path];
  const trustBody = (trustPageBodies[page.path] ?? [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
  const homeTrustBody = homeBody.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
  const toolGuide = renderToolGuide(page);
  const guideToc = approvalHeading
    ? `<li><a href="#page-guide">${escapeHtml(approvalHeading)}</a></li>`
    : "";
  const toolToc = toolGuide
    ? `<li><a href="#tool-guide">${escapeHtml(page.heading)} 사용 안내</a></li>`
    : "";

  return `<main class="prerender-shell">
  <header>
    <p>SpinFlow</p>
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.description)}</p>
  </header>
  <nav class="toc" aria-label="페이지 목차">
    <strong>페이지 목차</strong>
    <ul>
      <li><a href="#page-summary">페이지 요약</a></li>
      ${guideToc}
      ${toolToc}
      <li><a href="#related-tools">관련 무료 도구</a></li>
      <li><a href="#reference-links">운영 기준 참고 링크</a></li>
    </ul>
  </nav>
  <section>
    <h2 id="page-summary">페이지 요약</h2>
    <p>${escapeHtml(page.summary)}</p>
    ${approvalHeading ? `<h2 id="page-guide">${escapeHtml(approvalHeading)}</h2>` : ""}
    ${homeTrustBody}
    ${trustBody}
    ${toolGuide}
  </section>
  <nav aria-label="Site policy links">
    <a href="/about/">About</a>
    <a href="/contact/">Contact</a>
    <a href="/privacy/">Privacy Policy</a>
    <a href="/terms/">Terms of Use</a>
  </nav>
  <section id="related-tools">
    <h2>관련 무료 도구</h2>
    <ul>${related}</ul>
  </section>
  <section id="reference-links">
    <h2>운영 기준 참고 링크</h2>
    <ul>${officialReferenceLinks
      .map(([label, href]) => `<li><a href="${href}" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`)
      .join("")}</ul>
  </section>
</main>`;
}

function renderToolGuide(page) {
  if (!page.path.startsWith("/tools/")) return "";

  const pathName = page.path.toLowerCase();
  const isRandom = ["lotto", "dice", "coin", "random", "team", "yes-no"].some((key) => pathName.includes(key));
  const isCalculator = ["calculator", "converter", "d-day", "timestamp", "timer", "wage", "salary", "pay", "leave", "interest"].some((key) => pathName.includes(key));
  const isDeveloper = ["json", "base64", "uri", "case", "diff", "markdown", "css", "color", "qr", "uuid", "lorem", "base-converter"].some((key) => pathName.includes(key));
  const isText = ["text", "word"].some((key) => pathName.includes(key));

  const category = isRandom
    ? "무작위 선택 도구"
    : isDeveloper
      ? "개발·디자인 보조 도구"
      : isText
        ? "텍스트 처리 도구"
        : isCalculator
          ? "계산·변환 도구"
          : "생활·생산성 도구";

  const resultGuide = isRandom
    ? "무작위 결과는 입력한 선택지와 설정을 기준으로 만들어집니다. 중복 항목을 허용할지 먼저 정하고, 결과가 나온 뒤에는 입력 목록을 바꾸지 않는 것이 기록과 공유에 유리합니다. 금전·법률·안전과 관련된 공식 추첨은 이 도구 대신 해당 기관의 절차를 사용하세요."
    : isDeveloper
      ? "변환·생성 결과는 복사하기 전에 원문과 결과를 함께 확인하세요. 특히 인코딩, JSON, Markdown, CSS, QR 결과는 사용하는 서비스의 형식과 길이 제한이 다를 수 있으므로 실제 적용 환경에서 한 번 더 테스트하는 것이 안전합니다."
      : isText
        ? "글자 수나 단어 빈도 결과는 공백, 줄바꿈, 기호를 어떻게 계산하는지에 따라 달라질 수 있습니다. 제출처의 글자 수 기준이 따로 있다면 그 기준과 이 도구의 결과를 함께 비교한 뒤 최종 문서를 확인하세요."
        : isCalculator
          ? "계산 결과는 사용자가 입력한 값과 선택한 단위·기준을 바탕으로 한 참고값입니다. 급여, 세금, 대출, 임대차, 건강처럼 실제 조건과 최신 기준이 중요한 경우에는 공식 기관 자료와 계약서 또는 전문가 안내를 최종 기준으로 삼으세요."
          : "도구 결과는 입력값과 브라우저에서 실행된 규칙을 바탕으로 한 참고값입니다. 결과를 공유하거나 실제 행동으로 옮기기 전에는 입력값이 맞는지, 현재 상황에 적용할 수 있는지 확인하세요.";

  const privacyGuide = isDeveloper
    ? "API 키, 비밀번호, 고객 정보, 내부 문서처럼 공개되면 안 되는 자료는 입력하지 마세요. 필요한 경우에도 작업이 끝난 뒤 입력 내용과 결과를 브라우저 기록이나 공유 문서에 남길지 직접 확인하세요."
    : "주민등록번호, 연락처, 주소, 건강 기록, 계정 정보처럼 민감한 개인정보는 입력하지 않는 것을 권장합니다. 예시가 필요하면 실제 값 대신 가상의 값으로 테스트하세요.";

  const related = sitePages
    .filter((item) => item.path !== page.path && item.path.startsWith("/tools/"))
    .slice(0, 5)
    .map((item) => `<li><a href="${item.path}">${escapeHtml(item.heading)}</a> — ${escapeHtml(item.summary)}</li>`)
    .join("");
  const details = toolGuideDetails[page.path];
  const detailBody = details
    ? `<h2>${escapeHtml(details.heading)}</h2>
    ${details.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}`
    : "";

  return `<div id="tool-guide" class="tool-guide">
    <h2>${escapeHtml(page.heading)} 사용 안내</h2>
    <p>${escapeHtml(page.description)} 이 페이지는 ${escapeHtml(category)}를 찾는 방문자가 기능을 이해하고 결과를 확인할 수 있도록 설명을 함께 제공합니다. 입력값을 넣은 뒤 실행 버튼을 누르고, 표시된 결과를 원래 목적과 비교하는 흐름으로 사용하세요.</p>
    <p>${escapeHtml(page.summary)} 도구가 바로 필요한 경우에는 위의 인터랙티브 영역을 사용하고, 사용법이나 선택 기준이 더 필요하면 SpinFlow의 관련 도구와 블로그 안내를 함께 확인하세요.</p>
    ${detailBody}
    <h2>${escapeHtml(page.heading)} 사용 순서</h2>
    <ol>
      <li>무엇을 확인하거나 결정하려는지 먼저 정하고 필요한 입력값만 준비합니다.</li>
      <li>화면의 입력란과 단위, 범위, 옵션을 실제 상황에 맞게 선택합니다.</li>
      <li>실행 또는 계산 버튼을 누르고 결과가 예상한 형식으로 표시되는지 확인합니다.</li>
      <li>결과를 복사하거나 공유하기 전에 원자료와 비교하고, 중요한 경우 별도로 기록합니다.</li>
    </ol>
    <h2>결과 해석과 주의사항</h2>
    <p>${escapeHtml(resultGuide)}</p>
    <h2>입력 정보와 개인정보</h2>
    <p>${escapeHtml(privacyGuide)}</p>
    <h2>관련 도구로 이어가기</h2>
    <ul>${related}</ul>
  </div>`;
}

function renderPostShell(post, staticContent = "") {
  const internalLinks = (post.internalLinks ?? [])
    .map((link) => `<li><a href="${escapeHtml(link.path)}">${escapeHtml(link.label)}</a></li>`)
    .join("");
  const reference = post.primarySourceUrl
    ? `<li><a href="${escapeHtml(post.primarySourceUrl)}" rel="noopener noreferrer">${escapeHtml(post.primarySourceName ?? "공식 참고 자료")}</a></li>`
    : "";
  const articleContent = staticContent
    ? `<section id="post-content" class="article-content-light" aria-label="${escapeHtml(post.title)} 본문">${staticContent}</section>`
    : `<section id="post-content"><h2>글 본문</h2><p>${escapeHtml(post.description)} 본문은 브라우저에서도 전체 내용과 함께 표시됩니다.</p></section>`;

  return `<article class="prerender-shell">
  <header>
    <p>SpinFlow 블로그 · ${getPublishDate(post)}</p>
    <h1>${escapeHtml(post.title)}</h1>
    <p>${escapeHtml(post.description)}</p>
  </header>
  <nav class="toc" aria-label="글 목차">
    <strong>글 목차</strong>
    <ul>
      <li><a href="#post-summary">글 요약</a></li>
      <li><a href="#post-content">본문</a></li>
      <li><a href="#post-related">관련 도구와 참고 자료</a></li>
    </ul>
  </nav>
  <section id="post-summary">
    <h2>글 요약</h2>
    <p>${escapeHtml(post.description)} 본문은 브라우저에서 전체 내용과 함께 표시됩니다.</p>
  </section>
  ${articleContent}
  <section id="post-related">
    <h2>관련 도구와 참고 자료</h2>
    <ul>${internalLinks}${reference}</ul>
  </section>
 </article>`;
}

function injectHtml(template, route) {
  const canonical = `${SITE_ORIGIN}${route.path}`;
  const meta = approvalMetaOverrides[route.path] ?? route;
  const jsonLd = JSON.stringify(route.structuredData);
  const robots = route.robots
    ? `\n  <meta name="robots" content="${route.robots}" />`
    : "";
  const headTags = `
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png" />
  <script id="spinflow-json-ld" type="application/ld+json">${jsonLd}</script>${robots}`;

  const cleanedTemplate = template
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']robots["'][\s\S]*?>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']og:url["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']og:title["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']og:description["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']og:image["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']twitter:card["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']twitter:card["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']twitter:url["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']twitter:url["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']twitter:title["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']twitter:description["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+property=["']twitter:image["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']twitter:title["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']twitter:description["'][\s\S]*?>/gi, "")
    .replace(/<meta\s+name=["']twitter:image["'][\s\S]*?>/gi, "")
    .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, "");

  return cleanedTemplate
    .replace("</head>", `${headTags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${route.body}</div>`);
}

function writeRouteHtml(distDir, template, route) {
  const targetDir = route.path === "/" ? distDir : path.join(distDir, route.path);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.html"), injectHtml(template, route));
}

function writePublicAssets(posts) {
  const publicDir = path.join(ROOT, "public");
  const allMetadata = mergeWithExistingMetadata(extractAllPosts());
  const indexablePosts = posts.filter(isIndexablePost);
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(indexablePosts));
  fs.writeFileSync(path.join(publicDir, "rss.xml"), buildRss(indexablePosts));
  fs.writeFileSync(path.join(publicDir, "llms.txt"), buildLlms(indexablePosts));
  fs.writeFileSync(
    POST_METADATA_PATH,
    JSON.stringify(allMetadata, null, 2),
  );
}

function writeDistAssets(posts) {
  const indexablePosts = posts.filter(isIndexablePost);
  const distDir = path.join(ROOT, "dist");
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run vite build first.");
  }

  const template = fs.readFileSync(templatePath, "utf8");
  const staticContentBySlug = fs.existsSync(STATIC_CONTENT_PATH)
    ? JSON.parse(fs.readFileSync(STATIC_CONTENT_PATH, "utf8"))
    : {};
  const pageRoutes = sitePages.map((page) => ({
    ...page,
    structuredData: structuredDataForPage(page),
    body: renderShell(page),
  }));
  const postRoutes = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: getPublishAt(post),
      url: `${SITE_ORIGIN}/blog/${post.slug}`,
      inLanguage: "ko-KR",
    },
    robots: isIndexablePost(post) ? undefined : "noindex,follow",
    body: renderPostShell(post, staticContentBySlug[post.slug]),
  }));

  for (const route of [...pageRoutes, ...postRoutes]) {
    writeRouteHtml(distDir, template, route);
  }

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemap(indexablePosts));
  fs.writeFileSync(path.join(distDir, "rss.xml"), buildRss(indexablePosts));
  fs.writeFileSync(path.join(distDir, "llms.txt"), buildLlms(indexablePosts));
}

const posts = extractPosts();
const mode = process.argv[2] ?? "--public";

if (mode === "--public") {
  writePublicAssets(posts);
} else if (mode === "--dist") {
  writeDistAssets(posts);
} else {
  throw new Error(`Unknown mode: ${mode}`);
}
