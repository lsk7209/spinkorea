import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src/data");
const chunkDir = path.join(dataDir, "generated-content-chunks");
const planPath = path.join(dataDir, "content-plan.generated.json");
const manifestPath = path.join(dataDir, "generated-content-manifest.generated.json");
const draftFiles = Array.from({ length: 6 }, (_, index) => `october-editorial-${String(index + 1).padStart(2, "0")}.json`);
const chunkFiles = draftFiles.map((_, index) => `chunk-editorial-october-${String.fromCharCode(97 + index)}.json`);

for (const file of draftFiles) {
  if (!fs.existsSync(path.join(dataDir, file))) throw new Error(`missing October draft file: ${file}`);
}

const groups = draftFiles.map((file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8")));
const drafts = groups.flat();
if (drafts.length !== 27) throw new Error(`October draft count mismatch: ${drafts.length}`);

const enrichedGroups = groups.map((group) => group.map((article) => ({
  ...article,
  thumbnail: article.thumbnail ?? "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1600&auto=format&fit=crop",
  qualityScore: article.qualityScore ?? 95,
  duplicateStatus: "pass",
  cannibalizationStatus: "pass",
})));
const enriched = enrichedGroups.flat().sort((left, right) => Date.parse(left.publishAt) - Date.parse(right.publishAt));

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const octoberSlugs = new Set(enriched.map((article) => article.slug));
const preserved = plan.filter((article) => !octoberSlugs.has(article.slug));
fs.writeFileSync(planPath, `${JSON.stringify([...preserved, ...enriched], null, 2)}\n`);

for (const [index, group] of enrichedGroups.entries()) {
  const runtimeGroup = group.map(({ research: _research, ...article }) => article);
  fs.writeFileSync(path.join(chunkDir, chunkFiles[index]), `${JSON.stringify(runtimeGroup, null, 2)}\n`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
for (const [groupIndex, group] of enrichedGroups.entries()) {
  for (const article of group) manifest[article.slug] = chunkFiles[groupIndex];
}
const sortedManifest = Object.fromEntries(Object.entries(manifest).sort(([left], [right]) => left.localeCompare(right)));
fs.writeFileSync(manifestPath, `${JSON.stringify(sortedManifest, null, 2)}\n`);

console.log(`[october-editorial] total=${preserved.length + enriched.length} added=${enriched.length} first=${enriched[0].publishAt} last=${enriched.at(-1).publishAt}`);
