// SPK2-01 draw state consistency (T06–T09). Framework-free draw controller + wheel geometry.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createDrawController, areItemsEqual, SPIN_DURATION_MS } from '../src/utils/draw-controller.ts';
import { computeTargetRotation, getIndexUnderPointer } from '../src/utils/wheel-geometry.ts';

function createFakeClock() {
  let now = 0;
  const timers = new Map();
  let nextId = 1;
  return {
    schedule(callback, delay) {
      const id = nextId++;
      timers.set(id, { at: now + delay, callback });
      return id;
    },
    clear(id) { timers.delete(id); },
    advance(ms) {
      now += ms;
      for (const [id, timer] of [...timers]) {
        if (timer.at <= now) { timers.delete(id); timer.callback(); }
      }
    },
    pending() { return timers.size; },
  };
}

function setup(pick = () => 0) {
  const clock = createFakeClock();
  const controller = createDrawController({ pickIndex: pick, schedule: clock.schedule, clear: clock.clear });
  return { clock, controller };
}

describe('draw controller', () => {
  it('completes once with the snapshot taken at start', () => {
    const { clock, controller } = setup(() => 1);
    const items = ['A', 'B'];
    const completed = [];
    const draw = controller.start(items, (d) => completed.push(d));
    items[1] = 'MUTATED';
    clock.advance(SPIN_DURATION_MS);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].result, 'B');
    assert.deepEqual([...completed[0].items], ['A', 'B']);
    assert.equal(completed[0].drawId, draw.drawId);
  });

  it('rejects repeated start while in flight (double click / keyboard repeat)', () => {
    const { clock, controller } = setup();
    let completions = 0;
    let picks = 0;
    const counting = createDrawController({ pickIndex: () => { picks += 1; return 0; }, schedule: clock.schedule, clear: clock.clear });
    assert.ok(counting.start(['A', 'B'], () => { completions += 1; }));
    assert.equal(counting.start(['A', 'B'], () => { completions += 1; }), null);
    assert.equal(counting.start(['A', 'B'], () => { completions += 1; }), null);
    clock.advance(SPIN_DURATION_MS);
    assert.equal(picks, 1, 'random index is drawn once');
    assert.equal(completions, 1, 'completion fires once');
    assert.equal(controller.isInFlight(), false);
  });

  it('cancel (unmount / list change) prevents late completion, save and events', () => {
    const { clock, controller } = setup();
    let completions = 0;
    controller.start(['A', 'B'], () => { completions += 1; });
    controller.cancel();
    clock.advance(SPIN_DURATION_MS * 2);
    assert.equal(completions, 0);
    assert.equal(clock.pending(), 0);
    assert.equal(controller.isInFlight(), false);
  });

  it('a stale timer from a cancelled draw cannot complete a newer draw', () => {
    const clock = createFakeClock();
    // clear() that does nothing simulates a timer that still fires after cancel.
    const controller = createDrawController({ pickIndex: () => 0, schedule: clock.schedule, clear: () => {} });
    const results = [];
    controller.start(['OLD'], (d) => results.push(d.result));
    controller.cancel();
    clock.advance(SPIN_DURATION_MS / 2);
    controller.start(['NEW'], (d) => results.push(d.result));
    clock.advance(SPIN_DURATION_MS / 2); // old timer fires here
    assert.deepEqual(results, []);
    clock.advance(SPIN_DURATION_MS / 2);
    assert.deepEqual(results, ['NEW']);
  });

  it('ignores empty candidate lists', () => {
    const { controller } = setup();
    assert.equal(controller.start([], () => {}), null);
  });

  it('honours a custom (reduced-motion) duration', () => {
    const { clock, controller } = setup();
    let done = false;
    controller.start(['A'], () => { done = true; }, 800);
    clock.advance(799);
    assert.equal(done, false);
    clock.advance(1);
    assert.equal(done, true);
  });

  it('areItemsEqual distinguishes order and duplicates', () => {
    assert.equal(areItemsEqual(['A', 'B'], ['A', 'B']), true);
    assert.equal(areItemsEqual(['A', 'B'], ['B', 'A']), false);
    assert.equal(areItemsEqual(['A'], ['A', 'A']), false);
  });
});

describe('wheel geometry: pointer matches result (T09)', () => {
  for (const count of [1, 2, 3, 7, 45, 100]) {
    it(`every index lands under the pointer for ${count} candidate(s)`, () => {
      let rotation = 0;
      for (let index = 0; index < count; index += 1) {
        rotation = computeTargetRotation(rotation, index, count, 2880);
        assert.equal(getIndexUnderPointer(rotation, count), index, `count=${count} index=${index}`);
      }
      // Repeated spins from a non-zero rotation keep working.
      rotation = computeTargetRotation(rotation, count - 1, count, 360);
      assert.equal(getIndexUnderPointer(rotation, count), count - 1);
    });
  }

  it('always travels forward by at least the requested full rotations', () => {
    for (const start of [0, 1234.5, -987.25]) {
      for (const min of [360, 2880]) {
        const next = computeTargetRotation(start, 3, 8, min);
        assert.ok(next - start >= min && next - start < min + 360, `start=${start} min=${min}`);
      }
    }
  });
});
