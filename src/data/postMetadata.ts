import postMetadata from "./post-metadata.generated.json";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  publishAt?: string;
  tags: string[];
  thumbnail?: string;
  qualityScore?: number;
  source: "curated" | "generated";
}

export const BLOG_POST_METADATA = postMetadata as BlogPostMeta[];

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
