import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sitemap = fs.readFileSync(path.join(root, "dist", "sitemap.xml"), "utf8");
const publicSitemap = fs.readFileSync(path.join(root, "public", "sitemap.xml"), "utf8");
const rss = fs.readFileSync(path.join(root, "dist", "rss.xml"), "utf8");
const llms = fs.readFileSync(path.join(root, "dist", "llms.txt"), "utf8");
const generatedRoute = fs.readFileSync(path.join(root, "dist", "blog", "team-rotation-fairness", "index.html"), "utf8");
const curatedRoute = fs.readFileSync(path.join(root, "dist", "blog", "overcome-decision-fatigue", "index.html"), "utf8");
const legacyRoute = fs.readFileSync(path.join(root, "dist", "blog", "fuel-economy-guide", "index.html"), "utf8");
const generateAssetsSource = fs.readFileSync(path.join(root, "scripts", "generate-assets.mjs"), "utf8");
const blogPostSource = fs.readFileSync(path.join(root, "src", "pages", "BlogPost.tsx"), "utf8");
const metadata = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "post-metadata.generated.json"), "utf8"));
const editorialMeta = metadata.find((post) => post.slug === "random-number-exclusion");
const noindex = /<meta name="robots" content="noindex,follow"\s*\/>/;

function parseSitemapEntries(xml) {
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
    .map((match) => ({ loc: match[1], lastmod: match[2] }));
}

const sitemapEntries = parseSitemapEntries(sitemap);
const publicSitemapEntries = parseSitemapEntries(publicSitemap);
const sitemapUrlCount = (sitemap.match(/<url>/g) ?? []).length;
const sitemapLocCount = (sitemap.match(/<loc>/g) ?? []).length;
const sitemapLastmodCount = (sitemap.match(/<lastmod>/g) ?? []).length;
const sitemapLocs = sitemapEntries.map((entry) => entry.loc);
const checks = [
  ["public and dist sitemaps omit ignored changefreq and priority hints", !/<(?:changefreq|priority)>/.test(sitemap) && !/<(?:changefreq|priority)>/.test(publicSitemap)],
  ["every sitemap URL retains a paired loc and lastmod", sitemapUrlCount > 0 && sitemapEntries.length === sitemapUrlCount && sitemapUrlCount === sitemapLocCount && sitemapUrlCount === sitemapLastmodCount],
  ["public and dist sitemap URL metadata match", JSON.stringify(publicSitemapEntries) === JSON.stringify(sitemapEntries)],
  ["sitemap URLs are unique canonical HTTPS URLs", new Set(sitemapLocs).size === sitemapLocs.length && sitemapLocs.every((loc) => loc.startsWith("https://spinkorea.kr/"))],
  ["sitemap lastmod values use YYYY-MM-DD dates", sitemapEntries.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod) && !Number.isNaN(Date.parse(`${entry.lastmod}T00:00:00Z`)))],
  ["sitemap excludes generated posts", !sitemap.includes("/blog/team-rotation-fairness")],
  ["sitemap excludes legacy post", !sitemap.includes("/blog/fuel-economy-guide")],
  ["RSS excludes legacy post", !rss.includes("/blog/fuel-economy-guide")],
  ["llms feed excludes legacy post", !llms.includes("/blog/fuel-economy-guide")],
  ["sitemap retains reviewed editorial posts", sitemap.includes("/blog/overcome-decision-fatigue")],
  ["generated post has noindex", noindex.test(generatedRoute)],
  ["legacy post has route-specific canonical", legacyRoute.includes('<link rel="canonical" href="https://spinkorea.kr/blog/fuel-economy-guide" />')],
  ["legacy post remains reachable but has noindex", noindex.test(legacyRoute)],
  ["reviewed post remains indexable", !noindex.test(curatedRoute)],
  ["approved editorial metadata uses editorial source", editorialMeta?.source === "editorial"],
  ["static generator indexes curated and editorial sources", generateAssetsSource.includes('post.source === "curated" || post.source === "editorial"')],
  ["runtime robots only excludes generated sources", blogPostSource.includes('post.source === "generated" ? "noindex,follow" : "index,follow"')],
  ["future editorial remains absent before publish time", !sitemap.includes("/blog/random-number-exclusion")],
];
for (const [label, passed] of checks) {
  if (!passed) throw new Error(`Search scope check failed: ${label}`);
  console.log(`PASS ${label}`);
}
