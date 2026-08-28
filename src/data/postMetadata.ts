import postMetadata from "./post-metadata.runtime.generated.json";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  tags: string[];
  thumbnail?: string;
  qualityScore?: number;
  source: "curated" | "editorial" | "generated";
}

export const BLOG_POST_METADATA = postMetadata as BlogPostMeta[];

/**
 * Search listings are intentionally limited to editorial posts that have been
 * reviewed as part of the public SpinFlow guide. Generated posts can remain
 * reachable by their existing URLs while they await an editorial review.
 */
export function isIndexablePost(post: BlogPostMeta): boolean {
  return post.source === "curated" || post.source === "editorial";
}

export function getPostPublishDate(post: BlogPostMeta): string {
  return post.publishAt?.slice(0, 10) ?? post.date;
}

export function getPostPublishTime(post: BlogPostMeta): number {
  return new Date(post.publishAt ?? `${post.date}T00:00:00+09:00`).getTime();
}

export function isPublishedPost(post: BlogPostMeta, now = new Date()): boolean {
  return getPostPublishTime(post) <= now.getTime();
}

export function getPublishedPostMetadata(now = new Date()): BlogPostMeta[] {
  return BLOG_POST_METADATA.filter((post) => isPublishedPost(post, now)).sort(
    (a, b) => getPostPublishTime(b) - getPostPublishTime(a),
  );
}

export function getIndexablePostMetadata(now = new Date()): BlogPostMeta[] {
  return getPublishedPostMetadata(now).filter(isIndexablePost);
}

export function findPublishedPostMetadata(
  slug: string | undefined,
  now = new Date(),
): BlogPostMeta | undefined {
  if (!slug) {
    return undefined;
  }

  return BLOG_POST_METADATA.find(
    (post) => post.slug === slug && isPublishedPost(post, now),
  );
}
