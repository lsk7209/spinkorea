import { useState } from "react";
import { TrendingUp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

const FREQ_OPTIONS = [
  { label: "매월", value: 12 },
  { label: "매분기", value: 4 },
  { label: "매반기", value: 2 },
  { label: "매년", value: 1 },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000000");
  const [rate, setRate] = useState("4");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState(12);
  const [monthly, setMonthly] = useState("0");

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const n = freq;
  const t = parseFloat(years) || 0;
  const m = parseFloat(monthly) || 0;

  // Final amount: A = P(1 + r/n)^(nt) + m*[((1 + r/n)^(nt) - 1) / (r/n)]
  let finalAmount = 0;
  if (r === 0) {
    finalAmount = P + m * n * t;
  } else {
    const factor = Math.pow(1 + r / n, n * t);
    finalAmount = P * factor + (m > 0 ? m * ((factor - 1) / (r / n)) : 0);
  }
  const totalContributions = P + m * n * t;
  const totalInterest = finalAmount - totalContributions;
  const effectiveRate = t > 0 && P + m * n * t > 0
    ? (Math.pow(finalAmount / (P || 1), 1 / t) - 1) * 100
    : 0;

  // Yearly breakdown (capped at 30 rows)
  const rows: { year: number; amount: number; interest: number }[] = [];
  for (let y = 1; y <= Math.min(Math.round(t), 30); y++) {
    const factor = r === 0 ? 1 : Math.pow(1 + r / n, n * y);
    const a = r === 0
      ? P + m * n * y
      : P * factor + (m > 0 ? m * ((factor - 1) / (r / n)) : 0);
    rows.push({ year: y, amount: a, interest: a - (P + m * n * y) });
  }

  return (
    <ToolLayout
      title="복리 계산기 | 예금·적금 만기금액 계산"
      description="원금, 연 이자율, 기간, 복리 주기를 입력하면 만기 금액과 이자 수익을 계산합니다. 매월 추가 납입도 반영됩니다."
      keywords="복리계산기, 예금계산기, 적금계산기, 이자계산기, 복리이자, 만기금액계산"
      howToUse={[
        "원금(초기 투자금), 연 이자율, 투자 기간을 입력하세요.",
        "복리 주기(매월·매분기 등)와 매월 추가 납입액을 선택·입력하세요.",
        "만기 금액, 총 이자, 연도별 잔액 표를 확인하세요.",
      ]}
      tips={[
        "이자율을 연 1% 높이면 10년 후 원금 1억 기준 약 1,050만원 이상 차이납니다.",
        "매월 추가 납입 시 복리 효과가 크게 늘어납니다.",
        "예금자 보호는 원금+이자 합산 5,000만원까지 적용됩니다.",
      ]}
      faqs={[
        {
          question: "단리와 복리의 차이는?",
          answer: "단리는 원금에만 이자가 붙고, 복리는 이자에도 이자가 붙습니다. 기간이 길수록 복리 효과가 커집니다.",
        },
        {
          question: "복리 주기는 무엇인가요?",
          answer: "이자를 재투자(복리 반영)하는 주기입니다. 매월 복리가 매년 복리보다 장기적으로 유리합니다.",
        },
        {
          question: "세금은 반영되나요?",
          answer: "이 계산기는 세전 기준입니다. 실제 이자 수익에는 이자소득세(15.4%)가 부과됩니다.",
        },
      ]}
      relatedTools={[
        { name: "대출 계산기", path: "/tools/loan-calculator", description: "월 상환금·총 이자 계산" },
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "시급 → 월급·연봉 환산" },
        { name: "퍼센트 계산기", path: "/tools/percentage-calculator", description: "수익률·증감률 계산" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <TrendingUp size={20} /> 복리 계산
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">원금 (원)</label>
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
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">투자 기간 (년)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">매월 추가 납입 (원)</label>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="0"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
          </div>
          {/* 복리 주기 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">복리 주기</label>
            <div className="flex flex-wrap gap-2">
              {FREQ_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFreq(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${freq === opt.value ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "만기 금액", value: `${fmt(finalAmount)}원`, color: "text-cyan-400" },
            { label: "총 납입금", value: `${fmt(totalContributions)}원`, color: "text-gray-300" },
            { label: "이자 수익", value: `+${fmt(totalInterest)}원`, color: "text-green-400" },
            { label: "연평균 수익률", value: t > 0 ? `${effectiveRate.toFixed(2)}%` : "-", color: "text-yellow-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-black ${color} break-all`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 연도별 성장 */}
        {rows.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-base font-bold text-white mb-4">연도별 잔액</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="pb-2 pr-4">년차</th>
                    <th className="pb-2 pr-4">잔액</th>
                    <th className="pb-2">누적 이자</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 text-gray-400">{row.year}년</td>
                      <td className="py-2 pr-4 text-white font-medium">{fmt(row.amount)}원</td>
                      <td className="py-2 text-green-400">+{fmt(row.interest)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Math.round(t) > 30 && (
                <p className="text-xs text-gray-500 mt-2">* 최대 30년까지 표시됩니다.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
