import React from 'react';
import { ViewTabType, Issue } from '../../types/issue';
import { CURRENT_USER } from '../../data/mockIssues';

interface ViewTabsProps {
  activeView: ViewTabType;
  onSelectView: (view: ViewTabType) => void;
  allIssues: Issue[];
}

export const ViewTabs: React.FC<ViewTabsProps> = ({
  activeView,
  onSelectView,
  allIssues,
}) => {
  const allCount = allIssues.length;
  const activeCount = allIssues.filter(
    (i) => i.status === 'in_progress' || i.status === 'todo' || i.status === 'in_review'
  ).length;
  const myCount = allIssues.filter((i) => i.assignee?.id === CURRENT_USER.id).length;
  const inReviewCount = allIssues.filter((i) => i.status === 'in_review').length;
  const backlogCount = allIssues.filter((i) => i.status === 'backlog').length;

  const tabs: { id: ViewTabType; label: string; count: number }[] = [
    { id: 'all', label: 'All Issues', count: allCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'assigned_to_me', label: 'Assigned to Me', count: myCount },
    { id: 'in_review', label: 'In Review', count: inReviewCount },
    { id: 'backlog', label: 'Backlog', count: backlogCount },
  ];

  return (
    <nav className="view-tabs" aria-label="Issue views">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`view-tab ${activeView === tab.id ? 'active' : ''}`}
          onClick={() => onSelectView(tab.id)}
          aria-selected={activeView === tab.id}
          role="tab"
        >
          <span>{tab.label}</span>
          <span className="tab-badge" aria-label={`${tab.count} issues`}>
            {tab.count}
          </span>
        </button>
      ))}
    </nav>
  );
};
