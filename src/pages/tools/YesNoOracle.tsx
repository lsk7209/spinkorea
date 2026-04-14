import { useState } from "react";
import { Sparkles } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

const ANSWERS = [
  {
    text: "YES",
    sub: "확실합니다",
    color: "text-green-400",
    border: "border-green-400",
  },
  {
    text: "NO",
    sub: "아니오",
    color: "text-red-400",
    border: "border-red-400",
  },
  {
    text: "MAYBE",
    sub: "아직은...",
    color: "text-yellow-400",
    border: "border-yellow-400",
  },
  {
    text: "TRY AGAIN",
    sub: "다시 한번",
    color: "text-purple-400",
    border: "border-purple-400",
  },
];

export default function YesNoOracle() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<(typeof ANSWERS)[0] | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const askOracle = () => {
    if (!question.trim()) return;
    setIsThinking(true);
    setAnswer(null);

    // Mystical delay
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * ANSWERS.length);
      setAnswer(ANSWERS[randomIdx]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <ToolLayout
      title="Yes or No 결정 신탁"
      description="선택의 갈림길에서 망설여진다면 우주의 기운에 물어보세요. 질문을 입력하면 YES, NO로 답해드립니다."
      keywords="yes or no, 예아니요, 결정장애, 타로, 운세, 랜덤결정, YesNo, Oracle"
      howToUse={[
        "결정하기 어려운 질문을 떠올리세요.",
        "'물어보기' 버튼을 클릭하세요.",
        "YES 또는 NO 답변을 확인하세요.",
      ]}
      faqs={[
        {
          question: "결과는 완전히 랜덤인가요?",
          answer:
            "네, 암호학적 난수를 사용해 완전 무작위로 YES/NO를 결정합니다. 어떤 패턴도 없습니다.",
        },
        {
          question: "중요한 결정에 사용해도 되나요?",
          answer:
            "Yes/No 오라클은 결정 피로를 줄여주는 가벼운 도구입니다. 사소한 결정에는 유용하지만, 중요한 결정은 충분한 정보를 바탕으로 내리시길 권장합니다.",
        },
      ]}
      relatedTools={[
        {
          name: "룰렛 돌리기",
          path: "/",
          description: "여러 선택지 중 랜덤 선택",
        },
        {
          name: "동전 던지기",
          path: "/tools/coin-flip",
          description: "50:50 랜덤 결정",
        },
        {
          name: "주사위 던지기",
          path: "/tools/dice-roller",
          description: "1~6 랜덤 숫자",
        },
      ]}
    >
      <div className="flex flex-col items-center justify-center gap-8 py-8 w-full max-w-lg mx-auto">
        {/* Visual Circle */}
        <div
          className={`
                    relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-neon-border/50
                    flex items-center justify-center overflow-hidden transition-all duration-700
                    ${isThinking ? "animate-pulse shadow-[0_0_50px_rgba(124,58,237,0.5)]" : "shadow-2xl"}
                    ${answer ? answer.border + " shadow-[0_0_30px_currentColor]" : ""}
                    bg-black/40 backdrop-blur-sm
                `}
        >
          {isThinking ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="animate-spin text-purple-400 w-12 h-12" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent animate-spin-slow rounded-full" />
            </div>
          ) : answer ? (
            <div className="text-center animate-fade-in-up">
              <h2 className={`text-5xl md:text-7xl font-black ${answer.color}`}>
                {answer.text}
              </h2>
              <p className="text-gray-300 mt-2 font-medium">{answer.sub}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>무엇이든 물어보세요</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full space-y-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="예: 오늘 야식 먹을까요?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-primary transition-colors text-center"
            onKeyDown={(e) => e.key === "Enter" && askOracle()}
          />

          <button
            onClick={askOracle}
            disabled={isThinking || !question.trim()}
            className="w-full btn-primary py-4 text-xl shadow-neon"
          >
            {isThinking ? "우주의 기운을 모으는 중..." : "신탁 듣기"}
          </button>
        </div>
      </div>

      {/* AEO Content */}
      <div className="mt-12 border-t border-white/10 pt-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          🔮 Yes or No 신탁 활용법
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
          <li>사소한 결정이 힘들 때 가볍게 사용하세요.</li>
          <li>
            <strong>"오늘 야식 치킨 먹을까요?"</strong> 처럼 구체적으로
            질문하세요.
          </li>
          <li>
            결과는 재미로만 받아들이세요. 진짜 중요한 결정은 마음 가는 대로!
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
