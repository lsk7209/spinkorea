import { useState } from "react";
import { TrendingUp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "margin" | "price" | "cost";

function parse(s: string): number {
  return parseFloat(s.replace(/,/g, "")) || 0;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ko-KR");
}

function fmtRate(n: number): string {
  return n.toFixed(2);
}

interface CalcResult {
  cost: number;
  price: number;
  margin: number;   // gross margin %
  markup: number;   // markup %
  profit: number;   // absolute profit
}

function calculate(mode: Mode, a: number, b: number): CalcResult | null {
  if (a <= 0 || b <= 0) return null;
  let cost: number, price: number, margin: number;

  if (mode === "margin") {
    // a = cost, b = price
    cost = a;
    price = b;
    if (price <= cost) return null;
    margin = ((price - cost) / price) * 100;
  } else if (mode === "price") {
    // a = cost, b = margin %
    cost = a;
    margin = b;
    if (margin >= 100) return null;
    price = cost / (1 - margin / 100);
  } else {
    // a = price, b = margin %
    price = a;
    margin = b;
    if (margin >= 100) return null;
    cost = price * (1 - margin / 100);
  }

  const profit = price - cost;
  const markup = (profit / cost) * 100;
  return { cost, price, margin, markup, profit };
}

export default function MarginCalculator() {
  const [mode, setMode] = useState<Mode>("margin");
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");

  const a = parse(inputA);
  const b = parse(inputB);
  const result = calculate(mode, a, b);

  const MODES: { key: Mode; label: string }[] = [
    { key: "margin", label: "마진율 계산" },
    { key: "price", label: "판매가 계산" },
    { key: "cost", label: "원가 계산" },
  ];

  const LABELS: Record<Mode, [string, string]> = {
    margin: ["원가 (₩)", "판매가 (₩)"],
    price: ["원가 (₩)", "마진율 (%)"],
    cost: ["판매가 (₩)", "마진율 (%)"],
  };

  const [labelA, labelB] = LABELS[mode];

  return (
    <ToolLayout
      title="마진율 계산기 | 원가·판매가·마진율 자동 계산"
      description="원가와 판매가로 마진율을 계산하거나, 원가와 목표 마진율로 판매가를 역산합니다. 소규모 사업자, 프리랜서, 온라인 셀러에게 유용합니다."
      keywords="마진율계산기, 마진계산기, 원가계산기, 판매가계산, 마크업계산, 이익률계산"
      howToUse={[
        "마진율 계산: 원가와 판매가를 입력하면 마진율과 마크업률을 계산합니다.",
        "판매가 계산: 원가와 목표 마진율을 입력하면 적정 판매가를 계산합니다.",
        "원가 계산: 판매가와 마진율을 입력하면 원가를 역산합니다.",
      ]}
      tips={[
        "마진율 = (판매가 - 원가) ÷ 판매가 × 100",
        "마크업률 = (판매가 - 원가) ÷ 원가 × 100 (원가 기준 이익 비율)",
        "동일한 이익이라도 마진율과 마크업률은 다릅니다. 50% 마크업 ≠ 50% 마진.",
      ]}
      faqs={[
        {
          question: "마진율과 마크업률의 차이는?",
          answer:
            "마진율(Gross Margin)은 판매가 대비 이익 비율입니다. 마크업률(Markup)은 원가 대비 이익 비율입니다. 예: 원가 6만원, 판매가 10만원이면 마진율 40%, 마크업률 약 66.7%입니다.",
        },
        {
          question: "목표 마진율 40%면 판매가를 어떻게 책정하나요?",
          answer:
            "판매가 = 원가 ÷ (1 - 0.4). 원가 60,000원이면 판매가 = 60,000 ÷ 0.6 = 100,000원. '판매가 계산' 모드에 원가와 마진율을 입력하면 자동 계산됩니다.",
        },
        {
          question: "부가세는 어떻게 반영하나요?",
          answer:
            "이 계산기는 부가세를 제외한 순수 마진 계산입니다. 부가세를 포함한 최종 소비자 가격을 계산하려면 결과 판매가에 부가세 계산기(×1.1)를 추가로 적용하세요.",
        },
      ]}
      relatedTools={[
        {
          name: "퍼센트 계산기",
          path: "/tools/percentage-calculator",
          description: "할인율·증감률 계산",
        },
        {
          name: "부가세 계산기",
          path: "/tools/vat-calculator",
          description: "공급가액·부가세·공급대가 계산",
        },
        {
          name: "시급 계산기",
          path: "/tools/hourly-wage",
          description: "일급·월급·연봉 자동 환산",
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* 모드 선택 */}
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setMode(key); setInputA(""); setInputB(""); }}
              className={`py-3 rounded-xl text-xs font-bold transition-all ${
                mode === key
                  ? "bg-neon-primary text-black"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([["A", inputA, setInputA, labelA], ["B", inputB, setInputB, labelB]] as const).map(
            ([, val, setter, label]) => (
              <div key={label} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <label className="block text-sm font-bold text-neon-primary mb-2 flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  {label}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  placeholder="입력"
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-3 text-white font-bold focus:outline-none focus:border-neon-primary text-right"
                />
              </div>
            )
          )}
        </div>

        {/* 결과 */}
        {result && (
          <div className="space-y-3">
            <div className="bg-neon-primary/10 border border-neon-primary/50 p-5 rounded-xl text-center">
              <p className="text-xs text-gray-400 mb-1">
                {mode === "margin" ? "마진율" : mode === "price" ? "판매가" : "원가"}
              </p>
              <p className="text-4xl font-black text-neon-primary">
                {mode === "margin"
                  ? `${fmtRate(result.margin)} %`
                  : mode === "price"
                  ? `${fmt(result.price)} 원`
                  : `${fmt(result.cost)} 원`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {mode !== "margin" && (
                <InfoRow label="원가" value={`${fmt(result.cost)} 원`} />
              )}
              {mode !== "price" && mode !== "cost" && (
                <InfoRow label="판매가" value={`${fmt(result.price)} 원`} />
              )}
              <InfoRow label="이익 (절대값)" value={`${fmt(result.profit)} 원`} />
              <InfoRow label="마진율" value={`${fmtRate(result.margin)} %`} />
              <InfoRow label="마크업률" value={`${fmtRate(result.markup)} %`} />
              {mode !== "margin" && (
                <InfoRow label={mode === "price" ? "판매가" : "판매가"} value={`${fmt(result.price)} 원`} />
              )}
            </div>
          </div>
        )}

        {/* 공식 안내 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-gray-500 space-y-1">
          <p>마진율 = (판매가 − 원가) ÷ 판매가 × 100</p>
          <p>마크업률 = (판매가 − 원가) ÷ 원가 × 100</p>
          <p>판매가 = 원가 ÷ (1 − 마진율/100)</p>
        </div>
      </div>
    </ToolLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-bold text-white">{value}</p>
    </div>
  );
}
