/**
 * Cloudflare Workers 미들웨어
 * CORS 및 에러 핸들링
 */

export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  
  // CORS 헤더 추가
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
};

