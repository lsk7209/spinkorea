// SPK2-06 metadata merge contract (T16, T17, T19, PROBE-04).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergePostMetadata, parseExistingMetadata } from '../scripts/lib/metadata-merge.mjs';

const existing = [
  {
    slug: 'post-a',
    title: 'OLD',
    description: 'old desc',
    date: '2026-09-01',
    publishAt: '2026-09-01T13:00:00+09:00',
    tags: ['x'],
    source: 'generated',
  },
  { slug: 'legacy-only', title: 'Legacy', description: 'kept', date: '2026-01-01', tags: [], source: 'curated' },
];

describe('mergePostMetadata', () => {
  it('PROBE-04: applies an edited title/description for an existing slug', () => {
    const fresh = [{ ...existing[0], title: 'NEW', description: 'new desc' }];
    const { posts, changes } = mergePostMetadata(existing, fresh, { modifiedDate: '2026-09-29' });
    assert.equal(posts[0].title, 'NEW');
    assert.equal(posts[0].description, 'new desc');
    assert.equal(posts[0].updatedAt, '2026-09-29');
    assert.deepEqual(changes, [{ slug: 'post-a', fields: ['title', 'description'] }]);
  });

  it('never rewrites slug, first publish date, schedule or review source', () => {
    const fresh = [{
      ...existing[0],
      title: 'NEW',
      date: '2030-01-01',
      publishAt: '2030-01-01T00:00:00+09:00',
      source: 'editorial',
    }];
    const [post] = mergePostMetadata(existing, fresh, { modifiedDate: '2026-09-29' }).posts;
    assert.equal(post.date, '2026-09-01');
    assert.equal(post.publishAt, '2026-09-01T13:00:00+09:00');
    assert.equal(post.source, 'generated', 'generated noindex boundary is preserved');
  });

  it('T17: rebuilding without edits is a no-op (no new modified date)', () => {
    const fresh = [{ ...existing[0] }];
    const { posts, changes } = mergePostMetadata(existing, fresh, { modifiedDate: '2026-09-29' });
    assert.deepEqual(changes, []);
    assert.equal(posts[0], existing[0], 'same object reference: nothing rewritten');
    assert.equal('updatedAt' in posts[0], false);
  });

  it('T16: running twice is idempotent', () => {
    const fresh = [{ ...existing[0], title: 'NEW' }];
    const first = mergePostMetadata(existing, fresh, { modifiedDate: '2026-09-29' }).posts;
    const second = mergePostMetadata(first, fresh, { modifiedDate: '2026-10-05' });
    assert.deepEqual(second.changes, []);
    assert.equal(second.posts[0].updatedAt, '2026-09-29', 'modified date does not move on a no-op rebuild');
  });

  it('keeps cache-only (legacy) records and appends new posts at the end', () => {
    const fresh = [{ slug: 'post-new', title: 'T', description: 'D', date: '2026-10-01', tags: [], source: 'generated' }];
    const { posts } = mergePostMetadata(existing, fresh);
    assert.deepEqual(posts.map((p) => p.slug), ['post-a', 'legacy-only', 'post-new']);
  });

  it('uses the first fresh record when a slug is duplicated', () => {
    const fresh = [{ ...existing[0], title: 'FIRST' }, { ...existing[0], title: 'SECOND' }];
    assert.equal(mergePostMetadata(existing, fresh).posts[0].title, 'FIRST');
  });

  it('does not set updatedAt when no real modification date is supplied', () => {
    const [post] = mergePostMetadata(existing, [{ ...existing[0], title: 'NEW' }]).posts;
    assert.equal(post.title, 'NEW');
    assert.equal('updatedAt' in post, false);
  });
});

describe('parseExistingMetadata (fail-closed)', () => {
  it('returns null when there is no cache yet', () => {
    assert.equal(parseExistingMetadata(null), null);
  });
  it('throws on corrupt JSON instead of silently falling back', () => {
    assert.throws(() => parseExistingMetadata('{broken'), /not valid JSON/);
  });
  it('throws when the cache is not an array', () => {
    assert.throws(() => parseExistingMetadata('{}'), /must contain an array/);
  });
});
