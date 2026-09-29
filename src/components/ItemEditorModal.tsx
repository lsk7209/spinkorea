import { useState, useCallback, useEffect, useRef } from 'react';
import { X, RotateCcw, Calculator, AlignJustify, CheckCircle2 } from 'lucide-react';
import { processAndValidateItems, MAX_ITEMS, MAX_ITEM_LENGTH } from '@/utils/validation';
import { useModalDialog } from '@/hooks/use-modal-dialog';

interface ItemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onUpdate: (items: string[]) => boolean | void;
}

const PRESETS = [
  { label: '초기화', icon: <RotateCcw size={14} aria-hidden="true" />, items: [] },
  { label: '숫자 1-10', icon: <Calculator size={14} aria-hidden="true" />, items: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
  { label: 'OX 게임', icon: <CheckCircle2 size={14} aria-hidden="true" />, items: ['O', 'X'] },
  { label: '가위바위보', icon: <AlignJustify size={14} aria-hidden="true" />, items: ['가위', '바위', '보'] },
  { label: '메뉴 정하기', icon: <AlignJustify size={14} aria-hidden="true" />, items: ['한식', '중식', '일식', '양식', '분식', '치킨', '피자'] },
  { label: '로또 (1-45)', icon: <Calculator size={14} aria-hidden="true" />, items: Array.from({ length: 45 }, (_, i) => String(i + 1)) },
];

const TEXTAREA_ID = 'item-editor-modal-input';
const ERROR_ID = 'item-editor-modal-errors';
const HINT_ID = 'item-editor-modal-hint';

export default function ItemEditorModal({ isOpen, onClose, items, onUpdate }: ItemEditorModalProps) {
  const [text, setText] = useState(items.join('\n'));
  const [errors, setErrors] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useModalDialog(isOpen, onClose, dialogRef, textareaRef);

  useEffect(() => {
    if (isOpen) {
      setText(items.join('\n'));
      setErrors([]);
    }
  }, [isOpen, items]);

  const validate = useCallback((value: string) => {
    const result = processAndValidateItems(value);
    setErrors(result?.errors ?? []);
    return result;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    validate(e.target.value);
  }, [validate]);

  // 프리셋(초기화 포함)도 같은 validator를 거쳐 오류를 즉시 보여준다.
  const handlePreset = useCallback((presetItems: string[]) => {
    const newText = presetItems.join('\n');
    setText(newText);
    validate(newText);
    textareaRef.current?.focus();
  }, [validate]);

  // 저장은 항상 검증 결과를 표시한다. 실패 시 무반응 대신 오류와 포커스를 준다.
  const handleSave = useCallback(() => {
    const result = validate(text);
    if (!result || result.errors.length > 0) {
      textareaRef.current?.focus();
      return;
    }
    if (onUpdate(result.items) === false) {
      setErrors(['룰렛이 회전 중이라 지금은 저장할 수 없습니다. 회전이 끝난 뒤 다시 시도하세요.']);
      return;
    }
    onClose();
  }, [text, validate, onUpdate, onClose]);

  if (!isOpen) return null;

  const hasErrors = errors.length > 0;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 bg-neon-bg flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neon-primary/30">
        <h2 id="modal-title" className="text-lg font-bold text-neon-primary">항목 수정하기</h2>
        <button type="button" onClick={onClose} className="p-2 text-neon-primary hover:bg-neon-primary/20 rounded-lg transition-colors" aria-label="닫기">
          <X size={24} aria-hidden="true" />
        </button>
      </div>

      {/* 빠른 설정 프리셋 */}
      <div className="px-4 pt-3 pb-1" role="group" aria-labelledby="item-editor-modal-presets">
        <p id="item-editor-modal-presets" className="text-xs font-semibold text-gray-400 mb-2">빠른 설정</p>
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
      <div className="flex-1 flex flex-col px-4 py-3 min-h-0">
        <label htmlFor={TEXTAREA_ID} className="text-sm font-semibold text-neon-primary mb-2">
          룰렛 항목 (한 줄에 하나)
        </label>
        <textarea
          ref={textareaRef}
          id={TEXTAREA_ID}
          value={text}
          onChange={handleChange}
          aria-invalid={hasErrors}
          aria-describedby={hasErrors ? `${ERROR_ID} ${HINT_ID}` : HINT_ID}
          className="flex-1 min-h-[8rem] w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aurora-primary focus:border-transparent resize-none"
          placeholder="항목1&#10;항목2&#10;항목3"
        />
        <div id={ERROR_ID} role="alert" className="mt-2 text-sm text-neon-accent">
          {errors.map((error) => <p key={error}>⚠ {error}</p>)}
        </div>
        <p id={HINT_ID} className="mt-2 text-xs text-neon-primary/60">최대 {MAX_ITEMS}개, 항목당 최대 {MAX_ITEM_LENGTH}자</p>
      </div>

      {/* 푸터 */}
      <div className="px-4 py-3 border-t border-neon-primary/30">
        <button
          type="button"
          onClick={handleSave}
          aria-describedby={hasErrors ? ERROR_ID : undefined}
          className="w-full py-3 bg-neon-primary text-neon-bg font-bold rounded-lg hover:bg-neon-primary/90 transition-colors"
        >
          완료
        </button>
      </div>
    </div>
  );
}
