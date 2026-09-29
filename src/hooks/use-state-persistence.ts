/**
 * URL 및 localStorage 기반 상태 지속성 훅
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RouletteState, LastResult } from '@/types';
import { buildShareUrl, readStateFromSearch, updateUrlWithState } from '@/utils/url-state';
import { isRouletteState, readStoredJson, parseStoredHistory, parseStoredResult, SUPPORTED_STATE_VERSION } from '@/utils/roulette-storage';

const LAST_STATE_KEY = 'spinflow:lastState';
const LAST_RESULT_KEY = 'spinflow:lastResult';
const HISTORY_KEY = 'spinflow:history';
const HISTORY_MAX = 10;

interface StatePersistenceOptions {
  /**
   * 초기 렌더링 시 URL 파라미터가 없을 때 localStorage 저장값보다
   * 전달된 initialItems를 우선 적용할지 여부.
   * 프리셋/랜딩 페이지에서 저장된 상태가 아닌 템플릿을 강제 적용할 때 사용.
   */
  preferInitialOnFirstLoad?: boolean;
}

export type RestoreNotice = 'invalid-share-link' | null;

/**
 * 상태 지속성 훅
 * @param initialItems - 초기 항목 배열
 * @returns 상태 및 상태 업데이트 함수
 */
export function useStatePersistence(initialItems: string[] = [], options: StatePersistenceOptions = {}) {
  const { preferInitialOnFirstLoad = false } = options;
  const [items, setItems] = useState<string[]>(initialItems);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [restoreNotice, setRestoreNotice] = useState<RestoreNotice>(null);

  // 초기 로드: 유효한 공유 URL 우선. 공유 URL이 거부되면 저장값으로 조용히 대체하지 않는다.
  useEffect(() => {
    const urlState = readStateFromSearch(window.location.search);
    if (urlState.status === 'ok') {
      setItems(urlState.state.items);
    } else if (urlState.status === 'invalid') {
      setRestoreNotice('invalid-share-link');
    } else if (!preferInitialOnFirstLoad) {
      const state = readStoredJson(() => localStorage.getItem(LAST_STATE_KEY));
      if (isRouletteState(state)) {
        setItems(state.items);
      }
    }

    // 히스토리 로드
    setHistory(parseStoredHistory(readStoredJson(() => localStorage.getItem(HISTORY_KEY))));

    // 최근 결과 로드
    const savedResult = readStoredJson(() => localStorage.getItem(LAST_RESULT_KEY));
    const restoredResult = parseStoredResult(savedResult);
    setLastResult(restoredResult);
    if (savedResult !== null && !restoredResult) {
      try { localStorage.removeItem(LAST_RESULT_KEY); } catch { /* Storage is optional. */ }
    }
    // Initial restore intentionally runs once per mount.
  }, []);

  // 공유 링크는 항상 현재 검증된 후보로 만든다 (완성 URL 길이 기준 경고).
  const shareInfo = useMemo(
    () => (typeof window === 'undefined' ? null : buildShareUrl(items, window.location.href)),
    [items],
  );

  // 항목 업데이트 및 상태 저장
  const updateItems = useCallback((newItems: string[]) => {
    setItems(newItems);
    setRestoreNotice(null);

    const state: RouletteState = {
      v: SUPPORTED_STATE_VERSION,
      items: newItems,
    };

    updateUrlWithState(state);

    try {
      localStorage.setItem(LAST_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, []);

  // 결과 저장
  const saveResult = useCallback((result: string) => {
    const lastResultData: LastResult = {
      value: result,
      time: new Date().toISOString(),
    };

    setLastResult(lastResultData);

    try {
      localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(lastResultData));
    } catch (error) {
      console.error('Failed to save result to localStorage:', error);
    }

    // 히스토리 업데이트 (최신이 앞, max 10)
    setHistory((prev) => {
      const next = [result, ...prev].slice(0, HISTORY_MAX);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return {
    items,
    updateItems,
    saveResult,
    lastResult,
    history,
    shareUrl: shareInfo?.url ?? null,
    urlWarning: shareInfo?.warning ?? false,
    urlUnsafe: shareInfo?.unsafe ?? false,
    restoreNotice,
    dismissRestoreNotice: () => setRestoreNotice(null),
  };
}
