
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
        date: '2024-05-20',
        tags: ['심리학', '생산성', '결정장애', '팁'],
        thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2670&auto=format&fit=crop',
        content: (
            <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                    "오늘 점심 뭐 먹지?"라는 질문에 5분 이상 고민해본 적이 있다면,
                    여러분은 '결정 장애' 혹은 심리학 용어로 <strong>'결정 피로(Decision Fatigue)'</strong>를 겪고 있는 것입니다.
                    현대인은 하루에 약 35,000번의 결정을 내린다고 합니다. 이 과정에서 뇌의 에너지는 급격히 소모됩니다.
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
    }
];
