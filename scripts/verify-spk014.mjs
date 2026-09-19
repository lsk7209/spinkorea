import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { preview } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'output/spk014-release');
fs.mkdirSync(out, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.APPDATA, 'npm/node_modules/@playwright/cli/node_modules/playwright'));
const baseline = process.argv.includes('--baseline');
const server = await preview({ root, configFile: false, envDir: out, envPrefix: '__TEST_UNUSED_', preview: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser;
const results = [];
const errors = [];
try {
  const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.route('**/*', route => {
    const req = route.request(); const url = new URL(req.url());
    return url.origin !== origin || url.pathname.startsWith('/api/') || !['GET', 'HEAD'].includes(req.method()) ? route.abort() : route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  const test = async (name, run) => {
    try { await run(); results.push({ name, status: 'PASS' }); }
    catch (e) { results.push({ name, status: 'FAIL', error: e.message }); }
  };
  for (const width of baseline ? [1280] : [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin + '/tools/bmi-calculator');
    await page.locator('#bmi-calculator-1').fill('200');
    const result = page.getByRole('heading', { name: '나의 BMI 지수', exact: true }).locator('..');
    const cases = baseline ? [[120, '2단계 비만'], [140, '3단계 비만 (고도비만)']] : [
      [73.96, '저체중'], [74, '정상'], [91.9996, '정상'], [92, '비만전단계 (과체중)'],
      [99.9996, '비만전단계 (과체중)'], [100, '1단계 비만'], [119.9996, '1단계 비만'],
      [120, '2단계 비만'], [139.9996, '2단계 비만'], [140, '3단계 비만 (고도비만)'],
      [180, '3단계 비만 (고도비만)'],
    ];
    for (const [weight, label] of cases) await test(`${width}px BMI ${weight / 4}: ${label}`, async () => {
      await page.locator('#bmi-calculator-2').fill(String(weight));
      await page.waitForFunction(({ weight }) => document.querySelector('#bmi-calculator-2')?.value === String(weight), { weight });
      await result.getByText(label, { exact: true }).and(result.locator('div.text-2xl')).waitFor({ timeout: 2500 });
      if (!baseline) {
        const display = await result.locator('.text-5xl').innerText();
        const shown = Number(display);
        assert.ok(shown <= weight / 4 && weight / 4 - shown < 0.011, display);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
    });
    if (baseline) continue;
    await test(`${width}px BMI invalid input clears result and recovers`, async () => {
      for (const [height, weight] of [['', '70'], ['0', '70'], ['-170', '70'], ['170', '0'], ['170', '-5'], ['1e-200', '70'], ['1', '1e308']]) {
        await page.locator('#bmi-calculator-1').fill(height);
        await page.locator('#bmi-calculator-2').fill(weight);
        await page.waitForFunction(() => !Array.from(document.querySelectorAll('h3')).some(e => e.textContent === '나의 BMI 지수'));
      }
      await page.locator('#bmi-calculator-1').fill('200'); await page.locator('#bmi-calculator-2').fill('120');
      await result.getByText('2단계 비만', { exact: true }).and(result.locator('div.text-2xl')).waitFor();
    });
    await page.screenshot({ path: path.join(out, `bmi-${width}.png`), fullPage: true });
    for (const [slug, originalDate, expected, forbidden] of [
      ['exercise-brain', '2026-05-03', '참가자는 81%', '기억력 40%'],
      ['bmi-limitations', '2026-04-28', '국내 성인 복부비만 기준', '0.5 이하가 건강'],
      ['ai-era-skills', '2026-05-21', 'AI와 일할 때 기를 역량', '인간만이 할 수 있는 것'],
    ]) await test(`${width}px ${slug}: built body, metadata and SPA parity`, async () => {
      const source = JSON.parse(fs.readFileSync(path.join(root, 'src/data/post-metadata.generated.json'), 'utf8')).find(p => p.slug === slug);
      const runtime = JSON.parse(fs.readFileSync(path.join(root, 'src/data/post-metadata.runtime.generated.json'), 'utf8')).find(p => p.slug === slug);
      for (const field of ['title', 'description', 'date', 'source']) assert.equal(source[field], runtime[field]);
      assert.equal(source.date, originalDate);
      assert.equal(source.source, 'curated');
      const posts = fs.readFileSync(path.join(root, 'src/data/posts.tsx'), 'utf8');
      const blockStart = posts.indexOf(`slug: "${slug}"`);
      assert.ok(blockStart >= 0);
      const nextBlock = posts.indexOf('slug:', blockStart + 6);
      const postBlock = posts.slice(blockStart, nextBlock < 0 ? posts.length : nextBlock);
      for (const field of ['title', 'description', 'date']) {
        const literal = postBlock.match(new RegExp(`${field}:\\s*("(?:[^"\\\\]|\\\\.)*")`));
        assert.ok(literal, `${slug} source ${field} exists`);
        assert.equal(JSON.parse(literal[1]), source[field], `${slug} source ${field}`);
      }
      const staticHtml = fs.readFileSync(path.join(root, `dist/blog/${slug}/index.html`), 'utf8');
      assert.ok(staticHtml.includes(expected)); assert.ok(!staticHtml.includes(forbidden));
      assert.ok(staticHtml.includes(source.description));
      assert.doesNotMatch(staticHtml, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
      for (const dir of ['public', 'dist']) assert.ok(fs.readFileSync(path.join(root, dir, 'sitemap.xml'), 'utf8').includes(`<loc>https://spinkorea.kr/blog/${slug}</loc>`));
      await page.goto(origin + '/blog/' + slug);
      await page.getByRole('heading', { level: 1, name: source.title, exact: true }).waitFor();
      await page.getByText(expected, { exact: false }).first().waitFor();
      assert.equal(await page.locator('meta[name=description]').getAttribute('content'), source.description);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://spinkorea.kr/blog/' + slug);
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'index,follow');
      assert.doesNotMatch(await page.locator('body').innerText(), new RegExp(forbidden));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (slug === 'exercise-brain') assert.equal(await page.locator('main a[href="/tools/yes-no-oracle"]').count(), 0);
      await page.screenshot({ path: path.join(out, `${slug}-${width}.png`), fullPage: true });
    });
  }
  assert.deepEqual(errors, []);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.httpServer.close(resolve));
  const evidence = { baseline, results, pageerrors: errors };
  fs.writeFileSync(path.join(out, baseline ? 'baseline-browser.json' : 'browser.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
}
assert.ok(results.length > 0 && results.every(r => r.status === 'PASS'), 'SPK014 browser failures');
