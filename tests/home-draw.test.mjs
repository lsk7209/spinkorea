import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { availableCandidates, candidateLabel, finishBatch, makeHomeRecord, parseHomeRecords, recordText, ticketText, MAX_HOME_RECORDS } from '../src/utils/home-draw.ts';

describe('home batch draw', () => {
  const names = ['민지', '민지', '준호', '서연'];

  it('keeps identical names as separate roster positions', () => {
    const candidates = availableCandidates(names, new Set([0]));
    assert.deepEqual(candidates.map((candidate) => candidate.id), [1, 2, 3]);
    assert.equal(candidateLabel(candidates[0], names), '민지 (명단 2번)');
  });

  it('uses the wheel winner first and samples remaining IDs without replacement', () => {
    const candidates = availableCandidates(names, new Set());
    const winners = finishBatch(candidates, 1, 3, () => 0);
    assert.deepEqual(winners.map((winner) => winner.id), [1, 0, 2]);
    assert.deepEqual(candidates.map((candidate) => candidate.id), [0, 1, 2, 3]);
  });

  it('records captured conditions and KST completion time in copy text', () => {
    const text = ticketText({
      round: 2,
      winners: [{ id: 1, name: '민지' }],
      candidateCount: 4,
      requestedCount: 1,
      autoExcluded: false,
      completedAt: '2026-10-23T00:00:00.000Z',
    }, names);
    assert.match(text, /2회차 결과: 민지 \(명단 2번\)/);
    assert.match(text, /추첨 시작 후보 4명 · 1명 추첨 · 묶음 내 중복 없음/);
    assert.match(text, /자동 제외 미적용/);
    assert.match(text, /KST/);
  });

  it('restores bounded immutable records with the original roster after later edits', () => {
    const record = makeHomeRecord({
      round: 7,
      winners: [{ id: 1, name: '민지' }],
      candidateCount: 3,
      requestedCount: 1,
      autoExcluded: true,
      completedAt: '2026-10-23T00:00:00.000Z',
    }, names, 2);
    const restored = parseHomeRecords({ v: 1, records: Array.from({ length: 25 }, (_, index) => ({ ...record, round: 25 - index })) });
    assert.equal(restored.length, MAX_HOME_RECORDS);
    assert.equal(restored[0].round, 25);
    assert.equal(restored.at(-1).round, 6);
    assert.ok(Object.isFrozen(restored[0]));
    assert.ok(Object.isFrozen(restored[0].roster));
    assert.ok(Object.isFrozen(restored[0].winners[0]));
    assert.match(recordText(restored[0]), /민지 \(명단 2번\)/);
    assert.match(recordText(restored[0]), /완료 직후 남은 후보 2명/);
    assert.equal(names[1], '민지');
  });

  it('drops malformed persisted records and rejects other schema versions', () => {
    const valid = makeHomeRecord({
      round: 1, winners: [{ id: 1, name: '민지' }], candidateCount: 4,
      requestedCount: 1, autoExcluded: false, completedAt: '2026-10-23T00:00:00.000Z',
    }, names, 4);
    assert.deepEqual(parseHomeRecords({ v: 2, records: [valid] }), []);
    assert.deepEqual(parseHomeRecords(null), []);
    const invalid = { ...valid, winners: [{ id: 1, name: '위조' }] };
    assert.equal(parseHomeRecords({ v: 1, records: [invalid, valid] }).length, 1);
    assert.deepEqual(parseHomeRecords({ v: 1, records: [{ ...valid, remainingAtCompletion: 3 }] }), []);
  });
});
