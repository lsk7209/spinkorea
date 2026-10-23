import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calendarDaysBetween,
  formatDayOffset,
  isValidBirthDate,
  parseLocalDate,
  parseUnixTimestamp,
  retirementDateFromLastWorkDay,
  severanceWagePeriod,
  formatLocalDate,
  serviceDaysBetween,
  shiftClockTime,
} from '../src/utils/date-calc.ts';
import { calculatePension, supportedPensionMonthRange } from '../src/utils/pension.ts';
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

describe('severanceWagePeriod', () => {
  const daysFor = (retire) => severanceWagePeriod(parseLocalDate(retire)).days;

  it('counts the calendar days of the 3 months before the retirement date', () => {
    assert.equal(daysFor('2026-05-01'), 89);
    assert.equal(daysFor('2026-04-01'), 90);
    assert.equal(daysFor('2026-07-01'), 91);
    assert.equal(daysFor('2026-01-01'), 92);
    assert.equal(daysFor('2024-04-01'), 91);
  });

  it('reports inclusive start and end dates', () => {
    const period = severanceWagePeriod(parseLocalDate('2026-05-01'));
    assert.equal(formatLocalDate(period.start), '2026-02-01');
    assert.equal(formatLocalDate(period.end), '2026-04-30');
  });

  it('clamps to month end instead of overflowing', () => {
    assert.equal(formatLocalDate(severanceWagePeriod(parseLocalDate('2026-05-31')).start), '2026-02-28');
    assert.equal(formatLocalDate(severanceWagePeriod(parseLocalDate('2024-05-31')).start), '2024-02-29');
  });

  it('defines the retirement date as the day after the last working day', () => {
    const retire = retirementDateFromLastWorkDay(parseLocalDate('2026-04-30'));
    assert.equal(formatLocalDate(retire), '2026-05-01');
    assert.equal(formatLocalDate(retirementDateFromLastWorkDay(parseLocalDate('2024-02-29'))), '2024-03-01');
  });
});

describe('calculatePension', () => {
  it('uses the limits of the period that contains the reference month', () => {
    const june = calculatePension(9_000_000, '2026-06');
    assert.equal(june.upper, 6_370_000);
    assert.equal(june.standardIncome, 6_370_000);
    const july = calculatePension(9_000_000, '2026-07');
    assert.equal(july.upper, 6_590_000);
    assert.equal(july.lower, 410_000);
    assert.equal(july.standardIncome, 6_590_000);
  });

  it('handles values just below, on and above the upper limit', () => {
    assert.equal(calculatePension(6_589_999, '2026-07').standardIncome, 6_589_000);
    assert.equal(calculatePension(6_590_000, '2026-07').standardIncome, 6_590_000);
    assert.equal(calculatePension(6_590_001, '2026-07').standardIncome, 6_590_000);
    assert.equal(calculatePension(6_369_999, '2026-06').standardIncome, 6_369_000);
    assert.equal(calculatePension(6_370_001, '2026-06').standardIncome, 6_370_000);
  });

  it('handles values just below, on and above the lower limit', () => {
    assert.equal(calculatePension(409_999, '2026-07').standardIncome, 410_000);
    assert.equal(calculatePension(410_000, '2026-07').standardIncome, 410_000);
    assert.equal(calculatePension(411_000, '2026-07').standardIncome, 411_000);
    assert.equal(calculatePension(399_999, '2026-06').standardIncome, 400_000);
  });

  it('applies the employee rate of the reference year', () => {
    assert.equal(calculatePension(3_000_000, '2026-10').employeeRate, 0.0475);
    assert.equal(calculatePension(3_000_000, '2026-10').premium, 142_500);
  });

  it('returns null for unsupported months and invalid wages', () => {
    assert.equal(calculatePension(3_000_000, '2025-06'), null);
    assert.equal(calculatePension(3_000_000, '2027-07'), null);
    assert.equal(calculatePension(3_000_000, '2026-13'), null);
    assert.equal(calculatePension(-1, '2026-10'), null);
    assert.equal(calculatePension(Number.NaN, '2026-10'), null);
    assert.deepEqual(supportedPensionMonthRange(), { min: '2025-07', max: '2027-06' });
  });
});


describe('calendar-year retirement eligibility', () => {
 it('does not mistake 365 days across leap day for a completed year', async () => {
  const {hasCompletedServiceYear}=await import('../src/utils/date-calc.ts');
  assert.equal(hasCompletedServiceYear(parseLocalDate('2023-03-01'),parseLocalDate('2024-02-29')),false);
  assert.equal(hasCompletedServiceYear(parseLocalDate('2023-03-01'),parseLocalDate('2024-03-01')),true);
  assert.equal(hasCompletedServiceYear(parseLocalDate('2024-02-29'),parseLocalDate('2025-02-28')),true);
 });
 it('truncates pension contributions below ten won separately from base truncation',()=>{
  assert.equal(calculatePension(6590000,'2026-07').premium,313020);
  assert.equal(calculatePension(6370000,'2026-06').premium,302570);
 });
});
