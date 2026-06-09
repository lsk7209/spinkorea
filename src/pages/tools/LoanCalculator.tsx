import { useState, useMemo } from "react";
import { TrendingDown } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("30000000");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [months, setMonths] = useState("36");
  const [method, setMethod] = useState<"equal-payment" | "equal-principal">("equal-payment");

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(annualRate) || 0) / 100 / 12;
    const n = parseInt(months) || 0;
    if (P <= 0 || r <= 0 || n <= 0) return null;

    if (method === "equal-payment") {
      // 원리금균등상환
      const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = monthly * n;
      const totalInterest = totalPayment - P;
      return { monthly, totalPayment, totalInterest, firstMonthInterest: P * r };
    } else {
      // 원금균등상환
      const principalPerMonth = P / n;
      let remaining = P;
      let totalInterest = 0;
      const firstMonthInterest = P * r;
      const firstMonthly = principalPerMonth + firstMonthInterest;
      for (let i = 0; i < n; i++) {
        totalInterest += remaining * r;
        remaining -= principalPerMonth;
      }
      return {
        monthly: firstMonthly,
        totalPayment: P + totalInterest,
        totalInterest,
        firstMonthInterest,
        monthlyNote: "첫 달 납부액 (이후 점차 감소)",
      };
    }
  }, [principal, annualRate, months, method]);

  return (
    <ToolLayout
      title="대출 이자·상환금 계산기 | 원리금균등·원금균등"
      description="대출 원금, 금리, 기간을 입력하면 월 상환금, 총 이자, 총 상환금을 자동 계산합니다. 원리금균등·원금균등 두 방식 비교 가능."
      keywords="대출계산기, 이자계산기, 월상환금계산기, 원리금균등, 원금균등, 대출이자계산"
      howToUse={[
        "대출 원금, 연 이자율(%), 대출 기간(개월)을 입력하세요.",
        "원리금균등 또는 원금균등 상환 방식을 선택하세요.",
        "월 납부금, 총 이자, 총 상환금이 자동으로 계산됩니다.",
      ]}
      tips={[
        "원리금균등: 매달 동일한 금액을 납부해 가계 지출 예측이 쉽습니다.",
        "원금균등: 초기 납부액이 많지만 총 이자 부담이 적습니다.",
        "같은 원금이면 기간이 짧을수록, 금리가 낮을수록 총 이자가 줄어듭니다.",
      ]}
      faqs={[
        {
          question: "원리금균등과 원금균등 중 어느 방식이 유리한가요?",
          answer: "총 이자 부담은 원금균등이 더 적습니다. 하지만 초기 납부액이 높아 부담스럽다면 원리금균등이 실용적입니다. 여유 자금이 있을 때 조기상환을 함께 활용하면 이자를 줄일 수 있습니다.",
        },
        {
          question: "중도상환 시 이자 절약 효과는?",
          answer: "잔여 원금에 대한 이자만 계산되므로 조기상환할수록 이자가 크게 줄어듭니다. 단, 중도상환수수료(보통 잔여원금의 0.5~1.5%) 여부를 금융기관에 확인하세요.",
        },
      ]}
      relatedTools={[
        { name: "퍼센트 계산기", path: "/tools/percentage-calculator", description: "할인율·증감률 계산" },
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "월급·연봉 계산" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "상환 완료일 카운트" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <TrendingDown size={20} /> 대출 정보 입력
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">대출 원금 (원)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">연 이자율 (%)</label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">대출 기간 (개월)</label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
          </div>
          {/* 상환 방식 */}
          <div className="flex gap-3">
            {(["equal-payment", "equal-principal"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${method === m ? "bg-neon-primary text-black" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"}`}
              >
                {m === "equal-payment" ? "원리금균등" : "원금균등"}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {result ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">
                {result.monthlyNote ?? "월 납부금"}
              </p>
              <p className="text-2xl font-black text-cyan-400">{fmt(result.monthly)}원</p>
            </div>
            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">총 이자</p>
              <p className="text-2xl font-black text-red-400">{fmt(result.totalInterest)}원</p>
            </div>
            <div className="bg-black/30 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-400 mb-1">총 상환금</p>
              <p className="text-2xl font-black text-white">{fmt(result.totalPayment)}원</p>
              <p className="text-xs text-gray-500 mt-1">
                원금 대비{" "}
                <span className="text-red-400">
                  +{((result.totalInterest / parseFloat(principal)) * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">위 항목을 모두 입력하면 결과가 나타납니다.</p>
        )}

        {/* 공식 */}
        <div className="border-t border-white/10 pt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-neon-primary font-bold mb-2">원리금균등상환 공식</p>
            <p className="text-gray-400 text-xs">
              월납부금 = P × r(1+r)ⁿ / ((1+r)ⁿ-1)
            </p>
            <p className="text-gray-500 text-xs mt-1">P=원금, r=월이율, n=기간(개월)</p>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-blue-400 font-bold mb-2">원금균등상환 공식</p>
            <p className="text-gray-400 text-xs">월납부금 = P/n + 잔여원금 × r</p>
            <p className="text-gray-500 text-xs mt-1">매달 원금이 균등 감소, 이자는 점감</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
