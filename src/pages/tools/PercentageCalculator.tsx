import { useState, useEffect } from 'react';
import { Percent, ArrowRight, RefreshCw } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function PercentageCalculator() {
    // Mode 1: What is X% of Y?
    const [val1_A, setVal1_A] = useState('');
    const [val1_B, setVal1_B] = useState('');
    const [res1, setRes1] = useState<number | null>(null);

    // Mode 2: X is what % of Y?
    const [val2_A, setVal2_A] = useState('');
    const [val2_B, setVal2_B] = useState('');
    const [res2, setRes2] = useState<number | null>(null);

    // Mode 3: Percentage Change (Increase/Decrease)
    const [val3_A, setVal3_A] = useState('');
    const [val3_B, setVal3_B] = useState('');
    const [res3, setRes3] = useState<number | null>(null);

    useEffect(() => {
        // Calculate Mode 1
        if (val1_A && val1_B) {
            setRes1((parseFloat(val1_A) / 100) * parseFloat(val1_B));
        } else setRes1(null);

        // Calculate Mode 2
        if (val2_A && val2_B) {
            setRes2((parseFloat(val2_A) / parseFloat(val2_B)) * 100);
        } else setRes2(null);

        // Calculate Mode 3
        if (val3_A && val3_B) {
            const a = parseFloat(val3_A);
            const b = parseFloat(val3_B);
            if (a !== 0) {
                setRes3(((b - a) / a) * 100);
            }
        } else setRes3(null);

    }, [val1_A, val1_B, val2_A, val2_B, val3_A, val3_B]);

    return (
        <ToolLayout
            title="퍼센트 계산기 (할인율, 인상률)"
            description="전체 값의 몇 퍼센트는 얼마인지, 값이 얼마만큼 증가하거나 감소했는지(증감률) 등 실생활에 필요한 퍼센트 계산을 쉽게 해결하세요."
            keywords="퍼센트계산기, 백분율계산기, 할인율계산기, 인상률계산, 비율계산기, percentage calculator"
        >
            <div className="flex flex-col gap-8">

                {/* Case 1: Percentage Value */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-neon-primary mb-4 flex items-center gap-2">
                        <Percent size={20} /> 전체 값의 비율 구하기
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="shrink-0">전체 값</span>
                            <input
                                type="number"
                                value={val1_B}
                                onChange={(e) => setVal1_B(e.target.value)}
                                placeholder="예: 10000"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-32 focus:outline-none focus:border-neon-primary"
                            />
                            <span className="shrink-0">의</span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <input
                                type="number"
                                value={val1_A}
                                onChange={(e) => setVal1_A(e.target.value)}
                                placeholder="예: 20"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-24 focus:outline-none focus:border-neon-primary"
                            />
                            <span className="shrink-0">%는?</span>
                        </div>
                        <div className="md:ml-auto w-full md:w-auto text-right md:text-left">
                            <span className="text-gray-400 mr-3 text-sm">결과</span>
                            <span className="text-2xl font-bold text-yellow-500">
                                {res1 !== null ? res1.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Case 2: What Percentage? */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <Percent size={20} /> 일부 값의 비율(%) 구하기
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="shrink-0">전체 값</span>
                            <input
                                type="number"
                                value={val2_B}
                                onChange={(e) => setVal2_B(e.target.value)}
                                placeholder="예: 50"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-32 focus:outline-none focus:border-blue-400"
                            />
                            <span className="shrink-0">중에서</span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <input
                                type="number"
                                value={val2_A}
                                onChange={(e) => setVal2_A(e.target.value)}
                                placeholder="예: 5"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-24 focus:outline-none focus:border-blue-400"
                            />
                            <span className="shrink-0">은?</span>
                        </div>
                        <div className="md:ml-auto w-full md:w-auto text-right md:text-left">
                            <span className="text-gray-400 mr-3 text-sm">결과</span>
                            <span className="text-2xl font-bold text-blue-400">
                                {res2 !== null ? res2.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Case 3: Percentage Change */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                        <RefreshCw size={20} /> 증감률(투익률) 계산하기
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="shrink-0">기존 값</span>
                            <input
                                type="number"
                                value={val3_A}
                                onChange={(e) => setVal3_A(e.target.value)}
                                placeholder="예: 1000"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-32 focus:outline-none focus:border-green-400"
                            />
                            <span className="shrink-0">에서</span>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="shrink-0">변경된 값</span>
                            <input
                                type="number"
                                value={val3_B}
                                onChange={(e) => setVal3_B(e.target.value)}
                                placeholder="예: 1500"
                                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white w-full md:w-32 focus:outline-none focus:border-green-400"
                            />
                            <span className="shrink-0">으로</span>
                        </div>
                        <div className="md:ml-auto w-full md:w-auto text-right md:text-left flex flex-col items-end md:items-start">
                            <span className="text-gray-400 text-sm mb-1">변화율</span>
                            <span className={`text-2xl font-bold ${res3 && res3 > 0 ? 'text-red-400' : res3 && res3 < 0 ? 'text-blue-400' : 'text-gray-300'
                                }`}>
                                {res3 !== null ? (res3 > 0 ? `▲ ${res3.toLocaleString()}%` : res3 < 0 ? `▼ ${Math.abs(res3).toLocaleString()}%` : '0%') : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* AEO Content */}
                <div className="mt-8 border-t border-white/10 pt-8">
                    <h3 className="text-lg font-semibold text-white mb-4">💡 퍼센트 계산 공식 요약</h3>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-neon-secondary font-bold mb-2">① 전체의 X% 값 구하기</p>
                            <p className="text-gray-400">전체값 × (비율 ÷ 100)</p>
                            <p className="text-gray-500 mt-2 text-xs">예: 10,000원의 20% = 10,000 × 0.2 = 2,000원</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-blue-400 font-bold mb-2">② 전체 중 일부의 비율(%)</p>
                            <p className="text-gray-400">(일부값 ÷ 전체값) × 100</p>
                            <p className="text-gray-500 mt-2 text-xs">예: 50명 중 5명 = (5÷50) × 100 = 10%</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <p className="text-green-400 font-bold mb-2">③ 증감률 (수익률)</p>
                            <p className="text-gray-400">((나중값 - 처음값) ÷ 처음값) × 100</p>
                            <p className="text-gray-500 mt-2 text-xs">예: 1,000 → 1,500 = (500÷1000) × 100 = 50% 증가</p>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
