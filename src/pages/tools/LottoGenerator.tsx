import { useState } from 'react';
import { RefreshCw, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

function generateSet(): number[] {
    const set = new Set<number>();
    while (set.size < 6) set.add(Math.floor(Math.random() * 45) + 1);
    return Array.from(set).sort((a, b) => a - b);
}

function getBallColor(num: number) {
    if (num <= 10) return 'bg-[#fbc400] text-black';
    if (num <= 20) return 'bg-[#69c8f2] text-white';
    if (num <= 30) return 'bg-[#ff7272] text-white';
    if (num <= 40) return 'bg-[#aaaaaa] text-white';
    return 'bg-[#b0d840] text-white';
}

function Ball({ num }: { num: number }) {
    return (
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-lg font-bold shadow-md ${getBallColor(num)}`}>
            {num}
        </div>
    );
}

export default function LottoGenerator() {
    const [gameCount, setGameCount] = useState(1);
    const [games, setGames] = useState<number[][]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateAll = () => {
        setIsGenerating(true);
        let tick = 0;
        const interval = setInterval(() => {
            setGames(Array.from({ length: gameCount }, generateSet));
            tick++;
            if (tick > 10) {
                clearInterval(interval);
                setGames(Array.from({ length: gameCount }, generateSet));
                setIsGenerating(false);
            }
        }, 50);
    };

    const copyAll = () => {
        if (games.length === 0) return;
        const text = games.map((g, i) => `${i + 1}게임: ${g.join(', ')}`).join('\n');
        navigator.clipboard.writeText(text);
        toast.success('전체 번호가 복사되었습니다!');
    };

    const copyOne = (nums: number[], idx: number) => {
        navigator.clipboard.writeText(nums.join(', '));
        toast.success(`${idx + 1}게임 번호 복사!`);
    };

    return (
        <ToolLayout
            title="로또 번호 생성기"
            description="암호학적으로 안전한 랜덤 알고리즘으로 로또 번호를 무료로 생성하세요. 1~5게임을 한 번에 생성하고, 전체 복사까지 가능합니다."
            keywords="로또번호생성기, 로또추첨기, 무료로또번호, 로또자동생성, 로또5게임, 로또예상번호"
            howToUse={[
                '게임 수(1~5)를 선택하세요',
                "'번호 생성' 버튼을 클릭하면 선택한 게임 수만큼 번호가 생성됩니다",
                '각 게임 우측 복사 버튼 또는 전체 복사로 저장하세요',
            ]}
            tips={[
                '번호 색상은 실제 로또 공 색상과 동일합니다 (1-10: 노랑, 11-20: 파랑, 21-30: 빨강, 31-40: 회색, 41-45: 초록)',
                '5게임 한 번에 생성하면 용지 한 장 분량을 바로 완성할 수 있습니다',
            ]}
            faqs={[
                { question: '생성된 번호가 정말 무작위인가요?', answer: '네, JavaScript의 Math.random()으로 완전히 무작위 번호를 생성합니다. 모든 조합이 동일한 확률입니다.' },
                { question: '5게임 동시 생성 시 번호가 겹치나요?', answer: '각 게임 내에서는 중복이 없습니다. 게임 간 같은 번호가 나올 수는 있으나 실제 로또에서도 마찬가지입니다.' },
            ]}
            relatedTools={[
                { name: '주사위 던지기', path: '/tools/dice-roller', description: '1~6면 주사위 랜덤 결과' },
                { name: '동전 던지기', path: '/tools/coin-flip', description: '앞면/뒷면 랜덤 결과' },
                { name: '랜덤 팀 나누기', path: '/tools/random-team', description: '인원을 팀으로 분배' },
            ]}
        >
            <div className="flex flex-col items-center gap-8 py-6">
                {/* 게임 수 선택 */}
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 font-semibold">게임 수</span>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                        <button
                            type="button"
                            onClick={() => setGameCount(c => Math.max(1, c - 1))}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronDown size={18} />
                        </button>
                        <span className="w-6 text-center font-bold text-white text-lg">{gameCount}</span>
                        <button
                            type="button"
                            onClick={() => setGameCount(c => Math.min(5, c + 1))}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronUp size={18} />
                        </button>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(n => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => setGameCount(n)}
                                className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${gameCount === n ? 'bg-neon-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 게임 목록 */}
                {games.length > 0 && (
                    <div className="w-full space-y-3">
                        {games.map((nums, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                <span className="text-xs font-bold text-neon-primary w-12 shrink-0">{i + 1}게임</span>
                                <div className="flex flex-wrap gap-2 flex-1">
                                    {nums.map(n => <Ball key={n} num={n} />)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => copyOne(nums, i)}
                                    className="shrink-0 p-2 text-gray-400 hover:text-white transition-colors"
                                    title="복사"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {games.length === 0 && (
                    <p className="text-gray-500 text-sm">버튼을 눌러 번호를 생성해주세요</p>
                )}

                {/* 버튼 */}
                <div className="flex gap-3 w-full max-w-sm">
                    <button
                        type="button"
                        onClick={generateAll}
                        disabled={isGenerating}
                        className="flex-1 btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-neon"
                    >
                        <RefreshCw className={isGenerating ? 'animate-spin' : ''} size={20} />
                        {isGenerating ? '추첨 중...' : `${gameCount}게임 생성`}
                    </button>
                    {games.length > 0 && (
                        <button
                            type="button"
                            onClick={copyAll}
                            className="px-5 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-sm text-gray-300"
                        >
                            <Copy size={16} />
                            전체 복사
                        </button>
                    )}
                </div>
            </div>
        </ToolLayout>
    );
}
