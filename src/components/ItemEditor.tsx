/**
 * Component: ItemEditor
 * 항목 편집 컴포넌트 (데스크톱용)
 * @param {string[]} items - 현재 항목 배열 [Required]
 * @param {(items: string[]) => void} onUpdate - 항목 업데이트 핸들러 [Required]
 * @example <ItemEditor items={['항목1', '항목2']} onUpdate={(items) => setItems(items)} />
 */

import { useState, useCallback, useEffect } from 'react';
import { processAndValidateItems } from '@/utils/validation';
import { RotateCcw, Calculator, AlignJustify, CheckCircle2 } from 'lucide-react';

interface ItemEditorProps {
  items: string[];
  onUpdate: (items: string[]) => void;
}

const PRESETS = [
  { label: '초기화', icon: <RotateCcw size={16} />, items: [] },
  { label: '숫자 1-10', icon: <Calculator size={16} />, items: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
  { label: '로또 (1-45)', icon: <Calculator size={16} />, items: Array.from({ length: 45 }, (_, i) => String(i + 1)) },
  { label: 'OX 게임', icon: <CheckCircle2 size={16} />, items: ['O', 'X'] },
  { label: '가위바위보', icon: <AlignJustify size={16} />, items: ['가위', '바위', '보'] },
  { label: '메뉴 정하기', icon: <AlignJustify size={16} />, items: ['한식', '중식', '일식', '양식', '분식', '치킨', '피자'] },
];

export default function ItemEditor({ items, onUpdate }: ItemEditorProps) {
  const [text, setText] = useState(items.join('\n'));
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setText(items.join('\n'));
  }, [items]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    const result = processAndValidateItems(newText);
    if (result) {
      setErrors(result.errors);
      if (result.errors.length === 0) {
        onUpdate(result.items);
      }
    }
  }, [onUpdate]);

  const handlePreset = (presetItems: string[]) => {
    const newText = presetItems.join('\n');
    setText(newText);
    onUpdate(presetItems);
    setErrors([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Presets */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neon-primary flex items-center gap-2">
          <span>빠른 설정</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.items)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-primary/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all"
              type="button"
            >
              {preset.icon}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="item-editor" className="text-sm font-semibold text-neon-primary">
          직접 입력
        </label>
        <textarea
          id="item-editor"
          value={text}
          onChange={handleChange}
          rows={10}
          className="
            w-full px-4 py-3
            bg-neon-dark/50 border border-neon-border rounded-xl
            text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-neon-primary/50 focus:border-neon-primary
            resize-y
            transition-all duration-200
            text-sm leading-relaxed
            "
          placeholder="항목1&#10;항목2&#10;항목3"
        />
        {errors.length > 0 && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-pulse">
            {errors.map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 text-right">
          최대 100개, 항목당 50자
        </p>
      </div>
    </div>
  );
}
