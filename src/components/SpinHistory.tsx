import { History } from 'lucide-react';

interface SpinHistoryProps {
  history: string[];
}

export default function SpinHistory({ history }: SpinHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-3">
        <History size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-400 tracking-wider">최근 결과</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              idx === 0
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span className="opacity-50 text-[10px]">{idx + 1}</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
