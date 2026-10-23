interface WinnerExcludeControlProps {
  enabled: boolean;
  disabled: boolean;
  /** 이미 제외된 후보 이름 */
  excludedNames: string[];
  /** 다음 추첨부터 제외될 직전 당첨자 */
  pendingName: string | null;
  /** 다음 추첨에 쓸 수 있는 후보 수 */
  remaining: number;
  onToggle: (enabled: boolean) => void;
  onRestore: () => void;
}

export default function WinnerExcludeControl({
  enabled,
  disabled,
  excludedNames,
  pendingName,
  remaining,
  onToggle,
  onRestore,
}: WinnerExcludeControlProps) {
  const hasExcluded = excludedNames.length > 0 || pendingName !== null;
  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
      <label className="flex items-center gap-3 font-semibold text-white">
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={(event) => onToggle(event.target.checked)}
          className="h-5 w-5 accent-cyan-500"
        />
        당첨된 후보는 다음 추첨에서 제외
      </label>
      {enabled && (
        <p className="mt-2" aria-live="polite">
          {remaining > 0 ? `다음 추첨 후보 ${remaining}개` : "남은 후보가 없습니다. 제외한 후보를 되돌려 주세요."}
          {excludedNames.length > 0 && ` · 제외됨: ${excludedNames.join(", ")}`}
          {pendingName !== null && ` · 다음 추첨부터 제외: ${pendingName}`}
        </p>
      )}
      {hasExcluded && (
        <button
          type="button"
          onClick={onRestore}
          disabled={disabled}
          className="mt-3 rounded-lg border border-slate-600 px-3 py-1.5 font-semibold text-white hover:border-cyan-500 disabled:opacity-50"
        >
          제외한 후보 모두 되돌리기
        </button>
      )}
    </div>
  );
}
