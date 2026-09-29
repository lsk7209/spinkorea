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
