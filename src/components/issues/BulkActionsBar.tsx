import React from 'react';
import { Status, Priority, Assignee } from '../../types/issue';
import { ASSIGNEES } from '../../data/mockIssues';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdateStatus: (status: Status) => void;
  onBulkUpdateAssignee: (assignee: Assignee | null) => void;
  onBulkUpdatePriority?: (priority: Priority) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkUpdateStatus,
  onBulkUpdateAssignee,
  onBulkUpdatePriority,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div
      className="bulk-toolbar"
      role="region"
      aria-label="Bulk actions for selected issues"
    >
      <div className="bulk-info">
        <span className="selected-count-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Icon name="check" size={16} />
          <span>{selectedCount} {selectedCount === 1 ? 'issue' : 'issues'} selected</span>
        </span>
      </div>

      <div className="bulk-actions-group">
        {/* Bulk Status Select */}
        <div className="filter-select-wrapper">
          <label htmlFor="bulk-status-select" className="sr-only">
            Change status for selected issues
          </label>
          <select
            id="bulk-status-select"
            className="filter-select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkUpdateStatus(e.target.value as Status);
                e.target.value = '';
              }
            }}
            aria-label="Change status for selected issues"
          >
            <option value="" disabled>
              Set Status...
            </option>
            <option value="backlog">Move to Backlog</option>
            <option value="todo">Move to Todo</option>
            <option value="in_progress">Move to In Progress</option>
            <option value="in_review">Move to In Review</option>
            <option value="done">Mark as Done</option>
            <option value="canceled">Mark as Canceled</option>
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {/* Bulk Priority Select */}
        {onBulkUpdatePriority && (
          <div className="filter-select-wrapper">
            <label htmlFor="bulk-priority-select" className="sr-only">
              Change priority for selected issues
            </label>
            <select
              id="bulk-priority-select"
              className="filter-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onBulkUpdatePriority(e.target.value as Priority);
                  e.target.value = '';
                }
              }}
              aria-label="Change priority for selected issues"
            >
              <option value="" disabled>
                Set Priority...
              </option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="filter-select-arrow" aria-hidden="true">
              <Icon name="chevron-down" size={14} />
            </div>
          </div>
        )}

        {/* Bulk Assignee Select */}
        <div className="filter-select-wrapper">
          <label htmlFor="bulk-assignee-select" className="sr-only">
            Assign selected issues
          </label>
          <select
            id="bulk-assignee-select"
            className="filter-select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value === 'unassigned') {
                onBulkUpdateAssignee(null);
                e.target.value = '';
              } else if (e.target.value) {
                const assignee = ASSIGNEES.find((a) => a.id === e.target.value) || null;
                onBulkUpdateAssignee(assignee);
                e.target.value = '';
              }
            }}
            aria-label="Assign selected issues to team member"
          >
            <option value="" disabled>
              Assign To...
            </option>
            <option value="unassigned">Unassigned</option>
            {ASSIGNEES.map((assignee) => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
          <div className="filter-select-arrow" aria-hidden="true">
            <Icon name="chevron-down" size={14} />
          </div>
        </div>

        {/* Clear Selection Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          aria-label="Deselect all selected issues"
        >
          <Icon name="x" size={14} />
          <span>Deselect</span>
        </Button>
      </div>
    </div>
  );
};
