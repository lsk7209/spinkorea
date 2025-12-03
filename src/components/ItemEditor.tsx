/**
 * Component: ItemEditor
 * 항목 편집 컴포넌트 (데스크톱용)
 * @param {string[]} items - 현재 항목 배열 [Required]
 * @param {(items: string[]) => void} onUpdate - 항목 업데이트 핸들러 [Required]
 * @example <ItemEditor items={['항목1', '항목2']} onUpdate={(items) => setItems(items)} />
 */

import { useState, useCallback, useEffect } from 'react';
import { processAndValidateItems } from '@/utils/validation';

interface ItemEditorProps {
  items: string[];
  onUpdate: (items: string[]) => void;
}

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

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="item-editor" className="text-sm font-semibold text-neon-primary">
        항목 입력 (한 줄당 1개)
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
        "
        placeholder="항목1&#10;항목2&#10;항목3"
      />
      {errors.length > 0 && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          {errors.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">
        최대 100개, 항목당 최대 50자
      </p>
    </div>
  );
}

