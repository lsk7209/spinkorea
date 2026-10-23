interface DrawCountControlProps {
  value: string;
  disabled: boolean;
  error: string | null;
  onChange: (value: string) => void;
}

export default function DrawCountControl({
  value,
  disabled,
  error,
  onChange,
}: DrawCountControlProps) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
      <label
        className="flex items-center gap-3 font-semibold text-white"
        htmlFor="draw-count-input"
      >
        한 번에 뽑을 인원
        <input
          id="draw-count-input"
          type="text"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? "draw-count-error" : undefined}
          className="w-20 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-center text-white disabled:opacity-50"
        />
        명
      </label>
      <p className="mt-2 text-xs text-slate-400">
        같은 후보는 한 번에 한 번만 뽑힙니다. 휠은 마지막 당첨자를 가리킵니다.
      </p>
      {error && (
        <p id="draw-count-error" role="alert" className="mt-2 text-amber-300">
          {error}
        </p>
      )}
    </div>
  );
}
