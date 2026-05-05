import { useParams, Navigate, Link } from "react-router-dom";
import { BLOG_POSTS, getPostPublishDate, isPublishedPost } from "@/data/posts";
import SEO from "@/components/SEO";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";

const SITE_ORIGIN = "https://www.spinkorea.kr";

export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug && isPublishedPost(p));

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = async () => {
    const url = window.location.href;
    trackEvent("share_clicked", {
      content_type: "blog_post",
      slug: post.slug,
    });
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: url,
        });
      } catch {
        return;
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었습니다!");
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.description,
    image: post.thumbnail || `${SITE_ORIGIN}/og-image.png`,
    author: {
      "@type": "Organization",
      name: "SpinFlow",
    },
    publisher: {
      "@type": "Organization",
      name: "SpinFlow",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/og-image.png`,
      },
    },
    datePublished: post.publishAt ?? post.date,
    dateModified: post.publishAt ?? post.date,
    url: `${SITE_ORIGIN}/blog/${post.slug}`,
    inLanguage: "ko-KR",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col pb-20">
      <SEO
        title={post.title}
        description={post.description}
        image={post.thumbnail}
        structuredData={structuredData}
      />

      <nav className="w-full px-4 py-6 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-slate-600 hover:text-cyan-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>블로그 홈</span>
          </Link>
          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-cyan-700 transition-colors"
            aria-label="공유하기"
          >
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      <main>
        <article className="flex-1 w-full max-w-4xl mx-auto px-4 mt-8">
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {getPostPublishDate(post)}
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-cyan-700 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-950 leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              {post.description}
            </p>
          </header>

          {post.thumbnail && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={post.thumbnail}
                alt={post.title}
                loading="eager"
                decoding="async"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          <div className="article-content-light prose prose-slate prose-lg max-w-none prose-a:text-cyan-700 prose-headings:text-slate-950">
            {post.content}
          </div>
        </article>

        <section className="mt-20 px-4">
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-950 mb-4">
              관련 도구로 바로 확인해 보세요
            </h3>
            <p className="text-slate-600 mb-8">
              글에서 정리한 기준을 실제 선택, 계산, 기록 도구에 바로 적용할 수 있습니다.
              <br />
              필요한 상황에 맞는 도구를 열어 결과를 확인해 보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-cyan-700 text-white font-bold px-8 py-3 rounded-full hover:bg-cyan-800 transition-all"
              >
                무료 룰렛 돌리기
              </Link>
              <Link
                to="/lunch-menu"
                className="bg-slate-100 text-slate-950 font-bold px-8 py-3 rounded-full hover:bg-slate-200 transition-all border border-slate-200"
              >
                점심 메뉴 추천받기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
