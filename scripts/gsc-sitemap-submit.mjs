import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  "D:\\env\\cursorai-451704-85a5abbe8eeb.json";
const OUTPUT_DIR = path.join(ROOT, "google-audit-output");
const SITE_CANDIDATES = [
  process.env.GSC_SITE_URL,
  "https://spinkorea.kr/",
  "https://www.spinkorea.kr/",
  "sc-domain:spinkorea.kr",
].filter(Boolean);
const SCOPE = "https://www.googleapis.com/auth/webmasters";

function readServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const value = process.env.GOOGLE_SERVICE_ACCOUNT_JSON.trim();
    const json = value.startsWith("{")
      ? value
      : Buffer.from(value, "base64").toString("utf8");
    return JSON.parse(json);
  }

  return JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function createJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: SCOPE,
      aud: serviceAccount.token_uri,
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsignedToken = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer
    .sign(serviceAccount.private_key, "base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `${unsignedToken}.${signature}`;
}

async function getAccessToken(serviceAccount) {
  const response = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwt(serviceAccount),
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function googleRequest(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${url} failed: ${response.status} ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

function pickSite(sites) {
  const entries = sites.siteEntry ?? [];
  return (
    SITE_CANDIDATES.map((candidate) => entries.find((site) => site.siteUrl === candidate)).find(Boolean) ??
    entries.find((site) => site.siteUrl.includes("spinkorea.kr"))
  );
}

function getSitemapUrl(site) {
  if (process.env.GSC_SITEMAP_URL) {
    return process.env.GSC_SITEMAP_URL;
  }
  if (site.siteUrl.startsWith("http")) {
    return new URL("sitemap.xml", site.siteUrl).toString();
  }
  return "https://spinkorea.kr/sitemap.xml";
}

function findSubmittedSitemap(sitemaps, sitemapUrl) {
  return (sitemaps.sitemap ?? []).find((sitemap) => sitemap.path === sitemapUrl) ?? null;
}

function writeSummary(summary) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "gsc-sitemap-submit.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

async function main() {
  const serviceAccount = readServiceAccount();
  const accessToken = await getAccessToken(serviceAccount);
  const sites = await googleRequest(accessToken, "https://www.googleapis.com/webmasters/v3/sites");
  const site = pickSite(sites);

  if (!site) {
    writeSummary({
      checkedAt: new Date().toISOString(),
      status: "blocked",
      reason: "GSC property for spinkorea.kr not found for this service account.",
      expectedSites: SITE_CANDIDATES,
      matchingSites: (sites.siteEntry ?? [])
        .filter((entry) => entry.siteUrl.includes("spinkorea.kr"))
        .map((entry) => ({
          siteUrl: entry.siteUrl,
          permissionLevel: entry.permissionLevel,
        })),
    });
    return;
  }

  const sitemapUrl = getSitemapUrl(site);
  const siteUrl = encodeURIComponent(site.siteUrl);
  const feedPath = encodeURIComponent(sitemapUrl);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedPath}`;

  await googleRequest(accessToken, endpoint, { method: "PUT" });

  const sitemaps = await googleRequest(
    accessToken,
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`,
  );
  const submitted = findSubmittedSitemap(sitemaps, sitemapUrl);
  const summary = {
    checkedAt: new Date().toISOString(),
    status: "submitted",
    property: site.siteUrl,
    permissionLevel: site.permissionLevel,
    sitemapUrl,
    submitted,
  };

  writeSummary(summary);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
