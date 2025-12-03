import { X } from 'lucide-react';
import { TEMPLATES } from '@/data/templates';
import type { Template } from '@/data/templates';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (items: string[]) => void;
}

export default function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
    if (!isOpen) return null;

    const handleSelect = (template: Template) => {
        onSelect(template.items);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-neon-dark border border-neon-primary/30 rounded-2xl shadow-neon-lg overflow-hidden animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neon-primary/20">
                    <h2 className="text-2xl font-bold text-white">
                        <span className="text-neon-primary">추천</span> 템플릿
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleSelect(template)}
                            className="flex flex-col items-center justify-center p-6 gap-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-neon-primary/50 hover:shadow-neon-sm transition-all duration-300 group"
                        >
                            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                {template.icon}
                            </span>
                            <span className="font-semibold text-gray-200 group-hover:text-neon-primary transition-colors">
                                {template.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {template.items.length}개 항목
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
