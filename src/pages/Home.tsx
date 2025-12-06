import { useState, useCallback, useRef, useEffect, type ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

import RecommendedPresets from '@/components/RecommendedPresets';
import { TEMPLATES } from '@/data/templates';

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
    preferInitialOnFirstLoad?: boolean;
    /**
     * 프리셋 딥링크(/spinflow/lunch 등)를 감지하여 자동으로 적용/루트로 되돌리는 동작을 끌지 여부.
     * 새로운 전용 페이지에서 라우터 변경 없이만 동작시키고 싶을 때 true로 설정.
     */
    disableDeepLinkPresetSync?: boolean;
}

export default function Home({
    initialItems = DEFAULT_ITEMS,
    title = "SpinFlow - 온라인 룰렛 돌리기 | 원판돌리기 | 랜덤 추첨기",
    description = "무료 온라인 룰렛 돌리기 SpinFlow. 점심 메뉴 추천, 벌칙 정하기, 당첨자 추첨, 순서 정하기 등 다양한 결정을 쉽고 공정하게! 설치 없이 바로 사용하는 원판돌리기 게임.",
    keywords = "룰렛, 룰렛돌리기, 원판돌리기, 룰렛게임, 랜덤추첨기, 제비뽑기, 사다리타기, 점심메뉴추천, 벌칙정하기, 당첨자추첨, SpinFlow, 스핀플로우, 온라인룰렛, 모바일룰렛",
    ArticleComponent = SEOArticle,
    structuredData,
    preferInitialOnFirstLoad = false,
    disableDeepLinkPresetSync = false,
}: HomeProps) {
    const {
        items,
        updateItems,
        saveResult,
        lastResult,
        urlWarning,
        urlUnsafe,
    } = useStatePersistence(initialItems, { preferInitialOnFirstLoad });

    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const rouletteSectionRef = useRef<HTMLDivElement>(null);
    const lastAppliedSlugRef = useRef<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

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

    const applyPreset = useCallback(
        (presetItems: string[]) => {
            handleUpdateItems(presetItems);
            rouletteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        [handleUpdateItems]
    );

    // Intercept deep links like /spinflow/lunch or /spinflow/lotto and apply presets in-place without leaving /spinflow
    useEffect(() => {
        if (disableDeepLinkPresetSync) {
            return;
        }

        const path = location.pathname.replace(/^\//, '');
        const segments = path.split('/'); // e.g., ["spinflow", "lunch"]
        const slug = segments[0] === 'spinflow' ? segments[1] : undefined;

        if (!slug) {
            lastAppliedSlugRef.current = null;
            return;
        }

        if (lastAppliedSlugRef.current === slug) {
            return;
        }

        const presetIdMap: Record<string, string> = {
            lunch: 'lunch-korean',
            'truth-or-dare': 'truth-dare',
            lotto: 'lotto',
        };

        const presetId = presetIdMap[slug];
        const presetItems =
            presetId && TEMPLATES.find((t) => t.id === presetId)?.items;

        if (presetItems && presetItems.length > 0) {
            handleUpdateItems(presetItems);
            lastAppliedSlugRef.current = slug;
            // Replace URL back to /spinflow to avoid further navigations / bookmarking deep slug
            navigate('/spinflow', { replace: true });
            rouletteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [location.pathname, handleUpdateItems, navigate]);

    return (
        <div className="min-h-[100dvh] bg-neon-bg flex flex-col">
            <SEO title={title} description={description} keywords={keywords} structuredData={structuredData} />
            {/* Header / Hero Section */}
            <header className="w-full relative overflow-hidden flex flex-col items-center justify-center pt-20 pb-12 px-4">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-aurora-primary/20 rounded-full blur-[120px] animate-float-slow" />
                    <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] bg-aurora-purple/20 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-aurora-accent/10 rounded-full blur-[100px] animate-pulse-soft" />
                </div>

                <div className="animate-slide-up flex flex-col items-center text-center z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in hover:bg-white/10 transition-colors cursor-default group">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora-secondary"></span>
                        </span>
                        <span className="text-gray-300 text-sm font-medium tracking-wide group-hover:text-white transition-colors">Trendy Decision Maker</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none text-white drop-shadow-2xl">
                        <span className="bg-gradient-to-r from-aurora-primary via-aurora-secondary to-aurora-accent bg-clip-text text-transparent hover:opacity-90 transition-opacity cursor-default animate-shimmer bg-[length:200%_auto]">Spin</span>
                        <span className="text-white">Flow</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-medium">
                        결정이 망설여질 때, <br className="md:hidden" />
                        <span className="text-aurora-secondary font-bold">SpinFlow</span>가 답을 드립니다.
                    </p>
                </div>
            </header>

            {lastResult && (
                <div className="max-w-xl mx-auto w-full px-4 mb-8 text-center animate-pop z-20">
                    <LastResultBanner result={lastResult} />
                </div>
            )}

            <RecommendedPresets onSelect={applyPreset} fallbackItems={initialItems} />

            {/* 메인 콘텐츠 */}
            <main
                ref={rouletteSectionRef}
                className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 px-4 py-10 pb-32 max-w-7xl mx-auto w-full"
            >
                {/* 모바일: 룰렛 중앙, 데스크톱: 룰렛 좌측 */}
                <div className="flex-shrink-0">
                    <RouletteWheel
                        items={items}
                        winningIndex={winningIndex}
                        isSpinning={isSpinning}
                        size={typeof window !== 'undefined'
                            ? (window.innerWidth >= 768
                                ? 520 // PC size
                                : Math.min(340, window.innerWidth - 48)) // Mobile size
                            : 320
                        }
                        onSpin={handleSpin}
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
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsEditorModalOpen(true)}
                            className="btn-secondary w-full backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 group"
                        >
                            <span className="group-hover:scale-110 transition-transform">✏️</span> 항목 수정
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl text-white font-bold hover:border-aurora-primary/50 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 shadow-lg shadow-black/20"
                        >
                            <LayoutGrid size={20} className="text-aurora-secondary" />
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



            {/* SEO Article 섹션 */}
            <ArticleComponent />
            <Toaster position="top-center" richColors />
        </div>
    );
}
