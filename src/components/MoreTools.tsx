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
        <section className="w-full max-w-7xl mx-auto px-4 py-12 border-t border-white/10">
            <div className="text-center mb-8 space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-neon-primary">More tools</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gradient">🚀 유틸리티 모음</h2>
                <p className="text-sm text-gray-400">빠른 결정, 변환, 생성까지 한 곳에서.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.path}
                        to={tool.path}
                        className="group relative overflow-hidden card card-hover p-4 flex flex-col items-start gap-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`p-3 rounded-xl bg-black/30 ${tool.color} group-hover:scale-110 transition-transform`}>
                            <tool.icon size={22} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-gray-100 group-hover:text-white transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                {tool.desc}
                            </p>
                        </div>
                        <span className="text-[11px] text-neon-primary font-semibold mt-auto inline-flex items-center gap-1">
                            바로가기
                            <span aria-hidden>↗</span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
