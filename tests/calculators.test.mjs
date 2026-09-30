import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calendarDaysBetween,
  formatDayOffset,
  isValidBirthDate,
  parseLocalDate,
  parseUnixTimestamp,
  serviceDaysBetween,
  shiftClockTime,
} from '../src/utils/date-calc.ts';
import { calculateCompound } from '../src/utils/compound-interest.ts';

describe('parseLocalDate', () => {
  it('parses YYYY-MM-DD as local midnight (no UTC day shift)', () => {
    const date = parseLocalDate('2026-01-01');
    assert.equal(date.getFullYear(), 2026);
    assert.equal(date.getMonth(), 0);
    assert.equal(date.getDate(), 1);
    assert.equal(date.getHours(), 0);
  });

  it('rejects malformed and impossible dates', () => {
    for (const value of ['', '2026-1-1', '2026-02-30', '2026-13-01', 'abc']) {
      assert.equal(parseLocalDate(value), null, value);
    }
  });
});

describe('calendar day helpers', () => {
  it('counts calendar days regardless of time of day', () => {
    assert.equal(calendarDaysBetween(new Date(2026, 0, 1, 23, 59), new Date(2026, 0, 2, 0, 1)), 1);
    assert.equal(calendarDaysBetween(new Date(2026, 0, 10), new Date(2026, 0, 1)), -9);
  });

  it('returns service days only when end is after start', () => {
    assert.equal(serviceDaysBetween('2025-01-01', '2026-01-01'), 365);
    assert.equal(serviceDaysBetween('2026-06-09', '2022-01-01'), null);
    assert.equal(serviceDaysBetween('2026-01-01', '2026-01-01'), null);
    assert.equal(serviceDaysBetween('', '2026-01-01'), null);
  });

  it('rejects future birth dates', () => {
    const today = new Date(2026, 8, 30);
    assert.equal(isValidBirthDate(new Date(2026, 8, 30), today), true);
    assert.equal(isValidBirthDate(new Date(2026, 9, 1), today), false);
    assert.equal(isValidBirthDate(new Date(Number.NaN), today), false);
  });
});

describe('shiftClockTime', () => {
  it('reports previous/next day crossings', () => {
    assert.deepEqual(shiftClockTime('01:00', -120), { time: '23:00', dayOffset: -1 });
    assert.deepEqual(shiftClockTime('12:00', 25 * 60), { time: '13:00', dayOffset: 1 });
    assert.deepEqual(shiftClockTime('23:30', 60 * 49), { time: '00:30', dayOffset: 3 });
    assert.deepEqual(shiftClockTime('09:15', 0), { time: '09:15', dayOffset: 0 });
  });

  it('rejects malformed input', () => {
    assert.equal(shiftClockTime('9:00', 10), null);
    assert.equal(shiftClockTime('09:00', Number.NaN), null);
  });

  it('formats day offsets in Korean', () => {
    assert.equal(formatDayOffset(0), '');
    assert.equal(formatDayOffset(1), '(다음날)');
    assert.equal(formatDayOffset(-1), '(전날)');
    assert.equal(formatDayOffset(3), '(3일 후)');
    assert.equal(formatDayOffset(-2), '(2일 전)');
  });
});

describe('parseUnixTimestamp', () => {
  it('infers seconds vs milliseconds by magnitude, including negatives', () => {
    assert.deepEqual(parseUnixTimestamp('1700000000'), { date: new Date(1_700_000_000_000), unit: 'seconds' });
    assert.deepEqual(parseUnixTimestamp('1700000000000'), { date: new Date(1_700_000_000_000), unit: 'milliseconds' });
    assert.deepEqual(parseUnixTimestamp('-1000000000'), { date: new Date(-1_000_000_000_000), unit: 'seconds' });
    assert.equal(parseUnixTimestamp('-1500000000000').unit, 'milliseconds');
    // Leading zeros used to flip the digit-count heuristic.
    assert.equal(parseUnixTimestamp('000001700000000').unit, 'seconds');
  });

  it('rejects non-integers and out-of-range values', () => {
    for (const value of ['', '1.5', '1e9', 'abc', '99999999999999999999', '9000000000000000']) {
      assert.equal(parseUnixTimestamp(value), null, value);
    }
  });
});

describe('calculateCompound', () => {
  const base = { principal: 10_000_000, annualRatePercent: 4, years: 10, periodsPerYear: 12, monthlyContribution: 0 };

  it('matches P(1 + r/n)^(nt) for principal only', () => {
    const result = calculateCompound(base);
    const expected = 10_000_000 * Math.pow(1 + 0.04 / 12, 120);
    assert.ok(Math.abs(result.finalAmount - expected) < 1e-6);
    assert.equal(result.totalContributions, 10_000_000);
    assert.equal(result.yearly.length, 10);
    assert.ok(Math.abs(result.effectiveAnnualRatePercent - 4.074) < 0.001);
  });

  it('matches the ordinary annuity formula for monthly contributions', () => {
    const result = calculateCompound({ ...base, principal: 0, monthlyContribution: 100_000 });
    const rate = 0.04 / 12;
    const expected = 100_000 * ((Math.pow(1 + rate, 120) - 1) / rate);
    assert.ok(Math.abs(result.finalAmount - expected) < 1e-6);
    assert.equal(result.totalContributions, 12_000_000);
  });

  it('applies monthly contributions consistently for non-monthly compounding', () => {
    const result = calculateCompound({ ...base, periodsPerYear: 1, monthlyContribution: 100_000 });
    assert.ok(result.totalInterest > 0);
    assert.ok(Math.abs(result.yearly.at(-1).amount - result.finalAmount) < 1e-6);
  });

  it('handles zero rate without dividing by zero', () => {
    const result = calculateCompound({ ...base, annualRatePercent: 0, monthlyContribution: 50_000 });
    assert.equal(result.finalAmount, 10_000_000 + 50_000 * 120);
    assert.equal(result.totalInterest, 0);
  });

  it('rejects negative, non-finite and out-of-range inputs', () => {
    assert.equal(calculateCompound({ ...base, monthlyContribution: -100_000 }), 'negative');
    assert.equal(calculateCompound({ ...base, principal: Number.NaN }), 'invalid-number');
    assert.equal(calculateCompound({ ...base, annualRatePercent: 150 }), 'rate-range');
    assert.equal(calculateCompound({ ...base, years: 0 }), 'years-range');
    assert.equal(calculateCompound({ ...base, years: 1000 }), 'years-range');
    assert.equal(calculateCompound({ ...base, periodsPerYear: 3 }), 'frequency');
  });

  it('caps the yearly table at 30 rows', () => {
    assert.equal(calculateCompound({ ...base, years: 50 }).yearly.length, 30);
  });
});
