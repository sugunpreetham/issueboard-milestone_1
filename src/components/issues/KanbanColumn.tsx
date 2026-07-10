import React from 'react';
import { Issue, Status } from '../../types/issue';
import { Avatar } from '../common/Avatar';
import { SlaBadge } from './SlaBadge';

export interface KanbanColumnProps {
  status: Status;
  title: string;
  issues: Issue[];
  wipLimit?: number;
  onSelectIssue: (issue: Issue) => void;
  onStatusChange?: (issueId: string, nextStatus: Status) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  issues,
  wipLimit,
  onSelectIssue,
}) => {
  const isOverWip = wipLimit !== undefined && issues.length > wipLimit;

  return (
    <div
      className={`kanban-column kanban-col-${status} ${isOverWip ? 'wip-breached' : ''}`}
      role="region"
      aria-label={`${title} column`}
    >
      <div className="kanban-column-header">
        <div className="kanban-title-group">
          <strong className="kanban-column-title">{title}</strong>
          <span className="kanban-count-badge">{issues.length}</span>
        </div>

        {wipLimit !== undefined && (
          <span
            className={`wip-limit-badge text-xs ${isOverWip ? 'text-danger font-bold' : 'text-muted'}`}
            title={`WIP Limit: ${wipLimit}`}
          >
            Max {wipLimit}
          </span>
        )}
      </div>

      <div className="kanban-card-list" role="list">
        {issues.length === 0 ? (
          <div className="kanban-empty-dropzone text-xs text-muted">No issues in {title}</div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              role="listitem"
              className="kanban-card"
              onClick={() => onSelectIssue(issue)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectIssue(issue);
                }
              }}
            >
              <div className="kanban-card-top">
                <span className="kanban-card-id text-xs">{issue.id}</span>
                <SlaBadge issue={issue} />
              </div>

              <h4 className="kanban-card-title text-sm">{issue.title}</h4>

              <div className="kanban-card-footer">
                <div className="kanban-labels-group">
                  {issue.labels.slice(0, 2).map((l) => (
                    <span key={l} className="badge badge-label text-xs">
                      {l}
                    </span>
                  ))}
                </div>

                <div className="kanban-assignee">
                  {issue.assignee ? (
                    <Avatar assignee={issue.assignee} size="xs" />
                  ) : (
                    <span className="text-xs text-muted">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
