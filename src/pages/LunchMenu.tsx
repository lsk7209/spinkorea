import Home from './Home';
import { TEMPLATES } from '@/data/templates';

export default function LunchMenu() {
    const lunchTemplate = TEMPLATES.find(t => t.id === 'lunch');

    return (
        <Home
            initialItems={lunchTemplate?.items}
            title="점심 메뉴 추천 룰렛 - 오늘 점심 뭐 먹지? | SpinFlow"
            description="오늘 점심 메뉴가 고민되시나요? SpinFlow 점심 메뉴 추천 룰렛으로 결정해보세요! 한식, 중식, 일식, 양식, 분식 등 다양한 메뉴 중 랜덤으로 골라드립니다. 직장인 점심 메뉴 고민 해결!"
            keywords="점심메뉴추천, 오늘점심뭐먹지, 점심메뉴룰렛, 점심추천, 저녁메뉴추천, 음식추천, 혼밥메뉴, 배달음식추천, 식사메뉴정하기, 룰렛돌리기"
        />
    );
}
