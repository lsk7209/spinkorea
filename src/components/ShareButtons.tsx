/**
 * Component: ShareButtons
 * 공유 버튼 컴포넌트
 * @param {string[]} items - 항목 배열 [Required]
 * @param {string | null} result - 결과 텍스트 [Optional]
 * @param {boolean} urlUnsafe - URL이 공유 비권장인지 여부 [Optional, default=false]
 * @example <ShareButtons items={['항목1', '항목2']} result="당첨" urlUnsafe={false} />
 */

import { useCallback } from 'react';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  items: string[];
  result: string | null;
  urlUnsafe: boolean;
}

export default function ShareButtons({
  items,
  result,
  urlUnsafe,
}: ShareButtonsProps) {
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('복사 실패');
    }
  }, []);

  const copyTextAndLink = useCallback(async () => {
    const itemsPreview = items.slice(0, 3).join(', ');
    const itemsText = items.length > 3 ? `${itemsPreview}...` : itemsPreview;
    const resultText = result ? ` 결과: ${result}` : '';
    const text = `[SpinFlow] 오늘의 룰렛: ${itemsText}${resultText} 결과 확인: ${window.location.href}`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success('텍스트와 링크가 복사되었습니다!');
    } catch (error) {
      console.error('Failed to copy text and link:', error);
      toast.error('복사 실패');
    }
  }, [items, result]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={copyLink}
        disabled={urlUnsafe}
        className="btn-secondary w-full justify-center"
        aria-label="링크 복사"
      >
        <LinkIcon size={18} />
        링크 복사
      </button>

      <button
        type="button"
        onClick={copyTextAndLink}
        disabled={urlUnsafe}
        className="
          flex items-center justify-center gap-2
          w-full px-6 py-3
          bg-gradient-accent text-white font-semibold rounded-xl
          shadow-neon-accent-md hover:shadow-neon-accent-lg
          transition-all duration-300
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        "
        aria-label="텍스트와 링크 복사"
      >
        <Copy size={18} />
        텍스트+링크 복사
      </button>
    </div>
  );
}

