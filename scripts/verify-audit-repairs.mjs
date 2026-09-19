import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getSecureRandomInt } from '../src/utils/random.ts';
const guidance = JSON.parse(fs.readFileSync('src/data/site-guidance.json', 'utf8'));
const read = route => fs.readFileSync(`dist${route}/index.html`, 'utf8');
const includes = (html, terms) => terms.forEach(term => assert.ok(html.includes(term), `Missing ${term}`));
const curatedSource = fs.readFileSync('src/data/posts.tsx', 'utf8');
for (const slug of ['sleep-optimization', 'password-strength', 'yes-no-oracle-guide']) {
  const block = curatedSource.match(new RegExp(`slug:\\s*"${slug}"([\\s\\S]*?)content:`))[1];
  const title = block.match(/title:\s*"([^"]+)"/)[1];
  const description = block.match(/description:\s*"([^"]+)"/)[1];
  for (const file of ['src/data/post-metadata.generated.json', 'src/data/post-metadata.runtime.generated.json']) {
    const entry = JSON.parse(fs.readFileSync(file, 'utf8')).find(row => row.slug === slug);
    assert.equal(entry.title, title); assert.equal(entry.description, description);
  }
  includes(read(`/blog/${slug}`), [`<title>${title}`, `content="${description}"`]);
}
const sleep = read('/blog/sleep-optimization');
includes(sleep, ['390분', '31.5%', '06:45', '/tools/sleep-calculator', 'stages-of-sleep']);
assert.doesNotMatch(sleep, /집중력 34%|자정에 절반이 남아있음|7시간 = 90분/);
const password = read('/blog/password-strength');
includes(password, ['sp800-63b.html', '/tools/random-password', '공격 조건']);
assert.doesNotMatch(password, /<td[^>]*>[^<]*(?:수백 년|수천 년|수억 년)|비밀번호가 유출되어도 2FA가 있으면 안전합니다/);
includes(password, ['말할 수는 없습니다', '공개된 예시 문자열', '는 결론은 성립하지 않습니다']);
const yesno = read('/blog/yes-no-oracle-guide');
includes(yesno, ['MAYBE', 'TRY AGAIN', '/blog/yes-no-reversible-choice']);
assert.doesNotMatch(yesno, /6개월 후 더 행복|책임을 분산/);
const record = read('/blog/random-choice-log');
includes(record, ['가상 사례', '참가자 목록 버전', '제외 조건', '중복 당첨', '재추첨', '변경 이력', 'noindex,follow']);
assert.doesNotMatch(record, /참가자 목록와|목록을 먼저 확인하고 선택 기준/);
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
assert.ok(!sitemap.includes('/blog/random-choice-log'));
for (const file of ['src/data/content-plan.generated.json', 'src/data/generated-content-chunks/chunk-01.json']) {
  const article = JSON.parse(fs.readFileSync(file, 'utf8')).find(row => row.slug === 'random-choice-log');
  assert.ok(article.body.includes('체험모임-v1')); assert.notEqual(article.editorialReview, 'approved');
}
const text = read('/tools/text-counter');
includes(text, ['UTF-16', 'UTF-8', '9바이트']);
const related = text.match(/<h2>관련 도구로 이어가기<\/h2>\s*<ul>(.*?)<\/ul>/s)?.[1];
assert.ok(related);
assert.deepEqual([...related.matchAll(/href="([^"]+)"/g)].map(m => m[1]).sort(), guidance.textCounter.relatedTools.map(t => t.path).sort());
assert.ok(!text.includes('id="related-tools"'));
includes(read('/privacy'), ['이전 방문 기록', 'myadcenter.google.com', '도구의 입력 처리와 방문']);
includes(read('/privacy'), [guidance.privacy.rightsContact]);
includes(read('/contact'), ['GitHub Issues', '공개 기술 제보', '비공개 수신 채널은 없습니다', guidance.contact.issueUrl]);
includes(read('/contact'), [guidance.contact.summary]);
includes(read('/tools/loan-calculator'), [guidance.loan.definition]);
includes(read('/tools/sleep-calculator'), [guidance.sleep.definition]);
assert.doesNotMatch(read('/tools'), /AdSense 검토자|심사자/);
const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
try {
  const samples = [0xffffffff, 17];
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { getRandomValues: array => { assert.ok(samples.length); array[0] = samples.shift(); return array; } } });
  assert.equal(getSecureRandomInt(10), 7); assert.equal(samples.length, 0);
} finally { Object.defineProperty(globalThis, 'crypto', descriptor); }
console.log('Corrected article HTML, source/index preservation, static disclosures/links and RNG rejection PASS');
