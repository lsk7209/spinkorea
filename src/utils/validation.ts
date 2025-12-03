/**
 * 항목 검증 및 전처리 유틸리티
 */

const MAX_ITEMS = 100;
const MAX_ITEM_LENGTH = 50;

/**
 * 항목 전처리: 공백 제거, 빈 줄 제거
 * @param text - 원본 텍스트
 * @returns 전처리된 항목 배열
 */
export function preprocessItems(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * 항목 검증
 * @param items - 항목 배열
 * @returns 검증 결과
 */
export function validateItems(items: string[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (items.length === 0) {
    errors.push('최소 1개 이상의 항목이 필요합니다.');
  }

  if (items.length > MAX_ITEMS) {
    errors.push(`최대 ${MAX_ITEMS}개까지 입력 가능합니다. (현재: ${items.length}개)`);
  }

  const tooLongItems = items.filter(item => item.length > MAX_ITEM_LENGTH);
  if (tooLongItems.length > 0) {
    errors.push(
      `항목은 최대 ${MAX_ITEM_LENGTH}자까지 입력 가능합니다. (초과 항목: ${tooLongItems.length}개)`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 항목 전처리 및 검증 통합
 * @param text - 원본 텍스트
 * @returns 검증된 항목 배열 또는 null
 */
export function processAndValidateItems(text: string): {
  items: string[];
  errors: string[];
} | null {
  const items = preprocessItems(text);
  const validation = validateItems(items);

  if (!validation.valid) {
    return {
      items: [],
      errors: validation.errors,
    };
  }

  return {
    items,
    errors: [],
  };
}

