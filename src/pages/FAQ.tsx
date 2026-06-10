import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // 룰렛·추첨
  {
    category: "룰렛·추첨",
    question: "SpinFlow는 무료인가요?",
    answer: "네, SpinFlow의 모든 서비스는 완전 무료입니다. 회원가입 없이 바로 이용 가능하며 숨겨진 비용이 없습니다.",
  },
  {
    category: "룰렛·추첨",
    question: "룰렛 결과는 정말 랜덤인가요?",
    answer: "네, SpinFlow 룰렛은 암호학적으로 안전한 난수 생성기(Web Crypto API)를 사용해 완전히 무작위 결과를 보장합니다. 결과를 조작할 수 있는 방법이 없습니다.",
  },
  {
    category: "룰렛·추첨",
    question: "최대 몇 개의 항목을 추가할 수 있나요?",
    answer: "룰렛에는 최대 100개의 항목을 추가할 수 있으며, 각 항목은 최대 50자까지 입력 가능합니다.",
  },
  {
    category: "룰렛·추첨",
    question: "룰렛 설정을 저장하거나 공유할 수 있나요?",
    answer: "URL에 항목이 자동으로 반영됩니다. 해당 URL을 북마크하거나 공유하면 같은 설정으로 다시 이용할 수 있습니다. 항목이 많아 URL이 너무 길어지면 경고가 표시됩니다.",
  },
  // 유틸리티 도구
  {
    category: "유틸리티 도구",
    question: "어떤 유틸리티 도구들이 있나요?",
    answer: "총 51개 무료 도구를 제공합니다. 랜덤(로또·주사위·동전), 텍스트·개발(글자수·JSON·Base64·QR·진법변환·UUID·단어빈도), 계산기(나이·퍼센트·시간·단위·평수·마진·할인율·속도·연비·통계), 건강·피트니스(BMI·칼로리·체지방률·수면·칼로리소모·수분섭취·이상체중), 날짜·시간(날짜·타이머·D-Day), 생활 금융(시급·대출·전월세·복리·퇴직금·연차·실수령액·부가세·더치페이·투자수익률) 카테고리로 구성되어 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "시급 계산기에서 주휴수당은 어떻게 반영하나요?",
    answer: "주 40시간제 기준 월 소정근로시간 174시간 + 주휴시간 35시간 = 209시간으로 계산합니다. 시급 계산기의 '월 근무시간' 기본값이 209시간으로 설정되어 있어 주휴수당이 포함된 환산을 바로 확인할 수 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "대출 계산기에서 원리금균등과 원금균등의 차이는?",
    answer: "원리금균등은 매달 동일한 금액을 납부해 지출 예측이 쉽습니다. 원금균등은 초기 납부액이 높지만 총 이자 부담이 더 적습니다. 대출 계산기에서 두 방식을 모두 비교할 수 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "복리 계산기로 예금·적금 만기금액을 계산할 수 있나요?",
    answer: "네, 복리 계산기에서 원금, 연 이자율, 투자 기간, 복리 주기(매월·매분기·매년)를 입력하면 만기 금액과 총 이자 수익을 자동 계산합니다. 매월 추가 납입도 반영됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "퇴직금 계산기의 계산 기준은 무엇인가요?",
    answer: "근로기준법 및 근로자퇴직급여 보장법 기준입니다. 입사일·퇴사일·최근 3개월 평균임금·연간 상여금을 입력하면 1일 평균임금과 법정 퇴직금을 자동 계산합니다. 1년 미만 근무는 법정 지급 의무가 없습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "연차 계산기로 잔여 연차수당을 계산할 수 있나요?",
    answer: "네, 입사일·기준일·통상시급·사용 연차를 입력하면 발생 연차, 잔여 연차, 미사용 연차수당을 근로기준법 기준으로 자동 계산합니다. 1년 미만은 월 1일(최대 11일), 1년 이상은 15일부터 최대 25일까지 계산됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "연봉 실수령액 계산기는 어떻게 계산하나요?",
    answer: "세전 연봉을 12로 나눈 월급에서 국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험×12.81%), 고용보험(0.9%), 소득세(간이세액표 기준), 지방소득세(소득세×10%)를 공제합니다. 부양가족 수를 선택하면 소득세가 자동 조정됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "칼로리 계산기로 다이어트 칼로리를 알 수 있나요?",
    answer: "네, 성별·나이·키·몸무게와 활동 수준을 입력하면 기초대사량(BMR)과 일일 총 소비 칼로리(TDEE)를 계산합니다. 감량(-500kcal), 유지, 증량 목표별 권장 섭취 칼로리와 3대 영양소 권장 배분도 함께 확인할 수 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "체지방률 계산기는 어떻게 사용하나요?",
    answer: "미국 해군(U.S. Navy) 방식으로 체지방률을 계산합니다. 성별·키·허리·목 둘레(여성은 엉덩이 추가)를 cm 단위로 입력하면 체지방률, 체지방량, 제지방량을 계산하고 필수지방/운동선수/건강/보통/비만 단계로 분류합니다. 줄자 하나로 간편하게 측정할 수 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "수면 계산기로 최적 기상 시각을 어떻게 계산하나요?",
    answer: "취침 시각을 입력하면 90분 수면 사이클 기준 4·5·6 사이클 완료 시점의 기상 시각을 자동 계산합니다. 반대로 기상 시각을 입력하면 최적 취침 시각을 역산합니다. 잠드는 데 평균 15분이 걸린다고 가정해 입면 시간이 포함됩니다. 성인 권장은 5사이클(7.5시간)입니다.",
  },
  {
    category: "유틸리티 도구",
    question: "부가세 계산기로 공급가액과 부가세를 역산할 수 있나요?",
    answer: "네, '부가세 역산' 모드에서 세금포함 금액을 입력하면 공급가액과 부가세를 자동으로 분리합니다. '부가세 추가' 모드에서는 공급가액을 입력하면 부가세(10%)와 세금포함 합계금액을 계산합니다. 견적서·세금계산서 작성 시 활용하세요.",
  },
  {
    category: "유틸리티 도구",
    question: "할인율 계산기는 어떤 경우에 사용하나요?",
    answer: "세 가지 모드를 제공합니다. '할인가 계산': 정가와 할인율을 입력하면 최종 할인가와 절약 금액을 계산합니다. '할인율 계산': 정가와 할인가를 입력하면 실제 할인율이 몇 %인지 역산합니다. '정가 역산': 할인가와 할인율을 알고 있을 때 원래 정가를 구합니다.",
  },
  {
    category: "유틸리티 도구",
    question: "칼로리 소모 계산기에서 MET란 무엇인가요?",
    answer: "MET(대사당량, Metabolic Equivalent of Task)는 안정 시 대사량 대비 활동 강도입니다. 걷기 MET 3.0, 달리기 MET 8.0, 줄넘기 MET 10.0 등으로 수치가 높을수록 칼로리 소모가 큽니다. 소모 칼로리 = MET × 체중(kg) × 시간(시간) 공식으로 계산하며 걷기·달리기·수영·등산 등 14가지 활동을 지원합니다.",
  },
  {
    category: "유틸리티 도구",
    question: "더치페이 계산기에서 원 단위 처리는 어떻게 하나요?",
    answer: "올림·내림·반올림 세 가지 방식을 선택할 수 있습니다. 예를 들어 48,000원을 4명으로 나누면 딱 12,000원이지만, 47,000원을 3명으로 나누면 15,666.67원이 됩니다. 올림 선택 시 15,667원, 내림 시 15,666원, 반올림 시 15,667원입니다. 올림·반올림 시 총합이 실제보다 클 경우 잔액이 표시됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "속도 계산기는 어떻게 사용하나요?",
    answer: "세 가지 모드를 지원합니다. '속도 계산': 거리와 시간을 입력해 km/h·m/s·mph로 속도를 계산합니다. '거리 계산': 속도와 시간을 입력해 이동 거리를 계산합니다. '시간 계산': 거리와 속도를 입력해 소요 시간을 시간·분·초로 계산합니다. 걷기·조깅·자전거·자동차·KTX 속도 프리셋도 제공합니다.",
  },
  {
    category: "유틸리티 도구",
    question: "진법 변환기로 어떤 변환이 가능한가요?",
    answer: "2진수(Binary)·8진수(Octal)·10진수(Decimal)·16진수(Hexadecimal)를 상호 변환합니다. 입력 진법을 선택하고 숫자를 입력하면 나머지 세 가지 진법이 동시에 표시됩니다. 웹 색상 HEX 코드, 프로그래밍 상수 확인, 컴퓨터 과학 학습에 활용하세요.",
  },
  {
    category: "유틸리티 도구",
    question: "연비 계산기로 어떤 계산을 할 수 있나요?",
    answer: "세 가지 모드를 지원합니다. '연비 계산': 주행거리와 주유량을 입력해 km/L를 계산합니다. '연료비 계산': 연비·거리·유가로 이동에 드는 총 연료비를 계산합니다. '주유량 계산': 연비와 목표 거리로 필요한 주유량을 계산합니다. 휘발유·경유·LPG 유가 프리셋도 제공합니다.",
  },
  {
    category: "유틸리티 도구",
    question: "통계 계산기에서 계산되는 항목은 무엇인가요?",
    answer: "개수, 합계, 평균(Mean), 중앙값(Median), 최빈값(Mode), 분산(Variance), 표준편차(Standard Deviation), 최솟값, 최댓값, 범위를 한 번에 계산합니다. 숫자를 쉼표·공백·줄바꿈으로 구분해서 입력하면 됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "수분 섭취량 계산기의 권장량 기준은?",
    answer: "체중(kg)에 활동 수준별 계수(가벼운 30ml/kg, 보통 35ml/kg, 격렬한 40ml/kg)를 곱해 기본 권장량을 계산합니다. 운동 30분마다 350ml, 더운 날씨나 사우나 후 500ml를 추가합니다. 예를 들어 체중 70kg·보통 활동 시 기본 2,450ml(약 10잔)가 됩니다.",
  },
  {
    category: "유틸리티 도구",
    question: "UUID 생성기는 어떻게 사용하나요?",
    answer: "생성할 개수(1·3·5·10)를 선택하고 '새로 생성' 버튼을 누르면 UUID v4가 즉시 만들어집니다. 개별 UUID 옆 '복사' 버튼이나 '전체 복사' 버튼으로 클립보드에 붙여넣기할 수 있습니다. 대문자 토글로 UUID를 대문자로 변환해 복사할 수도 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "이상 체중 계산기는 어떤 공식을 사용하나요?",
    answer: "BMI 기준(정상 18.5~24.9), Broca 공식(남성 (키-100)×0.9 / 여성 (키-100)×0.85), Hamwi 공식(미국 의학 기준)으로 세 가지 이상 체중을 동시에 보여줍니다. 현재 체중을 입력하면 현재 BMI와 체중 카테고리(저체중·정상·과체중·비만·고도비만)도 함께 확인할 수 있습니다.",
  },
  {
    category: "유틸리티 도구",
    question: "투자 수익률 계산기로 어떤 계산이 가능한가요?",
    answer: "세 가지 모드를 지원합니다. 'ROI 계산': 투자 원금과 현재 가치로 총 수익률(%)과 순이익을 계산합니다. 'CAGR 계산': 투자 기간을 추가로 입력해 연평균 복리 수익률을 계산합니다. '목표 금액': 목표 수익률을 달성하기 위해 필요한 금액을 역산합니다.",
  },
  {
    category: "유틸리티 도구",
    question: "단어 빈도 분석기는 어떻게 사용하나요?",
    answer: "분석할 텍스트를 입력하면 단어별 빈도를 자동으로 계산합니다. 최소 글자수 필터(1·2·3자)로 짧은 단어를 제외하거나, 불용어 제거 옵션으로 '이, 가, 을, 를' 같은 조사를 제외할 수 있습니다. 자기소개서 단어 반복 확인, 블로그 핵심 키워드 파악 등에 활용하세요.",
  },
  {
    category: "유틸리티 도구",
    question: "모바일에서도 모든 도구를 사용할 수 있나요?",
    answer: "네, 반응형 웹 디자인으로 제작되어 PC·태블릿·스마트폰 모두에서 최적화된 환경으로 이용 가능합니다. 별도 앱 설치 없이 웹 브라우저에서 바로 사용하세요.",
  },
  // 개인정보·광고
  {
    category: "개인정보·광고",
    question: "개인정보는 어떻게 처리되나요?",
    answer: "룰렛 항목, 계산 입력값 등은 모두 브라우저 내에서만 처리되며 서버로 전송되지 않습니다. 서비스 개선을 위해 GA4 익명 분석 데이터를 수집하며, 자세한 내용은 개인정보처리방침을 확인하세요.",
  },
  {
    category: "개인정보·광고",
    question: "광고가 표시되는데 서비스 이용에 영향이 있나요?",
    answer: "Google AdSense 자동 광고가 표시될 수 있습니다. 광고는 도구 기능·결과값·저장 항목에 전혀 영향을 주지 않으며, 광고 차단기를 사용해도 도구는 정상 작동합니다.",
  },
  // 문의·오류
  {
    category: "문의·오류",
    question: "오류가 발생하면 어떻게 하나요?",
    answer: "페이지를 새로고침하거나 다른 브라우저에서 시도해 보세요. 그래도 해결되지 않으면 문의하기 페이지를 통해 오류 내용을 알려주시면 빠르게 해결해 드립니다.",
  },
  {
    category: "문의·오류",
    question: "새 도구 추가나 기능 개선을 제안할 수 있나요?",
    answer: "네, 문의하기 페이지 또는 GitHub Issues를 통해 제안해 주시면 검토 후 반영합니다. 실제로 사용자 제안으로 추가된 도구들이 있습니다.",
  },
];

const CATEGORIES = [...new Set(faqData.map(f => f.category))];

export default function FAQ() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="자주 묻는 질문 (FAQ) | SpinFlow"
        description="SpinFlow 룰렛, 시급·대출·전월세 계산기, 유틸리티 도구 이용에 관한 자주 묻는 질문과 답변입니다."
        keywords="FAQ, 자주묻는질문, SpinFlow도움말, 룰렛사용법, 시급계산기, 대출계산기"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">FAQ</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">자주 묻는 질문</h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            SpinFlow 서비스 이용에 관한 궁금증을 해결해 드립니다.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 space-y-10">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <h2 className="text-sm font-bold text-cyan-700 uppercase tracking-widest mb-4">{cat}</h2>
            <div className="space-y-3">
              {faqData.filter(f => f.category === cat).map((item, i) => (
                <details
                  key={i}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-cyan-300 transition-colors"
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-bold text-slate-900 pr-4">{item.question}</span>
                    <span className="text-cyan-600 transition-transform group-open:rotate-180 shrink-0 text-sm">▼</span>
                  </summary>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-slate-600 leading-relaxed border-l-2 border-cyan-200 pl-4">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950 mb-3">원하는 답변을 찾지 못하셨나요?</h2>
          <p className="text-slate-500 mb-6">추가 문의사항이 있으시면 언제든지 연락해 주세요.</p>
          <Link
            to="/contact"
            className="inline-block bg-cyan-700 text-white font-bold px-8 py-3 rounded-full hover:bg-cyan-800 transition-all"
          >
            문의하기
          </Link>
        </div>
      </main>
    </div>
  );
}
