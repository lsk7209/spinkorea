/**
 * Cloudflare Workers Function: URL 단축 API
 * POST /api/shorten
 */

// nanoid는 Workers에서 직접 사용 불가, 간단한 ID 생성 함수 사용
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 8; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (context) => {
  try {
    const { originalUrl } = await context.request.json<{ originalUrl: string }>();

    if (!originalUrl || typeof originalUrl !== 'string') {
      return new Response(
        JSON.stringify({ error: 'originalUrl is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 짧은 ID 생성
    const shortId = generateShortId();
    const createdAt = Date.now();

    // D1에 저장
    await context.env.DB.prepare(
      'INSERT INTO shortened_urls (id, original_url, created_at) VALUES (?, ?, ?)'
    )
      .bind(shortId, originalUrl, createdAt)
      .run();

    // 짧은 URL 생성
    const shortUrl = `${new URL(context.request.url).origin}/${shortId}`;

    return new Response(
      JSON.stringify({
        shortId,
        shortUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Shorten URL error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

