import { useMemo } from 'react';
import { TEMPLATES } from '@/data/templates';

interface RecommendedPresetsProps {
    onSelect: (items: string[]) => void;
    fallbackItems: string[];
}

const PRESET_CONFIG = [
    {
        id: 'default',
        title: 'SpinFlow 룰렛',
        icon: '🎯',
        description: '기본 추천 항목으로 바로 스핀',
    },
    {
        id: 'lunch-korean',
        title: '점심 메뉴 룰렛',
        icon: '🍽️',
        description: '한식·중식·일식 등 점심 메뉴 랜덤 추천',
    },
    {
        id: 'truth-dare',
        title: '진실 혹은 도전',
        icon: '🎲',
        description: '술자리/게임용 진실 또는 도전 선택',
    },
    {
        id: 'lotto',
        title: '로또 번호 생성',
        icon: '🎰',
        description: '1~45 번호로 구성된 로또 템플릿',
    },
];

export default function RecommendedPresets({ onSelect, fallbackItems }: RecommendedPresetsProps) {
    const presets = useMemo(() => {
        return PRESET_CONFIG.map((preset) => {
            if (preset.id === 'default') {
                return { ...preset, items: fallbackItems };
            }
            const templateItems = TEMPLATES.find((t) => t.id === preset.id)?.items;
            return { ...preset, items: templateItems ?? fallbackItems };
        });
    }, [fallbackItems]);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-neon-primary">추천 프리셋</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">원하는 주제로 바로 세팅</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {presets.map((preset) => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelect([...preset.items]);
                        }}
                        className="group text-left bg-white/5 border border-white/10 hover:border-neon-primary/40 rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-neon-sm flex flex-col gap-2"
                    >
                        <span className="text-2xl drop-shadow">{preset.icon}</span>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-100 group-hover:text-white">{preset.title}</p>
                            <p className="text-xs text-gray-400 mt-1 leading-snug">{preset.description}</p>
                        </div>
                        <span className="text-xs font-semibold text-neon-primary group-hover:text-white flex items-center gap-1">
                            바로 적용
                            <span aria-hidden>✓</span>
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}

