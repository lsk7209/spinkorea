
export default function RandomNumberArticle() {
    return (
        <article className="w-full max-w-4xl mx-auto px-4 py-16 text-neon-primary/80">
            <h2 className="text-3xl font-bold text-neon-primary mb-6">
                랜덤 숫자 뽑기 룰렛: 한 번에 여러 후보 고르기
            </h2>

            {/* AEO/GEO Optimized Summary Block */}
            <div className="bg-white/5 border border-neon-primary/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-3">⚡ 3줄 요약</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong>브라우저 난수:</strong> Crypto API 기반으로 숫자 후보를 선택합니다. 공식 추첨을 위한 감사 기록을 제공하지는 않습니다.</li>
                    <li><strong>묶음 내 중복 없음:</strong> '한 번에 뽑을 수'에서 수량을 정하면 같은 후보를 한 묶음에 두 번 뽑지 않습니다.</li>
                    <li><strong>다음 추첨 설정:</strong> '추첨 후 자동 제외'를 켜면 이번 결과가 다음 추첨 후보에서 빠집니다. 기본 1~45 후보를 쓰거나 '명단 수정'에서 후보를 바꿀 수 있습니다(최대 100개).</li>
                </ul>
            </div>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    브라우저 난수로 선택 과정 정리
                </h2>
                <p className="mb-4 leading-relaxed">
                    SpinFlow의 <strong>랜덤 숫자 뽑기 룰렛</strong>은 목록에 있는 숫자 후보를 지정한 수만큼 선택하고,
                    참여자와 결과를 확인하기 쉽게 정리하는 도구입니다.
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
                        <h3 className="text-xl font-bold text-white mb-3">🎰 로또 번호가 필요할 때</h3>
                        <p className="text-sm">
                            기본 1~45 후보에서 '한 번에 뽑을 수'를 6으로 정하면 한 묶음 안에서 같은 후보 없이 숫자 여섯 개를 뽑을 수 있습니다.
                            별도 조합 도구가 필요하면 <a href="/tools/lotto-generator" className="underline">로또 번호 생성기</a>를 사용하세요.
                            어떤 방식이든 결과는 참고 자료이며 당첨 확률을 높이거나 당첨을 보장하지 않습니다.
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
                            주사위가 없거나 특별한 숫자 후보가 필요할 때 활용하세요.
                            1-20, 1-100 같은 후보는 '명단 수정' 또는 '명단 편집 열기'에 숫자를 한 줄씩 입력해 만들 수 있습니다(최대 100개).
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
                            기본 1~45 목록에서는 한 묶음 안에 같은 번호가 다시 나오지 않습니다.
                            '추첨 후 자동 제외'를 켜면 이번 결과가 다음 추첨 후보에서도 빠집니다.
                            끄면 다음 회차에는 다시 나올 수 있으며, 같은 숫자를 명단에 여러 줄 넣으면 각각 별도 후보입니다.
                        </p>
                    </details>
                    <details className="group bg-neon-card rounded-lg border border-neon-primary/20 p-4 open:bg-neon-primary/5 transition-all">
                        <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                            <span>Q. 한 번에 여러 번호를 뽑을 수 있나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            '한 번에 뽑을 수'에서 현재 남은 후보 수 이하로 수량을 정할 수 있습니다.
                            명단은 최대 100개까지 입력할 수 있습니다.
                        </p>
                    </details>
                </div>
            </section>

            <p className="text-sm text-gray-300">
                '후보 목록 링크 복사'에는 원본 후보 목록만 담깁니다. 추첨 결과나 제외 상태는 링크에 포함되지 않습니다.
            </p>

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
