import React from 'react';
import { FilterState, Status, Priority, Issue } from '../../types/issue';
import { ASSIGNEES, AVAILABLE_LABELS } from '../../data/mockIssues';
import { Icon } from '../common/Icon';

interface IssueFiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
  allIssues?: Issue[];
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
  allIssues,
}) => {
  const statusCounts = {
    backlog: allIssues ? allIssues.filter((i) => i.status === 'backlog').length : undefined,
    todo: allIssues ? allIssues.filter((i) => i.status === 'todo').length : undefined,
    in_progress: allIssues ? allIssues.filter((i) => i.status === 'in_progress').length : undefined,
    in_review: allIssues ? allIssues.filter((i) => i.status === 'in_review').length : undefined,
    done: allIssues ? allIssues.filter((i) => i.status === 'done').length : undefined,
    canceled: allIssues ? allIssues.filter((i) => i.status === 'canceled').length : undefined,
  };

  const priorityCounts = {
    urgent: allIssues ? allIssues.filter((i) => i.priority === 'urgent').length : undefined,
    high: allIssues ? allIssues.filter((i) => i.priority === 'high').length : undefined,
    medium: allIssues ? allIssues.filter((i) => i.priority === 'medium').length : undefined,
    low: allIssues ? allIssues.filter((i) => i.priority === 'low').length : undefined,
  };

  const unassignedCount = allIssues ? allIssues.filter((i) => i.assignee === null).length : undefined;

  const getAssigneeCount = (id: string) => {
    return allIssues ? allIssues.filter((i) => i.assignee?.id === id).length : undefined;
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.label !== 'all' ||
    filters.searchQuery.trim().length > 0;

  const activeFilterCount =
    (filters.status !== 'all' ? 1 : 0) +
    (filters.priority !== 'all' ? 1 : 0) +
    (filters.assigneeId !== 'all' ? 1 : 0) +
    (filters.label !== 'all' ? 1 : 0) +
    (filters.searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="filter-bar" role="region" aria-label="Filter issues">
      <div className="filter-group">
        {/* Status Filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="filter-status"
            className={`filter-select ${filters.status !== 'all' ? 'filter-active' : ''}`}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value as Status | 'all')}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses {totalCount > 0 ? `(${totalCount})` : ''}</option>
            <optgroup label="Active Statuses">
              <option value="backlog">Backlog {statusCounts.backlog !== undefined ? `(${statusCounts.backlog})` : ''}</option>
              <option value="todo">Todo {statusCounts.todo !== undefined ? `(${statusCounts.todo})` : ''}</option>
              <option value="in_progress">In Progress {statusCounts.in_progress !== undefined ? `(${statusCounts.in_progress})` : ''}</option>
              <option value="in_review">In Review {statusCounts.in_review !== undefined ? `(${statusCounts.in_review})` : ''}</option>
            </optgroup>
            <optgroup label="Completed / Closed">
              <option value="done">Done {statusCounts.done !== undefined ? `(${statusCounts.done})` : ''}</option>
              <option value="canceled">Canceled {statusCounts.canceled !== undefined ? `(${statusCounts.canceled})` : ''}</option>
            </optgroup>
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="filter-priority" className="sr-only">
            Filter by priority
          </label>
          <select
            id="filter-priority"
            className={`filter-select ${filters.priority !== 'all' ? 'filter-active' : ''}`}
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value as Priority | 'all')}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities {totalCount > 0 ? `(${totalCount})` : ''}</option>
            <option value="urgent">Urgent {priorityCounts.urgent !== undefined ? `(${priorityCounts.urgent})` : ''}</option>
            <option value="high">High {priorityCounts.high !== undefined ? `(${priorityCounts.high})` : ''}</option>
            <option value="medium">Medium {priorityCounts.medium !== undefined ? `(${priorityCounts.medium})` : ''}</option>
            <option value="low">Low {priorityCounts.low !== undefined ? `(${priorityCounts.low})` : ''}</option>
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="filter-assignee" className="sr-only">
            Filter by assignee
          </label>
          <select
            id="filter-assignee"
            className={`filter-select ${filters.assigneeId !== 'all' ? 'filter-active' : ''}`}
            value={filters.assigneeId}
            onChange={(e) => onFilterChange('assigneeId', e.target.value)}
            aria-label="Filter by assignee"
          >
            <option value="all">All Assignees {totalCount > 0 ? `(${totalCount})` : ''}</option>
            <option value="unassigned">Unassigned {unassignedCount !== undefined ? `(${unassignedCount})` : ''}</option>
            {ASSIGNEES.map((assignee) => {
              const count = getAssigneeCount(assignee.id);
              return (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name} {count !== undefined ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {/* Label Filter */}
        <div className="filter-select-wrapper">
          <label htmlFor="filter-label" className="sr-only">
            Filter by label
          </label>
          <select
            id="filter-label"
            className="filter-select"
            value={filters.label}
            onChange={(e) => onFilterChange('label', e.target.value)}
            aria-label="Filter by label"
          >
            <option value="all">All Labels</option>
            {AVAILABLE_LABELS.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onResetFilters}
            aria-label={`Clear all ${activeFilterCount} active filters`}
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      <div
        className="filter-results-count"
        style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
        aria-live="polite"
      >
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> issues
      </div>
    </div>
  );
};
