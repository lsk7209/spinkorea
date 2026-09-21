import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

class DeploymentError extends Error {}
export function deploymentErrorMessage(error) {
  return error instanceof DeploymentError ? error.message : 'Scheduled deployment failed or readiness could not be verified.';
}
function httpFailure(phase, response) {
  const status = Number.isInteger(response.status) && response.status >= 100 && response.status <= 599 ? `HTTP ${response.status}` : 'unknown HTTP status';
  return new DeploymentError(`Deployment ${phase} request failed (${status}).`);
}

export async function deployScheduled({ env = process.env, fetchImpl = fetch, now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), log = console } = {}) {
  let hook;
  try { hook = new URL(env.VERCEL_DEPLOY_HOOK_URL); } catch { throw new DeploymentError('Invalid deployment hook configuration.'); }
  if (hook.protocol !== 'https:' || hook.host !== 'api.vercel.com' || hook.username || hook.password || hook.search || hook.hash || !/^\/v1\/integrations\/deploy\/prj_OIT1xFv2XJLS6bgzFoUf3CY7z9cU\/[A-Za-z0-9_-]+$/.test(hook.pathname)) throw new DeploymentError('Invalid deployment hook configuration.');
  if (env.GITHUB_REF !== 'refs/heads/main' || !/^[a-f0-9]{40}$/.test(env.GITHUB_SHA || '')) throw new DeploymentError('Invalid main commit identity.');
  const startedAt = now();
  const deadline = startedAt + 10 * 60_000;
  const remaining = () => {
    const ms = deadline - now();
    if (ms <= 0) throw new DeploymentError('Deployment readiness deadline exceeded.');
    return ms;
  };
  const request = async (url, method, phase) => {
    const signal = AbortSignal.timeout(Math.min(30_000, remaining()));
    try {
      const response = await fetchImpl(url, { method, signal, redirect: 'error', cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      remaining();
      return response;
    } catch (error) {
      if (error instanceof DeploymentError) throw error;
      throw new DeploymentError(`Deployment ${phase} request failed or timed out.`);
    }
  };
  // Never retry the hook POST: an ambiguous response may already start a build.
  const response = await request(hook.href, 'POST', 'hook');
  if (!response.ok) throw httpFailure('hook', response);
  let body;
  try { body = await response.json(); } catch { throw new DeploymentError('Deployment hook response was not valid JSON.'); }
  remaining();
  const job = body?.job;
  if (typeof job?.id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(job.id) || !Number.isSafeInteger(job.createdAt) || job.createdAt < startedAt - 60_000 || job.createdAt > now() + 60_000) throw new DeploymentError('Invalid deployment hook job identity or timestamp.');
  // This verifies a fresh artifact on the custom domain, not a deployment ID
  // linked to the hook job. A main-branch race intentionally cannot pass.
  while (true) {
    const markerResponse = await request(`https://spinkorea.kr/deployment-status.json?check=${randomUUID()}`, 'GET', 'marker');
    if (markerResponse.ok) {
      let marker;
      try { marker = await markerResponse.json(); } catch { /* Old SPA fallback can return HTML until deployment. */ }
      remaining();
      if (marker?.commitSha === env.GITHUB_SHA && Number.isSafeInteger(marker.builtAt) && marker.builtAt >= job.createdAt && marker.builtAt <= now() + 60_000) {
        log.log('Fresh expected commit verified on the production domain.');
        return job.id;
      }
    } else if (markerResponse.status !== 404 && markerResponse.status !== 429 && !(markerResponse.status >= 500 && markerResponse.status <= 599)) {
      throw httpFailure('marker', markerResponse);
    }
    await sleep(Math.min(10_000, remaining()));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await deployScheduled(); } catch (error) {
    console.error(`::error::${deploymentErrorMessage(error)} No notifications will be sent.`);
    process.exitCode = 1;
  }
}
