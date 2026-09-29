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

const SHORT_ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHORT_ID_LENGTH = 8;
/** Largest multiple of the alphabet size below 256; bytes at or above it are rejected to avoid modulo bias. */
const UNBIASED_BYTE_LIMIT = 256 - (256 % SHORT_ID_ALPHABET.length);
const MAX_INSERT_ATTEMPTS = 3;

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

/** Uniformly random 8-char id via rejection sampling over crypto bytes. */
export function generateShortId(): string {
  let id = "";
  const bytes = new Uint8Array(SHORT_ID_LENGTH * 2);
  while (id.length < SHORT_ID_LENGTH) {
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte >= UNBIASED_BYTE_LIMIT) continue;
      id += SHORT_ID_ALPHABET[byte % SHORT_ID_ALPHABET.length];
      if (id.length === SHORT_ID_LENGTH) break;
    }
  }
  return id;
}

/** libsql reports primary-key collisions as SQLITE_CONSTRAINT* codes. */
function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: unknown }).code;
  if (typeof code === "string" && code.startsWith("SQLITE_CONSTRAINT")) return true;
  return /UNIQUE constraint failed/i.test(error.message);
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
    for (let attempt = 1; attempt <= MAX_INSERT_ATTEMPTS; attempt++) {
      const shortId = generateShortId();
      try {
        await db.execute({
          sql: "INSERT INTO shortened_urls (id, original_url, created_at) VALUES (?, ?, ?)",
          args: [shortId, originalUrl, Date.now()],
        });
        // Never build the public URL from the client-controlled Host header.
        return res.status(200).json({ shortId, shortUrl: `${CANONICAL_ORIGIN}/s/${shortId}` });
      } catch (error) {
        // Retry only id collisions; any other DB failure goes to the outer handler.
        if (!isUniqueViolation(error) || attempt === MAX_INSERT_ATTEMPTS) throw error;
      }
    }
    throw new Error("unreachable");
  } catch (error) {
    // Log only the error type; never the URL or request body.
    console.error("Shorten error:", error instanceof Error ? error.name : "unknown");
    return res.status(500).json({ error: "Internal server error" });
  }
}
