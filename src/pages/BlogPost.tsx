import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import type { BlogPost } from "@/data/posts";
import {
  findPublishedPostMetadata,
  getPostPublishDate,
  type BlogPostMeta,
} from "@/data/postMetadata";
import SEO from "@/components/SEO";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "@/utils/analytics";

const SITE_ORIGIN = "https://www.spinkorea.kr";

function hasFinalConsonant(value: string): boolean {
  const last = [...value.trim()].at(-1);
  if (!last) {
    return false;
  }

  const code = last.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

function particle(value: string, consonant: string, vowel: string): string {
  return `${value}${hasFinalConsonant(value) ? consonant : vowel}`;
}

function withEulReul(value: string): string {
  return particle(value, "을", "를");
}

function getGeneratedTopic(title: string): string {
  return title.split(/[,，:：]/)[0]?.trim() || title;
}

async function loadPostContent(meta: BlogPostMeta): Promise<BlogPost | undefined> {
  if (meta.source === "generated") {
    const { loadGeneratedBlogPost } = await import("@/data/generatedContent");
    return loadGeneratedBlogPost(meta.slug);
  }

  const { CURATED_BLOG_POSTS } = await import("@/data/posts");
  return CURATED_BLOG_POSTS.find((post) => post.slug === meta.slug);
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = findPublishedPostMetadata(slug);
  const [contentPost, setContentPost] = useState<BlogPost | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    setContentPost(null);
    setLoadFailed(false);

    if (!post) {
      return () => {
        mounted = false;
      };
    }

    void loadPostContent(post)
      .then((loadedPost) => {
        if (!mounted) {
          return;
        }

        if (loadedPost) {
          setContentPost(loadedPost);
        } else {
          setLoadFailed(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoadFailed(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [post?.slug]);

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

  const blogPostingStructuredData = {
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
  const generatedTopic = getGeneratedTopic(post.title);
  const faqStructuredData =
    post.source === "generated"
      ? {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `${withEulReul(generatedTopic)} 처음 적용할 때 가장 먼저 볼 것은 무엇인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "목적, 제외 조건, 결과 기록 방식을 먼저 나누는 것이 좋습니다. 기준을 먼저 정하면 같은 결정을 반복해서 다시 논의하는 일을 줄일 수 있습니다.",
              },
            },
            {
              "@type": "Question",
              name: `${generatedTopic}에는 어떤 기준이 실용적인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "바로 실행할 수 있는 선택지, 나중에 확인 가능한 기록, 공식 참고 자료를 함께 두는 기준이 실용적입니다.",
              },
            },
            {
              "@type": "Question",
              name: `${generatedTopic} 결과가 마음에 들지 않으면 다시 정해도 되나요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "가능하지만 반복 횟수와 예외 조건을 미리 정해야 합니다. 기준 없는 재선택은 공정성과 신뢰도를 낮출 수 있습니다.",
              },
            },
            {
              "@type": "Question",
              name: `${withEulReul(generatedTopic)} 글이나 도구 페이지에 연결할 때 주의할 점은 무엇인가요?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: "독자가 바로 실행할 수 있는 내부 링크와 공식 참고 자료를 함께 제시해야 합니다. 설명만 있고 실행 경로가 없으면 체류와 전환이 약해집니다.",
              },
            },
          ],
        }
      : undefined;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [blogPostingStructuredData, faqStructuredData].filter(Boolean),
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
            {contentPost ? (
              contentPost.content
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                {loadFailed
                  ? "글 본문을 불러오지 못했습니다."
                  : "글 본문을 불러오고 있습니다."}
              </div>
            )}
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
