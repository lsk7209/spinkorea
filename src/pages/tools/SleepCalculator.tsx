import { useState } from "react";
import { Moon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

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

  const qualityInfo = [
    { cycles: 4, hours: "6시간", quality: "최소", color: "text-yellow-400" },
    { cycles: 5, hours: "7.5시간", quality: "적정", color: "text-green-400" },
    { cycles: 6, hours: "9시간", quality: "충분", color: "text-cyan-400" },
  ];

  return (
    <ToolLayout
      title="수면 시간 계산기 | 90분 사이클 기준 최적 기상·취침 시각"
      description="취침 시각 또는 기상 시각을 입력하면 90분 수면 사이클 기준으로 최적 기상·취침 시각을 자동 계산합니다."
      keywords="수면계산기, 수면시간계산기, 기상시간계산기, 수면사이클, 최적기상시각, 잠자는시간"
      howToUse={[
        "취침 시각 → 기상 시각: 잠드는 시각을 입력하면 최적 기상 시각을 계산합니다.",
        "기상 시각 → 취침 시각: 일어날 시각을 입력하면 최적 취침 시각을 계산합니다.",
        "수면 사이클(4~6회) 중 생활에 맞는 시각을 선택하세요.",
      ]}
      tips={[
        "수면은 약 90분 단위로 사이클이 돌아갑니다. 사이클 중간에 일어나면 더 피곤합니다.",
        "평균 입면(잠드는 데 걸리는 시간)은 약 15분으로 반영되어 있습니다.",
        "성인 권장 수면은 7~9시간(5~6 사이클)입니다.",
        "같은 시간에 자고 일어나는 규칙적인 수면이 수면의 질을 높입니다.",
      ]}
      faqs={[
        {
          question: "왜 90분 단위로 계산하나요?",
          answer: "인간의 수면은 얕은 수면 → 깊은 수면 → REM 수면이 약 90분 주기로 반복됩니다. 이 사이클이 끝나는 시점에 일어나면 자연스럽게 깨어나 덜 피곤합니다.",
        },
        {
          question: "알람을 몇 사이클에 맞춰야 할까요?",
          answer: "최소 5사이클(7.5시간)을 권장합니다. 시간이 부족하다면 4사이클(6시간)이 3사이클(4.5시간)보다 훨씬 낫습니다. 사이클 중간(예: 6~7시간)보다 사이클 완료 시점이 기상에 유리합니다.",
        },
        {
          question: "잠드는 데 시간이 더 걸리면 어떻게 되나요?",
          answer: "이 계산기는 입면 시간을 15분으로 가정합니다. 실제로 잠드는 데 더 오래 걸린다면 취침 시각을 조금 앞당기는 것이 좋습니다.",
        },
      ]}
      relatedTools={[
        { name: "타이머", path: "/tools/timer", description: "수면 타이머·알람 설정" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "중요한 날까지 D-Day 계산" },
        { name: "칼로리 계산기", path: "/tools/calorie-calculator", description: "기초대사량·일일 권장 칼로리" },
      ]}
    >
      <div className="flex flex-col gap-8">
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
            {mode === "bedtime" ? "잠드는 시각을 입력하세요" : "일어날 시각을 입력하세요"}
          </h3>
          <input
            type="time"
            value={mode === "bedtime" ? bedtime : wakeup}
            onChange={(e) => mode === "bedtime" ? setBedtime(e.target.value) : setWakeup(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-4 text-white text-2xl font-black focus:outline-none focus:border-neon-primary text-center"
          />
          <p className="text-xs text-gray-500 mt-2 text-center">입면 시간 15분 포함</p>
        </div>

        {/* 결과 */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white">
            {mode === "bedtime" ? "추천 기상 시각" : "추천 취침 시각"}
          </h3>
          {(mode === "bedtime" ? wakeResults : bedResults).map(({ cycles, label, time }, i) => (
            <div
              key={cycles}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${i === 1 ? "bg-neon-primary/10 border-neon-primary/50" : "bg-white/5 border-white/10"}`}
            >
              <div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mr-2 ${qualityInfo[i].color} bg-white/10`}>
                  {qualityInfo[i].quality}
                </span>
                <span className="text-sm text-gray-400">{cycles} 사이클 · {label}</span>
              </div>
              <span className={`text-2xl font-black ${i === 1 ? "text-neon-primary" : "text-white"}`}>
                {time}
              </span>
            </div>
          ))}
        </div>

        {/* 수면 사이클 안내 */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
          <h3 className="text-sm font-bold text-white mb-3">수면 사이클 참고</h3>
          <div className="space-y-2">
            {qualityInfo.map((q) => (
              <div key={q.cycles} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{q.cycles} 사이클 ({q.hours})</span>
                <span className={`font-bold ${q.color}`}>{q.quality}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">성인 권장 수면: 7~9시간 (5~6 사이클)</p>
        </div>
      </div>
    </ToolLayout>
  );
}
