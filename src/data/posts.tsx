import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: ReactNode;
  tags: string[];
  thumbnail?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "overcome-decision-fatigue",
    title: "결정 장애(Decision Fatigue)를 극복하는 3가지 과학적인 방법",
    description:
      "현대인의 고질병 결정 장애. 점심 메뉴 고르기부터 인생의 중요한 선택까지, 뇌 과학이 알려주는 스트레스 없는 결정법을 소개합니다.",
    date: "2025-12-10",
    tags: ["심리학", "생산성", "결정장애", "팁"],
    thumbnail:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "오늘 점심 뭐 먹지?"라는 질문에 5분 이상 고민해본 적이 있다면,
          여러분은 '결정 장애' 혹은 심리학 용어로{" "}
          <strong>'결정 피로(Decision Fatigue)'</strong>를 겪고 있는 것입니다.
          현대인은 하루에 약 35,000번의 결정을 내린다고 합니다. 이 과정에서 뇌의
          에너지는 급격히 소모됩니다. (
          <a
            href="https://ko.wikipedia.org/wiki/%EA%B2%B0%EC%A0%95_%ED%94%BC%EB%A1%9C"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            출처: 위키백과 - 결정 피로
          </a>
          )
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          1. 사소한 결정은 '운명'에 맡기세요
        </h2>
        <p>
          스티브 잡스는 매일 같은 옷을 입었고, 버럭 오바마도 회색이나 푸른색
          양복만 입었습니다. 중요하지 않은 결정에 에너지를 낭비하지 않기
          위해서입니다. 점심 메뉴나 회식 장소 같은 선택지는{" "}
          <Link to="/lunch-menu" className="text-neon-primary hover:underline">
            SpinFlow 점심 메뉴 룰렛
          </Link>
          과 같은 도구에 맡겨버리세요. 뇌를 '생각하는 모드'에서 '실행하는
          모드'로, 즉각 전환할 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          2. 선택지를 3개로 줄이세요 (The Rule of 3)
        </h2>
        <p>
          선택지가 너무 많으면 뇌는 '분석 마비(Analysis Paralysis)'에 빠집니다.
          넷플릭스에서 영화를 고르다 시간을 다 보내는 이유가 바로 이것입니다.
          어떤 결정을 내릴 때, 의도적으로 옵션을 3가지로 추려보세요. 3개 중
          하나를 고르는 것은 30개 중 하나를 고르는 것보다 압도적으로 쉽고
          만족도도 높습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          3. '언제' 결정할지를 미리 정하세요
        </h2>
        <p>
          중요한 결정은 아침에 하세요. 기상 후 1시간~3시간 사이가 뇌의 전두엽이
          가장 활발한 시간대입니다. 반대로 저녁 늦은 시간에는 충동적인 결정을
          내리기 쉽습니다. 쇼핑이나 야식 메뉴 선정 등 감정이 앞서는 선택은{" "}
          <Link
            to="/random-number"
            className="text-neon-primary hover:underline"
          >
            랜덤 룰렛
          </Link>
          을 통해 우연에 맡기거나 내일 아침으로 미루는 것이 현명합니다.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          완벽한 선택을 하려는 강박을 내려놓으세요. 대부분의 일상적인 결정은
          '어떤 선택(Option)'을 하느냐보다 선택 후에 '어떻게(Action)'
          행동하느냐가 결과를 만듭니다. 지금 당장 고민이 된다면? 스핀 버튼을
          누르고 그 결과에 따라 움직여보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "bmi-healthy-weight-guide",
    title: "BMI 계산기로 알아보는 건강한 체중 관리의 모든 것",
    description:
      "BMI(체질량지수)의 의미와 한계, 올바른 체중 관리 방법까지. 숫자에만 의존하지 않는 진정한 건강 관리 가이드입니다.",
    date: "2025-12-11",
    tags: ["건강", "BMI", "다이어트", "웰빙"],
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          체중계에 올라가는 순간, 많은 사람들이 복잡한 감정을 느낍니다. 하지만
          체중이라는 숫자 하나로 건강을 판단하는 것은 매우 제한적인 접근입니다.
          오늘은 <strong>BMI(체질량지수)</strong>가 무엇인지, 어떻게 활용해야
          하는지, 그리고 진정한 건강 관리는 무엇인지 알아보겠습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI란 무엇인가?
        </h2>
        <p>
          BMI(Body Mass Index, 체질량지수)는 키와 체중을 이용해 비만도를
          추정하는 지표입니다. 계산 방법은 간단합니다:{" "}
          <strong>체중(kg) ÷ 키(m)²</strong>
        </p>
        <p>
          예를 들어, 키 170cm에 체중 70kg인 사람의 BMI는 70 ÷ 1.7² = 약
          24.2입니다.
          <Link
            to="/tools/bmi-calculator"
            className="text-neon-primary hover:underline ml-1"
          >
            BMI 계산기
          </Link>
          를 사용하면 직접 계산하지 않아도 즉시 결과를 확인할 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          대한비만학회 BMI 기준
        </h2>
        <div className="bg-white/5 p-4 rounded-lg">
          <ul className="space-y-2">
            <li>
              • <strong className="text-blue-400">저체중</strong>: 18.5 미만
            </li>
            <li>
              • <strong className="text-green-400">정상</strong>: 18.5 ~ 22.9
            </li>
            <li>
              • <strong className="text-yellow-400">과체중</strong>: 23 ~ 24.9
            </li>
            <li>
              • <strong className="text-orange-400">비만</strong>: 25 ~ 29.9
            </li>
            <li>
              • <strong className="text-red-400">고도비만</strong>: 30 이상
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI의 한계점
        </h2>
        <p>BMI는 간편하지만, 몇 가지 중요한 한계가 있습니다:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>근육량 미반영:</strong> 근육이 많은 사람은 BMI가 높게 나올
            수 있습니다.
          </li>
          <li>
            <strong>체지방 분포 무시:</strong> 같은 BMI라도 복부비만 여부에 따라
            건강 위험이 다릅니다.
          </li>
          <li>
            <strong>연령/성별 차이:</strong> 나이가 들수록, 그리고 성별에 따라
            적정 체지방률이 다릅니다.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          진정한 건강 관리 팁
        </h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>규칙적인 운동:</strong> 주 3회 이상, 30분 이상의 유산소
            운동을 권장합니다.
          </li>
          <li>
            <strong>균형 잡힌 식단:</strong> 탄수화물, 단백질, 지방을 적절히
            섭취하세요.
          </li>
          <li>
            <strong>충분한 수면:</strong> 7~8시간의 숙면은 체중 관리에 큰 영향을
            미칩니다.
          </li>
          <li>
            <strong>정기적인 건강검진:</strong> BMI 외에도 혈압, 혈당,
            콜레스테롤 등을 확인하세요.
          </li>
        </ol>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          BMI는 건강 상태를 파악하는 하나의 지표일 뿐, 절대적인 기준이 아닙니다.
          숫자에 너무 연연하기보다는 전반적인 생활 습관 개선에 집중하세요.
          건강한 몸은 건강한 마음에서 시작됩니다!
        </p>
      </div>
    ),
  },
  {
    slug: "password-security-guide",
    title: "강력한 비밀번호 만들기: 해킹으로부터 계정을 지키는 완벽 가이드",
    description:
      "매년 수백만 개의 계정이 해킹됩니다. 안전한 비밀번호를 만들고 관리하는 방법을 알아보세요.",
    date: "2025-12-12",
    tags: ["보안", "비밀번호", "팁", "인터넷"],
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "123456", "password", "qwerty"... 여전히 많은 사람들이 이런 비밀번호를
          사용합니다. 2023년 기준, 가장 많이 사용되는 비밀번호 상위 10개는 1초도
          안 되어 해킹될 수 있습니다. 오늘은 <strong>강력한 비밀번호</strong>를
          만들고 관리하는 방법을 알아봅니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          취약한 비밀번호의 위험성
        </h2>
        <p>
          해커들은 '브루트 포스(Brute Force)' 공격으로 초당 수십억 개의 비밀번호
          조합을 시도할 수 있습니다. 8자리 숫자로만 된 비밀번호는 단 몇 초 만에
          뚫립니다.
        </p>
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-300">
            ⚠️ 피해야 할 비밀번호: 생일, 전화번호, 연속된 숫자, 키보드
            패턴(qwerty), 이름+생년월일 조합
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          강력한 비밀번호의 조건
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>길이:</strong> 최소 12자 이상 (16자 권장)
          </li>
          <li>
            <strong>복잡성:</strong> 대문자, 소문자, 숫자, 특수문자 혼합
          </li>
          <li>
            <strong>무작위성:</strong> 예측 불가능한 조합
          </li>
          <li>
            <strong>고유성:</strong> 서비스마다 다른 비밀번호 사용
          </li>
        </ul>
        <p className="mt-4">
          직접 만들기 어렵다면{" "}
          <Link
            to="/tools/random-password"
            className="text-neon-primary hover:underline"
          >
            비밀번호 생성기
          </Link>
          를 활용해보세요. 암호학적으로 안전한 랜덤 비밀번호를 즉시 생성할 수
          있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          비밀번호 관리 베스트 프랙티스
        </h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>비밀번호 관리자 사용:</strong> 1Password, Bitwarden 같은
            도구로 모든 비밀번호를 안전하게 저장하세요.
          </li>
          <li>
            <strong>2단계 인증(2FA) 활성화:</strong> 비밀번호 유출 시에도 추가
            보안 레이어가 계정을 보호합니다.
          </li>
          <li>
            <strong>정기적 변경:</strong> 중요한 계정(은행, 이메일)은
            3~6개월마다 변경하세요.
          </li>
          <li>
            <strong>유출 확인:</strong> haveibeenpwned.com 같은 사이트에서
            자신의 정보가 유출되었는지 확인하세요.
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          기억하기 쉬운 강력한 비밀번호 만들기
        </h2>
        <p>
          완전히 랜덤한 문자열은 외우기 어렵습니다. 대신
          '패스프레이즈(Passphrase)' 방식을 사용해보세요:
        </p>
        <div className="bg-white/5 p-4 rounded-lg mt-4">
          <p className="text-neon-primary font-mono">
            "나는2024년에@서울로이사한다!"
          </p>
          <p className="text-sm text-gray-500 mt-2">
            → 한글, 숫자, 특수문자가 모두 포함된 20자 이상의 강력한 비밀번호
          </p>
        </div>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          강력한 비밀번호는 디지털 시대의 첫 번째 방어선입니다. 귀찮더라도 지금
          바로 주요 계정의 비밀번호를 점검하고 강화하세요. 한 번의 수고가 큰
          피해를 예방할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "color-code-complete-guide",
    title: "색상 코드 완벽 가이드: HEX, RGB, HSL 이해하기",
    description:
      "웹 디자인에서 색상을 표현하는 다양한 방법을 알아봅니다. HEX, RGB, HSL의 차이점과 활용법을 완벽 정리합니다.",
    date: "2025-12-13",
    tags: ["디자인", "웹개발", "색상", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          웹사이트나 앱을 만들 때 색상은 매우 중요한 요소입니다. 그런데 색상을
          표현하는 방식이 여러 가지라 처음에는 헷갈릴 수 있습니다. 오늘은 가장
          많이 사용되는 세 가지 색상 표현 방식인 <strong>HEX, RGB, HSL</strong>
          에 대해 알아보겠습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          HEX (16진수) 색상 코드
        </h2>
        <p>
          가장 널리 사용되는 색상 표현 방식입니다. #기호로 시작하며 6자리의
          16진수로 구성됩니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-mono text-lg">#FF5733</p>
          <p className="text-sm text-gray-500 mt-2">
            FF(빨강) + 57(초록) + 33(파랑) = 주황빛 빨강색
          </p>
        </div>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>장점:</strong> 간결하고, 웹에서 가장 보편적으로 사용
          </li>
          <li>
            <strong>단점:</strong> 색상 조절이 직관적이지 않음
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          RGB (Red, Green, Blue)
        </h2>
        <p>
          빨강(Red), 초록(Green), 파랑(Blue)의 세 가지 원색을 조합하여 색상을
          표현합니다. 각 값은 0~255 사이의 숫자입니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-mono text-lg">rgb(255, 87, 51)</p>
          <p className="text-sm text-gray-500 mt-2">
            #FF5733과 동일한 색상을 RGB로 표현
          </p>
        </div>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>장점:</strong> 투명도(Alpha) 추가 가능 → rgba(255, 87, 51,
            0.5)
          </li>
          <li>
            <strong>단점:</strong> 색상/채도/밝기 조절이 어려움
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          HSL (Hue, Saturation, Lightness)
        </h2>
        <p>
          색상(Hue), 채도(Saturation), 밝기(Lightness)로 색을 표현하는
          방식입니다. 색상 조절이 가장 직관적입니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-mono text-lg">hsl(14, 100%, 60%)</p>
          <p className="text-sm text-gray-500 mt-2">
            색상 14도(주황), 채도 100%, 밝기 60%
          </p>
        </div>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>장점:</strong> 밝기와 채도 조절이 쉬움, 색상 팔레트 생성에
            유리
          </li>
          <li>
            <strong>단점:</strong> 아직 HEX만큼 보편적이지 않음
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언제 어떤 형식을 사용할까?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-2 px-4">상황</th>
                <th className="text-left py-2 px-4">추천 형식</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-2 px-4">CSS 기본 색상 정의</td>
                <td className="py-2 px-4">HEX</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 px-4">투명도가 필요할 때</td>
                <td className="py-2 px-4">RGBA</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 px-4">색상 팔레트 생성</td>
                <td className="py-2 px-4">HSL</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 px-4">호버 효과 (밝기 조절)</td>
                <td className="py-2 px-4">HSL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          색상 변환이 필요하다면{" "}
          <Link
            to="/tools/color-converter"
            className="text-neon-primary hover:underline"
          >
            색상 변환기
          </Link>
          를 활용해보세요.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          색상 코드는 처음엔 복잡해 보이지만, 각각의 특성을 이해하면 상황에 맞게
          활용할 수 있습니다. 디자인 작업을 할 때 이 세 가지 형식을 자유자재로
          활용해보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "time-management-productivity",
    title: "시간 관리의 기술: 생산성을 2배로 높이는 실전 전략",
    description:
      "바쁘게 움직이는데 왜 할 일은 줄지 않을까요? 시간 관리 전문가들이 추천하는 실천 가능한 생산성 향상 전략을 소개합니다.",
    date: "2025-12-14",
    tags: ["생산성", "시간관리", "자기계발", "팁"],
    thumbnail:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          하루 24시간, 모든 사람에게 동일하게 주어진 시간. 그런데 누군가는 같은
          시간에 더 많은 일을 해내고, 누군가는 항상 시간이 부족하다고 느낍니다.
          그 차이는 무엇일까요? 바로 <strong>시간 관리 능력</strong>입니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          1. 타임 블로킹(Time Blocking)
        </h2>
        <p>
          하루를 시간 단위로 나누어 각 블록에 특정 작업을 할당하는 방법입니다.
          예를 들어 오전 9시~11시는 "집중 작업 시간", 오후 2시~3시는 "이메일
          처리 시간"으로 정하는 것이죠.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-neon-primary font-bold mb-2">💡 팁</p>
          <p>
            집중력이 가장 높은 시간대에 가장 중요한 업무를 배치하세요. 대부분의
            사람들은 오전 10시~12시가 가장 집중력이 높습니다.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          2. 포모도로 테크닉
        </h2>
        <p>
          25분 집중 + 5분 휴식을 한 세트로 반복하는 방법입니다. 4세트 후에는
          15~30분의 긴 휴식을 취합니다.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>25분 동안 한 가지 일에만 집중</li>
          <li>5분 휴식 (스트레칭, 물 마시기)</li>
          <li>4세트 후 긴 휴식</li>
        </ul>
        <p className="mt-4">
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            시간 계산기
          </Link>
          를 사용하면 작업 시간을 정확히 측정하고 관리할 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          3. 아이젠하워 매트릭스
        </h2>
        <p>모든 할 일을 긴급성과 중요도에 따라 4가지 영역으로 분류합니다:</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <p className="font-bold text-red-400">긴급 + 중요</p>
            <p className="text-sm">즉시 처리</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
            <p className="font-bold text-blue-400">중요 (비긴급)</p>
            <p className="text-sm">일정 계획</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <p className="font-bold text-yellow-400">긴급 (비중요)</p>
            <p className="text-sm">위임</p>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/30 p-4 rounded-lg">
            <p className="font-bold text-gray-400">비긴급 + 비중요</p>
            <p className="text-sm">제거</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. 2분 규칙</h2>
        <p>
          2분 안에 끝낼 수 있는 일은 미루지 말고 바로 처리하세요. 이메일 답장,
          간단한 메모, 전화 예약 등이 해당됩니다. 작은 일들을 쌓아두면 나중에 큰
          부담이 됩니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          5. 디지털 디톡스
        </h2>
        <p>
          집중 시간에는 스마트폰 알림을 끄고, SNS 앱을 숨기세요. 불필요한 방해를
          없애는 것만으로도 생산성이 크게 향상됩니다.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          완벽한 시간 관리 시스템은 없습니다. 중요한 것은 자신에게 맞는 방법을
          찾아 꾸준히 실천하는 것입니다. 오늘 소개한 기법들 중 하나를 선택해서
          일주일만 실천해보세요. 작은 변화가 큰 차이를 만들어냅니다!
        </p>
      </div>
    ),
  },
  {
    slug: "random-choice-psychology",
    title: "랜덤 선택의 심리학: 왜 우리는 결정을 위임하고 싶어하는가",
    description:
      "동전 던지기, 룰렛 돌리기... 우리는 왜 중요한 선택을 운에 맡기려 할까요? 심리학적 관점에서 랜덤 선택의 본질을 탐구합니다.",
    date: "2025-12-15",
    tags: ["심리학", "결정", "인사이트", "룰렛"],
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "짜장면 먹을까 짬뽕 먹을까?" 고민 끝에 동전을 던진 경험이 있으신가요?
          흥미로운 점은, 동전이 공중에 떠 있는 순간 우리는 이미 원하는 답을 알게
          된다는 것입니다. 오늘은 <strong>랜덤 선택</strong>이 우리 심리에
          미치는 영향에 대해 알아봅니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          결정 피로와 인지 부하
        </h2>
        <p>
          현대인은 하루에 평균 35,000번의 결정을 내린다고 합니다. 아침에
          일어나서 무엇을 입을지, 무엇을 먹을지, 어떤 길로 출근할지... 이 모든
          선택이 뇌의 에너지를 소모합니다.
        </p>
        <p>
          심리학에서는 이를 <strong>'결정 피로(Decision Fatigue)'</strong>라고
          부릅니다. 결정을 많이 할수록 이후의 판단력이 떨어지고, 충동적인 선택을
          하기 쉬워집니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          운에 맡기는 것의 심리적 이점
        </h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>
            <strong>책임 분산:</strong>
            결과가 좋지 않아도 "룰렛이 그렇게 나왔으니까"라고 합리화할 수
            있습니다. 이는 후회를 줄이고 심리적 부담을 덜어줍니다.
          </li>
          <li>
            <strong>분석 마비 탈출:</strong>
            너무 많은 정보와 선택지 앞에서 아무 결정도 못하는 상태에서 벗어날 수
            있습니다.
          </li>
          <li>
            <strong>잠재된 선호 발견:</strong>
            동전이 던져지는 순간, 우리는 어느 쪽이 나오길 바라는지 알게 됩니다.
            랜덤 선택은 숨겨진 본심을 드러내는 촉매 역할을 합니다.
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          고대부터 이어진 제비뽑기의 전통
        </h2>
        <p>
          랜덤 선택은 현대의 발명품이 아닙니다. 고대 그리스에서는 공직자를
          제비뽑기로 선출했고(추첨제, Sortition), 성경에서도 중요한 결정을
          제비뽑기로 한 기록이 있습니다. 로마 시대에는 "운명의 여신(Fortuna)"을
          모시는 신전이 있었죠.
        </p>
        <p>
          이러한 전통은 모든 선택에 동등한 기회를 부여함으로써 편견이나 정치적
          영향력을 배제하려는 시도이기도 했습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언제 랜덤 선택이 효과적인가?
        </h2>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-neon-primary font-bold mb-3">
            ✅ 랜덤 선택이 적합한 경우
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>선택지 간 차이가 크지 않을 때 (점심 메뉴)</li>
            <li>어떤 선택을 해도 큰 문제가 없을 때</li>
            <li>결정 자체가 재미의 요소일 때 (게임, 이벤트)</li>
            <li>공정성이 중요할 때 (순서 정하기, 당첨자 추첨)</li>
          </ul>
        </div>
        <div className="bg-white/5 p-4 rounded-lg mt-4">
          <p className="text-red-400 font-bold mb-3">
            ❌ 랜덤 선택이 부적합한 경우
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>결과에 따른 차이가 매우 클 때 (진로, 투자)</li>
            <li>전문 지식이 필요한 결정</li>
            <li>되돌리기 어려운 결정</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          SpinFlow와 함께하는 현명한 결정
        </h2>
        <p>
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          은 사소한 결정에 지치지 않도록 도와드립니다. 점심 메뉴, 영화 선택,
          순서 정하기 같은 일상의 선택은 룰렛에 맡기고, 정말 중요한 일에
          에너지를 집중하세요.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          랜덤 선택은 무책임한 행동이 아닙니다. 때로는 분석보다 직관이, 숙고보다
          행동이 더 나은 결과를 가져옵니다. 다음에 결정이 어려울 때, 룰렛을
          돌려보세요. 그리고 결과가 나오는 순간 느껴지는 감정을 관찰해보세요.
          그것이 당신의 진짜 마음입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "digital-wellbeing-tips",
    title: "디지털 웰빙: 스마트폰과 건강하게 공존하는 7가지 방법",
    description:
      "하루 평균 7시간을 스마트폰과 함께하는 현대인. 디지털 피로를 줄이고 건강한 기기 사용 습관을 만드는 실천 가이드입니다.",
    date: "2025-12-16",
    tags: ["웰빙", "생산성", "건강", "라이프스타일"],
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          스마트폰 없이 하루를 보낸다는 것이 상상이 되시나요? 2024년 기준,
          한국인의 하루 평균 스마트폰 사용 시간은 약 5~7시간에 달합니다. 이는
          깨어있는 시간의 거의 절반입니다. 오늘은{" "}
          <strong>디지털 웰빙(Digital Wellbeing)</strong>을 실천하는 방법을
          알아봅니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          1. 아침 루틴에서 스마트폰 제외하기
        </h2>
        <p>
          눈 뜨자마자 스마트폰을 확인하는 습관은 하루를 수동적으로 시작하게
          만듭니다. 기상 후 최소 30분~1시간은 스마트폰 없이 시작해보세요.
          스트레칭, 명상, 간단한 조식 준비 등으로 대체할 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          2. 알림 설정 정리하기
        </h2>
        <p>
          정말 중요한 앱의 알림만 남기고 나머지는 모두 꺼두세요. 대부분의 알림은
          '지금 당장' 확인할 필요가 없습니다. 필수 알림: 전화, 메시지, 캘린더
          정도면 충분합니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          3. 그레이스케일 모드 활용
        </h2>
        <p>
          스마트폰 화면을 흑백으로 설정하면 시각적 자극이 줄어들어 자연스럽게
          사용 시간이 감소합니다. (
          <a
            href="https://www.sciencedirect.com/science/article/pii/S0747563219303723"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            연구 출처
          </a>
          ) 설정 → 접근성 → 색상 필터에서 활성화할 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          4. 앱 사용 시간 제한 설정
        </h2>
        <p>
          iOS의 '스크린 타임', 안드로이드의 '디지털 웰빙' 기능을 활용하세요. SNS
          앱에 하루 30분~1시간 제한을 걸어두면 효과적입니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          5. 잠자리에 스마트폰 두지 않기
        </h2>
        <p>
          침실에 스마트폰을 두지 마세요. 알람이 필요하다면 일반 알람시계를
          사용하세요. 블루라이트는 수면의 질을 떨어뜨리고, 자기 전 스마트폰
          사용은 뇌를 각성 상태로 만듭니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          6. '폰 프리' 시간대 만들기
        </h2>
        <p>
          식사 시간, 가족과 함께 하는 시간, 운동 시간 등 하루 중 특정 시간대를
          스마트폰 없이 보내는 습관을 들이세요.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          7. 목적 있는 사용하기
        </h2>
        <p>
          스마트폰을 들 때마다 "왜 지금 이걸 켜는가?"라고 자문해보세요. 목적
          없이 습관적으로 켜는 횟수가 줄어들면 전체 사용 시간이 크게 감소합니다.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          스마트폰은 훌륭한 도구이지만, 도구가 주인이 되어서는 안 됩니다. 작은
          습관 변화부터 시작해보세요. 디지털 기기와 건강하게 공존하는 것, 그것이
          진정한 디지털 웰빙입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "qr-code-guide",
    title: "QR 코드 완벽 가이드: 원리부터 활용까지",
    description:
      "어디에나 있는 QR 코드. 어떻게 작동하는지, 어떻게 만들고 활용하는지 알아봅니다.",
    date: "2025-12-17",
    tags: ["기술", "가이드", "QR코드", "마케팅"],
    thumbnail:
      "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          카페 메뉴, 명함, 박물관 안내판, 심지어 결제까지.
          <strong>QR 코드(Quick Response Code)</strong>는 이제 일상의 일부가
          되었습니다. 이 작은 사각형 안에 어떤 비밀이 숨어있는지 알아볼까요?
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">QR 코드란?</h2>
        <p>
          QR 코드는 1994년 일본의{" "}
          <a
            href="https://en.wikipedia.org/wiki/QR_code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            덴소웨이브(Denso Wave)
          </a>
          가 개발한 2차원 바코드입니다. 기존 바코드가 가로 방향으로만 정보를
          저장하는 반면, QR 코드는 가로와 세로 두 방향으로 정보를 저장해 더 많은
          데이터를 담을 수 있습니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-neon-secondary font-bold mb-2">
            💡 저장 가능 용량
          </p>
          <ul className="space-y-1">
            <li>• 숫자: 최대 7,089자</li>
            <li>• 영숫자: 최대 4,296자</li>
            <li>• 한글/한자: 최대 1,817자</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR 코드의 구조
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>파인더 패턴:</strong> 세 모서리의 큰 사각형, 스캐너가 QR
            코드를 인식하는 기준점
          </li>
          <li>
            <strong>얼라인먼트 패턴:</strong> 크기가 큰 QR 코드에서 왜곡을
            보정하는 작은 사각형
          </li>
          <li>
            <strong>타이밍 패턴:</strong> 검은색과 흰색이 번갈아 나오는 선, 셀
            위치 파악용
          </li>
          <li>
            <strong>데이터 영역:</strong> 실제 정보가 저장되는 부분
          </li>
          <li>
            <strong>오류 정정 코드:</strong> 일부가 손상되어도 복구 가능하게
            하는 정보
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR 코드 활용 사례
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">📱 모바일 결제</h3>
            <p className="text-sm">카카오페이, 네이버페이 등 간편 결제</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">🍽️ 비대면 주문</h3>
            <p className="text-sm">테이블 오더, 메뉴 확인</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">🎫 티켓/입장권</h3>
            <p className="text-sm">영화, 공연, 항공권 등</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">📦 제품 정보</h3>
            <p className="text-sm">원산지, 유통기한, 인증 정보</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          나만의 QR 코드 만들기
        </h2>
        <p>
          <Link
            to="/tools/qr-code-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow QR 코드 생성기
          </Link>
          를 사용하면 URL, 텍스트, 연락처 정보 등을 담은 QR 코드를 무료로 만들
          수 있습니다. 명함, SNS 프로필, 와이파이 정보 공유 등에 활용해보세요.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          QR 코드는 단순한 기술 같지만, 오프라인과 온라인을 연결하는 강력한
          도구입니다. 비즈니스 홍보, 개인 브랜딩, 정보 공유 등 다양한 목적으로
          활용해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "json-for-beginners",
    title: "JSON 완벽 이해: 개발자가 아니어도 알아야 하는 데이터 형식",
    description:
      "API, 설정 파일, 데이터 교환의 핵심 JSON. 비개발자도 쉽게 이해할 수 있도록 설명합니다.",
    date: "2025-12-18",
    tags: ["개발", "가이드", "JSON", "기초"],
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          웹 개발자나 데이터 분석가가 아니더라도, 디지털 시대를 살아가다 보면{" "}
          <strong>JSON</strong>이라는 단어를 마주칠 때가 있습니다. API 연동,
          설정 파일, 데이터 내보내기 등 다양한 곳에서 사용되는 이 형식, 오늘
          완벽하게 이해해봅시다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">JSON이란?</h2>
        <p>
          JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하기 위한
          텍스트 형식입니다. 사람이 읽기 쉽고, 기계가 분석하기도 쉬운 것이
          특징입니다.
        </p>
        <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
          <pre className="text-neon-secondary">{`{
  "name": "홍길동",
  "age": 30,
  "isStudent": false,
  "hobbies": ["독서", "영화", "여행"]
}`}</pre>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          JSON의 기본 문법
        </h2>
        <p className="mb-4">
          JSON은{" "}
          <a
            href="https://www.json.org/json-ko.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            공식 표준
          </a>
          으로 정의된 간단한 문법을 따릅니다:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>객체(Object):</strong> 중괄호 {`{}`}로 감싸고, "키": 값
            형태로 작성
          </li>
          <li>
            <strong>배열(Array):</strong> 대괄호 []로 감싸고, 쉼표로 구분
          </li>
          <li>
            <strong>문자열:</strong> 반드시 큰따옴표("")로 감싸야 함
          </li>
          <li>
            <strong>숫자:</strong> 따옴표 없이 그냥 숫자로 작성
          </li>
          <li>
            <strong>불린:</strong> true 또는 false (따옴표 없이)
          </li>
          <li>
            <strong>null:</strong> 값이 없음을 나타냄
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 JSON을 사용할까?
        </h2>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>언어 독립적:</strong> JavaScript에서 유래했지만, 거의 모든
            프로그래밍 언어에서 지원
          </li>
          <li>
            <strong>가볍다:</strong> XML보다 적은 용량으로 같은 정보를 표현
          </li>
          <li>
            <strong>읽기 쉽다:</strong> 사람이 보고 바로 구조를 파악할 수 있음
          </li>
          <li>
            <strong>웹 API의 표준:</strong> REST API의 데이터 교환 형식으로 널리
            사용
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          JSON 작업 시 주의사항
        </h2>
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
          <p className="text-red-300 font-bold mb-2">❌ 흔한 실수</p>
          <ul className="space-y-1 text-sm">
            <li>• 마지막 항목 뒤에 쉼표 넣기 (불가!)</li>
            <li>• 작은따옴표(') 사용하기 (큰따옴표만 허용!)</li>
            <li>• 주석 넣기 (JSON은 주석 미지원!)</li>
          </ul>
        </div>
        <p className="mt-4">
          JSON 문법 오류를 찾기 어렵다면
          <Link
            to="/tools/json-formatter"
            className="text-neon-primary hover:underline ml-1"
          >
            JSON 포맷터
          </Link>
          를 사용해보세요. 유효성 검사와 함께 보기 좋게 정리해줍니다.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          JSON은 현대 웹의 핏줄 같은 존재입니다. 개발자가 아니더라도 기본 구조를
          이해하면 API 문서를 읽거나 설정 파일을 수정하는 데 큰 도움이 됩니다.
        </p>
      </div>
    ),
  },
  {
    slug: "dday-calculator-life-hacks",
    title: "D-Day 계산기 200% 활용법: 목표 달성의 비밀 무기",
    description:
      "시험, 프로젝트 마감, 결혼식, 휴가까지. D-Day 계산기를 활용해 동기부여를 높이고 목표를 관리하는 방법을 알아봅니다.",
    date: "2025-12-19",
    tags: ["생산성", "목표관리", "팁", "라이프해킹"],
    thumbnail:
      "https://images.unsplash.com/photo-1435527173128-983b87201f4d?q=80&w=2667&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "시험까지 D-100", "결혼식 D-30", "프로젝트 마감 D-7"... 우리는 중요한
          날을 카운트다운하며 살아갑니다.
          <Link
            to="/tools/dday-counter"
            className="text-neon-primary hover:underline mx-1"
          >
            D-Day 계산기
          </Link>
          를 단순히 날짜 계산 도구로만 사용하고 계신가요? 오늘은 이 도구를 200%
          활용하는 방법을 알아봅니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          1. 큰 목표를 작은 마일스톤으로 쪼개기
        </h2>
        <p>
          "1년 후 마라톤 완주"라는 목표가 있다면, 중간 마일스톤을 설정하세요.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>D-365: 목표 설정</li>
          <li>D-300: 5km 완주</li>
          <li>D-200: 10km 완주</li>
          <li>D-100: 하프마라톤 완주</li>
          <li>D-Day: 풀마라톤 완주</li>
        </ul>
        <p className="mt-4">
          각 마일스톤마다 별도의 D-Day를 설정하면 달성감을 더 자주 느낄 수
          있습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          2. 역산 계획법 (Backward Planning)
        </h2>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Backward_planning"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            목표일로부터 역으로 계획
          </a>
          을 세우세요.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-bold text-white mb-2">📚 예: 시험 준비</p>
          <ul className="text-sm space-y-1">
            <li>• D-Day: 시험일</li>
            <li>• D-7: 최종 복습만</li>
            <li>• D-14: 모의고사 풀이</li>
            <li>• D-30: 기출문제 분석</li>
            <li>• D-60: 개념 정리 완료</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          3. D+ (경과일) 활용하기
        </h2>
        <p>D-Day만 있는 게 아닙니다. D+ 기능을 활용해:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>금연/금주:</strong> "금연 D+100, 잘 하고 있어!"
          </li>
          <li>
            <strong>운동 기록:</strong> "러닝 시작한 지 D+365"
          </li>
          <li>
            <strong>연애 기념일:</strong> "만난 지 D+1000"
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          4. 시각화의 힘
        </h2>
        <p>D-Day를 눈에 잘 보이는 곳에 두세요.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>스마트폰 잠금화면 위젯</li>
          <li>컴퓨터 바탕화면</li>
          <li>책상 위 포스트잇</li>
        </ul>
        <p className="mt-4">
          남은 날짜를 시각적으로 자주 확인하면 긴급성을 느껴 행동으로 이어지기
          쉽습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          5. 복수의 D-Day 관리하기
        </h2>
        <p>
          삶에는 여러 중요한 날짜가 동시에 존재합니다. 업무 마감, 기념일, 개인
          목표 등을 카테고리별로 관리하세요.
        </p>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          D-Day 계산기는 단순한 날짜 계산 도구가 아닙니다. 목표를 명확히 하고,
          계획을 수립하고, 동기부여를 유지하는 강력한 도구입니다. 오늘 당장
          여러분의 다음 중요한 날짜를 설정해보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "qr-code-generator-guide",
    title: "무료 QR코드 생성기 완벽 가이드 - 링크를 QR코드로 5초 만에 변환",
    description:
      "QR코드가 무엇인지, 어떻게 만드는지, 어디에 활용하는지 완벽하게 알아봅니다. 무료 온라인 QR코드 생성기로 명함, 포스터, 메뉴판까지 손쉽게 제작하세요.",
    date: "2026-01-05",
    tags: ["QR코드", "유틸리티", "마케팅", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          식당 메뉴판, 명함, 포스터, 유튜브 영상... 어디서나 QR코드를 볼 수
          있습니다. 스마트폰 카메라만 있으면 즉시 링크로 이동할 수 있어 마케팅과
          정보 전달에 필수적인 도구가 되었죠. 이 글에서는 QR코드의 원리부터
          무료로 만드는 방법, 그리고 실전 활용법까지 모두 알려드립니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR코드란 무엇인가?
        </h2>
        <p>
          QR코드(Quick Response Code)는 1994년 일본 덴소 웨이브(Denso Wave)가
          개발한 2차원 바코드입니다. 기존 바코드(1차원)가 최대 20자리 숫자만
          저장할 수 있는 반면, QR코드는 최대 <strong>7,089자의 숫자</strong>,
          <strong>4,296자의 문자</strong>를 담을 수 있습니다. URL, 텍스트,
          연락처, Wi-Fi 정보 등 다양한 데이터를 저장할 수 있어 활용 범위가 매우
          넓습니다.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR코드 5초 만에 만드는 방법
        </h2>
        <p>
          복잡한 프로그램 설치 없이{" "}
          <Link
            to="/tools/qr-code-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow QR코드 생성기
          </Link>
          를 사용하면 누구나 5초 만에 무료로 QR코드를 만들 수 있습니다.
        </p>
        <ol className="list-decimal pl-6 space-y-3 mt-4">
          <li>QR코드 생성기 페이지에 접속합니다.</li>
          <li>변환할 URL 또는 텍스트를 입력합니다.</li>
          <li>자동으로 생성된 QR코드를 PNG로 다운로드합니다.</li>
          <li>명함, 포스터, 소셜미디어에 바로 활용합니다.</li>
        </ol>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR코드 활용 아이디어 10가지
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[
            {
              title: "📇 명함",
              desc: "포트폴리오나 LinkedIn 프로필 링크 삽입",
            },
            {
              title: "🍽️ 식당 메뉴판",
              desc: "종이 메뉴 대신 디지털 메뉴로 연결",
            },
            {
              title: "📦 제품 패키지",
              desc: "사용 설명서나 리뷰 페이지로 연결",
            },
            {
              title: "📢 포스터/현수막",
              desc: "이벤트 신청 폼이나 상세 정보 페이지",
            },
            {
              title: "📶 Wi-Fi 공유",
              desc: "카페/사무실 와이파이 비밀번호 공유",
            },
            { title: "🎁 선물 포장", desc: "개인 메시지나 영상 편지 링크" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white">{item.title}</p>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR코드 잘 만드는 팁
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>URL은 짧게:</strong> URL이 길수록 QR코드가 복잡해져 인식률이
            떨어집니다. 단축 URL 서비스를 활용하세요.
          </li>
          <li>
            <strong>충분한 크기:</strong> 인쇄 시 최소 2cm × 2cm 이상으로
            출력하세요.
          </li>
          <li>
            <strong>여백 확보:</strong> QR코드 주변에 흰색 여백(콰이어트 존)을
            충분히 확보하세요.
          </li>
          <li>
            <strong>테스트 필수:</strong> 인쇄 전 반드시 스마트폰으로 스캔해
            동작을 확인하세요.
          </li>
          <li>
            <strong>대비 유지:</strong> QR코드는 어두운 색 위에 밝은 배경으로
            만들어야 잘 읽힙니다.
          </li>
        </ul>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          QR코드는 이제 선택이 아닌 필수입니다. 복잡한 URL을 기억할 필요 없이,
          카메라 하나로 원하는 정보에 즉시 접근할 수 있게 해주는 강력한
          도구입니다.
          <Link
            to="/tools/qr-code-generator"
            className="text-neon-primary hover:underline ml-1"
          >
            SpinFlow 무료 QR코드 생성기
          </Link>
          로 지금 바로 나만의 QR코드를 만들어보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "strong-password-guide",
    title: "강력한 비밀번호 만들기 완벽 가이드 - 해킹에서 내 계정 지키는 법",
    description:
      "123456, qwerty... 아직도 이런 비밀번호를 쓰고 계신가요? 해커도 못 뚫는 강력한 비밀번호 만드는 법과 무료 비밀번호 생성기 활용법을 알려드립니다.",
    date: "2026-01-12",
    tags: ["보안", "비밀번호", "해킹방지", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          2024년 가장 많이 사용된 비밀번호 1위는 여전히{" "}
          <strong className="text-white">"123456"</strong>입니다. 해커들은 이런
          단순한 비밀번호를 <strong>1초도 안 걸려</strong> 뚫어버립니다. 계정
          해킹의 80% 이상이 취약한 비밀번호 때문에 발생합니다. 오늘부터 강력한
          비밀번호로 내 소중한 계정을 지키세요.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          취약한 비밀번호 유형
        </h2>
        <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl">
          <p className="font-bold text-red-400 mb-3">
            🚫 절대 사용하면 안 되는 비밀번호
          </p>
          <ul className="space-y-1 text-sm">
            <li>• 연속 숫자: 123456, 111111, 12345678</li>
            <li>• 키보드 패턴: qwerty, asdfgh, zxcvbn</li>
            <li>• 개인정보 포함: 생년월일, 이름, 전화번호</li>
            <li>• 단순 단어: password, admin, login, welcome</li>
            <li>• 짧은 비밀번호: 8자 미만</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          강력한 비밀번호의 조건
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: "✅",
              title: "최소 12자 이상",
              desc: "8자는 브루트포스 공격으로 몇 분이면 뚫립니다. 12자 이상을 권장합니다.",
            },
            {
              icon: "✅",
              title: "대소문자 혼용",
              desc: "대문자와 소문자를 섞어 경우의 수를 52배 늘리세요.",
            },
            {
              icon: "✅",
              title: "숫자 포함",
              desc: "숫자를 추가하면 경우의 수가 62배로 증가합니다.",
            },
            {
              icon: "✅",
              title: "특수문자 포함",
              desc: "!@#$%^&* 등을 추가하면 해독 시간이 수천 배 늘어납니다.",
            },
            {
              icon: "✅",
              title: "사이트별 다른 비밀번호",
              desc: "한 곳이 유출되면 모든 계정이 위험해집니다.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          무료 비밀번호 생성기 활용하기
        </h2>
        <p>
          완벽한 비밀번호를 직접 생각해내기 어렵다면{" "}
          <Link
            to="/tools/random-password"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 비밀번호 생성기
          </Link>
          를 사용하세요. 암호학적으로 안전한 난수를 사용해 예측 불가능한 강력한
          비밀번호를 즉시 생성합니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-neon-primary font-bold mb-2">
            💡 비밀번호 생성기 활용 팁
          </p>
          <ul className="space-y-1 text-sm">
            <li>• 길이는 최소 16자 이상으로 설정하세요.</li>
            <li>• 대소문자 + 숫자 + 특수문자 모두 활성화하세요.</li>
            <li>• 생성된 비밀번호는 비밀번호 관리자 앱에 저장하세요.</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          비밀번호 관리 꿀팁
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>비밀번호 관리자 사용:</strong> 1Password, Bitwarden 등을
            사용하면 수십 개의 강력한 비밀번호를 기억할 필요가 없습니다.
          </li>
          <li>
            <strong>2단계 인증(2FA) 활성화:</strong> 비밀번호가 유출되더라도 2차
            인증으로 보호할 수 있습니다.
          </li>
          <li>
            <strong>정기적 변경:</strong> 중요 계정은 3~6개월마다 비밀번호를
            변경하세요.
          </li>
          <li>
            <strong>유출 확인:</strong> haveibeenpwned.com에서 내 이메일이
            유출됐는지 확인하세요.
          </li>
        </ul>

        <hr className="border-white/10 my-8" />

        <h3 className="text-xl font-bold text-white mb-4">결론</h3>
        <p>
          강력한 비밀번호는 온라인 보안의 첫 번째 방어선입니다. 오늘 바로{" "}
          <Link
            to="/tools/random-password"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 비밀번호 생성기
          </Link>
          로 안전한 비밀번호를 만들고, 내 소중한 계정을 지키세요. 5분 투자로
          해킹 걱정 없는 디지털 생활을 시작할 수 있습니다!
        </p>
      </div>
    ),
  },
  {
    slug: "age-calculator-guide",
    title: "만 나이 계산기 완벽 가이드: 만 나이·세는 나이·연 나이 한 번에 정리",
    description:
      "2023년부터 한국도 만 나이가 공식 기준입니다. 만 나이·세는 나이·연 나이 차이와 계산법, 무료 만 나이 계산기 활용법을 알려드립니다.",
    date: "2026-01-20",
    tags: ["만나이", "나이계산기", "한국나이", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          2023년 6월부터 한국도 <strong className="text-white">만 나이</strong>
          가 법적·사회적 공식 기준이 되었습니다. 세는 나이, 연 나이, 만 나이가
          혼용되어 헷갈리는 분들을 위해 세 가지 나이 계산법을 완벽 정리합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">만 나이란?</h2>
        <p>
          만 나이는 <strong>생일을 기준으로 실제로 살아온 햇수</strong>를
          계산합니다. 태어나는 순간 0살로 시작해서, 생일이 지날 때마다 1살씩
          올라갑니다. 전 세계 대부분의 국가에서 사용하는 국제 표준입니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-bold text-neon-primary mb-2">계산 예시</p>
          <p>
            2000년 8월 15일생 → 2026년 4월 기준 →{" "}
            <strong className="text-white">만 25세</strong> (생일 미경과)
          </p>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          세 가지 나이 비교표
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-2 px-3">종류</th>
                <th className="text-left py-2 px-3">시작</th>
                <th className="text-left py-2 px-3">기준</th>
                <th className="text-left py-2 px-3">사용 분야</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["만 나이", "0세", "생일", "법률·의료·국제"],
                ["세는 나이", "1세", "1월 1일", "일상 대화"],
                ["연 나이", "0세", "1월 1일", "청소년보호법·병역법"],
              ].map(([type, start, basis, use], i) => (
                <tr key={i} className="border-b border-white/10">
                  <td className="py-2 px-3 font-bold text-white">{type}</td>
                  <td className="py-2 px-3">{start}</td>
                  <td className="py-2 px-3">{basis}</td>
                  <td className="py-2 px-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          생년월일만 입력하면 세 가지 나이를 한번에 확인하고, 띠·별자리·생일
          D-Day까지 알 수 있는{" "}
          <Link
            to="/tools/age-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 만 나이 계산기
          </Link>
          를 사용해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "lotto-number-strategy",
    title: "로또 번호 생성기 완벽 가이드: 랜덤이 최선인 이유",
    description:
      "매주 로또 번호 고르기가 어렵다면? 번호 선택 전략과 확률 이야기, 무료 로또 번호 생성기 활용법을 알려드립니다.",
    date: "2026-01-22",
    tags: ["로또", "랜덤", "확률", "행운"],
    thumbnail:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          로또 6/45의 당첨 확률은{" "}
          <strong className="text-white">약 1/814만</strong>. 그런데도 매주
          수백만 명이 참여합니다. 어떤 번호 선택 전략이 가장 합리적일까요?
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 랜덤이 최선인가?
        </h2>
        <p>
          수학적으로 모든 조합의 당첨 확률은 동일합니다. 하지만{" "}
          <strong>당첨금 배분</strong>은 다릅니다. 생일·연속 숫자 등 인기 번호로
          당첨되면 수십 명이 배당금을 나눠 갖습니다. 완전 랜덤 번호는 다른
          당첨자와 겹칠 확률이 낮아 단독 당첨 시 더 많은 금액을 받을 수
          있습니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="font-bold text-neon-primary mb-2">
            피해야 할 번호 패턴
          </p>
          <ul className="space-y-1 text-sm">
            <li>• 생일·기념일 (1~31에 편중)</li>
            <li>• 연속 숫자 (1-2-3-4-5-6)</li>
            <li>• 배수 패턴 (5-10-15-20-25-30)</li>
            <li>• 이전 당첨 번호 그대로 사용</li>
          </ul>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/lotto-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 로또 번호 생성기
          </Link>
          는 암호학적으로 안전한 난수로 편향 없는 6개 번호를 즉시 추첨합니다.
          번호 고민 없이 바로 사용해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "text-counter-guide",
    title: "글자수 세기 완벽 가이드: 자소서·SNS·유튜브 최적 글자수",
    description:
      "자기소개서는 몇 글자? 인스타그램 캡션은? SNS·자소서·블로그별 최적 글자수와 무료 글자수 세기 도구 활용법을 알려드립니다.",
    date: "2026-01-25",
    tags: ["글자수", "자기소개서", "SNS", "글쓰기"],
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          자기소개서, 이메일 제목, SNS 게시물, 유튜브 제목까지 각 플랫폼마다
          최적의 글자수 기준이 있습니다.{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            무료 글자수 세기 도구
          </Link>
          로 정확하게 확인하며 완성도를 높이세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          플랫폼별 최적 글자수 가이드
        </h2>
        <div className="space-y-2">
          {[
            [
              "자기소개서 (항목당)",
              "500~800자",
              "700자가 채용담당자 집중 최적",
            ],
            ["이메일 제목", "30~50자", "모바일에서 잘리지 않는 기준"],
            ["인스타그램 캡션", "138~150자", "더보기 클릭 전 보이는 길이"],
            ["유튜브 제목", "60~70자", "검색 결과에서 잘리지 않는 기준"],
            ["블로그 본문", "1,500자 이상", "구글 SEO 기준 최소 길이"],
            ["구글 메타 설명", "120~160자", "검색 결과 스니펫 표시 길이"],
          ].map(([platform, range, tip], i) => (
            <div
              key={i}
              className="bg-white/5 p-3 rounded-lg grid grid-cols-3 gap-2 items-center text-sm"
            >
              <p className="font-bold text-white">{platform}</p>
              <p className="text-neon-primary font-mono text-center">{range}</p>
              <p className="text-gray-400 text-xs">{tip}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          자기소개서 글자수 꿀팁
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            제한 글자수의 <strong>90~95%</strong>를 채우는 것이 성의 있어
            보입니다.
          </li>
          <li>공백 포함/미포함 기준을 미리 확인하세요.</li>
          <li>글자수가 넘치면 형용사·부사부터 줄이세요.</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 글자수 세기
          </Link>
          는 공백 포함/미포함, 바이트 수, 단어 수를 한꺼번에 확인할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "percentage-calculator-guide",
    title: "퍼센트 계산기 완벽 가이드: 할인율·세금·인상률 빠르게 계산",
    description:
      "30% 할인이면 얼마? 세금 포함 가격은? 퍼센트 계산이 헷갈릴 때 무료 퍼센트 계산기로 즉시 해결하는 방법을 알려드립니다.",
    date: "2026-01-28",
    tags: ["퍼센트", "계산기", "할인", "수학"],
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "30% 할인이면 실제로 얼마를 아끼는 거지?" 일상에서 퍼센트 계산은 자주
          필요하지만 머릿속으로 빠르게 계산하기 어렵습니다.{" "}
          <Link
            to="/tools/percentage-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 퍼센트 계산기
          </Link>
          를 활용하면 실수 없이 즉시 계산할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          자주 쓰는 퍼센트 계산 공식
        </h2>
        <div className="space-y-3">
          {[
            [
              "할인가 계산",
              "원가 × (1 - 할인율/100)",
              "10만원 30% 할인 → 7만원",
            ],
            [
              "세금 포함 계산",
              "가격 × (1 + 세율/100)",
              "5만원 부가세 10% → 5만5천원",
            ],
            [
              "증감률 계산",
              "(변화량 ÷ 원래값) × 100",
              "100→120만원 → 20% 증가",
            ],
          ].map(([type, formula, example], i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-4 rounded-xl"
            >
              <h3 className="font-bold text-neon-primary mb-1">{type}</h3>
              <p className="font-mono text-sm text-gray-300 bg-black/30 p-2 rounded mb-1">
                {formula}
              </p>
              <p className="text-sm text-gray-400">예: {example}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          복잡한 퍼센트 계산은{" "}
          <Link
            to="/tools/percentage-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 퍼센트 계산기
          </Link>
          에 맡기세요. 할인율, 증감률, 비율 계산을 오류 없이 처리합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "unit-converter-guide",
    title: "단위 변환기 완벽 가이드: km↔mile, kg↔lb, °C↔°F 빠른 변환",
    description:
      "해외여행, 해외 직구, 영어 레시피에서 단위가 달라 헷갈릴 때! 자주 쓰는 단위 변환표와 무료 단위 변환기 활용법을 공유합니다.",
    date: "2026-02-01",
    tags: ["단위변환", "길이", "무게", "온도", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          미국 레시피에서 "350°F"를 보거나 제품 무게가 "5 lbs"로 표시될 때
          어떻게 하시나요?{" "}
          <Link
            to="/tools/unit-converter"
            className="text-neon-primary hover:underline"
          >
            무료 단위 변환기
          </Link>
          로 즉시 해결하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          자주 쓰는 단위 변환 공식
        </h2>
        <div className="space-y-4">
          {[
            {
              title: "📏 길이",
              items: [
                "1 inch = 2.54 cm",
                "1 foot = 30.48 cm",
                "1 mile = 1.609 km",
              ],
            },
            {
              title: "⚖️ 무게",
              items: ["1 lb = 453.6 g", "1 oz = 28.35 g", "1 kg = 2.205 lb"],
            },
            {
              title: "🌡️ 온도",
              items: [
                "°F → °C: (°F - 32) ÷ 1.8",
                "°C → °F: (°C × 1.8) + 32",
                "물 끓는점: 100°C = 212°F",
              ],
            },
          ].map((section, i) => (
            <div key={i}>
              <h3 className="font-bold text-white mb-2">{section.title}</h3>
              <div className="bg-white/5 p-4 rounded-lg space-y-1 font-mono text-sm">
                {section.items.map((item, j) => (
                  <p key={j}>{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          공식을 외울 필요 없이{" "}
          <Link
            to="/tools/unit-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 단위 변환기
          </Link>
          에서 길이, 무게, 온도, 부피를 즉시 변환하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "random-team-building",
    title: "랜덤 팀 편성의 힘: 공정하고 빠른 팀 나누기 완벽 가이드",
    description:
      "운동회, MT, 스터디 그룹... 팀 나누기가 어렵다면? 랜덤 팀 편성이 왜 가장 공정한지, 무료 랜덤 팀 편성기 활용법을 알려드립니다.",
    date: "2026-02-05",
    tags: ["팀나누기", "팀편성", "랜덤", "조편성"],
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          팀을 나눌 때마다 불만이 생기는 이유는 <strong>주관적 판단</strong>이
          개입되기 때문입니다.{" "}
          <Link
            to="/tools/random-team"
            className="text-neon-primary hover:underline"
          >
            무료 랜덤 팀 편성기
          </Link>
          로 누구도 불평할 수 없는 공정한 팀을 구성하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          랜덤 팀 편성이 필요한 상황
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "🏃 운동회·체육대회",
            "🎓 학교 팀 프로젝트",
            "💼 회사 워크숍",
            "🏕️ MT·야유회",
            "🎮 게임 팀 배정",
            "📚 스터디 그룹 편성",
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
              {item}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          랜덤 팀 편성의 장점
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>공정성:</strong> 같은 결과도 랜덤 배정이면 수용도가 훨씬
            높습니다.
          </li>
          <li>
            <strong>새로운 연결:</strong> 평소 교류 없던 사람들과 팀을 이루며 새
            인간관계가 생깁니다.
          </li>
          <li>
            <strong>결정 피로 해소:</strong> 리더가 팀 구성으로 받는 스트레스가
            사라집니다.
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          다음 팀 나누기에서는{" "}
          <Link
            to="/tools/random-team"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 랜덤 팀 편성기
          </Link>
          를 사용해보세요. 30초면 충분합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "dice-coin-online",
    title: "온라인 주사위·동전 던지기: 실제보다 더 공정한 디지털 랜덤",
    description:
      "보드게임, 내기, 순서 정하기... 주사위나 동전이 없을 때 스마트폰으로 바로 사용하는 온라인 주사위·동전 던지기 활용법입니다.",
    date: "2026-02-08",
    tags: ["주사위", "동전던지기", "랜덤", "보드게임"],
    thumbnail:
      "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          주사위가 없어서 보드게임을 못 하거나 동전이 없어서 내기를 못 하셨나요?
          스마트폰이 있다면 걱정 없습니다. 온라인 주사위와 동전 던지기는
          실제보다 더 공정한 결과를 보장합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          물리적 vs 디지털 랜덤
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <h3 className="font-bold text-white mb-2">🎲 물리적 주사위</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>• 무게 중심 불균형 가능</li>
              <li>• 굴리는 방식에 편향</li>
              <li>• 분실 위험</li>
            </ul>
          </div>
          <div className="bg-neon-primary/10 border border-neon-primary/30 p-4 rounded-xl">
            <h3 className="font-bold text-white mb-2">💻 온라인 주사위</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• 암호학적 난수 (완전 공정)</li>
              <li>• 물리적 편향 없음</li>
              <li>• 다면체 주사위 지원</li>
            </ul>
          </div>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/dice-roller"
            className="text-neon-primary hover:underline"
          >
            주사위 던지기
          </Link>
          와{" "}
          <Link
            to="/tools/coin-flip"
            className="text-neon-primary hover:underline"
          >
            동전 던지기
          </Link>
          를 앱 설치 없이 바로 사용해보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "json-formatter-guide",
    title: "JSON 포맷터 완벽 가이드: 개발자라면 꼭 알아야 할 JSON 정리법",
    description:
      "복잡한 JSON 데이터를 읽기 좋게 정렬하고 오류를 찾는 방법. 무료 온라인 JSON 포맷터로 개발 생산성을 높이세요.",
    date: "2026-02-12",
    tags: ["JSON", "개발자도구", "포맷터", "가이드"],
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          API를 개발하거나 데이터를 다루다 보면 한 줄로 뭉쳐진 JSON을 마주치게
          됩니다.{" "}
          <Link
            to="/tools/json-formatter"
            className="text-neon-primary hover:underline"
          >
            무료 JSON 포맷터
          </Link>
          로 복잡한 JSON을 정리하면 오류를 빠르게 찾고 데이터 구조를 한눈에
          파악할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          JSON 포맷터가 필요한 이유
        </h2>
        <div className="space-y-3">
          {[
            [
              "API 응답 분석",
              "서버에서 받은 JSON을 보기 좋게 정렬하여 디버깅 시간 단축",
            ],
            ["문법 오류 감지", "잘못된 따옴표, 쉼표, 괄호를 즉시 감지"],
            ["데이터 압축", "배포 전 JSON을 한 줄로 압축하여 파일 크기 최소화"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white">{t}</p>
              <p className="text-sm text-gray-400 mt-1">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          JSON 자주 발생하는 오류
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>마지막 쉼표(Trailing Comma):</strong> 마지막 항목 뒤 쉼표 →
            JSON 표준 오류
          </li>
          <li>
            <strong>큰따옴표 누락:</strong> key는 반드시 큰따옴표로 감싸야 함
          </li>
          <li>
            <strong>주석 불가:</strong> JSON은 주석을 지원하지 않음
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/json-formatter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow JSON 포맷터
          </Link>
          로 복잡한 JSON을 즉시 정렬하고, 문법 오류를 자동으로 검사하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "color-converter-guide",
    title: "색상 코드 변환기 사용법: HEX·RGB·HSL 색상을 1초 만에 변환",
    description:
      "웹 디자인 필수! HEX, RGB, HSL 색상 코드의 차이와 변환 방법을 알아보고 무료 색상 변환기를 활용하세요.",
    date: "2026-02-15",
    tags: ["색상", "웹디자인", "HEX", "RGB", "CSS"],
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Figma에서 작업한 색상을 CSS에 적용하려는데 HEX인지 RGB인지 헷갈리신 적
          있나요?{" "}
          <Link
            to="/tools/color-converter"
            className="text-neon-primary hover:underline"
          >
            무료 색상 변환기
          </Link>
          로 1초 만에 변환하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          색상 코드 형식 비교
        </h2>
        <div className="space-y-2">
          {[
            ["HEX", "#FF5733", "CSS, HTML, 디자인 툴"],
            ["RGB", "rgb(255, 87, 51)", "CSS, 투명도 필요 시 rgba"],
            ["HSL", "hsl(14, 100%, 60%)", "색상 팔레트 생성, 조절"],
          ].map(([fmt, ex, use], i) => (
            <div
              key={i}
              className="flex gap-4 bg-white/5 p-3 rounded-lg items-center"
            >
              <span className="font-bold text-white w-10">{fmt}</span>
              <code className="text-neon-primary font-mono text-sm flex-1">
                {ex}
              </code>
              <span className="text-gray-400 text-sm">{use}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언제 어떤 형식을 사용하나요?
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>HEX</strong> — CSS 기본 색상 정의, 가장 짧고 직관적
          </li>
          <li>
            <strong>RGBA</strong> — 투명도가 필요할 때 (overlay, 배경 효과)
          </li>
          <li>
            <strong>HSL</strong> — 색상 팔레트를 코드로 생성할 때
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/color-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 색상 변환기
          </Link>
          에서 HEX, RGB, HSL을 실시간으로 변환하고 색상 미리보기도 확인하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "bmi-calculator-guide",
    title: "BMI 계산기 완벽 활용: 정상 체중 범위와 건강 목표 설정법",
    description:
      "BMI(체질량지수)로 내 건강 상태를 확인하고 목표 체중을 설정하는 방법. BMI 계산기와 함께 건강 관리를 시작하세요.",
    date: "2026-02-18",
    tags: ["BMI", "건강", "체중", "다이어트"],
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          체중이 건강한지 판단하는 가장 간단한 방법이 BMI(체질량지수)입니다.{" "}
          <Link
            to="/tools/bmi-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 BMI 계산기
          </Link>
          로 키와 몸무게만 입력하면 즉시 건강 상태를 확인할 수 있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI 기준표 (한국 기준)
        </h2>
        <div className="space-y-2">
          {[
            ["18.5 미만", "저체중", "text-blue-400"],
            ["18.5 ~ 22.9", "정상", "text-green-400"],
            ["23.0 ~ 24.9", "과체중", "text-yellow-400"],
            ["25.0 이상", "비만", "text-red-400"],
          ].map(([range, label, color], i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
            >
              <span className="font-mono text-sm">{range}</span>
              <span className={`font-bold ${color}`}>{label}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI의 한계와 주의사항
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>근육량이 많은 운동선수는 BMI가 높아도 건강할 수 있습니다.</li>
          <li>
            노인은 같은 BMI라도 근육량이 적어 건강 위험이 높을 수 있습니다.
          </li>
          <li>BMI는 참고 지표일 뿐, 정확한 판단은 의사 상담이 필요합니다.</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/bmi-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow BMI 계산기
          </Link>
          로 지금 바로 내 체질량지수를 확인하고 건강 목표를 세워보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "d-day-counter-guide",
    title: "D-Day 카운터 활용법: 목표·기념일·마감일 한 눈에 관리",
    description:
      "수능, 결혼기념일, 프로젝트 마감일... D-Day 카운터 하나로 모든 중요한 날짜를 관리하는 스마트한 방법을 알려드립니다.",
    date: "2026-02-22",
    tags: ["D-Day", "날짜계산", "목표관리", "기념일"],
    thumbnail:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          구체적인 마감일이 있을 때 목표 달성률이 42% 높아진다는 연구 결과가
          있습니다.{" "}
          <Link
            to="/tools/d-day-counter"
            className="text-neon-primary hover:underline"
          >
            무료 D-Day 카운터
          </Link>
          로 모든 중요한 날짜를 한 곳에서 관리하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          D-Day 카운터 활용 사례
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "📚 수험생 — 수능·공무원·자격증",
            "💑 커플 — 100일·1주년",
            "💼 직장인 — 프로젝트 마감",
            "🏃 운동 — 마라톤·대회일",
            "✈️ 여행 — 휴가 출발일",
            "🎓 학생 — 개강·졸업",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-3 rounded-lg text-sm text-gray-300"
            >
              {item}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          D+ 계산도 가능합니다
        </h2>
        <p>
          과거 날짜를 입력하면 'D+N'으로 며칠이 지났는지 표시됩니다. 커플
          D+100일, 취업 D+365일 등 기념일을 축하하는 데 활용하세요.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/d-day-counter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow D-Day 카운터
          </Link>
          로 오늘 당장 목표 날짜를 설정하고 카운트다운을 시작하세요!
        </p>
      </div>
    ),
  },
  {
    slug: "coin-flip-guide",
    title: "동전 던지기로 결정 내리기: 심리학이 말하는 최고의 결정법",
    description:
      "결정이 어려울 때 동전을 던지면 왜 도움이 될까요? 심리학적 관점에서 동전 던지기의 효과와 온라인 동전 던지기 활용법을 알아봅니다.",
    date: "2026-02-25",
    tags: ["동전던지기", "결정", "심리학", "랜덤"],
    thumbnail:
      "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "동전으로 결정해?" 처음엔 우스워 보이지만, 사실 이것은 심리학적으로
          매우 효과적인 결정 방법입니다.{" "}
          <Link
            to="/tools/coin-flip"
            className="text-neon-primary hover:underline"
          >
            온라인 동전 던지기
          </Link>
          로 결정 피로를 줄이고 더 빠르게 선택하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          동전 던지기가 효과적인 심리학적 이유
        </h2>
        <div className="space-y-3">
          {[
            [
              "내면의 욕구 발견",
              "동전이 앞면이 나왔을 때 실망감을 느꼈다면, 그것이 진짜 원하는 선택입니다.",
            ],
            [
              "결정 피로 해소",
              "사소한 결정에 에너지를 소모하지 않고, 중요한 일에 집중력을 유지합니다.",
            ],
            [
              "책임감 분산",
              "결과에 대한 과도한 책임감을 줄여 더 편안하게 실행할 수 있습니다.",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          동전 던지기가 적합한 상황
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>두 선택지 모두 비슷하게 매력적일 때</li>
          <li>점심 메뉴, 영화 선택 등 사소한 결정</li>
          <li>이미 분석은 충분히 했지만 결정을 못 내릴 때</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          지금 바로{" "}
          <Link
            to="/tools/coin-flip"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 동전 던지기
          </Link>
          로 결정하지 못했던 그것을 해결해보세요!
        </p>
      </div>
    ),
  },
  {
    slug: "time-calculator-guide",
    title: "시간 계산기 완벽 가이드: 근무시간·포모도로·시간대 계산",
    description:
      "근무 시간 계산, 포모도로 타이머 설정, 도착 예정 시간까지. 시간 계산기로 시간 관리를 더 스마트하게 하는 방법을 알려드립니다.",
    date: "2026-03-01",
    tags: ["시간계산기", "근무시간", "포모도로", "시간관리"],
    thumbnail:
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          하루에 실제로 몇 시간을 일하는지, 포모도로 세션이 몇 시에 끝나는지
          정확하게 계산하고 싶다면{" "}
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 시간 계산기
          </Link>
          를 활용하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          시간 계산기 실전 활용법
        </h2>
        <div className="space-y-3">
          {[
            [
              "근무시간 계산",
              "09:00 출근 → 18:30 퇴근 → 점심 1시간 = 실근무 8시간 30분",
            ],
            ["포모도로 계산", "14:00 시작 → 25분 × 4세션 + 휴식 = 15:55 종료"],
            ["요리·운동 시간", "15:30 시작 → 1시간 45분 후 = 17:15 종료"],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-4 rounded-xl"
            >
              <p className="font-bold text-neon-primary mb-2">{t}</p>
              <p className="text-sm text-gray-300 font-mono">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          시간 관리 꿀팁
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            하루 실제 근무 시간을 측정하면 자신의 생산성 패턴을 파악할 수
            있습니다.
          </li>
          <li>포모도로 기법: 25분 집중 + 5분 휴식이 뇌 효율을 극대화합니다.</li>
          <li>중요 업무는 집중력이 높은 오전 10~12시에 배치하세요.</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 시간 계산기
          </Link>
          로 오늘의 근무 시간과 일정을 정확하게 계산해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "lorem-ipsum-guide",
    title: "로렘 입숨 완벽 가이드: UI 디자이너·개발자 필수 더미 텍스트",
    description:
      "로렘 입숨(Lorem Ipsum)이 무엇인지, 왜 사용하는지, 무료 생성기로 디자인 작업 속도를 높이는 방법을 알아봅니다.",
    date: "2026-03-05",
    tags: ["로렘입숨", "Lorem Ipsum", "디자인", "개발"],
    thumbnail:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          웹사이트나 앱을 디자인할 때 실제 콘텐츠 없이도 레이아웃을 미리 볼 수
          있게 해주는 것이 <strong className="text-white">로렘 입숨</strong>
          입니다.{" "}
          <Link
            to="/tools/lorem-ipsum"
            className="text-neon-primary hover:underline"
          >
            무료 로렘 입숨 생성기
          </Link>
          로 원하는 양의 더미 텍스트를 즉시 생성하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          로렘 입숨의 역사
        </h2>
        <p>
          로렘 입숨은 키케로(Cicero)의 라틴어 철학 서적(기원전 45년)에서
          유래했습니다. 1960년대 Letraset이 인쇄 업계에서 사용하면서 표준이
          되었고, 이후 PageMaker 등 DTP 소프트웨어가 도입하며 디자인 업계 전반에
          퍼졌습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          로렘 입숨이 필요한 상황
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>웹 프로토타입:</strong> 실제 콘텐츠 없이 레이아웃 먼저 확인
          </li>
          <li>
            <strong>디자인 시안:</strong> 클라이언트에게 디자인 방향 제시
          </li>
          <li>
            <strong>개발 테스트:</strong> UI 컴포넌트가 긴 텍스트에서 어떻게
            보이는지 확인
          </li>
          <li>
            <strong>인쇄물 레이아웃:</strong> 잡지, 브로슈어 초안 작업
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/lorem-ipsum"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 로렘 입숨 생성기
          </Link>
          로 필요한 단락 수만큼 더미 텍스트를 즉시 생성하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "markdown-guide",
    title: "마크다운 완벽 가이드: 깃허브·블로그·노션에서 쓰는 기본 문법",
    description:
      "마크다운(Markdown) 기본 문법 10가지와 실전 활용법. 무료 마크다운 미리보기로 바로 연습하세요.",
    date: "2026-03-08",
    tags: ["마크다운", "Markdown", "글쓰기", "개발"],
    thumbnail:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          GitHub README, 기술 블로그, 노션 문서... 어디서나 마크다운을
          사용합니다.{" "}
          <Link
            to="/tools/markdown-previewer"
            className="text-neon-primary hover:underline"
          >
            무료 마크다운 미리보기
          </Link>
          로 실시간으로 연습하면서 빠르게 익혀보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          마크다운 기본 문법 10가지
        </h2>
        <div className="space-y-2">
          {[
            ["# 제목", "h1~h6 제목 (# 개수로 레벨 조절)"],
            ["**굵게**", "볼드체"],
            ["*기울임*", "이탤릭체"],
            ["- 항목", "순서 없는 목록"],
            ["1. 항목", "순서 있는 목록"],
            ["`코드`", "인라인 코드"],
            ["```블록```", "여러 줄 코드 블록"],
            ["[링크](URL)", "하이퍼링크"],
            ["![이미지](URL)", "이미지 삽입"],
            ["> 인용", "인용구 블록"],
          ].map(([syntax, desc], i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white/5 p-3 rounded-lg"
            >
              <code className="text-neon-primary font-mono text-sm w-36 shrink-0">
                {syntax}
              </code>
              <span className="text-gray-400 text-sm">{desc}</span>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/markdown-previewer"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 마크다운 미리보기
          </Link>
          에서 위 문법을 직접 입력하면 실시간으로 결과를 확인할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "css-shadow-guide",
    title: "CSS Box Shadow 완벽 가이드: 버튼·카드에 입체감 주는 법",
    description:
      "CSS box-shadow 속성으로 버튼, 카드, 모달에 입체감을 주는 방법. 무료 CSS 그림자 생성기로 코드 없이 시각적으로 조작하세요.",
    date: "2026-03-12",
    tags: ["CSS", "box-shadow", "웹디자인", "개발"],
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          평평한 UI에 깊이감을 주는 가장 쉬운 방법이{" "}
          <strong className="text-white">CSS box-shadow</strong>입니다.{" "}
          <Link
            to="/tools/css-shadow-generator"
            className="text-neon-primary hover:underline"
          >
            무료 CSS 그림자 생성기
          </Link>
          로 슬라이더를 조작하며 원하는 그림자를 만들고 코드를 복사하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          box-shadow 속성 해설
        </h2>
        <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
          <p>
            <span className="text-yellow-400">2px</span>{" "}
            <span className="text-blue-400">4px</span>{" "}
            <span className="text-green-400">8px</span>{" "}
            <span className="text-purple-400">0px</span>{" "}
            <span className="text-red-400">rgba(0,0,0,0.2)</span>
          </p>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p>
              <span className="text-yellow-400">2px</span> = 수평 오프셋 |{" "}
              <span className="text-blue-400">4px</span> = 수직 오프셋 |{" "}
              <span className="text-green-400">8px</span> = 흐림 |{" "}
              <span className="text-purple-400">0px</span> = 퍼짐
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          인기 있는 그림자 스타일
        </h2>
        <div className="space-y-2">
          {[
            ["부드러운 카드", "box-shadow: 0 2px 8px rgba(0,0,0,0.12)"],
            ["눌린 효과(inset)", "box-shadow: inset 0 2px 4px rgba(0,0,0,0.2)"],
            ["네온 글로우", "box-shadow: 0 0 20px rgba(0,217,255,0.5)"],
          ].map(([name, code], i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg">
              <p className="text-white font-bold text-sm">{name}</p>
              <p className="font-mono text-xs text-neon-primary mt-1">{code}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/css-shadow-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow CSS 그림자 생성기
          </Link>
          로 코드 없이 그림자를 조작하고 CSS 코드를 즉시 복사하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "base64-guide",
    title: "Base64 인코딩 완벽 가이드: 이미지 URL·API 인증에 쓰이는 이유",
    description:
      "Base64 인코딩이 무엇인지, 왜 사용하는지, 이미지 Data URL·HTTP Basic Auth에서 어떻게 활용하는지 완벽하게 알아봅니다.",
    date: "2026-03-15",
    tags: ["Base64", "인코딩", "개발", "보안"],
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          API를 호출할 때 Authorization 헤더에 이상한 문자열을 본 적 있나요?
          이것이 <strong className="text-white">Base64 인코딩</strong>입니다.{" "}
          <Link
            to="/tools/base64-encoder"
            className="text-neon-primary hover:underline"
          >
            무료 Base64 변환기
          </Link>
          로 즉시 인코딩/디코딩해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Base64가 필요한 실전 상황
        </h2>
        <div className="space-y-3">
          {[
            [
              "HTTP Basic 인증",
              'Authorization: Basic {Base64("user:password")} 형식으로 API 인증',
            ],
            [
              "이미지 Data URL",
              'src="data:image/png;base64,..." 형식으로 HTML에 이미지 삽입',
            ],
            [
              "이메일 첨부파일",
              "MIME 표준에서 첨부파일을 Base64로 인코딩하여 텍스트로 전송",
            ],
            [
              "JWT 토큰",
              "JSON Web Token의 헤더와 페이로드가 Base64url로 인코딩됨",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Base64 vs 암호화 차이
        </h2>
        <p>
          중요: Base64는 <strong>암호화가 아닙니다</strong>. 누구나 쉽게
          디코딩할 수 있습니다. 민감한 정보는 반드시 별도의 암호화(AES, RSA
          등)를 적용해야 합니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/base64-encoder"
            className="text-neon-primary hover:underline"
          >
            SpinFlow Base64 변환기
          </Link>
          로 텍스트와 Base64를 즉시 상호 변환하세요. 한글(UTF-8)도 완벽
          지원합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "diff-checker-guide",
    title: "Diff 비교 도구 활용법: 코드·문서 변경점을 한눈에 파악",
    description:
      "두 텍스트나 코드의 차이점을 시각적으로 확인하는 Diff 도구. 코드 리뷰, 문서 편집, 설정 파일 비교에 활용하는 방법을 알려드립니다.",
    date: "2026-03-18",
    tags: ["Diff", "코드비교", "개발자도구", "텍스트비교"],
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          코드 리뷰, 계약서 수정, 설정 파일 변경 — 무엇이 바뀌었는지 한눈에 보고
          싶다면{" "}
          <Link
            to="/tools/diff-checker"
            className="text-neon-primary hover:underline"
          >
            무료 Diff 비교 도구
          </Link>
          를 사용하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Diff 도구 활용 상황
        </h2>
        <div className="space-y-2">
          {[
            ["🖥️ 코드 리뷰", "PR 전 변경 사항을 직접 확인"],
            ["📄 문서 편집", "초안 vs 최종본 차이 파악"],
            ["⚙️ 설정 파일", "서버 설정 변경 전후 비교"],
            ["🔧 디버깅", "작동하는 코드와 오류 코드 비교"],
          ].map(([icon, desc], i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-lg text-sm"
            >
              <span>{icon}</span>
              <span className="text-gray-300">{desc}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Diff 결과 읽는 법
        </h2>
        <div className="space-y-2">
          <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
            <p className="text-green-400 font-mono text-sm">
              + 추가된 줄 (초록색)
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
            <p className="text-red-400 font-mono text-sm">
              - 삭제된 줄 (빨간색)
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
            <p className="text-gray-400 font-mono text-sm">
              변경 없는 줄 (기본색)
            </p>
          </div>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/diff-checker"
            className="text-neon-primary hover:underline"
          >
            SpinFlow Diff 비교 도구
          </Link>
          에 두 텍스트를 붙여넣으면 변경 사항이 즉시 색상으로 표시됩니다.
        </p>
      </div>
    ),
  },
];
