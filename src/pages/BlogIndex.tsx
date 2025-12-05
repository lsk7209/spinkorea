
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '@/data/posts';
import SEO from '@/components/SEO';

export default function BlogIndex() {
    // Schema.org for Blog
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "SpinFlow Blog",
        "description": "결정 장애 해결, 뇌 과학 팁, 생산성 향상을 위한 다양한 가이드와 이야기.",
        "blogPost": BLOG_POSTS.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": post.date,
            "url": `https://spinflow.kr/blog/${post.slug}`
        }))
    };

    return (
        <div className="min-h-screen bg-neon-bg flex flex-col">
            <SEO
                title="SpinFlow 블로그 - 결정의 기술 & 생산성 팁"
                description="더 나은 결정을 위한 인사이트. 심리학, 생산성, 그리고 룰렛 활용법에 대한 이야기를 나눕니다."
                keywords="블로그, 결정장애, 생산성, 팁, 라이프스타일, SpinFlow"
                structuredData={structuredData}
            />

            <header className="w-full px-4 py-12 border-b border-neon-border/50 bg-neon-bg/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gradient mb-4">
                        SpinFlow Blog
                    </h1>
                    <p className="text-gray-400 text-lg">
                        결정의 순간을 더 가볍고 즐겁게 만드는 이야기
                    </p>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                <div className="grid gap-8">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="block group"
                        >
                            <article className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neon-primary/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                                <div className="md:flex">
                                    {post.thumbnail && (
                                        <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    )}
                                    <div className={`p-6 md:p-8 flex flex-col justify-center ${post.thumbnail ? 'md:w-2/3' : 'w-full'}`}>
                                        <div className="flex items-center gap-3 text-sm text-neon-primary mb-3">
                                            <span>{post.date}</span>
                                            {post.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded-full bg-neon-primary/10 border border-neon-primary/20 text-xs">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 leading-relaxed line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
