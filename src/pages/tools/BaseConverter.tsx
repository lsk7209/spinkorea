import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

type Base = 2 | 8 | 10 | 16;

const BASES: { base: Base; label: string; prefix: string; pattern: RegExp }[] = [
  { base: 2,  label: "2진수 (Binary)",      prefix: "0b", pattern: /^-?[01]+$/ },
  { base: 8,  label: "8진수 (Octal)",       prefix: "0o", pattern: /^-?[0-7]+$/ },
  { base: 10, label: "10진수 (Decimal)",    prefix: "",   pattern: /^-?[0-9]+$/ },
  { base: 16, label: "16진수 (Hexadecimal)",prefix: "0x", pattern: /^-?[0-9a-fA-F]+$/ },
];

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const MIN_SAFE = BigInt(Number.MIN_SAFE_INTEGER);

function convert(value: string, fromBase: Base): Record<Base, string> | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const info = BASES.find((b) => b.base === fromBase)!;
  if (!info.pattern.test(trimmed)) return null;
  let n: bigint;
  try {
    const isNeg = trimmed.startsWith("-");
    const abs = isNeg ? trimmed.slice(1) : trimmed;
    n = isNeg ? -BigInt("0x" + parseInt(abs, fromBase).toString(16)) : BigInt(parseInt(abs, fromBase));
    if (n > MAX_SAFE || n < MIN_SAFE) return null;
  } catch {
    return null;
  }
  return {
    2:  n.toString(2),
    8:  n.toString(8),
    10: n.toString(10),
    16: n.toString(16).toUpperCase(),
  };
}

const DEC_PRESETS = [0, 1, 10, 42, 127, 255, 256, 1024, 65535];

export default function BaseConverter() {
  const [inputBase, setInputBase] = useState<Base>(10);
  const [inputVal, setInputVal] = useState("255");

  const result = convert(inputVal, inputBase);
  const currentInfo = BASES.find((b) => b.base === inputBase)!;

  return (
    <ToolLayout
      title="진법 변환기"
      description="2진수·8진수·10진수·16진수를 상호 변환합니다. 개발·컴퓨터 과학에 필요한 진법 계산을 바로 확인하세요."
      faqs={[
        {
          question: "진법이란 무엇인가요?",
          answer: "진법은 수를 표현하는 방식으로, 사용하는 숫자의 개수를 뜻합니다. 2진수는 0·1만, 8진수는 0~7, 10진수는 0~9, 16진수는 0~9와 A~F를 사용합니다. 컴퓨터는 내부적으로 2진수를 사용하지만 코드에서는 16진수(HEX)를 자주 씁니다.",
        },
        {
          question: "16진수에서 A~F는 무슨 값인가요?",
          answer: "16진수에서 A=10, B=11, C=12, D=13, E=14, F=15입니다. 예를 들어 0xFF = 255, 0x1A = 26입니다. 대소문자를 구분하지 않아 0xff와 0xFF는 같은 값입니다.",
        },
        {
          question: "색상 HEX 코드와 진법의 관계는?",
          answer: "색상 HEX 코드(#RRGGBB)는 각 색상 채널을 16진수 2자리(00~FF = 0~255)로 표현합니다. 예를 들어 #FF0000은 R=255, G=0, B=0으로 순수 빨간색입니다.",
        },
        {
          question: "2진수를 16진수로 빠르게 변환하는 방법은?",
          answer: "2진수 4자리가 16진수 1자리에 대응합니다. 예를 들어 1111(2) = F(16), 1010(2) = A(16)입니다. 긴 2진수는 오른쪽부터 4자리씩 묶어서 각 그룹을 16진수로 변환하면 빠릅니다.",
        },
      ]}
    >
      <div className="space-y-6 max-w-lg mx-auto">
        {/* 입력 진법 선택 */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">입력 진법</label>
          <div className="grid grid-cols-2 gap-2">
            {BASES.map(({ base, label }) => (
              <button
                key={base}
                type="button"
                onClick={() => { setInputBase(base); setInputVal(""); }}
                className={`py-2 rounded-xl text-sm font-bold transition-all ${inputBase === base ? "bg-neon-primary text-black" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 숫자 입력 */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {currentInfo.label} 입력
          </label>
          <input
            type="text"
            placeholder={inputBase === 10 ? "e.g. 255" : inputBase === 16 ? "e.g. FF" : inputBase === 2 ? "e.g. 11111111" : "e.g. 377"}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary/50 transition-colors font-mono text-lg"
          />
          {inputBase === 10 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {DEC_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setInputVal(String(n))}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-neon-primary/40 transition-all font-mono"
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 변환 결과 */}
        {result ? (
          <div className="card p-5 space-y-3">
            {BASES.map(({ base, label, prefix }) => (
              <div
                key={base}
                className={`flex justify-between items-center py-2 ${base !== 16 ? "border-b border-white/10" : ""}`}
              >
                <span className="text-sm text-gray-400 w-36 shrink-0">{label}</span>
                <span
                  className={`font-mono font-bold text-right break-all ${base === inputBase ? "text-neon-primary text-lg" : "text-gray-200"}`}
                >
                  {prefix}{result[base]}
                </span>
              </div>
            ))}
          </div>
        ) : inputVal ? (
          <p className="text-center text-red-400 text-sm py-4">올바른 {currentInfo.label} 형식이 아닙니다.</p>
        ) : null}
      </div>
    </ToolLayout>
  );
}
