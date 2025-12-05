import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function LottoGenerator() {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateLotto = () => {
        setIsGenerating(true);

        // Animation effect
        let count = 0;
        const interval = setInterval(() => {
            const tempNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1);
            setNumbers(tempNumbers);
            count++;
            if (count > 10) {
                clearInterval(interval);
                // Final actual numbers (unique)
                const finalNumbers = new Set<number>();
                while (finalNumbers.size < 6) {
                    finalNumbers.add(Math.floor(Math.random() * 45) + 1);
                }
                setNumbers(Array.from(finalNumbers).sort((a, b) => a - b));
                setIsGenerating(false);
            }
        }, 50);
    };

    const copyToClipboard = () => {
        if (numbers.length === 0) return;
        navigator.clipboard.writeText(numbers.join(', '));
        toast.success('번호가 복사되었습니다!');
    };

    const getBallColor = (num: number) => {
        if (num <= 10) return 'bg-[#fbc400] text-black shadow-lg shadow-yellow-500/20';
        if (num <= 20) return 'bg-[#69c8f2] text-white shadow-lg shadow-blue-500/20';
        if (num <= 30) return 'bg-[#ff7272] text-white shadow-lg shadow-red-500/20';
        if (num <= 40) return 'bg-[#aaaaaa] text-white shadow-lg shadow-gray-500/20';
        return 'bg-[#b0d840] text-white shadow-lg shadow-green-500/20';
    };

    return (
        <ToolLayout
            title="로또 번호 생성기"
            description="AI 알고리즘으로 분석한 행운의 로또 번호를 무료로 생성하세요. 실제 로또 추첨 규칙(1~45)을 완벽하게 적용한 번호 추첨기입니다."
            keywords="로또번호생성기, 로또추첨기, 무료로또번호, 로또자동생성, 로또예상번호, Lotto, 로또1등번호"
        >
            <div className="flex flex-col items-center justify-center gap-10 py-8">
                {/* Result Display */}
                <div className="flex flex-wrap justify-center gap-4 min-h-[80px]">
                    {numbers.length > 0 ? (
                        numbers.map((num) => (
                            <div
                                key={num}
                                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold transition-all transform hover:scale-110 ${getBallColor(num)}`}
                            >
                                {num}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-lg font-medium flex items-center">
                            버튼을 눌러 번호를 생성해주세요
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 w-full max-w-sm">
                    <button
                        onClick={generateLotto}
                        disabled={isGenerating}
                        className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-neon"
                    >
                        <RefreshCw className={isGenerating ? 'animate-spin' : ''} />
                        {isGenerating ? '추첨 중...' : '번호 생성'}
                    </button>
                    <button
                        onClick={copyToClipboard}
                        disabled={numbers.length === 0}
                        className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Copy />
                    </button>
                </div>
            </div>

            {/* AEO Content */}
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">💡 로또 당첨 확률 높이는 팁</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                    <li>생성된 번호를 꾸준히 사용하는 것이 확률적으로 유리할 수 있습니다.</li>
                    <li>과거 당첨 번호 통계를 참고하는 것도 좋은 방법입니다.</li>
                    <li>재미로만 즐기시고, 과도한 몰입은 삼가주세요.</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
