import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useStatePersistence } from '@/hooks/use-state-persistence';
import { useModalDialog } from '@/hooks/use-modal-dialog';
import { useRoulette } from '@/hooks/use-roulette';
import RouletteWheel from '@/components/RouletteWheel';
import SEOArticle from '@/components/SEOArticle';
import SEO from '@/components/SEO';
import { TEMPLATES } from '@/data/templates';
import { getPresetIdForSlug } from '@/data/spinflow-presets';
import { trackEvent, buildToolEnvelope } from '@/utils/analytics';
import { areItemsEqual, REDUCED_MOTION_SPIN_DURATION_MS, SPIN_DURATION_MS, type DrawSnapshot } from '@/utils/draw-controller';
import { processAndValidateItems } from '@/utils/validation';
import { buildShareUrl } from '@/utils/url-state';
import { copyText } from '@/utils/share';
import { readStoredJson } from '@/utils/roulette-storage';
import { availableCandidates, candidateLabel, finishBatch, makeHomeRecord, parseHomeRecords, recordText, ticketText, ticketTime, MAX_HOME_RECORDS, type HomeCandidate, type HomeTicket } from '@/utils/home-draw';

const DEFAULT_ITEMS = ['한식', '중식', '일식', '양식', '분식', '치킨', '피자', '햄버거'];
const LUNCH_ITEMS = ['한식', '중식', '일식', '양식', '분식', '치킨', '피자'];
const HOME_RECORDS_KEY = 'spinflow:drawRecords:v1';

interface HomeProps {
  initialItems?: string[];
  title?: string;
  description?: string;
  keywords?: string;
  ArticleComponent?: ComponentType;
  structuredData?: Record<string, unknown>;
  preferInitialOnFirstLoad?: boolean;
  disableDeepLinkPresetSync?: boolean;
  heading?: string;
  intro?: string;
}

const surface = 'rounded-2xl border border-[#D5D5C9] bg-[#FFFEF8]';
const secondaryButton = 'min-h-11 rounded-[10px] border border-[#7A8175] bg-[#FFFEF8] px-4 py-2 font-semibold text-[#232623] hover:bg-[#EDEFE2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6A63] disabled:opacity-50';
const primaryButton = 'desk-primary min-h-[52px] rounded-[10px] bg-[#C44524] px-6 py-3 font-bold text-white hover:bg-[#A7351C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F6A63] disabled:opacity-50';

function getWheelSize() {
  if (typeof window === 'undefined') return 300;
  return Math.max(200, Math.min(440, window.innerWidth - 64));
}

export default function Home({
  initialItems = DEFAULT_ITEMS,
  title = '온라인 룰렛 돌리기 | 무료 원판돌리기·스핀 추첨',
  description = '점심 메뉴, 당첨자, 벌칙을 바로 정하는 무료 온라인 룰렛입니다. 설치 없이 모바일·PC에서 후보와 결과를 확인하며 스핀 돌리기를 시작하세요.',
  keywords = '온라인 룰렛, 무료 룰렛, 스핀 돌리기, 룰렛돌리기, 원판돌리기, 룰렛게임, 랜덤추첨기, 점심메뉴추천, 벌칙정하기, 당첨자추첨, SpinFlow',
  ArticleComponent = SEOArticle,
  structuredData,
  preferInitialOnFirstLoad = false,
  disableDeepLinkPresetSync = false,
  heading = '온라인 룰렛 돌리기',
  intro = '이름을 넣고, 우리의 다음 순서를 정해요.',
}: HomeProps) {
  const { items, updateItems, saveResult, urlWarning, urlUnsafe, restoreNotice, dismissRestoreNotice } = useStatePersistence(initialItems, { preferInitialOnFirstLoad });
  const [wheelSize, setWheelSize] = useState(getWheelSize);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [drawCount, setDrawCount] = useState(1);
  const [autoExclude, setAutoExclude] = useState(false);
  const [ticket, setTicket] = useState<HomeTicket | null>(null);
  const [records, setRecords] = useState(() => parseHomeRecords(readStoredJson(() => localStorage.getItem(HOME_RECORDS_KEY))));
  const [recordsPersistent, setRecordsPersistent] = useState(true);
  const [round, setRound] = useState(() => Math.max(0, ...records.map((record) => record.round)));
  const [editorOpen, setEditorOpen] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [draft, setDraft] = useState(items.join('\n'));
  const [editorError, setEditorError] = useState('');
  const [wheelItems, setWheelItems] = useState(items);
  const [wheelKey, setWheelKey] = useState(0);
  const pendingRef = useRef<{ candidates: HomeCandidate[]; roster: string[]; count: number; autoExclude: boolean; round: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const presentationOpenerRef = useRef<HTMLElement | null>(null);
  const lastAppliedSlugRef = useRef<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion() ?? false;
  const spinDurationMs = reducedMotion ? REDUCED_MOTION_SPIN_DURATION_MS : SPIN_DURATION_MS;
  const candidates = availableCandidates(items, excluded);
  const candidateNames = candidates.map((candidate) => candidate.name);
  const fullTeamRoster = items.map((name, id) => candidateLabel({ name, id }, items));

  useEffect(() => {
    try { localStorage.setItem(HOME_RECORDS_KEY, JSON.stringify({ v: 1, records })); setRecordsPersistent(true); }
    catch { setRecordsPersistent(false); }
  }, [records]);

  useEffect(() => {
    const resize = () => setWheelSize(getWheelSize());
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const closeEditor = useCallback(() => setEditorOpen(false), []);
  useModalDialog(editorOpen, closeEditor, editorRef, textareaRef);
  const exitPresentation = useCallback(() => {
    setPresentation(false);
    requestAnimationFrame(() => presentationOpenerRef.current?.focus());
  }, []);
  useModalDialog(presentation, exitPresentation, sectionRef);

  useEffect(() => {
    if (!editorOpen) setDraft(items.join('\n'));
  }, [items, editorOpen]);

  const handleResult = useCallback((_result: string, draw: DrawSnapshot) => {
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) { toast.error('추첨 기록을 확인할 수 없습니다. 명단을 확인하고 다시 시도해 주세요.'); return; }
    const winners = finishBatch(pending.candidates, draw.index, pending.count);
    const completed: HomeTicket = Object.freeze({
      round: pending.round,
      winners: Object.freeze(winners),
      candidateCount: pending.candidates.length,
      requestedCount: pending.count,
      autoExcluded: pending.autoExclude,
      completedAt: new Date().toISOString(),
    });
    setTicket(completed);
    setRound(pending.round);
    const remainingAtCompletion = pending.candidates.length - (pending.autoExclude ? winners.length : 0);
    setRecords((previous) => [makeHomeRecord(completed, pending.roster, remainingAtCompletion), ...previous].slice(0, MAX_HOME_RECORDS));
    saveResult(winners.map((winner) => candidateLabel(winner, pending.roster)).join(', '));
    if (pending.autoExclude) {
      setExcluded((previous) => new Set([...previous, ...winners.map((winner) => winner.id)]));
    }
    trackEvent('tool_result_viewed', {
      ...buildToolEnvelope(window.location.pathname, 'roulette'),
      tool: 'roulette', result_type: 'roulette_pick', item_count: draw.items.length,
    });
  }, [saveResult]);

  const { isSpinning, winningIndex, spin, reset } = useRoulette({ items: candidateNames, onResult: handleResult, spinDurationMs });

  const startDraw = useCallback(() => {
    if (isSpinning || candidates.length === 0 || drawCount > candidates.length) return;
    // Keep the displayed wheel and the draw controller on the same candidate snapshot.
    const snapshot = candidates.map((candidate) => ({ ...candidate }));
    const draw = spin();
    if (!draw) return;
    if (!areItemsEqual(wheelItems, candidateNames)) {
      setWheelItems(candidateNames);
      setWheelKey((key) => key + 1);
    }
    pendingRef.current = { candidates: snapshot, roster: [...items], count: drawCount, autoExclude, round: round + 1 };
    setTicket(null);
    trackEvent('tool_used', { ...buildToolEnvelope(window.location.pathname, 'roulette'), tool: 'roulette', item_count: draw.items.length });
  }, [isSpinning, candidates, candidateNames, wheelItems, items, drawCount, autoExclude, round, spin]);

  // Preserve the completed wheel until the next draw, even after auto exclusion.
  useEffect(() => {
    if (isSpinning || ticket) return;
    if (!areItemsEqual(wheelItems, candidateNames)) {
      reset();
      setWheelItems(candidateNames);
      setWheelKey((key) => key + 1);
    }
  }, [candidateNames, isSpinning, reset, ticket, wheelItems]);

  const handleUpdateItems = useCallback((next: string[]) => {
    if (isSpinning) return false;
    if (areItemsEqual(items, next)) return true;
    updateItems(next);
    setExcluded(new Set());
    setTicket(null);
    setDrawCount(1);
    reset();
    return true;
  }, [isSpinning, items, updateItems, reset]);

  const saveEditor = () => {
    const parsed = processAndValidateItems(draft);
    if (!parsed || parsed.errors.length > 0) {
      setEditorError(parsed?.errors.join(' ') ?? '명단을 확인해 주세요.');
      textareaRef.current?.focus();
      return;
    }
    if (!handleUpdateItems(parsed.items)) {
      setEditorError('룰렛이 회전 중입니다. 끝난 뒤 다시 저장해 주세요.');
      return;
    }
    setEditorError('');
    setEditorOpen(false);
  };

  const applyLunch = () => {
    if (!areItemsEqual(items, LUNCH_ITEMS) && !window.confirm('현재 명단을 점심 메뉴 예시로 교체할까요?')) return;
    handleUpdateItems(LUNCH_ITEMS);
    sectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  useEffect(() => {
    if (disableDeepLinkPresetSync) return;
    const [, segment, slug] = location.pathname.split('/');
    if (segment !== 'spinflow' || !slug) {
      lastAppliedSlugRef.current = null;
      return;
    }
    if (lastAppliedSlugRef.current === slug) return;
    const presetId = getPresetIdForSlug(slug);
    const presetItems = presetId && TEMPLATES.find((template) => template.id === presetId)?.items;
    if (presetItems && handleUpdateItems(presetItems)) {
      lastAppliedSlugRef.current = slug;
      navigate({ pathname: '/spinflow', search: window.location.search }, { replace: true });
    }
  }, [location.pathname, disableDeepLinkPresetSync, handleUpdateItems, navigate]);

  const copyTicket = async () => {
    if (!ticket) return;
    if (await copyText(ticketText(ticket, items))) toast.success('결과와 추첨 조건을 복사했습니다.');
    else toast.error('복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.');
  };

  const copyCandidateLink = async () => {
    const share = buildShareUrl(items, window.location.href);
    if (share.unsafe) return;
    if (await copyText(share.url)) toast.success('후보 목록 링크를 복사했습니다. 결과는 포함되지 않습니다.');
    else toast.error('링크를 복사하지 못했습니다.');
  };

  const resultCard = (
    ticket && <section className={`${surface} order-2 border-dashed p-5 lg:order-3 lg:col-span-2`} aria-label="현재 추첨 결과" aria-live="polite">
              <span className="inline-block rounded-md bg-[#D9E9A5] px-2 py-1 text-xs font-bold tracking-widest text-[#232623]">03 · {ticket.round}회차 결과</span>
              <h2 className={`mt-3 font-extrabold ${presentation ? 'text-4xl md:text-6xl' : 'text-2xl md:text-3xl'}`}>선택된 {ticket.winners.length}명</h2>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="당첨자 목록">{ticket.winners.map((winner, index) => <li key={winner.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#D5D5C9] bg-[#F6F3EA] p-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9E9A5] font-bold tabular-nums" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="break-all font-serif text-xl font-bold md:text-2xl">{candidateLabel(winner, items)}</span></li>)}</ol>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><div><dt className="text-[#62685F]">시작 후보</dt><dd className="font-bold">{ticket.candidateCount}개</dd></div><div><dt className="text-[#62685F]">완료 직후 남은 후보</dt><dd className="font-bold">{ticket.candidateCount - (ticket.autoExcluded ? ticket.winners.length : 0)}개</dd></div><div><dt className="text-[#62685F]">추첨 수</dt><dd className="font-bold">{ticket.requestedCount}명 · 묶음 내 중복 없음</dd></div><div><dt className="text-[#62685F]">추첨 후 자동 제외</dt><dd className="font-bold">{ticket.autoExcluded ? '적용' : '미적용'}</dd></div></dl>
              <p className="mt-3 text-sm text-[#62685F]">완료 {ticketTime(ticket.completedAt)}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-[#D5D5C9] pt-4"><button type="button" className={secondaryButton} onClick={copyTicket}>결과와 조건 복사</button><button type="button" className={primaryButton} disabled={isSpinning || candidates.length === 0 || drawCount > candidates.length} onClick={startDraw}>다음 추첨</button>{excluded.size > 0 && <button type="button" className={secondaryButton} disabled={isSpinning} onClick={() => setExcluded(new Set())}>제외한 후보 복귀</button>}</div>
            </section>
  );

  return (
    <div className="home-desk min-h-[100dvh] bg-[#F6F3EA] text-[#232623]">
      <SEO title={title} description={description} keywords={keywords} structuredData={structuredData} />
      <header className="mx-auto max-w-[1200px] px-4 pb-6 pt-8 md:px-6 md:pt-12">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[#62685F]">SPINFLOW · 결정 데스크</p>
        <h1 className="text-[30px] font-extrabold leading-[1.3] md:text-[40px] md:leading-[1.25]">{heading}</h1>
        <p className="mt-3 text-base leading-relaxed text-[#62685F]">{intro}</p>
      </header>

      {restoreNotice === 'invalid-share-link' && <div className="mx-auto mb-4 max-w-[1200px] px-4 md:px-6" role="alert"><div className="flex items-start justify-between gap-4 rounded-xl border border-[#B42318] bg-white p-4"><p>공유 링크의 후보를 읽지 못해 기본 후보를 표시합니다. 최대 100개, 항목당 50자까지 입력할 수 있습니다.</p><button type="button" onClick={dismissRestoreNotice} className={secondaryButton}>닫기</button></div></div>}

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1200px] px-4 pb-16 md:px-6">
        <section ref={sectionRef} role={presentation ? 'dialog' : undefined} aria-modal={presentation ? true : undefined} tabIndex={presentation ? -1 : undefined} className={`home-workspace ${presentation ? 'fixed inset-0 z-[60] overflow-auto bg-[#F6F3EA] p-4 md:p-8' : ''}`} aria-label={presentation ? '룰렛 발표 모드' : '룰렛 작업 공간'}>
          {presentation && <div className="mx-auto mb-4 flex max-w-[1200px] items-center justify-between gap-3"><strong>SpinFlow 스핀코리아 · 결과 발표</strong><button type="button" className={secondaryButton} onClick={exitPresentation}>발표 종료</button></div>}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.38fr)_minmax(320px,1fr)]">
            {presentation && resultCard}
            <div className={`${surface} order-1 p-4 md:p-6`}>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D5D5C9] pb-4">
                <div><span className="text-xs font-bold tracking-widest text-[#62685F]">01 · 현재 명단</span><h2 className="mt-1 text-xl font-bold">이번 명단 · {items.length}개</h2><p className="text-sm text-[#62685F]">추첨 가능 {candidates.length}개 · 제외 {excluded.size}개</p></div>
                <div className="flex gap-2"><button type="button" className={`${secondaryButton} ${presentation ? 'hidden' : 'lg:hidden'}`} disabled={isSpinning} onClick={() => setEditorOpen(true)}>명단 수정</button><button type="button" className={`${secondaryButton} ${presentation ? 'hidden' : ''}`} onClick={(event) => { if (presentation) exitPresentation(); else { presentationOpenerRef.current = event.currentTarget; setPresentation(true); } }}>{presentation ? '발표 종료' : '발표 모드'}</button></div>
              </div>
              <div className="flex justify-center py-5"><div className="max-w-full overflow-hidden rounded-full bg-white"><RouletteWheel key={wheelKey} items={wheelItems} winningIndex={winningIndex} isSpinning={isSpinning} size={wheelSize} onSpin={startDraw} spinDurationMs={spinDurationMs} reducedMotion={reducedMotion} /></div></div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><button type="button" className={primaryButton} disabled={isSpinning || candidates.length === 0 || drawCount > candidates.length} onClick={startDraw}>{isSpinning ? '추첨 중…' : `${drawCount}명 추첨하기`}</button><span className="self-center text-sm text-[#62685F]">{candidates.length === 0 ? '후보가 없습니다. 제외한 후보를 복귀하거나 명단을 수정하세요.' : `현재 후보 ${candidates.length}개`}</span></div>
              <div className="mt-4 grid gap-3 border-t border-[#D5D5C9] pt-4 lg:hidden"><label htmlFor="home-count-mobile" className="text-sm font-semibold">한 번에 뽑을 수 <input id="home-count-mobile" type="number" min={1} max={Math.max(1, candidates.length)} value={drawCount} onChange={(event) => setDrawCount(Math.max(1, Math.min(100, Math.trunc(Number(event.target.value)) || 1)))} disabled={isSpinning} className="ml-2 w-20 rounded-[10px] border border-[#7A8175] bg-white p-2 text-base" /></label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={autoExclude} onChange={(event) => setAutoExclude(event.target.checked)} disabled={isSpinning} className="h-5 w-5 accent-[#1F6A63]" /> 추첨 후 자동 제외</label>{drawCount > candidates.length && <p role="status" className="text-sm text-[#B42318]">남은 후보가 {candidates.length}개입니다. 추첨 수를 줄이거나 후보를 복귀하세요.</p>}</div>
              <details className="mt-4 text-sm text-[#62685F]"><summary className="cursor-pointer font-semibold">현재 후보 전체 보기</summary><ol className="mt-2 grid list-decimal gap-1 pl-6 sm:grid-cols-2">{candidates.map((candidate) => <li key={candidate.id} className="break-words">{candidateLabel(candidate, items)}</li>)}</ol></details>
            </div>

            <div className={`${surface} order-3 p-4 md:p-6 lg:order-2 ${presentation ? 'hidden' : ''}`}>
              <span className="text-xs font-bold tracking-widest text-[#62685F]">02 · 명단과 조건</span>
              <h2 className="mt-1 text-xl font-bold">추첨 설정</h2>
              <label htmlFor="home-editor" className="mt-5 block text-sm font-semibold">후보 명단 · 한 줄에 하나</label>
              <textarea id="home-editor" rows={9} value={draft} onChange={(event) => { setDraft(event.target.value); setEditorError(''); }} disabled={isSpinning} className="mt-2 hidden w-full resize-y rounded-[10px] border border-[#7A8175] bg-white p-3 text-base leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F6A63] disabled:opacity-50 lg:block" />
              <div className="mt-3 hidden lg:flex"><button type="button" className={secondaryButton} disabled={isSpinning} onClick={saveEditor}>명단 저장</button></div>
              <button type="button" className={`${secondaryButton} mt-2 lg:hidden`} disabled={isSpinning} onClick={() => setEditorOpen(true)}>명단 편집 열기</button>
              {editorError && <p className="mt-2 text-sm text-[#B42318]" role="alert">{editorError}</p>}
              <p className="mt-2 text-sm text-[#62685F]">최대 100개, 항목당 50자. 같은 이름도 각각 한 후보로 유지합니다.</p>
              <div className="mt-6 border-t border-[#D5D5C9] pt-5"><label htmlFor="home-count" className="block text-sm font-semibold">한 번에 뽑을 수</label><input id="home-count" type="number" min={1} max={Math.max(1, candidates.length)} value={drawCount} onChange={(event) => setDrawCount(Math.max(1, Math.min(100, Math.trunc(Number(event.target.value)) || 1)))} disabled={isSpinning} className="mt-2 w-28 rounded-[10px] border border-[#7A8175] bg-white p-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F6A63]" /><p className="mt-2 text-sm text-[#62685F]">한 묶음 안에서는 같은 후보를 두 번 뽑지 않습니다.</p>{drawCount > candidates.length && <p role="status" className="mt-2 text-sm text-[#B42318]">남은 후보가 {candidates.length}개입니다. 추첨 수를 줄이거나 제외한 후보를 복귀하세요.</p>}</div>
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#D5D5C9] p-3"><input type="checkbox" checked={autoExclude} onChange={(event) => setAutoExclude(event.target.checked)} disabled={isSpinning} className="mt-1 h-5 w-5 accent-[#1F6A63]" /><span><strong className="block">추첨 후 자동 제외</strong><span className="text-sm text-[#62685F]">다음 추첨의 후보에서 이번 당첨자를 제외합니다. 원본 명단은 유지됩니다.</span></span></label>
              {excluded.size > 0 && <button type="button" className={`${secondaryButton} mt-4`} disabled={isSpinning} onClick={() => setExcluded(new Set())}>제외한 후보 {excluded.size}개 복귀</button>}
              {urlWarning && <p className="mt-4 text-sm text-[#B42318]">후보 링크가 길어 공유 시 일부 앱에서 열리지 않을 수 있습니다.</p>}
              {urlUnsafe && <p className="mt-2 text-sm text-[#B42318]">후보 링크가 너무 길어 공유를 권장하지 않습니다.</p>}
              <button type="button" className={`${secondaryButton} mt-5 w-full`} disabled={urlUnsafe} onClick={copyCandidateLink}>후보 목록 링크 복사</button>
              <p className="mt-2 text-xs text-[#62685F]">링크에는 원본 후보 목록만 담깁니다. 결과나 제외 상태는 포함되지 않으며, 링크를 받은 사람이 후보를 볼 수 있습니다.</p>
              <div className="mt-4 flex flex-wrap gap-2" aria-label="팀 편성에서 명단 사용"><Link to="/tools/random-team" state={{ spinflowRoster: { source: 'full', items: items.map((name, id) => candidateLabel({ name, id }, items)) } }} className={secondaryButton}>전체 명단으로 팀 나누기</Link>{candidates.length > 0 && <Link to="/tools/random-team" state={{ spinflowRoster: { source: 'remaining', items: candidates.map((candidate) => candidateLabel(candidate, items)) } }} className={secondaryButton}>남은 후보로 팀 나누기</Link>}</div>
            </div>

            {!presentation && resultCard}
          </div>
        </section>

        {!presentation && <><section className="mt-12" aria-labelledby="activity-heading"><span className="text-xs font-bold tracking-widest text-[#62685F]">상황별 설정</span><h2 id="activity-heading" className="mt-1 text-2xl font-bold">무엇을 정할까요?</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><button type="button" className={`${surface} p-4 text-left hover:border-[#1F6A63]`} onClick={() => { setDrawCount(1); setAutoExclude(true); sectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}><strong>발표자 뽑기</strong><span className="mt-2 block text-sm text-[#62685F]">1명 추첨 · 이후 자동 제외 켜기</span></button><button type="button" className={`${surface} p-4 text-left hover:border-[#1F6A63]`} onClick={() => { setDrawCount(Math.min(3, Math.max(1, candidates.length))); setAutoExclude(false); sectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }}><strong>경품 추첨</strong><span className="mt-2 block text-sm text-[#62685F]">최대 3명 · 묶음 내 중복 없이</span></button><button type="button" className={`${surface} p-4 text-left hover:border-[#1F6A63]`} onClick={applyLunch}><strong>점심 정하기</strong><span className="mt-2 block text-sm text-[#62685F]">동의 후 메뉴 예시로 명단 교체</span></button><Link className={`${surface} p-4 hover:border-[#1F6A63]`} to="/tools/random-team" state={{ spinflowRoster: { source: 'full', items: fullTeamRoster } }}><strong>모둠 나누기</strong><span className="mt-2 block text-sm text-[#62685F]">현재 전체 명단으로 이동 · 팀 수 선택</span></Link></div></section><section className="mt-12 grid gap-6 border-t border-[#D5D5C9] pt-8 md:grid-cols-2"><div><h2 className="text-2xl font-bold">처음이라면</h2><ol className="mt-4 space-y-2 leading-relaxed"><li>01 · 명단을 확인하고 필요하면 수정합니다.</li><li>02 · 한 번에 뽑을 수와 자동 제외를 선택합니다.</li><li>03 · 추첨 후 결과와 적용 조건을 함께 복사합니다.</li></ol></div><div><h2 className="text-2xl font-bold">함께 쓸 도구와 안내</h2><div className="mt-4 flex flex-wrap gap-2"><Link to="/tools/random-team" className={secondaryButton}>랜덤 팀 편성</Link><Link to="/tools" className={secondaryButton}>도구 모음</Link><Link to="/blog" className={secondaryButton}>사용 가이드</Link></div></div></section><ArticleComponent /></>}
      </main>
      {!presentation && !recordsPersistent && <p role="status" className="mx-auto mb-3 max-w-[1200px] px-4 text-sm text-[#B42318]">기록 저장에 실패했습니다. 현재 기록은 새로고침하면 사라질 수 있으니 결과를 복사해 주세요.</p>}
      {!presentation && records.length > 0 && <details className={`${surface} mx-auto mb-12 max-w-[1200px] p-4`}>
        <summary className="cursor-pointer text-lg font-bold">이전 추첨 기록 · {records.length}회차 보관</summary>
        <p className="mt-2 text-sm text-[#62685F]">{recordsPersistent ? `이 브라우저에 최근 ${MAX_HOME_RECORDS}회차까지 보관합니다. 명단을 바꿔도 당시 조건과 결과는 유지됩니다.` : '브라우저 저장을 사용할 수 없어 현재 화면에서만 기록을 보관합니다. 새로고침 전에 결과를 복사해 주세요.'}</p>
        <ol className="mt-4 space-y-3">
          {records.map((record) => <li key={`${record.round}-${record.completedAt}`} className="rounded-xl border border-[#D5D5C9] p-4">
            <p className="font-bold">{record.round}회차 · {record.winners.map((winner) => candidateLabel(winner, record.roster)).join(' · ')}</p>
            <p className="mt-1 text-sm text-[#62685F]">시작 후보 {record.candidateCount}개 · {record.requestedCount}명 · 묶음 내 중복 없음 · 자동 제외 {record.autoExcluded ? '적용' : '미적용'} · 완료 직후 남은 후보 {record.remainingAtCompletion}개</p>
            <p className="text-sm text-[#62685F]">{ticketTime(record.completedAt)}</p>
            <button type="button" className={`${secondaryButton} mt-3`} onClick={async () => { if (await copyText(recordText(record))) toast.success('기록의 결과와 조건을 복사했습니다.'); else toast.error('기록을 복사하지 못했습니다.'); }}>이 회차 복사</button>
          </li>)}
        </ol>
        <button type="button" className={`${secondaryButton} mt-4`} disabled={isSpinning} onClick={() => setRecords([])}>이 브라우저의 추첨 기록 삭제</button>
      </details>}

      {editorOpen && <div ref={editorRef} role="dialog" aria-modal="true" aria-labelledby="home-editor-title" tabIndex={-1} className="fixed inset-0 z-[70] flex flex-col bg-[#F6F3EA] p-4 text-[#232623]"><div className="mx-auto flex w-full max-w-2xl items-center justify-between border-b border-[#D5D5C9] pb-3"><h2 id="home-editor-title" className="text-xl font-bold">명단 수정</h2><button type="button" className={secondaryButton} onClick={closeEditor}>닫기</button></div><div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col py-4"><label htmlFor="home-mobile-list" className="mb-2 font-semibold">한 줄에 한 후보</label><textarea ref={textareaRef} id="home-mobile-list" value={draft} onChange={(event) => { setDraft(event.target.value); setEditorError(''); }} className="min-h-40 w-full flex-1 resize-none rounded-[10px] border border-[#7A8175] bg-white p-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F6A63]" aria-invalid={Boolean(editorError)} aria-describedby="home-mobile-hint" /><p id="home-mobile-hint" className="mt-2 text-sm text-[#62685F]">최대 100개, 항목당 50자. 빈 줄은 무시합니다.</p>{editorError && <p role="alert" className="mt-2 text-sm text-[#B42318]">{editorError}</p>}</div><div className="mx-auto flex w-full max-w-2xl gap-2 border-t border-[#D5D5C9] pt-3"><button type="button" className={secondaryButton} onClick={closeEditor}>취소</button><button type="button" className={`${primaryButton} flex-1`} onClick={saveEditor}>명단 저장</button></div></div>}
      <Toaster position={presentation ? 'bottom-center' : 'top-center'} richColors />
    </div>
  );
}
