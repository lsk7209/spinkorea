import { useState, useCallback, useEffect } from 'react';
import { X, RotateCcw, Calculator, AlignJustify, CheckCircle2 } from 'lucide-react';
import { processAndValidateItems } from '@/utils/validation';

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onUpdate: (items: string[]) => void;
}

const PRESETS = [
  { label: '초기화', icon: <RotateCcw size={14} />, items: [] },
  { label: '숫자 1-10', icon: <Calculator size={14} />, items: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
  { label: 'OX 게임', icon: <CheckCircle2 size={14} />, items: ['O', 'X'] },
  { label: '가위바위보', icon: <AlignJustify size={14} />, items: ['가위', '바위', '보'] },
  { label: '메뉴 정하기', icon: <AlignJustify size={14} />, items: ['한식', '중식', '일식', '양식', '분식', '치킨', '피자'] },
  { label: '로또 (1-45)', icon: <Calculator size={14} />, items: Array.from({ length: 45 }, (_, i) => String(i + 1)) },
];

export default function ItemEditorModal({ isOpen, onClose, items, onUpdate }: ItemEditorModalProps) {
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
    if (result) setErrors(result.errors);
  }, []);

  const handlePreset = useCallback((presetItems: string[]) => {
    const newText = presetItems.join('\n');
    setText(newText);
    setErrors([]);
  }, []);

  const handleSave = useCallback(() => {
    const result = processAndValidateItems(text);
    if (result && result.errors.length === 0) {
      onUpdate(result.items);
      onClose();
    }
  }, [text, onUpdate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neon-bg flex flex-col" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neon-primary/30">
        <h2 id="modal-title" className="text-lg font-bold text-neon-primary">항목 수정하기</h2>
        <button type="button" onClick={onClose} className="p-2 text-neon-primary hover:bg-neon-primary/20 rounded-lg transition-colors" aria-label="닫기">
          <X size={24} />
        </button>
      </div>

      {/* 빠른 설정 프리셋 */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-semibold text-gray-400 mb-2">빠른 설정</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset.items)}
              className="flex items-center justify-center gap-1.5 px-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-primary/50 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
            >
              {preset.icon}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 텍스트 에어리어 */}
      <div className="flex-1 flex flex-col px-4 py-3">
        <textarea
          value={text}
          onChange={handleChange}
          className="flex-1 w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-primary focus:border-transparent resize-none"
          placeholder="항목1&#10;항목2&#10;항목3"
          autoFocus
        />
        {errors.length > 0 && (
          <div className="mt-2 text-sm text-neon-accent">
            {errors.map((error, idx) => <p key={idx}>{error}</p>)}
          </div>
        )}
        <p className="mt-2 text-xs text-neon-primary/60">최대 100개, 항목당 최대 50자</p>
      </div>

      {/* 푸터 */}
      <div className="px-4 py-3 border-t border-neon-primary/30">
        <button
          type="button"
          onClick={handleSave}
          disabled={errors.length > 0}
          className="w-full py-3 bg-neon-primary text-neon-bg font-bold rounded-lg hover:bg-neon-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
}
