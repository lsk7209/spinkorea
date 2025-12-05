
export default function LunchArticle() {
    return (
        <article className="w-full max-w-4xl mx-auto px-4 py-16 text-neon-primary/80">
            <h1 className="text-3xl font-bold text-neon-primary mb-6">
                점심 메뉴 추천: 결정 장애 해결 가이드
            </h1>

            {/* AEO/GEO Optimized Summary Block */}
            <div className="bg-white/5 border border-neon-primary/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-white mb-3">⚡ 3줄 요약</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    <li><strong>결정 피로 감소:</strong> 룰렛을 사용하여 메뉴 선정에 소모되는 시간을 획기적으로 줄일 수 있습니다.</li>
                    <li><strong>공정한 선택:</strong> 모든 메뉴가 동일한 확률로 선택되어 회사 동료들과의 의견 충돌을 방지합니다.</li>
                    <li><strong>다양한 옵션:</strong> 한식, 중식, 일식 등 카테고리별 템플릿을 통해 매일 새로운 메뉴를 즐기세요.</li>
                </ul>
            </div>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    오늘 점심, 무엇을 먹을지 고민되시나요?
                </h2>
                <p className="mb-4 leading-relaxed">
                    직장인들의 최대 난제, 바로 "오늘 점심 뭐 먹지?"입니다.
                    매일 반복되는 점심 시간마다 메뉴를 고르는 것은 즐거움이기도 하지만, 때로는 큰 스트레스가 되기도 합니다.
                    SpinFlow의 <strong>점심 메뉴 추천 룰렛</strong>은 이러한 고민을 단 1초 만에 해결해 드립니다.
                </p>
                <p className="mb-4 leading-relaxed">
                    한식, 중식, 일식, 양식, 분식 등 다양한 카테고리 중에서
                    여러분의 취향에 맞는 메뉴를 무작위로, 하지만 공정하게 선택해 드립니다.
                    더 이상 동료들에게 "아무거나요"라고 말하지 말고, 룰렛이 정해주는 운명의 메뉴를 즐겨보세요!
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold text-neon-primary mb-4">
                    점심 메뉴 선정 꿀팁 (카테고리별 추천)
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🍚 든든한 한식</h3>
                        <p className="text-sm">
                            한국인은 밥심! 김치찌개, 된장찌개, 제육볶음, 불고기 등
                            오후 업무를 위한 든든한 에너지가 필요할 때 추천합니다.
                            속이 편안하고 영양 밸런스가 좋습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🍜 간편한 면요리</h3>
                        <p className="text-sm">
                            빠르게 먹고 쉬고 싶다면 면요리가 제격입니다.
                            짜장면, 짬뽕, 칼국수, 라멘, 파스타 등
                            다양한 맛과 식감을 즐길 수 있습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🍞 가벼운 브런치</h3>
                        <p className="text-sm">
                            과한 식사가 부담스럽다면 샌드위치, 샐러드, 토스트 등을 선택해보세요.
                            식곤증을 예방하고 상쾌한 오후를 시작할 수 있습니다.
                        </p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-3">🍖 특별한 특식</h3>
                        <p className="text-sm">
                            스트레스 받는 날엔 맛있는 걸로 힐링하세요!
                            돈까스, 햄버거, 피자, 초밥 등 평소보다 조금 특별한 메뉴로 기분 전환을 해보세요.
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
                            <span>Q. 메뉴 리스트를 수정할 수 있나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            네, 물론입니다! 데스크톱에서는 우측 편집 패널에서,
                            모바일에서는 '항목 수정' 버튼을 눌러 원하는 메뉴를 추가하거나 뺄 수 있습니다.
                            자주 가는 식당 이름으로 리스트를 꾸며보세요.
                        </p>
                    </details>
                    <details className="group bg-neon-card rounded-lg border border-neon-primary/20 p-4 open:bg-neon-primary/5 transition-all">
                        <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                            <span>Q. 결과가 마음에 안 들면 다시 돌려도 되나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            룰렛의 묘미는 '운명'에 맡기는 것이지만,
                            정말 먹기 싫은 메뉴가 나왔다면 과감하게 다시 돌리세요!
                            SpinFlow는 무제한 무료로 이용 가능합니다.
                        </p>
                    </details>
                    <details className="group bg-neon-card rounded-lg border border-neon-primary/20 p-4 open:bg-neon-primary/5 transition-all">
                        <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
                            <span>Q. 여러 명이서 같이 결정할 수 있나요?</span>
                            <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-4 text-gray-300 semi-bold pl-4 border-l-2 border-neon-primary">
                            네! URL 복사 기능을 이용해 현재 룰렛 상태를 단톡방에 공유하세요.
                            팀원들과 함께 화면을 보며 스릴 넘치는 메뉴 선정 시간을 가질 수 있습니다.
                        </p>
                    </details>
                </div>
            </section>

            <div className="mt-8 text-center bg-neon-primary/10 p-6 rounded-2xl border border-neon-primary/30">
                <h3 className="text-lg font-bold text-white mb-2">오늘 점심 메뉴 결정하셨나요?</h3>
                <p className="text-sm">
                    SpinFlow는 여러분의 맛있는 점심 식사를 응원합니다.<br />
                    매일 고민되는 식사 메뉴, 이제 스핀플로우 룰렛으로 간편하게 해결하세요!
                </p>
            </div>
        </article>
    );
}
