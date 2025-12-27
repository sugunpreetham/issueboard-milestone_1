import React from 'react';
import { Issue } from '../../types/issue';
import { StatusBadge, PriorityBadge, LabelTag } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface IssueCardProps {
  issue: Issue;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  isSelected,
  onToggleSelect,
  onOpenDetails,
}) => {
  const formattedDate = new Date(issue.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('button')) {
      return;
    }
    onOpenDetails(issue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'x' || e.key === 'X') {
      const target = e.target as HTMLElement;
      if (!target.closest('input') && !target.closest('textarea')) {
        e.preventDefault();
        onToggleSelect(issue.id);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (!target.closest('input[type="checkbox"]') && !target.closest('button')) {
        e.preventDefault();
        onOpenDetails(issue);
      }
    }
  };

  return (
    <article
      className={`issue-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Issue ${issue.id}: ${issue.title}. Status: ${issue.status}, Priority: ${issue.priority}`}
    >
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <input
            type="checkbox"
            className="checkbox-custom"
            checked={isSelected}
            onChange={() => onToggleSelect(issue.id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select issue ${issue.id}: ${issue.title}`}
          />
          <span className="issue-id">{issue.id}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <PriorityBadge priority={issue.priority} />
          <StatusBadge status={issue.status} />
        </div>
      </div>

      <div className="card-body">
        <h2 className="issue-title" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span>{issue.title}</span>
          {issue.estimate && (
            <span className="estimate-badge" title={`${issue.estimate} story points`}>
              {issue.estimate} pt
            </span>
          )}
        </h2>
        <p className="issue-description-snippet" style={{ WebkitLineClamp: 2 }}>
          {issue.description}
        </p>
      </div>

      <div className="card-footer">
        <div className="assignee-cell">
          <Avatar assignee={issue.assignee} size={22} />
          <span style={{ fontSize: '0.8rem' }}>
            {issue.assignee ? issue.assignee.name : 'Unassigned'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="labels-list">
            {issue.labels.slice(0, 2).map((label) => (
              <LabelTag key={label} label={label} />
            ))}
          </div>
          <time className="date-cell" dateTime={issue.updatedAt}>
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
};
