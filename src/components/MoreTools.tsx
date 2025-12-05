import { Link } from 'react-router-dom';
import {
    Dice5, Coins, Binary, Users, Lock,
    Type, FileType, FileText, Braces, Link as LinkIcon,
    Dices, Wand2
} from 'lucide-react';

const TOOLS = [
    // Batch 1
    { path: '/tools/lotto-generator', name: '로또 번호 생성', icon: Dices, desc: '나만의 행운 번호 추첨', color: 'text-yellow-400' },
    { path: '/tools/dice-roller', name: '주사위 던지기', icon: Dice5, desc: '3D 주사위 시뮬레이션', color: 'text-red-400' },
    { path: '/tools/coin-flip', name: '동전 던지기', icon: Coins, desc: '앞면 vs 뒷면 승부', color: 'text-orange-400' },
    { path: '/tools/yes-no-oracle', name: 'Yes or No', icon: Wand2, desc: '결정 장애 해결사', color: 'text-purple-400' },
    { path: '/tools/random-team', name: '랜덤 팀 편성', icon: Users, desc: '공정한 팀 나누기', color: 'text-blue-400' },
    { path: '/tools/random-password', name: '비밀번호 생성', icon: Lock, desc: '강력한 보안 암호', color: 'text-green-400' },

    // Batch 2
    { path: '/tools/text-counter', name: '글자수 세기', icon: Type, desc: '자소서/블로그 글자수', color: 'text-pink-400' },
    { path: '/tools/case-converter', name: '대소문자 변환', icon: FileType, desc: '영어 대소문자/카멜', color: 'text-indigo-400' },
    { path: '/tools/lorem-ipsum', name: '로렘 입숨', icon: FileText, desc: '더미 텍스트 생성', color: 'text-gray-400' },
    { path: '/tools/json-formatter', name: 'JSON 포맷터', icon: Braces, desc: '정렬/압축/검사', color: 'text-cyan-400' },
    { path: '/tools/uri-encoder', name: 'URL 인코더', icon: LinkIcon, desc: 'URL 인코딩/디코딩', color: 'text-lime-400' },
    { path: '/tools/base64-encoder', name: 'Base64 변환', icon: Binary, desc: '텍스트 ↔ Base64', color: 'text-emerald-400' },
];

export default function MoreTools() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-12 border-t border-neon-border/30">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gradient">
                🚀 더 많은 유틸리티 도구
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.path}
                        to={tool.path}
                        className="group bg-white/5 border border-white/10 hover:border-neon-primary/50 hover:bg-white/10 rounded-xl p-4 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center gap-3"
                    >
                        <div className={`p-3 rounded-full bg-black/30 ${tool.color} group-hover:scale-110 transition-transform`}>
                            <tool.icon size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-200 group-hover:text-white mb-1 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                {tool.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
