import assert from 'node:assert/strict';
import { calculateLoan } from '../src/utils/loan.ts';
const near = (a, b) => assert.ok(Math.abs(a - b) <= Math.max(1e-7, Math.abs(b) * 1e-10), `${a} != ${b}`);
for (const method of ['equal-payment', 'equal-principal']) {
  const zero = calculateLoan('1200000', '0', '12', method);
  near(zero.monthly, 100000); near(zero.totalInterest, 0); near(zero.totalPayment, 1200000);
  const one = calculateLoan('1000000', '12', '1', method);
  near(one.monthly, 1010000); near(one.totalInterest, 10000);
  for (const invalid of [['', '0', '12'], ['0', '0', '12'], ['-1', '0', '12'], ['100', '', '12'], ['100', '-1', '12'], ['100', '0', ''], ['100', '0', '0'], ['100', '0', '-1'], ['100', '0', '12.5'], ['100', 'Infinity', '12'], ['Infinity', '12', '12'], ['100', '0', '9007199254740992'], ['1e308', '1e308', '12']]) assert.equal(calculateLoan(...invalid, method), null);
  assert.ok(calculateLoan('1000000', '0.000000001', '12', method));
  assert.ok(calculateLoan('1000000', '4.5', '9000000', method));
}
// Independently reconcile the monthly payment with a declining balance schedule.
for (const [principal, rate, months] of [[30000000, 4.5, 36], [1200000, 12, 12], [1000000, 0.1, 360]]) {
  const result = calculateLoan(String(principal), String(rate), String(months), 'equal-payment');
  let balance = principal;
  for (let i = 0; i < months; i++) balance = balance * (1 + rate / 1200) - result.monthly;
  near(balance, 0);
  const equalPrincipal = calculateLoan(String(principal), String(rate), String(months), 'equal-principal');
  let interest = 0;
  for (let i = 0; i < months; i++) interest += (principal - principal * i / months) * rate / 1200;
  near(equalPrincipal.totalInterest, interest);
}
console.log('Loan zero-rate, validation, overflow, long/tiny-rate terms and amortization reconciliation PASS');
