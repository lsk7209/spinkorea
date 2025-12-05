import { useState, useCallback, type ComponentType } from 'react';
import { Toaster } from 'sonner';
import { LayoutGrid } from 'lucide-react';
import { useStatePersistence } from '@/hooks/use-state-persistence';
import { useRoulette } from '@/hooks/use-roulette';
import RouletteWheel from '@/components/RouletteWheel';
import SpinButton from '@/components/SpinButton';
import ItemEditor from '@/components/ItemEditor';
import ItemEditorModal from '@/components/ItemEditorModal';
import TemplateModal from '@/components/TemplateModal';
import ResultDisplay from '@/components/ResultDisplay';
import ShareButtons from '@/components/ShareButtons';
import LastResultBanner from '@/components/LastResultBanner';
import SEOArticle from '@/components/SEOArticle';
import SEO from '@/components/SEO';
import MoreTools from '@/components/MoreTools';

const DEFAULT_ITEMS = [
    '한식',
    '중식',
    '일식',
    '양식',
    '분식',
    '치킨',
    '피자',
    '햄버거',
];

interface HomeProps {
    initialItems?: string[];
    title?: string;
    description?: string;
    keywords?: string;
    ArticleComponent?: ComponentType;
    structuredData?: Record<string, any>;
}

export default function Home({
    initialItems = DEFAULT_ITEMS,
    title = "SpinFlow - 온라인 룰렛 돌리기 | 원판돌리기 | 랜덤 추첨기",
    description = "무료 온라인 룰렛 돌리기 SpinFlow. 점심 메뉴 추천, 벌칙 정하기, 당첨자 추첨, 순서 정하기 등 다양한 결정을 쉽고 공정하게! 설치 없이 바로 사용하는 원판돌리기 게임.",
    keywords = "룰렛, 룰렛돌리기, 원판돌리기, 룰렛게임, 랜덤추첨기, 제비뽑기, 사다리타기, 점심메뉴추천, 벌칙정하기, 당첨자추첨, SpinFlow, 스핀플로우, 온라인룰렛, 모바일룰렛",
    ArticleComponent = SEOArticle,
    structuredData
}: HomeProps) {
    const {
        items,
        updateItems,
        saveResult,
        lastResult,
        urlWarning,
        urlUnsafe,
    } = useStatePersistence(initialItems);

    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleResult = useCallback(
        (result: string) => {
            saveResult(result);
            setShowResult(true);
        },
        [saveResult]
    );

    const { isSpinning, result, winningIndex, spin } = useRoulette({
        items,
        onResult: handleResult,
    });

    const handleSpin = useCallback(() => {
        if (items.length === 0) {
            return;
        }
        setShowResult(false);
        spin();
    }, [items.length, spin]);

    const handleUpdateItems = useCallback(
        (newItems: string[]) => {
            updateItems(newItems);
            setShowResult(false);
        },
        [updateItems]
    );

    return (
        <div className="min-h-[100dvh] bg-neon-bg flex flex-col">
            <SEO title={title} description={description} keywords={keywords} structuredData={structuredData} />
            {/* 헤더 */}
            <header className="w-full px-4 py-6 border-b border-neon-border/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">
                            {title}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400">{description}</p>
                    </div>

                    <button
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
                    >
                        <LayoutGrid size={18} />
                        <span className="hidden md:inline">템플릿</span>
                    </button>
                </div>
                {lastResult && (
                    <div className="max-w-7xl mx-auto mt-4">
                        <LastResultBanner result={lastResult} />
                    </div>
                )}
            </header>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-12 pb-40 max-w-7xl mx-auto w-full">
                {/* 모바일: 룰렛 중앙, 데스크톱: 룰렛 좌측 */}
                <div className="flex-shrink-0">
                    <RouletteWheel
                        items={items}
                        winningIndex={winningIndex}
                        isSpinning={isSpinning}
                        size={typeof window !== 'undefined' ? Math.min(300, window.innerWidth - 32) : 300}
                    />
                </div>

                {/* 데스크톱: 항목 편집 패널 (우측) */}
                <div className="hidden md:block w-full max-w-md">
                    <div className="card card-hover p-6">
                        <ItemEditor items={items} onUpdate={handleUpdateItems} />
                        {urlWarning && (
                            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                                <p className="text-sm text-yellow-300">
                                    ⚠️ URL이 길어 공유 시 문제가 발생할 수 있습니다.
                                </p>
                            </div>
                        )}
                        {urlUnsafe && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-sm text-red-300">
                                    ❌ URL이 너무 길어 공유가 비권장됩니다.
                                </p>
                            </div>
                        )}
                        {result && (
                            <div className="mt-6">
                                <ShareButtons
                                    items={items}
                                    result={result}
                                    urlUnsafe={urlUnsafe}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 모바일: 항목 수정 버튼 */}
                <div className="md:hidden w-full max-w-sm">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setIsEditorModalOpen(true)}
                            className="btn-secondary w-full"
                        >
                            항목 수정
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <LayoutGrid size={18} />
                            템플릿
                        </button>
                    </div>
                    {urlWarning && (
                        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                            <p className="text-sm text-yellow-400">
                                ⚠️ URL이 길어 공유 시 문제가 발생할 수 있습니다.
                            </p>
                        </div>
                    )}
                    {urlUnsafe && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                            <p className="text-sm text-red-400">
                                ❌ URL이 너무 길어 공유가 비권장됩니다.
                            </p>
                        </div>
                    )}
                    {result && (
                        <div className="mt-4">
                            <ShareButtons
                                items={items}
                                result={result}
                                urlUnsafe={urlUnsafe}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* SPIN 버튼 (FAB) */}
            <SpinButton
                onClick={handleSpin}
                disabled={items.length === 0}
                isSpinning={isSpinning}
            />

            {/* 결과 표시 */}
            <ResultDisplay result={result} show={showResult} />

            {/* 템플릿 선택 모달 */}
            <TemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelect={handleUpdateItems}
            />

            {/* 항목 편집 모달 (모바일) */}
            <ItemEditorModal
                isOpen={isEditorModalOpen}
                onClose={() => setIsEditorModalOpen(false)}
                items={items}
                onUpdate={handleUpdateItems}
            />

            {/* 더 많은 도구 섹션 */}
            <MoreTools />

            {/* SEO Article 섹션 */}
            <ArticleComponent />
            <Toaster position="top-center" richColors />
        </div>
    );
}
