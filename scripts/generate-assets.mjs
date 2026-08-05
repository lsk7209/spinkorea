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
  ],
  "/random-number": [
    "랜덤 숫자 뽑기는 번호표, 발표 순서, 간단한 게임, 수업 활동, 이벤트 준비처럼 숫자 하나 또는 여러 개가 필요한 순간에 쓰는 무료 도구입니다. 숫자 범위와 중복 허용 여부를 미리 정하면 결과를 더 쉽게 설명할 수 있습니다.",
    "이 도구는 브라우저의 난수 기능을 활용해 일반적인 무작위 숫자 선택을 돕습니다. 다만 금전이 걸린 추첨, 법적 증빙이 필요한 복권형 이벤트, 보안 토큰 생성, 암호 키 생성처럼 높은 신뢰성이 필요한 용도에는 별도의 공식 절차나 전문 시스템을 사용해야 합니다.",
    "공정하게 사용하려면 참가자 수, 번호 범위, 제외 번호, 재추첨 조건을 먼저 합의하세요. 결과가 나온 뒤 조건을 바꾸면 참가자가 결과를 신뢰하기 어렵습니다. 필요한 경우 결과와 시간을 별도로 기록해 두는 것이 좋습니다.",
    "SpinFlow의 숫자 결과는 사용자의 의사결정을 돕는 참고용입니다. 학교 활동, 소규모 모임, 회의 순서 정하기처럼 저위험 상황에 가장 적합하며, 개인정보나 민감한 식별번호를 입력하지 않는 것이 안전합니다.",
    "관련 도구로는 주사위, 동전 던지기, 랜덤 팀 편성, 룰렛, 로또 번호 생성기가 있습니다. 숫자가 아니라 사람이나 선택지를 고르는 상황이라면 해당 도구를 쓰는 편이 더 명확합니다.",
  ],
  "/tools": [
    "무료 웹 유틸리티 모음은 SpinFlow의 전체 도구를 한 곳에서 찾기 위한 허브입니다. 랜덤 추첨, 텍스트 처리, 개발자 도구, 날짜·시간 계산, 생활 금융 계산, 건강 관련 계산처럼 서로 다른 작업을 분류해 사용자가 필요한 도구로 바로 이동할 수 있게 합니다.",
    "도구 허브는 검색용 목록만 늘리는 페이지가 아니라 실제 작업 경로를 연결하는 안내 페이지입니다. 사용자는 글자수 세기에서 문서 길이를 확인하고, JSON 포맷터에서 API 응답을 정리하고, 더치페이 계산기에서 모임 비용을 나누고, D-Day 카운터에서 일정까지 남은 시간을 확인할 수 있습니다.",
    "각 계산기는 입력값을 바탕으로 브라우저에서 결과를 보여주는 참고용 도구입니다. 세금, 급여, 대출, 건강, 투자처럼 현실의 조건이 복잡한 분야에서는 최종 결정 전에 공식 기관, 계약서, 전문가 안내를 함께 확인해야 합니다.",
    "개인정보가 필요한 작업은 최소한의 값만 입력하는 것이 좋습니다. 비밀번호 생성기, UUID 생성기, 인코더, QR 코드 도구처럼 복사와 공유가 쉬운 기능은 결과를 어디에 붙여 넣는지 사용자가 직접 관리해야 합니다.",
    "이 허브는 내부 링크 품질을 높이기 위해 각 도구의 목적을 구분하고, 관련 블로그와 정책 페이지로 이어지는 경로를 유지합니다. AdSense 검토자는 이 페이지에서 사이트가 단일 위젯이 아니라 여러 실용 도구를 제공하는 서비스임을 확인할 수 있습니다.",
  ],
  "/faq": [
    "자주 묻는 질문 페이지는 룰렛, 랜덤 추첨, 계산기, 개인정보, 광고, 오류 제보에 대한 기본 답변을 정리합니다. 새 방문자가 도구를 쓰기 전에 서비스 범위와 한계를 빠르게 확인할 수 있게 하는 신뢰 페이지입니다.",
    "SpinFlow의 핵심 원칙은 회원가입 없이 바로 쓰는 것입니다. 사용자가 입력한 룰렛 항목이나 계산값은 주로 브라우저에서 처리되며, 서비스 개선을 위한 익명 분석과 광고 관련 쿠키는 개인정보처리방침에서 확인할 수 있습니다.",
    "FAQ 답변은 도구 결과가 전문 판단을 대체하지 않는다는 점을 반복해 안내합니다. 급여, 대출, 건강, 투자, 법적 절차에 가까운 계산은 편의를 위한 예비 계산이며 최종 판단에는 공식 자료나 전문가 확인이 필요합니다.",
    "오류 제보는 서비스 품질을 높이는 중요한 경로입니다. 사용자는 문제가 생긴 URL, 입력값, 브라우저, 재현 순서를 함께 보내면 운영자가 더 빠르게 확인할 수 있습니다. 새 도구 제안도 같은 문의 경로로 받을 수 있습니다.",
    "광고는 도구 결과를 바꾸지 않습니다. Google AdSense 자동 광고가 표시될 수 있지만 룰렛 결과, 계산 결과, 저장된 항목, 공유 URL에 영향을 주지 않는다는 점을 명확히 안내합니다.",
  ],
  "/blog": [
    "SpinFlow 블로그는 룰렛 활용법, 결정 피로 줄이기, 생산성 습관, 텍스트·개발 도구 사용법, 생활 계산 예시를 설명하는 가이드 모음입니다. 단순히 글 제목을 나열하는 곳이 아니라 도구 사용 맥락을 독자에게 연결하는 허브입니다.",
    "블로그 글은 사용자가 어떤 상황에서 어떤 도구를 선택해야 하는지 설명합니다. 예를 들어 랜덤 팀 편성은 참가자 목록과 재추첨 기준을 먼저 정해야 하고, 글자수 세기는 제출 규칙의 공백 포함 여부를 확인해야 하며, 계산기는 입력 단위와 반올림 기준을 이해해야 합니다.",
    "이 페이지는 최신 글을 카드로 보여주고 개별 글로 이동하는 내부 링크를 제공합니다. 사이트맵, RSS, llms.txt와 함께 작동해 검색 시스템이 새 글과 오래된 글의 관계를 이해하도록 돕습니다.",
    "콘텐츠 품질 기준은 반복 문장보다 실제 사용 상황입니다. 좋은 글은 문제 상황, 입력값, 확인 순서, 주의점, 관련 도구를 구분해야 합니다. 단순 키워드 반복이나 짧은 소개만 있는 글은 확장 대상입니다.",
    "광고가 표시되더라도 블로그의 목적은 도구 사용법과 결정 기준을 설명하는 것입니다. 사용자가 오류나 오래된 설명을 발견하면 문의 페이지로 정정 요청을 보낼 수 있습니다.",
  ],
};

const officialReferenceLinks = [
  ["Google AdSense 정책", "https://support.google.com/adsense/"],
  ["Google Search Central", "https://developers.google.com/search"],
  ["개인정보보호위원회", "https://www.pipc.go.kr/"],
];

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
  const trustBody = (trustPageBodies[page.path] ?? [])
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
  const homeTrustBody = homeBody.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
  const toolGuide = renderToolGuide(page);

  return `<main class="prerender-shell">
  <header>
    <p>SpinFlow</p>
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.description)}</p>
  </header>
  <section>
    <h2>페이지 요약</h2>
    <p>${escapeHtml(page.summary)}</p>
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
  <section>
    <h2>관련 무료 도구</h2>
    <ul>${related}</ul>
  </section>
  <section>
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

  return `<div class="tool-guide">
    <h2>${escapeHtml(page.heading)} 사용 안내</h2>
    <p>${escapeHtml(page.description)} 이 페이지는 ${escapeHtml(category)}를 찾는 방문자가 기능을 이해하고 결과를 확인할 수 있도록 설명을 함께 제공합니다. 입력값을 넣은 뒤 실행 버튼을 누르고, 표시된 결과를 원래 목적과 비교하는 흐름으로 사용하세요.</p>
    <p>${escapeHtml(page.summary)} 도구가 바로 필요한 경우에는 위의 인터랙티브 영역을 사용하고, 사용법이나 선택 기준이 더 필요하면 SpinFlow의 관련 도구와 블로그 안내를 함께 확인하세요.</p>
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
    ? `<section class="article-content-light" aria-label="${escapeHtml(post.title)} 본문">${staticContent}</section>`
    : `<section><h2>글 요약</h2><p>${escapeHtml(post.description)} 본문은 브라우저에서도 전체 내용과 함께 표시됩니다.</p></section>`;

  return `<article class="prerender-shell">
  <header>
    <p>SpinFlow 블로그 · ${getPublishDate(post)}</p>
    <h1>${escapeHtml(post.title)}</h1>
    <p>${escapeHtml(post.description)}</p>
  </header>
  <section>
    <h2>글 요약</h2>
    <p>${escapeHtml(post.description)} 본문은 브라우저에서 전체 내용과 함께 표시됩니다.</p>
  </section>
  ${articleContent}
  <section>
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
