import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

const MIN_LEN_OPTIONS = [1, 2, 3];
const TOP_OPTIONS = [10, 20, 30];

const STOPWORDS_KO = new Set([
  "이", "가", "을", "를", "은", "는", "의", "에", "에서", "와", "과", "도", "로", "으로",
  "이다", "하다", "있다", "없다", "되다", "그", "이것", "저", "그것", "여기", "거기",
  "및", "또", "또한", "그리고", "하지만", "그러나", "때문에", "위해", "대해", "통해",
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "from",
]);

function tokenize(text: string, minLen: number, removeStop: boolean): string[] {
  const words = text
    .toLowerCase()
    .split(/[\s\p{P}\p{Z}]+/u)
    .filter((w) => w.length >= minLen);
  if (removeStop) return words.filter((w) => !STOPWORDS_KO.has(w));
  return words;
}

const EXAMPLES = [
  {
    label: "예시 문단",
    text: "인공지능 기술이 빠르게 발전하면서 인공지능을 활용한 서비스가 늘어나고 있습니다. 인공지능은 의료, 교육, 금융 분야에서 혁신을 가져오고 있으며, 특히 의료 분야에서는 인공지능 진단 시스템이 주목받고 있습니다. 기술 발전과 함께 윤리적 문제도 함께 논의되어야 합니다.",
  },
  {
    label: "영문 예시",
    text: "The quick brown fox jumps over the lazy dog. The fox is quick and the dog is lazy. A fox and a dog are animals. Animals are often quick and sometimes lazy.",
  },
];

export default function WordFrequency() {
  const [text, setText] = useState("");
  const [minLen, setMinLen] = useState(2);
  const [topN, setTopN] = useState(10);
  const [removeStop, setRemoveStop] = useState(false);

  const result = useMemo(() => {
    if (!text.trim()) return [];
    const words = tokenize(text, minLen, removeStop);
    const freq: Record<string, number> = {};
    for (const w of words) {
      if (w) freq[w] = (freq[w] ?? 0) + 1;
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
  }, [text, minLen, topN, removeStop]);

  const maxCount = result[0]?.[1] ?? 1;
  const totalWords = useMemo(() => {
    if (!text.trim()) return 0;
    return tokenize(text, minLen, removeStop).filter(Boolean).length;
  }, [text, minLen, removeStop]);

  return (
    <ToolLayout
      title="단어 빈도 분석기"
      description="텍스트를 입력하면 단어별 빈도를 분석해 순위를 보여줍니다. 자기소개서, 문서 검토, 키워드 분석에 활용하세요."
      howToUse={[
        "분석할 텍스트를 입력 또는 붙여넣기 합니다.",
        "최소 글자수 필터로 짧은 단어를 제외할 수 있습니다.",
        "불용어 제거를 켜면 '이, 가, 을, 를' 등 조사를 제외합니다.",
      ]}
      faqs={[
        {
          question: "불용어(Stopword)란 무엇인가요?",
          answer: "불용어는 '이, 가, 을, 를, 은, 는' 같은 조사·접속사처럼 의미 분석에 크게 기여하지 않는 단어입니다. 불용어 제거를 켜면 이런 단어를 빈도 분석에서 제외해 핵심 키워드를 더 잘 파악할 수 있습니다.",
        },
        {
          question: "어떤 용도로 사용하면 좋나요?",
          answer: "자기소개서나 보고서의 특정 단어 남발 확인, 블로그 글의 핵심 키워드 파악, 경쟁사 문서 분석 등에 활용할 수 있습니다. 자주 반복되는 단어를 파악해 다양한 표현으로 대체하면 글의 완성도가 높아집니다.",
        },
        {
          question: "한국어와 영어를 동시에 분석할 수 있나요?",
          answer: "네, 한국어와 영어가 혼합된 텍스트도 분석할 수 있습니다. 단어는 공백과 구두점을 기준으로 분리되며, 대소문자를 통일해 같은 단어로 처리합니다.",
        },
      ]}
    >
      <div className="space-y-5 max-w-2xl mx-auto">
        {/* 예시 버튼 */}
        <div className="flex gap-2 flex-wrap">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setText(ex.text)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition-all"
            >
              {ex.label}
            </button>
          ))}
          {text && (
            <button
              type="button"
              onClick={() => setText("")}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-500 hover:bg-white/10 transition-all"
            >
              지우기
            </button>
          )}
        </div>

        {/* 텍스트 입력 */}
        <textarea
          rows={6}
          placeholder="분석할 텍스트를 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors resize-none text-sm leading-relaxed"
        />

        {/* 옵션 */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">최소 글자</span>
            <div className="flex gap-1">
              {MIN_LEN_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMinLen(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${minLen === n ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">상위</span>
            <div className="flex gap-1">
              {TOP_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTopN(n)}
                  className={`px-2.5 h-8 rounded-lg text-xs font-bold transition-all ${topN === n ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRemoveStop((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${removeStop ? "bg-neon-primary/20 border-neon-primary/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
          >
            불용어 제거
          </button>
        </div>

        {/* 결과 */}
        {result.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs text-gray-500 font-bold tracking-widest">단어 빈도 TOP {result.length}</p>
              <p className="text-xs text-gray-600">총 단어 수: {totalWords.toLocaleString()}개</p>
            </div>
            {result.map(([word, count], i) => (
              <div key={word} className="flex items-center gap-3">
                <span className="w-6 text-xs text-gray-600 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-mono font-bold text-white truncate">{word}</span>
                    <span className="text-xs text-neon-primary font-bold shrink-0">{count}회</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-primary/60 rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {text.trim() && result.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">조건에 맞는 단어가 없습니다.</p>
        )}
      </div>
    </ToolLayout>
  );
}
