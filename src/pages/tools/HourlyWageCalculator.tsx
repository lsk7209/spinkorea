import { useState } from "react";
import { Wallet } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

export default function HourlyWageCalculator() {
  const [hourlyWage, setHourlyWage] = useState("10030");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerMonth, setDaysPerMonth] = useState("22");

  const hourly = parseFloat(hourlyWage) || 0;
  const hpd = parseFloat(hoursPerDay) || 0;
  const dpm = parseFloat(daysPerMonth) || 0;

  const daily = hourly * hpd;
  const monthly = daily * dpm;
  const annual = monthly * 12;

  // Reverse: monthly salary → hourly
  const [monthlySalary, setMonthlySalary] = useState("");
  const [workHours, setWorkHours] = useState("209");
  const reverseHourly =
    parseFloat(monthlySalary) && parseFloat(workHours)
      ? parseFloat(monthlySalary) / parseFloat(workHours)
      : null;

  return (
    <ToolLayout
      title="시급 계산기 | 일급·월급·연봉 자동 계산"
      description="시급을 입력하면 일급, 월급, 연봉을 자동으로 계산합니다. 월급에서 시급도 역산할 수 있습니다. 2024년 최저시급(10,030원) 기준 예시 포함."
      keywords="시급계산기, 일급계산기, 월급계산기, 최저임금계산기, 시급월급변환, 연봉계산기"
      howToUse={[
        "시급, 하루 근무시간, 한 달 근무일수를 입력하세요.",
        "일급·월급·연봉이 자동으로 계산됩니다.",
        "월급 → 시급 역산은 아래 섹션에서 계산하세요.",
      ]}
      tips={[
        "2024년 최저시급은 9,860원, 2025년은 10,030원입니다.",
        "주 40시간제 기준 월 근무시간은 209시간(주휴 포함)입니다.",
        "주 5일 근무 기준 한 달 근무일수는 약 21~22일입니다.",
      ]}
      faqs={[
        {
          question: "주휴수당이 포함된 시급을 계산하려면?",
          answer: "주 15시간 이상 근무 시 주 1회 유급휴일(주휴일)이 발생합니다. 주 40시간 기준 월 소정근로시간 174시간 + 주휴시간 35시간 = 209시간으로 계산합니다.",
        },
        {
          question: "최저시급보다 낮은 금액이 나왔는데 괜찮은가요?",
          answer: "2025년 최저시급은 10,030원입니다. 법적으로 최저시급 미만 지급은 근로기준법 위반입니다. 고용노동부(국번 없이 1350)에 신고할 수 있습니다.",
        },
        {
          question: "연봉에서 실수령액은 어떻게 계산하나요?",
          answer: "연봉에서 4대보험(약 9.4%)과 소득세를 공제하면 실수령액이 됩니다. 연봉 3,000만원 기준 실수령 월급은 약 215만원 내외입니다.",
        },
      ]}
      relatedTools={[
        { name: "퍼센트 계산기", path: "/tools/percentage-calculator", description: "할인율·증감률 계산" },
        { name: "시간 계산기", path: "/tools/time-calculator", description: "근무시간 합산" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "근무 목표일 계산" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 시급 → 월급 계산 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <Wallet size={20} /> 시급 → 일급·월급·연봉
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">시급 (원)</label>
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">하루 근무시간</label>
              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">월 근무일수</label>
              <input
                type="number"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "일급", value: daily, color: "text-yellow-400" },
              { label: "월급 (세전)", value: monthly, color: "text-cyan-400" },
              { label: "연봉 (세전)", value: annual, color: "text-green-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className={`text-xl font-black ${color}`}>
                  {value > 0 ? `${fmt(value)}원` : "-"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 월급 → 시급 역산 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-blue-400 mb-5">월급 → 시급 역산</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">월 급여 (원)</label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                placeholder="예: 2500000"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">월 근무시간 (기본 209h)</label>
              <input
                type="number"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">환산 시급</p>
            <p className="text-2xl font-black text-blue-400">
              {reverseHourly !== null
                ? `${Math.round(reverseHourly).toLocaleString("ko-KR")}원`
                : "-"}
            </p>
            {reverseHourly !== null && reverseHourly < 10030 && (
              <p className="text-xs text-red-400 mt-2">⚠️ 2025년 최저시급(10,030원) 미만입니다.</p>
            )}
          </div>
        </div>

        {/* 공식 요약 */}
        <div className="border-t border-white/10 pt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-neon-primary font-bold mb-2">시급 계산 공식</p>
            <p className="text-gray-400">일급 = 시급 × 하루 근무시간</p>
            <p className="text-gray-400">월급 = 일급 × 월 근무일수</p>
            <p className="text-gray-400">연봉 = 월급 × 12</p>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-blue-400 font-bold mb-2">주 40시간 기준 월 근무시간</p>
            <p className="text-gray-400">소정근로 174h + 주휴 35h = <span className="text-white font-bold">209h</span></p>
            <p className="text-gray-500 text-xs mt-1">주 40시간 미만이면 비례하여 줄어듭니다.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
