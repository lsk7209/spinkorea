import SEO from '@/components/SEO';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "SpinFlow는 무료인가요?",
        answer: "네, SpinFlow의 모든 서비스는 완전 무료입니다. 회원가입 없이 바로 이용 가능하며, 숨겨진 비용이 없습니다."
    },
    {
        question: "룰렛 결과는 정말 랜덤인가요?",
        answer: "네, SpinFlow의 룰렛은 암호학적으로 안전한 난수 생성기(Crypto API)를 사용하여 완전히 무작위의 결과를 보장합니다. 어떤 조작도 없이 공정한 결과를 제공합니다."
    },
    {
        question: "모바일에서도 사용할 수 있나요?",
        answer: "네, SpinFlow는 반응형 웹 디자인으로 제작되어 PC, 태블릿, 스마트폰 등 모든 기기에서 최적화된 경험을 제공합니다. 별도의 앱 설치 없이 웹 브라우저에서 바로 이용 가능합니다."
    },
    {
        question: "룰렛 항목을 저장할 수 있나요?",
        answer: "현재는 URL을 통해 룰렛 설정을 공유하고 저장할 수 있습니다. URL을 북마크해두시면 나중에 같은 설정으로 다시 이용 가능합니다."
    },
    {
        question: "최대 몇 개의 항목을 추가할 수 있나요?",
        answer: "룰렛에는 최대 100개의 항목을 추가할 수 있으며, 각 항목은 최대 50자까지 입력 가능합니다."
    },
    {
        question: "결과를 친구들과 공유할 수 있나요?",
        answer: "네, 룰렛 결과가 나온 후 카카오톡, 트위터 등 SNS로 결과를 공유하거나 URL을 복사할 수 있습니다. 같은 설정의 룰렛을 친구들과 함께 돌려볼 수도 있습니다."
    },
    {
        question: "개인정보는 어떻게 처리되나요?",
        answer: "SpinFlow는 필요 이상의 개인정보를 수집하지 않습니다. 서비스 이용 과정에서 수집되는 정보는 서비스 개선 목적으로만 사용되며, 자세한 내용은 개인정보처리방침에서 확인하실 수 있습니다."
    },
    {
        question: "문의나 제안은 어떻게 하나요?",
        answer: "문의 페이지 또는 contact@spinflow.pages.dev로 이메일을 보내주시면 됩니다. 서비스 개선 제안, 버그 리포트, 협업 문의 등 모든 의견을 환영합니다."
    },
    {
        question: "어떤 유틸리티 도구들이 있나요?",
        answer: "BMI 계산기, D-Day 계산기, 퍼센트 계산기, 비밀번호 생성기, 글자수 세기, JSON 포맷터, 색상 변환기, QR 코드 생성기 등 20개 이상의 무료 도구를 제공합니다."
    },
    {
        question: "서비스 이용 중 오류가 발생하면 어떻게 하나요?",
        answer: "먼저 페이지를 새로고침 해보시고, 문제가 지속되면 다른 브라우저에서 시도해 보세요. 그래도 해결되지 않으면 문의하기를 통해 오류 내용을 알려주시면 빠르게 해결해 드리겠습니다."
    }
];

export default function FAQ() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <div className="min-h-[100dvh] bg-neon-bg pt-20 pb-20">
            <SEO
                title="자주 묻는 질문 (FAQ) - SpinFlow"
                description="SpinFlow 서비스 이용에 관한 자주 묻는 질문과 답변입니다. 룰렛 사용법, 요금, 개인정보 처리 등에 대해 알아보세요."
                keywords="FAQ, 자주묻는질문, SpinFlow도움말, 룰렛사용법, 서비스안내"
                structuredData={structuredData}
            />

            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-primary/20 rounded-2xl mb-6">
                        <HelpCircle className="text-neon-primary" size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        자주 묻는 질문
                    </h1>
                    <p className="text-gray-400">
                        SpinFlow 서비스 이용에 관한 궁금증을 해결해 드립니다.
                    </p>
                </header>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <details
                            key={index}
                            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-neon-primary/30 transition-colors"
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                <span className="font-bold text-white pr-4">{item.question}</span>
                                <span className="text-neon-primary transition-transform group-open:rotate-180 shrink-0">
                                    ▼
                                </span>
                            </summary>
                            <div className="px-5 pb-5 pt-0">
                                <p className="text-gray-300 leading-relaxed pl-0 border-l-2 border-neon-primary/50 pl-4">
                                    {item.answer}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>

                {/* More Help Section */}
                <div className="mt-12 bg-gradient-to-br from-neon-primary/10 to-purple-500/10 border border-neon-primary/30 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-white mb-3">
                        원하시는 답변을 찾지 못하셨나요?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        추가 문의사항이 있으시면 언제든지 연락해 주세요.
                    </p>
                    <a
                        href="mailto:contact@spinflow.pages.dev"
                        className="inline-flex items-center gap-2 bg-neon-primary text-black font-bold px-6 py-3 rounded-full hover:bg-neon-primary/90 transition-all"
                    >
                        📧 문의하기
                    </a>
                </div>
            </div>
        </div>
    );
}
