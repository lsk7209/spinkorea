import { useState, useMemo } from "react";
import { Cake, Calendar, User, Star } from "lucide-react";
import {
  format,
  differenceInYears,
  addYears,
  isBefore,
  startOfDay,
  getYear,
} from "date-fns";
import { ko } from "date-fns/locale";
import ToolLayout from "@/components/ToolLayout";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const today = startOfDay(new Date());

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return null;

    // 1. Man Age (International Age)
    // Calculated by full years passed since birth
    const manAge = differenceInYears(today, birth);

    // 2. Korean Age (Traditional: Start at 1, +1 every New Year)
    // = Current Year - Birth Year + 1
    const koreanAge = getYear(today) - getYear(birth) + 1;

    // 3. Year Age (Current Year - Birth Year)
    // Used for some legal purposes in Korea (e.g. alcohol purchase, conscription)
    const yearAge = getYear(today) - getYear(birth);

    // 4. Next Birthday
    let nextBirthday = new Date(
      getYear(today),
      birth.getMonth(),
      birth.getDate(),
    );
    if (isBefore(nextBirthday, today)) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    const dDay = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { manAge, koreanAge, yearAge, nextBirthday, dDay };
  }, [birthDate]);

  // Zodiac helpers
  const getZodiacSign = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "양자리 ♈";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "황소자리 ♉";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
      return "쌍둥이자리 ♊";
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
      return "게자리 ♋";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
      return "사자자리 ♌";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "처녀자리 ♍";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
      return "천칭자리 ♎";
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
      return "전갈자리 ♏";
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
      return "사수자리 ♐";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "염소자리 ♑";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "물병자리 ♒";
    return "물고기자리 ♓";
  };

  const getChineseZodiac = (dateStr: string) => {
    if (!dateStr) return "";
    const year = getYear(new Date(dateStr));
    const animals = [
      "원숭이",
      "닭",
      "개",
      "돼지",
      "쥐",
      "소",
      "호랑이",
      "토끼",
      "용",
      "뱀",
      "말",
      "양",
    ];
    return `${animals[year % 12]}띠`;
  };

  return (
    <ToolLayout
      title="만 나이 계산기"
      description="생년월일만 입력하면 만 나이, 연 나이, 세는 나이(한국 나이)를 모두 알려드립니다. 띠와 별자리 정보, 다음 생일 디데이까지 확인하세요."
      keywords="만나이계산기, 한국나이, 연나이, 세는나이, 띠계산기, 별자리계산, age calculator, korean age"
      howToUse={[
        "생년월일을 날짜 선택기에서 입력하세요.",
        "만 나이, 세는 나이, 연 나이가 자동 계산됩니다.",
        "띠, 별자리, 다음 생일 D-Day를 한눈에 확인하세요.",
      ]}
      faqs={[
        {
          question: "만 나이와 세는 나이는 무엇이 다른가요?",
          answer:
            "만 나이는 생일 기준으로 0살부터 시작하며 전 세계 표준입니다. 세는 나이는 태어나자마자 1살로 시작해 매년 1월 1일마다 1살씩 더합니다. 2023년 6월부터 한국도 만 나이를 공식 기준으로 사용합니다.",
        },
        {
          question: "연 나이는 어떤 경우에 쓰이나요?",
          answer:
            "현재 연도에서 출생 연도를 빼는 방식으로, 청소년보호법·병역법 등 일부 법률에서 사용합니다. 생일에 관계없이 같은 해 태어난 사람은 모두 같은 연 나이를 가집니다.",
        },
        {
          question: "계산 결과는 정확한가요?",
          answer:
            "오늘 날짜와 입력하신 생년월일을 기준으로 정확히 계산합니다. 만 나이는 생일 경과 여부까지 고려합니다.",
        },
      ]}
      relatedTools={[
        {
          name: "D-Day 카운터",
          path: "/tools/d-day-counter",
          description: "생일, 기념일, 목표일까지 D-Day 계산",
        },
        {
          name: "BMI 계산기",
          path: "/tools/bmi-calculator",
          description: "체질량 지수로 건강 상태 확인",
        },
        {
          name: "시간 계산기",
          path: "/tools/time-calculator",
          description: "두 시간 사이 경과 시간 계산",
        },
      ]}
    >
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center">
          <label className="text-gray-300 font-bold mb-4 block flex items-center justify-center gap-2">
            <Calendar size={20} className="text-neon-primary" /> 생년월일을
            입력해주세요
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="bg-black/30 border border-white/20 rounded-lg px-6 py-4 text-white text-xl text-center focus:outline-none focus:border-neon-primary w-full max-w-xs mx-auto block"
          />
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Age Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-8 rounded-2xl text-center relative overflow-hidden">
              <h3 className="text-indigo-300 font-medium mb-1 flex items-center justify-center gap-2">
                <User size={20} /> 현재 만 나이
              </h3>
              <div className="text-6xl font-black text-white drop-shadow-lg my-2">
                {result.manAge}세
              </div>
              <p className="text-indigo-200/60 text-sm">
                국제 통용 기준이자 현재 한국 공식 나이
              </p>
            </div>

            {/* Other Ages */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-center items-center">
              <span className="text-gray-400 text-sm mb-1">
                세는 나이 (한국식)
              </span>
              <span className="text-3xl font-bold text-white">
                {result.koreanAge}세
              </span>
              <span className="text-xs text-gray-500 mt-1">
                태어나자마자 1살
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-center items-center">
              <span className="text-gray-400 text-sm mb-1">연 나이</span>
              <span className="text-3xl font-bold text-white">
                {result.yearAge}세
              </span>
              <span className="text-xs text-gray-500 mt-1">
                청소년 보호법, 병역법 기준
              </span>
            </div>

            {/* Zodiacs & Birthday */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 rounded-xl grid grid-cols-3 gap-2 divide-x divide-white/10">
              <div className="text-center px-2">
                <div className="text-gray-400 text-xs mb-1">띠</div>
                <div className="text-lg font-bold text-orange-400">
                  {getChineseZodiac(birthDate)}
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-gray-400 text-xs mb-1">별자리</div>
                <div className="text-lg font-bold text-blue-400">
                  {getZodiacSign(birthDate)}
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-gray-400 text-xs mb-1 flex items-center justify-center gap-1">
                  <Cake size={12} /> 다음 생일
                </div>
                <div className="text-lg font-bold text-pink-400">
                  D-{result.dDay}
                </div>
                <div className="text-[10px] text-gray-500">
                  {format(result.nextBirthday, "yyyy-MM-dd")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
