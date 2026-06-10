import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "roi" | "cagr" | "target";

const MODE_LABELS: Record<Mode, { tab: string; desc: string }> = {
  roi: { tab: "ROI 계산", desc: "투자 수익률(ROI)과 순이익을 계산합니다." },
  cagr: { tab: "CAGR 계산", desc: "연평균 복리 수익률(CAGR)을 계산합니다." },
  target: { tab: "목표 금액", desc: "목표 수익률 달성에 필요한 금액을 계산합니다." },
};

const PERIOD_PRESETS = [1, 2, 3, 5, 10];

function fmt(n: number, decimals = 2) {
  return n.toFixed(decimals);
}

function fmtKRW(n: number) {
  if (Math.abs(n) >= 1_0000_0000) {
    return `${fmt(n / 1_0000_0000, 2)}억 원`;
  }
  if (Math.abs(n) >= 1_0000) {
    return `${fmt(n / 1_0000, 2)}만 원`;
  }
  return `${n.toLocaleString()}원`;
}

export default function RoiCalculator() {
  const [mode, setMode] = useState<Mode>("roi");
  const [invest, setInvest] = useState("1000000");
  const [current, setCurrent] = useState("1300000");
  const [period, setPeriod] = useState("3");
  const [targetRoi, setTargetRoi] = useState("50");

  const investN = parseFloat(invest.replace(/,/g, "")) || 0;
  const currentN = parseFloat(current.replace(/,/g, "")) || 0;
  const periodN = parseFloat(period) || 1;
  const targetRoiN = parseFloat(targetRoi) || 0;

  const profit = currentN - investN;
  const roi = investN > 0 ? (profit / investN) * 100 : null;

  const cagr =
    investN > 0 && currentN > 0 && periodN > 0
      ? (Math.pow(currentN / investN, 1 / periodN) - 1) * 100
      : null;

  const targetAmount = investN > 0 ? investN * (1 + targetRoiN / 100) : null;

  return (
    <ToolLayout
      title="투자 수익률 계산기"
      description="투자 원금과 현재 가치로 ROI(수익률)와 CAGR(연평균 복리 수익률)을 계산합니다."
      howToUse={[
        "ROI 계산: 투자 원금과 현재 가치를 입력하면 수익률과 순이익을 계산합니다.",
        "CAGR 계산: 원금·현재 가치·투자 기간을 입력하면 연평균 복리 수익률을 계산합니다.",
        "목표 금액: 원금과 목표 수익률을 입력하면 달성에 필요한 목표 금액을 계산합니다.",
      ]}
      faqs={[
        {
          question: "ROI와 CAGR의 차이는 무엇인가요?",
          answer: "ROI(Return on Investment)는 전체 기간의 총 수익률입니다. CAGR(연평균 복리 수익률)은 투자 기간 동안의 연간 평균 성장률로, 기간이 다른 투자를 비교할 때 유용합니다. 예를 들어 3년에 걸쳐 50% ROI를 달성했다면 CAGR은 약 14.5%입니다.",
        },
        {
          question: "ROI 계산 공식은?",
          answer: "ROI(%) = (현재 가치 - 투자 원금) ÷ 투자 원금 × 100. 예를 들어 100만 원을 투자해 130만 원이 됐다면 ROI = (130-100) ÷ 100 × 100 = 30%입니다.",
        },
        {
          question: "CAGR 계산 공식은?",
          answer: "CAGR(%) = (현재 가치 ÷ 투자 원금)^(1/투자 기간) - 1 × 100. 복리 효과를 고려한 연평균 수익률이므로 단순 평균 수익률보다 정확한 비교 기준이 됩니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 모드 탭 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === m ? "bg-neon-primary text-black" : "text-gray-400 hover:text-white"}`}
            >
              {MODE_LABELS[m].tab}
            </button>
          ))}
        </div>

        {/* 공통 입력: 투자 원금 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">투자 원금 (원)</label>
          <input
            type="number" min={0} placeholder="e.g. 1000000"
            value={invest} onChange={(e) => setInvest(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
          {investN > 0 && (
            <p className="text-xs text-gray-500 mt-1">{fmtKRW(investN)}</p>
          )}
        </div>

        {/* ROI / CAGR: 현재 가치 */}
        {(mode === "roi" || mode === "cagr") && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">현재 가치 (원)</label>
            <input
              type="number" min={0} placeholder="e.g. 1300000"
              value={current} onChange={(e) => setCurrent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
            {currentN > 0 && (
              <p className="text-xs text-gray-500 mt-1">{fmtKRW(currentN)}</p>
            )}
          </div>
        )}

        {/* CAGR: 투자 기간 */}
        {mode === "cagr" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">투자 기간 (년)</label>
            <div className="flex gap-2 mb-2">
              {PERIOD_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(String(p))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === String(p) ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
                >
                  {p}년
                </button>
              ))}
            </div>
            <input
              type="number" min={0.1} step={0.5} placeholder="e.g. 3"
              value={period} onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>
        )}

        {/* 목표 ROI */}
        {mode === "target" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">목표 수익률 (%)</label>
            <input
              type="number" min={-100} placeholder="e.g. 50"
              value={targetRoi} onChange={(e) => setTargetRoi(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>
        )}

        {/* 결과 */}
        {mode === "roi" && roi !== null && investN > 0 && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ROI</span>
              <span className={`text-2xl font-black ${roi >= 0 ? "text-neon-primary" : "text-red-400"}`}>
                {roi >= 0 ? "+" : ""}{fmt(roi)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm text-gray-400">순이익</span>
              <span className={`text-base font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}{fmtKRW(profit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">현재 가치</span>
              <span className="text-sm text-gray-300">{fmtKRW(currentN)}</span>
            </div>
          </div>
        )}

        {mode === "cagr" && cagr !== null && investN > 0 && currentN > 0 && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">CAGR (연평균 복리 수익률)</span>
              <span className={`text-2xl font-black ${cagr >= 0 ? "text-neon-primary" : "text-red-400"}`}>
                {cagr >= 0 ? "+" : ""}{fmt(cagr)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm text-gray-400">총 ROI</span>
              <span className={`text-sm font-bold ${roi !== null && roi >= 0 ? "text-green-400" : "text-red-400"}`}>
                {roi !== null ? `${roi >= 0 ? "+" : ""}${fmt(roi)}%` : "-"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">투자 기간</span>
              <span className="text-sm text-gray-300">{periodN}년</span>
            </div>
          </div>
        )}

        {mode === "target" && targetAmount !== null && investN > 0 && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">목표 금액</span>
              <span className="text-2xl font-black text-neon-primary">{fmtKRW(targetAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="text-sm text-gray-400">필요 순이익</span>
              <span className="text-sm font-bold text-green-400">+{fmtKRW(targetAmount - investN)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">목표 수익률</span>
              <span className="text-sm text-gray-300">{targetRoiN}%</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
