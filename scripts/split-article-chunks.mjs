// 묶음 콘텐츠 청크를 글 1편 = 파일 1개로 나눈다. 글을 열 때 해당 글만 내려받게 하기 위한 빌드 산출물이다.
// 원본(generated-content-chunks)은 그대로 두고 src/data/article-cache/ (git 제외)에 쓴다.
// Usage: node scripts/split-article-chunks.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const chunkDir = path.join(root, "src", "data", "generated-content-chunks");
const cacheDir = path.join(root, "src", "data", "article-cache");
const SAFE_SLUG = /^[a-z0-9-]+$/;

fs.rmSync(cacheDir, { recursive: true, force: true });
fs.mkdirSync(cacheDir, { recursive: true });

let written = 0;
for (const file of fs.readdirSync(chunkDir).filter((name) => name.endsWith(".json"))) {
  const articles = JSON.parse(fs.readFileSync(path.join(chunkDir, file), "utf8"));
  for (const article of articles) {
    if (!SAFE_SLUG.test(article.slug)) throw new Error(`unsafe slug in ${file}: ${article.slug}`);
    const target = path.join(cacheDir, `${article.slug}.json`);
    if (fs.existsSync(target)) throw new Error(`duplicate slug across chunks: ${article.slug}`);
    fs.writeFileSync(target, JSON.stringify(article));
    written += 1;
  }
}
console.log(`[split-article-chunks] written=${written}`);
