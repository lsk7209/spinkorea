import { pathToFileURL } from 'node:url';

const PROJECT = 'prj_OIT1xFv2XJLS6bgzFoUf3CY7z9cU';
const TEAM = 'team_pJUFd9yEIbdAXHsV2rtMDrEb';
const STATES = new Set(['QUEUED', 'INITIALIZING', 'BUILDING', 'READY', 'ERROR', 'CANCELED']);

export async function deployScheduled({ env = process.env, fetchImpl = fetch, now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), log = console } = {}) {
  if (!env.VERCEL_TOKEN?.trim() || env.GITHUB_REF !== 'refs/heads/main' || !/^[a-f0-9]{40}$/i.test(env.GITHUB_SHA || '')) {
    throw new Error('Missing deployment credentials or invalid main commit identity.');
  }
  const deadline = now() + 10 * 60_000;
  const remaining = () => {
    const ms = deadline - now();
    if (ms <= 0) throw new Error('Deployment readiness deadline exceeded.');
    return ms;
  };
  const request = async (path, body) => {
    const res = await fetchImpl(`https://api.vercel.com/v13/deployments${path}?teamId=${TEAM}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(Math.min(30_000, remaining())),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    remaining();
    if (!res.ok) throw new Error('Deployment API request failed.');
    const result = await res.json();
    remaining();
    return result;
  };
  // Never retry POST: an ambiguous response may already have created a build.
  const created = await request('', {
    name: 'spinkorea', project: PROJECT, target: 'production',
    gitSource: { type: 'github', repoId: 1111141054, ref: 'main', sha: env.GITHUB_SHA },
  });
  if (typeof created?.id !== 'string' || !/^dpl_[A-Za-z0-9]+$/.test(created.id)) {
    throw new Error('Invalid deployment identity.');
  }
  const id = created.id;
  while (true) {
    const deployment = await request(`/${id}`);
    if (deployment?.id !== id || !STATES.has(deployment?.readyState)) throw new Error('Invalid deployment readiness response.');
    if (deployment.aliasError || ['ERROR', 'CANCELED'].includes(deployment.readyState)) throw new Error('Deployment or production alias failed.');
    if ((deployment.readyState === 'READY' || Object.hasOwn(deployment, 'aliasAssigned')) && typeof deployment.aliasAssigned !== 'boolean') throw new Error('Invalid deployment alias readiness response.');
    if (deployment.readyState === 'READY' && deployment.aliasAssigned === true) {
      log.log('Scheduled deployment is READY and production alias is assigned.');
      return id;
    }
    await sleep(Math.min(10_000, remaining()));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await deployScheduled(); } catch {
    console.error('::error::Scheduled deployment failed or readiness could not be verified. No notifications will be sent.');
    process.exitCode = 1;
  }
}
