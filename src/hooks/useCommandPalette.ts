import { useState, useMemo, useCallback } from 'react';
import { CommandItem } from '../types/commandPalette';

export interface UseCommandPaletteOptions {
  commands: CommandItem[];
}

export interface UseCommandPaletteResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCommands: CommandItem[];
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  selectNext: () => void;
  selectPrev: () => void;
  executeSelected: () => boolean;
}

export function useCommandPalette({ commands }: UseCommandPaletteOptions): UseCommandPaletteResult {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const open = useCallback(() => {
    setIsOpen(true);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setSearchQuery('');
    setSelectedIndex(0);
  }, []);

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return commands;
    }
    const q = searchQuery.toLowerCase().trim();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        cmd.category.toLowerCase().includes(q) ||
        (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q))
    );
  }, [commands, searchQuery]);

  const selectNext = useCallback(() => {
    setSelectedIndex((prev) =>
      filteredCommands.length > 0 ? (prev + 1) % filteredCommands.length : 0
    );
  }, [filteredCommands.length]);

  const selectPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      filteredCommands.length > 0
        ? (prev - 1 + filteredCommands.length) % filteredCommands.length
        : 0
    );
  }, [filteredCommands.length]);

  const executeSelected = useCallback(() => {
    if (filteredCommands.length > 0 && selectedIndex < filteredCommands.length) {
      filteredCommands[selectedIndex].handler();
      close();
      return true;
    }
    return false;
  }, [filteredCommands, selectedIndex, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    searchQuery,
    setSearchQuery,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    selectNext,
    selectPrev,
    executeSelected,
  };
}
