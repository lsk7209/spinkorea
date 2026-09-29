// SPK2-08 blog CTA picks the most specific tool, not the first array match (T23).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectPostToolLinks, TOOL_LINKS } from '../src/utils/post-cta.ts';

const app = fs.readFileSync('src/App.tsx', 'utf8');

describe('selectPostToolLinks', () => {
  const cases = [
    [['실수령액', '연봉'], '/tools/net-salary'],
    [['할인율'], '/tools/discount-calculator'],
    [['칼로리 소모', '운동'], '/tools/calorie-burn'],
    [['퇴직금'], '/tools/severance-pay'],
  ];
  for (const [tags, expected] of cases) {
    it(`${tags.join('+')} -> ${expected}`, () => {
      assert.equal(selectPostToolLinks(tags)[0].path, expected);
    });
  }

  it('falls back to roulette and tools hub without matches', () => {
    const [primary, secondary] = selectPostToolLinks(['무관한 태그']);
    assert.deepEqual([primary.path, secondary.path], ['/', '/tools']);
  });

  it('primary and secondary are different', () => {
    const [primary, secondary] = selectPostToolLinks(['실수령액', '연봉']);
    assert.notEqual(primary.path, secondary.path);
  });

  it('every CTA destination is a real route', () => {
    for (const tool of TOOL_LINKS) {
      assert.ok(app.includes(`path="${tool.path}"`), tool.path);
    }
    assert.equal(new Set(TOOL_LINKS.map((t) => t.path)).size, TOOL_LINKS.length, 'no duplicate destinations');
  });
});
