/**
 * Cloudflare Workers Function: 통계 수집 API (선택적)
 * POST /api/stats
 */

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { itemsCount, result } = await context.request.json<{
      itemsCount: number;
      result: string;
    }>();

    if (
      typeof itemsCount !== 'number' ||
      typeof result !== 'string' ||
      itemsCount <= 0
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid request data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const createdAt = Date.now();

    // D1에 저장
    await context.env.DB.prepare(
      'INSERT INTO spin_stats (items_count, result, created_at) VALUES (?, ?, ?)'
    )
      .bind(itemsCount, result, createdAt)
      .run();

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Stats collection error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

