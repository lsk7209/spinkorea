import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const home = read('src/pages/Home.tsx');
assert.match(home, /if \(isSpinning\) return false;/, 'item edits are rejected during a draw');
assert.match(home, /disabled=\{isSpinning\}/, 'editor controls expose the spin lock');
assert.match(home, /const draw = spin\(\);\s*if \(!draw\) return;/, 'draw side effects follow an accepted spin');
assert.match(home, /pendingRef\.current = \{ candidates: snapshot, roster: \[\.\.\.items\], count: drawCount, autoExclude, round: round \+ 1 \}/, 'batch conditions and original labels are captured at start');
assert.match(home, /finishBatch\(pending\.candidates, draw\.index, pending\.count\)/, 'batch uses the wheel result and captured start conditions');
assert.match(home, /setExcluded\(\(previous\) => new Set/, 'auto exclusion is separate from the saved source list');
assert.match(home, /if \(isSpinning \|\| ticket\) return;/, 'completed wheel is held while its ticket is visible');
assert.match(home, /if \(!areItemsEqual\(wheelItems, candidateNames\)\) \{\s*setWheelItems\(candidateNames\)/, 'next accepted draw updates the visible wheel snapshot');
assert.match(home, /saveResult\(winners\.map/, 'stored result includes all batch winners');

console.log('SPIN_CONSISTENCY_OK');
