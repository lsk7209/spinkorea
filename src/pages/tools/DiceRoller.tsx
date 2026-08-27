import { useState, useRef } from "react";
import { Dices, RefreshCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import { getSecureRandomInt } from "@/utils/random";
import { trackToolCompleted } from "@/utils/analytics";

// Dice faces (1-6) using grid layout
const DiceFace = ({ value, rolling }: { value: number; rolling: boolean }) => {
  // Dot positions for each number
  const dots: Record<number, number[]> = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  return (
    <div
      className={`
            w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center relative
            transform transition-all duration-500
            ${rolling ? "animate-spin-dice" : ""}
        `}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pos) => (
          <div key={pos} className="flex items-center justify-center">
            {dots[value]?.includes(pos) && (
              <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-900 rounded-full shadow-inner" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rollDice = () => {
    setIsRolling(true);
    // Play sound if available
    // if (audioRef.current) audioRef.current.play();

    let count = 0;
    const interval = setInterval(() => {
      setResults(
        Array.from(
          { length: diceCount },
          () => getSecureRandomInt(6) + 1,
        ),
      );
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(false);
        trackToolCompleted("/tools/dice-roller", "dice_roll");
      }
    }, 80);
  };

  const total = results.reduce((acc, curr) => acc + curr, 0);

  return (
    <ToolLayout
      title="온라인 주사위 던지기"
      description="설치 없이 바로 사용하는 온라인 주사위입니다. 1~5개의 6면 주사위를 동시에 굴려 보드게임, 순서 정하기, 수업 활동에 활용할 수 있습니다."
      keywords="주사위, 온라인주사위, 주사위던지기, 주사위게임, 랜덤주사위, Dice Roller"
      howToUse={[
        "굴릴 6면 주사위 개수를 선택하세요 (1~5개).",
        "주사위 개수와 결과 표시를 확인하세요.",
        "'굴리기' 버튼을 클릭하세요.",
        "결과와 합계를 확인하세요.",
      ]}
      faqs={[
        {
          question: "어떤 종류의 주사위를 지원하나요?",
          answer:
            "현재 화면에서는 6면 주사위를 1~5개까지 동시에 굴립니다. 다른 면 수가 필요한 RPG나 보드게임에서는 규칙에 맞는 별도 주사위를 사용해야 합니다.",
        },
        {
          question: "실제 주사위와 확률이 같나요?",
          answer:
            "각 주사위 결과는 브라우저의 보안 난수 기능으로 선택됩니다. 다만 이 페이지는 공식 추첨이나 금전 분쟁을 위한 감사 시스템이 아니므로 중요한 결과는 별도 절차를 사용하세요.",
        },
      ]}
      relatedTools={[
        {
          name: "동전 던지기",
          path: "/tools/coin-flip",
          description: "앞면 vs 뒷면 랜덤 결정",
        },
        {
          name: "로또 번호 생성",
          path: "/tools/lotto-generator",
          description: "행운의 번호 추첨",
        },
        {
          name: "Yes or No",
          path: "/tools/yes-no-oracle",
          description: "빠른 결정 도우미",
        },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-10 py-8">
        {/* Controls */}
        <div className="flex items-center gap-4 bg-neon-dark/30 p-4 rounded-xl border border-neon-border/30">
          <span className="text-gray-300 font-medium">주사위 개수:</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setDiceCount(num);
                  setResults(Array.from({ length: num }, () => 1));
                }}
                className={`
                                    w-10 h-10 rounded-lg font-bold transition-all
                                    ${
                                      diceCount === num
                                        ? "bg-neon-primary text-black shadow-neon-primary/50 shadow-md scale-110"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }
                                `}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Dice Display */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 min-h-[120px] perspective-1000">
          {results.map((value, idx) => (
            <DiceFace key={idx} value={value} rolling={isRolling} />
          ))}
        </div>

        {/* Total */}
        <div className="text-2xl font-bold text-white bg-white/5 px-8 py-3 rounded-full border border-white/10">
          합계:{" "}
          <span className="text-neon-primary text-3xl ml-2">
            {isRolling ? "..." : total}
          </span>
        </div>

        {/* Main Action */}
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="w-full max-w-sm btn-primary py-4 text-xl flex items-center justify-center gap-3 shadow-neon group"
        >
          {isRolling ? (
            <RefreshCw className="animate-spin" size={24} />
          ) : (
            <Dices
              className="group-hover:rotate-180 transition-transform duration-500"
              size={24}
            />
          )}
          {isRolling ? "굴러가는 중..." : "주사위 굴리기"}
        </button>
      </div>

      {/* AEO Content */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          🎲 주사위 게임 활용 팁
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
          <li>
            <strong>보드게임:</strong> 주사위를 잃어버렸을 때 완벽한 대안입니다.
          </li>
          <li>
            <strong>점심 내기:</strong> 가장 낮은/높은 숫자가 나온 사람이 쏘기!
          </li>
          <li>
            <strong>TRPG:</strong> 간단한 1d6 굴림이 필요할 때 유용합니다.
          </li>
        </ul>
      </div>

      <style>{`
                @keyframes spin-dice {
                    0% { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(180deg) scale(0.9); }
                    50% { transform: rotate(360deg) scale(1); }
                    75% { transform: rotate(540deg) scale(0.9); }
                    100% { transform: rotate(720deg) scale(1); }
                }
                .animate-spin-dice {
                    animation: spin-dice 0.5s ease-in-out infinite;
                }
            `}</style>
    </ToolLayout>
  );
}
