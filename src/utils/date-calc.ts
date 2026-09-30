/**
 * Pure date/time helpers shared by the date tools.
 * Kept free of runtime dependencies so node:test can import this file directly.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
/** |value| at or above this is treated as milliseconds (1e12 ms ≈ 2001-09-09, 1e12 s ≈ year 33658). */
const MILLISECOND_THRESHOLD = 1e12;
/** ECMAScript Date range limit in milliseconds. */
const MAX_DATE_MS = 8.64e15;

/**
 * Parses `YYYY-MM-DD` as a local calendar date.
 * `new Date("YYYY-MM-DD")` is UTC midnight, which shifts the day in negative-offset time zones.
 */
export function parseLocalDate(value: string): Date | null {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  const isSameCalendarDay =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isSameCalendarDay ? date : null;
}

/** Whole calendar days from `from` to `to` (local dates, DST-safe). */
export function calendarDaysBetween(from: Date, to: Date): number {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / MS_PER_DAY);
}

/** Service days between two `YYYY-MM-DD` strings, or null when invalid or not after the start. */
export function serviceDaysBetween(start: string, end: string): number | null {
  const startDate = parseLocalDate(start);
  const endDate = parseLocalDate(end);
  if (!startDate || !endDate) return null;
  const days = calendarDaysBetween(startDate, endDate);
  return days > 0 ? days : null;
}

/** Returns true when the birth date is a valid date that is not after today. */
export function isValidBirthDate(birth: Date, today: Date): boolean {
  if (Number.isNaN(birth.getTime())) return false;
  return calendarDaysBetween(birth, today) >= 0;
}

export interface ShiftedClockTime {
  /** `HH:mm` on a 24-hour clock. */
  time: string;
  /** Calendar day offset from the base day (negative = earlier day). */
  dayOffset: number;
}

/** Adds signed minutes to an `HH:mm` clock time and reports how many days were crossed. */
export function shiftClockTime(baseTime: string, deltaMinutes: number): ShiftedClockTime | null {
  const match = /^(\d{2}):(\d{2})$/.exec(baseTime);
  if (!match || !Number.isFinite(deltaMinutes)) return null;
  const baseMinutes = Number(match[1]) * 60 + Number(match[2]);
  const total = baseMinutes + Math.trunc(deltaMinutes);
  const dayOffset = Math.floor(total / MINUTES_PER_DAY);
  const minuteOfDay = total - dayOffset * MINUTES_PER_DAY;
  const hours = String(Math.floor(minuteOfDay / 60)).padStart(2, "0");
  const minutes = String(minuteOfDay % 60).padStart(2, "0");
  return { time: `${hours}:${minutes}`, dayOffset };
}

/** Korean label for a day offset: "", "(다음날)", "(전날)", "(3일 후)", "(2일 전)". */
export function formatDayOffset(dayOffset: number): string {
  if (dayOffset === 0) return "";
  if (dayOffset === 1) return "(다음날)";
  if (dayOffset === -1) return "(전날)";
  return dayOffset > 0 ? `(${dayOffset}일 후)` : `(${Math.abs(dayOffset)}일 전)`;
}

export type TimestampUnit = "seconds" | "milliseconds";

export interface ParsedTimestamp {
  date: Date;
  unit: TimestampUnit;
}

/**
 * Parses an integer Unix timestamp and infers its unit from magnitude, not digit count,
 * so signs and leading zeros do not flip the unit.
 */
export function parseUnixTimestamp(input: string): ParsedTimestamp | null {
  const trimmed = input.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value)) return null;
  const unit: TimestampUnit = Math.abs(value) >= MILLISECOND_THRESHOLD ? "milliseconds" : "seconds";
  const milliseconds = unit === "milliseconds" ? value : value * 1000;
  if (Math.abs(milliseconds) > MAX_DATE_MS) return null;
  return { date: new Date(milliseconds), unit };
}
