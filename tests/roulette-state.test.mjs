// SPK2-02 shared restore validator + size caps (T03–T05, PROBE-01..03).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import LZString from 'lz-string';
import { isRouletteState } from '../src/utils/roulette-storage.ts';
import { validateItems, MAX_ITEMS, MAX_ITEM_LENGTH } from '../src/utils/validation.ts';
import {
  decodeState,
  encodeState,
  readStateFromSearch,
  MAX_ENCODED_STATE_LENGTH,
  MAX_DECODED_STATE_LENGTH,
} from '../src/utils/url-state.ts';
import { TEMPLATES } from '../src/data/templates.ts';

const items = (count, length = 1) => Array.from({ length: count }, (_, i) => String(i).padStart(length, 'A').slice(-length));
const encodeRaw = (value) => LZString.compressToEncodedURIComponent(JSON.stringify(value));

describe('isRouletteState (storage + URL entry points)', () => {
  it('accepts the editor boundary: 100 items × 50 chars', () => {
    const boundary = items(MAX_ITEMS, MAX_ITEM_LENGTH);
    assert.equal(validateItems(boundary).valid, true);
    assert.equal(isRouletteState({ v: 1, items: boundary }), true);
  });

  const rejected = {
    'PROBE-01 unsupported version 999': { v: 999, items: ['A'] },
    'version 0': { v: 0, items: ['A'] },
    'string version': { v: '1', items: ['A'] },
    'PROBE-02 101 items': { v: 1, items: items(101) },
    'PROBE-03 51-char item': { v: 1, items: ['A'.repeat(51)] },
    'empty list': { v: 1, items: [] },
    'empty string item': { v: 1, items: ['A', ''] },
    'whitespace-only item': { v: 1, items: ['   '] },
    'untrimmed item': { v: 1, items: [' A'] },
    'number mixed in': { v: 1, items: ['A', 3] },
    'null item': { v: 1, items: [null] },
    'items not array': { v: 1, items: 'A,B' },
    'null state': null,
  };
  for (const [name, value] of Object.entries(rejected)) {
    it(`rejects ${name}`, () => {
      assert.equal(isRouletteState(value), false);
    });
  }

  it('editor and restore agree on the 101/51 boundary', () => {
    assert.equal(validateItems(items(101)).valid, false);
    assert.equal(validateItems(['A'.repeat(51)]).valid, false);
  });

  it('keeps duplicates as separate entries (no silent dedupe)', () => {
    assert.equal(isRouletteState({ v: 1, items: ['A', 'A', 'B'] }), true);
  });

  it('every built-in template is restorable', () => {
    for (const template of TEMPLATES) {
      assert.equal(isRouletteState({ v: 1, items: template.items }), true, template.id);
    }
  });
});

describe('decodeState / readStateFromSearch', () => {
  it('round-trips Korean, emoji and duplicates in order', () => {
    const state = { v: 1, items: ['한식', '🍕 피자', '👨‍👩‍👧 가족', '한식'] };
    assert.deepEqual(decodeState(encodeState(state).encoded), state);
  });

  it('distinguishes none / ok / invalid', () => {
    assert.deepEqual(readStateFromSearch(''), { status: 'none' });
    assert.deepEqual(readStateFromSearch('?utm_source=x'), { status: 'none' });
    const ok = readStateFromSearch(`?s=${encodeState({ v: 1, items: ['A'] }).encoded}`);
    assert.equal(ok.status, 'ok');
    assert.equal(readStateFromSearch('?s=').status, 'invalid');
    assert.equal(readStateFromSearch('?s=%%%broken').status, 'invalid');
    assert.equal(readStateFromSearch(`?s=${encodeRaw({ v: 999, items: ['A'] })}`).status, 'invalid');
    assert.equal(readStateFromSearch(`?s=${encodeRaw({ v: 1, items: items(101) })}`).status, 'invalid');
  });

  it('rejects corrupt compressed data and non-JSON payloads', () => {
    assert.equal(decodeState('not-lz-data'), null);
    assert.equal(decodeState(LZString.compressToEncodedURIComponent('{broken')), null);
  });

  it('rejects oversized input before decompressing', () => {
    assert.equal(decodeState('A'.repeat(MAX_ENCODED_STATE_LENGTH + 1)), null);
  });

  it('rejects decompressed JSON over the cap', () => {
    const huge = LZString.compressToEncodedURIComponent(JSON.stringify({ v: 1, items: ['A'], pad: 'x'.repeat(MAX_DECODED_STATE_LENGTH) }));
    assert.ok(huge.length <= MAX_ENCODED_STATE_LENGTH, 'compressible padding passes the first cap');
    assert.equal(decodeState(huge), null);
  });

  it('caps leave room for the worst-case valid state (measured)', () => {
    // Non-repeating BMP characters defeat LZ compression.
    let code = 0xac00;
    const worstItems = Array.from({ length: MAX_ITEMS }, () =>
      Array.from({ length: MAX_ITEM_LENGTH }, () => String.fromCharCode(code++)).join(''),
    );
    const worst = { v: 1, items: worstItems };
    const { encoded, length } = encodeState(worst);
    assert.ok(length <= MAX_ENCODED_STATE_LENGTH, `encoded worst case ${length} <= ${MAX_ENCODED_STATE_LENGTH}`);
    assert.ok(JSON.stringify(worst).length <= MAX_DECODED_STATE_LENGTH);
    assert.deepEqual(decodeState(encoded), worst);

    const controlItems = Array.from({ length: MAX_ITEMS }, () => '\u0001'.repeat(MAX_ITEM_LENGTH));
    assert.ok(JSON.stringify({ v: 1, items: controlItems }).length <= MAX_DECODED_STATE_LENGTH, 'escaped control chars fit');
  });
});

import { buildActiveItems, nextExcluded } from '../src/utils/winner-exclusion.ts';

describe('winner exclusion', () => {
  it('excludes by position so duplicate names are handled separately', () => {
    const { active, originalIndices } = buildActiveItems(['A', 'B', 'A', 'C'], [0]);
    assert.deepEqual(active, ['B', 'A', 'C']);
    assert.deepEqual(originalIndices, [1, 2, 3]);
  });

  it('adds the previous winner only when the option is on', () => {
    assert.deepEqual(nextExcluded([1], [2], true), [1, 2]);
    assert.deepEqual(nextExcluded([1], [2], false), [1]);
    assert.deepEqual(nextExcluded([1], [], true), [1]);
    assert.deepEqual(nextExcluded([1, 2], [2, 3], true), [1, 2, 3]);
  });

  it('returns no candidates when everything is excluded', () => {
    assert.equal(buildActiveItems(['A', 'B'], [0, 1]).active.length, 0);
  });
});

import { addSavedList, parseSavedLists, removeSavedList, MAX_SAVED_LISTS } from '../src/utils/saved-lists.ts';

describe('saved lists', () => {
  const now = new Date('2026-10-23T00:00:00Z');
  let counter = 0;
  const makeId = () => `id${++counter}`;

  it('saves, replaces by name and removes', () => {
    const first = addSavedList([], '  3반  ', ['가', '나'], now, makeId);
    assert.equal(first.ok, true);
    assert.equal(first.lists[0].name, '3반');
    const again = addSavedList(first.lists, '3반', ['다'], now, makeId);
    assert.equal(again.replaced, true);
    assert.equal(again.lists.length, 1);
    assert.equal(again.lists[0].id, first.lists[0].id);
    assert.deepEqual(removeSavedList(again.lists, again.lists[0].id), []);
  });

  it('rejects invalid names, items and a full store', () => {
    assert.equal(addSavedList([], ' ', ['가'], now, makeId).reason, 'invalid-name');
    assert.equal(addSavedList([], 'x', [], now, makeId).reason, 'invalid-items');
    assert.equal(addSavedList([], 'x', [' 공백 '], now, makeId).reason, 'invalid-items');
    let lists = [];
    for (let i = 0; i < MAX_SAVED_LISTS; i++) lists = addSavedList(lists, `n${i}`, ['가'], now, makeId).lists;
    assert.equal(addSavedList(lists, 'extra', ['가'], now, makeId).reason, 'limit');
    assert.equal(addSavedList(lists, 'n0', ['나'], now, makeId).ok, true);
  });

  it('keeps only valid entries from corrupted storage', () => {
    const good = { id: 'a', name: '좋음', items: ['가'], savedAt: now.toISOString() };
    assert.deepEqual(parseSavedLists([good, { id: 1 }, null, 'x', { ...good, items: [] }]), [good]);
    assert.deepEqual(parseSavedLists('broken'), []);
    assert.deepEqual(parseSavedLists(null), []);
  });
});

import { pickDistinctIndices, validateDrawCount } from '../src/utils/multi-draw.ts';

describe('multi draw', () => {
  it('never repeats a candidate and never returns the excluded index', () => {
    for (let trial = 0; trial < 200; trial++) {
      const picked = pickDistinctIndices(6, 4, (length) => Math.floor(Math.random() * length), 2);
      assert.equal(new Set(picked).size, 4);
      assert.ok(!picked.includes(2));
      assert.ok(picked.every((index) => index >= 0 && index < 6));
    }
  });

  it('can pick every remaining candidate and refuses more than exist', () => {
    assert.deepEqual([...pickDistinctIndices(3, 3, () => 0)].sort(), [0, 1, 2]);
    assert.throws(() => pickDistinctIndices(3, 3, () => 0, 1), RangeError);
    assert.deepEqual(pickDistinctIndices(3, 0, () => 0), []);
  });

  it('is uniform over ordered picks', () => {
    const counts = new Map();
    const trials = 30000;
    for (let trial = 0; trial < trials; trial++) {
      const key = pickDistinctIndices(3, 2, (length) => Math.floor(Math.random() * length)).join('-');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    assert.equal(counts.size, 6);
    for (const count of counts.values()) assert.ok(Math.abs(count / trials - 1 / 6) < 0.02);
  });

  it('validates the requested count without silently clamping', () => {
    assert.equal(validateDrawCount('3', 5).count, 3);
    assert.equal(validateDrawCount('5', 5).count, 5);
    for (const text of ['', ' ', '0', '-1', '1.5', 'abc', '6']) {
      const check = validateDrawCount(text, 5);
      assert.equal(check.count, null, text);
      assert.ok(check.error.length > 0, text);
    }
  });
});
