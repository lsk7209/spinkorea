import MoreTools from '@/components/MoreTools';
import SEO from '@/components/SEO';

export default function ToolsIndex() {
    return (
        <div className="min-h-[100dvh] bg-aurora-bg pt-20 pb-20">
            <SEO
                title="유틸리티 모음 - SpinFlow | 로또, 주사위, 글자수 세기 등"
                description="다양한 무료 웹 유틸리티를 만나보세요. 로또 번호 생성, 주사위, 코인 던지기, 글자수 세기, JSON 포맷터 등 편리한 도구 모음."
                keywords="웹도구, 유틸리티, 온라인툴, 개발자도구, 랜덤생성기, 계산기, 변환기"
            />

            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white drop-shadow-lg">
                    <span className="text-gradient">Utilities</span> Collection
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    일상을 더 편리하게 만드는 다양한 웹 도구들을 무료로 사용하세요.
                </p>
            </div>

            <MoreTools />
        </div>
    );
}
