const KEY = 'spinflow_recent_tools';
const MAX = 5;

export function recordRecentTool(path: string): void {
  try {
    const prev: string[] = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    const next = [path, ...prev.filter((p) => p !== path)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function getRecentTools(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}
