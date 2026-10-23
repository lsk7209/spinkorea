/**
 * 저장한 명단(이 브라우저의 localStorage 전용). 서버·계정 없음.
 * 후보 검증은 룰렛 복원과 같은 규칙(isRouletteState)을 재사용해 편집기가 거부할 값이 저장되지 않게 한다.
 */

import {
  isRouletteState,
  SUPPORTED_STATE_VERSION,
} from "./roulette-storage.ts";

export const SAVED_LISTS_KEY = "spinflow:savedLists";
export const MAX_SAVED_LISTS = 10;
export const MAX_LIST_NAME_LENGTH = 30;

export interface SavedList {
  id: string;
  name: string;
  items: string[];
  savedAt: string;
}

export type SaveListResult =
  | { ok: true; lists: SavedList[]; replaced: boolean }
  | { ok: false; reason: "invalid-name" | "invalid-items" | "limit" };

function isSavedList(value: unknown): value is SavedList {
  if (!value || typeof value !== "object") return false;
  const list = value as Partial<SavedList>;
  return (
    typeof list.id === "string" &&
    typeof list.name === "string" &&
    list.name.trim().length > 0 &&
    list.name.length <= MAX_LIST_NAME_LENGTH &&
    typeof list.savedAt === "string" &&
    isRouletteState({ v: SUPPORTED_STATE_VERSION, items: list.items })
  );
}

/** 손상된 저장값은 통째로 버리지 않고 유효한 항목만 남긴다(최대 개수 초과분 제외). */
export function parseSavedLists(value: unknown): SavedList[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isSavedList).slice(0, MAX_SAVED_LISTS);
}

/** 같은 이름이 있으면 그 명단을 덮어쓴다(replaced=true). */
export function addSavedList(
  lists: readonly SavedList[],
  name: string,
  items: readonly string[],
  now: Date,
  makeId: () => string,
): SaveListResult {
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_LIST_NAME_LENGTH)
    return { ok: false, reason: "invalid-name" };
  if (!isRouletteState({ v: SUPPORTED_STATE_VERSION, items }))
    return { ok: false, reason: "invalid-items" };
  const entry: SavedList = {
    id: makeId(),
    name: trimmed,
    items: [...items],
    savedAt: now.toISOString(),
  };
  const existing = lists.findIndex((list) => list.name === trimmed);
  if (existing >= 0) {
    const next = [...lists];
    next[existing] = { ...entry, id: lists[existing].id };
    return { ok: true, lists: next, replaced: true };
  }
  if (lists.length >= MAX_SAVED_LISTS) return { ok: false, reason: "limit" };
  return { ok: true, lists: [entry, ...lists], replaced: false };
}

export function removeSavedList(
  lists: readonly SavedList[],
  id: string,
): SavedList[] {
  return lists.filter((list) => list.id !== id);
}
