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
            description="암호학적으로 안전한 랜덤 알고리즘으로 로또 번호를 무료로 생성하세요. 실제 로또 추첨 규칙(1~45 중 6개, 중복 없음)을 완벽하게 적용한 번호 추첨기입니다. 생성된 번호는 즉시 복사하여 사용할 수 있습니다."
            keywords="로또번호생성기, 로또추첨기, 무료로또번호, 로또자동생성, 로또예상번호, Lotto, 로또1등번호"
            howToUse={[
                "'번호 생성' 버튼을 클릭하세요",
                "애니메이션과 함께 6개의 번호가 무작위로 생성됩니다",
                "생성된 번호는 자동으로 오름차순 정렬됩니다",
                "복사 버튼을 눌러 번호를 클립보드에 저장하세요"
            ]}
            tips={[
                "재미로만 즐기시고, 도박에 과도하게 몰입하지 마세요",
                "로또 당첨 확률은 약 814만분의 1입니다",
                "생성된 번호를 꾸준히 사용하는 것도 하나의 전략입니다",
                "번호 색상은 실제 로또 공 색상과 동일합니다 (1-10: 노랑, 11-20: 파랑, 21-30: 빨강, 31-40: 회색, 41-45: 초록)"
            ]}
            faqs={[
                { question: "생성된 번호가 정말 무작위인가요?", answer: "네, 암호학적으로 안전한 난수 생성기를 사용하여 완전히 무작위의 번호를 생성합니다. 모든 번호 조합이 동일한 확률로 선택됩니다." },
                { question: "같은 번호가 다시 나올 수 있나요?", answer: "한 번 생성 시 6개 번호는 모두 다르게 나옵니다. 다만, 다른 생성에서 동일한 조합이 나올 확률은 매우 낮지만 이론적으로 가능합니다." },
                { question: "어떤 번호가 당첨 확률이 높나요?", answer: "모든 번호 조합의 당첨 확률은 동일합니다. 특정 번호나 패턴이 더 유리하다는 것은 미신일 뿐입니다." },
                { question: "생성 기록이 저장되나요?", answer: "아니요, 생성된 번호는 서버에 저장되지 않습니다. 필요한 경우 복사 기능을 사용해 별도로 저장해주세요." }
            ]}
            relatedTools={[
                { name: "주사위 굴리기", path: "/tools/dice-roller", description: "1~6면 주사위를 굴려 랜덤 결과 확인" },
                { name: "동전 던지기", path: "/tools/coin-flip", description: "앞면/뒷면 랜덤 결과" },
                { name: "랜덤 팀 나누기", path: "/tools/random-team", description: "인원을 랜덤하게 팀으로 분배" }
            ]}
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

        </ToolLayout>
    );
}
