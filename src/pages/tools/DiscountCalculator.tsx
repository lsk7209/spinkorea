import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
type Mode = "discounted" | "rate" | "original";

interface CalcResult {
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  savedAmount: number;
}

function calculate(mode: Mode, a: string, b: string): CalcResult | null {
  const na = parseFloat(a.replace(/,/g, ""));
  const nb = parseFloat(b.replace(/,/g, ""));
  if (isNaN(na) || isNaN(nb) || na <= 0 || nb < 0) return null;

  if (mode === "discounted") {
    if (nb >= 100 || nb <= 0) return null;
    const discountedPrice = na * (1 - nb / 100);
    return { originalPrice: na, discountedPrice, discountRate: nb, savedAmount: na - discountedPrice };
  } else if (mode === "rate") {
    if (nb >= na) return null;
    const discountRate = ((na - nb) / na) * 100;
    return { originalPrice: na, discountedPrice: nb, discountRate, savedAmount: na - nb };
  } else {
    if (nb >= 100 || nb <= 0) return null;
    const originalPrice = na / (1 - nb / 100);
    return { originalPrice, discountedPrice: na, discountRate: nb, savedAmount: originalPrice - na };
  }
}

const MODE_LABELS: Record<Mode, { label: string; labelA: string; labelB: string; phA: string; phB: string }> = {
  discounted: { label: "할인가 계산", labelA: "정가 (원)", labelB: "할인율 (%)", phA: "e.g. 30000", phB: "e.g. 30" },
  rate: { label: "할인율 계산", labelA: "정가 (원)", labelB: "할인가 (원)", phA: "e.g. 30000", phB: "e.g. 21000" },
  original: { label: "정가 역산", labelA: "할인가 (원)", labelB: "할인율 (%)", phA: "e.g. 21000", phB: "e.g. 30" },
};

const QUICK_RATES = [5, 10, 20, 30, 50, 70];

const fmt = (n: number) => Math.round(n).toLocaleString("ko-KR");

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("discounted");
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");

  const result = calculate(mode, inputA, inputB);
  const { labelA, labelB, phA, phB } = MODE_LABELS[mode];
  const showRatePresets = mode !== "rate";

  return (
    <ToolLayout
      title="할인율 계산기"
      description="정가와 할인율로 할인가를 계산하거나, 정가와 할인가로 할인율을 역산합니다."
      faqs={[
        {
          question: "할인율 계산 공식이 무엇인가요?",
          answer: "할인율(%) = (정가 - 할인가) ÷ 정가 × 100입니다. 예를 들어 정가 30,000원에서 21,000원으로 할인했다면 (30,000 - 21,000) ÷ 30,000 × 100 = 30%입니다.",
        },
        {
          question: "정가 역산은 어떤 경우에 사용하나요?",
          answer: "할인 후 판매가와 할인율을 알고 있을 때 원래 정가를 구할 때 사용합니다. 공식: 정가 = 할인가 ÷ (1 - 할인율 ÷ 100).",
        },
        {
          question: "절약 금액은 어떻게 계산하나요?",
          answer: "절약 금액 = 정가 - 할인가입니다. 실제로 얼마를 아끼는지 금액으로 바로 확인할 수 있습니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 모드 선택 */}
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setInputA(""); setInputB(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              {MODE_LABELS[m].label}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{labelA}</label>
            <input
              type="number"
              min={0}
              placeholder={phA}
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{labelB}</label>
            <input
              type="number"
              min={0}
              max={showRatePresets ? 99 : undefined}
              placeholder={phB}
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
            {showRatePresets && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {QUICK_RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInputB(String(r))}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
                  >
                    {r}%
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 결과 */}
        {result && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">정가</span>
              <span className="text-base font-bold text-white">{fmt(result.originalPrice)}원</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">할인율</span>
              <span className="text-base font-bold text-pink-400">{result.discountRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">할인가</span>
              <span className="text-xl font-black text-neon-primary">{fmt(result.discountedPrice)}원</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-400">절약 금액</span>
              <span className="text-base font-bold text-green-400">-{fmt(result.savedAmount)}원</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
