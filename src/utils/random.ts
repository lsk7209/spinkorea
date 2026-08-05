/**
 * 암호학적으로 안전한 난수 생성 유틸리티
 * crypto.getRandomValues() 사용, Math.random() 미사용
 */

/**
 * 0 이상 max 미만의 난수 생성 (Uint32 rejection sampling으로 모듈로 편향 제거)
 * @param max - 최대값 (제외)
 * @returns 0 이상 max 미만의 정수
 */
export function getSecureRandomInt(max: number): number {
  if (!Number.isSafeInteger(max) || max <= 0 || max > 0x1_0000_0000) {
    throw new Error('max must be greater than 0');
  }

  // Uint32 범위에서 rejection sampling을 사용해 모든 결과의 확률을 같게 만든다.
  const range = 0x1_0000_0000;
  const maxSafe = Math.floor(range / max) * max;
  const randomValues = new Uint32Array(1);
  let randomValue: number;

  do {
    crypto.getRandomValues(randomValues);
    randomValue = randomValues[0];
  } while (randomValue >= maxSafe);

  return randomValue % max;
}

/**
 * 배열에서 랜덤 인덱스 선택
 * @param arrayLength - 배열 길이
 * @returns 랜덤 인덱스
 */
export function getRandomIndex(arrayLength: number): number {
  if (!Number.isSafeInteger(arrayLength) || arrayLength <= 0) {
    throw new Error('Array length must be greater than 0');
  }
  return getSecureRandomInt(arrayLength);
}

