import React, { useRef, useEffect } from 'react';
import { Issue, SortConfig, SortField } from '../../types/issue';
import { IssueRow } from './IssueRow';
import { IssueCard } from './IssueCard';
import { Icon } from '../common/Icon';

interface IssueTableProps {
  issues: Issue[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenDetails: (issue: Issue) => void;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
}

export const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenDetails,
  sortConfig,
  onSort,
}) => {
  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  const visibleCount = issues.length;
  const selectedVisibleCount = issues.filter((i) => selectedIds.has(i.id)).length;
  const isAllSelected = visibleCount > 0 && selectedVisibleCount === visibleCount;
  const isIndeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleCount;

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const renderSortIndicator = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <Icon name="arrow-up-down" size={12} className="sort-indicator" />;
    }
    return sortConfig.direction === 'asc' ? (
      <Icon name="arrow-up" size={12} className="sort-indicator" />
    ) : (
      <Icon name="arrow-down" size={12} className="sort-indicator" />
    );
  };

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortConfig.field !== field) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="table-wrapper">
      {/* Desktop Table View */}
      <table className="issue-table" aria-label="Issue list">
        <thead>
          <tr>
            <th style={{ width: '44px', textAlign: 'center' }}>
              <input
                ref={masterCheckboxRef}
                type="checkbox"
                className="checkbox-custom"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
                aria-checked={isIndeterminate ? 'mixed' : isAllSelected}
                aria-label={
                  isAllSelected
                    ? 'Deselect all visible issues'
                    : 'Select all visible issues'
                }
              />
            </th>

            <th
              className="th-sortable"
              onClick={() => onSort('id')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('id');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('id')}
              style={{ width: '100px' }}
            >
              <div className="th-content">
                <span>ID</span>
                {renderSortIndicator('id')}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSort('title')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('title');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('title')}
            >
              <div className="th-content">
                <span>Title & Summary</span>
                {renderSortIndicator('title')}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSort('status')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('status');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('status')}
              style={{ width: '130px' }}
            >
              <div className="th-content">
                <span>Status</span>
                {renderSortIndicator('status')}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSort('priority')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('priority');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('priority')}
              style={{ width: '110px' }}
            >
              <div className="th-content">
                <span>Priority</span>
                {renderSortIndicator('priority')}
              </div>
            </th>

            <th
              className="th-sortable"
              onClick={() => onSort('assignee')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('assignee');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('assignee')}
              style={{ width: '160px' }}
            >
              <div className="th-content">
                <span>Assignee</span>
                {renderSortIndicator('assignee')}
              </div>
            </th>

            <th style={{ maxWidth: '180px' }}>Labels</th>

            <th
              className="th-sortable"
              onClick={() => onSort('updatedAt')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSort('updatedAt');
                }
              }}
              tabIndex={0}
              role="columnheader"
              aria-sort={getAriaSort('updatedAt')}
              style={{ width: '110px' }}
            >
              <div className="th-content">
                <span>Updated</span>
                {renderSortIndicator('updatedAt')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <IssueRow
              key={issue.id}
              issue={issue}
              isSelected={selectedIds.has(issue.id)}
              onToggleSelect={onToggleSelect}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </tbody>
      </table>

      {/* Mobile Cards View */}
      <div className="mobile-card-list">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            isSelected={selectedIds.has(issue.id)}
            onToggleSelect={onToggleSelect}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};
