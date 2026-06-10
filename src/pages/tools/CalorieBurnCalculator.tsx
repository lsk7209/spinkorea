import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
interface Activity {
  name: string;
  met: number;
}

const ACTIVITIES: Activity[] = [
  { name: "걷기 (4km/h)", met: 3.0 },
  { name: "빠른 걷기 (6km/h)", met: 4.5 },
  { name: "달리기 (8km/h)", met: 8.0 },
  { name: "빠른 달리기 (12km/h)", met: 11.0 },
  { name: "자전거 (일반)", met: 6.0 },
  { name: "수영", met: 7.0 },
  { name: "줄넘기", met: 10.0 },
  { name: "등산", met: 7.0 },
  { name: "헬스 (웨이트)", met: 4.0 },
  { name: "계단 오르기", met: 8.0 },
  { name: "요가", met: 3.0 },
  { name: "축구", met: 8.0 },
  { name: "배드민턴", met: 5.5 },
  { name: "농구", met: 6.5 },
];

const MINUTE_PRESETS = [15, 30, 45, 60, 90, 120];

export default function CalorieBurnCalculator() {
  const [weight, setWeight] = useState("70");
  const [actIdx, setActIdx] = useState(0);
  const [minutes, setMinutes] = useState("30");

  const w = parseFloat(weight);
  const m = parseFloat(minutes);
  const activity = ACTIVITIES[actIdx];

  const valid = !isNaN(w) && !isNaN(m) && w > 0 && m > 0;
  const calories = valid ? activity.met * w * (m / 60) : null;
  const fatGram = calories !== null ? calories / 9.0 : null;

  return (
    <ToolLayout
      title="칼로리 소모 계산기"
      description="운동 종류·체중·운동 시간으로 소모 칼로리와 지방 연소량을 계산합니다."
      faqs={[
        {
          question: "MET란 무엇인가요?",
          answer: "MET(대사당량, Metabolic Equivalent of Task)는 안정 시 산소 소비량 대비 활동 강도를 나타내는 단위입니다. MET가 높을수록 같은 시간 동안 더 많은 칼로리를 소모합니다.",
        },
        {
          question: "소모 칼로리 계산 공식이 무엇인가요?",
          answer: "소모 칼로리(kcal) = MET × 체중(kg) × 운동 시간(시간)입니다. 예를 들어 70kg인 사람이 MET 8.0인 달리기를 30분 하면 8.0 × 70 × 0.5 = 280kcal를 소모합니다.",
        },
        {
          question: "지방 1g을 소모하려면 몇 kcal가 필요한가요?",
          answer: "지방 1g은 약 9kcal입니다. 체지방 1kg을 소모하려면 약 7,200kcal가 필요하므로, 매일 500kcal를 추가 소모하면 약 2주 안에 1kg 감량을 기대할 수 있습니다.",
        },
        {
          question: "실제 소모 칼로리와 차이가 날 수 있나요?",
          answer: "근육량, 운동 강도, 체온, 숙련도에 따라 실제와 차이가 날 수 있습니다. 이 계산기는 MET 기반 추정값을 제공하며 참고용으로 활용하세요.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 체중 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">체중 (kg)</label>
          <input
            type="number"
            min={1}
            max={300}
            placeholder="e.g. 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
        </div>

        {/* 활동 선택 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">활동 종류</label>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITIES.map((act, i) => (
              <button
                key={act.name}
                type="button"
                onClick={() => setActIdx(i)}
                className={`px-3 py-2.5 rounded-xl text-left text-sm transition-all ${actIdx === i ? "bg-neon-primary/20 border border-neon-primary/50 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
              >
                <div className="font-medium text-xs leading-snug">{act.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">MET {act.met}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 운동 시간 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">운동 시간 (분)</label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 30"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {MINUTE_PRESETS.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setMinutes(String(min))}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
              >
                {min}분
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {calories !== null && fatGram !== null && (
          <div className="card p-5 space-y-3">
            <p className="text-xs text-gray-500 text-center mb-1">
              {activity.name} · {minutes}분 · {weight}kg
            </p>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">소모 칼로리</span>
              <span className="text-2xl font-black text-neon-primary">{Math.round(calories).toLocaleString()} kcal</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">지방 연소량</span>
              <span className="text-base font-bold text-orange-400">{fatGram.toFixed(1)} g</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-400">MET 지수</span>
              <span className="text-base font-bold text-gray-300">{activity.met}</span>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
