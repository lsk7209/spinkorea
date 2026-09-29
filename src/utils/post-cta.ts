/**
 * Blog post CTA tool selection (SPK2-08).
 *
 * Tools are ranked by the most specific (longest) matching keyword, so a tag
 * like "실수령액" picks the net-salary tool before the broad "연봉" wage tool,
 * and "칼로리 소모" beats "칼로리". List order only breaks ties.
 */

export interface ToolLink {
  match: string[];
  label: string;
  path: string;
}

export const TOOL_LINKS: readonly ToolLink[] = [
  { match: ["시급", "월급", "연봉", "임금", "급여"], label: "시급 계산기", path: "/tools/hourly-wage" },
  { match: ["대출", "이자", "상환", "금리"], label: "대출 계산기", path: "/tools/loan-calculator" },
  { match: ["복리", "예금", "적금", "저축", "투자수익", "CAGR", "수익률"], label: "복리 계산기", path: "/tools/compound-interest" },
  { match: ["퇴직금", "퇴직", "근속", "퇴사"], label: "퇴직금 계산기", path: "/tools/severance-pay" },
  { match: ["연차", "휴가", "연차수당", "잔여연차"], label: "연차 계산기", path: "/tools/annual-leave" },
  { match: ["실수령", "세후", "공제", "4대보험", "소득세", "세금"], label: "실수령액 계산기", path: "/tools/net-salary" },
  { match: ["전세", "월세", "보증금", "임대"], label: "전월세 전환 계산기", path: "/tools/jeonse-converter" },
  { match: ["퍼센트", "할인", "증감", "수익률"], label: "퍼센트 계산기", path: "/tools/percentage-calculator" },
  { match: ["BMI", "체질량", "체중", "비만"], label: "BMI 계산기", path: "/tools/bmi-calculator" },
  { match: ["칼로리", "기초대사량", "BMR", "다이어트", "식단"], label: "칼로리 계산기", path: "/tools/calorie-calculator" },
  { match: ["체지방", "체성분", "제지방", "체지방률"], label: "체지방률 계산기", path: "/tools/body-fat" },
  { match: ["수면", "기상", "취침", "수면사이클", "잠"], label: "수면 계산기", path: "/tools/sleep-calculator" },
  { match: ["부가세", "VAT", "공급가액", "세금계산서", "부가가치세"], label: "부가세 계산기", path: "/tools/vat-calculator" },
  { match: ["평수", "평형", "m²", "제곱미터", "면적", "아파트"], label: "평수 계산기", path: "/tools/area-converter" },
  { match: ["마진", "원가", "판매가", "이익률", "마크업", "수익성"], label: "마진율 계산기", path: "/tools/margin-calculator" },
  { match: ["날짜 계산", "기간 계산", "일수 계산", "계약기간"], label: "날짜 계산기", path: "/tools/date-calculator" },
  { match: ["할인율", "할인가", "세일", "정가", "할인 계산"], label: "할인율 계산기", path: "/tools/discount-calculator" },
  { match: ["칼로리 소모", "운동 칼로리", "MET", "지방 연소", "운동 효과"], label: "칼로리 소모 계산기", path: "/tools/calorie-burn" },
  { match: ["더치페이", "n분의 1", "분할 계산", "회식 정산", "식비 나누기"], label: "더치페이 계산기", path: "/tools/dutch-pay" },
  { match: ["속도 계산", "거리 계산", "소요 시간", "km/h", "이동 시간"], label: "속도 계산기", path: "/tools/speed-calculator" },
  { match: ["2진수", "16진수", "진법", "HEX", "바이너리", "이진수"], label: "진법 변환기", path: "/tools/base-converter" },
  { match: ["수분", "물 마시기", "하루 물", "수분 섭취", "탈수"], label: "수분 섭취량 계산기", path: "/tools/water-intake" },
  { match: ["연비", "주유", "연료비", "유가", "km/L"], label: "연비 계산기", path: "/tools/fuel-economy" },
  { match: ["평균", "표준편차", "중앙값", "분산", "통계"], label: "통계 계산기", path: "/tools/statistics-calculator" },
  { match: ["점심", "메뉴", "식사", "음식"], label: "점심 메뉴 룰렛", path: "/lunch-menu" },
  { match: ["타이머", "시간", "뽀모도로", "집중"], label: "타이머", path: "/tools/timer" },
  { match: ["D-Day", "기념일", "날짜", "목표"], label: "D-Day 카운터", path: "/tools/d-day-counter" },
  { match: ["비밀번호", "보안", "암호"], label: "비밀번호 생성기", path: "/tools/random-password" },
  { match: ["QR", "링크", "공유"], label: "QR 코드 생성기", path: "/tools/qr-code-generator" },
  { match: ["글자수", "자소서", "텍스트"], label: "글자수 세기", path: "/tools/text-counter" },
  { match: ["UUID", "GUID", "고유 식별자", "식별자 생성", "랜덤 ID"], label: "UUID 생성기", path: "/tools/uuid-generator" },
  { match: ["이상 체중", "적정 체중", "표준 체중", "Broca", "Hamwi", "체중 계산"], label: "이상 체중 계산기", path: "/tools/ideal-weight" },
  { match: ["ROI", "수익률", "CAGR", "투자 수익", "연평균 복리", "투자 성과"], label: "투자 수익률 계산기", path: "/tools/roi-calculator" },
  { match: ["단어 빈도", "워드 카운트", "키워드 분석", "텍스트 분석", "불용어"], label: "단어 빈도 분석기", path: "/tools/word-frequency" },
];

const FALLBACK_PRIMARY: ToolLink = { match: [], label: "무료 룰렛 돌리기", path: "/" };
const FALLBACK_SECONDARY: ToolLink = { match: [], label: "유틸리티 모음", path: "/tools" };

function getMatchScore(tool: ToolLink, tagText: string): number {
  return tool.match.reduce((best, keyword) => (tagText.includes(keyword) ? Math.max(best, keyword.length) : best), 0);
}

/** Returns [primary, secondary] with distinct paths, falling back to hub links. */
export function selectPostToolLinks(tags: readonly string[]): [ToolLink, ToolLink] {
  const tagText = tags.join(" ");
  const ranked = TOOL_LINKS
    .map((tool, order) => ({ tool, order, score: getMatchScore(tool, tagText) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map(({ tool }) => tool);
  return [ranked[0] ?? FALLBACK_PRIMARY, ranked[1] ?? FALLBACK_SECONDARY];
}
