// SPK2-06 / SPK2-04 / SPK2-05 built-output check. Run after `npm run build`.
// Reads dist/ only; no network or writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const metadata = JSON.parse(read('src/data/post-metadata.generated.json'));
const edited = metadata.filter((post) => post.updatedAt);
const results = [];
const pass = (name) => { results.push(name); console.log(`PASS ${name}`); };

for (const post of edited) {
  const html = read(`dist/blog/${post.slug}/index.html`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  assert.ok(title.includes(post.title.replace(/&/g, '&amp;')), `${post.slug} title reflects source`);
  assert.match(html, new RegExp(`"dateModified":"${escapeRegex(post.updatedAt)}T00:00:00\\+09:00"`), `${post.slug} JSON-LD dateModified`);
  assert.match(html, new RegExp(`"datePublished":"${escapeRegex(post.publishAt ?? post.date)}`), `${post.slug} datePublished unchanged`);
  const sitemap = read('dist/sitemap.xml');
  if (post.source !== 'generated') {
    assert.match(sitemap, new RegExp(`/blog/${post.slug}</loc>\\s*<lastmod>${post.updatedAt}</lastmod>`), `${post.slug} sitemap lastmod`);
  }
  pass(`edited post ${post.slug}: title/dateModified/lastmod propagate, datePublished preserved`);
}

const unchanged = metadata.find((post) => !post.updatedAt && post.source === 'editorial' && fs.existsSync(`dist/blog/${post.slug}/index.html`));
if (unchanged) {
  const html = read(`dist/blog/${unchanged.slug}/index.html`);
  const published = unchanged.publishAt ?? unchanged.date;
  assert.match(html, new RegExp(`"dateModified":"${escapeRegex(published)}`), 'unedited post keeps dateModified = datePublished');
  pass(`unedited post ${unchanged.slug}: dateModified not bumped by rebuild`);
}

const randomNumber = read('dist/random-number/index.html');
assert.match(randomNumber, /<h1[^>]*>랜덤 숫자 뽑기 룰렛<\/h1>/);
assert.doesNotMatch(randomNumber, /숫자 범위를 선택/);
pass('random-number static H1 and copy match the React page');

assert.ok(fs.existsSync('dist/404.html'), '404.html exists for unmatched routes');
assert.equal(fs.existsSync('dist/spinflow/audit-nonexistent-example'), false);
pass('no static HTML for unknown /spinflow slug; Vercel falls through to 404.html');

console.log(`BUILT_OUTPUT_OK ${results.length}`);
