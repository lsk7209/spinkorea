/**
 * Component: ResultDisplay
 * 룰렛 결과 표시 컴포넌트
 * @param {string | null} result - 결과 텍스트 [Optional]
 * @param {boolean} show - 표시 여부 [Optional, default=false]
 * @example <ResultDisplay result="당첨 항목" show={true} />
 */

import { useEffect, useRef } from 'react';
// import confetti from 'canvas-confetti'; // Dynamic import used instead

interface ResultDisplayProps {
  result: string | null;
  show: boolean;
}

export default function ResultDisplay({ result, show }: ResultDisplayProps) {
  const confettiTriggeredRef = useRef(false);

  useEffect(() => {
    if (show && result && !confettiTriggeredRef.current) {
      confettiTriggeredRef.current = true;
      
      // Dynamic import for confetti
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d9ff', '#ff006e', '#00ff88', '#ffaa00'],
        });
      });

      // 3초 후 리셋
      const timer = setTimeout(() => {
        confettiTriggeredRef.current = false;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, result]);

  if (!show || !result) {
    return null;
  }

  return (
    <div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-40 text-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="glass rounded-2xl px-10 py-6 shadow-neon-lg border-2 border-neon-primary/50">
        <p className="text-4xl md:text-5xl font-extrabold text-gradient">
          {result}
        </p>
      </div>
    </div>
  );
}

