// SPK2-03 share link rebuilt from items + result text separated (T10–T11, PROBE-05).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildShareUrl, decodeState, readStateFromSearch, URL_UNSAFE_LENGTH } from '../src/utils/url-state.ts';
import { buildResultShareText, buildItemsPreview, copyText } from '../src/utils/share.ts';

describe('buildShareUrl', () => {
  it('encodes the current items even when the page URL has no state (storage restore case)', () => {
    const share = buildShareUrl(['짜장면', '짬뽕'], 'https://spinkorea.kr/');
    const restored = readStateFromSearch(new URL(share.url).search);
    assert.equal(restored.status, 'ok');
    assert.deepEqual(restored.state.items, ['짜장면', '짬뽕']);
  });

  it('replaces a stale ?s= and drops non-allowlisted query/hash', () => {
    const stale = buildShareUrl(['OLD'], 'https://spinkorea.kr/').url;
    const share = buildShareUrl(['NEW'], `${stale}&utm_source=kakao&fbclid=1#top`);
    const url = new URL(share.url);
    assert.deepEqual([...url.searchParams.keys()], ['s']);
    assert.equal(url.hash, '');
    assert.deepEqual(decodeState(url.searchParams.get('s')).items, ['NEW']);
  });

  for (const path of ['/', '/lunch-menu', '/random-number', '/spinflow']) {
    it(`keeps the page path ${path}`, () => {
      assert.equal(new URL(buildShareUrl(['A'], `https://spinkorea.kr${path}?x=1`).url).pathname, path);
    });
  }

  it('PROBE-05: thresholds use the complete URL length, not the payload length', () => {
    // Find an incompressible list whose full URL just crosses the 2000-char threshold.
    let code = 0xac00;
    const list = [];
    let share;
    do {
      list.push(Array.from({ length: 10 }, () => String.fromCharCode(code++)).join(''));
      share = buildShareUrl(list, 'https://spinkorea.kr/random-number');
    } while (share.length <= URL_UNSAFE_LENGTH && list.length < 100);
    const payloadLength = new URL(share.url).searchParams.get('s').length;
    assert.equal(share.length, share.url.length);
    assert.equal(share.unsafe, true);
    assert.ok(payloadLength < share.length);
  });
});

describe('result text', () => {
  it('states the result without claiming the link shows it', () => {
    const text = buildResultShareText(['A', 'B', 'C', 'D'], 'C', 'https://spinkorea.kr/?s=x');
    assert.match(text, /룰렛 결과: C/);
    assert.match(text, /같은 후보로 룰렛 열기: https:\/\/spinkorea\.kr\/\?s=x/);
    assert.doesNotMatch(text, /결과 확인/);
  });

  it('can be copied without a link when the URL is too long', () => {
    const text = buildResultShareText(['A'], 'A', null);
    assert.doesNotMatch(text, /https?:/);
  });

  it('summarises long candidate lists', () => {
    assert.equal(buildItemsPreview(['A', 'B', 'C', 'D', 'E']), 'A, B, C 외 2개');
    assert.equal(buildItemsPreview(['A', 'B']), 'A, B');
  });
});

describe('copyText', () => {
  it('resolves true only after the writer succeeds', async () => {
    const written = [];
    assert.equal(await copyText('hi', async (t) => { written.push(t); }), true);
    assert.deepEqual(written, ['hi']);
  });

  it('reports failure when the clipboard is denied and no fallback exists', async () => {
    assert.equal(await copyText('hi', async () => { throw new Error('NotAllowedError'); }), false);
  });
});
