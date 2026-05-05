import type { VercelRequest, VercelResponse } from "../types";
import { createClient } from "@libsql/client";

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
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

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.redirect(301, result.rows[0].original_url as string);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
