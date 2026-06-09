import { useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function calcLeave(days: number): number {
  // 1년 미만: 1개월 개근 시 1일 (최대 11일)
  if (days < 365) {
    const months = Math.floor(days / 30);
    return Math.min(months, 11);
  }
  // 1년 이상: 15일 기본 + (2년마다 1일 추가, 최대 25일)
  const years = Math.floor(days / 365);
  const bonus = Math.floor((years - 1) / 2);
  return Math.min(15 + bonus, 25);
}

export default function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState("2022-01-01");
  const [refDate, setRefDate] = useState("2026-06-09");
  const [hourlyWage, setHourlyWage] = useState("10030");
  const [usedDays, setUsedDays] = useState("0");

  const totalDays = daysBetween(startDate, refDate);
  const years = totalDays / 365;
  const annualLeave = calcLeave(totalDays);
  const used = parseFloat(usedDays) || 0;
  const remaining = Math.max(annualLeave - used, 0);

  // 연차수당 (1일 통상임금 = 시급 × 8시간)
  const wage = parseFloat(hourlyWage) || 0;
  const dailyWage = wage * 8;
  const unusedPay = remaining * dailyWage;

  // 연도별 연차 발생 테이블
  const rows: { year: number; leave: number }[] = [];
  for (let y = 0; y <= 15; y++) {
    const d = y === 0 ? 365 - 1 : y * 365;
    rows.push({ year: y, leave: calcLeave(d) });
  }

  return (
    <ToolLayout
      title="연차 계산기 | 연차일수·연차수당 자동 계산"
      description="입사일과 기준일을 입력하면 발생 연차, 잔여 연차, 미사용 연차수당을 자동 계산합니다. 근로기준법 기준."
      keywords="연차계산기, 연차일수계산, 연차수당계산, 미사용연차, 연차휴가, 근로기준법연차"
      howToUse={[
        "입사일과 기준일(오늘 또는 퇴사 예정일)을 선택하세요.",
        "시급(통상임금 산정용)과 이미 사용한 연차일수를 입력하세요.",
        "발생 연차, 잔여 연차, 미사용 연차수당을 확인하세요.",
      ]}
      tips={[
        "1년 미만 근무자는 매월 1일씩 발생, 최대 11일입니다.",
        "1년 이상 근무자는 15일 기본, 2년마다 1일 추가되어 최대 25일입니다.",
        "미사용 연차수당은 퇴직 시 or 연도 말 일괄 지급이 원칙입니다.",
        "통상임금이 최저시급보다 높다면 실제 통상시급을 입력하세요.",
      ]}
      faqs={[
        {
          question: "단시간 근로자(주 15시간 미만)도 연차가 발생하나요?",
          answer: "주 15시간 미만 초단시간 근로자는 연차 규정이 적용되지 않습니다. 주 15시간 이상인 경우에는 소정근로일 비율에 따라 비례 적용됩니다.",
        },
        {
          question: "연차 소멸 시점은 언제인가요?",
          answer: "발생일로부터 1년이 지나면 소멸됩니다. 사용자가 촉진을 했는데 미사용한 경우에는 수당 지급 의무가 없어질 수 있습니다.",
        },
        {
          question: "반차는 어떻게 계산하나요?",
          answer: "반차(반일 연차)는 0.5일로 계산됩니다. 4시간 이상 사용 시 통상 반차로 인정하며 취업규칙에 따라 다를 수 있습니다.",
        },
      ]}
      relatedTools={[
        { name: "퇴직금 계산기", path: "/tools/severance-pay", description: "법정 퇴직금 자동 계산" },
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "시급·월급·연봉 환산" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "근속 기념일·퇴직일 계산" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <CalendarCheck2 size={20} /> 연차 계산
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
              <label className="block text-sm text-gray-400 mb-1">기준일 (오늘 또는 퇴사 예정일)</label>
              <input
                type="date"
                value={refDate}
                onChange={(e) => setRefDate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">통상시급 (원, 연차수당 계산용)</label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">이미 사용한 연차일수</label>
              <input
                type="number"
                value={usedDays}
                onChange={(e) => setUsedDays(e.target.value)}
                placeholder="0"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
          </div>
        </div>

        {/* 결과 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "근속 기간", value: `${Math.floor(years)}년 ${Math.floor((years % 1) * 12)}개월`, color: "text-gray-300" },
            { label: "발생 연차", value: `${annualLeave}일`, color: "text-yellow-400" },
            { label: "잔여 연차", value: `${remaining}일`, color: "text-cyan-400" },
            { label: "미사용 연차수당", value: remaining > 0 ? `${fmt(unusedPay)}원` : "0원", color: "text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 연도별 연차 발생 기준 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">근속 연도별 연차 발생 기준 (근로기준법)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 border-b border-white/10">
                  <th className="pb-2 pr-4">근속</th>
                  <th className="pb-2">연차일수</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.year}
                    className={`border-b border-white/5 hover:bg-white/5 ${Math.floor(years) === row.year ? "bg-neon-primary/10" : ""}`}
                  >
                    <td className="py-2 pr-4 text-gray-400">
                      {row.year === 0 ? "1년 미만 (월 1일 × 최대 11개월)" : `${row.year}년`}
                    </td>
                    <td className={`py-2 font-medium ${Math.floor(years) === row.year ? "text-neon-primary" : "text-white"}`}>
                      {row.year === 0 ? "최대 11일" : `${row.leave}일`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">* 현재 근속 연도 강조 표시</p>
        </div>
      </div>
    </ToolLayout>
  );
}
