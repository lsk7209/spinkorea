import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Mode = "speed" | "distance" | "time";

const MODE_LABELS: Record<Mode, string> = {
  speed: "속도 계산",
  distance: "거리 계산",
  time: "시간 계산",
};

const SPEED_PRESETS = [
  { name: "걷기", speed: 5 },
  { name: "조깅", speed: 10 },
  { name: "자전거", speed: 20 },
  { name: "자동차", speed: 100 },
  { name: "KTX", speed: 305 },
];

function formatTime(hours: number): string {
  const totalSec = Math.round(hours * 3600);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}시간`);
  if (m > 0) parts.push(`${m}분`);
  if (s > 0 || parts.length === 0) parts.push(`${s}초`);
  return parts.join(" ");
}

export default function SpeedCalculator() {
  const [mode, setMode] = useState<Mode>("speed");
  const [distance, setDistance] = useState("");
  const [timeH, setTimeH] = useState("");
  const [timeM, setTimeM] = useState("");
  const [speed, setSpeed] = useState("");

  const distNum = parseFloat(distance) || 0;
  const totalHours = (parseFloat(timeH) || 0) + (parseFloat(timeM) || 0) / 60;
  const speedNum = parseFloat(speed) || 0;

  type Result = { label: string; value: string; sub?: string } | null;
  let result: Result = null;

  if (mode === "speed" && distNum > 0 && totalHours > 0) {
    const kmh = distNum / totalHours;
    result = {
      label: "속도",
      value: `${kmh.toFixed(2)} km/h`,
      sub: `${(kmh / 3.6).toFixed(2)} m/s · ${(kmh * 0.621371).toFixed(2)} mph`,
    };
  } else if (mode === "distance" && speedNum > 0 && totalHours > 0) {
    const km = speedNum * totalHours;
    result = {
      label: "거리",
      value: `${km.toFixed(3)} km`,
      sub: `${(km * 1000).toFixed(0)} m`,
    };
  } else if (mode === "time" && distNum > 0 && speedNum > 0) {
    const h = distNum / speedNum;
    result = { label: "소요 시간", value: formatTime(h) };
  }

  const handleSpeedPreset = (s: number) => {
    setSpeed(String(s));
    if (mode === "speed") setMode("distance");
  };

  return (
    <ToolLayout
      title="속도 계산기"
      description="거리·시간·속도 중 두 값을 입력하면 나머지를 자동 계산합니다. km/h, m/s, mph 변환도 지원합니다."
      faqs={[
        {
          question: "속도·거리·시간 계산 공식이 무엇인가요?",
          answer: "속도 = 거리 ÷ 시간, 거리 = 속도 × 시간, 시간 = 거리 ÷ 속도입니다. 단위를 통일하는 것이 중요합니다. 속도를 km/h로 쓸 때 시간은 시간(h) 단위를 사용해야 합니다.",
        },
        {
          question: "km/h를 m/s로 변환하는 방법은?",
          answer: "km/h ÷ 3.6 = m/s입니다. 예를 들어 100km/h = 약 27.78m/s입니다. 반대로 m/s × 3.6 = km/h로 변환합니다.",
        },
        {
          question: "서울-부산(325km)을 자동차로 가면 얼마나 걸리나요?",
          answer: "고속도로 평균 100km/h 기준으로 325 ÷ 100 = 3.25시간 = 3시간 15분입니다. 휴게소 정차, 교통 상황에 따라 실제 시간은 달라질 수 있습니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 모드 선택 */}
        <div className="flex gap-2">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setDistance(""); setTimeH(""); setTimeM(""); setSpeed(""); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === m ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* 거리 입력 (속도·시간 모드에서 표시) */}
        {mode !== "distance" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">거리 (km)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 325"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>
        )}

        {/* 시간 입력 (속도·거리 모드에서 표시) */}
        {mode !== "time" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">시간</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={timeH}
                  onChange={(e) => setTimeH(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors pr-10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">시간</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="0"
                  value={timeM}
                  onChange={(e) => setTimeM(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">분</span>
              </div>
            </div>
          </div>
        )}

        {/* 속도 입력 (거리·시간 모드에서 표시) */}
        {mode !== "speed" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">속도 (km/h)</label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 100"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {SPEED_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setSpeed(String(p.speed))}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
                >
                  {p.name} ({p.speed})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 거리 입력 (거리 계산 모드) */}
        {mode === "distance" && (
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-500 text-center">
            속도와 시간을 모두 입력하면 거리가 계산됩니다.
          </div>
        )}

        {/* 속도 프리셋 (속도 계산 모드) */}
        {mode === "speed" && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-gray-500 w-full">일반 속도 기준</span>
            {SPEED_PRESETS.map((p) => (
              <div key={p.name} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-500">
                {p.name}: {p.speed}km/h
              </div>
            ))}
          </div>
        )}

        {/* 결과 */}
        {result && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-sm text-gray-400">{result.label}</span>
              <span className="text-2xl font-black text-neon-primary">{result.value}</span>
            </div>
            {result.sub && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">변환</span>
                <span className="text-sm text-gray-300">{result.sub}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
