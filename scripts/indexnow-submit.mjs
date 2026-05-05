import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOST = process.env.INDEXNOW_HOST ?? "www.spinkorea.kr";
const KEY = process.env.INDEXNOW_KEY ?? "d805fbad2191692bd79af72fc8b69fb4";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const RECENT_HOURS = Number(process.env.INDEXNOW_RECENT_HOURS ?? "0");
const ENDPOINTS = [
  { name: "bing", url: "https://www.bing.com/indexnow", required: false },
  { name: "naver", url: "https://searchadvisor.naver.com/indexnow", required: true },
];

function readSitemapUrls() {
  const sitemap = fs.readFileSync(path.join(ROOT, "public", "sitemap.xml"), "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function readRecentPublishedUrls() {
  if (!RECENT_HOURS) {
    return [];
  }

  const planPath = path.join(ROOT, "src", "data", "content-plan.generated.json");
  if (!fs.existsSync(planPath)) {
    return [];
  }

  const now = Date.now();
  const since = now - RECENT_HOURS * 60 * 60 * 1000;
  return JSON.parse(fs.readFileSync(planPath, "utf8"))
    .filter((post) => ["scheduled", "published"].includes(post.status))
    .filter((post) => {
      const publishTime = new Date(post.publishAt).getTime();
      return publishTime > since && publishTime <= now;
    })
    .map((post) => `https://${HOST}/blog/${post.slug}`);
}

function readUrls() {
  const sitemapUrls = new Set(readSitemapUrls());
  const recentUrls = readRecentPublishedUrls().filter((url) => sitemapUrls.has(url));
  return recentUrls.length > 0 ? recentUrls : [...sitemapUrls];
}

async function submit(endpoint, urlList) {
  const response = await fetch(endpoint.url, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  return {
    endpoint: endpoint.url,
    name: endpoint.name,
    required: endpoint.required,
    status: response.status,
    body: await response.text(),
  };
}

async function main() {
  const urls = readUrls();
  if (urls.length === 0) {
    console.log(JSON.stringify({ submitted: 0, results: [] }, null, 2));
    return;
  }

  const results = [];

  for (const endpoint of ENDPOINTS) {
    results.push(await submit(endpoint, urls));
  }

  const failedRequired = results.filter(
    (result) => result.required && (result.status < 200 || result.status >= 300),
  );
  const warnings = results.filter(
    (result) => !result.required && (result.status < 200 || result.status >= 300),
  );

  console.log(
    JSON.stringify(
      {
        submitted: urls.length,
        status: failedRequired.length > 0 ? "failed" : warnings.length > 0 ? "partial" : "ok",
        results,
        warnings,
      },
      null,
      2,
    ),
  );

  if (failedRequired.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
