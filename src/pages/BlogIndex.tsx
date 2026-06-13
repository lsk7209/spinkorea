import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getPostPublishDate,
  getPublishedPostMetadata,
} from "@/data/postMetadata";
import SEO from "@/components/SEO";

const SITE_ORIGIN = "https://spinkorea.kr";
const INITIAL_POST_COUNT = 12;

export default function BlogIndex() {
  const posts = getPublishedPostMetadata();
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < posts.length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SpinFlow 블로그",
    description:
      "결정 장애 해결, 생산성 향상, 온라인 도구 활용 가이드.",
    blogPost: posts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishAt ?? post.date,
      url: `${SITE_ORIGIN}/blog/${post.slug}`,
      image: post.thumbnail,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="블로그 - 룰렛·생산성·도구 활용 가이드 | SpinFlow"
        description="룰렛 활용법, 결정 심리학, 생산성 팁, 온라인 도구 가이드를 정리한 SpinFlow 블로그입니다."
        keywords="블로그, 룰렛 활용법, 결정장애, 생산성, 온라인 도구, SpinFlow"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">
            SpinFlow Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">
            결정·생산성·도구 가이드
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            룰렛, 계산기, 변환 도구를 더 잘 쓰는 방법과 일상 생산성 팁을 정리합니다.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg flex flex-col">
                {post.thumbnail && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      loading={index < 6 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-cyan-700 mb-2">
                    <span className="text-slate-400">{getPostPublishDate(post)}</span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-base font-bold text-slate-950 mb-2 group-hover:text-cyan-700 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {post.description}
                  </p>
                  <span className="mt-3 text-xs font-semibold text-cyan-700 group-hover:underline">
                    읽기 →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {hasMorePosts && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + INITIAL_POST_COUNT)}
              className="rounded-full border border-cyan-200 bg-white px-8 py-3 font-bold text-cyan-800 shadow-sm transition-colors hover:bg-cyan-50"
            >
              글 더 보기 ({posts.length - visibleCount}개 남음)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
