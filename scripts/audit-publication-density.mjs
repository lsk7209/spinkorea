import fs from "node:fs";
import path from "node:path";

const maxPostsPerDay = 2;
const planPath = path.join(process.cwd(), "src", "data", "content-plan.generated.json");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const byDay = new Map();

for (const article of plan) {
  const day = String(article.publishAt ?? "").slice(0, 10);
  if (!day) throw new Error(`${article.slug}: publishAt is required`);
  byDay.set(day, [...(byDay.get(day) ?? []), article.slug]);
}

const overloadedDays = [...byDay.entries()]
  .filter(([, slugs]) => slugs.length > maxPostsPerDay)
  .map(([day, slugs]) => ({ day, count: slugs.length, slugs }));

console.log(JSON.stringify({
  generated: plan.length,
  maxPostsPerDay,
  days: byDay.size,
  overloadedDays,
}, null, 2));

process.exit(overloadedDays.length ? 1 : 0);
