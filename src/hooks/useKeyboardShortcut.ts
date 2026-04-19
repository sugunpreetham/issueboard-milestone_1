import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  onSearchFocus: () => void;
  onClearSelection: () => void;
  onOpenShortcuts?: () => void;
  hasSelection: boolean;
  isModalOpen: boolean;
}

export function useKeyboardShortcut({
  onSearchFocus,
  onClearSelection,
  onOpenShortcuts,
  hasSelection,
  isModalOpen,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger global shortcuts when typing in inputs/textareas or when modal is open
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if ((e.key === '?' || (e.shiftKey && e.code === 'Slash')) && !isInput && !isModalOpen && onOpenShortcuts) {
        e.preventDefault();
        onOpenShortcuts();
      } else if ((e.key === '/' || (!e.shiftKey && e.code === 'Slash')) && !isInput && !isModalOpen) {
        e.preventDefault();
        onSearchFocus();
      } else if (e.key === 'Escape' && !isModalOpen && hasSelection) {
        e.preventDefault();
        onClearSelection();
      } else if ((e.key === 'j' || e.key === 'J') && !isInput && !isModalOpen) {
        e.preventDefault();
        const rows = Array.from(document.querySelectorAll<HTMLElement>('.issue-row, .issue-card'));
        if (rows.length === 0) return;
        const currentIndex = rows.findIndex(
          (row) => row === document.activeElement || row.contains(document.activeElement)
        );
        const nextIndex = currentIndex < rows.length - 1 ? currentIndex + 1 : 0;
        rows[nextIndex]?.focus();
      } else if ((e.key === 'k' || e.key === 'K') && !isInput && !isModalOpen) {
        e.preventDefault();
        const rows = Array.from(document.querySelectorAll<HTMLElement>('.issue-row, .issue-card'));
        if (rows.length === 0) return;
        const currentIndex = rows.findIndex(
          (row) => row === document.activeElement || row.contains(document.activeElement)
        );
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : rows.length - 1;
        rows[prevIndex]?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSearchFocus, onClearSelection, onOpenShortcuts, hasSelection, isModalOpen]);
}
