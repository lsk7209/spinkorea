// SPK2 browser regression (local Vite, all external/API/non-GET requests aborted, clipboard mocked).
// Covers T02, T04, T06, T07, T10, T11, T12, T13, T15, T20 on desktop/mobile viewports.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';
import LZString from 'lz-string';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.APPDATA, 'npm/node_modules/@playwright/cli/node_modules/playwright'));
const out = path.join(root, 'output/spk2');
fs.mkdirSync(out, { recursive: true });

const server = await createServer({
  root, configFile: false, envDir: out, envPrefix: '__TEST_UNUSED_', cacheDir: path.join(out, 'vite-cache'),
  plugins: [react()], resolve: { alias: { '@': path.join(root, 'src') } },
  server: { host: '127.0.0.1', port: 0 }, logLevel: 'error',
});
await server.listen();
const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch({ headless: true, executablePath: findChromium() });

// Use an explicitly provided or already-installed headless shell; never download browsers here.
function findChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  const base = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
  if (!fs.existsSync(base)) return undefined;
  const shells = fs.readdirSync(base).filter((name) => name.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const shell of shells) {
    const exe = path.join(base, shell, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined;
}
const results = [];
const pageErrors = [];

async function newPage({ mobile = false, reducedMotion = 'no-preference' } = {}) {
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
    reducedMotion,
  });
  await context.route('**/*', (route) => {
    const request = route.request();
    const url = new URL(request.url());
    return url.origin !== origin || url.pathname.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method()) ? route.abort() : route.continue();
  });
  await context.addInitScript(() => {
    window.__copied = [];
    window.__clipboardMode = 'allow';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: (text) => (window.__clipboardMode === 'deny'
        ? Promise.reject(new DOMException('denied', 'NotAllowedError'))
        : (window.__copied.push(text), Promise.resolve())) },
    });
    document.execCommand = () => false; // no legacy fallback in tests
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => pageErrors.push(error.message));
  return { context, page };
}

async function test(name, run) {
  try { await run(); results.push({ name, status: 'PASS' }); }
  catch (error) { results.push({ name, status: 'FAIL', error: error.message.split('\n')[0] }); }
  console.log(results.at(-1));
}

const visit = async (page, route) => { await page.goto(origin + route); await page.locator('h1').first().waitFor(); };
const desktopEditor = (page) => page.locator('#home-editor');
const saveDesktop = async (page, value) => {
  await desktopEditor(page).fill(value);
  await page.getByRole('button', { name: '명단 저장', exact: true }).click();
};
const spinDesktop = async (page, count = 1) => {
  await page.getByRole('button', { name: `${count}명 추첨하기`, exact: true }).first().click();
  await page.getByRole('region', { name: '현재 추첨 결과' }).waitFor();
};
const readRecords = (page) => page.evaluate(() => {
  const stored = JSON.parse(localStorage.getItem('spinflow:drawRecords:v1') ?? '{}');
  return Array.isArray(stored.records) ? stored.records : [];
});

try {
  await test('T06 desktop: saved batch draw preserves snapshot, copy, and history after edit', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await saveDesktop(page, 'A\nB\nC\nD\nE');
    await page.locator('#home-count').fill('3');
    await page.getByRole('checkbox').check();
    await spinDesktop(page, 3);
    const region = page.getByRole('region', { name: '현재 추첨 결과' });
    const resultText = await region.innerText();
    assert.match(resultText, /시작 후보\s*5개/);
    assert.match(resultText, /추첨 수\s*3명/);
    assert.match(resultText, /자동 제외\s*적용/);
    assert.match(resultText, /완료 직후 남은 후보\s*2개/);
    await region.getByRole('button', { name: '결과와 조건 복사' }).click();
    const copied = await page.evaluate(() => window.__copied.at(-1));
    assert.match(copied, /추첨 시작 후보 5명/);
    assert.match(copied, /3명 추첨/);
    assert.equal(await page.locator('.roulette-wheel svg text').count(), 5, 'completed wheel keeps original batch');
    await saveDesktop(page, 'C\nD');
    await page.waitForTimeout(200);
    assert.equal(await page.getByRole('region', { name: '현재 추첨 결과' }).count(), 0, 'old result hidden after saved edit');
    const records = await readRecords(page);
    assert.equal(records.length, 1);
    assert.equal(records[0].requestedCount, 3);
    assert.equal(records[0].candidateCount, 5);
    assert.equal(records[0].remainingAtCompletion, 2);
    assert.deepEqual(records[0].roster, ['A', 'B', 'C', 'D', 'E']);
    await context.close();
  });

  await test('T07 double click starts exactly one draw', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await saveDesktop(page, 'A\nB\nC');
    const spin = page.getByRole('button', { name: '1명 추첨하기', exact: true }).first();
    await spin.dblclick();
    await page.getByRole('region', { name: '현재 추첨 결과' }).waitFor();
    const history = await readRecords(page);
    assert.equal(history.length, 1, `history entries: ${history.length}`);
    await context.close();
  });

  await test('T10 share link rebuilt from stored items opens same candidates in a fresh context', async () => {
    const first = await newPage();
    await visit(first.page, '/');
    await saveDesktop(first.page, '짜장면\n짬뽕\n🍕 피자');
    await first.page.goto(origin + '/'); // query-less revisit restores from storage
    await first.page.locator('h1').first().waitFor();
    await first.page.waitForFunction(() => document.querySelector('#home-editor')?.value === '짜장면\n짬뽕\n🍕 피자');
    await spinDesktop(first.page);
    await first.page.getByRole('button', { name: '후보 목록 링크 복사', exact: true }).click();
    await first.page.waitForFunction(() => window.__copied.length === 1);
    const link = await first.page.evaluate(() => window.__copied[0]);
    assert.match(link, /\?s=/);
    await first.context.close();

    const second = await newPage();
    await second.page.goto(link.replace('https://spinkorea.kr', origin).replace(/^http:\/\/127\.0\.0\.1:\d+/, origin));
    await second.page.waitForFunction(() => document.querySelector('#home-editor')?.value === '짜장면\n짬뽕\n🍕 피자');
    await second.context.close();
  });

  await test('T11 clipboard denied shows an error and no success toast; result text omits "결과 확인"', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await saveDesktop(page, 'A\nB');
    await spinDesktop(page);
    await page.getByRole('region', { name: '현재 추첨 결과' }).getByRole('button', { name: '결과와 조건 복사' }).click();
    await page.waitForFunction(() => window.__copied.length === 1);
    const text = await page.evaluate(() => window.__copied[0]);
    assert.match(text, /1회차 결과: [AB]/);
    assert.doesNotMatch(text, /결과 확인/);
    await page.getByText('결과와 추첨 조건을 복사했습니다.', { exact: true }).waitFor();
    const successToastCount = await page.getByText('결과와 추첨 조건을 복사했습니다.', { exact: true }).count();
    await page.evaluate(() => { window.__clipboardMode = 'deny'; });
    await page.getByRole('region', { name: '현재 추첨 결과' }).getByRole('button', { name: '결과와 조건 복사' }).click();
    await page.getByText('복사하지 못했습니다', { exact: false }).first().waitFor();
    assert.equal(await page.evaluate(() => window.__copied.length), 1, 'denied copy does not add a payload');
    assert.ok(await page.getByText('결과와 추첨 조건을 복사했습니다.', { exact: true }).count() <= successToastCount, 'denied copy does not add a success toast');
    await context.close();
  });

  await test('T02 random-number direct entry ignores stored food list', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await saveDesktop(page, '한식\n중식');
    await visit(page, '/random-number');
    await page.waitForFunction(() => document.querySelector('#home-editor')?.value.startsWith('1\n2\n3'));
    assert.equal(await page.locator('h1').first().textContent(), '랜덤 숫자 뽑기 룰렛');
    assert.equal(await page.locator('h1').count(), 1, 'single H1');
    await context.close();
  });

  await test('T04 unsupported/oversized share state shows a notice and does not load stored items', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await saveDesktop(page, '저장된후보1\n저장된후보2');
    const bad = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 999, items: ['X'] }));
    await visit(page, `/?s=${bad}`);
    await page.getByText('공유 링크의 후보를 읽지 못해 기본 후보를 표시합니다.', { exact: false }).waitFor();
    const value = await desktopEditor(page).inputValue();
    assert.doesNotMatch(value, /저장된후보/);
    // Oversized after decompression (compressible padding keeps the URL under server header limits).
    const oversized = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 1, items: ['X'], pad: 'x'.repeat(40_000) }));
    assert.ok(oversized.length < 8000);
    await visit(page, `/?s=${oversized}`);
    await page.getByText('공유 링크의 후보를 읽지 못해 기본 후보를 표시합니다.', { exact: false }).waitFor();
    await context.close();
  });

  await test('T12 mobile editor: invalid save shows error, Escape closes and focus returns', async () => {
    const { context, page } = await newPage({ mobile: true });
    await visit(page, '/');
    const opener = page.getByRole('button', { name: '명단 편집 열기', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: '명단 수정' });
    await dialog.waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'home-mobile-list');
    await page.locator('#home-mobile-list').fill('');
    await dialog.getByRole('button', { name: '명단 저장', exact: true }).click();
    await dialog.getByText('최소 1개 이상의 항목이 필요합니다.', { exact: false }).waitFor();
    for (let i = 0; i < 12; i += 1) await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').contains(document.activeElement)), 'focus trapped');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').contains(document.activeElement)), 'focus trapped (reverse)');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.includes('명단 편집 열기')), true, 'focus returned to opener');
    await page.screenshot({ path: path.join(out, 'home-390.png') });
    await context.close();
  });

  await test('T13 presentation mode: Escape closes and focus returns', async () => {
    const { context, page } = await newPage({ mobile: true });
    await visit(page, '/');
    const opener = page.getByRole('button', { name: '발표 모드', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: '룰렛 발표 모드' });
    await dialog.waitFor();
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab');
      assert.ok(await dialog.evaluate((element) => element.contains(document.activeElement)), 'presentation focus trapped');
    }
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await opener.evaluate((element) => element === document.activeElement), true, 'focus returned to opener');
    await context.close();
  });

  await test('T15 reduced motion: result arrives quickly and once', async () => {
    const { context, page } = await newPage({ reducedMotion: 'reduce' });
    await visit(page, '/');
    await saveDesktop(page, 'A\nB');
    await page.getByRole('button', { name: '1명 추첨하기', exact: true }).first().click();
    await page.getByRole('region', { name: '현재 추첨 결과' }).waitFor({ timeout: 2000 });
    const history = await readRecords(page);
    assert.equal(history.length, 1);
    await context.close();
  });

  await test('T20 SPA: unknown /spinflow slug renders NotFound (noindex); known alias applies preset', async () => {
    const { context, page } = await newPage();
    await visit(page, '/spinflow/audit-nonexistent-example');
    assert.equal(await page.locator('h1').first().textContent(), '페이지를 찾을 수 없습니다');
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow');
    await visit(page, '/spinflow/lotto');
    await page.waitForURL((url) => url.pathname === '/spinflow' && url.searchParams.has('s'));
    await page.waitForFunction(() => document.querySelector('#home-editor')?.value.startsWith('1\n2'));
    await page.reload();
    await page.waitForFunction(() => document.querySelector('#home-editor')?.value.startsWith('1\n2'));
    await context.close();
  });

  await test('T14 no horizontal overflow at 320/360/768/820/1024/1440', async () => {
    for (const width of [320, 360, 768, 820, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.route('**/*', (route) => (new URL(route.request().url()).origin !== origin ? route.abort() : route.continue()));
      const page = await context.newPage();
      await visit(page, '/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 0, `width ${width}: overflow ${overflow}px`);
      await context.close();
    }
  });
} finally {
  await browser.close();
  await server.close();
}

const failed = results.filter((r) => r.status !== 'PASS');
fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify({ origin: 'local-vite', results, pageErrors }, null, 2));
console.log(`SPK2_BROWSER ${results.length - failed.length}/${results.length} pageerrors=${pageErrors.length}`);
if (failed.length > 0 || pageErrors.length > 0) process.exit(1);
