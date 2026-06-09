import { useState } from "react";
import { CalendarRange } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getNextYear(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}

function diffDetails(startStr: string, endStr: string) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
  const totalDays = Math.round((e.getTime() - s.getTime()) / 86400000);
  const abs = Math.abs(totalDays);
  const weeks = Math.floor(abs / 7);
  const remDays = abs % 7;
  const months = Math.floor(abs / 30.4375);
  const years = Math.floor(abs / 365.25);
  return { totalDays, abs, weeks, remDays, months, years };
}

function fmtKo(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

const PRESETS = [
  { label: "1개월", days: 30 },
  { label: "3개월", days: 90 },
  { label: "6개월", days: 180 },
  { label: "1년", days: 365 },
  { label: "2년", days: 730 },
];

export default function DateCalculator() {
  const [start, setStart] = useState(getToday);
  const [end, setEnd] = useState(getNextYear);

  const diff = diffDetails(start, end);
  const isSame = diff?.totalDays === 0;
  const isPast = (diff?.totalDays ?? 0) < 0;

  function applyPreset(days: number) {
    const t = getToday();
    setStart(t);
    const d = new Date(t);
    d.setDate(d.getDate() + days);
    setEnd(d.toISOString().split("T")[0]);
  }

  return (
    <ToolLayout
      title="날짜 계산기 | 두 날짜 사이 기간 일·주·개월·년 계산"
      description="시작일과 종료일을 선택하면 두 날짜 사이의 기간을 일·주·개월·년 단위로 자동 계산합니다. 계약 기간, 근무 기간, 목표일 확인에 활용하세요."
      keywords="날짜계산기, 날짜차이계산, 기간계산, 두날짜사이일수, 날짜간격계산"
      howToUse={[
        "시작 날짜와 종료 날짜를 각각 선택합니다.",
        "두 날짜 사이 총 일수, 주수, 개월수, 연수를 확인합니다.",
        "프리셋 버튼으로 오늘 기준 1개월·1년 등을 빠르게 설정할 수 있습니다.",
      ]}
      tips={[
        "계약 만료일·근무 기간·프로젝트 일정 계산에 활용하세요.",
        "개월수·연수는 30.4일·365.25일 기준 어림값입니다.",
        "시작일이 종료일보다 늦으면 '이미 지난 기간'으로 표시됩니다.",
      ]}
      faqs={[
        {
          question: "D-Day 카운터와 어떻게 다른가요?",
          answer:
            "D-Day 카운터는 오늘 기준으로 특정 날짜까지 거리를 추적합니다. 날짜 계산기는 임의의 두 날짜 사이 기간을 계산하므로 과거 구간이나 계약 기간 확인에 더 적합합니다.",
        },
        {
          question: "근무 기간을 정확하게 계산하려면?",
          answer:
            "입사일을 시작 날짜에, 퇴사일(또는 오늘)을 종료 날짜에 입력하세요. 총 근무 일수를 바로 확인할 수 있으며 퇴직금·연차 계산의 참고 값으로 활용할 수 있습니다.",
        },
      ]}
      relatedTools={[
        {
          name: "D-Day 카운터",
          path: "/tools/d-day-counter",
          description: "기념일·목표일까지 D-Day 추적",
        },
        {
          name: "나이 계산기",
          path: "/tools/age-calculator",
          description: "만 나이·생일 계산",
        },
        {
          name: "퇴직금 계산기",
          path: "/tools/severance-pay",
          description: "법정 퇴직금 자동 계산",
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        {/* 날짜 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-neon-primary flex items-center gap-1.5">
                <CalendarRange size={14} />
                시작 날짜
              </label>
              <button
                type="button"
                onClick={() => setStart(getToday())}
                className="text-xs text-gray-500 hover:text-neon-primary border border-white/10 px-2 py-0.5 rounded-full transition-colors"
              >
                오늘
              </button>
            </div>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-3 text-white font-bold focus:outline-none focus:border-neon-primary"
            />
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-neon-primary flex items-center gap-1.5">
                <CalendarRange size={14} />
                종료 날짜
              </label>
              <button
                type="button"
                onClick={() => setEnd(getToday())}
                className="text-xs text-gray-500 hover:text-neon-primary border border-white/10 px-2 py-0.5 rounded-full transition-colors"
              >
                오늘
              </button>
            </div>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-xl px-3 py-3 text-white font-bold focus:outline-none focus:border-neon-primary"
            />
          </div>
        </div>

        {/* 프리셋 */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.days)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 hover:border-neon-primary/50 hover:text-white transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* 결과 */}
        {diff && (
          isSame ? (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-400">
              시작일과 종료일이 같습니다.
            </div>
          ) : (
            <div className="space-y-3">
              <div
                className={`p-5 rounded-xl border text-center ${
                  isPast
                    ? "bg-orange-500/10 border-orange-500/30"
                    : "bg-neon-primary/10 border-neon-primary/50"
                }`}
              >
                <p className="text-xs text-gray-400 mb-1">
                  {isPast ? "이미 지난 기간" : "남은 기간"}
                </p>
                <p
                  className={`text-4xl font-black ${
                    isPast ? "text-orange-400" : "text-neon-primary"
                  }`}
                >
                  {diff.abs.toLocaleString("ko-KR")} 일
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {fmtKo(isPast ? end : start)} → {fmtKo(isPast ? start : end)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 mb-1">주</p>
                  <p className="text-xl font-black text-white">{diff.weeks}</p>
                  {diff.remDays > 0 && (
                    <p className="text-xs text-gray-500">+ {diff.remDays}일</p>
                  )}
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 mb-1">개월 (약)</p>
                  <p className="text-xl font-black text-white">{diff.months}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 mb-1">년 (약)</p>
                  <p className="text-xl font-black text-white">
                    {diff.years > 0 ? diff.years : "—"}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
