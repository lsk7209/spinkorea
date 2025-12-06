/**
 * URL 및 localStorage 기반 상태 지속성 훅
 */

import { useState, useEffect, useCallback } from 'react';
import type { RouletteState, LastResult } from '@/types';
import { getStateFromUrl, updateUrlWithState } from '@/utils/url-state';

const LAST_STATE_KEY = 'spinflow:lastState';
const LAST_RESULT_KEY = 'spinflow:lastResult';
const RESULT_EXPIRY_MINUTES = 5;

interface StatePersistenceOptions {
  /**
   * 초기 렌더링 시 URL 파라미터가 없을 때 localStorage 저장값보다
   * 전달된 initialItems를 우선 적용할지 여부.
   * 프리셋/랜딩 페이지에서 저장된 상태가 아닌 템플릿을 강제 적용할 때 사용.
   */
  preferInitialOnFirstLoad?: boolean;
}

/**
 * 상태 지속성 훅
 * @param initialItems - 초기 항목 배열
 * @returns 상태 및 상태 업데이트 함수
 */
export function useStatePersistence(initialItems: string[] = [], options: StatePersistenceOptions = {}) {
  const { preferInitialOnFirstLoad = false } = options;
  const [items, setItems] = useState<string[]>(initialItems);
  const [urlWarning, setUrlWarning] = useState(false);
  const [urlUnsafe, setUrlUnsafe] = useState(false);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);

  // 초기 로드: URL 우선, 없으면 localStorage
  useEffect(() => {
    const urlState = getStateFromUrl();
    if (urlState && urlState.items.length > 0) {
      setItems(urlState.items);
    } else if (!preferInitialOnFirstLoad) {
      const savedState = localStorage.getItem(LAST_STATE_KEY);
      if (savedState) {
        try {
          const state = JSON.parse(savedState) as RouletteState;
          if (state.items && state.items.length > 0) {
            setItems(state.items);
          }
        } catch (error) {
          console.error('Failed to load saved state:', error);
        }
      }
    }

    // 최근 결과 로드
    const savedResult = localStorage.getItem(LAST_RESULT_KEY);
    if (savedResult) {
      try {
        const result = JSON.parse(savedResult) as LastResult;
        const resultTime = new Date(result.time).getTime();
        const now = Date.now();
        const minutesAgo = Math.floor((now - resultTime) / (1000 * 60));
        
        if (minutesAgo < RESULT_EXPIRY_MINUTES) {
          setLastResult(result);
        } else {
          localStorage.removeItem(LAST_RESULT_KEY);
        }
      } catch (error) {
        console.error('Failed to load last result:', error);
      }
    }
  }, []);

  // 항목 업데이트 및 상태 저장
  const updateItems = useCallback((newItems: string[]) => {
    setItems(newItems);
    
    const state: RouletteState = {
      v: 1,
      items: newItems,
    };

    // URL 업데이트
    const urlInfo = updateUrlWithState(state);
    setUrlWarning(urlInfo.warning);
    setUrlUnsafe(urlInfo.unsafe);

    // localStorage 저장
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
  }, []);

  return {
    items,
    updateItems,
    saveResult,
    lastResult,
    urlWarning,
    urlUnsafe,
  };
}

