
import { useParams, Navigate, Link } from 'react-router-dom';
import { BLOG_POSTS } from '@/data/posts';
import SEO from '@/components/SEO';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPost() {
    const { slug } = useParams();
    const post = BLOG_POSTS.find(p => p.slug === slug);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.description,
                    url: url,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('링크가 복사되었습니다!');
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://spinflow.kr/blog/${post.slug}`
        },
        "headline": post.title,
        "description": post.description,
        "image": post.thumbnail || "https://spinflow.kr/og-image.png",
        "author": {
            "@type": "Organization",
            "name": "SpinFlow"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SpinFlow",
            "logo": {
                "@type": "ImageObject",
                "url": "https://spinflow.kr/icon-192.png"
            }
        },
        "datePublished": post.date
    };

    return (
        <div className="min-h-screen bg-neon-bg flex flex-col pb-20">
            <SEO
                title={post.title}
                description={post.description}
                image={post.thumbnail}
                structuredData={structuredData}
            />

            <nav className="w-full px-4 py-6 border-b border-neon-border/30 bg-neon-bg/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link to="/blog" className="flex items-center gap-2 text-gray-400 hover:text-neon-primary transition-colors">
                        <ArrowLeft size={20} />
                        <span>블로그 홈</span>
                    </Link>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        aria-label="공유하기"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </nav>

            <article className="flex-1 w-full max-w-4xl mx-auto px-4 mt-8">
                <header className="mb-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {post.date}
                        </span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <div className="flex gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="text-neon-primary bg-neon-primary/10 px-2 py-0.5 rounded-full text-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                        {post.title}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        {post.description}
                    </p>
                </header>

                {post.thumbnail && (
                    <div className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-a:text-neon-primary prose-headings:text-neon-primary">
                    {post.content}
                </div>
            </article>

            {/* CTA Section */}
            <section className="mt-20 px-4">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-neon-primary/10 to-purple-500/10 border border-neon-primary/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-4">지금 바로 결정의 순간을 즐겨보세요!</h3>
                    <p className="text-gray-300 mb-8">
                        고민할 시간에 룰렛을 돌리세요. 운명이 당신을 기다립니다.<br />
                        SpinFlow와 함께라면 결정이 놀이가 됩니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="bg-neon-primary text-black font-bold px-8 py-3 rounded-full hover:bg-neon-primary/90 transition-all transform hover:scale-105"
                        >
                            무료 룰렛 돌리기
                        </Link>
                        <Link
                            to="/lunch-menu"
                            className="bg-white/10 text-white font-bold px-8 py-3 rounded-full hover:bg-white/20 transition-all border border-white/10 border-white/20"
                        >
                            점심 메뉴 추천받기
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
