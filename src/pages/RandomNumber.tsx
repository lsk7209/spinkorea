import Home from './Home';
import { TEMPLATES } from '@/data/templates';
import RandomNumberArticle from '@/components/articles/RandomNumberArticle';

export default function RandomNumber() {
    const lottoTemplate = TEMPLATES.find(t => t.id === 'lotto');

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "SpinFlow 랜덤 번호 추첨기",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "KRW"
                },
                "description": "기본 1~45 숫자 후보에서 한 번에 여러 개를 묶음 내 중복 없이 뽑고, 다음 추첨을 위한 자동 제외를 선택할 수 있는 무료 룰렛입니다."
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "이 랜덤 번호 생성기는 공정한가요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "브라우저의 Web Crypto API를 사용해 숫자를 선택하지만, 이 페이지가 공식 추첨이나 금전 분쟁을 위한 감사 시스템은 아닙니다."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "중복 없는 번호를 뽑을 수 있나요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "기본 1~45 목록에서는 한 묶음 안에 같은 번호가 다시 나오지 않습니다. '추첨 후 자동 제외'를 켜면 이번 결과가 다음 추첨 후보에서도 빠집니다. 끄면 다음 회차에는 다시 나올 수 있으며, 같은 숫자를 명단에 여러 줄 넣으면 각각 별도 후보입니다."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "한 번에 여러 번호를 뽑을 수 있나요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "'한 번에 뽑을 수'에서 현재 남은 후보 수 이하로 수량을 정할 수 있습니다. 명단은 최대 100개까지 입력할 수 있습니다."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <Home
            initialItems={lottoTemplate?.items}
            preferInitialOnFirstLoad
            heading="랜덤 숫자 뽑기 룰렛"
            intro="기본 1~45 숫자 후보에서 '한 번에 뽑을 수'로 수량을 정해 묶음 내 중복 없이 뽑습니다. '추첨 후 자동 제외'를 켜면 이번 결과가 다음 추첨 후보에서 빠지고, 끄면 다음 회차에 다시 나올 수 있습니다. '명단 수정' 또는 '명단 편집 열기'에서 후보를 바꿀 수 있습니다."
            title="랜덤 숫자 뽑기 룰렛 - 숫자 후보 추첨 | SpinFlow"
            description="기본 1~45 숫자 후보에서 한 번에 여러 개를 묶음 내 중복 없이 뽑습니다. 추첨 후 자동 제외를 선택하고, 후보 명단을 최대 100개까지 수정할 수 있습니다."
            keywords="랜덤번호추첨기, 로또번호생성기, 난수생성기, 번호뽑기, 당첨자추첨, 숫자뽑기, 행운의숫자, 로또추천, 무료추첨기, 순서정하기"
            ArticleComponent={RandomNumberArticle}
            structuredData={structuredData}
        />
    );
}
