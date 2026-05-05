import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CLIENT_PATH = process.env.ADSENSE_OAUTH_CLIENT ?? "D:\\env\\adsense_oauth_client.json";
const TOKEN_PATH = process.env.ADSENSE_TOKEN_PATH ?? "D:\\env\\adsense.token.json";
const OUTPUT_DIR = path.join(ROOT, "google-audit-output");
const SCOPE = "https://www.googleapis.com/auth/adsense.readonly";

function readClient() {
  const raw = JSON.parse(fs.readFileSync(CLIENT_PATH, "utf8"));
  return raw.installed ?? raw.web;
}

function authUrl(client) {
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: client.client_id,
    redirect_uri: client.redirect_uris[0],
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  })}`;
}

async function exchangeCode(client, code) {
  const response = await fetch(client.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: client.redirect_uris[0],
    }),
  });

  if (!response.ok) {
    throw new Error(`AdSense OAuth code exchange failed: ${response.status} ${await response.text()}`);
  }

  const token = await response.json();
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
  return token;
}

async function refreshToken(client, token) {
  const response = await fetch(client.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret,
      refresh_token: token.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`AdSense OAuth refresh failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function adsenseGet(accessToken, url) {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  const client = readClient();
  const codeArg = process.argv.find((arg) => arg.startsWith("--code="));

  if (codeArg) {
    await exchangeCode(client, codeArg.slice("--code=".length));
  }

  if (!fs.existsSync(TOKEN_PATH)) {
    console.log("Open this URL, approve AdSense readonly access, then rerun with --code=AUTH_CODE");
    console.log(authUrl(client));
    return;
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const refreshed = await refreshToken(client, token);
  const accounts = await adsenseGet(refreshed.access_token, "https://adsense.googleapis.com/v2/accounts");
  const account = accounts.accounts?.[0];

  if (!account) {
    throw new Error("No AdSense account returned for this OAuth user.");
  }

  const reportUrl = `https://adsense.googleapis.com/v2/${account.name}/reports:generate?${new URLSearchParams({
    dateRange: "LAST_30_DAYS",
    metrics: "PAGE_VIEWS",
    dimensions: "DATE",
  })}`;
  const report = await adsenseGet(refreshed.access_token, reportUrl);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "adsense-report.json"),
    JSON.stringify({ checkedAt: new Date().toISOString(), accounts, report }, null, 2),
  );
  console.log(`AdSense audit saved: ${path.join(OUTPUT_DIR, "adsense-report.json")}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
