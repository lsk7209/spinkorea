import MoreTools from '@/components/MoreTools';
import SEO from '@/components/SEO';

export default function ToolsIndex() {
    return (
        <div className="min-h-[100dvh] bg-aurora-bg pt-20 pb-20">
            <SEO
                title="무료 유틸리티 모음 37종 | SpinFlow — 계산기·변환·랜덤 도구"
                description="연봉 실수령액·부가세·평수·시급·대출·복리·퇴직금·연차 계산기, 로또, QR 코드, 글자수, JSON 포맷터 등 37가지 무료 웹 도구를 한 곳에서 사용하세요. 설치 없이 바로 이용 가능."
                keywords="무료웹도구, 연봉실수령액계산기, 시급계산기, 대출계산기, 전월세계산기, 복리계산기, 퇴직금계산기, 연차계산기, 로또번호생성, QR코드생성, 글자수세기, 유틸리티모음"
            />

            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-white drop-shadow-lg">
                    <span className="text-gradient">무료 웹 유틸리티</span> 모음
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    일상을 더 편리하게 만드는 다양한 웹 도구들을 무료로 사용하세요.
                </p>
            </div>

            <MoreTools showSearch />
        </div>
    );
}
