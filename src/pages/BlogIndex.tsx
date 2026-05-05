import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getPostPublishDate,
  getPublishedPostMetadata,
} from "@/data/postMetadata";
import SEO from "@/components/SEO";

const SITE_ORIGIN = "https://www.spinkorea.kr";
const INITIAL_POST_COUNT = 12;

export default function BlogIndex() {
  const posts = getPublishedPostMetadata();
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const visiblePosts = posts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < posts.length;

  // Schema.org for Blog
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SpinFlow Blog",
    description:
      "결정 장애 해결, 뇌 과학 팁, 생산성 향상을 위한 다양한 가이드와 이야기.",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishAt ?? post.date,
      url: `${SITE_ORIGIN}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="SpinFlow 블로그 - 결정의 기술 & 생산성 팁"
        description="더 나은 결정을 위한 인사이트. 심리학, 생산성, 그리고 룰렛 활용법에 대한 이야기를 나눕니다."
        keywords="블로그, 결정장애, 생산성, 팁, 라이프스타일, SpinFlow"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold text-cyan-700 mb-3">
            결정과 생산성을 돕는 실용 가이드
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">
            SpinFlow 블로그
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            룰렛, 계산기, 변환 도구를 더 잘 쓰는 방법과 일상 생산성 팁을 정리합니다.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        <div className="grid gap-8">
          {visiblePosts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg">
                <div className="md:flex">
                  {post.thumbnail && (
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div
                    className={`p-6 md:p-8 flex flex-col justify-center ${post.thumbnail ? "md:w-2/3" : "w-full"}`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm text-cyan-700 mb-3">
                      <span>{getPostPublishDate(post)}</span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-950 mb-3 group-hover:text-cyan-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
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
              className="rounded-full border border-cyan-200 bg-white px-6 py-3 font-bold text-cyan-800 shadow-sm transition-colors hover:bg-cyan-50"
            >
              글 더 보기
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
