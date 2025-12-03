/**
 * URL 기반 상태 관리 유틸리티
 * lz-string을 사용한 압축 인코딩/디코딩
 */

import * as LZString from 'lz-string';
import type { RouletteState } from '@/types';

/**
 * 상태를 URL 쿼리 파라미터로 인코딩
 * @param state - 룰렛 상태
 * @returns 인코딩된 문자열과 길이 정보
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
 * URL 쿼리 파라미터에서 상태 디코딩
 * @param encoded - 인코딩된 문자열
 * @returns 디코딩된 상태 또는 null
 */
export function decodeState(encoded: string): RouletteState | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) {
      return null;
    }
    const state = JSON.parse(decompressed) as RouletteState;
    
    // 버전 및 항목 검증
    if (typeof state.v !== 'number' || !Array.isArray(state.items)) {
      return null;
    }
    
    return state;
  } catch (error) {
    console.error('Failed to decode state:', error);
    return null;
  }
}

/**
 * 현재 URL에서 상태 읽기
 * @returns 디코딩된 상태 또는 null
 */
export function getStateFromUrl(): RouletteState | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('s');
  if (!encoded) {
    return null;
  }
  return decodeState(encoded);
}

/**
 * URL에 상태 업데이트
 * @param state - 룰렛 상태
 * @param replace - replaceState 사용 여부 (기본값: true)
 */
export function updateUrlWithState(state: RouletteState, replace = true): {
  url: string;
  length: number;
  warning: boolean;
  unsafe: boolean;
} {
  const { encoded, length } = encodeState(state);
  const url = new URL(window.location.href);
  url.searchParams.set('s', encoded);
  
  const warning = length > 1800;
  const unsafe = length > 2000;
  
  if (replace) {
    window.history.replaceState({}, '', url.toString());
  } else {
    window.history.pushState({}, '', url.toString());
  }
  
  return {
    url: url.toString(),
    length,
    warning,
    unsafe,
  };
}

