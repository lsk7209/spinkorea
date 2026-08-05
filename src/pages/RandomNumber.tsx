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
                "description": "브라우저 난수로 숫자를 선택하는 무료 랜덤 번호 도구입니다. 로또 번호, 순서 정하기, 소규모 활동에 참고용으로 활용하세요."
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
                            "text": "화면의 룰렛 방식은 독립 실행이므로 중복이 나올 수 있습니다. 중복을 피하려면 이미 나온 항목을 목록에서 직접 제거하는 별도 절차가 필요합니다."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <Home
            initialItems={lottoTemplate?.items}
            title="랜덤 번호 추첨기 - 로또 번호 생성 | SpinFlow"
            description="브라우저 난수로 숫자 범위를 선택하는 무료 도구입니다. 로또 조합, 소규모 활동, 순서 정하기에 참고용으로 사용하고 중복 규칙을 먼저 확인하세요."
            keywords="랜덤번호추첨기, 로또번호생성기, 난수생성기, 번호뽑기, 당첨자추첨, 숫자뽑기, 행운의숫자, 로또추천, 무료추첨기, 순서정하기"
            ArticleComponent={RandomNumberArticle}
            structuredData={structuredData}
        />
    );
}
