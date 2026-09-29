/**
 * 룰렛 로직 및 애니메이션 상태 관리 훅
 * 타이밍·중복 실행·취소 규칙은 draw-controller에서 관리한다.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { getRandomIndex } from "@/utils/random";
import { createDrawController, SPIN_DURATION_MS, type DrawController, type DrawSnapshot } from "@/utils/draw-controller";

interface UseRouletteOptions {
  items: string[];
  onResult?: (result: string, draw: DrawSnapshot) => void;
  spinDurationMs?: number;
}

/**
 * 룰렛 훅
 * @param options - 룰렛 옵션
 * @returns 룰렛 상태 및 제어 함수
 */
export function useRoulette({ items, onResult, spinDurationMs = SPIN_DURATION_MS }: UseRouletteOptions) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const controllerRef = useRef<DrawController | null>(null);
  const onResultRef = useRef(onResult);

  if (controllerRef.current === null) {
    controllerRef.current = createDrawController({ pickIndex: getRandomIndex });
  }

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  // 페이지 이동(unmount) 시 진행 중인 추첨을 무효화해 늦은 저장·이벤트를 막는다.
  useEffect(() => () => controllerRef.current?.cancel(), []);

  const spin = useCallback((): DrawSnapshot | null => {
    const draw = controllerRef.current?.start(items, (completed) => {
      setResult(completed.result);
      setIsSpinning(false);
      onResultRef.current?.(completed.result, completed);
    }, spinDurationMs) ?? null;

    if (!draw) {
      return null;
    }

    setIsSpinning(true);
    setResult(null);
    setWinningIndex(draw.index); // 회전 목표 설정
    return draw;
  }, [items, spinDurationMs]);

  const reset = useCallback(() => {
    controllerRef.current?.cancel();
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
