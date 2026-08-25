import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const blogPost = read("src/pages/BlogPost.tsx");
const about = read("src/pages/About.tsx");
const metadata = read("src/data/postMetadata.ts");
const generator = read("scripts/generate-assets.mjs");
const adsTxt = read("public/ads.txt").trim();

assert(blogPost.includes('post.source === "generated" ? "noindex,follow" : "index,follow"'), "generated posts must remain noindex");
assert(blogPost.includes("작성·검토: SpinFlow 편집팀"), "curated articles need a visible editor signal");
assert(blogPost.includes('to="/about"'), "curated articles need an editorial-policy link");
assert(blogPost.includes('to="/contact"'), "curated articles need a correction link");
assert(about.includes("콘텐츠 편집·검토 기준"), "about page needs editorial standards");
assert(about.includes("검토되지 않은 자동 생성 초안은 검색 결과와 블로그 목록에 노출하지 않습니다."), "draft exclusion policy must be explicit");
assert(metadata.includes('return post.source === "curated";'), "only curated posts may be indexable");
assert(generator.includes('robots: isIndexablePost(post) ? undefined : "noindex,follow"'), "static shells must preserve generated-post noindex");
assert(/^google\.com, pub-\d+, DIRECT, f08c47fec0942fa0$/m.test(adsTxt), "ads.txt publisher record missing or malformed");

console.log("AdSense readiness audit PASS: curated trust signals, generated noindex, and ads.txt are locked.");
