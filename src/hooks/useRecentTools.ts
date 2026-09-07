const KEY = 'spinflow_recent_tools';
const MAX = 5;

export function recordRecentTool(path: string): void {
  try {
    const prev = getRecentTools();
    const next = [path, ...prev.filter((p) => p !== path)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentTools(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter(path => typeof path === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}
