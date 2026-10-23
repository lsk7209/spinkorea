import table from '../data/withholding-tax-2026.json' with { type: 'json' };

/**
 * 2026-02-27 amended simplified withholding table (소득세법 시행령 별표 2).
 * `familyCount` includes the employee. The children's deduction is for
 * dependent children aged 8 through 20, already included in familyCount.
 * Returns null for invalid inputs or the >=10m monthly formula not in this
 * tabulated implementation; callers must show that limit rather than guess.
 */
export function calculateWithholdingTax(
  monthlyTaxableWon: number,
  familyCount: number,
  children8to20 = 0,
): number | null {
  if (!Number.isFinite(monthlyTaxableWon) || monthlyTaxableWon < 0 || monthlyTaxableWon >= 10_000_000
    || !Number.isSafeInteger(familyCount) || familyCount < 1 || familyCount > 11
    || !Number.isSafeInteger(children8to20) || children8to20 < 0 || children8to20 >= familyCount) {
    return null;
  }

  const monthlyThousand = Math.floor(monthlyTaxableWon / 1000);
  let baseTax = 0;
  if (monthlyThousand >= 770) {
    let low = 0;
    let high = table.rows.length - 1;
    let found = false;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const row = table.rows[middle];
      if (monthlyThousand < row[0]) high = middle - 1;
      else if (monthlyThousand >= row[1]) low = middle + 1;
      else {
        baseTax = row[familyCount + 1];
        found = true;
        break;
      }
    }
    if (!found) return null;
  }

  const childReduction = children8to20 === 0 ? 0
    : children8to20 === 1 ? 20_830
      : 45_830 + Math.max(0, children8to20 - 2) * 33_330;
  return Math.max(0, baseTax - childReduction);
}

export const WITHHOLDING_TAX_SOURCE = table.source;
export const WITHHOLDING_TAX_AMENDED = table.amended;
