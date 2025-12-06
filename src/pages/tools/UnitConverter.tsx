import { useState, useEffect } from 'react';
import { Ruler, Scale, Box, Home } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

type UnitType = 'length' | 'weight' | 'area' | 'volume';

const UNITS: Record<UnitType, { id: string; label: string; ratio: number }[]> = {
    length: [
        { id: 'mm', label: '밀리미터 (mm)', ratio: 0.001 },
        { id: 'cm', label: '센티미터 (cm)', ratio: 0.01 },
        { id: 'm', label: '미터 (m)', ratio: 1 },
        { id: 'km', label: '킬로미터 (km)', ratio: 1000 },
        { id: 'in', label: '인치 (in)', ratio: 0.0254 },
        { id: 'ft', label: '피트 (ft)', ratio: 0.3048 },
        { id: 'yd', label: '야드 (yd)', ratio: 0.9144 },
        { id: 'mi', label: '마일 (mile)', ratio: 1609.344 },
    ],
    weight: [
        { id: 'mg', label: '밀리그램 (mg)', ratio: 0.000001 },
        { id: 'g', label: '그램 (g)', ratio: 0.001 },
        { id: 'kg', label: '킬로그램 (kg)', ratio: 1 },
        { id: 't', label: '톤 (ton)', ratio: 1000 },
        { id: 'oz', label: '온스 (oz)', ratio: 0.0283495 },
        { id: 'lb', label: '파운드 (lb)', ratio: 0.453592 },
        { id: 'don', label: '돈 (금)', ratio: 0.00375 },
    ],
    area: [
        { id: 'm2', label: '제곱미터 (m²)', ratio: 1 },
        { id: 'py', label: '평', ratio: 3.305785 },
        { id: 'ft2', label: '제곱피트 (ft²)', ratio: 0.092903 },
        { id: 'yd2', label: '제곱야드 (yd²)', ratio: 0.836127 },
        { id: 'ac', label: '에이커 (ac)', ratio: 4046.86 },
        { id: 'ha', label: '헥타르 (ha)', ratio: 10000 },
    ],
    volume: [
        { id: 'ml', label: '밀리리터 (ml)', ratio: 0.001 },
        { id: 'l', label: '리터 (L)', ratio: 1 },
        { id: 'gal', label: '갤런 (gal)', ratio: 3.78541 },
        { id: 'cc', label: 'cc', ratio: 0.001 },
        { id: 'cup', label: '컵 (cup)', ratio: 0.2 },
    ]
};

export default function UnitConverter() {
    const [type, setType] = useState<UnitType>('length');
    const [fromUnit, setFromUnit] = useState(UNITS.length[2].id); // m
    const [toUnit, setToUnit] = useState(UNITS.length[3].id);   // km
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');

    // Reset units when type changes
    useEffect(() => {
        setFromUnit(UNITS[type][0].id);
        setToUnit(UNITS[type][1].id);
        setValue('');
        setResult('');
    }, [type]);

    // Calculation
    useEffect(() => {
        if (!value) {
            setResult('');
            return;
        }

        const val = parseFloat(value);
        if (isNaN(val)) return;

        const from = UNITS[type].find(u => u.id === fromUnit);
        const to = UNITS[type].find(u => u.id === toUnit);

        if (from && to) {
            // Convert to base unit -> Convert to target unit
            const baseValue = val * from.ratio;
            const targetValue = baseValue / to.ratio;

            // Smart formatting
            let formatted = targetValue.toString();
            if (targetValue % 1 !== 0) {
                // Avoid floating point errors like 0.30000000004
                formatted = parseFloat(targetValue.toFixed(6)).toString();
            }
            setResult(formatted);
        }
    }, [value, fromUnit, toUnit, type]);

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
        setValue(result); // Optional: Move result to input
    };

    return (
        <ToolLayout
            title="단위 변환기 (길이, 무게, 평수)"
            description="길이, 무게, 넓이(평수), 부피 등 다양한 단위를 쉽고 빠르게 변환하세요. 평/제곱미터 변환, cm/인치 변환 등 필수 기능을 제공합니다."
            keywords="단위변환기, 평수계산기, 길이변환, 무게변환, 부피변환, unit converter, 제곱미터평변환"
        >
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">

                {/* Type Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <button
                        onClick={() => setType('length')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${type === 'length' ? 'bg-neon-primary text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <Ruler size={18} /> 길이
                    </button>
                    <button
                        onClick={() => setType('weight')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${type === 'weight' ? 'bg-neon-secondary text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <Scale size={18} /> 무게
                    </button>
                    <button
                        onClick={() => setType('area')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${type === 'area' ? 'bg-green-400 text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <Home size={18} /> 넓이(평)
                    </button>
                    <button
                        onClick={() => setType('volume')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${type === 'volume' ? 'bg-blue-400 text-black font-bold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        <Box size={18} /> 부피
                    </button>
                </div>

                {/* Converter Card */}
                <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 relative">

                    {/* FROM */}
                    <div className="w-full flex-1">
                        <label className="text-gray-400 text-sm mb-2 block">변환할 값</label>
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-t-lg px-4 py-2 text-gray-300 focus:outline-none mb-1"
                        >
                            {UNITS[type].map(u => (
                                <option key={u.id} value={u.id}>{u.label}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="입력하세요"
                            className="w-full bg-black/30 border border-white/20 rounded-b-lg px-4 py-4 text-white text-2xl font-bold focus:outline-none focus:border-neon-primary"
                        />
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={handleSwap}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-neon-primary rotate-90 md:rotate-0"
                        aria-label="Swap units"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 10h14l-4-4" /><path d="M17 14H3l4 4" />
                        </svg>
                    </button>

                    {/* TO */}
                    <div className="w-full flex-1">
                        <label className="text-gray-400 text-sm mb-2 block">결과 값</label>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-t-lg px-4 py-2 text-gray-300 focus:outline-none mb-1"
                        >
                            {UNITS[type].map(u => (
                                <option key={u.id} value={u.id}>{u.label}</option>
                            ))}
                        </select>
                        <div className="w-full bg-black/30 border border-white/20 rounded-b-lg px-4 py-4 text-neon-secondary text-2xl font-bold min-h-[66px] flex items-center">
                            {result || '-'}
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="text-center text-sm text-gray-500">
                    * 소수점 6자리까지 계산되며, 유효숫자에 따라 반올림될 수 있습니다.
                </div>
            </div>
        </ToolLayout>
    );
}
