/**
 * Post metadata merge contract (SPK2-06).
 *
 * The generated metadata cache is the record of publication identity:
 * slug, first publish date, publish schedule and review/index source must
 * never be silently rewritten by a rebuild. Editorial fields, however, are
 * owned by the current content source, so an edited title/description has to
 * reach the generated HTML, OG tags and schema.
 */

/** Fields whose value in the existing cache is authoritative. */
export const PRESERVED_FIELDS = Object.freeze(["slug", "date", "publishAt", "source"]);

/** Fields the current content source owns and may update. */
export const EDITABLE_FIELDS = Object.freeze(["title", "description", "tags", "thumbnail"]);

function isSameValue(left, right) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function mergeRecord(existing, fresh) {
  const changedFields = EDITABLE_FIELDS.filter(
    (field) => fresh[field] !== undefined && !isSameValue(existing[field], fresh[field]),
  );
  if (changedFields.length === 0) {
    return { record: existing, changedFields };
  }

  const record = { ...existing };
  for (const field of changedFields) {
    record[field] = fresh[field];
  }
  return { record, changedFields };
}

/**
 * Merge freshly extracted posts into the existing metadata cache.
 *
 * - Existing order and publication identity fields are preserved.
 * - Editable fields from the fresh source replace stale cached values.
 * - `updatedAt` is only set when an editable field actually changed and a
 *   real modification date is supplied; rebuilding without edits is a no-op.
 * - Records that exist only in the cache (e.g. retired sources) are kept.
 *
 * @param {Array<Record<string, unknown>>} existing
 * @param {Array<Record<string, unknown>>} freshPosts
 * @param {{ modifiedDate?: string }} [options]
 * @returns {{ posts: Array<Record<string, unknown>>, changes: Array<{ slug: string, fields: string[] }> }}
 */
export function mergePostMetadata(existing, freshPosts, options = {}) {
  const { modifiedDate } = options;
  const freshBySlug = new Map();
  for (const post of freshPosts) {
    if (!freshBySlug.has(post.slug)) freshBySlug.set(post.slug, post);
  }

  const changes = [];
  const existingSlugs = new Set();
  const merged = existing.map((record) => {
    existingSlugs.add(record.slug);
    const fresh = freshBySlug.get(record.slug);
    if (!fresh) return record;

    const { record: next, changedFields } = mergeRecord(record, fresh);
    if (changedFields.length === 0) return record;

    changes.push({ slug: record.slug, fields: changedFields });
    return modifiedDate ? { ...next, updatedAt: modifiedDate } : next;
  });

  const added = freshPosts.filter((post) => !existingSlugs.has(post.slug));
  return { posts: [...merged, ...added], changes };
}

/**
 * Parse the existing metadata cache. Corrupt caches fail closed instead of
 * silently falling back to raw sources, because the fallback could change
 * publication dates and index boundaries.
 *
 * @param {string | null} raw
 * @returns {Array<Record<string, unknown>> | null}
 */
export function parseExistingMetadata(raw) {
  if (raw === null) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`post-metadata.generated.json is not valid JSON: ${error.message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error("post-metadata.generated.json must contain an array.");
  }
  return parsed;
}
