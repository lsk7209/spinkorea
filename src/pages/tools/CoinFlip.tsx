import { useState } from "react";
import { Coins, RotateCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { getSecureRandomInt } from "@/utils/random";
import { trackToolCompleted } from "@/utils/analytics";

export default function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    setIsFlipping(true);
    setResult(null);

    // Random outcome
    const outcome = getSecureRandomInt(2) === 0 ? "heads" : "tails";

    setTimeout(() => {
      setResult(outcome);
      setStats((prev) => ({
        ...prev,
        [outcome]: prev[outcome] + 1,
      }));
      setIsFlipping(false);
      trackToolCompleted("/tools/coin-flip", "coin_flip");
    }, 1000); // 1s animation
  };

  return (
    <ToolLayout
      title="동전 던지기 (앞면/뒷면)"
      description="두 후보 중 하나를 정할 때 사용하는 온라인 동전 던지기입니다. 브라우저의 난수로 앞면 또는 뒷면을 보여주며 공식 추첨용은 아닙니다."
      keywords="동전던지기, 동전뒤집기, 코인토스, Coin Flip, 앞면뒷면, 의사결정"
      howToUse={[
        "'던지기' 버튼을 클릭하세요.",
        "동전이 회전하며 결과가 표시됩니다.",
        "앞면(HEAD) 또는 뒷면(TAIL) 결과를 확인하세요.",
      ]}
      faqs={[
        {
          question: "앞면과 뒷면의 확률이 정확히 50%인가요?",
          answer:
            "각 실행은 앞면과 뒷면 중 하나를 같은 선택 공간에서 고릅니다. 여러 번 연속으로 같은 면이 나와도 다음 실행의 결과가 바뀌지는 않으며, 공식 추첨이나 금전 분쟁의 증빙 도구는 아닙니다.",
        },
        {
          question: "연속으로 같은 면이 나올 수 있나요?",
          answer:
            "가능합니다. 각 실행은 이전 결과를 보정하지 않고 앞면과 뒷면 중 하나를 다시 선택하므로 같은 면이 연속으로 나올 수 있습니다.",
        },
      ]}
      relatedTools={[
        {
          name: "주사위 던지기",
          path: "/tools/dice-roller",
          description: "다면체 주사위 시뮬레이션",
        },
        {
          name: "Yes or No",
          path: "/tools/yes-no-oracle",
          description: "결정 장애 즉시 해결",
        },
        {
          name: "랜덤 팀 편성",
          path: "/tools/random-team",
          description: "공정한 팀 나누기",
        },
      ]}
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
          <div
            className={`
                        w-full h-full relative preserve-3d transition-transform duration-700 ease-in-out
                        ${isFlipping ? "animate-flip" : ""}
                        ${result === "tails" ? "rotate-y-180" : ""}
                    `}
          >
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
          {isFlipping
            ? "..."
            : result
              ? result === "heads"
                ? "앞면!"
                : "뒷면!"
              : ""}
        </div>

        {/* Action Button */}
        <button
          onClick={flipCoin}
          disabled={isFlipping}
          className="w-full max-w-sm btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-neon"
        >
          <RotateCw className={isFlipping ? "animate-spin" : ""} size={24} />
          {isFlipping ? "던지는 중..." : "동전 던지기"}
        </button>
      </div>

      {/* AEO Content */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          🪙 동전 던지기의 유래는?
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          동전 던지기(Coin Flipping)는 고대 로마 시대부터 이어져 온 가장 오래된
          확률 게임이자 의사결정 방식입니다. "Navia aut Caput" (배냐 머리냐)라고
          불렸으며, 당시 동전의 앞면에는 황제의 머리가, 뒷면에는 배가 그려져
          있었기 때문입니다.
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
