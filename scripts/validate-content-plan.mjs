import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const POSTS_PATH = path.join(ROOT, "src", "data", "posts.tsx");
const MIN_QUALITY_SCORE = 85;
const PUBLISH_INTERVAL_HOURS = 5;

function normalize(value) {
  return value.replace(/[^\p{Letter}\p{Number}]+/gu, "").toLowerCase();
}

function readExistingTitles() {
  const source = fs.readFileSync(POSTS_PATH, "utf8");
  const blockRegex = /{\s*slug:\s*"([^"]+)"([\s\S]*?)(?=\n\s*{\s*slug:|\n\s*];)/g;
  const titles = [];
  let match;

  while ((match = blockRegex.exec(source))) {
    const title = match[2].match(/title:\s*"([^"]+)"/)?.[1];
    if (title) {
      titles.push(title);
    }
  }

  return titles;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
const existingTitles = readExistingTitles();
const allTitles = new Map();
const slugs = new Set();

assert(plan.length === 200, `generated article count mismatch: ${plan.length}`);

for (const title of existingTitles) {
  allTitles.set(normalize(title), title);
}

for (const [index, article] of plan.entries()) {
  const normalizedTitle = normalize(article.title);
  const duplicateTitle = allTitles.get(normalizedTitle);

  assert(!duplicateTitle, `duplicate title: ${article.title}`);
  assert(!slugs.has(article.slug), `duplicate slug: ${article.slug}`);
  assert(article.title.includes(article.mainKeyword), `main keyword missing: ${article.title}`);
  assert(article.expandedKeywords.length >= 3, `expanded keywords missing: ${article.slug}`);
  assert(article.qualityScore >= MIN_QUALITY_SCORE, `quality score too low: ${article.slug}`);
  assert(article.qualityScore <= 95, `quality score out of range: ${article.slug}`);
  assert(article.title.length <= 44, `Naver title too long: ${article.title}`);
  assert(article.description.length <= 120, `description too long: ${article.slug}`);
  assert(article.internalLinks.length >= 2, `internal links missing: ${article.slug}`);
  assert(article.primarySourceUrl.startsWith("https://"), `source URL invalid: ${article.slug}`);

  if (index > 0) {
    const previous = new Date(plan[index - 1].publishAt).getTime();
    const current = new Date(article.publishAt).getTime();
    const diffHours = (current - previous) / 1000 / 60 / 60;
    assert(diffHours === PUBLISH_INTERVAL_HOURS, `publish interval mismatch: ${article.slug}`);
  }

  allTitles.set(normalizedTitle, article.title);
  slugs.add(article.slug);
}

console.log(
  JSON.stringify(
    {
      status: "pass",
      generated: plan.length,
      existingTitles: existingTitles.length,
      firstPublishAt: plan[0].publishAt,
      lastPublishAt: plan.at(-1).publishAt,
      minQualityScore: Math.min(...plan.map((article) => article.qualityScore)),
    },
    null,
    2,
  ),
);
