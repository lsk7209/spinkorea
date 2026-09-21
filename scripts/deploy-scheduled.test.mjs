import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { deployScheduled, deploymentErrorMessage } from './deploy-scheduled.mjs';
const start = 1800000000000;
const sha = 'a'.repeat(40);
const hook = 'https://api.vercel.com/v1/integrations/deploy/prj_OIT1xFv2XJLS6bgzFoUf3CY7z9cU/fixture-secret';
const job = { job: { id: 'job_fixture', createdAt: start, state: 'PENDING' } };
const ready = { commitSha: sha, builtAt: start };
function fixture(responses, overrides = {}) {
  let time = start;
  const calls = [], sleeps = [], logs = [];
  return { calls, sleeps, logs, options: {
    env: { VERCEL_DEPLOY_HOOK_URL: hook, GITHUB_REF: 'refs/heads/main', GITHUB_SHA: sha, ...overrides },
    now: () => time, sleep: async ms => { sleeps.push(ms); time += ms; }, log: { log: s => logs.push(s) },
    fetchImpl: async (url, options) => {
      calls.push({ url, ...options });
      assert.ok(options.signal instanceof AbortSignal);
      assert.equal(options.redirect, 'error');
      const body = responses.shift() ?? { status: 404 };
      if (body instanceof Error) throw body;
      if (body.status) return { ok: false, status: body.status };
      return { ok: true, json: async () => { if (body === 'html') throw new Error('fixture-secret'); return body; } };
    },
  } };
}

test('POST once then verify expected fresh commit on custom domain with cache busting', async () => {
  const f = fixture([job, { status: 404 }, 'html', { ...ready, builtAt: start - 1 }, { ...ready, commitSha: 'b'.repeat(40) }, ready]);
  assert.equal(await deployScheduled(f.options), 'job_fixture');
  assert.equal(f.calls.filter(c => c.method === 'POST').length, 1);
  assert.equal(f.calls[0].url, hook);
  assert.ok(f.calls.slice(1).every(c => c.url.startsWith('https://spinkorea.kr/deployment-status.json?check=') && c.method === 'GET' && c.cache === 'no-store'));
  assert.equal(new Set(f.calls.slice(1).map(c => c.url)).size, 5);
  assert.equal(f.sleeps.length, 4);
  assert.equal(f.logs.length, 1);
});
test('ready marker avoids fixed three-minute delay', async () => {
  const f = fixture([job, ready]); await deployScheduled(f.options); assert.deepEqual(f.sleeps, []);
});
test('wrong hook project, host, credentials, query or branch identity cannot POST', async () => {
  for (const overrides of [{ VERCEL_DEPLOY_HOOK_URL: '' }, { VERCEL_DEPLOY_HOOK_URL: hook.replace('api.vercel.com', 'example.com') }, { VERCEL_DEPLOY_HOOK_URL: hook.replace('prj_OIT1xFv2XJLS6bgzFoUf3CY7z9cU', 'prj_other') }, { VERCEL_DEPLOY_HOOK_URL: hook + '?x=1' }, { VERCEL_DEPLOY_HOOK_URL: hook.replace('https://', 'https://user@') }, { GITHUB_REF: 'refs/heads/dev' }, { GITHUB_SHA: 'main' }]) {
    const f = fixture([], overrides); await assert.rejects(deployScheduled(f.options)); assert.equal(f.calls.length, 0);
  }
});
test('ambiguous hook failure, malformed job or implausible timestamp never retries POST', async () => {
  for (const response of [{}, 'html', { status: 403 }, new Error('fixture-secret'), { job: { id: '../x', createdAt: start } }, { job: { id: 'x', createdAt: '1800000000000' } }, { job: { id: 'x', createdAt: start - 61000 } }, { job: { id: 'x', createdAt: start + 61000 } }]) {
    const f = fixture([response]); await assert.rejects(deployScheduled(f.options)); assert.equal(f.calls.length, 1); assert.deepEqual(f.logs, []);
  }
});
test('transient GET HTTP responses retry, authentication failures do not', async () => {
  const f = fixture([job, { status: 429 }, { status: 503 }, ready]); await deployScheduled(f.options); assert.equal(f.sleeps.length, 2);
  for (const status of [401, 403]) { const bad = fixture([job, { status }]); await assert.rejects(deployScheduled(bad.options), new RegExp(`marker request failed \\(HTTP ${status}\\)`)); assert.deepEqual(bad.logs, []); }
});
test('stale, wrong or malformed markers cannot pass and overall deadline is bounded', async () => {
  const f = fixture([job, {}, { ...ready, builtAt: '1800000000000' }, { ...ready, builtAt: start + 1000000 }, { ...ready, commitSha: 'b'.repeat(40) }]);
  await assert.rejects(deployScheduled(f.options), /deadline/);
  assert.equal(f.sleeps.reduce((a,b) => a+b, 0), 600000);
  assert.equal(f.calls.filter(c => c.method === 'POST').length, 1);
  assert.deepEqual(f.logs, []);
});
test('real generator marker uses Vercel SHA and wall-clock time, not publishing clock', () => {
  const source = fs.readFileSync(new URL('./generate-assets.mjs', import.meta.url), 'utf8');
  const match = source.match(/function buildDeploymentMarker\([^]*?\n\}/);
  assert.ok(match);
  const build = vm.runInNewContext(`(${match[0]})`);
  assert.equal(JSON.stringify(build({ VERCEL_GIT_COMMIT_SHA: sha, BUILD_NOW: '2000-01-01' }, start)), JSON.stringify(ready));
  assert.equal(build({}, start).commitSha, null);
  assert.equal(build({ VERCEL_GIT_COMMIT_SHA: 'main' }, start).commitSha, null);
  assert.match(source, /writeFileSync\(path.join\(distDir, "deployment-status.json"\), JSON.stringify\(buildDeploymentMarker\(\)\)\)/);
});
test('CLI masks raw network and JSON errors and never logs secret hook URL', () => {
  const moduleUrl = new URL('./deploy-scheduled.mjs', import.meta.url);
  assert.doesNotMatch(deploymentErrorMessage(new Error(hook)), /fixture-secret/);
  for (const failure of ['throw new Error("fixture-secret")', 'return {ok:true,json:async()=>{throw new Error("fixture-secret")}}']) {
    const code = `globalThis.fetch=async()=>{${failure}};process.argv[1]=${JSON.stringify(fileURLToPath(moduleUrl))};await import(${JSON.stringify(moduleUrl.href)});`;
    const result = spawnSync(process.execPath, ['--input-type=module','-e',code], {encoding:'utf8',timeout:5000,env:{...process.env,VERCEL_DEPLOY_HOOK_URL:hook,GITHUB_REF:'refs/heads/main',GITHUB_SHA:sha}});
    assert.equal(result.status,1);assert.match(result.stderr,/::error::Deployment hook/);assert.doesNotMatch(result.stdout+result.stderr,/fixture-secret/);
  }
});
