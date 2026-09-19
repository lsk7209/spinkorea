import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('../', import.meta.url));
const guidance = JSON.parse(fs.readFileSync(path.join(root, 'src/data/site-guidance.json'), 'utf8'));
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'src/data/post-metadata.runtime.generated.json'), 'utf8'));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.APPDATA, 'npm/node_modules/@playwright/cli/node_modules/playwright'));
const out = path.join(root, 'output/tool-reliability');
fs.mkdirSync(out, { recursive: true });
const server = await createServer({ root, configFile: false, envDir: out, envPrefix: '__TEST_UNUSED_', cacheDir: path.join(out, 'vite-cache'), plugins: [react()], resolve: { alias: { '@': path.join(root, 'src') } }, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.route('**/*', route => {
  const request = route.request();
  const url = new URL(request.url());
  return url.origin !== origin || url.pathname.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method()) ? route.abort() : route.continue();
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const results = [];
const test = async (name, run) => {
  try { await run(); results.push({ name, status: 'PASS' }); }
  catch (error) { results.push({ name, status: 'FAIL', error: error.message }); }
  console.log(results.at(-1));
};
const visit = async route => { await page.goto(origin + route); await page.locator('h1').first().waitFor(); };
const equalValue = async (selector, value) => page.waitForFunction(({ selector, value }) => document.querySelector(selector)?.value === value, { selector, value }, { timeout: 3000 });
const copyState = async mode => page.evaluate(mode => {
  window.__copy = { calls: [], resolved: false };
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'unavailable' ? undefined : {
    writeText: text => { window.__copy.calls.push(text); return mode === 'denied' ? Promise.reject(new DOMException('denied', 'NotAllowedError')) : mode === 'pending' ? new Promise(resolve => { window.__resolveCopy = () => { window.__copy.resolved = true; resolve(); }; }) : Promise.resolve(); },
  } });
}, mode);
try {
  await test('Loan 0%, both methods, invalid months and recovery', async () => {
    await visit('/tools/loan-calculator');
    await page.locator('#loan-calculator-1').fill('1200000');
    await page.locator('#loan-calculator-2').fill('0');
    await page.locator('#loan-calculator-3').fill('12');
    for (const method of ['원리금균등', '원금균등']) {
      await page.getByRole('button', { name: method, exact: true }).click();
      await page.getByText('100,000원', { exact: true }).waitFor();
      await page.getByText('0원', { exact: true }).waitFor();
      await page.getByText('1,200,000원', { exact: true }).waitFor();
      for (const months of ['', '0', '-1', '12.5']) {
        await page.locator('#loan-calculator-3').fill(months);
        await page.getByText(/빈 값이나 계산 범위를 벗어난 값/).waitFor();
        assert.equal(await page.getByText('100,000원', { exact: true }).count(), 0);
      }
      await page.locator('#loan-calculator-3').fill('12');
    }
    await page.locator('#loan-calculator-1').fill('1000000'); await page.locator('#loan-calculator-2').fill('12'); await page.locator('#loan-calculator-3').fill('1');
    await page.getByText('10,000원', { exact: true }).waitFor();
  });
  await test('TextCounter unicode definitions and unchanged counts', async () => {
    await visit('/tools/text-counter');
    for (const [text, units, noSpaces, bytes] of [['', 0, 0, 0], ['A 한😀', 5, 4, 9], ['e\u0301', 2, 2, 3], ['👨‍👩‍👧‍👦', 11, 11, 25], ['A\nB', 3, 2, 3]]) {
      await page.locator('textarea').fill(text);
      for (const [label, count, suffix] of [['공백 포함 (UTF-16)', units, '자'], ['공백 제외 (UTF-16)', noSpaces, '자'], ['바이트 (UTF-8)', bytes, 'B']]) {
        const value = page.getByText(label, { exact: true }).locator('..').locator('.text-2xl');
        await page.waitForFunction(({ el, expected }) => el.textContent === expected, { el: await value.elementHandle(), expected: count + suffix });
      }
    }
  });
  await test('Sleep assumptions and actual time arithmetic', async () => {
    await visit('/tools/sleep-calculator');
    await page.locator('input[type=time]').fill('23:00');
    await page.getByText('06:45', { exact: true }).waitFor();
    assert.doesNotMatch(await page.locator('h1').innerText(), /최적/);
    assert.match(await page.locator('body').innerText(), /계산 가정/);
    assert.equal(await page.getByRole('heading', { name: /추천/ }).count(), 0);
    const timeClass = await page.getByText('06:45', { exact: true }).getAttribute('class');
    assert.equal(await page.getByText('05:15', { exact: true }).getAttribute('class'), timeClass);
    assert.equal(await page.getByText('08:15', { exact: true }).getAttribute('class'), timeClass);
    await page.getByRole('button', { name: /기상 → 취침/ }).click();
    await page.locator('input[type=time]').fill('06:45');
    await page.getByText('23:00', { exact: true }).waitFor();
  });
  await test('Password length, last group and unavailable RNG', async () => {
    await visit('/tools/random-password');
    assert.doesNotMatch(await page.locator('body').innerText(), /Weak|Medium|Strong|권장: 16자/);
    for (const length of [4, 50]) { await page.locator('input[type=range]').fill(String(length)); await page.waitForFunction(length => document.querySelector('span.font-mono')?.textContent?.length === length, length); }
    const labels = page.locator('label').filter({ has: page.locator('input[type=checkbox]') });
    for (let i = 0; i < 3; i++) await labels.nth(i).click();
    await labels.nth(3).click(); assert.equal(await page.locator('input[type=checkbox]:checked').count(), 1);
    await page.evaluate(() => Object.defineProperty(window, 'crypto', { configurable: true, value: undefined }));
    await page.getByRole('button', { name: /새로운 비밀번호/ }).click();
    await page.waitForFunction(() => document.querySelector('span.font-mono')?.textContent === '');
    await page.getByText('안전한 랜덤 생성기를 사용할 수 없습니다.', { exact: true }).waitFor();
    await page.getByText('문자 수: 0', { exact: true }).waitFor();
  });
  for (const [route, required] of [
    ['/blog/sleep-optimization', '390분'], ['/blog/password-strength', '해독 시간 표에 빠져 있던 공격 조건'],
    ['/blog/yes-no-oracle-guide', '가상의 영화 선택 기록'], ['/blog/random-choice-log', '체험모임-v1'],
    ['/privacy', '이전 방문 기록'], ['/contact', '비공개 수신 채널은 없습니다'],
  ]) await test(`${route} rendered corrected guidance`, async () => {
    await visit(route); await page.getByText(required, { exact: false }).first().waitFor();
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://spinkorea.kr' + route);
    if (route.startsWith('/blog/')) {
      const entry = metadata.find(row => route === '/blog/' + row.slug);
      assert.equal(await page.locator('h1').innerText(), entry.title);
      assert.equal((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'), route === '/blog/random-choice-log');
    } else if (route === '/privacy') {
      for (const value of [guidance.privacy.thirdParty, guidance.privacy.inputProcessing, guidance.privacy.controls, guidance.privacy.rightsContact]) {
        await page.getByText(value, { exact: true }).waitFor();
      }
      for (const link of guidance.privacy.links) assert.ok(await page.locator(`a[href="${link.url}"]`).count());
    } else await page.getByText(guidance.contact.summary, { exact: true }).waitFor();
  });
  await test('JSON normal, syntax, editing and numeric safety', async () => {
    await visit('/tools/json-formatter');
    const input = page.locator('#json-formatter-1');
    const output = '#json-formatter-2';
    for (const source of ['{"n":9007199254740991}', '{"n":-9007199254740991}', '{"n":"9007199254740993","d":1.25,"e":1e3}']) {
      await input.fill(source); await page.getByRole('button', { name: '압축 (Minify)' }).click(); await equalValue(output, JSON.stringify(JSON.parse(source)));
    }
    await input.fill('{"n":2}'); await equalValue(output, '');
    for (const source of ['{"n":9007199254740993}', '{"n":-9007199254740993}', '{"n":9.007199254740993e15}', '{"n":1e400}', '{"n":1,}', '']) {
      await input.fill(source); await page.getByRole('button', { name: '정렬 (2칸)' }).click(); await equalValue(output, ''); assert.equal(await input.inputValue(), source); assert.equal(await page.getByTitle('결과 복사').count(), 0);
    }
  });
  await test('Percentage normal and invalid transitions', async () => {
    await visit('/tools/percentage-calculator');
    const inputs = page.locator('input[type=number]');
    const cards = page.locator('h3').filter({ hasText: /전체 값의 비율 구하기|일부 값의 비율|증감률\(수익률\)/ });
    const result = index => cards.nth(index).locator('..').locator('span.text-2xl');
    const check = async (index, pattern) => {
      try { await page.waitForFunction(({ element, source }) => new RegExp(source).test(element.textContent.trim()), { element: await result(index).elementHandle(), source: pattern.source }, { timeout: 3000 }); }
      catch { throw new Error(`Percentage card ${index}: expected ${pattern}, received ${await result(index).innerText()}`); }
    };
    await inputs.nth(0).fill('10000'); await inputs.nth(1).fill('20'); await check(0, /2,000/);
    await inputs.nth(2).fill('50'); await inputs.nth(3).fill('5'); await check(1, /10/);
    await inputs.nth(4).fill('100'); await inputs.nth(5).fill('110'); await check(2, /10/);
    await inputs.nth(4).fill('0'); await check(2, /^-$/);
    await inputs.nth(2).fill('0'); await check(1, /^-%$/);
    await inputs.nth(2).fill('50'); await inputs.nth(3).fill('0'); await check(1, /^0%$/);
    await inputs.nth(3).fill('-5'); await check(1, /^-10%$/);
    await inputs.nth(4).fill('-100'); await inputs.nth(5).fill('-110'); await check(2, /10/);
    await inputs.nth(5).fill(''); await check(2, /^-$/);
    await inputs.nth(0).fill('1e308'); await inputs.nth(1).fill('1e308'); await check(0, /^-$/);
    assert.doesNotMatch(await result(0).innerText(), /NaN|Infinity|∞/);
  });
  for (const route of ['/tools/text-counter', '/tools/json-formatter', '/tools/random-password', '/tools/random-team']) {
    for (const mode of ['allowed', 'denied', 'unavailable', 'pending']) {
      await test(`${route} clipboard ${mode}`, async () => {
        await visit(route);
        let button;
        let expected;
        if (route.endsWith('text-counter')) { await page.locator('textarea').first().fill('TEST_DUMMY'); button = page.getByRole('button', { name: /복사/ }).first(); expected = 'TEST_DUMMY'; }
        else if (route.endsWith('json-formatter')) { await page.locator('#json-formatter-1').fill('{"a":1}'); await page.getByRole('button', { name: '압축 (Minify)' }).click(); button = page.getByTitle('결과 복사'); expected = '{"a":1}'; }
        else if (route.endsWith('random-password')) { button = page.getByRole('button', { name: /복사/ }).first(); expected = await page.locator('span.font-mono').innerText(); }
        else { await page.locator('textarea').first().fill('A\nB\nC\nD'); await page.getByRole('button', { name: /팀 나누기/ }).click(); button = page.getByRole('button', { name: /결과 복사/ }); await button.waitFor(); }
        await copyState(mode);
        await button.click();
        if (mode === 'pending') {
          await page.waitForTimeout(150);
          assert.equal(await page.locator('[data-sonner-toast][data-type="success"]').filter({ hasText: /복사/ }).count(), 0);
          await page.evaluate(() => window.__resolveCopy());
        }
        const type = ['allowed', 'pending'].includes(mode) ? 'success' : 'error';
        await page.locator(`[data-sonner-toast][data-type="${type}"]`).filter({ hasText: /복사/ }).first().waitFor({ timeout: 3000 });
        if (type === 'error') assert.equal(await page.locator('[data-sonner-toast][data-type="success"]').filter({ hasText: /복사/ }).count(), 0);
        const calls = await page.evaluate(() => window.__copy.calls);
        if (mode !== 'unavailable') { assert.equal(calls.length, 1); if (expected) assert.equal(calls[0], expected); else for (const name of ['A', 'B', 'C', 'D']) assert.ok(calls[0].includes(name)); }
        if (mode === 'allowed') { await button.click(); assert.equal(await page.evaluate(() => window.__copy.calls.length), 2); }
        if (route.endsWith('text-counter')) assert.equal(await page.locator('textarea').first().inputValue(), expected);
        if (route.endsWith('json-formatter')) assert.equal(await page.locator('#json-formatter-2').inputValue(), expected);
        if (route.endsWith('random-password')) assert.equal(await page.locator('span.font-mono').innerText(), expected);
      });
    }
  }
  for (const width of [390, 1280]) for (const route of ['/tools/json-formatter', '/tools/percentage-calculator']) {
    await test(`${route} viewport ${width}`, async () => {
      await page.setViewportSize({ width, height: 844 }); await visit(route);
      if (route.endsWith('json-formatter')) {
        await page.locator('#json-formatter-1').fill('{"mobile":true}');
        await page.getByRole('button', { name: '정렬 (2칸)' }).focus(); await page.keyboard.press('Enter');
        await equalValue('#json-formatter-2', '{\n  "mobile": true\n}');
        await copyState('allowed'); await page.getByTitle('결과 복사').focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => window.__copy.calls[0]), '{\n  "mobile": true\n}');
      } else {
        await page.locator('input[type=number]').nth(4).fill('100'); await page.locator('input[type=number]').nth(5).fill('110');
        await page.waitForFunction(() => [...document.querySelectorAll('span')].some(span => span.textContent.trim() === '▲ 10%'));
      }
      await page.waitForTimeout(350);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.screenshot({ path: path.join(out, `${route.split('/').at(-1)}-${width}.png`), fullPage: true });
    });
  }
} finally {
  fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify({ results, errors }, null, 2));
  await browser.close(); await server.close();
}
if (results.some(result => result.status !== 'PASS') || errors.length) process.exitCode = 1;
