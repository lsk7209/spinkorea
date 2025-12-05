import { useState } from 'react';
import { Coins, RotateCw } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function CoinFlip() {
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [stats, setStats] = useState({ heads: 0, tails: 0 });

    const flipCoin = () => {
        setIsFlipping(true);
        setResult(null);

        // Random outcome
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';

        setTimeout(() => {
            setResult(outcome);
            setStats(prev => ({
                ...prev,
                [outcome]: prev[outcome] + 1
            }));
            setIsFlipping(false);
        }, 1000); // 1s animation
    };

    return (
        <ToolLayout
            title="동전 던지기 (앞면/뒷면)"
            description="결정이 힘들 땐 동전을 던져보세요! 웹에서 간편하게 즐기는 3D 동전 뒤집기 게임. 앞면(숫자)과 뒷면(그림) 확률 반반!"
            keywords="동전던지기, 동전뒤집기, 코인토스, Coin Flip, 앞면뒷면, 의사결정"
        >
            <div className="flex flex-col items-center justify-center gap-10 py-8">

                {/* Stats */}
                <div className="flex gap-8 text-white/70 font-medium">
                    <div className="flex flex-col items-center">
                        <span className="text-sm">앞면 (Heads)</span>
                        <span className="text-xl text-yellow-400">{stats.heads}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-sm">뒷면 (Tails)</span>
                        <span className="text-xl text-blue-400">{stats.tails}</span>
                    </div>
                </div>

                {/* Coin Area */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 perspective-1000">
                    <div className={`
                        w-full h-full relative preserve-3d transition-transform duration-700 ease-in-out
                        ${isFlipping ? 'animate-flip' : ''}
                        ${result === 'tails' ? 'rotate-y-180' : ''}
                    `}>
                        {/* Front (Heads) */}
                        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-2xl flex items-center justify-center backface-hidden border-4 border-yellow-200">
                            <span className="text-4xl md:text-6xl font-black text-yellow-100 drop-shadow-md">
                                100
                            </span>
                        </div>

                        {/* Back (Tails) */}
                        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-blue-300 to-blue-600 shadow-2xl flex items-center justify-center backface-hidden rotate-y-180 border-4 border-blue-200">
                            <Coins size={60} className="text-blue-100 drop-shadow-md" />
                        </div>
                    </div>
                </div>

                {/* Result Label */}
                <div className="h-8 text-2xl font-bold text-white">
                    {isFlipping ? '...' : (result ? (result === 'heads' ? '앞면!' : '뒷면!') : '')}
                </div>

                {/* Action Button */}
                <button
                    onClick={flipCoin}
                    disabled={isFlipping}
                    className="w-full max-w-sm btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-neon"
                >
                    <RotateCw className={isFlipping ? 'animate-spin' : ''} size={24} />
                    {isFlipping ? '던지는 중...' : '동전 던지기'}
                </button>
            </div>

            {/* AEO Content */}
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">🪙 동전 던지기의 유래는?</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    동전 던지기(Coin Flipping)는 고대 로마 시대부터 이어져 온 가장 오래된 확률 게임이자 의사결정 방식입니다.
                    "Navia aut Caput" (배냐 머리냐)라고 불렸으며, 당시 동전의 앞면에는 황제의 머리가, 뒷면에는 배가 그려져 있었기 때문입니다.
                </p>
                <h3 className="text-lg font-semibold text-white mb-2">활용 예시</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                    <li>축구 경기 시작 전 진영 선택 (Kick-off)</li>
                    <li>점심 메뉴 짬뽕 vs 짜장면 결정</li>
                    <li>간단한 내기 승패 결정</li>
                </ul>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                
                @keyframes flip {
                    0% { transform: rotateY(0) scale(1); }
                    50% { transform: rotateY(900deg) scale(1.5); }
                    100% { transform: rotateY(1800deg) scale(1); }
                }
                .animate-flip {
                    animation: flip 0.7s ease-out;
                }
            `}</style>
        </ToolLayout>
    );
}
