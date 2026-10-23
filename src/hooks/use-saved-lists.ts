import { useCallback, useEffect, useState } from "react";
import { readStoredJson } from "@/utils/roulette-storage";
import {
  SAVED_LISTS_KEY,
  addSavedList,
  parseSavedLists,
  removeSavedList,
  type SaveListResult,
  type SavedList,
} from "@/utils/saved-lists";

/** 저장이 막혀도(차단·용량 초과) 현재 세션의 목록은 계속 쓸 수 있다. */
export function useSavedLists() {
  const [lists, setLists] = useState<SavedList[]>([]);
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => {
    setLists(
      parseSavedLists(
        readStoredJson(() => localStorage.getItem(SAVED_LISTS_KEY)),
      ),
    );
  }, []);

  const persist = useCallback((next: SavedList[]) => {
    setLists(next);
    try {
      localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(next));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
  }, []);

  const save = useCallback(
    (name: string, items: readonly string[]): SaveListResult => {
      const result = addSavedList(lists, name, items, new Date(), () =>
        crypto.randomUUID(),
      );
      if (result.ok) persist(result.lists);
      return result;
    },
    [lists, persist],
  );

  const remove = useCallback(
    (id: string) => persist(removeSavedList(lists, id)),
    [lists, persist],
  );

  return { lists, save, remove, storageFailed };
}
