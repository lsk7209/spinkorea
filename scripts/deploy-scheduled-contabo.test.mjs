import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { stat } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { PassThrough } from 'node:stream';
import test from 'node:test';
import {
  deployScheduledContabo, deploymentErrorMessage, parseBuildResponse, runSsh,
  verifyPublicMarker,
} from './deploy-scheduled-contabo.mjs';

const SHA = 'a'.repeat(40);
const OTHER = 'b'.repeat(40);
const BUNDLE = 'c'.repeat(64);
const RECEIPT_PATH = '/var/lib/spinkorea-build/work/build-wfaafxbw/build.json';
const environment = {
  GITHUB_REF: 'refs/heads/main', GITHUB_SHA: SHA,
  CONTABO_HOST: 'build.example.test', CONTABO_USER: 'spinkorea_build',
  CONTABO_KNOWN_HOSTS: 'build.example.test ssh-ed25519 AAAAfixture\n',
  CONTABO_SSH_KEY: 'fixture-private-key\n',
};
const receipt = (sha = SHA, startedMs = 1000) => JSON.stringify({
  result: 'SERVER_BUILD_INSTALL_PASS', pointer: { version: 1, sourceSha: sha,
    releaseId: `${sha}-${BUNDLE.slice(0, 16)}`, manifestSha256: 'd'.repeat(64) }, startedMs,
  bundleSha256: BUNDLE, buildReceipt: RECEIPT_PATH,
});
const marker = (commitSha = SHA, builtAt = 1000) =>
  new Response(JSON.stringify({ commitSha, builtAt }), { status: 200 });

test('receipt requires exact successful build and expected fresh SHA', async () => {
  assert.equal(parseBuildResponse(receipt(), SHA, 1000, 1200).pointer.sourceSha, SHA);
  const recorded = await readFile(new URL('./ssh-build-response.fixture.json', import.meta.url), 'utf8');
  const actual = JSON.parse(recorded);
  assert.equal(parseBuildResponse(recorded, actual.pointer.sourceSha,
    actual.startedMs - 1000, actual.startedMs + 1000).buildReceipt, actual.buildReceipt);
  const invalid = [
    { ...actual, pointer: { ...actual.pointer, version: 2 } },
    { ...actual, pointer: { ...actual.pointer, releaseId: `${actual.pointer.sourceSha}-badbadbadbadbadb` } },
    { ...actual, pointer: { ...actual.pointer, manifestSha256: 'x'.repeat(64) } },
    { ...actual, buildReceipt: '/tmp/other/build.json' },
    { ...actual, buildReceipt: { sourceSha: actual.pointer.sourceSha } },
    { ...actual, bundleSha256: 'x'.repeat(64) },
  ];
  for (const raw of [receipt(OTHER), receipt(SHA, 100_000), '{}', 'not json']) {
    assert.throws(() => parseBuildResponse(raw, SHA, 1000, 1200));
  }
  for (const value of invalid) {
    assert.throws(() => parseBuildResponse(JSON.stringify(value), actual.pointer.sourceSha,
      actual.startedMs - 1000, actual.startedMs + 1000));
  }
});

test('public marker accepts only same expected SHA and fresh builtAt', async () => {
  let calls = 0;
  let clock = 2000;
  const result = await verifyPublicMarker({ sha: SHA, startedMs: 1000,
    now: () => clock, sleep: async () => { clock += 10_000; },
    fetchImpl: async (url, options) => {
      calls += 1;
      assert.match(url, /^https:\/\/spinkorea\.kr\/deployment-status\.json\?check=/);
      assert.equal(options.redirect, 'error');
      return calls === 1 ? marker(OTHER, 1000) : calls === 2 ? marker(SHA, 999) : marker(SHA, 1000);
    },
  });
  assert.equal(result.commitSha, SHA);
  assert.equal(calls, 3);
  await assert.rejects(verifyPublicMarker({ sha: SHA, startedMs: 1000,
    now: () => 2000, deadlineMs: 1, fetchImpl: async () => new Response('', { status: 403 }) }),
  /HTTP 403/);
});

test('oversized public marker cancels its response stream', async () => {
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(16_385)); },
    cancel() { cancelled = true; },
  });
  await assert.rejects(verifyPublicMarker({ sha: SHA, startedMs: 1000, now: () => 2000,
    fetchImpl: async () => new Response(stream) }), /marker exceeds bound/);
  assert.equal(cancelled, true);
});

test('deployment calls transport once, gates public readiness, and rejects bad identity', async () => {
  let transports = 0;
  let checks = 0;
  const common = { env: environment, now: () => 2000, log: { log() {} },
    transport: async input => { transports += 1; assert.equal(input.sha, SHA); return receipt(SHA, 1000); },
    fetchImpl: async () => { checks += 1; return marker(SHA, 1000); } };
  assert.equal((await deployScheduledContabo(common)).pointer.sourceSha, SHA);
  assert.equal(transports, 1);
  assert.equal(checks, 1);
  await assert.rejects(deployScheduledContabo({ ...common, env: { ...environment, GITHUB_SHA: OTHER },
    fetchImpl: async () => marker(SHA, 1000), transport: async () => receipt(SHA, 1000) }),
  /receipt does not match/);
  await assert.rejects(deployScheduledContabo({ ...common, env: { ...environment, CONTABO_HOST: '-evil' } }),
  /transport configuration/);
  assert.match(deploymentErrorMessage(new Error('secret')), /readiness verification failed/);
});

test('SSH transport uses fixed executable and args, bounded stdin, private temp files, cleanup', async () => {
  let captured;
  const spawnImpl = (command, args, options) => {
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.stdin = new PassThrough();
    child.kill = () => {};
    captured = { command, args, options, stdin: '' };
    child.stdin.on('data', chunk => { captured.stdin += chunk.toString(); });
    child.stdin.on('finish', async () => {
      const keyPath = args[args.indexOf('-i') + 1];
      const hostsPath = args.find(x => x.startsWith('UserKnownHostsFile=')).split('=')[1];
      captured.keyMode = (await stat(keyPath)).mode & 0o777;
      captured.hostsMode = (await stat(hostsPath)).mode & 0o777;
      captured.keyPath = keyPath;
      child.stdout.end('ok');
      child.emit('close', 0);
    });
    return child;
  };
  const raw = await runSsh({ host: environment.CONTABO_HOST, user: environment.CONTABO_USER,
    knownHosts: environment.CONTABO_KNOWN_HOSTS, key: environment.CONTABO_SSH_KEY, sha: SHA },
  { spawnImpl, timeoutMs: 1000 });
  assert.equal(raw, 'ok');
  assert.equal(captured.command, '/usr/bin/ssh');
  assert.equal(captured.options.shell, false);
  assert.deepEqual(captured.args.slice(-2), ['-T', 'spinkorea_build@build.example.test']);
  assert.equal(captured.stdin, `build ${SHA}\n`);
  if (process.platform !== 'win32') {
    assert.equal(captured.keyMode, 0o600);
    assert.equal(captured.hostsMode, 0o600);
  }
  await assert.rejects(stat(captured.keyPath), { code: 'ENOENT' });
});

test('SSH kills and rejects oversized output without a retry', async () => {
  let killed = 0;
  const spawnImpl = () => {
    const child = new EventEmitter();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.stdin = new PassThrough();
    child.kill = () => { killed += 1; child.emit('close', 137); };
    process.nextTick(() => child.stdout.write(Buffer.alloc(65 * 1024)));
    return child;
  };
  await assert.rejects(runSsh({ host: environment.CONTABO_HOST, user: environment.CONTABO_USER,
    knownHosts: environment.CONTABO_KNOWN_HOSTS, key: environment.CONTABO_SSH_KEY, sha: SHA },
  { spawnImpl, timeoutMs: 1000 }), /response exceeds bound/);
  assert.equal(killed, 1);
});

test('workflow retains sole schedule, validation and notification gates without Vercel', async () => {
  let workflow;
  try {
    workflow = await readFile(new URL('../.github/workflows/scheduled-publish.yml', import.meta.url), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    workflow = await readFile(new URL('./scheduled-publish.candidate.yml', import.meta.url), 'utf8');
  }
  assert.equal((workflow.match(/cron: "0 0 \* \* \*"/g) ?? []).length, 1);
  assert.match(workflow, /group: scheduled-publish-production/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /default: false/);
  assert.match(workflow, /W=26\*3600000/);
  assert.match(workflow, /github\.event_name \}\}" = "schedule"/);
  for (const command of ['npm ci', 'npm run content:validate', 'npm run type-check',
    'node --test scripts/deploy-scheduled-contabo.test.mjs', 'node scripts/deploy-scheduled-contabo.mjs']) {
    assert.ok(workflow.includes(command), command);
  }
  assert.match(workflow, /environment: contabo-publish/);
  for (const name of ['SPINKOREA_CONTABO_HOST', 'SPINKOREA_CONTABO_USER',
    'SPINKOREA_CONTABO_KNOWN_HOSTS', 'SPINKOREA_CONTABO_PUBLISH_SSH_KEY']) {
    assert.ok(workflow.includes(name), name);
  }
  assert.match(workflow, /steps\.deploy\.outcome == 'success'/);
  assert.ok(workflow.indexOf('node scripts/deploy-scheduled-contabo.mjs') < workflow.indexOf('npm run notify:google'));
  assert.doesNotMatch(workflow, /VERCEL_DEPLOY_HOOK_URL|deploy-scheduled\.mjs|api\.vercel\.com/);
});
