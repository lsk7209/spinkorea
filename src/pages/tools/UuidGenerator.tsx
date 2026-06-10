import { useState, useCallback } from "react";
import { toast } from "sonner";
import ToolLayout from "@/components/ToolLayout";

function makeUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const COUNT_OPTIONS = [1, 3, 5, 10];

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() =>
    Array.from({ length: 5 }, makeUUID)
  );
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, makeUUID));
  }, [count]);

  const display = (u: string) => (uppercase ? u.toUpperCase() : u);

  const copyOne = (u: string) => {
    navigator.clipboard.writeText(display(u)).then(() => toast.success("복사됨"));
  };

  const copyAll = () => {
    navigator.clipboard
      .writeText(uuids.map(display).join("\n"))
      .then(() => toast.success(`${uuids.length}개 복사됨`));
  };

  return (
    <ToolLayout
      title="UUID 생성기"
      description="버튼 하나로 UUID v4를 최대 10개까지 생성합니다. 개별 복사와 전체 복사를 지원합니다."
      faqs={[
        {
          question: "UUID란 무엇인가요?",
          answer: "UUID(Universally Unique Identifier)는 소프트웨어에서 객체를 고유하게 식별하기 위한 128비트 식별자입니다. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 형식으로 표시하며, 데이터베이스 기본 키·세션 ID·파일 이름 등에 사용합니다.",
        },
        {
          question: "UUID v4는 어떻게 생성되나요?",
          answer: "UUID v4는 암호학적으로 안전한 난수 생성기(CSPRNG)를 사용해 만들어집니다. 이론적으로 중복이 발생할 확률은 극히 낮아(1조분의 1 이하) 전역적으로 고유하다고 볼 수 있습니다. 이 도구는 브라우저의 Web Crypto API를 사용합니다.",
        },
        {
          question: "GUID와 UUID의 차이는?",
          answer: "GUID(Globally Unique Identifier)는 Microsoft가 UUID를 자사 플랫폼에 맞게 구현한 명칭입니다. 형식은 동일하며 사실상 같은 개념입니다. Windows 환경에서는 GUID, 크로스 플랫폼에서는 UUID를 주로 사용합니다.",
        },
      ]}
    >
      <div className="space-y-5 max-w-lg mx-auto">
        {/* 설정 */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setCount(n);
                  setUuids(Array.from({ length: n }, makeUUID));
                }}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${count === n ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {n}
              </button>
            ))}
            <span className="self-center text-sm text-gray-500">개</span>
          </div>

          <button
            type="button"
            onClick={() => setUppercase((v) => !v)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${uppercase ? "bg-neon-primary/20 border-neon-primary/50 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
          >
            대문자
          </button>

          <button
            type="button"
            onClick={generate}
            className="px-5 py-2 bg-neon-primary text-black rounded-xl text-sm font-black hover:opacity-90 transition-all"
          >
            새로 생성
          </button>

          <button
            type="button"
            onClick={copyAll}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
          >
            전체 복사
          </button>
        </div>

        {/* UUID 목록 */}
        <div className="space-y-2">
          {uuids.map((u, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-neon-primary/30 transition-all"
            >
              <span className="font-mono text-sm text-gray-200 flex-1 break-all select-all">
                {display(u)}
              </span>
              <button
                type="button"
                onClick={() => copyOne(u)}
                className="shrink-0 text-xs text-gray-500 hover:text-neon-primary transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
              >
                복사
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
