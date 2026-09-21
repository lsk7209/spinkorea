import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deployScheduled } from './deploy-scheduled.mjs';

const id = 'dpl_fixture';
const ready = { id, readyState: 'READY', aliasAssigned: true };
function fixture(responses, overrides = {}) {
  let time = 0;
  const calls = [], sleeps = [], logs = [];
  return {
    calls, sleeps, logs,
    options: {
      env: { VERCEL_TOKEN: 'fixture-secret', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: 'a'.repeat(40), ...overrides },
      now: () => time,
      sleep: async ms => { sleeps.push(ms); time += ms; },
      log: { log: message => logs.push(message) },
      fetchImpl: async (url, options) => {
        calls.push({ url, ...options });
        assert.ok(options.signal instanceof AbortSignal);
        const body = responses.shift() ?? { id, readyState: 'BUILDING' };
        if (body instanceof Error) throw body;
        if (body.status) return { ok: false };
        return { ok: true, json: async () => body };
      },
    },
  };
}

test('one POST targets exact main SHA; polls only returned id and waits for alias', async () => {
  const f = fixture([{ id }, { id, readyState: 'QUEUED' }, { id, readyState: 'BUILDING' }, { id, readyState: 'READY', aliasAssigned: false }, ready]);
  assert.equal(await deployScheduled(f.options), id);
  assert.equal(f.calls.filter(c => c.method === 'POST').length, 1);
  assert.deepEqual(JSON.parse(f.calls[0].body), {
    name: 'spinkorea', project: 'prj_OIT1xFv2XJLS6bgzFoUf3CY7z9cU', target: 'production',
    gitSource: { type: 'github', repoId: 1111141054, ref: 'main', sha: 'a'.repeat(40) },
  });
  assert.ok(f.calls.slice(1).every(c => c.url === `https://api.vercel.com/v13/deployments/${id}?teamId=team_pJUFd9yEIbdAXHsV2rtMDrEb` && c.method === 'GET'));
  assert.deepEqual(f.sleeps, [10000, 10000, 10000]);
  assert.equal(f.logs.length, 1);
});

test('ready immediately avoids unconditional delay', async () => {
  const f = fixture([{ id }, ready]);
  await deployScheduled(f.options);
  assert.deepEqual(f.sleeps, []);
});

test('invalid credentials or branch identity never POST', async () => {
  for (const overrides of [{ VERCEL_TOKEN: '' }, { VERCEL_TOKEN: ' ' }, { GITHUB_REF: 'refs/heads/dev' }, { GITHUB_SHA: 'main' }, { GITHUB_SHA: '' }]) {
    const f = fixture([], overrides);
    await assert.rejects(deployScheduled(f.options));
    assert.equal(f.calls.length, 0);
  }
});

test('failed POST or malformed creation id is not retried', async () => {
  for (const response of [{}, { id: '../other' }, { status: 403 }, new Error('network')]) {
    const f = fixture([response]);
    await assert.rejects(deployScheduled(f.options));
    assert.equal(f.calls.length, 1);
    assert.deepEqual(f.logs, []);
  }
});

test('failed, canceled, alias errors and mismatched or malformed statuses fail closed', async () => {
  for (const response of [{ id, readyState: 'ERROR' }, { id, readyState: 'CANCELED' }, { ...ready, aliasError: { message: 'failed' } }, { ...ready, id: 'dpl_other' }, {}, { id, readyState: 'UNKNOWN' }, { status: 500 }, new Error('network')]) {
    const f = fixture([{ id }, response]);
    await assert.rejects(deployScheduled(f.options));
    assert.deepEqual(f.logs, []);
  }
});

test('overall deadline bounds polling and does not create another deployment', async () => {
  const f = fixture([{ id }]);
  await assert.rejects(deployScheduled(f.options), /deadline/);
  assert.equal(f.sleeps.reduce((sum, ms) => sum + ms, 0), 600000);
  assert.equal(f.calls.filter(c => c.method === 'POST').length, 1);
  assert.equal(f.calls.length, 61);
  assert.deepEqual(f.logs, []);
});

test('malformed or missing READY aliasAssigned fails immediately', async () => {
  for (const aliasAssigned of ['true', 1, undefined, null]) {
    const f = fixture([{ id }, { ...ready, aliasAssigned }]);
    await assert.rejects(deployScheduled(f.options), /alias readiness/);
    assert.equal(f.sleeps.length, 0);
    assert.deepEqual(f.logs, []);
  }
});
