import React from 'react';
import { Status, Priority } from '../../types/issue';
import { Icon } from './Icon';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<Status, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
  canceled: 'Canceled',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'done':
        return <Icon name="check" size={12} />;
      case 'in_progress':
        return <Icon name="zap" size={12} />;
      case 'in_review':
        return <Icon name="layers" size={12} />;
      case 'todo':
        return <Icon name="box" size={12} />;
      case 'backlog':
        return <Icon name="clock" size={12} />;
      case 'canceled':
        return <Icon name="x" size={12} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`badge status-badge-${status}`}
      role="status"
      aria-label={`Status: ${STATUS_LABELS[status]}`}
    >
      {getIcon()}
      <span>{STATUS_LABELS[status]}</span>
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showIcon = true }) => {
  const getIcon = () => {
    switch (priority) {
      case 'urgent':
        return <Icon name="alert-triangle" size={12} />;
      case 'high':
        return <Icon name="arrow-up" size={12} />;
      case 'medium':
        return <Icon name="arrow-up-down" size={12} />;
      case 'low':
        return <Icon name="arrow-down" size={12} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`badge priority-badge-${priority}`}
      aria-label={`Priority: ${PRIORITY_LABELS[priority]}`}
    >
      {showIcon && getIcon()}
      <span>{PRIORITY_LABELS[priority]}</span>
    </span>
  );
};

interface LabelTagProps {
  label: string;
  onRemove?: () => void;
}

export const LabelTag: React.FC<LabelTagProps> = ({ label, onRemove }) => {
  return (
    <span className="label-tag">
      <Icon name="tag" size={10} aria-hidden />
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          className="filter-chip-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${label} filter`}
        >
          <Icon name="x" size={10} />
        </button>
      )}
    </span>
  );
};
