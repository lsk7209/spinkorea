/**
 * Component: SEOArticle
 * SEO를 위한 하단 텍스트 섹션
 * 초기 렌더링에 포함되어야 함
 */

export default function SEOArticle() {
  return (
    <article className="w-full max-w-4xl mx-auto px-4 py-16 pb-32 text-neon-primary/80">
      <h1 className="text-3xl font-bold text-neon-primary mb-6">
        SpinFlow - 공정한 결정 룰렛
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
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
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
          공정성 및 알고리즘
        </h2>
        <p className="mb-4">
          SpinFlow는 암호학적으로 안전한 난수 생성기를 사용합니다.
          브라우저의 crypto.getRandomValues() API를 활용하여 예측 불가능한 진정한 난수를 생성하며,
          모듈로 연산으로 인한 편향을 제거하기 위해 rejection sampling 방식을 사용합니다.
        </p>
        <p className="mb-4">
          각 항목은 동일한 확률로 선택되며, 룰렛의 각 섹터는 정확히 동일한 크기로 구성됩니다.
          스핀 애니메이션은 최소 3바퀴 이상 회전하며, 물리 기반 감속을 통해 자연스러운 멈춤 효과를 제공합니다.
        </p>
        <p>
          모든 난수 생성 과정은 서버 없이 클라이언트에서만 처리되므로,
          개인정보나 데이터가 외부로 전송되지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
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
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
          자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-neon-primary mb-2">
              항목은 몇 개까지 입력할 수 있나요?
            </h3>
            <p>
              최대 100개까지 입력 가능하며, 각 항목은 최대 50자까지 입력할 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neon-primary mb-2">
              결과는 어떻게 저장되나요?
            </h3>
            <p>
              룰렛 상태는 URL에 압축되어 저장되며, 브라우저의 localStorage에도 저장됩니다.
              링크를 공유하면 다른 사람도 동일한 룰렛을 볼 수 있습니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neon-primary mb-2">
              정말 공정한가요?
            </h3>
            <p>
              네, crypto.getRandomValues()를 사용하여 암호학적으로 안전한 난수를 생성하며,
              모듈로 편향을 제거하기 위한 알고리즘을 적용합니다.
              각 항목은 정확히 동일한 확률로 선택됩니다.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neon-primary mb-2">
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
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
          왜 SpinFlow인가?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold text-white mb-2">🔒 100% 프라이버시</h3>
            <p className="text-sm text-gray-400">
              모든 데이터는 브라우저에서만 처리됩니다. 서버에 어떤 정보도 전송되지 않습니다.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold text-white mb-2">⚡ 설치 불필요</h3>
            <p className="text-sm text-gray-400">
              앱 설치 없이 웹 브라우저에서 바로 사용하세요. 모든 기기에서 접속 가능합니다.
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold text-white mb-2">🔗 쉬운 공유</h3>
            <p className="text-sm text-gray-400">
              URL 하나로 룰렛 설정을 공유하세요. 그룹 결정에 완벽한 솔루션입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
          더 많은 유틸리티 도구
        </h2>
        <p className="mb-4">
          SpinFlow는 룰렛 외에도 다양한 무료 온라인 도구를 제공합니다.
          로또 번호 생성기, 비밀번호 생성기, 글자수 세기, BMI 계산기 등
          일상에서 자주 사용하는 도구들을 한 곳에서 이용하세요.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/tools/lotto-generator" className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors text-center">
            <span className="block text-lg mb-1">🎱</span>
            <span className="text-sm">로또 번호</span>
          </a>
          <a href="/tools/random-password" className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors text-center">
            <span className="block text-lg mb-1">🔐</span>
            <span className="text-sm">비밀번호 생성</span>
          </a>
          <a href="/tools/text-counter" className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors text-center">
            <span className="block text-lg mb-1">📝</span>
            <span className="text-sm">글자수 세기</span>
          </a>
          <a href="/tools/bmi-calculator" className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors text-center">
            <span className="block text-lg mb-1">⚖️</span>
            <span className="text-sm">BMI 계산기</span>
          </a>
        </div>
        <p className="mt-4 text-center">
          <a href="/tools" className="text-neon-primary hover:underline">
            전체 도구 보기 →
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-neon-primary mb-4">
          블로그에서 더 알아보기
        </h2>
        <p className="mb-4">
          결정 장애 극복법, 시간 관리 팁, 비밀번호 보안 가이드 등
          일상에 도움이 되는 다양한 콘텐츠를 블로그에서 확인하세요.
        </p>
        <div className="space-y-3">
          <a href="/blog/overcome-decision-fatigue" className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors">
            <h3 className="font-bold text-white">결정 장애(Decision Fatigue)를 극복하는 3가지 과학적인 방법</h3>
            <p className="text-sm text-gray-400 mt-1">뇌 과학이 알려주는 스트레스 없는 결정법</p>
          </a>
          <a href="/blog/random-choice-psychology" className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:border-neon-primary/50 transition-colors">
            <h3 className="font-bold text-white">랜덤 선택의 심리학: 왜 우리는 결정을 위임하고 싶어하는가</h3>
            <p className="text-sm text-gray-400 mt-1">심리학적 관점에서 랜덤 선택의 본질 탐구</p>
          </a>
        </div>
        <p className="mt-4 text-center">
          <a href="/blog" className="text-neon-primary hover:underline">
            블로그 전체 보기 →
          </a>
        </p>
      </section>
    </article>
  );
}

