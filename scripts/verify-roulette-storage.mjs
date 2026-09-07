import assert from 'node:assert/strict';
import { isRouletteState, readStoredJson, parseStoredResult, parseStoredHistory } from '../src/utils/roulette-storage.ts';
import { getRecentTools, recordRecentTool } from '../src/hooks/useRecentTools.ts';

assert.equal(isRouletteState({ v: 1, items: ['A', 'B'] }), true);
for (const value of [null, {}, {v:1,items:'broken'}, {v:1,items:[{}]}, {v:1,items:[null]}, {v:1,items:[3]}]) {
  assert.equal(isRouletteState(value), false);
}
assert.equal(readStoredJson(() => { throw new Error('storage denied'); }), null);
assert.equal(readStoredJson(() => '{broken'), null);
assert.deepEqual(readStoredJson(() => '["A"]'), ['A']);
assert.deepEqual(parseStoredHistory([{}, 'A', null, 'B']), ['A','B']);
assert.equal(parseStoredHistory(Array(15).fill('A')).length, 10);
const now = Date.parse('2026-09-07T12:00:00Z');
assert.deepEqual(parseStoredResult({value:'A',time:'2026-09-07T11:59:00Z'}, now), {value:'A',time:'2026-09-07T11:59:00Z'});
for (const value of [null, {value:{},time:'2026-09-07T11:59:00Z'}, {value:'A',time:'bad'}, {value:'A',time:'2026-09-07T12:01:00Z'}, {value:'A',time:'2026-09-07T11:55:00Z'}]) {
  assert.equal(parseStoredResult(value, now), null);
}
console.log('ROULETTE_STORAGE_OK');
let stored = '{}';
globalThis.localStorage = {getItem:()=>stored, setItem:(_key,value)=>{stored=value;}};
assert.deepEqual(getRecentTools(), []);
recordRecentTool('/tools/example');
assert.deepEqual(getRecentTools(), ['/tools/example']);
globalThis.localStorage = {getItem:()=>{throw new Error('denied');}};
assert.deepEqual(getRecentTools(), []);
delete globalThis.localStorage;
console.log('RECENT_TOOLS_STORAGE_OK');
