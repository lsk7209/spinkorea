import type { RouletteState, LastResult } from '../types/index';
import { MAX_ITEMS, MAX_ITEM_LENGTH } from './validation.ts';

/** Only this state schema is restored. Other versions are rejected, not guessed. */
export const SUPPORTED_STATE_VERSION = 1;

/**
 * Restore validator shared by URL (`?s=`) and localStorage entry points.
 * It applies exactly the same limits as the editor (1–100 items, 1–50 UTF-16
 * units after trimming) so a restored list can never contain values the
 * editor would refuse. Invalid input is rejected as a whole; it is never
 * truncated, because truncation would silently change the odds.
 */
export function isRouletteState(value: unknown): value is RouletteState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<RouletteState>;
  if (state.v !== SUPPORTED_STATE_VERSION) return false;
  if (!Array.isArray(state.items)) return false;
  if (state.items.length === 0 || state.items.length > MAX_ITEMS) return false;
  return state.items.every(isValidItem);
}

function isValidItem(item: unknown): boolean {
  if (typeof item !== 'string') return false;
  const trimmed = item.trim();
  return trimmed.length > 0 && trimmed === item && item.length <= MAX_ITEM_LENGTH;
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
