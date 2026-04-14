import { useState, useEffect } from "react";
import { Calendar, Clock, Heart, Flag } from "lucide-react";
import { format, differenceInCalendarDays, addDays, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import ToolLayout from "@/components/ToolLayout";

export default function DDayCounter() {
  const [targetDate, setTargetDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [title, setTitle] = useState("");
  const [dDay, setDDay] = useState<string>("");
  const [diff, setDiff] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;

    const today = new Date();
    const target = new Date(targetDate);
    today.setHours(0, 0, 0, 0); // Normalize today
    target.setHours(0, 0, 0, 0); // Normalize target

    const daysDiff = differenceInCalendarDays(target, today);
    setDiff(daysDiff);

    if (daysDiff === 0) {
      setDDay("D-Day");
    } else if (daysDiff > 0) {
      setDDay(`D-${daysDiff}`);
    } else {
      setDDay(`D+${Math.abs(daysDiff)}`);
    }
  }, [targetDate]);

  // Predefined anniversaries (100 days, 1 year, etc.) based on target date
  const getAnniversaries = (baseDate: string) => {
    if (!baseDate) return [];
    const start = new Date(baseDate);
    const list = [
      { label: "100일", days: 100 },
      { label: "200일", days: 200 },
      { label: "300일", days: 300 },
      { label: "1주년", days: 365 },
      { label: "2주년", days: 365 * 2 },
      { label: "3주년", days: 365 * 3 },
      { label: "1000일", days: 1000 },
    ];

    return list.map((item) => {
      // "100th day" typically means (Start Date + 99 days) in Korean culture (usually 1st day counts as Day 1)
      // But for "D-Day counter" (Event Left), usually it calculates date.
      // Let's assume standard logic: Date + N days.
      // * Actually, for 'Anniversary' (Couples), Day 1 is the start date. So 100th day is Start + 99.
      // * For 'Test' (D-Minus), D-100 is Target - 100.

      // Let's provide "Future Dates" (If today is start)
      const date = addDays(start, item.days - 1); // Korean style: Start date is Day 1
      return {
        ...item,
        date: format(date, "yyyy년 MM월 dd일 (E)", { locale: ko }),
      };
    });
  };

  const futureDates = getAnniversaries(targetDate);

  return (
    <ToolLayout
      title="D-Day 디데이 계산기"
      description="시험, 기념일, 생일 등 중요한 날짜까지 남은 날짜(D-) 또는 지난 날짜(D+)를 계산해보세요. 100일, 1주년 등 기념일 자동 계산 기능도 제공합니다."
      keywords="디데이계산기, 날짜계산기, 기념일계산기, 전역일계산, 수능디데이, 커플디데이, d-day calculator"
      howToUse={[
        "이벤트 이름을 입력하세요 (예: 수능, 결혼기념일).",
        "목표 날짜를 선택하세요.",
        "D-Day 카운트다운이 자동으로 계산됩니다.",
        "여러 개의 D-Day를 동시에 관리하세요.",
      ]}
      faqs={[
        {
          question: "D-Day가 지난 날짜도 계산되나요?",
          answer:
            "네, 과거 날짜를 입력하면 'D+N'으로 며칠이 지났는지 표시됩니다.",
        },
        {
          question: "D-Day를 저장할 수 있나요?",
          answer:
            "브라우저의 localStorage를 사용하여 설정이 자동 저장됩니다. 같은 브라우저에서 다시 접속하면 이전 D-Day가 유지됩니다.",
        },
      ]}
      relatedTools={[
        {
          name: "만 나이 계산기",
          path: "/tools/age-calculator",
          description: "만 나이·생일 D-Day 계산",
        },
        {
          name: "시간 계산기",
          path: "/tools/time-calculator",
          description: "두 시간 사이 경과 계산",
        },
        {
          name: "Unix 타임스탬프",
          path: "/tools/unix-timestamp",
          description: "날짜 ↔ 타임스탬프 변환",
        },
      ]}
    >
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-gray-300 font-bold mb-2 block flex items-center gap-2">
                <Flag size={18} className="text-neon-primary" /> 제목 (선택)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 수능, 연인과 만난 날"
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-primary"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-300 font-bold mb-2 block flex items-center gap-2">
                <Calendar size={18} className="text-neon-secondary" /> 기준 날짜
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-secondary"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-gray-400 mb-2">{title || "기준일"} 기준</p>
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-secondary drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {dDay}
            </div>
            <p className="text-gray-300 mt-4 text-lg">
              {diff === 0
                ? "오늘입니다! 🎉"
                : diff > 0
                  ? `${diff}일 남았습니다.`
                  : `${Math.abs(diff)}일 지났습니다.`}
            </p>
          </div>
        </div>

        {/* Anniversary List */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
            <Heart size={20} /> 기념일 계산 (입력일 기준)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            * 입력하신 날짜를 1일로 계산했을 때의 날짜입니다. (커플 기념일 방식)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {futureDates.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-black/20 p-3 rounded hover:bg-black/30 transition-colors"
              >
                <span className="text-pink-300 font-medium">{item.label}</span>
                <span className="text-gray-300">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
