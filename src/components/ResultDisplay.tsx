/**
 * Component: ResultDisplay
 * 룰렛 결과 표시 컴포넌트
 * @param {string | null} result - 결과 텍스트 [Optional]
 * @param {boolean} show - 표시 여부 [Optional, default=false]
 * @param {boolean} reducedMotion - 모션 감소 선호 시 confetti 생략 [Optional, default=false]
 * @example <ResultDisplay result="당첨 항목" show={true} />
 */

import { useEffect, useRef } from 'react';

interface ResultDisplayProps {
  result: string | null;
  show: boolean;
  reducedMotion?: boolean;
}

const CONFETTI_RESET_MS = 3000;
const LONG_RESULT_LENGTH = 12;

export default function ResultDisplay({ result, show, reducedMotion = false }: ResultDisplayProps) {
  const confettiTriggeredRef = useRef(false);

  useEffect(() => {
    if (!show || !result || reducedMotion || confettiTriggeredRef.current) {
      return;
    }
    confettiTriggeredRef.current = true;

    import('canvas-confetti')
      .then((module) => {
        module.default({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d9ff', '#ff006e', '#00ff88', '#ffaa00'],
          disableForReducedMotion: true,
        });
      })
      .catch(() => {
        // Decorative only; a failed chunk must not affect the result.
      });

    const timer = setTimeout(() => {
      confettiTriggeredRef.current = false;
    }, CONFETTI_RESET_MS);

    return () => clearTimeout(timer);
  }, [show, result, reducedMotion]);

  if (!show || !result) {
    return null;
  }

  const sizeClass = result.length > LONG_RESULT_LENGTH ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl';

  return (
    <div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-2rem)] text-center pointer-events-none"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="glass rounded-2xl px-6 md:px-10 py-6 shadow-neon-lg border-2 border-neon-primary/50">
        <p className={`${sizeClass} font-extrabold text-gradient break-words [word-break:keep-all] [overflow-wrap:anywhere]`}>
          {result}
        </p>
      </div>
    </div>
  );
}
