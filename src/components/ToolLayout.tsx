import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO, { SEOProps } from '@/components/SEO';

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
            <header className="w-full px-4 py-4 border-b border-neon-border/50 backdrop-blur-md sticky top-0 z-50 bg-neon-bg/80">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Home</span>
                    </Link>
                    <h1 className="text-lg md:text-xl font-bold text-gradient truncate max-w-[200px] md:max-w-none">
                        {title}
                    </h1>
                    <div className="w-16"></div> {/* Spacer for center alignment */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Tool Container */}
                <div className="bg-neon-dark border border-neon-border rounded-2xl p-6 md:p-8 shadow-2xl shadow-neon-primary/5 mb-8">
                    {children}
                </div>

                {/* Description & Ad Slot Placeholder */}
                <div className="prose prose-invert max-w-none">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-center text-gray-400 text-sm">
                        {/* Adsense Slot Placeholder */}
                        <p>Advertisement Area</p>
                    </div>

                    <div className="bg-neon-dark/50 border border-neon-border/30 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-neon-primary mb-4">About this Tool</h2>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
