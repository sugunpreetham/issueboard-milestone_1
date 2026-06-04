import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { CommandItem } from '../types/commandPalette';

describe('useCommandPalette Hook', () => {
  const handlerMock = vi.fn();
  const sampleCommands: CommandItem[] = [
    {
      id: 'cmd-theme',
      title: 'Toggle Dark Mode',
      category: 'theme',
      shortcut: 't',
      handler: handlerMock,
    },
    {
      id: 'cmd-filter-urgent',
      title: 'Filter Urgent Issues',
      category: 'filters',
      handler: vi.fn(),
    },
    {
      id: 'cmd-view-board',
      title: 'Switch to Board View',
      category: 'views',
      handler: vi.fn(),
    },
  ];

  it('initializes closed and toggles open/close state', () => {
    const { result } = renderHook(() => useCommandPalette({ commands: sampleCommands }));
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('filters commands by query string', () => {
    const { result } = renderHook(() => useCommandPalette({ commands: sampleCommands }));

    act(() => {
      result.current.setSearchQuery('dark');
    });

    expect(result.current.filteredCommands).toHaveLength(1);
    expect(result.current.filteredCommands[0].id).toBe('cmd-theme');
  });

  it('navigates next and previous items with circular wrapping', () => {
    const { result } = renderHook(() => useCommandPalette({ commands: sampleCommands }));

    act(() => {
      result.current.selectNext();
    });
    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      result.current.selectPrev();
    });
    expect(result.current.selectedIndex).toBe(0);
  });

  it('executes selected command handler and closes modal', () => {
    const { result } = renderHook(() => useCommandPalette({ commands: sampleCommands }));

    act(() => {
      result.current.open();
    });

    let executed = false;
    act(() => {
      executed = result.current.executeSelected();
    });

    expect(executed).toBe(true);
    expect(handlerMock).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
  });
});
