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

      if ((e.key === '/' || e.code === 'Slash') && !isInput && !isModalOpen) {
        e.preventDefault();
        onSearchFocus();
      } else if (e.key === '?' && !isInput && !isModalOpen && onOpenShortcuts) {
        e.preventDefault();
        onOpenShortcuts();
      } else if (e.key === 'Escape' && !isModalOpen && hasSelection) {
        e.preventDefault();
        onClearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSearchFocus, onClearSelection, onOpenShortcuts, hasSelection, isModalOpen]);
}
