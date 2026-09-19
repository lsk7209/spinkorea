/** Validate syntax and numeric support before returning any transformed output. */
export function formatSupportedJson(input: string, space = 0): string {
  const parsed: unknown = JSON.parse(input);
  // Consume complete strings (including escaped quotes) before matching numbers.
  // Syntax has already been validated, so a number cannot be part of a bare key.
  const tokens = input.matchAll(/"(?:\\[\s\S]|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g);
  for (const [token] of tokens) {
    if (token.startsWith('"')) continue;
    const value = Number(token);
    if (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value))) {
      throw new Error('지원 범위를 벗어난 숫자가 있습니다. 큰 정수는 따옴표로 감싼 문자열로 입력하세요. 원문은 유지됩니다.');
    }
  }
  return JSON.stringify(parsed, null, space);
}
