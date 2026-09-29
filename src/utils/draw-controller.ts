/**
 * Draw controller (SPK2-01).
 *
 * Owns one "draw unit": candidate snapshot, selected index, result and the
 * completion timer. It is framework-free so the timing rules can be tested
 * with fake timers, and the React hook stays a thin adapter.
 *
 * Guarantees:
 * - At most one draw is in flight; repeated start() calls are rejected
 *   synchronously (no reliance on async React state).
 * - cancel() invalidates the pending draw; a late timer never completes it.
 * - The completion callback receives the snapshot taken at start, so later
 *   list edits cannot mix a new candidate set with an old result.
 */

/** Default wheel animation length; RouletteWheel reads the same constant. */
export const SPIN_DURATION_MS = 5000;
/** Shortened timing when the user prefers reduced motion. */
export const REDUCED_MOTION_SPIN_DURATION_MS = 800;

export interface DrawSnapshot {
  drawId: number;
  items: readonly string[];
  index: number;
  result: string;
}

export interface DrawControllerOptions {
  pickIndex: (length: number) => number;
  schedule?: (callback: () => void, delayMs: number) => unknown;
  clear?: (handle: unknown) => void;
}

export interface DrawController {
  start(items: readonly string[], onComplete: (draw: DrawSnapshot) => void, durationMs?: number): DrawSnapshot | null;
  cancel(): void;
  isInFlight(): boolean;
}

export function createDrawController(options: DrawControllerOptions): DrawController {
  const schedule = options.schedule ?? ((callback, delayMs) => setTimeout(callback, delayMs));
  const clear = options.clear ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>));
  let nextDrawId = 1;
  let activeDrawId: number | null = null;
  let timerHandle: unknown = null;

  function clearTimer() {
    if (timerHandle !== null) {
      clear(timerHandle);
      timerHandle = null;
    }
  }

  return {
    start(items, onComplete, durationMs = SPIN_DURATION_MS) {
      if (activeDrawId !== null || items.length === 0) {
        return null;
      }
      const snapshotItems = Object.freeze([...items]);
      const index = options.pickIndex(snapshotItems.length);
      const draw: DrawSnapshot = Object.freeze({
        drawId: nextDrawId++,
        items: snapshotItems,
        index,
        result: snapshotItems[index],
      });
      activeDrawId = draw.drawId;

      timerHandle = schedule(() => {
        timerHandle = null;
        if (activeDrawId !== draw.drawId) return;
        activeDrawId = null;
        onComplete(draw);
      }, durationMs);

      return draw;
    },
    cancel() {
      clearTimer();
      activeDrawId = null;
    },
    isInFlight() {
      return activeDrawId !== null;
    },
  };
}

export function areItemsEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}
