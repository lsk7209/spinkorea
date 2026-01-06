import { useState, useMemo } from 'react';
import { FileText, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function TextCounter() {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        const totalChars = text.length;
        const noSpaceChars = text.replace(/\s/g, '').length;
        const lines = text ? text.split(/\n/).length : 0;
        const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;

        // Byte calculation (Korean/UTF-8 friendly)
        const bytes = new Blob([text]).size;

        // Paragraphs (double newline)
        const paragraphs = text ? text.split(/\n\s*\n/).filter(Boolean).length : 0;

        return { totalChars, noSpaceChars, lines, words, bytes, paragraphs };
    }, [text]);

    const copyText = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success('텍스트가 복사되었습니다.');
    };

    const clearText = () => {
        if (!text) return;
        if (confirm('작성 내용을 모두 지우시겠습니까?')) {
            setText('');
        }
    };

    return (
        <ToolLayout
            title="글자수 세기 (네이버/자소서 기준)"
            description="자기소개서, 블로그, 레포트 작성 시 필수! 공백 포함/제외 글자수, 바이트(Byte), 단어 수, 줄 수를 실시간으로 계산합니다. 네이버, 사람인, 잡코리아 등 다양한 플랫폼의 글자수 기준에 대응합니다."
            keywords="글자수세기, 글자수검사기, 자소서글자수, 네이버글자수, 바이트계산기, 단어수세기, Character Counter"
            howToUse={[
                "텍스트 입력창에 글자를 직접 타이핑하거나 붙여넣기(Ctrl+V) 하세요",
                "입력과 동시에 글자수, 바이트, 단어수 등이 실시간으로 계산됩니다",
                "필요 시 복사 버튼으로 작성한 내용을 클립보드에 저장하세요",
                "초기화 버튼으로 내용을 모두 지울 수 있습니다"
            ]}
            tips={[
                "자기소개서는 보통 '공백 제외' 기준 500~1,000자를 요구합니다",
                "네이버 블로그는 '바이트' 기준을 사용하는 경우가 많습니다 (한글 1자 = 3Byte)",
                "SEO를 위한 블로그 포스팅은 공백 제외 1,500자 이상을 권장합니다",
                "제목은 모바일 표시 기준 20~25자가 적당합니다"
            ]}
            faqs={[
                { question: "공백 포함과 공백 제외 중 어떤 것을 봐야 하나요?", answer: "지원서나 서비스마다 기준이 다릅니다. 대부분의 자소서는 '공백 포함' 또는 '공백 제외'를 명시하니 해당 기준에 맞춰 확인하세요." },
                { question: "바이트(Byte)는 왜 글자수와 다른가요?", answer: "UTF-8 인코딩에서 한글 1자는 3바이트, 영문/숫자는 1바이트를 차지합니다. 일부 시스템에서는 바이트 제한을 사용하기 때문에 확인이 필요합니다." },
                { question: "작성한 내용이 저장되나요?", answer: "아니요, 입력한 텍스트는 서버에 저장되지 않으며, 페이지를 새로고침하면 사라집니다. 중요한 내용은 별도로 저장해주세요." },
                { question: "최대 몇 자까지 입력할 수 있나요?", answer: "기술적으로는 수십만 자까지 입력 가능하지만, 너무 긴 텍스트는 브라우저 성능에 영향을 줄 수 있습니다." }
            ]}
            relatedTools={[
                { name: "대소문자 변환기", path: "/tools/case-converter", description: "텍스트의 대소문자를 일괄 변환" },
                { name: "Lorem Ipsum 생성기", path: "/tools/lorem-ipsum", description: "더미 텍스트 생성" },
                { name: "JSON 포맷터", path: "/tools/json-formatter", description: "JSON 데이터 정리 및 포맷팅" }
            ]}
        >
            <div className="flex flex-col gap-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-sm mb-1">공백 포함</div>
                        <div className="text-2xl font-bold text-neon-primary">{stats.totalChars.toLocaleString()}자</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-sm mb-1">공백 제외</div>
                        <div className="text-2xl font-bold text-white">{stats.noSpaceChars.toLocaleString()}자</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-sm mb-1">바이트(Byte)</div>
                        <div className="text-2xl font-bold text-yellow-500">{stats.bytes.toLocaleString()}B</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                        <div className="text-gray-400 text-sm mb-1">단어 / 줄</div>
                        <div className="text-xl font-bold text-blue-400">
                            {stats.words} / {stats.lines}
                        </div>
                    </div>
                </div>

                {/* Text Area */}
                <div className="relative group">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="여기에 텍스트를 입력하거나 붙여넣기(Ctrl+V) 하세요..."
                        className="w-full h-80 bg-black/20 border border-white/10 rounded-xl p-6 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary resize-y text-lg leading-relaxed shadow-inner"
                        spellCheck={false}
                    />

                    {/* Floating Actions */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={copyText}
                            className="p-2 bg-neon-dark border border-neon-border text-gray-300 hover:text-white rounded-lg shadow-lg"
                            title="전체 복사"
                        >
                            <Copy size={20} />
                        </button>
                        <button
                            onClick={clearText}
                            className="p-2 bg-neon-dark border border-neon-border text-red-500 hover:text-red-400 rounded-lg shadow-lg"
                            title="초기화"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between text-xs text-gray-500 px-2">
                    <span>* 한글 1자 = 3Byte (UTF-8 기준)</span>
                    <span>{stats.paragraphs} 문단</span>
                </div>
            </div>

        </ToolLayout>
    );
}
