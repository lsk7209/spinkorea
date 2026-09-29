// Browser regression for calculator edge cases (time/compound/age/severance/unix/d-day + input labels).
// Local Vite only; external and API requests are aborted. Uses PLAYWRIGHT_MODULE or user-level @playwright/cli.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || path.join(process.env.APPDATA ?? '', 'npm/node_modules/@playwright/cli/node_modules/playwright'));
const out = path.join(root, 'output/calculator-edge');
fs.mkdirSync(out, { recursive: true });

function findInstalledHeadlessShell() {
  const base = path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
  if (!fs.existsSync(base)) return undefined;
  for (const shell of fs.readdirSync(base).filter((name) => name.startsWith('chromium_headless_shell-')).sort().reverse()) {
    const exe = path.join(base, shell, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined;
}

const server = await createServer({ root, configFile: false, envDir: out, envPrefix: '__TEST_UNUSED_', cacheDir: path.join(out, 'vite-cache'), plugins: [react()], resolve: { alias: { '@': path.join(root, 'src') } }, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || findInstalledHeadlessShell() });
// A negative UTC offset reproduces the old `new Date("YYYY-MM-DD")` day shift.
const context = await browser.newContext({ timezoneId: 'America/Los_Angeles' });
await context.route('**/*', (route) => {
  const request = route.request();
  const url = new URL(request.url());
  return url.origin !== origin || url.pathname.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method()) ? route.abort() : route.continue();
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
const results = [];
const test = async (name, run) => {
  try { await run(); results.push({ name, status: 'PASS' }); }
  catch (error) { results.push({ name, status: 'FAIL', error: error.message }); }
  console.log(results.at(-1));
};
const visit = async (route) => { await page.goto(origin + route); await page.locator('h1').first().waitFor(); };
const main = () => page.locator('main');

try {
  await test('time: subtracting past midnight shows previous day', async () => {
    await visit('/tools/time-calculator');
    await page.locator('#time-calculator-3').fill('01:00');
    await page.getByRole('button', { name: '빼기' }).click();
    await page.getByLabel('더하거나 뺄 시간(시)').fill('2');
    await main().getByText('23:00 (전날)').waitFor({ timeout: 3000 });
    await page.getByRole('button', { name: '더하기' }).click();
    await page.getByLabel('더하거나 뺄 시간(시)').fill('25');
    await main().getByText('02:00 (다음날)').waitFor({ timeout: 3000 });
  });

  await test('compound: negative contribution rejected, valid input recovers', async () => {
    await visit('/tools/compound-interest');
    await page.locator('#compound-interest-calculator-4').fill('-100000');
    await main().getByRole('alert').getByText('0 이상').waitFor({ timeout: 3000 });
    await page.locator('#compound-interest-calculator-4').fill('0');
    await main().getByRole('paragraph').filter({ hasText: /^14,908,327원$/ }).waitFor({ timeout: 3000 });
    assert.equal(await main().getByRole('alert').count(), 0);
  });

  await test('age: future birth date shows guidance, no negative age', async () => {
    await visit('/tools/age-calculator');
    await page.locator('#age-calculator-1').fill('2099-01-01');
    await page.locator('#age-calculator-error').waitFor({ timeout: 3000 });
    assert.equal(await main().getByText('현재 만 나이').count(), 0);
  });

  await test('severance: reversed dates show guidance, no negative period', async () => {
    await visit('/tools/severance-pay');
    await page.locator('#severance-calculator-1').fill('2026-06-09');
    await page.locator('#severance-calculator-2').fill('2022-01-01');
    await main().getByRole('alert').getByText('퇴사일은 입사일보다').waitFor({ timeout: 3000 });
    assert.equal(await main().getByText(/-\d+년/).count(), 0);
  });

  await test('unix: negative seconds and leading zeros resolve by magnitude', async () => {
    await visit('/tools/unix-timestamp');
    await page.locator('#unix-timestamp-1').fill('-1000000000');
    await main().getByText('초 단위로 해석했습니다.').waitFor({ timeout: 3000 });
    await main().getByText(/^1938-04-24/).waitFor({ timeout: 3000 });
    await page.locator('#unix-timestamp-1').fill('1700000000000');
    await main().getByText('밀리초 단위로 해석했습니다.').waitFor({ timeout: 3000 });
  });

  await test('d-day: anniversaries use the local calendar date (UTC-8)', async () => {
    await visit('/tools/d-day-counter');
    await page.locator('input[type="date"]').first().fill('2026-01-01');
    // Day 100 counting the start date as day 1 → 2026-04-10.
    await main().getByText('2026년 04월 10일', { exact: false }).waitFor({ timeout: 3000 });
  });

  await test('inputs on percentage/speed/timer have accessible names', async () => {
    const checks = [
      ['/tools/percentage-calculator', ['전체 값', '비율(%)', '일부 값', '기존 값', '변경된 값']],
      ['/tools/speed-calculator', ['시간(시)', '시간(분)']],
      ['/tools/timer', ['타이머 시', '타이머 분', '타이머 초']],
    ];
    for (const [route, labels] of checks) {
      await visit(route);
      for (const label of labels) {
        if (route === '/tools/timer' && !(await page.getByLabel(label).count())) {
          await page.getByRole('button', { name: /카운트다운|타이머/ }).first().click().catch(() => {});
        }
        assert.ok((await page.getByLabel(label, { exact: true }).count()) > 0, `${route} ${label}`);
      }
    }
  });
} finally {
  await browser.close();
  await server.close();
}

const failed = results.filter((result) => result.status === 'FAIL').length;
console.log(`CALCULATOR_EDGE_BROWSER ${results.length - failed}/${results.length} pageerrors=${errors.length}`);
if (errors.length) console.log(errors);
process.exitCode = failed || errors.length ? 1 : 0;
