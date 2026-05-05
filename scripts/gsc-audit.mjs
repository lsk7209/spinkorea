import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  "D:\\env\\cursorai-451704-85a5abbe8eeb.json";
const OUTPUT_DIR = path.join(ROOT, "google-audit-output");
const DEFAULT_SITE = process.env.GSC_SITE_URL ?? "https://spinkorea.kr/";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

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

async function googleGet(accessToken, url) {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function googlePost(accessToken, url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function pickSite(sites) {
  const entries = sites.siteEntry ?? [];
  return (
    entries.find((site) => site.siteUrl === DEFAULT_SITE) ??
    entries.find((site) => site.siteUrl.includes("spinkorea.kr"))
  );
}

async function main() {
  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
  const accessToken = await getAccessToken(serviceAccount);
  const sites = await googleGet(accessToken, "https://www.googleapis.com/webmasters/v3/sites");
  const site = pickSite(sites);

  if (!site) {
    throw new Error("GSC property for spinkorea.kr not found for this service account.");
  }

  const siteUrl = encodeURIComponent(site.siteUrl);
  const query = await googlePost(
    accessToken,
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`,
    {
      startDate: dateDaysAgo(28),
      endDate: dateDaysAgo(1),
      dimensions: ["page", "query"],
      rowLimit: 250,
      startRow: 0,
    },
  );

  const summary = {
    checkedAt: new Date().toISOString(),
    property: site.siteUrl,
    permissionLevel: site.permissionLevel,
    rows: query.rows ?? [],
  };

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "gsc-search-analytics.json"), JSON.stringify(summary, null, 2));
  console.log(`GSC audit saved: ${path.join(OUTPUT_DIR, "gsc-search-analytics.json")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
