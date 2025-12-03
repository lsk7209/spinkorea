/**
 * Component: SpinButton
 * 룰렛 스핀 버튼 (FAB 스타일)
 * @param {() => void} onClick - 클릭 핸들러 [Required]
 * @param {boolean} disabled - 비활성화 여부 [Optional, default=false]
 * @param {boolean} isSpinning - 회전 중 여부 [Optional, default=false]
 * @example <SpinButton onClick={handleSpin} disabled={false} isSpinning={false} />
 */

import { memo } from 'react';

interface SpinButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
}

function SpinButton({ onClick, disabled = false, isSpinning = false }: SpinButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !isSpinning) {
        onClick();
      }
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isSpinning}
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        w-28 h-28 rounded-full
        bg-gradient-primary text-neon-dark
        font-extrabold text-xl
        shadow-neon-lg
        transition-all duration-300
        hover:scale-110 hover:shadow-neon-lg
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-neon-primary/50 focus:ring-offset-4 focus:ring-offset-neon-bg
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${isSpinning ? 'animate-pulse-glow' : ''}
      `}
      aria-label={isSpinning ? '회전 중...' : '룰렛 돌리기'}
      aria-busy={isSpinning}
    >
      {isSpinning ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin">⚡</span>
        </span>
      ) : (
        'SPIN'
      )}
    </button>
  );
}

export default memo(SpinButton);

