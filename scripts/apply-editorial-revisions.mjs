// Apply reviewed rewrites of existing generated posts (src/data/revised-editorial-*.json)
// to the content plan and runtime chunks. Idempotent.
// Keeps id, slug, date, publishAt, category, contentType, mainKeyword; marks editorialReview "approved".
// Usage: node scripts/apply-editorial-revisions.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const chunkDir = path.join(dataDir, "generated-content-chunks");
const planPath = path.join(dataDir, "content-plan.generated.json");
const manifestPath = path.join(dataDir, "generated-content-manifest.generated.json");
const REVISED_FIELDS = ["title", "description", "tags", "internalLinks", "primarySourceName", "primarySourceUrl", "body", "research", "revisedAt"];

const revisionFiles = fs.readdirSync(dataDir).filter((name) => /^revised-editorial-.+\.json$/.test(name)).sort();
const revisions = revisionFiles.flatMap((name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8")));
const bySlug = new Map(revisions.map((revision) => [revision.slug, revision]));
if (bySlug.size !== revisions.length) throw new Error("duplicate slug in revision files");

function applyRevision(article) {
  const revision = bySlug.get(article.slug);
  if (!revision) return article;
  if (revision.mainKeyword && revision.mainKeyword !== article.mainKeyword) throw new Error(`mainKeyword changed: ${article.slug}`);
  const next = { ...article, editorialReview: "approved" };
  for (const field of REVISED_FIELDS) if (revision[field] !== undefined) next[field] = revision[field];
  return next;
}

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const missing = [...bySlug.keys()].filter((slug) => !plan.some((article) => article.slug === slug));
if (missing.length) throw new Error(`revision slugs missing from plan: ${missing.join(", ")}`);
fs.writeFileSync(planPath, `${JSON.stringify(plan.map(applyRevision), null, 2)}\n`);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const touchedChunks = new Set([...bySlug.keys()].map((slug) => manifest[slug]));
for (const chunk of touchedChunks) {
  if (!chunk) throw new Error("revision slug not in manifest");
  const chunkPath = path.join(chunkDir, chunk);
  const entries = JSON.parse(fs.readFileSync(chunkPath, "utf8"));
  const updated = entries.map((entry) => {
    const { research: _research, ...runtime } = applyRevision(entry);
    return runtime;
  });
  fs.writeFileSync(chunkPath, `${JSON.stringify(updated, null, 2)}\n`);
}
console.log(`[editorial-revisions] files=${revisionFiles.length} applied=${bySlug.size} chunks=${touchedChunks.size}`);
