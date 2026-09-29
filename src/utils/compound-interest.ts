/**
 * Compound interest with optional end-of-month contributions.
 * Contributions are always monthly regardless of the compounding frequency; they grow at the
 * monthly rate equivalent to the chosen compounding, so principal-only results equal
 * P(1 + r/n)^(nt) exactly for whole months.
 */

export const MAX_COMPOUND_YEARS = 100;
export const MAX_ANNUAL_RATE_PERCENT = 100;
export const MAX_YEARLY_ROWS = 30;
const MONTHS_PER_YEAR = 12;
const ALLOWED_PERIODS_PER_YEAR = new Set([1, 2, 4, 12]);

export interface CompoundInput {
  principal: number;
  annualRatePercent: number;
  years: number;
  periodsPerYear: number;
  monthlyContribution: number;
}

export interface YearlyBalance {
  year: number;
  amount: number;
  interest: number;
}

export interface CompoundResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  /** Effective annual yield of the chosen compounding, e.g. 4% monthly → 4.07%. */
  effectiveAnnualRatePercent: number;
  months: number;
  yearly: YearlyBalance[];
}

export type CompoundError = "invalid-number" | "negative" | "rate-range" | "years-range" | "frequency";

function validate(input: CompoundInput): CompoundError | null {
  const values = [input.principal, input.annualRatePercent, input.years, input.monthlyContribution];
  if (!values.every(Number.isFinite)) return "invalid-number";
  if (input.principal < 0 || input.monthlyContribution < 0) return "negative";
  if (input.annualRatePercent < 0 || input.annualRatePercent > MAX_ANNUAL_RATE_PERCENT) return "rate-range";
  if (input.years <= 0 || input.years > MAX_COMPOUND_YEARS) return "years-range";
  if (!ALLOWED_PERIODS_PER_YEAR.has(input.periodsPerYear)) return "frequency";
  return null;
}

export function calculateCompound(input: CompoundInput): CompoundResult | CompoundError {
  const error = validate(input);
  if (error) return error;

  const periodicRate = input.annualRatePercent / 100 / input.periodsPerYear;
  const monthlyGrowth = Math.pow(1 + periodicRate, input.periodsPerYear / MONTHS_PER_YEAR);
  const months = Math.max(1, Math.round(input.years * MONTHS_PER_YEAR));
  const yearly: YearlyBalance[] = [];

  let balance = input.principal;
  for (let month = 1; month <= months; month++) {
    balance = balance * monthlyGrowth + input.monthlyContribution;
    const isYearEnd = month % MONTHS_PER_YEAR === 0;
    if (isYearEnd && yearly.length < MAX_YEARLY_ROWS) {
      const contributed = input.principal + input.monthlyContribution * month;
      yearly.push({ year: month / MONTHS_PER_YEAR, amount: balance, interest: balance - contributed });
    }
  }

  const totalContributions = input.principal + input.monthlyContribution * months;
  return {
    finalAmount: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    effectiveAnnualRatePercent: (Math.pow(1 + periodicRate, input.periodsPerYear) - 1) * 100,
    months,
    yearly,
  };
}

export const COMPOUND_ERROR_MESSAGES: Record<CompoundError, string> = {
  "invalid-number": "숫자를 입력해 주세요.",
  negative: "원금과 추가 납입액은 0 이상이어야 합니다.",
  "rate-range": `연 이자율은 0~${MAX_ANNUAL_RATE_PERCENT}% 사이로 입력해 주세요.`,
  "years-range": `투자 기간은 0년 초과 ${MAX_COMPOUND_YEARS}년 이하로 입력해 주세요.`,
  frequency: "복리 주기를 다시 선택해 주세요.",
};
