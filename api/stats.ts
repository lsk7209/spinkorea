import type { VercelRequest, VercelResponse } from "./types";
import { createClient } from "@libsql/client";

function getDb() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.TURSO_DATABASE_URL) {
    return res.status(200).json({ success: true }); // DB 없으면 무시
  }

  const { itemsCount, result } = req.body as {
    itemsCount?: number;
    result?: string;
  };

  if (
    typeof itemsCount !== "number" ||
    typeof result !== "string" ||
    itemsCount <= 0
  ) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const db = getDb();
    await db.execute({
      sql: "INSERT INTO spin_stats (items_count, result, created_at) VALUES (?, ?, ?)",
      args: [itemsCount, result, Date.now()],
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
