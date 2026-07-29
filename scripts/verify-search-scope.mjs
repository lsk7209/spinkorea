import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sitemap = fs.readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const generatedRoute = fs.readFileSync(path.join(root, "dist", "blog", "team-rotation-fairness", "index.html"), "utf8");
const curatedRoute = fs.readFileSync(path.join(root, "dist", "blog", "overcome-decision-fatigue", "index.html"), "utf8");
const legacyRoute = fs.readFileSync(path.join(root, "dist", "blog", "fuel-economy-guide", "index.html"), "utf8");
const noindex = /<meta name="robots" content="noindex,follow"\s*\/>/;
const checks = [
  ["sitemap excludes generated posts", !sitemap.includes("/blog/team-rotation-fairness")],
  ["sitemap retains reviewed editorial posts", sitemap.includes("/blog/overcome-decision-fatigue")],
  ["generated post has noindex", noindex.test(generatedRoute)],
  ["legacy post remains reachable but has noindex", noindex.test(legacyRoute)],
  ["reviewed post remains indexable", !noindex.test(curatedRoute)],
];
for (const [label, passed] of checks) {
  if (!passed) throw new Error(`Search scope check failed: ${label}`);
  console.log(`PASS ${label}`);
}
