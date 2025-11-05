import React from 'react';
import { Issue } from '../../types/issue';
import { Icon } from '../common/Icon';

interface DashboardStatsProps {
  allIssues: Issue[];
  onQuickFilter?: (statusOrPriority: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ allIssues }) => {
  const totalCount = allIssues.length;
  const inProgressCount = allIssues.filter((i) => i.status === 'in_progress').length;
  const inReviewCount = allIssues.filter((i) => i.status === 'in_review').length;
  const urgentCount = allIssues.filter(
    (i) => i.priority === 'urgent' && i.status !== 'done' && i.status !== 'canceled'
  ).length;
  const doneCount = allIssues.filter((i) => i.status === 'done').length;

  return (
    <section className="dashboard-stats" aria-label="Issue board summary statistics">
      <div className="stats-card">
        <div className="stats-icon total" aria-hidden="true">
          <Icon name="layers" size={18} />
        </div>
        <div className="stats-content">
          <span className="stats-label">Total Issues</span>
          <span className="stats-value">{totalCount}</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon in-progress" aria-hidden="true">
          <Icon name="clock" size={18} />
        </div>
        <div className="stats-content">
          <span className="stats-label">In Progress</span>
          <span className="stats-value">{inProgressCount}</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon in-review" aria-hidden="true">
          <Icon name="tag" size={18} />
        </div>
        <div className="stats-content">
          <span className="stats-label">In Review</span>
          <span className="stats-value">{inReviewCount}</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon urgent" aria-hidden="true">
          <Icon name="alert-circle" size={18} />
        </div>
        <div className="stats-content">
          <span className="stats-label">Urgent Issues</span>
          <span className="stats-value">{urgentCount}</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon done" aria-hidden="true">
          <Icon name="check" size={18} />
        </div>
        <div className="stats-content">
          <span className="stats-label">Completed</span>
          <span className="stats-value">{doneCount}</span>
        </div>
      </div>
    </section>
  );
};
