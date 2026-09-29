// SPK2-11 event envelope, route normalisation and input-free params (T24–T25).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  buildToolEnvelope,
  normalizeRoutePath,
  sanitizeEventParams,
  toolIdFromPath,
  trackEvent,
} from '../src/utils/analytics.ts';

describe('analytics helpers', () => {
  it('normalises routes without query or hash (no ?s= leak)', () => {
    assert.equal(normalizeRoutePath('/random-number?s=abc#x'), '/random-number');
    assert.equal(normalizeRoutePath('?s=abc'), '/');
  });

  it('derives stable tool ids', () => {
    assert.equal(toolIdFromPath('/'), 'roulette');
    assert.equal(toolIdFromPath('/spinflow'), 'roulette');
    assert.equal(toolIdFromPath('/tools/coin-flip'), 'coin-flip');
    assert.equal(toolIdFromPath('/lunch-menu'), 'lunch-menu');
  });

  it('builds a common envelope', () => {
    assert.deepEqual(buildToolEnvelope('/lunch-menu?s=zzz', 'roulette'), { tool_id: 'roulette', tool_path: '/lunch-menu' });
    assert.deepEqual(buildToolEnvelope('/tools/dice-roller'), { tool_id: 'dice-roller', tool_path: '/tools/dice-roller' });
  });

  it('drops parameters that could carry user input or share state', () => {
    const safe = sanitizeEventParams({
      tool_id: 'roulette', item_count: 3, items: 'A,B', result: 'A', password: 'x', s: 'lz', text: 't', undefinedValue: undefined,
    });
    assert.deepEqual(safe, { tool_id: 'roulette', item_count: 3 });
  });

  it('trackEvent is a safe no-op before analytics is initialised', () => {
    assert.doesNotThrow(() => trackEvent('tool_used', { tool_id: 'roulette' }));
  });

  it('no call site sends raw items/result/state (source scan)', () => {
    const files = [
      'src/pages/Home.tsx', 'src/components/ShareButtons.tsx', 'src/components/ToolLayout.tsx', 'src/pages/BlogPost.tsx',
    ];
    for (const file of files) {
      const source = fs.readFileSync(file, 'utf8');
      const calls = source.match(/trackEvent\([^)]*\{[\s\S]*?\}\)/g) ?? [];
      for (const call of calls) {
        assert.doesNotMatch(call, /\b(items|result|password|s)\s*[:,}]/, `${file}: ${call}`);
      }
    }
  });
});
