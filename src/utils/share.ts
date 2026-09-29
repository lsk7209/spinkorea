/**
 * Share helpers (SPK2-03).
 *
 * The share URL only carries the candidate list; the result is never encoded
 * in it. Text therefore says "same candidates" and never "check the result",
 * and it must not be described as proof of a draw.
 */

const PREVIEW_ITEM_COUNT = 3;

export function buildItemsPreview(items: string[]): string {
  const preview = items.slice(0, PREVIEW_ITEM_COUNT).join(', ');
  return items.length > PREVIEW_ITEM_COUNT ? `${preview} 외 ${items.length - PREVIEW_ITEM_COUNT}개` : preview;
}

/**
 * Human-readable result message. The link is optional because an overly
 * long URL must not block copying the result text itself.
 */
export function buildResultShareText(items: string[], result: string, shareUrl: string | null): string {
  const lines = [
    `[SpinFlow] 룰렛 결과: ${result}`,
    `후보(${items.length}개): ${buildItemsPreview(items)}`,
  ];
  if (shareUrl) {
    lines.push(`같은 후보로 룰렛 열기: ${shareUrl}`);
  }
  return lines.join('\n');
}

export type ClipboardWriter = (text: string) => Promise<void>;

/**
 * Copy text, resolving only after a real success. Falls back to a hidden
 * textarea + execCommand when the async Clipboard API is missing or denied.
 */
export async function copyText(text: string, writer?: ClipboardWriter): Promise<boolean> {
  const write = writer ?? getDefaultWriter();
  if (write) {
    try {
      await write(text);
      return true;
    } catch {
      // Permission denied or insecure context: try the legacy path below.
    }
  }
  return legacyCopy(text);
}

function getDefaultWriter(): ClipboardWriter | null {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return null;
  return (text) => navigator.clipboard.writeText(text);
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}
