import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO, { type SEOProps } from '@/components/SEO';

interface ToolLayoutProps extends SEOProps {
    children: ReactNode;
    title: string;
    description: string;
}

export default function ToolLayout({
    children,
    title,
    description,
    ...seoProps
}: ToolLayoutProps) {
    return (
        <div className="min-h-screen bg-neon-bg flex flex-col">
            <SEO title={title} description={description} {...seoProps} />

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
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-6">
                {/* Tool Container */}
                <div className="card card-hover p-6 md:p-8 shadow-2xl shadow-neon-primary/10">
                    {children}
                </div>

                {/* Description */}
                <div className="grid gap-4 md:grid-cols-[1fr]">
                    <div className="card border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-neon-primary mb-3">About this tool</h2>
                        <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
