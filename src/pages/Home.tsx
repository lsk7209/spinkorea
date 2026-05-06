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
import { trackEvent } from '@/utils/analytics';

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
    structuredData?: Record<string, unknown>;
    preferInitialOnFirstLoad?: boolean;
    /**
     * 프리셋 딥링크(/spinflow/lunch 등)를 감지하여 자동으로 적용/루트로 되돌리는 동작을 끌지 여부.
     * 새로운 전용 페이지에서 라우터 변경 없이만 동작시키고 싶을 때 true로 설정.
     */
    disableDeepLinkPresetSync?: boolean;
}

export default function Home({
    initialItems = DEFAULT_ITEMS,
    title = "온라인 룰렛 돌리기 | 무료 원판돌리기·스핀 추첨",
    description = "점심 메뉴, 당첨자, 벌칙을 바로 정하는 무료 온라인 룰렛입니다. 설치 없이 모바일·PC에서 공정하게 스핀 돌리기를 시작하세요.",
    keywords = "온라인 룰렛, 무료 룰렛, 스핀 돌리기, 룰렛돌리기, 원판돌리기, 룰렛게임, 랜덤추첨기, 점심메뉴추천, 벌칙정하기, 당첨자추첨, SpinFlow",
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
        trackEvent('tool_used', {
            tool: 'roulette',
            item_count: items.length,
        });
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
        <div className="min-h-[100dvh] bg-slate-50 text-slate-950 flex flex-col">
            <SEO title={title} description={description} keywords={keywords} structuredData={structuredData} />
            {/* Header / Hero Section */}
            <header className="w-full relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-10 px-4 bg-white border-b border-slate-200">
                <div className="animate-slide-up flex flex-col items-center text-center z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 mb-6 animate-fade-in cursor-default group">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
                        </span>
                        <span className="text-cyan-800 text-sm font-semibold tracking-wide">무료 결정 도구와 웹 유틸리티</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight text-slate-950 [word-break:keep-all]">
                        온라인 룰렛 돌리기
                    </h1>

                    <p className="text-base md:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium [word-break:keep-all]">
                        무료 룰렛으로 점심 메뉴, 당첨자, 벌칙, 순서를 공정하게 정하세요.{" "}
                        <br className="hidden md:block" />
                        SpinFlow는 설치 없이 바로 쓰는 스핀 돌리기와 생활 유틸리티를 제공합니다.
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
                className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 px-4 py-10 pb-20 max-w-7xl mx-auto w-full"
            >
                {/* 모바일: 룰렛 중앙, 데스크톱: 룰렛 좌측 */}
                <div className="flex-shrink-0 rounded-3xl bg-slate-950 p-4 shadow-xl">
                    <RouletteWheel
                        items={items}
                        winningIndex={winningIndex}
                        isSpinning={isSpinning}
                        size={typeof window !== 'undefined'
                            ? (window.innerWidth >= 768
                                ? 620 // PC size (확대)
                                : Math.min(340, window.innerWidth - 48)) // Mobile size
                            : 320
                        }
                        onSpin={handleSpin}
                    />
                </div>

                {/* 데스크톱: 항목 편집 패널 (우측) */}
                <div className="hidden md:block w-full max-w-md">
                    <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-xl">
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
                            className="btn-secondary w-full backdrop-blur-md bg-slate-900 border-slate-700 hover:bg-slate-800 group"
                        >
                            <span className="group-hover:scale-110 transition-transform">✏️</span> 항목 수정
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsTemplateModalOpen(true)}
                            className="bg-slate-900 border border-slate-700 rounded-2xl text-white font-bold hover:border-cyan-500 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 active:scale-95 shadow-lg shadow-black/20"
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
