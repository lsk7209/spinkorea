import { useState } from "react";
import { useSavedLists } from "@/hooks/use-saved-lists";
import {
  MAX_LIST_NAME_LENGTH,
  MAX_SAVED_LISTS,
  type SaveListResult,
} from "@/utils/saved-lists";

interface SavedListsProps {
  items: string[];
  disabled: boolean;
  /** 명단을 불러온다. 현재 명단 교체가 거부되면 false */
  onLoad: (items: string[]) => boolean;
  canUndo: boolean;
  onUndo: () => void;
}

const FAILURE_MESSAGES: Record<
  Extract<SaveListResult, { ok: false }>["reason"],
  string
> = {
  "invalid-name": `명단 이름을 1~${MAX_LIST_NAME_LENGTH}자로 입력해 주세요.`,
  "invalid-items":
    "후보가 1~100개이고 항목당 50자 이내일 때 저장할 수 있습니다.",
  limit: `저장한 명단은 최대 ${MAX_SAVED_LISTS}개입니다. 같은 이름으로 덮어쓰거나 하나를 삭제해 주세요.`,
};

export default function SavedLists({
  items,
  disabled,
  onLoad,
  canUndo,
  onUndo,
}: SavedListsProps) {
  const nameInputId = useId();
  const { lists, save, remove, storageFailed } = useSavedLists();
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    const result = save(name, items);
    if (!result.ok) {
      setMessage(FAILURE_MESSAGES[result.reason]);
      return;
    }
    setMessage(
      result.replaced
        ? `"${name.trim()}" 명단을 덮어썼습니다.`
        : `"${name.trim()}" 명단을 저장했습니다.`,
    );
    setName("");
  };

  return (
    <section
      aria-label="저장한 명단"
      className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300"
    >
      <h3 className="font-bold text-white">저장한 명단</h3>
      <p className="mt-1 text-xs text-slate-400">
        이 브라우저에만 저장되며 서버로 보내지 않습니다. 같은 이름으로 저장하면
        덮어씁니다.
      </p>
      <div className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor={nameInputId}>
          명단 이름
        </label>
        <input
          id={nameInputId}
          value={name}
          maxLength={MAX_LIST_NAME_LENGTH}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }
          }}
          placeholder="예: 3반 학생"
          className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled}
          className="shrink-0 rounded-lg border border-slate-600 px-3 py-2 font-semibold text-white hover:border-cyan-500 disabled:opacity-50"
        >
          현재 명단 저장
        </button>
      </div>
      <p className="mt-2 min-h-5" role="status">
        {message}
      </p>
      {storageFailed && (
        <p className="mt-1 text-amber-300">
          브라우저 저장이 막혀 있어 이 탭을 닫으면 명단이 사라집니다.
        </p>
      )}
      {canUndo && (
        <button
          type="button"
          onClick={onUndo}
          disabled={disabled}
          className="mt-2 font-semibold text-cyan-300 underline"
        >
          불러오기 전 명단으로 되돌리기
        </button>
      )}
      {lists.length === 0 ? (
        <p className="mt-2 text-slate-500">저장한 명단이 없습니다.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {lists.map((list) => (
            <li
              key={list.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-slate-950 px-3 py-2"
            >
              <span className="min-w-0 truncate">
                <span className="font-semibold text-white">{list.name}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {list.items.length}개
                </span>
              </span>
              <span className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onLoad(list.items)}
                  aria-label={`${list.name} 명단 불러오기 (현재 명단 교체)`}
                  className="font-semibold text-cyan-300 hover:underline disabled:opacity-50"
                >
                  불러오기
                </button>
                <button
                  type="button"
                  onClick={() => remove(list.id)}
                  aria-label={`${list.name} 명단 삭제`}
                  className="text-slate-400 hover:text-red-300"
                >
                  삭제
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
