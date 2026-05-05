import type { VercelRequest, VercelResponse } from "./types";
import { createClient } from "@libsql/client";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.TURSO_DATABASE_URL) {
    return res.status(503).json({ error: "DB not configured" });
  }

  const { originalUrl } = req.body as { originalUrl?: string };

  if (!originalUrl || typeof originalUrl !== "string") {
    return res.status(400).json({ error: "originalUrl is required" });
  }

  if (originalUrl.length > 4096) {
    return res.status(400).json({ error: "URL too long" });
  }

  try {
    new URL(originalUrl);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const db = getDb();
    const shortId = generateShortId();

    await db.execute({
      sql: "INSERT INTO shortened_urls (id, original_url, created_at) VALUES (?, ?, ?)",
      args: [shortId, originalUrl, Date.now()],
    });

    const host = req.headers.host;
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const shortUrl = `${protocol}://${host}/s/${shortId}`;

    return res.status(200).json({ shortId, shortUrl });
  } catch (error) {
    console.error("Shorten error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
