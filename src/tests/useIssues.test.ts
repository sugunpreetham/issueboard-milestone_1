import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIssues } from '../hooks/useIssues';
import { ASSIGNEES, INITIAL_ISSUES } from '../data/mockIssues';

describe('useIssues Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with loading state and resolves issues after timer', async () => {
    const { result } = renderHook(() => useIssues());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.issues).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.issues.length).toBeGreaterThanOrEqual(30);
  });

  it('updates a single issue status and creates activity log', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const targetIssue = result.current.issues[0];

    act(() => {
      result.current.updateIssue(targetIssue.id, { status: 'done' });
    });

    const updated = result.current.allIssues.find((i) => i.id === targetIssue.id);
    expect(updated?.status).toBe('done');
    expect(updated?.activities[0].type).toBe('status_change');
  });

  it('performs bulk status changes on selected items', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const id1 = result.current.issues[0].id;
    const id2 = result.current.issues[1].id;

    act(() => {
      result.current.toggleSelect(id1);
      result.current.toggleSelect(id2);
    });

    expect(result.current.selectedIds.size).toBe(2);

    act(() => {
      result.current.bulkUpdateStatus('in_review');
    });

    const issue1 = result.current.allIssues.find((i) => i.id === id1);
    const issue2 = result.current.allIssues.find((i) => i.id === id2);

    expect(issue1?.status).toBe('in_review');
    expect(issue2?.status).toBe('in_review');
  });

  it('performs bulk assignee changes on selected items', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const id1 = result.current.issues[0].id;

    act(() => {
      result.current.toggleSelect(id1);
    });

    act(() => {
      result.current.bulkUpdateAssignee(ASSIGNEES[3]);
    });

    const issue1 = result.current.allIssues.find((i) => i.id === id1);
    expect(issue1?.assignee?.id).toBe(ASSIGNEES[3].id);
  });

  it('toggles select all visible items and clears selection', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current.toggleSelectAll();
    });

    expect(result.current.selectedIds.size).toBe(result.current.issues.length);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedIds.size).toBe(0);
  });

  it('resets filters correctly', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current.setFilter('searchQuery', 'test query');
      result.current.setFilter('status', 'done');
    });

    expect(result.current.filters.searchQuery).toBe('test query');
    expect(result.current.filters.status).toBe('done');

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.searchQuery).toBe('');
    expect(result.current.filters.status).toBe('all');
  });

  it('ignores stale responses from overlapping refreshes and keeps loading state active', async () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const targetId = result.current.issues[0].id;

    // Mutate an issue so we can detect when refresh completes
    act(() => {
      result.current.updateIssue(targetId, { title: 'Locally Modified Issue' });
    });
    const modified = result.current.issues.find((i) => i.id === targetId);
    expect(modified?.title).toBe('Locally Modified Issue');

    // Start Refresh A (scheduled to finish at t=400ms)
    let promiseA!: Promise<void>;
    act(() => {
      promiseA = result.current.refreshIssues();
    });
    expect(result.current.isLoading).toBe(true);

    // Advance 200ms and start Refresh B (scheduled to finish at t=600ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    let promiseB!: Promise<void>;
    act(() => {
      promiseB = result.current.refreshIssues();
    });

    // Advance another 200ms (t=400ms: Refresh A timer triggers, but Refresh B is still pending)
    await act(async () => {
      vi.advanceTimersByTime(200);
      await promiseA;
    });

    // Stale Refresh A must not turn off loading while Refresh B is running
    expect(result.current.isLoading).toBe(true);

    // Advance to t=600ms (Refresh B finishes)
    await act(async () => {
      vi.advanceTimersByTime(200);
      await promiseB;
    });

    // Refresh B successfully completed and updated loading state
    expect(result.current.isLoading).toBe(false);
    const restored = result.current.allIssues.find((i) => i.id === targetId);
    const original = INITIAL_ISSUES.find((i) => i.id === targetId);
    expect(restored?.title).toBe(original?.title);
  });

  it('ignores stale errors from older requests and does not prematurely set loading to false', async () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const targetId = result.current.issues[0].id;

    // Mutate an issue
    act(() => {
      result.current.updateIssue(targetId, { status: 'done' });
    });

    // Start Request A with failure (scheduled to fail at t=400ms)
    let promiseA!: Promise<void>;
    act(() => {
      promiseA = result.current.refreshIssues(true);
    });

    // Advance 200ms and start Request B with success (scheduled to succeed at t=600ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    let promiseB!: Promise<void>;
    act(() => {
      promiseB = result.current.refreshIssues(false);
    });

    // Advance to t=400ms (Request A fails, but is stale)
    await act(async () => {
      vi.advanceTimersByTime(200);
      await promiseA.catch(() => {});
    });

    // Stale error from Request A is ignored: error remains null and loading is still true for Request B
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(true);

    // Advance to t=600ms (Request B finishes successfully)
    await act(async () => {
      vi.advanceTimersByTime(200);
      await promiseB;
    });

    // Request B successfully updated state
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    const restored = result.current.allIssues.find((i) => i.id === targetId);
    const original = INITIAL_ISSUES.find((i) => i.id === targetId);
    expect(restored?.status).toBe(original?.status);
  });

  it('handles triple overlapping refreshes (A, B, C) and ensures only latest request C determines final state', async () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    const targetId = result.current.issues[0].id;

    // Mutate locally
    act(() => {
      result.current.updateIssue(targetId, { title: 'Local Delta Test' });
    });
    expect(result.current.issues.find((i) => i.id === targetId)?.title).toBe('Local Delta Test');

    // Launch A at t=0
    let promiseA!: Promise<void>;
    act(() => {
      promiseA = result.current.refreshIssues();
    });

    // Advance 100ms and launch B at t=100
    act(() => {
      vi.advanceTimersByTime(100);
    });
    let promiseB!: Promise<void>;
    act(() => {
      promiseB = result.current.refreshIssues();
    });

    // Advance 100ms and launch C at t=200
    act(() => {
      vi.advanceTimersByTime(100);
    });
    let promiseC!: Promise<void>;
    act(() => {
      promiseC = result.current.refreshIssues();
    });

    // Advance 200ms (t=400: A finishes, but is stale)
    await act(async () => {
      vi.advanceTimersByTime(200);
      await promiseA;
    });
    expect(result.current.isLoading).toBe(true);

    // Advance 100ms (t=500: B finishes, but is stale)
    await act(async () => {
      vi.advanceTimersByTime(100);
      await promiseB;
    });
    expect(result.current.isLoading).toBe(true);

    // Advance 100ms (t=600: C finishes and is current)
    await act(async () => {
      vi.advanceTimersByTime(100);
      await promiseC;
    });
    expect(result.current.isLoading).toBe(false);
    const expectedTitle = INITIAL_ISSUES.find((i) => i.id === targetId)?.title;
    expect(result.current.allIssues.find((i) => i.id === targetId)?.title).toBe(expectedTitle);
  });

  it('safely handles unmount during pending refresh operations without state corruption', async () => {
    const { result, unmount } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    let pendingPromise!: Promise<void>;
    act(() => {
      pendingPromise = result.current.refreshIssues();
    });

    // Unmount before completion
    unmount();

    // Advance timer to trigger response
    await act(async () => {
      vi.advanceTimersByTime(400);
      await pendingPromise;
    });

    // Test passes without unhandled rejection or unmounted component state updates
  });

  it('filters issues using boolean AST query expression', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current.setFilter('searchQuery', 'priority:urgent AND status:todo');
    });

    expect(result.current.issues.every((i) => i.priority === 'urgent' && i.status === 'todo')).toBe(true);
  });

  it('filters issues using negated field expressions', () => {
    const { result } = renderHook(() => useIssues());

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current.setFilter('searchQuery', '-status:done');
    });

    expect(result.current.issues.every((i) => i.status !== 'done')).toBe(true);
  });
});
