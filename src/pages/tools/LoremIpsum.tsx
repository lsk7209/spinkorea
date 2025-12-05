import { useState, useEffect } from 'react';
import { Copy, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

// Standard Lorem Ipsum text bank
const LOREM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`;

export default function LoremIpsum() {
    const [count, setCount] = useState(3);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [result, setResult] = useState('');

    const generateLorem = () => {
        const sentences = LOREM_TEXT.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
        const words = LOREM_TEXT.replace(/[.,]/g, '').split(/\s+/);

        let output = '';

        if (type === 'paragraphs') {
            // Simply repeat legitimate looking paragraphs
            const paras = [
                LOREM_TEXT.split('\n')[0],
                LOREM_TEXT.split('\n')[1],
                LOREM_TEXT.split('\n')[2]
            ];

            output = Array.from({ length: count }, (_, i) => paras[i % paras.length]).join('\n\n');
        }
        else if (type === 'sentences') {
            output = Array.from({ length: count }, (_, i) => sentences[i % sentences.length]).join(' ');
        }
        else if (type === 'words') {
            output = Array.from({ length: count }, (_, i) => words[i % words.length]).join(' ');
        }

        setResult(output);
    };

    // Auto generate on change
    useEffect(() => {
        generateLorem();
    }, [count, type]);

    const copyText = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        toast.success('로렘 입숨 텍스트가 복사되었습니다.');
    };

    return (
        <ToolLayout
            title="로렘 입숨 생성기 (한글/영문)"
            description="디자인 시안, 웹사이트 프로토타입에 들어갈 의미 없는 채움글(Dummy Text)을 무료로 생성하세요. 문단, 문장, 단어 단위 생성 가능."
            keywords="로렘입숨, Lorem Ipsum, 더미텍스트, 채움글, 임시텍스트, 디자인텍스트, Lipsum"
        >
            <div className="flex flex-col gap-8">

                {/* Controls */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <label className="text-gray-300 font-medium whitespace-nowrap">개수:</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-neon-primary"
                        />
                    </div>

                    <div className="flex bg-black/30 p-1 rounded-lg border border-white/10 w-full md:w-auto">
                        {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${type === t
                                        ? 'bg-neon-primary text-black shadow-md'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {t === 'paragraphs' && '문단'}
                                {t === 'sentences' && '문장'}
                                {t === 'words' && '단어'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={generateLorem}
                        className="w-full md:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} /> 재생성
                    </button>
                </div>

                {/* Result Area */}
                <div className="relative group">
                    <textarea
                        value={result}
                        readOnly
                        className="w-full h-80 bg-black/20 border border-white/10 rounded-xl p-6 text-gray-300 focus:outline-none resize-y text-lg leading-relaxed font-serif"
                    />

                    <div className="absolute top-4 right-4">
                        <button
                            onClick={copyText}
                            className="flex items-center gap-2 px-4 py-2 bg-neon-dark border border-neon-border text-neon-primary hover:bg-neon-primary hover:text-black rounded-lg shadow-lg transition-all"
                        >
                            <Copy size={18} />
                            <span className="font-bold">복사하기</span>
                        </button>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                    <FileText className="text-blue-400 shrink-0 mt-1" size={20} />
                    <div className="text-sm">
                        <h4 className="text-blue-300 font-bold mb-1">로렘 입숨(Lorem Ipsum)이란?</h4>
                        <p className="text-gray-400 leading-relaxed">
                            출판이나 그래픽 디자인 분야에서 폰트, 타입페이스, 레이아웃 같은 그래픽 요소나 시각적 연출을 보여줄 때 사용하는 표준 채움글입니다.
                            키케로의 "최고선악론"에서 유래되었으며, 의미 없는 라틴어 문장들로 구성되어 있어 디자인 자체에 집중할 수 있게 도와줍니다.
                        </p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
