
export default function RandomNumberArticle() {
    return (
        <article className="w-full max-w-4xl mx-auto px-4 py-16 text-neon-primary/80">
            <h1 className="text-3xl font-bold text-neon-primary mb-6">
                랜덤 번호 생성기: 로또부터 이벤트 추첨까지
            </h1>

            {/* AEO/GEO Optimized Summary Block */}
            <div className="bg-white/5 border border-neon-primary/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-3">⚡ 3줄 요약</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong>브라우저 난수:</strong> Crypto API 기반으로 입력한 범위 안에서 결과를 선택합니다.</li>
                    <li><strong>다양한 활용:</strong> 로또 번호 조합, 이벤트 후보 선택, 순서 정하기처럼 기준을 먼저 합의할 수 있는 상황에 활용할 수 있습니다.</li>
                    <li><strong>간편한 설정:</strong> 원하는 숫자 범위를 설정하거나 템플릿을 사용하여 즉시 추첨을 시작할 수 있습니다.</li>
                </ul>
            </div>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    브라우저 난수로 선택 과정 정리
                </h2>
                <p className="mb-4 leading-relaxed">
                    SpinFlow의 <strong>랜덤 번호 생성기</strong>는 단순한 재미를 넘어,
                    입력한 범위에서 숫자를 빠르게 선택하고, 참여자와 결과를 확인하기 쉽게 정리하는 도구입니다.
                    브라우저의 Crypto API 기반 난수를 사용하지만, 이 설명만으로 공식 추첨 절차나 감사 기록이 만들어지는 것은 아닙니다.
                </p>
                <p className="mb-4 leading-relaxed">
                    이벤트 당첨자 추첨, 로또 번호 조합, 순서 정하기 등
                    후보와 재실행 기준을 먼저 합의할 수 있는 상황에 사용하세요.
                    결과는 브라우저에서 생성되지만 화면 캡처만으로 공식 추첨이나 결과 조작 여부가 입증되는 것은 아니므로, 중요한 행사는 별도의 운영 기록을 남겨야 합니다.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    다양한 활용 방법
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🎰 로또 번호 추첨</h3>
                        <p className="text-sm">
                            1부터 45까지의 숫자 중 6개를 뽑아야 하시나요?
                            SpinFlow 템플릿을 사용하여 1부터 45까지 6개 번호 형식의 조합을 만들어보세요.
                            생성 결과는 조합을 준비하는 참고 자료이며 당첨 확률이나 당첨을 보장하지 않습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🎁 이벤트 당첨자 선정</h3>
                        <p className="text-sm">
                            인스타그램, 블로그 이벤트 진행 시 당첨자를 뽑을 때 유용합니다.
                            참여자 명단을 넣고 돌리기만 하면 끝!
                            결과 화면과 실행 시각을 함께 기록하면 참여자에게 선택 과정을 설명하기 쉽습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🔢 발표 순서 정하기</h3>
                        <p className="text-sm">
                            "가위바위보로 정하자"는 이제 그만.
                            1번부터 N번까지 숫자를 넣고 룰렛을 돌려보세요.
                            후보와 재실행 규칙을 먼저 합의하면 순서 정하기 과정을 설명하기 쉬워집니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🎲 보드게임 & TRPG</h3>
                        <p className="text-sm">
                            주사위가 없거나 특별한 범위의 난수가 필요할 때 활용하세요.
                            1-6 주사위 뿐만 아니라 1-20, 1-100 등 원하는 범위 설정을
                            항목 입력을 통해 자유롭게 구현할 수 있습니다.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    자주 묻는 질문 (FAQ)
                </h2>
                <div className="space-y-4">
                    <details className="group bg-neon-card rounded-lg border border-neon-primary/20 p-4 open:bg-neon-primary/5 transition-all">
                        <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                            <span>Q. 정말 무작위인가요? 패턴이 있지는 않나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            SpinFlow는 브라우저의 `crypto.getRandomValues()` 기반 난수를 사용합니다.
                            결과를 사람이 정한 패턴으로 고르는 기능은 없지만, 중요한 추첨에는 주최자의 별도 검증·기록 절차가 필요합니다.
                        </p>
                    </details>
                    <details className="group bg-neon-card rounded-lg border border-neon-primary/20 p-4 open:bg-neon-primary/5 transition-all">
                        <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                            <span>Q. 중복 없이 숫자를 뽑을 수 있나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            현재 룰렛 방식은 독립 시행이므로 중복이 나올 수 있습니다.
                            하지만 룰렛에서 당첨된 항목을 '항목 수정'에서 지우고 다시 돌리면
                            비복원 추출(중복 없는 뽑기)과 동일한 효과를 낼 수 있습니다.
                        </p>
                    </details>
                </div>
            </section>

            <div className="mt-8 text-center bg-neon-primary/10 p-6 rounded-2xl border border-neon-primary/30">
                <h3 className="text-lg font-bold text-white mb-2">행운을 시험해볼 준비가 되셨나요?</h3>
                <p className="text-sm">
                    지금 바로 스핀 버튼을 눌러 행운의 숫자를 확인하세요.<br />
                    결과는 가벼운 참고로 확인하고, 중요한 선택은 필요한 정보와 담당자의 판단을 함께 사용하세요.
                </p>
            </div>
        </article>
    );
}
