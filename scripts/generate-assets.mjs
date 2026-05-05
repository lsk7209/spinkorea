import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE_ORIGIN = "https://www.spinkorea.kr";
const BUILD_NOW = new Date(process.env.BUILD_NOW ?? process.env.PUBLISH_NOW ?? Date.now());
const TODAY = formatKstDate(BUILD_NOW);
const SITE_PAGES_PATH = path.join(ROOT, "src", "data", "site-pages.json");
const POSTS_PATH = path.join(ROOT, "src", "data", "posts.tsx");
const CONTENT_PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const POST_METADATA_PATH = path.join(ROOT, "src", "data", "post-metadata.generated.json");

const sitePages = JSON.parse(fs.readFileSync(SITE_PAGES_PATH, "utf8"));

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

  return `<main class="prerender-shell">
  <header>
    <p>SpinFlow</p>
    <h1>${escapeHtml(page.heading)}</h1>
    <p>${escapeHtml(page.description)}</p>
  </header>
  <section>
    <h2>페이지 요약</h2>
    <p>${escapeHtml(page.summary)}</p>
  </section>
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
  const jsonLd = JSON.stringify(route.structuredData);
  const headTags = `
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeHtml(route.title)}" />
  <meta property="og:description" content="${escapeHtml(route.description)}" />
  <meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonical}" />
  <meta name="twitter:title" content="${escapeHtml(route.title)}" />
  <meta name="twitter:description" content="${escapeHtml(route.description)}" />
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
