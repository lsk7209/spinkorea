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
      source: "generated",
    }));
}

function extractAllPosts() {
  return [...extractCuratedPosts(), ...extractGeneratedPosts()];
}

function extractPosts() {
  return extractAllPosts()
    .filter(isPublished)
    .sort((a, b) => getPublishTime(b) - getPublishTime(a));
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
</main>`;
}

function renderPostShell(post) {
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
</article>`;
}

function injectHtml(template, route) {
  const canonical = `${SITE_ORIGIN}${route.path}`;
  const meta = approvalMetaOverrides[route.path] ?? route;
  const jsonLd = JSON.stringify(route.structuredData);
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
  <script id="spinflow-json-ld" type="application/ld+json">${jsonLd}</script>`;

  const cleanedTemplate = template
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, "")
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
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), buildSitemap(posts));
  fs.writeFileSync(path.join(publicDir, "rss.xml"), buildRss(posts));
  fs.writeFileSync(path.join(publicDir, "llms.txt"), buildLlms(posts));
  fs.writeFileSync(
    POST_METADATA_PATH,
    `${JSON.stringify(
      extractAllPosts().sort((a, b) => getPublishTime(b) - getPublishTime(a)),
      null,
      2,
    )}\n`,
  );
}

function writeDistAssets(posts) {
  const distDir = path.join(ROOT, "dist");
  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error("dist/index.html not found. Run vite build first.");
  }

  const template = fs.readFileSync(templatePath, "utf8");
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
    body: renderPostShell(post),
  }));

  for (const route of [...pageRoutes, ...postRoutes]) {
    writeRouteHtml(distDir, template, route);
  }

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemap(posts));
  fs.writeFileSync(path.join(distDir, "rss.xml"), buildRss(posts));
  fs.writeFileSync(path.join(distDir, "llms.txt"), buildLlms(posts));
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
