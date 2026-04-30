import React, { useState } from 'react';
import { FilterState, SortField, SortDirection, ViewMode } from '../../types/issue';
import { Icon } from '../common/Icon';

export interface QueryBuilderModalProps {
  isOpen: boolean;
  currentFilters: FilterState;
  currentSortField: SortField;
  currentSortDirection: SortDirection;
  currentViewMode: ViewMode;
  onClose: () => void;
  onSaveView: (payload: {
    name: string;
    description?: string;
    icon?: string;
    viewMode: ViewMode;
    filters: FilterState;
    sortField: SortField;
    sortDirection: SortDirection;
  }) => { success: boolean; error?: string };
}

export const QueryBuilderModal: React.FC<QueryBuilderModalProps> = ({
  isOpen,
  currentFilters,
  currentSortField,
  currentSortDirection,
  currentViewMode,
  onClose,
  onSaveView,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('filter');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = onSaveView({
      name: name.trim(),
      description: description.trim(),
      icon,
      viewMode: currentViewMode,
      filters: currentFilters,
      sortField: currentSortField,
      sortDirection: currentSortDirection,
    });

    if (!res.success) {
      setError(res.error || 'Failed to save view.');
      return;
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-content query-builder-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="query-builder-title"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <Icon name="filter" size={20} className="modal-icon" />
            <h2 id="query-builder-title">Save Custom View</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close save view dialog"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-grid">
          {error && <div className="error-banner">{error}</div>}

          <p className="modal-subtitle">
            Save the current search query, filter facets, and sorting order as a quick-access preset.
          </p>

          <div className="form-group">
            <label htmlFor="view-name-input">View Name</label>
            <input
              id="view-name-input"
              type="text"
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Unassigned Frontend Tasks"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="view-desc-input">Description (Optional)</label>
            <input
              id="view-desc-input"
              type="text"
              className="text-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this saved view"
            />
          </div>

          <div className="form-group">
            <label htmlFor="view-icon-select">Icon</label>
            <select
              id="view-icon-select"
              className="select-input"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            >
              <option value="filter">Filter</option>
              <option value="layers">Layers</option>
              <option value="user">User</option>
              <option value="alert-triangle">Alert</option>
              <option value="check">Check</option>
              <option value="zap">Zap</option>
            </select>
          </div>

          <div className="view-summary-box">
            <h4>Active Configuration to Save:</h4>
            <ul className="text-xs text-muted">
              <li>Status Filter: <strong>{currentFilters.status}</strong></li>
              <li>Priority Filter: <strong>{currentFilters.priority}</strong></li>
              <li>Assignee Filter: <strong>{currentFilters.assigneeId}</strong></li>
              <li>Search Query: <strong>{currentFilters.searchQuery || '(none)'}</strong></li>
              <li>Sort: <strong>{currentSortField} ({currentSortDirection})</strong></li>
            </ul>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
