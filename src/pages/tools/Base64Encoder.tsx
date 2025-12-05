import { useState, useEffect } from 'react';
import { Binary, Copy, ArrowRightLeft, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

// Unicode-safe Base64 helpers
function utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
}

export default function Base64Encoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!input) {
            setOutput('');
            setError(null);
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(utf8_to_b64(input));
            } else {
                setOutput(b64_to_utf8(input));
            }
            setError(null);
        } catch (e) {
            setError(mode === 'encode' ? '인코딩 실패' : '유효하지 않은 Base64 형식입니다.');
        }
    }, [input, mode]);

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success(mode === 'encode' ? 'Base64 값이 복사되었습니다.' : '디코딩된 텍스트가 복사되었습니다.');
    };

    const swapValues = () => {
        if (!output || error) return;
        setInput(output);
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    return (
        <ToolLayout
            title="Base64 인코딩/디코딩 (한글 지원)"
            description="텍스트나 데이터를 Base64 포맷으로 변환(Encode)하거나, Base64 코드를 다시 원본 텍스트로 복원(Decode)하세요. 한글(UTF-8)도 완벽하게 지원합니다."
            keywords="Base64인코딩, Base64디코딩, 베이스64, base64 converter, utf8 base64, 한글base64"
        >
            <div className="flex flex-col gap-6">

                {/* Mode Switcher */}
                <div className="flex bg-black/30 p-1 rounded-xl border border-white/10 self-center">
                    <button
                        onClick={() => setMode('encode')}
                        className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'encode'
                                ? 'bg-neon-primary text-black shadow-lg shadow-neon-primary/20'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        인코딩 (Desktop → Base64)
                    </button>
                    <button
                        onClick={() => setMode('decode')}
                        className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'decode'
                                ? 'bg-neon-secondary text-black shadow-lg shadow-neon-secondary/20'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        디코딩 (Base64 → Text)
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-start relative">

                    {/* Swap Button (Desktop) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                        <button
                            onClick={swapValues}
                            className="p-3 bg-gray-800 border border-white/20 rounded-full hover:bg-neon-dark hover:border-neon-primary hover:text-white transition-all shadow-xl"
                            title="결과값을 입력으로 이동 및 모드 전환"
                        >
                            <ArrowRightLeft size={20} />
                        </button>
                    </div>

                    {/* Input Area */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm font-medium ml-1 flex justify-between">
                            <span>입력 (Input)</span>
                            <button onClick={() => setInput('')} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1">
                                <Trash2 size={12} /> 지우기
                            </button>
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? "변환할 텍스트를 입력하세요 (예: 안녕하세요)" : "디코딩할 Base64 코드를 입력하세요 (예: 5y+T5Lm45ZXZ)"}
                            className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary resize-none"
                        />
                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-gray-400 text-sm font-medium ml-1">결과 (Result)</label>
                        <textarea
                            value={error || output}
                            readOnly
                            placeholder="변환 결과가 여기에 표시됩니다."
                            className={`w-full h-64 bg-black/40 border rounded-xl p-4 text-sm font-mono leading-relaxed focus:outline-none resize-none break-all ${error ? 'border-red-500/50 text-red-400' : 'border-white/10 text-neon-secondary'
                                }`}
                        />

                        {error && (
                            <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 p-2 rounded text-red-400 text-xs flex items-center gap-2">
                                <AlertTriangle size={14} /> {error}
                            </div>
                        )}

                        {output && !error && (
                            <div className="absolute bottom-4 right-4">
                                <button
                                    onClick={copyOutput}
                                    className="p-2 bg-neon-dark border border-neon-border text-gray-300 hover:text-white rounded-lg shadow-lg hover:bg-white/10 transition-colors"
                                    title="복사하기"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Info */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl mt-4">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Binary size={18} className="text-neon-primary" />
                        Base64 인코딩이란?
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        바이너리 데이터(이미지, 파일 등)를 텍스트(ASCII) 형태로 안전하게 전송하기 위해 사용하는 인코딩 방식입니다.
                        이메일 첨부파일이나 HTML 내 이미지 삽입(Data URI) 등에 자주 사용됩니다.
                        <strong>SpinFlow</strong>는 한글 깨짐 방지를 위해 UTF-8 처리를 기본으로 지원합니다.
                    </p>
                </div>
            </div>
        </ToolLayout>
    );
}
