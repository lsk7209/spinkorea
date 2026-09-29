// SPK2-13 API contract tests. Handlers run with mocked req/res and a mocked
// @libsql/client; no network, no DB. Previously these pinned the "GAP"
// behaviour; after hardening they assert the rejections instead.
// Run: npm run test:api-harness
import { describe, it, mock, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';

const dbCalls = [];
let nextRows = [];
/** Errors thrown by successive execute() calls before normal results resume. */
const queuedErrors = [];
mock.module('@libsql/client', {
  namedExports: {
    createClient: () => ({
      execute: async (query) => {
        dbCalls.push(query);
        const error = queuedErrors.shift();
        if (error) throw error;
        return { rows: nextRows };
      },
    }),
  },
});

function constraintError() {
  return Object.assign(new Error('SQLITE_CONSTRAINT_PRIMARYKEY: UNIQUE constraint failed: shortened_urls.id'), {
    code: 'SQLITE_CONSTRAINT_PRIMARYKEY',
  });
}

let shorten;
let generateShortId;
let stats;
let redirect;
before(async () => {
  ({ default: shorten, generateShortId } = await import('../../api/shorten.ts'));
  stats = (await import('../../api/stats.ts')).default;
  redirect = (await import('../../api/s/[id].ts')).default;
});

afterEach(() => {
  dbCalls.length = 0;
  queuedErrors.length = 0;
  nextRows = [];
  delete process.env.TURSO_DATABASE_URL;
});

function createRes() {
  const res = { statusCode: 200, body: undefined, headers: {}, location: undefined };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  res.end = () => res;
  res.redirect = (code, url) => { res.statusCode = code; res.location = url; return res; };
  return res;
}

async function call(handler, { method = 'POST', body, query = {}, host = 'evil.example' } = {}) {
  const res = createRes();
  await handler({ method, body, query, headers: { host } }, res);
  return res;
}

const VALID_SHARE = 'https://spinkorea.kr/random-number?s=N4IgLg';

describe('api/shorten', () => {
  it('rejects non-POST', async () => {
    assert.equal((await call(shorten, { method: 'GET' })).statusCode, 405);
  });

  it('restricts CORS to the canonical origin', async () => {
    const res = await call(shorten, { method: 'OPTIONS' });
    assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://spinkorea.kr');
    assert.equal(res.statusCode, 204);
  });

  it('returns 400 (not a crash) for null/array/string bodies', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    for (const body of [null, undefined, [], 'originalUrl=x', 42]) {
      assert.equal((await call(shorten, { body })).statusCode, 400, String(body));
    }
    assert.equal(dbCalls.length, 0);
  });

  it('rejects anything that is not a SpinFlow share link, without DB writes', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    const rejected = [
      'mailto:someone@example.com',
      'javascript:void(0)',
      'https://example.org/',
      'http://spinkorea.kr/',
      'https://spinkorea.kr.evil.example/',
      'https://user:pw@spinkorea.kr/',
      'https://spinkorea.kr:8443/',
      'https://spinkorea.kr//evil.example',
      'https://spinkorea.kr/?s=x&redirect=https://evil.example',
      'https://spinkorea.kr/#frag',
      `https://spinkorea.kr/?s=${'a'.repeat(5000)}`,
      'not a url',
    ];
    for (const originalUrl of rejected) {
      assert.equal((await call(shorten, { body: { originalUrl } })).statusCode, 400, originalUrl);
    }
    assert.equal(dbCalls.length, 0);
  });

  it('returns 503 for a valid link when the DB is not configured', async () => {
    assert.equal((await call(shorten, { body: { originalUrl: VALID_SHARE } })).statusCode, 503);
  });

  it('stores a valid share link and builds shortUrl from the canonical origin, not Host', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    const res = await call(shorten, { body: { originalUrl: VALID_SHARE }, host: 'evil.example' });
    assert.equal(res.statusCode, 200);
    assert.match(res.body.shortUrl, /^https:\/\/spinkorea\.kr\/s\/[A-Za-z0-9]{8}$/);
    assert.equal(dbCalls.length, 1);
  });

  it('retries with a new id when the generated id collides', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    queuedErrors.push(constraintError());
    const res = await call(shorten, { body: { originalUrl: VALID_SHARE } });
    assert.equal(res.statusCode, 200);
    assert.equal(dbCalls.length, 2);
    assert.notEqual(dbCalls[0].args[0], dbCalls[1].args[0]);
    assert.equal(res.body.shortId, dbCalls[1].args[0]);
  });

  it('gives up after three collisions and does not retry other DB errors', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    queuedErrors.push(constraintError(), constraintError(), constraintError());
    const exhausted = await call(shorten, { body: { originalUrl: VALID_SHARE } });
    assert.equal(exhausted.statusCode, 500);
    assert.equal(dbCalls.length, 3);

    dbCalls.length = 0;
    queuedErrors.length = 0;
    queuedErrors.push(new Error('network down'));
    const failed = await call(shorten, { body: { originalUrl: VALID_SHARE } });
    assert.equal(failed.statusCode, 500);
    assert.equal(dbCalls.length, 1);
  });

  it('generates 8-char ids from the full alphabet without modulo bias', () => {
    const counts = new Map();
    const samples = 4000;
    for (let i = 0; i < samples; i++) {
      const id = generateShortId();
      assert.match(id, /^[A-Za-z0-9]{8}$/);
      for (const ch of id) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    }
    assert.equal(counts.size, 62);
    // Expected ≈ 516 per char; biased `byte % 62` would push a..h to ~1.2x. Generous bounds avoid flakiness.
    const expected = (samples * 8) / 62;
    for (const count of counts.values()) {
      assert.ok(count > expected * 0.75 && count < expected * 1.25, `count ${count}`);
    }
  });
});

describe('api/stats', () => {
  it('reports not-stored (503) instead of success when the DB is not configured', async () => {
    const res = await call(stats, { body: { itemsCount: 2, result: 'A' } });
    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.body, { stored: false });
  });

  it('rejects malformed bodies, fractional/out-of-range counts and oversized results', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    const bodies = [
      null, [], 'x', {}, { itemsCount: '2', result: 'A' }, { itemsCount: 0, result: 'A' },
      { itemsCount: 1.5, result: 'A' }, { itemsCount: 101, result: 'A' },
      { itemsCount: 2, result: 3 }, { itemsCount: 2, result: '' }, { itemsCount: 2, result: 'x'.repeat(10_001) },
    ];
    for (const body of bodies) {
      assert.equal((await call(stats, { body })).statusCode, 400, JSON.stringify(body)?.slice(0, 40));
    }
    assert.equal(dbCalls.length, 0);
  });

  it('stores only the count; raw result text never reaches the DB', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    const res = await call(stats, { body: { itemsCount: 3, result: '홍길동' } });
    assert.equal(res.statusCode, 200);
    assert.equal(dbCalls.length, 1);
    assert.deepEqual(dbCalls[0].args.slice(0, 2), [3, '']);
    assert.ok(!JSON.stringify(dbCalls).includes('홍길동'));
  });
});

describe('api/s/[id]', () => {
  it('404s malformed ids without a DB query', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    for (const id of ['', 'short', '../../etc', 'aaaaaaaaa']) {
      assert.equal((await call(redirect, { method: 'GET', query: { id } })).statusCode, 404);
    }
    assert.equal(dbCalls.length, 0);
  });

  it('redirects to a stored SpinFlow link', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    nextRows = [{ original_url: VALID_SHARE }];
    const res = await call(redirect, { method: 'GET', query: { id: 'Abcdefgh' } });
    assert.equal(res.statusCode, 302);
    assert.equal(res.location, VALID_SHARE);
  });

  it('refuses to redirect legacy rows pointing off-site (open redirect guard)', async () => {
    process.env.TURSO_DATABASE_URL = 'libsql://mock';
    for (const url of ['https://example.org/', 'javascript:alert(1)', 'https://spinkorea.kr//evil.example']) {
      nextRows = [{ original_url: url }];
      const res = await call(redirect, { method: 'GET', query: { id: 'Abcdefgh' } });
      assert.equal(res.statusCode, 404, url);
      assert.equal(res.location, undefined);
    }
  });
});
