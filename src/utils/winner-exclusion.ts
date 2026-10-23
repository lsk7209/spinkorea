/**
 * 당첨자 제외 규칙. 후보는 문자열 배열이라 이름이 같을 수 있으므로
 * 제외 대상은 이름이 아니라 원본 배열의 위치(인덱스)로 관리한다.
 */

export interface ActiveItems {
  /** 제외분을 뺀 추첨 대상 */
  active: string[];
  /** active[i]가 원본 items의 몇 번째인지 */
  originalIndices: number[];
}

export function buildActiveItems(items: readonly string[], excluded: readonly number[]): ActiveItems {
  const excludedSet = new Set(excluded);
  const originalIndices: number[] = [];
  items.forEach((_, index) => {
    if (!excludedSet.has(index)) originalIndices.push(index);
  });
  return { active: originalIndices.map((index) => items[index]), originalIndices };
}

/** 다음 추첨에 적용할 제외 목록: 켜져 있고 직전 당첨자가 있을 때만 그 위치를 더한다. */
export function nextExcluded(
  excluded: readonly number[],
  pendingWinner: number | null,
  excludeWinners: boolean,
): number[] {
  if (!excludeWinners || pendingWinner === null || excluded.includes(pendingWinner)) return [...excluded];
  return [...excluded, pendingWinner];
}
