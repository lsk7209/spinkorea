import { useState } from "react";
import { Home } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

function fmt(n: number) {
  return Math.round(n).toLocaleString("ko-KR");
}

function toEok(n: number) {
  const eok = Math.floor(n / 100000000);
  const man = Math.round((n % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

export default function JeonseConverter() {
  const [convRate, setConvRate] = useState("5.5");

  // 전세 → 월세
  const [jeonseAmt, setJeonseAmt] = useState("200000000");
  const [deposit, setDeposit] = useState("30000000");

  // 월세 → 전세
  const [monthlyRent, setMonthlyRent] = useState("80");
  const [monthlyDeposit, setMonthlyDeposit] = useState("20000000");

  const rate = (parseFloat(convRate) || 0) / 100 / 12;

  // 전세 → 월세 계산
  const j2m_effective = parseFloat(jeonseAmt) - parseFloat(deposit || "0");
  const j2m_monthly = j2m_effective > 0 && rate > 0 ? j2m_effective * rate : null;

  // 월세 → 전세 계산
  const m2j_monthly = parseFloat(monthlyRent) * 10000;
  const m2j_deposit = parseFloat(monthlyDeposit) || 0;
  const m2j_equiv = rate > 0 ? m2j_deposit + m2j_monthly / rate : null;

  return (
    <ToolLayout
      title="전월세 전환 계산기 | 전세→월세 월세→전세 변환"
      description="전세 보증금을 월세로 환산하거나 월세를 전세 보증금으로 역산합니다. 전월세 전환율 직접 입력 가능."
      keywords="전월세전환계산기, 전세월세환산, 전세보증금계산, 월세전환율, 임대차계산기"
      howToUse={[
        "전월세 전환율(기준금리+알파, 보통 4~6%)을 입력하세요.",
        "전세→월세: 전세금과 월세 보증금을 입력하면 월세가 계산됩니다.",
        "월세→전세: 월세와 보증금을 입력하면 동등 전세금이 계산됩니다.",
      ]}
      tips={[
        "법정 전월세 전환율 상한은 연 10%(기준금리+2% 중 낮은 것)입니다.",
        "실제 거래 시 집주인과 협의한 전환율을 직접 입력하면 더 정확합니다.",
        "전세보증보험(HUG/SGI)은 전세금의 90~100%까지 보장 가능합니다.",
      ]}
      faqs={[
        {
          question: "전월세 전환율이란 무엇인가요?",
          answer: "전세 보증금을 월세로 전환할 때 적용하는 이율입니다. 예를 들어 전환율 5.5% 기준으로 전세금 2억원은 월 91만원(2억 × 5.5% ÷ 12)에 해당합니다.",
        },
        {
          question: "법정 상한 전환율은 얼마인가요?",
          answer: "주택임대차보호법에 따라 전월세 전환율 상한은 '한국은행 기준금리 + 3.5%' 또는 '연 10%' 중 낮은 값입니다. 2024년 기준 약 7% 내외입니다.",
        },
        {
          question: "보증금 일부를 월세로 전환하는 방법은?",
          answer: "전세금에서 원하는 보증금을 뺀 금액(실질 전환 금액)에 전환율을 적용하면 됩니다. 예: 전세 2억, 보증금 3천만원 → 전환 금액 1.7억 × 전환율 ÷ 12 = 월세.",
        },
      ]}
      relatedTools={[
        { name: "퍼센트 계산기", path: "/tools/percentage-calculator", description: "할인율·비율 계산" },
        { name: "대출 계산기", path: "/tools/loan-calculator", description: "대출 이자·상환금 계산" },
        { name: "시급 계산기", path: "/tools/hourly-wage", description: "월급·연봉 환산" },
      ]}
    >
      <div className="flex flex-col gap-8">
        {/* 전환율 */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm shrink-0">
            <Home size={16} />
            <span>전월세 전환율</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              step="0.1"
              value={convRate}
              onChange={(e) => setConvRate(e.target.value)}
              className="w-24 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-primary text-center font-bold"
            />
            <span className="text-gray-400">% (연)</span>
          </div>
          <p className="text-xs text-gray-500 sm:ml-2">법정 상한 약 7% 이내 | 실 거래 시 협의 금액 직접 입력</p>
        </div>

        {/* 전세 → 월세 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-neon-primary mb-5">전세 → 월세 환산</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">전세 보증금 (원)</label>
              <input
                type="number"
                value={jeonseAmt}
                onChange={(e) => setJeonseAmt(e.target.value)}
                placeholder="예: 200000000"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{parseFloat(jeonseAmt) > 0 ? toEok(parseFloat(jeonseAmt)) : ""}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">월세 보증금 유지 (원, 없으면 0)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="예: 30000000"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-neon-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{parseFloat(deposit) > 0 ? toEok(parseFloat(deposit)) : ""}</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">월세</p>
            <p className="text-2xl font-black text-cyan-400">
              {j2m_monthly !== null ? `${fmt(j2m_monthly)}원 / 월` : "-"}
            </p>
            {j2m_monthly !== null && (
              <p className="text-xs text-gray-500 mt-1">
                전환 금액 {toEok(j2m_effective)} × {convRate}% ÷ 12
              </p>
            )}
          </div>
        </div>

        {/* 월세 → 전세 */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-amber-400 mb-5">월세 → 전세 역산</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">월세 (만원)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="예: 80"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">현재 보증금 (원)</label>
              <input
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value)}
                placeholder="예: 20000000"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">동등 전세금</p>
            <p className="text-2xl font-black text-amber-400">
              {m2j_equiv !== null ? toEok(m2j_equiv) : "-"}
            </p>
            {m2j_equiv !== null && (
              <p className="text-xs text-gray-500 mt-1">
                {fmt(m2j_equiv)}원
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
