import { useState } from "react";
import { Receipt } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const VAT_RATE = 0.1;

function parseInput(s: string): number {
  return parseFloat(s.replace(/,/g, "")) || 0;
}

function ResultRow({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border ${
        highlight ? "bg-neon-primary/10 border-neon-primary/50" : "bg-white/5 border-white/10"
      }`}
    >
      <span className="text-sm text-gray-300">{label}</span>
      <span className={`text-xl font-black ${color ?? (highlight ? "text-neon-primary" : "text-white")}`}>
        {Math.round(value).toLocaleString("ko-KR")} 원
      </span>
    </div>
  );
}

export default function VatCalculator() {
  const [mode, setMode] = useState<"add" | "extract">("add");
  const [input, setInput] = useState("");

  const amount = parseInput(input);

  let supplyPrice: number, vat: number, total: number;

  if (mode === "add") {
    supplyPrice = amount;
    vat = amount * VAT_RATE;
    total = amount + vat;
  } else {
    total = amount;
    supplyPrice = amount / (1 + VAT_RATE);
    vat = total - supplyPrice;
  }

  const hasResult = amount > 0;

  return (
    <ToolLayout
      title="부가세 계산기 | 공급가액·부가세·공급대가 자동 계산"
      description="공급가액에서 부가세를 더하거나, 세금포함 금액에서 부가세를 역산합니다. 개인사업자, 프리랜서, 견적서 작성에 바로 활용하세요."
      keywords="부가세계산기, VAT계산기, 공급가액계산, 세금포함금액역산, 부가가치세, 세금계산서"
      howToUse={[
        "부가세 추가: 공급가액(세전 금액)을 입력하면 부가세(10%)와 세금포함 합계를 계산합니다.",
        "부가세 역산: 세금포함 금액을 입력하면 공급가액과 부가세를 분리합니다.",
        "금액에 콤마가 포함되어 있어도 자동으로 인식합니다.",
      ]}
      tips={[
        "한국 일반 부가가치세율은 10%입니다.",
        "세금계산서 발행 시 공급가액과 세액을 구분해 기재합니다.",
        "역산 공식: 세금포함 금액 ÷ 1.1 = 공급가액, 공급가액 × 0.1 = 부가세.",
      ]}
      faqs={[
        {
          question: "공급가액과 공급대가의 차이는 무엇인가요?",
          answer:
            "공급가액은 부가세를 제외한 순수 가격(세전 금액)입니다. 공급대가는 공급가액 + 부가세를 합한 최종 금액입니다. 세금계산서에는 두 금액을 모두 표기합니다.",
        },
        {
          question: "간이과세자도 10%를 적용하나요?",
          answer:
            "간이과세자는 업종별 부가가치율(15~40%)을 적용해 계산 방식이 다릅니다. 이 계산기는 일반과세자 기준 10% 세율을 적용합니다.",
        },
        {
          question: "면세 품목에는 부가세가 없나요?",
          answer:
            "의료·교육·농수산물·금융 등 면세 품목은 부가세가 적용되지 않습니다. 해당 품목 거래 시 이 계산기의 결과를 그대로 적용하지 마세요.",
        },
      ]}
      relatedTools={[
        {
          name: "퍼센트 계산기",
          path: "/tools/percentage-calculator",
          description: "할인율·증감률 계산",
        },
        {
          name: "실수령액 계산기",
          path: "/tools/net-salary",
          description: "4대보험·소득세 공제 후 월급",
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
        <div className="flex gap-3">
          {(["add", "extract"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === m
                  ? "bg-neon-primary text-black"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {m === "add" ? "부가세 추가" : "부가세 역산"}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <label className="block text-sm font-bold text-neon-primary mb-3 flex items-center gap-2">
            <Receipt size={16} />
            {mode === "add" ? "공급가액 (세전 금액 입력)" : "세금포함 금액 (공급대가 입력)"}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="금액 입력"
              className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white text-2xl font-black focus:outline-none focus:border-neon-primary pr-12 text-right"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">원</span>
          </div>
        </div>

        {/* 결과 */}
        {hasResult && (
          <div className="space-y-3">
            <ResultRow label="공급가액 (세전)" value={supplyPrice} highlight={mode === "extract"} />
            <ResultRow label="부가세 (10%)" value={vat} color="text-yellow-400" />
            <ResultRow label="공급대가 (세후 합계)" value={total} highlight={mode === "add"} />
          </div>
        )}

        {/* 공식 안내 */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-gray-500 space-y-1">
          <p>추가: 공급가액 × 1.1 = 공급대가</p>
          <p>역산: 공급대가 ÷ 1.1 = 공급가액</p>
        </div>
      </div>
    </ToolLayout>
  );
}
