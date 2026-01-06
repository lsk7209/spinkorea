
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

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
        slug: 'overcome-decision-fatigue',
        title: '결정 장애(Decision Fatigue)를 극복하는 3가지 과학적인 방법',
        description: '현대인의 고질병 결정 장애. 점심 메뉴 고르기부터 인생의 중요한 선택까지, 뇌 과학이 알려주는 스트레스 없는 결정법을 소개합니다.',
        date: '2025-12-10',
        tags: ['심리학', '생산성', '결정장애', '팁'],
        thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    "오늘 점심 뭐 먹지?"라는 질문에 5분 이상 고민해본 적이 있다면,
                    여러분은 '결정 장애' 혹은 심리학 용어로 <strong>'결정 피로(Decision Fatigue)'</strong>를 겪고 있는 것입니다.
                    현대인은 하루에 약 35,000번의 결정을 내린다고 합니다. 이 과정에서 뇌의 에너지는 급격히 소모됩니다.
                    (<a href="https://ko.wikipedia.org/wiki/%EA%B2%B0%EC%A0%95_%ED%94%BC%EB%A1%9C" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">출처: 위키백과 - 결정 피로</a>)
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. 사소한 결정은 '운명'에 맡기세요</h2>
                <p>
                    스티브 잡스는 매일 같은 옷을 입었고, 버럭 오바마도 회색이나 푸른색 양복만 입었습니다.
                    중요하지 않은 결정에 에너지를 낭비하지 않기 위해서입니다.
                    점심 메뉴나 회식 장소 같은 선택지는 <Link to="/lunch-menu" className="text-neon-primary hover:underline">SpinFlow 점심 메뉴 룰렛</Link>과 같은 도구에 맡겨버리세요.
                    뇌를 '생각하는 모드'에서 '실행하는 모드'로, 즉각 전환할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. 선택지를 3개로 줄이세요 (The Rule of 3)</h2>
                <p>
                    선택지가 너무 많으면 뇌는 '분석 마비(Analysis Paralysis)'에 빠집니다.
                    넷플릭스에서 영화를 고르다 시간을 다 보내는 이유가 바로 이것입니다.
                    어떤 결정을 내릴 때, 의도적으로 옵션을 3가지로 추려보세요.
                    3개 중 하나를 고르는 것은 30개 중 하나를 고르는 것보다 압도적으로 쉽고 만족도도 높습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. '언제' 결정할지를 미리 정하세요</h2>
                <p>
                    중요한 결정은 아침에 하세요. 기상 후 1시간~3시간 사이가 뇌의 전두엽이 가장 활발한 시간대입니다.
                    반대로 저녁 늦은 시간에는 충동적인 결정을 내리기 쉽습니다.
                    쇼핑이나 야식 메뉴 선정 등 감정이 앞서는 선택은 <Link to="/random-number" className="text-neon-primary hover:underline">랜덤 룰렛</Link>을 통해
                    우연에 맡기거나 내일 아침으로 미루는 것이 현명합니다.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    완벽한 선택을 하려는 강박을 내려놓으세요.
                    대부분의 일상적인 결정은 '어떤 선택(Option)'을 하느냐보다
                    선택 후에 '어떻게(Action)' 행동하느냐가 결과를 만듭니다.
                    지금 당장 고민이 된다면? 스핀 버튼을 누르고 그 결과에 따라 움직여보세요!
                </p>
            </div>
        )
    },
    {
        slug: 'bmi-healthy-weight-guide',
        title: 'BMI 계산기로 알아보는 건강한 체중 관리의 모든 것',
        description: 'BMI(체질량지수)의 의미와 한계, 올바른 체중 관리 방법까지. 숫자에만 의존하지 않는 진정한 건강 관리 가이드입니다.',
        date: '2025-12-11',
        tags: ['건강', 'BMI', '다이어트', '웰빙'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    체중계에 올라가는 순간, 많은 사람들이 복잡한 감정을 느낍니다.
                    하지만 체중이라는 숫자 하나로 건강을 판단하는 것은 매우 제한적인 접근입니다.
                    오늘은 <strong>BMI(체질량지수)</strong>가 무엇인지, 어떻게 활용해야 하는지,
                    그리고 진정한 건강 관리는 무엇인지 알아보겠습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">BMI란 무엇인가?</h2>
                <p>
                    BMI(Body Mass Index, 체질량지수)는 키와 체중을 이용해 비만도를 추정하는 지표입니다.
                    계산 방법은 간단합니다: <strong>체중(kg) ÷ 키(m)²</strong>
                </p>
                <p>
                    예를 들어, 키 170cm에 체중 70kg인 사람의 BMI는 70 ÷ 1.7² = 약 24.2입니다.
                    <Link to="/tools/bmi-calculator" className="text-neon-primary hover:underline ml-1">BMI 계산기</Link>를 사용하면
                    직접 계산하지 않아도 즉시 결과를 확인할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">대한비만학회 BMI 기준</h2>
                <div className="bg-white/5 p-4 rounded-lg">
                    <ul className="space-y-2">
                        <li>• <strong className="text-blue-400">저체중</strong>: 18.5 미만</li>
                        <li>• <strong className="text-green-400">정상</strong>: 18.5 ~ 22.9</li>
                        <li>• <strong className="text-yellow-400">과체중</strong>: 23 ~ 24.9</li>
                        <li>• <strong className="text-orange-400">비만</strong>: 25 ~ 29.9</li>
                        <li>• <strong className="text-red-400">고도비만</strong>: 30 이상</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">BMI의 한계점</h2>
                <p>
                    BMI는 간편하지만, 몇 가지 중요한 한계가 있습니다:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>근육량 미반영:</strong> 근육이 많은 사람은 BMI가 높게 나올 수 있습니다.</li>
                    <li><strong>체지방 분포 무시:</strong> 같은 BMI라도 복부비만 여부에 따라 건강 위험이 다릅니다.</li>
                    <li><strong>연령/성별 차이:</strong> 나이가 들수록, 그리고 성별에 따라 적정 체지방률이 다릅니다.</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">진정한 건강 관리 팁</h2>
                <ol className="list-decimal pl-6 space-y-3">
                    <li>
                        <strong>규칙적인 운동:</strong> 주 3회 이상, 30분 이상의 유산소 운동을 권장합니다.
                    </li>
                    <li>
                        <strong>균형 잡힌 식단:</strong> 탄수화물, 단백질, 지방을 적절히 섭취하세요.
                    </li>
                    <li>
                        <strong>충분한 수면:</strong> 7~8시간의 숙면은 체중 관리에 큰 영향을 미칩니다.
                    </li>
                    <li>
                        <strong>정기적인 건강검진:</strong> BMI 외에도 혈압, 혈당, 콜레스테롤 등을 확인하세요.
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
        )
    },
    {
        slug: 'password-security-guide',
        title: '강력한 비밀번호 만들기: 해킹으로부터 계정을 지키는 완벽 가이드',
        description: '매년 수백만 개의 계정이 해킹됩니다. 안전한 비밀번호를 만들고 관리하는 방법을 알아보세요.',
        date: '2025-12-12',
        tags: ['보안', '비밀번호', '팁', '인터넷'],
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    "123456", "password", "qwerty"... 여전히 많은 사람들이 이런 비밀번호를 사용합니다.
                    2023년 기준, 가장 많이 사용되는 비밀번호 상위 10개는 1초도 안 되어 해킹될 수 있습니다.
                    오늘은 <strong>강력한 비밀번호</strong>를 만들고 관리하는 방법을 알아봅니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">취약한 비밀번호의 위험성</h2>
                <p>
                    해커들은 '브루트 포스(Brute Force)' 공격으로 초당 수십억 개의 비밀번호 조합을 시도할 수 있습니다.
                    8자리 숫자로만 된 비밀번호는 단 몇 초 만에 뚫립니다.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                    <p className="text-red-300">
                        ⚠️ 피해야 할 비밀번호: 생일, 전화번호, 연속된 숫자, 키보드 패턴(qwerty),
                        이름+생년월일 조합
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">강력한 비밀번호의 조건</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>길이:</strong> 최소 12자 이상 (16자 권장)</li>
                    <li><strong>복잡성:</strong> 대문자, 소문자, 숫자, 특수문자 혼합</li>
                    <li><strong>무작위성:</strong> 예측 불가능한 조합</li>
                    <li><strong>고유성:</strong> 서비스마다 다른 비밀번호 사용</li>
                </ul>
                <p className="mt-4">
                    직접 만들기 어렵다면 <Link to="/tools/random-password" className="text-neon-primary hover:underline">비밀번호 생성기</Link>를 활용해보세요.
                    암호학적으로 안전한 랜덤 비밀번호를 즉시 생성할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">비밀번호 관리 베스트 프랙티스</h2>
                <ol className="list-decimal pl-6 space-y-3">
                    <li>
                        <strong>비밀번호 관리자 사용:</strong> 1Password, Bitwarden 같은 도구로 모든 비밀번호를 안전하게 저장하세요.
                    </li>
                    <li>
                        <strong>2단계 인증(2FA) 활성화:</strong> 비밀번호 유출 시에도 추가 보안 레이어가 계정을 보호합니다.
                    </li>
                    <li>
                        <strong>정기적 변경:</strong> 중요한 계정(은행, 이메일)은 3~6개월마다 변경하세요.
                    </li>
                    <li>
                        <strong>유출 확인:</strong> haveibeenpwned.com 같은 사이트에서 자신의 정보가 유출되었는지 확인하세요.
                    </li>
                </ol>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">기억하기 쉬운 강력한 비밀번호 만들기</h2>
                <p>
                    완전히 랜덤한 문자열은 외우기 어렵습니다. 대신 '패스프레이즈(Passphrase)' 방식을 사용해보세요:
                </p>
                <div className="bg-white/5 p-4 rounded-lg mt-4">
                    <p className="text-neon-primary font-mono">"나는2024년에@서울로이사한다!"</p>
                    <p className="text-sm text-gray-500 mt-2">→ 한글, 숫자, 특수문자가 모두 포함된 20자 이상의 강력한 비밀번호</p>
                </div>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    강력한 비밀번호는 디지털 시대의 첫 번째 방어선입니다.
                    귀찮더라도 지금 바로 주요 계정의 비밀번호를 점검하고 강화하세요.
                    한 번의 수고가 큰 피해를 예방할 수 있습니다.
                </p>
            </div>
        )
    },
    {
        slug: 'color-code-complete-guide',
        title: '색상 코드 완벽 가이드: HEX, RGB, HSL 이해하기',
        description: '웹 디자인에서 색상을 표현하는 다양한 방법을 알아봅니다. HEX, RGB, HSL의 차이점과 활용법을 완벽 정리합니다.',
        date: '2025-12-13',
        tags: ['디자인', '웹개발', '색상', '가이드'],
        thumbnail: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    웹사이트나 앱을 만들 때 색상은 매우 중요한 요소입니다.
                    그런데 색상을 표현하는 방식이 여러 가지라 처음에는 헷갈릴 수 있습니다.
                    오늘은 가장 많이 사용되는 세 가지 색상 표현 방식인 <strong>HEX, RGB, HSL</strong>에 대해 알아보겠습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">HEX (16진수) 색상 코드</h2>
                <p>
                    가장 널리 사용되는 색상 표현 방식입니다. #기호로 시작하며 6자리의 16진수로 구성됩니다.
                </p>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="font-mono text-lg">#FF5733</p>
                    <p className="text-sm text-gray-500 mt-2">
                        FF(빨강) + 57(초록) + 33(파랑) = 주황빛 빨강색
                    </p>
                </div>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>장점:</strong> 간결하고, 웹에서 가장 보편적으로 사용</li>
                    <li><strong>단점:</strong> 색상 조절이 직관적이지 않음</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">RGB (Red, Green, Blue)</h2>
                <p>
                    빨강(Red), 초록(Green), 파랑(Blue)의 세 가지 원색을 조합하여 색상을 표현합니다.
                    각 값은 0~255 사이의 숫자입니다.
                </p>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="font-mono text-lg">rgb(255, 87, 51)</p>
                    <p className="text-sm text-gray-500 mt-2">
                        #FF5733과 동일한 색상을 RGB로 표현
                    </p>
                </div>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>장점:</strong> 투명도(Alpha) 추가 가능 → rgba(255, 87, 51, 0.5)</li>
                    <li><strong>단점:</strong> 색상/채도/밝기 조절이 어려움</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">HSL (Hue, Saturation, Lightness)</h2>
                <p>
                    색상(Hue), 채도(Saturation), 밝기(Lightness)로 색을 표현하는 방식입니다.
                    색상 조절이 가장 직관적입니다.
                </p>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="font-mono text-lg">hsl(14, 100%, 60%)</p>
                    <p className="text-sm text-gray-500 mt-2">
                        색상 14도(주황), 채도 100%, 밝기 60%
                    </p>
                </div>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>장점:</strong> 밝기와 채도 조절이 쉬움, 색상 팔레트 생성에 유리</li>
                    <li><strong>단점:</strong> 아직 HEX만큼 보편적이지 않음</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">언제 어떤 형식을 사용할까?</h2>
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
                    색상 변환이 필요하다면 <Link to="/tools/color-converter" className="text-neon-primary hover:underline">색상 변환기</Link>를 활용해보세요.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    색상 코드는 처음엔 복잡해 보이지만, 각각의 특성을 이해하면 상황에 맞게 활용할 수 있습니다.
                    디자인 작업을 할 때 이 세 가지 형식을 자유자재로 활용해보세요!
                </p>
            </div>
        )
    },
    {
        slug: 'time-management-productivity',
        title: '시간 관리의 기술: 생산성을 2배로 높이는 실전 전략',
        description: '바쁘게 움직이는데 왜 할 일은 줄지 않을까요? 시간 관리 전문가들이 추천하는 실천 가능한 생산성 향상 전략을 소개합니다.',
        date: '2025-12-14',
        tags: ['생산성', '시간관리', '자기계발', '팁'],
        thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    하루 24시간, 모든 사람에게 동일하게 주어진 시간.
                    그런데 누군가는 같은 시간에 더 많은 일을 해내고, 누군가는 항상 시간이 부족하다고 느낍니다.
                    그 차이는 무엇일까요? 바로 <strong>시간 관리 능력</strong>입니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. 타임 블로킹(Time Blocking)</h2>
                <p>
                    하루를 시간 단위로 나누어 각 블록에 특정 작업을 할당하는 방법입니다.
                    예를 들어 오전 9시~11시는 "집중 작업 시간", 오후 2시~3시는 "이메일 처리 시간"으로 정하는 것이죠.
                </p>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-neon-primary font-bold mb-2">💡 팁</p>
                    <p>집중력이 가장 높은 시간대에 가장 중요한 업무를 배치하세요. 대부분의 사람들은 오전 10시~12시가 가장 집중력이 높습니다.</p>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. 포모도로 테크닉</h2>
                <p>
                    25분 집중 + 5분 휴식을 한 세트로 반복하는 방법입니다.
                    4세트 후에는 15~30분의 긴 휴식을 취합니다.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>25분 동안 한 가지 일에만 집중</li>
                    <li>5분 휴식 (스트레칭, 물 마시기)</li>
                    <li>4세트 후 긴 휴식</li>
                </ul>
                <p className="mt-4">
                    <Link to="/tools/time-calculator" className="text-neon-primary hover:underline">시간 계산기</Link>를 사용하면
                    작업 시간을 정확히 측정하고 관리할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. 아이젠하워 매트릭스</h2>
                <p>
                    모든 할 일을 긴급성과 중요도에 따라 4가지 영역으로 분류합니다:
                </p>
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
                    2분 안에 끝낼 수 있는 일은 미루지 말고 바로 처리하세요.
                    이메일 답장, 간단한 메모, 전화 예약 등이 해당됩니다.
                    작은 일들을 쌓아두면 나중에 큰 부담이 됩니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. 디지털 디톡스</h2>
                <p>
                    집중 시간에는 스마트폰 알림을 끄고, SNS 앱을 숨기세요.
                    불필요한 방해를 없애는 것만으로도 생산성이 크게 향상됩니다.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    완벽한 시간 관리 시스템은 없습니다. 중요한 것은 자신에게 맞는 방법을 찾아 꾸준히 실천하는 것입니다.
                    오늘 소개한 기법들 중 하나를 선택해서 일주일만 실천해보세요.
                    작은 변화가 큰 차이를 만들어냅니다!
                </p>
            </div>
        )
    },
    {
        slug: 'random-choice-psychology',
        title: '랜덤 선택의 심리학: 왜 우리는 결정을 위임하고 싶어하는가',
        description: '동전 던지기, 룰렛 돌리기... 우리는 왜 중요한 선택을 운에 맡기려 할까요? 심리학적 관점에서 랜덤 선택의 본질을 탐구합니다.',
        date: '2025-12-15',
        tags: ['심리학', '결정', '인사이트', '룰렛'],
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    "짜장면 먹을까 짬뽕 먹을까?" 고민 끝에 동전을 던진 경험이 있으신가요?
                    흥미로운 점은, 동전이 공중에 떠 있는 순간 우리는 이미 원하는 답을 알게 된다는 것입니다.
                    오늘은 <strong>랜덤 선택</strong>이 우리 심리에 미치는 영향에 대해 알아봅니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">결정 피로와 인지 부하</h2>
                <p>
                    현대인은 하루에 평균 35,000번의 결정을 내린다고 합니다.
                    아침에 일어나서 무엇을 입을지, 무엇을 먹을지, 어떤 길로 출근할지...
                    이 모든 선택이 뇌의 에너지를 소모합니다.
                </p>
                <p>
                    심리학에서는 이를 <strong>'결정 피로(Decision Fatigue)'</strong>라고 부릅니다.
                    결정을 많이 할수록 이후의 판단력이 떨어지고, 충동적인 선택을 하기 쉬워집니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">운에 맡기는 것의 심리적 이점</h2>
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                        <strong>책임 분산:</strong>
                        결과가 좋지 않아도 "룰렛이 그렇게 나왔으니까"라고 합리화할 수 있습니다.
                        이는 후회를 줄이고 심리적 부담을 덜어줍니다.
                    </li>
                    <li>
                        <strong>분석 마비 탈출:</strong>
                        너무 많은 정보와 선택지 앞에서 아무 결정도 못하는 상태에서 벗어날 수 있습니다.
                    </li>
                    <li>
                        <strong>잠재된 선호 발견:</strong>
                        동전이 던져지는 순간, 우리는 어느 쪽이 나오길 바라는지 알게 됩니다.
                        랜덤 선택은 숨겨진 본심을 드러내는 촉매 역할을 합니다.
                    </li>
                </ol>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">고대부터 이어진 제비뽑기의 전통</h2>
                <p>
                    랜덤 선택은 현대의 발명품이 아닙니다.
                    고대 그리스에서는 공직자를 제비뽑기로 선출했고(추첨제, Sortition),
                    성경에서도 중요한 결정을 제비뽑기로 한 기록이 있습니다.
                    로마 시대에는 "운명의 여신(Fortuna)"을 모시는 신전이 있었죠.
                </p>
                <p>
                    이러한 전통은 모든 선택에 동등한 기회를 부여함으로써
                    편견이나 정치적 영향력을 배제하려는 시도이기도 했습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">언제 랜덤 선택이 효과적인가?</h2>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-neon-primary font-bold mb-3">✅ 랜덤 선택이 적합한 경우</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>선택지 간 차이가 크지 않을 때 (점심 메뉴)</li>
                        <li>어떤 선택을 해도 큰 문제가 없을 때</li>
                        <li>결정 자체가 재미의 요소일 때 (게임, 이벤트)</li>
                        <li>공정성이 중요할 때 (순서 정하기, 당첨자 추첨)</li>
                    </ul>
                </div>
                <div className="bg-white/5 p-4 rounded-lg mt-4">
                    <p className="text-red-400 font-bold mb-3">❌ 랜덤 선택이 부적합한 경우</p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>결과에 따른 차이가 매우 클 때 (진로, 투자)</li>
                        <li>전문 지식이 필요한 결정</li>
                        <li>되돌리기 어려운 결정</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">SpinFlow와 함께하는 현명한 결정</h2>
                <p>
                    <Link to="/" className="text-neon-primary hover:underline">SpinFlow 룰렛</Link>은
                    사소한 결정에 지치지 않도록 도와드립니다.
                    점심 메뉴, 영화 선택, 순서 정하기 같은 일상의 선택은 룰렛에 맡기고,
                    정말 중요한 일에 에너지를 집중하세요.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    랜덤 선택은 무책임한 행동이 아닙니다.
                    때로는 분석보다 직관이, 숙고보다 행동이 더 나은 결과를 가져옵니다.
                    다음에 결정이 어려울 때, 룰렛을 돌려보세요.
                    그리고 결과가 나오는 순간 느껴지는 감정을 관찰해보세요.
                    그것이 당신의 진짜 마음입니다.
                </p>
            </div>
        )
    },
    {
        slug: 'digital-wellbeing-tips',
        title: '디지털 웰빙: 스마트폰과 건강하게 공존하는 7가지 방법',
        description: '하루 평균 7시간을 스마트폰과 함께하는 현대인. 디지털 피로를 줄이고 건강한 기기 사용 습관을 만드는 실천 가이드입니다.',
        date: '2025-12-16',
        tags: ['웰빙', '생산성', '건강', '라이프스타일'],
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    스마트폰 없이 하루를 보낸다는 것이 상상이 되시나요?
                    2024년 기준, 한국인의 하루 평균 스마트폰 사용 시간은 약 5~7시간에 달합니다.
                    이는 깨어있는 시간의 거의 절반입니다.
                    오늘은 <strong>디지털 웰빙(Digital Wellbeing)</strong>을 실천하는 방법을 알아봅니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. 아침 루틴에서 스마트폰 제외하기</h2>
                <p>
                    눈 뜨자마자 스마트폰을 확인하는 습관은 하루를 수동적으로 시작하게 만듭니다.
                    기상 후 최소 30분~1시간은 스마트폰 없이 시작해보세요.
                    스트레칭, 명상, 간단한 조식 준비 등으로 대체할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. 알림 설정 정리하기</h2>
                <p>
                    정말 중요한 앱의 알림만 남기고 나머지는 모두 꺼두세요.
                    대부분의 알림은 '지금 당장' 확인할 필요가 없습니다.
                    필수 알림: 전화, 메시지, 캘린더 정도면 충분합니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. 그레이스케일 모드 활용</h2>
                <p>
                    스마트폰 화면을 흑백으로 설정하면 시각적 자극이 줄어들어 자연스럽게 사용 시간이 감소합니다.
                    (<a href="https://www.sciencedirect.com/science/article/pii/S0747563219303723" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">연구 출처</a>)
                    설정 → 접근성 → 색상 필터에서 활성화할 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. 앱 사용 시간 제한 설정</h2>
                <p>
                    iOS의 '스크린 타임', 안드로이드의 '디지털 웰빙' 기능을 활용하세요.
                    SNS 앱에 하루 30분~1시간 제한을 걸어두면 효과적입니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. 잠자리에 스마트폰 두지 않기</h2>
                <p>
                    침실에 스마트폰을 두지 마세요. 알람이 필요하다면 일반 알람시계를 사용하세요.
                    블루라이트는 수면의 질을 떨어뜨리고, 자기 전 스마트폰 사용은 뇌를 각성 상태로 만듭니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. '폰 프리' 시간대 만들기</h2>
                <p>
                    식사 시간, 가족과 함께 하는 시간, 운동 시간 등
                    하루 중 특정 시간대를 스마트폰 없이 보내는 습관을 들이세요.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. 목적 있는 사용하기</h2>
                <p>
                    스마트폰을 들 때마다 "왜 지금 이걸 켜는가?"라고 자문해보세요.
                    목적 없이 습관적으로 켜는 횟수가 줄어들면 전체 사용 시간이 크게 감소합니다.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    스마트폰은 훌륭한 도구이지만, 도구가 주인이 되어서는 안 됩니다.
                    작은 습관 변화부터 시작해보세요. 디지털 기기와 건강하게 공존하는 것,
                    그것이 진정한 디지털 웰빙입니다.
                </p>
            </div>
        )
    },
    {
        slug: 'qr-code-guide',
        title: 'QR 코드 완벽 가이드: 원리부터 활용까지',
        description: '어디에나 있는 QR 코드. 어떻게 작동하는지, 어떻게 만들고 활용하는지 알아봅니다.',
        date: '2025-12-17',
        tags: ['기술', '가이드', 'QR코드', '마케팅'],
        thumbnail: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    카페 메뉴, 명함, 박물관 안내판, 심지어 결제까지.
                    <strong>QR 코드(Quick Response Code)</strong>는 이제 일상의 일부가 되었습니다.
                    이 작은 사각형 안에 어떤 비밀이 숨어있는지 알아볼까요?
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">QR 코드란?</h2>
                <p>
                    QR 코드는 1994년 일본의 <a href="https://en.wikipedia.org/wiki/QR_code" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">덴소웨이브(Denso Wave)</a>가 개발한 2차원 바코드입니다.
                    기존 바코드가 가로 방향으로만 정보를 저장하는 반면,
                    QR 코드는 가로와 세로 두 방향으로 정보를 저장해 더 많은 데이터를 담을 수 있습니다.
                </p>
                <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-neon-secondary font-bold mb-2">💡 저장 가능 용량</p>
                    <ul className="space-y-1">
                        <li>• 숫자: 최대 7,089자</li>
                        <li>• 영숫자: 최대 4,296자</li>
                        <li>• 한글/한자: 최대 1,817자</li>
                    </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">QR 코드의 구조</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>파인더 패턴:</strong> 세 모서리의 큰 사각형, 스캐너가 QR 코드를 인식하는 기준점</li>
                    <li><strong>얼라인먼트 패턴:</strong> 크기가 큰 QR 코드에서 왜곡을 보정하는 작은 사각형</li>
                    <li><strong>타이밍 패턴:</strong> 검은색과 흰색이 번갈아 나오는 선, 셀 위치 파악용</li>
                    <li><strong>데이터 영역:</strong> 실제 정보가 저장되는 부분</li>
                    <li><strong>오류 정정 코드:</strong> 일부가 손상되어도 복구 가능하게 하는 정보</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">QR 코드 활용 사례</h2>
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

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">나만의 QR 코드 만들기</h2>
                <p>
                    <Link to="/tools/qr-code-generator" className="text-neon-primary hover:underline">SpinFlow QR 코드 생성기</Link>를 사용하면
                    URL, 텍스트, 연락처 정보 등을 담은 QR 코드를 무료로 만들 수 있습니다.
                    명함, SNS 프로필, 와이파이 정보 공유 등에 활용해보세요.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    QR 코드는 단순한 기술 같지만, 오프라인과 온라인을 연결하는 강력한 도구입니다.
                    비즈니스 홍보, 개인 브랜딩, 정보 공유 등 다양한 목적으로 활용해보세요.
                </p>
            </div>
        )
    },
    {
        slug: 'json-for-beginners',
        title: 'JSON 완벽 이해: 개발자가 아니어도 알아야 하는 데이터 형식',
        description: 'API, 설정 파일, 데이터 교환의 핵심 JSON. 비개발자도 쉽게 이해할 수 있도록 설명합니다.',
        date: '2025-12-18',
        tags: ['개발', '가이드', 'JSON', '기초'],
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    웹 개발자나 데이터 분석가가 아니더라도,
                    디지털 시대를 살아가다 보면 <strong>JSON</strong>이라는 단어를 마주칠 때가 있습니다.
                    API 연동, 설정 파일, 데이터 내보내기 등 다양한 곳에서 사용되는 이 형식,
                    오늘 완벽하게 이해해봅시다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">JSON이란?</h2>
                <p>
                    JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하기 위한 텍스트 형식입니다.
                    사람이 읽기 쉽고, 기계가 분석하기도 쉬운 것이 특징입니다.
                </p>
                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
                    <pre className="text-neon-secondary">{`{
  "name": "홍길동",
  "age": 30,
  "isStudent": false,
  "hobbies": ["독서", "영화", "여행"]
}`}</pre>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">JSON의 기본 문법</h2>
                <p className="mb-4">
                    JSON은 <a href="https://www.json.org/json-ko.html" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">공식 표준</a>으로 정의된 간단한 문법을 따릅니다:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>객체(Object):</strong> 중괄호 {`{}`}로 감싸고, "키": 값 형태로 작성</li>
                    <li><strong>배열(Array):</strong> 대괄호 []로 감싸고, 쉼표로 구분</li>
                    <li><strong>문자열:</strong> 반드시 큰따옴표("")로 감싸야 함</li>
                    <li><strong>숫자:</strong> 따옴표 없이 그냥 숫자로 작성</li>
                    <li><strong>불린:</strong> true 또는 false (따옴표 없이)</li>
                    <li><strong>null:</strong> 값이 없음을 나타냄</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">왜 JSON을 사용할까?</h2>
                <ol className="list-decimal pl-6 space-y-3">
                    <li><strong>언어 독립적:</strong> JavaScript에서 유래했지만, 거의 모든 프로그래밍 언어에서 지원</li>
                    <li><strong>가볍다:</strong> XML보다 적은 용량으로 같은 정보를 표현</li>
                    <li><strong>읽기 쉽다:</strong> 사람이 보고 바로 구조를 파악할 수 있음</li>
                    <li><strong>웹 API의 표준:</strong> REST API의 데이터 교환 형식으로 널리 사용</li>
                </ol>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">JSON 작업 시 주의사항</h2>
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
                    <Link to="/tools/json-formatter" className="text-neon-primary hover:underline ml-1">JSON 포맷터</Link>를
                    사용해보세요. 유효성 검사와 함께 보기 좋게 정리해줍니다.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    JSON은 현대 웹의 핏줄 같은 존재입니다.
                    개발자가 아니더라도 기본 구조를 이해하면
                    API 문서를 읽거나 설정 파일을 수정하는 데 큰 도움이 됩니다.
                </p>
            </div>
        )
    },
    {
        slug: 'dday-calculator-life-hacks',
        title: 'D-Day 계산기 200% 활용법: 목표 달성의 비밀 무기',
        description: '시험, 프로젝트 마감, 결혼식, 휴가까지. D-Day 계산기를 활용해 동기부여를 높이고 목표를 관리하는 방법을 알아봅니다.',
        date: '2025-12-19',
        tags: ['생산성', '목표관리', '팁', '라이프해킹'],
        thumbnail: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?q=80&w=2667&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    "시험까지 D-100", "결혼식 D-30", "프로젝트 마감 D-7"...
                    우리는 중요한 날을 카운트다운하며 살아갑니다.
                    <Link to="/tools/dday-counter" className="text-neon-primary hover:underline mx-1">D-Day 계산기</Link>를
                    단순히 날짜 계산 도구로만 사용하고 계신가요?
                    오늘은 이 도구를 200% 활용하는 방법을 알아봅니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. 큰 목표를 작은 마일스톤으로 쪼개기</h2>
                <p>
                    "1년 후 마라톤 완주"라는 목표가 있다면,
                    중간 마일스톤을 설정하세요.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>D-365: 목표 설정</li>
                    <li>D-300: 5km 완주</li>
                    <li>D-200: 10km 완주</li>
                    <li>D-100: 하프마라톤 완주</li>
                    <li>D-Day: 풀마라톤 완주</li>
                </ul>
                <p className="mt-4">
                    각 마일스톤마다 별도의 D-Day를 설정하면 달성감을 더 자주 느낄 수 있습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. 역산 계획법 (Backward Planning)</h2>
                <p>
                    <a href="https://en.wikipedia.org/wiki/Backward_planning" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">목표일로부터 역으로 계획</a>을 세우세요.
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

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. D+ (경과일) 활용하기</h2>
                <p>
                    D-Day만 있는 게 아닙니다. D+ 기능을 활용해:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>금연/금주:</strong> "금연 D+100, 잘 하고 있어!"</li>
                    <li><strong>운동 기록:</strong> "러닝 시작한 지 D+365"</li>
                    <li><strong>연애 기념일:</strong> "만난 지 D+1000"</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. 시각화의 힘</h2>
                <p>
                    D-Day를 눈에 잘 보이는 곳에 두세요.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>스마트폰 잠금화면 위젯</li>
                    <li>컴퓨터 바탕화면</li>
                    <li>책상 위 포스트잇</li>
                </ul>
                <p className="mt-4">
                    남은 날짜를 시각적으로 자주 확인하면 긴급성을 느껴 행동으로 이어지기 쉽습니다.
                </p>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. 복수의 D-Day 관리하기</h2>
                <p>
                    삶에는 여러 중요한 날짜가 동시에 존재합니다.
                    업무 마감, 기념일, 개인 목표 등을 카테고리별로 관리하세요.
                </p>

                <hr className="border-white/10 my-8" />

                <h3 className="text-xl font-bold text-white mb-4">결론</h3>
                <p>
                    D-Day 계산기는 단순한 날짜 계산 도구가 아닙니다.
                    목표를 명확히 하고, 계획을 수립하고, 동기부여를 유지하는 강력한 도구입니다.
                    오늘 당장 여러분의 다음 중요한 날짜를 설정해보세요!
                </p>
            </div>
        )
    }
];
