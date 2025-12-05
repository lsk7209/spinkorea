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
                "description": "공정하고 안전한 무료 랜덤 번호 생성기. 로또 번호, 경품 추첨, 순서 정하기 등 다양한 용도로 활용하세요."
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "이 랜덤 번호 생성기는 공정한가요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "네, SpinFlow는 최신 브라우저의 암호화된 난수 생성(Crypto API) 기술을 사용하여 예측 불가능하고 공정한 결과를 보장합니다."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "중복 없는 번호를 뽑을 수 있나요?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "네, 기본적으로 로또와 같이 중복되지 않는 번호를 추출하도록 설정되어 있습니다."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <Home
            initialItems={lottoTemplate?.items}
            title="랜덤 번호 추첨기 - 로또 번호 생성 | 행운의 숫자 | SpinFlow"
            description="무료 랜덤 번호 추첨기입니다. 로또 번호 생성, 경품 당첨자 추첨, 순서 정하기 등 숫자가 필요한 모든 순간에 공정하게 사용하세요. 범위 지정 가능, 중복 없는 난수 생성."
            keywords="랜덤번호추첨기, 로또번호생성기, 난수생성기, 번호뽑기, 당첨자추첨, 숫자뽑기, 행운의숫자, 로또추천, 무료추첨기, 순서정하기"
            ArticleComponent={RandomNumberArticle}
            structuredData={structuredData}
        />
    );
}
