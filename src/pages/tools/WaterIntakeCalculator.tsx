import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type ActivityLevel = "light" | "moderate" | "heavy";

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string; factor: number }[] = [
  { value: "light",    label: "가벼운 활동", desc: "주로 앉아서 생활, 가끔 걷기", factor: 30 },
  { value: "moderate", label: "보통 활동",   desc: "하루 30~60분 이상 활동", factor: 35 },
  { value: "heavy",    label: "격렬한 활동", desc: "운동·육체 노동 등 활발한 활동", factor: 40 },
];

const EXERCISE_PRESETS = [0, 30, 60, 90, 120];

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [exercise, setExercise] = useState("0");
  const [hotWeather, setHotWeather] = useState(false);

  const w = parseFloat(weight) || 0;
  const ex = parseInt(exercise) || 0;
  const factor = ACTIVITY_OPTIONS.find((a) => a.value === activity)!.factor;

  const valid = w > 0;
  const base = valid ? w * factor : 0;
  const exerciseAdd = Math.floor(ex / 30) * 350;
  const weatherAdd = hotWeather ? 500 : 0;
  const total = base + exerciseAdd + weatherAdd;

  const glasses = valid ? Math.ceil(total / 250) : 0;
  const bottles = valid ? (total / 500).toFixed(1) : "0";

  return (
    <ToolLayout
      title="수분 섭취량 계산기"
      description="체중·활동량·운동 시간으로 하루 권장 수분 섭취량을 계산합니다. 물 잔 수와 페트병 수로도 확인할 수 있습니다."
      faqs={[
        {
          question: "하루 권장 수분 섭취량 계산 공식은?",
          answer: "체중(kg) × 30~40ml가 기본 공식입니다. 가벼운 활동 30ml/kg, 보통 활동 35ml/kg, 격렬한 활동 40ml/kg를 적용합니다. 운동 30분마다 350ml, 더운 날씨에는 500ml를 추가합니다.",
        },
        {
          question: "물을 충분히 마셨는지 확인하는 방법은?",
          answer: "소변 색깔이 가장 쉬운 지표입니다. 연한 노란색(옥수수색)이면 적절한 수분 상태, 진한 노란색이면 수분 부족, 무색에 가까우면 과다 수분 섭취 상태입니다.",
        },
        {
          question: "커피·차·음료도 수분 섭취로 인정되나요?",
          answer: "일부 인정됩니다. 일반 물이 가장 이상적이지만 카페인이 없는 음료(허브차, 주스)는 약 80%, 커피·녹차는 약 50~60%를 수분으로 볼 수 있습니다. 음식의 수분 함량도 약 20~30%를 기여합니다.",
        },
        {
          question: "더운 날 수분이 더 필요한 이유는?",
          answer: "기온이 높거나 땀을 많이 흘릴 때 체내 수분 손실이 증가합니다. 30도 이상의 더운 날씨나 사우나 이후에는 최소 500ml를 추가로 섭취하는 것이 권장됩니다.",
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

        {/* 활동 수준 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">활동 수준</label>
          <div className="space-y-2">
            {ACTIVITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setActivity(opt.value)}
                className={`w-full px-4 py-3 rounded-xl text-left transition-all ${activity === opt.value ? "bg-neon-primary/20 border border-neon-primary/50 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
              >
                <div className="font-bold text-sm">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{opt.desc} · {opt.factor}ml/kg</div>
              </button>
            ))}
          </div>
        </div>

        {/* 운동 시간 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">오늘 운동 시간 (분)</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {EXERCISE_PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setExercise(String(m))}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
              >
                {m === 0 ? "없음" : `${m}분`}
              </button>
            ))}
          </div>
        </div>

        {/* 더운 날씨 */}
        <div>
          <button
            type="button"
            onClick={() => setHotWeather((v) => !v)}
            className={`w-full px-4 py-3 rounded-xl text-left transition-all ${hotWeather ? "bg-orange-500/20 border border-orange-500/50 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
          >
            <div className="font-bold text-sm">☀️ 더운 날씨 또는 땀 많이 흘림 (+500ml)</div>
            <div className="text-xs text-gray-500 mt-0.5">30도 이상, 사우나, 격렬한 야외 활동 등</div>
          </button>
        </div>

        {/* 결과 */}
        {valid && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">기본 권장량</span>
              <span className="text-base font-bold text-white">{Math.round(base).toLocaleString()} ml</span>
            </div>
            {exerciseAdd > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-gray-400">운동 추가</span>
                <span className="text-base font-bold text-cyan-400">+{exerciseAdd.toLocaleString()} ml</span>
              </div>
            )}
            {weatherAdd > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-sm text-gray-400">더위 추가</span>
                <span className="text-base font-bold text-orange-400">+{weatherAdd.toLocaleString()} ml</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">하루 권장 수분량</span>
              <span className="text-2xl font-black text-neon-primary">{Math.round(total).toLocaleString()} ml</span>
            </div>
            <div className="flex gap-4 pt-1">
              <div className="flex-1 text-center bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">물 잔 (250ml)</p>
                <p className="text-xl font-black text-white">{glasses}잔</p>
              </div>
              <div className="flex-1 text-center bg-white/5 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">페트병 (500ml)</p>
                <p className="text-xl font-black text-white">{bottles}병</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
