import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Gender = "male" | "female";

interface IdealWeightResult {
  bmiMin: number;
  bmiIdeal: number;
  bmiMax: number;
  broca: number;
  hamwi: number;
  currentBMI: number | null;
  currentCategory: string | null;
}

function calcIdealWeight(height: number, gender: Gender, currentWeight?: number): IdealWeightResult {
  const h = height / 100;
  const bmiMin = 18.5 * h * h;
  const bmiIdeal = 22 * h * h;
  const bmiMax = 24.9 * h * h;
  const broca = gender === "male" ? (height - 100) * 0.9 : (height - 100) * 0.85;
  const inchesOverFive = (height - 152.4) / 2.54;
  const hamwi =
    gender === "male"
      ? 48 + 2.7 * Math.max(0, inchesOverFive)
      : 45.5 + 2.2 * Math.max(0, inchesOverFive);

  let currentBMI: number | null = null;
  let currentCategory: string | null = null;
  if (currentWeight && currentWeight > 0) {
    currentBMI = currentWeight / (h * h);
    if (currentBMI < 18.5) currentCategory = "저체중";
    else if (currentBMI < 23) currentCategory = "정상";
    else if (currentBMI < 25) currentCategory = "과체중";
    else if (currentBMI < 30) currentCategory = "비만";
    else currentCategory = "고도비만";
  }

  return { bmiMin, bmiIdeal, bmiMax, broca, hamwi, currentBMI, currentCategory };
}

const CATEGORY_COLOR: Record<string, string> = {
  저체중: "text-blue-400",
  정상: "text-green-400",
  과체중: "text-yellow-400",
  비만: "text-orange-400",
  고도비만: "text-red-400",
};

const fmt = (n: number) => n.toFixed(1);

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("170");
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("");

  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || undefined;
  const result = h >= 100 && h <= 250 ? calcIdealWeight(h, gender, w) : null;

  return (
    <ToolLayout
      title="이상 체중 계산기"
      description="키와 성별을 입력하면 BMI 기준·Broca 공식·Hamwi 공식으로 이상 체중 범위를 계산합니다."
      faqs={[
        {
          question: "이상 체중 계산 공식은 어떤 것이 있나요?",
          answer: "대표적으로 세 가지 공식이 있습니다. ① BMI 기준: 정상 BMI 18.5~24.9에 해당하는 체중 범위. ② Broca 공식: 남성 (키-100)×0.9, 여성 (키-100)×0.85. ③ Hamwi 공식: 미국 의학계가 사용하는 공식으로 인치 단위 기반. 공식마다 다소 차이가 있으며 모두 참고용입니다.",
        },
        {
          question: "BMI 22를 이상 체중 기준으로 쓰는 이유는?",
          answer: "WHO 정상 범위는 BMI 18.5~24.9이며, 그 중간값인 22를 이상적인 체중 기준으로 많이 사용합니다. 한국인의 경우 BMI 23 이상을 과체중으로 보는 아시아 기준도 있어 23 미만을 목표로 삼는 경우도 있습니다.",
        },
        {
          question: "이상 체중과 실제 목표 체중은 다를 수 있나요?",
          answer: "네, 이상 체중은 통계적·의학적 평균 기준입니다. 근육량이 많은 경우 BMI가 높게 나와도 건강할 수 있고, 나이·골격·생활 방식에 따라 적합한 체중이 다릅니다. 개인 건강 목표는 의료 전문가와 상담하는 것을 권장합니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 성별 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">성별</label>
          <div className="flex gap-2">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${gender === g ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>

        {/* 키 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">키 (cm)</label>
          <input
            type="number" min={100} max={250} placeholder="e.g. 170"
            value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
        </div>

        {/* 현재 체중 (선택) */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">현재 체중 (kg) · 선택</label>
          <input
            type="number" min={1} max={500} placeholder="입력 시 현재 BMI 표시"
            value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors"
          />
        </div>

        {/* 결과 */}
        {result && (
          <div className="space-y-3">
            {/* 현재 BMI */}
            {result.currentBMI !== null && result.currentCategory && (
              <div className="card p-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">현재 BMI</span>
                <div className="text-right">
                  <span className="text-xl font-black text-white">{fmt(result.currentBMI)}</span>
                  <span className={`ml-2 text-sm font-bold ${CATEGORY_COLOR[result.currentCategory]}`}>
                    {result.currentCategory}
                  </span>
                </div>
              </div>
            )}

            <div className="card p-5 space-y-3">
              <p className="text-xs text-gray-500 font-bold tracking-widest mb-2">이상 체중 기준</p>

              {/* BMI 기준 */}
              <div className="space-y-2 pb-3 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">BMI 기준 정상 범위</span>
                  <span className="text-base font-bold text-neon-primary">
                    {fmt(result.bmiMin)} ~ {fmt(result.bmiMax)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">BMI 22 기준 이상 체중</span>
                  <span className="text-sm font-bold text-white">{fmt(result.bmiIdeal)} kg</span>
                </div>
              </div>

              {/* Broca */}
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <div>
                  <span className="text-sm text-gray-400">Broca 공식</span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({gender === "male" ? "(키-100)×0.9" : "(키-100)×0.85"})
                  </span>
                </div>
                <span className="text-base font-bold text-white">{fmt(result.broca)} kg</span>
              </div>

              {/* Hamwi */}
              <div className="flex justify-between items-center py-1">
                <div>
                  <span className="text-sm text-gray-400">Hamwi 공식</span>
                  <span className="text-xs text-gray-600 ml-2">(미국 의학 기준)</span>
                </div>
                <span className="text-base font-bold text-white">{fmt(result.hamwi)} kg</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
