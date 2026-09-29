import type { VercelRequest, VercelResponse } from "../types";
import { createClient } from "@libsql/client";

const CANONICAL_ORIGIN = "https://spinkorea.kr";
const SAFE_PATH = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/;

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

/**
 * SPK2-13: re-validate at redirect time so rows stored before the shorten
 * allowlist existed cannot redirect off-site.
 */
export function isSafeRedirectTarget(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.origin === CANONICAL_ORIGIN && !url.username && !url.password && !url.port && SAFE_PATH.test(url.pathname);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string };

  if (!id || typeof id !== "string" || !/^[a-zA-Z0-9]{8}$/.test(id)) {
    return res.status(404).json({ error: "Not found" });
  }

  if (!process.env.TURSO_DATABASE_URL) {
    return res.status(404).json({ error: "Not found" });
  }

  try {
    const db = getDb();
    const result = await db.execute({
      sql: "SELECT original_url FROM shortened_urls WHERE id = ?",
      args: [id],
    });

    const target = result.rows[0]?.original_url;
    if (!isSafeRedirectTarget(target)) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.redirect(302, target);
  } catch (error) {
    console.error("Redirect error:", error instanceof Error ? error.name : "unknown");
    return res.status(500).json({ error: "Internal server error" });
  }
}
