/**
 * URL 기반 상태 관리 유틸리티
 * lz-string을 사용한 압축 인코딩/디코딩
 */

import * as LZStringNamespace from 'lz-string';
import type { RouletteState } from '../types/index';
import { isRouletteState, SUPPORTED_STATE_VERSION } from './roulette-storage.ts';

// lz-string is CommonJS: Vite exposes named exports, plain Node ESM only `default`.
const LZString: typeof LZStringNamespace =
  (LZStringNamespace as unknown as { default?: typeof LZStringNamespace }).default ?? LZStringNamespace;

export const STATE_QUERY_KEY = 's';

/**
 * Upper bound for the compressed `s` payload. The measured worst-case valid
 * state (100 items × 50 non-repeating BMP characters) encodes to ~23.9k
 * characters, so 32k leaves headroom while stopping oversized input before
 * the decompressor runs. Measured in tests/roulette-state.test.mjs.
 */
export const MAX_ENCODED_STATE_LENGTH = 32_000;

/**
 * Upper bound for the decompressed JSON. Worst case is 100 items × 50 control
 * characters escaped as \uXXXX (6 chars each) plus quotes/commas ≈ 30.4k.
 */
export const MAX_DECODED_STATE_LENGTH = 32_000;

/** Existing app thresholds for the complete share URL (not a browser limit). */
export const URL_WARNING_LENGTH = 1800;
export const URL_UNSAFE_LENGTH = 2000;

export type UrlStateReadResult =
  | { status: 'none' }
  | { status: 'ok'; state: RouletteState }
  | { status: 'invalid' };

export interface ShareUrlInfo {
  url: string;
  length: number;
  warning: boolean;
  unsafe: boolean;
}

/**
 * 상태를 URL 쿼리 파라미터로 인코딩
 */
export function encodeState(state: RouletteState): {
  encoded: string;
  length: number;
} {
  const json = JSON.stringify(state);
  const encoded = LZString.compressToEncodedURIComponent(json);
  return {
    encoded: encoded || '',
    length: encoded?.length || 0,
  };
}

/**
 * URL 쿼리 파라미터에서 상태 디코딩. 크기·버전·항목 규칙을 모두 통과해야 한다.
 */
export function decodeState(encoded: string): RouletteState | null {
  if (!encoded || encoded.length > MAX_ENCODED_STATE_LENGTH) {
    return null;
  }
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed || decompressed.length > MAX_DECODED_STATE_LENGTH) {
      return null;
    }
    const state: unknown = JSON.parse(decompressed);
    return isRouletteState(state) ? state : null;
  } catch {
    return null;
  }
}

/**
 * search 문자열에서 공유 상태를 읽는다. `s`가 있는데 검증에 실패하면
 * 'invalid'를 돌려 호출자가 저장값으로 조용히 대체하지 않도록 한다.
 */
export function readStateFromSearch(search: string): UrlStateReadResult {
  const encoded = new URLSearchParams(search).get(STATE_QUERY_KEY);
  if (encoded === null) {
    return { status: 'none' };
  }
  const state = decodeState(encoded);
  return state ? { status: 'ok', state } : { status: 'invalid' };
}

/**
 * 현재 URL에서 상태 읽기
 */
export function getStateFromUrl(): RouletteState | null {
  const result = readStateFromSearch(window.location.search);
  return result.status === 'ok' ? result.state : null;
}

/**
 * Build the "open with the same candidates" link from the validated items,
 * independent of whatever query string or storage the sharer currently has.
 * Only the state parameter is kept (allowlist); hash and other query
 * parameters (campaign tags, stale state) are dropped.
 */
export function buildShareUrl(items: string[], baseHref: string): ShareUrlInfo {
  const base = new URL(baseHref);
  const url = new URL(base.pathname, base.origin);
  const { encoded } = encodeState({ v: SUPPORTED_STATE_VERSION, items });
  url.searchParams.set(STATE_QUERY_KEY, encoded);
  const href = url.toString();
  return {
    url: href,
    length: href.length,
    warning: href.length > URL_WARNING_LENGTH,
    unsafe: href.length > URL_UNSAFE_LENGTH,
  };
}

/**
 * URL에 상태 업데이트. 기존 history.state(React Router의 key/idx)는 보존한다.
 * @param replace - replaceState 사용 여부 (기본값: true)
 */
export function updateUrlWithState(state: RouletteState, replace = true): ShareUrlInfo {
  const current = new URL(window.location.href);
  const { encoded } = encodeState(state);
  current.searchParams.set(STATE_QUERY_KEY, encoded);
  const href = current.toString();

  if (replace) {
    window.history.replaceState(window.history.state, '', href);
  } else {
    window.history.pushState(window.history.state, '', href);
  }

  return buildShareUrl(state.items, href);
}
