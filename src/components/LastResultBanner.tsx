/**
 * Component: LastResultBanner
 * 최근 결과 배너 컴포넌트
 * @param {string} value - 결과 값 [Required]
 * @param {string} time - ISO 시간 문자열 [Required]
 * @example <LastResultBanner value="당첨 항목" time="2024-01-01T00:00:00Z" />
 */

import { useMemo } from 'react';
import type { LastResult } from '@/types';

interface LastResultBannerProps {
  result: LastResult;
}

export default function LastResultBanner({ result }: LastResultBannerProps) {
  const timeAgo = useMemo(() => {
    const resultTime = new Date(result.time).getTime();
    const now = Date.now();
    const minutesAgo = Math.floor((now - resultTime) / (1000 * 60));
    
    if (minutesAgo < 1) {
      return '방금 전';
    } else if (minutesAgo < 60) {
      return `${minutesAgo}분 전`;
    } else {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo}시간 전`;
    }
  }, [result.time]);

  return (
    <div className="w-full px-4 py-3 bg-gradient-neon border-b border-neon-border/50 mt-3">
      <p className="text-sm text-gray-300 text-center">
        최근 결과: <span className="font-bold text-neon-primary">{result.value}</span> <span className="text-gray-400">({timeAgo})</span>
      </p>
    </div>
  );
}

