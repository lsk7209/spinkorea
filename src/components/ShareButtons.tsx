/**
 * Component: ShareButtons
 * 공유 버튼 컴포넌트
 * - "후보 링크 복사": 현재 검증된 후보로 새로 만든 링크 (결과는 포함하지 않음)
 * - "결과 텍스트 복사": 결과와 후보 요약 텍스트. 링크가 너무 길면 링크 없이 복사
 * @param {string[]} items - 항목 배열 [Required]
 * @param {string | null} result - 결과 텍스트 [Optional]
 * @param {boolean} urlUnsafe - URL이 공유 비권장인지 여부 [Optional, default=false]
 * @example <ShareButtons items={['항목1', '항목2']} result="당첨" urlUnsafe={false} />
 */

import { useCallback } from 'react';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { buildShareUrl } from '@/utils/url-state';
import { buildResultShareText, copyText } from '@/utils/share';
import { trackEvent } from '@/utils/analytics';

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
    const share = buildShareUrl(items, window.location.href);
    if (share.unsafe) {
      toast.error('후보가 많아 링크가 너무 깁니다. 결과 텍스트 복사를 이용하세요.');
      return;
    }
    trackEvent('share_clicked', { tool_id: 'roulette', share_type: 'candidate_link' });
    if (await copyText(share.url)) {
      trackEvent('share_completed', { tool_id: 'roulette', share_type: 'candidate_link' });
      toast.success('같은 후보로 열리는 링크를 복사했습니다.');
    } else {
      toast.error('복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.');
    }
  }, [items]);

  const copyResultText = useCallback(async () => {
    if (!result) return;
    const share = buildShareUrl(items, window.location.href);
    const text = buildResultShareText(items, result, share.unsafe ? null : share.url);
    trackEvent('share_clicked', { tool_id: 'roulette', share_type: 'result_text' });
    if (await copyText(text)) {
      trackEvent('share_completed', { tool_id: 'roulette', share_type: 'result_text' });
      toast.success(share.unsafe ? '결과 텍스트를 복사했습니다. (링크가 길어 제외됨)' : '결과 텍스트를 복사했습니다.');
    } else {
      toast.error('복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.');
    }
  }, [items, result]);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={copyLink}
        disabled={urlUnsafe}
        className="btn-secondary w-full justify-center"
      >
        <LinkIcon size={18} aria-hidden="true" />
        후보 링크 복사
      </button>

      <button
        type="button"
        onClick={copyResultText}
        disabled={!result}
        className="
          flex items-center justify-center gap-2
          w-full px-6 py-3
          bg-gradient-accent text-white font-semibold rounded-xl
          shadow-neon-accent-md hover:shadow-neon-accent-lg
          transition-all duration-300
          hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        "
      >
        <Copy size={18} aria-hidden="true" />
        결과 텍스트 복사
      </button>
      <p className="text-xs text-slate-400">
        링크에는 후보 목록만 담기며 결과는 포함되지 않습니다. 링크의 후보는 받는 사람이 볼 수 있습니다.
      </p>
    </div>
  );
}
