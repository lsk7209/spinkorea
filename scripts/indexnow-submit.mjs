import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const HOST = "www.spinkorea.kr";
const KEY = process.env.INDEXNOW_KEY ?? "9f7cb8706d8f4f81ab98d9a2efb516a1";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const RECENT_HOURS = Number(process.env.INDEXNOW_RECENT_HOURS ?? "0");
const ENDPOINTS = [
  "https://www.bing.com/indexnow",
  "https://searchadvisor.naver.com/indexnow",
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
  const response = await fetch(endpoint, {
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
    endpoint,
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

  console.log(JSON.stringify({ submitted: urls.length, results }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
