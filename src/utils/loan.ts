export type RepaymentMethod = 'equal-payment' | 'equal-principal';

export function calculateLoan(principal: string, annualRate: string, months: string, method: RepaymentMethod) {
  if ([principal, annualRate, months].some(value => !value.trim())) return null;
  const P = Number(principal);
  const rate = Number(annualRate);
  const n = Number(months);
  if (!Number.isFinite(P) || P <= 0 || !Number.isFinite(rate) || rate < 0 || !Number.isSafeInteger(n) || n <= 0) return null;

  const r = rate / 100 / 12;
  const firstMonthInterest = P * r;
  let monthly: number;
  let totalInterest: number;
  if (r === 0) {
    monthly = P / n;
    totalInterest = 0;
  } else if (method === 'equal-payment') {
    // Equivalent amortization formula, stable near zero and for long terms.
    monthly = P * (r / -Math.expm1(-n * Math.log1p(r)));
    totalInterest = Math.max(0, monthly * n - P);
  } else {
    monthly = P / n + firstMonthInterest;
    // Sum of the n opening balances: P * (n + 1) / 2. No term-sized loop.
    totalInterest = firstMonthInterest * ((n + 1) / 2);
  }
  const totalPayment = P + totalInterest;
  if (![monthly, totalInterest, totalPayment, firstMonthInterest, (totalInterest / P) * 100].every(Number.isFinite)) return null;
  return {
    monthly, totalInterest, totalPayment, firstMonthInterest,
    monthlyNote: method === 'equal-principal' && r > 0 ? '첫 달 납부액 (이후 점차 감소)' : undefined,
  };
}
