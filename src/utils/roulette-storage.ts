import type { RouletteState, LastResult } from '../types/index';

export function isRouletteState(value: unknown): value is RouletteState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<RouletteState>;
  return typeof state.v === 'number' && Number.isFinite(state.v)
    && Array.isArray(state.items) && state.items.every(item => typeof item === 'string');
}

// Access itself can throw when the browser denies storage, not only JSON.parse.
export function readStoredJson(read: () => string | null): unknown {
  try {
    const raw = read();
    return raw === null ? null : JSON.parse(raw);
  } catch { return null; }
}

export function parseStoredHistory(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(item => typeof item === 'string').slice(0, 10) : [];
}

export function parseStoredResult(value: unknown, now = Date.now()): LastResult | null {
  if (!value || typeof value !== 'object') return null;
  const result = value as Partial<LastResult>;
  if (typeof result.value !== 'string' || typeof result.time !== 'string') return null;
  const age = now - Date.parse(result.time);
  return Number.isFinite(age) && age >= 0 && age < 5 * 60_000
    ? { value: result.value, time: result.time } : null;
}
