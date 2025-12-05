
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
                    <li><strong>강력한 보안:</strong> 브라우저의 암호화된 기술(Crypto API)을 사용하여 예측 불가능한 난수를 생성합니다.</li>
                    <li><strong>다양한 활용:</strong> 로또 번호 추출, 이벤트 당첨자 선정, 순서 정하기 등 공정성이 필요한 모든 곳에 적합합니다.</li>
                    <li><strong>간편한 설정:</strong> 원하는 숫자 범위를 설정하거나 템플릿을 사용하여 즉시 추첨을 시작할 수 있습니다.</li>
                </ul>
            </div>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    공정하고 투명한 난수 생성
                </h2>
                <p className="mb-4 leading-relaxed">
                    SpinFlow의 <strong>랜덤 번호 생성기</strong>는 단순한 재미를 넘어,
                    수학적 공정성이 필요한 모든 순간을 위해 설계되었습니다.
                    대부분의 일반적인 프로그램이 사용하는 의사 난수(Pseudo-Random) 방식이 아닌,
                    브라우저의 보안 암호화 모듈(Crypto API)을 활용하여 예측 불가능한 진정한 무작위 숫자를 생성합니다.
                </p>
                <p className="mb-4 leading-relaxed">
                    이벤트 당첨자 추첨, 로또 번호 조합, 순서 정하기 등
                    공정함이 생명인 상황에서 안심하고 사용하세요.
                    데이터는 서버를 거치지 않고 오직 사용자의 브라우저 내에서만 생성되므로 조작이 불가능합니다.
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
                            SpinFlow 템플릿을 사용하여 실제 로또와 동일한 확률의 번호를 생성해보세요.
                            자동 번호 생성기가 주는 의외의 행운을 기대해볼 수 있습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🎁 이벤트 당첨자 선정</h3>
                        <p className="text-sm">
                            인스타그램, 블로그 이벤트 진행 시 당첨자를 뽑을 때 유용합니다.
                            참여자 명단을 넣고 돌리기만 하면 끝!
                            결과 화면을 캡처하여 공정성을 입증하기도 좋습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🔢 발표 순서 정하기</h3>
                        <p className="text-sm">
                            "가위바위보로 정하자"는 이제 그만.
                            1번부터 N번까지 숫자를 넣고 룰렛을 돌려보세요.
                            가장 깔끔하고 뒷말 없는 순서 정하기 방법입니다.
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
                            SpinFlow는 `crypto.getRandomValues()`를 사용하여 엔트로피가 높은 난수를 생성합니다.
                            이는 금융 보안 수준의 난수 생성 방식으로, 사람이 패턴을 예측하는 것은 불가능합니다.
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
                    SpinFlow가 여러분에게 좋은 기운을 가져다 드릴 것입니다!
                </p>
            </div>
        </article>
    );
}
