import { useState } from 'react';
import type { Change } from 'diff';
import { diffChars, diffLines, diffWords } from 'diff';
import { RefreshCcw } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';

export default function DiffChecker() {
    const [oldText, setOldText] = useState('Type your original text here...\nExample line 1\nExample line 2');
    const [newText, setNewText] = useState('Type your new text here...\nExample line 1 changed\nExample line 2');
    const [diffType, setDiffType] = useState<'chars' | 'words' | 'lines'>('words');
    const [diffs, setDiffs] = useState<Change[]>([]);

    useState(() => {
        calculateDiff();
    });

    function calculateDiff() {
        let changes;
        if (diffType === 'chars') changes = diffChars(oldText, newText);
        else if (diffType === 'lines') changes = diffLines(oldText, newText);
        else changes = diffWords(oldText, newText);
        setDiffs(changes);
    }

    // Recalculate when inputs change
    const handleDiff = () => calculateDiff();

    return (
        <ToolLayout
            title="텍스트 비교 (Diff Checker)"
            description="두 개의 텍스트나 코드를 비교하여 차이점을 찾아냅니다. 추가된 부분은 초록색, 삭제된 부분은 빨간색으로 하이라이트됩니다."
            keywords="diff checker, text difference, 텍스트 비교, 코드 비교 tool, diff tool"
        >
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">

                {/* Controls */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm font-bold">비교 모드:</span>
                        <select
                            value={diffType}
                            onChange={(e) => {
                                setDiffType(e.target.value as any);
                                setTimeout(handleDiff, 0);
                            }}
                            className="bg-black/30 border border-white/20 rounded px-3 py-1 text-white focus:outline-none focus:border-neon-primary"
                        >
                            <option value="words">단어 (Words)</option>
                            <option value="chars">글자 (Chars)</option>
                            <option value="lines">줄 (Lines)</option>
                        </select>
                    </div>
                    <button
                        onClick={handleDiff}
                        className="bg-neon-primary hover:bg-neon-primary/80 text-black font-bold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <RefreshCcw size={16} /> 비교하기
                    </button>
                </div>

                {/* Input Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-bold block">원본 텍스트 (Original)</label>
                        <textarea
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            className="w-full h-48 bg-black/30 border border-white/20 rounded-xl p-4 text-gray-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-red-500/50"
                            placeholder="원본 텍스트 입력"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-bold block">수정된 텍스트 (Modified)</label>
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            className="w-full h-48 bg-black/30 border border-white/20 rounded-xl p-4 text-gray-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-green-500/50"
                            placeholder="변경된 텍스트 입력"
                        />
                    </div>
                </div>

                {/* Diff Result */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-bold block">비교 결과 (Result)</label>
                    <div className="bg-black border border-white/10 rounded-xl p-6 min-h-[200px] font-mono whitespace-pre-wrap leading-relaxed text-gray-300">
                        {diffs.map((part, index) => {
                            const color = part.added ? 'bg-green-500/30 text-green-200' :
                                part.removed ? 'bg-red-500/30 text-red-200 decoration-red-400 line-through' :
                                    'text-gray-400';
                            return (
                                <span key={index} className={`${color} px-0.5 rounded break-all`}>
                                    {part.value}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
