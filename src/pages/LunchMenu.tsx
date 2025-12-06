import Home from './Home';
import { TEMPLATES } from '@/data/templates';
import LunchArticle from '@/components/articles/LunchArticle';

export default function LunchMenu() {
    const lunchTemplate = TEMPLATES.find(t => t.id === 'lunch-korean'); // Default to Korean

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "SpinFlow 점심 메뉴 추천 룰렛",
                "applicationCategory": "LifestyleApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "KRW"
                },
                "description": "오늘 점심 메뉴가 고민된다면? SpinFlow 룰렛으로 결정하세요. 한식, 중식, 일식 등 다양한 옵션 제공."
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "점심 메뉴 추천 룰렛은 무료인가요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "네, SpinFlow의 모든 기능은 무료로 제공되며 별도의 설치가 필요 없습니다."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "메뉴를 직접 추가할 수 있나요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "가능합니다. '항목 수정' 버튼을 눌러 원하는 메뉴를 직접 입력하여 룰렛을 돌릴 수 있습니다."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <Home
            initialItems={lunchTemplate?.items}
            preferInitialOnFirstLoad
            title="점심 메뉴 추천 룰렛 - 오늘 점심 뭐 먹지? | SpinFlow"
            description="오늘 점심 메뉴가 고민되시나요? SpinFlow 점심 메뉴 추천 룰렛으로 결정해보세요! 한식, 중식, 일식, 양식, 분식 등 다양한 메뉴 중 랜덤으로 골라드립니다. 직장인 점심 메뉴 고민 해결!"
            keywords="점심메뉴추천, 오늘점심뭐먹지, 점심메뉴룰렛, 점심추천, 저녁메뉴추천, 음식추천, 혼밥메뉴, 배달음식추천, 식사메뉴정하기, 룰렛돌리기"
            ArticleComponent={LunchArticle}
            structuredData={structuredData}
        />
    );
}
