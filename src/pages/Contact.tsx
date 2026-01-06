import SEO from '@/components/SEO';
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "SpinFlow 문의하기",
        "description": "SpinFlow 서비스에 대한 문의, 제안, 협업 요청을 받습니다.",
        "url": "https://spinflow.kr/contact"
    };

    return (
        <div className="min-h-[100dvh] bg-neon-bg pt-20 pb-20">
            <SEO
                title="문의하기 - SpinFlow"
                description="SpinFlow 서비스에 대한 문의, 제안, 버그 리포트, 협업 요청을 환영합니다. 이메일로 연락해 주세요."
                keywords="문의하기, 연락처, SpinFlow연락처, 고객지원, 피드백"
                structuredData={structuredData}
            />

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-primary/20 rounded-2xl mb-6">
                        <MessageSquare className="text-neon-primary" size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        문의하기
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        SpinFlow 서비스에 대한 문의, 제안, 협업 요청을 환영합니다.<br />
                        아래 방법을 통해 연락해 주세요.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Methods */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white mb-4">연락 방법</h2>

                        {/* Email */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-neon-primary/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neon-primary/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="text-neon-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">이메일</h3>
                                    <a
                                        href="mailto:contact@spinflow.pages.dev"
                                        className="text-neon-primary hover:underline"
                                    >
                                        contact@spinflow.pages.dev
                                    </a>
                                    <p className="text-gray-500 text-sm mt-2">
                                        일반 문의, 협업 제안, 버그 리포트
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Response Time */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-neon-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="text-neon-secondary" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">응답 시간</h3>
                                    <p className="text-gray-300">평일 기준 24~48시간 이내</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        주말 및 공휴일에는 답변이 지연될 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-aurora-accent/20 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-aurora-accent" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">서비스 정보</h3>
                                    <p className="text-gray-300">SpinFlow</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        대한민국에서 운영되는 온라인 서비스입니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Categories */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">문의 유형</h2>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                            <div className="pb-4 border-b border-white/10">
                                <h3 className="font-bold text-white mb-2">💡 서비스 제안</h3>
                                <p className="text-gray-400 text-sm">
                                    새로운 기능이나 도구에 대한 아이디어가 있으시면 알려주세요.
                                    여러분의 제안이 실제 서비스에 반영될 수 있습니다.
                                </p>
                            </div>

                            <div className="pb-4 border-b border-white/10">
                                <h3 className="font-bold text-white mb-2">🐛 버그 리포트</h3>
                                <p className="text-gray-400 text-sm">
                                    서비스 이용 중 오류를 발견하셨나요?
                                    발생 상황과 스크린샷을 함께 보내주시면 빠르게 해결해 드리겠습니다.
                                </p>
                            </div>

                            <div className="pb-4 border-b border-white/10">
                                <h3 className="font-bold text-white mb-2">🤝 협업 문의</h3>
                                <p className="text-gray-400 text-sm">
                                    비즈니스 협업, 제휴, 광고 문의 등을 환영합니다.
                                    구체적인 제안 내용과 함께 연락해 주세요.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-white mb-2">❓ 기타 문의</h3>
                                <p className="text-gray-400 text-sm">
                                    위에 해당하지 않는 기타 문의사항도 환영합니다.
                                    편하게 연락해 주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-12 bg-gradient-to-br from-neon-primary/10 to-purple-500/10 border border-neon-primary/30 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">빠른 도움</h2>
                    <p className="text-gray-400 text-center mb-6">
                        문의하기 전에 아래 페이지에서 원하시는 답변을 찾아보세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/faq"
                            className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20 text-center"
                        >
                            자주 묻는 질문
                        </Link>
                        <Link
                            to="/privacy"
                            className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20 text-center"
                        >
                            개인정보처리방침
                        </Link>
                        <Link
                            to="/terms"
                            className="bg-white/10 text-white font-bold px-6 py-3 rounded-full hover:bg-white/20 transition-all border border-white/20 text-center"
                        >
                            이용약관
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
