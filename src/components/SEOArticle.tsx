/**
 * Component: SEOArticle
 * SEO를 위한 하단 텍스트 섹션
 * 초기 렌더링에 포함되어야 함
 */

export default function SEOArticle() {
  return (
    <article className="w-full max-w-5xl mx-auto px-4 py-16 pb-32 text-slate-700">
      <h2 className="text-3xl font-bold text-slate-950 mb-6">
        SpinFlow - 공정한 결정 룰렛
      </h2>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          사용 방법
        </h2>
        <p className="mb-4">
          SpinFlow는 공정한 난수 생성 알고리즘을 사용하여 결정을 도와주는 룰렛 웹 애플리케이션입니다.
          항목을 입력하고 SPIN 버튼을 클릭하면 룰렛이 회전하며 무작위로 하나의 항목을 선택합니다.
        </p>
        <p className="mb-4">
          데스크톱에서는 화면 우측의 텍스트 영역에서 항목을 편집할 수 있으며,
          모바일에서는 "항목 수정하기" 버튼을 통해 전체화면 모달에서 편집할 수 있습니다.
          한 줄에 하나의 항목을 입력하면 되며, 최대 100개까지 입력 가능합니다.
        </p>
        <p>
          룰렛 결과는 URL에 자동으로 저장되며, 링크를 공유하면 다른 사람도 동일한 룰렛을 볼 수 있습니다.
          또한 최근 결과는 5분간 표시되어 이전 결과를 확인할 수 있습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          공정성 및 알고리즘
        </h2>
        <p className="mb-4">
          SpinFlow는 브라우저가 제공하는 보안 난수 생성 기능을 사용합니다.
          crypto.getRandomValues() API를 활용해 결과를 선택하며,
          모듈로 연산으로 인한 편향을 제거하기 위해 rejection sampling 방식을 사용합니다.
        </p>
        <p className="mb-4">
          동일한 항목을 중복 입력하지 않았고 각 항목이 같은 크기의 섹터로 표시되는 경우 항목별 선택 기회가 같도록 계산됩니다.
          스핀 애니메이션은 결과를 보여주는 시각적 과정이며, 중요한 추첨에는 별도의 운영 기준과 기록이 필요합니다.
        </p>
        <p>
          룰렛의 항목 선택과 결과 계산은 브라우저에서 처리됩니다.
          다만 방문 분석, 광고, 사용자가 직접 공유한 URL과 같은 별도 데이터 흐름은 개인정보처리방침을 확인해야 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          활용 사례
        </h2>
        <p className="mb-4">
          SpinFlow는 다양한 상황에서 유용하게 사용할 수 있습니다.
          점심 메뉴를 정할 때, 팀 회의에서 발표자를 뽑을 때, 게임에서 벌칙을 정할 때,
          또는 단순히 무작위 선택이 필요한 모든 상황에서 활용하세요.
        </p>
        <p className="mb-4">
          직장인들은 팀 점심 메뉴 결정에, 교사들은 수업에서 발표자 선택에,
          인플루언서들은 콘텐츠 아이디어 선택에 활용할 수 있습니다.
        </p>
        <p>
          URL을 공유하면 다른 사람도 동일한 룰렛을 사용할 수 있어,
          그룹 결정을 내릴 때 특히 유용합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              항목은 몇 개까지 입력할 수 있나요?
            </h3>
            <p>
              최대 100개까지 입력 가능하며, 각 항목은 최대 50자까지 입력할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              결과는 어떻게 저장되나요?
            </h3>
            <p>
              룰렛 상태는 URL에 압축되어 저장되며, 브라우저의 localStorage에도 저장됩니다.
              링크를 공유하면 다른 사람도 동일한 룰렛을 볼 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              정말 공정한가요?
            </h3>
            <p>
              crypto.getRandomValues()를 사용하여 결과를 선택하며,
              모듈로 편향을 줄이는 알고리즘을 적용합니다.
              입력 항목을 동일한 단위로 구성하면 각 항목을 같은 선택 공간에서 다룰 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              모바일에서도 사용할 수 있나요?
            </h3>
            <p>
              네, 모바일 우선으로 설계되었으며, 반응형 레이아웃으로 모든 기기에서 최적의 경험을 제공합니다.
              모바일에서는 전체화면 모달을 통해 항목을 편집할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          왜 SpinFlow인가?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-950 mb-2">🔒 100% 프라이버시</h3>
            <p className="text-sm text-slate-600">
              룰렛 항목과 결과 선택은 브라우저에서 처리됩니다. 분석·광고 설정과 사용자가 직접 공유하는 정보는 별도로 확인해야 합니다.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-950 mb-2">⚡ 설치 불필요</h3>
            <p className="text-sm text-slate-600">
              앱 설치 없이 웹 브라우저에서 바로 사용하세요. 모든 기기에서 접속 가능합니다.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-950 mb-2">🔗 쉬운 공유</h3>
            <p className="text-sm text-slate-600">
              URL 하나로 룰렛 설정을 공유하세요. 그룹 결정에 완벽한 솔루션입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          더 많은 유틸리티 도구
        </h2>
        <p className="mb-4">
          SpinFlow는 룰렛 외에도 다양한 무료 온라인 도구를 제공합니다.
          연봉 실수령액·시급·대출·복리 계산기, 로또 번호 생성기, 글자수 세기 등
          일상에서 자주 사용하는 도구들을 한 곳에서 이용하세요.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/tools/net-salary" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">💵</span>
            <span className="text-sm">연봉 실수령액</span>
          </a>
          <a href="/tools/hourly-wage" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">💰</span>
            <span className="text-sm">시급 계산기</span>
          </a>
          <a href="/tools/loan-calculator" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">🏦</span>
            <span className="text-sm">대출 계산기</span>
          </a>
          <a href="/tools/compound-interest" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">📈</span>
            <span className="text-sm">복리 계산기</span>
          </a>
          <a href="/tools/lotto-generator" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">🎱</span>
            <span className="text-sm">로또 번호</span>
          </a>
          <a href="/tools/random-password" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">🔐</span>
            <span className="text-sm">비밀번호 생성</span>
          </a>
          <a href="/tools/text-counter" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">📝</span>
            <span className="text-sm">글자수 세기</span>
          </a>
          <a href="/tools/bmi-calculator" className="p-3 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors text-center shadow-sm">
            <span className="block text-lg mb-1">⚖️</span>
            <span className="text-sm">BMI 계산기</span>
          </a>
        </div>
        <p className="mt-4 text-center">
          <a href="/tools" className="text-cyan-700 font-semibold hover:underline">
            전체 도구 보기 →
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-950 mb-4">
          블로그에서 더 알아보기
        </h2>
        <p className="mb-4">
          결정 장애 극복법, 시간 관리 팁, 비밀번호 보안 가이드 등
          일상에 도움이 되는 다양한 콘텐츠를 블로그에서 확인하세요.
        </p>
        <div className="space-y-3">
          <a href="/blog/overcome-decision-fatigue" className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors shadow-sm">
            <h3 className="font-bold text-slate-950">결정 장애(Decision Fatigue)를 극복하는 3가지 과학적인 방법</h3>
            <p className="text-sm text-slate-600 mt-1">뇌 과학이 알려주는 스트레스 없는 결정법</p>
          </a>
          <a href="/blog/random-choice-psychology" className="block p-4 bg-white border border-slate-200 rounded-lg hover:border-cyan-500 transition-colors shadow-sm">
            <h3 className="font-bold text-slate-950">랜덤 선택의 심리학: 왜 우리는 결정을 위임하고 싶어하는가</h3>
            <p className="text-sm text-slate-600 mt-1">심리학적 관점에서 랜덤 선택의 본질 탐구</p>
          </a>
        </div>
        <p className="mt-4 text-center">
          <a href="/blog" className="text-cyan-700 font-semibold hover:underline">
            블로그 전체 보기 →
          </a>
        </p>
      </section>
    </article>
  );
}

