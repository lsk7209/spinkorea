import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, HelpCircle, Wrench } from 'lucide-react';
import SEO, { type SEOProps } from '@/components/SEO';

interface FAQItem {
    question: string;
    answer: string;
}

interface RelatedTool {
    name: string;
    path: string;
    description: string;
}

interface ToolLayoutProps extends SEOProps {
    children: ReactNode;
    title: string;
    description: string;
    /** 사용 방법 단계별 설명 */
    howToUse?: string[];
    /** 활용 팁 목록 */
    tips?: string[];
    /** FAQ 항목들 */
    faqs?: FAQItem[];
    /** 관련 도구들 */
    relatedTools?: RelatedTool[];
}

export default function ToolLayout({
    children,
    title,
    description,
    howToUse,
    tips,
    faqs,
    relatedTools,
    ...seoProps
}: ToolLayoutProps) {
    // Generate FAQ structured data
    const faqStructuredData = faqs && faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : undefined;

    return (
        <div className="min-h-screen bg-neon-bg flex flex-col">
            <SEO
                title={title}
                description={description}
                structuredData={faqStructuredData}
                {...seoProps}
            />

            {/* Header */}
            <header className="w-full px-4 py-4 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-black/30">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 group-hover:border-neon-primary/50">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        </span>
                        <span className="font-medium hidden sm:inline">메인으로</span>
                    </Link>
                    <h1 className="text-lg md:text-xl font-bold text-gradient truncate text-center flex-1">
                        {title}
                    </h1>
                    <div className="w-12 sm:w-16" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
                {/* Tool Container */}
                <div className="card card-hover p-6 md:p-8 shadow-2xl shadow-neon-primary/10">
                    {children}
                </div>

                {/* About this tool */}
                <div className="card border-white/10 p-6">
                    <h2 className="text-xl font-semibold text-neon-primary mb-3">About this tool</h2>
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>

                {/* How to Use */}
                {howToUse && howToUse.length > 0 && (
                    <div className="card border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-neon-secondary mb-4 flex items-center gap-2">
                            <Wrench size={20} />
                            사용 방법
                        </h2>
                        <ol className="space-y-3">
                            {howToUse.map((step, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neon-secondary/20 text-neon-secondary font-bold text-sm flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-300 pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Tips */}
                {tips && tips.length > 0 && (
                    <div className="card border-white/10 p-6 bg-gradient-to-br from-yellow-500/5 to-transparent">
                        <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                            <Lightbulb size={20} />
                            활용 팁
                        </h2>
                        <ul className="space-y-2">
                            {tips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-300">
                                    <span className="text-yellow-400">💡</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* FAQ */}
                {faqs && faqs.length > 0 && (
                    <div className="card border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-neon-primary mb-4 flex items-center gap-2">
                            <HelpCircle size={20} />
                            자주 묻는 질문
                        </h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <details
                                    key={index}
                                    className="group bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                                >
                                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-medium text-white hover:bg-white/5 transition-colors">
                                        <span>{faq.question}</span>
                                        <span className="text-neon-primary transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <div className="px-4 pb-4 text-gray-400 border-t border-white/10 pt-3">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Tools */}
                {relatedTools && relatedTools.length > 0 && (
                    <div className="card border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">관련 도구</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {relatedTools.map((tool, index) => (
                                <Link
                                    key={index}
                                    to={tool.path}
                                    className="block p-4 bg-white/5 rounded-xl border border-white/10 hover:border-neon-primary/50 hover:bg-white/10 transition-all group"
                                >
                                    <h3 className="font-bold text-white group-hover:text-neon-primary transition-colors">
                                        {tool.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">{tool.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
