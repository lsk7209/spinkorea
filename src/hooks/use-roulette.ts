/**
 * 룰렛 로직 및 애니메이션 상태 관리 훅
 */

import { useState, useCallback, useRef } from 'react';
import { getRandomIndex } from '@/utils/random';

interface UseRouletteOptions {
  items: string[];
  onResult?: (result: string) => void;
}

/**
 * 룰렛 훅
 * @param options - 룰렛 옵션
 * @returns 룰렛 상태 및 제어 함수
 */
export function useRoulette({ items, onResult }: UseRouletteOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) {
      return;
    }

    // 랜덤 인덱스 미리 선택 (스핀 시작 전)
    const selectedIndex = getRandomIndex(items.length);
    const selectedItem = items[selectedIndex];

    setIsSpinning(true);
    setResult(null);
    setWinningIndex(selectedIndex); // 당첨 인덱스를 미리 설정하여 회전 목표 설정

    // 최소 3초, 최대 7초 회전 (물리 기반 감속은 컴포넌트에서 처리)
    const spinDuration = 3000 + Math.random() * 4000; // 3-7초

    // 스핀 종료 후 결과 표시
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    spinTimeoutRef.current = window.setTimeout(() => {
      setResult(selectedItem);
      setIsSpinning(false);
      
      if (onResult) {
        onResult(selectedItem);
      }
    }, spinDuration);
  }, [items, isSpinning, onResult]);

  const reset = useCallback(() => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    setIsSpinning(false);
    setResult(null);
    setWinningIndex(null);
  }, []);

  return {
    isSpinning,
    result,
    winningIndex,
    spin,
    reset,
  };
}

