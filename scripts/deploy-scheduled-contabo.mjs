import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SHA = /^[a-f0-9]{40}$/;
const HASH = /^[a-f0-9]{64}$/;
const HOST = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,251}[a-zA-Z0-9])?|\[[0-9a-fA-F:]+\])$/;
const USER = /^[a-z_][a-z0-9_-]{0,31}$/;
const MAX_STDOUT = 64 * 1024;
const MAX_STDERR = 8 * 1024;

class DeploymentError extends Error {}
export function deploymentErrorMessage(error) {
  return error instanceof DeploymentError ? error.message : 'Scheduled server build or readiness verification failed.';
}

function expectedSha(env) {
  if (env.GITHUB_REF !== 'refs/heads/main' || !SHA.test(env.GITHUB_SHA ?? '')) {
    throw new DeploymentError('Invalid main commit identity.');
  }
  return env.GITHUB_SHA;
}

function transportConfig(env) {
  const host = env.CONTABO_HOST;
  const user = env.CONTABO_USER;
  const knownHosts = env.CONTABO_KNOWN_HOSTS;
  const key = env.CONTABO_SSH_KEY;
  if (!HOST.test(host ?? '') || !USER.test(user ?? '') || !knownHosts || !key ||
      knownHosts.length > 16_384 || key.length > 16_384 || knownHosts.includes('\0') || key.includes('\0')) {
    throw new DeploymentError('Invalid Contabo transport configuration.');
  }
  return { host, user, knownHosts, key };
}

export function parseBuildResponse(raw, sha, requestedAt, now) {
  let value;
  try { value = JSON.parse(raw); } catch { throw new DeploymentError('Server build response is not JSON.'); }
  // Receipt location is informational operator evidence; no client file access or authority derives from it.
  const receiptSuffix = /^build-[a-z0-9_]{8}\/build\.json$/;
  const receiptPrefixes = SHA.test(sha ?? '') ? ['/var/lib/spinkorea-build/work/',
    `/var/lib/spinkorea-build/adoption-${sha.slice(0, 7)}/work/`] : [];
  const validReceiptPath = typeof value?.buildReceipt === 'string' && receiptPrefixes.some(prefix =>
    value.buildReceipt.startsWith(prefix) && receiptSuffix.test(value.buildReceipt.slice(prefix.length)));
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).sort().join(',') !== 'buildReceipt,bundleSha256,pointer,result,startedMs' ||
      value.result !== 'SERVER_BUILD_INSTALL_PASS' ||
      !value.pointer || typeof value.pointer !== 'object' || Array.isArray(value.pointer) ||
      Object.keys(value.pointer).sort().join(',') !== 'manifestSha256,releaseId,sourceSha,version' ||
      value.pointer.version !== 1 || value.pointer.sourceSha !== sha ||
      !Number.isSafeInteger(value.startedMs) || value.startedMs < requestedAt - 60_000 ||
      value.startedMs > now + 60_000 || !HASH.test(value.bundleSha256 ?? '') ||
      !HASH.test(value.pointer.manifestSha256 ?? '') ||
      value.pointer.releaseId !== `${sha}-${value.bundleSha256.slice(0, 16)}` ||
      !validReceiptPath) {
    throw new DeploymentError('Server build receipt does not match expected commit and fresh attempt.');
  }
  return value;
}

export function runSsh({ host, user, knownHosts, key, sha }, { spawnImpl = spawn, timeoutMs = 11 * 60_000 } = {}) {
  return (async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'spinkorea-build-'));
    try {
      const keyPath = path.join(directory, 'identity');
      const hostsPath = path.join(directory, 'known_hosts');
      await writeFile(keyPath, key, { mode: 0o600, flag: 'wx' });
      await writeFile(hostsPath, knownHosts, { mode: 0o600, flag: 'wx' });
      const args = ['-F', '/dev/null', '-i', keyPath, '-o', 'BatchMode=yes',
        '-o', 'StrictHostKeyChecking=yes', '-o', `UserKnownHostsFile=${hostsPath}`,
        '-o', 'IdentitiesOnly=yes', '-o', 'ForwardAgent=no', '-o', 'ClearAllForwardings=yes',
        '-o', 'ConnectTimeout=15', '-T', `${user}@${host}`];
      return await new Promise((resolve, reject) => {
        let child;
        try { child = spawnImpl('/usr/bin/ssh', args, {
          shell: false, stdio: ['pipe', 'pipe', 'pipe'],
          env: { PATH: '/usr/bin:/bin', HOME: os.homedir() },
        }); } catch { reject(new DeploymentError('SSH process could not start.')); return; }
        let stdout = '';
        let stderr = '';
        let settled = false;
        const timer = setTimeout(() => {
          finish(new DeploymentError('SSH build deadline exceeded.'));
          child.kill('SIGKILL');
        }, timeoutMs);
        const finish = (error, value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (error) reject(error); else resolve(value);
        };
        child.on('error', () => finish(new DeploymentError('SSH process failed.')));
        child.stdout.on('data', chunk => {
          if (settled) return;
          if (Buffer.byteLength(stdout) + chunk.byteLength > MAX_STDOUT) {
            finish(new DeploymentError('SSH response exceeds bound.'));
            child.stdout.destroy(); child.stderr.destroy(); child.kill('SIGKILL');
            return;
          }
          stdout += chunk.toString('utf8');
        });
        child.stderr.on('data', chunk => {
          if (settled) return;
          if (Buffer.byteLength(stderr) + chunk.byteLength > MAX_STDERR) {
            finish(new DeploymentError('SSH error output exceeds bound.'));
            child.stdout.destroy(); child.stderr.destroy(); child.kill('SIGKILL');
            return;
          }
          stderr += chunk.toString('utf8');
        });
        child.on('close', code => {
          if (code !== 0) finish(new DeploymentError('SSH server build failed.'));
          else finish(undefined, stdout);
        });
        child.stdin.on('error', () => finish(new DeploymentError('SSH request write failed.')));
        child.stdin.end(`build ${sha}\n`);
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  })();
}

async function boundedJson(response) {
  if (!response.body) throw new DeploymentError('Public marker body missing.');
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 16_384) {
        try { await reader.cancel(); } catch { /* Bound failure remains authoritative. */ }
        throw new DeploymentError('Public marker exceeds bound.');
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { reader.releaseLock(); }
}

export async function verifyPublicMarker({ sha, startedMs, fetchImpl = fetch,
  now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
  deadlineMs = 8 * 60_000 } = {}) {
  const deadline = now() + deadlineMs;
  while (true) {
    const remaining = deadline - now();
    if (remaining <= 0) throw new DeploymentError('Public readiness deadline exceeded.');
    let response;
    try {
      response = await fetchImpl(`https://spinkorea.kr/deployment-status.json?check=${randomUUID()}`,
        { method: 'GET', redirect: 'error', cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(Math.min(30_000, remaining)) });
    } catch { throw new DeploymentError('Public marker request failed or timed out.'); }
    if (response.ok) {
      let marker;
      try { marker = await boundedJson(response); } catch (error) {
        if (error instanceof DeploymentError) throw error;
      }
      if (marker?.commitSha === sha && Number.isSafeInteger(marker.builtAt) &&
          marker.builtAt >= startedMs && marker.builtAt <= now() + 60_000) return marker;
    } else if (response.status !== 404 && response.status !== 429 && !(response.status >= 500 && response.status <= 599)) {
      throw new DeploymentError(`Public marker returned HTTP ${response.status}.`);
    }
    const wait = Math.min(10_000, deadline - now());
    if (wait <= 0) throw new DeploymentError('Public readiness deadline exceeded.');
    await sleep(wait);
  }
}

export async function deployScheduledContabo({ env = process.env, now = Date.now,
  transport = runSsh, fetchImpl = fetch, sleep, log = console } = {}) {
  const sha = expectedSha(env);
  const config = transportConfig(env);
  const requestedAt = now();
  // Ambiguous transport results are never retried: the server may have built already.
  const raw = await transport({ ...config, sha });
  if (typeof raw !== 'string' || Buffer.byteLength(raw) > MAX_STDOUT) throw new DeploymentError('Invalid SSH response size.');
  const receipt = parseBuildResponse(raw, sha, requestedAt, now());
  await verifyPublicMarker({ sha, startedMs: receipt.startedMs, fetchImpl, now, sleep });
  log.log('Fresh expected server-built commit verified on the production domain.');
  return receipt;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await deployScheduledContabo(); } catch (error) {
    console.error(`::error::${deploymentErrorMessage(error)} No notifications will be sent.`);
    process.exitCode = 1;
  }
}
