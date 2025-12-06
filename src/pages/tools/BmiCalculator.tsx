import { useState, useMemo } from 'react';
import { Scale, Ruler, Activity, Info } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function BmiCalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const bmi = useMemo(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (!h || !w || h <= 0 || w <= 0) return null;

        // BMI = weight(kg) / height(m)^2
        const heightInMeters = h / 100;
        return w / (heightInMeters * heightInMeters);
    }, [height, weight]);

    const getBmiStatus = (bmi: number) => {
        if (bmi < 18.5) return { label: '저체중', color: 'text-blue-400', bg: 'bg-blue-400', range: '18.5 미만' };
        if (bmi < 23) return { label: '정상', color: 'text-green-400', bg: 'bg-green-400', range: '18.5 ~ 22.9' };
        if (bmi < 25) return { label: '과체중', color: 'text-yellow-400', bg: 'bg-yellow-400', range: '23 ~ 24.9' };
        if (bmi < 30) return { label: '경도 비만', color: 'text-orange-400', bg: 'bg-orange-400', range: '25 ~ 29.9' };
        return { label: '고도 비만', color: 'text-red-500', bg: 'bg-red-500', range: '30 이상' };
    };

    const status = bmi ? getBmiStatus(bmi) : null;

    // Calculate position for the indicator (clamped between 0 and 100%)
    const getIndicatorPosition = (bmiValue: number) => {
        // Map BMI 15~35 to 0~100%
        const min = 15;
        const max = 35;
        const percent = ((bmiValue - min) / (max - min)) * 100;
        return Math.min(Math.max(percent, 0), 100);
    };

    return (
        <ToolLayout
            title="BMI 비만도 계산기"
            description="키와 몸무게만 입력하면 비만도(BMI)를 즉시 알려드립니다. 나의 체질량지수와 건강 상태를 확인해보세요."
            keywords="BMI계산기, 비만도계산기, 체질량지수, 다이어트계산기, 비만도측정, bmi calculator"
        >
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-4">
                        <label className="text-gray-300 font-bold flex items-center gap-2">
                            <Ruler size={20} className="text-neon-primary" /> 키 (cm)
                        </label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="예: 175"
                            className="bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-xl focus:outline-none focus:border-neon-primary transition-colors"
                        />
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-4">
                        <label className="text-gray-300 font-bold flex items-center gap-2">
                            <Scale size={20} className="text-neon-secondary" /> 몸무게 (kg)
                        </label>
                        <input
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
                        <div className={`absolute top-0 left-0 w-full h-1 ${status.bg} shadow-[0_0_20px_rgba(0,0,0,0.5)]`} />

                        <h3 className="text-gray-400 mb-2">나의 BMI 지수</h3>
                        <div className="text-5xl font-black text-white mb-4 tracking-tight">
                            {bmi.toFixed(2)}
                        </div>
                        <div className={`text-2xl font-bold ${status.color} mb-8 flex items-center justify-center gap-2`}>
                            <Activity size={24} />
                            {status.label} 단계
                        </div>

                        {/* Visual Gauge */}
                        <div className="relative h-4 bg-gray-700 rounded-full mb-2 overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-[17.5%] bg-blue-400" /> {/* ~18.5 */}
                            <div className="absolute top-0 left-[17.5%] h-full w-[22.5%] bg-green-400" /> {/* 18.5~23 */}
                            <div className="absolute top-0 left-[40%] h-full w-[10%] bg-yellow-400" /> {/* 23~25 */}
                            <div className="absolute top-0 left-[50%] h-full w-[25%] bg-orange-400" /> {/* 25~30 */}
                            <div className="absolute top-0 left-[75%] h-full w-[25%] bg-red-500" /> {/* 30~ */}

                            {/* Indicator */}
                            <div
                                className="absolute top-0 w-1 h-full bg-white shadow-[0_0_10px_white] z-10 transition-all duration-500"
                                style={{ left: `${getIndicatorPosition(bmi)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 px-1">
                            <span>저체중</span>
                            <span>정상</span>
                            <span>과체중</span>
                            <span>비만</span>
                            <span>고도</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center text-gray-500 flex flex-col items-center gap-3">
                        <Info size={40} className="opacity-50" />
                        <p>키와 몸무게를 입력하면<br />결과가 여기에 표시됩니다.</p>
                    </div>
                )}

                {/* Info Guide */}
                <div className="mt-4 border-t border-white/10 pt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">📢 BMI(체질량지수)란?</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                        BMI(Body Mass Index)는 키와 몸무게를 이용해 비만도를 추정하는 지표입니다.
                        대한비만학회의 기준에 따라 다음과 같이 분류됩니다.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm text-center">
                        <div className="bg-black/20 p-3 rounded border-b-2 border-blue-400">
                            <div className="text-blue-400 font-bold">저체중</div>
                            <div className="text-gray-500 text-xs mt-1">~ 18.5</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded border-b-2 border-green-400">
                            <div className="text-green-400 font-bold">정상</div>
                            <div className="text-gray-500 text-xs mt-1">18.5 ~ 22.9</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded border-b-2 border-yellow-400">
                            <div className="text-yellow-400 font-bold">과체중</div>
                            <div className="text-gray-500 text-xs mt-1">23 ~ 24.9</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded border-b-2 border-orange-400">
                            <div className="text-orange-400 font-bold">비만</div>
                            <div className="text-gray-500 text-xs mt-1">25 ~ 29.9</div>
                        </div>
                        <div className="bg-black/20 p-3 rounded border-b-2 border-red-500">
                            <div className="text-red-500 font-bold">고도비만</div>
                            <div className="text-gray-500 text-xs mt-1">30 ~</div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-4">
                        * 근육량이 많은 경우 BMI가 높게 나올 수 있으며, 정확한 건강 상태는 전문가와 상담하시기 바랍니다.
                    </p>
                </div>
            </div>
        </ToolLayout>
    );
}
