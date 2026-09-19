import { useState, useMemo } from "react";
import { Scale, Ruler, Activity, Info } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

export default function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = useMemo(() => {
    const h = Number(height);
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;

    // BMI = weight(kg) / height(m)^2
    const heightInMeters = h / 100;
    const value = w / (heightInMeters * heightInMeters);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [height, weight]);

  const getBmiStatus = (bmi: number) => {
    if (bmi < 18.5)
      return {
        label: "저체중",
        color: "text-blue-400",
        bg: "bg-blue-400",
        range: "18.5 미만",
      };
    if (bmi < 23)
      return {
        label: "정상",
        color: "text-green-400",
        bg: "bg-green-400",
        range: "18.5 이상 23 미만",
      };
    if (bmi < 25)
      return {
        label: "비만전단계 (과체중)",
        color: "text-yellow-400",
        bg: "bg-yellow-400",
        range: "23 이상 25 미만",
      };
    if (bmi < 30)
      return {
        label: "1단계 비만",
        color: "text-orange-400",
        bg: "bg-orange-400",
        range: "25 이상 30 미만",
      };
    if (bmi < 35)
      return {
        label: "2단계 비만",
        color: "text-red-400",
        bg: "bg-red-400",
        range: "30 이상 35 미만",
      };
    return {
      label: "3단계 비만 (고도비만)",
      color: "text-rose-600",
      bg: "bg-rose-600",
      range: "35 이상",
    };
  };

  const status = bmi ? getBmiStatus(bmi) : null;
  const formattedBmi = bmi === null ? "" : bmi >= 1e21 ? bmi.toExponential(2) : (Math.floor(bmi * 100) / 100).toFixed(2);

  // Calculate position for the indicator (clamped between 0 and 100%)
  const getIndicatorPosition = (bmiValue: number) => {
    // Map BMI 15~40 to 0~100%; values outside the range stay at the ends.
    const min = 15;
    const max = 40;
    const percent = ((bmiValue - min) / (max - min)) * 100;
    return Math.min(Math.max(percent, 0), 100);
  };

  return (
    <ToolLayout
      title="BMI 비만도 계산기"
      description="키와 몸무게로 BMI 수치와 국내 성인 분류를 확인하세요. BMI는 개인의 건강 상태를 단독으로 판정하는 값이 아닙니다."
      keywords="BMI계산기, 비만도계산기, 체질량지수, 다이어트계산기, 비만도측정, bmi calculator"
      sources={[{ name: "대한비만학회 비만 진료지침 2022: 성인 분류", url: "https://general.kosso.or.kr/html/user/core/view/reaction/main/kosso/inc/data/guideline2022_vol8.pdf" }, { name: "질병관리청 국가건강정보포털 BMI 분류 안내", url: "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=6774" }]}
      reviewedAt="2026-09-20"
      disclaimer="국내 성인 기준으로 BMI 23 이상 25 미만은 비만전단계, 25 이상은 비만입니다. 30 이상 35 미만은 2단계, 35 이상은 3단계 비만입니다. BMI는 선별 지표이며 진단이 아니므로 건강 판단은 의료 전문가와 상담하세요. 소아·청소년에게 이 성인 분류를 적용하지 마세요."
      howToUse={[
        "키(cm)를 입력하세요 (예: 170).",
        "몸무게(kg)를 입력하세요 (예: 65).",
        "BMI 수치와 국내 성인 분류를 참고할 수 있습니다.",
        "분류 기준과 BMI의 한계도 함께 확인하세요.",
      ]}
      faqs={[
        {
          question: "BMI 정상 범위는 얼마인가요?",
          answer:
            "이 계산기는 국내 성인 기준을 사용합니다. BMI 18.5 이상 23 미만은 정상, 23 이상 25 미만은 비만전단계(과체중), 25 이상은 비만입니다. 비만은 25 이상 30 미만 1단계, 30 이상 35 미만 2단계, 35 이상 3단계로 구분합니다.",
        },
        {
          question: "BMI만으로 건강을 판단할 수 있나요?",
          answer:
            "BMI는 키와 체중으로 계산하므로 체중에서 근육과 지방이 차지하는 비율을 구분하지 못합니다. 개인의 건강 상태를 이 수치만으로 판단할 수 없으며, 필요한 평가는 의료 전문가와 상담하세요.",
        },
        {
          question: "키와 몸무게는 어떻게 입력하나요?",
          answer:
            "키는 cm 단위(예: 170), 몸무게는 kg 단위(예: 65)로 입력하세요. 소수점도 입력 가능합니다.",
        },
      ]}
      relatedTools={[
        {
          name: "칼로리 계산기",
          path: "/tools/calorie-calculator",
          description: "기초대사량·일일 권장 칼로리 계산",
        },
        {
          name: "만 나이 계산기",
          path: "/tools/age-calculator",
          description: "만 나이, 세는 나이 한번에 계산",
        },
        {
          name: "단위 변환기",
          path: "/tools/unit-converter",
          description: "kg↔lb, cm↔inch 단위 변환",
        },
      ]}
    >
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-4">
            <label className="text-gray-300 font-bold flex items-center gap-2" htmlFor="bmi-calculator-1">
              <Ruler size={20} className="text-neon-primary" /> 키 (cm)
            </label>
            <input id="bmi-calculator-1"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="예: 175"
              className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-neon-primary transition-colors"
            />
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-4">
            <label className="text-gray-300 font-bold flex items-center gap-2" htmlFor="bmi-calculator-2">
              <Scale size={20} className="text-neon-secondary" /> 몸무게 (kg)
            </label>
            <input id="bmi-calculator-2"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="예: 70"
              className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-neon-secondary transition-colors"
            />
          </div>
        </div>

        {/* Result */}
        {bmi !== null && status !== null ? (
          <div className="bg-white/10 border border-white/20 p-8 rounded-2xl text-center relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 w-full h-1 ${status.bg} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
            />

            <h3 className="text-gray-400 mb-2">나의 BMI 지수</h3>
            <div className="text-5xl font-black text-white mb-4 tracking-tight">
              {formattedBmi}
            </div>
            <div
              className={`text-2xl font-bold ${status.color} mb-8 flex items-center justify-center gap-2`}
            >
              <Activity size={24} />
              {status.label}
            </div>
            <p className="text-sm text-gray-400 mb-2">분류 범위: {status.range}</p>
            <p className="text-xs text-gray-500 mb-4">표시는 소수 둘째 자리까지 버림하며, 분류는 계산값을 기준으로 합니다.</p>

            {/* Visual Gauge */}
            <div className="relative h-4 bg-gray-700 rounded-full mb-2 overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[14%] bg-blue-400" />
              <div className="absolute top-0 left-[14%] h-full w-[18%] bg-green-400" />
              <div className="absolute top-0 left-[32%] h-full w-[8%] bg-yellow-400" />
              <div className="absolute top-0 left-[40%] h-full w-[20%] bg-orange-400" />
              <div className="absolute top-0 left-[60%] h-full w-[20%] bg-red-400" />
              <div className="absolute top-0 left-[80%] h-full w-[20%] bg-rose-600" />
              {/* Indicator */}
              <div
                className="absolute top-0 w-1 h-full bg-white shadow-[0_0_10px_white] z-10 transition-all duration-500"
                style={{ left: `clamp(0px, ${getIndicatorPosition(bmi)}%, calc(100% - 4px))` }}
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs text-gray-500 px-1">
              <span>저체중</span>
              <span>정상</span>
              <span>비만전단계</span>
              <span>1단계 비만</span>
              <span>2단계 비만</span>
              <span>3단계 비만</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">그래프는 BMI 15~40 범위이며, 범위 밖의 값은 양 끝에 표시됩니다.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-500 flex flex-col items-center gap-3">
            <Info size={40} className="opacity-50" />
            <p>
              0보다 큰 유효한 키와 몸무게를 입력하면
              <br />
              결과가 여기에 표시됩니다.
            </p>
          </div>
        )}

        {/* Info Guide */}
        <div className="mt-4 border-t border-white/10 pt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            📢 BMI(체질량지수)란?
          </h3>
          <p className="text-gray-400 mb-4 leading-relaxed">
            BMI(Body Mass Index)는 키와 몸무게를 이용해 비만도를 추정하는
            선별 지표입니다. 대한비만학회의 국내 성인 기준에 따라 다음과 같이 분류됩니다.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-center">
            <div className="bg-black/20 p-3 rounded border-b-2 border-blue-400">
              <div className="text-blue-400 font-bold">저체중</div>
              <div className="text-gray-500 text-xs mt-1">18.5 미만</div>
            </div>
            <div className="bg-black/20 p-3 rounded border-b-2 border-green-400">
              <div className="text-green-400 font-bold">정상</div>
              <div className="text-gray-500 text-xs mt-1">18.5 이상 23 미만</div>
            </div>
            <div className="bg-black/20 p-3 rounded border-b-2 border-yellow-400">
              <div className="text-yellow-400 font-bold">비만전단계 (과체중)</div>
              <div className="text-gray-500 text-xs mt-1">23 이상 25 미만</div>
            </div>
            <div className="bg-black/20 p-3 rounded border-b-2 border-orange-400">
              <div className="text-orange-400 font-bold">1단계 비만</div>
              <div className="text-gray-500 text-xs mt-1">25 이상 30 미만</div>
            </div>
            <div className="bg-black/20 p-3 rounded border-b-2 border-red-400">
              <div className="text-red-400 font-bold">2단계 비만</div>
              <div className="text-gray-500 text-xs mt-1">30 이상 35 미만</div>
            </div>
            <div className="bg-black/20 p-3 rounded border-b-2 border-rose-600">
              <div className="text-rose-600 font-bold">3단계 비만 (고도비만)</div>
              <div className="text-gray-500 text-xs mt-1">35 이상</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            * 근육량이 많은 경우 BMI가 높게 나올 수 있으며, 정확한 건강 상태는
            전문가와 상담하시기 바랍니다.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
