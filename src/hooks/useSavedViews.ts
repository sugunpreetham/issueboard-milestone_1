import { useState, useCallback } from 'react';
import { SavedView } from '../types/savedView';
import { FilterState, SortField, SortDirection, ViewMode } from '../types/issue';

export const PRESET_SAVED_VIEWS: SavedView[] = [
  {
    id: 'view-all',
    name: 'All Issues',
    description: 'Every tracked issue across the project',
    icon: 'layers',
    isPreset: true,
    viewMode: 'table',
    filters: {
      searchQuery: '',
      status: 'all',
      priority: 'all',
      assigneeId: 'all',
      label: 'all',
      milestoneId: 'all',
      view: 'all',
    },
    sortField: 'updatedAt',
    sortDirection: 'desc',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'view-my-open',
    name: 'My Open Issues',
    description: 'Unresolved issues assigned to active user',
    icon: 'user',
    isPreset: true,
    viewMode: 'table',
    filters: {
      searchQuery: '',
      status: 'all',
      priority: 'all',
      assigneeId: 'user-1',
      label: 'all',
      milestoneId: 'all',
      view: 'all',
    },
    sortField: 'priority',
    sortDirection: 'desc',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'view-high-bugs',
    name: 'Critical & Urgent Bugs',
    description: 'High and urgent priority defects requiring immediate resolution',
    icon: 'alert-triangle',
    isPreset: true,
    viewMode: 'table',
    filters: {
      searchQuery: '',
      status: 'all',
      priority: 'urgent',
      assigneeId: 'all',
      label: 'all',
      milestoneId: 'all',
      view: 'all',
    },
    sortField: 'updatedAt',
    sortDirection: 'desc',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'view-in-review',
    name: 'Needs Review',
    description: 'Pull requests and code changes currently under review',
    icon: 'check',
    isPreset: true,
    viewMode: 'table',
    filters: {
      searchQuery: '',
      status: 'in_review',
      priority: 'all',
      assigneeId: 'all',
      label: 'all',
      milestoneId: 'all',
      view: 'in_review',
    },
    sortField: 'updatedAt',
    sortDirection: 'desc',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export interface UseSavedViewsResult {
  savedViews: SavedView[];
  activeViewId: string;
  activeView: SavedView;
  applySavedView: (viewId: string) => SavedView | undefined;
  createSavedView: (payload: {
    name: string;
    description?: string;
    icon?: string;
    viewMode: ViewMode;
    filters: FilterState;
    sortField: SortField;
    sortDirection: SortDirection;
  }) => { success: boolean; view?: SavedView; error?: string };
  deleteSavedView: (id: string) => boolean;
}

export function useSavedViews(initialViews: SavedView[] = PRESET_SAVED_VIEWS): UseSavedViewsResult {
  const [savedViews, setSavedViews] = useState<SavedView[]>(initialViews);
  const [activeViewId, setActiveViewId] = useState<string>(initialViews[0]?.id || 'view-all');

  const activeView = savedViews.find((v) => v.id === activeViewId) || savedViews[0];

  const applySavedView = useCallback(
    (viewId: string) => {
      const view = savedViews.find((v) => v.id === viewId);
      if (view) {
        setActiveViewId(view.id);
        return view;
      }
      return undefined;
    },
    [savedViews]
  );

  const createSavedView = useCallback(
    (payload: {
      name: string;
      description?: string;
      icon?: string;
      viewMode: ViewMode;
      filters: FilterState;
      sortField: SortField;
      sortDirection: SortDirection;
    }) => {
      const trimmedName = payload.name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        return { success: false, error: 'View name must be at least 2 characters.' };
      }

      const newView: SavedView = {
        id: `view-${Date.now()}`,
        name: trimmedName,
        description: payload.description || '',
        icon: payload.icon || 'filter',
        isPreset: false,
        viewMode: payload.viewMode,
        filters: { ...payload.filters },
        sortField: payload.sortField,
        sortDirection: payload.sortDirection,
        createdAt: new Date().toISOString(),
      };

      setSavedViews((prev) => [...prev, newView]);
      setActiveViewId(newView.id);
      return { success: true, view: newView };
    },
    []
  );

  const deleteSavedView = useCallback((id: string) => {
    setSavedViews((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target?.isPreset) return prev;
      return prev.filter((v) => v.id !== id);
    });
    return true;
  }, []);

  return {
    savedViews,
    activeViewId,
    activeView,
    applySavedView,
    createSavedView,
    deleteSavedView,
  };
}
