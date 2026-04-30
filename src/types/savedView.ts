import { FilterState, SortField, SortDirection, ViewMode } from './issue';

export interface ViewColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width?: number;
}

export interface SavedView {
  id: string;
  name: string;
  description: string;
  icon?: string;
  isPreset?: boolean;
  viewMode: ViewMode;
  filters: FilterState;
  sortField: SortField;
  sortDirection: SortDirection;
  columns?: ViewColumnConfig[];
  createdAt: string;
}
