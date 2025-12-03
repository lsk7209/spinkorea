/**
 * 암호학적으로 안전한 난수 생성 유틸리티
 * crypto.getRandomValues() 사용, Math.random() 미사용
 */

/**
 * 0 이상 max 미만의 난수 생성 (모듈로 편향 제거)
 * @param max - 최대값 (제외)
 * @returns 0 이상 max 미만의 정수
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) {
    throw new Error('max must be greater than 0');
  }

  // rejection sampling으로 모듈로 편향 제거
  const maxSafe = Math.floor(256 / max) * max; // 256의 배수 중 max의 배수인 최대값
  let randomValue: number;

  do {
    const randomBytes = new Uint8Array(1);
    crypto.getRandomValues(randomBytes);
    randomValue = randomBytes[0];
  } while (randomValue >= maxSafe);

  return randomValue % max;
}

/**
 * 배열에서 랜덤 인덱스 선택
 * @param arrayLength - 배열 길이
 * @returns 랜덤 인덱스
 */
export function getRandomIndex(arrayLength: number): number {
  if (arrayLength === 0) {
    throw new Error('Array length must be greater than 0');
  }
  return getSecureRandomInt(arrayLength);
}

