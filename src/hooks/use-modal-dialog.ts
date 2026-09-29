import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Modal dialog behaviour per WAI-ARIA APG (SPK2-09):
 * - moves focus into the dialog on open (initialFocusRef or first control),
 * - keeps Tab / Shift+Tab inside the dialog,
 * - closes on Escape,
 * - makes the rest of the page inert while open,
 * - returns focus to the element that opened it on close.
 */
export function useModalDialog(
  isOpen: boolean,
  onClose: () => void,
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inertTargets = setSiblingsInert(dialog);
    const initial = initialFocusRef?.current ?? getFocusable(dialog)[0] ?? dialog;
    initial.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === 'Tab') trapTab(event, dialog);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      inertTargets.forEach((element) => element.removeAttribute('inert'));
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen, dialogRef, initialFocusRef]);
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('inert') && element.getClientRects().length > 0,
  );
}

function trapTab(event: KeyboardEvent, dialog: HTMLElement) {
  const focusable = getFocusable(dialog);
  if (focusable.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !dialog.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

/** Mark every top-level body child except the dialog's ancestor as inert. */
function setSiblingsInert(dialog: HTMLElement): HTMLElement[] {
  const marked: HTMLElement[] = [];
  let node: HTMLElement | null = dialog;
  while (node && node.parentElement) {
    const parent: HTMLElement = node.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling !== node && sibling instanceof HTMLElement && !sibling.hasAttribute('inert') && sibling.tagName !== 'SCRIPT') {
        sibling.setAttribute('inert', '');
        marked.push(sibling);
      }
    }
    if (parent === document.body) break;
    node = parent;
  }
  return marked;
}
