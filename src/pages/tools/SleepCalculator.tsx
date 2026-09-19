import { useState } from "react";
import { Moon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import guidance from "@/data/site-guidance.json";

const CYCLE_MIN = 90;
const FALL_ASLEEP_MIN = 15;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function minutesToTime(totalMin: number): string {
  const m = ((totalMin % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

function cyclesLabel(n: number) {
  const h = Math.floor((n * CYCLE_MIN) / 60);
  const m = (n * CYCLE_MIN) % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

const CYCLE_COUNTS = [4, 5, 6];

export default function SleepCalculator() {
  const [mode, setMode] = useState<"bedtime" | "wakeup">("bedtime");
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeup, setWakeup] = useState("07:00");

  // 취침 시각 → 기상 시각 계산
  const bedMin = timeToMinutes(bedtime);
  const wakeResults = CYCLE_COUNTS.map((cycles) => ({
    cycles,
    label: cyclesLabel(cycles),
    time: minutesToTime(bedMin + FALL_ASLEEP_MIN + cycles * CYCLE_MIN),
  }));

  // 기상 시각 → 취침 시각 계산
  const wakeMin = timeToMinutes(wakeup);
  const bedResults = CYCLE_COUNTS.map((cycles) => ({
    cycles,
    label: cyclesLabel(cycles),
    time: minutesToTime(wakeMin - FALL_ASLEEP_MIN - cycles * CYCLE_MIN),
  })).reverse();

  return (
    <ToolLayout
      title="수면 시간 계산기 | 90분 사이클 기준 기상·취침 참고 시각"
      description="취침 시각 또는 기상 시각을 입력하면 90분 수면 사이클 기준으로 기상·취침 참고 시각을 자동 계산합니다."
      keywords="수면계산기, 수면시간계산기, 기상시간계산기, 수면사이클, 취침시각, 잠자는시간"
      howToUse={[
        "취침 시각 → 기상 시각: 잠자리에 눕는 시각을 입력하면 입면 15분을 더해 기상 참고 시각을 계산합니다.",
        "기상 시각 → 취침 시각: 일어날 시각을 입력하면 취침 참고 시각을 계산합니다.",
        "수면 사이클(4~6회) 중 생활에 맞는 시각을 선택하세요.",
      ]}
      tips={[
        "이 계산기는 한 구간을 90분으로 가정합니다. NHLBI는 주기가 약 80~100분마다 반복된다고 설명하며, 개인의 실제 수면 단계는 이 계산기로 알 수 없습니다.",
        "입면 시간 15분은 계산을 위한 고정 가정이며 개인의 측정값이 아닙니다.",
        "구간 수만으로 필요한 수면량이나 알람의 적절성을 판단하지 마세요.",
        "같은 시간에 자고 일어나는 규칙적인 수면이 수면의 질을 높이는 데 도움이 됩니다.",
      ]}
      faqs={[
        {
          question: "왜 90분 단위로 계산하나요?",
          answer:
            "90분은 시간 계산을 위한 가정입니다. 실제 수면은 여러 단계를 거치며 주기 길이가 일정하지 않으므로, 계산된 시각이 특정 수면 단계의 끝이라는 뜻은 아닙니다.",
        },
        {
          question: "알람을 몇 사이클에 맞춰야 할까요?",
          answer:
            "구간 수만으로 최적 알람을 정할 수 없습니다. 필요한 수면 시간과 생활 일정을 고려하고, 수면 문제가 계속되면 계산 결과로 진단을 대신하지 마세요.",
        },
        {
          question: "잠드는 데 시간이 더 걸리면 어떻게 되나요?",
          answer:
            "이 계산기는 입면 시간을 15분으로 고정합니다. 실제 입면 시간이 다르면 표에 표시된 시간과 실제 수면 시간도 달라지며, 이 도구는 그 차이를 측정하거나 보정하지 않습니다.",
        },
      ]}
      relatedTools={[
        {
          name: "타이머",
          path: "/tools/timer",
          description: "수면 타이머·알람 설정",
        },
        {
          name: "D-Day 카운터",
          path: "/tools/d-day-counter",
          description: "중요한 날까지 D-Day 계산",
        },
        {
          name: "칼로리 계산기",
          path: "/tools/calorie-calculator",
          description: "기초대사량·일일 권장 칼로리",
        },
      ]}
    >
      <div className="flex flex-col gap-8">
        <p className="text-sm text-gray-400">{guidance.sleep.definition}</p>
        {/* 모드 선택 */}
        <div className="flex gap-3">
          {(["bedtime", "wakeup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
            >
              {m === "bedtime" ? "🌙 취침 → 기상 계산" : "⏰ 기상 → 취침 계산"}
            </button>
          ))}
        </div>

        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-neon-primary mb-4 flex items-center gap-2">
            <Moon size={18} />
            {mode === "bedtime"
              ? "잠자리에 눕는 시각을 입력하세요"
              : "일어날 시각을 입력하세요"}
          </h3>
          <input
            type="time"
            value={mode === "bedtime" ? bedtime : wakeup}
            onChange={(e) =>
              mode === "bedtime"
                ? setBedtime(e.target.value)
                : setWakeup(e.target.value)
            }
            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white text-2xl font-black focus:outline-none focus:border-neon-primary text-center"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            입면 시간 15분 포함
          </p>
        </div>

        {/* 결과 */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white">
            {mode === "bedtime" ? "계산된 기상 참고 시각" : "계산된 취침 참고 시각"}
          </h3>
          {(mode === "bedtime" ? wakeResults : bedResults).map(
            ({ cycles, label, time }) => (
              <div
                key={cycles}
                className="flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10"
              >
                <div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full mr-2 text-gray-300 bg-white/10"
                  >
                    계산 예시
                  </span>
                  <span className="text-sm text-gray-400">
                    {cycles} 사이클 · {label}
                  </span>
                </div>
                <span
                  className="text-2xl font-black text-white"
                >
                  {time}
                </span>
              </div>
            ),
          )}
        </div>

        <p className="text-sm text-gray-400">근거: <a href="https://www.nhlbi.nih.gov/health/sleep/stages-of-sleep" target="_blank" rel="noopener noreferrer" className="underline">NHLBI 수면 단계</a>와 <a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits" target="_blank" rel="noopener noreferrer" className="underline">건강한 수면 습관</a>. 90분·입면 15분은 계산 가정이며, 개인의 수면 상태를 판정하지 않습니다.</p>
        {/* 수면 사이클 안내 */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-3">
            수면 사이클 참고
          </h3>
          <div className="space-y-2">
            {CYCLE_COUNTS.map((cycles) => (
              <div
                key={cycles}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-400">
                  {cycles} 사이클 ({cyclesLabel(cycles)})
                </span>
                <span className="font-bold text-gray-300">계산 예시</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            표의 구간 수는 수면의 질이나 충분함을 판정하지 않습니다.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
