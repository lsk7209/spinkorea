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
            description="자기소개서, 블로그 포스팅, 레포트 작성 시 필수! 공백 포함/제외 글자수, 바이트(Byte), 단어 수, 줄 수를 실시간으로 계산해주는 무료 도구입니다."
            keywords="글자수세기, 글자수검사기, 자소서글자수, 네이버글자수, 바이트계산기, 단어수세기, Character Counter"
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

            {/* AEO Content */}
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">📝 자소서/블로그 글자수 가이드</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-neon-secondary font-medium mb-2">자기소개서 (공백 제외/포함)</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>일반적으로 <strong>500자 ~ 1,000자</strong> 요구</li>
                            <li>기업마다 기준(Byte vs 자수)이 다르니 확인 필수</li>
                            <li>이력서 제목은 30자 이내가 적당</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-neon-secondary font-medium mb-2">블로그 포스팅 (SEO)</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>최적 길이: <strong>공백 제외 1,500자 이상</strong></li>
                            <li>체류 시간을 위해 이미지/동영상 적절히 배치</li>
                            <li>제목은 모바일 기준 20~25자 권장</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
