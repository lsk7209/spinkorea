import { useState, useEffect } from 'react';
import { Link, Copy, ArrowRightLeft, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function UriEncoder() {
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
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
            setError(null);
        } catch (e) {
            setError('변환할 수 없는 형식입니다. (Malformed URI)');
        }
    }, [input, mode]);

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success(mode === 'encode' ? '인코딩된 값이 복사되었습니다.' : '디코딩된 값이 복사되었습니다.');
    };

    const swapValues = () => {
        if (!output || error) return;
        setInput(output);
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    return (
        <ToolLayout
            title="URL 인코딩/디코딩"
            description="URL(URI)에 포함된 특수문자나 한글을 웹 표준 형식으로 변환(Encoding)하거나, 다시 원래 문자로 복원(Decoding)하세요."
            keywords="URL인코딩, URL디코딩, URI Converter, 퍼센트인코딩, 한글URL변환, 주소변환"
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
                        인코딩 (Encode)
                    </button>
                    <button
                        onClick={() => setMode('decode')}
                        className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'decode'
                                ? 'bg-neon-secondary text-black shadow-lg shadow-neon-secondary/20'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        디코딩 (Decode)
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
                            placeholder={mode === 'encode' ? "변환할 텍스트를 입력하세요 (예: 한글)" : "디코딩할 URL을 입력하세요 (예: %ED%95%9C%EA%B8%80)"}
                            className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary resize-none"
                        />
                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col gap-2 relative">
                        <label className="text-gray-400 text-sm font-medium ml-1">결과 (Result)</label>
                        <textarea
                            value={error || output}
                            readOnly
                            placeholder="결과가 여기에 표시됩니다."
                            className={`w-full h-64 bg-black/40 border rounded-xl p-4 text-sm font-mono leading-relaxed focus:outline-none resize-none ${error ? 'border-red-500/50 text-red-400' : 'border-white/10 text-neon-secondary'
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
                        <Link size={18} className="text-neon-primary" />
                        URL 인코딩이란?
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        인터넷 주소(URL)는 아스키(ASCII) 문자 집합으로만 구성되어야 합니다.
                        한글이나 공백, 특수문자 등을 URL에 포함시키려면 <strong>퍼센트 인코딩(Percent-Encoding)</strong>이라는 방식으로 변환해주어야 합니다.
                        이 도구는 자바스크립트의 표준 <code className="bg-black/30 px-1 rounded text-gray-300">encodeURIComponent</code> 함수를 사용하여 모든 브라우저와 호환되는 결과를 제공합니다.
                    </p>
                </div>
            </div>
        </ToolLayout>
    );
}
