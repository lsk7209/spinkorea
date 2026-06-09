import { useState } from "react";
import { Scale } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number, dec = 1) {
  return n.toFixed(dec);
}

// U.S. Navy Method
function navyBodyFat(
  gender: "male" | "female",
  height: number,
  waist: number,
  neck: number,
  hip: number
): number {
  if (height <= 0 || waist <= 0 || neck <= 0) return 0;
  if (gender === "male") {
    return (
      495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    );
  } else {
    if (hip <= 0) return 0;
    return (
      495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450
    );
  }
}

function getCategory(bf: number, gender: "male" | "female") {
  if (gender === "male") {
    if (bf < 6) return { label: "필수 지방", color: "text-blue-400", bg: "bg-blue-400/10" };
    if (bf < 14) return { label: "운동선수", color: "text-green-400", bg: "bg-green-400/10" };
    if (bf < 18) return { label: "건강 체형", color: "text-cyan-400", bg: "bg-cyan-400/10" };
    if (bf < 25) return { label: "보통", color: "text-yellow-400", bg: "bg-yellow-400/10" };
    return { label: "비만", color: "text-red-400", bg: "bg-red-400/10" };
  } else {
    if (bf < 14) return { label: "필수 지방", color: "text-blue-400", bg: "bg-blue-400/10" };
    if (bf < 21) return { label: "운동선수", color: "text-green-400", bg: "bg-green-400/10" };
    if (bf < 25) return { label: "건강 체형", color: "text-cyan-400", bg: "bg-cyan-400/10" };
    if (bf < 32) return { label: "보통", color: "text-yellow-400", bg: "bg-yellow-400/10" };
    return { label: "비만", color: "text-red-400", bg: "bg-red-400/10" };
  }
}

const MALE_RANGES = [
  { label: "필수 지방", range: "2–5%", color: "bg-blue-400" },
  { label: "운동선수", range: "6–13%", color: "bg-green-400" },
  { label: "건강 체형", range: "14–17%", color: "bg-cyan-400" },
  { label: "보통", range: "18–24%", color: "bg-yellow-400" },
  { label: "비만", range: "25%+", color: "bg-red-400" },
];
const FEMALE_RANGES = [
  { label: "필수 지방", range: "10–13%", color: "bg-blue-400" },
  { label: "운동선수", range: "14–20%", color: "bg-green-400" },
  { label: "건강 체형", range: "21–24%", color: "bg-cyan-400" },
  { label: "보통", range: "25–31%", color: "bg-yellow-400" },
  { label: "비만", range: "32%+", color: "bg-red-400" },
];

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("70");
  const [waist, setWaist] = useState("80");
  const [neck, setNeck] = useState("37");
  const [hip, setHip] = useState("95");

  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;
  const wa = parseFloat(waist) || 0;
  const ne = parseFloat(neck) || 0;
  const hi = parseFloat(hip) || 0;

  const bf = navyBodyFat(gender, h, wa, ne, hi);
  const bfValid = bf > 0 && bf < 80;
  const category = bfValid ? getCategory(bf, gender) : null;

  const fatMass = bfValid ? (w * bf) / 100 : 0;
  const leanMass = w - fatMass;

  const ranges = gender === "male" ? MALE_RANGES : FEMALE_RANGES;

  return (
    <ToolLayout
      title="체지방률 계산기 | Navy Method 체성분 분석"
      description="허리·목·엉덩이 둘레와 키를 입력하면 U.S. Navy Method로 체지방률과 체지방 질량을 계산합니다."
      keywords="체지방률계산기, 체지방계산기, 체성분계산기, 체지방퍼센트, 다이어트계산기, 비만도"
      howToUse={[
        "성별, 키, 몸무게를 입력하세요.",
        "허리·목(·여성은 엉덩이) 둘레를 cm 단위로 입력하세요.",
        "미해군(Navy) 공식으로 체지방률과 체지방 질량을 계산합니다.",
      ]}
      tips={[
        "허리 둘레는 배꼽 위 가장 가는 부분을 측정하세요.",
        "목 둘레는 후두 돌기(목울대) 바로 아래를 측정하세요.",
        "여성은 엉덩이 가장 넓은 부분도 입력해야 합니다.",
        "체지방률은 BMI보다 체성분을 더 정확히 반영하지만 DEXA 같은 정밀 검사와는 차이가 있습니다.",
      ]}
      faqs={[
        {
          question: "BMI와 체지방률의 차이는?",
          answer: "BMI는 키·몸무게만으로 계산해 근육량을 반영하지 못합니다. 체지방률은 실제 지방 비율을 측정해 같은 몸무게라도 근육량에 따라 체성분이 다름을 보여줍니다.",
        },
        {
          question: "Navy Method란?",
          answer: "미해군이 개발한 체지방 추정 공식으로, 신체 둘레 측정만으로 체지방률을 계산합니다. 정밀도는 DEXA보다 낮지만 별도 장비 없이 간편하게 측정할 수 있습니다.",
        },
        {
          question: "이상적인 체지방률은?",
          answer: "남성은 14~17%(건강 체형), 여성은 21~24%가 건강 체형 범위입니다. 운동선수는 더 낮고, 나이가 들수록 자연스럽게 높아집니다.",
        },
      ]}
      relatedTools={[
        { name: "BMI 계산기", path: "/tools/bmi-calculator", description: "체질량지수 측정" },
        { name: "칼로리 계산기", path: "/tools/calorie-calculator", description: "기초대사량·일일 권장 칼로리" },
        { name: "단위 변환기", path: "/tools/unit-converter", description: "길이·무게 단위 변환" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <Scale size={20} /> 체지방률 계산 (Navy Method)
          </h3>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">성별</label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${gender === g ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"}`}
                >
                  {g === "male" ? "남성" : "여성"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: "키 (cm)", value: height, set: setHeight },
              { label: "몸무게 (kg)", value: weight, set: setWeight },
              { label: "허리 둘레 (cm)", value: waist, set: setWaist },
              { label: "목 둘레 (cm)", value: neck, set: setNeck },
              ...(gender === "female" ? [{ label: "엉덩이 둘레 (cm)", value: hip, set: setHip }] : []),
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {bfValid ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "체지방률", value: `${fmt(bf)}%`, color: "text-neon-primary" },
                { label: "체지방 질량", value: `${fmt(fatMass)} kg`, color: "text-red-400" },
                { label: "제지방 질량", value: `${fmt(leanMass)} kg`, color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className={`text-xl font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-400 mb-2">체성분 분류</p>
              <span className={`text-2xl font-black px-4 py-2 rounded-xl ${category?.bg} ${category?.color}`}>
                {category?.label}
              </span>
            </div>
          </>
        ) : (
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center text-gray-400">
            모든 수치를 입력하면 체지방률이 계산됩니다.
          </div>
        )}

        {/* 기준표 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">
            체지방률 분류 기준 ({gender === "male" ? "남성" : "여성"})
          </h3>
          <div className="space-y-2">
            {ranges.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${r.color} shrink-0`} />
                <span className="text-sm text-gray-300 w-24">{r.label}</span>
                <span className="text-sm text-gray-400">{r.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
