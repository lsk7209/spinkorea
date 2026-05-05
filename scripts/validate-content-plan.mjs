import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PLAN_PATH = path.join(ROOT, "src", "data", "content-plan.generated.json");
const POSTS_PATH = path.join(ROOT, "src", "data", "posts.tsx");
const MIN_QUALITY_SCORE = 85;
const PUBLISH_INTERVAL_HOURS = 5;
const MAX_REPEATED_TITLE_PATTERN = 5;
const MAX_SIMILAR_TITLE_PAIRS = 20;
const TITLE_SIMILARITY_THRESHOLD = 0.55;
const FORBIDDEN_TEXT_PATTERNS = [
  "정리을",
  "확인을",
  "보기를",
  "기준을 기준",
  "적용와",
  "설정를",
  "확인을",
  "기록를",
  "점검를",
  "기록와",
  "확인와",
  "공유 전 확인와",
  "기준 적용 기준",
  "선택 기준, 기준",
  "FAQ,",
  "질문 정리",
  "결과 기록부터 보기",
];
const TRUSTED_SOURCE_HOSTS = new Set([
  "developer.mozilla.org",
  "www.kca.go.kr",
  "www.korean.go.kr",
  "www.moel.go.kr",
  "www.kdca.go.kr",
  "developers.google.com",
]);
const REQUIRED_RENDER_MARKERS = [
  "핵심 요약",
  "자주 묻는 질문",
  "근거와 참고 자료",
  "<table>",
  "함께 보면 좋은 SpinFlow 도구",
];

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

function titlePattern(title, mainKeyword) {
  return title
    .replace(mainKeyword, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "")
    .toLowerCase();
}

function assertTrustedSource(sourceUrl, slug) {
  const host = new URL(sourceUrl).hostname;
  assert(TRUSTED_SOURCE_HOSTS.has(host), `untrusted source host: ${slug} ${host}`);
}

function assertNaturalTitle(title) {
  const words = title.match(/\p{Letter}+/gu) ?? [];
  for (let index = 1; index < words.length; index += 1) {
    assert(words[index] !== words[index - 1], `repeated adjacent title word: ${title}`);
  }
}

function tokenizeTitle(title) {
  const stopWords = new Set([
    "기준",
    "정리",
    "질문",
    "실수",
    "줄이는",
    "보기",
    "확인",
    "시작",
    "비교",
    "선택",
    "실전",
    "체크리스트",
    "실행",
    "순서",
    "적용",
    "가이드",
    "부터",
    "까지",
    "중심",
  ]);

  return new Set((title.match(/[\p{Letter}\p{Number}]+/gu) ?? []).filter((token) => token.length > 1 && !stopWords.has(token)));
}

function titleSimilarity(left, right) {
  const leftTokens = tokenizeTitle(left);
  const rightTokens = tokenizeTitle(right);
  const union = new Set([...leftTokens, ...rightTokens]);

  if (union.size === 0) {
    return 0;
  }

  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  return intersection / union.size;
}

function assertNoForbiddenText(article) {
  const text = `${article.title}\n${article.description}\n${article.mainKeyword}\n${article.expandedKeywords.join("\n")}`;
  for (const pattern of FORBIDDEN_TEXT_PATTERNS) {
    assert(!text.includes(pattern), `forbidden text pattern: ${article.slug} ${pattern}`);
  }
}

function assertGeneratedRenderer() {
  const renderer = fs.readFileSync(path.join(ROOT, "src", "data", "generatedContent.tsx"), "utf8");
  for (const marker of REQUIRED_RENDER_MARKERS) {
    assert(renderer.includes(marker), `generated renderer marker missing: ${marker}`);
  }
}

const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf8"));
const existingTitles = readExistingTitles();
const allTitles = new Map();
const slugs = new Set();
const patternCounts = new Map();
const generatedTitles = [];

assert(plan.length === 200, `generated article count mismatch: ${plan.length}`);
assertGeneratedRenderer();

for (const title of existingTitles) {
  allTitles.set(normalize(title), title);
}

for (const [index, article] of plan.entries()) {
  const normalizedTitle = normalize(article.title);
  const duplicateTitle = allTitles.get(normalizedTitle);

  assert(!duplicateTitle, `duplicate title: ${article.title}`);
  assert(!slugs.has(article.slug), `duplicate slug: ${article.slug}`);
  assert(article.title.includes(article.mainKeyword), `main keyword missing: ${article.title}`);
  assertNaturalTitle(article.title);
  assertNoForbiddenText(article);
  assert(article.expandedKeywords.length >= 3, `expanded keywords missing: ${article.slug}`);
  assert(article.qualityScore >= MIN_QUALITY_SCORE, `quality score too low: ${article.slug}`);
  assert(article.qualityScore <= 95, `quality score out of range: ${article.slug}`);
  assert(article.title.length <= 44, `Naver title too long: ${article.title}`);
  assert(article.description.length <= 120, `description too long: ${article.slug}`);
  assert(article.internalLinks.length >= 2, `internal links missing: ${article.slug}`);
  assert(article.primarySourceUrl.startsWith("https://"), `source URL invalid: ${article.slug}`);
  assertTrustedSource(article.primarySourceUrl, article.slug);
  assert(article.duplicateStatus === "pass", `duplicate status not pass: ${article.slug}`);
  assert(article.cannibalizationStatus === "pass", `cannibalization status not pass: ${article.slug}`);

  const pattern = titlePattern(article.title, article.mainKeyword);
  patternCounts.set(pattern, (patternCounts.get(pattern) ?? 0) + 1);
  assert(
    patternCounts.get(pattern) <= MAX_REPEATED_TITLE_PATTERN,
    `repeated title pattern: ${pattern}`,
  );

  if (index > 0) {
    const previous = new Date(plan[index - 1].publishAt).getTime();
    const current = new Date(article.publishAt).getTime();
    const diffHours = (current - previous) / 1000 / 60 / 60;
    assert(diffHours === PUBLISH_INTERVAL_HOURS, `publish interval mismatch: ${article.slug}`);
  }

  allTitles.set(normalizedTitle, article.title);
  slugs.add(article.slug);
  generatedTitles.push({ slug: article.slug, title: article.title });
}

const similarTitlePairs = [];
for (let leftIndex = 0; leftIndex < generatedTitles.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < generatedTitles.length; rightIndex += 1) {
    const similarity = titleSimilarity(generatedTitles[leftIndex].title, generatedTitles[rightIndex].title);
    if (similarity >= TITLE_SIMILARITY_THRESHOLD) {
      similarTitlePairs.push({
        similarity,
        left: generatedTitles[leftIndex],
        right: generatedTitles[rightIndex],
      });
    }
  }
}

assert(
  similarTitlePairs.length <= MAX_SIMILAR_TITLE_PAIRS,
  `too many similar title pairs: ${similarTitlePairs.length}`,
);

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
