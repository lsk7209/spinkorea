import { useState } from "react";
import { Home } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const PYEONG_TO_M2 = 3.30579;
const M2_TO_FT2 = 10.7639;

type Unit = "pyeong" | "m2" | "ft2";

const UNIT_LABELS: Record<Unit, string> = {
  pyeong: "평",
  m2: "m²",
  ft2: "ft²",
};

const PRESETS = [
  { label: "원룸", pyeong: 10 },
  { label: "투룸", pyeong: 17 },
  { label: "24평형", pyeong: 24 },
  { label: "33평형", pyeong: 33 },
  { label: "45평형", pyeong: 45 },
  { label: "60평형", pyeong: 60 },
];

function convert(value: number, from: Unit): Record<Unit, number> {
  let m2: number;
  if (from === "pyeong") m2 = value * PYEONG_TO_M2;
  else if (from === "m2") m2 = value;
  else m2 = value / M2_TO_FT2;

  return {
    pyeong: m2 / PYEONG_TO_M2,
    m2,
    ft2: m2 * M2_TO_FT2,
  };
}

function fmt(n: number, unit: Unit): string {
  const decimals = unit === "pyeong" ? 2 : 1;
  return n.toFixed(decimals);
}

export default function AreaConverter() {
  const [input, setInput] = useState("33");
  const [fromUnit, setFromUnit] = useState<Unit>("pyeong");

  const val = parseFloat(input) || 0;
  const result = convert(val, fromUnit);
  const hasResult = val > 0;

  return (
    <ToolLayout
      title="평수 계산기 | 평↔m²↔ft² 면적 변환"
      description="평, 제곱미터(m²), 제곱피트(ft²) 단위를 상호 변환합니다. 아파트 평형 확인, 해외 부동산 면적 비교에 활용하세요."
      keywords="평수계산기, 평m2변환, 제곱미터평수, 아파트평형, 평방미터변환, 면적계산기"
      howToUse={[
        "변환할 면적 값을 입력합니다.",
        "입력 단위(평 / m² / ft²)를 선택합니다.",
        "나머지 단위로 자동 변환된 결과를 확인합니다.",
      ]}
      tips={[
        "1평 = 3.30579 m² (정확한 법정 환산값).",
        "부동산 분양면적은 공급면적(주거전용 + 공용)과 전용면적이 다르니 확인하세요.",
        "해외 주택 면적은 대부분 ft²로 표기합니다. 1,000 ft² ≈ 93 m² ≈ 28평.",
      ]}
      faqs={[
        {
          question: "33평이 실제로 몇 m²인가요?",
          answer:
            "33 × 3.30579 ≈ 109.1 m²입니다. 분양 광고에서 33평형이라 해도 전용면적은 84 m² 전후인 경우가 많습니다. 전용면적과 공급면적을 구분해 확인하세요.",
        },
        {
          question: "평과 평방미터는 어떻게 다른가요?",
          answer:
            "평은 한국 전통 넓이 단위로 약 3.3 m²입니다. 평방미터(m²)는 SI 국제 단위계로, 공식 건축 도면과 등기부등본에는 m²로 표기됩니다.",
        },
        {
          question: "분양 공고의 전용면적과 공급면적 차이는?",
          answer:
            "전용면적은 실제 거주 공간만의 넓이이며, 공급면적은 전용면적 + 주거공용면적(계단·복도 지분)을 합한 값입니다. 관리비 산정은 주로 공급면적 기준입니다.",
        },
      ]}
      relatedTools={[
        {
          name: "단위 변환기",
          path: "/tools/unit-converter",
          description: "길이·무게·온도·속도 변환",
        },
        {
          name: "전월세 전환기",
          path: "/tools/jeonse-converter",
          description: "전세↔월세 보증금 환산",
        },
        {
          name: "대출 계산기",
          path: "/tools/loan-calculator",
          description: "월 상환금·총 이자 계산",
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* 단위 선택 */}
        <div className="flex gap-2">
          {(["pyeong", "m2", "ft2"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setFromUnit(u)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                fromUnit === u
                  ? "bg-neon-primary text-black"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {UNIT_LABELS[u]}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <label className="block text-sm font-bold text-neon-primary mb-3 flex items-center gap-2">
            <Home size={16} />
            {UNIT_LABELS[fromUnit]} 입력
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="면적 입력"
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white text-2xl font-black focus:outline-none focus:border-neon-primary pr-16 text-right"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
              {UNIT_LABELS[fromUnit]}
            </span>
          </div>
        </div>

        {/* 결과 */}
        {hasResult && (
          <div className="space-y-3">
            {(["pyeong", "m2", "ft2"] as Unit[]).map((u) => (
              <div
                key={u}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  u === fromUnit
                    ? "bg-neon-primary/10 border-neon-primary/50"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <span className="text-sm text-gray-300 font-medium">{UNIT_LABELS[u]}</span>
                <span className={`text-2xl font-black ${u === fromUnit ? "text-neon-primary" : "text-white"}`}>
                  {fmt(result[u], u)}{" "}
                  <span className="text-base font-bold text-gray-400">{UNIT_LABELS[u]}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 프리셋 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <p className="text-xs font-bold text-gray-500 mb-3">아파트 평형 바로 보기</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFromUnit("pyeong");
                  setInput(String(p.pyeong));
                }}
                className="flex flex-col items-center p-2 bg-white/5 rounded-lg border border-white/10 hover:border-neon-primary/50 hover:bg-white/10 transition-all"
              >
                <span className="text-xs text-gray-400">{p.label}</span>
                <span className="text-sm font-bold text-white">{p.pyeong}평</span>
                <span className="text-xs text-gray-500">{(p.pyeong * PYEONG_TO_M2).toFixed(0)}m²</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
