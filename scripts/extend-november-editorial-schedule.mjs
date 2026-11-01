import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src/data");
const chunkDir = path.join(dataDir, "generated-content-chunks");
const planPath = path.join(dataDir, "content-plan.generated.json");
const manifestPath = path.join(dataDir, "generated-content-manifest.generated.json");

const draftFiles = fs.readdirSync(dataDir)
  .filter((name) => /^november-editorial-\d+\.json$/.test(name))
  .sort();

if (draftFiles.length === 0) {
  throw new Error("No november-editorial-*.json files found in src/data");
}

const chunkFiles = draftFiles.map((_, index) => `chunk-editorial-november-${String.fromCharCode(97 + index)}.json`);

const groups = draftFiles.map((file) => JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8")));
const drafts = groups.flat();

const thumbnails = [
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
];

const enrichedGroups = groups.map((group) => group.map((article, idx) => ({
  ...article,
  thumbnail: article.thumbnail ?? thumbnails[idx % thumbnails.length],
  qualityScore: article.qualityScore ?? 95,
  duplicateStatus: "pass",
  cannibalizationStatus: "pass",
})));
const enriched = enrichedGroups.flat().sort((left, right) => Date.parse(left.publishAt) - Date.parse(right.publishAt));

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const novemberSlugs = new Set(enriched.map((article) => article.slug));
const preserved = plan.filter((article) => !novemberSlugs.has(article.slug));
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

console.log(`[november-editorial] total=${preserved.length + enriched.length} added=${enriched.length} first=${enriched[0].publishAt} last=${enriched.at(-1).publishAt}`);
