import { useState, useMemo } from 'react';
import { X, Search, LayoutGrid } from 'lucide-react';
import { TEMPLATES } from '@/data/templates';
import type { Template } from '@/data/templates';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (items: string[]) => void;
}

const CATEGORIES = ['전체', '음식', '게임', '생활/결정', '운세/재미', '학습/자기개발', '기타'];

export default function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTemplates = useMemo(() => {
        return TEMPLATES.filter((template) => {
            const matchesCategory = selectedCategory === '전체' || template.category === selectedCategory;
            const matchesSearch = template.name.includes(searchQuery) ||
                template.items.some(item => item.includes(searchQuery));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const handleSelect = (template: Template) => {
        onSelect(template.items);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-neon-dark border border-neon-primary/30 rounded-3xl shadow-neon-lg overflow-hidden animate-scale-up">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 pb-4 border-b border-neon-primary/20 gap-4 bg-neon-bg/50">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-neon-primary/10 text-neon-primary">
                            <LayoutGrid size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                추천 <span className="text-neon-primary">템플릿</span>
                            </h2>
                            <p className="text-sm text-gray-400">원하는 주제를 선택하여 룰렛을 꾸며보세요.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="p-6 pb-2 grid gap-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="템플릿 검색 (예: 점심, 벌칙...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-primary/50 focus:ring-1 focus:ring-neon-primary/50 transition-all"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
                                    ${selectedCategory === cat
                                        ? 'bg-neon-primary/20 border-neon-primary text-neon-primary shadow-neon-sm'
                                        : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/30'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                    {filteredTemplates.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredTemplates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelect(template)}
                                    className="group relative flex flex-col items-center p-5 gap-3 bg-neon-card border border-white/5 rounded-2xl hover:border-neon-primary/50 hover:bg-neon-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-md text-center"
                                >
                                    <div className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                                        {template.icon}
                                    </div>
                                    <div className="w-full">
                                        <h3 className="font-bold text-gray-200 group-hover:text-neon-primary transition-colors text-sm md:text-base break-keep">
                                            {template.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {template.items.length}개 항목
                                        </p>
                                    </div>
                                    {/* Preview on hover (Desktop only) */}
                                    <div className="absolute inset-0 bg-black/90 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex flex-col items-center justify-center text-left">
                                        <p className="text-xs text-neon-primary font-bold mb-2 w-full">미리보기</p>
                                        <div className="w-full h-full overflow-hidden text-xs text-gray-300 space-y-1">
                                            {template.items.slice(0, 5).map((item, idx) => (
                                                <div key={idx} className="truncate">• {item}</div>
                                            ))}
                                            {template.items.length > 5 && <div className="text-gray-500 text-[10px]">+ {template.items.length - 5} 더보기</div>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                            <Search size={40} className="mb-4 opacity-20" />
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
