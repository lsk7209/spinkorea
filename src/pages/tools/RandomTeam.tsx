import { useState } from 'react';
import { Users, Check, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ToolLayout from '@/components/ToolLayout';

export default function RandomTeam() {
    const [names, setNames] = useState('');
    const [teamCount, setTeamCount] = useState(2);
    const [teams, setTeams] = useState<string[][]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateTeams = () => {
        const nameList = names.split('\n').filter(n => n.trim() !== '');

        if (nameList.length < teamCount) {
            toast.error('참가자 수가 팀 수보다 적습니다.');
            return;
        }

        setIsGenerating(true);

        // Simple shuffle animation/delay
        setTimeout(() => {
            // Shuffle names
            const shuffled = [...nameList].sort(() => Math.random() - 0.5);

            // Distribute
            const newTeams: string[][] = Array.from({ length: teamCount }, () => []);
            shuffled.forEach((name, index) => {
                newTeams[index % teamCount].push(name.trim());
            });

            setTeams(newTeams);
            setIsGenerating(false);
            toast.success('팀 구성이 완료되었습니다!');
        }, 800);
    };

    const copyResults = () => {
        const text = teams.map((team, idx) => `[팀 ${idx + 1}]\n${team.join(', ')}`).join('\n\n');
        navigator.clipboard.writeText(text);
        toast.success('결과가 클립보드에 복사되었습니다.');
    };

    return (
        <ToolLayout
            title="랜덤 팀 편성기"
            description="이름만 입력하면 공정하게 팀을 나눠드립니다. 스터디, 워크샵, 게임 대결 팀 짜기에 최적화된 무료 도구입니다."
            keywords="팀짜기, 조짜기, 랜덤팀, 팀편성, 조편성, 제비뽑기, 팀나누기"
        >
            <div className="grid md:grid-cols-2 gap-8">
                {/* Input Area */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            참가자 이름 입력 (줄바꿈으로 구분)
                        </label>
                        <textarea
                            value={names}
                            onChange={(e) => setNames(e.target.value)}
                            placeholder={`김철수\n이영희\n박민수\n...`}
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-neon-primary resize-none"
                        />
                        <p className="text-right text-xs text-gray-500 mt-2">
                            총 {names.split('\n').filter(n => n.trim()).length}명
                        </p>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                            팀(조) 개수 설정
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="2"
                                max="10"
                                value={teamCount}
                                onChange={(e) => setTeamCount(parseInt(e.target.value))}
                                className="flex-1 accent-neon-primary"
                            />
                            <span className="text-2xl font-bold text-neon-primary w-12 text-center">
                                {teamCount}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={generateTeams}
                        disabled={isGenerating || !names.trim()}
                        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                    >
                        <Users size={20} />
                        {isGenerating ? '팀 나누는 중...' : '팀 나누기'}
                    </button>
                </div>

                {/* Result Area */}
                <div className="bg-black/20 rounded-xl border border-white/5 p-6 min-h-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">편성 결과</h3>
                        {teams.length > 0 && (
                            <button
                                onClick={copyResults}
                                className="text-gray-400 hover:text-neon-primary transition-colors p-2"
                                title="결과 복사"
                            >
                                <Copy size={18} />
                            </button>
                        )}
                    </div>

                    {teams.length > 0 ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {teams.map((team, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-4 anim-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="font-bold text-neon-secondary mb-2">User {idx + 1}팀 ({team.length}명)</div>
                                    <div className="text-gray-300 leading-relaxed">
                                        {team.join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                            <Users size={40} className="opacity-20" />
                            <p>왼쪽에서 설정 후 실행해주세요</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AEO Content */}
            <div className="mt-12 border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-4">👥 공정한 팀 편성이 필요한 순간</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                    <li><strong>학교/학원:</strong> 조별 과제, 발표 순서 정하기</li>
                    <li><strong>워크샵/엠티:</strong> 레크리에이션 게임 조 편성</li>
                    <li><strong>스포츠:</strong> 풋살, 농구 공평한 팀 나누기</li>
                </ul>
            </div>
        </ToolLayout>
    );
}
