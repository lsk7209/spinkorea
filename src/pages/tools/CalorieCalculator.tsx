import { useState } from "react";
import { Flame } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

const ACTIVITY_LEVELS = [
  { label: "거의 안 움직임", desc: "사무직, 주로 앉아서 생활", factor: 1.2 },
  { label: "가벼운 활동", desc: "주 1~3회 가벼운 운동", factor: 1.375 },
  { label: "보통 활동", desc: "주 3~5회 운동", factor: 1.55 },
  { label: "활동적", desc: "주 6~7회 강도 높은 운동", factor: 1.725 },
  { label: "매우 활동적", desc: "하루 2회 운동·육체노동", factor: 1.9 },
];

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");
  const [activityIdx, setActivityIdx] = useState(1);

  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;
  const a = parseFloat(age) || 0;

  // Harris-Benedict (revised Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

  const tdee = bmr * ACTIVITY_LEVELS[activityIdx].factor;

  const goals = [
    { label: "빠른 감량 (-1kg/주)", cal: tdee - 1000, color: "text-red-400", badge: "bg-red-400/10 text-red-400" },
    { label: "일반 감량 (-0.5kg/주)", cal: tdee - 500, color: "text-orange-400", badge: "bg-orange-400/10 text-orange-400" },
    { label: "체중 유지", cal: tdee, color: "text-cyan-400", badge: "bg-neon-primary/10 text-neon-primary" },
    { label: "근육 증가 (+0.25kg/주)", cal: tdee + 250, color: "text-green-400", badge: "bg-green-400/10 text-green-400" },
  ];

  // 3대 영양소 권장 분배 (유지 기준)
  const protein = (tdee * 0.25) / 4; // 25% 단백질
  const carb = (tdee * 0.5) / 4;     // 50% 탄수화물
  const fat = (tdee * 0.25) / 9;      // 25% 지방

  const bmi = h > 0 ? w / ((h / 100) ** 2) : 0;
  const idealWeight = gender === "male" ? (h - 100) * 0.9 : (h - 100) * 0.85;

  return (
    <ToolLayout
      title="칼로리 계산기 | 기초대사량(BMR)·일일 권장 칼로리"
      description="성별·나이·키·몸무게와 활동량을 입력하면 기초대사량(BMR)과 목표별 일일 권장 칼로리를 자동 계산합니다."
      keywords="칼로리계산기, 기초대사량계산기, BMR계산기, 일일권장칼로리, 다이어트칼로리, 체중감량칼로리"
      howToUse={[
        "성별, 나이, 키, 몸무게를 입력하세요.",
        "활동 수준을 선택하면 일일 총 소비 칼로리(TDEE)가 계산됩니다.",
        "체중 목표에 따른 권장 칼로리를 확인하세요.",
      ]}
      tips={[
        "BMR은 완전히 쉬는 상태에서 생명 유지에 필요한 최소 칼로리입니다.",
        "빠른 감량(-1000kcal)은 장기간 유지하면 근육 손실 위험이 있습니다.",
        "섭취 칼로리보다 영양 밀도와 단백질 섭취가 체성분 변화에 더 중요합니다.",
        "Mifflin-St Jeor 공식 기준이며 개인 차이가 있을 수 있습니다.",
      ]}
      faqs={[
        {
          question: "기초대사량(BMR)이란 무엇인가요?",
          answer: "아무것도 하지 않고 24시간 누워 있어도 생명 유지를 위해 소비되는 최소 칼로리입니다. 호흡, 체온 유지, 장기 기능 등에 사용됩니다.",
        },
        {
          question: "TDEE와 BMR의 차이는?",
          answer: "TDEE(Total Daily Energy Expenditure)는 하루 총 소비 칼로리로, BMR에 활동량 계수를 곱한 값입니다. 실제 체중 관리에는 TDEE를 기준으로 섭취량을 조절합니다.",
        },
        {
          question: "얼마나 먹어야 살이 빠지나요?",
          answer: "체지방 1kg ≈ 7700kcal. 매일 500kcal를 TDEE보다 적게 먹으면 이론적으로 주 0.5kg 감량입니다. 단, 500kcal 이상 결핍은 장기간 지속 시 근육 손실을 유발할 수 있어 주의가 필요합니다.",
        },
      ]}
      relatedTools={[
        { name: "BMI 계산기", path: "/tools/bmi-calculator", description: "체질량지수 측정" },
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "시급·월급·연봉 환산" },
        { name: "연봉 실수령액 계산기", path: "/tools/net-salary", description: "4대보험 공제 후 실수령액" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 입력 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5 flex items-center gap-2">
            <Flame size={20} /> 칼로리 계산
          </h3>

          {/* 성별 */}
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

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { label: "나이 (세)", value: age, set: setAge },
              { label: "키 (cm)", value: height, set: setHeight },
              { label: "몸무게 (kg)", value: weight, set: setWeight },
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

          {/* 활동 수준 */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">활동 수준</label>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((level, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivityIdx(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${activityIdx === i ? "bg-neon-primary/15 border border-neon-primary/50" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}
                >
                  <div>
                    <span className={`text-sm font-bold ${activityIdx === i ? "text-neon-primary" : "text-gray-300"}`}>{level.label}</span>
                    <span className="text-xs text-gray-500 ml-2">{level.desc}</span>
                  </div>
                  <span className="text-xs text-gray-400">×{level.factor}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 주요 결과 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "기초대사량(BMR)", value: `${fmt(bmr)} kcal`, color: "text-blue-400" },
            { label: "일일 소비(TDEE)", value: `${fmt(tdee)} kcal`, color: "text-neon-primary" },
            { label: "BMI", value: bmi.toFixed(1), color: "text-orange-400" },
            { label: "표준 체중", value: `${idealWeight.toFixed(1)} kg`, color: "text-green-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* 목표별 권장 칼로리 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">목표별 일일 권장 칼로리</h3>
          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.label} className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${g.badge}`}>{g.label}</span>
                <span className={`text-base font-black ${g.color}`}>{fmt(Math.max(g.cal, 1200))} kcal</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">* 최소 1,200kcal(여성) / 1,500kcal(남성) 이하 섭취는 권장하지 않습니다.</p>
        </div>

        {/* 영양소 배분 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-base font-bold text-white mb-4">권장 영양소 배분 (유지 기준, 2:5:2 비율)</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "단백질 (25%)", value: `${fmt(protein)} g`, color: "text-red-400", bar: "bg-red-400" },
              { label: "탄수화물 (50%)", value: `${fmt(carb)} g`, color: "text-yellow-400", bar: "bg-yellow-400" },
              { label: "지방 (25%)", value: `${fmt(fat)} g`, color: "text-blue-400", bar: "bg-blue-400" },
            ].map(({ label, value, color, bar }) => (
              <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
                <div className={`w-3 h-3 rounded-full ${bar} mx-auto mb-2`} />
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className={`text-lg font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
