import type { VercelRequest, VercelResponse } from "./types";
import { createClient } from "@libsql/client";

/**
 * SPK2-13/14 hardening: only an anonymous candidate count is kept.
 * The raw result text is validated for shape but never persisted
 * (the NOT NULL column receives an empty string), so no user input is stored.
 */
const MAX_ITEMS = 100;
const MAX_RESULT_LENGTH = 50;
const REDACTED_RESULT = "";

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

function readItemsCount(body: unknown): number | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const { itemsCount, result } = body as { itemsCount?: unknown; result?: unknown };
  if (typeof itemsCount !== "number" || !Number.isInteger(itemsCount)) return null;
  if (itemsCount < 1 || itemsCount > MAX_ITEMS) return null;
  if (typeof result !== "string" || result.length === 0 || result.length > MAX_RESULT_LENGTH) return null;
  return itemsCount;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const itemsCount = readItemsCount(req.body);
  if (itemsCount === null) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  if (!process.env.TURSO_DATABASE_URL) {
    // Distinguish "not stored" from success.
    return res.status(503).json({ stored: false });
  }

  try {
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO spin_stats (items_count, result, created_at) VALUES (?, ?, ?)",
      args: [itemsCount, REDACTED_RESULT, Date.now()],
    });
    return res.status(200).json({ stored: true });
  } catch (error) {
    console.error("Stats error:", error instanceof Error ? error.name : "unknown");
    return res.status(500).json({ error: "Internal server error" });
  }
}
