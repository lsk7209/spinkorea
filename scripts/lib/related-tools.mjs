/**
 * SPK2-07/08: the static HTML shell must list the same related tools the
 * React page shows. Each tool page declares `relatedTools={[{ path: ... }]}`;
 * this reads those declarations (via the route table in App.tsx) so the two
 * renderings share one source instead of the static shell slicing the first
 * six site pages.
 */
import fs from "node:fs";
import path from "node:path";

const LAZY_IMPORT = /const (\w+) = lazy\(\s*\(\) => import\("@\/pages\/([\w/]+)"\)/g;
const ROUTE = /<Route\s+path="([^"]+)"\s+element=\{<(\w+) \/>\}/g;

/** Extract `path:` values inside the relatedTools={[ ... ]} block of a page source. */
export function extractRelatedPaths(source) {
  const start = source.indexOf("relatedTools={[");
  if (start < 0) return [];
  let depth = 0;
  let end = start + "relatedTools={".length;
  for (let i = end; i < source.length; i += 1) {
    if (source[i] === "[") depth += 1;
    if (source[i] === "]") depth -= 1;
    if (depth === 0) { end = i; break; }
  }
  const block = source.slice(start, end);
  return [...block.matchAll(/path:\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

/** Map route path -> related route paths declared by that page component. */
export function buildRelatedToolMap(root) {
  const app = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
  const componentFile = new Map([...app.matchAll(LAZY_IMPORT)].map(([, name, file]) => [name, file]));
  const map = new Map();
  for (const [, routePath, component] of app.matchAll(ROUTE)) {
    const file = componentFile.get(component);
    if (!file) continue;
    const sourcePath = path.join(root, "src", "pages", `${file}.tsx`);
    if (!fs.existsSync(sourcePath)) continue;
    const related = extractRelatedPaths(fs.readFileSync(sourcePath, "utf8"));
    if (related.length > 0) map.set(routePath, related);
  }
  return map;
}

/**
 * Related links for the static shell: declared links first (only ones that
 * exist as site pages, no self-links, no duplicates); pages without a
 * declaration fall back to pages in the same section.
 */
export function selectRelatedPages(page, sitePages, relatedMap, limit = 6) {
  const byPath = new Map(sitePages.map((item) => [item.path, item]));
  const declared = (relatedMap.get(page.path) ?? [])
    .filter((p, index, list) => p !== page.path && byPath.has(p) && list.indexOf(p) === index)
    .map((p) => byPath.get(p));
  if (declared.length > 0) return declared.slice(0, limit);

  const section = page.path.startsWith("/tools/") ? "/tools/" : null;
  const sameSection = section ? sitePages.filter((item) => item.path.startsWith(section) && item.path !== page.path) : [];
  const fallback = sameSection.length > 0 ? sameSection : sitePages.filter((item) => item.path !== page.path);
  return fallback.slice(0, limit);
}
