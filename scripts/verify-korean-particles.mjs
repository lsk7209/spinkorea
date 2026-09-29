// Counts particle/batchim mismatches (e.g. "설정와", "선택를") in built blog pages.
// Usage: node scripts/verify-korean-particles.mjs [--max=N]  (reads dist/ only)
import fs from 'node:fs';
import path from 'node:path';

const PAIRS = [['을', '를'], ['은', '는'], ['이', '가'], ['과', '와']];
const BLOG_DIR = path.join('dist', 'blog');
const maxArg = process.argv.find((arg) => arg.startsWith('--max='));
const max = maxArg ? Number(maxArg.slice(6)) : Infinity;

function hasBatchim(char) {
  const code = char.charCodeAt(0);
  return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
}

// Only flag the vowel-form after batchim and batchim-form after vowel for pairs
// where the wrong form is unambiguous as a particle ("를/는/와" after batchim, "을/과" after vowel).
const pattern = /([가-힣])(을|를|은|는|과|와)(?=[\s.,)?!"])/g;
let total = 0;
const examples = new Map();
for (const slug of fs.readdirSync(BLOG_DIR)) {
  const file = path.join(BLOG_DIR, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('id="post-content"');
  if (start < 0) continue;
  const text = html.slice(start).replace(/<[^>]+>/g, ' ');
  for (const [, prev, particle] of text.matchAll(pattern)) {
    const pair = PAIRS.find((p) => p.includes(particle));
    const expected = hasBatchim(prev) ? pair[0] : pair[1];
    if (particle === expected) continue;
    // Only unambiguous errors: "를"/"와" right after a batchim syllable (e.g. "설정와", "기록를").
    // "는" after batchim is a verb ending (있는/없는) and "은/을/과" after vowels can be word-final, so skip them.
    if (!(hasBatchim(prev) && (particle === '를' || particle === '와'))) continue;
    total += 1;
    const key = `${prev}${particle}`;
    examples.set(key, (examples.get(key) ?? 0) + 1);
  }
}
const top = [...examples].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, n]) => `${k}×${n}`).join(' ');
console.log(`PARTICLE_MISMATCHES ${total} ${top}`);
if (total > max) process.exit(1);
