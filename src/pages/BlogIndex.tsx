import { useState } from "react";
import { Link } from "react-router-dom";
import {
  getPostPublishDate,
  getIndexablePostMetadata,
} from "@/data/postMetadata";
import SEO from "@/components/SEO";
import { trackEvent } from "@/utils/analytics";

const SITE_ORIGIN = "https://spinkorea.kr";
const INITIAL_POST_COUNT = 12;

export default function BlogIndex() {
  const posts = getIndexablePostMetadata();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const categories = [...new Set(posts.flatMap(post => post.tags))].sort();
  const filteredPosts = posts.filter(post => (!category || post.tags.includes(category)) && `${post.title} ${post.description} ${post.tags.join(' ')}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const [visibleCount, setVisibleCount] = useState(INITIAL_POST_COUNT);
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;

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
    <div className="guide-page min-h-screen bg-slate-50 text-slate-950 flex flex-col">
      <SEO
        title="블로그 - 룰렛·생산성·도구 활용 가이드 | SpinFlow"
        description="룰렛 활용법, 결정 심리학, 생산성 팁, 온라인 도구 가이드를 정리한 SpinFlow 블로그입니다."
        keywords="블로그, 룰렛 활용법, 결정장애, 생산성, 온라인 도구, SpinFlow"
        structuredData={structuredData}
      />

      <header className="w-full px-4 pt-28 pb-12 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-bold text-cyan-700 mb-3 uppercase tracking-widest">
            사용 가이드
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-950 mb-4">
            함께 정하는 일을 더 쉽게
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
            룰렛, 계산기, 변환 도구를 더 잘 쓰는 방법과 일상 생산성 팁을 정리합니다.
          </p>
        </div>
      </header>

      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="guide-search">
          <div><label htmlFor="guide-query">어떤 도움이 필요한가요?</label><input id="guide-query" type="search" value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(INITIAL_POST_COUNT);}} placeholder="제목, 내용으로 가이드 찾기" /></div>
          <div><label htmlFor="guide-category">분류</label><select id="guide-category" value={category} onChange={e=>{setCategory(e.target.value);setVisibleCount(INITIAL_POST_COUNT);}}><option value="">전체 가이드</option>{categories.map(tag=><option key={tag}>{tag}</option>)}</select></div>
        </div>
        <p className="mb-6 text-sm" role="status">{filteredPosts.length}개의 가이드</p>
        {filteredPosts.length===0 && <div className="guide-empty"><h2>찾는 가이드가 없습니다</h2><p>검색어를 줄이거나 다른 분류를 선택해 보세요.</p><button type="button" onClick={()=>{setQuery('');setCategory('');}}>전체 가이드 보기</button></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              aria-label={post.title}
              onClick={() => trackEvent('content_selected', {
                content_type: 'blog_post',
                slug: post.slug,
                position: index + 1,
              })}
              className="block group"
            >
              <article className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg flex flex-col">
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
              onClick={() => {
                setVisibleCount((count) => count + INITIAL_POST_COUNT);
                trackEvent('content_list_expanded', {
                  content_type: 'blog_post',
                  visible_count: Math.min(visibleCount + INITIAL_POST_COUNT, filteredPosts.length),
                });
              }}
              className="rounded-full border border-cyan-200 bg-white px-8 py-3 font-bold text-cyan-800 shadow-sm transition-colors hover:bg-cyan-50"
            >
              글 더 보기 ({filteredPosts.length - visibleCount}개 남음)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
