export interface VercelRequest {
  method?: string;
  body?: unknown;
  query: Record<string, string | string[] | undefined>;
}

export interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
  end(): void;
  redirect(statusOrUrl: number | string, url?: string): VercelResponse;
}
