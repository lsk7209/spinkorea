import { useState } from "react";
import { BadgePercent } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

// 근로소득 간이세액표 (2025 기준, 비부양가족 1인)
// 월 소득 구간별 소득세 간이 추정 (정확한 계산은 홈택스 권장)
function estimateIncomeTax(monthly: number): number {
  if (monthly <= 1060000) return 0;
  if (monthly <= 1500000) return Math.max(0, (monthly - 1060000) * 0.06);
  if (monthly <= 3000000) return 26400 + (monthly - 1500000) * 0.15;
  if (monthly <= 4500000) return 251400 + (monthly - 3000000) * 0.24;
  if (monthly <= 8800000) return 611400 + (monthly - 4500000) * 0.35;
  return 2116400 + (monthly - 8800000) * 0.38;
}

interface DeductionItem {
  name: string;
  rate: string;
  amount: number;
  color: string;
}

export default function NetSalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState("40000000");
  const [dependents, setDependents] = useState(0);

  const annual = parseFloat(annualSalary) || 0;
  const monthly = annual / 12;

  // 4대보험 (직원 부담)
  const nationalPension = Math.min(monthly * 0.045, 265500); // 상한액 월 265,500원
  const healthInsurance = monthly * 0.03545;
  const longTermCare = healthInsurance * 0.1281;
  const employmentInsurance = monthly * 0.009;

  // 소득세 (부양가족 공제: 1인당 월 약 15,000원 감소)
  const baseTax = estimateIncomeTax(monthly);
  const taxDeduction = dependents * 15000;
  const incomeTax = Math.max(0, baseTax - taxDeduction);
  const localIncomeTax = incomeTax * 0.1;

  const totalDeduction =
    nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

  const netMonthly = monthly - totalDeduction;
  const netAnnualAmt = netMonthly * 12;
  const deductionRate = annual > 0 ? (totalDeduction * 12) / annual * 100 : 0;

  const deductions: DeductionItem[] = [
    { name: "국민연금", rate: "4.5%", amount: nationalPension, color: "text-blue-400" },
    { name: "건강보험", rate: "3.545%", amount: healthInsurance, color: "text-green-400" },
    { name: "장기요양보험", rate: "건강×12.81%", amount: longTermCare, color: "text-teal-400" },
    { name: "고용보험", rate: "0.9%", amount: employmentInsurance, color: "text-yellow-400" },
    { name: "소득세", rate: "간이세액표", amount: incomeTax, color: "text-orange-400" },
    { name: "지방소득세", rate: "소득세×10%", amount: localIncomeTax, color: "text-red-400" },
  ];

  return (
    <ToolLayout
      title="연봉 실수령액 계산기 | 4대보험·소득세 공제 후 월급"
      description="연봉을 입력하면 국민연금·건강보험·고용보험·소득세·지방소득세를 공제한 실수령 월급과 연봉을 자동 계산합니다."
      keywords="연봉실수령액, 실수령액계산기, 4대보험계산기, 소득세계산기, 월급계산기, 연봉월급환산"
      howToUse={[
        "세전 연봉을 입력하세요.",
        "부양가족 수(본인 제외)를 선택하면 소득세 공제가 조정됩니다.",
        "항목별 공제금액과 세후 실수령액을 확인하세요.",
      ]}
      tips={[
        "소득세는 간이세액표 기준이며 실제와 약간 다를 수 있습니다.",
        "국민연금은 월 소득 590만원 초과 시 상한 적용(월 265,500원)됩니다.",
        "정확한 세금은 홈택스 또는 연말정산 시 확정됩니다.",
        "식대(월 20만원)·교통비 등 비과세 항목이 있으면 실수령이 더 높아집니다.",
      ]}
      faqs={[
        {
          question: "4대보험은 어떤 걸 말하나요?",
          answer: "국민연금·건강보험·고용보험·산재보험입니다. 이 중 산재보험은 전액 사업주 부담이라 직원 급여 공제에서 제외됩니다.",
        },
        {
          question: "연봉 협상 시 식대, 교통비 포함 여부가 중요한가요?",
          answer: "식대(월 20만원 이하)와 교통비 일부는 비과세 항목입니다. 연봉에 이 항목이 포함된 경우 과세 구간이 낮아져 세금이 줄고 실수령이 늘어납니다.",
        },
        {
          question: "퇴직금은 연봉에 포함되나요?",
          answer: "연봉 계약 방식에 따라 다릅니다. '퇴직금 별도'인 경우 여기 입력한 연봉으로 실수령을 계산하면 됩니다. '퇴직금 포함'이라면 연봉의 약 1/13을 빼고 입력하세요.",
        },
      ]}
      relatedTools={[
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "시급·월급·연봉 환산" },
        { name: "퇴직금 계산기", path: "/tools/severance-pay", description: "법정 퇴직금 자동 계산" },
        { name: "연차 계산기", path: "/tools/annual-leave", description: "발생 연차·연차수당 계산" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <BadgePercent size={20} /> 실수령액 계산
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">세전 연봉 (원)</label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">부양가족 수 (본인 제외)</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setDependents(n)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${dependents === n ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 주요 결과 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "세전 월급", value: `${fmt(monthly)}원`, color: "text-gray-300" },
            { label: "월 공제 합계", value: `${fmt(totalDeduction)}원`, color: "text-red-400" },
            { label: "실수령 월급", value: `${fmt(netMonthly)}원`, color: "text-cyan-400" },
            { label: "실수령 연봉", value: `${fmt(netAnnualAmt)}원`, color: "text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-black ${color} break-all`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 공제 내역 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">
            월 공제 내역 <span className="text-sm text-gray-400 font-normal ml-2">공제율 {deductionRate.toFixed(1)}%</span>
          </h3>
          <div className="space-y-3">
            {deductions.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${d.color}`}>{d.name}</span>
                  <span className="text-xs text-gray-500">({d.rate})</span>
                </div>
                <span className="text-sm text-white font-medium">{fmt(d.amount)}원</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="font-bold text-white">합계</span>
              <span className="font-black text-red-400">{fmt(totalDeduction)}원</span>
            </div>
          </div>
        </div>

        {/* 연봉 구간별 실수령 참고표 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">연봉 구간별 실수령 참고 (부양가족 0명 기준)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="pb-2 pr-4">연봉</th>
                  <th className="pb-2 pr-4">세전 월급</th>
                  <th className="pb-2">실수령 월급 (추정)</th>
                </tr>
              </thead>
              <tbody>
                {[2400, 3000, 3600, 4000, 5000, 6000, 8000, 10000].map((amt) => {
                  const m = (amt * 10000) / 12;
                  const np = Math.min(m * 0.045, 265500);
                  const hi = m * 0.03545;
                  const lt = hi * 0.1281;
                  const ei = m * 0.009;
                  const it = Math.max(0, estimateIncomeTax(m));
                  const li = it * 0.1;
                  const net = m - np - hi - lt - ei - it - li;
                  const isCurrentRange = Math.abs(annual - amt * 10000) < 500000;
                  return (
                    <tr key={amt} className={`border-b border-white/5 hover:bg-white/5 ${isCurrentRange ? "bg-neon-primary/10" : ""}`}>
                      <td className={`py-2 pr-4 ${isCurrentRange ? "text-neon-primary font-bold" : "text-gray-400"}`}>{(amt / 100).toFixed(0)}백만원</td>
                      <td className="py-2 pr-4 text-white">{fmt(m)}원</td>
                      <td className={`py-2 font-medium ${isCurrentRange ? "text-neon-primary" : "text-cyan-400"}`}>{fmt(net)}원</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">* 간이 추정치이며 비과세 수당, 부양가족 공제 등에 따라 실제와 다릅니다.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
