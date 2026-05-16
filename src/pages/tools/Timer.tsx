import { useState, useEffect, useRef, useCallback } from "react";
import { Timer as TimerIcon, Play, Pause, RotateCcw, Flag, Coffee, Brain } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type TabMode = "countdown" | "stopwatch" | "pomodoro";

// ───────────────────────────────────── helpers
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10); // centiseconds
  return { h, m, s, cs };
}

// ───────────────────────────────────── Countdown
function CountdownTab() {
  const [inputH, setInputH] = useState(0);
  const [inputM, setInputM] = useState(5);
  const [inputS, setInputS] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null); // ms
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);

  const totalInputMs = (inputH * 3600 + inputM * 60 + inputS) * 1000;

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const tick = useCallback(() => {
    const left = endTimeRef.current - Date.now();
    if (left <= 0) {
      clear();
      setRemaining(0);
      setRunning(false);
      setFinished(true);
    } else {
      setRemaining(left);
    }
  }, [clear]);

  const handleStart = () => {
    if (running) {
      // pause
      clear();
      setRunning(false);
    } else {
      if (finished) return;
      const ms = remaining !== null ? remaining : totalInputMs;
      if (ms <= 0) return;
      endTimeRef.current = Date.now() + ms;
      setRemaining(ms);
      setRunning(true);
      intervalRef.current = setInterval(tick, 50);
    }
  };

  const handleReset = () => {
    clear();
    setRunning(false);
    setFinished(false);
    setRemaining(null);
  };

  useEffect(() => {
    if (running) {
      clear();
      intervalRef.current = setInterval(tick, 50);
    }
    return clear;
  }, [tick, running, clear]);

  useEffect(() => () => clear(), [clear]);

  const displayMs = remaining !== null ? remaining : totalInputMs;
  const { h, m, s } = formatMs(displayMs);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Time display */}
      <div
        className={`text-7xl md:text-8xl font-black tabular-nums tracking-tight text-transparent bg-clip-text ${
          finished
            ? "bg-gradient-to-r from-red-400 to-orange-400 animate-pulse"
            : "bg-gradient-to-r from-neon-primary to-neon-secondary"
        }`}
      >
        {pad(h)}:{pad(m)}:{pad(s)}
      </div>

      {finished && (
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-lg animate-pulse">
          <TimerIcon size={20} />
          시간이 종료됐습니다!
        </div>
      )}

      {/* Input row — only editable when stopped & not started */}
      {remaining === null && !running && !finished && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-6 py-4">
          {(
            [
              { label: "시", value: inputH, set: setInputH, max: 23 },
              { label: "분", value: inputM, set: setInputM, max: 59 },
              { label: "초", value: inputS, set: setInputS, max: 59 },
            ] as const
          ).map(({ label, value, set, max }, idx) => (
            <div key={label} className="flex items-center gap-2">
              {idx > 0 && <span className="text-gray-500 text-2xl font-bold">:</span>}
              <div className="flex flex-col items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={max}
                  value={value}
                  onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
                  className="w-16 text-center text-2xl font-bold bg-black/30 border border-white/20 rounded-lg py-2 text-white focus:outline-none focus:border-neon-primary appearance-none"
                />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={finished || totalInputMs === 0}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg bg-neon-primary/20 border border-neon-primary/40 text-neon-primary hover:bg-neon-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {running ? <Pause size={20} /> : <Play size={20} />}
          {running ? "일시정지" : "시작"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
        >
          <RotateCcw size={20} />
          초기화
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────── Stopwatch
function StopwatchTab() {
  const [elapsed, setElapsed] = useState(0); // ms
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const baseElapsedRef = useRef(0);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => () => clear(), [clear]);

  const handleStartPause = () => {
    if (running) {
      clear();
      baseElapsedRef.current = elapsed;
      setRunning(false);
    } else {
      startTimeRef.current = Date.now();
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsed(baseElapsedRef.current + Date.now() - startTimeRef.current);
      }, 50);
    }
  };

  const handleReset = () => {
    clear();
    setRunning(false);
    setElapsed(0);
    baseElapsedRef.current = 0;
    setLaps([]);
  };

  const handleLap = () => {
    if (!running) return;
    setLaps((prev) => (prev.length >= 10 ? [elapsed, ...prev.slice(0, 9)] : [elapsed, ...prev]));
  };

  const { h, m, s, cs } = formatMs(elapsed);

  // per-lap delta
  const lapDeltas = laps.map((l, i) => l - (laps[i + 1] ?? 0));

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Display */}
      <div className="text-7xl md:text-8xl font-black tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-secondary">
        {pad(h)}:{pad(m)}:{pad(s)}
        <span className="text-4xl md:text-5xl">.{pad(cs)}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleStartPause}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg bg-neon-primary/20 border border-neon-primary/40 text-neon-primary hover:bg-neon-primary/30 transition-all"
        >
          {running ? <Pause size={20} /> : <Play size={20} />}
          {running ? "일시정지" : "시작"}
        </button>
        <button
          onClick={handleLap}
          disabled={!running}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Flag size={20} />
          랩
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
        >
          <RotateCcw size={20} />
          초기화
        </button>
      </div>

      {/* Lap list */}
      {laps.length > 0 && (
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 text-xs text-gray-400 font-semibold px-4 py-2 border-b border-white/10">
            <span>랩</span>
            <span className="text-center">랩 타임</span>
            <span className="text-right">경과</span>
          </div>
          <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
            {laps.map((l, i) => {
              const { h: lh, m: lm, s: ls, cs: lcs } = formatMs(lapDeltas[i]);
              const { h: th, m: tm, s: ts } = formatMs(l);
              return (
                <div key={i} className="grid grid-cols-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors">
                  <span className="text-gray-400">#{laps.length - i}</span>
                  <span className="text-center font-mono text-cyan-300">
                    {pad(lh)}:{pad(lm)}:{pad(ls)}.{pad(lcs)}
                  </span>
                  <span className="text-right font-mono text-gray-300">
                    {pad(th)}:{pad(tm)}:{pad(ts)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────── Pomodoro
type PomodoroPhase = "focus" | "short" | "long";

const PHASE_DURATIONS: Record<PomodoroPhase, number> = {
  focus: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 15 * 60 * 1000,
};

const PHASE_LABELS: Record<PomodoroPhase, string> = {
  focus: "집중 시간",
  short: "짧은 휴식",
  long: "긴 휴식",
};

const PHASE_COLORS: Record<PomodoroPhase, string> = {
  focus: "from-red-400 to-orange-400",
  short: "from-green-400 to-emerald-400",
  long: "from-blue-400 to-cyan-400",
};

const PHASE_BORDER: Record<PomodoroPhase, string> = {
  focus: "border-red-500/40 text-red-300",
  short: "border-green-500/40 text-green-300",
  long: "border-blue-500/40 text-blue-300",
};

function PomodoroTab() {
  const [phase, setPhase] = useState<PomodoroPhase>("focus");
  const [remaining, setRemaining] = useState(PHASE_DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // completed focus sessions
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef(0);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => () => clear(), [clear]);

  const advancePhase = useCallback(
    (currentPhase: PomodoroPhase, currentCount: number) => {
      if (currentPhase === "focus") {
        const nextCount = currentCount + 1;
        setPomodoroCount(nextCount);
        const nextPhase = nextCount % 4 === 0 ? "long" : "short";
        setPhase(nextPhase);
        setRemaining(PHASE_DURATIONS[nextPhase]);
        // auto-start next phase
        endTimeRef.current = Date.now() + PHASE_DURATIONS[nextPhase];
        intervalRef.current = setInterval(() => {
          const left = endTimeRef.current - Date.now();
          if (left <= 0) {
            clear();
            setRemaining(0);
            setRunning(false);
          } else {
            setRemaining(left);
          }
        }, 50);
      } else {
        // break finished → go back to focus
        setPhase("focus");
        setRemaining(PHASE_DURATIONS.focus);
        endTimeRef.current = Date.now() + PHASE_DURATIONS.focus;
        intervalRef.current = setInterval(() => {
          const left = endTimeRef.current - Date.now();
          if (left <= 0) {
            clear();
            setRemaining(0);
            setRunning(false);
          } else {
            setRemaining(left);
          }
        }, 50);
      }
    },
    [clear],
  );

  const startTick = useCallback(
    (ms: number, currentPhase: PomodoroPhase, currentCount: number) => {
      endTimeRef.current = Date.now() + ms;
      clear();
      intervalRef.current = setInterval(() => {
        const left = endTimeRef.current - Date.now();
        if (left <= 0) {
          clear();
          setRemaining(0);
          setRunning(false);
          advancePhase(currentPhase, currentCount);
        } else {
          setRemaining(left);
        }
      }, 50);
    },
    [clear, advancePhase],
  );

  const handleStartPause = () => {
    if (running) {
      clear();
      setRunning(false);
    } else {
      if (remaining <= 0) return;
      setRunning(true);
      startTick(remaining, phase, pomodoroCount);
    }
  };

  const handleReset = () => {
    clear();
    setRunning(false);
    setPhase("focus");
    setPomodoroCount(0);
    setRemaining(PHASE_DURATIONS.focus);
  };

  const handleSkip = () => {
    clear();
    setRunning(false);
    advancePhase(phase, pomodoroCount);
  };

  const { m, s } = formatMs(remaining);
  const total = PHASE_DURATIONS[phase];
  const progress = total > 0 ? (total - remaining) / total : 0;
  const circumference = 2 * Math.PI * 80; // r=80

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Phase badge */}
      <div
        className={`px-5 py-2 rounded-full border text-sm font-bold tracking-wide ${PHASE_BORDER[phase]} bg-white/5`}
      >
        {phase === "focus" ? <Brain className="inline mr-2" size={16} /> : <Coffee className="inline mr-2" size={16} />}
        {PHASE_LABELS[phase]}
      </div>

      {/* Circular progress + time */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="url(#pomGrad)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className="transition-all duration-200"
          />
          <defs>
            <linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={phase === "focus" ? "#f87171" : phase === "short" ? "#4ade80" : "#60a5fa"} />
              <stop offset="100%" stopColor={phase === "focus" ? "#fb923c" : phase === "short" ? "#34d399" : "#22d3ee"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span
            className={`text-5xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-r ${PHASE_COLORS[phase]}`}
          >
            {pad(m)}:{pad(s)}
          </span>
        </div>
      </div>

      {/* Pomodoro cycle dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < pomodoroCount % 4
                ? "bg-red-400 border-red-400"
                : "bg-transparent border-white/20"
            }`}
          />
        ))}
        {pomodoroCount >= 4 && (
          <span className="text-xs text-gray-400 ml-2">
            세트 {Math.floor(pomodoroCount / 4)}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400">
        완료한 뽀모도로: <span className="font-bold text-white">{pomodoroCount}</span>개
        {pomodoroCount > 0 && pomodoroCount % 4 === 0 && (
          <span className="ml-2 text-blue-300">← 긴 휴식 시간!</span>
        )}
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleStartPause}
          disabled={remaining <= 0}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg bg-neon-primary/20 border border-neon-primary/40 text-neon-primary hover:bg-neon-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {running ? <Pause size={20} /> : <Play size={20} />}
          {running ? "일시정지" : "시작"}
        </button>
        <button
          onClick={handleSkip}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
        >
          다음 단계
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Phase guide */}
      <div className="w-full max-w-md grid grid-cols-3 gap-2">
        {(["focus", "short", "long"] as PomodoroPhase[]).map((p) => (
          <div
            key={p}
            className={`text-center p-3 rounded-xl border ${
              phase === p ? "bg-white/10 border-white/20" : "bg-white/3 border-white/5"
            }`}
          >
            <p className="text-xs text-gray-400">{PHASE_LABELS[p]}</p>
            <p className={`font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r ${PHASE_COLORS[p]}`}>
              {p === "focus" ? "25분" : p === "short" ? "5분" : "15분"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────── Main page
const TABS: { id: TabMode; label: string }[] = [
  { id: "countdown", label: "카운트다운" },
  { id: "stopwatch", label: "스톱워치" },
  { id: "pomodoro", label: "뽀모도로" },
];

export default function TimerPage() {
  const [tab, setTab] = useState<TabMode>("countdown");

  return (
    <ToolLayout
      title="타이머 — 카운트다운·스톱워치·뽀모도로"
      description="카운트다운 타이머, 스톱워치(랩 기록), 뽀모도로 타이머 3가지 모드를 제공하는 무료 온라인 타이머입니다. 공부, 운동, 업무 집중 시간 관리에 활용하세요."
      keywords="타이머, 카운트다운, 스톱워치, 뽀모도로, 집중타이머, pomodoro timer, countdown timer, stopwatch"
      howToUse={[
        "상단 탭에서 원하는 모드(카운트다운·스톱워치·뽀모도로)를 선택하세요.",
        "카운트다운: 시·분·초를 입력하고 시작 버튼을 누르세요.",
        "스톱워치: 시작 후 랩 버튼으로 구간 기록을 남길 수 있습니다 (최대 10개).",
        "뽀모도로: 25분 집중 → 5분 휴식 → 반복, 4번 후 15분 긴 휴식이 자동 진행됩니다.",
      ]}
      tips={[
        "뽀모도로 기법은 25분 집중 + 5분 휴식 사이클로 생산성을 높이는 시간 관리 기법입니다.",
        "스톱워치 랩 기능으로 운동 구간 타임이나 발표 연습 시간을 기록해보세요.",
        "카운트다운이 끝나면 화면 상단에 알림이 표시됩니다.",
      ]}
      faqs={[
        {
          question: "뽀모도로 타이머는 어떻게 작동하나요?",
          answer:
            "25분 집중 → 5분 짧은 휴식 사이클을 4회 반복하면, 4번째 휴식은 15분 긴 휴식으로 자동 전환됩니다. 각 단계가 끝나면 다음 단계로 자동 넘어갑니다.",
        },
        {
          question: "스톱워치 랩은 몇 개까지 저장되나요?",
          answer: "최근 10개 랩이 저장됩니다. 11번째 랩부터는 가장 오래된 랩이 제거됩니다.",
        },
        {
          question: "카운트다운이 끝나면 소리가 나나요?",
          answer:
            "현재 버전은 시각적 알림(화면 표시, 애니메이션)만 제공합니다. 브라우저 알림 소리는 추후 업데이트될 예정입니다.",
        },
      ]}
      relatedTools={[
        { name: "시간 계산기", path: "/tools/time-calculator", description: "두 시간 사이 경과 계산" },
        { name: "D-Day 카운터", path: "/tools/d-day-counter", description: "기념일·목표일 D-Day 계산" },
        { name: "Unix 타임스탬프", path: "/tools/unix-timestamp", description: "날짜 ↔ 타임스탬프 변환" },
      ]}
    >
      {/* Tab bar */}
      <div className="flex gap-2 mb-8 bg-white/5 border border-white/10 rounded-xl p-1">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tab === id
                ? "bg-neon-primary/20 border border-neon-primary/40 text-neon-primary"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-[360px] flex flex-col items-center justify-center">
        {tab === "countdown" && <CountdownTab />}
        {tab === "stopwatch" && <StopwatchTab />}
        {tab === "pomodoro" && <PomodoroTab />}
      </div>
    </ToolLayout>
  );
}
