import { useState } from 'react';
import { Braces, Copy, Minimize2, Maximize2, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const formatJson = (space: number) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, space));
            setError(null);
            toast.success('포맷팅이 완료되었습니다.');
        } catch (e: any) {
            setError(e.message);
            toast.error('유효하지 않은 JSON 형식입니다.');
        }
    };

    const minifyJson = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError(null);
            toast.success('압축(Minify)이 완료되었습니다.');
        } catch (e: any) {
            setError(e.message);
            toast.error('유효하지 않은 JSON 형식입니다.');
        }
    };

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success('결과가 복사되었습니다.');
    };

    const loadExample = () => {
        const example = {
            project: "SpinFlow",
            version: 1.0,
            features: ["JSON Formatter", "Validator"],
            active: true
        };
        setInput(JSON.stringify(example));
        setOutput('');
        setError(null);
    };

    return (
        <ToolLayout
            title="JSON 포맷터 & 검사기"
            description="복잡한 JSON 데이터를 보기 좋게 정렬(Pretty Print)하거나 용량을 줄이게 압축(Minify)하세요. 문법 오류 검사(Validation) 기능도 제공합니다."
            keywords="JSON포맷터, JSON정렬, JSON검사기, JSON형식, JSON뷰어, JSON Minify, JSON Formatter"
        >
            <div className="flex flex-col gap-6 h-full">

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
                    <button
                        onClick={() => formatJson(2)}
                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                        <Maximize2 size={16} /> 정렬 (2칸)
                    </button>
                    <button
                        onClick={() => formatJson(4)}
                        className="btn-secondary py-2 px-4 text-sm"
                    >
                        정렬 (4칸)
                    </button>
                    <button
                        onClick={minifyJson}
                        className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
                    >
                        <Minimize2 size={16} /> 압축 (Minify)
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-2 hidden md:block"></div>
                    <button
                        onClick={loadExample}
                        className="text-gray-400 hover:text-white text-sm underline"
                    >
                        예제 불러오기
                    </button>
                    <button
                        onClick={() => { setInput(''); setOutput(''); setError(null); }}
                        className="ml-auto text-red-500 hover:text-red-400 p-2"
                        title="모두 지우기"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* Editor Grid */}
                <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-[500px]">

                    {/* Input Area */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-400 text-sm font-medium ml-1 flex items-center gap-2">
                            <Braces size={14} /> 입력 (Input)
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="JSON 데이터를 여기에 입력하세요..."
                            className={`w-full h-full bg-black/30 border rounded-xl p-4 text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 resize-none ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-neon-primary focus:ring-neon-primary/50'
                                }`}
                            spellCheck={false}
                        />
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-400 text-xs flex items-start gap-2">
                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Output Area */}
                    <div className="flex flex-col gap-2 relative group">
                        <label className="text-gray-400 text-sm font-medium ml-1 flex items-center justify-between">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500" /> 결과 (Result)</span>
                            {output && <span className="text-xs text-gray-500">{(new Blob([output]).size / 1024).toFixed(2)} KB</span>}
                        </label>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="변환된 결과가 여기에 표시됩니다."
                            className="w-full h-full bg-black/40 border border-white/10 rounded-xl p-4 text-neon-secondary text-sm font-mono leading-relaxed focus:outline-none resize-none"
                            spellCheck={false}
                        />
                        {/* Floating Copy Button */}
                        {output && (
                            <div className="absolute top-9 right-4">
                                <button
                                    onClick={copyOutput}
                                    className="p-2 bg-neon-dark border border-neon-border text-gray-300 hover:text-white rounded-lg shadow-lg hover:bg-white/10 transition-colors"
                                    title="결과 복사"
                                >
                                    <Copy size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guide */}
                <div className="mt-6 border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">📌 JSON 활용 가이이드</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        JSON(JavaScript Object Notation)은 데이터를 저장하거나 전송할 때 많이 사용되는 가벼운 형식입니다.
                        개발자 도구에서 API 읍답을 확인하거나, 설정 파일을 수정할 때 이 도구를 사용하여 가독성을 높일 수 있습니다.
                        <strong>Validate</strong> 기능을 통해 쉼표(,) 누락이나 괄호 짝이 맞지 않는 오류를 쉽게 찾으세요.
                    </p>
                </div>
            </div>
        </ToolLayout>
    );
}
