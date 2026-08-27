import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function readJsonLd(relativePath) {
  const html = read(relativePath);
  const match = html.match(/<script id="spinflow-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error(`${relativePath}: JSON-LD not found`);
  return JSON.parse(match[1]);
}

function graphTypes(data) {
  return new Set((data["@graph"] ?? []).map((item) => item?.["@type"]));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
}

const homeSchema = readJsonLd("dist/index.html");
const homeHtml = read("dist/index.html");
const homeGraph = homeSchema["@graph"] ?? [];
const organization = homeGraph.find((item) => item?.["@type"] === "Organization");
assert(organization?.name === "SpinFlow", "homepage identifies the canonical organization");
assert(organization?.alternateName === "SpinKorea", "homepage connects the SpinKorea alternate name");
assert(graphTypes(homeSchema).has("WebSite"), "homepage exposes WebSite schema");
assert(homeHtml.includes("<title>온라인 룰렛 돌리기"), "homepage static title matches Korean search intent");
assert(!homeHtml.includes("spinkorea SpinFlow free roulette"), "homepage removes the English approval override");

const randomTeamHtml = read("dist/tools/random-team/index.html");
const toolSchema = readJsonLd("dist/tools/random-team/index.html");
const toolTypes = graphTypes(toolSchema);
assert(randomTeamHtml.includes("<title>랜덤 팀 편성기 | 조 편성·팀 나누기</title>"), "tool route has a search-intent title");
assert(/name="description" content="[^"]+"/.test(randomTeamHtml), "tool route has a non-empty description");
assert(randomTeamHtml.includes('rel="canonical" href="https://spinkorea.kr/tools/random-team"'), "tool route has the canonical URL");
assert(toolTypes.has("WebApplication"), "tool route exposes WebApplication schema");
assert(toolTypes.has("BreadcrumbList"), "tool route exposes BreadcrumbList schema");

const blogHtml = read("dist/blog/index.html");
const blogLinks = blogHtml.match(/href="\/blog\/[^"]+"/g) ?? [];
assert(blogLinks.length >= 70, "blog hub exposes crawlable links to reviewed posts");

const toolsHtml = read("dist/tools/index.html");
const toolLinks = toolsHtml.match(/href="\/tools\/[^"]+"/g) ?? [];
assert(toolLinks.length >= 50, "tools hub exposes crawlable links to the tool directory");

const analyticsSource = read("src/utils/analytics.ts");
const toolLayoutSource = read("src/components/ToolLayout.tsx");
const homeSource = read("src/pages/Home.tsx");
assert(analyticsSource.includes('trackEvent("page_view"'), "SPA page-view event is defined");
assert(analyticsSource.includes('trackEvent("tool_result_viewed"'), "privacy-safe tool completion helper is defined");
const completedToolSources = [
  "LottoGenerator",
  "DiceRoller",
  "CoinFlip",
  "RandomTeam",
  "PasswordGenerator",
  "YesNoOracle",
  "JsonFormatter",
  "QrCodeGenerator",
].map((name) => read(`src/pages/tools/${name}.tsx`));
assert(completedToolSources.every((source) => source.includes("trackToolCompleted")), "eight representative tools measure actual completion");
assert(!analyticsSource.includes("result_value"), "tool completion contract excludes result values");
const fullMetadataSize = fs.statSync(path.join(ROOT, "src/data/post-metadata.generated.json")).size;
const runtimeMetadataSize = fs.statSync(path.join(ROOT, "src/data/post-metadata.runtime.generated.json")).size;
assert(runtimeMetadataSize < fullMetadataSize * 0.65, "blog runtime metadata is at least 35% smaller than build metadata");
assert(read("src/data/postMetadata.ts").includes("post-metadata.runtime.generated.json"), "blog runtime imports the projected metadata");
const trustedToolLayout = read("src/components/ToolLayout.tsx");
assert(trustedToolLayout.includes("기준·출처") && trustedToolLayout.includes("reviewedAt"), "tool pages support visible source and review-date evidence");
assert(read("scripts/generate-assets.mjs").includes("trustedToolReferences"), "trusted references are included in static tool guidance");
assert(toolLayoutSource.includes("onInputCapture={handleToolInteraction}"), "tool input engagement is measured");
assert(toolLayoutSource.includes("onClickCapture={handleToolInteraction}"), "tool click engagement is measured");
assert(homeSource.includes("무료 룰렛 바로 돌리기"), "homepage has a direct primary CTA");
assert(read("src/pages/NotFound.tsx").includes('robots="noindex,follow"'), "soft-404 screen is noindex");

console.log("Growth optimization verification complete.");
