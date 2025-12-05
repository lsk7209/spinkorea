import { useState } from 'react';
import { FileType, Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

export default function CaseConverter() {
    const [text, setText] = useState('');

    const convertCase = (type: CaseType) => {
        if (!text) return;
        let result = '';

        switch (type) {
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'title':
                result = text.toLowerCase().split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                break;
            case 'sentence':
                result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'camel':
                result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case 'pascal':
                result = text.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                result = result.charAt(0).toUpperCase() + result.slice(1);
                break;
            case 'snake':
                result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('_') || text;
                break;
            case 'kebab':
                result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                    ?.map(x => x.toLowerCase())
                    .join('-') || text;
                break;
        }
        setText(result);
        toast.success('변환되었습니다.');
    };

    const copyText = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success('복사되었습니다.');
    };

    return (
        <ToolLayout
            title="영어 대소문자 변환기"
            description="영어 문장의 대문자, 소문자, Title Case(제목), CamelCase, PascalCase, Snake_Case 등을 한 번에 변환해주는 무료 도구입니다."
            keywords="대소문자변환, 영어변환, 카멜케이스, 파스칼케이스, 스네이크케이스, Case Converter, 대문자변환"
        >
            <div className="flex flex-col gap-6">

                {/* Visual Header */}
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-2">
                    <FileType className="text-neon-primary" />
                    <span>원하는 변환 버튼을 클릭하면 텍스트가 즉시 변경됩니다.</span>
                </div>

                {/* Text Area */}
                <div className="relative group">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="변환할 영어 텍스트를 입력하세요 (예: hello world)"
                        className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-6 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary resize-y text-lg leading-relaxed shadow-inner"
                        spellCheck={false}
                    />

                    {/* Floating Actions */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                            onClick={copyText}
                            className="p-2 bg-neon-dark border border-neon-border text-gray-300 hover:text-white rounded-lg shadow-lg hover:bg-white/10 transition-colors"
                            title="전체 복사"
                        >
                            <Copy size={20} />
                        </button>
                        <button
                            onClick={() => setText('')}
                            className="p-2 bg-neon-dark border border-neon-border text-red-500 hover:text-red-400 rounded-lg shadow-lg hover:bg-white/10 transition-colors"
                            title="초기화"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => convertCase('upper')} className="btn-secondary py-3 text-sm">UPPER CASE</button>
                    <button onClick={() => convertCase('lower')} className="btn-secondary py-3 text-sm">lower case</button>
                    <button onClick={() => convertCase('title')} className="btn-secondary py-3 text-sm">Title Case</button>
                    <button onClick={() => convertCase('sentence')} className="btn-secondary py-3 text-sm">Sentence case</button>

                    <button onClick={() => convertCase('camel')} className="btn-secondary py-3 text-sm font-mono">camelCase</button>
                    <button onClick={() => convertCase('pascal')} className="btn-secondary py-3 text-sm font-mono">PascalCase</button>
                    <button onClick={() => convertCase('snake')} className="btn-secondary py-3 text-sm font-mono">snake_case</button>
                    <button onClick={() => convertCase('kebab')} className="btn-secondary py-3 text-sm font-mono">kebab-case</button>
                </div>

                {/* Example Preview */}
                {text && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                            <ArrowRightLeft size={12} />
                            <span>변환 미리보기 (첫 50자)</span>
                        </div>
                        <div className="text-gray-300 font-mono text-sm truncate">
                            {text.slice(0, 50)}{text.length > 50 ? '...' : ''}
                        </div>
                    </div>
                )}
            </div>

            {/* AEO Content */}
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">🔠 개발자 & 작가를 위한 표기법 가이드</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <h4 className="text-neon-secondary font-medium mb-2">프로그래밍 표기법</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li><span className="text-white font-mono bg-white/10 px-1 rounded">camelCase</span>: 자바스크립트 등 변수명 (첫 글자 소문자)</li>
                            <li><span className="text-white font-mono bg-white/10 px-1 rounded">PascalCase</span>: 클래스명, 컴포넌트명 (첫 글자 대문자)</li>
                            <li><span className="text-white font-mono bg-white/10 px-1 rounded">snake_case</span>: 파이썬 변수명 (언더바 구분)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-neon-secondary font-medium mb-2">영어 문장 표기법</h4>
                        <ul className="text-gray-400 space-y-2">
                            <li><strong>Title Case</strong>: 제목/헤드라인 (주요 단어 첫 글자 대문자)</li>
                            <li><strong>Sentence case</strong>: 일반 문장 (문장의 첫 글자만 대문자)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
