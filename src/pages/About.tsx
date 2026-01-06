import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Target, Zap, Users, Heart } from 'lucide-react';

export default function About() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "SpinFlow 소개",
        "description": "SpinFlow는 일상의 결정을 돕는 무료 온라인 유틸리티 서비스입니다.",
        "url": "https://spinflow.kr/about"
    };

    return (
        <div className="min-h-[100dvh] bg-neon-bg">
            <SEO
                title="SpinFlow 소개 - 결정의 순간을 돕는 서비스"
                description="SpinFlow는 일상의 크고 작은 결정을 돕는 무료 온라인 유틸리티 서비스입니다. 룰렛 돌리기, BMI 계산기, 비밀번호 생성기 등 다양한 도구를 제공합니다."
                keywords="SpinFlow, 스핀플로우, 서비스소개, 온라인도구, 결정장애, 룰렛"
                structuredData={structuredData}
            />

            {/* Hero Section */}
            <header className="w-full relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-16 px-4">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-aurora-primary/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-aurora-purple/15 rounded-full blur-[120px]" />
                </div>

                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        <span className="text-gradient">SpinFlow</span>에 대하여
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        결정이 어려운 순간, SpinFlow가 함께합니다.<br />
                        우리는 일상의 크고 작은 선택을 더 쉽고 즐겁게 만들어 드립니다.
                    </p>
                </div>
            </header>

            {/* Mission Section */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Target className="text-neon-primary" size={28} />
                        우리의 미션
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-lg mb-6">
                        현대인은 하루에 약 <strong className="text-white">35,000번</strong>의 결정을 내린다고 합니다.
                        점심 메뉴 선택부터 중요한 업무 결정까지, 끊임없는 선택의 연속 속에서 우리의 뇌는 지쳐갑니다.
                    </p>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        SpinFlow는 이러한 <strong className="text-neon-primary">결정 피로(Decision Fatigue)</strong>를 줄여드리기 위해 탄생했습니다.
                        사소한 결정은 운에 맡기고, 정말 중요한 일에 에너지를 집중하세요.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">주요 서비스</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neon-primary/50 transition-colors">
                        <div className="w-12 h-12 bg-neon-primary/20 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="text-neon-primary" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">랜덤 룰렛</h3>
                        <p className="text-gray-400 text-sm">
                            점심 메뉴, 벌칙 정하기, 당첨자 추첨 등 다양한 상황에서 공정한 랜덤 선택을 제공합니다.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neon-secondary/50 transition-colors">
                        <div className="w-12 h-12 bg-neon-secondary/20 rounded-xl flex items-center justify-center mb-4">
                            <Users className="text-neon-secondary" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">유틸리티 도구</h3>
                        <p className="text-gray-400 text-sm">
                            BMI 계산기, 비밀번호 생성기, 글자수 세기 등 일상에 유용한 20개 이상의 무료 도구를 제공합니다.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-aurora-accent/50 transition-colors">
                        <div className="w-12 h-12 bg-aurora-accent/20 rounded-xl flex items-center justify-center mb-4">
                            <Heart className="text-aurora-accent" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">블로그</h3>
                        <p className="text-gray-400 text-sm">
                            결정 심리학, 생산성 팁, 건강 관리 가이드 등 유용한 정보를 공유합니다.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-gradient-to-br from-neon-primary/10 to-purple-500/10 border border-neon-primary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-white mb-6">우리가 중요하게 생각하는 것</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="text-2xl">🆓</span>
                            <div>
                                <h3 className="font-bold text-white">완전 무료</h3>
                                <p className="text-gray-400 text-sm">모든 서비스는 무료로 제공되며, 회원가입 없이 바로 이용 가능합니다.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-bold text-white">개인정보 보호</h3>
                                <p className="text-gray-400 text-sm">필요 이상의 개인정보를 수집하지 않으며, 모든 데이터는 안전하게 처리됩니다.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="text-2xl">📱</span>
                            <div>
                                <h3 className="font-bold text-white">어디서나 접근 가능</h3>
                                <p className="text-gray-400 text-sm">PC, 태블릿, 모바일 어디서든 최적화된 경험을 제공합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 py-12 pb-20">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
                    <p className="text-gray-400 mb-8">결정이 어려울 때, SpinFlow가 도와드립니다.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="bg-neon-primary text-black font-bold px-8 py-3 rounded-full hover:bg-neon-primary/90 transition-all transform hover:scale-105"
                        >
                            룰렛 돌리기
                        </Link>
                        <Link
                            to="/tools"
                            className="bg-white/10 text-white font-bold px-8 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20"
                        >
                            유틸리티 둘러보기
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
