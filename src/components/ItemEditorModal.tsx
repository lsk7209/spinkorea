/**
 * Component: ItemEditorModal
 * 항목 편집 모달 (모바일용 전체화면)
 * @param {boolean} isOpen - 모달 열림 여부 [Required]
 * @param {() => void} onClose - 닫기 핸들러 [Required]
 * @param {string[]} items - 현재 항목 배열 [Required]
 * @param {(items: string[]) => void} onUpdate - 항목 업데이트 핸들러 [Required]
 * @example <ItemEditorModal isOpen={true} onClose={() => {}} items={['항목1']} onUpdate={(items) => {}} />
 */

import { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { processAndValidateItems } from '@/utils/validation';

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onUpdate: (items: string[]) => void;
}

export default function ItemEditorModal({
  isOpen,
  onClose,
  items,
  onUpdate,
}: ItemEditorModalProps) {
  const [text, setText] = useState(items.join('\n'));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setText(items.join('\n'));
      setErrors([]);
    }
  }, [isOpen, items]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const result = processAndValidateItems(e.target.value);
    if (result) {
      setErrors(result.errors);
    }
  }, []);

  const handleSave = useCallback(() => {
    const result = processAndValidateItems(text);
    if (result && result.errors.length === 0) {
      onUpdate(result.items);
      onClose();
    }
  }, [text, onUpdate, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-neon-bg flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neon-primary/30">
        <h2 id="modal-title" className="text-lg font-bold text-neon-primary">
          항목 수정하기
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-neon-primary hover:bg-neon-primary/20 rounded-lg transition-colors"
          aria-label="닫기"
        >
          <X size={24} />
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex flex-col px-4 py-4">
        <textarea
          value={text}
          onChange={handleChange}
          rows={15}
          className="
            flex-1 w-full px-4 py-2
            bg-white border border-gray-200 rounded-lg
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-aurora-primary focus:border-transparent
            resize-none
          "
          placeholder="항목1&#10;항목2&#10;항목3"
          autoFocus
        />
        {errors.length > 0 && (
          <div className="mt-2 text-sm text-neon-accent">
            {errors.map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-neon-primary/60">
          최대 100개, 항목당 최대 50자
        </p>
      </div>

      {/* 푸터 */}
      <div className="px-4 py-3 border-t border-neon-primary/30">
        <button
          type="button"
          onClick={handleSave}
          disabled={errors.length > 0}
          className="
            w-full py-3
            bg-neon-primary text-neon-bg
            font-bold rounded-lg
            hover:bg-neon-primary/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        >
          완료
        </button>
      </div>
    </div>
  );
}

