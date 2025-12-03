/**
 * SpinFlow v1.1 타입 정의
 */

export interface RouletteState {
  v: number;
  items: string[];
}

export interface LastResult {
  value: string;
  time: string;
}

export interface ShortenUrlResponse {
  shortId: string;
  shortUrl: string;
}

export interface SpinStats {
  itemsCount: number;
  result: string;
  timestamp: number;
}

