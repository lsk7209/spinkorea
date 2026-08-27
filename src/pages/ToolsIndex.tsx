import { Link } from 'react-router-dom';
import MoreTools, { TOOLS } from '@/components/MoreTools';
import SEO from '@/components/SEO';
import { trackEvent } from '@/utils/analytics';

const SITE_ORIGIN = 'https://spinkorea.kr';

const QUICK_PATHS = [
    { name: '연봉 실수령액 계산', path: '/tools/net-salary' },
    { name: '대출 이자 계산', path: '/tools/loan-calculator' },
    { name: '글자수 세기', path: '/tools/text-counter' },
    { name: '랜덤 팀 나누기', path: '/tools/random-team' },
    { name: 'QR 코드 만들기', path: '/tools/qr-code-generator' },
    { name: 'BMI 계산', path: '/tools/bmi-calculator' },
];

export default function ToolsIndex() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${SITE_ORIGIN}/tools#collection`,
                name: "SpinFlow 무료 웹 도구 모음",
                description: "계산기, 랜덤 추첨, 텍스트 변환, 개발 및 생활 도구를 회원가입 없이 이용할 수 있는 모음입니다.",
                url: `${SITE_ORIGIN}/tools`,
                inLanguage: "ko-KR",
            },
            {
                "@type": "ItemList",
                name: "무료 웹 도구 목록",
                numberOfItems: TOOLS.length,
                itemListElement: TOOLS.map((tool, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: tool.name,
                    url: `${SITE_ORIGIN}${tool.path}`,
                })),
            },
        ],
    };

    return (
        <div className="min-h-[100dvh] bg-aurora-bg pt-20 pb-20">
            <SEO
                title="무료 유틸리티 모음 51종 | SpinFlow — 계산기·변환·랜덤 도구"
                description="연봉 실수령액·할인율·더치페이·투자수익률 계산기, 시급·대출·복리·퇴직금 계산기, 단어 빈도 분석기, UUID 생성기, 이상 체중 계산기 등 51가지 무료 웹 도구를 한 곳에서 사용하세요."
                keywords="무료웹도구, 연봉실수령액계산기, 시급계산기, 대출계산기, 전월세계산기, 복리계산기, 퇴직금계산기, 연차계산기, 로또번호생성, QR코드생성, 글자수세기, 유틸리티모음"
                structuredData={structuredData}
            />

            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white drop-shadow-lg">
                    <span className="text-gradient">무료 웹 유틸리티</span> 모음
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    일상을 더 편리하게 만드는 다양한 웹 도구들을 무료로 사용하세요.
                </p>
                <p className="mt-4 text-sm leading-6 text-gray-300 max-w-3xl mx-auto">
                    필요한 계산이나 변환을 선택하면 입력값은 브라우저에서 바로 처리됩니다. 검색창에서 도구 이름을 찾거나 목적별 바로가기를 선택하세요.
                </p>
                <nav className="mt-7 flex flex-wrap justify-center gap-2" aria-label="목적별 도구 바로가기">
                    {QUICK_PATHS.map((tool) => (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            onClick={() => trackEvent('internal_tool_clicked', {
                                source_path: '/tools',
                                destination_path: tool.path,
                                placement: 'quick_paths',
                            })}
                            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition-colors hover:border-cyan-300 hover:bg-cyan-400/20"
                        >
                            {tool.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <MoreTools showSearch />
        </div>
    );
}
