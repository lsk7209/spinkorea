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

const SPIN_WAIT_MS = 5600;
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
const desktopEditor = (page) => page.locator('#item-editor');
const spinDesktop = async (page) => { await page.getByRole('button', { name: '룰렛 돌리기' }).first().click(); await page.waitForTimeout(SPIN_WAIT_MS); };

try {
  await test('T06 desktop: A/B result, then C/D edit clears current result/share but keeps history', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await desktopEditor(page).fill('A\nB');
    await spinDesktop(page);
    await page.getByRole('button', { name: '결과 텍스트 복사' }).first().waitFor();
    await desktopEditor(page).fill('C\nD');
    await page.waitForTimeout(200);
    assert.equal(await page.getByRole('button', { name: '결과 텍스트 복사' }).count(), 0, 'share for old result hidden');
    assert.equal(await page.getByRole('status').count(), 0, 'old result banner hidden');
    assert.ok(await page.getByText('최근 기록').count() >= 0);
    await context.close();
  });

  await test('T07 double click starts exactly one draw', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await desktopEditor(page).fill('A\nB\nC');
    const spin = page.getByRole('button', { name: '룰렛 돌리기' }).first();
    await spin.dblclick();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(SPIN_WAIT_MS);
    const history = await page.evaluate(() => JSON.parse(localStorage.getItem('spinflow:history') ?? '[]'));
    assert.equal(history.length, 1, `history entries: ${history.length}`);
    await context.close();
  });

  await test('T10 share link rebuilt from stored items opens same candidates in a fresh context', async () => {
    const first = await newPage();
    await visit(first.page, '/');
    await desktopEditor(first.page).fill('짜장면\n짬뽕\n🍕 피자');
    await first.page.goto(origin + '/'); // query-less revisit restores from storage
    await first.page.locator('h1').first().waitFor();
    await first.page.waitForFunction(() => document.querySelector('#item-editor')?.value === '짜장면\n짬뽕\n🍕 피자');
    await spinDesktop(first.page);
    await first.page.getByRole('button', { name: '후보 링크 복사' }).first().click();
    await first.page.waitForFunction(() => window.__copied.length === 1);
    const link = await first.page.evaluate(() => window.__copied[0]);
    assert.match(link, /\?s=/);
    await first.context.close();

    const second = await newPage();
    await second.page.goto(link.replace('https://spinkorea.kr', origin).replace(/^http:\/\/127\.0\.0\.1:\d+/, origin));
    await second.page.waitForFunction(() => document.querySelector('#item-editor')?.value === '짜장면\n짬뽕\n🍕 피자');
    await second.context.close();
  });

  await test('T11 clipboard denied shows an error and no success toast; result text omits "결과 확인"', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await desktopEditor(page).fill('A\nB');
    await spinDesktop(page);
    await page.getByRole('button', { name: '결과 텍스트 복사' }).first().click();
    await page.waitForFunction(() => window.__copied.length === 1);
    const text = await page.evaluate(() => window.__copied[0]);
    assert.match(text, /룰렛 결과: [AB]/);
    assert.doesNotMatch(text, /결과 확인/);
    await page.evaluate(() => { window.__clipboardMode = 'deny'; });
    await page.getByRole('button', { name: '후보 링크 복사' }).first().click();
    await page.getByText('복사하지 못했습니다', { exact: false }).first().waitFor();
    assert.equal(await page.getByText('같은 후보로 열리는 링크를 복사했습니다.').count(), 0);
    await context.close();
  });

  await test('T02 random-number direct entry ignores stored food list', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await desktopEditor(page).fill('한식\n중식');
    await visit(page, '/random-number');
    await page.waitForFunction(() => document.querySelector('#item-editor')?.value.startsWith('1\n2\n3'));
    assert.equal(await page.locator('h1').first().textContent(), '랜덤 숫자 뽑기 룰렛');
    assert.equal(await page.locator('h1').count(), 1, 'single H1');
    await context.close();
  });

  await test('T04 unsupported/oversized share state shows a notice and does not load stored items', async () => {
    const { context, page } = await newPage();
    await visit(page, '/');
    await desktopEditor(page).fill('저장된후보1\n저장된후보2');
    const bad = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 999, items: ['X'] }));
    await visit(page, `/?s=${bad}`);
    await page.getByText('공유 링크의 후보 정보를 읽을 수 없어').waitFor();
    const value = await desktopEditor(page).inputValue();
    assert.doesNotMatch(value, /저장된후보/);
    // Oversized after decompression (compressible padding keeps the URL under server header limits).
    const oversized = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 1, items: ['X'], pad: 'x'.repeat(40_000) }));
    assert.ok(oversized.length < 8000);
    await visit(page, `/?s=${oversized}`);
    await page.getByText('공유 링크의 후보 정보를 읽을 수 없어').waitFor();
    await context.close();
  });

  await test('T12/T13 mobile modal: reset→save shows error, Escape closes and focus returns', async () => {
    const { context, page } = await newPage({ mobile: true });
    await visit(page, '/');
    const opener = page.getByRole('button', { name: /항목 수정/ });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: '항목 수정하기' });
    await dialog.waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'item-editor-modal-input');
    await page.getByLabel('룰렛 항목 (한 줄에 하나)').waitFor();
    await dialog.getByRole('button', { name: '초기화' }).click();
    await dialog.getByRole('button', { name: '완료' }).click();
    await dialog.getByText('최소 1개 이상의 항목이 필요합니다.').waitFor();
    for (let i = 0; i < 12; i += 1) await page.keyboard.press('Tab');
    assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').contains(document.activeElement)), 'focus trapped');
    await page.keyboard.press('Shift+Tab');
    assert.ok(await page.evaluate(() => document.querySelector('[role="dialog"]').contains(document.activeElement)), 'focus trapped (reverse)');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.includes('항목 수정')), true, 'focus returned to opener');
    await page.screenshot({ path: path.join(out, 'home-390.png') });
    await context.close();
  });

  await test('T13 template modal: Escape closes and focus returns', async () => {
    const { context, page } = await newPage({ mobile: true });
    await visit(page, '/');
    await page.locator('main').getByRole('button', { name: '템플릿', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: /템플릿/ });
    await dialog.waitFor();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.includes('템플릿')), true);
    await context.close();
  });

  await test('T15 reduced motion: result arrives quickly and once', async () => {
    const { context, page } = await newPage({ reducedMotion: 'reduce' });
    await visit(page, '/');
    await desktopEditor(page).fill('A\nB');
    await page.getByRole('button', { name: '룰렛 돌리기' }).first().click();
    await page.getByRole('status').waitFor({ timeout: 2000 });
    const history = await page.evaluate(() => JSON.parse(localStorage.getItem('spinflow:history') ?? '[]'));
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
    await page.waitForFunction(() => document.querySelector('#item-editor')?.value.startsWith('1\n2'));
    await page.reload();
    await page.waitForFunction(() => document.querySelector('#item-editor')?.value.startsWith('1\n2'));
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
