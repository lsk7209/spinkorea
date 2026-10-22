import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const ROOT = process.cwd();
const CONTENT_PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const TOOL_OUTPUT_PATH = path.join(ROOT, "node_modules", ".cache", "spinkorea-tool-html.json");
const OUTPUT_PATH = path.join(ROOT, "node_modules", ".cache", "spinkorea-generated-content-html.json");
const TRUST_PAGES = [
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "PrivacyPolicy"],
  ["/terms", "Terms"],
];
const BUILD_NOW =new Date(process.env.BUILD_NOW ?? process.env.PUBLISH_NOW ?? Date.now());

function getPublishAt(post) {
  return post.publishAt ?? `${post.date}T00:00:00+09:00`;
}

function isPublished(post) {
  return new Date(getPublishAt(post)).getTime() <= BUILD_NOW.getTime();
}

if (!fs.existsSync(CONTENT_PLAN_PATH)) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, "{}\n");
  console.log("[render-generated-content] content plan not found; wrote an empty map");
  process.exit(0);
}

const plan = JSON.parse(fs.readFileSync(CONTENT_PLAN_PATH, "utf8"));
const publishedSlugs = plan
  .filter((post) => ["scheduled", "published"].includes(post.status) && isPublished(post))
  .map((post) => post.slug);

const server = await createServer({
  root: ROOT,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
  optimizeDeps: { noDiscovery: true },
});

try {
  const generated = await server.ssrLoadModule("/src/data/generatedContent.tsx");
  const curated = await server.ssrLoadModule("/src/data/posts.tsx");
  const staticContentBySlug = {};
  let skipped = 0;

  for (const slug of publishedSlugs) {
    const post = await generated.loadGeneratedBlogPost(slug);
    if (!post?.content) {
      skipped += 1;
      continue;
    }

    staticContentBySlug[slug] = renderToStaticMarkup(
      createElement(MemoryRouter, { initialEntries: [`/blog/${slug}`] }, post.content),
    );
  }

  for (const post of curated.CURATED_BLOG_POSTS ?? []) {
    if (!isPublished(post) || staticContentBySlug[post.slug]) continue;
    staticContentBySlug[post.slug] = renderToStaticMarkup(
      createElement(MemoryRouter, { initialEntries: [`/blog/${post.slug}`] }, post.content),
    );
  }


  // 도구 페이지: 실제 React 컴포넌트를 서버 렌더링해 정적 HTML에도 도구별 사용법·FAQ가 담기게 한다.
  const appSource = fs.readFileSync(path.join(ROOT, "src", "App.tsx"), "utf8");
  const componentFiles = Object.fromEntries(
    [...appSource.matchAll(/const (\w+) = lazy\(\s*\(\) => import\("@\/pages\/tools\/(\w+)"\)/g)].map((m) => [m[1], m[2]]),
  );
  const toolRoutes = [...appSource.matchAll(/path="(\/tools\/[\w-]+)"\s+element=\{<(\w+) \/>\}/g)];
  const toolHtml = {};
  let toolFailed = 0;
  for (const [, routePath, comp] of toolRoutes) {
    const file = componentFiles[comp];
    if (!file) continue;
    try {
      const mod = await server.ssrLoadModule(`/src/pages/tools/${file}.tsx`);
      toolHtml[routePath] = renderToStaticMarkup(
        createElement(MemoryRouter, { initialEntries: [routePath] }, createElement(mod.default)),
      );
    } catch (error) {
      toolFailed += 1;
      console.warn(`[render-generated-content] tool SSR failed for ${routePath}: ${error.message}`);
    }
  }
  // 신뢰 페이지: 운영 정보·연락처 등 React 본문을 정적 HTML에도 그대로 싣는다.
  for (const [routePath, file] of TRUST_PAGES) {
    try {
      const mod = await server.ssrLoadModule(`/src/pages/${file}.tsx`);
      toolHtml[routePath] = renderToStaticMarkup(
        createElement(MemoryRouter, { initialEntries: [routePath] }, createElement(mod.default)),
      );
    } catch (error) {
      toolFailed += 1;
      console.warn(`[render-generated-content] page SSR failed for ${routePath}: ${error.message}`);
    }
  }
  fs.mkdirSync(path.dirname(TOOL_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(TOOL_OUTPUT_PATH, `${JSON.stringify(toolHtml)}\n`);
  console.log(`[render-generated-content] tools+pages rendered=${Object.keys(toolHtml).length} failed=${toolFailed}`);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(staticContentBySlug)}\n`);
  console.log(
    `[render-generated-content] rendered=${Object.keys(staticContentBySlug).length} skipped=${skipped} buildNow=${BUILD_NOW.toISOString()}`,
  );
} finally {
  await server.close();
}
