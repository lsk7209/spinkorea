import type { VercelRequest, VercelResponse } from "./types";
import { createClient } from "@libsql/client";

/**
 * SPK2-13 hardening: this endpoint only shortens SpinFlow share links.
 * Anything that is not an https://spinkorea.kr page URL is rejected before
 * the database is touched, so /s/:id cannot become an open redirect.
 */
const CANONICAL_ORIGIN = "https://spinkorea.kr";
const MAX_URL_LENGTH = 4096;
const ALLOWED_QUERY_KEYS = new Set(["s"]);
const SAFE_PATH = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/;

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

function generateShortId(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export function isAllowedShareUrl(value: string): boolean {
  if (value.length > MAX_URL_LENGTH) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.origin !== CANONICAL_ORIGIN || url.username || url.password || url.port || url.hash) return false;
  if (!SAFE_PATH.test(url.pathname)) return false;
  return [...url.searchParams.keys()].every((key) => ALLOWED_QUERY_KEYS.has(key));
}

function readOriginalUrl(body: unknown): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const { originalUrl } = body as { originalUrl?: unknown };
  return typeof originalUrl === "string" && originalUrl.length > 0 ? originalUrl : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS is not an auth mechanism; it only stops other sites' browsers from reading responses.
  res.setHeader("Access-Control-Allow-Origin", CANONICAL_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const originalUrl = readOriginalUrl(req.body);
  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl is required" });
  }
  if (!isAllowedShareUrl(originalUrl)) {
    return res.status(400).json({ error: "Only SpinFlow share links can be shortened" });
  }

  if (!process.env.TURSO_DATABASE_URL) {
    return res.status(503).json({ error: "DB not configured" });
  }

  try {
    const db = getDb();
    const shortId = generateShortId();

    await db.execute({
      sql: "INSERT INTO shortened_urls (id, original_url, created_at) VALUES (?, ?, ?)",
      args: [shortId, originalUrl, Date.now()],
    });

    // Never build the public URL from the client-controlled Host header.
    return res.status(200).json({ shortId, shortUrl: `${CANONICAL_ORIGIN}/s/${shortId}` });
  } catch (error) {
    // Log only the error type; never the URL or request body.
    console.error("Shorten error:", error instanceof Error ? error.name : "unknown");
    return res.status(500).json({ error: "Internal server error" });
  }
}
