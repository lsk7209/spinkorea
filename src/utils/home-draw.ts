import { getRandomIndex } from './random.ts';

export interface HomeCandidate {
  id: number;
  name: string;
}

export interface HomeTicket {
  round: number;
  winners: readonly HomeCandidate[];
  candidateCount: number;
  requestedCount: number;
  autoExcluded: boolean;
  completedAt: string;
}

export interface HomeRecord extends HomeTicket {
  roster: readonly string[];
  remainingAtCompletion: number;
}

export const MAX_HOME_RECORDS = 20;

export function makeHomeRecord(ticket: HomeTicket, roster: readonly string[], remainingAtCompletion: number): HomeRecord {
  return Object.freeze({
    ...ticket,
    winners: Object.freeze(ticket.winners.map((winner) => Object.freeze({ ...winner }))),
    roster: Object.freeze([...roster]),
    remainingAtCompletion,
  });
}

/** Reject malformed persisted snapshots rather than displaying invented conditions. */
export function parseHomeRecords(value: unknown): HomeRecord[] {
  if (!value || typeof value !== 'object' || !('v' in value) || value.v !== 1
    || !('records' in value) || !Array.isArray(value.records)) return [];
  return value.records.slice(0, MAX_HOME_RECORDS).flatMap((raw): HomeRecord[] => {
    if (!raw || typeof raw !== 'object') return [];
    const record = raw as Partial<HomeRecord>;
    if (!Array.isArray(record.roster) || record.roster.length < 1 || record.roster.length > 100
      || !record.roster.every((name) => typeof name === 'string' && name.trim() === name && name.length > 0 && name.length <= 50)
      || !Number.isSafeInteger(record.round) || (record.round ?? 0) < 1
      || !Number.isSafeInteger(record.candidateCount) || (record.candidateCount ?? 0) < 1 || (record.candidateCount ?? 0) > record.roster.length
      || !Number.isSafeInteger(record.requestedCount) || (record.requestedCount ?? 0) < 1 || (record.requestedCount ?? 0) > (record.candidateCount ?? 0)
      || typeof record.autoExcluded !== 'boolean'
      || typeof record.completedAt !== 'string' || !Number.isFinite(Date.parse(record.completedAt))
      || !Number.isSafeInteger(record.remainingAtCompletion)
      || record.remainingAtCompletion !== (record.candidateCount ?? 0) - (record.autoExcluded ? (record.requestedCount ?? 0) : 0)
      || !Array.isArray(record.winners) || record.winners.length !== record.requestedCount) return [];
    const ids = new Set<number>();
    for (const winner of record.winners) {
      if (!winner || !Number.isSafeInteger(winner.id) || winner.id < 0 || winner.id >= record.roster.length
        || winner.name !== record.roster[winner.id] || ids.has(winner.id)) return [];
      ids.add(winner.id);
    }
    return [makeHomeRecord(record as HomeTicket, record.roster, record.remainingAtCompletion)];
  });
}

/** Original list positions distinguish people with identical display names. */
export function availableCandidates(items: readonly string[], excluded: ReadonlySet<number>): HomeCandidate[] {
  return items.flatMap((name, id) => excluded.has(id) ? [] : [{ id, name }]);
}

/** The wheel has already chosen the first winner; finish the batch without replacement. */
export function finishBatch(
  candidates: readonly HomeCandidate[],
  firstIndex: number,
  count: number,
  pickIndex: (length: number) => number = getRandomIndex,
): HomeCandidate[] {
  if (!Number.isInteger(count) || !Number.isInteger(firstIndex) || count < 1 || count > candidates.length || firstIndex < 0 || firstIndex >= candidates.length) {
    throw new RangeError('Invalid batch draw');
  }
  const remaining = candidates.filter((_, index) => index !== firstIndex);
  const winners = [candidates[firstIndex]];
  while (winners.length < count) {
    winners.push(remaining.splice(pickIndex(remaining.length), 1)[0]);
  }
  return winners;
}

export function candidateLabel(candidate: HomeCandidate, items: readonly string[]): string {
  return items.filter((name) => name === candidate.name).length > 1
    ? `${candidate.name} (명단 ${candidate.id + 1}번)`
    : candidate.name;
}

export function ticketTime(completedAt: string): string {
  return `${new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Seoul',
  }).format(new Date(completedAt))} KST`;
}

export function ticketText(ticket: HomeTicket, items: readonly string[]): string {
  return [
    `${ticket.round}회차 결과: ${ticket.winners.map((winner) => candidateLabel(winner, items)).join(', ')}`,
    `추첨 시작 후보 ${ticket.candidateCount}명 · ${ticket.requestedCount}명 추첨 · 묶음 내 중복 없음`,
    `추첨 후 자동 제외 ${ticket.autoExcluded ? '적용' : '미적용'}`,
    `완료 ${ticketTime(ticket.completedAt)}`,
  ].join('\n');
}

export function recordText(record: HomeRecord): string {
  return `${ticketText(record, record.roster)}\n완료 직후 남은 후보 ${record.remainingAtCompletion}명`;
}
