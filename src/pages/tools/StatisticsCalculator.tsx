import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  range: number;
}

function calcStats(nums: number[]): Stats | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / nums.length;
  const mid = Math.floor(nums.length / 2);
  const median = nums.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const freq: Record<string, number> = {};
  nums.forEach((n) => { freq[n] = (freq[n] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const modes = maxFreq < 2 ? [] : Object.entries(freq).filter(([, f]) => f === maxFreq).map(([n]) => Number(n)).sort((a, b) => a - b);

  const variance = nums.reduce((s, n) => s + (n - mean) ** 2, 0) / nums.length;

  return {
    count: nums.length,
    sum,
    mean,
    median,
    modes,
    variance,
    stdDev: Math.sqrt(variance),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range: sorted[sorted.length - 1] - sorted[0],
  };
}

function parseNums(input: string): number[] {
  return input
    .split(/[\s,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));
}

const fmt = (n: number) => {
  if (Number.isInteger(n)) return n.toLocaleString("ko-KR");
  return n.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
};

const EXAMPLES = [
  { label: "시험 점수", value: "85, 92, 78, 95, 88, 76, 90, 83, 71, 95" },
  { label: "월 매출", value: "120, 135, 118, 142, 129, 156, 148, 133, 127, 141, 152, 138" },
];

export default function StatisticsCalculator() {
  const [input, setInput] = useState("");

  const nums = parseNums(input);
  const stats = calcStats(nums);

  const statRows = stats
    ? [
        { label: "개수", value: stats.count.toString() },
        { label: "합계", value: fmt(stats.sum) },
        { label: "평균", value: fmt(stats.mean) },
        { label: "중앙값", value: fmt(stats.median) },
        { label: "최빈값", value: stats.modes.length > 0 ? stats.modes.map(fmt).join(", ") : "없음 (모두 다름)" },
        { label: "분산", value: fmt(stats.variance) },
        { label: "표준편차", value: fmt(stats.stdDev) },
        { label: "최솟값", value: fmt(stats.min) },
        { label: "최댓값", value: fmt(stats.max) },
        { label: "범위", value: fmt(stats.range) },
      ]
    : [];

  return (
    <ToolLayout
      title="통계 계산기"
      description="숫자 목록을 입력하면 평균·중앙값·표준편차·분산 등 기초 통계량을 한 번에 계산합니다."
      faqs={[
        {
          question: "평균과 중앙값의 차이는?",
          answer: "평균(Mean)은 모든 값의 합을 개수로 나눈 값이고, 중앙값(Median)은 크기순으로 정렬했을 때 가운데 위치한 값입니다. 이상값(outlier)이 있을 때 평균은 크게 영향받지만 중앙값은 안정적입니다. 예를 들어 소득 통계에서 중앙값이 더 현실을 잘 반영합니다.",
        },
        {
          question: "표준편차는 무엇을 의미하나요?",
          answer: "표준편차(Standard Deviation)는 데이터가 평균에서 얼마나 퍼져 있는지를 나타냅니다. 표준편차가 작을수록 데이터가 평균 가까이 모여 있고, 클수록 넓게 분포합니다. 시험 점수의 표준편차가 크면 잘하는 학생과 못하는 학생의 격차가 크다는 뜻입니다.",
        },
        {
          question: "숫자 입력 형식은 어떻게 되나요?",
          answer: "쉼표, 공백, 줄바꿈으로 구분해서 입력하면 됩니다. 예: 10, 20, 30 또는 10 20 30 또는 한 줄에 하나씩 입력 모두 가능합니다. 소수점도 지원합니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 예시 버튼 */}
        <div className="flex gap-2 flex-wrap">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => setInput(ex.value)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all"
            >
              예시: {ex.label}
            </button>
          ))}
        </div>

        {/* 숫자 입력 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            숫자 입력 (쉼표·공백·줄바꿈으로 구분)
          </label>
          <textarea
            rows={5}
            placeholder={"85, 92, 78, 95, 88\n또는 줄바꿈으로 입력"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors resize-none font-mono text-sm"
          />
          {nums.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{nums.length}개 숫자 인식됨</p>
          )}
        </div>

        {/* 결과 */}
        {stats && (
          <div className="card p-5 space-y-2">
            {statRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between items-center py-2 ${i < statRows.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className={`font-bold font-mono ${i < 3 ? "text-neon-primary" : "text-gray-200"} ${i === 2 ? "text-lg" : "text-base"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
