import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecentTools } from "@/hooks/useRecentTools";
import { Search } from "lucide-react";
import {
  Dice5,
  Coins,
  Binary,
  Users,
  Lock,
  Type,
  FileType,
  FileText,
  Braces,
  Link as LinkIcon,
  Dices,
  Wand2,
  Calendar,
  Activity,
  Palette,
  Sparkles,
  CalendarDays,
  FileCode2,
  BookOpen,
  Percent,
  QrCode,
  Clock,
  ArrowLeftRight,
  Hash,
  Timer as TimerIcon,
  Wallet,
  TrendingDown,
  Home as HomeIcon,
  TrendingUp,
  Briefcase,
  CalendarCheck2,
  BadgePercent,
  Flame,
  Scale,
  Moon,
  Receipt,
  Maximize2,
  CalendarRange,
  PieChart,
  Tag,
  Dumbbell,
  SplitSquareHorizontal,
  Gauge,
  Code2,
  Droplets,
  Car,
  BarChart2,
} from "lucide-react";

const TOOLS = [
  // 랜덤
  { path: "/tools/lotto-generator", name: "로또 번호 생성", icon: Dices, desc: "나만의 행운 번호 추첨", color: "text-yellow-400", cat: "랜덤" },
  { path: "/tools/dice-roller", name: "주사위 던지기", icon: Dice5, desc: "3D 주사위 시뮬레이션", color: "text-red-400", cat: "랜덤" },
  { path: "/tools/coin-flip", name: "동전 던지기", icon: Coins, desc: "앞면 vs 뒷면 승부", color: "text-orange-400", cat: "랜덤" },
  { path: "/tools/yes-no-oracle", name: "Yes or No", icon: Wand2, desc: "결정 장애 해결사", color: "text-purple-400", cat: "랜덤" },
  { path: "/tools/random-team", name: "랜덤 팀 편성", icon: Users, desc: "공정한 팀 나누기", color: "text-blue-400", cat: "랜덤" },
  { path: "/tools/random-password", name: "비밀번호 생성", icon: Lock, desc: "강력한 보안 암호", color: "text-green-400", cat: "랜덤" },

  // 텍스트·개발
  { path: "/tools/text-counter", name: "글자수 세기", icon: Type, desc: "자소서/블로그 글자수", color: "text-pink-400", cat: "텍스트·개발" },
  { path: "/tools/case-converter", name: "대소문자 변환", icon: FileType, desc: "영어 대소문자/카멜", color: "text-indigo-400", cat: "텍스트·개발" },
  { path: "/tools/lorem-ipsum", name: "로렘 입숨", icon: FileText, desc: "더미 텍스트 생성", color: "text-gray-400", cat: "텍스트·개발" },
  { path: "/tools/json-formatter", name: "JSON 포맷터", icon: Braces, desc: "정렬/압축/검사", color: "text-cyan-400", cat: "텍스트·개발" },
  { path: "/tools/uri-encoder", name: "URL 인코더", icon: LinkIcon, desc: "URL 인코딩/디코딩", color: "text-lime-400", cat: "텍스트·개발" },
  { path: "/tools/base64-encoder", name: "Base64 변환", icon: Binary, desc: "텍스트 ↔ Base64", color: "text-emerald-400", cat: "텍스트·개발" },
  { path: "/tools/diff-checker", name: "Diff 비교", icon: FileCode2, desc: "텍스트 차이 비교", color: "text-violet-400", cat: "텍스트·개발" },
  { path: "/tools/markdown-previewer", name: "마크다운 미리보기", icon: BookOpen, desc: "MD 실시간 렌더링", color: "text-sky-400", cat: "텍스트·개발" },
  { path: "/tools/color-converter", name: "색상 변환기", icon: Palette, desc: "HEX/RGB/HSL 변환", color: "text-fuchsia-400", cat: "텍스트·개발" },
  { path: "/tools/css-shadow-generator", name: "CSS 그림자 생성", icon: Sparkles, desc: "Box shadow 시각화", color: "text-rose-400", cat: "텍스트·개발" },
  { path: "/tools/qr-code-generator", name: "QR 코드 생성", icon: QrCode, desc: "링크를 QR로 변환", color: "text-teal-400", cat: "텍스트·개발" },
  { path: "/tools/base-converter", name: "진법 변환기", icon: Code2, desc: "2진수·8진수·10진수·16진수 변환", color: "text-violet-400", cat: "텍스트·개발" },

  // 계산기
  { path: "/tools/age-calculator", name: "나이 계산기", icon: Calendar, desc: "만 나이/생일 계산", color: "text-amber-400", cat: "계산기" },
  { path: "/tools/percentage-calculator", name: "퍼센트 계산기", icon: Percent, desc: "할인율/증감률 계산", color: "text-orange-300", cat: "계산기" },
  { path: "/tools/time-calculator", name: "시간 계산기", icon: Clock, desc: "시간 더하기/빼기", color: "text-blue-300", cat: "계산기" },
  { path: "/tools/unit-converter", name: "단위 변환기", icon: ArrowLeftRight, desc: "길이/무게/온도 변환", color: "text-green-300", cat: "계산기" },
  { path: "/tools/area-converter", name: "평수 계산기", icon: Maximize2, desc: "평↔m²↔ft² 면적 변환", color: "text-amber-300", cat: "계산기" },
  { path: "/tools/margin-calculator", name: "마진율 계산기", icon: PieChart, desc: "원가·판매가·마진율 계산", color: "text-emerald-400", cat: "계산기" },
  { path: "/tools/discount-calculator", name: "할인율 계산기", icon: Tag, desc: "정가·할인율·할인가 계산", color: "text-pink-400", cat: "계산기" },
  { path: "/tools/speed-calculator", name: "속도 계산기", icon: Gauge, desc: "거리·시간·속도 3방향 계산", color: "text-sky-400", cat: "계산기" },
  { path: "/tools/fuel-economy", name: "연비 계산기", icon: Car, desc: "주행거리·연비·연료비 계산", color: "text-yellow-300", cat: "계산기" },
  { path: "/tools/statistics-calculator", name: "통계 계산기", icon: BarChart2, desc: "평균·중앙값·표준편차 한번에", color: "text-indigo-300", cat: "계산기" },

  // 건강·피트니스
  { path: "/tools/bmi-calculator", name: "BMI 계산기", icon: Activity, desc: "체질량 지수 측정", color: "text-lime-300", cat: "건강·피트니스" },
  { path: "/tools/calorie-calculator", name: "칼로리 계산기", icon: Flame, desc: "BMR·일일 권장 칼로리", color: "text-orange-400", cat: "건강·피트니스" },
  { path: "/tools/body-fat", name: "체지방률 계산기", icon: Scale, desc: "Navy Method 체성분 분석", color: "text-purple-400", cat: "건강·피트니스" },
  { path: "/tools/sleep-calculator", name: "수면 계산기", icon: Moon, desc: "90분 사이클 최적 기상 시각", color: "text-indigo-400", cat: "건강·피트니스" },
  { path: "/tools/calorie-burn", name: "칼로리 소모 계산기", icon: Dumbbell, desc: "운동별 소모 칼로리·지방 연소량", color: "text-orange-300", cat: "건강·피트니스" },
  { path: "/tools/water-intake", name: "수분 섭취량 계산기", icon: Droplets, desc: "체중·활동량별 하루 권장 물 섭취량", color: "text-cyan-400", cat: "건강·피트니스" },

  // 날짜·시간
  { path: "/tools/date-calculator", name: "날짜 계산기", icon: CalendarRange, desc: "두 날짜 사이 기간 계산", color: "text-violet-400", cat: "날짜·시간" },
  { path: "/tools/timer", name: "타이머", icon: TimerIcon, desc: "카운트다운·스톱워치·뽀모도로", color: "text-cyan-400", cat: "날짜·시간" },
  { path: "/tools/d-day-counter", name: "D-Day 카운터", icon: CalendarDays, desc: "기념일/목표일 계산", color: "text-pink-300", cat: "날짜·시간" },
  { path: "/tools/unix-timestamp", name: "Unix 타임스탬프", icon: Hash, desc: "날짜 ↔ 타임스탬프", color: "text-gray-300", cat: "날짜·시간" },

  // 생활 금융
  { path: "/tools/hourly-wage", name: "시급 계산기", icon: Wallet, desc: "일급·월급·연봉 자동 환산", color: "text-yellow-400", cat: "생활 금융" },
  { path: "/tools/loan-calculator", name: "대출 계산기", icon: TrendingDown, desc: "월 상환금·총 이자 계산", color: "text-red-400", cat: "생활 금융" },
  { path: "/tools/jeonse-converter", name: "전월세 전환기", icon: HomeIcon, desc: "전세↔월세 보증금 환산", color: "text-amber-400", cat: "생활 금융" },
  { path: "/tools/compound-interest", name: "복리 계산기", icon: TrendingUp, desc: "예금·적금 만기금액 계산", color: "text-green-400", cat: "생활 금융" },
  { path: "/tools/severance-pay", name: "퇴직금 계산기", icon: Briefcase, desc: "법정 퇴직금 자동 계산", color: "text-blue-400", cat: "생활 금융" },
  { path: "/tools/annual-leave", name: "연차 계산기", icon: CalendarCheck2, desc: "연차일수·잔여·수당 계산", color: "text-teal-400", cat: "생활 금융" },
  { path: "/tools/net-salary", name: "실수령액 계산기", icon: BadgePercent, desc: "4대보험·세금 공제 후 월급", color: "text-cyan-300", cat: "생활 금융" },
  { path: "/tools/vat-calculator", name: "부가세 계산기", icon: Receipt, desc: "공급가액·부가세·공급대가 계산", color: "text-rose-400", cat: "생활 금융" },
  { path: "/tools/dutch-pay", name: "더치페이 계산기", icon: SplitSquareHorizontal, desc: "총 금액을 n명으로 나누기", color: "text-lime-400", cat: "생활 금융" },
];

const CATS = ["전체", "랜덤", "텍스트·개발", "계산기", "건강·피트니스", "날짜·시간", "생활 금융"] as const;

interface MoreToolsProps {
  showSearch?: boolean;
}

export default function MoreTools({ showSearch = false }: MoreToolsProps) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("전체");
  const [recentPaths, setRecentPaths] = useState<string[]>([]);

  useEffect(() => {
    setRecentPaths(getRecentTools());
  }, []);

  const filtered = TOOLS.filter((t) => {
    const matchCat = cat === "전체" || t.cat === cat;
    const q = query.trim().toLowerCase();
    const matchQ = !q || t.name.includes(q) || t.desc.includes(q);
    return matchCat && matchQ;
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 border-t border-white/10">
      <div className="text-center mb-8 space-y-2">
        <p className="text-xs font-bold tracking-[0.25em] text-neon-primary">무료 도구</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">유틸리티 모음</h2>
        <p className="text-sm text-gray-400">빠른 결정, 변환, 생성까지 한 곳에서.</p>
      </div>

      {showSearch && recentPaths.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-gray-500 mb-3 text-center">최근 사용</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {recentPaths.map((path) => {
              const tool = TOOLS.find((t) => t.path === path);
              if (!tool) return null;
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:border-neon-primary/50 hover:text-white transition-all"
                >
                  <tool.icon size={13} className={tool.color} />
                  {tool.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {showSearch && (
        <div className="mb-6 space-y-3">
          {/* 검색 */}
          <div className="relative max-w-sm mx-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="도구 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-primary/50 transition-colors"
            />
          </div>
          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${cat === c ? "bg-neon-primary text-black" : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="group relative overflow-hidden card card-hover p-4 flex flex-col items-start gap-3"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className={`p-3 rounded-xl bg-black/30 ${tool.color} group-hover:scale-110 transition-transform`}>
                <tool.icon size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-gray-100 group-hover:text-white transition-colors">{tool.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
              </div>
              <span className="text-[11px] text-neon-primary font-semibold mt-auto inline-flex items-center gap-1">
                바로가기<span aria-hidden>↗</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
