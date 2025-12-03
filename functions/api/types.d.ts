/**
 * Cloudflare Workers 타입 정의
 */

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  success: boolean;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
  };
  results?: T[];
}

interface PagesFunction<Env = unknown> {
  (context: {
    request: Request;
    env: Env;
    waitUntil: (promise: Promise<unknown>) => void;
    next: () => Promise<Response>;
    params: Record<string, string>;
    data: unknown;
  }): Response | Promise<Response>;
}

