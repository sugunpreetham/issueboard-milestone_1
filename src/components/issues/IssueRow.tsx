import React from 'react';
import { Issue } from '../../types/issue';
import { StatusBadge, PriorityBadge, LabelTag } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface IssueRowProps {
  issue: Issue;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (issue: Issue) => void;
}

export const IssueRow: React.FC<IssueRowProps> = ({
  issue,
  isSelected,
  onToggleSelect,
  onOpenDetails,
}) => {
  const formattedDate = new Date(issue.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleRowClick = (e: React.MouseEvent) => {
    // Avoid triggering when clicking checkbox or label buttons
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
      // If pressing Enter/Space on row (not directly on input)
      const target = e.target as HTMLElement;
      if (!target.closest('input[type="checkbox"]') && !target.closest('button')) {
        e.preventDefault();
        onOpenDetails(issue);
      }
    }
  };

  return (
    <tr
      className={`issue-row ${isSelected ? 'selected' : ''}`}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
      aria-label={`Issue ${issue.id}: ${issue.title}. Status: ${issue.status}, Priority: ${issue.priority}`}
    >
      <td
        onClick={(e) => e.stopPropagation()}
        style={{ width: '44px', textAlign: 'center' }}
      >
        <input
          type="checkbox"
          className="checkbox-custom"
          checked={isSelected}
          onChange={() => onToggleSelect(issue.id)}
          aria-label={`Select issue ${issue.id}: ${issue.title}`}
        />
      </td>

      <td style={{ width: '100px' }}>
        <span className="issue-id">{issue.id}</span>
      </td>

      <td className="issue-title-cell">
        <div className="issue-title">
          <span>{issue.title}</span>
          {issue.estimate && (
            <span className="estimate-badge" title={`${issue.estimate} story points`}>
              {issue.estimate} pt
            </span>
          )}
        </div>
        <div className="issue-description-snippet">{issue.description}</div>
      </td>

      <td style={{ width: '130px' }}>
        <StatusBadge status={issue.status} />
      </td>

      <td style={{ width: '110px' }}>
        <PriorityBadge priority={issue.priority} />
      </td>

      <td style={{ width: '160px' }}>
        <div className="assignee-cell">
          <Avatar assignee={issue.assignee} size={24} />
          <span>{issue.assignee ? issue.assignee.name : 'Unassigned'}</span>
        </div>
      </td>

      <td style={{ maxWidth: '180px' }}>
        <div className="labels-list">
          {issue.labels.slice(0, 2).map((label) => (
            <LabelTag key={label} label={label} />
          ))}
          {issue.labels.length > 2 && (
            <span className="label-tag" title={issue.labels.slice(2).join(', ')}>
              +{issue.labels.length - 2}
            </span>
          )}
        </div>
      </td>

      <td style={{ width: '110px' }}>
        <time className="date-cell" dateTime={issue.updatedAt} title={new Date(issue.updatedAt).toLocaleString()}>
          {formattedDate}
        </time>
      </td>
    </tr>
  );
};
