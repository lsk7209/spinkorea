import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import table from '../src/data/withholding-tax-2026.json' with { type: 'json' };
import { calculateWithholdingTax, WITHHOLDING_TAX_AMENDED, WITHHOLDING_TAX_SOURCE } from '../src/utils/withholding-tax.ts';

describe('2026 simplified withholding table', () => {
  it('covers every bracket continuously with eleven complete family columns', () => {
    assert.equal(WITHHOLDING_TAX_AMENDED, '2026-02-27');
    assert.match(WITHHOLDING_TAX_SOURCE, /law\.go\.kr/);
    assert.equal(table.rows.length, 646);
    assert.equal(table.rows[0][0], 770);
    assert.equal(table.rows.at(-1)[1], 10000);
    for (const [index, row] of table.rows.entries()) {
      assert.equal(row.length, 13, `row ${index}`);
      assert.ok(row.every((cell) => Number.isSafeInteger(cell) && cell >= 0), `row ${index}`);
      assert.ok(row[0] < row[1], `row ${index}`);
      if (index) assert.equal(table.rows[index - 1][1], row[0], `continuity at row ${index}`);
    }
  });

  it('matches the official 3,500–3,520 thousand won row and inclusive/exclusive boundaries', () => {
    const official = [127220, 102220, 62460, 49340, 37630, 32380, 27130, 21880, 17390, 14010, 10640];
    for (let family = 1; family <= 11; family++) {
      assert.equal(calculateWithholdingTax(3_500_000, family), official[family - 1]);
      assert.equal(calculateWithholdingTax(3_519_999, family), official[family - 1]);
    }
    assert.equal(calculateWithholdingTax(3_520_000, 1), 129660);
    assert.equal(calculateWithholdingTax(3_500_000.5, 1), 127220);
    assert.equal(calculateWithholdingTax(9_999_999, 1), 1503990);
    assert.equal(calculateWithholdingTax(9_999_999, 11), 958650);
  });

  it('applies the 2026 child reductions and floors at zero', () => {
    assert.equal(calculateWithholdingTax(3_500_000, 3, 1), 41630);
    assert.equal(calculateWithholdingTax(3_500_000, 3, 2), 16630);
    assert.equal(calculateWithholdingTax(3_500_000, 4, 3), 0);
    assert.equal(calculateWithholdingTax(769_999, 1), 0);
    assert.equal(calculateWithholdingTax(770_000, 1), 0);
  });

  it('returns null outside supported monthly salary and family inputs', () => {
    for (const [income, family, children] of [
      [-1, 1, 0], [10_000_000, 1, 0], [NaN, 1, 0],
      [3_500_000, 0, 0], [3_500_000, 12, 0], [3_500_000, 1, 1],
      [3_500_000, 3, 3], [3_500_000, 3, -1], [3_500_000, 3, 1.5],
    ]) assert.equal(calculateWithholdingTax(income, family, children), null);
  });
});
