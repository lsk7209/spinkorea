import { useState, useEffect } from 'react';
import { Clock, Timer, Hourglass, Plus, Minus } from 'lucide-react';
import { format, addMinutes, subMinutes, differenceInMinutes, parse, startOfToday } from 'date-fns';
import ToolLayout from '@/components/ToolLayout';

export default function TimeCalculator() {
    // Mode 1: Time Difference (Start - End)
    const [diffStart, setDiffStart] = useState('09:00');
    const [diffEnd, setDiffEnd] = useState('18:00');
    const [diffResult, setDiffResult] = useState('');

    // Mode 2: Add/Subtract Time
    const [baseTime, setBaseTime] = useState('12:00');
    const [addHours, setAddHours] = useState('');
    const [addMinutesVal, setAddMinutesVal] = useState('');
    const [calcType, setCalcType] = useState<'add' | 'sub'>('add');
    const [calcResult, setCalcResult] = useState('');

    useEffect(() => {
        // Mode 1 Calculation
        if (diffStart && diffEnd) {
            const today = startOfToday();
            const start = parse(diffStart, 'HH:mm', today);
            let end = parse(diffEnd, 'HH:mm', today);

            // If end is before start, assume next day
            if (end < start) {
                end = addMinutes(end, 24 * 60);
            }

            const diffMins = differenceInMinutes(end, start);
            const hours = Math.floor(diffMins / 60);
            const mins = diffMins % 60;
            setDiffResult(`${hours}시간 ${mins}분`);
        }
    }, [diffStart, diffEnd]);

    useEffect(() => {
        // Mode 2 Calculation
        if (baseTime) {
            const today = startOfToday();
            const base = parse(baseTime, 'HH:mm', today);

            const hoursToAdd = parseInt(addHours || '0');
            const minutesToAdd = parseInt(addMinutesVal || '0');
            const totalMinutes = (hoursToAdd * 60) + minutesToAdd;

            if (totalMinutes === 0) {
                setCalcResult(format(base, 'HH:mm'));
                return;
            }

            let resultDate;
            if (calcType === 'add') {
                resultDate = addMinutes(base, totalMinutes);
            } else {
                resultDate = subMinutes(base, totalMinutes);
            }

            // Format result (handle next day notation if needed, but HH:mm is standard)
            // Just HH:mm is fine for daily calc
            setCalcResult(format(resultDate, 'HH:mm'));
        }
    }, [baseTime, addHours, addMinutesVal, calcType]);

    return (
        <ToolLayout
            title="시간 계산기 (시간 차이, 더하기/빼기)"
            description="두 시간 사이의 간격을 계산하거나, 특정 시간에서 몇 시간/분을 더하고 빼는 계산을 쉽게 하세요. 근무 시간 계산, 도착 예정 시간 확인에 유용합니다."
            keywords="시간계산기, 근무시간계산, 시급계산, 시간더하기, 시간빼기, time calculator, time duration"
        >
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">

                {/* 1. Time Difference */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Hourglass size={100} />
                    </div>
                    <h3 className="text-lg font-bold text-neon-primary mb-6 flex items-center gap-2">
                        <Timer size={20} /> 시간 차이 계산 (소요 시간)
                    </h3>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full">
                            <label className="text-gray-400 text-sm mb-1 block">시작 시간</label>
                            <input
                                type="time"
                                value={diffStart}
                                onChange={(e) => setDiffStart(e.target.value)}
                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-neon-primary"
                            />
                        </div>
                        <span className="text-gray-500 mt-6">~</span>
                        <div className="flex-1 w-full">
                            <label className="text-gray-400 text-sm mb-1 block">종료 시간</label>
                            <input
                                type="time"
                                value={diffEnd}
                                onChange={(e) => setDiffEnd(e.target.value)}
                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-neon-primary"
                            />
                        </div>
                    </div>
                    <div className="mt-6 text-center bg-black/20 p-4 rounded-lg border border-white/5">
                        <span className="text-gray-400 text-sm mr-2">총 소요 시간</span>
                        <span className="text-3xl font-bold text-white block md:inline mt-1 md:mt-0">{diffResult}</span>
                    </div>
                </div>

                {/* 2. Add/Subtract Time */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock size={100} />
                    </div>
                    <h3 className="text-lg font-bold text-neon-secondary mb-6 flex items-center gap-2">
                        <Clock size={20} /> 시간 더하기 / 빼기
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">기준 시간</label>
                            <input
                                type="time"
                                value={baseTime}
                                onChange={(e) => setBaseTime(e.target.value)}
                                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-neon-secondary"
                            />
                        </div>

                        <div className="flex items-center justify-center gap-4 my-2">
                            <button
                                onClick={() => setCalcType('add')}
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${calcType === 'add' ? 'bg-neon-secondary text-black font-bold' : 'bg-white/10 text-gray-400'}`}
                            >
                                <Plus size={18} /> 더하기
                            </button>
                            <button
                                onClick={() => setCalcType('sub')}
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${calcType === 'sub' ? 'bg-red-400 text-black font-bold' : 'bg-white/10 text-gray-400'}`}
                            >
                                <Minus size={18} /> 빼기
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={addHours}
                                    onChange={(e) => setAddHours(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:border-neon-secondary"
                                />
                                <span className="block text-center text-gray-500 text-xs mt-1">시간</span>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={addMinutesVal}
                                    onChange={(e) => setAddMinutesVal(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:border-neon-secondary"
                                />
                                <span className="block text-center text-gray-500 text-xs mt-1">분</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center bg-black/20 p-4 rounded-lg border border-white/5">
                            <span className="text-gray-400 text-sm mr-2">계산 결과</span>
                            <span className={`text-3xl font-bold block md:inline mt-1 md:mt-0 ${calcType === 'add' ? 'text-neon-secondary' : 'text-red-400'}`}>
                                {calcResult}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
