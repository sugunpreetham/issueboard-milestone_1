import React, { useMemo } from 'react';
import { Issue, Status } from '../../types/issue';
import { KanbanColumn } from './KanbanColumn';

export interface KanbanBoardProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onStatusChange: (issueId: string, nextStatus: Status) => void;
  wipLimits?: Partial<Record<Status, number>>;
}

const COLUMNS: { status: Status; title: string; defaultWip?: number }[] = [
  { status: 'backlog', title: 'Backlog' },
  { status: 'todo', title: 'To Do', defaultWip: 10 },
  { status: 'in_progress', title: 'In Progress', defaultWip: 5 },
  { status: 'in_review', title: 'In Review', defaultWip: 4 },
  { status: 'done', title: 'Done' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues,
  onSelectIssue,
  onStatusChange,
  wipLimits = {},
}) => {
  const groupedIssues = useMemo(() => {
    const map: Record<Status, Issue[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
      canceled: [],
    };
    for (const issue of issues) {
      if (map[issue.status]) {
        map[issue.status].push(issue);
      }
    }
    return map;
  }, [issues]);

  return (
    <div className="kanban-board-container" role="region" aria-label="Kanban Board View">
      <div className="kanban-board-grid">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            issues={groupedIssues[col.status] || []}
            wipLimit={wipLimits[col.status] ?? col.defaultWip}
            onSelectIssue={onSelectIssue}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};
