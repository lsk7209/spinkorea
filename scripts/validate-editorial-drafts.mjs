import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src/data");
const octoberFiles = fs.readdirSync(dataDir)
  .filter((name) => /^october-editorial-\d+\.json$/.test(name))
  .sort();
const october = octoberFiles.flatMap((name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8")));
const plan = JSON.parse(fs.readFileSync(path.join(dataDir, "content-plan.generated.json"), "utf8"));
const octoberSlugs = new Set(october.map((item) => item.slug));
const september = plan.filter((item) => item.id?.startsWith("editorial-") && item.editorialReview === "approved" && !octoberSlugs.has(item.slug));

function assert(value, message) {
  if (!value) throw new Error(message);
}
function plain(body) { return body.replace(/<[^>]+>/g, ""); }
function tokens(body) {
  return new Set((plain(body).toLowerCase().match(/[\p{Letter}\p{Number}]{2,}/gu) ?? []));
}
function jaccard(left, right) {
  const common = [...left].filter((token) => right.has(token)).length;
  return common / new Set([...left, ...right]).size;
}
function matches(body, regex) { return [...body.matchAll(regex)]; }

const seenSlugs = new Set();
const seenTitles = new Set(plan.filter((item) => !octoberSlugs.has(item.slug)).map((item) => item.title));
const headingSignatures = new Set();
const paragraphOwners = new Map();

for (const article of october) {
  assert(!seenSlugs.has(article.slug), `duplicate October slug: ${article.slug}`);
  assert(!seenTitles.has(article.title), `duplicate existing title: ${article.title}`);
  seenSlugs.add(article.slug);
  seenTitles.add(article.title);
  assert(article.editorialReview === "approved", `unapproved October draft: ${article.slug}`);
  assert(plain(article.body).length >= 3500, `short October draft: ${article.slug}`);
  assert(matches(article.body, /<h2>/g).length >= 6, `insufficient H2: ${article.slug}`);
  assert(matches(article.body, /<a\s+href=["']\//g).length === 3, `internal link count: ${article.slug}`);
  const externalLinks = matches(article.body, /<a\s+href=["']https:\/\//g).length;
  assert(externalLinks >= 3 && externalLinks <= 5, `external source link count: ${article.slug}`);
  assert(Array.isArray(article.research?.sources) && article.research.sources.length >= 3 && article.research.sources.length <= 5, `research sources: ${article.slug}`);
  assert(article.research.sources.every((source) => source.url && source.role && source.usedFor), `research source contract: ${article.slug}`);
  assert((article.research.articleResearchQuestion || article.research.researchQuestion) && article.research.readerOutcome && article.research.originalContribution && article.research.sourceInterpretation, `research narrative: ${article.slug}`);
  assert(Array.isArray(article.research.articleSpecificDetails) && article.research.articleSpecificDetails.length >= 2, `article details: ${article.slug}`);
  assert(!/<script|\son\w+=|javascript:/i.test(article.body), `unsafe HTML: ${article.slug}`);

  const headings = matches(article.body, /<h2>(.*?)<\/h2>/gs).map((match) => plain(match[1]).toLowerCase()).join("|");
  assert(!headingSignatures.has(headings), `duplicate H2 sequence: ${article.slug}`);
  headingSignatures.add(headings);

  for (const paragraph of matches(article.body, /<p>(.*?)<\/p>/gs).map((match) => plain(match[1]).replace(/\s+/g, " ").trim())) {
    if (paragraph.length < 80) continue;
    const owner = paragraphOwners.get(paragraph);
    assert(!owner, `reused paragraph: ${owner} / ${article.slug}`);
    paragraphOwners.set(paragraph, article.slug);
  }
}

const compared = [...september, ...october];
let maximumSimilarity = 0;
let maximumPair = [];
for (let left = 0; left < compared.length; left += 1) {
  for (let right = left + 1; right < compared.length; right += 1) {
    const similarity = jaccard(tokens(compared[left].body), tokens(compared[right].body));
    if (similarity > maximumSimilarity) {
      maximumSimilarity = similarity;
      maximumPair = [compared[left].slug, compared[right].slug];
    }
    assert(similarity < 0.72, `body similarity too high: ${compared[left].slug} / ${compared[right].slug} ${similarity.toFixed(3)}`);
  }
}

console.log(JSON.stringify({
  status: "pass",
  octoberFiles: octoberFiles.length,
  octoberDrafts: october.length,
  comparedDrafts: compared.length,
  maximumSimilarity: Number(maximumSimilarity.toFixed(3)),
  maximumPair,
}, null, 2));
