/**
 * 국민연금 기준소득월액 상·하한과 요율(적용기간별).
 * 순수 함수만 두어 node:test에서 직접 import합니다.
 * 상·하한은 매년 7월 1일 ~ 다음 해 6월 30일 적용, 요율은 1월 1일 기준으로 바뀝니다.
 */

export interface PensionLimitPeriod {
  /** 적용 시작 월(포함) `YYYY-MM` */
  from: string;
  /** 적용 종료 월(포함) `YYYY-MM` */
  to: string;
  upper: number;
  lower: number;
}

export interface PensionRatePeriod {
  from: string;
  to: string;
  /** 근로자 부담률(보험료율의 절반) */
  employeeRate: number;
}

export const PENSION_SOURCE_URL = "https://www.nps.or.kr";

export const PENSION_LIMIT_PERIODS: PensionLimitPeriod[] = [
  { from: "2025-07", to: "2026-06", upper: 6_370_000, lower: 400_000 },
  { from: "2026-07", to: "2027-06", upper: 6_590_000, lower: 410_000 },
];

export const PENSION_RATE_PERIODS: PensionRatePeriod[] = [
  { from: "2025-01", to: "2025-12", employeeRate: 0.045 },
  { from: "2026-01", to: "2026-12", employeeRate: 0.0475 },
  { from: "2027-01", to: "2027-12", employeeRate: 0.05 },
];

/** 기준소득월액은 천원 미만을 버립니다. */
const INCOME_UNIT = 1000;

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface PensionResult {
  /** 실제 월 급여 */
  monthlyWage: number;
  /** 상·하한을 적용한 기준소득월액 */
  standardIncome: number;
  upper: number;
  lower: number;
  employeeRate: number;
  /** 근로자 부담 보험료(원 미만 버리지 않은 값) */
  premium: number;
}

function findByMonth<T extends { from: string; to: string }>(periods: T[], month: string): T | null {
  return periods.find((p) => month >= p.from && month <= p.to) ?? null;
}

/** 지원하지 않는 기준월(데이터 없음)이면 null — 마지막 값을 대신 쓰지 않습니다. */
export function calculatePension(monthlyWage: number, month: string): PensionResult | null {
  if (!MONTH_PATTERN.test(month) || !Number.isFinite(monthlyWage) || monthlyWage < 0) return null;
  const limit = findByMonth(PENSION_LIMIT_PERIODS, month);
  const rate = findByMonth(PENSION_RATE_PERIODS, month);
  if (!limit || !rate) return null;
  const truncated = Math.floor(monthlyWage / INCOME_UNIT) * INCOME_UNIT;
  const standardIncome = monthlyWage <= 0 ? 0 : Math.min(Math.max(truncated, limit.lower), limit.upper);
  return {
    monthlyWage,
    standardIncome,
    upper: limit.upper,
    lower: limit.lower,
    employeeRate: rate.employeeRate,
    premium: standardIncome * rate.employeeRate,
  };
}

export function supportedPensionMonthRange(): { min: string; max: string } {
  const min = PENSION_LIMIT_PERIODS[0].from > PENSION_RATE_PERIODS[0].from ? PENSION_LIMIT_PERIODS[0].from : PENSION_RATE_PERIODS[0].from;
  const lastLimit = PENSION_LIMIT_PERIODS[PENSION_LIMIT_PERIODS.length - 1].to;
  const lastRate = PENSION_RATE_PERIODS[PENSION_RATE_PERIODS.length - 1].to;
  return { min, max: lastLimit < lastRate ? lastLimit : lastRate };
}
