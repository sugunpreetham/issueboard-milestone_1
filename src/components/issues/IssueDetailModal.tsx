import React, { useState, useEffect } from 'react';
import { Issue, Status, Priority } from '../../types/issue';
import { ASSIGNEES } from '../../data/mockIssues';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { LabelTag } from '../common/Badge';

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateIssue: (
    id: string,
    updates: Partial<Pick<Issue, 'status' | 'priority' | 'assignee' | 'description' | 'title'>>
  ) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onUpdateIssue,
}) => {
  const containerRef = useFocusTrap({ isOpen, onClose });

  const [currentStatus, setCurrentStatus] = useState<Status>('todo');
  const [currentPriority, setCurrentPriority] = useState<Priority>('medium');
  const [currentAssigneeId, setCurrentAssigneeId] = useState<string>('unassigned');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');

  useEffect(() => {
    if (issue) {
      setCurrentStatus(issue.status);
      setCurrentPriority(issue.priority);
      setCurrentAssigneeId(issue.assignee ? issue.assignee.id : 'unassigned');
      setDescriptionText(issue.description);
      setIsEditingDescription(false);
    }
  }, [issue]);

  if (!isOpen || !issue) return null;

  const handleStatusChange = (newStatus: Status) => {
    setCurrentStatus(newStatus);
    onUpdateIssue(issue.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    setCurrentPriority(newPriority);
    onUpdateIssue(issue.id, { priority: newPriority });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    setCurrentAssigneeId(assigneeId);
    if (assigneeId === 'unassigned') {
      onUpdateIssue(issue.id, { assignee: null });
    } else {
      const found = ASSIGNEES.find((a) => a.id === assigneeId) || null;
      onUpdateIssue(issue.id, { assignee: found });
    }
  };

  const handleSaveDescription = () => {
    onUpdateIssue(issue.id, { description: descriptionText });
    setIsEditingDescription(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={containerRef}
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-issue-title"
        aria-describedby="modal-issue-description"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-id-badge">
              <span className="issue-id">{issue.id}</span>
              <span className="date-cell">
                Created on {new Date(issue.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 id="modal-issue-title" className="modal-title">
              {issue.title}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close details dialog"
            title="Close dialog (Escape)"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status, Priority, Assignee Grid */}
          <div className="modal-grid-fields">
            {/* Status Select */}
            <div className="modal-field">
              <label htmlFor="modal-status-select" className="modal-field-label">
                Status
              </label>
              <div className="filter-select-wrapper" style={{ width: '100%' }}>
                <select
                  id="modal-status-select"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as Status)}
                  aria-label="Change issue status"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                  <option value="canceled">Canceled</option>
                </select>
                <div className="filter-select-arrow" aria-hidden="true">
                  <Icon name="chevron-down" size={14} />
                </div>
              </div>
            </div>

            {/* Priority Select */}
            <div className="modal-field">
              <label htmlFor="modal-priority-select" className="modal-field-label">
                Priority
              </label>
              <div className="filter-select-wrapper" style={{ width: '100%' }}>
                <select
                  id="modal-priority-select"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={currentPriority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  aria-label="Change issue priority"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="filter-select-arrow" aria-hidden="true">
                  <Icon name="chevron-down" size={14} />
                </div>
              </div>
            </div>

            {/* Assignee Select */}
            <div className="modal-field">
              <label htmlFor="modal-assignee-select" className="modal-field-label">
                Assignee
              </label>
              <div className="filter-select-wrapper" style={{ width: '100%' }}>
                <select
                  id="modal-assignee-select"
                  className="filter-select"
                  style={{ width: '100%' }}
                  value={currentAssigneeId}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  aria-label="Change issue assignee"
                >
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
            </div>
          </div>

          {/* Labels */}
          <div>
            <span className="modal-field-label">Labels</span>
            <div className="labels-list" style={{ marginTop: '0.35rem' }}>
              {issue.labels.map((label) => (
                <LabelTag key={label} label={label} />
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <h3 className="modal-section-title" style={{ margin: 0 }}>
                Description
              </h3>
              {!isEditingDescription ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingDescription(true)}
                  aria-label="Edit issue description"
                >
                  Edit description
                </Button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDescriptionText(issue.description);
                      setIsEditingDescription(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveDescription}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            {!isEditingDescription ? (
              <div id="modal-issue-description" className="modal-description-box">
                {issue.description}
              </div>
            ) : (
              <textarea
                className="modal-description-box"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                aria-label="Edit description text"
              />
            )}
          </div>

          {/* Activity Timeline */}
          <div>
            <h3 className="modal-section-title">Activity History</h3>
            <div className="modal-activity-list">
              {issue.activities.map((act) => (
                <div key={act.id} className="modal-activity-item">
                  <div className="modal-activity-dot" aria-hidden="true" />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>{act.author}</strong>{' '}
                    <span>{act.details}</span>{' '}
                    <span className="date-cell">
                      • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
