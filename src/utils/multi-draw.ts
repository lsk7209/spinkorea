/**
 * N명 추첨: 한 묶음 안에서 같은 후보가 두 번 뽑히지 않는다.
 * 난수는 호출자가 주입(기본은 안전한 난수)하고, 부분 Fisher–Yates로 편향 없이 고른다.
 */

export type PickIndex = (length: number) => number;

export type DrawCountCheck =
  { count: number; error: null } | { count: null; error: string };

export function validateDrawCount(
  text: string,
  available: number,
): DrawCountCheck {
  if (!/^\d+$/.test(text.trim()))
    return { count: null, error: "추첨 인원은 1 이상의 정수로 입력해 주세요." };
  const count = Number(text);
  if (count < 1)
    return { count: null, error: "추첨 인원은 1명 이상이어야 합니다." };
  if (count > available)
    return {
      count: null,
      error: `뽑을 수 있는 후보가 ${available}개뿐이라 ${count}명을 뽑을 수 없습니다.`,
    };
  return { count, error: null };
}

/** 0..length-1 중 excludeIndex(선택)를 뺀 후보에서 count개를 중복 없이 뽑는다. */
export function pickDistinctIndices(
  length: number,
  count: number,
  pickIndex: PickIndex,
  excludeIndex?: number,
): number[] {
  const pool: number[] = [];
  for (let index = 0; index < length; index++) {
    if (index !== excludeIndex) pool.push(index);
  }
  if (!Number.isInteger(count) || count < 0 || count > pool.length) {
    throw new RangeError(
      "count must be between 0 and the number of candidates",
    );
  }
  const picked: number[] = [];
  for (let step = 0; step < count; step++) {
    const choice = pickIndex(pool.length);
    picked.push(pool[choice]);
    pool[choice] = pool[pool.length - 1];
    pool.pop();
  }
  return picked;
}
