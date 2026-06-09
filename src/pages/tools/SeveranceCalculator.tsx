import { useState } from "react";
import { Briefcase } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export default function SeveranceCalculator() {
  const [startDate, setStartDate] = useState("2022-01-01");
  const [endDate, setEndDate] = useState("2026-06-09");
  const [monthlyWage, setMonthlyWage] = useState("3000000");
  const [bonusAnnual, setBonusAnnual] = useState("0");

  const totalDays = daysBetween(startDate, endDate);
  const years = totalDays / 365;

  // 법정 퇴직금 계산
  // 1일 평균임금 = (최근 3개월 임금 합계 + 연간 상여금 × 3/12) / 최근 3개월 총 일수(91일 기준)
  const monthly = parseFloat(monthlyWage) || 0;
  const bonus = parseFloat(bonusAnnual) || 0;
  const avgDaily = (monthly * 3 + (bonus * 3) / 12) / 91;

  // 퇴직금 = 1일 평균임금 × 30 × (재직일수 / 365)
  const severance = avgDaily * 30 * (totalDays / 365);

  const isEligible = totalDays >= 365;

  // Yearly breakdown
  const rows: { year: number; days: number; severance: number }[] = [];
  for (let y = 1; y <= Math.min(Math.ceil(years), 30); y++) {
    const d = Math.min(y * 365, totalDays);
    const s = avgDaily * 30 * (d / 365);
    rows.push({ year: y, days: d, severance: s });
  }

  return (
    <ToolLayout
      title="퇴직금 계산기 | 법정 퇴직금 자동 계산"
      description="입사일, 퇴사일, 최근 3개월 평균임금을 입력하면 법정 퇴직금을 자동 계산합니다. 연간 상여금도 반영 가능합니다."
      keywords="퇴직금계산기, 퇴직금계산, 법정퇴직금, 퇴직금공식, 평균임금, 근속연수계산"
      howToUse={[
        "입사일과 퇴사(예정)일을 선택하세요.",
        "최근 3개월 월 평균 임금과 연간 상여금(있을 경우)을 입력하세요.",
        "법정 퇴직금과 근속 연도별 누적 퇴직금을 확인하세요.",
      ]}
      tips={[
        "1년 미만 근무 시 법정 퇴직금 지급 의무가 없습니다.",
        "상여금·성과급은 연간 총액의 3/12만 퇴직금 산정에 포함됩니다.",
        "퇴직금은 퇴직 후 14일 이내 지급이 원칙입니다.",
        "퇴직금은 퇴직소득세 대상이며, IRP(개인형 퇴직연금) 계좌로 수령 시 절세 가능합니다.",
      ]}
      faqs={[
        {
          question: "퇴직금 지급 요건은 무엇인가요?",
          answer: "1주 소정근로시간 15시간 이상, 계속 근로기간 1년 이상인 경우 지급 의무가 발생합니다.",
        },
        {
          question: "평균임금에 포함되는 것은?",
          answer: "기본급, 각종 수당, 연간 상여금의 3/12, 연차 미사용 수당(3/12)이 포함됩니다.",
        },
        {
          question: "회사가 퇴직금을 안 주면?",
          answer: "고용노동부(국번 없이 1350) 또는 고용노동부 민원마당에 진정을 제기할 수 있습니다.",
        },
      ]}
      relatedTools={[
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "시급·월급·연봉 환산" },
        { name: "복리 계산기", path: "/tools/compound-interest", description: "퇴직금 운용 수익 계산" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "퇴직일 카운트다운" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <Briefcase size={20} /> 퇴직금 계산
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">입사일</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">퇴사일 (예정일)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">월 평균임금 (최근 3개월, 원)</label>
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">연간 상여금 (원, 없으면 0)</label>
              <input
                type="number"
                value={bonusAnnual}
                onChange={(e) => setBonusAnnual(e.target.value)}
                placeholder="0"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
          </div>
        </div>

        {/* 결과 */}
        {!isEligible && totalDays > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
            <p className="text-red-400 font-bold">근속기간 {totalDays}일 — 1년 미만은 법정 퇴직금 지급 의무가 없습니다.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "근속 기간", value: `${Math.floor(totalDays / 365)}년 ${Math.floor((totalDays % 365) / 30)}개월`, color: "text-gray-300" },
            { label: "총 근속일", value: `${totalDays.toLocaleString()}일`, color: "text-gray-300" },
            { label: "1일 평균임금", value: `${fmt(avgDaily)}원`, color: "text-yellow-400" },
            { label: "예상 퇴직금", value: isEligible ? `${fmt(severance)}원` : "-", color: "text-cyan-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-black ${color} break-all`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 연도별 누적 */}
        {rows.length > 0 && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-base font-bold text-white mb-4">연도별 누적 퇴직금</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="pb-2 pr-4">근속</th>
                    <th className="pb-2 pr-4">근속일</th>
                    <th className="pb-2">누적 퇴직금</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 text-gray-400">{row.year}년</td>
                      <td className="py-2 pr-4 text-white">{row.days.toLocaleString()}일</td>
                      <td className="py-2 text-cyan-400 font-medium">{fmt(row.severance)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 공식 */}
        <div className="border-t border-white/10 pt-6 text-sm">
          <div className="bg-black/20 p-4 rounded-lg space-y-1">
            <p className="text-neon-primary font-bold mb-2">법정 퇴직금 계산 공식</p>
            <p className="text-gray-400">1일 평균임금 = (최근 3개월 임금 + 연 상여금 × 3/12) ÷ 91일</p>
            <p className="text-gray-400">퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)</p>
            <p className="text-gray-500 text-xs mt-2">* 근로기준법 제34조 및 「근로자퇴직급여 보장법」 기준</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
