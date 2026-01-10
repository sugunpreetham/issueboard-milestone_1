import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Issue,
  FilterState,
  SortConfig,
  SortField,
  Status,
  Priority,
  Assignee,
  ViewTabType,
} from '../types/issue';
import { INITIAL_ISSUES, CURRENT_USER } from '../data/mockIssues';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const STATUS_WEIGHTS: Record<Status, number> = {
  backlog: 1,
  todo: 2,
  in_progress: 3,
  in_review: 4,
  done: 5,
  canceled: 6,
};

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  label: 'all',
  view: 'all',
};

const DEFAULT_SORT: SortConfig = {
  field: 'updatedAt',
  direction: 'desc',
};

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortConfig, setSortConfig] = useState<SortConfig>(DEFAULT_SORT);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Simulate initial async fetch with cancellation safety
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (isMounted) {
        setIssues(INITIAL_ISSUES);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Filter handler
  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const setView = useCallback((view: ViewTabType) => {
    setFilters((prev) => ({ ...prev, view }));
  }, []);

  // Sort handler
  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        field,
        direction: field === 'updatedAt' || field === 'priority' ? 'desc' : 'asc',
      };
    });
  }, []);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Derived filtered & sorted list
  const filteredAndSortedIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        // 1. View tab filtering
        if (filters.view === 'active') {
          if (
            issue.status !== 'in_progress' &&
            issue.status !== 'todo' &&
            issue.status !== 'in_review'
          ) {
            return false;
          }
        } else if (filters.view === 'assigned_to_me') {
          if (issue.assignee?.id !== CURRENT_USER.id) {
            return false;
          }
        } else if (filters.view === 'in_review') {
          if (issue.status !== 'in_review') {
            return false;
          }
        } else if (filters.view === 'backlog') {
          if (issue.status !== 'backlog') {
            return false;
          }
        }

        // 2. Multi-token search query matching ID, title, description, labels, or assignee
        if (filters.searchQuery.trim()) {
          const queryTokens = filters.searchQuery.toLowerCase().trim().split(/\s+/);
          const searchableText = [
            issue.id,
            issue.title,
            issue.description,
            ...issue.labels,
            issue.assignee?.name || '',
          ]
            .join(' ')
            .toLowerCase();

          const matchesAllTokens = queryTokens.every((token) =>
            searchableText.includes(token)
          );
          if (!matchesAllTokens) {
            return false;
          }
        }

        // 3. Status filter
        if (filters.status !== 'all' && issue.status !== filters.status) {
          return false;
        }

        // 4. Priority filter
        if (filters.priority !== 'all' && issue.priority !== filters.priority) {
          return false;
        }

        // 5. Assignee filter
        if (filters.assigneeId !== 'all') {
          if (filters.assigneeId === 'unassigned') {
            if (issue.assignee !== null) return false;
          } else {
            if (issue.assignee?.id !== filters.assigneeId) return false;
          }
        }

        // 6. Label filter
        if (filters.label !== 'all' && !issue.labels.includes(filters.label)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const { field, direction } = sortConfig;
        let comparison = 0;

        if (field === 'priority') {
          comparison = PRIORITY_WEIGHTS[b.priority] - PRIORITY_WEIGHTS[a.priority];
        } else if (field === 'status') {
          comparison = STATUS_WEIGHTS[a.status] - STATUS_WEIGHTS[b.status];
        } else if (field === 'updatedAt') {
          comparison =
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (field === 'id') {
          comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
        } else if (field === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (field === 'assignee') {
          const nameA = a.assignee?.name || 'zzzz';
          const nameB = b.assignee?.name || 'zzzz';
          comparison = nameA.localeCompare(nameB);
        }

        return direction === 'asc' ? comparison : -comparison;
      });
  }, [issues, filters, sortConfig]);

  // Select all visible toggle
  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const visibleIds = filteredAndSortedIssues.map((i) => i.id);
      const allSelected =
        visibleIds.length > 0 && visibleIds.every((id) => prev.has(id));

      const next = new Set(prev);
      if (allSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [filteredAndSortedIssues]);

  const latestRequestIdRef = useRef<number>(0);

  // Asynchronous refresh with stale response race condition handling
  const refreshIssues = useCallback((shouldFail = false) => {
    const currentRequestId = ++latestRequestIdRef.current;
    setIsLoading(true);
    setError(null);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // If a newer refresh request was started, ignore this stale response
        if (currentRequestId !== latestRequestIdRef.current) {
          resolve();
          return;
        }

        if (shouldFail) {
          setError('Failed to fetch latest issues from remote server. Please try again.');
          setIsLoading(false);
          reject(new Error('Network error'));
        } else {
          setIssues(INITIAL_ISSUES);
          setIsLoading(false);
          resolve();
        }
      }, 400);
    });
  }, []);

  // Update single issue
  const updateIssue = useCallback(
    (
      id: string,
      updates: Partial<Pick<Issue, 'status' | 'priority' | 'assignee' | 'description' | 'title'>>
    ) => {
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== id) return issue;

          const now = new Date().toISOString();
          const newActivities = [...issue.activities];

          if (updates.status && updates.status !== issue.status) {
            newActivities.unshift({
              id: `act-${Date.now()}-status`,
              type: 'status_change',
              author: CURRENT_USER.name,
              timestamp: now,
              details: `Changed status to ${updates.status.replace('_', ' ')}`,
            });
          }

          if (updates.priority && updates.priority !== issue.priority) {
            newActivities.unshift({
              id: `act-${Date.now()}-priority`,
              type: 'priority_change',
              author: CURRENT_USER.name,
              timestamp: now,
              details: `Changed priority to ${updates.priority}`,
            });
          }

          if (updates.assignee !== undefined && updates.assignee?.id !== issue.assignee?.id) {
            newActivities.unshift({
              id: `act-${Date.now()}-assignee`,
              type: 'assignee_change',
              author: CURRENT_USER.name,
              timestamp: now,
              details: updates.assignee
                ? `Assigned to ${updates.assignee.name}`
                : 'Unassigned issue',
            });
          }

          return {
            ...issue,
            ...updates,
            updatedAt: now,
            activities: newActivities,
          };
        })
      );
    },
    []
  );

  // Bulk status update
  const bulkUpdateStatus = useCallback(
    (newStatus: Status) => {
      if (selectedIds.size === 0) return;

      const now = new Date().toISOString();
      setIssues((prev) =>
        prev.map((issue) => {
          if (!selectedIds.has(issue.id)) return issue;

          return {
            ...issue,
            status: newStatus,
            updatedAt: now,
            activities: [
              {
                id: `act-${Date.now()}-${issue.id}`,
                type: 'status_change',
                author: CURRENT_USER.name,
                timestamp: now,
                details: `Batch updated status to ${newStatus.replace('_', ' ')}`,
              },
              ...issue.activities,
            ],
          };
        })
      );
    },
    [selectedIds]
  );

  // Bulk assignee update
  const bulkUpdateAssignee = useCallback(
    (newAssignee: Assignee | null) => {
      if (selectedIds.size === 0) return;

      const now = new Date().toISOString();
      setIssues((prev) =>
        prev.map((issue) => {
          if (!selectedIds.has(issue.id)) return issue;

          return {
            ...issue,
            assignee: newAssignee,
            updatedAt: now,
            activities: [
              {
                id: `act-${Date.now()}-${issue.id}`,
                type: 'assignee_change',
                author: CURRENT_USER.name,
                timestamp: now,
                details: newAssignee
                  ? `Batch assigned to ${newAssignee.name}`
                  : 'Batch unassigned',
              },
              ...issue.activities,
            ],
          };
        })
      );
    },
    [selectedIds]
  );

  // Bulk priority update
  const bulkUpdatePriority = useCallback(
    (newPriority: Priority) => {
      if (selectedIds.size === 0) return;

      const now = new Date().toISOString();
      setIssues((prev) =>
        prev.map((issue) => {
          if (!selectedIds.has(issue.id)) return issue;

          return {
            ...issue,
            priority: newPriority,
            updatedAt: now,
            activities: [
              {
                id: `act-${Date.now()}-${issue.id}-priority`,
                type: 'priority_change',
                author: CURRENT_USER.name,
                timestamp: now,
                details: `Batch updated priority to ${newPriority}`,
              },
              ...issue.activities,
            ],
          };
        })
      );
    },
    [selectedIds]
  );

  return {
    allIssues: issues,
    issues: filteredAndSortedIssues,
    isLoading,
    error,
    filters,
    sortConfig,
    selectedIds,
    setFilter,
    resetFilters,
    setView,
    handleSort,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    refreshIssues,
    updateIssue,
    bulkUpdateStatus,
    bulkUpdateAssignee,
    bulkUpdatePriority,
  };
}
