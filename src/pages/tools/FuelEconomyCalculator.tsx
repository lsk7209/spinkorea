import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "economy" | "cost" | "amount";

const MODE_LABELS: Record<Mode, string> = {
  economy: "연비 계산",
  cost: "연료비 계산",
  amount: "주유량 계산",
};

const FUEL_PRESETS = [
  { name: "휘발유", price: 1650 },
  { name: "경유",   price: 1500 },
  { name: "LPG",    price: 950  },
];

const fmt = (n: number, digits = 2) => n.toLocaleString("ko-KR", { minimumFractionDigits: 0, maximumFractionDigits: digits });

export default function FuelEconomyCalculator() {
  const [mode, setMode] = useState<Mode>("economy");
  const [distance, setDistance] = useState("");
  const [fuelUsed, setFuelUsed] = useState("");
  const [economy, setEconomy] = useState("");
  const [fuelPrice, setFuelPrice] = useState("1650");

  const d = parseFloat(distance) || 0;
  const fu = parseFloat(fuelUsed) || 0;
  const ec = parseFloat(economy) || 0;
  const fp = parseFloat(fuelPrice) || 0;

  type Result = { label: string; value: string; sub?: string }[];
  let result: Result | null = null;

  if (mode === "economy" && d > 0 && fu > 0) {
    const mpg = d / fu;
    result = [
      { label: "연비", value: `${fmt(mpg)} km/L` },
      { label: "주행거리", value: `${fmt(d, 1)} km` },
      { label: "주유량", value: `${fmt(fu, 2)} L` },
      ...(fp > 0 ? [{ label: "100km 연료비", value: `${fmt((100 / mpg) * fp, 0)}원` }] : []),
    ];
  } else if (mode === "cost" && ec > 0 && d > 0 && fp > 0) {
    const needed = d / ec;
    const cost = needed * fp;
    result = [
      { label: "총 연료비", value: `${fmt(cost, 0)}원` },
      { label: "필요 주유량", value: `${fmt(needed, 2)} L` },
      { label: "연비", value: `${ec} km/L` },
      { label: "유가", value: `${fmt(fp, 0)}원/L` },
    ];
  } else if (mode === "amount" && ec > 0 && d > 0) {
    const needed = d / ec;
    result = [
      { label: "필요 주유량", value: `${fmt(needed, 2)} L` },
      { label: "주행거리", value: `${fmt(d, 1)} km` },
      { label: "연비", value: `${ec} km/L` },
      ...(fp > 0 ? [{ label: "예상 연료비", value: `${fmt(needed * fp, 0)}원` }] : []),
    ];
  }

  return (
    <ToolLayout
      title="연비 계산기"
      description="주행거리와 주유량으로 연비를 계산하거나, 연비와 거리로 연료비·주유량을 계산합니다."
      faqs={[
        {
          question: "연비 계산 공식이 무엇인가요?",
          answer: "연비(km/L) = 주행거리(km) ÷ 주유량(L)입니다. 예를 들어 50L를 주유하고 600km를 달리면 연비는 600 ÷ 50 = 12km/L입니다.",
        },
        {
          question: "정확한 연비를 측정하는 방법은?",
          answer: "주유할 때 주행거리계(트립미터)를 0으로 리셋하고, 다음 주유 때 넣은 양과 달린 거리를 측정합니다. 만주유 기준으로 계산하면 더 정확합니다.",
        },
        {
          question: "연비에 영향을 주는 요인은?",
          answer: "주행 속도(고속일수록 연비 저하), 에어컨 사용, 타이어 공기압, 차량 무게, 도심/고속도로 비율이 영향을 줍니다. 에코 드라이빙(급가속·급제동 자제)만으로도 10~15% 향상될 수 있습니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 모드 선택 */}
        <div className="flex gap-2">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setDistance(""); setFuelUsed(""); setEconomy(""); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* 주행거리 — 연비·연료비·주유량 모두 필요 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">주행거리 (km)</label>
            <input
              type="number" min={0} placeholder="e.g. 500"
              value={distance} onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>

          {/* 주유량 — 연비 계산 모드만 */}
          {mode === "economy" && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">주유량 (L)</label>
              <input
                type="number" min={0} placeholder="e.g. 40"
                value={fuelUsed} onChange={(e) => setFuelUsed(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
              />
            </div>
          )}

          {/* 연비 — 연료비·주유량 모드 */}
          {mode !== "economy" && (
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">연비 (km/L)</label>
              <input
                type="number" min={0} placeholder="e.g. 12"
                value={economy} onChange={(e) => setEconomy(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
              />
            </div>
          )}

          {/* 유가 — 연비·연료비·주유량 모드 모두 (선택적) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              유가 (원/L){mode === "cost" ? "" : " · 선택"}
            </label>
            <input
              type="number" min={0} placeholder="e.g. 1650"
              value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
            <div className="flex gap-2 mt-2">
              {FUEL_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setFuelPrice(String(p.price))}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
                >
                  {p.name} {p.price.toLocaleString()}원
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 */}
        {result && (
          <div className="card p-5 space-y-3">
            {result.map((r, i) => (
              <div key={i} className={`flex justify-between items-center py-2 ${i < result!.length - 1 ? "border-b border-white/10" : ""}`}>
                <span className="text-sm text-gray-400">{r.label}</span>
                <span className={`font-bold ${i === 0 ? "text-xl text-neon-primary" : "text-base text-white"}`}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
