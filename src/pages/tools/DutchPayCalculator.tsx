import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type RoundMode = "ceil" | "floor" | "round";

const ROUND_LABELS: Record<RoundMode, string> = {
  ceil: "올림",
  floor: "내림",
  round: "반올림",
};

function splitAmount(total: number, count: number, mode: RoundMode): number {
  const raw = total / count;
  if (mode === "ceil") return Math.ceil(raw);
  if (mode === "floor") return Math.floor(raw);
  return Math.round(raw);
}

const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

const COUNT_PRESETS = [2, 3, 4, 5, 6, 8, 10];

export default function DutchPayCalculator() {
  const [total, setTotal] = useState("");
  const [count, setCount] = useState(4);
  const [discount, setDiscount] = useState("");
  const [roundMode, setRoundMode] = useState<RoundMode>("ceil");

  const totalNum = parseFloat(total.replace(/,/g, "")) || 0;
  const discountNum = parseFloat(discount.replace(/,/g, "")) || 0;
  const net = Math.max(0, totalNum - discountNum);
  const perPerson = net > 0 && count > 0 ? splitAmount(net, count, roundMode) : null;
  const remainder = perPerson !== null ? perPerson * count - net : null;

  return (
    <ToolLayout
      title="더치페이 계산기"
      description="총 금액과 인원수로 1인당 부담 금액을 계산합니다. 할인 차감과 원 단위 처리 방식도 선택할 수 있습니다."
      faqs={[
        {
          question: "원 단위 처리 방식 차이가 무엇인가요?",
          answer: "올림은 1원 단위를 위로 올려 받는 사람이 유리합니다. 내림은 아래로 내려 내는 사람이 유리합니다. 반올림은 0.5원 기준으로 처리합니다. 예) 총 10,000원 3명 분할 시 올림 3,334원, 내림 3,333원, 반올림 3,333원.",
        },
        {
          question: "나머지 금액은 어떻게 처리하나요?",
          answer: "올림 또는 반올림 시 1인당 금액 × 인원수가 실제 합계보다 클 수 있습니다. 이 차액은 결과에 '잔액'으로 표시됩니다. 보통 한 사람이 그 차액만큼 덜 내는 방식으로 처리합니다.",
        },
        {
          question: "할인 금액은 어떻게 반영되나요?",
          answer: "할인쿠폰·포인트 등 차감 금액을 입력하면 총 금액에서 먼저 뺀 뒤 n분의 1로 계산합니다. 예) 총 50,000원에서 5,000원 할인 후 4명이면 (50,000-5,000)÷4 = 11,250원입니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 총 금액 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">총 금액 (원)</label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 48000"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
        </div>

        {/* 인원 수 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">인원 수</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(2, c - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-black text-white w-12 text-center">{count}</span>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(50, c + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center"
            >
              +
            </button>
            <span className="text-sm text-gray-400">명</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {COUNT_PRESETS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`px-3 py-1 rounded-lg text-xs transition-all border ${count === n ? "bg-neon-primary/20 border-neon-primary/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}
              >
                {n}명
              </button>
            ))}
          </div>
        </div>

        {/* 할인 금액 (선택) */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">할인 금액 (원, 선택)</label>
          <input
            type="number"
            min={0}
            placeholder="쿠폰·포인트·할인액"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
        </div>

        {/* 원 단위 처리 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">원 단위 처리</label>
          <div className="flex gap-2">
            {(Object.keys(ROUND_LABELS) as RoundMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setRoundMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${roundMode === m ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {ROUND_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {perPerson !== null && (
          <div className="card p-5 space-y-3">
            {discountNum > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-gray-400">할인 후 금액</span>
                <span className="text-base font-bold text-white">{fmt(net)}원</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">인원</span>
              <span className="text-base font-bold text-white">{count}명</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">1인당 금액</span>
              <span className="text-2xl font-black text-neon-primary">{fmt(perPerson)}원</span>
            </div>
            {remainder !== null && remainder > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">잔액 (1명 감액)</span>
                <span className="text-sm font-bold text-yellow-400">{fmt(remainder)}원</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
