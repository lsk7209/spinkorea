import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  content: ReactNode;
  tags: string[];
  thumbnail?: string;
  qualityScore?: number;
}

// 오늘 날짜 기준으로 공개된 포스트만 반환 (워드프레스 예약글 방식)
export function getPostPublishDate(post: BlogPost): string {
  return post.publishAt?.slice(0, 10) ?? post.date;
}

export function getPostPublishTime(post: BlogPost): number {
  return new Date(post.publishAt ?? `${post.date}T00:00:00+09:00`).getTime();
}

export function isPublishedPost(post: BlogPost, now = new Date()): boolean {
  return getPostPublishTime(post) <= now.getTime();
}

// 현재 시각 기준으로 공개된 포스트만 반환한다.
export function getPublishedPosts(now = new Date()): BlogPost[] {
  return BLOG_POSTS.filter((post) => isPublishedPost(post, now)).sort(
    (a, b) => getPostPublishTime(b) - getPostPublishTime(a),
  );
}

export const CURATED_BLOG_POSTS: BlogPost[] = [
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
  {
    slug: "uri-encoder-guide",
    title: "URL 인코딩 완벽 가이드: 한글 주소가 %EC%95%88%EB%85%95이 되는 이유",
    description:
      "URL에서 한글이 이상한 문자로 변하는 이유, 퍼센트 인코딩의 원리, 개발자가 꼭 알아야 할 URL 인코딩·디코딩 완벽 가이드입니다.",
    date: "2026-03-22",
    tags: ["URL인코딩", "퍼센트인코딩", "개발", "한글"],
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          브라우저 주소창에서 한글을 입력하면{" "}
          <strong className="text-white">
            %EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94
          </strong>
          처럼 변하는 걸 본 적 있나요? 이것이{" "}
          <strong>퍼센트 인코딩(Percent Encoding)</strong>, 즉 URL 인코딩입니다.{" "}
          <Link
            to="/tools/uri-encoder"
            className="text-neon-primary hover:underline"
          >
            무료 URL 인코더/디코더
          </Link>
          로 즉시 변환해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 URL에서 한글이 깨지는가?
        </h2>
        <p>
          URL은 ASCII 문자만 안전하게 전송할 수 있도록 설계되었습니다. 한글,
          띄어쓰기, 특수문자(
          <code className="bg-white/10 px-1 rounded">&amp; = ? #</code> 등)는
          URL에서 특별한 의미를 가지거나 ASCII 범위를 벗어나기 때문에 반드시
          인코딩해야 합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          URL 인코딩이 필요한 실전 상황
        </h2>
        <div className="space-y-3">
          {[
            [
              "쿼리 파라미터",
              "검색어에 특수문자·한글 포함 시 — ?q=%EC%84%9C%EC%9A%B8",
            ],
            ["API 요청", "REST API 경로에 한글 파라미터 전달 시"],
            ["폼 데이터", "HTML form이 POST로 데이터를 전송할 때 자동 인코딩"],
            ["파일 경로", "파일명에 공백·한글이 포함된 URL 생성 시"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          encodeURI vs encodeURIComponent 차이
        </h2>
        <div className="space-y-2">
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="font-mono text-sm text-green-400 mb-1">
              encodeURI(url)
            </p>
            <p className="text-sm text-gray-400">
              URL 전체를 인코딩.{" "}
              <code className="bg-white/10 px-1 rounded">: / ? # &</code> 등 URL
              구조 문자는 유지
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="font-mono text-sm text-blue-400 mb-1">
              encodeURIComponent(value)
            </p>
            <p className="text-sm text-gray-400">
              파라미터 값 인코딩. URL 구조 문자까지 모두 인코딩 → 쿼리스트링
              값에 사용
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          URL 인코딩 실전 예제
        </h2>
        <div className="space-y-3">
          {[
            [
              "한글 검색어",
              "검색어: '서울 맛집' → ?q=%EC%84%9C%EC%9A%B8+%EB%A7%9B%EC%A7%91",
            ],
            ["이메일 주소", "user@example.com → user%40example.com (%40 = @)"],
            [
              "공백 처리",
              "공백은 + 또는 %20으로 인코딩 (폼 데이터는 +, URL 경로는 %20)",
            ],
            ["슬래시 포함 값", "2024/01/15 → 2024%2F01%2F15 (%2F = /)"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1 text-sm">{t}</p>
              <p className="text-xs font-mono text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언어별 URL 인코딩 함수
        </h2>
        <div className="space-y-2">
          {[
            ["JavaScript", "encodeURIComponent(str) — 쿼리 파라미터 값"],
            [
              "Python",
              "urllib.parse.quote(str) / urllib.parse.urlencode(dict)",
            ],
            ["Java", "URLEncoder.encode(str, StandardCharsets.UTF_8)"],
            [
              "PHP",
              "urlencode($str) — 폼 데이터 / rawurlencode($str) — URL 경로",
            ],
          ].map(([lang, fn], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold text-sm min-w-[100px]">
                {lang}
              </span>
              <code className="text-xs text-gray-400 font-mono">{fn}</code>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/uri-encoder"
            className="text-neon-primary hover:underline"
          >
            SpinFlow URL 인코더/디코더
          </Link>
          로 클릭 한 번에 변환하세요. 한글, 이모지, 특수문자 모두 지원합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "unix-timestamp-guide",
    title: "Unix 타임스탬프 완벽 가이드: 개발자가 시간을 숫자로 다루는 법",
    description:
      "1970년 1월 1일부터 세는 Unix 타임스탬프가 무엇인지, 왜 개발자들이 사용하는지, 밀리초 vs 초 차이까지 완벽하게 정리했습니다.",
    date: "2026-03-25",
    tags: ["Unix타임스탬프", "Epoch", "개발", "시간변환"],
    thumbnail:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          데이터베이스 로그에서{" "}
          <strong className="text-white">1713916800</strong> 같은 숫자를 본 적
          있나요? 이것이 <strong>Unix 타임스탬프</strong>입니다. 1970년 1월 1일
          00:00:00 UTC(유닉스 에포크)로부터 경과한 초(또는 밀리초)를 나타냅니다.{" "}
          <Link
            to="/tools/unix-timestamp"
            className="text-neon-primary hover:underline"
          >
            무료 Unix 타임스탬프 변환기
          </Link>
          로 바로 변환하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 개발자는 날짜 대신 숫자를 쓰는가?
        </h2>
        <div className="space-y-3">
          {[
            [
              "타임존 독립",
              "타임스탬프는 UTC 기준 단일 숫자 → 전 세계 어디서든 동일한 시점",
            ],
            [
              "정렬 용이",
              "숫자 비교만으로 시간 순서 정렬 가능 — 문자열 날짜보다 훨씬 빠름",
            ],
            [
              "저장 효율",
              "32비트 정수 4바이트로 표현 — 날짜 문자열보다 메모리 절약",
            ],
            ["연산 단순화", "두 타임스탬프를 빼면 바로 경과 시간(초) 계산"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          초(s) vs 밀리초(ms) — 헷갈리면 버그 발생!
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["초 단위 (Unix)", "10자리 — 1713916800\nPython, PHP, DB 기본값"],
            [
              "밀리초 단위",
              "13자리 — 1713916800000\nJavaScript Date.now() 기본값",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white mb-2 text-sm">{t}</p>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                {d}
              </pre>
            </div>
          ))}
        </div>
        <p className="text-sm bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg text-yellow-300">
          ⚠️ JavaScript에서 <code>Date.now()</code>는 밀리초. 초 단위로
          변환하려면 <code>Math.floor(Date.now() / 1000)</code>
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          2038년 문제란?
        </h2>
        <p>
          32비트 정수로 타임스탬프를 저장하면 2038년 1월 19일에 오버플로가
          발생합니다. 이미 대부분의 현대 시스템은 64비트로 전환했지만, 레거시
          시스템에서는 여전히 주의가 필요합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언어별 타임스탬프 코드 예제
        </h2>
        <div className="space-y-2">
          {[
            [
              "JavaScript",
              "현재 시간(ms): Date.now()\n현재 시간(s): Math.floor(Date.now() / 1000)\n날짜 변환: new Date(timestamp * 1000)",
            ],
            [
              "Python",
              "현재 시간(s): import time; time.time()\n날짜 변환: datetime.fromtimestamp(ts)",
            ],
            [
              "SQL",
              "현재 시간: UNIX_TIMESTAMP() (MySQL) / extract(epoch from now()) (PostgreSQL)",
            ],
          ].map(([lang, code], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-2 text-sm">{lang}</p>
              <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                {code}
              </pre>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          타임스탬프 활용 실전 시나리오
        </h2>
        <div className="space-y-3">
          {[
            [
              "API 응답 로그 분석",
              "서버 로그의 숫자 타임스탬프를 날짜로 변환해 버그 발생 시점 특정",
            ],
            [
              "쿠키·세션 만료 설정",
              "현재 타임스탬프 + 만료 시간(초)으로 Expires 값 계산",
            ],
            [
              "이벤트 순서 정렬",
              "여러 서버의 로그를 타임스탬프 기준으로 정확히 시간순 정렬",
            ],
            [
              "캐시 만료 시간 계산",
              "cache-control max-age와 현재 타임스탬프로 캐시 유효 여부 확인",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1 text-sm">{t}</p>
              <p className="text-xs text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/unix-timestamp"
            className="text-neon-primary hover:underline"
          >
            SpinFlow Unix 타임스탬프 변환기
          </Link>
          로 현재 시간의 타임스탬프 확인, 날짜↔숫자 변환을 즉시 처리하세요.
          초/밀리초 자동 감지 지원.
        </p>
      </div>
    ),
  },
  {
    slug: "case-converter-guide",
    title:
      "카멜케이스·스네이크케이스·파스칼케이스: 개발자 네이밍 컨벤션 완벽 정리",
    description:
      "camelCase, snake_case, PascalCase, kebab-case... 각 케이스가 어떤 상황에 쓰이는지, 언어별 표준 컨벤션까지 한 번에 정리합니다.",
    date: "2026-03-28",
    tags: ["네이밍컨벤션", "카멜케이스", "스네이크케이스", "개발"],
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          변수명 하나로 팀원과 싸워본 적 있나요? 네이밍 컨벤션은 코드의 일관성과
          가독성을 결정하는 핵심 규칙입니다.{" "}
          <Link
            to="/tools/case-converter"
            className="text-neon-primary hover:underline"
          >
            무료 케이스 변환기
          </Link>
          로 원하는 형식으로 즉시 변환하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          케이스 종류 한눈에 보기
        </h2>
        <div className="space-y-3">
          {[
            [
              "camelCase",
              "첫 단어 소문자, 이후 단어 첫 글자 대문자",
              "JavaScript 변수·함수명",
            ],
            [
              "PascalCase",
              "모든 단어 첫 글자 대문자",
              "클래스명, React 컴포넌트, TypeScript 인터페이스",
            ],
            [
              "snake_case",
              "모든 소문자, 단어 사이 언더스코어",
              "Python 변수·함수, 데이터베이스 컬럼명",
            ],
            [
              "kebab-case",
              "모든 소문자, 단어 사이 하이픈",
              "CSS 클래스명, URL 경로, HTML 속성",
            ],
            [
              "SCREAMING_SNAKE",
              "모든 대문자, 언더스코어",
              "상수(Constants), 환경변수",
            ],
          ].map(([name, desc, usage], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-neon-primary mb-1">
                {name}
              </p>
              <p className="text-sm text-gray-300 mb-1">{desc}</p>
              <p className="text-xs text-gray-500">📌 {usage}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          언어별 표준 컨벤션
        </h2>
        <div className="space-y-2">
          {[
            [
              "JavaScript / TypeScript",
              "변수·함수: camelCase | 클래스: PascalCase | 상수: SCREAMING_SNAKE",
            ],
            [
              "Python",
              "변수·함수: snake_case | 클래스: PascalCase | 상수: SCREAMING_SNAKE",
            ],
            ["CSS / HTML", "클래스·ID: kebab-case"],
            ["SQL / DB", "컬럼·테이블: snake_case"],
            ["URL 경로", "kebab-case 권장 (SEO 친화적)"],
          ].map(([lang, rule], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold text-sm min-w-[160px]">
                {lang}
              </span>
              <span className="text-gray-400 text-sm">{rule}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          네이밍이 중요한 이유 — 코드는 사람이 읽는다
        </h2>
        <p>
          마틴 파울러는{" "}
          <strong className="text-white">
            "코드는 컴퓨터보다 사람이 더 많이 읽는다"
          </strong>
          고 말합니다. 일관된 네이밍 컨벤션은 협업 속도를 높이고, 코드 리뷰
          시간을 줄이며, 버그 발생률을 낮춥니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          좋은 이름 vs 나쁜 이름
        </h2>
        <div className="space-y-2">
          {[
            ["❌ d", "✅ daysSinceLastLogin", "의미 없는 단일 문자"],
            ["❌ data", "✅ userProfileList", "너무 포괄적인 이름"],
            ["❌ flag", "✅ isEmailVerified", "불리언은 is/has/can 접두어"],
            ["❌ temp", "✅ filteredProducts", "임시 변수도 목적을 명시"],
            ["❌ handle", "✅ handleLoginSubmit", "이벤트 핸들러는 동작 명시"],
          ].map(([bad, good, reason], i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/5 p-3 rounded-lg"
            >
              <code className="text-red-400 font-mono text-xs min-w-[80px]">
                {bad}
              </code>
              <span className="text-gray-500">→</span>
              <code className="text-green-400 font-mono text-xs flex-1">
                {good}
              </code>
              <span className="text-xs text-gray-500 hidden sm:block">
                {reason}
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          팀 컨벤션 정하기
        </h2>
        <p>
          가장 중요한 것은 <strong className="text-white">팀 내 일관성</strong>
          입니다. 어떤 컨벤션을 쓰느냐보다 모두가 같은 규칙을 쓰는 것이
          중요합니다. ESLint, Prettier 설정 파일로 자동 강제하는 것을
          권장합니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/case-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 케이스 변환기
          </Link>
          로 텍스트를 원하는 형식으로 즉시 변환하세요. 복사 버튼 한 번으로
          끝납니다.
        </p>
      </div>
    ),
  },
  {
    slug: "yes-no-oracle-guide",
    title: "예스/노 신탁기: 결정을 못 내릴 때 랜덤이 도움이 되는 심리학적 이유",
    description:
      "동전 던지기, 예스/노 신탁기... 왜 중요한 결정에 랜덤을 쓰면 오히려 더 좋은 결과가 나오는지 심리학 연구로 알아봅니다.",
    date: "2026-04-01",
    tags: ["결정심리학", "예스노", "랜덤결정", "심리학"],
    thumbnail:
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "그냥 동전으로 정해버릴까?"라고 생각해본 적 있나요? 실제로 이 방법이
          효과적이라는 심리학 연구가 있습니다.{" "}
          <Link
            to="/tools/yes-no-oracle"
            className="text-neon-primary hover:underline"
          >
            무료 예스/노 신탁기
          </Link>
          로 결정의 부담을 내려놓으세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          동전 던지기 실험 — 시카고 대학교 연구
        </h2>
        <p>
          경제학자 스티븐 레빗(Steven Levitt)의 연구에 따르면, 동전 던지기로
          중요한 결정(이직, 이사, 이별 등)을 내린 사람들이{" "}
          <strong className="text-white">6개월 후 더 행복하다고 응답</strong>
          했습니다. 결정 자체보다 결정 후 실행력이 행복을 결정한다는 것입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          랜덤 결정이 도움이 되는 심리학적 메커니즘
        </h2>
        <div className="space-y-3">
          {[
            [
              "결과 편향 제거",
              "본인이 결정하면 결과가 나빠도 '내 탓'이라는 후회가 크지만, 랜덤은 책임을 분산시켜 실행에 집중하게 함",
            ],
            [
              "분석 마비 탈출",
              "선택지를 오래 고민할수록 뇌의 에너지가 소모되어 오히려 나쁜 결정을 함 — 랜덤이 이 루프를 끊음",
            ],
            [
              "직관 확인 도구",
              "동전이 '예스'로 나왔을 때 실망하면 → 실제 원하는 건 '노'라는 뜻. 내 감정을 확인하는 거울 역할",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-2">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          이런 상황에 쓰세요
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "🍕 뭐 먹을지 못 정할 때",
            "💼 이직 제안 수락 여부",
            "🎬 오늘 볼 영화 고르기",
            "✉️ 연락할지 말지 망설일 때",
            "🏃 오늘 운동할지 쉴지",
            "💸 살까 말까 충동구매 방지",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-3 rounded-lg text-sm text-center"
            >
              {item}
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          지금 결정을 못 내리고 있다면{" "}
          <Link
            to="/tools/yes-no-oracle"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 예스/노 신탁기
          </Link>
          를 눌러보세요. 결과에 대한 내 감정이 진짜 원하는 것을 알려줄 겁니다.
        </p>
      </div>
    ),
  },
  {
    slug: "developer-tools-collection",
    title: "개발자·기획자가 매일 쓰는 무료 온라인 도구 7선",
    description:
      "설치 없이 브라우저에서 바로 쓰는 무료 개발자 도구 모음. JSON 포매터, Base64, URL 인코더, Diff 비교, Unix 타임스탬프, 케이스 변환, CSS 그림자까지.",
    date: "2026-04-05",
    tags: ["개발자도구", "온라인툴", "무료도구", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          개발하다 보면 매번 같은 작업을 반복합니다. JSON 예쁘게 출력하기, 토큰
          디코딩, URL 인코딩... 설치 없이 브라우저에서 바로 쓸 수 있는{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 무료 도구 모음
          </Link>
          을 소개합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          개발자 필수 도구 7선
        </h2>
        <div className="space-y-3">
          {[
            {
              name: "JSON 포매터",
              path: "/tools/json-formatter",
              desc: "압축된 JSON을 들여쓰기로 정렬. API 응답 디버깅 필수 도구",
              tag: "백엔드",
            },
            {
              name: "Base64 인코더/디코더",
              path: "/tools/base64-encoder",
              desc: "JWT 토큰 페이로드 확인, 이미지 Data URL 변환, HTTP Basic 인증 디코딩",
              tag: "보안",
            },
            {
              name: "URL 인코더/디코더",
              path: "/tools/uri-encoder",
              desc: "한글·특수문자 퍼센트 인코딩. API 파라미터 디버깅에 필수",
              tag: "API",
            },
            {
              name: "Unix 타임스탬프 변환기",
              path: "/tools/unix-timestamp",
              desc: "DB 로그의 숫자 타임스탬프를 사람이 읽는 날짜로 즉시 변환",
              tag: "DB",
            },
            {
              name: "Diff 비교 도구",
              path: "/tools/diff-checker",
              desc: "두 텍스트의 차이를 빨간·초록으로 시각화. 설정 파일·코드 비교",
              tag: "리뷰",
            },
            {
              name: "케이스 변환기",
              path: "/tools/case-converter",
              desc: "camelCase ↔ snake_case ↔ PascalCase ↔ kebab-case 즉시 변환",
              tag: "코딩",
            },
            {
              name: "CSS 그림자 생성기",
              path: "/tools/css-shadow-generator",
              desc: "슬라이더로 box-shadow 값 시각적으로 조정 후 CSS 코드 복사",
              tag: "프론트",
            },
          ].map((tool, i) => (
            <Link
              key={i}
              to={tool.path}
              className="flex items-start gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-colors block"
            >
              <span className="text-xs bg-neon-primary/20 text-neon-primary px-2 py-1 rounded font-mono min-w-[48px] text-center">
                {tool.tag}
              </span>
              <div>
                <p className="font-bold text-white mb-1">{tool.name}</p>
                <p className="text-sm text-gray-400">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          위 도구들 외에도{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 전체 도구 목록
          </Link>
          에서 24개의 무료 온라인 도구를 확인하세요. 북마크 하나로 매일 반복
          작업을 줄이세요.
        </p>
      </div>
    ),
  },
  {
    slug: "random-number-science",
    title: "진짜 랜덤이란 무엇인가: 컴퓨터는 어떻게 랜덤 숫자를 만드는가",
    description:
      "컴퓨터가 만드는 랜덤은 진짜 랜덤일까요? 의사 난수(PRNG)와 진성 난수(TRNG)의 차이, 로또·암호화·게임에서 랜덤이 쓰이는 방식을 설명합니다.",
    date: "2026-04-10",
    tags: ["랜덤", "난수생성", "컴퓨터과학", "암호화"],
    thumbnail:
      "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          로또 번호 생성기, 게임 아이템 드랍, 암호화 키... 모두 '랜덤'에
          의존합니다. 그런데{" "}
          <strong className="text-white">
            컴퓨터는 진짜 랜덤을 만들 수 있을까요?
          </strong>{" "}
          <Link
            to="/tools/lotto-generator"
            className="text-neon-primary hover:underline"
          >
            무료 랜덤 번호 생성기
          </Link>
          로 직접 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          의사 난수(PRNG) vs 진성 난수(TRNG)
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              title: "의사 난수 (PRNG)",
              color: "text-blue-400",
              border: "border-blue-500/30",
              points: [
                "수학 알고리즘으로 생성",
                "시드(seed)값이 같으면 같은 수열",
                "빠르고 예측 가능 → 게임·시뮬레이션에 적합",
                "예: Math.random(), Java Random",
              ],
            },
            {
              title: "진성 난수 (TRNG)",
              color: "text-green-400",
              border: "border-green-500/30",
              points: [
                "물리적 현상(열잡음, 방사선) 활용",
                "완전히 예측 불가능",
                "느리지만 진짜 랜덤 → 암호화 키에 필수",
                "예: 하드웨어 보안 모듈(HSM)",
              ],
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white/5 border ${card.border} p-4 rounded-lg`}
            >
              <p className={`font-bold ${card.color} mb-3`}>{card.title}</p>
              <ul className="space-y-1">
                {card.points.map((p, j) => (
                  <li key={j} className="text-sm text-gray-400 flex gap-2">
                    <span>•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          분야별 랜덤 활용 방식
        </h2>
        <div className="space-y-3">
          {[
            [
              "🔐 암호화",
              "CSPRNG(암호학적으로 안전한 난수) 사용 — 예측 불가능성이 생명",
            ],
            [
              "🎰 로또·복권",
              "물리적 기계(공 추첨) 또는 TRNG — 조작 방지를 위해 하드웨어 랜덤",
            ],
            ["🎮 게임 드랍률", "PRNG로 충분 — 빠른 속도와 재현 가능성이 중요"],
            [
              "📊 통계 시뮬레이션",
              "PRNG + 고정 시드 — 같은 조건에서 재현 가능해야 함",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <p className="text-sm bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg text-blue-300">
          💡 브라우저의 <code>Math.random()</code>은 PRNG라 암호화에 절대 사용
          금지. 보안이 필요한 경우 <code>crypto.getRandomValues()</code>를
          사용하세요.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          일상의 결정에는 완벽한 랜덤이 필요하지 않습니다.{" "}
          <Link
            to="/tools/lotto-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 로또 번호 생성기
          </Link>
          나{" "}
          <Link
            to="/tools/dice-roller"
            className="text-neon-primary hover:underline"
          >
            주사위 굴리기
          </Link>
          로 재미있고 공정한 결정을 내려보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "burnout-prevention",
    title: "번아웃 예방법: 쉬는 것도 기술이다",
    description:
      "현대인 3명 중 1명이 겪는 번아웃. 예방법과 회복 전략을 과학적으로 알아봅니다.",
    date: "2026-04-15",
    tags: ["번아웃", "심리학", "생산성", "회복"],
    thumbnail:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          WHO는 2019년 번아웃(Burnout)을 공식 직업 현상으로 인정했습니다. 단순한
          피로가 아니라{" "}
          <strong className="text-white">
            만성 스트레스로 인한 에너지 고갈 상태
          </strong>
          입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          번아웃의 3가지 신호
        </h2>
        <div className="space-y-3">
          {[
            [
              "탈진(Exhaustion)",
              "아무리 자도 피곤하고, 일 시작 전부터 지쳐있는 상태",
            ],
            [
              "냉소(Cynicism)",
              "업무·동료에 대한 무관심, '어차피 안 되는데' 생각의 반복",
            ],
            [
              "효능감 저하",
              "과거엔 잘하던 일에서 더 이상 성취감을 느끼지 못함",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          번아웃의 주요 원인
        </h2>
        <div className="space-y-3">
          {[
            [
              "과도한 업무량",
              "처리 가능한 범위를 넘는 일이 지속되면 회복이 불가능해짐",
            ],
            [
              "통제감 부재",
              "내가 결정할 수 있는 것이 없다는 무력감 — 가장 강력한 번아웃 유발 요인",
            ],
            [
              "인정 부족",
              "노력에 비해 피드백·보상이 없을 때 지속 동기가 사라짐",
            ],
            [
              "가치 충돌",
              "나의 가치관과 조직의 방향이 다를 때 만성 스트레스 발생",
            ],
            ["공동체 부재", "팀워크 없이 혼자 모든 것을 감당해야 하는 고립감"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          번아웃 자가 진단 체크리스트
        </h2>
        <div className="space-y-2">
          {[
            "아침에 일어나는 것 자체가 힘들다",
            "예전엔 즐거웠던 일이 지금은 의미없게 느껴진다",
            "업무 실수가 늘었고 집중하기 어렵다",
            "동료·가족에게 쉽게 짜증이 난다",
            "몸이 자주 아프거나 두통·소화불량이 반복된다",
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center bg-white/5 p-3 rounded-lg"
            >
              <div className="w-5 h-5 border border-neon-primary/50 rounded flex-shrink-0" />
              <span className="text-sm text-gray-300">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-2">
          3개 이상 해당 시 번아웃 초기 단계 — 즉각적인 대응이 필요합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          단계별 회복 전략
        </h2>
        <div className="space-y-3">
          {[
            [
              "1단계: 즉각 멈추기",
              "번아웃을 인정하는 것이 첫 번째입니다. 연차·휴가를 사용해 완전히 분리되는 시간 확보",
            ],
            [
              "2단계: 신체 회복",
              "수면 7~9시간, 가벼운 운동, 규칙적인 식사. 뇌는 신체가 회복되어야 작동합니다",
            ],
            [
              "3단계: 원인 제거",
              "번아웃의 근본 원인을 파악하고 구조적으로 해결 — 업무량 조정, 역할 재협상",
            ],
            [
              "4단계: 경계선 설정",
              "회복 후 재발 방지를 위해 명확한 업무 종료 시간·거절 기준을 정함",
            ],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-4 rounded-lg"
            >
              <span className="bg-neon-primary text-black font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-white mb-1">{t}</p>
                <p className="text-sm text-gray-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          예방을 위한 일상 실천법
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>일정한 업무 종료 시간</strong> 설정 — 퇴근 후 메신저 확인
            차단
          </li>
          <li>
            <strong>주도적인 휴식</strong> — 수동적(SNS 스크롤)이 아닌 회복형
            활동(산책, 독서)
          </li>
          <li>
            <strong>NO 말하기 연습</strong> — 과부하의 주원인은 거절 못 하는
            습관
          </li>
          <li>
            <strong>작은 성취 기록</strong> — 오늘 완료한 일 3가지를 적는
            것만으로도 효능감 회복
          </li>
          <li>
            <strong>주 1회 '아무것도 안 하는 날'</strong> — 생산성 없는 시간도
            삶의 일부
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          번아웃은 갑자기 오지 않습니다. 신호가 보일 때 멈추는 것이 가장
          효과적인 치료입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "lotto-statistics",
    title: "로또 번호 통계 분석: 자주 나오는 번호가 있을까?",
    description:
      "로또 1~45번 중 정말 자주 나오는 번호가 있는지 통계로 알아봅니다. 도박사의 오류와 진짜 확률의 차이.",
    date: "2026-04-16",
    tags: ["로또", "통계", "확률", "랜덤"],
    thumbnail:
      "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "34번이 제일 많이 나왔대!" — 사실일 수도 있습니다. 하지만{" "}
          <strong className="text-white">
            다음 회차에 34번이 더 나올 확률은 여전히 1/45
          </strong>
          입니다.{" "}
          <Link
            to="/tools/lotto-generator"
            className="text-neon-primary hover:underline"
          >
            무료 로또 번호 생성기
          </Link>
          로 번호를 뽑아보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          도박사의 오류(Gambler's Fallacy)
        </h2>
        <p>
          과거 결과가 미래 확률에 영향을 준다는 착각입니다. 동전을 10번 던져
          앞면이 9번 나왔다고 다음에 뒷면이 나올 확률이 높아지지 않습니다. 각
          시행은 완전히 독립적입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          그럼에도 전략이 있다면?
        </h2>
        <div className="space-y-3">
          {[
            [
              "당첨 확률 자체는 동일",
              "어떤 번호 조합을 선택해도 1등 확률은 1/8,145,060으로 동일",
            ],
            [
              "당첨금 나눔 최소화",
              "1~9 같은 인기 번호를 피하면 당첨 시 상금을 나눌 사람이 줄어듦",
            ],
            [
              "자동 vs 수동",
              "수동 번호 선택이 당첨 확률을 높이지는 않음 — 심리적 만족감의 차이",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/lotto-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 로또 번호 생성기
          </Link>
          로 완전 무작위 번호를 생성하세요. 어떤 방식으로 골라도 확률은
          동일합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "pareto-principle",
    title: "파레토 법칙(80/20 법칙)으로 하루를 설계하는 법",
    description:
      "결과의 80%는 원인의 20%에서 나온다. 파레토 법칙을 업무·학습·인간관계에 적용하는 실전 가이드.",
    date: "2026-04-17",
    tags: ["파레토", "생산성", "80/20", "시간관리"],
    thumbnail:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          이탈리아 경제학자 빌프레도 파레토가 발견한 법칙:{" "}
          <strong className="text-white">
            결과의 80%는 원인의 20%에서 발생
          </strong>
          합니다. 당신의 수익 80%는 고객의 20%에서, 성과의 80%는 할 일의 20%에서
          나옵니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          분야별 적용 사례
        </h2>
        <div className="space-y-3">
          {[
            [
              "📋 업무",
              "오늘 To-Do 중 딱 2개만 골라라 — 그 2개가 나머지 8개보다 중요",
            ],
            ["📚 공부", "시험 범위의 20% 핵심 개념이 문제의 80%를 커버"],
            [
              "👥 인간관계",
              "에너지를 주는 20%의 관계에 집중, 80%의 소모적 관계는 자연스럽게 줄이기",
            ],
            ["💰 수익", "매출 상위 20% 제품/서비스에 자원 집중"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          오늘 당장 적용하기
        </h2>
        <p>
          할 일 목록을 보고 스스로에게 물으세요:{" "}
          <strong>"이 중에서 딱 하나만 해야 한다면?"</strong> 그게 당신의
          20%입니다. 나머지는 그 하나 이후에 해도 됩니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          결정이 어렵다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 우선순위를 뽑아보세요. 나온 항목에 안도감이 드는지 — 그게 진짜
          우선순위입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "percentage-life-hacks",
    title: "퍼센트 계산이 헷갈릴 때: 실생활 퍼센트 완전 정리",
    description:
      "할인율, 세금, 인상률, 증감률... 실생활에서 퍼센트를 틀리지 않는 3가지 공식과 빠른 암산법.",
    date: "2026-04-18",
    tags: ["퍼센트", "수학", "계산", "생활수학"],
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "30% 할인이면 얼마지?" — 순간적으로 막히는 퍼센트 계산.{" "}
          <Link
            to="/tools/percentage-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 퍼센트 계산기
          </Link>
          로 즉시 해결하거나, 3가지 공식만 외워두세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          실생활 퍼센트 공식 3가지
        </h2>
        <div className="space-y-3">
          {[
            [
              "A의 X%는?",
              "A × X ÷ 100 → 10만원의 30% = 10만 × 30 ÷ 100 = 3만원",
            ],
            [
              "A는 B의 몇%?",
              "A ÷ B × 100 → 3만원은 10만원의 몇%? = 3 ÷ 10 × 100 = 30%",
            ],
            [
              "X% 증가/감소 후 금액?",
              "원래 × (1 ± X/100) → 10만원 30% 할인 = 10만 × 0.7 = 7만원",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-mono font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          퍼센트 암산 꿀팁
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>10% 먼저</strong> 구한 뒤 곱하기 — 30%는 10%의 3배
          </li>
          <li>
            <strong>1% 단위</strong>로 쪼개기 — 15%는 10% + 5%(=10%의 절반)
          </li>
          <li>
            퍼센트와 원래 수를 <strong>바꿔도 동일</strong> — 8의 25% = 25의 8%
            = 2
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          복잡한 계산은{" "}
          <Link
            to="/tools/percentage-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 퍼센트 계산기
          </Link>
          에 맡기세요. 증가율·감소율·비율 계산을 한 번에.
        </p>
      </div>
    ),
  },
  {
    slug: "digital-minimalism",
    title: "디지털 미니멀리즘: 앱 정리로 집중력 되찾기",
    description:
      "스마트폰 앱이 많을수록 집중력은 줄어듭니다. 디지털 미니멀리즘 실천으로 방해 없는 하루를 만드는 방법.",
    date: "2026-04-19",
    tags: ["디지털미니멀리즘", "집중력", "스마트폰", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          평균 스마트폰 사용자는 하루{" "}
          <strong className="text-white">96번 스마트폰을 확인</strong>합니다.
          알림 하나당 집중력이 완전히 회복되는 데 <strong>23분</strong>이
          걸린다는 연구 결과도 있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          디지털 미니멀리즘 3단계
        </h2>
        <div className="space-y-3">
          {[
            [
              "1단계: 앱 감사(減)하기",
              "30일간 필수 앱만 남기고 나머지 삭제. 3주 후에도 생각나지 않는 앱은 필요 없었던 것",
            ],
            [
              "2단계: 알림 제로화",
              "모든 앱 알림 끄기 → 내가 필요할 때만 확인하는 습관으로 전환",
            ],
            [
              "3단계: 스크린 타임 설정",
              "SNS·유튜브는 하루 30분 시간제한. 의지력 대신 시스템으로 해결",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          디지털 도구는 내 목적에 맞게 사용할 때 가장 강력합니다.{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 도구 모음
          </Link>
          처럼 필요한 순간에만 열고 닫을 수 있는 도구를 활용하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "unit-conversion-life",
    title: "단위 변환 실전 가이드: cm·kg·°C를 자유자재로 다루는 법",
    description:
      "해외 직구, 여행, 요리 레시피... 일상 속 단위 변환이 필요한 순간과 자주 쓰이는 변환 공식 모음.",
    date: "2026-04-20",
    tags: ["단위변환", "cm", "kg", "온도"],
    thumbnail:
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          해외 쇼핑몰의 인치 사이즈, 미국 레시피의 oz(온스), 화씨 온도...{" "}
          <Link
            to="/tools/unit-converter"
            className="text-neon-primary hover:underline"
          >
            무료 단위 변환기
          </Link>
          로 즉시 해결하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          외워두면 유용한 변환 공식
        </h2>
        <div className="space-y-3">
          {[
            ["길이", "1인치 = 2.54cm | 1피트(ft) = 30.48cm | 1마일 = 1.609km"],
            ["무게", "1파운드(lb) = 453.6g | 1온스(oz) = 28.35g"],
            ["온도", "°C→°F: (°C×9/5)+32 | °F→°C: (°F-32)×5/9"],
            [
              "부피",
              "1컵(cup) = 240ml | 1큰술(tbsp) = 15ml | 1작은술(tsp) = 5ml",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm font-mono text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/unit-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 단위 변환기
          </Link>
          에서 길이·무게·온도·속도·넓이 등 40가지 이상의 단위를 변환하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "pomodoro-technique",
    title: "포모도로 기법 완벽 가이드: 25분의 기적",
    description:
      "1980년대 토마토 타이머에서 시작된 시간 관리 기법. 집중력과 생산성을 동시에 높이는 포모도로 실전 가이드.",
    date: "2026-04-21",
    tags: ["포모도로", "시간관리", "집중력", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          프란체스코 시릴로가 1980년대 토마토(Pomodoro) 모양 주방 타이머로
          개발한 기법. 핵심은 단순합니다:{" "}
          <strong className="text-white">25분 집중 → 5분 휴식 → 반복</strong>.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          포모도로 4단계
        </h2>
        <div className="space-y-2">
          {[
            ["1", "할 일 하나를 선택"],
            ["2", "타이머 25분 설정 후 오직 그 일만"],
            ["3", "타이머가 울리면 5분 휴식 (진짜 쉬기 — SNS 금지)"],
            ["4", "4 포모도로 완료 후 15~30분 긴 휴식"],
          ].map(([n, d], i) => (
            <div
              key={i}
              className="flex gap-4 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="bg-neon-primary text-black font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm flex-shrink-0">
                {n}
              </span>
              <span className="text-sm text-gray-300">{d}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 효과적인가?
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>파킨슨의 법칙</strong> 차단 — 시간 제한이 없으면 일이 가용
            시간을 꽉 채움
          </li>
          <li>
            <strong>강제 휴식</strong>으로 인지 피로 예방 — 마라톤이 아닌 인터벌
            트레이닝
          </li>
          <li>
            <strong>방해 차단</strong> 연습 — 25분간 다른 충동이 줄어드는 훈련
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          업무 유형별 포모도로 적용법
        </h2>
        <div className="space-y-3">
          {[
            [
              "✍️ 글쓰기·보고서",
              "25분: 초안 작성 (퇴고 금지) → 5분: 스트레칭 → 반복. 완벽함보다 흐름 유지가 핵심",
            ],
            [
              "💻 코딩·개발",
              "25분: 한 기능 구현 → 5분: 커밋 정리. 문제 해결 중 막히면 메모 후 다음 포모도로로",
            ],
            [
              "📚 공부·학습",
              "25분: 능동적 읽기(밑줄+메모) → 5분: 핵심 3가지 떠올리기. 수동적 읽기는 효과 반감",
            ],
            [
              "📧 이메일·메신저",
              "하루 2~3 포모도로만 배정. 이 시간 외에는 알림 완전 차단",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          포모도로 변형 버전
        </h2>
        <div className="space-y-2">
          {[
            ["표준 포모도로", "25분 집중 / 5분 휴식", "일반 업무"],
            ["딥 워크 포모도로", "50분 집중 / 10분 휴식", "복잡한 창작·개발"],
            [
              "짧은 포모도로",
              "15분 집중 / 3분 휴식",
              "집중이 어려울 때 시작용",
            ],
            [
              "울트라 포모도로",
              "90분 집중 / 20분 휴식",
              "수면 사이클과 일치, 최고 집중 상태",
            ],
          ].map(([name, time, use], i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="text-xs text-neon-primary font-mono">{time}</p>
              </div>
              <span className="text-xs text-gray-500">{use}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          자주 묻는 질문
        </h2>
        <div className="space-y-3">
          {[
            [
              "포모도로 중간에 방해를 받으면?",
              "즉시 메모하고('나중에 처리') 포모도로를 계속 진행. 긴급한 경우엔 포모도로를 무효화하고 다시 시작",
            ],
            [
              "25분이 너무 짧게 느껴진다면?",
              "좋은 신호입니다. 집중이 잘 되고 있다는 뜻. 50분 버전으로 업그레이드할 때입니다",
            ],
            [
              "휴식 5분에 뭘 해야 하나?",
              "눈 감기, 스트레칭, 물 마시기, 창밖 보기. SNS·유튜브는 뇌를 더 피로하게 만들어 역효과",
            ],
          ].map(([q, a], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white mb-2 text-sm">Q. {q}</p>
              <p className="text-sm text-gray-400">A. {a}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 시간 계산기
          </Link>
          로 포모도로 세션의 총 시간을 계산해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "qr-code-uses",
    title: "QR코드 200% 활용법: 명함·와이파이·결제까지",
    description:
      "단순한 URL 공유를 넘어 명함, 와이파이 공유, 앱 다운로드, 결제까지. QR코드를 제대로 활용하는 방법.",
    date: "2026-04-22",
    tags: ["QR코드", "활용법", "명함", "와이파이"],
    thumbnail:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          QR코드는 URL 링크만 담는 게 아닙니다. 텍스트·연락처·와이파이 설정·위치
          정보까지 담을 수 있습니다.{" "}
          <Link
            to="/tools/qr-code-generator"
            className="text-neon-primary hover:underline"
          >
            무료 QR코드 생성기
          </Link>
          로 다양한 용도로 만들어보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          QR코드 활용 아이디어
        </h2>
        <div className="space-y-3">
          {[
            [
              "📇 디지털 명함",
              "이름·연락처·SNS를 QR 하나로 — 종이 명함 없이 스마트폰으로 바로 저장",
            ],
            [
              "📶 와이파이 공유",
              "SSID·비밀번호를 QR에 담아 부착 — 입력 없이 자동 연결",
            ],
            [
              "📍 위치 공유",
              "구글맵 URL을 QR로 — 행사 초대장에 삽입하면 길 찾기 바로 실행",
            ],
            [
              "📱 앱 다운로드",
              "앱스토어 링크 QR — 오프라인 행사에서 앱 설치 유도",
            ],
            [
              "📋 메뉴판",
              "레스토랑 메뉴 URL QR — 위생적이고 업데이트가 즉시 반영됨",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/qr-code-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow QR코드 생성기
          </Link>
          는 URL·텍스트·이메일·전화번호를 QR코드로 즉시 변환합니다. PNG로 저장해
          명함·포스터·PPT에 바로 삽입하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "multitasking-myth",
    title: "멀티태스킹은 없다: 단일 집중의 과학",
    description:
      "우리 뇌는 실제로 멀티태스킹을 못 합니다. 동시 작업의 신화를 깨고 단일 집중이 왜 더 효율적인지 알아봅니다.",
    date: "2026-04-23",
    tags: ["집중력", "멀티태스킹", "뇌과학", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          스탠퍼드 연구에 따르면 멀티태스킹을 많이 하는 사람일수록{" "}
          <strong className="text-white">
            집중력·기억력·주의 전환 능력이 모두 낮았습니다
          </strong>
          . 뇌는 실제로 동시 처리가 아니라 고속 전환(Context Switching)을
          합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Context Switching의 비용
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            작업 전환당 평균 <strong>15~20분</strong>의 워밍업 시간 낭비
          </li>
          <li>
            실수 발생률 <strong>50% 증가</strong>
          </li>
          <li>
            전체 처리 시간 <strong>40% 증가</strong> (MIT 연구)
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          단일 집중을 위한 환경 설계
        </h2>
        <div className="space-y-3">
          {[
            [
              "타임 블로킹",
              "하루를 업무 유형별 블록으로 나눔 — 이메일·개발·회의 시간을 분리",
            ],
            [
              "물리적 격리",
              "집중 시간엔 헤드폰 착용 + 도어 닫기 — 방해 차단 신호",
            ],
            [
              "디지털 격리",
              "집중 앱(Forest, Cold Turkey) 사용 — SNS·메신저 시간제 차단",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          싱글태스킹 훈련법 — 4주 프로그램
        </h2>
        <div className="space-y-2">
          {[
            [
              "1주차",
              "하루 1시간 알림 완전 차단. 이메일·메신저 2회(오전·오후)만 확인",
            ],
            [
              "2주차",
              "오전 2시간을 가장 중요한 단일 업무에만 투자. 회의·메신저 불가",
            ],
            [
              "3주차",
              "포모도로 기법 병행. 25분 집중 중 다른 충동을 종이에 적어두고 무시",
            ],
            ["4주차", "하루 전체 타임 블로킹. 업무 유형별 시간대 완전 분리"],
          ].map(([week, desc], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold font-mono text-sm min-w-[50px]">
                {week}
              </span>
              <span className="text-sm text-gray-400">{desc}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          멀티태스킹이 실제로 괜찮은 상황
        </h2>
        <p>
          모든 멀티태스킹이 나쁜 건 아닙니다.{" "}
          <strong className="text-white">인지 부하가 낮은 작업의 조합</strong>은
          효율적일 수 있습니다.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            [
              "✅ 괜찮은 조합",
              "걷기 + 팟캐스트 듣기",
              "설거지 + 음악 감상",
              "러닝머신 + 전화 통화",
            ],
            [
              "❌ 나쁜 조합",
              "코딩 + 영상 시청",
              "글쓰기 + 음악 가사 듣기",
              "공부 + 채팅",
            ],
          ].map(([label, ...items], i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${i === 0 ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"}`}
            >
              <p
                className={`font-bold text-sm mb-2 ${i === 0 ? "text-green-400" : "text-red-400"}`}
              >
                {label}
              </p>
              {items.map((item, j) => (
                <p key={j} className="text-xs text-gray-400">
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          지금 무엇부터 할지 모르겠다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 하나를 뽑아 그것만 집중하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "markdown-writing",
    title: "마크다운으로 글 쓰는 이유: 개발자·기획자의 노트 작성법",
    description:
      "서식 걱정 없이 내용에만 집중할 수 있는 마크다운. 기본 문법부터 실전 활용까지 10분 완성 가이드.",
    date: "2026-04-24",
    tags: ["마크다운", "글쓰기", "노트", "개발"],
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          마크다운은{" "}
          <strong className="text-white">
            일반 텍스트에 간단한 기호를 더해 서식을 표현
          </strong>
          하는 방법입니다. GitHub·Notion·Slack·Discord 모두 마크다운을
          지원합니다.{" "}
          <Link
            to="/tools/markdown-previewer"
            className="text-neon-primary hover:underline"
          >
            무료 마크다운 미리보기
          </Link>
          로 바로 연습해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          핵심 문법 10가지
        </h2>
        <div className="space-y-2">
          {[
            ["# 제목 1 / ## 제목 2", "H1, H2 헤딩"],
            ["**굵게** / *기울임*", "강조"],
            ["- 항목 / 1. 순서", "목록"],
            ["[링크](URL)", "하이퍼링크"],
            ["![alt](이미지URL)", "이미지"],
            ["```코드```", "코드 블록"],
            ["---", "구분선"],
            ["> 인용문", "인용"],
            ["~~취소선~~", "취소선"],
          ].map(([syntax, desc], i) => (
            <div
              key={i}
              className="flex gap-3 items-center bg-white/5 p-3 rounded-lg"
            >
              <code className="text-neon-primary font-mono text-sm min-w-[160px]">
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
          에서 왼쪽에 입력하면 오른쪽에 실시간으로 렌더링됩니다.
        </p>
      </div>
    ),
  },
  {
    slug: "morning-routine",
    title: "아침 루틴이 하루를 결정하는 이유",
    description:
      "성공한 사람들은 왜 아침에 특별한 루틴을 갖는가. 과학적으로 검증된 아침 루틴 설계 가이드.",
    date: "2026-04-25",
    tags: ["아침루틴", "습관", "생산성", "라이프스타일"],
    thumbnail:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          팀 쿡(Apple CEO)은 새벽 4시에 일어나고, 오프라 윈프리는 명상으로
          하루를 시작합니다. 아침 루틴은{" "}
          <strong className="text-white">
            의지력이 가장 충전된 시간대를 의도적으로 사용
          </strong>
          하는 전략입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          아침 루틴이 효과적인 이유
        </h2>
        <div className="space-y-3">
          {[
            [
              "의지력 피크",
              "기상 후 1~3시간이 전두엽 활동이 가장 활발한 시간 — 중요한 일을 이때 처리",
            ],
            [
              "프레이밍 효과",
              "하루의 첫 경험이 감정의 기준점이 됨 — 긍정적 아침이 하루 전체 분위기를 결정",
            ],
            [
              "자동화의 힘",
              "루틴이 자리잡으면 의사결정 없이 실행 — 하루치 의지력을 아낄 수 있음",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          최소 아침 루틴 (15분)
        </h2>
        <div className="space-y-2">
          {[
            ["5분", "물 한 잔 + 스트레칭"],
            ["5분", "오늘 할 일 3가지 적기"],
            ["5분", "산책 or 햇빛 쬐기"],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-4 items-center bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold font-mono min-w-[40px]">
                {t}
              </span>
              <span className="text-sm text-gray-300">{d}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          아침 루틴 수준별 업그레이드
        </h2>
        <div className="space-y-3">
          {[
            [
              "🌱 입문 (15분)",
              "기상 → 물 한 잔 → 오늘 할 일 3개 메모 → 세안. 완벽함보다 일관성이 중요",
            ],
            [
              "🌿 중급 (45분)",
              "기상 → 물 → 명상 10분 → 운동 20분 → 저널링 10분 → 샤워. 에너지 확실히 달라짐",
            ],
            [
              "🌳 고급 (90분)",
              "기상 → 찬물 샤워 → 운동 30분 → 독서 30분 → 저널링 + 감사 일기 → 하루 계획. 주 3~4회 권장",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          아침 루틴에서 피해야 할 것
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>스마트폰 확인</strong> — 기상 후 30분 이내 SNS·뉴스 확인은
            하루를 타인의 의제로 시작하게 함
          </li>
          <li>
            <strong>스누즈 버튼</strong> — 5분짜리 토막 수면은 뇌를 더
            혼란스럽게 만듦. 첫 알람에 일어나는 훈련 필요
          </li>
          <li>
            <strong>과도한 카페인</strong> — 기상 후 90분은 코르티솔이
            자연스럽게 높음. 이 시간에 커피는 내성만 키움
          </li>
          <li>
            <strong>너무 많은 루틴</strong> — 처음부터 복잡하게 시작하면
            하루라도 빠지면 전체 포기. 작게 시작해 쌓아가기
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          오늘 할 일 3가지를{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            텍스트 도구
          </Link>
          에 적어두고, 결정이 어렵다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 순서를 정하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "password-strength",
    title: "비밀번호 강도 테스트: 내 비밀번호는 얼마나 안전한가",
    description:
      "해커가 비밀번호를 푸는 데 걸리는 시간, 강력한 비밀번호의 조건, 비밀번호 관리자를 써야 하는 이유.",
    date: "2026-04-26",
    tags: ["비밀번호", "보안", "해킹", "개인정보"],
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          <code className="bg-white/10 px-1 rounded">123456</code>는 해커가{" "}
          <strong className="text-white">1초 이내</strong>에 뚫습니다.{" "}
          <Link
            to="/tools/password-generator"
            className="text-neon-primary hover:underline"
          >
            무료 비밀번호 생성기
          </Link>
          로 지금 당장 강력한 비밀번호를 만드세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          비밀번호 해독 예상 시간
        </h2>
        <div className="space-y-2">
          {[
            ["password", "즉시", "red"],
            ["P@ssw0rd", "3시간", "red"],
            ["Tr0ub4dor&3", "수백 년", "green"],
            ["correct-horse-battery", "수천 년 이상", "green"],
          ].map(([pw, time, color], i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
            >
              <code className="font-mono text-sm text-white">{pw}</code>
              <span
                className={`text-sm font-bold ${color === "red" ? "text-red-400" : "text-green-400"}`}
              >
                {time}
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          강력한 비밀번호의 4가지 조건
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>길이 12자 이상</strong> — 길이가 강도의 핵심
          </li>
          <li>
            <strong>대소문자 + 숫자 + 특수문자</strong> 혼합
          </li>
          <li>
            <strong>사전 단어, 생일, 이름 사용 금지</strong>
          </li>
          <li>
            <strong>서비스마다 다른 비밀번호</strong> — 1Password, Bitwarden 등
            관리자 활용
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          주요 해킹 방법과 대응법
        </h2>
        <div className="space-y-3">
          {[
            [
              "브루트 포스(Brute Force)",
              "모든 경우의 수를 대입. 대응: 12자 이상 + 복잡도 증가 → 수억 년 필요",
            ],
            [
              "딕셔너리 어택",
              "사전 단어·흔한 비밀번호 목록 대입. 대응: 사전 단어 절대 사용 금지",
            ],
            [
              "피싱(Phishing)",
              "가짜 사이트로 속여 직접 입력 유도. 대응: URL 확인 + 이중 인증(2FA)",
            ],
            [
              "크레덴셜 스터핑",
              "다른 사이트에서 유출된 아이디/비번 재사용 시도. 대응: 서비스마다 다른 비밀번호",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          비밀번호 관리자 추천
        </h2>
        <div className="space-y-2">
          {[
            ["1Password", "유료(월 $3~)", "가족·팀 공유 기능 우수. UI 최고"],
            [
              "Bitwarden",
              "무료 (오픈소스)",
              "자체 서버 호스팅 가능. 개발자 선호",
            ],
            ["KeePass", "무료 (로컬 저장)", "클라우드 없이 로컬 DB. 보안 최강"],
            ["네이버 패스워드", "무료", "한국 서비스 연동에 편리"],
          ].map(([name, price, desc], i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 p-3 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{name}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <span className="text-xs text-neon-primary font-mono">
                {price}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mt-4">
          <p className="font-bold text-blue-400 mb-1">
            💡 이중 인증(2FA)도 필수
          </p>
          <p className="text-sm text-gray-400">
            비밀번호가 유출되어도 2FA가 있으면 안전합니다. Google Authenticator,
            Authy 앱을 모든 주요 서비스에 설정하세요.
          </p>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/password-generator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 비밀번호 생성기
          </Link>
          로 길이·복잡도를 설정해 즉시 생성하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "goal-setting-smart",
    title: "목표 설정의 과학: SMART 목표 vs OKR — 무엇을 써야 하나",
    description:
      "새해 결심이 3주 만에 사라지는 이유. SMART 목표와 OKR의 차이, 상황에 맞는 목표 설정법을 알아봅니다.",
    date: "2026-04-27",
    tags: ["목표설정", "SMART", "OKR", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          목표를 세우는 사람 중{" "}
          <strong className="text-white">92%가 달성에 실패</strong>합니다.
          이유는 대부분 목표 자체가 아닌 목표 설정 방식에 있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          SMART 목표란?
        </h2>
        <div className="space-y-2">
          {[
            ["S — Specific", "구체적으로: '살 빼기' → '매주 3회 30분 달리기'"],
            ["M — Measurable", "측정 가능하게: 숫자로 표현"],
            ["A — Achievable", "달성 가능하게: 도전적이지만 현실적으로"],
            ["R — Relevant", "관련성: 내 삶의 우선순위와 연결"],
            ["T — Time-bound", "기한 있게: 'OO월 OO일까지'"],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold font-mono min-w-[130px] text-sm">
                {t}
              </span>
              <span className="text-sm text-gray-400">{d}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">OKR은 언제?</h2>
        <p>
          OKR(Objectives & Key Results)은 구글·인텔이 사용하는 방식. SMART보다{" "}
          <strong>야심 차고 영감적인 목표</strong>에 적합합니다. 개인보다는
          팀·조직 단위에서 더 효과적입니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          목표 중 어디서 시작할지 모르겠다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 첫 번째 행동을 뽑아보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "bmi-limitations",
    title: "BMI 계산기의 한계: 숫자 너머의 건강 지표",
    description:
      "BMI가 과체중이라도 건강할 수 있고, 정상이라도 위험할 수 있습니다. BMI의 한계와 보완 지표를 알아봅니다.",
    date: "2026-04-28",
    tags: ["BMI", "건강", "체중", "운동"],
    thumbnail:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          BMI(체질량지수)는{" "}
          <strong className="text-white">1830년대에 개발된 공식</strong>입니다.
          현대 의학은 BMI만으로 건강을 판단하는 것의 한계를 명확히 인지하고
          있습니다.{" "}
          <Link
            to="/tools/bmi-calculator"
            className="text-neon-primary hover:underline"
          >
            BMI 계산기
          </Link>
          로 내 수치를 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI가 놓치는 것들
        </h2>
        <div className="space-y-3">
          {[
            [
              "근육량 무시",
              "보디빌더는 BMI상 비만이지만 체지방률은 낮음 — 근육이 지방보다 무겁기 때문",
            ],
            [
              "체지방 분포 무시",
              "복부 비만(내장지방)은 BMI 정상이어도 심혈관 질환 위험이 높음",
            ],
            [
              "인종 차이",
              "동아시아인은 같은 BMI에서 서구인보다 체지방률·당뇨 위험이 더 높음",
            ],
            [
              "나이·성별 무시",
              "같은 BMI라도 노인과 청년, 남성과 여성의 건강 리스크가 다름",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          BMI를 보완하는 지표
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>허리둘레</strong> — 남성 90cm, 여성 85cm 이상 시 복부비만
          </li>
          <li>
            <strong>체지방률</strong> — 인바디 측정, 남성 15~25%, 여성 20~30%
            정상
          </li>
          <li>
            <strong>허리-키 비율</strong> — 허리둘레 ÷ 키, 0.5 이하가 건강
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/bmi-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow BMI 계산기
          </Link>
          로 수치를 확인하되, 하나의 참고 지표로만 활용하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "fewer-meetings",
    title: "회의를 줄이면 생산성이 늘어나는 이유",
    description:
      "직장인 하루 평균 3.5시간이 회의로 낭비됩니다. 비효율적인 회의를 줄이고 생산성을 높이는 실전 전략.",
    date: "2026-04-29",
    tags: ["회의", "생산성", "업무효율", "시간관리"],
    thumbnail:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          Atlassian 조사에 따르면 직장인의{" "}
          <strong className="text-white">31시간이 매달 비생산적인 회의</strong>
          에 낭비됩니다. 그러나 모든 회의가 나쁜 건 아닙니다 — 나쁜 회의가
          문제입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          이 회의는 필요한가? 체크리스트
        </h2>
        <div className="space-y-2">
          {[
            ["목적이 명확한가?", "어젠다 없는 회의는 즉시 취소"],
            ["이메일로 해결 가능한가?", "정보 공유 목적의 회의는 문서로 대체"],
            ["의사결정자가 참석하는가?", "결정권자 없는 회의는 결론이 없음"],
            [
              "30분 안에 끝낼 수 있는가?",
              "1시간 기본 설정 대신 25분 or 50분으로",
            ],
          ].map(([q, a], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold text-sm">Q</span>
              <div>
                <p className="text-sm text-white font-bold">{q}</p>
                <p className="text-xs text-gray-400 mt-1">{a}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          회의 없는 날(No-Meeting Day) 도입
        </h2>
        <p>
          Meta·Shopify는 특정 요일을 회의 금지 구역으로 설정합니다. 주 1~2일만
          해도 집중 업무 시간이 눈에 띄게 늘어납니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          회의 시간 계산이 필요하다면{" "}
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 시간 계산기
          </Link>
          를 활용하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "age-calculation-trivia",
    title: "나이 계산기로 알아보는 흥미로운 시간의 사실들",
    description:
      "당신이 살아온 날, 시간, 심장 박동 수. 나이를 다양한 단위로 환산하면 삶이 더 생생하게 느껴집니다.",
    date: "2026-04-30",
    tags: ["나이계산", "시간", "생일", "트리비아"],
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "나 30살이야"보다 "나 10,950일을 살았어"가 훨씬 더 실감납니다.{" "}
          <Link
            to="/tools/age-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 나이 계산기
          </Link>
          로 당신의 나이를 다양한 단위로 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          30세 기준 환산 수치
        </h2>
        <div className="space-y-3">
          {[
            ["📅 일(Day)", "약 10,950일"],
            ["⏰ 시간(Hour)", "약 262,800시간"],
            ["💓 심장 박동", "약 1,134,000,000회 (분당 72회 기준)"],
            ["😴 수면", "약 87,600시간 (하루 8시간 기준)"],
            ["🌍 지구 공전", "정확히 30번"],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
            >
              <span className="text-sm text-gray-300">{t}</span>
              <span className="font-bold text-neon-primary text-sm">{d}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          생일 관련 흥미로운 사실
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            365명 중 생일이 같은 사람이 존재할 확률: 23명만 모여도{" "}
            <strong>50% 이상</strong>
          </li>
          <li>한국식 나이와 만 나이의 차이: 최대 2살까지 차이 가능</li>
          <li>
            2월 29일 생은 4년에 한 번 생일 — 법적으로는 2월 28일 또는 3월 1일
            적용
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/age-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 나이 계산기
          </Link>
          로 생년월일을 입력하면 만 나이·날짜 수·다음 생일까지 남은 일수를
          확인할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "sleep-optimization",
    title: "잠 못 자는 현대인을 위한 수면 최적화 완벽 가이드",
    description:
      "수면 부채, 수면 사이클, 최적 취침 시간까지. 과학이 알려주는 수면의 질을 높이는 방법.",
    date: "2026-05-01",
    tags: ["수면", "건강", "생산성", "수면사이클"],
    thumbnail:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          수면 부족은 단순한 피로가 아닙니다. 하루 6시간 수면이 2주 지속되면
          인지 능력이{" "}
          <strong className="text-white">24시간 수면 박탈과 동등한 수준</strong>
          으로 떨어집니다 (펜실베이니아 대학 연구).
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          수면 사이클 이해하기
        </h2>
        <p>
          수면은 90분 주기로 반복됩니다. 4~5사이클(6~7.5시간)이 이상적. 알람은
          사이클이 끝나는 시점에 맞추세요.
        </p>
        <div className="bg-white/5 p-4 rounded-lg font-mono text-sm text-gray-300">
          취침 11시 → 기상 6:30 (7.5시간 = 5 사이클) ✓<br />
          취침 11시 → 기상 6:00 (7시간 = 90분×4+30분) ✗ 중간에 깸
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          수면 질을 높이는 5가지
        </h2>
        <div className="space-y-2">
          {[
            ["일정한 기상 시간", "주말도 동일하게 — 수면 리듬의 핵심"],
            ["취침 1시간 전 화면 차단", "블루라이트가 멜라토닌 분비 억제"],
            ["침실 온도 18~20°C", "체온 하강이 수면 유도"],
            [
              "카페인 오후 2시 이후 금지",
              "반감기 6시간 — 오후 2시 커피 = 자정에 절반이 남아있음",
            ],
            ["수면 전 루틴", "뇌에 '이제 잘 시간' 신호 보내기"],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold text-sm flex-shrink-0">
                ✓
              </span>
              <div>
                <p className="text-sm text-white font-bold">{t}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          수면 부채(Sleep Debt)란?
        </h2>
        <p>
          하루 1시간씩 덜 자면 일주일 뒤{" "}
          <strong className="text-white">7시간의 수면 부채</strong>가 쌓입니다.
          주말에 몰아 자도 인지 기능은 완전히 회복되지 않습니다 (하버드 의대
          연구). 수면 부채는 누적되고, 일시 보충은 임시방편에 불과합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          낮잠 황금 시간 — 최적 낮잠 가이드
        </h2>
        <div className="space-y-3">
          {[
            [
              "10~20분 (파워냅)",
              "N1~N2 수면만. 깨어나면 즉시 각성. 집중력 34%·주의력 54% 향상 (NASA 연구)",
            ],
            [
              "90분 (전체 사이클)",
              "한 사이클 완성. 깊은 피로 회복에 효과적. 하지만 밤 수면에 영향 줄 수 있음",
            ],
            [
              "피해야 할 낮잠",
              "30~60분 — 깊은 수면(N3) 진입 후 중단되어 오히려 더 피곤함",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
          <p className="font-bold text-yellow-400 mb-1">
            💡 커피냅(Coffee Nap) 꿀팁
          </p>
          <p className="text-sm text-gray-400">
            낮잠 직전 커피 한 잔 → 20분 수면 → 카페인이 딱 이때 흡수되어
            상쾌하게 기상. 카페인 효과 + 수면 효과 동시에.
          </p>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          취침·기상 시간 계산은{" "}
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 시간 계산기
          </Link>
          로 90분 단위로 역산해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "color-psychology",
    title: "색상 심리학: 색이 감정과 행동에 미치는 영향",
    description:
      "빨간색이 식욕을 자극하고 파란색이 집중력을 높이는 이유. 색상 심리학을 디자인·마케팅에 활용하는 방법.",
    date: "2026-05-02",
    tags: ["색상심리학", "디자인", "마케팅", "색"],
    thumbnail:
      "https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          맥도날드는 왜 빨간색·노란색인가? 스타벅스는 왜 초록색인가? 색상은{" "}
          <strong className="text-white">
            무의식적으로 감정·행동·구매 결정
          </strong>
          에 영향을 줍니다.{" "}
          <Link
            to="/tools/color-converter"
            className="text-neon-primary hover:underline"
          >
            무료 색상 변환기
          </Link>
          로 원하는 색상 코드를 확인하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          주요 색상과 심리적 효과
        </h2>
        <div className="space-y-3">
          {[
            [
              "🔴 빨강",
              "긴박감·식욕 자극·에너지. 맥도날드·유튜브·넷플릭스. CTA 버튼에 효과적",
            ],
            [
              "🔵 파랑",
              "신뢰·안정·집중. 삼성·페이스북·PayPal. 금융·IT 브랜드에 선호",
            ],
            ["🟢 초록", "자연·건강·성장. 스타벅스·홀푸즈. 친환경·웰빙 브랜드"],
            [
              "🟡 노랑",
              "낙관·주의·에너지. 카카오·IKEA. 주의 집중, 과도하면 불안 유발",
            ],
            [
              "🟣 보라",
              "고급·창의·신비. 할리데이비슨·캐드버리. 럭셔리·창작 분야",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/color-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 색상 변환기
          </Link>
          로 HEX·RGB·HSL을 자유롭게 변환하고{" "}
          <Link
            to="/tools/css-shadow-generator"
            className="text-neon-primary hover:underline"
          >
            CSS 그림자 생성기
          </Link>
          로 원하는 색의 그림자를 만들어보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "exercise-brain",
    title: "운동이 뇌를 바꾼다: 신체 활동과 인지 기능의 관계",
    description:
      "30분 걷기가 항우울제보다 효과적일 수 있습니다. 운동이 뇌에 미치는 과학적 효과와 실천 가이드.",
    date: "2026-05-03",
    tags: ["운동", "뇌과학", "인지기능", "정신건강"],
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          하버드 의대 존 레이티 교수는 운동을{" "}
          <strong className="text-white">"뇌에 주는 최고의 선물"</strong>이라고
          표현합니다. 신체 활동은 BDNF(뇌유래신경영양인자)를 증가시켜 새로운
          뉴런 생성을 촉진합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          운동이 뇌에 미치는 효과
        </h2>
        <div className="space-y-3">
          {[
            [
              "기억력 향상",
              "해마 부피 증가 — 운동하는 노인은 비운동 노인보다 기억력 40% 우수",
            ],
            [
              "집중력 강화",
              "운동 후 2~3시간 도파민·노르에피네프린 상승 — 학습·업무 골든타임",
            ],
            [
              "우울·불안 감소",
              "30분 유산소 운동이 항우울제와 동등한 효과 (Duke 대학 연구)",
            ],
            ["창의력 향상", "걷기 중 발산적 사고 81% 증가 (스탠퍼드 연구)"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          최소 유효 용량
        </h2>
        <p>
          주 3회, 30분 중강도 유산소(빠른 걷기, 자전거)만으로도 인지 기능 향상
          효과가 나타납니다. 헬스장이 필요 없습니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          오늘 운동할지 쉴지 고민이라면{" "}
          <Link
            to="/tools/yes-no-oracle"
            className="text-neon-primary hover:underline"
          >
            예스/노 신탁기
          </Link>
          에 물어보세요 — 단, 운동 쪽이 나왔을 때 안도감이 든다면 그게 답입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "lorem-ipsum-history",
    title: "Lorem Ipsum의 비밀: 500년간 디자이너가 써온 텍스트의 정체",
    description:
      "Lorem ipsum dolor sit amet... 이 이상한 라틴어의 출처, 키케로와의 연결고리, 현대 디자인에서 쓰이는 이유.",
    date: "2026-05-04",
    tags: ["LoremIpsum", "디자인", "역사", "타이포그래피"],
    thumbnail:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          <em>"Lorem ipsum dolor sit amet, consectetur adipiscing elit..."</em>{" "}
          — 이 텍스트는{" "}
          <strong className="text-white">
            기원전 45년 키케로가 쓴 라틴어 철학서
          </strong>
          에서 변형된 것입니다. 무려 2,000년의 역사를 가지고 있습니다.{" "}
          <Link
            to="/tools/lorem-ipsum"
            className="text-neon-primary hover:underline"
          >
            무료 Lorem Ipsum 생성기
          </Link>
          로 원하는 분량을 생성하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          Lorem Ipsum의 역사
        </h2>
        <div className="space-y-3">
          {[
            [
              "기원전 45년",
              "키케로의 『최고선악론(De Finibus Bonorum et Malorum)』 Section 1.10.32에 원문 존재",
            ],
            [
              "1500년대",
              "인쇄업자들이 활자 샘플용으로 키케로 텍스트를 뒤섞어 사용 시작",
            ],
            [
              "1960년대",
              "Letraset 회사가 프레스 타입 시트에 Lorem Ipsum 사용하며 디자인 업계 표준화",
            ],
            [
              "1980년대~현재",
              "PageMaker, InDesign, Figma 등 모든 디자인 도구에 기본 내장",
            ],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-4 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold font-mono text-sm min-w-[80px]">
                {t}
              </span>
              <span className="text-sm text-gray-400">{d}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          왜 의미 없는 텍스트를 쓰는가?
        </h2>
        <p>
          실제 텍스트를 넣으면 내용에 집중하게 되어{" "}
          <strong>레이아웃·폰트·여백</strong>을 객관적으로 평가하기 어렵습니다.
          의미 없는 라틴어는 시각 요소에만 집중하게 만드는 디자인 도구입니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/lorem-ipsum"
            className="text-neon-primary hover:underline"
          >
            SpinFlow Lorem Ipsum 생성기
          </Link>
          로 단락 수를 조절해 원하는 분량의 더미 텍스트를 즉시 생성하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "perfectionism-trap",
    title: "완벽주의의 덫: 80점이 100점보다 나을 때",
    description:
      "완벽주의는 높은 기준이 아니라 실행을 막는 두려움입니다. 완벽주의를 극복하고 실행력을 높이는 방법.",
    date: "2026-05-05",
    tags: ["완벽주의", "심리학", "실행력", "생산성"],
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          완벽주의자는 높은 기준을 가진 사람이 아닙니다.{" "}
          <strong className="text-white">
            완벽하지 않을 것이 두려워 시작하지 못하는 사람
          </strong>
          입니다. 연구에 따르면 완벽주의자는 목표 달성률이 오히려 낮습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          완벽주의의 실제 비용
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>시작 지연</strong> — 조건이 갖춰질 때를 기다리다 영원히 시작
            못 함
          </li>
          <li>
            <strong>과도한 수정</strong> — 이미 충분한 것을 계속 고침 (수확체감)
          </li>
          <li>
            <strong>번아웃</strong> — 100%가 아니면 실패로 인식하는 이분법적
            사고
          </li>
          <li>
            <strong>기회 상실</strong> — 빠른 실행과 피드백이 더 좋은 결과를 냄
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          "Done is better than perfect"
        </h2>
        <p>
          페이스북(현 Meta)의 초기 슬로건입니다. 출시된 제품은 개선할 수 있지만,
          출시되지 않은 제품은 존재하지 않습니다.{" "}
          <strong>80점짜리 완성본</strong>이 100점짜리 미완성보다 항상 낫습니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg border border-neon-primary/20">
          <p className="text-neon-primary font-bold mb-2">
            실천 방법: 타임박스 완벽주의
          </p>
          <p className="text-sm text-gray-400">
            작업에 시간 제한을 설정하세요. "이 글은 30분 안에 쓴다" — 타이머가
            울리면 그 상태로 제출합니다. 완벽함을 목표가 아닌 방향으로만 두세요.
          </p>
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          지금 시작하지 못하고 있다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 첫 번째 행동을 뽑아 그냥 시작해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "css-shadow-design",
    title: "CSS box-shadow 마스터하기: 디자이너처럼 그림자 만들기",
    description:
      "단순한 검은 그림자에서 뉴모피즘, 글로우 효과까지. CSS box-shadow의 모든 파라미터와 실전 활용법.",
    date: "2026-05-06",
    tags: ["CSS", "box-shadow", "디자인", "프론트엔드"],
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          CSS box-shadow 하나로 평범한 UI가 입체적으로 바뀝니다.{" "}
          <Link
            to="/tools/css-shadow-generator"
            className="text-neon-primary hover:underline"
          >
            무료 CSS 그림자 생성기
          </Link>
          로 슬라이더를 조작하며 실시간으로 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          box-shadow 파라미터 해설
        </h2>
        <div className="bg-white/5 p-4 rounded-lg font-mono text-sm mb-4">
          <span className="text-blue-400">box-shadow</span>:{" "}
          <span className="text-yellow-400">X Y</span>{" "}
          <span className="text-green-400">blur</span>{" "}
          <span className="text-purple-400">spread</span>{" "}
          <span className="text-red-400">color</span>;
        </div>
        <div className="space-y-2">
          {[
            [
              "X / Y (오프셋)",
              "그림자의 수평·수직 위치. 양수=오른쪽·아래, 음수=왼쪽·위",
            ],
            [
              "blur (흐림)",
              "값이 클수록 부드럽고 퍼진 그림자. 0이면 선명한 그림자",
            ],
            ["spread (확산)", "그림자 크기 조절. 양수=크게, 음수=작게"],
            ["color", "rgba() 사용 권장 — 투명도로 자연스러운 그림자"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg">
              <p className="font-bold text-neon-primary text-sm mb-1">{t}</p>
              <p className="text-xs text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          실전 그림자 레시피
        </h2>
        <div className="space-y-2">
          {[
            ["자연스러운 카드", "0 4px 6px rgba(0,0,0,0.1)"],
            ["강한 드롭섀도", "0 10px 25px rgba(0,0,0,0.3)"],
            ["글로우 효과", "0 0 20px rgba(34,211,238,0.5)"],
            ["뉴모피즘", "6px 6px 12px #b8b9be, -6px -6px 12px #fff"],
          ].map(([t, v], i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
            >
              <span className="text-sm text-gray-300">{t}</span>
              <code className="text-xs text-neon-primary font-mono">{v}</code>
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
          로 슬라이더를 조절하면 CSS 코드가 자동 생성됩니다. 복사 버튼 한 번으로
          바로 적용하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "gratitude-journal",
    title: "감사 일기의 효과: 5분으로 바꾸는 하루의 질",
    description:
      "감사 일기가 우울감 감소, 수면 개선, 관계 향상에 미치는 과학적 효과와 올바른 작성법.",
    date: "2026-05-07",
    tags: ["감사일기", "심리학", "긍정심리학", "습관"],
    thumbnail:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          UC 데이비스 심리학자 로버트 에먼스의 연구: 감사 일기를 쓴 그룹은
          그렇지 않은 그룹보다{" "}
          <strong className="text-white">
            25% 더 행복했고, 수면이 개선되었으며, 운동을 더 많이 했습니다
          </strong>
          .
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          감사 일기가 효과적인 이유
        </h2>
        <div className="space-y-3">
          {[
            [
              "주의 편향 교정",
              "인간 뇌는 부정적 사건을 3~5배 강하게 기억 (부정 편향). 감사 일기는 긍정 경험에 의도적으로 주의를 돌림",
            ],
            [
              "도파민 루프",
              "감사함을 느끼면 도파민 분비 → 더 많은 감사거리를 찾는 긍정적 피드백 루프 형성",
            ],
            [
              "관계 개선",
              "타인의 기여를 인식하는 습관이 생겨 관계 만족도 향상",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          올바른 작성법
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>구체적으로</strong> — "좋은 하루였다" ✗ → "동료가 커피를
            사줬고 그 따뜻함이 기억에 남는다" ✓
          </li>
          <li>
            <strong>왜 감사한지</strong> 함께 적기 — 이유가 있어야 감정이
            활성화됨
          </li>
          <li>
            <strong>매일보다 주 3회</strong>가 더 효과적 — 매일 쓰면 형식적이
            되기 쉬움
          </li>
          <li>
            <strong>취침 전</strong>에 쓰면 수면 개선 효과 극대화
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          감사 일기를{" "}
          <Link
            to="/tools/markdown-previewer"
            className="text-neon-primary hover:underline"
          >
            마크다운 에디터
          </Link>
          에 작성하거나{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            텍스트 카운터
          </Link>
          로 꾸준히 기록해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "json-api-explained",
    title: "API와 JSON: 앱들이 서로 대화하는 방법",
    description:
      "카카오 로그인, 날씨 앱, 지도 서비스... 모두 API와 JSON으로 작동합니다. 비개발자도 이해하는 완벽 가이드.",
    date: "2026-05-08",
    tags: ["API", "JSON", "웹개발", "비개발자"],
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          날씨 앱은 어떻게 실시간 날씨를 알까요? 카카오 로그인은 어떻게
          작동할까요? 모두{" "}
          <strong className="text-white">
            API(Application Programming Interface)
          </strong>
          와 <strong className="text-white">JSON</strong> 덕분입니다.{" "}
          <Link
            to="/tools/json-formatter"
            className="text-neon-primary hover:underline"
          >
            무료 JSON 포매터
          </Link>
          로 직접 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          API를 식당으로 이해하기
        </h2>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-sm text-gray-300">
            손님(앱) →{" "}
            <span className="text-neon-primary font-bold">웨이터(API)</span> →
            주방(서버/DB)
            <br />
            <br />
            손님이 메뉴(요청)를 웨이터에게 전달하면 주방에서 음식(데이터)을
            만들어 웨이터가 가져다 줍니다. 손님은 주방 안을 볼 필요가 없습니다.
          </p>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">JSON이란?</h2>
        <p>
          API가 데이터를 주고받는 <strong>형식(언어)</strong>입니다. 사람도 읽기
          쉽고 컴퓨터도 파싱하기 쉬운 구조입니다.
        </p>
        <div className="bg-white/5 p-4 rounded-lg font-mono text-sm text-gray-300">
          {`{`}
          <br />
          &nbsp;&nbsp;<span className="text-blue-400">"name"</span>:{" "}
          <span className="text-green-400">"홍길동"</span>,<br />
          &nbsp;&nbsp;<span className="text-blue-400">"age"</span>:{" "}
          <span className="text-yellow-400">30</span>,<br />
          &nbsp;&nbsp;<span className="text-blue-400">"skills"</span>: [
          <span className="text-green-400">"React"</span>,{" "}
          <span className="text-green-400">"Python"</span>]<br />
          {`}`}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          일상에서 API가 쓰이는 곳
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "🌤️ 날씨 앱 — 기상청 API",
            "🗺️ 지도 — Google Maps API",
            "💳 카카오/네이버 로그인 — OAuth API",
            "💸 카드 결제 — PG사 API",
            "📱 SNS 공유 — Facebook/Twitter API",
            "🚀 배달 앱 — 지도+결제 API 복합",
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
              {item}
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          API 응답 JSON이 한 줄로 압축되어 있다면{" "}
          <Link
            to="/tools/json-formatter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow JSON 포매터
          </Link>
          로 보기 좋게 펼쳐보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "success-habits",
    title: "성공한 사람들의 공통 습관 5가지",
    description:
      "빌 게이츠, 워런 버핏, 오프라 윈프리... 그들의 공통점은 재능이 아닌 습관이었습니다.",
    date: "2026-05-09",
    tags: ["습관", "성공", "자기계발", "루틴"],
    thumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          습관 연구의 권위자 찰스 두히그는 "성공은 재능의 산물이 아니라{" "}
          <strong className="text-white">올바른 습관을 지속한 결과</strong>"라고
          말합니다. 성공한 사람들의 공통 패턴을 분석했습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          공통 습관 5가지
        </h2>
        <div className="space-y-3">
          {[
            [
              "📚 매일 독서",
              "워런 버핏은 하루 5~6시간 독서. 빌 게이츠는 연간 50권. '독서는 복리로 돌아온다'",
            ],
            [
              "✍️ 글쓰기·저널링",
              "오프라 윈프리, 리처드 브랜슨 모두 매일 노트를 씁니다. 생각을 정제하고 패턴을 발견하는 훈련",
            ],
            [
              "🏃 규칙적인 운동",
              "팀 쿡(새벽 4시 체육관), 버락 오바마(아침 운동 45분). 에너지 관리의 기반",
            ],
            [
              "🎯 명확한 우선순위",
              "하루를 시작하기 전 '오늘 가장 중요한 1가지'를 정함 — 분주함과 생산성은 다름",
            ],
            [
              "🙏 명상·반성 시간",
              "아리아나 허핑턴, 레이 달리오. 분기별·일별 반성을 통해 전략을 수정",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          5가지 중 오늘 하나만 고른다면? 어렵다면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          에 5개를 입력하고 돌려보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "dday-life-management",
    title: "D-Day 카운터로 인생 관리하기: 중요한 날을 카운트다운으로",
    description:
      "시험, 프로젝트 마감, 여행, 기념일... D-Day 카운터가 미루기를 방지하고 동기를 높이는 이유.",
    date: "2026-05-10",
    tags: ["D-Day", "시간관리", "목표", "마감"],
    thumbnail:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          "시험이 100일 남았어"보다{" "}
          <strong className="text-white">"오늘이 D-100"</strong>이라고 보는 순간
          긴장감이 달라집니다.{" "}
          <Link
            to="/tools/d-day-counter"
            className="text-neon-primary hover:underline"
          >
            무료 D-Day 카운터
          </Link>
          로 중요한 날을 관리하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          D-Day 카운터가 효과적인 이유
        </h2>
        <div className="space-y-3">
          {[
            [
              "시각적 긴박감",
              "숫자가 줄어드는 것이 뇌에 실질적인 압박감을 주어 미루기 방지",
            ],
            [
              "역산 계획",
              "마감일로부터 역산해 오늘 해야 할 양을 계산 가능 — '100일 남았으니 하루 10페이지'",
            ],
            [
              "기대감 증폭",
              "여행·결혼·생일 등 기쁜 이벤트의 D-Day는 행복감과 기대감을 높임",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          D-Day 관리 추천 항목
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "📝 자격증·시험 날짜",
            "✈️ 해외여행 출발일",
            "💼 프로젝트 마감일",
            "💍 결혼기념일",
            "🎂 가족 생일",
            "🎯 개인 목표 달성일",
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
              {item}
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/d-day-counter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow D-Day 카운터
          </Link>
          에서 날짜를 입력하면 남은 일수가 즉시 계산됩니다.
        </p>
      </div>
    ),
  },
  {
    slug: "boundaries-relationship",
    title: "인간관계에서 경계선(Boundary) 긋기의 중요성",
    description:
      "거절 못 하는 사람이 더 힘든 이유. 건강한 경계선이 관계를 망치는 게 아니라 오히려 깊게 만드는 이유.",
    date: "2026-05-11",
    tags: ["인간관계", "심리학", "경계선", "자존감"],
    thumbnail:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          경계선(Boundary)이란{" "}
          <strong className="text-white">
            내가 수용 가능한 것과 그렇지 않은 것의 한계
          </strong>
          를 명확히 하는 것입니다. 경계선은 이기적인 게 아닙니다 — 지속 가능한
          관계의 기반입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          경계선 없는 사람의 패턴
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>NO라고 말하지 못해 과부하 → 번아웃</li>
          <li>속으로는 화가 나지만 겉으로는 괜찮은 척 → 관계에 분노 축적</li>
          <li>타인의 문제를 자신의 문제로 끌어안음 → 과도한 감정 소모</li>
          <li>자신의 필요보다 타인의 필요를 항상 우선 → 자존감 저하</li>
        </ul>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          건강한 경계선 만들기
        </h2>
        <div className="space-y-3">
          {[
            [
              "명확하게 표현하기",
              '"미안한데..."가 아닌 "나는 ~할 수 없어" 직접적 표현',
            ],
            [
              "일관성 유지하기",
              "한 번 정한 경계는 지키기 — 예외를 두면 경계가 흐려짐",
            ],
            [
              "죄책감 구분하기",
              "경계를 지키는 것에 드는 죄책감은 건강한 신호가 아님 — 과거 패턴의 반응",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          어떤 부탁을 거절할지 고민이라면{" "}
          <Link
            to="/tools/yes-no-oracle"
            className="text-neon-primary hover:underline"
          >
            예스/노 신탁기
          </Link>
          에 물어보세요. 결과에 대한 감정이 당신의 진짜 답입니다.
        </p>
      </div>
    ),
  },
  {
    slug: "text-analysis-basics",
    title: "텍스트 분석의 기초: 글자수·단어수·문장수가 중요한 이유",
    description:
      "SNS 글자 제한, 독해 수준 측정, SEO 콘텐츠 최적화까지. 텍스트 분석이 필요한 모든 상황을 알아봅니다.",
    date: "2026-05-12",
    tags: ["텍스트분석", "글자수", "SEO", "글쓰기"],
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          트위터는 280자, 인스타그램 바이오는 150자, 구글 메타 디스크립션은
          160자. <strong className="text-white">글자 수 제한</strong>은 생각보다
          많은 곳에서 중요합니다.{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            무료 텍스트 분석기
          </Link>
          로 즉시 확인하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          플랫폼별 글자 제한
        </h2>
        <div className="space-y-2">
          {[
            ["트위터/X", "280자 (1회 트윗)"],
            ["인스타그램 캡션", "2,200자 (단, 더보기 기준 125자)"],
            ["인스타그램 바이오", "150자"],
            ["구글 메타 타이틀", "60자 이내"],
            ["구글 메타 설명", "160자 이내"],
            ["카카오톡 프로필", "60자"],
          ].map(([platform, limit], i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
            >
              <span className="text-sm text-gray-300">{platform}</span>
              <span className="font-bold text-neon-primary text-sm">
                {limit}
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          독해 수준과 문장 길이
        </h2>
        <p>
          한 문장의 권장 길이는 <strong>15~20 단어</strong>입니다. 문장이 길수록
          독자가 이해하는 데 더 많은 인지 에너지를 소모합니다. 비즈니스
          글쓰기에서는 짧고 명확한 문장이 신뢰도를 높입니다.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 텍스트 분석기
          </Link>
          로 글자수·단어수·문장수·단락수를 한 번에 확인하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "focus-thieves",
    title: "집중력 도둑 TOP 5와 차단 방법",
    description:
      "SNS 알림, 오픈 오피스, 멀티탭... 우리의 집중력을 훔치는 주범들과 환경 설계로 차단하는 방법.",
    date: "2026-05-13",
    tags: ["집중력", "생산성", "방해요소", "딥워크"],
    thumbnail:
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          칼 뉴포트의 『딥 워크』에 따르면{" "}
          <strong className="text-white">
            진짜 집중 상태(Deep Work)에 진입하는 데 평균 23분
          </strong>
          이 걸립니다. 그리고 방해 요소 하나가 이 사이클을 리셋시킵니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          집중력 도둑 TOP 5
        </h2>
        <div className="space-y-3">
          {[
            [
              "🔔 스마트폰 알림",
              "알림 확인 충동 자체가 집중을 끊음. 해결: 집중 시간엔 무음 + 화면 뒤집기",
              "red",
            ],
            [
              "💬 메신저 (슬랙·카카오)",
              "즉각 응답 문화가 집중 업무 불가능하게 만듦. 해결: 응답 시간대 지정",
              "orange",
            ],
            [
              "🌐 브라우저 탭 과다",
              "'나중에 볼게'로 열어둔 탭들이 인지 부하 유발. 해결: 탭 30개→5개 이하",
              "yellow",
            ],
            [
              "🏢 오픈 오피스",
              "동료 대화 소음이 집중을 방해. 해결: 노이즈 캔슬링 헤드폰 신호 사용",
              "blue",
            ],
            [
              "📋 미결 작업 목록",
              "완료되지 않은 일들이 머릿속에 머물며 자원 소모. 해결: 모든 할 일 외부화(메모)",
              "purple",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-white mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          딥 워크(Deep Work) 구현하기
        </h2>
        <p>
          칼 뉴포트의 딥 워크는 방해 없는 집중 상태로 인지 능력의 한계까지
          밀어붙이는 활동입니다. 4가지 실천 철학이 있습니다.
        </p>
        <div className="space-y-3 mt-4">
          {[
            [
              "수도원식 (Monastic)",
              "SNS 계정 삭제, 이메일 최소화. 극단적 집중. 작가·연구자에 적합",
            ],
            [
              "이중적 (Bimodal)",
              "일정 기간(최소 하루)을 완전한 딥 워크로 할당. 나머지는 일상 처리",
            ],
            [
              "리드미컬 (Rhythmic)",
              "매일 같은 시간에 딥 워크 블록 설정. 가장 현실적인 직장인 방식",
            ],
            [
              "저널리스틱 (Journalistic)",
              "빈 시간이 생길 때마다 즉시 딥 워크 전환. 훈련이 많이 필요",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          집중력 측정 — 나는 얼마나 집중하고 있나?
        </h2>
        <p>
          오늘 하루 <strong className="text-white">진짜 집중한 시간</strong>을
          측정해보세요. 대부분 실제 집중 시간은 2~4시간에 불과합니다. 8시간 근무
          중 6시간은 낮은 강도의 작업과 방해에 소비됩니다.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Toggl Track — 무료 시간 추적 앱. 작업별 집중 시간 기록</li>
          <li>RescueTime — 자동으로 앱 사용 시간 분석. 집중도 점수 제공</li>
          <li>
            종이 방식 — 25분 포모도로 완료 시마다 체크 표시. 하루 몇 개 찍었는지
            확인
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          집중해야 할 일이 여러 개라면{" "}
          <Link to="/" className="text-neon-primary hover:underline">
            SpinFlow 룰렛
          </Link>
          으로 하나만 뽑아 그것만 집중하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "work-hours-calculator",
    title: "근무시간 계산기 활용법: 야근 수당부터 프리랜서 정산까지",
    description:
      "정확한 근무시간 계산이 필요한 모든 상황. 야근 수당, 프리랜서 시급 정산, 프로젝트 일정 관리 방법.",
    date: "2026-05-14",
    tags: ["근무시간", "시간계산", "야근수당", "프리랜서"],
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          야근 수당 계산, 프리랜서 시급 정산, 프로젝트 소요 시간 추적... 정확한
          시간 계산이 필요한 순간에{" "}
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            무료 시간 계산기
          </Link>
          를 활용하세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          야근 수당 계산 방법
        </h2>
        <div className="bg-white/5 p-4 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">근로기준법 기준 (한국)</p>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>
              • 연장근무 (주 40시간 초과): 통상임금의{" "}
              <strong className="text-white">1.5배</strong>
            </li>
            <li>
              • 야간근무 (22시~06시): 통상임금의{" "}
              <strong className="text-white">1.5배</strong>
            </li>
            <li>
              • 휴일근무: 통상임금의{" "}
              <strong className="text-white">1.5배</strong> (8시간 초과 시 2배)
            </li>
            <li>• 중복 적용 가능 — 야간+연장 = 2배</li>
          </ul>
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          프리랜서 시급 정산 공식
        </h2>
        <div className="bg-white/5 p-4 rounded-lg font-mono text-sm text-gray-300">
          정산금액 = 시급 × 총 근무시간
          <br />총 근무시간 = Σ(종료 시간 - 시작 시간 - 휴식)
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          시간 계산이 필요한 상황
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            "💼 야근 수당 계산",
            "🧾 프리랜서 정산",
            "✈️ 비행 시간 계산",
            "⏰ 회의 총 소요시간",
            "📅 프로젝트 일정 관리",
            "🍳 요리 타이머 역산",
          ].map((item, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
              {item}
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/time-calculator"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 시간 계산기
          </Link>
          로 시작·종료 시간을 입력하면 경과 시간을 즉시 계산합니다.
        </p>
      </div>
    ),
  },
  {
    slug: "note-taking-art",
    title: "메모의 기술: 두 번째 뇌 만들기",
    description:
      "좋은 아이디어는 기억에 의존하면 안 됩니다. 코넬 노트, 제텔카스텐, 디지털 노트 시스템 완벽 가이드.",
    date: "2026-05-15",
    tags: ["메모", "노트", "생산성", "지식관리"],
    thumbnail:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          다빈치, 다윈, 에디슨의 공통점은 모두{" "}
          <strong className="text-white">집요한 메모광</strong>이었다는
          것입니다. 뛰어난 기억력이 아니라 뛰어난 메모 시스템이 그들의 창의성을
          만들었습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          대표적인 메모 시스템 3가지
        </h2>
        <div className="space-y-3">
          {[
            [
              "코넬 노트법",
              "페이지를 3구역으로 분할: 핵심 노트(오른쪽) / 질문·키워드(왼쪽) / 요약(하단). 학습·강의 메모에 최적",
            ],
            [
              "제텔카스텐(Zettelkasten)",
              "각 아이디어를 독립 카드로 작성 후 연결고리로 이음. Notion·Obsidian으로 디지털 구현 가능",
            ],
            [
              "GTD 캡처 시스템",
              "머릿속 모든 것을 즉시 외부화. 스마트폰 메모앱에 생각나는 즉시 던져 넣고 나중에 정리",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          좋은 메모의 3원칙
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>즉시 기록</strong> — "나중에 기억하겠지"는 없다. 생각난 순간
            메모
          </li>
          <li>
            <strong>자신의 언어로</strong> — 복사·붙여넣기 금지. 이해한 것만
            기록
          </li>
          <li>
            <strong>연결하기</strong> — 새 메모는 기존 메모와 어떻게 연결되는지
            표시
          </li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          빠른 텍스트 메모는{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            텍스트 도구
          </Link>
          에, 구조화된 문서는{" "}
          <Link
            to="/tools/markdown-previewer"
            className="text-neon-primary hover:underline"
          >
            마크다운 에디터
          </Link>
          에 작성해보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "dice-probability",
    title: "주사위와 확률: 보드게임 뒤에 숨겨진 수학",
    description:
      "주사위 2개를 굴렸을 때 7이 가장 많이 나오는 이유, 크리티컬 확률 계산, 보드게임 전략에 확률을 활용하는 법.",
    date: "2026-05-16",
    tags: ["주사위", "확률", "수학", "보드게임"],
    thumbnail:
      "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          주사위 2개를 굴리면 합이{" "}
          <strong className="text-white">
            7이 나올 확률이 가장 높습니다(6/36 = 16.7%)
          </strong>
          . 이것이 보드게임 '카탄'이 7을 도둑 발동 숫자로 설정한 이유입니다.{" "}
          <Link
            to="/tools/dice-roller"
            className="text-neon-primary hover:underline"
          >
            무료 주사위 굴리기
          </Link>
          로 직접 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          주사위 2개 합 확률 분포
        </h2>
        <div className="space-y-1">
          {[
            ["2", "1/36", "2.8%"],
            ["3", "2/36", "5.6%"],
            ["4", "3/36", "8.3%"],
            ["5", "4/36", "11.1%"],
            ["6", "5/36", "13.9%"],
            ["7", "6/36", "16.7% ← 최고"],
            ["8", "5/36", "13.9%"],
            ["9", "4/36", "11.1%"],
            ["10", "3/36", "8.3%"],
            ["11", "2/36", "5.6%"],
            ["12", "1/36", "2.8%"],
          ].map(([sum, frac, pct], i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="text-neon-primary font-bold font-mono w-6 text-sm">
                {sum}
              </span>
              <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-neon-primary/60 h-full rounded-full"
                  style={{ width: pct.replace(" ← 최고", "") }}
                />
              </div>
              <span className="text-xs text-gray-400 w-28">
                {frac} ({pct})
              </span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          RPG 크리티컬 확률
        </h2>
        <p>
          D20(20면 주사위)에서 20 나올 확률: <strong>5%</strong>. 어드밴티지(2번
          굴려 높은 값): <strong>9.75%</strong> — 약 2배 증가.
        </p>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/dice-roller"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 주사위 굴리기
          </Link>
          로 D4·D6·D8·D10·D12·D20 모두 온라인으로 굴려보세요.
        </p>
      </div>
    ),
  },
  {
    slug: "five-second-rule",
    title: "두려움을 행동으로 전환하는 5초의 법칙",
    description:
      "멜 로빈스의 5초 법칙: 하고 싶은 것이 생기면 5초 안에 시작하지 않으면 뇌가 방해합니다. 과학적 근거와 실천법.",
    date: "2026-05-17",
    tags: ["행동력", "습관", "동기부여", "심리학"],
    thumbnail:
      "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          멜 로빈스(Mel Robbins)의 발견:{" "}
          <strong className="text-white">
            행동 충동이 생긴 후 5초 안에 움직이지 않으면 뇌가 그 충동을 차단
          </strong>
          합니다. 5-4-3-2-1 카운트다운 후 즉시 행동하는 것이 핵심입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">왜 5초인가?</h2>
        <p>
          인간의 뇌는 변화를 위협으로 인식합니다. 행동 충동이 생기면 전전두엽이
          이유를 찾아 막으려 합니다. 5초 카운트다운은 이{" "}
          <strong>인지적 방해</strong>가 개입하기 전에 신체를 먼저 움직이게 하는
          전략입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          5초 법칙 적용 상황
        </h2>
        <div className="space-y-3">
          {[
            ["운동 시작", "알람이 울릴 때 5-4-3-2-1 하고 이불을 걷어차기"],
            ["어색한 대화 시작", "모임에서 말 걸고 싶을 때 5초 안에 첫 마디"],
            [
              "중요한 이메일 발송",
              "완벽하게 쓰려다 미루는 이메일을 5초 후 전송",
            ],
            ["아이디어 기록", "떠오른 아이디어를 5초 안에 메모앱 열어 적기"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          지금 무언가 해야 할 것이 있다면: 5 — 4 — 3 — 2 — 1 — 시작. 망설임이
          느껴진다면{" "}
          <Link
            to="/tools/yes-no-oracle"
            className="text-neon-primary hover:underline"
          >
            예스/노 신탁기
          </Link>
          로 결정하고 5초 안에 움직이세요.
        </p>
      </div>
    ),
  },
  {
    slug: "url-shortener-tech",
    title: "URL 단축기의 원리: 짧은 링크 뒤에 숨겨진 기술",
    description:
      "bit.ly, tinyurl... 긴 URL이 짧아지는 원리, 리다이렉트 동작 방식, 단축 URL의 보안 위험까지 알아봅니다.",
    date: "2026-05-18",
    tags: ["URL단축", "웹기술", "리다이렉트", "보안"],
    thumbnail:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          <code className="bg-white/10 px-1 rounded">
            https://bit.ly/3xKpQm2
          </code>
          를 클릭하면 어떻게 긴 원본 URL로 이동할까요? 그 뒤에는{" "}
          <strong className="text-white">HTTP 리다이렉트</strong>와 데이터베이스
          조회가 숨어있습니다. SpinFlow의{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            도구 모음
          </Link>
          에서 URL 관련 도구를 확인해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          URL 단축의 동작 원리
        </h2>
        <div className="space-y-2">
          {[
            [
              "1. 원본 URL 저장",
              "서버 DB에 긴 URL과 짧은 코드(예: 3xKpQm2)를 매핑하여 저장",
            ],
            [
              "2. 짧은 URL 생성",
              "Base62(A-Z,a-z,0-9) 인코딩으로 고유한 짧은 코드 생성",
            ],
            [
              "3. 리다이렉트 처리",
              "사용자가 짧은 URL 접속 → 서버가 DB 조회 → 301/302 응답으로 원본 URL로 전송",
            ],
            [
              "4. 통계 수집",
              "클릭 수·지역·기기 정보를 기록하여 링크 분석 제공",
            ],
          ].map(([t, d], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="bg-neon-primary text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-white font-bold">{t}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          단축 URL 보안 주의사항
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>목적지를 알 수 없어 피싱·악성코드 링크로 악용될 수 있음</li>
          <li>
            클릭 전 <strong>URL 미리보기 서비스</strong>(예: CheckShortURL.com)
            활용
          </li>
          <li>메일·문자로 받은 단축 URL은 발신자 확인 후 클릭</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          긴 URL을 다루거나 인코딩이 필요하다면{" "}
          <Link
            to="/tools/uri-encoder"
            className="text-neon-primary hover:underline"
          >
            SpinFlow URL 인코더
          </Link>
          를 활용하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "google-calendar-tips",
    title: "구글 캘린더 100% 활용법: 시간을 설계하는 방법",
    description:
      "단순한 일정 관리를 넘어 타임 블로킹, 색상 코딩, 반복 일정, 팀 캘린더까지. 구글 캘린더 고수의 사용법.",
    date: "2026-05-19",
    tags: ["구글캘린더", "시간관리", "생산성", "타임블로킹"],
    thumbnail:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          대부분은 구글 캘린더를 <strong>회의 알림 도구</strong>로만 씁니다.
          하지만 타임 블로킹과 색상 코딩을 활용하면{" "}
          <strong className="text-white">하루를 미리 설계하는 도구</strong>가
          됩니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          고수의 구글 캘린더 사용법
        </h2>
        <div className="space-y-3">
          {[
            [
              "🎨 색상 코딩",
              "업무=파랑, 개인=초록, 건강=빨강, 학습=보라 — 한눈에 시간 배분 파악",
            ],
            [
              "⏱️ 타임 블로킹",
              "빈 시간을 '집중 작업', '이메일 확인', '점심' 등으로 채워 하루를 설계",
            ],
            [
              "🔁 반복 일정",
              "매주 월요일 주간 계획, 매일 오전 9시 루틴 점검 — 자동화로 일관성 유지",
            ],
            [
              "🔒 집중 시간 차단",
              "'Deep Work' 블록으로 회의 요청 거절 신호 — 동료가 볼 수 있게 설정",
            ],
            [
              "📅 D-Day 캘린더",
              "프로젝트 마감·시험일을 별도 캘린더로 분리해 진행 상황 시각화",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          일정 중 D-Day 관리는{" "}
          <Link
            to="/tools/d-day-counter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow D-Day 카운터
          </Link>
          와 병행하면 마감 긴장감을 유지할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "image-format-guide",
    title: "이미지 포맷 완벽 가이드: JPG vs PNG vs WebP vs AVIF",
    description:
      "언제 JPG를 쓰고 언제 PNG를 써야 하나? 웹 성능을 위한 최신 이미지 포맷 선택 기준 완벽 정리.",
    date: "2026-05-20",
    tags: ["이미지포맷", "WebP", "PNG", "웹성능"],
    thumbnail:
      "https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          이미지 포맷 선택 하나가 웹페이지 로딩 속도를{" "}
          <strong className="text-white">2~3배</strong> 차이나게 만들 수
          있습니다. 상황별 최적 포맷을 알아봅니다.{" "}
          <Link
            to="/tools/css-shadow-generator"
            className="text-neon-primary hover:underline"
          >
            CSS 도구
          </Link>
          와 함께 UI를 최적화해보세요.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          포맷별 특성 비교
        </h2>
        <div className="space-y-3">
          {[
            [
              "JPG/JPEG",
              "손실 압축. 파일 크기 작음. 투명도 없음.",
              "사진, 배경이미지, 썸네일",
            ],
            [
              "PNG",
              "무손실 압축. 투명도(Alpha) 지원. 파일 크기 큼.",
              "로고, 아이콘, 스크린샷, 투명 배경",
            ],
            [
              "WebP",
              "JPG 대비 25~34% 작은 크기. 투명도 지원. 구형 브라우저 미지원.",
              "모던 웹 전반 — Chrome·Firefox·Safari 지원",
            ],
            [
              "AVIF",
              "WebP 대비 추가 50% 압축. 최신 브라우저만 지원.",
              "고화질 이미지가 많은 사이트 (지원 브라우저 확인 필수)",
            ],
            [
              "SVG",
              "벡터 — 확대해도 깨지지 않음. 코드로 구성됨.",
              "로고, 아이콘, 일러스트레이션",
            ],
          ].map(([format, desc, use], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary font-mono mb-1">
                {format}
              </p>
              <p className="text-sm text-gray-300 mb-1">{desc}</p>
              <p className="text-xs text-gray-500">📌 {use}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          2025년 기준 신규 웹 프로젝트는 <strong>WebP를 기본</strong>으로
          사용하고, 구형 브라우저 대응이 필요하면 JPG 폴백을 설정하는 것이
          권장됩니다.
        </p>
      </div>
    ),
  },
  {
    slug: "ai-era-skills",
    title: "AI 시대에 살아남는 스킬: 대체되지 않는 능력 5가지",
    description:
      "ChatGPT가 할 수 없는 것은 무엇인가. AI 시대에 오히려 더 가치가 높아지는 인간 고유의 능력.",
    date: "2026-05-21",
    tags: ["AI", "미래직업", "스킬", "자기계발"],
    thumbnail:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          AI가 코드를 짜고, 글을 쓰고, 이미지를 생성하는 시대. 그렇다면{" "}
          <strong className="text-white">인간만이 할 수 있는 것</strong>은
          무엇일까요? 역설적으로 AI의 발전이 특정 인간 능력의 가치를 높이고
          있습니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          AI가 대체하기 어려운 5가지 능력
        </h2>
        <div className="space-y-3">
          {[
            [
              "🤝 관계 구축·공감",
              "신뢰는 인간 대 인간 상호작용에서 형성됩니다. AI는 흉내 낼 수 있어도 진짜 관계를 만들지 못함",
            ],
            [
              "🎯 질문하는 능력",
              "AI는 좋은 답을 내지만 좋은 질문은 인간이 해야 합니다. 프롬프트 엔지니어링이 핵심 스킬이 된 이유",
            ],
            [
              "⚖️ 윤리적 판단",
              "맥락·이해관계·가치관을 고려한 복잡한 도덕적 결정은 AI가 대리할 수 없음",
            ],
            [
              "🔗 도메인 간 연결",
              "서로 다른 분야의 지식을 창의적으로 연결하는 것은 여전히 인간의 강점",
            ],
            [
              "🗣️ 설득과 영향력",
              "청중의 감정·문화·맥락을 읽고 메시지를 조율하는 능력 — 리더십의 핵심",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          AI가 빠르게 대체하는 직무 vs 강화하는 직무
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              title: "⚠️ 주의 필요",
              color: "border-red-500/30 bg-red-500/5",
              textColor: "text-red-400",
              items: [
                "단순 데이터 입력·정리",
                "기본 번역·교정",
                "표준 보고서 작성",
                "반복적 코드 생성",
                "이미지 편집·리터치",
              ],
            },
            {
              title: "💪 더 가치 상승",
              color: "border-green-500/30 bg-green-500/5",
              textColor: "text-green-400",
              items: [
                "AI 프롬프트 설계",
                "전략적 의사결정",
                "복잡한 협상·영업",
                "창의적 방향 설정",
                "인간 중심 서비스",
              ],
            },
          ].map((card, i) => (
            <div key={i} className={`border ${card.color} p-4 rounded-lg`}>
              <p className={`font-bold ${card.textColor} mb-3`}>{card.title}</p>
              <ul className="space-y-1">
                {card.items.map((item, j) => (
                  <li key={j} className="text-xs text-gray-400 flex gap-2">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          지금 당장 시작할 수 있는 AI 활용법
        </h2>
        <div className="space-y-2">
          {[
            [
              "ChatGPT/Claude",
              "초안 작성 → 본인이 편집·발전. AI를 조수로, 자신이 편집장으로",
            ],
            [
              "GitHub Copilot",
              "반복 코드 자동완성. 아낀 시간을 아키텍처 설계에 투자",
            ],
            ["Notion AI", "회의록 요약, 문서 구조화. 정보 관리 시간 70% 절감"],
            [
              "Midjourney/DALL-E",
              "레퍼런스 이미지 빠른 생성. 디자이너와 협업 속도 향상",
            ],
          ].map(([tool, use], i) => (
            <div
              key={i}
              className="flex gap-3 items-start bg-white/5 p-3 rounded-lg"
            >
              <span className="text-neon-primary font-bold font-mono text-sm min-w-[120px]">
                {tool}
              </span>
              <span className="text-sm text-gray-400">{use}</span>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          AI 도구를 활용해 반복 업무를 줄이고, 위의 5가지 능력에 시간을
          투자하세요.{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 도구 모음
          </Link>
          도 단순 반복 작업을 줄이는 데 도움이 됩니다.
        </p>
      </div>
    ),
  },
  {
    slug: "text-formatting-situations",
    title: "텍스트 변환이 필요한 의외의 상황 7가지",
    description:
      "대소문자 변환, 특수문자 제거, 줄바꿈 정리... 텍스트를 정제하고 변환해야 하는 실무 상황 완벽 정리.",
    date: "2026-05-22",
    tags: ["텍스트변환", "텍스트처리", "개발", "문서"],
    thumbnail:
      "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          엑셀에서 복사한 데이터, 이메일로 받은 텍스트... 형식이 뒤죽박죽일 때{" "}
          <Link
            to="/tools/case-converter"
            className="text-neon-primary hover:underline"
          >
            케이스 변환기
          </Link>
          와{" "}
          <Link
            to="/tools/text-counter"
            className="text-neon-primary hover:underline"
          >
            텍스트 분석기
          </Link>
          가 즉시 해결해줍니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          텍스트 변환이 필요한 7가지 상황
        </h2>
        <div className="space-y-3">
          {[
            [
              "데이터베이스 컬럼명 변환",
              "기획서의 '사용자 이름' → DB 컬럼 user_name(snake_case)으로 일괄 변환",
            ],
            [
              "API 응답 필드명 변환",
              "백엔드 snake_case → 프론트엔드 camelCase 변환 작업",
            ],
            ["제목 통일", "혼재된 대소문자 제목을 Title Case로 일괄 정리"],
            [
              "코드 복사 후 정리",
              "PDF에서 복사한 코드의 이상한 따옴표·하이픈을 정상 문자로 교체",
            ],
            [
              "엑셀 데이터 정제",
              "전화번호·이메일 주소의 공백·특수문자 일괄 제거",
            ],
            [
              "URL 슬러그 생성",
              "'블로그 포스트 제목' → 'blog-post-title' kebab-case 변환",
            ],
            [
              "다국어 키값 생성",
              "'환영합니다' → 'welcomeMessage' 키값으로 변환",
            ],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1 text-sm">{t}</p>
              <p className="text-xs text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          <Link
            to="/tools/case-converter"
            className="text-neon-primary hover:underline"
          >
            SpinFlow 케이스 변환기
          </Link>
          로 camelCase·snake_case·PascalCase·UPPER_CASE 간 변환을 클릭 한 번으로
          해결하세요.
        </p>
      </div>
    ),
  },
  {
    slug: "digital-nomad-tools",
    title: "디지털 노마드의 생산성 도구 모음: 어디서든 일하는 법",
    description:
      "카페·공유오피스·해외 어디서든 최고의 생산성을 유지하는 디지털 노마드들의 필수 도구와 루틴.",
    date: "2026-05-23",
    tags: ["디지털노마드", "생산성", "원격근무", "도구"],
    thumbnail:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          장소에 상관없이 일하는 디지털 노마드에게{" "}
          <strong className="text-white">도구 선택이 곧 생산성</strong>입니다.
          설치 없이 브라우저에서 쓰는 도구가 이동 중 특히 유용합니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          카테고리별 필수 도구
        </h2>
        <div className="space-y-3">
          {[
            [
              "📡 통신·협업",
              "Slack, Notion, Loom (비동기 영상 메시지), Google Meet",
            ],
            [
              "⏰ 시간대 관리",
              "World Time Buddy — 다른 나라 팀원과 미팅 시간 조율 필수",
            ],
            [
              "🔐 보안",
              "1Password (비밀번호 관리) + VPN — 공개 와이파이에서 보안 필수",
            ],
            [
              "💻 브라우저 도구",
              "SpinFlow 같은 설치 불필요 온라인 도구 모음 북마크",
            ],
            ["💰 정산·인보이스", "Wave (무료 회계), Notion 인보이스 템플릿"],
          ].map(([t, d], i) => (
            <div key={i} className="bg-white/5 p-4 rounded-lg">
              <p className="font-bold text-neon-primary mb-1">{t}</p>
              <p className="text-sm text-gray-400">{d}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          장소 이동 시 필수 체크리스트
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>모든 작업 클라우드 저장 확인</li>
          <li>VPN 활성화</li>
          <li>다음 미팅 시간대 확인 (현지 시간 기준)</li>
          <li>배터리·충전기 상태 점검</li>
        </ul>
        <hr className="border-white/10 my-8" />
        <p>
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 도구 모음
          </Link>
          을 북마크해두세요. JSON 포맷, Base64, URL 인코딩, 색상 변환 등 24개
          도구를 설치 없이 어디서든 사용할 수 있습니다.
        </p>
      </div>
    ),
  },
  {
    slug: "calculator-vs-excel",
    title: "온라인 계산기 vs 엑셀: 언제 무엇을 써야 하나",
    description:
      "간단한 계산에 엑셀을 여는 것은 낭비입니다. 상황별로 온라인 계산기와 스프레드시트를 현명하게 선택하는 기준.",
    date: "2026-05-24",
    tags: ["계산기", "엑셀", "생산성", "도구선택"],
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2670&auto=format&fit=crop",
    content: (
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p>
          퍼센트 계산 하나에 엑셀을 열고, BMI 계산하려고 앱을 설치하는 건
          과잉입니다.{" "}
          <strong className="text-white">도구는 작업 복잡도에 맞게</strong>{" "}
          선택해야 합니다.{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 도구 모음
          </Link>
          이 빠른 계산에 최적입니다.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">선택 기준</h2>
        <div className="space-y-3">
          {[
            [
              "온라인 계산기가 나은 경우",
              [
                "단일 계산 (BMI, 나이, 퍼센트)",
                "빠른 단위 변환",
                "형식 변환 (Base64, URL인코딩)",
                "반복 불필요한 1회성 계산",
              ],
            ],
            [
              "엑셀/스프레드시트가 나은 경우",
              [
                "100개 이상 데이터 일괄 처리",
                "결과를 공유·저장해야 할 때",
                "차트·그래프가 필요할 때",
                "복잡한 조건부 수식이 필요할 때",
              ],
            ],
          ].map(([title, items], i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${i === 0 ? "bg-neon-primary/5 border-neon-primary/20" : "bg-white/5 border-white/10"}`}
            >
              <p
                className={`font-bold mb-2 text-sm ${i === 0 ? "text-neon-primary" : "text-white"}`}
              >
                {title}
              </p>
              <ul className="space-y-1">
                {(items as string[]).map((item, j) => (
                  <li key={j} className="text-xs text-gray-400 flex gap-2">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">
          SpinFlow로 빠르게 해결할 수 있는 계산
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ["🧮 퍼센트 계산", "/tools/percentage-calculator"],
            ["⚖️ BMI 계산", "/tools/bmi-calculator"],
            ["📅 나이 계산", "/tools/age-calculator"],
            ["⏱️ 시간 계산", "/tools/time-calculator"],
            ["📐 단위 변환", "/tools/unit-converter"],
            ["🎂 D-Day", "/tools/d-day-counter"],
          ].map(([label, path], i) => (
            <Link
              key={i}
              to={path}
              className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors block"
            >
              {label}
            </Link>
          ))}
        </div>
        <hr className="border-white/10 my-8" />
        <p>
          도구는 목적에 맞게 사용할 때 가장 강력합니다.{" "}
          <Link to="/tools" className="text-neon-primary hover:underline">
            SpinFlow 전체 도구 목록
          </Link>
          을 북마크하고 필요할 때마다 꺼내 쓰세요.
        </p>
      </div>
    ),
  },
];

export const BLOG_POSTS: BlogPost[] = [
  ...CURATED_BLOG_POSTS,
];
